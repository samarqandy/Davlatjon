import { COURSE_2, COURSE_2_LESSONS, COURSE_2_MODULES } from "../course2";
import { course2LessonsUz, course2ModulesUz, course2Uz } from "../uz/course2";
import { chessPart } from "./make";

/** Курс по ступеням: ступень 2 «Конь». */
export const COURSE2_PART = chessPart(
  { course2: COURSE_2, course2Modules: COURSE_2_MODULES, course2Lessons: COURSE_2_LESSONS },
  { course2: course2Uz, course2Modules: course2ModulesUz, course2Lessons: course2LessonsUz },
);
