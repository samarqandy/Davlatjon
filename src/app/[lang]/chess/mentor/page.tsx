import type { Metadata } from "next";
import { MentorBoard } from "@/components/chess/mentor/MentorBoard";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Доска тренера" };

export default function MentorPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <MentorBoard />
      </main>
      <SiteFooter />
    </>
  );
}
