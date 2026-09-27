import type { Metadata } from "next";
import { Secrets } from "@/components/chess/Secrets";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Тайны и легенды" };

export default function Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <Secrets />
      </main>
      <SiteFooter />
    </>
  );
}
