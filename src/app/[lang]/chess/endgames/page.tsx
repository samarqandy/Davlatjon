import type { Metadata } from "next";
import { EndgameSchool } from "@/components/chess/EndgameSchool";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { ENDGAME_PIECES } from "@/content/chess/endgamePieces";

export const metadata: Metadata = { title: "Шахматы · Эндшпиль" };

/** id упражнений второй части (ладья, ферзь, слон) — для прогресса на карточке; сами уроки на своей странице. */
const PIECES_EXERCISES = ENDGAME_PIECES.flatMap((x) => x.exercises.map((e) => e.id));

export default function EndgamesPage() {
  return (
    <>
      <SiteHeader active="chess" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <EndgameSchool piecesExercises={PIECES_EXERCISES} />
      </main>
      <SiteFooter />
    </>
  );
}
