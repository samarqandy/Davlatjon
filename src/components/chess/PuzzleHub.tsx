"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, cn, ProgressBar } from "@/components/ui";
import {
  PUZZLES,
  PUZZLE_THEMES,
  dailyPuzzleFor,
  getPuzzle,
  puzzlesByTheme,
  type ChessPuzzle,
  type PuzzleTheme,
} from "@/content/chess/puzzles";
import { useAgeProfile } from "@/lib/age";
import { useT } from "@/lib/i18n";
import { plural, pluralize, thousands } from "@/lib/plural";
import { BANK, bankCount, ladderOrder, prefetchBank, useBank } from "@/lib/puzzleBank";
import { targetRating } from "@/lib/puzzleRating";
import { PUZZLE_TOTAL, accuracy, solvedCount, strongWeak, themeStats } from "@/lib/puzzleStats";
import { random } from "@/lib/random";
import { chessStreakReached, duePuzzles, getState, useHydrated, usePuzzleRating, useStore } from "@/lib/store";
import { useChess } from "@/lib/useChess";
import { replaceHash, setHash, useHash } from "@/lib/useHash";
import { useToday } from "@/lib/useToday";
import { ChessBoard } from "./ChessBoard";
import { OwnPuzzlesView, ownPuzzles } from "./OwnPuzzles";
import {
  BankRun,
  LevelChooser,
  Loading,
  PracticeView,
  PuzzleLevel,
  WoodpeckerView,
  useThemeName,
} from "./PuzzleBankViews";
import { RepeatView, StormView } from "./PuzzleModes";
import { PuzzlePlayer, puzzleKey, type AnyPuzzle } from "./PuzzleTrainer";

const STARS = (n: number) => "⭐".repeat(n);

