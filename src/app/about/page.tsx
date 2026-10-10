import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { allTasks, WEEKS } from "@/content/program";
import { CHESS_LEVELS } from "@/content/chess";
import { SECRETS } from "@/content/chess/secrets";
import bank from "@/content/chess/puzzle-bank.json";

export const metadata: Metadata = {
  title: "Для родителей — что такое Parvoz Edu",
  description:
    "Математика, логика и шахматы для детей 6–12 лет: ежедневные занятия по 20–25 минут, подсказки по одной, шахматная школа, русский и узбекский языки. Без рекламы.",
  // Этот единственный раздел сайта (вместе с «Конфиденциальностью») стоит показывать поисковикам.
  robots: { index: true, follow: true },
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const stats = {
    tasks: allTasks().length,
    weeks: WEEKS.length,
    chessExercises: CHESS_LEVELS.reduce((n, l) => n + l.exercises.length, 0),
    puzzles: (bank as { total: number }).total,
    stories: SECRETS.length,
  };
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <AboutView stats={stats} />
      </main>
      <SiteFooter />
    </>
  );
}
