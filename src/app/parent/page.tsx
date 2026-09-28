import { ParentDashboard, type ParentWeek } from "@/components/parent/ParentDashboard";
import { ParentGate } from "@/components/parent/ParentGate";
import { WEEKS } from "@/content/program";
import type { Week } from "@/content/types";
import { localizeWeek } from "@/content/uz";

/** Только то, что нужно обзору: без условий, подсказок и решений — страница остаётся лёгкой на обоих языках. */
function parentWeek(w: Week): ParentWeek {
  return {
    number: w.number,
    title: w.title,
    days: w.days.map((d) => ({
      id: d.id,
      week: d.week,
      day: d.day,
      emoji: d.emoji,
      title: d.title,
      skill: d.parent.skills[0],
      tasks: d.tasks.map((t) => ({ id: t.id })),
    })),
  };
}

export default function ParentPage() {
  return (
    <ParentGate>
      <ParentDashboard
        weeks={{
          ru: WEEKS.map(parentWeek),
          uz: WEEKS.map((w) => parentWeek(localizeWeek(w, "uz"))),
        }}
      />
    </ParentGate>
  );
}
