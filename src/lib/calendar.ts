/**
 * Календарь занятий: день → сколько дел. Считается из прогресса; лежит отдельно от наград, потому что нужен
 * главной странице, а награды тянут за собой шахматный контент (задачи, партии).
 */
import { isoDay, type AppState } from "./state";

/** День → сколько дел в этот день: решённые задачи, партии, пройденные дни. */
export function activityDays(s: AppState): Record<string, number> {
  const out: Record<string, number> = {};
  const add = (ms: number | undefined) => {
    if (!ms) return;
    const d = isoDay(ms);
    out[d] = (out[d] ?? 0) + 1;
  };
  for (const t of Object.values(s.tasks)) add(t.solvedAt);
  for (const d of Object.values(s.days)) add(d.completedAt);
  for (const g of s.chessGames) add(g.at);
  for (const p of Object.values(s.chessPuzzles)) add(p.solvedAt);
  for (const c of Object.values(s.chess)) add(c.solvedAt);
  for (const v of Object.values(s.chessOpenings)) add(v);
  for (const v of Object.values(s.chessOwnPuzzles)) add(v);
  // «Быстрые примеры»: день записан в ключе.
  for (const k of Object.keys(s.quick)) {
    const day = k.split(":")[0];
    out[day] = (out[day] ?? 0) + 1;
  }
  return out;
}

/** Сколько дней подряд были занятия, считая сегодня (или вчера, если сегодня ещё не занимались). */
export function dayStreak(days: Record<string, number>, today: string): number {
  const d = new Date(`${today}T12:00:00`);
  if (!days[today]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days[isoDay(d.getTime())]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
