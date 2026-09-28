"use client";

import Link from "next/link";
import { useState } from "react";
import { ChessHomeCard } from "@/components/chess/ChessHomeCard";
import { Button, ButtonLink, Card, cn, ProgressBar } from "@/components/ui";
import { SECTIONS } from "@/content/meta";
import type { DaySummary, WeekSummary } from "@/content/summary";
import { ListenButton } from "@/components/ListenButton";
import { VOICE_CLIPS } from "@/lib/voice";
import { AGE_MAX, AGE_MIN, PROFILES, ageProfile, profileMeta } from "@/lib/age";
import { setWelcomed, updateSettings, useHydrated, useStore, type AppState } from "@/lib/store";

type Status = "done" | "active" | "next" | "later";

function dayStatus(d: DaySummary, s: AppState, nextId: string | null): Status {
  if (s.days[d.id]?.completedAt) return "done";
  if (d.id === nextId) return "next";
  if (s.days[d.id]?.startedAt || d.tasks.some((t) => s.tasks[t.id]?.status)) return "active";
  return "later";
}

export function HomeDashboard({ weeks }: { weeks: WeekSummary[] }) {
  const hydrated = useHydrated();
  const state = useStore((s) => s);
  const allDays = weeks.flatMap((w) => w.days);
  const next = hydrated ? (allDays.find((d) => !state.days[d.id]?.completedAt) ?? null) : allDays[0];
  const currentWeek = next?.week ?? weeks[weeks.length - 1]?.number;
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

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-[#4f46e5] via-[#5b4ff0] to-[#7c3aed] p-6 text-white shadow-lift sm:p-8">
          <div className="absolute -top-10 -right-8 text-[9rem] leading-none opacity-15 select-none" aria-hidden>
            ∑
          </div>
          <p className="text-lg font-bold text-white/80">Привет, Давлатжон! 👋</p>
          <h1 className="mt-1 text-3xl leading-tight font-black sm:text-4xl">
            Математика — это место, где происходят интересные вещи
          </h1>
          {next ? (
            <div className="mt-6 rounded-3xl bg-white/12 p-4 ring-1 ring-white/25 backdrop-blur-sm">
              <p className="text-sm font-extrabold tracking-wide text-white/75 uppercase">
                {hydrated && state.days[next.id]?.startedAt ? "Продолжим" : "Сегодняшнее занятие"}
              </p>
              <p className="mt-1 text-2xl font-black">
                <span aria-hidden>{next.emoji}</span> {weeks.length > 1 && `Неделя ${next.week} · `}День {next.day}.{" "}
                {next.title}
              </p>
              <p className="mt-1 text-sm text-white/80">
                {next.tasks.length} задач · около 25 минут · привычка «{next.habit.name}»
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href={`/week/${next.week}/day/${next.day}`} variant="sun" size="lg">
                  {hydrated && state.days[next.id]?.startedAt ? "Продолжить ▶" : "Начать ▶"}
                </ButtonLink>
                <ButtonLink
                  href={`/week/${next.week}/day/${next.day}/print`}
                  variant="secondary"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  🖨 Распечатать
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl bg-white/12 p-4 ring-1 ring-white/25">
              <p className="text-2xl font-black">🎉 Все дни пройдены!</p>
              <p className="mt-1 text-white/85">
                Можно вернуться к любимым задачам, придумать свои или попросить родителей открыть недельный обзор.
              </p>
            </div>
          )}
          {hydrated && state.settings.age && (
            <p className="mt-3 text-xs font-bold text-white/70">
              Режим занятий: {profileMeta(state.settings.age).ages} ·{" "}
              <Link href="/parent/settings" className="underline hover:text-white">
                изменить
              </Link>
            </p>
          )}
        </div>

        <Card className="p-5 sm:p-6">
          <h2 className="mb-1 text-lg font-extrabold">Мои привычки мыслителя</h2>
          <p className="mb-4 text-sm text-muted">Каждый пройденный день добавляет новую привычку.</p>
          <div className="space-y-4">
            {weeks.map((w) => {
              const full = weeks.length === 1 || w.number === currentWeek;
              const got = (d: DaySummary) => hydrated && Boolean(state.days[d.id]?.completedAt);
              return (
                <div key={w.number}>
                  {weeks.length > 1 && (
                    <p className="mb-1.5 text-xs font-extrabold tracking-wide text-muted uppercase">
                      Неделя {w.number} · {w.title}
                    </p>
                  )}
                  {full ? (
                    <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {w.days.map((d) => (
                        <li
                          key={d.id}
                          className={cn(
                            "flex items-center gap-2.5 rounded-2xl border-2 px-3 py-1.5 text-sm font-extrabold transition",
                            got(d)
                              ? "border-sun/60 bg-sun-soft text-[#7a4b00]"
                              : "border-dashed border-line text-muted",
                          )}
                        >
                          <span className={cn("text-xl", !got(d) && "opacity-35 grayscale")} aria-hidden>
                            {d.habit.emoji}
                          </span>
                          {d.habit.name}
                          {got(d) && <span className="ml-auto">✓</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="flex flex-wrap gap-1.5">
                      {w.days.map((d) => (
                        <li
                          key={d.id}
                          title={d.habit.name}
                          aria-label={`${d.habit.name}${got(d) ? " — есть" : ""}`}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl border-2 text-xl",
                            got(d) ? "border-sun/60 bg-sun-soft" : "border-dashed border-line opacity-50 grayscale",
                          )}
                        >
                          {d.habit.emoji}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <ChessHomeCard />

      {weeks.map((w) => (
        <section key={w.number} aria-labelledby={`week-${w.number}`}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Неделя {w.number}</p>
              <h2 id={`week-${w.number}`} className="text-2xl font-black sm:text-3xl">
                {w.title}: {w.subtitle.toLowerCase()}
              </h2>
            </div>
            <Link
              href={`/week/${w.number}/print`}
              className="rounded-xl px-3 py-2 text-sm font-extrabold text-brand hover:bg-brand-soft"
            >
              🖨 Распечатать всю неделю
            </Link>
          </div>
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {w.days.map((d) => {
              const status = hydrated ? dayStatus(d, state, next?.id ?? null) : d.id === next?.id ? "next" : "later";
              const solved = hydrated ? solvedIn(d) : 0;
              return (
                <li key={d.id}>
                  <Link
                    href={`/week/${d.week}/day/${d.day}`}
                    className={cn(
                      "group flex h-full flex-col rounded-3xl border-2 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift",
                      status === "next" ? "border-brand" : status === "done" ? "border-mint/50" : "border-transparent",
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-muted">День {d.day}</span>
                      <StatusBadge status={status} />
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
                      <ProgressBar value={solved} max={d.tasks.length} />
                      <p className="mt-1 text-xs font-bold text-muted">
                        {solved} из {d.tasks.length} задач
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
                  <p className="mt-1 font-extrabold">Дальше — новые недели</p>
                  <p className="mt-1 text-sm text-muted">
                    Логика, геометрия, комбинаторика и алгоритмы — шаг за шагом.
                  </p>
                </div>
              </li>
            )}
          </ol>
        </section>
      ))}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Мои достижения">
        <StatCard emoji="✅" value={hydrated ? stats.solved : 0} label="задач решено" />
        <StatCard emoji="💬" value={hydrated ? stats.explained : 0} label="решений объяснено" />
        <StatCard emoji="🔁" value={hydrated ? stats.anotherWay : 0} label="других способов" />
        <StatCard emoji="✍️" value={hydrated ? stats.own : 0} label="своих задач" href="/my-problems" />
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { text: string; cls: string }> = {
    done: { text: "✓ пройден", cls: "bg-mint-soft text-[#047857]" },
    next: { text: "▶ сегодня", cls: "bg-brand text-white" },
    active: { text: "в процессе", cls: "bg-sun-soft text-[#7a4b00]" },
    later: { text: "впереди", cls: "bg-paper text-muted" },
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

function Welcome() {
  const [age, setAge] = useState<number | null>(null);
  const profile = age ? PROFILES[ageProfile(age)] : null;
  const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="my-auto w-full max-w-lg animate-pop rounded-[2rem] bg-white p-6 shadow-lift sm:p-8">
        <div className="mb-3 text-5xl" aria-hidden>
          🤖🧠✨
        </div>
        <h2 id="welcome-title" className="text-2xl font-black">
          Привет! Добро пожаловать в Лабораторию Давлатжона!
        </h2>
        <p className="mt-2 text-lg text-muted">
          Здесь живут задачи, над которыми интересно подумать. Три правила Лаборатории:
        </p>
        <ListenButton src={VOICE_CLIPS.welcome} label="Послушать приветствие" className="mt-2" />
        <ol className="mt-4 space-y-2 text-lg font-bold">
          <li>🐢 Не торопись: думать — важнее, чем быстро отвечать.</li>
          <li>💡 Застрял? Открой подсказку — они приходят по одной.</li>
          <li>💬 Нашёл ответ? Объясни, почему это так — и поищи другой способ.</li>
        </ol>
        <fieldset className="mt-5">
          <legend className="text-lg font-black">Сколько тебе лет?</legend>
          <p className="text-sm text-muted">
            От этого зависит, с каких заданий начать. Изменить можно в разделе для родителей.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ages.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAge(a)}
                aria-pressed={age === a}
                className={cn(
                  "min-h-11 min-w-11 rounded-xl border-2 px-3 text-lg font-black transition",
                  age === a ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40",
                )}
              >
                {a === AGE_MAX ? `${a}+` : a}
              </button>
            ))}
          </div>
          {profile && (
            <p className="mt-2 rounded-2xl bg-brand-soft/60 px-3 py-2 text-sm font-semibold" aria-live="polite">
              {profile.name} профиль · {profile.ages}. {profile.about}
            </p>
          )}
        </fieldset>
        <Button
          size="lg"
          className="mt-5 w-full"
          disabled={!age}
          onClick={() => {
            if (age) updateSettings({ age });
            setWelcomed();
          }}
        >
          Поехали! 🚀
        </Button>
      </div>
    </div>
  );
}
