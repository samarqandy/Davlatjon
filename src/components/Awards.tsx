"use client";

import Link from "next/link";
import { useState } from "react";
import { cn, ProgressBar } from "@/components/ui";
import { PieceIcon } from "@/components/chess/ChessBoard";
import { activityDays, awards, dayStreak, earned } from "@/lib/awards";
import { certificateHref, rankEarnedAt } from "@/lib/certificate";
import { useLang, useT } from "@/lib/i18n";
import { plural, pluralize } from "@/lib/plural";
import { isoDay, useHydrated, useStore } from "@/lib/store";
import { useChess } from "@/lib/useChess";
import { useToday } from "@/lib/useToday";

const WEEKS = 14;
const DAY_NAMES = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
const DAY_NAMES_UZ = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
/** Одна гамма от светлого к тёмному: чем больше дел, тем темнее клетка. */
const STEPS = ["#ecebf3", "#c7c8f6", "#9699ee", "#6366e8", "#3f3cbb"];
const LEGEND = ["нет занятий", "1 дело", "2–3", "4–6", "7 и больше"];
const LEGEND_UZ = ["mashgʻulot yoʻq", "1 ta ish", "2–3", "4–6", "7 va undan koʻp"];

function step(n: number): number {
  if (!n) return 0;
  if (n === 1) return 1;
  if (n <= 3) return 2;
  if (n <= 6) return 3;
  return 4;
}

