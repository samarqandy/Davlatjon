/** Неделя 2 по-узбекски: название, цель и дни (накладки на русские тексты, см. src/content/localize.ts). */
import type { WeekUz } from "../uz";
import { day1Uz } from "./day1.uz";
import { day2Uz } from "./day2.uz";
import { day3Uz } from "./day3.uz";
import { day4Uz } from "./day4.uz";
import { day5Uz } from "./day5.uz";
import { day6Uz } from "./day6.uz";
import { day7Uz } from "./day7.uz";

export const week2Uz: WeekUz = {
  title: "Asboblar haftasi",
  subtitle: "Qiyin masalalar qanday yechiladi",
  goal: "Mutafakkirning asboblar qutisini yigʻish: rasm, oxiridan boshlash, kichik misol, aqlli sinov, oʻzgarmaydigan narsani izlash, oʻxshash masala — va kerakli asbobni tanlashni oʻrganish.",
  days: {
    w2d1: day1Uz,
    w2d2: day2Uz,
    w2d3: day3Uz,
    w2d4: day4Uz,
    w2d5: day5Uz,
    w2d6: day6Uz,
    w2d7: day7Uz,
  },
};
