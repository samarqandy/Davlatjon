/** Сортировка обменами соседей. */

/** Сколько пар стоят «не в том порядке» — ровно столько обменов соседей нужно, не меньше. */
export function inversions(cards: readonly number[]): number {
  let n = 0;
  for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) if (cards[i] > cards[j]) n++;
  return n;
}

export function isSorted(cards: readonly number[]): boolean {
  return cards.every((c, i) => i === 0 || cards[i - 1] <= c);
}

/** Поменять местами карточки i и i + 1. */
export function swapAt(cards: readonly number[], i: number): number[] {
  const next = [...cards];
  [next[i], next[i + 1]] = [next[i + 1], next[i]];
  return next;
}
