import { COURSE_3, COURSE_3_LESSONS, COURSE_3_MODULES } from "../course3";
import { course3LessonsUz, course3ModulesUz, course3Uz } from "../uz/course3";
import { chessPart } from "./make";

/** Курс по ступеням: ступень 3 «Слон». */
export const COURSE3_PART = chessPart(
  { course3: COURSE_3, course3Modules: COURSE_3_MODULES, course3Lessons: COURSE_3_LESSONS },
  { course3: course3Uz, course3Modules: course3ModulesUz, course3Lessons: course3LessonsUz },
);
