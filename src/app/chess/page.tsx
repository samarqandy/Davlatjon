import type { Metadata } from "next";
import { ChessSchool } from "@/components/chess/ChessSchool";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматная школа" };

export default function ChessPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6">
        <ChessSchool />
      </main>
      <SiteFooter />
    </>
  );
}