export function PuzzleHub() {
  const hash = useHash();
  const t = useT();
  const { puzzles, themes } = useChess();
  const profile = useAgeProfile();
  const hydrated = useHydrated();
  const progress = useStore((s) => s.chessPuzzles);
  const streakBest = useStore((s) => s.chessStreak);
  const games = useStore((s) => s.chessGames);
  const ownSolved = useStore((s) => s.chessOwnPuzzles);
  const woodpecker = useStore((s) => s.chessWoodpecker);
  const own = hydrated ? ownPuzzles(games) : [];
  const today = useToday();
  const dueCount = hydrated && today ? duePuzzles(progress, today).length : 0;
  const stormBest = useStore((s) => s.chessDrills.storm ?? 0);
  const solved = hydrated ? solvedCount(progress) : 0;
  const stats = themeStats(hydrated ? progress : {});
  const { strong, weak } = strongWeak(stats);
  const themeName = useThemeName();

  // Остальные темы — в офлайн-кэш, когда страница уже открылась.
  useEffect(() => {
    const id = setTimeout(() => void prefetchBank(), 3000);
    return () => clearTimeout(id);
  }, []);

  if (hash === "#daily") return <DailyView />;
  if (hash === "#streak") return <StreakView />;
  if (hash === "#mine") return <OwnPuzzlesView />;
  if (hash === "#storm") return <StormView />;
  if (hash === "#repeat") return <RepeatView />;
  if (hash === "#practice") return <PracticeView />;
  if (hash === "#woodpecker") return <WoodpeckerView />;
  const themeMatch = hash.match(/^#theme-([a-z0-9]+)(?:-(\d+|bank))?$/);
  if (themeMatch) {
    const theme = PUZZLE_THEMES.find((x) => x.id === themeMatch[1]);
    const part = themeMatch[2];
    if (theme)
      return <ThemeView key={theme.id} theme={theme.id} part={part === "bank" ? "bank" : part ? Number(part) : null} />;
  }
  const puzzleMatch = hash.match(/^#puzzle-(.+)$/);
  if (puzzleMatch) {
    const puzzle = getPuzzle(puzzleMatch[1]);
    if (puzzle) return <SingleView puzzle={puzzle} />;
  }

  const dailyRu = dailyPuzzleFor(profile.minStars);
  const daily = puzzles.find((p) => p.id === dailyRu.id) ?? dailyRu;
  const woodpeckerRound = woodpecker ? Math.min(woodpecker.rounds.length + 1, 3) : 0;

  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← {t("Шахматная школа", "Shaxmat maktabi")}
      </Link>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{t("Задачи", "Masalalar")}</p>
          <h1 className="text-3xl font-black">{t("Тренажёр тактики", "Taktika trenajyori")}</h1>
          <p className="mt-1 max-w-2xl text-muted">
            {t(
              `${thousands(PUZZLE_TOTAL)} ${plural(PUZZLE_TOTAL, "задача", "задачи", "задач")}: ${pluralize(PUZZLES.length, "задача", "задачи", "задач")} школы с объяснениями и ${thousands(BANK.total)} ${plural(BANK.total, "задача", "задачи", "задач")} из открытой базы Lichess — от мата в один ход до комбинаций в три хода. Задачи подбираются по силам.`,
              `${thousands(PUZZLE_TOTAL)} ta masala: izohli ${PUZZLES.length} ta maktab masalasi va Lichess ochiq bazasidan ${thousands(BANK.total)} ta masala — bir yurishda motdan tortib uch yurishli kombinatsiyalargacha. Masalalar kuchingga qarab tanlanadi.`,
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Stat value={solved} label={t("решено", "yechildi")} />
          <Stat value={streakBest} label={t("лучшая серия", "ketma-ket rekord")} />
        </div>
      </header>

      <section
        className="grid gap-4 rounded-3xl bg-linear-to-br from-[#4f46e5] to-[#7c3aed] p-5 text-white shadow-lift md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        aria-labelledby="my-level"
      >
        <div className="space-y-3">
          <h2 id="my-level" className="text-xl font-black">
            🧠 {t("Мой уровень", "Mening darajam")}: <PuzzleLevel />
          </h2>
          <p className="text-sm text-white/85">
            {t(
              "Решаешь с первой попытки — задачи становятся труднее, ошибаешься или берёшь подсказку — полегче.",
              "Birinchi urinishda yechsang — masalalar qiyinlashadi, xato qilsang yoki maslahat olsang — osonlashadi.",
            )}
          </p>
          <div className="rounded-2xl bg-white/10 p-2">
            <LevelChooser />
          </div>
          <Button variant="sun" size="lg" onClick={() => setHash("#practice")}>
            ▶ {t("Решать задачи по силам", "Kuchimga mos masalalarni yechish")}
          </Button>
        </div>
        <div className="space-y-3 rounded-2xl bg-white/10 p-4" data-theme-dashboard>
          {strong.length || weak.length ? (
            <>
              {strong.length > 0 && (
                <ThemeChips
                  title={t("💪 Получается лучше всего", "💪 Eng yaxshi chiqayotgan mavzular")}
                  items={strong.map((s) => ({ id: s.theme, label: themeName(s.theme), pct: accuracy(s) }))}
                />
              )}
              {weak.length > 0 && (
                <ThemeChips
                  title={t("🎯 Над чем поработать", "🎯 Ustida ishlash kerak")}
                  items={weak.map((s) => ({ id: s.theme, label: themeName(s.theme), pct: accuracy(s) }))}
                />
              )}
            </>
          ) : (
            <p className="text-sm text-white/85">
              {t(
                "Реши по пять задач в разных темах — и здесь появятся твои сильные темы и те, над которыми стоит поработать.",
                "Turli mavzulardan beshtadan masala yech — shu yerda kuchli mavzularing va ustida ishlash kerak boʻlganlari paydo boʻladi.",
              )}
            </p>
          )}
          {dueCount > 0 && (
            <Button variant="secondary" size="sm" onClick={() => setHash("#repeat")}>
              🔁 {t(`Исправить ошибки (${dueCount})`, `Xatolarni tuzatish (${dueCount})`)}
            </Button>
          )}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-card" aria-labelledby="daily">
          <div>
            <h2 id="daily" className="text-xl font-black">
              📅 {t("Задача дня", "Kun masalasi")}
            </h2>
            <p className="text-sm text-muted">
              {STARS(daily.stars)} · {daily.title}
              {hydrated && progress[daily.id]?.solvedAt ? t(" · ✅ решена", " · ✅ yechilgan") : ""}
            </p>
          </div>
          <ChessBoard
            id="daily-preview"
            position={daily.fen}
            orientation={daily.fen.split(" ")[1] === "w" ? "white" : "black"}
            maxWidth={260}
            className="!mx-0"
          />
          <Button onClick={() => setHash("#daily")}>{t("Решать задачу дня", "Kun masalasini yechish")}</Button>
        </section>

        <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-card" aria-labelledby="streak">
          <div>
            <h2 id="streak" className="text-xl font-black">
              🔥 {t("Серия", "Ketma-ket")}
            </h2>
            <p className="text-sm text-muted">
              {t(
                "Задачи идут одна за другой, каждая чуть труднее. Три ошибки — и серия заканчивается. Сколько решишь подряд?",
                "Masalalar birin-ketin keladi, har biri avvalgisidan sal qiyinroq. Uch marta xato qilsang — oʻyin tugaydi. Ketma-ket nechta masala yecha olasan?",
              )}
            </p>
          </div>
          <p className="text-lg font-black">
            {t("Лучшая серия", "Rekord")}: {hydrated ? streakBest : 0}
          </p>
          <Button variant="sun" onClick={() => setHash("#streak")} className="mt-auto">
            {t("Начать серию", "Boshlash")}
          </Button>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="flex flex-col gap-2 rounded-3xl bg-white p-5 shadow-card" aria-labelledby="storm">
          <h2 id="storm" className="text-xl font-black">
            ⚡ {t("Шторм", "Boʻron")}
          </h2>
          <p className="text-sm text-muted">
            {t(
              `Три минуты — сколько задач успеешь? Ошибка отнимает 10 секунд. Рекорд: ${hydrated ? stormBest : 0}.`,
              `Uch daqiqa — nechta masala yechishga ulgurasan? Har bir xato 10 soniyani olib qoʻyadi. Rekord: ${hydrated ? stormBest : 0}.`,
            )}
          </p>
          <Button className="mt-auto" onClick={() => setHash("#storm")}>
            {t("Начать шторм", "Boʻronni boshlash")}
          </Button>
        </section>
        <section className="flex flex-col gap-2 rounded-3xl bg-white p-5 shadow-card" aria-labelledby="woodpecker">
          <h2 id="woodpecker" className="text-xl font-black">
            🐦 {t("Дятел", "Qizilishton")}
          </h2>
          <p className="text-sm text-muted">
            {t(
              "20 задач твоего уровня — три круга подряд. С каждым кругом решай быстрее: так приёмы запоминаются надолго.",
              "Darajangga mos 20 ta masala — ketma-ket uch aylana. Har aylanada tezroq yech: shunda usullar uzoq esda qoladi.",
            )}
          </p>
          <Button variant="secondary" className="mt-auto" onClick={() => setHash("#woodpecker")}>
            {hydrated && woodpecker && woodpecker.rounds.length < 3
              ? t(`Продолжить: круг ${woodpeckerRound}`, `Davom etish: ${woodpeckerRound}-aylana`)
              : t("Начать", "Boshlash")}
          </Button>
        </section>
        <section className="flex flex-col gap-2 rounded-3xl bg-white p-5 shadow-card" aria-labelledby="repeat">
          <h2 id="repeat" className="text-xl font-black">
            🔁 {t("Повторение", "Takrorlash")}{" "}
            {dueCount > 0 && <span className="rounded-full bg-rose px-2 py-0.5 text-sm text-white">{dueCount}</span>}
          </h2>
          <p className="text-sm text-muted">
            {t(
              "Задачи с ошибками возвращаются через 1, 3, 7 и 21 день — пока не будут решены без ошибки.",
              "Xato qilingan masalalar 1, 3, 7 va 21 kundan keyin qaytib keladi — toki xatosiz yechilmaguncha.",
            )}
          </p>
          <Button variant="secondary" className="mt-auto" onClick={() => setHash("#repeat")}>
            {dueCount ? t(`Повторить (${dueCount})`, `Takrorlash (${dueCount})`) : t("Открыть", "Ochish")}
          </Button>
        </section>
      </div>

      <section
        className="flex flex-wrap items-center gap-4 rounded-3xl border-2 border-sun/50 bg-sun-soft/60 p-5"
        aria-labelledby="mine"
      >
        <div className="min-w-0 flex-1">
          <h2 id="mine" className="text-xl font-black">
            🧩 {t("Задачи из твоих партий", "Oʻz partiyalaringdan masalalar")}
          </h2>
          <p className="text-sm text-[#7a4b00]">
            {own.length
              ? t(
                  `Робот-тренер нашёл в твоих партиях ${pluralize(own.length, "момент", "момента", "моментов")}, где был ход сильнее. Решено: ${own.filter((p) => ownSolved[p.key]).length}.`,
                  `Robot-murabbiy partiyalaringda ${own.length} ta lahza topdi — ularda kuchliroq yurish bor edi. Yechilgan: ${own.filter((p) => ownSolved[p.key]).length}.`,
                )
              : t(
                  "Сыграй с роботом и открой разбор партии — твои ошибки станут задачами. Такого нет ни в одном задачнике!",
                  "Robot bilan oʻyna va partiya tahlilini och — xatolaring masalaga aylanadi. Bunaqasi hech bir masalalar kitobida yoʻq!",
                )}
          </p>
        </div>
        <Button variant="sun" onClick={() => setHash("#mine")}>
          {own.length ? t("Решать", "Yechish") : t("Как это работает", "Bu qanday ishlaydi")}
        </Button>
      </section>

      <section aria-labelledby="themes">
        <h2 id="themes" className="mb-3 text-2xl font-black">
          {t("По темам", "Mavzular boʻyicha")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => {
            const total = puzzlesByTheme(theme.id).length + bankCount(theme.id);
            const s = stats.get(theme.id);
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setHash(`#theme-${theme.id}`)}
                className="flex flex-col rounded-3xl bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-3xl" aria-hidden>
                    {theme.emoji}
                  </span>
                  <div>
                    <p className="text-lg font-black">{theme.name}</p>
                    <p className="text-xs font-bold text-muted">
                      {t(pluralize(total, "задача", "задачи", "задач"), `${total} ta masala`)}
                      {s
                        ? t(
                            ` · с первой попытки ${Math.round(accuracy(s) * 100)}%`,
                            ` · birinchi urinishda ${Math.round(accuracy(s) * 100)}%`,
                          )
                        : ""}
                    </p>
                  </div>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted">{theme.about}</p>
                <div className="mt-3 flex items-center gap-2">
                  <ProgressBar value={s?.solved ?? 0} max={total} className="flex-1" />
                  <span className="text-xs font-extrabold text-muted">
                    {t(`решено ${s?.solved ?? 0}`, `${s?.solved ?? 0} ta yechildi`)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <p className="text-center text-xs text-muted">
        {t(
          "Задачи «из базы» взяты из открытой базы задач Lichess (database.lichess.org, лицензия CC0). Спасибо всем, кто их решал и оценивал!",
          "«Bazadan» belgisi bor masalalar Lichess ochiq masalalar bazasidan olingan (database.lichess.org, CC0 litsenziyasi). Ularni yechgan va baholagan hammaga rahmat!",
        )}
      </p>
    </div>
  );
}

function ThemeChips({ title, items }: { title: string; items: { id: PuzzleTheme; label: string; pct: number }[] }) {
  return (
    <div>
      <p className="text-sm font-extrabold">{title}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setHash(`#theme-${x.id}`)}
            className="rounded-xl bg-white px-3 py-1.5 text-sm font-black text-ink transition hover:bg-brand-soft"
          >
            {x.label} · {Math.round(x.pct * 100)}%
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-2 text-center shadow-card">
      <p className="tabular text-2xl font-black">{value}</p>
      <p className="text-xs font-bold text-muted">{label}</p>
    </div>
  );
}

function Back({ label }: { label?: string }) {
  const t = useT();
  return (
    <button type="button" onClick={() => setHash("#all")} className="text-sm font-extrabold text-brand hover:underline">
      {label ?? t("← Все задачи", "← Barcha masalalar")}
    </button>
  );
}

function DailyView() {
  const t = useT();
  const profile = useAgeProfile();
  const puzzle = dailyPuzzleFor(profile.minStars);
  return (
    <div className="space-y-4">
      <Back />
      <h1 className="text-2xl font-black">📅 {t("Задача дня", "Kun masalasi")}</h1>
      <PuzzlePlayer
        key={puzzle.id}
        puzzle={puzzle}
        next={{ label: t("К другим задачам →", "Boshqa masalalarga →"), onClick: () => setHash("#all") }}
      />
    </div>
  );
}

function SingleView({ puzzle }: { puzzle: ChessPuzzle }) {
  const t = useT();
  return (
    <div className="space-y-4">
      <Back />
      <PuzzlePlayer
        key={puzzle.id}
        puzzle={puzzle}
        next={{ label: t("К другим задачам →", "Boshqa masalalarga →"), onClick: () => setHash("#all") }}
      />
    </div>
  );
}

/**
 * Тема: сначала задачи школы (с объяснениями), потом — задачи из базы по силам.
 * part — номер задачи школы, "bank" — задачи из базы; без него выбираем сами: первая нерешённая задача школы
 * или база, — и переписываем адрес, чтобы выбор не менялся, пока ребёнок решает.
 */
function ThemeView({ theme, part }: { theme: PuzzleTheme; part: number | "bank" | null }) {
  const t = useT();
  const { themes } = useChess();
  const hydrated = useHydrated();
  const info = themes.find((x) => x.id === theme)!;
  const list = useMemo(() => puzzlesByTheme(theme), [theme]);
  const progress = useStore((s) => s.chessPuzzles);
  const stat = themeStats(hydrated ? progress : {}).get(theme);
  const hasBank = bankCount(theme) > 0;

  useEffect(() => {
    if (part !== null || !hydrated) return;
    const solved = getState().chessPuzzles;
    const open = list.findIndex((p) => !solved[p.id]?.solvedAt);
    replaceHash(open >= 0 || !hasBank ? `#theme-${theme}-${Math.max(open, 0)}` : `#theme-${theme}-bank`);
  }, [part, hydrated, list, hasBank, theme]);

  if (part === null) return <Loading />;
  const i = part === "bank" ? -1 : Math.min(Math.max(part, 0), list.length - 1);
  const puzzle = i >= 0 ? list[i] : undefined;

  return (
    <div className="space-y-4">
      <Back />
      <header className="space-y-2">
        <h1 className="text-2xl font-black">
          {info.emoji} {info.name}
        </h1>
        <p className="max-w-3xl text-muted">{info.about}</p>
        {stat && (
          <p className="text-sm font-bold text-muted">
            {t(
              `Решено: ${stat.solved} · с первой попытки: ${Math.round(accuracy(stat) * 100)}%`,
              `Yechildi: ${stat.solved} · birinchi urinishda: ${Math.round(accuracy(stat) * 100)}%`,
            )}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {list.length > 0 && (
            <div className="flex flex-wrap gap-1" role="tablist" aria-label={t("Задачи школы", "Maktab masalalari")}>
              {list.map((p, k) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={k === i}
                  onClick={() => setHash(`#theme-${theme}-${k}`)}
                  className={cn(
                    "h-9 min-w-9 rounded-lg border-2 px-2 text-sm font-black",
                    k === i
                      ? "border-brand bg-brand text-white"
                      : progress[p.id]?.solvedAt
                        ? "border-mint/50 bg-mint-soft text-[#065f46]"
                        : "border-line bg-white",
                  )}
                >
                  {progress[p.id]?.solvedAt && k !== i ? "✓" : k + 1}
                </button>
              ))}
            </div>
          )}
          {hasBank && (
            <button
              type="button"
              aria-pressed={part === "bank"}
              onClick={() => setHash(`#theme-${theme}-bank`)}
              className={cn(
                "h-9 rounded-lg border-2 px-3 text-sm font-black",
                part === "bank" ? "border-brand bg-brand text-white" : "border-line bg-white",
              )}
            >
              {t(`📚 Задачи из базы · ${bankCount(theme)}`, `📚 Bazadan · ${bankCount(theme)}`)}
            </button>
          )}
          {part === "bank" && <LevelChooser />}
        </div>
      </header>
      {puzzle ? (
        <PuzzlePlayer
          key={puzzle.id}
          puzzle={puzzle}
          next={
            i < list.length - 1
              ? {
                  label: t("Следующая задача →", "Keyingi masala →"),
                  onClick: () => setHash(`#theme-${theme}-${i + 1}`),
                }
              : hasBank
                ? {
                    label: t("Дальше — задачи из базы →", "Endi — bazadagi masalalar →"),
                    onClick: () => setHash(`#theme-${theme}-bank`),
                  }
                : {
                    label: t("Тема пройдена! К другим темам →", "Mavzu tugadi! Boshqa mavzularga →"),
                    onClick: () => setHash("#all"),
                  }
          }
        />
      ) : (
        <BankRun
          name={theme}
          emptyText={t("Все задачи этой темы решены!", "Bu mavzudagi barcha masalalarni yechding!")}
        />
      )}
    </div>
  );
}

/** Серия: задачи от простых к трудным, три жизни. Задачи — из общего набора базы; без него — задачи школы. */
function StreakView() {
  const t = useT();
  const profile = useAgeProfile();
  const rating = usePuzzleRating();
  const mix = useBank("mix");
  const [seed] = useState(() => random());
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [over, setOver] = useState(false);
  const [round, setRound] = useState(0);
  // Порядок задач не меняется до конца серии (рейтинг в серии не считается).
  const order: AnyPuzzle[] = useMemo(
    () =>
      mix === null
        ? []
        : mix === "error"
          ? classicLadder(profile.minStars, seed + round)
          : ladderOrder(mix, Math.max(400, targetRating(rating) - 300), seededRandom(seed + round)),
    [mix, profile.minStars, rating, seed, round],
  );

  if (mix === null) return <Loading />;
  const puzzle = order[index];
  const finished = index >= order.length;

  if (over || finished || !puzzle) {
    return (
      <div className="space-y-4">
        <Back />
        <div className="rounded-3xl bg-sun-soft p-6 text-center">
          <p className="text-5xl" aria-hidden>
            {streak >= 10 ? "🏆" : streak >= 5 ? "🔥" : "💪"}
          </p>
          <h1 className="mt-2 text-2xl font-black">
            {t(
              `Серия закончилась: ${pluralize(streak, "задача", "задачи", "задач")} подряд`,
              `Natija: ketma-ket ${streak} ta masala`,
            )}
          </h1>
          <p className="mt-1 text-[#7a4b00]">
            {finished
              ? t("Лесенка пройдена до самого верха!", "Zinapoyaning eng yuqorisigacha chiqding!")
              : t(
                  "Три ошибки — серия прервана. Но каждая ошибка учит!",
                  "Uchta xato — oʻyin toʻxtadi. Lekin har bir xato nimanidir oʻrgatadi!",
                )}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => {
                setIndex(0);
                setLives(3);
                setStreak(0);
                setOver(false);
                setRound((r) => r + 1);
              }}
            >
              ↺ {t("Ещё раз", "Yana bir bor")}
            </Button>
            <Button variant="secondary" onClick={() => setHash("#all")}>
              {t("К задачам", "Masalalarga")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Back />
        <p className="text-lg font-black">
          🔥 {t("Серия", "Ketma-ket")}: {streak} · {t("жизни", "jonlar")}: {"❤️".repeat(lives)}
          {"🤍".repeat(3 - lives)}
        </p>
      </div>
      <PuzzlePlayer
        key={`${puzzleKey(puzzle)}-${round}-${index}`}
        puzzle={puzzle}
        rated={false}
        onSolved={() => {
          const n = streak + 1;
          setStreak(n);
          chessStreakReached(n);
        }}
        onFailed={() => {
          if (lives <= 1) setOver(true);
          setLives((l) => l - 1);
        }}
        next={{ label: t("Следующая →", "Keyingisi →"), onClick: () => setIndex((i) => i + 1) }}
      />
    </div>
  );
}

/** Задачи школы от простых к трудным — запасной вариант, если набор из базы не загрузился. */
function classicLadder(minStars: number, seed: number): ChessPuzzle[] {
  const rnd = seededRandom(seed);
  const order = PUZZLES.map((p) => ({ p, r: rnd() }))
    .sort((a, b) => a.p.stars - b.p.stars || a.r - b.r)
    .map((x) => x.p);
  // Старшие начинают сразу с задач своей сложности.
  return order.slice(
    Math.max(
      0,
      order.findIndex((p) => p.stars >= minStars),
    ),
  );
}

/** Детерминированный генератор: один и тот же порядок задач на протяжении серии. */
export function seededRandom(seed: number): () => number {
  let x = Math.floor(seed * 2 ** 31) || 1;
  return () => {
    x = (x * 48271) % 2147483647;
    return (x - 1) / 2147483646;
  };
}
