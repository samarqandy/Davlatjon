import type { Metadata } from "next";
import { Achievements } from "@/components/achievements/Achievements";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Мои успехи" };

export default function AchievementsPage() {
  return (
    <>
      <SiteHeader active="achievements" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-4 pt-6 pb-16">
        <Achievements />
      </main>
      <SiteFooter />
    </>
  );
}
