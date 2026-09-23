import type { Day, Level, SectionId, Week } from "./types";

/** Облегчённое описание дня — без условий и ответов (для главной страницы). */
export interface DaySummary {
  id: string;
  week: number;
  day: number;
  title: string;
  emoji: string;
  habit: Day["habit"];
  tasks: { id: string; section: SectionId; level: Level; title: string }[];
}

export interface WeekSummary {
  number: number;
  title: string;
  subtitle: string;
  goal: string;
  days: DaySummary[];
}

export function summarizeDay(d: Day): DaySummary {
  return {
    id: d.id,
    week: d.week,
    day: d.day,
    title: d.title,
    emoji: d.emoji,
    habit: d.habit,
    tasks: d.tasks.map((t) => ({ id: t.id, section: t.section, level: t.level, title: t.title })),
  };
}

export function summarizeWeek(w: Week): WeekSummary {
  return { number: w.number, title: w.title, subtitle: w.subtitle, goal: w.goal, days: w.days.map(summarizeDay) };
}
