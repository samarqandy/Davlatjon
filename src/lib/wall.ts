/** Числовая стенка: каждый кирпич — сумма двух кирпичей под ним. */

/** Ряды стенки снизу вверх. Если под кирпичом пусто (null), он тоже пустой. */
export function buildWall(bottom: readonly (number | null)[]): (number | null)[][] {
  const rows: (number | null)[][] = [[...bottom]];
  while (rows[rows.length - 1].length > 1) {
    const prev = rows[rows.length - 1];
    rows.push(prev.slice(1).map((v, i) => (v === null || prev[i] === null ? null : v + prev[i]!)));
  }
  return rows;
}

export function wallTop(bottom: readonly number[]): number {
  const rows = buildWall(bottom);
  return rows[rows.length - 1][0]!;
}

function permutations<T>(items: readonly T[]): T[][] {
  if (items.length <= 1) return [[...items]];
  return items.flatMap((x, i) => permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((p) => [x, ...p]));
}

/** Все числа, которые могут оказаться наверху, и расстановки для каждого. */
export function possibleTops(numbers: readonly number[]): Map<number, number[][]> {
  const tops = new Map<number, number[][]>();
  for (const p of permutations(numbers)) {
    const t = wallTop(p);
    tops.set(t, [...(tops.get(t) ?? []), p]);
  }
  return tops;
}
