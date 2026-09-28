import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintView } from "@/components/print/PrintView";
import { WEEKS, getWeek } from "@/content/program";
import { localizeWeek } from "@/content/uz";

type Props = { params: Promise<{ week: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return WEEKS.map((w) => ({ week: String(w.number) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { week } = await params;
  return { title: `Печать: неделя ${week}` };
}

export default async function WeekPrintPage({ params }: Props) {
  const { week } = await params;
  const w = getWeek(Number(week));
  if (!w) notFound();
  const uz = localizeWeek(w, "uz");
  return (
    <PrintView
      days={{ ru: w.days, uz: uz.days }}
      title={{
        ru: `Неделя ${w.number}. ${w.title} — все 7 дней`,
        uz: `${uz.number}-hafta. ${uz.title} — barcha 7 kun`,
      }}
      backHref="/"
    />
  );
}
