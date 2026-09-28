import type { Metadata } from "next";
import { PuzzleHub } from "@/components/chess/PuzzleHub";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Задачи" };

export default function ChessPuzzlesPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <PuzzleHub />
      </main>
      <SiteFooter />
    </>
  );
}
