/**
 * Весы-детектив: среди монет одна фальшивая — она легче остальных.
 * Монеты нумеруются с 1.
 */

/** Какая чаша перевесила (опустилась) или равновесие. */
export type Weighing = "left" | "right" | "equal";

export interface WeighingRecord {
  left: number[];
  right: number[];
  result: Weighing;
}

export function weigh(fake: number, left: readonly number[], right: readonly number[]): Weighing {
  if (left.includes(fake)) return "right";
  if (right.includes(fake)) return "left";
  return "equal";
}

/** Какие монеты ещё могут быть фальшивыми после всех взвешиваний. */
export function candidates(coins: number, history: readonly WeighingRecord[]): number[] {
  return Array.from({ length: coins }, (_, i) => i + 1).filter((c) =>
    history.every((h) => weigh(c, h.left, h.right) === h.result),
  );
}

/**
 * «Хитрые» весы: фальшивая монета не загадана заранее — весы выбирают такой ответ,
 * после которого подозреваемых остаётся больше всего. Так найти монету можно
 * только планом, который работает всегда, а не удачей.
 * random — число от 0 до 1, чтобы при равенстве выбирать ответ случайно.
 */
export function trickyWeigh(
  suspects: readonly number[],
  left: readonly number[],
  right: readonly number[],
  random = 0,
): Weighing {
  const outcomes: Weighing[] = ["equal", "left", "right"];
  const remaining = (w: Weighing) => suspects.filter((c) => weigh(c, left, right) === w).length;
  const best = Math.max(...outcomes.map(remaining));
  const top = outcomes.filter((w) => remaining(w) === best);
  return top[Math.min(top.length - 1, Math.floor(random * top.length))];
}

/** Наименьшее число взвешиваний, которым наверняка можно найти лёгкую монету: каждое даёт три ответа. */
export function minWeighings(coins: number): number {
  let n = 0;
  let reach = 1;
  while (reach < coins) {
    reach *= 3;
    n++;
  }
  return n;
}
