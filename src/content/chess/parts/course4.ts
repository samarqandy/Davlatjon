import { COURSE_4, COURSE_4_LESSONS, COURSE_4_MODULES } from "../course4";
import { course4LessonsUz, course4ModulesUz, course4Uz } from "../uz/course4";
import { chessPart } from "./make";

/** Курс по ступеням: ступень 4 «Ладья». */
export const COURSE4_PART = chessPart(
  { course4: COURSE_4, course4Modules: COURSE_4_MODULES, course4Lessons: COURSE_4_LESSONS },
  { course4: course4Uz, course4Modules: course4ModulesUz, course4Lessons: course4LessonsUz },
);
