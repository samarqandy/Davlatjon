/**
 * Чистые помощники для доски: подписи клеток на рамке и что произошло на доске (для звука хода).
 * Без React — чтобы проверять тестами.
 */
import { Chess, type Color, type Square } from "chess.js";
import { FILES } from "./chess";

export type Orientation = "white" | "black";

/**
 * Подписи на рамке: буквы — снизу слева направо, цифры — слева сверху вниз.
 * Доска может быть и не 8 × 8 (задача о ферзях N × N); у чёрных всё наоборот.
 */
export function coordLabels(
  cols: number,
  rows: number,
  orientation: Orientation,
): { files: string[]; ranks: string[] } {
  const files = FILES.slice(0, cols).split("");
  const ranks = Array.from({ length: rows }, (_, i) => String(rows - i));
  return orientation === "black" ? { files: files.reverse(), ranks: ranks.reverse() } : { files, ranks };
}

/** Доски уже этой ширины — значки в карточках: подписи там только мешают. */
export const COORDS_MIN_WIDTH = 240;

/** Что стоит на клетках: «e4» → «wP», «bK», «star». */
export type Snapshot = Record<string, string>;

const FEN_PIECE: Record<string, string> = {
  p: "bP",
  n: "bN",
  b: "bB",
  r: "bR",
  q: "bQ",
  k: "bK",
  P: "wP",
  N: "wN",
  B: "wB",
  R: "wR",
  Q: "wQ",
  K: "wK",
};

/** Снимок доски из FEN (любого размера: пустые клетки могут быть числом из нескольких цифр) или набора фигур. */
export function snapshotOf(position: string | Record<string, string>, cols = 8): Snapshot {
  if (typeof position !== "string") return { ...position };
  const out: Snapshot = {};
  const rows = position.split(" ")[0].split("/");
  rows.forEach((row, i) => {
    const rank = rows.length - i;
    let file = 0;
    for (const m of row.matchAll(/(\d+)|([a-zA-Z])/g)) {
      if (m[1]) file += Number(m[1]);
      else {
        if (file < cols && FEN_PIECE[m[2]]) out[`${FILES[file]}${rank}`] = FEN_PIECE[m[2]];
        file++;
      }
    }
  });
  return out;
}

export type BoardEventKind = "move" | "capture" | "castle" | "promote" | "collect";
export interface BoardEvent {
  kind: BoardEventKind;
  /** После хода король соперника под шахом. */
  check: boolean;
}

const colorOf = (piece: string | undefined) => (piece && piece !== "star" ? piece[0] : undefined);
const isPawn = (piece: string | undefined) => !!piece && piece.endsWith("P");
const same = (a: Snapshot, b: Snapshot) => {
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
};

/**
 * Что произошло между двумя снимками — чтобы доска сама выбрала звук.
 * Новая позиция (другая задача, сброс), возврат после ошибки или взятие хода назад — без звука.
 */
export function classifyChange(
  prev: Snapshot | null,
  next: Snapshot,
  o: { fen?: string; rows?: number; cols?: number; before?: Snapshot | null } = {},
): BoardEvent | null {
  if (!prev || same(prev, next) || (o.before && same(o.before, next))) return null;
  if (Object.keys(next).length > Object.keys(prev).length) return null;
  const squares = new Set([...Object.keys(prev), ...Object.keys(next)]);
  const emptied: string[] = [];
  const filled: string[] = [];
  const replaced: string[] = [];
  for (const sq of squares) {
    const a = prev[sq];
    const b = next[sq];
    if (a === b) continue;
    if (a && !b) emptied.push(sq);
    else if (!a && b) filled.push(sq);
    else replaced.push(sq);
  }
  if (emptied.length + filled.length + replaced.length > 4) return null;

  let kind: BoardEventKind | null = null;
  let to: string | undefined;
  if (emptied.length === 1 && filled.length === 1 && replaced.length === 0) {
    const [from] = emptied;
    to = filled[0];
    const mover = prev[from];
    const landed = next[to];
    if (landed === mover) kind = "move";
    else if (isPawn(mover) && colorOf(landed) === colorOf(mover)) kind = "promote";
  } else if (emptied.length === 1 && replaced.length === 1 && filled.length === 0) {
    const [from] = emptied;
    to = replaced[0];
    const mover = prev[from];
    const victim = prev[to];
    const landed = next[to];
    if (victim === "star") kind = "collect";
    else if (colorOf(landed) === colorOf(mover) && colorOf(victim) !== colorOf(mover))
      kind = landed !== mover && isPawn(mover) ? "promote" : "capture";
  } else if (emptied.length === 2 && filled.length === 1 && replaced.length === 0) {
    to = filled[0];
    const landed = next[to];
    if (isPawn(landed) && emptied.some((sq) => prev[sq] === landed)) kind = "capture";
  } else if (emptied.length === 2 && filled.length === 2 && replaced.length === 0) {
    const moved = filled.map((sq) => next[sq]).sort();
    const color = colorOf(moved[0]);
    if (color && moved[0] === `${color}K` && moved[1] === `${color}R`) {
      kind = "castle";
      to = filled.find((sq) => next[sq] === `${color}K`);
    }
  }
  if (!kind || !to) return null;
  return { kind, check: givesCheck(next, colorOf(next[to]), o) };
}

/** Шах проверяем только на обычной доске с двумя королями: в упражнениях бывают позиции без короля и «звёздочки». */
function givesCheck(
  next: Snapshot,
  mover: string | undefined,
  o: { fen?: string; rows?: number; cols?: number },
): boolean {
  if (!o.fen || !mover || (o.rows ?? 8) !== 8 || (o.cols ?? 8) !== 8) return false;
  const pieces = Object.values(next);
  if (pieces.includes("star")) return false;
  if (pieces.filter((p) => p === "wK").length !== 1 || pieces.filter((p) => p === "bK").length !== 1) return false;
  const enemyKing = Object.keys(next).find((sq) => next[sq] === `${mover === "w" ? "b" : "w"}K`)!;
  try {
    return new Chess(o.fen, { skipValidation: true }).isAttacked(enemyKing as Square, mover as Color);
  } catch {
    return false;
  }
}
