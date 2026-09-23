import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParentDayView } from "@/components/parent/ParentDayView";
import { ParentGate } from "@/components/parent/ParentGate";
import { allDays, getDay } from "@/content/program";

type Props = { params: Promise<{ week: string; day: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allDays().map((d) => ({ week: String(d.week), day: String(d.day) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { day } = await params;
  return { title: `Ответы: день ${day}` };
}

export default async function ParentDayPage({ params }: Props) {
  const { week, day } = await params;
  const d = getDay(Number(week), Number(day));
  if (!d) notFound();
  return (
    <ParentGate>
      <ParentDayView day={d} />
    </ParentGate>
  );
}
