import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/nunito";
import "./globals.css";
import { AccountSync } from "@/components/AccountSync";
import { LangSync } from "@/components/LangSwitch";
import { ServiceWorker } from "@/components/ServiceWorker";

export const metadata: Metadata = {
  title: {
    default: "Лаборатория Давлатжона — математика, логика, алгоритмы",
    template: "%s · Лаборатория Давлатжона",
  },
  description:
    "Ежедневные занятия для развития математического, логического, алгоритмического и научного мышления ребёнка от 7 лет: задачи, подсказки, робот-программист, печать листов и раздел для родителей.",
  applicationName: "Лаборатория Давлатжона",
  // Личная учебная платформа ребёнка: поисковикам её показывать не нужно.
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Лаборатория", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Если выбран узбекский, прячем страницу до загрузки — чтобы не мелькал русский текст. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=JSON.parse(localStorage.getItem("davlatjon-lab:v1")||"{}");if(s.settings&&s.settings.lang==="uz"){var h=document.documentElement;h.lang="uz";h.classList.add("i18n-wait");setTimeout(function(){h.classList.remove("i18n-wait")},1500)}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh">
        {children}
        <ServiceWorker />
        <LangSync />
        <AccountSync />
      </body>
    </html>
  );
}
