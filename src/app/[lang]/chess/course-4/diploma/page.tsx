import type { Metadata } from "next";
import { Course4Diploma } from "@/components/chess/CourseStep4";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Диплом ступени «Ладья»" };

export default function Course4DiplomaPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16 print:p-0">
        <Course4Diploma />
      </main>
      <SiteFooter />
    </>
  );
}
