import type { Metadata } from "next";
import { Course3School } from "@/components/chess/CourseStep3";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Ступень 3" };

export default function Course3Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <Course3School />
      </main>
      <SiteFooter />
    </>
  );
}
