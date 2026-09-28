"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TaskView } from "@/components/task/TaskView";
import { Button, ButtonLink, cn } from "@/components/ui";
import { sectionsFor } from "@/content/meta";
import { printHref } from "@/content/program";
import type { Day } from "@/content/types";
import { useTitleTranslation } from "@/lib/docTitle";
import { useBoth, useLang, useT, type Both } from "@/lib/i18n";
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

/** День приходит с сервера на обоих языках (id задач одинаковые) — показываем нужный. */
export function DaySession({ day: both, nextDayHref }: { day: Both<Day>; nextDayHref: string | null }) {
  const t = useT();
  const day = useBoth(both);
  useTitleTranslation(`День ${both.ru.day}. ${both.ru.title}`, `${both.uz.day}-kun. ${both.uz.title}`);
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
            aria-label={t("На главную", "Bosh sahifaga")}
          >
            ←
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-muted">
              {t(`Неделя ${day.week} · День ${day.day}`, `${day.week}-hafta · ${day.day}-kun`)}
            </p>
            <p className="truncate font-black">{day.title}</p>
          </div>
          <ButtonLink href={printHref(day)} variant="secondary" size="sm" className="shrink-0">
            🖨 <span className="hidden sm:inline">{t("Распечатать", "Chop etish")}</span>
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
          aria-label={t("Переход между задачами", "Masalalar orasida oʻtish")}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <Button variant="secondary" onClick={() => go(step - 1)}>
              ← {step === 1 ? t("Начало", "Boshiga") : t("Назад", "Orqaga")}
            </Button>
            <span className="text-sm font-bold text-muted">
              {step} / {total}
            </span>
            <Button onClick={() => go(step + 1)}>
              {step === total ? t("Итоги дня 🏁", "Kun yakuni 🏁") : t("Дальше →", "Keyingi →")}
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}

function ProgressDots({ day, step, onGo }: { day: Day; step: number; onGo: (s: number) => void }) {
  const hydrated = useHydrated();
  const t = useT();
  const SECTIONS = sectionsFor(useLang());
  const tasks = useStore((s) => s.tasks);
  return (
    <ol
      className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 pt-0.5 pb-2.5"
      aria-label={t("Задачи дня", "Kun masalalari")}
    >
      {day.tasks.map((task, i) => {
        const p = hydrated ? tasks[task.id] : undefined;
        const current = step === i + 1;
        const solved = p?.status === "solved";
        return (
          <li key={task.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onGo(i + 1)}
              aria-current={current ? "step" : undefined}
              aria-label={t(
                `Задача ${i + 1}: ${task.title}${solved ? " — решена" : ""}`,
                `${i + 1}-masala: ${task.title}${solved ? " — yechildi" : ""}`,
              )}
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
              title={`${i + 1}. ${task.title}`}
            >
              <span aria-hidden>{SECTIONS[task.section].emoji}</span>
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
          aria-label={t("Итоги дня", "Kun yakuni")}
          title={t("Итоги дня", "Kun yakuni")}
        >
          🏁
        </button>
      </li>
    </ol>
  );
}
