/**
 * Игра с камешками: игроки по очереди берут одно из разрешённых количеств камешков.
 * Кто взял последний камешек — выиграл.
 */

/** Проигрышная ли позиция для того, кто сейчас ходит (при лучшей игре соперника). */
export function isLosing(stones: number, take: readonly number[], memo = new Map<number, boolean>()): boolean {
  if (memo.has(stones)) return memo.get(stones)!;
  const moves = take.filter((t) => t <= stones);
  const losing = moves.every((t) => !isLosing(stones - t, take, memo));
  memo.set(stones, losing);
  return losing;
}

/** Выигрывающий ход (сколько взять) или null, если его нет. */
export function winningMove(stones: number, take: readonly number[]): number | null {
  return take.find((t) => t <= stones && isLosing(stones - t, take)) ?? null;
}

/** Ход робота: выигрывающий, если он есть, иначе — самый маленький. */
export function robotMove(stones: number, take: readonly number[]): number {
  return winningMove(stones, take) ?? Math.min(...take.filter((t) => t <= stones));
}
