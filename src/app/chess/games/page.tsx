import type { Metadata } from "next";
import { FamousGamesList } from "@/components/chess/GameReplay";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Знаменитые партии" };

export default function ChessGamesPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <FamousGamesList />
      </main>
      <SiteFooter />
    </>
  );
}
