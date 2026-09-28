import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DaySession } from "@/components/session/DaySession";
import { allDays, dayHref, getDay } from "@/content/program";
import type { Day } from "@/content/types";
import { localizeDay } from "@/content/uz";

type Props = { params: Promise<{ week: string; day: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allDays().map((d) => ({ week: String(d.week), day: String(d.day) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { week, day } = await params;
  const d = getDay(Number(week), Number(day));
  return { title: d ? `День ${d.day}. ${d.title}` : "День не найден" };
}

/** Ребёнку не нужны объяснения из ключа ответов — не отправляем их в браузер. */
function forChild(day: Day): Day {
  return { ...day, tasks: day.tasks.map((t) => ({ ...t, solution: { answer: "", explanation: [] } })) };
}

export default async function DayPage({ params }: Props) {
  const { week, day } = await params;
  const d = getDay(Number(week), Number(day));
  if (!d) notFound();
  const days = allDays();
  const idx = days.findIndex((x) => x.id === d.id);
  const next = days[idx + 1];
  // Сначала перевод, потом forChild — иначе узбекское решение попало бы в браузер ребёнка.
  return (
    <DaySession
      day={{ ru: forChild(d), uz: forChild(localizeDay(d, "uz")) }}
      nextDayHref={next ? dayHref(next) : null}
    />
  );
}
