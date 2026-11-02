"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChildNameBanner } from "@/components/home/ChildNameBanner";
import { Button, ButtonLink, ProgressBar } from "@/components/ui";
import { courseLessons } from "@/content/chess/courseLessons";
import { COURSE_PART } from "@/content/chess/parts/course";
import { LEVELS } from "@/content/chess/parts/levels";
import { TACTIC_PART } from "@/content/chess/parts/tactics";
import { courseDiplomaHref, courseDiplomaNeed, courseEarnedAt } from "@/lib/certificate";
import { nameFor } from "@/lib/childName";
import { useTitleTranslation } from "@/lib/docTitle";
import { useLang, useT } from "@/lib/i18n";
import { useHydrated, useStore } from "@/lib/store";
import { useChessPart } from "@/lib/useChess";
import { PieceIcon } from "./ChessBoard";
import { CertificateSheet } from "./CertificateSheet";

/** Урок с итоговым тестом ступени: его упражнения нужны для диплома все. */
export const FINAL_LESSON = "c1-final-test";

/** Упражнения курса и итогового теста — для диплома и карточки на странице курса. */
export function useCourseIds(): { all: string[]; final: string[]; lessons: number } {
  const { levels } = useChessPart(LEVELS);
  const { tactics } = useChessPart(TACTIC_PART);
  const { course1Lessons } = useChessPart(COURSE_PART);
  return useMemo(() => {
    const lessons = courseLessons({ levels, tactics, course1Lessons });
    const all = [...new Set(lessons.flatMap((l) => l.exercises.map((e) => e.id)))];
    const final = lessons.find((l) => l.id === FINAL_LESSON)?.exercises.map((e) => e.id) ?? [];
    return { all, final, lessons: lessons.length };
  }, [levels, tactics, course1Lessons]);
}

/**
 * Диплом ступени «Пешка» — как в конце книги: лист A4 с именем ребёнка. Выдаётся, когда решён итоговый тест
 * и не меньше 80 % упражнений курса. До этого — сколько осталось.
 */
