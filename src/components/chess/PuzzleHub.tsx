"use client";

import {
  Bird,
  CalendarDays,
  ChevronRight,
  Flame,
  Info,
  type LucideIcon,
  Play,
  Puzzle,
  Repeat,
  Zap,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, cn, ProgressBar, Icon } from "@/components/ui";
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
import { useChessPart } from "@/lib/useChess";
import { PUZZLE_PART } from "@/content/chess/parts/puzzles";
import { replaceHash, setHash, useHash } from "@/lib/useHash";
import { useToday } from "@/lib/useToday";
import { OwnPuzzlesView, ownPuzzles } from "./OwnPuzzles";
import {
  BankRun,
  LevelChooser,
  LevelNote,
  Loading,
  PracticeView,
  PuzzleLevel,
  WoodpeckerView,
  useThemeName,
} from "./PuzzleBankViews";
import { RepeatView, StormView } from "./PuzzleModes";
import { PuzzleTop, TopMenu } from "./PuzzleTop";
import { PuzzlePlayer, puzzleKey, type AnyPuzzle } from "./PuzzleTrainer";

const STARS = (n: number) => "⭐".repeat(n);

export function PuzzleHub() {
  const hash = useHash();
  const t = useT();
  const { puzzles, themes } = useChessPart(PUZZLE_PART);
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

  // Задача дня зависит от даты, а страница собрана заранее: до загрузки её не называем — иначе сервер и
  // браузер показали бы разные задачи (ошибка гидратации в любой день, кроме дня сборки).
  const dailyRu = hydrated && today ? dailyPuzzleFor(profile.minStars) : null;
  const daily = dailyRu ? (puzzles.find((p) => p.id === dailyRu.id) ?? dailyRu) : null;
  const woodpeckerRound = woodpecker ? Math.min(woodpecker.rounds.length + 1, 3) : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/chess"
        className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
      >
        ← {t("Шахматная школа", "Shaxmat maktabi")}
      </Link>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{t("Задачи", "Masalalar")}</p>
          <h1 className="text-3xl font-black">{t("Тренажёр тактики", "Taktika trenajyori")}</h1>
          {/* На телефоне описание не занимает первый экран: сначала — что делать. */}
          <p className="mt-1 hidden max-w-2xl text-muted sm:block">
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
            <span className="deco" aria-hidden>
              🧠{" "}
            </span>
            {t("Мой уровень", "Mening darajam")}: <PuzzleLevel />
          </h2>
          <p className="hidden text-sm text-white/85 sm:block">
            {t(
              "Решаешь с первой попытки — задачи становятся труднее, ошибаешься или берёшь подсказку — полегче.",
              "Birinchi urinishda yechsang — masalalar qiyinlashadi, xato qilsang yoki maslahat olsang — osonlashadi.",
            )}
          </p>
          <Button variant="sun" size="lg" className="w-full sm:w-auto" onClick={() => setHash("#practice")}>
            <Play className="mr-2 h-5 w-5 fill-current" aria-hidden />
            {t("Решать задачи по силам", "Kuchimga mos masalalarni yechish")}
          </Button>
          <div className="rounded-2xl bg-white/10 p-2">
            <LevelChooser />
          </div>
        </div>
        {/* Пока тем со статистикой нет, на телефоне этот блок — только текст: прячем, чтобы режимы были ближе. */}
        <div
          className={cn(
            "space-y-3 rounded-2xl bg-white/10 p-4",
            !strong.length && !weak.length && dueCount === 0 && "hidden md:block",
          )}
          data-theme-dashboard
        >
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
              <Icon icon={Repeat} /> {t(`Исправить ошибки (${dueCount})`, `Xatolarni tuzatish (${dueCount})`)}
            </Button>
          )}
        </div>
      </section>

      <section aria-labelledby="modes">
        <h2 id="modes" className="mb-3 text-2xl font-black">
          {t("Режимы", "Rejimlar")}
        </h2>
        {/* Короткий список: на телефоне — название и одна строка, описание — на широком экране и на странице режима. */}
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" data-puzzle-modes>
          <Mode
            id="daily"
            Icon={CalendarDays}
            title={t("Задача дня", "Kun masalasi")}
            status={
              daily
                ? `${STARS(daily.stars)} · ${daily.title}${
                    progress[daily.id]?.solvedAt ? t(" · ✅ решена", " · ✅ yechilgan") : ""
                  }`
                : // Неразрывный пробел держит высоту строки, пока задача дня не известна.
                  "\u00a0"
            }
            about={t("Одна новая задача каждый день.", "Har kuni bitta yangi masala.")}
          />
          <Mode
            id="streak"
            Icon={Flame}
            title={t("Серия", "Ketma-ket")}
            status={`${t("Лучшая серия", "Rekord")}: ${hydrated ? streakBest : 0}`}
            about={t(
              "Задачи идут одна за другой, каждая чуть труднее. Три ошибки — и серия заканчивается.",
              "Masalalar birin-ketin keladi, har biri avvalgisidan sal qiyinroq. Uch marta xato qilsang — oʻyin tugaydi.",
            )}
          />
          <Mode
            id="storm"
            Icon={Zap}
            title={t("Шторм", "Boʻron")}
            status={`${t("Рекорд", "Rekord")}: ${hydrated ? stormBest : 0}`}
            about={t(
              "Три минуты — сколько задач успеешь? Ошибка отнимает 10 секунд.",
              "Uch daqiqa — nechta masala yechishga ulgurasan? Har bir xato 10 soniyani olib qoʻyadi.",
            )}
          />
          <Mode
            id="woodpecker"
            Icon={Bird}
            title={t("Дятел", "Qizilishton")}
            status={
              hydrated && woodpecker && woodpecker.rounds.length < 3
                ? t(`Продолжить: круг ${woodpeckerRound}`, `Davom etish: ${woodpeckerRound}-aylana`)
                : t("20 задач — три круга", "20 ta masala — uch aylana")
            }
            about={t(
              "С каждым кругом решай быстрее: так приёмы запоминаются надолго.",
              "Har aylanada tezroq yech: shunda usullar uzoq esda qoladi.",
            )}
          />
          <Mode
            id="repeat"
            Icon={Repeat}
            title={t("Повторение", "Takrorlash")}
            status={
              dueCount
                ? t(`Повторить (${dueCount})`, `Takrorlash (${dueCount})`)
                : t("На сегодня повторять нечего", "Bugun takrorlanadigan masala yoʻq")
            }
            highlight={dueCount > 0}
            about={t(
              "Задачи с ошибками возвращаются через 1, 3, 7 и 21 день — пока не будут решены без ошибки.",
              "Xato qilingan masalalar 1, 3, 7 va 21 kundan keyin qaytib keladi — toki xatosiz yechilmaguncha.",
            )}
          />
          <Mode
            id="mine"
            Icon={Puzzle}
            title={t("Из твоих партий", "Oʻz partiyalaringdan")}
            status={
              own.length
                ? t(
                    `${pluralize(own.length, "момент", "момента", "моментов")} · решено ${own.filter((p) => ownSolved[p.key]).length}`,
                    `${own.length} ta lahza · ${own.filter((p) => ownSolved[p.key]).length} tasi yechilgan`,
                  )
                : t("Сыграй с роботом — ошибки станут задачами", "Robot bilan oʻyna — xatolaring masalaga aylanadi")
            }
            about={t(
              "Робот-тренер находит в твоих партиях моменты, где был ход сильнее.",
              "Robot-murabbiy partiyalaringdan kuchliroq yurish boʻlgan lahzalarni topadi.",
            )}
          />
        </ul>
      </section>

      <section aria-labelledby="themes">
        <h2 id="themes" className="mb-3 text-2xl font-black">
          {t("По темам", "Mavzular boʻyicha")}
        </h2>
        {/* На телефоне темы — плитками в два ряда: 19 карточек во всю ширину занимали три экрана. */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
          {themes.map((theme) => {
            const total = puzzlesByTheme(theme.id).length + bankCount(theme.id);
            const s = stats.get(theme.id);
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setHash(`#theme-${theme.id}`)}
                className="flex min-w-0 flex-col rounded-2xl bg-surface p-3 text-left shadow-card transition hover:-translate-y-0.5 sm:rounded-3xl sm:p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl" aria-hidden>
                    {theme.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="leading-tight font-black wrap-anywhere sm:text-lg">{theme.name}</p>
                    <p className="hidden text-xs font-bold text-muted sm:block">
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
                <p className="mt-2 hidden flex-1 text-sm text-muted sm:block">{theme.about}</p>
                <div className="mt-auto flex items-center gap-2 pt-2 sm:pt-3">
                  <ProgressBar value={s?.solved ?? 0} max={total} className="flex-1" />
                  <span className="text-xs font-extrabold text-muted tabular-nums sm:hidden">
                    {s?.solved ?? 0} / {total}
                  </span>
                  <span className="hidden text-xs font-extrabold text-muted sm:inline">
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

/** Режим в списке: значок, название, одна строка состояния; описание — только на широком экране. */
function Mode({
  id,
  Icon,
  title,
  status,
  about,
  highlight = false,
}: {
  id: string;
  Icon: LucideIcon;
  title: string;
  status: string;
  about: string;
  /** Есть что сделать прямо сейчас (например, задачи на повторение). */
  highlight?: boolean;
}) {
  return (
    // min-w-0: иначе длинная строка состояния растягивает колонку шире экрана.
    <li className="min-w-0">
      <button
        type="button"
        data-puzzle-mode={id}
        onClick={() => setHash(`#${id}`)}
        className="flex h-full w-full items-center gap-3 rounded-2xl bg-surface p-3 text-left shadow-card transition hover:-translate-y-0.5 sm:items-start sm:rounded-3xl sm:p-4"
      >
        <span
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
            highlight ? "bg-sun-soft text-sun-ink" : "bg-brand-soft text-brand-dark",
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={2.25} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg leading-tight font-black">{title}</span>
          <span className={cn("block truncate text-sm font-bold", highlight ? "text-sun-ink" : "text-muted")}>
            {status}
          </span>
          <span className="mt-1 hidden text-sm text-muted sm:block">{about}</span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted sm:mt-3" strokeWidth={2.25} aria-hidden />
      </button>
    </li>
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
            className="rounded-xl bg-surface px-3 py-1.5 text-sm font-black text-ink transition hover:bg-brand-soft"
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
    <div className="rounded-2xl bg-surface px-4 py-2 text-center shadow-card">
      <p className="tabular text-2xl font-black">{value}</p>
      <p className="text-xs font-bold text-muted">{label}</p>
    </div>
  );
}

function Back({ label }: { label?: string }) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => setHash("#all")}
      className="inline-flex min-h-11 items-center text-sm font-extrabold text-brand hover:underline"
    >
      {label ?? t("← Все задачи", "← Barcha masalalar")}
    </button>
  );
}

function DailyView() {
  const t = useT();
  const profile = useAgeProfile();
  const puzzle = dailyPuzzleFor(profile.minStars);
  return (
    <div className="board-stage board-wide board-top space-y-2 sm:space-y-4">
      <PuzzleTop>
        <h1 className="truncate text-lg font-black lg:text-2xl lg:whitespace-normal">
          <span className="deco" aria-hidden>
            📅{" "}
          </span>
          {t("Задача дня", "Kun masalasi")}
        </h1>
      </PuzzleTop>
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
  const { puzzles } = useChessPart(PUZZLE_PART);
  // Название — на языке интерфейса; у задач из своих партий перевода нет — как есть.
  const title = (puzzles.find((p) => p.id === puzzle.id) ?? puzzle).title;
  return (
    <div className="board-stage board-wide board-top space-y-2 sm:space-y-4">
      {/* На телефоне карточки с названием задачи нет — оно в верхней строке. */}
      <PuzzleTop>
        <p className="truncate text-lg font-black lg:hidden">{title}</p>
      </PuzzleTop>
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
  const { themes } = useChessPart(PUZZLE_PART);
  const hydrated = useHydrated();
  const info = themes.find((x) => x.id === theme)!;
  const list = useMemo(() => puzzlesByTheme(theme), [theme]);
  const progress = useStore((s) => s.chessPuzzles);
  const stat = themeStats(hydrated ? progress : {}).get(theme);
  const hasBank = bankCount(theme) > 0;
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (part !== null || !hydrated) return;
    const solved = getState().chessPuzzles;
    const open = list.findIndex((p) => !solved[p.id]?.solvedAt);
    replaceHash(open >= 0 || !hasBank ? `#theme-${theme}-${Math.max(open, 0)}` : `#theme-${theme}-bank`);
  }, [part, hydrated, list, hasBank, theme]);

  // Ряд номеров на телефоне листается вбок: выбранную задачу подкручиваем в видимую часть.
  useEffect(() => {
    strip.current
      ?.querySelector('[aria-selected="true"], [aria-pressed="true"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [part]);

  if (part === null) return <Loading />;
  const i = part === "bank" ? -1 : Math.min(Math.max(part, 0), list.length - 1);
  const puzzle = i >= 0 ? list[i] : undefined;
  const solvedLine = stat && (
    <p className="text-sm font-bold text-muted">
      {t(
        `Решено: ${stat.solved} · с первой попытки: ${Math.round(accuracy(stat) * 100)}%`,
        `Yechildi: ${stat.solved} · birinchi urinishda: ${Math.round(accuracy(stat) * 100)}%`,
      )}
    </p>
  );

  return (
    <div className="board-stage board-wide board-top space-y-2 sm:space-y-4">
      {/*
        Телефон: в строке — название темы; рассказ о теме, счёт и сложность открываются кнопкой справа —
        над доской остаётся только ряд с номерами задач.
      */}
      <PuzzleTop
        end={
          <TopMenu icon={Info} label={t("О теме", "Mavzu haqida")} className="lg:hidden">
            <p className="text-muted">{info.about}</p>
            {solvedLine}
            {part === "bank" && (
              <>
                <LevelNote />
                <LevelChooser />
              </>
            )}
          </TopMenu>
        }
      >
        <h1 className="truncate text-lg font-black lg:text-2xl lg:whitespace-normal">
          {info.emoji} {info.name}
        </h1>
      </PuzzleTop>
      <div className="space-y-2">
        <p className="max-w-3xl text-muted max-lg:hidden">{info.about}</p>
        {solvedLine && <div className="max-lg:hidden">{solvedLine}</div>}
        {/* Телефон: номера задач — одним рядом, который листается вбок; выбранный номер всегда виден. */}
        <div
          ref={strip}
          className="flex items-center gap-2 max-lg:-mx-4 max-lg:-my-1 max-lg:[scrollbar-width:none] max-lg:overflow-x-auto max-lg:px-4 max-lg:py-1 lg:flex-wrap"
          data-puzzle-strip
        >
          {list.length > 0 && (
            <div
              className="flex shrink-0 gap-1 lg:shrink lg:flex-wrap"
              role="tablist"
              aria-label={t("Задачи школы", "Maktab masalalari")}
            >
              {list.map((p, k) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={k === i}
                  onClick={() => setHash(`#theme-${theme}-${k}`)}
                  className={cn(
                    "h-9 min-w-9 shrink-0 rounded-lg border-2 px-2 text-sm font-black",
                    k === i
                      ? "border-brand bg-brand text-white"
                      : progress[p.id]?.solvedAt
                        ? "border-mint/50 bg-mint-soft text-mint-ink"
                        : "border-line bg-surface",
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
                "h-9 shrink-0 rounded-lg border-2 px-3 text-sm font-black whitespace-nowrap",
                part === "bank" ? "border-brand bg-brand text-white" : "border-line bg-surface",
              )}
            >
              {t(`📚 Задачи из базы · ${bankCount(theme)}`, `📚 Bazadan · ${bankCount(theme)}`)}
            </button>
          )}
          {part === "bank" && (
            <div className="max-lg:hidden">
              <LevelChooser />
            </div>
          )}
        </div>
      </div>
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
          <p className="mt-1 text-sun-ink">
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
              <Icon icon={RotateCcw} /> {t("Ещё раз", "Yana bir bor")}
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
    <div className="board-stage board-wide board-top space-y-2 sm:space-y-4">
      <PuzzleTop>
        <p className="text-lg font-black">
          🔥 {t("Серия", "Ketma-ket")}: {streak} · {t("жизни", "jonlar")}: {"❤️".repeat(lives)}
          {"🤍".repeat(3 - lives)}
        </p>
      </PuzzleTop>
      <PuzzlePlayer
        key={`${puzzleKey(puzzle)}-${round}-${index}`}
        puzzle={puzzle}
        rated={false}
        solution={false}
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
