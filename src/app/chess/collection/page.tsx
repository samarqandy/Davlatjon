import type { Metadata } from "next";
import { CollectionView } from "@/components/chess/Collection";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Коллекция героев" };

export default function Page() {
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <CollectionView />
      </main>
      <SiteFooter />
    </>
  );
}
