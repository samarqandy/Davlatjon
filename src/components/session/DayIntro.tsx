"use client";

import { ButtonLink, Button, LevelBadge } from "@/components/ui";
import { SECTIONS } from "@/content/meta";
import { printHref } from "@/content/program";
import type { Day } from "@/content/types";
import { useHydrated, useStore } from "@/lib/store";
import { useAgeProfile } from "@/lib/age";

export function DayIntro({ day, onStart }: { day: Day; onStart: () => void }) {
  const hydrated = useHydrated();
  const profile = useAgeProfile();
  const tasks = useStore((s) => s.tasks);
  const solvedCount = hydrated ? day.tasks.filter((t) => tasks[t.id]?.status === "solved").length : 0;
  const started = solvedCount > 0 || (hydrated && day.tasks.some((t) => tasks[t.id]?.status));

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <section className="animate-fade-up rounded-[2rem] border border-line bg-white p-6 shadow-card sm:p-8">
        <div className="mb-4 flex items-center gap-4">
          <span
            className="flex h-20 w-20 shrink-0 animate-float items-center justify-center rounded-3xl bg-brand-soft text-5xl"
            aria-hidden
          >
            {day.emoji}
          </span>
          <div>
            <p className="text-sm font-extrabold tracking-wide text-brand uppercase">День {day.day}</p>
            <h1 className="text-3xl font-black sm:text-4xl">{day.title}</h1>
          </div>
        </div>
        <div className="child-text space-y-3 text-lg leading-relaxed sm:text-xl">
          {day.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-sun-soft px-4 py-2 font-extrabold text-[#7a4b00]">
          <span aria-hidden>{day.habit.emoji}</span>
          Привычка дня: «{day.habit.name}»
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" onClick={onStart}>
            {started ? "Продолжить ▶" : "Начать занятие ▶"}
          </Button>
          <ButtonLink href={printHref(day)} variant="secondary" size="lg">
            🖨 Распечатать
          </ButtonLink>
        </div>
        <p className="mt-4 text-sm text-muted">
          Около 20–30 минут. Не обязательно решить всё: лучше подольше подумать над одной задачей, чем быстро пролистать
          все.
        </p>
      </section>

      <section
        className="animate-fade-up rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-6"
        aria-label="Задачи дня"
      >
        <h2 className="mb-3 flex items-center justify-between text-lg font-extrabold">
          Сегодня тебя ждут
          {hydrated && solvedCount > 0 && (
            <span className="text-sm font-bold text-mint">
              решено {solvedCount} из {day.tasks.length}
            </span>
          )}
        </h2>
        {hydrated && profile.warmupBelow > 0 && (
          <p className="mb-3 text-sm text-muted">
            Задания с пометкой «разминка» можно решить быстро или пропустить — главное для тебя дальше.
          </p>
        )}
        <ol className="space-y-2">
          {day.tasks.map((t, i) => (
            <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-paper px-3 py-2">
              <span className="w-5 text-right text-sm font-bold text-muted">{i + 1}</span>
              <span className="text-xl" aria-hidden>
                {SECTIONS[t.section].emoji}
              </span>
              <span className="min-w-0 flex-1 truncate font-bold">{t.title}</span>
              {hydrated && t.level <= profile.warmupBelow && (
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-bold text-muted">разминка</span>
              )}
              <LevelBadge level={t.level} compact />
              {hydrated && tasks[t.id]?.status === "solved" && <span className="font-black text-mint">✓</span>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
