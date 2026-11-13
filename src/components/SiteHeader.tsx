"use client";

import { Icon } from "@/components/ui";
import Link from "next/link";
import { BarChart3, ChessKnight, Lock, PencilLine, Trophy, type LucideIcon } from "lucide-react";
import { loginAvailable, useAccount } from "@/lib/account";
import { useT } from "@/lib/i18n";
import { BRAND, BRAND_TAGLINE } from "@/lib/brand";
import { LangSwitch } from "./LangSwitch";
import { ProfileSwitcher } from "./ProfileSwitcher";
import { LogoMark } from "./Logo";
import { ThemeToggle } from "./ThemeSync";

export function SiteHeader({
  active,
}: {
  active?: "home" | "chess" | "problems" | "parent" | "leaderboard" | "achievements";
}) {
  const t = useT();
  const ranked = loginAvailable(useAccount());
  const link = (href: string, Icon: LucideIcon, label: string, key: typeof active) => (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`flex min-h-11 items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:px-3 sm:text-base ${
        active === key ? "bg-brand-soft text-brand-dark" : "text-muted hover:bg-black/5 hover:text-ink"
      }`}
    >
      <Icon aria-hidden className="h-5 w-5 shrink-0" strokeWidth={2.25} />
      {/* Подписи — с широкого экрана: на планшете и складном телефоне пять пунктов с подписями в строку не помещаются. */}
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
  return (
    <header data-site-header className="no-print sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5">
        <Link href="/" className="mr-auto flex items-center gap-2.5 rounded-xl pr-2">
          <LogoMark size={46} />
          {/* На самых узких телефонах (320 px) название прячем: логотип остаётся, а кнопкам языка нужно место. */}
          <span className="leading-tight max-[359px]:sr-only">
            {/* Имя ссылки собирается из видимого текста: так голосовое управление находит её по надписи на экране. */}
            <span className="block text-[15px] font-black sm:text-lg">
              {BRAND}
              <span className="sr-only">{t(" — на главную", " — bosh sahifaga")}</span>
            </span>
            <span className="hidden text-xs font-bold text-muted lg:block">
              {t(BRAND_TAGLINE.ru, BRAND_TAGLINE.uz)}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex" aria-label={t("Разделы", "Boʻlimlar")}>
          {link("/chess", ChessKnight, t("Шахматы", "Shaxmat"), "chess")}
          {link("/my-problems", PencilLine, t("Мои задачи", "Masalalarim"), "problems")}
          {link("/achievements", Trophy, t("Успехи", "Yutuqlar"), "achievements")}
          {ranked && link("/leaderboard", BarChart3, t("Рейтинг", "Reyting"), "leaderboard")}
          {link("/parent", Lock, t("Родителям", "Ota-onalarga"), "parent")}
        </nav>
        {/* На телефоне нижнее меню — детское, поэтому вход для взрослых — маленький замок рядом с языком. */}
        <Link
          href="/parent"
          aria-label={t("Родителям", "Ota-onalarga")}
          data-parent-lock
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-lg text-muted hover:bg-black/5 sm:hidden"
        >
          <Lock aria-hidden className="h-5 w-5" strokeWidth={2.25} />
        </Link>
        <ThemeToggle />
        <ProfileSwitcher />
        <LangSwitch />
      </div>
    </header>
  );
}

export function SiteFooter() {
  const t = useT();
  const link =
    "inline-flex min-h-11 items-center gap-1 font-extrabold whitespace-nowrap underline underline-offset-4 hover:text-ink";
  return (
    <footer data-site-footer className="no-print mt-16 border-t border-line/70">
      {/*
       * Только три ссылки, одной строкой и на телефоне 360 px. Девиз и «где хранится прогресс» здесь были двумя абзацами
       * мелкого текста: на телефоне они занимали пол-экрана и разрывали строку ссылок. Они — на странице «О платформе»
       * (путь ученика и вопрос «Нужна ли регистрация?»).
       */}
      <nav
        aria-label={t("О сайте", "Sayt haqida")}
        className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 px-4 py-2 text-sm text-muted sm:gap-x-6"
      >
        <Link href="/about" data-about-link className={link}>
          {t("О платформе", "Platforma haqida")}
        </Link>
        <Link href="/privacy" data-privacy-link className={link}>
          {t("Приватность", "Maxfiylik")}
        </Link>
        <Link href="/parent" data-adults-link className={link}>
          <Icon icon={Lock} /> {t("Родителям", "Ota-onalarga")}
        </Link>
      </nav>
    </footer>
  );
}
