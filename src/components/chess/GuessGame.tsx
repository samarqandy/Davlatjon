"use client";

import { useEffect, useMemo, useState } from "react";
import { Feedback, type FeedbackState } from "@/components/answers/Feedback";
import { Button } from "@/components/ui";
import type { FamousGame } from "@/content/chess/games";
import { legalTargets, pieceAt, playMove, type Color } from "@/lib/chess";
import { isAlmostBest } from "@/lib/engine/analysis";
import { useSan, useT } from "@/lib/i18n";
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
 * game — партия уже на языке интерфейса (имена игроков и комментарии).
 */
export function GuessGame({ game, onExit }: { game: FamousGame; onExit: () => void }) {
  const t = useT();
  const san = useSan();
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
      text = t(
        `${san(next.san)} — точно как ${hero.name}! +${points}`,
        `${san(next.san)} — xuddi ${hero.name} kabi! +${points}`,
      );
    } else if (isAlmostBest(fen, played.uci, histUci)) {
      points = 1;
      text = t(
        `${san(played.san)} — тоже сильный ход, +1. А ${hero.name} сыграл ${san(next.san)}.`,
        `${san(played.san)} — bu ham kuchli yurish, +1. ${hero.name} esa ${san(next.san)} yurgan edi.`,
      );
    } else {
      text = t(`${hero.name} сыграл ${san(next.san)}.`, `${hero.name} ${san(next.san)} yurgan edi.`);
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
    for (const sq of legalTargets(fen, selected)) marks[sq] = pieceAt(fen, sq) ? "capture" : "target";
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
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]" aria-label={t("Угадай ход", "Yurishni top")}>
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
          <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
            🎯 {t(`Сыграй как ${hero.name}`, `${hero.name} kabi oʻyna`)}
          </p>
          <p className="mt-1 text-3xl font-black text-brand-dark">
            {score} <span className="text-base text-muted">{t(`из ${max} очков`, `/ ${max} ochko`)}</span>
          </p>
          <p className="text-sm text-muted">
            {t(`Угадано точно: ${exact} из ${heroMoves}`, `Aniq topildi: ${exact} / ${heroMoves}`)}
            {best ? t(` · рекорд ${best.score}`, ` · rekord ${best.score}`) : ""}
          </p>
          <p className="mt-2 text-lg font-black" aria-live="polite">
            {done
              ? t("Партия окончена!", "Partiya tugadi!")
              : heroTurn
                ? t(
                    `Твой ход за ${hero.color === "w" ? "белых" : "чёрных"}: как сыграл бы ${hero.name}?`,
                    `${hero.color === "w" ? "Oqlar" : "Qoralar"} uchun yur: ${hero.name} bu yerda qanday yurgan boʻlardi?`,
                  )
                : t("Соперник думает…", "Raqib oʻylayapti…")}
          </p>
        </div>
        {done ? (
          <div className="rounded-2xl bg-sun-soft p-4">
            <p className="font-black">
              {score >= max * 0.7
                ? t(`🏆 Ты думаешь как ${hero.name}!`, `🏆 Sen ${hero.name} kabi fikrlaysan!`)
                : score >= max * 0.4
                  ? t("💪 Хорошо! Многие ходы найдены.", "💪 Yaxshi! Koʻp yurishlarni topding.")
                  : t(
                      "Эту партию стоит разобрать ещё раз — и попробовать снова.",
                      "Bu partiyani yana bir bor tahlil qilib chiq — keyin qaytadan urinib koʻr.",
                    )}
            </p>
            <p className="mt-1 text-sm">
              {t(
                `Точных попаданий: ${pluralize(exact, "ход", "хода", "ходов")} из ${heroMoves}.`,
                `Aniq topilgan yurishlar: ${exact} / ${heroMoves}.`,
              )}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" onClick={restart}>
                ↺ {t("Ещё раз", "Yana bir bor")}
              </Button>
              <Button size="sm" variant="secondary" onClick={onExit}>
                {t("К разбору партии", "Partiya tahliliga")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setHint(true)} disabled={!heroTurn || hint}>
              💡 {t("Какой фигурой? (1 очко)", "Qaysi dona bilan? (1 ochko)")}
            </Button>
            <Button size="sm" variant="ghost" onClick={onExit}>
              {t("Выйти", "Chiqish")}
            </Button>
          </div>
        )}
        <p className="text-sm text-muted">
          {t(
            "Точно как в партии — 3 очка, с подсказкой — 1. Если ход другой, но сильный — робот-тренер тоже даст 1 очко.",
            "Partiyadagidek yursang — 3 ochko, maslahat bilan — 1 ochko. Boshqa, lekin kuchli yurish qilsang ham robot-murabbiy 1 ochko beradi.",
          )}
        </p>
      </aside>
    </section>
  );
}
