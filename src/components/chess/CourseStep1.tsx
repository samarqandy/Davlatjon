"use client";

import { STEP_1 } from "@/lib/course/step1";
import { CourseDiploma } from "./CourseDiploma";
import { CourseSchool } from "./CourseSchool";

/** Ступень 1: страницы курса и диплома (свой модуль — чтобы страница грузила только контент этой ступени). */
export function Course1School() {
  return <CourseSchool step={STEP_1} />;
}

export function Course1Diploma() {
  return <CourseDiploma step={STEP_1} />;
}
