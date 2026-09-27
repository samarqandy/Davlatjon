/** Фигура из отрезков: можно ли нарисовать её одним росчерком (не отрывая карандаша и не проводя дважды). */

export interface StrokeFigure {
  points: readonly (readonly [number, number])[];
  lines: readonly (readonly [number, number])[];
}

/** Сколько точек, из которых выходит нечётное число линий. */
export function oddPoints(f: StrokeFigure): number {
  const degree = f.points.map(() => 0);
  for (const [a, b] of f.lines) {
    degree[a]++;
    degree[b]++;
  }
  return degree.filter((d) => d % 2 === 1).length;
}

function connected(f: StrokeFigure): boolean {
  const used = new Set(f.lines.flat());
  const start = f.lines[0]?.[0];
  if (start === undefined) return true;
  const seen = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const p = stack.pop()!;
    for (const [a, b] of f.lines) {
      const q = a === p ? b : b === p ? a : null;
      if (q !== null && !seen.has(q)) {
        seen.add(q);
        stack.push(q);
      }
    }
  }
  return [...used].every((p) => seen.has(p));
}

/** Правило Эйлера: фигура рисуется одним росчерком, если она связная и нечётных точек 0 или 2. */
export function oneStroke(f: StrokeFigure): boolean {
  return connected(f) && oddPoints(f) <= 2;
}
