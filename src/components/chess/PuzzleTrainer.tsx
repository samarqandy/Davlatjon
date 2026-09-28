"use client";

import { useEffect, useRef, useState } from "react";
import { Feedback, type FeedbackState } from "@/components/answers/Feedback";
import { Button } from "@/components/ui";
import type { ChessPuzzle } from "@/content/chess/puzzles";
import { isInCheck, legalTargets, pieceAt, playMove, ruSan, type Color } from "@/lib/chess";
import { matingMovesIn, searchBest } from "@/lib/engine/search";
import { kingOf } from "@/lib/play";
import { pluralize } from "@/lib/plural";
import { chessPuzzleMiss, chessPuzzleSolved } from "@/lib/store";
import { ChessBoard, type SquareMark } from "./ChessBoard";

const STARS = (n: number) => "⭐".repeat(n);

interface Step {
  fen: string;
  /** Сколько ходов до мата осталось решающей стороне (0 — задача на один ход). */
  matesLeft: number;
}

/** Принимаемые ходы на текущем шаге. */
function acceptedMoves(puzzle: ChessPuzzle, step: Step): string[] {
  if (step.matesLeft > 0) return matingMovesIn(step.fen, step.matesLeft);
  return puzzle.solution ?? [];
}

export function PuzzlePlayer({
  puzzle,
  onSolved,
  onFailed,
  next,
}: {
  puzzle: ChessPuzzle;
  onSolved?: (misses: number) => void;
  onFailed?: () => void;
  next?: { label: string; onClick: () => void };
}) {
  const solver = puzzle.fen.split(" ")[1] as Color;
  const [step, setStep] = useState<Step>({ fen: puzzle.fen, matesLeft: puzzle.mateIn ?? 0 });
  const [shown, setShown] = useState(puzzle.fen);
  const [selected, setSelected] = useState<string | null>(null);
  const [last, setLast] = useState<[string, string] | null>(null);
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failed = useRef(false);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const accepted = acceptedMoves(puzzle, step);
  const hintFrom = misses >= 3 && accepted[0] ? accepted[0].slice(0, 2) : null;
  const hintTo = misses >= 4 && accepted[0] ? accepted[0].slice(2, 4) : null;

  const attempt = (from: string, to: string): boolean => {
    if (done || busy || shown !== step.fen) return false;
    const played = playMove(step.fen, from, to, "q");
    if (!played) return false;
    setSelected(null);
    setShown(played.fen);
    setLast([from, to]);
    if (accepted.includes(played.uci)) {
      const left = step.matesLeft > 0 ? step.matesLeft - 1 : 0;
      if (played.mate || left === 0) {
        setDone(true);
        chessPuzzleSolved(puzzle.id, misses === 0);
        setFeedback({
          tone: "success",
          text: `${ruSan(played.san)}${played.mate ? " — мат!" : " — верно!"} ${misses === 0 ? "С первой попытки! 🎉" : ""}`,
          sub: puzzle.explanation,
        });
        onSolved?.(misses);
        return true;
      }
      // Соперник защищается, как может, и ход снова наш.
      setBusy(true);
      setFeedback({ tone: "info", text: `${ruSan(played.san)} — верно! Соперник защищается…` });
      timer.current = setTimeout(() => {
        const reply = searchBest(played.fen, { depth: 2, timeMs: 400 }).uci;
        const after = reply ? playMove(played.fen, reply.slice(0, 2), reply.slice(2, 4), "q") : null;
        const fen = after?.fen ?? played.fen;
        setStep({ fen, matesLeft: left });
        setShown(fen);
        setLast(reply ? [reply.slice(0, 2), reply.slice(2, 4)] : null);
        setBusy(false);
        setFeedback({
          tone: "info",
          text: after ? `Соперник ответил ${ruSan(after.san)}.` : "Твой ход.",
          sub: left === 1 ? "Теперь поставь мат!" : `Осталось ${pluralize(left, "ход", "хода", "ходов")} до мата.`,
        });
      }, 700);
      return true;
    }
    const n = misses + 1;
    setMisses(n);
    chessPuzzleMiss(puzzle.id);
    if (!failed.current) {
      failed.current = true;
      onFailed?.();
    }
    setBusy(true);
    setFeedback({
      tone: "retry",
      text: played.mate
        ? "Это мат, но задача была другая — впрочем, засчитано!"
        : n === 1
          ? "Пока не то. Попробуй ещё раз."
          : n === 2
            ? "Ещё не то. Загляни в подсказку ниже."
            : "Подсвечена фигура, которой нужно ходить.",
      sub: n >= 2 ? puzzle.hint : undefined,
    });
    if (played.mate && step.matesLeft === 1) {
      // Любой мат в один ход — тоже решение.
      setDone(true);
      chessPuzzleSolved(puzzle.id, false);
      setBusy(false);
      onSolved?.(n);
      return true;
    }
    timer.current = setTimeout(() => {
      setShown(step.fen);
      setLast(null);
      setBusy(false);
    }, 900);
    return true;
  };

  const tap = (sq: string) => {
    if (done || busy || shown !== step.fen) return;
    const piece = pieceAt(step.fen, sq);
    if (piece && piece.color === solver) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected) attempt(selected, sq);
    else setSelected(null);
  };

  const marks: Record<string, SquareMark> = {};
  if (last) {
    marks[last[0]] = "last";
    marks[last[1]] = "last";
  }
  if (isInCheck(shown)) {
    const k = kingOf(shown, shown.split(" ")[1] as Color);
    if (k) marks[k] = "check";
  }
  if (hintFrom && !done) marks[hintFrom] = "hint";
  if (selected) {
    marks[selected] = "selected";
    for (const t of legalTargets(step.fen, selected)) marks[t] = pieceAt(step.fen, t) ? "capture" : "target";
  }

  const goal =
    puzzle.mateIn === 1
      ? "Поставь мат в 1 ход"
      : puzzle.mateIn === 2
        ? "Поставь мат в 2 хода"
        : puzzle.mateIn === 3
          ? "Поставь мат в 3 хода"
          : "Найди лучший ход";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-3">
        <ChessBoard
          id={`puzzle-${puzzle.id}`}
          position={shown}
          marks={marks}
          orientation={solver === "w" ? "white" : "black"}
          onSquare={tap}
          draggable={!done && !busy}
          onDrop={(from, to) => attempt(from, to)}
          arrows={hintTo && hintFrom && !done ? [{ from: hintFrom, to: hintTo, color: "#10b981" }] : []}
          maxWidth={480}
        />
        <Feedback state={feedback} />
      </div>
      <aside className="space-y-3">
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
            {STARS(puzzle.stars)} · {solver === "w" ? "ходят белые" : "ходят чёрные"}
          </p>
          <h2 className="mt-1 text-xl font-black">{puzzle.title}</h2>
          <p className="mt-1 text-lg font-bold text-brand-dark">{goal}</p>
          {puzzle.source && <p className="mt-1 text-xs text-muted">{puzzle.source}</p>}
          <p className="mt-2 text-sm text-muted">Нажми на фигуру, потом на клетку — или перетащи фигуру.</p>
        </div>
        {!done && misses < 2 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setMisses(2);
              setFeedback({ tone: "info", text: "Подсказка", sub: puzzle.hint });
            }}
          >
            💡 Подсказка
          </Button>
        )}
        {done && next && (
          <Button onClick={next.onClick} size="lg">
            {next.label}
          </Button>
        )}
      </aside>
    </div>
  );
}
