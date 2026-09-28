/**
 * Быстрая шахматная доска для робота и решателя задач (схема 0x88).
 * Правила для интерфейса проверяет chess.js; этот модуль нужен там, где ходов
 * приходится перебирать тысячи: поиск лучшего хода, мат в N ходов, тесты.
 * Клетка = ряд × 16 + столбец: a1 = 0, h1 = 7, a8 = 112.
 */

export const WHITE = 0;
export const BLACK = 1;
export type Side = 0 | 1;

/** Фигуры: 1 — пешка, 2 — конь, 3 — слон, 4 — ладья, 5 — ферзь, 6 — король. Чёрные — со знаком минус. */
export const PAWN = 1;
export const KNIGHT = 2;
export const BISHOP = 3;
export const ROOK = 4;
export const QUEEN = 5;
export const KING = 6;

const PIECE_CHARS = " pnbrqk";

export interface Move {
  from: number;
  to: number;
  /** Фигура, которая ходит (со знаком цвета). */
  piece: number;
  /** Взятая фигура (со знаком) или 0. */
  captured: number;
  /** Во что превращается пешка (тип без знака) или 0. */
  promo: number;
  /** Особые ходы: 1 — взятие на проходе, 2 — рокировка, 4 — ход пешки на две клетки. */
  special: number;
}

export interface Position {
  board: Int8Array;
  side: Side;
  /** Права на рокировку: 1 — белые короткая, 2 — белые длинная, 4 — чёрные короткая, 8 — чёрные длинная. */
  castling: number;
  /** Клетка взятия на проходе или -1. */
  ep: number;
  halfmove: number;
  fullmove: number;
  /** Клетки королей (или -1, если короля нет — учебные доски). */
  kings: [number, number];
}

interface Undo {
  captured: number;
  castling: number;
  ep: number;
  halfmove: number;
  kings: [number, number];
}

const KNIGHT_STEPS = [33, 31, 18, 14, -33, -31, -18, -14];
const BISHOP_STEPS = [17, 15, -17, -15];
const ROOK_STEPS = [16, -16, 1, -1];
const KING_STEPS = [...BISHOP_STEPS, ...ROOK_STEPS];

export const FILES = "abcdefgh";

export function sq(name: string): number {
  return (Number(name[1]) - 1) * 16 + FILES.indexOf(name[0]);
}

export function sqName(s: number): string {
  return `${FILES[s & 7]}${(s >> 4) + 1}`;
}

export function file(s: number): number {
  return s & 7;
}

export function rank(s: number): number {
  return s >> 4;
}

const onBoard = (s: number) => (s & 0x88) === 0;

export function parseFen(fen: string): Position {
  const [placement, side = "w", castling = "-", ep = "-", half = "0", full = "1"] = fen.trim().split(/\s+/);
  const board = new Int8Array(128);
  const kings: [number, number] = [-1, -1];
  let r = 7;
  let f = 0;
  for (const ch of placement) {
    if (ch === "/") {
      r--;
      f = 0;
      continue;
    }
    if (/\d/.test(ch)) {
      f += Number(ch);
      continue;
    }
    const type = PIECE_CHARS.indexOf(ch.toLowerCase());
    if (type <= 0) throw new Error(`Плохая запись позиции: ${fen}`);
    const s = r * 16 + f;
    const piece = ch === ch.toUpperCase() ? type : -type;
    board[s] = piece;
    if (type === KING) kings[piece > 0 ? WHITE : BLACK] = s;
    f++;
  }
  let rights = 0;
  if (castling.includes("K")) rights |= 1;
  if (castling.includes("Q")) rights |= 2;
  if (castling.includes("k")) rights |= 4;
  if (castling.includes("q")) rights |= 8;
  return {
    board,
    side: side === "b" ? BLACK : WHITE,
    castling: rights,
    ep: ep === "-" ? -1 : sq(ep),
    halfmove: Number(half),
    fullmove: Number(full),
    kings,
  };
}

export function toFen(pos: Position): string {
  const rows: string[] = [];
  for (let r = 7; r >= 0; r--) {
    let row = "";
    let empty = 0;
    for (let f = 0; f < 8; f++) {
      const p = pos.board[r * 16 + f];
      if (p === 0) {
        empty++;
        continue;
      }
      if (empty) row += empty;
      empty = 0;
      const ch = PIECE_CHARS[Math.abs(p)];
      row += p > 0 ? ch.toUpperCase() : ch;
    }
    if (empty) row += empty;
    rows.push(row);
  }
  const c =
    (pos.castling & 1 ? "K" : "") +
    (pos.castling & 2 ? "Q" : "") +
    (pos.castling & 4 ? "k" : "") +
    (pos.castling & 8 ? "q" : "");
  return `${rows.join("/")} ${pos.side === WHITE ? "w" : "b"} ${c || "-"} ${pos.ep < 0 ? "-" : sqName(pos.ep)} ${pos.halfmove} ${pos.fullmove}`;
}

