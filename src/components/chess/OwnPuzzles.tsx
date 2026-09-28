"use client";

import Link from "next/link";
import { useState } from "react";
import { Feedback, type FeedbackState } from "@/components/answers/Feedback";
import { Button, ButtonLink, cn } from "@/components/ui";
import { legalTargets, pieceAt, playMove, ruSan, type Color } from "@/lib/chess";
import { isAlmostBest } from "@/lib/engine/analysis";
import { chessOwnPuzzleSolved, useHydrated, useStore, type ChessGameRecord } from "@/lib/store";
import { setHash } from "@/lib/useHash";
import { ChessBoard, type SquareMark } from "./ChessBoard";
import { gameTitle } from "./GameReview";

export interface OwnPuzzle {
  key: string;
  gameId: string;
  title: string;
  fen: string;
  side: Color;
  played: string;
  best: string;
  bestSan: string;
  kind: "mistake" | "blunder";
}

/** Ошибки и зевки из разобранных партий — позиция перед ошибкой становится задачей «найди ход сильнее». */
export function ownPuzzles(games: readonly ChessGameRecord[]): OwnPuzzle[] {
  const out: OwnPuzzle[] = [];
  for (const g of games) {
    for (const m of g.analysis?.moments ?? []) {
      if (g.mode === "robot" && m.side !== g.color) continue;
      out.push({
        key: `${g.id}:${m.ply}`,
        gameId: g.id,
        title: `${gameTitle(g)}, ход ${Math.ceil(m.ply / 2)}`,
        fen: m.fen,
        side: m.side,
        played: ruSan(m.san),
        best: m.best,
        bestSan: ruSan(m.bestSan),
        kind: m.kind,
      });
    }
  }
  return out;
}

export function OwnPuzzlesView() {
  const hydrated = useHydrated();
  const games = useStore((s) => s.chessGames);
  const solved = useStore((s) => s.chessOwnPuzzles);
  const list = hydrated ? ownPuzzles(games) : [];
  const firstOpen = Math.max(
    0,
    list.findIndex((p) => !solved[p.key]),
  );
  const [index, setIndex] = useState<number | null>(null);
  const i = Math.min(index ?? firstOpen, Math.max(0, list.length - 1));
  const puzzle = list[i];
  const done = list.filter((p) => solved[p.key]).length;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setHash("#all")}
        className="text-sm font-extrabold text-brand hover:underline"
      >
        ← Все задачи
      </button>
      <header>
        <h1 className="text-2xl font-black">🧩 Задачи из твоих партий</h1>
        <p className="text-muted">
          Робот-тренер нашёл в твоих партиях моменты, где был ход сильнее. Найди его сейчас — тогда в следующей партии
          ты его не пропустишь.
        </p>
      </header>
      {!hydrated ? null : list.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-center shadow-card">
          <p className="text-lg font-black">Пока задач нет.</p>
          <p className="mt-1 text-muted">
            Сыграй партию с роботом и открой её разбор — ошибки из разобранных партий появятся здесь.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <ButtonLink href="/chess/play">Играть</ButtonLink>
            <ButtonLink href="/chess/review" variant="secondary">
              Разбор партий
            </ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-1.5" aria-label="Задачи">
            {list.map((p, k) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setIndex(k)}
                aria-current={k === i ? "step" : undefined}
                aria-label={`Задача ${k + 1}${solved[p.key] ? " (решена)" : ""}`}
                className={cn(
                  "h-10 min-w-10 rounded-xl border-2 px-2 font-black",
                  k === i
                    ? "border-brand bg-brand text-white"
                    : solved[p.key]
                      ? "border-mint/50 bg-mint-soft text-[#065f46]"
                      : "border-line bg-white",
                )}
              >
                {solved[p.key] && k !== i ? "✓" : k + 1}
              </button>
            ))}
            <span className="ml-auto text-sm font-extrabold text-muted">
              Решено {done} из {list.length}
            </span>
          </div>
          {puzzle && (
            <OwnPuzzleBoard
              key={puzzle.key}
              puzzle={puzzle}
              onNext={i < list.length - 1 ? () => setIndex(i + 1) : undefined}
            />
          )}
        </>
      )}
    </div>
  );
}

function OwnPuzzleBoard({ puzzle, onNext }: { puzzle: OwnPuzzle; onNext?: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const [shown, setShown] = useState(puzzle.fen);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const attempt = (from: string, to: string): boolean => {
    if (done) return false;
    const played = playMove(puzzle.fen, from, to, "q");
    if (!played) return false;
    setSelected(null);
    setShown(played.fen);
    if (isAlmostBest(puzzle.fen, played.uci, puzzle.best)) {
      setDone(true);
      chessOwnPuzzleSolved(puzzle.key);
      setFeedback({
        tone: "success",
        text:
          played.uci === puzzle.best
            ? `${ruSan(played.san)} — точно! 🎉`
            : `${ruSan(played.san)} — тоже сильный ход! 🎉`,
        sub:
          played.uci === puzzle.best
            ? `В партии было ${puzzle.played} — теперь ты знаешь, как лучше.`
            : `Робот-тренер предлагал ${puzzle.bestSan}, но твой ход почти так же хорош.`,
      });
    } else {
      const n = misses + 1;
      setMisses(n);
      setFeedback({
        tone: "retry",
        text:
          n === 1
            ? "Есть ход сильнее. Подумай ещё!"
            : n === 2
              ? "Подсвечена фигура, которой нужно ходить."
              : "Зелёная стрелка показывает ход.",
        sub: n === 1 ? "Проверь шахи, взятия и угрозы — свои и соперника." : undefined,
      });
      setTimeout(() => setShown(puzzle.fen), 700);
    }
    return true;
  };

  const tap = (sq: string) => {
    if (done) return;
    const piece = pieceAt(puzzle.fen, sq);
    if (piece && piece.color === puzzle.side) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected) attempt(selected, sq);
  };

  const marks: Record<string, SquareMark> = {};
  if (misses >= 2 && !done) marks[puzzle.best.slice(0, 2)] = "hint";
  if (selected) {
    marks[selected] = "selected";
    for (const t of legalTargets(puzzle.fen, selected)) marks[t] = pieceAt(puzzle.fen, t) ? "capture" : "target";
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        <ChessBoard
          id="own-puzzle"
          position={shown}
          marks={marks}
          orientation={puzzle.side === "w" ? "white" : "black"}
          onSquare={tap}
          draggable={!done}
          onDrop={attempt}
          arrows={
            misses >= 3 && !done
              ? [{ from: puzzle.best.slice(0, 2), to: puzzle.best.slice(2, 4), color: "#10b981" }]
              : []
          }
          maxWidth={480}
        />
        <Feedback state={feedback} />
      </div>
      <aside className="space-y-3">
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <p className="text-xs font-extrabold tracking-wide text-muted uppercase">{puzzle.title}</p>
          <p className="mt-1 text-lg font-black">
            Ходят {puzzle.side === "w" ? "белые" : "чёрные"}. Найди ход сильнее!
          </p>
          <p className="mt-1 text-sm text-muted">
            В партии было сыграно {puzzle.played} — это была{" "}
            {puzzle.kind === "blunder" ? "грубая ошибка (зевок)" : "ошибка"}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/chess/review#${puzzle.gameId}`}
            className="rounded-xl px-3 py-2 text-sm font-extrabold text-brand hover:bg-brand-soft"
          >
            🔎 Разбор этой партии
          </Link>
          {onNext && (
            <Button size="sm" onClick={onNext}>
              Следующая задача →
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
