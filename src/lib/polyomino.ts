import type { Cell } from "@/content/types";

/** Сдвигает фигуру в левый верхний угол и упорядочивает клетки. */
export function normalize(cells: readonly Cell[]): Cell[] {
  const minC = Math.min(...cells.map((c) => c[0]));
  const minR = Math.min(...cells.map((c) => c[1]));
  return cells.map(([c, r]) => [c - minC, r - minR] as Cell).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

export function shapeKey(cells: readonly Cell[]): string {
  return normalize(cells)
    .map(([c, r]) => `${c},${r}`)
    .join(";");
}

/** Поворот на четверть оборота по часовой стрелке. */
export function rotate(cells: readonly Cell[]): Cell[] {
  return normalize(cells.map(([c, r]) => [-r, c] as Cell));
}

/** Зеркальное отражение слева направо. */
export function mirror(cells: readonly Cell[]): Cell[] {
  return normalize(cells.map(([c, r]) => [-c, r] as Cell));
}

export function rotationKeys(cells: readonly Cell[]): string[] {
  const keys: string[] = [];
  let cur = normalize(cells);
  for (let i = 0; i < 4; i++) {
    keys.push(shapeKey(cur));
    cur = rotate(cur);
  }
  return keys;
}

/** Можно ли получить фигуру b из фигуры a только поворотом. */
export function isRotationOf(a: readonly Cell[], b: readonly Cell[]): boolean {
  return rotationKeys(a).includes(shapeKey(b));
}

/** Совпадают ли фигуры, если разрешено поворачивать и переворачивать. */
export function isCongruent(a: readonly Cell[], b: readonly Cell[]): boolean {
  if (a.length !== b.length) return false;
  const target = shapeKey(b);
  return [...rotationKeys(a), ...rotationKeys(mirror(a))].includes(target);
}

/** Связна ли фигура (соседство по сторонам). */
export function isConnected(cells: readonly Cell[]): boolean {
  if (cells.length === 0) return false;
  const set = new Set(cells.map(([c, r]) => `${c},${r}`));
  const seen = new Set<string>([`${cells[0][0]},${cells[0][1]}`]);
  const stack: Cell[] = [cells[0]];
  while (stack.length) {
    const [c, r] = stack.pop()!;
    for (const [dc, dr] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const k = `${c + dc},${r + dr}`;
      if (set.has(k) && !seen.has(k)) {
        seen.add(k);
        stack.push([c + dc, r + dr]);
      }
    }
  }
  return seen.size === set.size;
}

export function bounds(cells: readonly Cell[]): { cols: number; rows: number } {
  return {
    cols: Math.max(...cells.map((c) => c[0])) + 1,
    rows: Math.max(...cells.map((c) => c[1])) + 1,
  };
}
