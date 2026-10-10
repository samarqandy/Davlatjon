"use client";

import Link from "next/link";
import { ChessHomeCard } from "@/components/chess/ChessHomeCard";
import { ButtonLink, cn, ProgressBar } from "@/components/ui";
import { sectionsFor } from "@/content/meta";
import type { DaySummary, WeekSummary } from "@/content/summary";
import { ChildNameBanner } from "@/components/home/ChildNameBanner";
import { PlacementCard } from "@/components/home/PlacementCard";
import { Welcome } from "@/components/home/Welcome";
import { TodayCard } from "@/components/progress/TodayCard";
import { weekCertificateHref, weekEarnedAt } from "@/lib/certificate";
import { useBoth, useLang, useT, type Both, type T } from "@/lib/i18n";
import { nextDayStep } from "@/lib/nextStep";
import { useHydrated, useStore, type AppState } from "@/lib/store";

type Status = "done" | "active" | "next" | "later";

function dayStatus(d: DaySummary, s: AppState, nextId: string | null): Status {
  if (s.days[d.id]?.completedAt) return "done";
  if (d.id === nextId) return "next";
  if (s.days[d.id]?.startedAt || d.tasks.some((t) => s.tasks[t.id]?.status)) return "active";
  return "later";
}

export function HomeDashboard({ weeks: both }: { weeks: Both<WeekSummary[]> }) {
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
  const solvedIn = (d: DaySummary) => d.tasks.filter((t) => state.tasks[t.id]?.status === "solved").length;

  const tasks = Object.values(state.tasks);
  const stats = {
    solved: tasks.filter((t) => t.status === "solved").length,
    explained: tasks.filter((t) => t.marks.explained).length,
    anotherWay: tasks.filter((t) => t.marks.anotherWay).length,
    own: state.myProblems.length,
  };

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
          {next ? (
            <div className="mt-5 rounded-3xl bg-white/12 p-4 ring-1 ring-white/25 backdrop-blur-sm" data-next-step>
              <p className="text-sm font-extrabold tracking-wide text-white/85 uppercase">
                {step?.started ? t("Продолжим", "Davom etamiz") : t("Сегодняшнее занятие", "Bugungi mashgʻulot")}
              </p>
              <p className="mt-1 text-2xl font-black">
                <span aria-hidden>{next.emoji}</span>{" "}
                {weeks.length > 1 && t(`Неделя ${next.week} · `, `${next.week}-hafta · `)}
                {t(`День ${next.day}.`, `${next.day}-kun.`)} {next.title}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5" aria-hidden>
                {next.tasks.map((task) => {
                  const solved = hydrated && state.tasks[task.id]?.status === "solved";
                  return (
                    <span
                      key={task.id}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl text-lg",
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

      <PlacementCard />

      <ChessHomeCard />

      <details
        open={!junior}
        data-path
        className="group rounded-[2rem] border border-line bg-white p-3 shadow-card sm:p-5"
      >
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-2xl px-3 text-xl font-black select-none [&::-webkit-details-marker]:hidden">
          <span aria-hidden>🗺</span>
          <span className="flex-1">{t("Весь путь: все дни", "Butun yoʻl: barcha kunlar")}</span>
          <span aria-hidden className="text-muted transition group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div className="mt-4 space-y-8">
          {weeks.map((w) => (
            <section key={w.number} aria-labelledby={`week-${w.number}`}>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
                    {t(`Неделя ${w.number}`, `${w.number}-hafta`)}
                  </p>
                  <h2 id={`week-${w.number}`} className="text-2xl font-black sm:text-3xl">
                    {w.title}: {w.subtitle.toLowerCase()}
                  </h2>
                </div>
                {hydrated && weekEarnedAt(w, state) && (
                  <Link
                    href={weekCertificateHref(w.number)}
                    data-week-certificate-link
                    className="rounded-xl bg-sun-soft px-3 py-2 text-sm font-extrabold text-ink hover:bg-sun/40"
                  >
                    📜 {t("Сертификат недели", "Hafta sertifikati")}
                  </Link>
                )}
                <Link
                  href={`/week/${w.number}/print`}
                  className="rounded-xl px-3 py-2 text-sm font-extrabold text-brand hover:bg-brand-soft"
                >
                  🖨 {t("Распечатать всю неделю", "Butun haftani chop etish")}
                </Link>
              </div>
              <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {w.days.map((d) => {
                  const status = hydrated
                    ? dayStatus(d, state, next?.id ?? null)
                    : d.id === next?.id
                      ? "next"
                      : "later";
                  const solved = hydrated ? solvedIn(d) : 0;
                  return (
                    <li key={d.id}>
                      <Link
                        href={`/week/${d.week}/day/${d.day}`}
                        className={cn(
                          "group flex h-full flex-col rounded-3xl border-2 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift",
                          status === "next"
                            ? "border-brand"
                            : status === "done"
                              ? "border-mint/50"
                              : "border-transparent",
                        )}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-extrabold text-muted">
                            {t(`День ${d.day}`, `${d.day}-kun`)}
                          </span>
                          <StatusBadge status={status} t={t} />
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-2xl transition group-hover:scale-105"
                            aria-hidden
                          >
                            {d.emoji}
                          </span>
                          <span className="text-lg leading-tight font-black">{d.title}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1" aria-hidden>
                          {d.tasks.map((t) => (
                            <span
                              key={t.id}
                              className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-lg text-sm",
                                hydrated && state.tasks[t.id]?.status === "solved" ? "bg-mint-soft" : "bg-paper",
                              )}
                              title={t.title}
                            >
                              {SECTIONS[t.section].emoji}
                            </span>
                          ))}
                        </div>
                        <div className="mt-auto pt-3">
                          {status === "done" && (
                            <p className="mb-1.5 rounded-xl bg-sun-soft px-2 py-1 text-xs font-extrabold text-[#7a4b00]">
                              <span aria-hidden>{d.habit.emoji}</span> {d.habit.name}
                            </p>
                          )}
                          <ProgressBar value={solved} max={d.tasks.length} />
                          <p className="mt-1 text-xs font-bold text-muted">
                            {t(`${solved} из ${d.tasks.length} задач`, `${d.tasks.length} ta masaladan ${solved} tasi`)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
                {w.number === weeks[weeks.length - 1].number && (
                  <li>
                    <div className="flex h-full flex-col justify-center rounded-3xl border-2 border-dashed border-line p-4 text-center">
                      <p className="text-3xl" aria-hidden>
                        🧭
                      </p>
                      <p className="mt-1 font-extrabold">{t("Дальше — новые недели", "Keyin — yangi haftalar")}</p>
                      <p className="mt-1 text-sm text-muted">
                        {t(
                          "Логика, геометрия, комбинаторика и алгоритмы — шаг за шагом.",
                          "Mantiq, geometriya, kombinatorika va algoritmlar — qadamma-qadam.",
                        )}
                      </p>
                    </div>
                  </li>
                )}
              </ol>
            </section>
          ))}
        </div>
      </details>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label={t("Мои достижения", "Yutuqlarim")}>
        <StatCard emoji="✅" value={hydrated ? stats.solved : 0} label={t("задач решено", "ta masala yechildi")} />
        <StatCard
          emoji="💬"
          value={hydrated ? stats.explained : 0}
          label={t("решений объяснено", "ta yechim tushuntirildi")}
        />
        <StatCard emoji="🔁" value={hydrated ? stats.anotherWay : 0} label={t("других способов", "ta boshqa usul")} />
        <StatCard
          emoji="✍️"
          value={hydrated ? stats.own : 0}
          label={t("своих задач", "ta oʻz masalam")}
          href="/my-problems"
        />
      </section>
    </div>
  );
}

function StatusBadge({ status, t }: { status: Status; t: T }) {
  const map: Record<Status, { text: string; cls: string }> = {
    done: { text: t("✓ пройден", "✓ oʻtildi"), cls: "bg-mint-soft text-[#047857]" },
    next: { text: t("▶ сегодня", "▶ bugun"), cls: "bg-brand text-white" },
    active: { text: t("в процессе", "jarayonda"), cls: "bg-sun-soft text-[#7a4b00]" },
    later: { text: t("впереди", "oldinda"), cls: "bg-paper text-muted" },
  };
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-extrabold", map[status].cls)}>{map[status].text}</span>
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
  const cls = "flex flex-col gap-0.5 rounded-3xl border border-line bg-white p-4 shadow-card";
  return href ? (
    <Link href={href} className={cn(cls, "transition hover:shadow-lift")}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
