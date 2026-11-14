"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { BarButton, BarInfo, BoardBar } from "./BoardBar";
import { useT } from "@/lib/i18n";

/**
 * Просмотр ходов: в начало, назад, «Дальше», в конец и счётчик — одной панелью под доской (BoardBar).
 * Один и тот же ряд кнопок в разборе своей
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
  /** Свои кнопки экрана (BarButton) — например, «Смотреть»: встают перед счётчиком. */
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
    <BoardBar label={t("Просмотр ходов", "Yurishlarni koʻrish")} data-move-nav={ply}>
      <BarButton
        icon={ChevronsLeft}
        label={t("Начало", "Boshi")}
        name={t("В начало", "Boshiga")}
        onClick={() => onGo(0)}
        disabled={ply === 0}
      />
      <BarButton
        icon={ChevronLeft}
        label={t("Назад", "Orqaga")}
        name={t("Ход назад", "Bir yurish orqaga")}
        onClick={() => onGo(ply - 1)}
        disabled={ply === 0}
      />
      <BarButton
        icon={ChevronRight}
        label={t("Дальше", "Oldinga")}
        primary
        onClick={() => onGo(ply + 1)}
        disabled={ply === total}
      />
      <BarButton
        icon={ChevronsRight}
        label={t("Конец", "Oxiri")}
        name={t("В конец", "Oxiriga")}
        onClick={() => onGo(total)}
        disabled={ply === total}
      />
      {children}
      <BarInfo label={t(`Ход ${ply} из ${total}`, `${total} tadan ${ply}-yurish`)}>
        {/* Длинная партия (от 100 полуходов): счётчик в две строки, иначе «52 / 146» обрезает подписи кнопок. */}
        {total >= 100 ? (
          <>
            <span className="block text-center">{ply}</span>
            <span className="block text-center">/ {total}</span>
          </>
        ) : (
          <>
            {ply} / {total}
          </>
        )}
      </BarInfo>
    </BoardBar>
  );
}
