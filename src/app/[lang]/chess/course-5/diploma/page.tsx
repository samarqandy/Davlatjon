import type { Metadata } from "next";
import { Course5Diploma } from "@/components/chess/CourseStep5";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Диплом ступени «Ферзь»" };

export default function Course5DiplomaPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16 print:p-0">
        <Course5Diploma />
      </main>
      <SiteFooter />
    </>
  );
}