export function CourseDiploma() {
  const t = useT();
  const lang = useLang();
  const hydrated = useHydrated();
  const { course1 } = useChessPart(COURSE_PART);
  const { all, final, lessons } = useCourseIds();
  useTitleTranslation("Диплом ступени «Пешка»", "«Piyoda» bosqichi diplomi");
  const earnedAt = useStore((s) => courseEarnedAt(all, final, s));
  const solved = useStore((s) => all.filter((id) => s.chess[id]?.solvedAt).length);
  const finalSolved = useStore((s) => final.filter((id) => s.chess[id]?.solvedAt).length);
  const hasName = useStore((s) => !!s.settings.childName);
  const name = useStore((s) => nameFor(lang, s.settings));
  const need = courseDiplomaNeed(all.length);

  if (!hydrated) return <div className="min-h-96" />;

  const back = (
    <Link
      href="/chess/course"
      className="no-print inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
    >
      ← {course1.title}
    </Link>
  );

  if (!earnedAt)
    return (
      <div className="space-y-5">
        {back}
        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-card" data-diploma="locked">
          <h1 className="text-2xl font-black">🔒 {t("Диплом ступени пока закрыт", "Bosqich diplomi hali yopiq")}</h1>
          <p className="text-lg">
            {t(
              `Реши итоговый тест и не меньше ${need} упражнений курса — и получишь диплом с твоим именем.`,
              `Yakuniy testni va kursning kamida ${need} ta mashqini yech — isming yozilgan diplomni olasan.`,
            )}
          </p>
          <div>
            <p className="font-bold">{t("Упражнения курса", "Kurs mashqlari")}</p>
            <div className="mt-1 flex items-center gap-3">
              <ProgressBar value={Math.min(solved, need)} max={need} className="flex-1" />
              <span className="font-black tabular-nums" data-diploma-progress>
                {Math.min(solved, need)}/{need}
              </span>
            </div>
          </div>
          <div>
            <p className="font-bold">{t("Итоговый тест", "Yakuniy test")}</p>
            <div className="mt-1 flex items-center gap-3">
              <ProgressBar value={finalSolved} max={final.length} className="flex-1" />
              <span className="font-black tabular-nums">
                {finalSolved}/{final.length}
              </span>
            </div>
          </div>
          <ButtonLink href={`/chess/course#${FINAL_LESSON}`}>{t("К итоговому тесту →", "Yakuniy testga →")}</ButtonLink>
        </section>
      </div>
    );

  return (
    <div className="space-y-5">
      {back}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">🎓 {t("Диплом ступени «Пешка»", "«Piyoda» bosqichi diplomi")}</h1>
          <p className="text-muted">
            {t(
              "Распечатай на листе A4 (альбомная ориентация) — и повесь на стену!",
              "A4 varaqqa (albom koʻrinishida) chop et — va devorga osib qoʻy!",
            )}
          </p>
        </div>
        <Button variant="sun" onClick={() => window.print()}>
          🖨️ {t("Распечатать", "Chop etish")}
        </Button>
      </div>
      {!hasName && (
        <div className="no-print">
          <ChildNameBanner />
        </div>
      )}
      <CertificateSheet
        heading={t("Диплом", "Diplom")}
        icon={
          <PieceIcon
            piece="wP"
            className="relative h-[13cqi] w-[13cqi] rounded-full bg-[#f0d9b5] p-[1.2cqi] ring-[0.5cqi] ring-[#d8b46a]"
          />
        }
        name={hasName ? name : " "}
        award={t(
          "награждается дипломом за прохождение ступени",
          "bosqichni muvaffaqiyatli oʻtgani uchun diplom bilan taqdirlanadi",
        )}
        title={t("Пешка", "Piyoda")}
        detail={t(
          `Курс из ${lessons} уроков: решено ${solved} из ${all.length} упражнений и итоговый тест.`,
          `${lessons} ta darsli kurs: ${all.length} ta mashqdan ${solved} tasi va yakuniy test yechildi.`,
        )}
        earnedAt={earnedAt}
      />
    </div>
  );
}

/** Карточка диплома внизу страницы курса: сколько осталось или ссылка на готовый диплом. */
export function DiplomaCard() {
  const t = useT();
  const hydrated = useHydrated();
  const { all, final } = useCourseIds();
  const earned = useStore((s) => courseEarnedAt(all, final, s) !== null);
  const solved = useStore((s) => all.filter((id) => s.chess[id]?.solvedAt).length);
  const need = courseDiplomaNeed(all.length);
  const shown = hydrated ? Math.min(solved, need) : 0;
  return (
    <Link
      href={courseDiplomaHref}
      data-diploma-card={hydrated && earned ? "earned" : "locked"}
      className="flex items-center gap-4 rounded-3xl border-2 border-[#d8b46a] bg-[#fffaf0] p-5 shadow-card transition hover:-translate-y-0.5"
    >
      <span className="text-5xl" aria-hidden>
        🎓
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xl font-black text-[#7a4b00]">
          {hydrated && earned
            ? t("Диплом ступени получен — открыть и распечатать", "Bosqich diplomi olindi — ochish va chop etish")
            : t("Диплом ступени «Пешка»", "«Piyoda» bosqichi diplomi")}
        </span>
        {!(hydrated && earned) && (
          <span className="mt-2 flex items-center gap-3">
            <ProgressBar value={shown} max={need} className="flex-1" />
            <span className="text-sm font-black tabular-nums">
              {shown}/{need}
            </span>
          </span>
        )}
        {!(hydrated && earned) && (
          <span className="mt-1 block text-sm text-muted">
            {t("Нужны итоговый тест и 80 % упражнений курса.", "Yakuniy test va kurs mashqlarining 80 % i kerak.")}
          </span>
        )}
      </span>
    </Link>
  );
}
