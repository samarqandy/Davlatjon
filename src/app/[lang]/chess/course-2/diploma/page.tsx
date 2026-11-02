import type { Metadata } from "next";
import { Course2Diploma } from "@/components/chess/CourseStep2";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Диплом ступени «Конь»" };

export default function Course2DiplomaPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16 print:p-0">
        <Course2Diploma />
      </main>
      <SiteFooter />
    </>
  );
}
