"use client";

import type { CSSProperties } from "react";
import { Chessboard, defaultPieces, type PieceRenderObject, type PositionDataType } from "react-chessboard";
import { cn } from "@/components/ui";

/** Как подсветить клетку. */
export type SquareMark =
  "selected" | "target" | "capture" | "mark" | "good" | "bad" | "hint" | "check" | "last" | "attacked";

const MARK_STYLE: Record<SquareMark, CSSProperties> = {
  selected: { boxShadow: "inset 0 0 0 4px #f59e0b", backgroundColor: "rgba(251, 191, 36, 0.45)" },
  target: { background: "radial-gradient(circle, rgba(79, 70, 229, 0.55) 19%, transparent 21%)" },
  capture: { background: "radial-gradient(circle, transparent 58%, rgba(79, 70, 229, 0.55) 60%)" },
  mark: {
    background: "radial-gradient(circle, rgba(124, 58, 237, 0.85) 22%, rgba(124, 58, 237, 0.18) 24%)",
  },
  good: { backgroundColor: "rgba(16, 185, 129, 0.55)" },
  bad: { backgroundColor: "rgba(245, 158, 11, 0.6)" },
  hint: { boxShadow: "inset 0 0 0 4px #10b981" },
  check: {
    background: "radial-gradient(circle, rgba(239, 68, 68, 0.9) 0%, rgba(239, 68, 68, 0.35) 55%, transparent 75%)",
  },
  last: { backgroundColor: "rgba(250, 204, 21, 0.4)" },
  attacked: { backgroundColor: "rgba(239, 68, 68, 0.28)" },
};

function StarPiece() {
  return (
    <svg viewBox="0 0 45 45" width="100%" height="100%" aria-hidden>
      <path
        d="M22.5 5 L27.4 16.3 L39.7 17.4 L30.4 25.5 L33.2 37.5 L22.5 31.2 L11.8 37.5 L14.6 25.5 L5.3 17.4 L17.6 16.3 Z"
        fill="#fbbf24"
        stroke="#b45309"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PIECES: PieceRenderObject = { ...defaultPieces, star: StarPiece };

/** Клетка → фигура: «wN», «bK», «star». */
export type BoardPieces = Record<string, string>;

export function toPosition(pieces: BoardPieces): PositionDataType {
  return Object.fromEntries(Object.entries(pieces).map(([sq, pieceType]) => [sq, { pieceType }]));
}

/** Картинка фигуры из набора доски — для заголовков и карточек. */
export function PieceIcon({ piece, className }: { piece: string; className?: string }) {
  const Svg = PIECES[piece];
  return <span className={cn("inline-block", className)}>{Svg ? <Svg /> : null}</span>;
}

/**
 * Шахматная доска на основе react-chessboard.
 * position — FEN (для доски 8 × 8) или набор фигур по клеткам (для любой доски).
 */
export function ChessBoard({
  id,
  position,
  cols = 8,
  rows = 8,
  marks = {},
  onSquare,
  onDrop,
  draggable = false,
  arrows = [],
  label,
  maxWidth = 440,
  className,
}: {
  id: string;
  position: string | BoardPieces;
  cols?: number;
  rows?: number;
  marks?: Record<string, SquareMark | undefined>;
  onSquare?: (square: string) => void;
  onDrop?: (from: string, to: string) => boolean;
  draggable?: boolean;
  arrows?: { from: string; to: string; color?: string }[];
  label?: string;
  /** Наибольшая ширина доски, px. */
  maxWidth?: number;
  className?: string;
}) {
  const squareStyles: Record<string, CSSProperties> = {};
  for (const [sq, m] of Object.entries(marks)) if (m) squareStyles[sq] = MARK_STYLE[m];
  return (
    <div
      className={cn(
        "mx-auto w-full touch-manipulation overflow-hidden rounded-xl border-[5px] border-[#7c5a33] bg-[#7c5a33] shadow-card select-none",
        className,
      )}
      style={{ maxWidth }}
      role="group"
      aria-label={label ?? "Шахматная доска"}
      data-board={id}
    >
      <Chessboard
        options={{
          id,
          position: typeof position === "string" ? position : toPosition(position),
          chessboardColumns: cols,
          chessboardRows: rows,
          pieces: PIECES,
          squareStyles,
          allowDragging: draggable,
          allowDrawingArrows: false,
          arrows: arrows.map((a) => ({ startSquare: a.from, endSquare: a.to, color: a.color ?? "#16a34a" })),
          animationDurationInMs: 180,
          showNotation: true,
          onSquareClick: onSquare ? ({ square }) => onSquare(square) : undefined,
          onPieceDrop: onDrop
            ? ({ sourceSquare, targetSquare }) => (targetSquare ? onDrop(sourceSquare, targetSquare) : false)
            : undefined,
        }}
      />
    </div>
  );
}
