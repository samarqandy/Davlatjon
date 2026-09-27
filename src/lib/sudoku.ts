/**
 * Судоку: в каждой строке, каждом столбце и каждом прямоугольнике box
 * (box[0] столбцов × box[1] строк) все числа встречаются по одному разу.
 */

export type SudokuGrid = (number | null)[][];

const cellKey = (r: number, c: number) => `${r}-${c}`;

/** Клетки с повторяющимися числами — в строке, столбце или прямоугольнике. */
export function sudokuConflicts(grid: SudokuGrid, box: readonly [number, number]): Set<string> {
  const n = grid.length;
  const bad = new Set<string>();
  const groups: [number, number][][] = [];
  for (let i = 0; i < n; i++) {
    groups.push(Array.from({ length: n }, (_, j) => [i, j] as [number, number]));
    groups.push(Array.from({ length: n }, (_, j) => [j, i] as [number, number]));
  }
  const [bw, bh] = box;
  for (let br = 0; br < n; br += bh) {
    for (let bc = 0; bc < n; bc += bw) {
      const cells: [number, number][] = [];
      for (let r = br; r < br + bh; r++) for (let c = bc; c < bc + bw; c++) cells.push([r, c]);
      groups.push(cells);
    }
  }
  for (const cells of groups) {
    const seen = new Map<number, [number, number][]>();
    for (const [r, c] of cells) {
      const v = grid[r][c];
      if (v === null) continue;
      seen.set(v, [...(seen.get(v) ?? []), [r, c]]);
    }
    for (const same of seen.values()) if (same.length > 1) same.forEach(([r, c]) => bad.add(cellKey(r, c)));
  }
  return bad;
}

/** Все решения (перебором с возвратом), но не больше limit. */
export function sudokuSolutions(grid: SudokuGrid, box: readonly [number, number], limit = 2): number[][][] {
  const n = grid.length;
  const work = grid.map((row) => [...row]);
  const out: number[][][] = [];
  const empty: [number, number][] = [];
  work.forEach((row, r) => row.forEach((v, c) => v === null && empty.push([r, c])));
  const walk = (i: number) => {
    if (out.length >= limit) return;
    if (i === empty.length) {
      out.push(work.map((row) => row.map((v) => v!)));
      return;
    }
    const [r, c] = empty[i];
    for (let v = 1; v <= n; v++) {
      work[r][c] = v;
      if (sudokuConflicts(work, box).size === 0) walk(i + 1);
    }
    work[r][c] = null;
  };
  if (sudokuConflicts(work, box).size === 0) walk(0);
  return out;
}
