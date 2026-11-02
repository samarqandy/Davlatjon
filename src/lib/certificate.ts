/**
 * Сертификат о шахматном звании: когда звание получено и как написать дату на двух языках.
 * Звание — все упражнения уровня решены; дата — день, когда решено последнее из них.
 */
import type { ChessLevel } from "@/content/chess/types";
import type { Lang } from "./lang";
import type { AppState } from "./state";

/** Когда получено звание уровня (время последнего решённого упражнения) или null, если ещё не получено. */
export function rankEarnedAt(level: Pick<ChessLevel, "exercises">, s: Pick<AppState, "chess">): number | null {
  let last = 0;
  for (const e of level.exercises) {
    const at = s.chess[e.id]?.solvedAt;
    if (!at) return null;
    last = Math.max(last, at);
  }
  return level.exercises.length ? last : null;
}

/** Диплом ступени курса: решён итоговый тест и не меньше этой доли всех упражнений курса. */
export const COURSE_DIPLOMA_SHARE = 0.8;

/** Сколько упражнений курса нужно решить для диплома. */
export const courseDiplomaNeed = (total: number) => Math.ceil(total * COURSE_DIPLOMA_SHARE);

/**
 * Когда получен диплом ступени: момент, когда решены и все упражнения итогового теста, и нужная доля курса
 * (время решения того упражнения, на котором набралась доля), — или null, если ещё не получен.
 */
export function courseEarnedAt(all: string[], final: string[], s: Pick<AppState, "chess">): number | null {
  const at = (id: string) => s.chess[id]?.solvedAt ?? 0;
  if (!all.length || final.some((id) => !at(id))) return null;
  const times = all
    .map(at)
    .filter((t) => t > 0)
    .sort((a, b) => a - b);
  const need = courseDiplomaNeed(all.length);
  if (times.length < need) return null;
  return Math.max(times[need - 1], ...final.map(at));
}

export const courseDiplomaHref = "/chess/course/diploma";

const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];
const MONTHS_UZ = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];

/** Дата словами: «29 сентября 2026 г.» / «2026-yil 29-sentabr». */
export function longDate(ms: number, lang: Lang): string {
  const d = new Date(ms);
  const day = d.getDate();
  const year = d.getFullYear();
  return lang === "uz"
    ? `${year}-yil ${day}-${MONTHS_UZ[d.getMonth()]}`
    : `${day} ${MONTHS_RU[d.getMonth()]} ${year} г.`;
}

/** Когда закончена неделя (завершён последний из её дней) или null, если дни ещё не все пройдены. */
export function weekEarnedAt(week: { days: { id: string }[] }, s: Pick<AppState, "days">): number | null {
  let last = 0;
  for (const d of week.days) {
    const at = s.days[d.id]?.completedAt;
    if (!at) return null;
    last = Math.max(last, at);
  }
  return week.days.length ? last : null;
}

export const weekCertificateHref = (week: number) => `/certificate/week/${week}`;

export const certificateHref = (levelId: string) => `/chess/certificate/${levelId}`;
