"use client";

import Link from "next/link";
import { ChildNameBanner } from "@/components/home/ChildNameBanner";
import { Mascot } from "@/components/Mascot";
import { Button, ButtonLink, ProgressBar } from "@/components/ui";
import type { WeekSummary } from "@/content/summary";
import { BRAND } from "@/lib/brand";
import { longDate, weekEarnedAt } from "@/lib/certificate";
import { nameFor } from "@/lib/childName";
import { useTitleTranslation } from "@/lib/docTitle";
import { useBoth, useLang, useT, type Both } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { useHydrated, useStore } from "@/lib/store";

/**
 * Сертификат недели — лист A4 (альбомный) с именем ребёнка, названием недели, числом решённых задач и датой.
 * Пока неделя не закончена, вместо листа — сколько дней осталось.
 */
export function WeekCertificateView({ week: both, weeksTotal }: { week: Both<WeekSummary>; weeksTotal: number }) {
  const t = useT();
  const lang = useLang();
  const week = useBoth(both);
  const hydrated = useHydrated();
  useTitleTranslation(`Сертификат: неделя ${both.ru.number}`, `Sertifikat: ${both.uz.number}-hafta`);
  const earnedAt = useStore((s) => weekEarnedAt(week, s));
  const daysDone = useStore((s) => week.days.filter((d) => s.days[d.id]?.completedAt).length);
  const solved = useStore((s) =>
    week.days.reduce((n, d) => n + d.tasks.filter((x) => s.tasks[x.id]?.status === "solved").length, 0),
  );
  const total = week.days.reduce((n, d) => n + d.tasks.length, 0);
  const hasName = useStore((s) => !!s.settings.childName);
  const name = useStore((s) => nameFor(lang, s.settings));

  if (!hydrated) return <div className="min-h-96" />;

  const back = (
    <Link
      href="/"
      className="no-print inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline"
    >
      ← {t("На главную", "Bosh sahifaga")}
    </Link>
  );

  if (!earnedAt)
    return (
      <div className="space-y-5">
        {back}
        <section className="rounded-3xl bg-white p-6 shadow-card" data-week-certificate="locked">
          <h1 className="text-2xl font-black">
            🔒 {t(`Сертификат недели ${week.number} пока закрыт`, `${week.number}-hafta sertifikati hali yopiq`)}
          </h1>
          <p className="mt-2 text-lg">
            {t(
              "Пройди все дни недели — и получишь сертификат с твоим именем.",
              "Haftaning hamma kunlarini oʻtib chiq — isming yozilgan sertifikatni olasan.",
            )}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <ProgressBar value={daysDone} max={week.days.length} className="flex-1" />
            <span className="font-black tabular-nums">
              {daysDone}/{week.days.length}
            </span>
          </div>
          <ButtonLink href="/" className="mt-4">
            {t("К занятиям →", "Mashgʻulotlarga →")}
          </ButtonLink>
        </section>
      </div>
    );

  return (
    <div className="space-y-5">
      {back}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">
            📜 {t(`Сертификат: неделя ${week.number}`, `Sertifikat: ${week.number}-hafta`)}
          </h1>
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

      {/* Только на этой странице печать идёт на альбомный лист без полей. */}
      <style>{"@page { size: A4 landscape; margin: 0; }"}</style>
      <div className="certificate-sheet @container mx-auto w-full max-w-5xl">
        <article
          data-week-certificate="earned"
          className="relative flex aspect-[297/210] flex-col items-center justify-between overflow-hidden rounded-[1.5cqi] border-[1.2cqi] border-double border-[#4f46e5] bg-[#f8f9ff] px-[6cqi] py-[3.5cqi] text-center text-[#1e1b4b] shadow-lift print:rounded-none print:shadow-none"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[1.6cqi] rounded-[1cqi] border-[0.25cqi] border-[#a5b4fc]"
          />
          <p className="relative text-[1.9cqi] font-extrabold tracking-[0.3em] text-[#4338ca] uppercase">
            {BRAND} · {t("Математика и логика", "Matematika va mantiq")}
          </p>
          <h2 className="relative text-[6.2cqi] leading-none font-black tracking-wide text-[#3730a3] uppercase">
            {t("Сертификат", "Sertifikat")}
          </h2>
          <div className="relative" aria-hidden>
            <Mascot size={96} />
          </div>
          <div className="relative">
            <p
              className="border-b-[0.25cqi] border-[#a5b4fc] px-[4cqi] pb-[0.5cqi] text-[5.4cqi] leading-tight font-black"
              data-certificate-name
            >
              {hasName ? name : " "}
            </p>
            <p className="mt-[1.4cqi] text-[2.6cqi] font-bold">
              {t("завершает неделю занятий", "haftalik mashgʻulotlarni muvaffaqiyatli tugatdi")}
            </p>
            <p className="text-[4.4cqi] leading-tight font-black text-[#3730a3]">
              «{week.title}» ·{" "}
              {t(`неделя ${week.number} из ${weeksTotal}`, `${week.number}-hafta, jami ${weeksTotal} ta`)}
            </p>
            <p className="mt-[0.8cqi] text-[1.9cqi] font-semibold text-[#4b4a7a]">
              {t(
                `Пройдено: ${pluralize(daysDone, "день", "дня", "дней")}. Решено задач: ${solved} из ${total}.`,
                `${daysDone} kun oʻtildi, ${total} ta masaladan ${solved} tasi yechildi.`,
              )}
            </p>
          </div>
          <div className="relative grid w-full grid-cols-3 items-end gap-[3cqi] text-[1.8cqi] font-bold">
            <div className="text-left">
              <p className="border-b-[0.2cqi] border-[#a5b4fc] pb-[0.4cqi]">{longDate(earnedAt, lang)}</p>
              <p className="mt-[0.4cqi] text-[1.5cqi] text-[#6b6a9c]">{t("дата", "sana")}</p>
            </div>
            <div className="text-[5cqi] leading-none" aria-hidden>
              ⭐
            </div>
            <div className="text-right">
              <p className="border-b-[0.2cqi] border-[#a5b4fc] pb-[0.4cqi]"> </p>
              <p className="mt-[0.4cqi] text-[1.5cqi] text-[#6b6a9c]">{t("подпись родителей", "ota-ona imzosi")}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
