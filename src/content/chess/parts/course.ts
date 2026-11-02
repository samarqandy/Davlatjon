import { COURSE_1, COURSE_1_LESSONS, COURSE_1_MODULES } from "../course";
import { course1LessonsUz, course1ModulesUz, course1Uz } from "../uz/course";
import { chessPart } from "./make";

/** Курс по ступеням (сейчас — ступень 1). */
export const COURSE_PART = chessPart(
  { course1: COURSE_1, course1Modules: COURSE_1_MODULES, course1Lessons: COURSE_1_LESSONS },
  { course1: course1Uz, course1Modules: course1ModulesUz, course1Lessons: course1LessonsUz },
);
