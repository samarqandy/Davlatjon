"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Chessboard, defaultPieces, type PieceRenderObject, type PositionDataType } from "react-chessboard";
import { cn } from "@/components/ui";
import { COORDS_MIN_WIDTH, classifyChange, coordLabels, snapshotOf, type Snapshot } from "@/lib/board";
import { boardThemeOf } from "@/lib/boardLook";
import { useT } from "@/lib/i18n";
import { playSfx, sfxUnlock } from "@/lib/sfx";
import { useStore } from "@/lib/store";

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
  bad: { backgroundColor: "rgba(239, 68, 68, 0.55)" },
  hint: { boxShadow: "inset 0 0 0 4px #10b981" },
  check: {
    background: "radial-gradient(circle, rgba(239, 68, 68, 0.9) 0%, rgba(239, 68, 68, 0.35) 55%, transparent 75%)",
  },
  last: { backgroundColor: "rgba(250, 204, 21, 0.4)" },
  attacked: { backgroundColor: "rgba(239, 68, 68, 0.28)" },
};

/** Отклонённый ход: клетка вспыхивает красным и вздрагивает. */
const REJECTED_STYLE: CSSProperties = {
  backgroundColor: "rgba(239, 68, 68, 0.65)",
  animation: "shake 0.35s ease-in-out",
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

export type PromotionPiece = "q" | "r" | "b" | "n";

/** Пешка дошла до края: доска показывает выбор фигуры на этой клетке. */
export interface PromotionRequest {
  square: string;
  color: "w" | "b";
  onPick: (piece: PromotionPiece) => void;
  onCancel: () => void;
}

/** Ключ позиции без очереди хода — чтобы звук не срабатывал на одинаковую расстановку. */
function positionKey(position: string | BoardPieces): string {
  if (typeof position === "string") return position.split(" ")[0];
  return Object.keys(position)
    .sort()
    .map((sq) => `${sq}${position[sq]}`)
    .join(",");
}

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
  orientation = "white",
  notation = "auto",
  frame = "wood",
  canDrag,
  sounds,
  rejectFeedback = true,
  promotion = null,
  className,
}: {
  id: string;
  position: string | BoardPieces;
  cols?: number;
  rows?: number;
  marks?: Record<string, SquareMark | undefined>;
  /** Нажатие на клетку. Вернуть false — «так нельзя»: клетка мигнёт и прозвучит сигнал. */
  onSquare?: (square: string) => boolean | void;
  onDrop?: (from: string, to: string) => boolean;
  draggable?: boolean;
  /** Какие фигуры можно тащить. По умолчанию — фигуры той стороны, чей ход (для FEN). */
  canDrag?: (square: string, piece: string) => boolean;
  /** Звуки ходов. По умолчанию — у больших досок (не у значков и печати). */
  sounds?: boolean;
  /** Мигать и звучать на отклонённый ход. */
  rejectFeedback?: boolean;
  /** Выбор фигуры для превращения пешки. */
  promotion?: PromotionRequest | null;
  arrows?: { from: string; to: string; color?: string }[];
  label?: string;
  /** Наибольшая ширина доски, px. */
  maxWidth?: number;
  /** Кто внизу: белые или чёрные. */
  orientation?: "white" | "black";
  /** Буквы и цифры на рамке. «auto» — везде, кроме маленьких значков в карточках. */
  notation?: boolean | "auto";
  /** Рамка: деревянная или тонкая для печати. */
  frame?: "wood" | "print";
  className?: string;
}) {
  const t = useT();
  const [rejected, setRejected] = useState<{ square: string; n: number } | null>(null);
  const rejectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragEnd = useRef<{ square: string; at: number } | null>(null);
  useEffect(() => () => void (rejectTimer.current && clearTimeout(rejectTimer.current)), []);

  const reject = (square: string) => {
    if (!rejectFeedback) return;
    playSfx("illegal");
    setRejected((r) => ({ square, n: (r?.n ?? 0) + 1 }));
    if (rejectTimer.current) clearTimeout(rejectTimer.current);
    rejectTimer.current = setTimeout(() => setRejected(null), 450);
  };
  const tapSquare = (square: string) => {
    if (onSquare?.(square) === false) reject(square);
  };

  // Звук хода: сравниваем новую расстановку с прошлой.
  const themeId = useStore((s) => s.settings.boardTheme);
  const theme = boardThemeOf(themeId);
  const key = positionKey(position);
  const withSound = sounds ?? (maxWidth >= 300 && frame !== "print");
  const seen = useRef<{ id: string; now: Snapshot; before: Snapshot | null } | null>(null);
  useEffect(() => {
    const next = snapshotOf(position, cols);
    const last = seen.current;
    seen.current = { id, now: next, before: last && last.id === id ? last.now : null };
    if (!last || last.id !== id || !withSound) return;
    const event = classifyChange(last.now, next, {
      fen: typeof position === "string" ? position : undefined,
      rows,
      cols,
      before: last.before,
    });
    if (!event) return;
    playSfx(event.kind);
    if (event.check) playSfx("check");
    // Только новая расстановка (key) и другая доска (id) — не каждая перерисовка.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, id]);

  const squareStyles: Record<string, CSSProperties> = {};
  for (const [sq, m] of Object.entries(marks)) if (m) squareStyles[sq] = MARK_STYLE[m];
  if (rejected) squareStyles[rejected.square] = { ...squareStyles[rejected.square], ...REJECTED_STYLE };
  const coords = notation === "auto" ? maxWidth >= COORDS_MIN_WIDTH : notation;
  const { files, ranks } = coordLabels(cols, rows, orientation);
  const turn = typeof position === "string" ? position.split(" ")[1] : undefined;
  const dragAllowed = (square: string, piece: string) => {
    if (piece === "star") return false;
    if (canDrag) return canDrag(square, piece);
    return !turn || piece[0] === turn;
  };
  return (
    <div
      className={cn(
        "board-frame mx-auto w-full touch-manipulation overflow-hidden select-none",
        frame === "print" ? "rounded-md bg-white ring-1 ring-black" : "rounded-xl shadow-card",
        className,
      )}
      style={{ maxWidth, backgroundColor: frame === "print" ? undefined : theme.frame }}
      data-board-theme={frame === "print" ? undefined : theme.id}
      role="group"
      aria-label={label ?? t("Шахматная доска", "Shaxmat taxtasi")}
      data-board={id}
      data-rejected={rejected ? rejected.square : undefined}
      onPointerDownCapture={sfxUnlock}
    >
      <div className="board-grid" data-frame={frame} data-coords-off={coords ? undefined : ""}>
        {coords && (
          <div
            className="board-ranks"
            data-coords="ranks"
            aria-hidden
            style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}
          >
            {ranks.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>
        )}
        <div className="board-cell">
          <Chessboard
            options={{
              id,
              position: typeof position === "string" ? position : toPosition(position),
              chessboardColumns: cols,
              chessboardRows: rows,
              boardOrientation: orientation,
              pieces: PIECES,
              squareStyles,
              allowDragging: draggable && !promotion,
              // Маленькое дрожание пальца — ещё нажатие, а не перетаскивание.
              dragActivationDistance: 8,
              canDragPiece: ({ piece, square }) => !!square && dragAllowed(square, piece.pieceType),
              allowDrawingArrows: false,
              // Пока выбирают фигуру для превращения, стрелки не мешают.
              arrows: promotion
                ? []
                : arrows.map((a) => ({ startSquare: a.from, endSquare: a.to, color: a.color ?? "#16a34a" })),
              animationDurationInMs: 180,
              showNotation: false,
              ...(frame === "print"
                ? {}
                : {
                    lightSquareStyle: { backgroundColor: theme.light },
                    darkSquareStyle: { backgroundColor: theme.dark },
                  }),
              onSquareClick: onSquare
                ? ({ square }) => {
                    // Щелчок мышью после «перетаскивания» на ту же клетку — уже учтён при начале перетаскивания.
                    const d = dragEnd.current;
                    dragEnd.current = null;
                    if (d && d.square === square && Date.now() - d.at < 400) return;
                    tapSquare(square);
                  }
                : undefined,
              // Взял фигуру — она выбрана, видны клетки, куда можно пойти.
              onPieceDrag: onSquare ? ({ square }) => void (square && tapSquare(square)) : undefined,
              onPieceDrop: ({ sourceSquare, targetSquare }) => {
                if (!targetSquare) return false;
                if (targetSquare === sourceSquare) {
                  dragEnd.current = { square: sourceSquare, at: Date.now() };
                  return false;
                }
                dragEnd.current = null;
                const ok = onDrop ? onDrop(sourceSquare, targetSquare) : false;
                if (!ok && onDrop) reject(targetSquare);
                return ok;
              },
            }}
          />
          {promotion && <PromotionPicker request={promotion} cols={cols} rows={rows} orientation={orientation} />}
        </div>
        {coords && (
          <div
            className="board-files"
            data-coords="files"
            aria-hidden
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {files.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const PROMOTION_PIECES: PromotionPiece[] = ["q", "r", "b", "n"];

/** Четыре фигуры столбиком от клетки превращения к центру доски. */
function PromotionPicker({
  request,
  cols,
  rows,
  orientation,
}: {
  request: PromotionRequest;
  cols: number;
  rows: number;
  orientation: "white" | "black";
}) {
  const t = useT();
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && request.onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [request]);
  const file = request.square.charCodeAt(0) - 97;
  const rank = Number(request.square.slice(1)) - 1;
  const col = orientation === "white" ? file : cols - 1 - file;
  const row = orientation === "white" ? rows - 1 - rank : rank;
  const down = row < rows / 2;
  const names: Record<PromotionPiece, string> = {
    q: t("Ферзь", "Farzin"),
    r: t("Ладья", "Rux"),
    b: t("Слон", "Fil"),
    n: t("Конь", "Ot"),
  };
  return (
    <div className="absolute inset-0 z-10" data-promotion={request.square}>
      <button
        type="button"
        aria-label={t("Отменить превращение", "Aylanishni bekor qilish")}
        className="absolute inset-0 bg-black/35"
        onClick={request.onCancel}
      />
      {PROMOTION_PIECES.map((p, i) => {
        const Svg = PIECES[`${request.color}${p.toUpperCase()}`];
        const r = down ? row + i : row - i;
        return (
          <button
            key={p}
            ref={i === 0 ? first : undefined}
            type="button"
            aria-label={names[p]}
            data-piece={p}
            onClick={() => request.onPick(p)}
            className={cn(
              "absolute grid place-items-center rounded-full bg-white shadow-lift outline-offset-2 hover:bg-sun-soft focus-visible:outline-3 focus-visible:outline-brand",
              i === 0 && "ring-4 ring-sun",
            )}
            style={{
              left: `${(col / cols) * 100}%`,
              top: `${(r / rows) * 100}%`,
              width: `${100 / cols}%`,
              height: `${100 / rows}%`,
            }}
          >
            <span className="block h-[88%] w-[88%]">{Svg ? <Svg /> : null}</span>
          </button>
        );
      })}
    </div>
  );
}
