import type { Metadata } from "next";
import { EndgamePieces } from "@/components/chess/EndgamePieces";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Эндшпиль: ладья, ферзь и слон" };

export default function EndgamePiecesPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <EndgamePieces />
      </main>
      <SiteFooter />
    </>
  );
}
