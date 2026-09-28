import { REVIEW_QUESTIONS } from "../review";
import type { Week } from "../types";
import { day1 } from "./day1";
import { day2 } from "./day2";
import { day3 } from "./day3";
import { day4 } from "./day4";
import { day5 } from "./day5";
import { day6 } from "./day6";
import { day7 } from "./day7";

export const week1: Week = {
  number: 1,
  title: "Неделя открытий",
  subtitle: "Как думают математики",
  goal: "Заложить главные привычки мыслителя: замечать, искать правило, проверять, перебирать по порядку, думать шагами, искать другой способ и исследовать.",
  days: [day1, day2, day3, day4, day5, day6, day7],
  review: REVIEW_QUESTIONS,
};
