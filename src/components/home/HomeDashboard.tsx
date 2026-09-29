"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChessHomeCard } from "@/components/chess/ChessHomeCard";
import { Button, ButtonLink, Card, cn, ProgressBar } from "@/components/ui";
import { sectionsFor } from "@/content/meta";
import type { DaySummary, WeekSummary } from "@/content/summary";
import { ChildNameField } from "@/components/ChildNameField";
import { ChildNameBanner } from "@/components/home/ChildNameBanner";
import { ListenButton } from "@/components/ListenButton";
import { cleanChildName } from "@/lib/childName";
import { AGE_MAX, AGE_MIN, PROFILES, ageProfile, profileMeta, profileText } from "@/lib/age";
import { LANGS, setLang, useBoth, useLang, useT, type Both, type T } from "@/lib/i18n";
import { setChildName, setWelcomed, updateSettings, useHydrated, useStore, type AppState } from "@/lib/store";

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
          <h1 className="mt-1 text-3xl leading-tight font-black sm:text-4xl">
            {t("Математика — это место, где происходят интересные вещи", "Matematika — qiziqarli kashfiyotlar olami")}
          </h1>
          {next ? (
            <div className="mt-6 rounded-3xl bg-white/12 p-4 ring-1 ring-white/25 backdrop-blur-sm">
              <p className="text-sm font-extrabold tracking-wide text-white/75 uppercase">
                {hydrated && state.days[next.id]?.startedAt
                  ? t("Продолжим", "Davom etamiz")
                  : t("Сегодняшнее занятие", "Bugungi mashgʻulot")}
              </p>
              <p className="mt-1 text-2xl font-black">
                <span aria-hidden>{next.emoji}</span>{" "}
                {weeks.length > 1 && t(`Неделя ${next.week} · `, `${next.week}-hafta · `)}
                {t(`День ${next.day}.`, `${next.day}-kun.`)} {next.title}
              </p>
              <p className="mt-1 text-sm text-white/80">
                {t(
                  `${next.tasks.length} задач · около 25 минут · привычка «${next.habit.name}»`,
                  `${next.tasks.length} ta masala · taxminan 25 daqiqa · odat: «${next.habit.name}»`,
                )}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href={`/week/${next.week}/day/${next.day}`} variant="sun" size="lg">
                  {hydrated && state.days[next.id]?.startedAt
                    ? t("Продолжить ▶", "Davom etish ▶")
                    : t("Начать ▶", "Boshlash ▶")}
                </ButtonLink>
                <ButtonLink
                  href={`/week/${next.week}/day/${next.day}/print`}
                  variant="secondary"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  🖨 {t("Распечатать", "Chop etish")}
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl bg-white/12 p-4 ring-1 ring-white/25">
              <p className="text-2xl font-black">🎉 {t("Все дни пройдены!", "Barcha kunlarni tamomlading!")}</p>
              <p className="mt-1 text-white/85">
                {t(
                  "Можно вернуться к любимым задачам, придумать свои или попросить родителей открыть недельный обзор.",
                  "Sevimli masalalaringga qaytishing, oʻzing yangi masala oʻylab topishing yoki ota-onangdan haftalik sharhni ochib berishni soʻrashing mumkin.",
                )}
              </p>
            </div>
          )}
          {hydrated && state.settings.age && (
            <p className="mt-3 text-xs font-bold text-white/70">
              {t("Режим занятий", "Mashgʻulot rejimi")}: {profileText(profileMeta(state.settings.age), lang).ages} ·{" "}
              <Link href="/parent/settings" className="underline hover:text-white">
                {t("изменить", "oʻzgartirish")}
              </Link>
            </p>
          )}
        </div>

        <Card className="p-5 sm:p-6">
          <h2 className="mb-1 text-lg font-extrabold">{t("Мои привычки мыслителя", "Fikrlash odatlarim")}</h2>
          <p className="mb-4 text-sm text-muted">
            {t("Каждый пройденный день добавляет новую привычку.", "Har bir oʻtilgan kun yangi odat qoʻshadi.")}
          </p>
          <div className="space-y-4">
            {weeks.map((w) => {
              const full = weeks.length === 1 || w.number === currentWeek;
              const got = (d: DaySummary) => hydrated && Boolean(state.days[d.id]?.completedAt);
              return (
                <div key={w.number}>
                  {weeks.length > 1 && (
                    <p className="mb-1.5 text-xs font-extrabold tracking-wide text-muted uppercase">
                      {t(`Неделя ${w.number}`, `${w.number}-hafta`)} · {w.title}
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
                          aria-label={`${d.habit.name}${got(d) ? t(" — есть", " — bor") : ""}`}
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
              <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
                {t(`Неделя ${w.number}`, `${w.number}-hafta`)}
              </p>
              <h2 id={`week-${w.number}`} className="text-2xl font-black sm:text-3xl">
                {w.title}: {w.subtitle.toLowerCase()}
              </h2>
            </div>
            <Link
              href={`/week/${w.number}/print`}
              className="rounded-xl px-3 py-2 text-sm font-extrabold text-brand hover:bg-brand-soft"
            >
              🖨 {t("Распечатать всю неделю", "Butun haftani chop etish")}
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
                      <span className="text-sm font-extrabold text-muted">{t(`День ${d.day}`, `${d.day}-kun`)}</span>
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

function Welcome() {
  const t = useT();
  const lang = useLang();
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const text = useRef<HTMLDivElement>(null);
  const ready = !!cleanChildName(name) && !!age;
  const start = () => {
    if (!ready) return;
    setChildName(name);
    updateSettings({ age: age! });
    setWelcomed();
  };
  const profile = age ? profileText(PROFILES[ageProfile(age)], lang) : null;
  const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="my-auto w-full max-w-lg animate-pop rounded-[2rem] bg-white p-6 shadow-lift sm:p-8">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="text-5xl" aria-hidden>
            🤖🧠✨
          </div>
          <div className="flex gap-1.5" role="group" aria-label="Язык · Til">
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                aria-pressed={lang === l.id}
                className={cn(
                  "rounded-xl border-2 px-3 py-1.5 text-sm font-black transition",
                  lang === l.id ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div ref={text}>
          <h2 id="welcome-title" className="text-2xl font-black">
            {t("Привет! Добро пожаловать в лабораторию!", "Salom! Laboratoriyaga xush kelibsan!")}
          </h2>
          <p className="mt-2 text-lg text-muted">
            {t(
              "Здесь живут задачи, над которыми интересно подумать. Три правила Лаборатории:",
              "Bu yerda ustida bosh qotirish maroqli boʻlgan masalalar yashaydi. Laboratoriyaning uchta qoidasi bor:",
            )}
          </p>
          <ol className="mt-4 space-y-2 text-lg font-bold">
            <li>
              🐢{" "}
              {t(
                "Не торопись: думать — важнее, чем быстро отвечать.",
                "Shoshilma: tez javob berishdan koʻra oʻylab koʻrish muhimroq.",
              )}
            </li>
            <li>
              💡{" "}
              {t(
                "Застрял? Открой подсказку — они приходят по одной.",
                "Qiynaldingmi? Maslahatni och — ular bittadan keladi.",
              )}
            </li>
            <li>
              💬{" "}
              {t(
                "Нашёл ответ? Объясни, почему это так — и поищи другой способ.",
                "Javobni topdingmi? Nega aynan shunday ekanini tushuntir va boshqa yoʻlini ham izla.",
              )}
            </li>
          </ol>
        </div>
        <ListenButton from={text} label={t("Послушать приветствие", "Salomlashuvni tinglash")} className="mt-3" />
        <div className="mt-5">
          <ChildNameField
            value={name}
            onChange={setName}
            hint={t(
              "Так Лаборатория будет к тебе обращаться. Родители могут поменять имя в своём разделе.",
              "Laboratoriya senga shu ism bilan murojaat qiladi. Ota-onang uni oʻz boʻlimida oʻzgartira oladi.",
            )}
          />
        </div>
        <fieldset className="mt-4">
          <legend className="text-lg font-black">{t("Сколько тебе лет?", "Necha yoshdasan?")}</legend>
          <p className="text-sm text-muted">
            {t(
              "От этого зависит, с каких заданий начать. Изменить можно в разделе для родителей.",
              "Qaysi topshiriqlardan boshlash shunga bogʻliq. Keyin ota-onalar boʻlimida oʻzgartirsa boʻladi.",
            )}
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
              {t(`${profile.name} профиль`, `«${profile.name}» rejimi`)} · {profile.ages}. {profile.about}
            </p>
          )}
        </fieldset>
        <Button size="lg" className="mt-5 w-full" disabled={!ready} onClick={start}>
          {t("Поехали! 🚀", "Ketdik! 🚀")}
        </Button>
      </div>
    </div>
  );
}
