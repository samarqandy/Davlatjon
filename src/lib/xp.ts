/**
 * Опыт (XP) и уровень ребёнка. Ничего нового не хранится: опыт считается из уже записанного прогресса,
 * поэтому он одинаков на всех устройствах и сам восстанавливается после синхронизации.
 */
import { CHESS_LEVELS } from "@/content/chess";
import type { AppState } from "./state";

/** Сколько опыта за что. */
export const XP = {
  /** Опыт не зависит от подсказок: просить помощь — нормально, и награда за это не уменьшается. */
  task: 15,
  day: 20,
  exercise: 5,
  puzzle: 8,
  ownPuzzle: 5,
  game: 5,
  win: 10,
  opening: 10,
  famousGame: 5,
  endgame: 5,
  /** Первый рекорд в тренажёре «Кто в опасности?», «Запомни» или «Путь коня». */
  drill: 10,
  rank: 50,
} as const;

const DRILLS = ["safety", "memory", "knight"];

/** Весь опыт: по занятиям математикой и шахматами. */
export function xpTotal(s: AppState): number {
  let xp = 0;
  for (const t of Object.values(s.tasks)) if (t.solvedAt) xp += XP.task;
  for (const d of Object.values(s.days)) if (d.completedAt) xp += XP.day;
  for (const e of Object.values(s.chess)) if (e.solvedAt) xp += XP.exercise;
  for (const p of Object.values(s.chessPuzzles)) if (p.solvedAt) xp += XP.puzzle;
  xp += Object.keys(s.chessOwnPuzzles).length * XP.ownPuzzle;
  for (const g of s.chessGames) xp += XP.game + (g.result === "win" ? XP.win : 0);
  xp += new Set(Object.keys(s.chessOpenings).map((k) => k.split(":")[0])).size * XP.opening;
  xp += Object.keys(s.chessGamesViewed).length * XP.famousGame;
  xp += Object.keys(s.chessEndgames).length * XP.endgame;
  xp += DRILLS.filter((d) => s.chessDrills[d]).length * XP.drill;
  // Звание: все упражнения уровня решены.
  for (const level of CHESS_LEVELS) if (level.exercises.every((e) => s.chess[e.id]?.solvedAt)) xp += XP.rank;
  return xp;
}

/** Опыт, нужный для уровня n (с первого): 0, 50, 150, 300, 500… — каждый следующий чуть дольше. */
export function xpForLevel(n: number): number {
  return (25 * (n - 1) * n) | 0;
}

export interface XpLevel {
  level: number;
  /** Сколько опыта набрано внутри уровня и сколько нужно до следующего. */
  into: number;
  need: number;
}

export function xpLevel(xp: number): XpLevel {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return { level, into: xp - xpForLevel(level), need: xpForLevel(level + 1) - xpForLevel(level) };
}

/** Какой звук-награда нужен, когда опыт вырос с `prev` до `next`: новый уровень — фанфара, иначе короткий звон. Большие скачки (синхронизация, сброс) — без звука. */
export function rewardFor(prev: number, next: number): "win" | "level" | null {
  const gain = next - prev;
  if (gain <= 0 || gain > 100) return null;
  return xpLevel(next).level > xpLevel(prev).level ? "level" : "win";
}
