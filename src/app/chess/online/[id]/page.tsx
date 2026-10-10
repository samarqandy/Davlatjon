import type { Metadata } from "next";
import { OnlineGame } from "@/components/online/OnlineGame";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Шахматы · Партия с другом" };

export default async function OnlineGamePage({ params }: Props) {
  const { id } = await params;
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <OnlineGame id={id} />
      </main>
      <SiteFooter />
    </>
  );
}
