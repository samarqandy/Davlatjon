"use client";

import { ArrowLeft, Lightbulb, Printer, X } from "lucide-react";
import { currentScrollBehavior } from "@/lib/useMotion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TaskView } from "@/components/task/TaskView";
import { Button, ButtonLink, cn, Icon } from "@/components/ui";
import { sectionsFor } from "@/content/meta";
import { printHref } from "@/lib/routes";
import type { Day } from "@/content/types";
import { useTitleTranslation } from "@/lib/docTitle";
import { useBoth, useLang, useT, type Both } from "@/lib/i18n";
import { startDay, useHydrated, useStore } from "@/lib/store";
import { setHash, useHash } from "@/lib/useHash";
import { DayFinish } from "./DayFinish";
import { DayIntro } from "./DayIntro";
import { RestStop } from "./RestStop";
import { ReviewStep } from "./ReviewStep";

/** После каких задач малышам предлагаем передохнуть. */
export const REST_AFTER = [3, 6];

/** Номер задачи, после которой показана остановка («#rest-3»), иначе 0. */
function restFromHash(hash: string): number {
  const m = hash.match(/^#rest-(\d+)$/);
  return m && REST_AFTER.includes(Number(m[1])) ? Number(m[1]) : 0;
}

/** Id задачи на повторении («#review-w1d2t3»), иначе пустая строка. */
function reviewFromHash(hash: string): string {
  return hash.match(/^#review-([a-z0-9]+)$/)?.[1] ?? "";
}

function stepFromHash(hash: string, total: number): number {
  if (hash === "#finish") return total + 1;
  const rest = restFromHash(hash);
  if (rest) return Math.min(rest, total);
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
export function DaySession({
  day: both,
  nextDayHref,
  weekDayIds,
}: {
  day: Both<Day>;
  nextDayHref: string | null;
  /** Все дни этой недели — чтобы после последнего дня показать сертификат недели. */
  weekDayIds: string[];
}) {
  const t = useT();
  const day = useBoth(both);
  useTitleTranslation(`День ${both.ru.day}. ${both.ru.title}`, `${both.uz.day}-kun. ${both.uz.title}`);
  const total = day.tasks.length;
  const hash = useHash();
  const step = stepFromHash(hash, total);
  const resting = restFromHash(hash) > 0 && step < total;
  const reviewTaskId = reviewFromHash(hash);
  const reviewing = reviewTaskId ? day.tasks.find((task) => task.id === reviewTaskId) : undefined;
  const young = useStore((s) => (s.settings.age ?? 0) < 9);
  const router = useRouter();
  const bigText = useStore((s) => s.settings.bigText);
  const progress = useStore((s) => s.tasks);
  const solved = (i: number) => progress[day.tasks[i]?.id]?.status === "solved";
  // Все задачи дня решены именно в этом занятии (а не раньше) — итоги встретит фанфара. Считаем от первого
  // состояния после загрузки сохранённого прогресса, чтобы повторный заход в пройденный день её не включал.
  const hydrated = useHydrated();
  const allSolved = day.tasks.every((task) => progress[task.id]?.status === "solved");
  const [seen, setSeen] = useState<{ id: string; all: boolean } | null>(null);
  const [finishedNow, setFinishedNow] = useState<string | null>(null);
  if (hydrated && (seen?.id !== day.id || seen.all !== allSolved)) {
    if (seen?.id === day.id && !seen.all && allSolved) setFinishedNow(day.id);
    setSeen({ id: day.id, all: allSolved });
  }
  // Остались ли подсказки у задачи на экране: тогда в нижней панели есть вход к ним.
  const current = day.tasks[step - 1];
  const hintsLeft = !!current && !solved(step - 1) && (progress[current.id]?.hints ?? 0) < current.hints.length;

  useEffect(() => {
    if (step >= 1) startDay(day.id);
  }, [step, day.id]);

  // «Дальше» нажали — фокус на заголовок новой задачи: диктор читает её, а Tab идёт по её содержимому,
  // а не от нижней панели. При первой загрузке фокус не трогаем.
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    document.querySelector<HTMLElement>("[data-step-heading]")?.focus({ preventScroll: true });
  }, [step]);

  const go = (s: number) => {
    moved.current = true;
    setHash(hashForStep(s, total), { keepScroll: true });
    window.scrollTo({ top: 0, behavior: currentScrollBehavior() });
  };
  // Малышам после третьей и шестой задачи — спокойная остановка, если дальше ещё есть задачи
  // и они в самом деле поработали: хотя бы две из трёх последних задач решены.
  const forward = () => {
    const worked = [step - 1, step - 2, step - 3].filter((i) => i >= 0 && solved(i)).length >= 2;
    if (young && worked && !resting && REST_AFTER.includes(step) && step < total) {
      setHash(`#rest-${step}`, { keepScroll: true });
      window.scrollTo({ top: 0, behavior: currentScrollBehavior() });
    } else go(step + 1);
  };

  // Повторение — отдельный экран той же страницы: без полоски дня, вступления и итогов.
  if (reviewing) return <ReviewStep key={reviewing.id} day={day} task={reviewing} bigText={bigText} />;

  return (
    <div className={cn("pb-28", bigText && "big-text")}>
      {/*
       * На телефоне шапка — одна строка: «закрыть» и полоска задач. Название дня и печать есть во вступлении,
       * а место на экране нужно задаче и полю ответа. С планшета — как раньше: название, печать и плитки задач.
       */}
      <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 px-4 py-1.5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-3 sm:py-2.5">
          <Link
            href="/"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl hover:bg-black/5 sm:h-10 sm:w-10"
            aria-label={t("На главную", "Bosh sahifaga")}
          >
            <X aria-hidden className="h-6 w-6 sm:hidden" strokeWidth={2.5} />
            <span aria-hidden className="hidden sm:inline">
              ←
            </span>
          </Link>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-xs font-bold text-muted">
              {t(`Неделя ${day.week} · День ${day.day}`, `${day.week}-hafta · ${day.day}-kun`)}
            </p>
            <p className="line-clamp-2 leading-tight font-black">{day.title}</p>
          </div>
          <ButtonLink href={printHref(day)} variant="secondary" size="sm" className="shrink-0 max-sm:hidden">
            <Icon icon={Printer} /> {t("Распечатать", "Chop etish")}
          </ButtonLink>
          <ProgressDots day={day} step={step} onGo={go} />
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-3 sm:pt-5">
        {step === 0 && <DayIntro day={day} onStart={() => go(1)} />}
        {/* На экране задачи видимого заголовка дня нет (он есть в начале и в конце) — оставляем его для экранного диктора. */}
        {step >= 1 && step <= total && (
          <h1 className="sr-only">
            {t(`Неделя ${day.week}, день ${day.day}: ${day.title}`, `${day.week}-hafta, ${day.day}-kun: ${day.title}`)}
          </h1>
        )}
        {resting && <RestStop onRest={() => router.push("/")} onMore={() => go(step + 1)} />}
        {step >= 1 && step <= total && !resting && (
          <TaskView key={day.tasks[step - 1].id} task={day.tasks[step - 1]} number={step} total={total} />
        )}
        {step > total && (
          <DayFinish
            day={day}
            nextDayHref={nextDayHref}
            weekDayIds={weekDayIds}
            fanfare={finishedNow === day.id}
            onFanfare={() => setFinishedNow(null)}
          />
        )}
      </main>

      {step >= 1 && step <= total && !resting && (
        <nav
          data-day-nav
          className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur"
          aria-label={t("Переход между задачами", "Masalalar orasida oʻtish")}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-3">
            <Button variant="secondary" onClick={() => go(step - 1)} className="shrink-0 max-sm:px-3.5">
              {/* На телефоне — только стрелка; название кнопки остаётся прежним для чтения с экрана. */}
              <Icon icon={ArrowLeft} className="sm:hidden" />
              <span className="max-sm:sr-only">← {t("Назад", "Orqaga")}</span>
            </Button>
            {/* На телефоне посередине — вход к подсказкам: он всегда под рукой и не занимает место над ответом. */}
            {hintsLeft && (
              <button
                type="button"
                data-hint-jump
                onClick={() =>
                  document
                    .getElementById("hints")
                    ?.scrollIntoView({ behavior: currentScrollBehavior(), block: "center" })
                }
                className="inline-flex min-h-12 min-w-12 items-center justify-center gap-1.5 rounded-2xl bg-sun-soft px-3.5 text-base font-extrabold text-sun-ink lg:hidden"
              >
                <Icon icon={Lightbulb} />
                <span className="max-[359px]:sr-only">{t("Подсказка", "Maslahat")}</span>
              </button>
            )}
            <span data-task-counter className={cn("text-sm font-bold text-muted", hintsLeft && "max-lg:hidden")}>
              {step} / {total}
            </span>
            {/* Пока задача не решена, «Дальше» тише «Проверить»: главным остаётся проверка, но пропустить можно. */}
            <Button
              variant={solved(step - 1) || step === total ? "primary" : "secondary"}
              onClick={forward}
              className="shrink-0"
            >
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
      className="flex min-w-0 items-center gap-1 sm:col-span-3 sm:gap-1.5 sm:overflow-x-auto sm:pt-2"
      aria-label={t("Задачи дня", "Kun masalalari")}
    >
      {day.tasks.map((task, i) => {
        const p = hydrated ? tasks[task.id] : undefined;
        const current = step === i + 1;
        const solved = p?.status === "solved";
        const started = !solved && p?.status === "started";
        return (
          <li key={task.id} className="min-w-0 flex-1 sm:max-w-12">
            <button
              type="button"
              onClick={() => onGo(i + 1)}
              aria-current={current ? "step" : undefined}
              aria-label={t(
                `Задача ${i + 1}: ${task.title}${solved ? " — решена" : ""}`,
                `${i + 1}-masala: ${task.title}${solved ? " — yechildi" : ""}`,
              )}
              data-task-step={solved ? "solved" : started ? "started" : "open"}
              className={cn(
                // Телефон: кнопка высотой 44 px, внутри — тонкая полоска. С планшета — плитка со значком раздела.
                "relative flex h-11 w-full items-center justify-center transition sm:h-10 sm:min-w-10 sm:rounded-xl sm:border-2 sm:text-lg",
                current
                  ? "sm:border-brand sm:bg-brand-soft sm:shadow-[0_0_0_3px_rgb(79_70_229/0.18)]"
                  : solved
                    ? "sm:border-mint/50 sm:bg-mint-soft"
                    : started
                      ? "sm:border-sun/60 sm:bg-surface"
                      : "sm:border-line sm:bg-surface",
              )}
              title={`${i + 1}. ${task.title}`}
            >
              <span
                aria-hidden
                className={cn(
                  "block w-full rounded-full sm:hidden",
                  current ? "h-3.5" : "h-2.5",
                  solved ? "bg-mint" : current ? "bg-brand" : started ? "bg-sun" : "bg-line",
                )}
              />
              <span aria-hidden className="hidden sm:inline">
                {SECTIONS[task.section].emoji}
              </span>
              {started && (
                <span
                  className="absolute -top-1.5 -right-1.5 hidden h-4 w-4 items-center justify-center rounded-full bg-sun text-[10px] font-black text-on-sun sm:flex"
                  aria-hidden
                >
                  …
                </span>
              )}
              {solved && (
                <span
                  className="absolute -top-1.5 -right-1.5 hidden h-4 w-4 items-center justify-center rounded-full bg-success-fill text-[10px] font-black text-white sm:flex"
                  aria-hidden
                >
                  ✓
                </span>
              )}
            </button>
          </li>
        );
      })}
      <li className="shrink-0 sm:max-w-12 sm:min-w-0 sm:flex-1">
        <button
          type="button"
          onClick={() => onGo(day.tasks.length + 1)}
          className={cn(
            "flex h-11 w-9 items-center justify-center text-base sm:h-10 sm:w-full sm:min-w-10 sm:rounded-xl sm:border-2 sm:text-lg",
            step > day.tasks.length ? "sm:border-brand sm:bg-brand-soft" : "sm:border-line sm:bg-surface",
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
