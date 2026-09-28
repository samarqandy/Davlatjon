"use client";

import Link from "next/link";
import { useState } from "react";
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
import { useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { random } from "@/lib/random";
import { chessStreakReached, duePuzzles, useHydrated, useStore } from "@/lib/store";
import { useAgeProfile } from "@/lib/age";
import { useChess } from "@/lib/useChess";
import { setHash, useHash } from "@/lib/useHash";
import { ChessBoard } from "./ChessBoard";
import { PuzzlePlayer } from "./PuzzleTrainer";
import { OwnPuzzlesView, ownPuzzles } from "./OwnPuzzles";
import { RepeatView, StormView } from "./PuzzleModes";
import { useToday } from "@/lib/useToday";

const STARS = (n: number) => "⭐".repeat(n);

/** Очки за задачу: по 10 за каждую звезду. */
export function puzzlePoints(solved: Record<string, { solvedAt?: number }>): number {
  return PUZZLES.filter((p) => solved[p.id]?.solvedAt).reduce((s, p) => s + p.stars * 10, 0);
}

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
  const own = hydrated ? ownPuzzles(games) : [];
  const today = useToday();
  const dueCount = hydrated && today ? duePuzzles(progress, today).length : 0;
  const stormBest = useStore((s) => s.chessDrills.storm ?? 0);
  const solvedCount = hydrated ? PUZZLES.filter((p) => progress[p.id]?.solvedAt).length : 0;
  const points = hydrated ? puzzlePoints(progress) : 0;

  if (hash === "#daily") return <DailyView />;
  if (hash === "#streak") return <StreakView />;
  if (hash === "#mine") return <OwnPuzzlesView />;
  if (hash === "#storm") return <StormView />;
  if (hash === "#repeat") return <RepeatView />;
  const themeMatch = hash.match(/^#theme-([a-z0-9]+)(?:-(\d+))?$/);
  if (themeMatch) {
    const theme = PUZZLE_THEMES.find((x) => x.id === themeMatch[1]);
    if (theme) return <ThemeView theme={theme.id} index={Number(themeMatch[2] ?? 0)} />;
  }
  const puzzleMatch = hash.match(/^#puzzle-(.+)$/);
  if (puzzleMatch) {
    const puzzle = getPuzzle(puzzleMatch[1]);
    if (puzzle) return <SingleView puzzle={puzzle} />;
  }

  const dailyRu = dailyPuzzleFor(profile.minStars);
  const daily = puzzles.find((p) => p.id === dailyRu.id) ?? dailyRu;

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
              `${PUZZLES.length} задач от простых матов в один ход до комбинаций из знаменитых партий. Каждая проверена шахматным движком.`,
              `${PUZZLES.length} ta masala: bir yurishda oddiy motlardan tortib mashhur partiyalardagi kombinatsiyalargacha. Har birini shaxmat dasturi tekshirib chiqqan.`,
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Stat value={solvedCount} label={t(`из ${PUZZLES.length} решено`, `${PUZZLES.length} tadan yechildi`)} />
          <Stat value={points} label={t("очков", "ochko")} />
          <Stat value={streakBest} label={t("лучшая серия", "ketma-ket rekord")} />
        </div>
      </header>

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
                "Задачи идут одна за другой, от простых к трудным. Три ошибки — и серия заканчивается. Сколько решишь подряд?",
                "Masalalar birin-ketin keladi: oddiylaridan qiyinlariga qarab. Uch marta xato qilsang — oʻyin tugaydi. Ketma-ket nechta masala yecha olasan?",
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

      <div className="grid gap-4 md:grid-cols-2">
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
            const list = puzzlesByTheme(theme.id);
            const done = hydrated ? list.filter((p) => progress[p.id]?.solvedAt).length : 0;
            const stars = [...new Set(list.map((p) => p.stars))].sort();
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
                      {STARS(stars[0])}
                      {stars.length > 1 ? `–${STARS(stars[stars.length - 1])}` : ""} ·{" "}
                      {t(pluralize(list.length, "задача", "задачи", "задач"), `${list.length} ta masala`)}
                    </p>
                  </div>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted">{theme.about}</p>
                <div className="mt-3 flex items-center gap-2">
                  <ProgressBar value={done} max={list.length} className="flex-1" />
                  <span className="text-xs font-extrabold text-muted">
                    {done}/{list.length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
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

function ThemeView({ theme, index }: { theme: PuzzleTheme; index: number }) {
  const t = useT();
  const { themes } = useChess();
  const info = themes.find((x) => x.id === theme)!;
  const list = puzzlesByTheme(theme);
  const progress = useStore((s) => s.chessPuzzles);
  const i = Math.min(Math.max(index, 0), list.length - 1);
  const puzzle = list[i];
  return (
    <div className="space-y-4">
      <Back />
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-black">
          {info.emoji} {info.name}
        </h1>
        <div className="flex flex-wrap gap-1" role="tablist" aria-label={t("Задачи темы", "Mavzu masalalari")}>
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
      </div>
      <PuzzlePlayer
        key={puzzle.id}
        puzzle={puzzle}
        next={
          i < list.length - 1
            ? { label: t("Следующая задача →", "Keyingi masala →"), onClick: () => setHash(`#theme-${theme}-${i + 1}`) }
            : {
                label: t("Тема пройдена! К другим темам →", "Mavzu tugadi! Boshqa mavzularga →"),
                onClick: () => setHash("#all"),
              }
        }
      />
    </div>
  );
}

/** Серия: задачи от простых к трудным, три жизни. */
function StreakView() {
  const t = useT();
  const profile = useAgeProfile();
  const [order] = useState(() =>
    PUZZLES.map((p) => ({ p, r: random() }))
      .sort((a, b) => a.p.stars - b.p.stars || a.r - b.r)
      .map((x) => x.p.id),
  );
  // Старшие начинают серию сразу с задач своей сложности.
  const start = Math.max(
    0,
    order.findIndex((id) => (getPuzzle(id)?.stars ?? 1) >= profile.minStars),
  );
  const [index, setIndex] = useState(start);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [over, setOver] = useState(false);
  const puzzle = getPuzzle(order[index])!;
  const finished = index >= order.length;

  if (over || finished) {
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
              ? t("Ты решил все задачи тренажёра!", "Trenajyordagi barcha masalalarni yechding!")
              : t(
                  "Три ошибки — серия прервана. Но каждая ошибка учит!",
                  "Uchta xato — oʻyin toʻxtadi. Lekin har bir xato nimanidir oʻrgatadi!",
                )}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => {
                setIndex(start);
                setLives(3);
                setStreak(0);
                setOver(false);
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
        key={puzzle.id}
        puzzle={puzzle}
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
