"use client";

import { currentScrollBehavior } from "@/lib/useMotion";
import Link from "next/link";
import { RichText } from "@/components/RichText";
import { Button, cn, ProgressBar } from "@/components/ui";
import type { ChessTactic } from "@/content/chess/types";
import { useTitleTranslation } from "@/lib/docTitle";
import { useLang, useT } from "@/lib/i18n";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Celebration } from "@/components/rewards/Celebration";
import { useHydrated, useStore } from "@/lib/store";
import { useChessPart } from "@/lib/useChess";
import { TACTIC_PART } from "@/content/chess/parts/tactics";
import { setHash, useHash } from "@/lib/useHash";
import { ChessExerciseView } from "./ChessExercises";
import { ChessLesson } from "./ChessLesson";
import { ArrowLeft, BookOpen, Library, Target, X } from "lucide-react";

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
  const { tactics, tacticsSchool } = useChessPart(TACTIC_PART);
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
  const { tactics, tacticsSchool } = useChessPart(TACTIC_PART);
  return (
    <>
      <Link
        href="/chess"
        className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
      >
        {t("← Шахматная школа", "← Shaxmat maktabi")}
      </Link>
      <header className="rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-6 text-white shadow-lift sm:p-8">
        <h1 className="text-3xl font-black sm:text-4xl">
          <span className="deco" aria-hidden>
            ⚔️{" "}
          </span>
          {tacticsSchool.title}
        </h1>
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
      className="rounded-3xl bg-surface p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
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

  // Последнее упражнение темы решено только что (а не раньше) — праздник. Считаем от первого числа после загрузки
  // сохранённого прогресса, чтобы повторный заход в пройденную тему не устраивал салют.
  const hydrated = useHydrated();
  const [seen, setSeen] = useState<{ id: string; count: number } | null>(null);
  const [celebrated, setCelebrated] = useState<string | null>(null);
  if (hydrated && (seen?.id !== topic.id || seen.count !== count)) {
    if (seen?.id === topic.id && seen.count < total && count === total) setCelebrated(topic.id);
    setSeen({ id: topic.id, count });
  }
  const celebrate = celebrated === topic.id;

  // К упражнениям, а не к началу страницы — после отрисовки (из урока блока упражнений ещё нет).
  const scrollToExercises = useRef(false);
  useEffect(() => {
    if (!scrollToExercises.current || tab !== "exercises") return;
    scrollToExercises.current = false;
    document.getElementById("exercises-top")?.scrollIntoView({ block: "start", behavior: currentScrollBehavior() });
    // Фокус — на заголовок нового упражнения: диктор читает задание, Tab идёт к доске.
    document.querySelector<HTMLElement>("[data-exercise-heading]")?.focus({ preventScroll: true });
  }, [tab, exercise]);
  const goExercise = (i: number) => {
    scrollToExercises.current = true;
    setHash(`#${topic.id}-exercise-${i + 1}`, { keepScroll: true });
  };

  // Куда идти после упражнения: к следующему, а после последнего — к следующей теме.
  const solvedNow = hydrated && ids.has(topic.exercises[exercise]?.id);
  const onwardLabel =
    exercise < total - 1
      ? t("Следующее упражнение →", "Keyingi mashq →")
      : next
        ? t(`Следующая тема: ${next.title} →`, `Keyingi mavzu: ${next.title} →`)
        : null;
  const goOnward = () => {
    if (exercise < total - 1) goExercise(exercise + 1);
    else if (next) setHash(`#${next.id}`);
  };
  // Панель «дальше» внизу экрана: только в решённом упражнении и не поверх праздника «Тема пройдена».
  const nextBar = tab === "exercises" && solvedNow && !celebrate;

  // В упражнениях — «один экран — одно дело»: вместо шапки урока и вкладок одна строка над заданием.
  // На широком экране так доска получает всю высоту окна, а не то, что осталось под шапкой и вкладками.
  const focus = tab === "exercises";

  return (
    <>
      {/* Компактная шапка урока: задача, а не заголовок, — главное на экране (на телефоне доска сразу видна). */}
      <header
        className={cn(
          "flex items-center gap-3 rounded-3xl bg-linear-to-br from-[#3b2f23] to-[#6b4f33] p-3 text-white shadow-card sm:p-4",
          focus && "hidden",
        )}
      >
        <button
          type="button"
          onClick={() => setHash("#")}
          aria-label={backLabel.replace(/^←\s*/, "")}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/25 transition hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          {kicker && <p className="text-xs font-extrabold tracking-wide text-white/75 uppercase">{kicker}</p>}
          <h1 className="truncate text-xl leading-tight font-black sm:text-2xl">
            <span aria-hidden>{topic.emoji} </span>
            {topic.title}
          </h1>
          <div className="mt-1.5 flex items-center gap-2">
            <ProgressBar value={count} max={total} className="flex-1 bg-white/20" />
            <span className="text-xs font-extrabold whitespace-nowrap">{`${count} / ${total}`}</span>
          </div>
        </div>
      </header>

      <nav
        className={cn("grid grid-cols-3 gap-1.5 rounded-2xl bg-surface p-1.5 shadow-card", focus && "hidden")}
        aria-label={t("Разделы темы", "Mavzu boʻlimlari")}
      >
        {(
          [
            ["lesson", t("Урок", "Dars"), `#${topic.id}`, BookOpen],
            [
              "exercises",
              t(`Упражнения ${count}/${total}`, `Mashqlar ${count}/${total}`),
              `#${topic.id}-exercises`,
              Target,
            ],
            ["dictionary", t("Словарик", "Lugʻat"), `#${topic.id}-dictionary`, Library],
          ] as const
        ).map(([id, label, href, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              if (id === "exercises") scrollToExercises.current = true;
              setHash(href, { keepScroll: true });
            }}
            aria-current={tab === id ? "page" : undefined}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-sm leading-tight font-extrabold transition sm:px-4 sm:text-base",
              tab === id ? "bg-brand text-white" : "text-muted hover:bg-brand-soft hover:text-brand-dark",
            )}
          >
            <Icon className="hidden h-4 w-4 shrink-0 sm:block" aria-hidden />
            {label}
          </button>
        ))}
      </nav>

      {tab === "lesson" && <p className="text-lg font-bold text-pretty">{topic.idea}</p>}

      {tab === "lesson" && (
        <ChessLesson levelId={`${lessonKeyPrefix}${topic.id}`} cards={topic.lesson} onDone={() => goExercise(0)} />
      )}

      {tab === "exercises" && (
        <section
          className={cn("board-wide space-y-2", nextBar && "max-lg:pb-20")}
          style={{ "--stage-chrome": "10.5rem" } as CSSProperties}
          aria-label={t("Упражнения", "Mashqlar")}
        >
          {/* Шапка урока в упражнении скрыта — главный заголовок страницы остаётся для экранного диктора. */}
          <h1 className="sr-only">
            {t(
              `${topic.title}: упражнение ${exercise + 1} из ${total}`,
              `${topic.title}: ${total} tadan ${exercise + 1}-mashq`,
            )}
          </h1>
          <div id="exercises-top" className="scroll-mt-20 max-lg:scroll-mt-2">
            {/* «Закрыть», полоска упражнений и возврат к уроку — одна строка: доска помещается на экран. */}
            <div data-focus-screen className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setHash("#")}
                aria-label={backLabel.replace(/^←\s*/, "")}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl hover:bg-black/5"
              >
                <X className="h-6 w-6" strokeWidth={2.5} aria-hidden />
              </button>
              <ol
                data-step-strip
                className="flex min-w-0 flex-1 items-center gap-1"
                aria-label={t("Упражнения урока", "Dars mashqlari")}
              >
                {topic.exercises.map((e, i) => (
                  <li key={e.id} className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => goExercise(i)}
                      aria-label={t(
                        `Упражнение ${i + 1}: ${e.title}${ids.has(e.id) ? " (решено)" : ""}`,
                        `${i + 1}-mashq: ${e.title}${ids.has(e.id) ? " (yechilgan)" : ""}`,
                      )}
                      aria-current={i === exercise ? "step" : undefined}
                      className="flex h-11 w-full items-center"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "block w-full rounded-full",
                          i === exercise ? "h-3.5" : "h-2.5",
                          ids.has(e.id) ? "bg-mint" : i === exercise ? "bg-brand" : "bg-line",
                        )}
                      />
                    </button>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => setHash(`#${topic.id}`, { keepScroll: true })}
                aria-label={t("К уроку", "Darsga qaytish")}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-brand-dark hover:bg-brand-soft"
              >
                <BookOpen className="h-5 w-5" strokeWidth={2.25} aria-hidden />
              </button>
            </div>
          </div>
          <div className="rounded-3xl bg-paper p-1 sm:p-2">
            <ChessExerciseView
              key={topic.exercises[exercise].id}
              exercise={topic.exercises[exercise]}
              footer={
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Button variant="secondary" onClick={() => goExercise(exercise - 1)} disabled={exercise === 0}>
                    {t("← Назад", "← Orqaga")}
                  </Button>
                  {/* Пока упражнение не решено, «дальше» тише «Проверить»; на телефоне после решения его заменяет панель внизу. */}
                  {onwardLabel && (
                    <Button
                      variant={solvedNow ? "primary" : "secondary"}
                      onClick={goOnward}
                      className={cn(nextBar && "max-lg:hidden")}
                    >
                      {onwardLabel}
                    </Button>
                  )}
                </div>
              }
            />
          </div>
          {celebrate && (
            <Celebration
              title={t("Тема пройдена! 🏆", "Mavzu oʻzlashtirildi! 🏆")}
              actions={
                next ? (
                  <Button size="lg" onClick={() => setHash(`#${next.id}`)}>
                    {t(`Дальше: ${next.title} →`, `Keyingisi: ${next.title} →`)}
                  </Button>
                ) : (
                  <Button size="lg" variant="secondary" onClick={() => setHash("#")}>
                    {backLabel}
                  </Button>
                )
              }
            >
              {t(`Все ${total} упражнений решены.`, `Barcha ${total} ta mashq yechildi.`)}
            </Celebration>
          )}
          {/* Телефон: упражнение решено — «дальше» само появляется внизу экрана, искать его прокруткой не нужно. */}
          {nextBar && onwardLabel && (
            <div
              data-exercise-next
              className="fixed inset-x-0 bottom-0 z-20 animate-fade-up border-t border-line bg-surface/95 px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
            >
              <Button onClick={goOnward} className="w-full">
                {onwardLabel}
              </Button>
            </div>
          )}
        </section>
      )}

      {tab === "dictionary" && (
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <h2 className="text-xl font-black">
            <span className="deco" aria-hidden>
              🔤{" "}
            </span>
            {t("Словарик", "Lugʻat")}
          </h2>
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
