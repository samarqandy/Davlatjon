"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";
import { useT } from "@/lib/i18n";

/** Корни разделов: нижнее меню показываем только там, а внутри задач и партий оно не отвлекает. */
const ROOTS = ["/", "/chess", "/my-problems"];

/**
 * Нижнее меню на телефоне: три больших кнопки под большой палец («Главная», «Шахматы», «Мои задачи»).
 * Взрослым — ссылка «Для взрослых» внизу страницы, а не в шапке.
 */
export function BottomNav() {
  const path = usePathname().replace(/(.)\/$/, "$1");
  const t = useT();
  if (!ROOTS.includes(path)) return null;
  const tabs = [
    { href: "/", emoji: "🏠", label: t("Главная", "Bosh sahifa") },
    { href: "/chess", emoji: "♞", label: t("Шахматы", "Shaxmat") },
    { href: "/my-problems", emoji: "✍️", label: t("Мои задачи", "Masalalarim") },
  ];
  return (
    <>
      <div className="h-24 sm:hidden" aria-hidden />
      <nav
        data-bottom-nav
        aria-label={t("Нижнее меню", "Pastki menyu")}
        className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-3">
          {tabs.map((tab) => {
            const active = tab.href === path;
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center gap-0.5 text-sm font-extrabold transition",
                    active ? "text-brand-dark" : "text-muted",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn("rounded-2xl px-5 py-0.5 text-2xl leading-none", active && "bg-brand-soft")}
                  >
                    {tab.emoji}
                  </span>
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
