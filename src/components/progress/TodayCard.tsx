"use client";

import Link from "next/link";
import { useMemo } from "react";
import { cn, ProgressBar } from "@/components/ui";
import { activityDays } from "@/lib/awards";
import { useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { gentleStreak, questDone, questFor, questStars, weekActiveDays, WEEK_GOAL, type QuestGoal } from "@/lib/quest";
import { useHydrated, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";
import { xpLevel, xpTotal } from "@/lib/xp";

/** Уровень по опыту: число и полоска до следующего уровня. */
export function XpBar({ className, dark }: { className?: string; dark?: boolean }) {
  const t = useT();
  const hydrated = useHydrated();
  const xp = useStore((s) => xpTotal(s));
  const lvl = xpLevel(hydrated ? xp : 0);
  return (
    <div className={className} data-xp={hydrated ? xp : undefined}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-black">⭐ {t(`Уровень ${lvl.level}`, `${lvl.level}-daraja`)}</p>
        <p className={cn("text-xs font-bold tabular-nums", dark ? "text-white/75" : "text-muted")}>
          {lvl.into} / {lvl.need} XP
        </p>
      </div>
      <ProgressBar value={lvl.into} max={lvl.need} className={cn("mt-1", dark && "bg-white/20")} />
    </div>
  );
}

function goalText(g: QuestGoal, t: ReturnType<typeof useT>): string {
  switch (g.kind) {
    case "puzzles":
      return t(
        `Реши ${pluralize(g.need, "задачу", "задачи", "задач")} в тренажёре`,
        `Trenajyorda ${g.need} ta masala yech`,
      );
    case "task":
      return t("Реши задачу по математике", "Matematikadan bitta masala yech");
    case "exercise":
      return t("Реши упражнение шахматной школы", "Shaxmat maktabida bitta mashq bajar");
    case "game":
      return t("Сыграй партию", "Bitta partiya oʻyna");
  }
}

/**
 * «Сегодня»: уровень, задание дня из трёх дел, мягкая серия и цель недели.
 * Всё считается из прогресса — отдельно ничего не хранится.
 */
export function TodayCard({ className }: { className?: string }) {
  const t = useT();
  const hydrated = useHydrated();
  const today = useToday();
  const state = useStore((s) => s);
  const days = useMemo(() => activityDays(state), [state]);
  if (!hydrated || !today) return <section className={cn("min-h-40 rounded-3xl bg-white shadow-card", className)} />;

  const goals = questFor(state, today);
  const done = questDone(goals);
  const stars = questStars(state, Object.keys(days));
  const streak = gentleStreak(days, today);
  const week = weekActiveDays(days, today);
  const flame = Math.min(1 + streak.days / 10, 2);

  return (
    <section className={cn("rounded-3xl bg-white p-5 shadow-card", className)} aria-labelledby="today" data-today>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <h2 id="today" className="text-xl font-black">
            🎯 {t("Задание дня", "Kun vazifasi")}
          </h2>
          <ul className="mt-2 space-y-1.5" data-quest={done ? "done" : "open"}>
            {goals.map((g) => {
              const ok = g.have >= g.need;
              return (
                <li key={g.kind + g.need}>
                  <Link
                    href={g.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border-2 px-3 py-2 transition",
                      ok ? "border-mint/40 bg-mint-soft/60" : "border-line hover:border-brand/40",
                    )}
                  >
                    <span aria-hidden className="text-xl">
                      {ok ? "✅" : "⬜"}
                    </span>
                    <span className="flex-1 font-bold">{goalText(g, t)}</span>
                    <span className="text-sm font-black text-muted tabular-nums">
                      {g.have}/{g.need}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-sm font-bold text-muted">
            {done
              ? t("🌟 Все дела сделаны — звезда дня твоя!", "🌟 Hamma ishlar bajarildi — kun yulduzi seniki!")
              : t("Сделай все три дела — получишь звезду дня.", "Uchala ishni bajar — kun yulduzini olasan.")}{" "}
            {t(`Звёзд дня: ${stars}.`, `Kun yulduzlari: ${stars} ta.`)}
          </p>
        </div>
        <div className="space-y-4">
          <XpBar />
          <div className="flex items-center gap-3">
            <span aria-hidden className="inline-block origin-bottom text-3xl" style={{ transform: `scale(${flame})` }}>
              🔥
            </span>
            <div>
              <p className="font-black" data-streak={streak.days}>
                {streak.days
                  ? t(`${pluralize(streak.days, "день", "дня", "дней")} подряд`, `Ketma-ket ${streak.days} kun`)
                  : t("Начни серию сегодня!", "Seriyani bugun boshla!")}
              </p>
              {streak.frozen.length > 0 && (
                <p className="text-xs font-bold text-muted">
                  {t(
                    "❄️ Один пропуск в неделю прощается — серия не порвалась.",
                    "❄️ Haftada bitta oʻtkazib yuborilgan kun kechiriladi — seriya uzilmadi.",
                  )}
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold">
              📅 {t(`На этой неделе: ${week} из ${WEEK_GOAL} дней`, `Bu hafta: ${WEEK_GOAL} kundan ${week} kun`)}
              {week >= WEEK_GOAL ? t(" — цель недели выполнена! 🎉", " — haftalik maqsad bajarildi! 🎉") : ""}
            </p>
            <ProgressBar value={Math.min(week, WEEK_GOAL)} max={WEEK_GOAL} className="mt-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
