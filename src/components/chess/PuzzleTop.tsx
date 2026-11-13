"use client";

import { X, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { setHash } from "@/lib/useHash";

/**
 * Верхняя строка экрана, на котором решают задачу.
 *
 * Телефон и планшет (до 1024 px): «закрыть», заголовок режима или его счёт и, если нужно, одна кнопка-меню —
 * всё в одну строку. Шапки и подвала сайта на таком экране нет (data-focus-screen): задание, доска, панель
 * кнопок и ответ помещаются на один экран, листать не нужно. Так устроены экраны задач у Lichess, Chess.com
 * и ChessKid: доска, одна строка состояния и один ряд кнопок.
 *
 * Широкий экран: ссылка «← Все задачи» и под ней заголовок — как раньше, в правой колонке у доски.
 */
export function PuzzleTop({ children, end }: { children?: ReactNode; end?: ReactNode }) {
  const t = useT();
  return (
    <div data-focus-screen data-puzzle-top className="flex items-center gap-1 lg:flex-col lg:items-stretch lg:gap-4">
      <button
        type="button"
        onClick={() => setHash("#all")}
        aria-label={t("Все задачи", "Barcha masalalar")}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl hover:bg-black/5 max-lg:-ml-2 lg:flex lg:h-auto lg:min-h-11 lg:w-auto lg:items-center lg:self-start lg:rounded-none lg:text-sm lg:font-extrabold lg:text-brand lg:hover:bg-transparent lg:hover:underline"
      >
        <X className="h-6 w-6 lg:hidden" strokeWidth={2.5} aria-hidden />
        <span className="max-lg:hidden">← {t("Все задачи", "Barcha masalalar")}</span>
      </button>
      <div className="min-w-0 flex-1">{children}</div>
      {end}
    </div>
  );
}

/**
 * Кнопка-меню в верхней строке: то, что нужно редко (сложность задач, рассказ о теме), открывается по нажатию
 * и не занимает место на экране задачи. Закрывается нажатием мимо, клавишей Esc или повторным нажатием.
 */
export function TopMenu({
  icon: Glyph,
  label,
  children,
  className,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <div ref={box} className={cn("relative shrink-0", className)} data-top-menu={open ? "open" : "closed"}>
      <button
        ref={button}
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "-mr-2 grid h-11 w-11 place-items-center rounded-xl hover:bg-black/5",
          open && "bg-brand-soft text-brand-dark",
        )}
      >
        <Glyph className="h-6 w-6" strokeWidth={2.25} aria-hidden />
      </button>
      {open && (
        <div className="absolute top-full right-0 z-30 mt-1 w-[min(22rem,calc(100vw-2rem))] space-y-2 rounded-2xl border border-line bg-surface p-3 text-left shadow-card">
          {children}
        </div>
      )}
    </div>
  );
}
