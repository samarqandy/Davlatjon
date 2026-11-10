"use client";

import { Lock, Printer } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { ChildNameBanner } from "@/components/home/ChildNameBanner";
import { Button, ButtonLink, ProgressBar, Icon } from "@/components/ui";
import { courseLessons } from "@/content/chess/courseLessons";
import { LEVELS } from "@/content/chess/parts/levels";
import { TACTIC_PART } from "@/content/chess/parts/tactics";
import { courseDiplomaNeed, courseEarnedAt } from "@/lib/certificate";
import { diplomaHref, type CourseStep } from "@/lib/course/step";
import { nameFor } from "@/lib/childName";
import { useTitleTranslation } from "@/lib/docTitle";
import { useLang, useT } from "@/lib/i18n";
import { useHydrated, useStore } from "@/lib/store";
import { useChessPart } from "@/lib/useChess";
import { PieceIcon } from "./ChessBoard";
import { CertificateSheet } from "./CertificateSheet";

/** Упражнения ступени и её итогового теста — для диплома и карточки на странице курса. */
export function useCourseIds(step: CourseStep): { all: string[]; final: string[]; lessons: number } {
  const { levels } = useChessPart(LEVELS);
  const { tactics } = useChessPart(TACTIC_PART);
  const content = step.useContent();
  return useMemo(() => {
    const lessons = courseLessons({ levels, tactics }, content.lessons);
    const all = [...new Set(lessons.flatMap((l) => l.exercises.map((e) => e.id)))];
    const final = lessons.find((l) => l.id === step.final)?.exercises.map((e) => e.id) ?? [];
    return { all, final, lessons: lessons.length };
  }, [levels, tactics, content.lessons, step.final]);
}

/**
 * Диплом ступени — как в конце книги: лист A4 с именем ребёнка. Выдаётся, когда решён итоговый тест
 * и не меньше 80 % упражнений курса. До этого — сколько осталось.
 */
export function CourseDiploma({ step }: { step: CourseStep }) {
  const t = useT();
  const lang = useLang();
  const hydrated = useHydrated();
  const { info: course1 } = step.useContent();
  const { all, final, lessons } = useCourseIds(step);
  useTitleTranslation(`Диплом ступени «${step.award.ru}»`, `«${step.award.uz}» bosqichi diplomi`);
  const earnedAt = useStore((s) => courseEarnedAt(all, final, s));
  const solved = useStore((s) => all.filter((id) => s.chess[id]?.solvedAt).length);
  const finalSolved = useStore((s) => final.filter((id) => s.chess[id]?.solvedAt).length);
  const hasName = useStore((s) => !!s.settings.childName);
  const name = useStore((s) => nameFor(lang, s.settings));
  const need = courseDiplomaNeed(all.length);

  if (!hydrated) return <div className="min-h-96" />;

  const back = (
    <Link
      href={step.href}
      className="no-print inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
    >
      ← {course1.title}
    </Link>
  );

  if (!earnedAt)
    return (
      <div className="space-y-5">
        {back}
        <section className="space-y-4 rounded-3xl bg-surface p-6 shadow-card" data-diploma="locked">
          <h1 className="text-2xl font-black">
            <Icon icon={Lock} /> {t("Диплом ступени пока закрыт", "Bosqich diplomi hali yopiq")}
          </h1>
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
          <ButtonLink href={`${step.href}#${step.final}`}>{t("К итоговому тесту →", "Yakuniy testga →")}</ButtonLink>
        </section>
      </div>
    );

  return (
    <div className="space-y-5">
      {back}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">
            🎓 {t(`Диплом ступени «${step.award.ru}»`, `«${step.award.uz}» bosqichi diplomi`)}
          </h1>
          <p className="text-muted">
            {t(
              "Распечатай на листе A4 (альбомная ориентация) — и повесь на стену!",
              "A4 varaqqa (albom koʻrinishida) chop et — va devorga osib qoʻy!",
            )}
          </p>
        </div>
        <Button variant="sun" onClick={() => window.print()}>
          <Icon icon={Printer} /> {t("Распечатать", "Chop etish")}
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
            piece={step.piece}
            className="relative h-[13cqi] w-[13cqi] rounded-full bg-[#f0d9b5] p-[1.2cqi] ring-[0.5cqi] ring-[#d8b46a]"
          />
        }
        name={hasName ? name : " "}
        award={t(
          "награждается дипломом за прохождение ступени",
          "bosqichni muvaffaqiyatli oʻtgani uchun diplom bilan taqdirlanadi",
        )}
        title={t(step.award.ru, step.award.uz)}
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
export function DiplomaCard({ step }: { step: CourseStep }) {
  const t = useT();
  const hydrated = useHydrated();
  const { all, final } = useCourseIds(step);
  const earned = useStore((s) => courseEarnedAt(all, final, s) !== null);
  const solved = useStore((s) => all.filter((id) => s.chess[id]?.solvedAt).length);
  const need = courseDiplomaNeed(all.length);
  const shown = hydrated ? Math.min(solved, need) : 0;
  // Итогового теста у ступени ещё нет — диплом пока не выдаётся, карточку не показываем.
  if (!final.length) return null;
  return (
    <Link
      href={diplomaHref(step)}
      data-diploma-card={hydrated && earned ? "earned" : "locked"}
      className="flex items-center gap-4 rounded-3xl border-2 border-[#d8b46a] bg-[#fffaf0] p-5 shadow-card transition hover:-translate-y-0.5 dark:border-[#6b5a1e] dark:bg-[#332a12]"
    >
      <span className="text-5xl" aria-hidden>
        🎓
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xl font-black text-sun-ink">
          {hydrated && earned
            ? t("Диплом ступени получен — открыть и распечатать", "Bosqich diplomi olindi — ochish va chop etish")
            : t(`Диплом ступени «${step.award.ru}»`, `«${step.award.uz}» bosqichi diplomi`)}
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
