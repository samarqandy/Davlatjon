import type { ChessHomeSummary } from "@/components/chess/ChessHomeCard";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { chessContent } from "@/content/chess/content";
import type { Lang } from "@/lib/lang";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { WEEKS } from "@/content/program";
import { summarizeWeek } from "@/content/summary";
import { localizeWeek } from "@/content/uz";

/** Сводка шахматной школы для карточки на главной — собирается здесь, на сервере. */
function chessSummary(lang: Lang): ChessHomeSummary {
  const { school, levels } = chessContent(lang);
  return {
    school: { title: school.title },
    levels: levels.map((l) => ({
      id: l.id,
      piece: l.piece,
      name: l.name,
      exercises: l.exercises.map((e) => ({ id: e.id })),
    })),
  };
}

export default function HomePage() {
  return (
    <>
      <SiteHeader active="home" />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6">
        <HomeDashboard
          weeks={{
            ru: WEEKS.map(summarizeWeek),
            uz: WEEKS.map((w) => summarizeWeek(localizeWeek(w, "uz"))),
          }}
          chess={{ ru: chessSummary("ru"), uz: chessSummary("uz") }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
