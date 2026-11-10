"use client";

import { Compass, Printer, ScrollText } from "lucide-react";
import Link from "next/link";
import { PathStop } from "@/components/PathStop";
import { ChessHomeCard, type ChessHomeSummary } from "@/components/chess/ChessHomeCard";
import { ButtonLink, cn } from "@/components/ui";
import { sectionsFor } from "@/content/meta";
import type { DaySummary, WeekSummary } from "@/content/summary";
import { QuickCard } from "@/components/home/QuickCard";
import { ChildNameBanner } from "@/components/home/ChildNameBanner";
import { PlacementCard } from "@/components/home/PlacementCard";
import { Welcome } from "@/components/home/Welcome";
import { TodayCard } from "@/components/progress/TodayCard";
import { weekCertificateHref, weekEarnedAt } from "@/lib/certificate";
import { useBoth, useLang, useT, type Both } from "@/lib/i18n";
import { nextDayStep } from "@/lib/nextStep";
import { pluralize } from "@/lib/plural";
import { useHydrated, useStore, type AppState } from "@/lib/store";

type Status = "done" | "active" | "next" | "later";

function dayStatus(d: DaySummary, s: AppState, nextId: string | null): Status {
  if (s.days[d.id]?.completedAt) return "done";
  if (d.id === nextId) return "next";
  if (s.days[d.id]?.startedAt || d.tasks.some((t) => s.tasks[t.id]?.status)) return "active";
  return "later";
}

