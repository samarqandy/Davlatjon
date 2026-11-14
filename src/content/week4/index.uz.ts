/** Неделя 4 по-узбекски: название, цель и дни (накладки на русские тексты, см. src/content/localize.ts). */
import type { WeekUz } from "../uz";
import { day1Uz } from "./day1.uz";
import { day2Uz } from "./day2.uz";
import { day3Uz } from "./day3.uz";
import { day4Uz } from "./day4.uz";
import { day5Uz } from "./day5.uz";
import { day6Uz } from "./day6.uz";
import { day7Uz } from "./day7.uz";

export const week4Uz: WeekUz = {
  title: "Geometriya haftasi",
  subtitle: "Shakllarni qanday koʻrish va oʻlchash mumkin",
  goal: "Shakllarni va ularning qismlarini koʻrishni, simmetriya oʻqlarini topishni, aksni burilishdan ajratishni, perimetr bilan yuza farqini tushunishni, qurilmalardagi kubiklarni va koʻrinishlar boʻyicha sanashni, koordinata va masshtabli xaritani oʻqishni oʻrganish.",
  days: {
    w4d1: day1Uz,
    w4d2: day2Uz,
    w4d3: day3Uz,
    w4d4: day4Uz,
    w4d5: day5Uz,
    w4d6: day6Uz,
    w4d7: day7Uz,
  },
};
