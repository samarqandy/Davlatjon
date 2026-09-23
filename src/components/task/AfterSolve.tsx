"use client";

import { RichText } from "@/components/RichText";
import { cn } from "@/components/ui";
import { setTaskMark, useTask, type TaskMarks } from "@/lib/store";

const MARKS: { key: keyof TaskMarks; emoji: string; label: string }[] = [
  { key: "explained", emoji: "💬", label: "Я объяснил решение" },
  { key: "anotherWay", emoji: "🔁", label: "Я нашёл другой способ" },
  { key: "liked", emoji: "❤️", label: "Понравилась задача" },
  { key: "hard", emoji: "🧗", label: "Было трудно, но я справился" },
];

/** После решения: вопросы «А ещё подумай» и отметки о мышлении (а не только об ответе). */
export function AfterSolve({ taskId, followUps }: { taskId: string; followUps: string[] }) {
  const progress = useTask(taskId);
  if (progress.status !== "solved") return null;
  return (
    <section
      className="animate-fade-up space-y-4 rounded-3xl border border-mint/30 bg-mint-soft/60 p-4"
      aria-label="После решения"
    >
      {followUps.length > 0 && (
        <div>
          <h3 className="mb-2 text-lg font-extrabold">🤔 А ещё подумай</h3>
          <ul className="space-y-1.5">
            {followUps.map((q) => (
              <li key={q} className="child-text flex gap-2 leading-relaxed">
                <span aria-hidden>❓</span>
                <span>
                  <RichText text={q} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="mb-2 text-sm font-extrabold text-[#065f46]">Отметь, что получилось:</h3>
        <div className="flex flex-wrap gap-2">
          {MARKS.map((m) => {
            const on = Boolean(progress.marks[m.key]);
            return (
              <button
                key={m.key}
                type="button"
                aria-pressed={on}
                onClick={() => setTaskMark(taskId, m.key, !on)}
                className={cn(
                  "flex items-center gap-1.5 rounded-2xl border-2 px-3 py-2 text-sm font-bold transition",
                  on
                    ? "border-mint bg-white text-[#065f46] shadow-sm"
                    : "border-transparent bg-white/70 text-muted hover:bg-white",
                )}
              >
                <span className={cn("text-lg", !on && "grayscale")}>{m.emoji}</span>
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
