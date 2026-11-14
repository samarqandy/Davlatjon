import { REVIEW_QUESTIONS } from "../review";
import type { Week } from "../types";
import { day1 } from "./day1";
import { day2 } from "./day2";
import { day3 } from "./day3";
import { day4 } from "./day4";
import { day5 } from "./day5";
import { day6 } from "./day6";
import { day7 } from "./day7";

export const week4: Week = {
  number: 4,
  title: "Неделя геометрии",
  subtitle: "Как видеть и измерять фигуры",
  goal: "Научиться видеть фигуры и их части, находить оси симметрии, отличать отражение от поворота, понимать разницу между периметром и площадью, считать кубики в постройках и по видам, читать карту с координатами и масштабом.",
  days: [day1, day2, day3, day4, day5, day6, day7],
  review: REVIEW_QUESTIONS,
};
