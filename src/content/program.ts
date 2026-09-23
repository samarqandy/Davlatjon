import type { Day, Task, Week } from "./types";
import { week1 } from "./week1";

/**
 * Все недели программы. Чтобы добавить новую неделю, создайте папку
 * `src/content/week2` по образцу `week1` и добавьте её в этот массив.
 */
export const WEEKS: Week[] = [week1];

export const PROGRAM = {
  title: "Лаборатория Давлатжона",
  childName: "Давлатжон",
  motto: "Математика — это место, где происходят интересные вещи.",
  priorities: ["Любопытство", "Мышление", "Рассуждение", "Открытие", "Уверенность"],
};

export function getWeek(week: number): Week | undefined {
  return WEEKS.find((w) => w.number === week);
}

export function getDay(week: number, day: number): Day | undefined {
  return getWeek(week)?.days.find((d) => d.day === day);
}

export function allDays(): Day[] {
  return WEEKS.flatMap((w) => w.days);
}

export function allTasks(): Task[] {
  return allDays().flatMap((d) => d.tasks);
}

export function findTask(taskId: string): { task: Task; day: Day } | undefined {
  for (const day of allDays()) {
    const task = day.tasks.find((t) => t.id === taskId);
    if (task) return { task, day };
  }
  return undefined;
}

export function dayHref(day: Pick<Day, "week" | "day">): string {
  return `/week/${day.week}/day/${day.day}`;
}

export function printHref(day: Pick<Day, "week" | "day">): string {
  return `/week/${day.week}/day/${day.day}/print`;
}

export function parentDayHref(day: Pick<Day, "week" | "day">): string {
  return `/parent/week/${day.week}/day/${day.day}`;
}
