/**
 * Рейтинг: общий список детей, чьи родители разрешили участие. Показываются только имя в игре, аватарка и очки.
 * Чистая логика (без React и базы): недели, возрастные группы, направления и проверка запроса.
 */
import type { XpBreakdown } from "./xp";

export const AGE_BANDS = ["4-6", "7-9", "10+"] as const;
export type AgeBand = (typeof AGE_BANDS)[number];
export type AgeFilter = AgeBand | "all";

/** Возрастная группа: малыши не соревнуются со школьниками постарше. Без возраста — в средней группе. */
export function ageBand(age: number | undefined): AgeBand {
  if (age !== undefined && age <= 6) return "4-6";
  if (age !== undefined && age >= 10) return "10+";
  return "7-9";
}

export const SCOPES = ["week", "all"] as const;
export type Scope = (typeof SCOPES)[number];

export const CATEGORIES = ["total", "math", "chess", "puzzles", "quick"] as const;
export type Category = (typeof CATEGORIES)[number];

/** Ташкентская неделя: начинается в понедельник по времени UTC+5. Ключ — дата этого понедельника. */
export function weekKey(now: number): string {
  const shifted = new Date(now + 5 * 3_600_000);
  const day = (shifted.getUTCDay() + 6) % 7; // понедельник = 0
  const monday = new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate() - day));
  return monday.toISOString().slice(0, 10);
}

/** Начало отсчёта недели: если неделя сменилась, «нуль» — очки на прошлой записи; в ту же неделю — прежний. */
export function nextBase(
  prev: { week: string; base: XpBreakdown; totals: XpBreakdown } | null,
  current: XpBreakdown,
  week: string,
): XpBreakdown {
  if (!prev) return current;
  return prev.week === week ? prev.base : prev.totals;
}

/** Сколько очков за неделю: разница с началом недели, но не меньше нуля. */
export function weeklyGain(totals: XpBreakdown, base: XpBreakdown, category: Category): number {
  return Math.max(0, totals[category] - base[category]);
}

export interface Query {
  scope: Scope;
  category: Category;
  age: AgeFilter;
}

export function parseQuery(params: URLSearchParams): Query {
  const scope = params.get("scope");
  const category = params.get("cat");
  const age = params.get("age");
  return {
    scope: (SCOPES as readonly string[]).includes(scope ?? "") ? (scope as Scope) : "week",
    category: (CATEGORIES as readonly string[]).includes(category ?? "") ? (category as Category) : "total",
    age: (AGE_BANDS as readonly string[]).includes(age ?? "") ? (age as AgeBand) : "all",
  };
}

export interface LeaderRow {
  rank: number;
  username: string;
  avatar: string | null;
  /** Очки за выбранный период и направление. */
  value: number;
  /** Уровень по всему опыту. */
  level: number;
  /** Сильнейшее направление ребёнка (по всему опыту), если есть хоть какие-то очки. */
  best: Exclude<Category, "total"> | null;
  mine: boolean;
}

export interface LeaderResponse {
  week: string;
  query: Query;
  rows: LeaderRow[];
  /** Места моих детей (если не вошли в первые строки). */
  mine: LeaderRow[];
  /** Сколько всего участников в этой выборке. */
  count: number;
}

/** Сильнейшее направление по очкам; при равенстве — первое по порядку. */
export function bestCategory(b: XpBreakdown): LeaderRow["best"] {
  const order = ["math", "chess", "puzzles", "quick"] as const;
  let best: (typeof order)[number] | null = null;
  for (const c of order) if (b[c] > 0 && (best === null || b[c] > b[best])) best = c;
  return best;
}
