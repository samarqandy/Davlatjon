import { Chess, type Square } from "chess.js";

/**
 * Шахматная логика школы. Правила настоящих позиций проверяет библиотека chess.js,
 * а для учебных досок (звёздочки, мини-доски, ферзи) — простые правила ходов ниже.
 */

export type PieceType = "p" | "n" | "b" | "r" | "q" | "k";
export type Color = "w" | "b";

export const FILES = "abcdefghijklmnop";

/** Ценность фигур в пешках. */
export const PIECE_VALUE: Record<PieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

export const PIECE_NAME: Record<PieceType, string> = {
  p: "пешка",
  n: "конь",
  b: "слон",
  r: "ладья",
  q: "ферзь",
  k: "король",
};

/** Те же названия по-узбекски. */
export const PIECE_NAME_UZ: Record<PieceType, string> = {
  p: "piyoda",
  n: "ot",
  b: "fil",
  r: "rux",
  q: "farzin",
  k: "shoh",
};

/** Клетка по номеру столбца (с 0) и горизонтали (с 1). */
export function squareName(col: number, row: number): string {
  return `${FILES[col]}${row}`;
}

export function parseSquare(square: string): { col: number; row: number } {
  return { col: FILES.indexOf(square[0]), row: Number(square.slice(1)) };
}

/** Светлая ли клетка: a1 — тёмная, h1 — светлая. */
export function isLightSquare(square: string): boolean {
  const { col, row } = parseSquare(square);
  return (col + row - 1) % 2 === 1;
}

/** Позиция без проверки «правильности» (на учебной доске может не быть королей). */
export function loadPosition(fen: string): Chess {
  return new Chess(fen, { skipValidation: true });
}

/** Та же позиция, но ход — у стороны color. */
export function withTurn(fen: string, color: Color): string {
  const parts = fen.split(" ");
  parts[1] = color;
  // При смене очереди взятие на проходе теряет смысл.
  if (parts[3]) parts[3] = "-";
  return parts.join(" ");
}

export function pieceAt(fen: string, square: string): { type: PieceType; color: Color } | null {
  const p = loadPosition(fen).get(square as Square);
  return p ? { type: p.type, color: p.color } : null;
}

/** Все клетки, куда по правилам может пойти фигура с клетки from. */
export function legalTargets(fen: string, from: string): string[] {
  const piece = pieceAt(fen, from);
  if (!piece) return [];
  const chess = loadPosition(fen.split(" ")[1] === piece.color ? fen : withTurn(fen, piece.color));
  const targets = chess.moves({ square: from as Square, verbose: true }).map((m) => m.to as string);
  return [...new Set(targets)].sort();
}

export interface PlayedMove {
  /** Позиция после хода. */
  fen: string;
  san: string;
  uci: string;
  captured: PieceType | null;
  check: boolean;
  mate: boolean;
  stalemate: boolean;
}

/** Сделать ход, если он возможен. Пешка по умолчанию превращается в ферзя. */
export function playMove(fen: string, from: string, to: string, promotion: PieceType = "q"): PlayedMove | null {
  const chess = loadPosition(fen);
  const legal = chess.moves({ square: from as Square, verbose: true }).filter((m) => m.to === to);
  if (legal.length === 0) return null;
  const chosen = legal.find((m) => !m.promotion || m.promotion === promotion) ?? legal[0];
  const m = chess.move({ from: chosen.from, to: chosen.to, promotion: chosen.promotion });
  return {
    fen: chess.fen(),
    san: m.san,
    uci: `${m.from}${m.to}${m.promotion ?? ""}`,
    captured: (m.captured as PieceType | undefined) ?? null,
    check: chess.inCheck(),
    mate: chess.isCheckmate(),
    stalemate: chess.isStalemate(),
  };
}

/** Стоит ли король стороны, чей ход, под шахом. */
export function isInCheck(fen: string): boolean {
  return loadPosition(fen).inCheck();
}

/** Все возможные ходы стороны, чей ход, в записи «откуда-куда» (e2e4, e7e8q). */
export function allMoves(fen: string): string[] {
  return loadPosition(fen)
    .moves({ verbose: true })
    .map((m) => `${m.from}${m.to}${m.promotion ?? ""}`);
}

/** Ходы, которые ставят мат. */
export function matingMoves(fen: string): string[] {
  return allMoves(fen).filter((u) => playMove(fen, u.slice(0, 2), u.slice(2, 4), (u[4] as PieceType) ?? "q")?.mate);
}

/** Международная запись хода (Re8#). */
export function sanOf(fen: string, uci: string): string {
  return playMove(fen, uci.slice(0, 2), uci.slice(2, 4), (uci[4] as PieceType) ?? "q")?.san ?? uci;
}

const RU_LETTER: Record<string, string> = { K: "Кр", Q: "Ф", R: "Л", B: "С", N: "К" };

