import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintView } from "@/components/print/PrintView";
import { allDays, dayHref, getDay } from "@/content/program";

type Props = { params: Promise<{ week: string; day: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allDays().map((d) => ({ week: String(d.week), day: String(d.day) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { week, day } = await params;
  const d = getDay(Number(week), Number(day));
  return { title: d ? `Печать: день ${d.day}. ${d.title}` : "Печать" };
}

export default async function DayPrintPage({ params }: Props) {
  const { week, day } = await params;
  const d = getDay(Number(week), Number(day));
  if (!d) notFound();
  return <PrintView days={[d]} title={`Неделя ${d.week} · День ${d.day}. ${d.title}`} backHref={dayHref(d)} />;
}
