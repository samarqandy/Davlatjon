/**
 * Задание дня и мягкая серия. Как и опыт, всё считается из уже записанного прогресса:
 * задания дня выбираются по дате, выполнено ли — видно по времени решённых задач и партий.
 */
import { CHESS_LEVELS } from "@/content/chess";
import { allDays } from "@/content/program";
import { isoDay, type AppState } from "./state";

export type QuestKind = "puzzles" | "task" | "exercise" | "game";

export interface QuestGoal {
  kind: QuestKind;
  need: number;
  have: number;
  /** Куда идти за этим делом. */
  href: string;
}

const TASK_COUNT = allDays().reduce((n, d) => n + d.tasks.length, 0);
const EXERCISE_COUNT = CHESS_LEVELS.reduce((n, l) => n + l.exercises.length, 0);

const on = (ms: number | undefined, day: string) => !!ms && isoDay(ms) === day;

/** Сколько дел такого вида сделано в этот день. */
export function doneOn(s: AppState, kind: QuestKind, day: string): number {
  switch (kind) {
    case "puzzles":
      return Object.values(s.chessPuzzles).filter((p) => on(p.solvedAt, day)).length;
    case "task":
      return Object.values(s.tasks).filter((t) => on(t.solvedAt, day)).length;
    case "exercise":
      return Object.values(s.chess).filter((e) => on(e.solvedAt, day)).length;
    case "game":
      return s.chessGames.filter((g) => on(g.at, day)).length;
  }
}

const dayNumber = (day: string) => Math.floor(Date.parse(`${day}T12:00:00Z`) / 86_400_000);

/**
 * Три дела на день: три задачи тренажёра, одна задача по математике и, по очереди, партия или упражнение
 * шахматной школы. Когда всё уже решено, дело заменяется тем, что сделать можно.
 */
export function questFor(s: AppState, day: string): QuestGoal[] {
  const solvedTasks = Object.values(s.tasks).filter((t) => t.solvedAt).length;
  const solvedExercises = Object.values(s.chess).filter((e) => e.solvedAt).length;
  const third: QuestKind = dayNumber(day) % 2 === 0 && solvedExercises < EXERCISE_COUNT ? "exercise" : "game";
  const goals: { kind: QuestKind; need: number; href: string }[] = [
    { kind: "puzzles", need: 3, href: "/chess/puzzles#practice" },
    solvedTasks < TASK_COUNT ? { kind: "task", need: 1, href: "/" } : { kind: "game", need: 1, href: "/chess/play" },
    third === "exercise"
      ? { kind: "exercise", need: 1, href: "/chess" }
      : { kind: "game", need: 1, href: "/chess/play" },
  ];
  // Два одинаковых дела — это одно дело побольше.
  if (goals[1].kind === "game" && goals[2].kind === "game")
    goals.splice(2, 1, { kind: "puzzles", need: 5, href: "/chess/puzzles#practice" });
  if (goals[0].kind === goals[2].kind) goals.splice(0, 1);
  return goals.map((g) => ({ ...g, have: Math.min(g.need, doneOn(s, g.kind, day)) }));
}

export const questDone = (goals: readonly QuestGoal[]) => goals.every((g) => g.have >= g.need);

/** Звёзды дня: сколько дней все три дела были сделаны. */
export function questStars(s: AppState, activeDays: Iterable<string>): number {
  let n = 0;
  for (const day of activeDays) if (questDone(questFor(s, day))) n++;
  return n;
}

// ---------------------------------------------------------------------------
// Мягкая серия
// ---------------------------------------------------------------------------

function mondayOf(d: Date): string {
  const m = new Date(d);
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return isoDay(m.getTime());
}

export interface Streak {
  /** Дней с занятиями в серии. */
  days: number;
  /** Пропущенные дни, которые «заморожены» — не порвали серию. */
  frozen: string[];
}

/**
 * Серия дней с занятиями, где один пропущенный день в неделю (с понедельника по воскресенье) не рвёт серию.
 * Два пропуска подряд рвут. Если сегодня ещё не занимались — серия считается до вчерашнего дня и не пропадает.
 */
export function gentleStreak(days: Record<string, number>, today: string): Streak {
  const d = new Date(`${today}T12:00:00`);
  if (!days[today]) d.setDate(d.getDate() - 1);
  let count = 0;
  let prevFrozen = false;
  const frozen: string[] = [];
  const usedWeeks = new Set<string>();
  for (let guard = 0; guard < 3700; guard++) {
    const key = isoDay(d.getTime());
    if (days[key]) {
      count++;
      prevFrozen = false;
    } else if (!prevFrozen && !usedWeeks.has(mondayOf(d))) {
      usedWeeks.add(mondayOf(d));
      frozen.push(key);
      prevFrozen = true;
    } else break;
    d.setDate(d.getDate() - 1);
  }
  // Пропуск в самом конце цепочки (перед ним занятий не было) ничего не соединяет.
  if (prevFrozen) frozen.pop();
  return { days: count, frozen: count ? frozen : [] };
}

/** Сколько дней на этой неделе (с понедельника) были занятия. */
export function weekActiveDays(days: Record<string, number>, today: string): number {
  const d = new Date(`${today}T12:00:00`);
  const monday = mondayOf(d);
  let n = 0;
  for (const m = new Date(`${monday}T12:00:00`); isoDay(m.getTime()) <= today; m.setDate(m.getDate() + 1))
    if (days[isoDay(m.getTime())]) n++;
  return n;
}
