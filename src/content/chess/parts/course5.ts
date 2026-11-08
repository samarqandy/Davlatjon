import { COURSE_5, COURSE_5_LESSONS, COURSE_5_MODULES } from "../course5";
import { course5LessonsUz, course5ModulesUz, course5Uz } from "../uz/course5";
import { chessPart } from "./make";

/** Курс по ступеням: ступень 5 «Ферзь». */
export const COURSE5_PART = chessPart(
  { course5: COURSE_5, course5Modules: COURSE_5_MODULES, course5Lessons: COURSE_5_LESSONS },
  { course5: course5Uz, course5Modules: course5ModulesUz, course5Lessons: course5LessonsUz },
);
