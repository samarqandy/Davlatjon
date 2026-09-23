import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintView } from "@/components/print/PrintView";
import { WEEKS, getWeek } from "@/content/program";

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
  return <PrintView days={w.days} title={`Неделя ${w.number}. ${w.title} — все 7 дней`} backHref="/" />;
}
