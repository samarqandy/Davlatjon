import type { Metadata } from "next";
import { TacticsSchool } from "@/components/chess/TacticsSchool";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Тактика" };

export default function TacticsPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <TacticsSchool />
      </main>
      <SiteFooter />
    </>
  );
}
