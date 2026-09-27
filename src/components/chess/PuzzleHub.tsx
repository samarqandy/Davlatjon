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
import { pluralize } from "@/lib/plural";
import { random } from "@/lib/random";
import { chessStreakReached, useHydrated, useStore } from "@/lib/store";
import { useAgeProfile } from "@/lib/age";
import { setHash, useHash } from "@/lib/useHash";
import { ChessBoard } from "./ChessBoard";
import { PuzzlePlayer } from "./PuzzleTrainer";

const STARS = (n: number) => "⭐".repeat(n);

/** Очки за задачу: по 10 за каждую звезду. */
export function puzzlePoints(solved: Record<string, { solvedAt?: number }>): number {
  return PUZZLES.filter((p) => solved[p.id]?.solvedAt).reduce((s, p) => s + p.stars * 10, 0);
}

export function PuzzleHub() {
  const hash = useHash();
  const profile = useAgeProfile();
  const hydrated = useHydrated();
  const progress = useStore((s) => s.chessPuzzles);
  const streakBest = useStore((s) => s.chessStreak);
  const solvedCount = hydrated ? PUZZLES.filter((p) => progress[p.id]?.solvedAt).length : 0;
  const points = hydrated ? puzzlePoints(progress) : 0;

  if (hash === "#daily") return <DailyView />;
  if (hash === "#streak") return <StreakView />;
  const themeMatch = hash.match(/^#theme-([a-z0-9]+)(?:-(\d+))?$/);
  if (themeMatch) {
    const theme = PUZZLE_THEMES.find((t) => t.id === themeMatch[1]);
    if (theme) return <ThemeView theme={theme.id} index={Number(themeMatch[2] ?? 0)} />;
  }
  const puzzleMatch = hash.match(/^#puzzle-(.+)$/);
  if (puzzleMatch) {
    const puzzle = getPuzzle(puzzleMatch[1]);
    if (puzzle) return <SingleView puzzle={puzzle} />;
  }

  const daily = dailyPuzzleFor(profile.minStars);

  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← Шахматная школа
      </Link>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Задачи</p>
          <h1 className="text-3xl font-black">Тренажёр тактики</h1>
          <p className="mt-1 max-w-2xl text-muted">
            {PUZZLES.length} задач от простых матов в один ход до комбинаций из знаменитых партий. Каждая проверена
            шахматным движком.
          </p>
        </div>
        <div className="flex gap-3">
          <Stat value={solvedCount} label={`из ${PUZZLES.length} решено`} />
          <Stat value={points} label="очков" />
          <Stat value={streakBest} label="лучшая серия" />
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-card" aria-labelledby="daily">
          <div>
            <h2 id="daily" className="text-xl font-black">
              📅 Задача дня
            </h2>
            <p className="text-sm text-muted">
              {STARS(daily.stars)} · {daily.title}
              {hydrated && progress[daily.id]?.solvedAt ? " · ✅ решена" : ""}
            </p>
          </div>
          <ChessBoard
            id="daily-preview"
            position={daily.fen}
            orientation={daily.fen.split(" ")[1] === "w" ? "white" : "black"}
            maxWidth={260}
            className="!mx-0"
          />
          <Button onClick={() => setHash("#daily")}>Решать задачу дня</Button>
        </section>

        <section className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-card" aria-labelledby="streak">
          <div>
            <h2 id="streak" className="text-xl font-black">
              🔥 Серия
            </h2>
            <p className="text-sm text-muted">
              Задачи идут одна за другой, от простых к трудным. Три ошибки — и серия заканчивается. Сколько решишь
              подряд?
            </p>
          </div>
          <p className="text-lg font-black">Лучшая серия: {hydrated ? streakBest : 0}</p>
          <Button variant="sun" onClick={() => setHash("#streak")} className="mt-auto">
            Начать серию
          </Button>
        </section>
      </div>

      <section aria-labelledby="themes">
        <h2 id="themes" className="mb-3 text-2xl font-black">
          По темам
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PUZZLE_THEMES.map((t) => {
            const list = puzzlesByTheme(t.id);
            const done = hydrated ? list.filter((p) => progress[p.id]?.solvedAt).length : 0;
            const stars = [...new Set(list.map((p) => p.stars))].sort();
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setHash(`#theme-${t.id}`)}
                className="flex flex-col rounded-3xl bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-3xl" aria-hidden>
                    {t.emoji}
                  </span>
                  <div>
                    <p className="text-lg font-black">{t.name}</p>
                    <p className="text-xs font-bold text-muted">
                      {STARS(stars[0])}
                      {stars.length > 1 ? `–${STARS(stars[stars.length - 1])}` : ""} ·{" "}
                      {pluralize(list.length, "задача", "задачи", "задач")}
                    </p>
                  </div>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted">{t.about}</p>
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

function Back({ label = "← Все задачи" }: { label?: string }) {
  return (
    <button type="button" onClick={() => setHash("#all")} className="text-sm font-extrabold text-brand hover:underline">
      {label}
    </button>
  );
}

function DailyView() {
  const profile = useAgeProfile();
  const puzzle = dailyPuzzleFor(profile.minStars);
  return (
    <div className="space-y-4">
      <Back />
      <h1 className="text-2xl font-black">📅 Задача дня</h1>
      <PuzzlePlayer
        key={puzzle.id}
        puzzle={puzzle}
        next={{ label: "К другим задачам →", onClick: () => setHash("#all") }}
      />
    </div>
  );
}

function SingleView({ puzzle }: { puzzle: ChessPuzzle }) {
  return (
    <div className="space-y-4">
      <Back />
      <PuzzlePlayer
        key={puzzle.id}
        puzzle={puzzle}
        next={{ label: "К другим задачам →", onClick: () => setHash("#all") }}
      />
    </div>
  );
}

function ThemeView({ theme, index }: { theme: PuzzleTheme; index: number }) {
  const info = PUZZLE_THEMES.find((t) => t.id === theme)!;
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
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Задачи темы">
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
            ? { label: "Следующая задача →", onClick: () => setHash(`#theme-${theme}-${i + 1}`) }
            : { label: "Тема пройдена! К другим темам →", onClick: () => setHash("#all") }
        }
      />
    </div>
  );
}

/** Серия: задачи от простых к трудным, три жизни. */
function StreakView() {
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
            Серия закончилась: {pluralize(streak, "задача", "задачи", "задач")} подряд
          </h1>
          <p className="mt-1 text-[#7a4b00]">
            {finished ? "Ты решил все задачи тренажёра!" : "Три ошибки — серия прервана. Но каждая ошибка учит!"}
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
              ↺ Ещё раз
            </Button>
            <Button variant="secondary" onClick={() => setHash("#all")}>
              К задачам
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
          🔥 Серия: {streak} · жизни: {"❤️".repeat(lives)}
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
        next={{ label: "Следующая →", onClick: () => setIndex((i) => i + 1) }}
      />
    </div>
  );
}
