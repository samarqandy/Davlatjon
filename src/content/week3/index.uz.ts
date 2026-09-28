/** Неделя 3 по-узбекски: название, цель и дни (накладки на русские тексты, см. src/content/localize.ts). */
import type { WeekUz } from "../uz";
import { day1Uz } from "./day1.uz";
import { day2Uz } from "./day2.uz";
import { day3Uz } from "./day3.uz";
import { day4Uz } from "./day4.uz";
import { day5Uz } from "./day5.uz";
import { day6Uz } from "./day6.uz";
import { day7Uz } from "./day7.uz";

export const week3Uz: WeekUz = {
  days: {
    w3d1: day1Uz,
    w3d2: day2Uz,
    w3d3: day3Uz,
    w3d4: day4Uz,
    w3d5: day5Uz,
    w3d6: day6Uz,
    w3d7: day7Uz,
  },
};
