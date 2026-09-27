import type { VennRegion } from "@/content/types";

/** Круги Эйлера: геометрия рисунка и проверка раскладки. */

export const VENN = {
  width: 480,
  height: 300,
  a: { cx: 180, cy: 158, r: 118 },
  b: { cx: 300, cy: 158, r: 118 },
} as const;

export const VENN_ORDER: VennRegion[] = ["a", "ab", "b", "none"];

export function regionName(region: VennRegion, sets: readonly [string, string]): string {
  switch (region) {
    case "a":
      return `только «${sets[0]}»`;
    case "b":
      return `только «${sets[1]}»`;
    case "ab":
      return "в обоих кругах";
    case "none":
      return "вне кругов";
  }
}

/** В какую область попадает точка рисунка. */
export function regionAt(x: number, y: number): VennRegion {
  const inA = Math.hypot(x - VENN.a.cx, y - VENN.a.cy) <= VENN.a.r;
  const inB = Math.hypot(x - VENN.b.cx, y - VENN.b.cy) <= VENN.b.r;
  return inA && inB ? "ab" : inA ? "a" : inB ? "b" : "none";
}

/** Где рисовать надписи каждой области (центр и ширина колонки). */
export const REGION_ANCHOR: Record<VennRegion, { x: number; y: number; width: number }> = {
  a: { x: 118, y: 158, width: 110 },
  ab: { x: 240, y: 158, width: 64 },
  b: { x: 362, y: 158, width: 110 },
  none: { x: 240, y: 290, width: 440 },
};

export interface VennCheck {
  /** Разложено по своим местам. */
  right: number;
  /** Лежит не в той области. */
  wrong: string[];
  /** Ещё не разложено. */
  missing: string[];
}

export function checkVenn(correct: Record<string, VennRegion>, placed: Record<string, VennRegion>): VennCheck {
  const ids = Object.keys(correct);
  const missing = ids.filter((id) => !placed[id]);
  const wrong = ids.filter((id) => placed[id] && placed[id] !== correct[id]);
  return { right: ids.length - missing.length - wrong.length, wrong, missing };
}