export function clonePosition(pos: Position): Position {
  return { ...pos, board: new Int8Array(pos.board), kings: [pos.kings[0], pos.kings[1]] };
}

/** Бьёт ли сторона by клетку s. */
export function isAttacked(pos: Position, s: number, by: Side): boolean {
  const b = pos.board;
  const sign = by === WHITE ? 1 : -1;
  // Пешки: белая бьёт вверх, значит клетку s бьют белые пешки с s − 15 и s − 17.
  for (const d of by === WHITE ? [-15, -17] : [15, 17]) {
    const from = s + d;
    if (onBoard(from) && b[from] === sign * PAWN) return true;
  }
  for (const d of KNIGHT_STEPS) {
    const from = s + d;
    if (onBoard(from) && b[from] === sign * KNIGHT) return true;
  }
  for (const d of KING_STEPS) {
    const from = s + d;
    if (onBoard(from) && b[from] === sign * KING) return true;
  }
  for (const d of BISHOP_STEPS) {
    for (let from = s + d; onBoard(from); from += d) {
      const p = b[from];
      if (p === 0) continue;
      if (p === sign * BISHOP || p === sign * QUEEN) return true;
      break;
    }
  }
  for (const d of ROOK_STEPS) {
    for (let from = s + d; onBoard(from); from += d) {
      const p = b[from];
      if (p === 0) continue;
      if (p === sign * ROOK || p === sign * QUEEN) return true;
      break;
    }
  }
  return false;
}

export function inCheck(pos: Position, side: Side = pos.side): boolean {
  const k = pos.kings[side];
  return k >= 0 && isAttacked(pos, k, side === WHITE ? BLACK : WHITE);
}

function pseudoMoves(pos: Position): Move[] {
  const b = pos.board;
  const side = pos.side;
  const sign = side === WHITE ? 1 : -1;
  const out: Move[] = [];
  const add = (from: number, to: number, piece: number, captured: number, promo = 0, special = 0) =>
    out.push({ from, to, piece, captured, promo, special });
  for (let s = 0; s < 128; s++) {
    if (!onBoard(s)) continue;
    const p = b[s];
    if (p === 0 || Math.sign(p) !== sign) continue;
    const type = Math.abs(p);
    if (type === PAWN) {
      const dir = sign * 16;
      const startRank = side === WHITE ? 1 : 6;
      const lastRank = side === WHITE ? 7 : 0;
      const one = s + dir;
      if (onBoard(one) && b[one] === 0) {
        if (rank(one) === lastRank) for (const promo of [QUEEN, ROOK, BISHOP, KNIGHT]) add(s, one, p, 0, promo);
        else {
          add(s, one, p, 0);
          const two = s + 2 * dir;
          if (rank(s) === startRank && b[two] === 0) add(s, two, p, 0, 0, 4);
        }
      }
      for (const d of [dir + 1, dir - 1]) {
        const to = s + d;
        if (!onBoard(to)) continue;
        const target = b[to];
        if (target !== 0 && Math.sign(target) !== sign) {
          if (rank(to) === lastRank) for (const promo of [QUEEN, ROOK, BISHOP, KNIGHT]) add(s, to, p, target, promo);
          else add(s, to, p, target);
        } else if (to === pos.ep && target === 0) add(s, to, p, -sign * PAWN, 0, 1);
      }
      continue;
    }
    const steps =
      type === KNIGHT ? KNIGHT_STEPS : type === BISHOP ? BISHOP_STEPS : type === ROOK ? ROOK_STEPS : KING_STEPS;
    const slide = type === BISHOP || type === ROOK || type === QUEEN;
    for (const d of steps) {
      for (let to = s + d; onBoard(to); to += d) {
        const target = b[to];
        if (target === 0) add(s, to, p, 0);
        else {
          if (Math.sign(target) !== sign) add(s, to, p, target);
          break;
        }
        if (!slide) break;
      }
    }
    if (type === KING) {
      const enemy: Side = side === WHITE ? BLACK : WHITE;
      const home = side === WHITE ? 4 : 116;
      if (s === home && !isAttacked(pos, home, enemy)) {
        const kingSide = side === WHITE ? 1 : 4;
        const queenSide = side === WHITE ? 2 : 8;
        if (
          pos.castling & kingSide &&
          b[home + 1] === 0 &&
          b[home + 2] === 0 &&
          b[home + 3] === sign * ROOK &&
          !isAttacked(pos, home + 1, enemy) &&
          !isAttacked(pos, home + 2, enemy)
        )
          add(s, home + 2, p, 0, 0, 2);
        if (
          pos.castling & queenSide &&
          b[home - 1] === 0 &&
          b[home - 2] === 0 &&
          b[home - 3] === 0 &&
          b[home - 4] === sign * ROOK &&
          !isAttacked(pos, home - 1, enemy) &&
          !isAttacked(pos, home - 2, enemy)
        )
          add(s, home - 2, p, 0, 0, 2);
      }
    }
  }
  return out;
}