export function AwardsPage() {
  const hydrated = useHydrated();
  const t = useT();
  const lang = useLang();
  const state = useStore((s) => s);
  const today = useToday();
  const list = hydrated ? awards(state, lang) : [];
  const got = list.filter(earned);
  const days = hydrated ? activityDays(state) : {};
  const streak = hydrated && today ? dayStreak(days, today) : 0;

  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← {t("Шахматная школа", "Shaxmat maktabi")}
      </Link>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{t("Награды", "Mukofotlar")}</p>
          <h1 className="text-3xl font-black">{t("Мои награды и занятия", "Mukofotlarim va mashgʻulotlarim")}</h1>
          <p className="mt-1 max-w-2xl text-muted">
            {t(
              "Награды приходят сами — за задачи, партии, дебюты и привычку заниматься каждый день.",
              "Mukofotlar oʻz-oʻzidan keladi — masalalar, partiyalar, debyutlar va har kuni shugʻullanish odati uchun.",
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl bg-white px-4 py-2 text-center shadow-card">
            <p className="text-2xl font-black">
              {got.length}
              <span className="text-base text-muted"> / {list.length || "…"}</span>
            </p>
            <p className="text-xs font-bold text-muted">{t("наград", "mukofot")}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-2 text-center shadow-card">
            <p className="text-2xl font-black">🔥 {streak}</p>
            <p className="text-xs font-bold text-muted">
              {t(`${plural(streak, "день", "дня", "дней")} подряд`, "kun ketma-ket")}
            </p>
          </div>
        </div>
      </header>

      {today && <Calendar days={days} today={today} />}

      <Certificates />

      <section aria-labelledby="awards-h">
        <h2 id="awards-h" className="mb-3 text-2xl font-black">
          🏅 {t("Награды", "Mukofotlar")}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => {
            const ok = earned(a);
            return (
              <li
                key={a.id}
                className={cn(
                  "flex gap-3 rounded-3xl p-4 shadow-card",
                  ok ? "bg-sun-soft ring-2 ring-sun/50" : "bg-white",
                )}
              >
                <span className={cn("text-4xl", !ok && "opacity-30 grayscale")} aria-hidden>
                  {a.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-black">
                    {a.title} {ok && <span className="text-sm text-[#7a4b00]">{t("✓ получена", "✓ olindi")}</span>}
                  </p>
                  <p className="text-sm text-muted">{a.text}</p>
                  {!ok && a.need > 1 && (
                    <div className="mt-2 flex items-center gap-2">
                      <ProgressBar value={a.have} max={a.need} className="flex-1" />
                      <span className="text-xs font-extrabold text-muted tabular-nums">
                        {a.have}/{a.need}
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/** Сертификаты о полученных званиях — ссылки на листы для печати. */
function Certificates() {
  const t = useT();
  const hydrated = useHydrated();
  const { levels } = useChess();
  const state = useStore((s) => s);
  if (!hydrated) return null;
  const earnedLevels = levels.filter((l) => rankEarnedAt(l, state));
  return (
    <section aria-labelledby="cert-h" className="rounded-3xl bg-white p-4 shadow-card">
      <h2 id="cert-h" className="text-lg font-black">
        📜 {t("Сертификаты о званиях", "Unvon sertifikatlari")}
      </h2>
      {earnedLevels.length ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {earnedLevels.map((l) => (
            <li key={l.id}>
              <Link
                href={certificateHref(l.id)}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-sun/50 bg-sun-soft px-3 py-1.5 font-bold hover:border-sun"
              >
                <PieceIcon piece={l.piece} className="h-7 w-7" />
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-muted">
          {t(
            "Реши все упражнения уровня шахматной школы — и здесь появится сертификат с твоим именем для печати.",
            "Shaxmat maktabidagi darajaning hamma mashqlarini yech — bu yerda isming yozilgan sertifikat paydo boʻladi.",
          )}
        </p>
      )}
    </section>
  );
}

/** Календарь занятий за 14 недель: каждая клетка — день, цвет — сколько было дел. */
function Calendar({ days, today }: { days: Record<string, number>; today: string }) {
  const t = useT();
  const lang = useLang();
  const [hover, setHover] = useState<string | null>(null);
  const end = new Date(`${today}T12:00:00`);
  const monday = new Date(end);
  monday.setDate(end.getDate() - ((end.getDay() + 6) % 7) - (WEEKS - 1) * 7);
  const cols = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + w * 7 + d);
      const key = isoDay(date.getTime());
      return { key, n: days[key] ?? 0, future: key > today };
    }),
  );
  const total = Object.entries(days).filter(([k]) => k >= isoDay(monday.getTime())).length;
  const shown = hover
    ? `${hover.split("-").reverse().join(".")}: ${
        days[hover]
          ? t(pluralize(days[hover], "дело", "дела", "дел"), `${days[hover]} ta ish`)
          : t("занятий не было", "mashgʻulot boʻlmagan")
      }`
    : t(
        `Дней с занятиями за ${WEEKS} недель: ${total}`,
        `Soʻnggi ${WEEKS} haftada mashgʻulot boʻlgan kunlar: ${total}`,
      );
  return (
    <section className="rounded-3xl bg-white p-4 shadow-card" aria-labelledby="cal-h">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="cal-h" className="text-lg font-black">
          📅 {t("Календарь занятий", "Mashgʻulotlar taqvimi")}
        </h2>
        <p className="text-sm text-muted" aria-live="polite">
          {shown}
        </p>
      </div>
      <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
        <div className="grid grid-rows-7 gap-1 pr-1 text-[10px] font-bold text-muted">
          {(lang === "uz" ? DAY_NAMES_UZ : DAY_NAMES).map((d) => (
            <span key={d} className="flex h-4 items-center sm:h-5">
              {d}
            </span>
          ))}
        </div>
        {cols.map((col, w) => (
          <div key={w} className="grid grid-rows-7 gap-1">
            {col.map((c) => (
              <span
                key={c.key}
                role="img"
                aria-label={`${c.key}: ${c.n}`}
                title={`${c.key.split("-").reverse().join(".")}: ${c.n}`}
                onPointerEnter={() => setHover(c.key)}
                onPointerLeave={() => setHover(null)}
                className={cn(
                  "h-4 w-4 rounded-[4px] sm:h-5 sm:w-5",
                  c.future && "opacity-0",
                  c.key === today && "ring-2 ring-sun",
                )}
                style={{ background: STEPS[step(c.n)] }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-muted">
        {STEPS.map((color, i) => (
          <span key={color} className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-[3px]" style={{ background: color }} />
            {(lang === "uz" ? LEGEND_UZ : LEGEND)[i]}
          </span>
        ))}
      </div>
    </section>
  );
}
