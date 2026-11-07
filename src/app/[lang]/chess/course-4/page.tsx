import type { Metadata } from "next";
import { Course4School } from "@/components/chess/CourseStep4";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Ступень 4" };

export default function Course4Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <Course4School />
      </main>
      <SiteFooter />
    </>
  );
}