const CASTLE_MASK = (s: number): number => {
  switch (s) {
    case 0:
      return ~2;
    case 7:
      return ~1;
    case 4:
      return ~3;
    case 112:
      return ~8;
    case 119:
      return ~4;
    case 116:
      return ~12;
    default:
      return ~0;
  }
};

export function makeMove(pos: Position, m: Move): Undo {
  const b = pos.board;
  const undo: Undo = {
    captured: m.captured,
    castling: pos.castling,
    ep: pos.ep,
    halfmove: pos.halfmove,
    kings: [pos.kings[0], pos.kings[1]],
  };
  const sign = m.piece > 0 ? 1 : -1;
  b[m.from] = 0;
  b[m.to] = m.promo ? sign * m.promo : m.piece;
  if (m.special & 1) b[m.to - sign * 16] = 0;
  if (m.special & 2) {
    const kingSide = m.to > m.from;
    const rookFrom = kingSide ? m.to + 1 : m.to - 2;
    const rookTo = kingSide ? m.to - 1 : m.to + 1;
    b[rookTo] = b[rookFrom];
    b[rookFrom] = 0;
  }
  if (Math.abs(m.piece) === KING) pos.kings[pos.side] = m.to;
  pos.castling &= CASTLE_MASK(m.from) & CASTLE_MASK(m.to);
  pos.ep = m.special & 4 ? m.from + sign * 16 : -1;
  pos.halfmove = m.captured || Math.abs(m.piece) === PAWN ? 0 : pos.halfmove + 1;
  if (pos.side === BLACK) pos.fullmove++;
  pos.side = pos.side === WHITE ? BLACK : WHITE;
  return undo;
}

export function unmakeMove(pos: Position, m: Move, undo: Undo): void {
  const b = pos.board;
  pos.side = pos.side === WHITE ? BLACK : WHITE;
  if (pos.side === BLACK) pos.fullmove--;
  const sign = m.piece > 0 ? 1 : -1;
  b[m.from] = m.piece;
  b[m.to] = m.special & 1 ? 0 : m.captured;
  if (m.special & 1) b[m.to - sign * 16] = m.captured;
  if (m.special & 2) {
    const kingSide = m.to > m.from;
    const rookFrom = kingSide ? m.to + 1 : m.to - 2;
    const rookTo = kingSide ? m.to - 1 : m.to + 1;
    b[rookFrom] = b[rookTo];
    b[rookTo] = 0;
  }
  pos.castling = undo.castling;
  pos.ep = undo.ep;
  pos.halfmove = undo.halfmove;
  pos.kings = [undo.kings[0], undo.kings[1]];
}

/** Все возможные ходы стороны, чей ход (король не остаётся под шахом). */
export function legalMoves(pos: Position): Move[] {
  const out: Move[] = [];
  for (const m of pseudoMoves(pos)) {
    const undo = makeMove(pos, m);
    const side: Side = pos.side === WHITE ? BLACK : WHITE;
    if (!inCheck(pos, side)) out.push(m);
    unmakeMove(pos, m, undo);
  }
  return out;
}

export function moveToUci(m: Move): string {
  return `${sqName(m.from)}${sqName(m.to)}${m.promo ? PIECE_CHARS[m.promo] : ""}`;
}

export function findMove(pos: Position, uci: string): Move | null {
  return legalMoves(pos).find((m) => moveToUci(m) === uci) ?? null;
}

/** Число позиций на глубине depth — для проверки генератора ходов. */
export function perft(pos: Position, depth: number): number {
  if (depth === 0) return 1;
  let n = 0;
  for (const m of legalMoves(pos)) {
    const undo = makeMove(pos, m);
    n += perft(pos, depth - 1);
    unmakeMove(pos, m, undo);
  }
  return n;
}
