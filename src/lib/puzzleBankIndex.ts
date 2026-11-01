/**
 * Оглавление банка задач (темы, число задач, версия) — без шахматного движка: его читают счётчики наград
 * и задание дня на главной, а chess.js нужен только при решении самих задач (puzzleBank.ts).
 */
import bank from "@/content/chess/puzzle-bank.json";
import type { PuzzleTheme } from "@/content/chess/puzzles";

export interface BankIndex {
  source: string;
  license: string;
  total: number;
  mix: number;
  version: string;
  themes: Partial<Record<PuzzleTheme, { count: number; min: number; max: number }>>;
}

export const BANK = bank as BankIndex;

/** Сколько задач из базы в теме (в «пате» их нет — там только задачи школы). */
export function bankCount(theme: PuzzleTheme): number {
  return BANK.themes[theme]?.count ?? 0;
}

export const bankKey = (theme: PuzzleTheme, id: string) => `${theme}/${id}`;

/** Тема задачи из базы по ключу прогресса; у задач школы ключ без «/». */
export function themeOfKey(key: string): PuzzleTheme | undefined {
  const [theme, id] = key.split("/");
  return id && theme in BANK.themes ? (theme as PuzzleTheme) : undefined;
}
