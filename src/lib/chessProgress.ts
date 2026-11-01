import { profileMeta } from "./age";
import type { AppState } from "./store";

export interface LevelStatus {
  solved: number;
  total: number;
  /** Все упражнения уровня решены — звание получено. */
  passed: boolean;
  /** Сколько упражнений этого уровня нужно решить, чтобы открылся следующий (звание — всё равно за все). */
  need: number;
  /** Уровень открыт: входит в открытые по возрасту, или в предыдущем решено достаточно, или родитель открыл все. */
  unlocked: boolean;
}

/**
 * Следующий уровень открывается, когда решено примерно семь из десяти упражнений (из семи — пять): ребёнок
 * не застревает на одной трудной задаче, а звание по-прежнему означает «решены все».
 */
export function unlockNeed(total: number): number {
  return Math.max(1, Math.ceil(total * 0.7));
}

/** Хватает id упражнений: так статусы считаются и по лёгкой сводке уровней (главная), и по полному контенту. */
type LevelLike = { exercises: readonly { id: string }[] };

export function levelStatuses(levels: readonly LevelLike[], state: AppState): LevelStatus[] {
  const out: LevelStatus[] = [];
  const open = state.settings.chessOpenAll === true ? levels.length : profileMeta(state.settings.age).openLevels;
  levels.forEach((level, i) => {
    const solved = level.exercises.filter((e) => state.chess[e.id]?.solvedAt).length;
    const total = level.exercises.length;
    out.push({
      solved,
      total,
      passed: solved === total,
      need: unlockNeed(total),
      unlocked: i < open || out[i - 1].solved >= out[i - 1].need,
    });
  });
  return out;
}

/** Звание — последний уровень в непрерывной цепочке пройденных, начиная с первого. */
export function currentRank<L extends LevelLike>(levels: readonly L[], state: AppState): L | null {
  const statuses = levelStatuses(levels, state);
  let rank: L | null = null;
  for (let i = 0; i < levels.length && statuses[i].passed; i++) rank = levels[i];
  return rank;
}
