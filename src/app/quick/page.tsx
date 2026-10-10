import type { Metadata } from "next";
import { QuickView } from "@/components/quick/QuickView";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Быстрые примеры" };

export default function Page() {
  return (
    <>
      <SiteHeader active="home" />
      <main className="mx-auto max-w-3xl px-4 pt-6 pb-16">
        <QuickView />
      </main>
      <SiteFooter />
    </>
  );
}
