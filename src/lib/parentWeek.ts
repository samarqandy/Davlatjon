/**
 * «Эта неделя» для родителя: последние 7 дней по уже записанному прогрессу (ничего нового не хранится).
 * Совет на неделю — простые правила по этим числам, без оценок ребёнка.
 */
import { minutesByDay } from "./activity";
import { activityDays } from "./awards";
import { isoDay, type AppState } from "./state";

export interface WeekSummary {
  /** Дни недели по порядку (последний — сегодня) и минуты в каждый. */
  days: { day: string; minutes: number; active: boolean }[];
  activeDays: number;
  minutes: number;
  /** Решено за неделю: задачи по математике, упражнения шахматной школы, шахматные задачи. */
  math: number;
  chess: number;
  puzzles: number;
  /** Задачи по математике, решённые с первой проверки и без подсказок. */
  mathClean: number;
  /** Задачи, где открывали подсказки или ошибались два раза и больше. */
  mathHard: number;
  tip: "start" | "rhythm" | "hints" | "praise";
}

export function weekSummary(s: AppState, today: string): WeekSummary {
  const start = new Date(`${today}T12:00:00`);
  start.setDate(start.getDate() - 6);
  const from = isoDay(start.getTime());
  const inWeek = (ms: number | undefined) => !!ms && isoDay(ms) >= from && isoDay(ms) <= today;
  const acts = activityDays(s);
  const days = minutesByDay(s, from, today).map((d) => ({ ...d, active: d.minutes > 0 || (acts[d.day] ?? 0) > 0 }));

  const tasks = Object.values(s.tasks).filter((t) => inWeek(t.solvedAt));
  const math = tasks.length;
  const mathClean = tasks.filter((t) => t.firstTry && t.hints === 0).length;
  const mathHard = tasks.filter((t) => t.hints > 0 || t.missed >= 2).length;
  const chess = Object.values(s.chess).filter((c) => inWeek(c.solvedAt)).length;
  const puzzles = Object.values(s.chessPuzzles).filter((p) => inWeek(p.solvedAt)).length;
  const activeDays = days.filter((d) => d.active).length;
  const minutes = days.reduce((n, d) => n + d.minutes, 0);

  const tip: WeekSummary["tip"] =
    activeDays === 0 ? "start" : activeDays < 3 ? "rhythm" : math >= 4 && mathHard / math > 0.5 ? "hints" : "praise";
  return { days, activeDays, minutes, math, chess, puzzles, mathClean, mathHard, tip };
}