/** Русская запись хода: буквы фигур — Кр, Ф, Л, С, К; рокировка — 0-0. «Re8#» → «Лe8#». */
export function ruSan(san: string): string {
  if (san.startsWith("O-O")) return san.replace(/O/g, "0");
  return san.replace(/^[KQRBN]/, (l) => RU_LETTER[l]).replace(/=([QRBN])/, (_, l: string) => `=${RU_LETTER[l]}`);
}

/** Кто нападает на клетку: клетки фигур цвета by. */
export function attackersOf(fen: string, square: string, by: Color): string[] {
  return loadPosition(fen)
    .attackers(square as Square, by)
    .map((s) => s as string)
    .sort();
}

/** Клетка короля цвета color. */
export function kingSquare(fen: string, color: Color): string | null {
  const board = loadPosition(fen).board();
  for (const row of board)
    for (const cell of row) if (cell && cell.type === "k" && cell.color === color) return cell.square;
  return null;
}

// ---------------------------------------------------------------------------
// Учебная доска любого размера: звёздочки и ферзи
// ---------------------------------------------------------------------------

export interface BoardSize {
  cols: number;
  rows: number;
}

const STEPS: Record<"n" | "b" | "r" | "k", [number, number][]> = {
  n: [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2],
  ],
  b: [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
  ],
  r: [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ],
  k: [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ],
};

/**
 * Куда фигура может пойти на пустой доске size, если клетки blocked заняты своими фигурами
 * (через них нельзя пройти и на них нельзя встать).
 */
export function pieceTargets(
  type: Exclude<PieceType, "p">,
  from: string,
  size: BoardSize,
  blocked: ReadonlySet<string> = new Set(),
): string[] {
  const { col, row } = parseSquare(from);
  const inside = (c: number, r: number) => c >= 0 && r >= 1 && c < size.cols && r <= size.rows;
  const out: string[] = [];
  const jump = type === "n" || type === "k";
  const dirs = type === "q" ? [...STEPS.b, ...STEPS.r] : STEPS[type];
  for (const [dc, dr] of dirs) {
    let c = col + dc;
    let r = row + dr;
    while (inside(c, r) && !blocked.has(squareName(c, r))) {
      out.push(squareName(c, r));
      if (jump) break;
      c += dc;
      r += dr;
    }
  }
  return out.sort();
}

export interface StarsPuzzle {
  size: BoardSize;
  piece: Exclude<PieceType, "p">;
  start: string;
  stars: string[];
  blocks?: string[];
}

/**
 * Самый короткий путь, чтобы собрать все звёздочки (звезда собрана, когда фигура на неё встала).
 * Возвращает клетки, на которые фигура ходила, или null, если собрать нельзя.
 */
export function shortestStarsPath(p: StarsPuzzle): string[] | null {
  const blocked = new Set(p.blocks ?? []);
  const all = (1 << p.stars.length) - 1;
  const bit = (sq: string) => {
    const i = p.stars.indexOf(sq);
    return i < 0 ? 0 : 1 << i;
  };
  const key = (sq: string, mask: number) => `${sq}|${mask}`;
  const start = { sq: p.start, mask: bit(p.start) };
  const prev = new Map<string, string | null>([[key(start.sq, start.mask), null]]);
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur.mask === all) {
      const path: string[] = [];
      let k: string | null = key(cur.sq, cur.mask);
      while (k) {
        path.unshift(k.split("|")[0]);
        k = prev.get(k) ?? null;
      }
      return path.slice(1);
    }
    for (const to of pieceTargets(p.piece, cur.sq, p.size, blocked)) {
      const next = { sq: to, mask: cur.mask | bit(to) };
      const k = key(next.sq, next.mask);
      if (prev.has(k)) continue;
      prev.set(k, key(cur.sq, cur.mask));
      queue.push(next);
    }
  }
  return null;
}

/** Бьют ли друг друга два ферзя. */
export function queensAttack(a: string, b: string): boolean {
  const pa = parseSquare(a);
  const pb = parseSquare(b);
  return pa.col === pb.col || pa.row === pb.row || Math.abs(pa.col - pb.col) === Math.abs(pa.row - pb.row);
}

/** Ферзи, которые бьют хотя бы одного другого ферзя. */
export function queensInConflict(queens: readonly string[]): string[] {
  return queens.filter((q) => queens.some((o) => o !== q && queensAttack(q, o)));
}

/** Все расстановки n ферзей на доске n × n, где никто никого не бьёт. */
export function queensSolutions(n: number): string[][] {
  const out: string[][] = [];
  const place = (col: number, placed: string[]) => {
    if (col === n) {
      out.push([...placed]);
      return;
    }
    for (let row = 1; row <= n; row++) {
      const sq = squareName(col, row);
      if (placed.every((q) => !queensAttack(q, sq))) place(col + 1, [...placed, sq]);
    }
  };
  place(0, []);
  return out;
}
