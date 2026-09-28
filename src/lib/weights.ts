/** Весы с гирями: груз лежит на левой чаше, гири — на правой (или на обеих). */

export type WeightPlace = "left" | "right" | null;

export interface Balance {
  left: number;
  right: number;
}

export function balanceOf(load: number, weights: readonly number[], places: readonly WeightPlace[]): Balance {
  let left = load;
  let right = 0;
  weights.forEach((w, i) => {
    if (places[i] === "left") left += w;
    if (places[i] === "right") right += w;
  });
  return { left, right };
}

/** Сколькими способами можно уравновесить груз. */
export function waysToBalance(load: number, weights: readonly number[], bothPans: boolean): number {
  const options: WeightPlace[] = bothPans ? [null, "right", "left"] : [null, "right"];
  let count = 0;
  const walk = (i: number, places: WeightPlace[]) => {
    if (i === weights.length) {
      const b = balanceOf(load, weights, places);
      if (b.left === b.right) count++;
      return;
    }
    for (const p of options) walk(i + 1, [...places, p]);
  };
  walk(0, []);
  return count;
}
