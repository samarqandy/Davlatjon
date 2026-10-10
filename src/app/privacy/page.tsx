import type { Metadata } from "next";
import { PrivacyView } from "@/components/about/PrivacyView";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Конфиденциальность",
  description: "Какие данные хранит Parvoz Edu, где они лежат и как их удалить. Без рекламы и без продажи данных.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-16">
        <PrivacyView contact={CONTACT} />
      </main>
      <SiteFooter />
    </>
  );
}
