"use client";

import { currentScrollBehavior } from "@/lib/useMotion";
import Link from "next/link";
import { RichText } from "@/components/RichText";
import { Button, cn, ProgressBar } from "@/components/ui";
import type { ChessTactic } from "@/content/chess/types";
import { useTitleTranslation } from "@/lib/docTitle";
import { useLang, useT } from "@/lib/i18n";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { useChess } from "@/lib/useChess";
import { setHash, useHash } from "@/lib/useHash";
import { ChessExerciseView } from "./ChessExercises";
import { ChessLesson } from "./ChessLesson";

export type Tab = "lesson" | "exercises" | "dictionary";

/** Адрес вида «#fork», «#fork-exercises», «#fork-exercise-3», «#fork-dictionary». */
export function parseHash(
  hash: string,
  tactics: ChessTactic[],
): { topic: ChessTactic | null; tab: Tab; exercise: number } {
  const m = hash.match(/^#([a-z0-9-]+?)(?:-(exercises|dictionary)|-exercise-(\d+))?$/);
  const topic = m ? (tactics.find((x) => x.id === m[1]) ?? null) : null;
  if (!m || !topic) return { topic: null, tab: "lesson", exercise: 0 };
  if (m[3])
    return { topic, tab: "exercises", exercise: Math.min(Math.max(Number(m[3]), 1), topic.exercises.length) - 1 };
  if (m[2] === "exercises") return { topic, tab: "exercises", exercise: 0 };
  if (m[2] === "dictionary") return { topic, tab: "dictionary", exercise: 0 };
  return { topic, tab: "lesson", exercise: 0 };
}

export function TacticsSchool() {
  const t = useT();
  const { tactics, tacticsSchool } = useChess();
  const hash = useHash();
  const parsed = parseHash(hash, tactics);
  useTitleTranslation("Тактика", tacticsSchool.title);
  return (
    <div className="space-y-6">
      {parsed.topic ? (
        <TopicView
          topic={parsed.topic}
          tab={parsed.tab}
          exercise={parsed.exercise}
          siblings={tactics}
          backLabel={t("← Вся тактика", "← Butun taktika")}
          lessonKeyPrefix="tac-"
        />
      ) : (
        <Overview />
      )}
    </div>
  );
}

export function useSolved(topic: ChessTactic): { ids: Set<string>; count: number } {
  const state = useStore((s) => s);
  const ids = new Set(topic.exercises.filter((e) => state.chess[e.id]?.solvedAt).map((e) => e.id));
  return { ids, count: ids.size };
}

function Overview() {
  const t = useT();
  const { tactics, tacticsSchool } = useChess();
  return (
    <>
      <Link
        href="/chess"
        className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
      >
        {t("← Шахматная школа", "← Shaxmat maktabi")}
      </Link>
      <header className="rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-6 text-white shadow-lift sm:p-8">
        <h1 className="text-3xl font-black sm:text-4xl">⚔️ {tacticsSchool.title}</h1>
        <p className="mt-1 text-lg font-bold text-white/85">{tacticsSchool.subtitle}</p>
        <p className="mt-3 text-lg text-white/90">{tacticsSchool.about}</p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2" aria-label={tacticsSchool.title}>
        {tactics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </section>
    </>
  );
}

function TopicCard({ topic }: { topic: ChessTactic }) {
  const t = useT();
  const { count } = useSolved(topic);
  const total = topic.exercises.length;
  return (
    <button
      type="button"
      data-tactic={topic.id}
      onClick={() => setHash(`#${topic.id}`)}
      className="rounded-3xl bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <p className="text-4xl" aria-hidden>
        {topic.emoji}
      </p>
      <h2 className="mt-2 text-2xl font-black">{topic.title}</h2>
      <p className="mt-1 text-muted">{topic.idea}</p>
      <div className="mt-4 flex items-center gap-3">
        <ProgressBar value={count} max={total} className="flex-1" />
        <span className="text-sm font-extrabold whitespace-nowrap">
          {count === total ? t("✓ пройдено", "✓ tugallandi") : `${count} / ${total}`}
        </span>
      </div>
    </button>
  );
}

/**
 * Тема с уроком, упражнениями и словариком. Общая для тактики и курса по ступеням:
 * siblings — соседние темы (для кнопки «Следующая тема»), lessonKeyPrefix — ключ прогресса карточек урока.
 */
export function TopicView({
  topic,
  tab,
  exercise,
  siblings,
  backLabel,
  lessonKeyPrefix,
  kicker,
}: {
  topic: ChessTactic;
  tab: Tab;
  exercise: number;
  siblings: ChessTactic[];
  backLabel: string;
  lessonKeyPrefix: string;
  /** Строка над заголовком, например «Урок 4». */
  kicker?: string;
}) {
  const t = useT();
  const lang = useLang();
  const { ids, count } = useSolved(topic);
  const total = topic.exercises.length;
  const index = siblings.findIndex((x) => x.id === topic.id);
  const next = siblings[index + 1];

  // К упражнениям, а не к началу страницы — после отрисовки (из урока блока упражнений ещё нет).
  const scrollToExercises = useRef(false);
  useEffect(() => {
    if (!scrollToExercises.current || tab !== "exercises") return;
    scrollToExercises.current = false;
    document.getElementById("exercises-top")?.scrollIntoView({ block: "start", behavior: currentScrollBehavior() });
  }, [tab, exercise]);
  const goExercise = (i: number) => {
    scrollToExercises.current = true;
    setHash(`#${topic.id}-exercise-${i + 1}`, { keepScroll: true });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setHash("#")}
        className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
      >
        {backLabel}
      </button>
      <header className="rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-5 text-white shadow-lift sm:p-7">
        <p className="text-4xl" aria-hidden>
          {topic.emoji}
        </p>
        {kicker && <p className="text-sm font-extrabold tracking-wide text-white/80 uppercase">{kicker}</p>}
        <h1 className="text-3xl leading-tight font-black sm:text-4xl">{topic.title}</h1>
        <p className="mt-2 text-lg text-white/90">{topic.idea}</p>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={count} max={total} className="flex-1 bg-white/20" />
          <span className="text-sm font-extrabold whitespace-nowrap">{`${count} / ${total}`}</span>
        </div>
      </header>

      <nav
        className="grid grid-cols-3 gap-1.5 rounded-2xl bg-white p-1.5 shadow-card"
        aria-label={t("Разделы темы", "Mavzu boʻlimlari")}
      >
        {(
          [
            ["lesson", t("📖 Урок", "📖 Dars"), `#${topic.id}`],
            [
              "exercises",
              t(`🎯 Упражнения ${count}/${total}`, `🎯 Mashqlar ${count}/${total}`),
              `#${topic.id}-exercises`,
            ],
            ["dictionary", t("📚 Словарик", "📚 Lugʻat"), `#${topic.id}-dictionary`],
          ] as const
        ).map(([id, label, href]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              if (id === "exercises") scrollToExercises.current = true;
              setHash(href, { keepScroll: true });
            }}
            aria-current={tab === id ? "page" : undefined}
            className={cn(
              "rounded-xl px-2 py-2.5 text-sm leading-tight font-extrabold transition sm:px-4 sm:text-base",
              tab === id ? "bg-brand text-white" : "text-muted hover:bg-brand-soft hover:text-brand-dark",
            )}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "lesson" && (
        <ChessLesson levelId={`${lessonKeyPrefix}${topic.id}`} cards={topic.lesson} onDone={() => goExercise(0)} />
      )}

      {tab === "exercises" && (
        <section className="space-y-4" aria-label={t("Упражнения", "Mashqlar")}>
          <div id="exercises-top" className="flex scroll-mt-20 flex-wrap gap-1.5">
            {topic.exercises.map((e, i) => (
              <button
                key={e.id}
                type="button"
                onClick={() => goExercise(i)}
                aria-label={t(
                  `Упражнение ${i + 1}: ${e.title}${ids.has(e.id) ? " (решено)" : ""}`,
                  `${i + 1}-mashq: ${e.title}${ids.has(e.id) ? " (yechilgan)" : ""}`,
                )}
                aria-current={i === exercise ? "step" : undefined}
                className={cn(
                  "flex h-11 min-w-11 items-center justify-center rounded-xl border-2 px-2 text-base font-black transition",
                  i === exercise
                    ? "border-brand bg-brand text-white"
                    : ids.has(e.id)
                      ? "border-mint/50 bg-mint-soft text-[#065f46]"
                      : "border-line bg-white hover:border-brand/40",
                )}
              >
                {ids.has(e.id) && i !== exercise ? "✓" : i + 1}
              </button>
            ))}
          </div>
          <div className="rounded-3xl bg-paper p-1 sm:p-2">
            <ChessExerciseView key={topic.exercises[exercise].id} exercise={topic.exercises[exercise]} />
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button variant="secondary" onClick={() => goExercise(exercise - 1)} disabled={exercise === 0}>
              {t("← Назад", "← Orqaga")}
            </Button>
            {exercise < total - 1 ? (
              <Button onClick={() => goExercise(exercise + 1)}>{t("Следующее упражнение →", "Keyingi mashq →")}</Button>
            ) : next ? (
              <Button onClick={() => setHash(`#${next.id}`)}>
                {t(`Следующая тема: ${next.title} →`, `Keyingi mavzu: ${next.title} →`)}
              </Button>
            ) : null}
          </div>
        </section>
      )}

      {tab === "dictionary" && (
        <section className="rounded-3xl bg-white p-5 shadow-card">
          <h3 className="text-xl font-black">{t("🔤 Словарик", "🔤 Lugʻat")}</h3>
          <dl className="mt-3 space-y-3">
            {topic.terms.map((term, i) => (
              <div key={i}>
                <dt className="text-lg font-black">
                  {term.term}
                  {term.uz && lang === "ru" && (
                    <span
                      lang="uz"
                      className="ml-2 rounded-lg bg-brand-soft px-2 py-0.5 text-sm font-extrabold text-brand-dark"
                    >
                      {term.uz}
                    </span>
                  )}
                </dt>
                <dd className="text-lg">
                  <RichText text={term.text} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </>
  );
}
