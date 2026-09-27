"use client";

import Link from "next/link";
import { PieceIcon } from "@/components/chess/ChessBoard";
import { RichText } from "@/components/RichText";
import { Card, cn, ProgressBar } from "@/components/ui";
import { CHESS_LEVELS, chessLevelHref } from "@/content/chess";
import type { ChessExercise } from "@/content/chess/types";
import { matingMoves, ruSan, sanOf } from "@/lib/chess";
import { currentRank, levelStatuses } from "@/lib/chessProgress";
import { pluralize } from "@/lib/plural";
import { updateSettings, useHydrated, useStore, type ChessExerciseProgress } from "@/lib/store";

const KIND_LABEL: Record<ChessExercise["kind"], string> = {
  squares: "Имена клеток",
  moves: "Ходы фигуры",
  stars: "Звёздочки",
  move: "Найди ход",
  pick: "Найди на доске",
  quiz: "Вопросы",
  queens: "Расстановка ферзей",
};

/** Ключ ответа для родителя. */
function answerOf(e: ChessExercise): string {
  switch (e.kind) {
    case "squares":
      return `Клетки по порядку: ${e.targets.join(", ")}.`;
    case "moves":
      return `${pluralize(e.answer.length, "клетка", "клетки", "клеток")}: ${e.answer.join(", ")}.`;
    case "stars":
      return `Меньше всего — ${pluralize(e.optimal, "ход", "хода", "ходов")}.`;
    case "move": {
      const moves = e.goal === "mate" ? matingMoves(e.fen) : e.solutions;
      return `Ход: ${moves.map((u) => ruSan(sanOf(e.fen, u))).join(" или ")}.`;
    }
    case "pick":
      return `Клетка ${e.answer.join(", ")}.`;
    case "quiz":
      return e.questions.map((q, i) => `${i + 1}) ${q.options[q.correct]}`).join("; ");
    case "queens":
      return `Доска ${e.size} × ${e.size}: ферзи не должны стоять на одной линии.`;
  }
}

function status(p: ChessExerciseProgress | undefined, e: ChessExercise): string {
  if (!p) return "не начато";
  const parts = [p.solvedAt ? "✅ решено" : "⏳ ещё не решено"];
  if (p.misses) parts.push(`попыток не сошлось: ${p.misses}`);
  if (e.kind === "stars" && p.best !== undefined)
    parts.push(
      `лучший результат: ${pluralize(p.best, "ход", "хода", "ходов")}${p.best <= e.optimal ? " — лучше не бывает" : ""}`,
    );
  if (e.kind === "queens" && p.found?.length) parts.push(`найдено решений: ${p.found.length}`);
  return parts.join(" · ");
}

export function ParentChess() {
  const hydrated = useHydrated();
  const state = useStore((s) => s);
  const statuses = levelStatuses(CHESS_LEVELS, state);
  const rank = hydrated ? currentRank(CHESS_LEVELS, state) : null;

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-6">
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Шахматная школа</p>
        <h1 className="text-3xl font-black">Шахматы: прогресс и ответы</h1>
        <p className="mt-1 max-w-3xl text-muted">
          Шесть уровней-званий: Пешка, Конь, Слон, Ладья, Ферзь, Король. На каждом уровне — урок, правила, словарик,
          интересные факты и упражнения. Все позиции проверены шахматной библиотекой chess.js. Следующий уровень
          открывается, когда решены все упражнения предыдущего.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="text-lg font-black">Звание: {rank ? `${rank.name} (${rank.uz})` : "пока нет"}</p>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#4f46e5]"
              checked={state.settings.chessOpenAll === true}
              onChange={(e) => updateSettings({ chessOpenAll: e.target.checked })}
            />
            Открыть все уровни сразу
          </label>
        </div>
      </Card>

      {CHESS_LEVELS.map((level, i) => {
        const st = statuses[i];
        return (
          <section key={level.id} className="space-y-3" aria-labelledby={`pc-${level.id}`}>
            <div className="flex flex-wrap items-center gap-3">
              <PieceIcon piece={level.piece} className="h-12 w-12 rounded-xl bg-[#f0d9b5] p-0.5" />
              <div className="min-w-0">
                <h2 id={`pc-${level.id}`} className="text-xl font-black">
                  Уровень {level.order}. {level.name}{" "}
                  <span className="text-base font-bold text-muted">· {level.uz}</span>
                </h2>
                <p className="text-sm text-muted">{level.title}</p>
              </div>
              <div className="ml-auto flex min-w-48 items-center gap-2">
                <ProgressBar value={hydrated ? st.solved : 0} max={st.total} className="flex-1" />
                <span className="text-sm font-extrabold whitespace-nowrap">
                  {hydrated ? st.solved : 0} из {st.total}
                </span>
              </div>
              <Link href={chessLevelHref(level.id)} className="text-sm font-extrabold text-brand hover:underline">
                Открыть уровень →
              </Link>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {level.exercises.map((e, n) => {
                const p = hydrated ? state.chess[e.id] : undefined;
                return (
                  <Card key={e.id} className={cn("space-y-1.5 p-4", !!p?.solvedAt && "border-2 border-mint/30")}>
                    <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
                      {n + 1}. {KIND_LABEL[e.kind]}
                    </p>
                    <p className="text-lg font-black">{e.title}</p>
                    <p className="font-bold text-brand-dark">{answerOf(e)}</p>
                    <p className="text-[0.95rem]">
                      <RichText text={e.why} />
                    </p>
                    <p className="text-sm font-bold text-muted">{status(p, e)}</p>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
