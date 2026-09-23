/**
 * Волшебный треугольник. Позиции кружков:
 * 0 — верхний угол, 1 — левый нижний угол, 2 — правый нижний угол,
 * 3 — середина левой стороны (0–1), 4 — середина нижней стороны (1–2), 5 — середина правой стороны (2–0).
 */
export const SIDES: [number, number, number][] = [
  [0, 3, 1],
  [1, 4, 2],
  [2, 5, 0],
];

export const CORNERS = [0, 1, 2];

export type TriangleValues = (number | null)[];

export function sideSums(values: TriangleValues): (number | null)[] {
  return SIDES.map((side) => {
    const nums = side.map((i) => values[i]);
    return nums.every((v) => v !== null) ? nums.reduce<number>((s, v) => s + (v as number), 0) : null;
  });
}

/** Если расстановка полная и суммы сторон равны — возвращает эту сумму. */
export function magicSum(values: TriangleValues, numbers: number[]): number | null {
  if (values.some((v) => v === null)) return null;
  const sorted = [...(values as number[])].sort((a, b) => a - b);
  const expected = [...numbers].sort((a, b) => a - b);
  if (sorted.join(",") !== expected.join(",")) return null;
  const sums = sideSums(values) as number[];
  return sums.every((s) => s === sums[0]) ? sums[0] : null;
}

/** Все возможные суммы перебором всех расстановок. */
export function possibleSums(numbers: number[]): Map<number, number[][]> {
  const result = new Map<number, number[][]>();
  const permute = (rest: number[], acc: number[]) => {
    if (rest.length === 0) {
      const s = magicSum(acc, numbers);
      if (s !== null) result.set(s, [...(result.get(s) ?? []), acc]);
      return;
    }
    rest.forEach((n, i) => permute([...rest.slice(0, i), ...rest.slice(i + 1)], [...acc, n]));
  };
  permute(numbers, []);
  return result;
}
