"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";
import { longDate } from "@/lib/certificate";
import { useLang, useT } from "@/lib/i18n";

/**
 * Лист сертификата или диплома: A4 альбомный, с рамкой, именем ребёнка, наградой и датой.
 * Общий для звания уровня и диплома ступени курса. В углу — логотип Parvoz Edu.
 */
export function CertificateSheet({
  icon,
  heading,
  name,
  award,
  title,
  detail,
  earnedAt,
}: {
  icon: ReactNode;
  /** Крупное слово сверху: «Сертификат» или «Диплом». По умолчанию — «Сертификат». */
  heading?: string;
  name: string;
  award: string;
  title: string;
  detail: string;
  earnedAt: number;
}) {
  const t = useT();
  const lang = useLang();
  return (
    <>
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
          {/* Логотип платформы — в углу листа, как печать школы. */}
          <Image
            src="/logo-full.webp"
            alt={BRAND}
            width={900}
            height={1022}
            unoptimized
            data-certificate-logo
            className="absolute top-[3.2cqi] left-[4cqi] h-[13cqi] w-auto"
          />
          <p className="relative text-[1.9cqi] font-extrabold tracking-[0.3em] text-[#9a6b17] uppercase">
            {t(`Шахматная школа ${BRAND}`, `${BRAND} shaxmat maktabi`)}
          </p>
          <h2 className="relative text-[6.2cqi] leading-none font-black tracking-wide text-[#7a4b00] uppercase">
            {heading ?? t("Сертификат", "Sertifikat")}
          </h2>
          {icon}
          <div className="relative">
            <p
              className="border-b-[0.25cqi] border-[#d8b46a] px-[4cqi] pb-[0.5cqi] text-[5.4cqi] leading-tight font-black text-[#3b2f23]"
              data-certificate-name
            >
              {name}
            </p>
            <p className="mt-[1.4cqi] text-[2.6cqi] font-bold">{award}</p>
            <p className="text-[4.6cqi] leading-tight font-black text-[#7a4b00]">«{title}»</p>
            <p className="mt-[0.8cqi] text-[1.9cqi] font-semibold text-[#6b5a45]">{detail}</p>
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
    </>
  );
}
