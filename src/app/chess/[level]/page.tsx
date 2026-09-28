import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChessLevelView } from "@/components/chess/ChessLevelView";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { CHESS_LEVELS, getChessLevel } from "@/content/chess";

type Props = { params: Promise<{ level: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CHESS_LEVELS.map((l) => ({ level: l.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level } = await params;
  const l = getChessLevel(level);
  return { title: l ? `Шахматы · ${l.name}` : "Уровень не найден" };
}

export default async function ChessLevelPage({ params }: Props) {
  const { level } = await params;
  if (!getChessLevel(level)) notFound();
  return (
    <>
      <SiteHeader active="chess" />
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <ChessLevelView levelId={level} />
      </main>
      <SiteFooter />
    </>
  );
}
