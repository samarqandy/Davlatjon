import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParentGate } from "@/components/parent/ParentGate";
import { WeeklyReview, type ReviewWeek } from "@/components/parent/WeeklyReview";
import { WEEKS, getWeek } from "@/content/program";
import type { Week } from "@/content/types";
import { localizeWeek } from "@/content/uz";
import { weekFacts } from "@/lib/insights";

type Props = { params: Promise<{ week: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return WEEKS.map((w) => ({ week: String(w.number) }));
}

export const metadata: Metadata = { title: "Недельный обзор" };

/** Для обзора хватает названий задач, разделов и вопросов — условия и решения на страницу не уходят. */
const reviewWeek = (w: Week): ReviewWeek => ({ ...weekFacts(w), review: w.review });

export default async function ReviewPage({ params }: Props) {
  const { week } = await params;
  const w = getWeek(Number(week));
  if (!w) notFound();
  return (
    <ParentGate>
      <WeeklyReview week={{ ru: reviewWeek(w), uz: reviewWeek(localizeWeek(w, "uz")) }} />
    </ParentGate>
  );
}
