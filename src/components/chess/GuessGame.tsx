"use client";

import { useEffect, useMemo, useState } from "react";
import { Feedback, type FeedbackState } from "@/components/answers/Feedback";
import { Button } from "@/components/ui";
import type { FamousGame } from "@/content/chess/games";
import { legalTargets, pieceAt, playMove, ruSan, type Color } from "@/lib/chess";
import { isAlmostBest } from "@/lib/engine/analysis";
import { pluralize } from "@/lib/plural";
import { chessGuessScored, useStore } from "@/lib/store";
import { ChessBoard, type SquareMark } from "./ChessBoard";
import { replayPositions } from "./GameReplay";

/** За кого играет ребёнок: за победителя, при ничьей — за белых. */
export function guessHero(game: FamousGame): { color: Color; name: string } {
  const color: Color = game.result === "0-1" ? "b" : "w";
  return { color, name: color === "w" ? game.white : game.black };
}

/**
 * «Сыграй как Морфи»: ребёнок угадывает ходы победителя знаменитой партии.
 * Точно как в партии — 3 очка, сильный ход по оценке движка — 1 очко. Ответы соперника делаются сами.
 */
export function GuessGame({ game, onExit }: { game: FamousGame; onExit: () => void }) {
  const positions = useMemo(() => replayPositions(game.moves), [game.moves]);
  const hero = guessHero(game);
  const total = game.moves.length;
  const heroMoves = positions.slice(1).filter((_, i) => (i % 2 === 0 ? "w" : "b") === hero.color).length;
  const max = heroMoves * 3;
  const best = useStore((s) => s.chessGuess[game.id]);
  const [ply, setPly] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [exact, setExact] = useState(0);

  const done = ply >= total;
  const fen = positions[ply].fen;
  const turn = fen.split(" ")[1] as Color;
  const heroTurn = !done && turn === hero.color;

  // Ходы соперника делаются сами.
  useEffect(() => {
    if (done || heroTurn) return;
    const t = setTimeout(() => setPly((p) => p + 1), 900);
    return () => clearTimeout(t);
  }, [done, heroTurn, ply]);

  useEffect(() => {
    if (done) chessGuessScored(game.id, score, max);
  }, [done, game.id, score, max]);

  const attempt = (from: string, to: string): boolean => {
    if (!heroTurn) return false;
    const played = playMove(fen, from, to, "q");
    if (!played) return false;
    const next = positions[ply + 1];
    const histUci = `${next.from}${next.to}`;
    const comment = game.comments[ply + 1];
    let points = 0;
    let text: string;
    if (played.uci.slice(0, 4) === histUci) {
      points = hint ? 1 : 3;
      setExact((e) => e + 1);
      text = `${ruSan(next.san)} — точно как ${hero.name}! +${points}`;
    } else if (isAlmostBest(fen, played.uci, histUci)) {
      points = 1;
      text = `${ruSan(played.san)} — тоже сильный ход, +1. А ${hero.name} сыграл ${ruSan(next.san)}.`;
    } else {
      text = `${hero.name} сыграл ${ruSan(next.san)}.`;
    }
    setScore((s) => s + points);
    setFeedback({ tone: points >= 3 ? "success" : points > 0 ? "info" : "retry", text, sub: comment });
    setSelected(null);
    setHint(false);
    setPly((p) => p + 1);
    return true;
  };

  const tap = (sq: string) => {
    if (!heroTurn) return;
    const piece = pieceAt(fen, sq);
    if (piece && piece.color === hero.color) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected) attempt(selected, sq);
  };

  const marks: Record<string, SquareMark> = {};
  if (ply > 0) {
    marks[positions[ply].from] = "last";
    marks[positions[ply].to] = "last";
  }
  if (hint && heroTurn) marks[positions[ply + 1].from] = "hint";
  if (selected) {
    marks[selected] = "selected";
    for (const t of legalTargets(fen, selected)) marks[t] = pieceAt(fen, t) ? "capture" : "target";
  }

  const restart = () => {
    setPly(0);
    setScore(0);
    setExact(0);
    setFeedback(null);
    setHint(false);
    setSelected(null);
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]" aria-label="Угадай ход">
      <div className="space-y-3">
        <ChessBoard
          id={`guess-${game.id}`}
          position={fen}
          marks={marks}
          orientation={hero.color === "w" ? "white" : "black"}
          onSquare={tap}
          draggable={heroTurn}
          onDrop={attempt}
          maxWidth={520}
        />
        <Feedback state={feedback} />
      </div>
      <aside className="space-y-3">
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <p className="text-xs font-extrabold tracking-wide text-muted uppercase">🎯 Сыграй как {hero.name}</p>
          <p className="mt-1 text-3xl font-black text-brand-dark">
            {score} <span className="text-base text-muted">из {max} очков</span>
          </p>
          <p className="text-sm text-muted">
            Угадано точно: {exact} из {heroMoves}
            {best ? ` · рекорд ${best.score}` : ""}
          </p>
          <p className="mt-2 text-lg font-black" aria-live="polite">
            {done
              ? "Партия окончена!"
              : heroTurn
                ? `Твой ход за ${hero.color === "w" ? "белых" : "чёрных"}: как сыграл бы ${hero.name}?`
                : "Соперник думает…"}
          </p>
        </div>
        {done ? (
          <div className="rounded-2xl bg-sun-soft p-4">
            <p className="font-black">
              {score >= max * 0.7
                ? `🏆 Ты думаешь как ${hero.name}!`
                : score >= max * 0.4
                  ? "💪 Хорошо! Многие ходы найдены."
                  : "Эту партию стоит разобрать ещё раз — и попробовать снова."}
            </p>
            <p className="mt-1 text-sm">
              Точных попаданий: {pluralize(exact, "ход", "хода", "ходов")} из {heroMoves}.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" onClick={restart}>
                ↺ Ещё раз
              </Button>
              <Button size="sm" variant="secondary" onClick={onExit}>
                К разбору партии
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setHint(true)} disabled={!heroTurn || hint}>
              💡 Какой фигурой? (1 очко)
            </Button>
            <Button size="sm" variant="ghost" onClick={onExit}>
              Выйти
            </Button>
          </div>
        )}
        <p className="text-sm text-muted">
          Точно как в партии — 3 очка, с подсказкой — 1. Если ход другой, но сильный — робот-тренер тоже даст 1 очко.
        </p>
      </aside>
    </section>
  );
}
