"use client";

import { STEP_3 } from "@/lib/course/step3";
import { CourseDiploma } from "./CourseDiploma";
import { CourseSchool } from "./CourseSchool";

/** Ступень 3: страницы курса и диплома (свой модуль — чтобы страница грузила только контент этой ступени). */
export function Course3School() {
  return <CourseSchool step={STEP_3} />;
}

export function Course3Diploma() {
  return <CourseDiploma step={STEP_3} />;
}
