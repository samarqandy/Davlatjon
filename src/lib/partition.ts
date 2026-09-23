import type { Cell } from "@/content/types";
import { isCongruent, isConnected } from "./polyomino";

/**
 * Разрезание квадрата size × size на две одинаковые части.
 * `grid[r][c]` — номер части (0 или 1).
 */
export type PartitionGrid = number[][];

export type PartitionCheck = { ok: true; key: string } | { ok: false; reason: "sizes" | "connected" | "shape" };

function cellsOf(grid: PartitionGrid, part: number): Cell[] {
  const cells: Cell[] = [];
  grid.forEach((row, r) => row.forEach((v, c) => v === part && cells.push([c, r])));
  return cells;
}

/** Восемь симметрий квадрата: повороты и отражения. */
function symmetries(n: number): ((c: Cell) => Cell)[] {
  const m = n - 1;
  return [
    ([c, r]) => [c, r],
    ([c, r]) => [m - r, c],
    ([c, r]) => [m - c, m - r],
    ([c, r]) => [r, m - c],
    ([c, r]) => [m - c, r],
    ([c, r]) => [c, m - r],
    ([c, r]) => [r, c],
    ([c, r]) => [m - r, m - c],
  ];
}

/** Ключ разреза, одинаковый для разрезов, совпадающих при повороте/отражении квадрата. */
export function partitionKey(grid: PartitionGrid): string {
  const n = grid.length;
  const part = cellsOf(grid, 0);
  const keys = symmetries(n).map((f) => {
    const moved = new Set(part.map((cell) => f(cell)).map(([c, r]) => r * n + c));
    const bits = Array.from({ length: n * n }, (_, i) => (moved.has(i) ? "1" : "0")).join("");
    const inverse = [...bits].map((b) => (b === "1" ? "0" : "1")).join("");
    return bits < inverse ? bits : inverse;
  });
  return keys.sort()[0];
}

export function checkPartition(grid: PartitionGrid): PartitionCheck {
  const n = grid.length;
  const a = cellsOf(grid, 0);
  const b = cellsOf(grid, 1);
  if (a.length !== (n * n) / 2 || b.length !== (n * n) / 2) return { ok: false, reason: "sizes" };
  if (!isConnected(a) || !isConnected(b)) return { ok: false, reason: "connected" };
  if (!isCongruent(a, b)) return { ok: false, reason: "shape" };
  return { ok: true, key: partitionKey(grid) };
}

/** Все различные (с точностью до симметрий квадрата) разрезы на две одинаковые части. */
export function allPartitions(n: number): string[] {
  const total = n * n;
  const keys = new Set<string>();
  for (let mask = 0; mask < 1 << total; mask++) {
    if (!(mask & 1)) continue;
    let bitsOn = 0;
    for (let i = 0; i < total; i++) if (mask & (1 << i)) bitsOn++;
    if (bitsOn !== total / 2) continue;
    const grid: PartitionGrid = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => (mask & (1 << (r * n + c)) ? 0 : 1)),
    );
    const res = checkPartition(grid);
    if (res.ok) keys.add(res.key);
  }
  return [...keys];
}
