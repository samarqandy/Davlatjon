"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/components/ui";

/**
 * Главное действие страницы — «Начать» или «Дальше» — в нижней части экрана, под большим пальцем.
 * На высоких телефонах кнопка в карточке «Следующий шаг» стояла в верхней трети экрана, куда палец
 * дотягивается хуже всего. Показывается на телефоне и планшете (до 1024 px); на широком экране главная
 * кнопка остаётся в карточке. На экране она одна: кнопку в карточке на тех же ширинах прячем.
 */
export function ContinueFab({
  label,
  name,
  href,
  onClick,
  aboveNav = false,
}: {
  /** Короткая подпись: «Начать» или «Дальше». */
  label: string;
  /** Полное название для экранного диктора: «Дальше: Шахматная партия». Начинается с подписи. */
  name: string;
  href?: string;
  onClick?: () => void;
  /** На странице есть нижнее меню (телефон): кнопка стоит над ним. */
  aboveNav?: boolean;
}) {
  const className = cn(
    "no-print fixed left-1/2 z-30 inline-flex min-h-14 -translate-x-1/2 items-center gap-2 rounded-2xl bg-sun px-8 text-lg font-black whitespace-nowrap text-on-sun shadow-[0_4px_0_0_#b45309,0_12px_28px_rgb(0_0_0/0.22)] transition active:translate-y-0.5 lg:hidden",
    aboveNav
      ? "bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] sm:bottom-[calc(env(safe-area-inset-bottom)+1rem)]"
      : "bottom-[calc(env(safe-area-inset-bottom)+1rem)]",
  );
  const inner = (
    <>
      <Play className="h-5 w-5 fill-current" aria-hidden />
      {label}
    </>
  );
  return href ? (
    <Link href={href} data-continue-fab aria-label={name} className={className}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} data-continue-fab aria-label={name} className={className}>
      {inner}
    </button>
  );
}
