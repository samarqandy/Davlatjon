import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameReplay } from "@/components/chess/GameReplay";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { FAMOUS_GAMES, getFamousGame } from "@/content/chess/games";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return FAMOUS_GAMES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const g = getFamousGame(id);
  return { title: g ? `Шахматы · ${g.title}` : "Партия не найдена" };
}

export default async function ChessGamePage({ params }: Props) {
  const { id } = await params;
  const game = getFamousGame(id);
  if (!game) notFound();
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <GameReplay game={game} />
      </main>
      <SiteFooter />
    </>
  );
}
