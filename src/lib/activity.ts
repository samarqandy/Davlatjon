/**
 * Активное время и дневное ограничение. Без React и браузера: считают и страница, и сервер (отчёт в Telegram), и тесты.
 * Время считается честно по тому, что происходит на экране (см. ActivityTracker), а не по «открытой вкладке».
 */
import { ACTIVITY_DAYS_KEPT, type AppState, isoDay } from "./state";

const MINUTE = 60_000;

/** Сколько «лишнего» времени родитель может добавить за один раз, мин. */
export const EXTEND_CHOICES = [10, 15, 30] as const;

export const minutes = (ms: number) => Math.round(ms / MINUTE);

/** Прибавить активное время к дню (старые дни за пределами хранилища отбрасываются). */
export function withActivity(s: AppState, day: string, ms: number): AppState {
  if (!(ms > 0)) return s;
  const prev = s.activity[day] ?? { ms: 0 };
  const activity = { ...s.activity, [day]: { ...prev, ms: Math.min(prev.ms + ms, 24 * 3_600_000) } };
  const days = Object.keys(activity).sort().reverse();
  for (const old of days.slice(ACTIVITY_DAYS_KEPT)) delete activity[old];
  return { ...s, activity };
}

/** Родитель разрешил ещё немного времени сегодня. */
export function withExtra(s: AppState, day: string, ms: number): AppState {
  const prev = s.activity[day] ?? { ms: 0 };
  return { ...s, activity: { ...s.activity, [day]: { ...prev, extra: (prev.extra ?? 0) + ms } } };
}

export interface LimitStatus {
  /** Сколько минут в день разрешено; null — без ограничения. */
  limitMin: number | null;
  usedMs: number;
  extraMs: number;
  /** Сколько времени ещё есть (null — без ограничения). */
  remainingMs: number | null;
  reached: boolean;
}

export function limitStatus(s: AppState, day: string): LimitStatus {
  const limitMin = s.settings.dailyLimitMin ? s.settings.dailyLimitMin : null;
  const today = s.activity[day];
  const usedMs = today?.ms ?? 0;
  const extraMs = today?.extra ?? 0;
  if (limitMin === null) return { limitMin, usedMs, extraMs, remainingMs: null, reached: false };
  const remainingMs = limitMin * MINUTE + extraMs - usedMs;
  return { limitMin, usedMs, extraMs, remainingMs, reached: remainingMs <= 0 };
}

/** Активные минуты в каждый из дней [from, to] включительно (календарные дни, по порядку). */
export function minutesByDay(s: AppState, from: string, to: string): { day: string; minutes: number }[] {
  const out: { day: string; minutes: number }[] = [];
  const d = new Date(`${from}T12:00:00`);
  for (let i = 0; i < 400; i++) {
    const day = isoDay(d.getTime());
    if (day > to) break;
    out.push({ day, minutes: minutes(s.activity[day]?.ms ?? 0) });
    d.setDate(d.getDate() + 1);
  }
  return out;
}
