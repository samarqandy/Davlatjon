import type { Metadata } from "next";
import { AnalysisBoard } from "@/components/chess/AnalysisBoard";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Доска анализа" };

export default function AnalysisPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <AnalysisBoard />
      </main>
      <SiteFooter />
    </>
  );
}
