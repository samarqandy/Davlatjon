import type { Metadata } from "next";
import { Course3Diploma } from "@/components/chess/CourseStep3";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Диплом ступени «Слон»" };

export default function Course3DiplomaPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16 print:p-0">
        <Course3Diploma />
      </main>
      <SiteFooter />
    </>
  );
}
