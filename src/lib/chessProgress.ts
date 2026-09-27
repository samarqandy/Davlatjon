import type { ChessLevel } from "@/content/chess/types";
import type { AppState } from "./store";

export interface LevelStatus {
  solved: number;
  total: number;
  /** Все упражнения уровня решены — звание получено. */
  passed: boolean;
  /** Уровень открыт: первый, или предыдущий пройден, или родитель открыл все. */
  unlocked: boolean;
}

export function levelStatuses(levels: readonly ChessLevel[], state: AppState): LevelStatus[] {
  const out: LevelStatus[] = [];
  levels.forEach((level, i) => {
    const solved = level.exercises.filter((e) => state.chess[e.id]?.solvedAt).length;
    const total = level.exercises.length;
    out.push({
      solved,
      total,
      passed: solved === total,
      unlocked: i === 0 || out[i - 1].passed || state.settings.chessOpenAll === true,
    });
  });
  return out;
}

/** Звание — последний уровень в непрерывной цепочке пройденных, начиная с первого. */
export function currentRank(levels: readonly ChessLevel[], state: AppState): ChessLevel | null {
  const statuses = levelStatuses(levels, state);
  let rank: ChessLevel | null = null;
  for (let i = 0; i < levels.length && statuses[i].passed; i++) rank = levels[i];
  return rank;
}
