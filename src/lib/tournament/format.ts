/** Как турнир пишут словами и знаками: результат, очки, название тура. Общие для экрана, печати и текста «Поделиться». */
import type { GameResult } from "./types";

type T = (ru: string, uz: string) => string;

/** Как результат пишут в таблицах: «1–0», «½–½», «+/−» — победа без игры. */
export const RESULT_TEXT: Record<GameResult, string> = {
  "1-0": "1–0",
  "1/2": "½–½",
  "0-1": "0–1",
  "+-": "+/−",
  "-+": "−/+",
};

/** Очки: «2½», «½», «3». */
export function points(x: number): string {
  const whole = Math.floor(x);
  const half = x - whole >= 0.5;
  return half ? `${whole || ""}½` : String(whole);
}

/** Название тура олимпийской системы по числу партий в нём. */
export function knockoutRoundName(games: number, t: T): string {
  if (games <= 1) return t("Финал", "Final");
  if (games === 2) return t("Полуфинал", "Yarim final");
  if (games === 4) return t("Четвертьфинал", "Chorak final");
  return t(`1/${games} финала`, `1/${games} final`);
}
