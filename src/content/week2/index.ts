import { REVIEW_QUESTIONS } from "../review";
import type { Week } from "../types";
import { day1 } from "./day1";
import { day2 } from "./day2";
import { day3 } from "./day3";
import { day4 } from "./day4";
import { day5 } from "./day5";
import { day6 } from "./day6";
import { day7 } from "./day7";

export const week2: Week = {
  number: 2,
  title: "Неделя инструментов",
  subtitle: "Как решать трудные задачи",
  goal: "Собрать ящик инструментов мыслителя: рисунок, ход с конца, маленький пример, умная проба, поиск того, что не меняется, похожая задача — и научиться выбирать нужный инструмент.",
  days: [day1, day2, day3, day4, day5, day6, day7],
  review: REVIEW_QUESTIONS,
};
