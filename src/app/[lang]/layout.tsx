import { Analytics } from "@vercel/analytics/next";
import { SkipLink } from "@/components/SkipLink";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/nunito";
import "../globals.css";
import { AccountSync } from "@/components/AccountSync";
import { BottomNav } from "@/components/BottomNav";
import { LangSync } from "@/components/LangSwitch";
import { MotionSync } from "@/components/MotionSync";
import { AgeSync } from "@/components/AgeSync";
import { ServiceWorker } from "@/components/ServiceWorker";
import { ActivityTracker } from "@/components/progress/ActivityTracker";
import { RestCard } from "@/components/progress/RestCard";
import { XpToast } from "@/components/progress/XpToast";
import { BRAND, BRAND_TITLE } from "@/lib/brand";
import type { Lang } from "@/lib/lang";
import { HEAD_SCRIPT } from "@/lib/headScript";
import { ServerLangProvider } from "@/lib/serverLang";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BRAND_TITLE.ru,
    template: `%s · ${BRAND}`,
  },
  description:
    "Ежедневные занятия для развития математического, логического, алгоритмического и научного мышления ребёнка 6–12 лет: задачи, подсказки, робот-программист, печать листов и раздел для родителей.",
  applicationName: BRAND,
  // Личная учебная платформа ребёнка: поисковикам её показывать не нужно.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: BRAND,
    title: BRAND_TITLE.ru,
    description:
      "Математика, логика и шахматы для детей 6–12 лет: короткие ежедневные занятия, подсказки, шахматная школа и раздел для родителей.",
    locale: "ru_RU",
    alternateLocale: ["uz_UZ"],
    images: [{ url: "/og.png", width: 1200, height: 630, alt: BRAND }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  appleWebApp: { capable: true, title: BRAND, statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Каждая страница собирается на двух языках: /ru/… и /uz/…. Адреса у детей при этом без приставки —
 * proxy.ts по куке `lang` молча подставляет нужную сборку, и узбекская страница приходит уже на узбекском.
 */
export function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "uz" }];
}

export const dynamicParams = false;

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ lang: string }> }>) {
  const lang: Lang = (await params).lang === "uz" ? "uz" : "ru";
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: HEAD_SCRIPT,
          }}
        />
      </head>
      <body className="min-h-dvh">
        <ServerLangProvider lang={lang}>
          <SkipLink />
          {children}
          <BottomNav />
          <ServiceWorker />
          <LangSync />
          <MotionSync />
          <AgeSync />
          <XpToast />
          <ActivityTracker />
          <RestCard />
          <AccountSync />
        </ServerLangProvider>
        {/* Обезличенная статистика без cookie: см. /privacy. */}
        <Analytics />
      </body>
    </html>
  );
}
