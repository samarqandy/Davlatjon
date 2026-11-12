"use client";

import { cn } from "@/components/ui";
import { boardThemeOf, fenCells, isPieceSetId, pieceSrc } from "@/lib/boardLook";
import { useStore } from "@/lib/store";
import { PIECES } from "./PieceIcon";

const CODES = ["wK", "wQ", "wR", "wB", "wN", "wP", "bK", "bQ", "bR", "bB", "bN", "bP"];

/** Светлые клетки доски 8 × 8 одним контуром (левая верхняя клетка светлая). */
const LIGHT_SQUARES = Array.from({ length: 64 }, (_, i) => [i % 8, Math.floor(i / 8)])
  .filter(([x, y]) => (x + y) % 2 === 0)
  .map(([x, y]) => `M${x} ${y}h1v1h-1z`)
  .join("");

/** Набор фигур лежит картинками в public/pieces? Обычный набор — нет: он нарисован в коде. */
const fileSet = (id: string | undefined): id is string => isPieceSetId(id) && id !== "classic";

/**
 * Рисунки фигур обычного набора — один раз на страницу; доски-картинки ссылаются на них (`<use>`).
 * Ставится рядом со списком, в котором есть BoardThumb. Для наборов-картинок не нужен и ничего не рисует.
 */
export function PieceSprite() {
  const setId = useStore((s) => s.settings.pieceSet);
  if (fileSet(setId)) return null;
  return (
    <svg aria-hidden width="0" height="0" className="absolute" data-piece-sprite>
      {CODES.map((code) => {
        const Piece = PIECES[code];
        return (
          <symbol key={code} id={`piece-${code}`} viewBox="0 0 45 45">
            <Piece />
          </symbol>
        );
      })}
    </svg>
  );
}

/**
 * Доска-картинка для карточек в списках (дебюты, партии мастеров, главные моменты): только позиция, без ходов.
 *
 * Обычная доска (ChessBoard) умеет перетаскивание, клавиатуру, звуки и подписи фигур — и каждая стоит времени
 * при оживлении страницы: список из 18 дебютов с настоящими досками оживал на медленном телефоне 2,1 с
 * (страница с одной доской — 0,35 с). Здесь доска — один рисунок: фон, светлые клетки одним контуром и по одной
 * ссылке на каждую фигуру. Рисунки фигур обычного набора лежат на странице один раз (PieceSprite).
 *
 * Цвета и набор фигур — те же, что выбраны в «Моя доска». Для экранного диктора картинка скрыта: рядом с ней
 * всегда стоит название карточки, а сама карточка — кнопка или ссылка.
 */
export function BoardThumb({
  position,
  size,
  orientation = "white",
  className,
}: {
  position: string;
  /** Наибольшая сторона, px. */
  size: number;
  orientation?: "white" | "black";
  className?: string;
}) {
  const theme = boardThemeOf(useStore((s) => s.settings.boardTheme));
  const setId = useStore((s) => s.settings.pieceSet);
  const files = fileSet(setId) ? setId : null;
  const cells = fenCells(position);
  if (orientation === "black") cells.reverse();
  return (
    <div
      aria-hidden
      data-board-thumb
      className={cn("w-full shrink-0 self-start rounded-xl p-[5px] shadow-card", className)}
      style={{ maxWidth: size, backgroundColor: theme.frame }}
    >
      <svg viewBox="0 0 8 8" className="block w-full rounded-[3px]">
        <rect width="8" height="8" fill={theme.dark} />
        <path d={LIGHT_SQUARES} fill={theme.light} />
        {cells.map((code, i) => {
          if (!code) return null;
          const at = { x: i % 8, y: Math.floor(i / 8), width: 1, height: 1 };
          return files ? (
            <image key={i} href={pieceSrc(files, code)} {...at} data-piece={code} />
          ) : (
            <use key={i} href={`#piece-${code}`} {...at} data-piece={code} />
          );
        })}
      </svg>
    </div>
  );
}
