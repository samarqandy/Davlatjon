"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Button, Icon } from "@/components/ui";
import { useT } from "@/lib/i18n";

/**
 * Просмотр ходов: в начало, назад, «Дальше», в конец и счётчик. Один и тот же ряд кнопок в разборе своей
 * партии, в партиях мастеров и в дебютах. Стрелки клавиатуры ← и → делают то же, что «назад» и «Дальше»
 * (как на доске анализа), если ребёнок в это время не печатает и не ходит по доске с клавиатуры.
 */
export function MoveNav({
  ply,
  total,
  onGo,
  children,
}: {
  ply: number;
  total: number;
  onGo: (ply: number) => void;
  /** Свои кнопки экрана — например, «Смотреть»: встают перед счётчиком. */
  children?: ReactNode;
}) {
  const t = useT();
  const now = useRef({ ply, total, onGo });
  useEffect(() => {
    now.current = { ply, total, onGo };
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const at = e.target instanceof Element ? e.target : null;
      if (at?.closest("input, textarea, select, [contenteditable], [data-board], [role=slider]")) return;
      const { ply, total, onGo } = now.current;
      if (e.key === "ArrowLeft" && ply > 0) onGo(ply - 1);
      else if (e.key === "ArrowRight" && ply < total) onGo(ply + 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      role="group"
      aria-label={t("Просмотр ходов", "Yurishlarni koʻrish")}
      className="flex flex-wrap items-center gap-1.5"
      data-move-nav={ply}
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onGo(0)}
        disabled={ply === 0}
        aria-label={t("В начало", "Boshiga")}
      >
        <Icon icon={ChevronsLeft} />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onGo(ply - 1)}
        disabled={ply === 0}
        aria-label={t("Ход назад", "Bir yurish orqaga")}
      >
        <Icon icon={ChevronLeft} />
      </Button>
      <Button size="sm" onClick={() => onGo(ply + 1)} disabled={ply === total}>
        {t("Дальше", "Oldinga")} <Icon icon={ChevronRight} />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onGo(total)}
        disabled={ply === total}
        aria-label={t("В конец", "Oxiriga")}
      >
        <Icon icon={ChevronsRight} />
      </Button>
      {children}
      <span className="ml-auto text-sm font-extrabold text-muted tabular-nums">
        {ply} / {total}
      </span>
    </div>
  );
}
