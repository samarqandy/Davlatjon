import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParentGate } from "@/components/parent/ParentGate";
import { WeeklyReview } from "@/components/parent/WeeklyReview";
import { WEEKS, getWeek } from "@/content/program";

type Props = { params: Promise<{ week: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return WEEKS.map((w) => ({ week: String(w.number) }));
}

export const metadata: Metadata = { title: "Недельный обзор" };

export default async function ReviewPage({ params }: Props) {
  const { week } = await params;
  const w = getWeek(Number(week));
  if (!w) notFound();
  return (
    <ParentGate>
      <WeeklyReview week={w} />
    </ParentGate>
  );
}
