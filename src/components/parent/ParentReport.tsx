"use client";

import { useState } from "react";
import { Button, Card, cn } from "@/components/ui";
import { useTitleTranslation } from "@/lib/docTitle";
import { useLang, useT } from "@/lib/i18n";
import { addDays, rangeText, reportLines, weeklyReport } from "@/lib/report";
import { useHydrated, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";
import { ParentTime } from "./ParentTime";

const WEEKDAYS = {
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  uz: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
} as const;

/** Сколько недель назад можно посмотреть. */
const WEEKS_BACK = 12;

/** Итоги недели для родителя + время и приглашения. Ребёнок этот раздел не видит. */
export function ParentReport() {
  const t = useT();
  const lang = useLang();
  useTitleTranslation("Итоги недели — для родителей", "Hafta yakunlari — ota-onalar uchun");
  const hydrated = useHydrated();
  const today = useToday();
  const state = useStore((s) => s);
  const [back, setBack] = useState(0);

  if (!hydrated || !today) return <div className="min-h-96" />;

  const report = weeklyReport(state, addDays(today, -7 * back));
  const lines = reportLines(report, lang);
  const peak = Math.max(30, ...report.days.map((d) => d.minutes));

  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-6" data-report>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="mr-auto text-2xl font-black">📈 {t("Итоги недели", "Hafta yakunlari")}</h1>
          <div className="no-print flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              className="min-h-11 min-w-11"
              onClick={() => setBack((b) => Math.min(WEEKS_BACK, b + 1))}
              disabled={back >= WEEKS_BACK}
              aria-label={t("Предыдущая неделя", "Oldingi hafta")}
            >
              ←
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="min-h-11 min-w-11"
              onClick={() => setBack((b) => Math.max(0, b - 1))}
              disabled={back === 0}
              aria-label={t("Следующая неделя", "Keyingi hafta")}
            >
              →
            </Button>
            <Button variant="soft" size="sm" className="min-h-11" onClick={() => window.print()}>
              🖨 {t("Распечатать", "Chop etish")}
            </Button>
          </div>
        </div>
        <p className="mt-1 font-bold text-muted" data-report-range>
          {rangeText(report.from, report.to, lang)}
          {back === 0 && t(" · эта неделя", " · shu hafta")}
        </p>

        <ol className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-3" aria-label={t("Дни недели", "Hafta kunlari")}>
          {report.days.map((d, i) => (
            <li key={d.day} className="flex flex-col items-center gap-1" data-report-day={d.active ? "active" : "idle"}>
              <span className="text-xs font-extrabold text-muted">{d.minutes > 0 ? d.minutes : ""}</span>
              <span className="flex h-20 w-full max-w-10 items-end rounded-xl bg-paper">
                <span
                  className={cn("w-full rounded-xl", d.active ? "bg-mint" : "bg-line")}
                  style={{ height: `${Math.max(d.active ? 14 : 6, (d.minutes / peak) * 100)}%` }}
                />
              </span>
              <span className="text-xs font-extrabold">{WEEKDAYS[lang][i]}</span>
              <span aria-hidden className="text-sm leading-none">
                {d.active ? "✅" : "·"}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-muted">
          {t(
            "Минуты — это время, когда ребёнок что-то делал на сайте (пауза дольше полутора минут не считается).",
            "Daqiqalar — bola saytda nimadir qilgan vaqt (bir yarim daqiqadan uzoq tanaffus hisobga olinmaydi).",
          )}
        </p>

        <ul className="mt-4 space-y-2">
          {lines.map((l) => (
            <li key={l.text} className="flex gap-3 rounded-2xl bg-paper px-4 py-3">
              <span aria-hidden className="text-xl leading-none">
                {l.emoji}
              </span>
              <span className="font-bold">{l.text}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="no-print">
        <ParentTime />
      </div>
    </div>
  );
}
