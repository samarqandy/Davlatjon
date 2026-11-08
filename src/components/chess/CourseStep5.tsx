"use client";

import { STEP_5 } from "@/lib/course/step5";
import { CourseDiploma } from "./CourseDiploma";
import { CourseSchool } from "./CourseSchool";

/** Ступень 5: страницы курса и диплома (свой модуль — чтобы страница грузила только контент этой ступени). */
export function Course5School() {
  return <CourseSchool step={STEP_5} />;
}

export function Course5Diploma() {
  return <CourseDiploma step={STEP_5} />;
}
