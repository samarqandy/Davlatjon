import type { Metadata } from "next";
import { EndgameSchool } from "@/components/chess/EndgameSchool";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Эндшпиль" };

export default function EndgamesPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <EndgameSchool />
      </main>
      <SiteFooter />
    </>
  );
}
