/**
 * Где рисовать стрелки и кружки доски тренера. Единица — одна клетка: доска 8 × 8, левый верхний угол (0, 0).
 * Ход коня — стрелка «буквой Г»: сначала длинная сторона, потом короткая (так её рисуют на шахматных сайтах
 * и в учебниках). Остальные стрелки — прямые.
 */
import type { Sq } from "./model";

export type Point = [x: number, y: number];

/** Центр клетки на экране. */
export function squareCenter(sq: Sq, orientation: "white" | "black"): Point {
  const file = sq.charCodeAt(0) - 97;
  const rank = Number(sq.slice(1)) - 1;
  return orientation === "white" ? [file + 0.5, 7 - rank + 0.5] : [7 - file + 0.5, rank + 0.5];
}

/** Клетка в процентах от доски — для знаков поверх клетки. */
export function squareRect(sq: Sq, orientation: "white" | "black") {
  const [x, y] = squareCenter(sq, orientation);
  return { left: ((x - 0.5) / 8) * 100, top: ((y - 0.5) / 8) * 100, size: 100 / 8 };
}

export const isKnightJump = (from: Sq, to: Sq) => {
  const df = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
  const dr = Math.abs(Number(from.slice(1)) - Number(to.slice(1)));
  return (df === 1 && dr === 2) || (df === 2 && dr === 1);
};

export interface ArrowShape {
  /** Линия стрелки: от центра первой клетки до основания наконечника. */
  shaft: Point[];
  /** Наконечник: острие и два угла основания. */
  head: [Point, Point, Point];
}

/** Острие не доходит до центра клетки — фигура под ним видна. */
const TIP_GAP = 0.15;

export function arrowGeometry(
  from: Sq,
  to: Sq,
  orientation: "white" | "black",
  { headLength = 0.5, headWidth = 0.55 }: { headLength?: number; headWidth?: number } = {},
): ArrowShape {
  const a = squareCenter(from, orientation);
  const b = squareCenter(to, orientation);
  const points: Point[] = [a];
  if (isKnightJump(from, to)) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    points.push(Math.abs(dy) > Math.abs(dx) ? [a[0], b[1]] : [b[0], a[1]]);
  }
  const corner = points[points.length - 1];
  const len = Math.hypot(b[0] - corner[0], b[1] - corner[1]) || 1;
  const ux = (b[0] - corner[0]) / len;
  const uy = (b[1] - corner[1]) / len;
  const tip: Point = [b[0] - ux * TIP_GAP, b[1] - uy * TIP_GAP];
  const base: Point = [tip[0] - ux * headLength, tip[1] - uy * headLength];
  const nx = -uy * (headWidth / 2);
  const ny = ux * (headWidth / 2);
  return {
    shaft: [...points, base],
    head: [tip, [base[0] + nx, base[1] + ny], [base[0] - nx, base[1] - ny]],
  };
}

const r = (n: number) => Math.round(n * 1000) / 1000;
export const pathOf = (pts: Point[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${r(x)} ${r(y)}`).join(" ");
export const polygonOf = (pts: Point[]) => pts.map(([x, y]) => `${r(x)},${r(y)}`).join(" ");
