import type { Metadata } from "next";
import "@fontsource-variable/nunito";
import "./globals.css";
import { LangSync } from "@/components/LangSwitch";
import { NotFoundView } from "@/components/NotFoundView";
import { BRAND } from "@/lib/brand";
import { HEAD_SCRIPT } from "@/lib/headScript";

export const metadata: Metadata = {
  title: `Страница не найдена · ${BRAND}`,
  robots: { index: false, follow: false },
};

/**
 * Неизвестный адрес. Общий макет живёт в app/[lang] (язык — часть сборки), поэтому для адресов, которых
 * нет вовсе, нужен свой документ. Язык — с устройства: скрипт в <head> прячет страницу, пока не загрузится.
 */
export default function GlobalNotFound() {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body className="min-h-dvh">
        <NotFoundView />
        <LangSync />
      </body>
    </html>
  );
}
