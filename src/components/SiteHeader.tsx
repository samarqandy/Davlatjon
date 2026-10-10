"use client";

import Link from "next/link";
import { useAccount } from "@/lib/account";
import { useT } from "@/lib/i18n";
import { BRAND, BRAND_TAGLINE } from "@/lib/brand";
import { LangSwitch } from "./LangSwitch";
import { ProfileSwitcher } from "./ProfileSwitcher";
import { LogoMark } from "./Logo";

export function SiteHeader({ active }: { active?: "home" | "chess" | "problems" | "parent" }) {
  const t = useT();
  const link = (href: string, emoji: string, label: string, key: typeof active) => (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`flex min-h-11 items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:px-3 sm:text-base ${
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
          aria-label={t(`${BRAND} — на главную`, `${BRAND} — bosh sahifaga`)}
        >
          <LogoMark size={46} />
          <span className="leading-tight">
            <span className="block text-[15px] font-black sm:text-lg">{BRAND}</span>
            <span className="hidden text-xs font-bold text-muted sm:block">
              {t(BRAND_TAGLINE.ru, BRAND_TAGLINE.uz)}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex" aria-label={t("Разделы", "Boʻlimlar")}>
          {link("/chess", "♞", t("Шахматы", "Shaxmat"), "chess")}
          {link("/my-problems", "✍️", t("Мои задачи", "Masalalarim"), "problems")}
          {link("/parent", "🔒", t("Родителям", "Ota-onalarga"), "parent")}
        </nav>
        {/* На телефоне нижнее меню — детское, поэтому вход для взрослых — маленький замок рядом с языком. */}
        <Link
          href="/parent"
          aria-label={t("Родителям", "Ota-onalarga")}
          data-parent-lock
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-lg text-muted hover:bg-black/5 sm:hidden"
        >
          <span aria-hidden>🔒</span>
        </Link>
        <ProfileSwitcher />
        <LangSwitch />
      </div>
    </header>
  );
}

export function SiteFooter() {
  const t = useT();
  const account = useAccount();
  return (
    <footer className="no-print mt-16 border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold">
          {t(
            "Любопытство → Мышление → Рассуждение → Открытие → Уверенность",
            "Qiziquvchanlik → Fikrlash → Mulohaza → Kashfiyot → Ishonch",
          )}
        </p>
        <p>
          {account.user
            ? t("Прогресс сохраняется в аккаунте.", "Natijalar hisobda saqlanadi.")
            : t(
                "Прогресс хранится в этом браузере. Чтобы он был на всех устройствах, родителю нужно войти в аккаунт.",
                "Natijalar shu brauzerda saqlanadi. Hamma qurilmada boʻlishi uchun ota-ona hisobga kirishi kerak.",
              )}
        </p>
        <nav aria-label={t("О сайте", "Sayt haqida")} className="flex flex-wrap gap-x-4 gap-y-1">
          <Link
            href="/about"
            data-about-link
            className="inline-flex min-h-11 items-center font-extrabold underline underline-offset-4 hover:text-ink"
          >
            {t("О платформе", "Platforma haqida")}
          </Link>
          <Link
            href="/privacy"
            data-privacy-link
            className="inline-flex min-h-11 items-center font-extrabold underline underline-offset-4 hover:text-ink"
          >
            {t("Конфиденциальность", "Maxfiylik")}
          </Link>
        </nav>
        <Link
          href="/parent"
          data-adults-link
          className="inline-flex min-h-11 items-center self-start font-extrabold text-muted underline underline-offset-4 hover:text-ink sm:self-auto"
        >
          🔒 {t("Для взрослых", "Kattalar uchun")}
        </Link>
      </div>
    </footer>
  );
}
