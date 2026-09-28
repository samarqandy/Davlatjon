/**
 * Программа занятий по-узбекски: накладки на недели, дни, вопросы наблюдения и методичку.
 * Собирается на сервере — в браузер уходит готовый текст нужного дня на обоих языках.
 */
import type { Both, Lang } from "@/lib/i18n";
import { GUIDE, THINKING_CHAIN } from "./guide";
import { guideUz, thinkingChainUz } from "./guide.uz";
import { overlay, type Uz } from "./localize";
import { reviewUz } from "./review.uz";
import type { Day, Week } from "./types";
import { week1Uz } from "./week1/index.uz";
import { week2Uz } from "./week2/index.uz";
import { week3Uz } from "./week3/index.uz";

export interface WeekUz {
  title?: string;
  subtitle?: string;
  goal?: string;
  /** Дни по id дня («w1d3»). */
  days: Record<string, Uz<Day>>;
}

export const WEEKS_UZ: Record<number, WeekUz> = { 1: week1Uz, 2: week2Uz, 3: week3Uz };

export function localizeDay(day: Day, lang: Lang): Day {
  if (lang === "ru") return day;
  return overlay(day, WEEKS_UZ[day.week]?.days[day.id]);
}

export function localizeWeek(week: Week, lang: Lang): Week {
  if (lang === "ru") return week;
  const uz = WEEKS_UZ[week.number];
  return {
    ...overlay(week, { title: uz?.title, subtitle: uz?.subtitle, goal: uz?.goal, review: reviewUz }),
    days: week.days.map((d) => localizeDay(d, lang)),
  };
}

/** Обе версии сразу — для страниц, которые показывают текст на языке ребёнка. */
export function both<T>(value: T, localize: (value: T, lang: Lang) => T): Both<T> {
  return { ru: value, uz: localize(value, "uz") };
}

export function guideFor(lang: Lang) {
  return lang === "uz"
    ? { guide: overlay(GUIDE, guideUz), chain: overlay(THINKING_CHAIN, thinkingChainUz) }
    : { guide: GUIDE, chain: THINKING_CHAIN };
}
