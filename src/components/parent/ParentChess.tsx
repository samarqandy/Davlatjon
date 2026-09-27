"use client";

import Link from "next/link";
import { PieceIcon } from "@/components/chess/ChessBoard";
import { RichText } from "@/components/RichText";
import { Card, cn, ProgressBar } from "@/components/ui";
import { CHESS_LEVELS, chessLevelHref } from "@/content/chess";
import { FAMOUS_GAMES } from "@/content/chess/games";
import { OPENINGS } from "@/content/chess/openings";
import { PUZZLES, PUZZLE_THEMES } from "@/content/chess/puzzles";
import type { ChessExercise } from "@/content/chess/types";
import { ROBOT_LEVELS, matingMovesIn } from "@/lib/engine/search";
import { ENDGAMES } from "@/lib/play";
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

      <ActivitySummary />

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

const RESULT_LABEL = { win: "победа", loss: "поражение", draw: "ничья" } as const;

/** Игра с роботом, задачи, дебюты, партии и дневник — одним взглядом. */
function ActivitySummary() {
  const hydrated = useHydrated();
  const state = useStore((s) => s);
  if (!hydrated) return null;
  const games = state.chessGames;
  const byLevel = ROBOT_LEVELS.map((l) => {
    const list = games.filter((g) => g.mode === "robot" && g.level === l.id);
    return { level: l, games: list.length, wins: list.filter((g) => g.result === "win").length };
  }).filter((x) => x.games > 0);
  const endgames = ENDGAMES.map((v) => {
    const list = games.filter((g) => g.mode === "endgame" && g.variant === v.id);
    return {
      v,
      games: list.length,
      wins: list.filter((g) => g.result === "win").length,
      best: Math.min(...list.filter((g) => g.result === "win").map((g) => g.moves)),
    };
  }).filter((x) => x.games > 0);
  const pawns = games.filter((g) => g.mode === "pawns");
  const puzzleThemes = PUZZLE_THEMES.map((t) => {
    const list = PUZZLES.filter((p) => p.theme === t.id);
    const solved = list.filter((p) => state.chessPuzzles[p.id]?.solvedAt).length;
    const misses = list.reduce((s, p) => s + (state.chessPuzzles[p.id]?.misses ?? 0), 0);
    return { t, total: list.length, solved, misses };
  });
  const openingsLearned = Object.keys(state.chessOpenings).map((k) => {
    const [id, side] = k.split(":");
    return `${OPENINGS.find((o) => o.id === id)?.name ?? id} (${side === "white" ? "белыми" : "чёрными"})`;
  });
  const viewed = Object.keys(state.chessGamesViewed).map((id) => FAMOUS_GAMES.find((g) => g.id === id)?.title ?? id);
  const puzzleAnswers = PUZZLES.map((p) => ({
    p,
    answer: p.mateIn
      ? matingMovesIn(p.fen, p.mateIn)
          .map((u) => ruSan(sanOf(p.fen, u)))
          .join(" / ")
      : (p.solution ?? []).map((u) => ruSan(sanOf(p.fen, u))).join(" / "),
  }));

  return (
    <section className="space-y-3" aria-labelledby="pc-activity">
      <h2 id="pc-activity" className="text-xl font-black">
        Игра, задачи, дебюты и партии
      </h2>
      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="p-4">
          <p className="text-sm font-extrabold text-muted">🤖 Партии с роботом</p>
          {games.length === 0 && <p className="mt-1 text-muted">Ещё не играл.</p>}
          <ul className="mt-1 space-y-1 text-[0.95rem]">
            {byLevel.map((x) => (
              <li key={x.level.id}>
                Робот «{x.level.name}»: сыграно {x.games}, побед {x.wins}
              </li>
            ))}
            {pawns.length > 0 && (
              <li>
                Пешечный бой: сыграно {pawns.length}, побед {pawns.filter((g) => g.result === "win").length}
              </li>
            )}
            {endgames.map((x) => (
              <li key={x.v.id}>
                {x.v.name}: попыток {x.games}, поставлено матов {x.wins}
                {x.wins > 0 && ` · быстрее всего — за ${pluralize(x.best, "ход", "хода", "ходов")}`}
              </li>
            ))}
          </ul>
          {games.length > 0 && (
            <p className="mt-2 text-xs text-muted">
              Последняя партия: {RESULT_LABEL[games[0].result]}, {games[0].moves} ходов,{" "}
              {new Date(games[0].at).toLocaleDateString("ru-RU")}.
            </p>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-sm font-extrabold text-muted">🎯 Задачи · лучшая серия: {state.chessStreak}</p>
          <ul className="mt-1 space-y-1 text-[0.95rem]">
            {puzzleThemes.map((x) => (
              <li key={x.t.id} className="flex flex-wrap gap-x-2">
                <span className="font-bold">{x.t.name}:</span> решено {x.solved} из {x.total}
                {x.misses > 0 && <span className="text-muted">· попыток не сошлось: {x.misses}</span>}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-extrabold text-muted">📖 Дебюты и партии</p>
          <p className="mt-1 text-[0.95rem]">
            Выучено в тренажёре: {openingsLearned.length ? openingsLearned.join(", ") : "пока ничего"}.
          </p>
          <p className="mt-1 text-[0.95rem]">
            Разобрано до конца: {viewed.length ? viewed.join(", ") : "пока ничего"}.
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-extrabold text-muted">✍️ Дневник партий</p>
          {state.chessDiary.length === 0 && <p className="mt-1 text-muted">Записей нет.</p>}
          <ul className="mt-1 space-y-1 text-[0.95rem]">
            {state.chessDiary.slice(0, 6).map((e) => (
              <li key={e.id}>
                {e.date} · с {e.opponent} · {RESULT_LABEL[e.result]}
                {e.notes && <span className="text-muted"> — {e.notes}</span>}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <details className="rounded-2xl bg-white p-4 shadow-card">
        <summary className="cursor-pointer text-sm font-extrabold text-brand">
          Ответы ко всем задачам тренажёра ({PUZZLES.length})
        </summary>
        <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
          {puzzleAnswers.map(({ p, answer }) => (
            <li key={p.id}>
              <b>{p.title}</b> ({"⭐".repeat(p.stars)}): {answer}
              {state.chessPuzzles[p.id]?.solvedAt ? " ✅" : ""}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
