/**
 * Робот: оценка позиции и поиск лучшего хода (альфа-бета с перебором взятий),
 * решатель «мат в N ходов» и правила пешечного боя.
 */
import {
  BISHOP,
  BLACK,
  KING,
  KNIGHT,
  PAWN,
  QUEEN,
  ROOK,
  WHITE,
  file,
  inCheck,
  legalMoves,
  makeMove,
  moveToUci,
  parseFen,
  rank,
  unmakeMove,
  type Move,
  type Position,
  type Side,
} from "./board";
import type { Lang } from "@/lib/lang";

export const MATE = 100000;
const VALUE = [0, 100, 320, 330, 500, 900, 0];

/** Таблицы «где фигуре хорошо стоять» (для белых, ряд 0 — первая горизонталь). */
const PST: Record<number, number[]> = {
  [PAWN]: [
    0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, -20, -20, 10, 10, 5, 5, -5, -10, 0, 0, -10, -5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5,
    5, 10, 25, 25, 10, 5, 5, 10, 10, 20, 30, 30, 20, 10, 10, 50, 50, 50, 50, 50, 50, 50, 50, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [KNIGHT]: [
    -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 5, 5, 0, -20, -40, -30, 5, 10, 15, 15, 10, 5, -30, -30, 0, 15,
    20, 20, 15, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 10, 15, 15, 10, 0, -30, -40, -20, 0, 0, 0, 0, -20, -40,
    -50, -40, -30, -30, -30, -30, -40, -50,
  ],
  [BISHOP]: [
    -20, -10, -10, -10, -10, -10, -10, -20, -10, 5, 0, 0, 0, 0, 5, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 0, 10,
    10, 10, 10, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 0, 0, 0, 0, 0, 0, -10, -20,
    -10, -10, -10, -10, -10, -10, -20,
  ],
  [ROOK]: [
    0, 0, 0, 5, 5, 0, 0, 0, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0,
    0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 5, 10, 10, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [QUEEN]: [
    -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 5, 0, 0, 0, 0, -10, -10, 5, 5, 5, 5, 5, 0, -10, 0, 0, 5, 5, 5, 5, 0,
    -5, -5, 0, 5, 5, 5, 5, 0, -5, -10, 0, 5, 5, 5, 5, 0, -10, -10, 0, 0, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10,
    -10, -20,
  ],
};
const KING_MIDDLE = [
  20, 30, 10, 0, 0, 10, 30, 20, 20, 20, 0, 0, 0, 0, 20, 20, -10, -20, -20, -20, -20, -20, -20, -10, -20, -30, -30, -40,
  -40, -30, -30, -20, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40,
  -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30,
];
const KING_END = [
  -50, -30, -30, -30, -30, -30, -30, -50, -30, -30, 0, 0, 0, 0, -30, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -10,
  30, 40, 40, 30, -10, -30, -30, -10, 30, 40, 40, 30, -10, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -20, -10, 0, 0,
  -10, -20, -30, -50, -40, -30, -20, -20, -30, -40, -50,
];

const idx = (s: number, side: Side) => (side === WHITE ? rank(s) : 7 - rank(s)) * 8 + file(s);

/** Оценка с точки зрения стороны, чей ход: плюс — ей хорошо. */
export function evaluate(pos: Position): number {
  let score = 0;
  let material = 0;
  const b = pos.board;
  for (let s = 0; s < 128; s++) {
    if (s & 0x88) continue;
    const p = b[s];
    if (p === 0) continue;
    const type = Math.abs(p);
    if (type !== KING && type !== PAWN) material += VALUE[type];
  }
  const endgame = material <= 1300;
  for (let s = 0; s < 128; s++) {
    if (s & 0x88) continue;
    const p = b[s];
    if (p === 0) continue;
    const side: Side = p > 0 ? WHITE : BLACK;
    const type = Math.abs(p);
    const table = type === KING ? (endgame ? KING_END : KING_MIDDLE) : PST[type];
    const v = VALUE[type] + table[idx(s, side)];
    score += side === WHITE ? v : -v;
  }
  return pos.side === WHITE ? score : -score;
}

/** Кто выиграл в обычных шахматах: «w», «b», «draw» или null, если игра идёт. */
export function gameResult(pos: Position): "w" | "b" | "draw" | null {
  if (legalMoves(pos).length === 0) return inCheck(pos) ? (pos.side === WHITE ? "b" : "w") : "draw";
  if (pos.halfmove >= 100) return "draw";
  return insufficientMaterial(pos) ? "draw" : null;
}

export function insufficientMaterial(pos: Position): boolean {
  const pieces: number[] = [];
  for (let s = 0; s < 128; s++) if (!(s & 0x88) && pos.board[s] !== 0) pieces.push(Math.abs(pos.board[s]));
  const others = pieces.filter((t) => t !== KING);
  if (others.length === 0) return true;
  if (others.length === 1 && (others[0] === KNIGHT || others[0] === BISHOP)) return true;
  return false;
}

interface SearchState {
  nodes: number;
  deadline: number;
  stopped: boolean;
}

function orderMoves(moves: Move[]): Move[] {
  return moves.sort((a, b) => {
    const va = (a.captured ? VALUE[Math.abs(a.captured)] * 10 - VALUE[Math.abs(a.piece)] : 0) + (a.promo ? 800 : 0);
    const vb = (b.captured ? VALUE[Math.abs(b.captured)] * 10 - VALUE[Math.abs(b.piece)] : 0) + (b.promo ? 800 : 0);
    return vb - va;
  });
}

/** Дострел взятий: не останавливаем поиск посреди размена. */
function quiesce(pos: Position, alpha: number, beta: number, st: SearchState, depth: number): number {
  st.nodes++;
  const stand = evaluate(pos);
  if (stand >= beta) return beta;
  if (stand > alpha) alpha = stand;
  if (depth === 0) return alpha;
  for (const m of orderMoves(legalMoves(pos).filter((x) => x.captured || x.promo))) {
    const undo = makeMove(pos, m);
    const score = -quiesce(pos, -beta, -alpha, st, depth - 1);
    unmakeMove(pos, m, undo);
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

function alphaBeta(pos: Position, depth: number, alpha: number, beta: number, ply: number, st: SearchState): number {
  if ((st.nodes & 1023) === 0 && Date.now() > st.deadline) st.stopped = true;
  if (st.stopped) return 0;
  const moves = orderMoves(legalMoves(pos));
  if (moves.length === 0) return inCheck(pos) ? -MATE + ply : 0;
  if (pos.halfmove >= 100) return 0;
  if (depth === 0) return quiesce(pos, alpha, beta, st, 4);
  st.nodes++;
  let best = -Infinity;
  for (const m of moves) {
    const undo = makeMove(pos, m);
    const score = -alphaBeta(pos, depth - 1, -beta, -alpha, ply + 1, st);
    unmakeMove(pos, m, undo);
    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }
  return best;
}

export interface SearchResult {
  move: Move | null;
  uci: string | null;
  score: number;
  depth: number;
  nodes: number;
}

/** Лучший ход: постепенно углубляем поиск, пока есть время. noise — случайная добавка к оценке хода (для слабых уровней). */
export function searchBest(
  fen: string,
  {
    depth = 3,
    timeMs = 1000,
    noise = 0,
    random = Math.random,
  }: { depth?: number; timeMs?: number; noise?: number; random?: () => number } = {},
): SearchResult {
  const pos = parseFen(fen);
  const moves = orderMoves(legalMoves(pos));
  if (moves.length === 0) return { move: null, uci: null, score: inCheck(pos) ? -MATE : 0, depth: 0, nodes: 0 };
  const st: SearchState = { nodes: 0, deadline: Date.now() + timeMs, stopped: false };
  const jitter = moves.map(() => (noise ? (random() * 2 - 1) * noise : 0));
  let best: SearchResult = { move: moves[0], uci: moveToUci(moves[0]), score: 0, depth: 0, nodes: 0 };
  for (let d = 1; d <= depth; d++) {
    let alpha = -Infinity;
    let bestMove = moves[0];
    let bestScore = -Infinity;
    for (const [i, m] of moves.entries()) {
      const undo = makeMove(pos, m);
      const score = -alphaBeta(pos, d - 1, -Infinity, -alpha, 1, st) + jitter[i];
      unmakeMove(pos, m, undo);
      if (st.stopped) break;
      if (score > bestScore) {
        bestScore = score;
        bestMove = m;
      }
      if (score > alpha) alpha = score;
    }
    if (st.stopped) break;
    best = { move: bestMove, uci: moveToUci(bestMove), score: bestScore, depth: d, nodes: st.nodes };
    // Ставим самый быстрый мат в нужном направлении и не тратим время зря.
    if (Math.abs(bestScore) > MATE - 100) break;
  }
  return best;
}

/** Все ходы стороны, чей ход, и оценка каждого поиском на глубину depth. */
export function scoreMoves(fen: string, depth = 2): { uci: string; score: number }[] {
  const pos = parseFen(fen);
  const st: SearchState = { nodes: 0, deadline: Date.now() + 60_000, stopped: false };
  return legalMoves(pos)
    .map((m) => {
      const undo = makeMove(pos, m);
      const score = -alphaBeta(pos, depth - 1, -Infinity, Infinity, 1, st);
      unmakeMove(pos, m, undo);
      return { uci: moveToUci(m), score };
    })
    .sort((a, b) => b.score - a.score);
}

/** Может ли сторона, чей ход, поставить мат не позже чем за n своих ходов при любой защите. */
function forcedMate(pos: Position, n: number): boolean {
  if (n === 0) return false;
  for (const m of legalMoves(pos)) {
    const undo = makeMove(pos, m);
    const ok = matedNow(pos) || (n > 1 && allRepliesLose(pos, n - 1));
    unmakeMove(pos, m, undo);
    if (ok) return true;
  }
  return false;
}

function matedNow(pos: Position): boolean {
  return inCheck(pos) && legalMoves(pos).length === 0;
}

/** После каждого ответа соперника у нас снова есть форсированный мат за n ходов. */
function allRepliesLose(pos: Position, n: number): boolean {
  const replies = legalMoves(pos);
  if (replies.length === 0) return false;
  for (const r of replies) {
    const undo = makeMove(pos, r);
    const ok = forcedMate(pos, n);
    unmakeMove(pos, r, undo);
    if (!ok) return false;
  }
  return true;
}

/** Ходы, которые форсированно ставят мат не позже чем за n ходов (запись «e2e4»). */
export function matingMovesIn(fen: string, n: number): string[] {
  const pos = parseFen(fen);
  const out: string[] = [];
  for (const m of legalMoves(pos)) {
    const undo = makeMove(pos, m);
    const ok = matedNow(pos) || (n > 1 && allRepliesLose(pos, n - 1));
    unmakeMove(pos, m, undo);
    if (ok) out.push(moveToUci(m));
  }
  return out;
}

/** Ход, который ставит мат прямо сейчас (или null). */
export function mateInOne(fen: string): string | null {
  return matingMovesIn(fen, 1)[0] ?? null;
}

// ---------------------------------------------------------------------------
// Пешечный бой: только пешки, побеждает тот, кто первым проведёт пешку.
// ---------------------------------------------------------------------------

export const PAWN_BATTLE_FEN = "8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1";

/** Кто победил в пешечном бою: сторона, чья пешка дошла до края, или та, у которой соперник не может ходить. */
export function pawnBattleResult(pos: Position): "w" | "b" | null {
  for (let f = 0; f < 8; f++) {
    if (pos.board[7 * 16 + f] > 0) return "w";
    if (pos.board[f] < 0) return "b";
  }
  if (legalMoves(pos).length === 0) return pos.side === WHITE ? "b" : "w";
  return null;
}

/** Оценка пешечного боя: продвинутые пешки и их количество. */
function evaluatePawns(pos: Position): number {
  let score = 0;
  for (let s = 0; s < 128; s++) {
    if (s & 0x88) continue;
    const p = pos.board[s];
    if (p > 0) score += 100 + rank(s) * rank(s) * 6;
    else if (p < 0) score -= 100 + (7 - rank(s)) * (7 - rank(s)) * 6;
  }
  return pos.side === WHITE ? score : -score;
}

function pawnSearch(pos: Position, depth: number, alpha: number, beta: number, ply: number): number {
  const result = pawnBattleResult(pos);
  if (result) return result === (pos.side === WHITE ? "w" : "b") ? MATE - ply : -MATE + ply;
  if (depth === 0) return evaluatePawns(pos);
  let best = -Infinity;
  for (const m of orderMoves(legalMoves(pos))) {
    const undo = makeMove(pos, m);
    const score = -pawnSearch(pos, depth - 1, -beta, -alpha, ply + 1);
    unmakeMove(pos, m, undo);
    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }
  return best;
}

export function pawnBattleBest(fen: string, depth = 4, random = Math.random): string | null {
  const pos = parseFen(fen);
  // Превращение здесь — победа, поэтому хватит одного варианта превращения.
  const moves = legalMoves(pos).filter((m) => !m.promo || m.promo === QUEEN);
  if (moves.length === 0) return null;
  let best: Move[] = [];
  let bestScore = -Infinity;
  for (const m of moves) {
    const undo = makeMove(pos, m);
    const score = -pawnSearch(pos, depth - 1, -Infinity, Infinity, 1);
    unmakeMove(pos, m, undo);
    if (score > bestScore) {
      bestScore = score;
      best = [m];
    } else if (score === bestScore) best.push(m);
  }
  return moveToUci(best[Math.floor(random() * best.length)]);
}

// ---------------------------------------------------------------------------
// Уровни робота
// ---------------------------------------------------------------------------

export interface RobotLevel {
  id: number;
  /** Название по фигуре: «Пешка» — самый слабый. */
  name: string;
  piece: string;
  about: string;
}

export const ROBOT_LEVELS: RobotLevel[] = [
  { id: 1, name: "Пешка", piece: "wP", about: "Ходит почти наугад, но иногда замечает мат." },
  { id: 2, name: "Конь", piece: "wN", about: "Берёт фигуры, которые плохо стоят, дальше одного хода не считает." },
  { id: 3, name: "Слон", piece: "wB", about: "Считает на два хода вперёд и не зевает фигуры просто так." },
  { id: 4, name: "Ладья", piece: "wR", about: "Считает на три хода вперёд. Уже соперник!" },
  { id: 5, name: "Ферзь", piece: "wQ", about: "Считает на четыре хода — сильнее многих взрослых любителей." },
];

/** Те же роботы по-узбекски: имена — по фигурам, как в шахматной школе. */
const ROBOT_TEXT_UZ: Record<number, { name: string; about: string }> = {
  1: { name: "Piyoda", about: "Deyarli tavakkaliga yuradi, lekin baʼzan motni payqab qoladi." },
  2: { name: "Ot", about: "Yomon turgan donalarni urib oladi, lekin bir yurishdan nariga hisoblamaydi." },
  3: { name: "Fil", about: "Ikki yurish oldinga hisoblaydi va donalarni bekorga boy bermaydi." },
  4: { name: "Rux", about: "Uch yurish oldinga hisoblaydi. Bu endi jiddiy raqib!" },
  5: { name: "Farzin", about: "Toʻrt yurish oldinga hisoblaydi — koʻp havaskor kattalardan kuchliroq." },
};

const ROBOT_LEVELS_UZ: RobotLevel[] = ROBOT_LEVELS.map((l) => ({ ...l, ...ROBOT_TEXT_UZ[l.id] }));

/** Уровни робота с именами и описаниями на нужном языке. */
export function robotLevels(lang: Lang = "ru"): RobotLevel[] {
  return lang === "uz" ? ROBOT_LEVELS_UZ : ROBOT_LEVELS;
}

/** Ход робота нужного уровня. */
export function robotMove(fen: string, level: number, random = Math.random): string | null {
  const pos = parseFen(fen);
  const moves = legalMoves(pos);
  if (moves.length === 0) return null;
  switch (level) {
    case 1: {
      const mate = mateInOne(fen);
      if (mate && random() < 0.5) return mate;
      return moveToUci(moves[Math.floor(random() * moves.length)]);
    }
    case 2:
      return searchBest(fen, { depth: 1, timeMs: 300, noise: 60, random }).uci;
    case 3:
      return searchBest(fen, { depth: 2, timeMs: 600, noise: 15, random }).uci;
    case 4:
      return searchBest(fen, { depth: 3, timeMs: 1200, noise: 5, random }).uci;
    default:
      return searchBest(fen, { depth: 4, timeMs: 2500, random }).uci;
  }
}
