"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, Lightbulb } from "lucide-react";
import { Card, cn } from "@/components/ui";
import { useLang, useT } from "@/lib/i18n";
import { weekSummary } from "@/lib/parentWeek";
import { useHydrated, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";

const WEEKDAY = {
  ru: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  uz: ["ya", "du", "se", "ch", "pa", "ju", "sh"],
};

/** Первое, что видит родитель: как прошли последние 7 дней и что сделать на этой неделе. */
export function ParentWeekCard() {
  const t = useT();
  const lang = useLang();
  const hydrated = useHydrated();
  const state = useStore((s) => s);
  const today = useToday();
  // До загрузки прогресса — пустая карточка той же высоты: без мигания чисел.
  if (!hydrated || !today) return <Card className="min-h-80 p-5 sm:p-6" />;
  const w = weekSummary(state, today);
  const solved = w.math + w.chess + w.puzzles;
  const max = Math.max(10, ...w.days.map((d) => d.minutes));
  const tips = {
    start: t(
      "Начните с одного короткого занятия: 15 минут и «Задание дня» на главной.",
      "Bitta qisqa mashgʻulotdan boshlang: 15 daqiqa va bosh sahifadagi «Kun vazifasi».",
    ),
    rhythm: t(
      "Договоритесь о трёх коротких занятиях в неделю в одно и то же время — ритм важнее длительности.",
      "Haftasiga bir xil vaqtda uchta qisqa mashgʻulot qilishga kelishing — davomiylikdan koʻra muntazamlik muhimroq.",
    ),
    hints: t(
      "Многие задачи на этой неделе решались с подсказками — это нормально. Сядьте рядом и до подсказки спросите: «Как ты думаешь?»",
      "Bu hafta koʻp masalalar maslahat bilan yechildi — bu normal holat. Yonida oʻtiring va maslahatdan oldin soʻrang: «Sen qanday oʻylaysan?»",
    ),
    praise: t(
      "Хороший ритм! Похвалите за старание, а не за скорость, и спросите, какая задача была самой интересной.",
      "Yaxshi ritm! Tezlik uchun emas, harakat uchun maqtang va qaysi masala eng qiziq boʻlganini soʻrang.",
    ),
  };
  return (
    <Card className="p-5 sm:p-6" data-parent-week>
      <h2 className="flex items-center gap-2 text-xl font-black">
        <CalendarDays className="h-5 w-5 text-brand" aria-hidden />
        {t("Эта неделя", "Shu hafta")}
      </h2>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            [`${w.activeDays} / 7`, t("дней с занятиями", "mashgʻulotli kun"), "active"],
            [String(w.minutes), t("минут занятий", "daqiqa mashgʻulot"), "minutes"],
            [String(solved), t("заданий решено", "topshiriq yechildi"), "solved"],
            [String(w.mathClean), t("задач без подсказок", "maslahatsiz yechilgan masala"), "clean"],
          ] as const
        ).map(([value, label, key]) => (
          <div key={key} className="rounded-2xl bg-paper px-3 py-2" data-week-metric={key}>
            <dd className="text-2xl font-black tabular-nums">{value}</dd>
            <dt className="text-sm font-bold text-muted">{label}</dt>
          </div>
        ))}
      </dl>
      <ol
        className="mt-4 grid grid-cols-7 items-end gap-1.5"
        aria-label={t("Минуты по дням", "Kunlar boʻyicha daqiqalar")}
      >
        {w.days.map((d) => {
          const wd = new Date(`${d.day}T12:00:00`).getDay();
          return (
            <li key={d.day} className="flex flex-col items-center gap-1">
              <span className="flex h-20 w-full items-end rounded-lg bg-paper">
                <span
                  className={cn("w-full rounded-lg", d.active ? "bg-brand" : "bg-line")}
                  style={{ height: `${Math.max(d.active ? 12 : 4, (d.minutes / max) * 100)}%` }}
                />
              </span>
              <span className="text-xs font-extrabold text-muted">
                {WEEKDAY[lang][wd]}
                <span className="sr-only">{t(`: ${d.minutes} мин`, `: ${d.minutes} daq`)}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 flex gap-2 rounded-2xl bg-sun-soft px-4 py-3 font-bold text-sun-ink" data-week-tip={w.tip}>
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        {tips[w.tip]}
      </p>
      <Link
        href="/parent/report"
        className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
      >
        {t("Подробные итоги недели", "Haftaning batafsil yakunlari")}
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </Card>
  );
}
