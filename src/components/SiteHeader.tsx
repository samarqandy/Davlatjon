"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { LangSwitch } from "./LangSwitch";
import { LogoMark } from "./Logo";

export function SiteHeader({ active }: { active?: "home" | "chess" | "problems" | "parent" }) {
  const t = useT();
  const link = (href: string, emoji: string, label: string, key: typeof active) => (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:px-3 sm:text-base ${
        active === key ? "bg-brand-soft text-brand-dark" : "text-muted hover:bg-black/5 hover:text-ink"
      }`}
    >
      <span aria-hidden className="text-lg leading-none sm:text-base">
        {emoji}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
  return (
    <header className="no-print sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5">
        <Link
          href="/"
          className="mr-auto flex items-center gap-2.5 rounded-xl pr-2"
          aria-label={t("Лаборатория Давлатжона — на главную", "Davlatjon laboratoriyasi — bosh sahifaga")}
        >
          <LogoMark size={40} />
          <span className="leading-tight">
            <span className="block text-[15px] font-black sm:text-lg">
              {t("Лаборатория Давлатжона", "Davlatjon laboratoriyasi")}
            </span>
            <span className="hidden text-xs font-bold text-muted sm:block">
              {t("математика · логика · алгоритмы", "matematika · mantiq · algoritmlar")}
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1" aria-label={t("Разделы", "Boʻlimlar")}>
          {link("/chess", "♞", t("Шахматы", "Shaxmat"), "chess")}
          {link("/my-problems", "✍️", t("Мои задачи", "Masalalarim"), "problems")}
          {link("/parent", "🔒", t("Родителям", "Ota-onalarga"), "parent")}
        </nav>
        <LangSwitch />
      </div>
    </header>
  );
}

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="no-print mt-16 border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold">
          {t(
            "Любопытство → Мышление → Рассуждение → Открытие → Уверенность",
            "Qiziquvchanlik → Fikrlash → Mulohaza → Kashfiyot → Ishonch",
          )}
        </p>
        <p>{t("Прогресс хранится только в этом браузере.", "Natijalar faqat shu brauzerda saqlanadi.")}</p>
      </div>
    </footer>
  );
}
