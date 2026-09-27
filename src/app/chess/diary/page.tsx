import type { Metadata } from "next";
import { ChessDiary } from "@/components/chess/ChessDiary";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Дневник партий" };

export default function Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <ChessDiary />
      </main>
      <SiteFooter />
    </>
  );
}
