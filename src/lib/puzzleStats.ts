/** Статистика задач по темам — для панели «сильные и слабые темы» и для родителей. */
import { PUZZLES, type PuzzleTheme } from "@/content/chess/puzzles";
import { BANK, themeOfKey } from "./puzzleBank";
import type { ChessPuzzleProgress } from "./state";

const CLASSIC_THEME = new Map(PUZZLES.map((p) => [p.id, p.theme]));

/** Сколько всего задач в тренажёре: задачи школы и задачи из базы Lichess. */
export const PUZZLE_TOTAL = PUZZLES.length + BANK.total;

/** Тема задачи по ключу прогресса: задача школы — по id, задача из базы — по «тема/id». */
export function themeOf(key: string): PuzzleTheme | undefined {
  return CLASSIC_THEME.get(key) ?? themeOfKey(key);
}

export interface ThemeStat {
  theme: PuzzleTheme;
  /** Сколько задач темы пробовали. */
  tried: number;
  solved: number;
  /** Решено с первой попытки. */
  clean: number;
}

export function themeStats(progress: Record<string, ChessPuzzleProgress>): Map<PuzzleTheme, ThemeStat> {
  const out = new Map<PuzzleTheme, ThemeStat>();
  for (const [key, p] of Object.entries(progress)) {
    const theme = themeOf(key);
    if (!theme) continue;
    const s = out.get(theme) ?? { theme, tried: 0, solved: 0, clean: 0 };
    s.tried++;
    if (p.solvedAt) s.solved++;
    if (p.solvedAt && !p.misses) s.clean++;
    out.set(theme, s);
  }
  return out;
}

/** Сколько всего задач решено: школы и из базы. */
export function solvedCount(progress: Record<string, ChessPuzzleProgress>): number {
  return Object.values(progress).filter((p) => p.solvedAt).length;
}

export const accuracy = (s: ThemeStat) => (s.tried ? s.clean / s.tried : 0);

/**
 * Сильные и слабые темы — среди тех, где попробовано хотя бы min задач.
 * Сильные: с первой попытки решено от 70 %, лучшие три. Слабые: меньше 70 %, три самые трудные.
 */
export function strongWeak(stats: Map<PuzzleTheme, ThemeStat>, min = 5): { strong: ThemeStat[]; weak: ThemeStat[] } {
  const enough = [...stats.values()].filter((s) => s.tried >= min);
  const byAccuracy = (a: ThemeStat, b: ThemeStat) => accuracy(b) - accuracy(a) || b.tried - a.tried;
  return {
    strong: enough
      .filter((s) => accuracy(s) >= 0.7)
      .sort(byAccuracy)
      .slice(0, 3),
    weak: enough
      .filter((s) => accuracy(s) < 0.7)
      .sort((a, b) => byAccuracy(b, a))
      .slice(0, 3),
  };
}
