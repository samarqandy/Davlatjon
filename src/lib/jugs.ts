/**
 * Переливания: два сосуда без делений. Можно наполнить сосуд до краёв, вылить его
 * или переливать из одного в другой, пока первый не опустеет или второй не наполнится.
 */

export type JugsState = [number, number];

export type JugsAction = { type: "fill"; jug: 0 | 1 } | { type: "empty"; jug: 0 | 1 } | { type: "pour"; from: 0 | 1 };

export const JUGS_ACTIONS: JugsAction[] = [
  { type: "fill", jug: 0 },
  { type: "fill", jug: 1 },
  { type: "empty", jug: 0 },
  { type: "empty", jug: 1 },
  { type: "pour", from: 0 },
  { type: "pour", from: 1 },
];

export function applyJugs(caps: readonly [number, number], s: JugsState, a: JugsAction): JugsState {
  const next: JugsState = [s[0], s[1]];
  if (a.type === "fill") next[a.jug] = caps[a.jug];
  else if (a.type === "empty") next[a.jug] = 0;
  else {
    const to = a.from === 0 ? 1 : 0;
    const amount = Math.min(s[a.from], caps[to] - s[to]);
    next[a.from] -= amount;
    next[to] += amount;
  }
  return next;
}

/** Действие ничего не меняет (наполнить полное, вылить пустое…). */
export function isUseless(caps: readonly [number, number], s: JugsState, a: JugsAction): boolean {
  const n = applyJugs(caps, s, a);
  return n[0] === s[0] && n[1] === s[1];
}

export function jugsReached(s: JugsState, target: number): boolean {
  return s[0] === target || s[1] === target;
}

export function replayJugs(caps: readonly [number, number], actions: readonly JugsAction[]): JugsState[] {
  const states: JugsState[] = [[0, 0]];
  for (const a of actions) states.push(applyJugs(caps, states[states.length - 1], a));
  return states;
}

/** Наименьшее число действий (поиск в ширину по всем состояниям). */
export function shortestJugs(caps: readonly [number, number], target: number): number {
  const key = (s: JugsState) => s.join(",");
  const dist = new Map([[key([0, 0]), 0]]);
  const queue: JugsState[] = [[0, 0]];
  while (queue.length) {
    const s = queue.shift()!;
    const d = dist.get(key(s))!;
    if (jugsReached(s, target)) return d;
    for (const a of JUGS_ACTIONS) {
      const n = applyJugs(caps, s, a);
      if (!dist.has(key(n))) {
        dist.set(key(n), d + 1);
        queue.push(n);
      }
    }
  }
  return Infinity;
}
