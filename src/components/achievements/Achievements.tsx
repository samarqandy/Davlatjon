"use client";

import Link from "next/link";
import { ChevronRight, GraduationCap, LayoutGrid, Medal, Trophy } from "lucide-react";
import { DiplomaCard } from "@/components/chess/CourseDiploma";
import { TodayCard } from "@/components/progress/TodayCard";
import { ProgressBar } from "@/components/ui";
import { loginAvailable, useAccount } from "@/lib/account";
import { awards, earned } from "@/lib/awards";
import { COLLECTION_TOTAL, cardsOpen } from "@/lib/collection";
import { STEP_1 } from "@/lib/course/step1";
import { STEP_2 } from "@/lib/course/step2";
import { STEP_3 } from "@/lib/course/step3";
import { STEP_4 } from "@/lib/course/step4";
import { STEP_5 } from "@/lib/course/step5";
import { useLang, useT } from "@/lib/i18n";
import { useHydrated, useStore } from "@/lib/store";
import { xpBreakdown, xpLevel } from "@/lib/xp";

const STEPS = [STEP_1, STEP_2, STEP_3, STEP_4, STEP_5];

/**
 * «Мои успехи» — всё, чем ребёнок может гордиться, в одном месте: уровень опыта, серия и задание дня,
 * дипломы ступеней, награды и коллекция героев. Ничего нового не хранится — всё считается из прогресса.
 */
export function Achievements() {
  const t = useT();
  const lang = useLang();
  const hydrated = useHydrated();
  const state = useStore((s) => s);
  const ranked = loginAvailable(useAccount());
  const xp = hydrated ? xpBreakdown(state) : { total: 0, math: 0, chess: 0, puzzles: 0, quick: 0 };
  const level = xpLevel(xp.total);
  const list = hydrated ? awards(state, lang) : [];
  const got = list.filter(earned);
  const cards = cardsOpen(xp.total, COLLECTION_TOTAL);

  return (
    <div className="space-y-6">
      <header>
        <p className="font-bold text-muted">{t("Твои успехи — в одном месте", "Yutuqlaring — bir joyda")}</p>
        <h1 className="text-3xl leading-tight font-black">{t("Мои успехи", "Yutuqlarim")}</h1>
      </header>

      <section
        data-achievements-level={level.level}
        className="rounded-[2rem] bg-linear-to-br from-brand to-[#7c3aed] p-5 text-white shadow-lift sm:p-6"
        aria-label={t("Уровень опыта", "Tajriba darajasi")}
      >
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 text-3xl font-black ring-1 ring-white/30">
            {level.level}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold tracking-wide text-white/80 uppercase">
              {t(`Уровень ${level.level}`, `${level.level}-daraja`)}
            </p>
            <p className="text-2xl font-black tabular-nums">{xp.total} XP</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={level.into} max={level.need} className="flex-1 bg-white/20" />
          <span className="text-sm font-extrabold whitespace-nowrap tabular-nums">
            {t(`ещё ${level.need - level.into} XP`, `yana ${level.need - level.into} XP`)}
          </span>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold sm:grid-cols-4">
          {(
            [
              [t("Математика", "Matematika"), xp.math],
              [t("Шахматы", "Shaxmat"), xp.chess],
              [t("Задачи", "Masalalar"), xp.puzzles],
              [t("Быстрые примеры", "Tez misollar"), xp.quick],
            ] as const
          ).map(([label, value]) => (
            <li key={label} className="rounded-xl bg-white/12 px-3 py-2 ring-1 ring-white/20">
              <span className="block text-white/80">{label}</span>
              <span className="text-lg font-black tabular-nums">{value}</span>
            </li>
          ))}
        </ul>
      </section>

      <TodayCard />

      <section aria-labelledby="diplomas" className="space-y-3">
        <h2 id="diplomas" className="flex items-center gap-2 text-2xl font-black">
          <GraduationCap className="h-6 w-6 text-brand" aria-hidden />
          {t("Дипломы ступеней", "Bosqich diplomlari")}
        </h2>
        {STEPS.map((step) => (
          <DiplomaCard key={step.href} step={step} />
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-2" aria-label={t("Награды и коллекция", "Mukofotlar va kolleksiya")}>
        <Link
          href="/chess/awards"
          data-achievements-awards={got.length}
          className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card transition hover:-translate-y-0.5"
        >
          <Medal className="h-10 w-10 shrink-0 text-sun" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-black">{t("Награды", "Mukofotlar")}</span>
            <span className="block text-sm font-bold text-muted">
              {t(`${got.length} из ${list.length || "…"}`, `${list.length || "…"} tadan ${got.length} tasi`)}
            </span>
            <span className="mt-1 block truncate text-xl" aria-hidden>
              {got
                .slice(-8)
                .map((a) => a.emoji)
                .join(" ")}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
        </Link>
        <Link
          href="/chess/collection"
          className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card transition hover:-translate-y-0.5"
        >
          <LayoutGrid className="h-10 w-10 shrink-0 text-brand" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-black">{t("Коллекция героев", "Qahramonlar kolleksiyasi")}</span>
            <span className="block text-sm font-bold text-muted">
              {t(`Открыто ${cards} из ${COLLECTION_TOTAL}`, `${COLLECTION_TOTAL} tadan ${cards} tasi ochildi`)}
            </span>
            <ProgressBar value={cards} max={COLLECTION_TOTAL} className="mt-2" />
          </span>
          <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
        </Link>
        {ranked && (
          <Link
            href="/leaderboard"
            className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card transition hover:-translate-y-0.5 sm:col-span-2"
          >
            <Trophy className="h-10 w-10 shrink-0 text-sun" aria-hidden />
            <span className="min-w-0 flex-1 text-lg font-black">{t("Рейтинг", "Reyting")}</span>
            <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
          </Link>
        )}
      </section>
    </div>
  );
}
