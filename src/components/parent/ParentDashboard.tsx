"use client";

import Link from "next/link";
import { ButtonLink, Card, cn, ProgressBar } from "@/components/ui";
import { useBoth, useLang, useT, type Both } from "@/lib/i18n";
import { currentRank, levelStatuses } from "@/lib/chessProgress";
import { weekTotals } from "@/lib/insights";
import { formatMinutes } from "@/lib/plural";
import { useHydrated, useStore } from "@/lib/store";
import { useChess } from "@/lib/useChess";

/** Неделя для обзора родителя — без условий и ответов (собирается на сервере, на обоих языках). */
export interface ParentWeek {
  number: number;
  title: string;
  days: {
    id: string;
    week: number;
    day: number;
    emoji: string;
    title: string;
    /** Главный навык дня — первый из заметок для родителя. */
    skill: string;
    tasks: { id: string }[];
  }[];
}

const TIPS = [
  {
    ru: "20–30 минут в спокойной обстановке. Не обязательно решить всё.",
    uz: "Tinch sharoitda 20–30 daqiqa. Hammasini yechish shart emas.",
  },
  {
    ru: "Ребёнок решает сам. Вы — рядом: слушаете и задаёте вопросы.",
    uz: "Farzandingiz oʻzi yechadi. Siz yonida boʻlasiz: tinglaysiz va savol berasiz.",
  },
  {
    ru: "Вместо «неправильно» — «Давай проверим твою идею».",
    uz: "«Notoʻgʻri» oʻrniga — «Qani, fikringni tekshirib koʻraylik».",
  },
  {
    ru: "Подсказки — по одной, начиная с первой. Ответ — только в самом конце.",
    uz: "Maslahatlar — bittadan, birinchisidan boshlab. Javob — faqat eng oxirida.",
  },
  {
    ru: "После решения: «Почему? Как ты это узнал? Можно по-другому?»",
    uz: "Yechimdan keyin soʻrang: «Nega? Buni qanday bilding? Boshqacha yoʻli bormi?»",
  },
];

