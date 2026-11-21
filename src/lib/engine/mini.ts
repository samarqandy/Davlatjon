/**
 * Мини-игры без королей (книга «Shaxmat shohnomasi», ряд 1; пробел 4 чертежа): фигуры против пешек и
 * «отряд против отряда». Правила одни для всех мини-игр:
 * - пешка, дошедшая до последней горизонтали, приносит победу своей стороне (превращения нет — игра кончается);
 * - кто забрал все фигуры соперника — победил;
 * - нет ходов — поражение (как в «пешечном бою»).
 * Королей нет, поэтому нет и шаха: на своём движке такие позиции разбираются честно, а chess.js их не загружает.
 */
import {
  BISHOP,
  KNIGHT,
  PAWN,
  QUEEN,
  ROOK,
  WHITE,
  legalMoves,
  makeMove,
  moveToUci,
  parseFen,
  rank,
  unmakeMove,
  type Move,
  type Position,
} from "./board";
import { MATE } from "./search";

const VALUE: Record<number, number> = { [PAWN]: 100, [KNIGHT]: 320, [BISHOP]: 330, [ROOK]: 500, [QUEEN]: 900 };

/** Итог мини-игры: сторона-победитель или null, пока игра идёт. */
export function miniResult(pos: Position): "w" | "b" | null {
  let white = 0;
  let black = 0;
  for (let s = 0; s < 128; s++) {
    if (s & 0x88) continue;
    const p = pos.board[s];
    if (p > 0) white++;
    else if (p < 0) black++;
    if (p === PAWN && rank(s) === 7) return "w";
    if (p === -PAWN && rank(s) === 0) return "b";
  }
  if (black === 0) return "w";
  if (white === 0) return "b";
  if (legalMoves(pos).length === 0) return pos.side === WHITE ? "b" : "w";
  return null;
}

/** Оценка для стороны, чей ход: сила фигур и продвинутость пешек (пешка у края почти равна победе). */
function evaluate(pos: Position): number {
  let score = 0;
  for (let s = 0; s < 128; s++) {
    if (s & 0x88) continue;
    const p = pos.board[s];
    if (p === 0) continue;
    const type = Math.abs(p);
    const steps = type === PAWN ? (p > 0 ? rank(s) : 7 - rank(s)) : 0;
    const v = VALUE[type] + steps * steps * 8;
    score += p > 0 ? v : -v;
  }
  return pos.side === WHITE ? score : -score;
}

/** Сначала взятия ценных фигур и ходы пешек вперёд — альфа-бета режет больше. */
function order(moves: Move[]): Move[] {
  return moves
    .map((m) => ({
      m,
      k:
        (m.captured ? VALUE[Math.abs(m.captured)] * 10 - VALUE[Math.abs(m.piece)] : 0) +
        (Math.abs(m.piece) === PAWN ? 1 : 0),
    }))
    .sort((a, b) => b.k - a.k)
    .map((x) => x.m);
}

/** Пешка на краю кончает игру победой — достаточно одного варианта такого хода. */
const moves = (pos: Position) => legalMoves(pos).filter((m) => !m.promo || m.promo === QUEEN);

/**
 * Ход по правилам мини-игры: пешка, дошедшая до края, остаётся пешкой (превращения нет — по ней и видна победа).
 * unmakeMove возвращает обе клетки сам, отдельно восстанавливать не нужно.
 */
function play(pos: Position, m: Move) {
  const undo = makeMove(pos, m);
  if (m.promo) pos.board[m.to] = m.piece;
  return undo;
}

function search(pos: Position, depth: number, alpha: number, beta: number, ply: number): number {
  const result = miniResult(pos);
  if (result) return result === (pos.side === WHITE ? "w" : "b") ? MATE - ply : -MATE + ply;
  if (depth === 0) return evaluate(pos);
  let best = -Infinity;
  for (const m of order(moves(pos))) {
    const undo = play(pos, m);
    const score = -search(pos, depth - 1, -beta, -alpha, ply + 1);
    unmakeMove(pos, m, undo);
    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }
  return best;
}

/** Ход робота в мини-игре: лучший на глубину depth, из равных — случайный. */
export function miniBest(fen: string, depth = 3, random = Math.random): string | null {
  const pos = parseFen(fen);
  const list = order(moves(pos));
  if (list.length === 0) return null;
  let best: Move[] = [];
  let bestScore = -Infinity;
  for (const m of list) {
    const undo = play(pos, m);
    const score = -search(pos, depth - 1, -Infinity, -bestScore + 1, 1);
    unmakeMove(pos, m, undo);
    if (score > bestScore) {
      bestScore = score;
      best = [m];
    } else if (score === bestScore) best.push(m);
  }
  return moveToUci(best[Math.floor(random() * best.length)]);
}
