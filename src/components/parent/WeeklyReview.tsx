"use client";

import { Button, Card } from "@/components/ui";
import type { Week } from "@/content/types";
import { useBoth, useLang, useT, type Both } from "@/lib/i18n";
import { weekEvidence, weekTotals, type WeekFacts } from "@/lib/insights";
import { formatMinutes } from "@/lib/plural";
import { setReviewNote, useStore } from "@/lib/store";

/** Неделя для обзора: дни и задачи без условий и решений — и десять вопросов наблюдения. */
export interface ReviewWeek extends WeekFacts {
  review: Week["review"];
}

export function WeeklyReview({ week: both }: { week: Both<ReviewWeek> }) {
  const t = useT();
  const lang = useLang();
  const week = useBoth(both);
  const state = useStore((s) => s);
  const evidence = weekEvidence(week, state, lang);
  const totals = weekTotals(week, state);
  const notes = state.reviews[`w${week.number}`] ?? {};

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
            {t(`Неделя ${week.number}`, `${week.number}-hafta`)}
          </p>
          <h1 className="text-3xl font-black">{t("Недельный обзор", "Haftalik sharh")}</h1>
          <p className="mt-1 max-w-2xl text-muted">
            {t(
              "Раз в неделю ответьте на 10 вопросов. Под каждым вопросом — факты, которые платформа собрала сама. Ваши заметки сохраняются в этом браузере.",
              "Haftada bir marta 10 ta savolga javob bering. Har bir savol ostida platforma oʻzi toʻplagan faktlar turadi. Qaydlaringiz shu brauzerda saqlanadi.",
            )}
          </p>
        </div>
        <Button variant="secondary" onClick={() => window.print()} className="no-print">
          🖨 {t("Распечатать обзор", "Sharhni chop etish")}
        </Button>
      </div>

      <Card className="border-sun/50 bg-sun-soft p-4 text-[#6b4e0e]">
        <p className="font-extrabold">{t("Без ярлыков 🙏", "Yorliqlarsiz 🙏")}</p>
        <p className="mt-1 text-[0.95rem]">
          {t(
            "Не пишите «гений», «одарённый», «слабый», «сильный». Описывайте, что было видно: «Сегодня он сам нашёл закономерность», «Сегодня ему понадобилась подсказка, чтобы упорядочить варианты».",
            "«Daho», «isteʼdodli», «boʻsh», «kuchli» deb yozmang. Nimani koʻrgan boʻlsangiz, shuni yozing: «Bugun u qonuniyatni oʻzi topdi», «Bugun unga variantlarni tartibga solish uchun maslahat kerak boʻldi».",
          )}
        </p>
      </Card>

      <Card className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
        <Metric value={`${totals.daysDone} / ${week.days.length}`} label={t("дней пройдено", "kun oʻtildi")} />
        <Metric value={`${totals.solved} / ${totals.tasks}`} label={t("задач решено", "masala yechildi")} />
        <Metric value={formatMinutes(totals.timeMs, lang)} label={t("время на задачах", "masalalarga ketgan vaqt")} />
        <Metric value={String(totals.hints)} label={t("подсказок открыто", "maslahat ochildi")} />
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
                  {t(
                    "Данных пока нет — они появятся, когда ребёнок порешает задачи.",
                    "Hozircha maʼlumot yoʻq — farzandingiz masalalar yechgach, shu yerda paydo boʻladi.",
                  )}
                </p>
              )}
              <textarea
                defaultValue={notes[q.id] ?? ""}
                onBlur={(e) => setReviewNote(`w${week.number}`, q.id, e.target.value)}
                placeholder={t("Ваше наблюдение…", "Kuzatuvingiz…")}
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