export function HomeDashboard({ weeks: both, chess }: { weeks: Both<WeekSummary[]>; chess: Both<ChessHomeSummary> }) {
  const hydrated = useHydrated();
  const t = useT();
  const lang = useLang();
  const weeks = useBoth(both);
  const SECTIONS = sectionsFor(lang);
  const state = useStore((s) => s);
  const allDays = weeks.flatMap((w) => w.days);
  const step = hydrated ? nextDayStep(allDays, state) : null;
  const next = hydrated ? (step?.day ?? null) : allDays[0];
  const junior = useStore((st) => (st.settings.age ?? 0) < 9);
  // Дошкольники (4–5 лет): вместо занятий по неделям — картинки и счёт без чтения.
  const little = useStore((st) => st.settings.age !== undefined && st.settings.age <= 5);
  const solvedIn = (d: DaySummary) => d.tasks.filter((t) => state.tasks[t.id]?.status === "solved").length;

  const tasks = Object.values(state.tasks);
  const stats = {
    solved: tasks.filter((t) => t.status === "solved").length,
    explained: tasks.filter((t) => t.marks.explained).length,
    anotherWay: tasks.filter((t) => t.marks.anotherWay).length,
    own: state.myProblems.length,
  };
  const achievements = hydrated
    ? [
        { emoji: "✅", value: stats.solved, label: t("задач решено", "ta masala yechildi") },
        { emoji: "💬", value: stats.explained, label: t("решений объяснено", "ta yechim tushuntirildi") },
        { emoji: "🔁", value: stats.anotherWay, label: t("других способов", "ta boshqa usul") },
        { emoji: "✍️", value: stats.own, label: t("своих задач", "ta oʻz masalam"), href: "/my-problems" },
      ].filter((a) => a.value > 0)
    : [];

  return (
    <div className="space-y-8">
      {hydrated && !state.welcomed && <Welcome />}
      <ChildNameBanner />

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-[#4f46e5] via-[#5b4ff0] to-[#7c3aed] p-6 text-white shadow-lift sm:p-8">
          <div className="absolute -top-10 -right-8 text-[9rem] leading-none opacity-15 select-none" aria-hidden>
            ∑
          </div>
          <p className="text-lg font-bold text-white/80">
            {hydrated && state.settings.childName
              ? t("Привет, {name}! 👋", "Salom, {name}! 👋")
              : t("Привет! 👋", "Salom! 👋")}
          </p>
          <h1 className="mt-1 text-2xl leading-tight font-black sm:text-3xl">
            {t("Математика — это место, где происходят интересные вещи", "Matematika — qiziqarli kashfiyotlar olami")}
          </h1>
          {little ? (
            <div className="mt-5 rounded-3xl bg-white/12 p-4 ring-1 ring-white/25 backdrop-blur-sm" data-little-step>
              <p className="text-sm font-extrabold tracking-wide text-white/85 uppercase">
                {t("Играем!", "Oʻynaymiz!")}
              </p>
              <p className="mt-1 text-2xl font-black">
                <span aria-hidden>🍎 ⭐ 🐟</span> {t("Считаем и угадываем", "Sanaymiz va topamiz")}
              </p>
              <ButtonLink href="/quick" variant="sun" size="lg" className="mt-4 w-full sm:w-auto">
                {t("Играть ▶", "Oʻynash ▶")}
              </ButtonLink>
            </div>
          ) : next ? (
            <div className="mt-5 rounded-3xl bg-white/12 p-4 ring-1 ring-white/25 backdrop-blur-sm" data-next-step>
              <p className="text-sm font-extrabold tracking-wide text-white/85 uppercase">
                {step?.started ? t("Продолжим", "Davom etamiz") : t("Сегодняшнее занятие", "Bugungi mashgʻulot")}
              </p>
              <p className="mt-1 text-2xl font-black">
                <span aria-hidden>{next.emoji}</span>{" "}
                {weeks.length > 1 && t(`Неделя ${next.week} · `, `${next.week}-hafta · `)}
                {t(`День ${next.day}.`, `${next.day}-kun.`)} {next.title}
              </p>
              {/* Все задачи дня в одну строку: на узком экране значки чуть сжимаются, а не переносятся по одному. */}
              <div className="mt-3 grid auto-cols-[minmax(0,2.25rem)] grid-flow-col gap-1.5" aria-hidden>
                {next.tasks.map((task) => {
                  const solved = hydrated && state.tasks[task.id]?.status === "solved";
                  return (
                    <span
                      key={task.id}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-xl text-lg",
                        solved ? "bg-mint text-white" : "bg-white/20",
                      )}
                    >
                      {solved ? "✓" : SECTIONS[task.section].emoji}
                    </span>
                  );
                })}
              </div>
              <ButtonLink
                href={step?.href ?? `/week/${next.week}/day/${next.day}`}
                variant="sun"
                size="lg"
                className="mt-4 w-full sm:w-auto"
              >
                {step?.started ? t("Продолжить ▶", "Davom etish ▶") : t("Начать ▶", "Boshlash ▶")}
              </ButtonLink>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl bg-white/12 p-4 ring-1 ring-white/25">
              <p className="text-2xl font-black">🎉 {t("Все дни пройдены!", "Barcha kunlarni tamomlading!")}</p>
              <p className="mt-1 text-white/85">
                {t(
                  "Можно вернуться к любимым задачам, придумать свои или попросить родителей открыть недельный обзор.",
                  "Sevimli masalalaringga qaytishing, oʻzing yangi masala oʻylab topishing yoki ota-onangdan haftalik sharhni ochib berishni soʻrashing mumkin.",
                )}
              </p>
            </div>
          )}
        </div>

        <TodayCard />
      </section>

      {!little && <QuickCard />}

      <PlacementCard />

      <ChessHomeCard summary={chess} />

      <details
        open={!junior}
        data-path
        className="group rounded-[2rem] border border-line bg-surface p-3 shadow-card sm:p-5"
      >
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-2xl px-3 text-xl font-black select-none [&::-webkit-details-marker]:hidden">
          <span aria-hidden>🗺</span>
          <span className="flex-1">{t("Весь путь: все дни", "Butun yoʻl: barcha kunlar")}</span>
          <span aria-hidden className="text-muted transition group-open:rotate-180">
            ▾
          </span>
        </summary>
        {/* Путь по дням: на широком экране недели стоят рядом, на телефоне — одна под другой. */}
        <div className="mt-4 grid gap-x-8 gap-y-8 lg:grid-cols-3" data-days-path>
          {weeks.map((w) => (
            <section
              key={w.number}
              aria-labelledby={`week-${w.number}`}
              data-week={w.number}
              // min-w-0: иначе строка состояния дня (без переноса) растягивает колонку шире экрана.
              className="min-w-0"
            >
              <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
                {t(`Неделя ${w.number}`, `${w.number}-hafta`)}
              </p>
              <h2 id={`week-${w.number}`} className="text-xl leading-tight font-black sm:text-2xl">
                {w.title}: {w.subtitle.toLowerCase()}
              </h2>
              <div className="mt-1 mb-2 flex flex-wrap items-center gap-1">
                {hydrated && weekEarnedAt(w, state) && (
                  <Link
                    href={weekCertificateHref(w.number)}
                    data-week-certificate-link
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-sun-soft px-3 text-sm font-extrabold text-sun-ink hover:bg-sun/40"
                  >
                    <ScrollText className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                    {t("Сертификат недели", "Hafta sertifikati")}
                  </Link>
                )}
                <Link
                  href={`/week/${w.number}/print`}
                  className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-sm font-extrabold text-brand hover:bg-brand-soft"
                >
                  <Printer className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                  {t("Распечатать неделю", "Haftani chop etish")}
                </Link>
              </div>
              <ol>
                {w.days.map((d, i) => {
                  const status = hydrated
                    ? dayStatus(d, state, next?.id ?? null)
                    : d.id === next?.id
                      ? "next"
                      : "later";
                  const solved = hydrated ? solvedIn(d) : 0;
                  const count = t(
                    `${solved} из ${d.tasks.length} задач`,
                    `${d.tasks.length} ta masaladan ${solved} tasi`,
                  );
                  return (
                    <PathStop
                      key={d.id}
                      n={i + 1}
                      last={i === w.days.length - 1}
                      done={status === "done"}
                      current={status === "next"}
                      tile={d.emoji}
                      tileClassName="bg-brand-soft shadow-[0_3px_0_0_rgb(79_70_229/0.25)]"
                      kicker={t(`День ${d.day}`, `${d.day}-kun`)}
                      title={d.title}
                      note={
                        status === "done" ? (
                          <span className="text-success-ink">
                            {t("✓ пройден", "✓ oʻtildi")} · <span aria-hidden>{d.habit.emoji}</span> {d.habit.name}
                          </span>
                        ) : status === "next" ? (
                          <span className="text-brand-dark">
                            {solved > 0 ? count : t("Сегодня — сюда", "Bugun — shu yerga")}
                          </span>
                        ) : status === "active" ? (
                          <span className="text-sun-ink">{count}</span>
                        ) : (
                          t(pluralize(d.tasks.length, "задача", "задачи", "задач"), `${d.tasks.length} ta masala`)
                        )
                      }
                      href={`/week/${d.week}/day/${d.day}`}
                      attrs={{ "data-day": d.id, "data-day-state": status }}
                    />
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-3xl border-2 border-dashed border-line p-4">
          <Compass className="h-8 w-8 shrink-0 text-muted" strokeWidth={2} aria-hidden />
          <div>
            <p className="font-extrabold">{t("Дальше — новые недели", "Keyin — yangi haftalar")}</p>
            <p className="text-sm text-muted">
              {t(
                "Логика, геометрия, комбинаторика и алгоритмы — шаг за шагом.",
                "Mantiq, geometriya, kombinatorika va algoritmlar — qadamma-qadam.",
              )}
            </p>
          </div>
        </div>
      </details>

      {/* Счётчики — только непустые: у новичка ряд нулей ничего не говорит и занимает экран. */}
      {achievements.length > 0 && (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label={t("Мои достижения", "Yutuqlarim")}>
          {achievements.map((a) => (
            <StatCard key={a.emoji} {...a} />
          ))}
        </section>
      )}
    </div>
  );
}

function StatCard({ emoji, value, label, href }: { emoji: string; value: number; label: string; href?: string }) {
  const inner = (
    <>
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <span className="tabular text-3xl font-black">{value}</span>
      <span className="text-sm font-bold text-muted">{label}</span>
    </>
  );
  const cls = "flex flex-col gap-0.5 rounded-3xl border border-line bg-surface p-4 shadow-card";
  return href ? (
    <Link href={href} className={cn(cls, "transition hover:shadow-lift")}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