export function ParentDashboard({ weeks: both }: { weeks: Both<ParentWeek[]> }) {
  const hydrated = useHydrated();
  const t = useT();
  const lang = useLang();
  const weeks = useBoth(both);
  const state = useStore((s) => s);
  const next = hydrated ? weeks.flatMap((w) => w.days).find((d) => !state.days[d.id]?.completedAt) : undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="p-5 sm:p-6">
          <h1 className="text-2xl font-black">{t("Здравствуйте! 👋", "Assalomu alaykum! 👋")}</h1>
          <p className="mt-1 text-muted">
            {t(
              "Здесь — ответы, объяснения и подсказки к каждому дню, заметки о том, как думает {child}, и еженедельный обзор. Ребёнок этот раздел не видит.",
              "Bu yerda har bir kun uchun javoblar, tushuntirishlar va maslahatlar, {child} qanday fikrlashi haqidagi qaydlar hamda haftalik sharh jamlangan. Farzandingiz bu boʻlimni koʻrmaydi.",
            )}
          </p>
          {weeks.map((w) => {
            const totals = hydrated ? weekTotals(w, state) : { tasks: 0, solved: 0, daysDone: 0, timeMs: 0, hints: 0 };
            return (
              <div key={w.number} className="mt-5">
                {weeks.length > 1 && (
                  <p className="mb-1.5 text-xs font-extrabold tracking-wide text-muted uppercase">
                    {t(`Неделя ${w.number}. ${w.title}`, `${w.number}-hafta. ${w.title}`)}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Metric value={`${totals.daysDone} / ${w.days.length}`} label={t("дней пройдено", "kun oʻtildi")} />
                  <Metric value={`${totals.solved} / ${totals.tasks}`} label={t("задач решено", "masala yechildi")} />
                  <Metric
                    value={formatMinutes(totals.timeMs, lang)}
                    label={t("время на задачах", "masalalarga ketgan vaqt")}
                  />
                  <Metric value={String(totals.hints)} label={t("подсказок открыто", "maslahat ochildi")} />
                </div>
              </div>
            );
          })}
          {next && (
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-dashed border-brand/25 px-4 py-3">
              <span className="text-2xl" aria-hidden>
                {next.emoji}
              </span>
              <div className="mr-auto">
                <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
                  {t("Следующее занятие", "Keyingi mashgʻulot")}
                </p>
                <p className="font-black">
                  {weeks.length > 1 && t(`Неделя ${next.week} · `, `${next.week}-hafta · `)}
                  {t(`День ${next.day}. ${next.title}`, `${next.day}-kun. ${next.title}`)}
                </p>
              </div>
              <ButtonLink href={`/parent/week/${next.week}/day/${next.day}`} size="sm" variant="soft">
                {t("Посмотреть ответы заранее", "Javoblarni oldindan koʻrish")}
              </ButtonLink>
            </div>
          )}
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">{t("Как провести занятие", "Mashgʻulotni qanday oʻtkazish kerak")}</h2>
          <ul className="mt-3 space-y-2 text-[0.95rem]">
            {TIPS.map((tip) => (
              <li key={tip.ru} className="flex gap-2">
                <span className="text-brand" aria-hidden>
                  ●
                </span>
                {t(tip.ru, tip.uz)}
              </li>
            ))}
          </ul>
          <Link href="/parent/guide" className="mt-3 inline-block text-sm font-extrabold text-brand hover:underline">
            {t("Подробнее в методичке →", "Batafsil — qoʻllanmada →")}
          </Link>
        </Card>
      </div>

      <ChessSummary />

      {weeks.map((w) => (
        <section key={w.number}>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-xl font-black">
              {t(`Неделя ${w.number}. ${w.title}`, `${w.number}-hafta. ${w.title}`)}
            </h2>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href={`/parent/week/${w.number}/review`} variant="soft" size="sm">
                📝 {t("Недельный обзор", "Haftalik sharh")}
              </ButtonLink>
              <ButtonLink href={`/week/${w.number}/print#all`} variant="secondary" size="sm">
                🖨 {t("Вся неделя с ответами", "Butun hafta — javoblari bilan")}
              </ButtonLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
            {w.days.map((d, i) => {
              const solved = hydrated ? d.tasks.filter((task) => state.tasks[task.id]?.status === "solved").length : 0;
              const done = hydrated && state.days[d.id]?.completedAt;
              return (
                <div
                  key={d.id}
                  className={cn(
                    "grid grid-cols-1 items-center gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_180px_auto]",
                    i > 0 && "border-t border-line",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-xl"
                      aria-hidden
                    >
                      {d.emoji}
                    </span>
                    <div>
                      <p className="font-black">
                        {t(`День ${d.day}. ${d.title}`, `${d.day}-kun. ${d.title}`)}{" "}
                        {done && <span className="text-mint">✓</span>}
                      </p>
                      <p className="text-sm text-muted">{d.skill}</p>
                    </div>
                  </div>
                  <div>
                    <ProgressBar value={solved} max={d.tasks.length} />
                    <p className="mt-1 text-xs font-bold text-muted">
                      {t(`решено ${solved} из ${d.tasks.length}`, `${d.tasks.length} tadan ${solved} tasi yechildi`)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink href={`/parent/week/${d.week}/day/${d.day}`} size="sm">
                      {t("Ответы и заметки", "Javoblar va qaydlar")}
                    </ButtonLink>
                    <ButtonLink
                      href={`/week/${d.week}/day/${d.day}/print#all`}
                      variant="secondary"
                      size="sm"
                      aria-label={t(`Распечатать день ${d.day}`, `${d.day}-kunni chop etish`)}
                    >
                      🖨
                    </ButtonLink>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-paper px-3 py-3">
      <div className="tabular text-2xl font-black">{value}</div>
      <div className="text-xs font-bold text-muted">{label}</div>
    </div>
  );
}

function ChessSummary() {
  const hydrated = useHydrated();
  const t = useT();
  const levels = useChess().levels;
  const state = useStore((s) => s);
  const statuses = levelStatuses(levels, state);
  const rank = hydrated ? currentRank(levels, state) : null;
  const solved = hydrated ? statuses.reduce((s, x) => s + x.solved, 0) : 0;
  const total = statuses.reduce((s, x) => s + x.total, 0);
  const passed = hydrated ? statuses.filter((s) => s.passed).length : 0;
  return (
    <Card className="flex flex-wrap items-center gap-4 p-5">
      <span className="text-4xl" aria-hidden>
        ♞
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-extrabold">{t("Шахматная школа", "Shaxmat maktabi")}</h2>
        <p className="text-muted">
          {t("Звание: ", "Unvon: ")}
          <b className="text-ink">{rank ? rank.name : t("пока нет", "hozircha yoʻq")}</b>
          {t(
            ` · уровней пройдено: ${passed} из ${levels.length}`,
            ` · oʻtilgan darajalar: ${levels.length} tadan ${passed} tasi`,
          )}
        </p>
        <div className="mt-2 flex max-w-md items-center gap-2">
          <ProgressBar value={solved} max={total} className="flex-1" />
          <span className="text-sm font-extrabold whitespace-nowrap">
            {t(`${solved} из ${total}`, `${total} tadan ${solved}`)}
          </span>
        </div>
      </div>
      <ButtonLink href="/parent/chess" variant="soft" size="sm">
        {t("Ответы и прогресс →", "Javoblar va natijalar →")}
      </ButtonLink>
    </Card>
  );
}
