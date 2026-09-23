"use client";

import { Button, Card } from "@/components/ui";
import type { Week } from "@/content/types";
import { weekEvidence, weekTotals } from "@/lib/insights";
import { formatMinutes } from "@/lib/plural";
import { setReviewNote, useStore } from "@/lib/store";

export function WeeklyReview({ week }: { week: Week }) {
  const state = useStore((s) => s);
  const evidence = weekEvidence(week, state);
  const totals = weekTotals(week, state);
  const notes = state.reviews[`w${week.number}`] ?? {};

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Неделя {week.number}</p>
          <h1 className="text-3xl font-black">Недельный обзор</h1>
          <p className="mt-1 max-w-2xl text-muted">
            Раз в неделю ответьте на 10 вопросов. Под каждым вопросом — факты, которые платформа собрала сама. Ваши
            заметки сохраняются в этом браузере.
          </p>
        </div>
        <Button variant="secondary" onClick={() => window.print()} className="no-print">
          🖨 Распечатать обзор
        </Button>
      </div>

      <Card className="border-sun/50 bg-sun-soft p-4 text-[#6b4e0e]">
        <p className="font-extrabold">Без ярлыков 🙏</p>
        <p className="mt-1 text-[0.95rem]">
          Не пишите «гений», «одарённый», «слабый», «сильный». Описывайте, что было видно: «Сегодня он сам нашёл
          закономерность», «Сегодня ему понадобилась подсказка, чтобы упорядочить варианты».
        </p>
      </Card>

      <Card className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
        <Metric value={`${totals.daysDone} / ${week.days.length}`} label="дней пройдено" />
        <Metric value={`${totals.solved} / ${totals.tasks}`} label="задач решено" />
        <Metric value={formatMinutes(totals.timeMs)} label="время на задачах" />
        <Metric value={String(totals.hints)} label="подсказок открыто" />
      </Card>

      <ol className="space-y-4">
        {week.review.map((q, i) => (
          <li key={q.id} className="print-task">
            <Card className="p-5">
              <h2 className="text-lg font-black">
                {i + 1}. {q.text}
              </h2>
              <p className="mt-0.5 text-sm text-muted">{q.hint}</p>
              {evidence[q.id]?.length ? (
                <ul className="mt-3 space-y-1 rounded-2xl bg-paper px-4 py-3 text-[0.95rem]">
                  {evidence[q.id].map((e) => (
                    <li key={e} className="flex gap-2">
                      <span aria-hidden>📌</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-2xl bg-paper px-4 py-3 text-sm text-muted">
                  Данных пока нет — они появятся, когда ребёнок порешает задачи.
                </p>
              )}
              <textarea
                defaultValue={notes[q.id] ?? ""}
                onBlur={(e) => setReviewNote(`w${week.number}`, q.id, e.target.value)}
                placeholder="Ваше наблюдение…"
                rows={2}
                className="mt-3 w-full rounded-2xl border-2 border-line bg-white px-3 py-2 outline-none focus:border-brand"
              />
            </Card>
          </li>
        ))}
      </ol>
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
