import type { Metadata } from "next";
import { CoordinateTrainer } from "@/components/chess/CoordinateTrainer";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Координаты и запись ходов" };

export default function Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <CoordinateTrainer />
      </main>
      <SiteFooter />
    </>
  );
}
