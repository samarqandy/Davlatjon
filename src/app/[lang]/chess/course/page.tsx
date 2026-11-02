import type { Metadata } from "next";
import { Course1School } from "@/components/chess/CourseStep1";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Ступень 1" };

export default function CoursePage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <Course1School />
      </main>
      <SiteFooter />
    </>
  );
}
