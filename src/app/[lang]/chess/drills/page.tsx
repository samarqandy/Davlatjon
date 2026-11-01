import type { Metadata } from "next";
import { MiniDrills } from "@/components/chess/MiniDrills";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Тренажёры" };

export default function Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <MiniDrills />
      </main>
      <SiteFooter />
    </>
  );
}
