import type { Metadata } from "next";
import { Course5School } from "@/components/chess/CourseStep5";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Ступень 5" };

export default function Course5Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <Course5School />
      </main>
      <SiteFooter />
    </>
  );
}
