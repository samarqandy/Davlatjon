/**
 * Короткие шахматные тренажёры: «Кто в опасности?», «Запомни» и «Путь коня».
 * Здесь только расчёты — без React, чтобы их можно было проверить тестами.
 */
import { isInCheck, loadPosition, parseSquare, pieceTargets, PIECE_VALUE, squareName, type Color } from "./chess";

export type Rng = () => number;

/** Фигуры по клеткам: «e4» → «wN». */
export type BoardPieces = Record<string, string>;

const ALL_SQUARES = Array.from({ length: 64 }, (_, i) => squareName(i % 8, Math.floor(i / 8) + 1));

function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ---------------------------------------------------------------------------
// «Кто в опасности?»
// ---------------------------------------------------------------------------

/**
 * Фигуры стороны color в опасности: на них нападают, а защиты нет — или нападает фигура дешевле.
 * Король не считается: шах — отдельная история.
 */
export function piecesInDanger(fen: string, color: Color): string[] {
  const enemy: Color = color === "w" ? "b" : "w";
  const chess = loadPosition(fen);
  const out: string[] = [];
  for (const row of chess.board())
    for (const cell of row) {
      if (!cell || cell.color !== color || cell.type === "k") continue;
      const attackers = chess.attackers(cell.square, enemy);
      if (!attackers.length) continue;
      const defended = chess.attackers(cell.square, color).length > 0;
      const cheapest = Math.min(...attackers.map((a) => PIECE_VALUE[chess.get(a)!.type] || 100));
      if (!defended || cheapest < PIECE_VALUE[cell.type]) out.push(cell.square);
    }
  return out.sort();
}

/** Подходит ли позиция для вопроса: не шах и в опасности не больше трёх фигур. */
export function safetyQuestion(fen: string): { fen: string; color: Color; danger: string[] } | null {
  if (isInCheck(fen)) return null;
  const color = fen.split(" ")[1] as Color;
  const danger = piecesInDanger(fen, color);
  return danger.length <= 3 ? { fen, color, danger } : null;
}

// ---------------------------------------------------------------------------
// «Запомни»
// ---------------------------------------------------------------------------

const MEMORY_POOL = ["wK", "bK", "wQ", "bQ", "wR", "bR", "wB", "bB", "wN", "bN", "wP", "bP"];

export interface MemoryRound {
  pieces: BoardPieces;
  /** Про какую фигуру спросить и где она стоит. */
  ask: string;
  answer: string;
}

/** Несколько разных фигур на случайных клетках (пешки — не на крайних горизонталях). */
export function memoryRound(count: number, rng: Rng): MemoryRound {
  const kinds = shuffle(MEMORY_POOL, rng).slice(0, Math.min(count, MEMORY_POOL.length));
  const free = shuffle(ALL_SQUARES, rng);
  const pieces: BoardPieces = {};
  for (const k of kinds) {
    const i = free.findIndex((sq) => k[1] !== "P" || (sq[1] !== "1" && sq[1] !== "8"));
    pieces[free[i]] = k;
    free.splice(i, 1);
  }
  const answer = Object.keys(pieces)[Math.floor(rng() * kinds.length)];
  return { pieces, ask: pieces[answer], answer };
}

/** Сколько фигур в раунде и сколько секунд их показывать. */
export const MEMORY_ROUNDS = [3, 3, 4, 4, 5, 6] as const;
export const memorySeconds = (count: number) => count + 2;

// ---------------------------------------------------------------------------
// «Путь коня»
// ---------------------------------------------------------------------------

const BOARD = { cols: 8, rows: 8 };

/** Клетки, куда коню нельзя: сами чёрные пешки и клетки, которые они бьют. */
export function pawnDanger(pawns: readonly string[]): Set<string> {
  const out = new Set(pawns);
  for (const p of pawns) {
    const { col, row } = parseSquare(p);
    for (const dc of [-1, 1]) if (col + dc >= 0 && col + dc < 8 && row > 1) out.add(squareName(col + dc, row - 1));
  }
  return out;
}

/** Ходы коня с клетки, минуя запретные клетки. */
export function knightSteps(from: string, forbidden: ReadonlySet<string> = new Set()): string[] {
  return pieceTargets("n", from, BOARD).filter((sq) => !forbidden.has(sq));
}

/** Наименьшее число ходов коня от from до to (null — не добраться). */
export function knightDistance(from: string, to: string, forbidden: ReadonlySet<string> = new Set()): number | null {
  const dist = new Map([[from, 0]]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur === to) return dist.get(cur)!;
    for (const next of knightSteps(cur, forbidden)) {
      if (dist.has(next)) continue;
      dist.set(next, dist.get(cur)! + 1);
      queue.push(next);
    }
  }
  return null;
}

export interface KnightRound {
  start: string;
  target: string;
  pawns: string[];
  /** Самый короткий путь — столько ходов. */
  best: number;
}

/** Раунд «Путь коня»: с пешками или без, путь от двух до пяти ходов. */
export function knightRound(pawnCount: number, rng: Rng): KnightRound {
  for (;;) {
    const squares = shuffle(ALL_SQUARES, rng);
    const pawns = squares.slice(0, pawnCount).filter((sq) => sq[1] !== "1" && sq[1] !== "8");
    const forbidden = pawnDanger(pawns);
    const free = squares.filter((sq) => !forbidden.has(sq));
    const [start, target] = free;
    const best = start && target ? knightDistance(start, target, forbidden) : null;
    if (best !== null && best >= 2 && best <= 5) return { start, target, pawns, best };
  }
}

export const KNIGHT_ROUNDS = [0, 0, 0, 3, 4, 5] as const;

/** Звёзды за раунд: путь короче некуда — три, на ход длиннее — две, иначе одна. */
export const knightStars = (moves: number, best: number) => (moves <= best ? 3 : moves === best + 1 ? 2 : 1);
