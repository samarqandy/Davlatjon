import type { Metadata } from "next";
import { Course2School } from "@/components/chess/CourseStep2";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Ступень 2" };

export default function Course2Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <Course2School />
      </main>
      <SiteFooter />
    </>
  );
}
