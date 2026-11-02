import type { Metadata } from "next";
import { CourseDiploma } from "@/components/chess/CourseDiploma";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Диплом ступени «Пешка»" };

export default function CourseDiplomaPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16 print:p-0">
        <CourseDiploma />
      </main>
      <SiteFooter />
    </>
  );
}
