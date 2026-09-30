"use client";

import Link from "next/link";
import { ChildNameBanner } from "@/components/home/ChildNameBanner";
import { Button, ButtonLink, ProgressBar } from "@/components/ui";
import { CHESS_LEVELS, chessLevelHref } from "@/content/chess";
import { BRAND } from "@/lib/brand";
import { longDate, rankEarnedAt } from "@/lib/certificate";
import { nameFor } from "@/lib/childName";
import { useTitleTranslation } from "@/lib/docTitle";
import { useLang, useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { useHydrated, useStore } from "@/lib/store";
import { useChess } from "@/lib/useChess";
import { PieceIcon } from "./ChessBoard";

/**
 * Сертификат о звании — лист A4 (альбомный) с именем ребёнка, званием и датой.
 * Пока звание не получено, вместо листа — сколько упражнений осталось.
 */
export function CertificateView({ levelId }: { levelId: string }) {
  const t = useT();
  const lang = useLang();
  const hydrated = useHydrated();
  const { levels } = useChess();
  const index = levels.findIndex((l) => l.id === levelId);
  const level = levels[index];
  useTitleTranslation(`Сертификат «${CHESS_LEVELS[index].name}»`, `«${level.name}» sertifikati`);
  const earnedAt = useStore((s) => rankEarnedAt(level, s));
  const solved = useStore((s) => level.exercises.filter((e) => s.chess[e.id]?.solvedAt).length);
  const hasName = useStore((s) => !!s.settings.childName);
  const name = useStore((s) => nameFor(lang, s.settings));

  if (!hydrated) return <div className="min-h-96" />;

  const back = (
    <Link
      href={chessLevelHref(level.id)}
      className="no-print inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline"
    >
      ← {t(`Уровень «${level.name}»`, `«${level.name}» darajasi`)}
    </Link>
  );

  if (!earnedAt)
    return (
      <div className="space-y-5">
        {back}
        <section className="rounded-3xl bg-white p-6 shadow-card" data-certificate="locked">
          <h1 className="text-2xl font-black">
            🔒 {t(`Сертификат «${level.name}» пока закрыт`, `«${level.name}» sertifikati hali yopiq`)}
          </h1>
          <p className="mt-2 text-lg">
            {t(
              `Реши все упражнения уровня — и получишь звание «${level.name}» и сертификат с твоим именем.`,
              `Darajaning hamma mashqlarini yech — «${level.name}» unvoni va isming yozilgan sertifikatni olasan.`,
            )}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <ProgressBar value={solved} max={level.exercises.length} className="flex-1" />
            <span className="font-black tabular-nums">
              {solved}/{level.exercises.length}
            </span>
          </div>
          <ButtonLink href={`${chessLevelHref(level.id)}#exercises`} className="mt-4">
            {t("К упражнениям →", "Mashqlarga →")}
          </ButtonLink>
        </section>
      </div>
    );

  return (
    <div className="space-y-5">
      {back}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">🏅 {t(`Сертификат «${level.name}»`, `«${level.name}» sertifikati`)}</h1>
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
          data-certificate="earned"
          className="relative flex aspect-[297/210] flex-col items-center justify-between overflow-hidden rounded-[1.5cqi] border-[1.2cqi] border-double border-[#b8862b] bg-[#fffaf0] px-[6cqi] py-[3.5cqi] text-center text-[#3b2f23] shadow-lift print:rounded-none print:shadow-none"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[1.6cqi] rounded-[1cqi] border-[0.25cqi] border-[#d8b46a]"
          />
          <p className="relative text-[1.9cqi] font-extrabold tracking-[0.3em] text-[#9a6b17] uppercase">
            {t(`Шахматная школа ${BRAND}`, `${BRAND} shaxmat maktabi`)}
          </p>
          <h2 className="relative text-[6.2cqi] leading-none font-black tracking-wide text-[#7a4b00] uppercase">
            {t("Сертификат", "Sertifikat")}
          </h2>
          <PieceIcon
            piece={level.piece}
            className="relative h-[13cqi] w-[13cqi] rounded-full bg-[#f0d9b5] p-[1.2cqi] ring-[0.5cqi] ring-[#d8b46a]"
          />
          <div className="relative">
            <p
              className="border-b-[0.25cqi] border-[#d8b46a] px-[4cqi] pb-[0.5cqi] text-[5.4cqi] leading-tight font-black text-[#3b2f23]"
              data-certificate-name
            >
              {hasName ? name : " "}
            </p>
            <p className="mt-[1.4cqi] text-[2.6cqi] font-bold">
              {t("получает шахматное звание", "shaxmat unvoniga sazovor boʻldi")}
            </p>
            <p className="text-[4.6cqi] leading-tight font-black text-[#7a4b00]">«{level.name}»</p>
            <p className="mt-[0.8cqi] text-[1.9cqi] font-semibold text-[#6b5a45]">
              {t(
                `Решены все ${pluralize(level.exercises.length, "упражнение", "упражнения", "упражнений")} уровня ${level.order} из ${levels.length}.`,
                `${levels.length} ta darajadan ${level.order}-darajaning barcha ${level.exercises.length} ta mashqi yechildi.`,
              )}
            </p>
          </div>
          <div className="relative grid w-full grid-cols-3 items-end gap-[3cqi] text-[1.8cqi] font-bold">
            <div className="text-left">
              <p className="border-b-[0.2cqi] border-[#b8a07a] pb-[0.4cqi]">{longDate(earnedAt, lang)}</p>
              <p className="mt-[0.4cqi] text-[1.5cqi] text-[#8a7658]">{t("дата", "sana")}</p>
            </div>
            <div className="text-[5cqi] leading-none" aria-hidden>
              🏅
            </div>
            <div className="text-right">
              <p className="border-b-[0.2cqi] border-[#b8a07a] pb-[0.4cqi]">{" "}</p>
              <p className="mt-[0.4cqi] text-[1.5cqi] text-[#8a7658]">{t("подпись родителей", "ota-ona imzosi")}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
