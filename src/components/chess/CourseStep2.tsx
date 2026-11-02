"use client";

import { STEP_2 } from "@/lib/course/step2";
import { CourseDiploma } from "./CourseDiploma";
import { CourseSchool } from "./CourseSchool";

/** Ступень 2: страницы курса и диплома (свой модуль — чтобы страница грузила только контент этой ступени). */
export function Course2School() {
  return <CourseSchool step={STEP_2} />;
}

export function Course2Diploma() {
  return <CourseDiploma step={STEP_2} />;
}
