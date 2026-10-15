import type { Metadata } from "next";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Рейтинг" };

export default function LeaderboardPage() {
  return (
    <>
      <SiteHeader active="leaderboard" />
      <main className="mx-auto max-w-3xl px-4 pt-6 pb-16">
        <LeaderboardView />
      </main>
      <SiteFooter />
    </>
  );
}
