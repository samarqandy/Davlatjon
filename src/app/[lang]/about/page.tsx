import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { allTasks, WEEKS } from "@/content/program";
import { CHESS_RU } from "@/content/chess/content";
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

const COURSE_LESSONS = [
  CHESS_RU.course1Lessons,
  CHESS_RU.course2Lessons,
  CHESS_RU.course3Lessons,
  CHESS_RU.course4Lessons,
  CHESS_RU.course5Lessons,
];

/** Разные упражнения шахматной школы: уровни, тактика и собственные упражнения уроков курса (ссылки на уровни не считаем дважды). */
function chessExerciseCount() {
  const ids = new Set<string>();
  for (const l of CHESS_RU.levels) for (const e of l.exercises) ids.add(e.id);
  for (const t of CHESS_RU.tactics) for (const e of t.exercises) ids.add(e.id);
  for (const lessons of COURSE_LESSONS) for (const l of lessons) for (const e of l.exercises) ids.add(e.id);
  return ids.size;
}

export default function AboutPage() {
  const stats = {
    tasks: allTasks().length,
    weeks: WEEKS.length,
    chessExercises: chessExerciseCount(),
    courseLessons: COURSE_LESSONS.reduce((n, l) => n + l.length, 0),
    puzzles: (bank as { total: number }).total,
    stories: SECRETS.length,
  };
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <AboutView stats={stats} />
      </main>
      <SiteFooter />
    </>
  );
}
