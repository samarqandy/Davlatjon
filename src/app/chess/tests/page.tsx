import type { Metadata } from "next";
import { ChessTests } from "@/components/chess/ChessTests";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Контрольные тесты" };

export default function ChessTestsPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <ChessTests />
      </main>
      <SiteFooter />
    </>
  );
}
