import type { CrossingPuzzle } from "@/content/types";

/**
 * Переправа через реку. Лодкой управляет driver; без него на берегу нельзя оставлять
 * тех, кто съест друг друга (conflicts).
 */

export type Side = "left" | "right";

export interface CrossingState {
  /** Кто уже на правом берегу (id). */
  right: string[];
  /** У какого берега лодка (а с ней и driver). */
  boat: Side;
}

export const CROSSING_START: CrossingState = { right: [], boat: "left" };

export function bankOf(state: CrossingState, id: string): Side {
  return state.right.includes(id) ? "right" : "left";
}

export function bankItems(p: CrossingPuzzle, state: CrossingState, side: Side): string[] {
  return p.items.filter((i) => bankOf(state, i.id) === side).map((i) => i.id);
}

export type Conflict = CrossingPuzzle["conflicts"][number];

/** Первая опасная пара среди тех, кто остался без driver, или null. */
export function danger(p: CrossingPuzzle, ids: readonly string[]): Conflict | null {
  return p.conflicts.find((c) => ids.includes(c.eater) && ids.includes(c.eaten)) ?? null;
}

export type SailResult =
  | { ok: true; next: CrossingState }
  | { ok: false; reason: "eaten"; conflict: Conflict }
  | { ok: false; reason: "invalid" };

/** Отплыть к другому берегу с пассажирами. */
export function sail(p: CrossingPuzzle, state: CrossingState, passengers: readonly string[]): SailResult {
  if (passengers.length > p.capacity) return { ok: false, reason: "invalid" };
  if (passengers.some((id) => !p.items.some((i) => i.id === id) || bankOf(state, id) !== state.boat)) {
    return { ok: false, reason: "invalid" };
  }
  const left = bankItems(p, state, state.boat).filter((id) => !passengers.includes(id));
  const conflict = danger(p, left);
  if (conflict) return { ok: false, reason: "eaten", conflict };
  const right =
    state.boat === "left" ? [...state.right, ...passengers] : state.right.filter((id) => !passengers.includes(id));
  return { ok: true, next: { right, boat: state.boat === "left" ? "right" : "left" } };
}

/** Переиграть список поездок; останавливается на первой невозможной. */
export function replayCrossing(
  p: CrossingPuzzle,
  trips: readonly (readonly string[])[],
): { state: CrossingState; applied: number } {
  let state = CROSSING_START;
  for (let i = 0; i < trips.length; i++) {
    const r = sail(p, state, trips[i]);
    if (!r.ok) return { state, applied: i };
    state = r.next;
  }
  return { state, applied: trips.length };
}

export function crossingSolved(p: CrossingPuzzle, state: CrossingState): boolean {
  return state.boat === "right" && p.items.every((i) => state.right.includes(i.id));
}

function choices(ids: string[], max: number): string[][] {
  const out: string[][] = [[]];
  const walk = (start: number, acc: string[]) => {
    for (let i = start; i < ids.length; i++) {
      const next = [...acc, ids[i]];
      out.push(next);
      if (next.length < max) walk(i + 1, next);
    }
  };
  walk(0, []);
  return out;
}

const stateKey = (s: CrossingState) => `${[...s.right].sort().join(",")}|${s.boat}`;

/** Наименьшее число переправ и число разных кратчайших планов (поиск в ширину). */
export function shortestCrossing(p: CrossingPuzzle): { trips: number; plans: number } {
  const dist = new Map([[stateKey(CROSSING_START), 0]]);
  const ways = new Map([[stateKey(CROSSING_START), 1]]);
  const queue = [CROSSING_START];
  while (queue.length) {
    const s = queue.shift()!;
    const k = stateKey(s);
    if (crossingSolved(p, s)) return { trips: dist.get(k)!, plans: ways.get(k)! };
    for (const passengers of choices(bankItems(p, s, s.boat), p.capacity)) {
      const r = sail(p, s, passengers);
      if (!r.ok) continue;
      const nk = stateKey(r.next);
      if (!dist.has(nk)) {
        dist.set(nk, dist.get(k)! + 1);
        ways.set(nk, ways.get(k)!);
        queue.push(r.next);
      } else if (dist.get(nk) === dist.get(k)! + 1) {
        ways.set(nk, ways.get(nk)! + ways.get(k)!);
      }
    }
  }
  return { trips: Infinity, plans: 0 };
}
