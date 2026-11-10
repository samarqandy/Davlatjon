"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PathStop } from "@/components/PathStop";
import { courseLessons } from "@/content/chess/courseLessons";
import { LEVELS } from "@/content/chess/parts/levels";
import { TACTIC_PART } from "@/content/chess/parts/tactics";
import type { ChessTactic } from "@/content/chess/types";
import { useTitleTranslation } from "@/lib/docTitle";
import { useT } from "@/lib/i18n";
import type { CourseStep } from "@/lib/course/step";
import { useHydrated, useStore } from "@/lib/store";
import { useChessPart } from "@/lib/useChess";
import { setHash, useHash } from "@/lib/useHash";
import { DiplomaCard } from "./CourseDiploma";
import { PieceIcon } from "./ChessBoard";
import { parseHash, TopicView, useSolved } from "./TacticsSchool";
import { ChevronDown, Play } from "lucide-react";

/**
 * Курс по ступеням: уроки ступени по порядку, сгруппированные в модули.
 * Урок открывается тем же видом, что и тема тактики: теория, упражнения, словарик.
 */
export function CourseSchool({ step }: { step: CourseStep }) {
  const t = useT();
  const { levels } = useChessPart(LEVELS);
  const { tactics } = useChessPart(TACTIC_PART);
  const content = step.useContent();
  const lessons = useMemo(
    () => courseLessons({ levels, tactics }, content.lessons),
    [levels, tactics, content.lessons],
  );
  const hash = useHash();
  const parsed = parseHash(hash, lessons);
  useTitleTranslation(`Ступень ${step.n}`, content.info.title);
  const number = (id: string) => lessons.findIndex((l) => l.id === id) + 1;
  return (
    <div className="space-y-6">
      {parsed.topic ? (
        <TopicView
          topic={parsed.topic}
          tab={parsed.tab}
          exercise={parsed.exercise}
          siblings={lessons}
          backLabel={t("← Все уроки", "← Barcha darslar")}
          lessonKeyPrefix="course-"
          kicker={t(`Урок ${number(parsed.topic.id)}`, `${number(parsed.topic.id)}-dars`)}
        />
      ) : (
        <Overview step={step} lessons={lessons} />
      )}
    </div>
  );
}

function Overview({ step, lessons }: { step: CourseStep; lessons: (ChessTactic & { piece?: string })[] }) {
  const t = useT();
  const { info: course1, modules: course1Modules } = step.useContent();
  const byId = new Map(lessons.map((l, i) => [l.id, { lesson: l, n: i + 1 }]));
  const hydrated = useHydrated();
  const chess = useStore((s) => s.chess);
  // Первый урок, где ещё есть нерешённые упражнения: его кнопка — первое, что видно на странице.
  const nextIndex = hydrated ? lessons.findIndex((l) => l.exercises.some((e) => !chess[e.id]?.solvedAt)) : 0;
  const next = nextIndex >= 0 ? lessons[nextIndex] : null;
  const started = hydrated && lessons.some((l) => l.exercises.some((e) => chess[e.id]?.solvedAt));
  return (
    <>
      <Link
        href="/chess"
        className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
      >
        {t("← Шахматная школа", "← Shaxmat maktabi")}
      </Link>
      <header className="rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-5 text-white shadow-lift sm:p-6">
        <h1 className="text-2xl leading-tight font-black sm:text-3xl">
          <span className="deco" aria-hidden>
            ♟️{" "}
          </span>
          {course1.title}
        </h1>
        <p className="mt-1 font-bold text-white/85">{course1.subtitle}</p>
        {next && (
          <button
            type="button"
            data-course-next
            onClick={() => setHash(`#${next.id}`)}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-white/12 p-3 text-left ring-1 ring-white/25 transition hover:bg-white/20"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-extrabold tracking-wide text-white/75 uppercase">
                {t(`Урок ${nextIndex + 1} из ${lessons.length}`, `${lessons.length} tadan ${nextIndex + 1}-dars`)}
              </span>
              <span className="block text-lg leading-tight font-black">{next.title}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sun px-4 py-2.5 font-black text-on-sun shadow-[0_3px_0_0_#b45309]">
              <Play className="h-4 w-4 fill-current" aria-hidden />
              {started ? t("Дальше", "Davom") : t("Начать", "Boshlash")}
            </span>
          </button>
        )}
        <details className="group mt-3">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 text-sm font-extrabold text-white/80 select-none [&::-webkit-details-marker]:hidden">
            {t("О курсе", "Kurs haqida")}
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden />
          </summary>
          <p className="mt-1 text-white/90">{course1.about}</p>
        </details>
      </header>
      {/* Путь по урокам: на широком экране модули идут в две колонки подряд, чтобы страница не стала вдвое длиннее. */}
      <div className="gap-x-10 lg:columns-2" data-course-path>
        {course1Modules.map((m, mi) => {
          const stops = m.lessons.flatMap((id) => byId.get(id) ?? []);
          return (
            <section
              key={m.id}
              className="mb-8 break-inside-avoid space-y-2"
              aria-labelledby={`module-${m.id}`}
              data-course-module={m.id}
            >
              <h2 id={`module-${m.id}`} className="text-2xl font-black">
                <span className="text-muted">{mi + 1}.</span> {m.title}
              </h2>
              <ol>
                {stops.map((item, i) => (
                  <LessonStop
                    key={item.lesson.id}
                    lesson={item.lesson}
                    n={item.n}
                    last={i === stops.length - 1}
                    current={hydrated && item.lesson.id === next?.id}
                    started={started}
                  />
                ))}
              </ol>
            </section>
          );
        })}
      </div>
      <DiplomaCard step={step} />
    </>
  );
}

/**
 * Урок на пути. Клетка — как поле доски: светлые и тёмные чередуются, урок «на очереди» подсвечен жёлтым,
 * как последний ход на доске, пройденный — с зелёной отметкой. Линия ведёт к следующему уроку модуля.
 */
function LessonStop({
  lesson,
  n,
  last,
  current,
  started,
}: {
  lesson: ChessTactic & { piece?: string };
  n: number;
  last: boolean;
  current: boolean;
  started: boolean;
}) {
  const t = useT();
  const hydrated = useHydrated();
  const { count } = useSolved(lesson);
  const total = lesson.exercises.length;
  const solved = hydrated ? count : 0;
  const done = total > 0 && solved === total;
  return (
    <PathStop
      n={n}
      last={last}
      done={done}
      current={current}
      tile={lesson.piece ? <PieceIcon piece={lesson.piece} className="h-12 w-12" /> : lesson.emoji}
      tileClassName={n % 2 ? "bg-[#f0d9b5] shadow-[0_3px_0_0_#d9bd8e]" : "bg-[#b58863] shadow-[0_3px_0_0_#8f6a4a]"}
      kicker={t(`Урок ${n}`, `${n}-dars`)}
      title={lesson.title}
      note={
        done ? (
          <span className="text-success-ink">{t("✓ пройден", "✓ oʻtildi")}</span>
        ) : current ? (
          <span className="text-brand-dark">
            {started ? t("Дальше — сюда", "Davomi — shu yerda") : t("Начни отсюда", "Shu yerdan boshla")}
          </span>
        ) : solved > 0 ? (
          `${solved} / ${total}`
        ) : undefined
      }
      onClick={() => setHash(`#${lesson.id}`)}
      attrs={{ "data-course-lesson": lesson.id, "data-lesson-state": done ? "done" : current ? "current" : "open" }}
    />
  );
}
