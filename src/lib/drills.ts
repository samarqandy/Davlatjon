/** Тренажёр координат и записи ходов: задания и проверки без интерфейса. */
import { allMoves, isLightSquare, playMove, ruSan, sanOf, type PieceType } from "./chess";

export type DrillMode = "find" | "name" | "color" | "read";

export const DRILL_SECONDS: Record<DrillMode, number> = { find: 30, name: 30, color: 30, read: 60 };

const FILES = "abcdefgh";

export function randomSquare(rnd: () => number, not?: string): string {
  for (;;) {
    const sq = `${FILES[Math.floor(rnd() * 8)]}${Math.floor(rnd() * 8) + 1}`;
    if (sq !== not) return sq;
  }
}

/** Четыре варианта названия клетки: верный и три похожих (та же буква или та же цифра). */
export function squareOptions(answer: string, rnd: () => number): string[] {
  const near = new Set<string>();
  const f = FILES.indexOf(answer[0]);
  const r = Number(answer[1]);
  const cands = [
    `${FILES[(f + 1) % 8]}${r}`,
    `${FILES[(f + 7) % 8]}${r}`,
    `${answer[0]}${(r % 8) + 1}`,
    `${answer[0]}${((r + 6) % 8) + 1}`,
    `${FILES[7 - f]}${r}`,
    `${answer[0]}${9 - r}`,
  ].filter((c) => c !== answer);
  while (near.size < 3) near.add(cands[Math.floor(rnd() * cands.length)]);
  const all = [answer, ...near];
  return all
    .map((x) => ({ x, k: rnd() }))
    .sort((a, b) => a.k - b.k)
    .map((o) => o.x);
}

export function squareColor(sq: string): "light" | "dark" {
  return isLightSquare(sq) ? "light" : "dark";
}

export interface ReadTask {
  fen: string;
  uci: string;
  /** Запись хода по-русски: «Кf3», «Сxc6+», «0-0». */
  notation: string;
}

/** Позиция из нескольких случайных ходов и ход в ней, который надо прочитать и сделать. Чаще — ходы фигурами. */
export function readTask(rnd: () => number): ReadTask {
  for (let attempt = 0; attempt < 20; attempt++) {
    let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const plies = 4 + Math.floor(rnd() * 14);
    let ok = true;
    for (let i = 0; i < plies; i++) {
      const moves = allMoves(fen);
      if (!moves.length) {
        ok = false;
        break;
      }
      const u = moves[Math.floor(rnd() * moves.length)];
      const played = playMove(fen, u.slice(0, 2), u.slice(2, 4), (u[4] as PieceType) ?? "q");
      if (!played || played.mate) {
        ok = false;
        break;
      }
      fen = played.fen;
    }
    const moves = ok ? allMoves(fen) : [];
    if (!moves.length) continue;
    const withSan = moves.map((u) => ({ u, san: sanOf(fen, u) }));
    const pieces = withSan.filter((m) => /^[KQRBNO]/.test(m.san));
    const pool = pieces.length && rnd() < 0.75 ? pieces : withSan;
    const m = pool[Math.floor(rnd() * pool.length)];
    return { fen, uci: m.u, notation: ruSan(m.san) };
  }
  return { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", uci: "g1f3", notation: "Кf3" };
}

/** Верно ли сделан ход из задания (превращение — любое, если записи совпадают). */
export function readTaskSolved(task: ReadTask, from: string, to: string): boolean {
  return task.uci.slice(0, 4) === `${from}${to}`;
}
