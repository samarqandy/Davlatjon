import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/nunito";
import "./globals.css";
import { AccountSync } from "@/components/AccountSync";
import { BottomNav } from "@/components/BottomNav";
import { LangSync } from "@/components/LangSwitch";
import { ServiceWorker } from "@/components/ServiceWorker";
import { ActivityTracker } from "@/components/progress/ActivityTracker";
import { RestCard } from "@/components/progress/RestCard";
import { XpToast } from "@/components/progress/XpToast";
import { BRAND, BRAND_TITLE } from "@/lib/brand";

export const metadata: Metadata = {
  title: {
    default: BRAND_TITLE.ru,
    template: `%s · ${BRAND}`,
  },
  description:
    "Ежедневные занятия для развития математического, логического, алгоритмического и научного мышления ребёнка 6–12 лет: задачи, подсказки, робот-программист, печать листов и раздел для родителей.",
  applicationName: BRAND,
  // Личная учебная платформа ребёнка: поисковикам её показывать не нужно.
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: BRAND, statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/*
          Узбекский язык — прячем страницу до загрузки, чтобы не мелькал русский текст. Имя ребёнка — только
          на страницах, где оно стоит в текстах заданий (занятия, раздел родителя, задачник): чтобы вместо
          имени не мелькало «Друг». Главная и шахматы с именем показываются сразу — там приветствие без имени до загрузки.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=JSON.parse(localStorage.getItem("davlatjon-lab:v1")||"{}").settings||{};var named=s.childName&&["week","parent","my-problems"].indexOf(location.pathname.split("/")[1])>=0;if(s.lang==="uz"||named){var h=document.documentElement;if(s.lang==="uz")h.lang="uz";h.classList.add("i18n-wait");setTimeout(function(){h.classList.remove("i18n-wait")},1500)}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh">
        {children}
        <BottomNav />
        <ServiceWorker />
        <LangSync />
        <XpToast />
        <ActivityTracker />
        <RestCard />
        <AccountSync />
      </body>
    </html>
  );
}
