import type { Cell, Dir } from "@/content/types";

export const DIRS: Dir[] = ["U", "D", "L", "R"];

export const ARROW: Record<Dir, string> = { U: "↑", D: "↓", L: "←", R: "→" };

export const DIR_NAME: Record<Dir, string> = { U: "вверх", D: "вниз", L: "влево", R: "вправо" };

const DELTA: Record<Dir, readonly [number, number]> = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0],
};

export interface RobotMap {
  cols: number;
  rows: number;
  start: Cell;
  goal: Cell | null;
  stars: Cell[];
  walls: Set<string>;
  /** Предметы из легенды: буква → клетка. */
  items: { key: string; cell: Cell }[];
}

export const cellKey = (c: Cell) => `${c[0]},${c[1]}`;
export const sameCell = (a: Cell, b: Cell) => a[0] === b[0] && a[1] === b[1];

export function parseMap(map: string[]): RobotMap {
  const rows = map.length;
  const cols = map[0]?.length ?? 0;
  let start: Cell | null = null;
  let goal: Cell | null = null;
  const stars: Cell[] = [];
  const walls = new Set<string>();
  const items: { key: string; cell: Cell }[] = [];
  for (let r = 0; r < rows; r++) {
    const line = map[r];
    if (line.length !== cols) throw new Error(`Robot map row ${r} has length ${line.length}, expected ${cols}`);
    for (let c = 0; c < cols; c++) {
      const ch = line[c];
      const cell: Cell = [c, r];
      if (ch === "#") walls.add(cellKey(cell));
      else if (ch === "R") start = cell;
      else if (ch === "F") goal = cell;
      else if (ch === "*") stars.push(cell);
      else if (/[a-z]/.test(ch)) items.push({ key: ch, cell });
      else if (ch !== ".") throw new Error(`Unknown robot map symbol "${ch}"`);
    }
  }
  if (!start) throw new Error("Robot map has no start cell R");
  return { cols, rows, start, goal, stars, walls, items };
}

export function isFree(map: RobotMap, cell: Cell): boolean {
  const [c, r] = cell;
  return c >= 0 && r >= 0 && c < map.cols && r < map.rows && !map.walls.has(cellKey(cell));
}

export function step(cell: Cell, dir: Dir): Cell {
  const [dc, dr] = DELTA[dir];
  return [cell[0] + dc, cell[1] + dr];
}

export interface RunResult {
  /** Клетки, которые прошёл робот (включая старт). */
  path: Cell[];
  /** ok — все команды выполнены; wall/outside — остановка на команде failedAt. */
  status: "ok" | "wall" | "outside";
  /** Номер команды (с нуля), на которой робот остановился. */
  failedAt: number | null;
  end: Cell;
  /** Индексы собранных звёзд. */
  collected: number[];
  reachedGoal: boolean;
  allStars: boolean;
}

export function runProgram(map: RobotMap, program: Dir[]): RunResult {
  let cur: Cell = map.start;
  const path: Cell[] = [cur];
  const collected = new Set<number>();
  const collect = (cell: Cell) =>
    map.stars.forEach((s, i) => {
      if (sameCell(s, cell)) collected.add(i);
    });
  collect(cur);
  for (let i = 0; i < program.length; i++) {
    const next = step(cur, program[i]);
    const [c, r] = next;
    const outside = c < 0 || r < 0 || c >= map.cols || r >= map.rows;
    if (outside || map.walls.has(cellKey(next))) {
      return finish(map, path, outside ? "outside" : "wall", i, cur, collected);
    }
    cur = next;
    path.push(cur);
    collect(cur);
  }
  return finish(map, path, "ok", null, cur, collected);
}

function finish(
  map: RobotMap,
  path: Cell[],
  status: RunResult["status"],
  failedAt: number | null,
  end: Cell,
  collected: Set<number>,
): RunResult {
  return {
    path,
    status,
    failedAt,
    end,
    collected: [...collected].sort((a, b) => a - b),
    reachedGoal: status === "ok" && map.goal !== null && sameCell(end, map.goal),
    allStars: collected.size === map.stars.length,
  };
}

/**
 * Длина самой короткой программы, которая приводит робота к флажку
 * (и, если есть звёзды, собирает их все по дороге).
 */
export function shortestLength(map: RobotMap): number {
  if (!map.goal) return Infinity;
  const goal = map.goal;
  const full = (1 << map.stars.length) - 1;
  const starIndex = new Map(map.stars.map((s, i) => [cellKey(s), i]));
  const startMask = starIndex.has(cellKey(map.start)) ? 1 << starIndex.get(cellKey(map.start))! : 0;
  const key = (c: Cell, m: number) => `${c[0]},${c[1]},${m}`;
  const dist = new Map<string, number>([[key(map.start, startMask), 0]]);
  const queue: [Cell, number][] = [[map.start, startMask]];
  while (queue.length) {
    const [cell, mask] = queue.shift()!;
    const d = dist.get(key(cell, mask))!;
    if (mask === full && sameCell(cell, goal)) return d;
    for (const dir of DIRS) {
      const next = step(cell, dir);
      if (!isFree(map, next)) continue;
      const i = starIndex.get(cellKey(next));
      const nextMask = i === undefined ? mask : mask | (1 << i);
      const k = key(next, nextMask);
      if (!dist.has(k)) {
        dist.set(k, d + 1);
        queue.push([next, nextMask]);
      }
    }
  }
  return Infinity;
}

/** Расстояние в шагах между двумя клетками (без учёта звёзд). */
export function distance(map: RobotMap, from: Cell, to: Cell): number {
  const seen = new Set([cellKey(from)]);
  let frontier: Cell[] = [from];
  for (let d = 0; frontier.length; d++) {
    const next: Cell[] = [];
    for (const cell of frontier) {
      if (sameCell(cell, to)) return d;
      for (const dir of DIRS) {
        const n = step(cell, dir);
        if (isFree(map, n) && !seen.has(cellKey(n))) {
          seen.add(cellKey(n));
          next.push(n);
        }
      }
    }
    frontier = next;
  }
  return Infinity;
}

/** Все кратчайшие программы до флажка (без звёзд). */
export function allShortestPrograms(map: RobotMap): Dir[][] {
  const best = shortestLength(map);
  if (!Number.isFinite(best)) return [];
  const result: Dir[][] = [];
  const walk = (cell: Cell, prog: Dir[]) => {
    if (prog.length === best) {
      if (map.goal && sameCell(cell, map.goal)) result.push([...prog]);
      return;
    }
    for (const dir of DIRS) {
      const next = step(cell, dir);
      if (isFree(map, next)) walk(next, [...prog, dir]);
    }
  };
  walk(map.start, []);
  return result;
}

/** Короткая запись программы: → → → ↑ ↑ → «3→ 2↑ 1→». */
export function compress(program: Dir[]): string {
  const parts: string[] = [];
  let i = 0;
  while (i < program.length) {
    let j = i;
    while (j < program.length && program[j] === program[i]) j++;
    parts.push(`${j - i}${ARROW[program[i]]}`);
    i = j;
  }
  return parts.join(" ");
}

export function programToText(program: Dir[]): string {
  return program.map((d) => ARROW[d]).join(" ");
}
