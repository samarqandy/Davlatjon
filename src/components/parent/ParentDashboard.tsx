"use client";

import Link from "next/link";
import { ButtonLink, Card, cn, ProgressBar } from "@/components/ui";
import type { Week } from "@/content/types";
import { weekTotals } from "@/lib/insights";
import { formatMinutes } from "@/lib/plural";
import { useHydrated, useStore } from "@/lib/store";

const TIPS = [
  "20–30 минут в спокойной обстановке. Не обязательно решить всё.",
  "Ребёнок решает сам. Вы — рядом: слушаете и задаёте вопросы.",
  "Вместо «неправильно» — «Давай проверим твою идею».",
  "Подсказки — по одной, начиная с первой. Ответ — только в самом конце.",
  "После решения: «Почему? Как ты это узнал? Можно по-другому?»",
];

export function ParentDashboard({ weeks }: { weeks: Week[] }) {
  const hydrated = useHydrated();
  const state = useStore((s) => s);
  const next = hydrated ? weeks.flatMap((w) => w.days).find((d) => !state.days[d.id]?.completedAt) : undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="p-5 sm:p-6">
          <h1 className="text-2xl font-black">Здравствуйте! 👋</h1>
          <p className="mt-1 text-muted">
            Здесь — ответы, объяснения и подсказки к каждому дню, заметки о том, как думает Давлатжон, и еженедельный
            обзор. Ребёнок этот раздел не видит.
          </p>
          {weeks.map((w) => {
            const t = hydrated ? weekTotals(w, state) : { tasks: 0, solved: 0, daysDone: 0, timeMs: 0, hints: 0 };
            return (
              <div key={w.number} className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric value={`${t.daysDone} / ${w.days.length}`} label="дней пройдено" />
                <Metric value={`${t.solved} / ${t.tasks}`} label="задач решено" />
                <Metric value={formatMinutes(t.timeMs)} label="время на задачах" />
                <Metric value={String(t.hints)} label="подсказок открыто" />
              </div>
            );
          })}
          {next && (
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-dashed border-brand/25 px-4 py-3">
              <span className="text-2xl" aria-hidden>
                {next.emoji}
              </span>
              <div className="mr-auto">
                <p className="text-xs font-extrabold tracking-wide text-muted uppercase">Следующее занятие</p>
                <p className="font-black">
                  День {next.day}. {next.title}
                </p>
              </div>
              <ButtonLink href={`/parent/week/${next.week}/day/${next.day}`} size="sm" variant="soft">
                Посмотреть ответы заранее
              </ButtonLink>
            </div>
          )}
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">Как провести занятие</h2>
          <ul className="mt-3 space-y-2 text-[0.95rem]">
            {TIPS.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-brand" aria-hidden>
                  ●
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Link href="/parent/guide" className="mt-3 inline-block text-sm font-extrabold text-brand hover:underline">
            Подробнее в методичке →
          </Link>
        </Card>
      </div>

      {weeks.map((w) => (
        <section key={w.number}>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-xl font-black">
              Неделя {w.number}. {w.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href={`/parent/week/${w.number}/review`} variant="soft" size="sm">
                📝 Недельный обзор
              </ButtonLink>
              <ButtonLink href={`/week/${w.number}/print#all`} variant="secondary" size="sm">
                🖨 Вся неделя с ответами
              </ButtonLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
            {w.days.map((d, i) => {
              const solved = hydrated ? d.tasks.filter((t) => state.tasks[t.id]?.status === "solved").length : 0;
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
                        День {d.day}. {d.title} {done && <span className="text-mint">✓</span>}
                      </p>
                      <p className="text-sm text-muted">{d.parent.skills[0]}</p>
                    </div>
                  </div>
                  <div>
                    <ProgressBar value={solved} max={d.tasks.length} />
                    <p className="mt-1 text-xs font-bold text-muted">
                      решено {solved} из {d.tasks.length}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink href={`/parent/week/${d.week}/day/${d.day}`} size="sm">
                      Ответы и заметки
                    </ButtonLink>
                    <ButtonLink
                      href={`/week/${d.week}/day/${d.day}/print#all`}
                      variant="secondary"
                      size="sm"
                      aria-label={`Распечатать день ${d.day}`}
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
