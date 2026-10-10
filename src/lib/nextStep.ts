/**
 * «Следующий шаг» — одна функция на все места, где мы говорим «вот что дальше»: главная и «Продолжить».
 * Считается из уже записанного прогресса, поэтому всегда совпадает с тем, что видно в днях и задачах.
 */
import type { DaySummary } from "@/content/summary";
import type { AppState } from "./state";

export interface NextDayStep {
  day: DaySummary;
  /** Ребёнок уже занимался этим днём. */
  started: boolean;
  /** Номер первой нерешённой задачи (с 1); больше числа задач — все решены, остались итоги дня. */
  taskNumber: number;
  /** Ссылка, по которой «Продолжить» ведёт прямо к нужной задаче. */
  href: string;
}

export const dayHref = (d: Pick<DaySummary, "week" | "day">) => `/week/${d.week}/day/${d.day}`;

/** Первый не пройденный день и место в нём, где остановились. */
export function nextDayStep(days: readonly DaySummary[], s: AppState): NextDayStep | null {
  const day = days.find((d) => !s.days[d.id]?.completedAt);
  if (!day) return null;
  const solved = (id: string) => s.tasks[id]?.status === "solved";
  const started = !!s.days[day.id]?.startedAt || day.tasks.some((t) => s.tasks[t.id]?.status);
  const firstOpen = day.tasks.findIndex((t) => !solved(t.id));
  const taskNumber = firstOpen === -1 ? day.tasks.length + 1 : firstOpen + 1;
  const base = dayHref(day);
  const href = !started ? base : taskNumber > day.tasks.length ? `${base}#finish` : `${base}#task-${taskNumber}`;
  return { day, started, taskNumber, href };
}
