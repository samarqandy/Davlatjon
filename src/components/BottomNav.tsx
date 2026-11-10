"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, PencilLine, ChessKnight, Trophy } from "lucide-react";
import { cn } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { plainPath } from "@/lib/lang";

/** Корни разделов: нижнее меню показываем только там, а внутри задач и партий оно не отвлекает. */
const ROOTS = ["/", "/chess", "/my-problems", "/achievements", "/leaderboard"];

/**
 * Нижнее меню на телефоне: четыре больших кнопки под большой палец («Главная», «Шахматы», «Мои задачи», «Успехи»).
 * Рейтинг — внутри «Успехов» (он есть, только когда подключён вход).
 * Взрослым — ссылка «Для взрослых» внизу страницы, а не в шапке.
 */
export function BottomNav() {
  // Без языка в адресе: при сборке сервер видит /ru/…, и без этого меню появлялось только в браузере.
  const path = plainPath(usePathname());
  const t = useT();
  if (!ROOTS.includes(path)) return null;
  const tabs = [
    { href: "/", Icon: House, label: t("Главная", "Bosh sahifa") },
    { href: "/chess", Icon: ChessKnight, label: t("Шахматы", "Shaxmat") },
    { href: "/my-problems", Icon: PencilLine, label: t("Мои задачи", "Masalalarim") },
    { href: "/achievements", Icon: Trophy, label: t("Успехи", "Yutuqlar") },
  ];
  return (
    <>
      <div className="h-24 sm:hidden" aria-hidden />
      <nav
        data-bottom-nav
        aria-label={t("Нижнее меню", "Pastki menyu")}
        className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
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
                  <span aria-hidden className={cn("rounded-2xl px-5 py-1", active && "bg-brand-soft")}>
                    <tab.Icon className="h-6 w-6" strokeWidth={2.25} />
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
