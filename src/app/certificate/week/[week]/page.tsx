import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeekCertificateView } from "@/components/WeekCertificate";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { WEEKS, getWeek } from "@/content/program";
import { summarizeWeek } from "@/content/summary";
import { localizeWeek } from "@/content/uz";

type Props = { params: Promise<{ week: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return WEEKS.map((w) => ({ week: String(w.number) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { week } = await params;
  const w = getWeek(Number(week));
  return { title: w ? `Сертификат: неделя ${w.number}` : "Неделя не найдена" };
}

export default async function WeekCertificatePage({ params }: Props) {
  const { week } = await params;
  const w = getWeek(Number(week));
  if (!w) notFound();
  return (
    <>
      <SiteHeader active="home" />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16 print:p-0">
        <WeekCertificateView
          week={{ ru: summarizeWeek(w), uz: summarizeWeek(localizeWeek(w, "uz")) }}
          weeksTotal={WEEKS.length}
        />
      </main>
      <SiteFooter />
    </>
  );
}
