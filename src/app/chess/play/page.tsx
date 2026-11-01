import type { Metadata } from "next";
import { PlayHub } from "@/components/chess/PlayHub";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Играть" };

export default function ChessPlayPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <PlayHub />
      </main>
      <SiteFooter />
    </>
  );
}
