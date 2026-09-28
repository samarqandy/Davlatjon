/** Неделя 1 по-узбекски: название, цель и дни (накладки на русские тексты, см. src/content/localize.ts). */
import type { WeekUz } from "../uz";
import { day1Uz } from "./day1.uz";
import { day2Uz } from "./day2.uz";
import { day3Uz } from "./day3.uz";
import { day4Uz } from "./day4.uz";
import { day5Uz } from "./day5.uz";
import { day6Uz } from "./day6.uz";
import { day7Uz } from "./day7.uz";

export const week1Uz: WeekUz = {
  days: {
    w1d1: day1Uz,
    w1d2: day2Uz,
    w1d3: day3Uz,
    w1d4: day4Uz,
    w1d5: day5Uz,
    w1d6: day6Uz,
    w1d7: day7Uz,
  },
};
