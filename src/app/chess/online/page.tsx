import type { Metadata } from "next";
import { OnlineHub } from "@/components/online/OnlineHub";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматы · Играть с друзьями" };

export default function OnlinePage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <OnlineHub />
      </main>
      <SiteFooter />
    </>
  );
}
