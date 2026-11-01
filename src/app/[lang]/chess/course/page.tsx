import type { Metadata } from "next";
import { CourseSchool } from "@/components/chess/CourseSchool";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Ступень 1" };

export default function CoursePage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <CourseSchool />
      </main>
      <SiteFooter />
    </>
  );
}
