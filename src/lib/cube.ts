import type { Cell } from "@/content/types";

interface Orientation {
  bottom: string;
  top: string;
  north: string;
  south: string;
  east: string;
  west: string;
}

/** Перекатываем кубик на соседнюю клетку и смотрим, какая грань оказалась внизу. */
function roll(o: Orientation, dc: number, dr: number): Orientation {
  if (dc === 1) return { ...o, bottom: o.east, west: o.bottom, top: o.west, east: o.top };
  if (dc === -1) return { ...o, bottom: o.west, east: o.bottom, top: o.east, west: o.top };
  if (dr === -1) return { ...o, bottom: o.north, south: o.bottom, top: o.south, north: o.top };
  return { ...o, bottom: o.south, north: o.bottom, top: o.north, south: o.top };
}

/** Грани кубика: B — низ, T — верх, N/S/E/W — стороны света. */
export const OPPOSITE_FACE: Record<string, string> = { B: "T", T: "B", N: "S", S: "N", E: "W", W: "E" };

/**
 * Кубик «катится» по фигуре: каждая клетка получает грань, которая её касается.
 * Возвращает грань для каждой клетки («c,r» → грань) или null, если грани противоречат друг другу.
 */
export function cubeFaces(cells: readonly Cell[]): Map<string, string> | null {
  const set = new Set(cells.map(([c, r]) => `${c},${r}`));
  const face = new Map<string, string>();
  const start = cells[0];
  const initial: Orientation = { bottom: "B", top: "T", north: "N", south: "S", east: "E", west: "W" };
  const stack: [Cell, Orientation][] = [[start, initial]];
  face.set(`${start[0]},${start[1]}`, initial.bottom);
  while (stack.length) {
    const [[c, r], o] = stack.pop()!;
    for (const [dc, dr] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const k = `${c + dc},${r + dr}`;
      if (!set.has(k)) continue;
      const next = roll(o, dc, dr);
      const known = face.get(k);
      if (known === undefined) {
        face.set(k, next.bottom);
        stack.push([[c + dc, r + dr], next]);
      } else if (known !== next.bottom) {
        return null;
      }
    }
  }
  return face;
}

/**
 * Складывается ли фигура из 6 квадратов в куб.
 * Развёртка правильная, если все 6 граней разные.
 */
export function foldsIntoCube(cells: readonly Cell[]): boolean {
  if (cells.length !== 6) return false;
  const face = cubeFaces(cells);
  return face !== null && face.size === 6 && new Set(face.values()).size === 6;
}
