import type { Metadata } from "next";
import { AwardsPage } from "@/components/Awards";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Награды и календарь" };

export default function Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <AwardsPage />
      </main>
      <SiteFooter />
    </>
  );
}
