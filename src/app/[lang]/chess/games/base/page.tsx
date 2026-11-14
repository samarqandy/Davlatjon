import type { Metadata } from "next";
import { GameBase } from "@/components/chess/games/GameBase";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · База партий мастеров" };

export default function ChessGameBasePage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <GameBase />
      </main>
      <SiteFooter />
    </>
  );
}
