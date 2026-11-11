import type { Metadata } from "next";
import { ChessSchool, type ChessSchoolCounts } from "@/components/chess/ChessSchool";
import { ENDGAME_LESSONS } from "@/content/chess/endgames";
import { FAMOUS_GAMES } from "@/content/chess/games";
import { OPENINGS } from "@/content/chess/openings";
import { RIDDLES, SECRETS } from "@/content/chess/secrets";
import { chessHubSummary } from "@/content/chess/hubSummary";
import { CHESS_TESTS } from "@/content/chess/tests";
import { PUZZLE_TOTAL } from "@/lib/puzzleStats";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Шахматная школа" };

/** Числа для карточек школы — на сервере, чтобы не грузить в браузер сами разделы. */
const COUNTS: ChessSchoolCounts = {
  openings: OPENINGS.length,
  games: FAMOUS_GAMES.length,
  endgameDrills: ENDGAME_LESSONS.flatMap((l) => l.drills).length,
  secrets: SECRETS.length,
  riddles: RIDDLES.length,
  testExercises: CHESS_TESTS.flatMap((t) => t.exercises.map((e) => e.id)),
  puzzles: PUZZLE_TOTAL,
};

/** Названия, счётчики и словарик на двух языках — вместо текстов уроков и задач в скриптах страницы. */
const SUMMARY = { ru: chessHubSummary("ru"), uz: chessHubSummary("uz") };

export default function ChessPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6">
        <ChessSchool counts={COUNTS} summary={SUMMARY} />
      </main>
      <SiteFooter />
    </>
  );
}
