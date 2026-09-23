"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TaskView } from "@/components/task/TaskView";
import { Button, ButtonLink, cn } from "@/components/ui";
import { SECTIONS } from "@/content/meta";
import { printHref } from "@/content/program";
import type { Day } from "@/content/types";
import { startDay, useHydrated, useStore } from "@/lib/store";
import { setHash, useHash } from "@/lib/useHash";
import { DayFinish } from "./DayFinish";
import { DayIntro } from "./DayIntro";

function stepFromHash(hash: string, total: number): number {
  if (hash === "#finish") return total + 1;
  const m = hash.match(/^#task-(\d+)$/);
  if (!m) return 0;
  return Math.min(Math.max(Number(m[1]), 1), total);
}

function hashForStep(step: number, total: number): string {
  if (step <= 0) return "#start";
  if (step > total) return "#finish";
  return `#task-${step}`;
}

export function DaySession({ day, nextDayHref }: { day: Day; nextDayHref: string | null }) {
  const total = day.tasks.length;
  const hash = useHash();
  const step = stepFromHash(hash, total);
  const bigText = useStore((s) => s.settings.bigText);

  useEffect(() => {
    if (step >= 1) startDay(day.id);
  }, [step, day.id]);

  const go = (s: number) => {
    setHash(hashForStep(s, total));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={cn("pb-28", bigText && "big-text")}>
      <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl hover:bg-black/5"
            aria-label="На главную"
          >
            ←
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-muted">
              Неделя {day.week} · День {day.day}
            </p>
            <p className="truncate font-black">{day.title}</p>
          </div>
          <ButtonLink href={printHref(day)} variant="secondary" size="sm" className="shrink-0">
            🖨 <span className="hidden sm:inline">Распечатать</span>
          </ButtonLink>
        </div>
        <ProgressDots day={day} step={step} onGo={go} />
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-5">
        {step === 0 && <DayIntro day={day} onStart={() => go(1)} />}
        {step >= 1 && step <= total && (
          <TaskView key={day.tasks[step - 1].id} task={day.tasks[step - 1]} number={step} total={total} />
        )}
        {step > total && <DayFinish day={day} nextDayHref={nextDayHref} />}
      </main>

      {step >= 1 && step <= total && (
        <nav
          className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 backdrop-blur"
          aria-label="Переход между задачами"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <Button variant="secondary" onClick={() => go(step - 1)}>
              ← {step === 1 ? "Начало" : "Назад"}
            </Button>
            <span className="text-sm font-bold text-muted">
              {step} / {total}
            </span>
            <Button onClick={() => go(step + 1)}>{step === total ? "Итоги дня 🏁" : "Дальше →"}</Button>
          </div>
        </nav>
      )}
    </div>
  );
}

function ProgressDots({ day, step, onGo }: { day: Day; step: number; onGo: (s: number) => void }) {
  const hydrated = useHydrated();
  const tasks = useStore((s) => s.tasks);
  return (
    <ol className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 pt-0.5 pb-2.5" aria-label="Задачи дня">
      {day.tasks.map((t, i) => {
        const p = hydrated ? tasks[t.id] : undefined;
        const current = step === i + 1;
        const solved = p?.status === "solved";
        return (
          <li key={t.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onGo(i + 1)}
              aria-current={current ? "step" : undefined}
              aria-label={`Задача ${i + 1}: ${t.title}${solved ? " — решена" : ""}`}
              className={cn(
                "relative flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl border-2 text-lg transition",
                current
                  ? "border-brand bg-brand-soft shadow-[0_0_0_3px_rgb(79_70_229/0.18)]"
                  : solved
                    ? "border-mint/50 bg-mint-soft"
                    : p?.status === "started"
                      ? "border-sun/60 bg-white"
                      : "border-line bg-white",
              )}
              title={`${i + 1}. ${t.title}`}
            >
              <span aria-hidden>{SECTIONS[t.section].emoji}</span>
              {solved && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-mint text-[10px] font-black text-white">
                  ✓
                </span>
              )}
            </button>
          </li>
        );
      })}
      <li className="shrink-0">
        <button
          type="button"
          onClick={() => onGo(day.tasks.length + 1)}
          className={cn(
            "flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl border-2 text-lg",
            step > day.tasks.length ? "border-brand bg-brand-soft" : "border-line bg-white",
          )}
          aria-label="Итоги дня"
          title="Итоги дня"
        >
          🏁
        </button>
      </li>
    </ol>
  );
}
