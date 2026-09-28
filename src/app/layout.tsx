import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/nunito";
import "./globals.css";
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
    <html lang="ru">
      <body className="min-h-dvh">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
