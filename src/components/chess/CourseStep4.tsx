"use client";

import { STEP_4 } from "@/lib/course/step4";
import { CourseDiploma } from "./CourseDiploma";
import { CourseSchool } from "./CourseSchool";

/** Ступень 4: страницы курса и диплома (свой модуль — чтобы страница грузила только контент этой ступени). */
export function Course4School() {
  return <CourseSchool step={STEP_4} />;
}

export function Course4Diploma() {
  return <CourseDiploma step={STEP_4} />;
}
