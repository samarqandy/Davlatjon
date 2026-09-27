import type { Metadata } from "next";
import { OpeningsView } from "@/components/chess/OpeningsView";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Дебюты" };

export default function Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <OpeningsView />
      </main>
      <SiteFooter />
    </>
  );
}
