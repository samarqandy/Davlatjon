import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { TournamentHub } from "@/components/tournament/TournamentHub";

export const metadata: Metadata = { title: "Турниры: жеребьёвка и таблица" };

export default function Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <TournamentHub />
      </main>
      <SiteFooter />
    </>
  );
}
