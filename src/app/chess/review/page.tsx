import type { Metadata } from "next";
import { ReviewHub } from "@/components/chess/GameReview";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Разбор партий" };

export default function Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <ReviewHub />
      </main>
      <SiteFooter />
    </>
  );
}
