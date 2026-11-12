"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Chessboard, type PieceRenderObject, type PositionDataType } from "react-chessboard";
import { cn } from "@/components/ui";
import {
  COORDS_MIN_WIDTH,
  PIECE_WORDS,
  centerSquare,
  classifyChange,
  coordLabels,
  snapshotOf,
  stepSquare,
  type BoardKey,
  type Snapshot,
} from "@/lib/board";
import { boardThemeOf } from "@/lib/boardLook";
import { useLang, useT } from "@/lib/i18n";
import { playSfx, sfxUnlock } from "@/lib/sfx";
import { useStore } from "@/lib/store";
import { useMotionAllowed } from "@/lib/useMotion";
import { PieceIcon, piecesOf } from "./PieceIcon";

export { PieceIcon };

/** Как подсветить клетку. */
export type SquareMark =
  "selected" | "target" | "capture" | "mark" | "good" | "bad" | "hint" | "check" | "last" | "attacked";

const MARK_STYLE: Record<SquareMark, CSSProperties> = {
  selected: { boxShadow: "inset 0 0 0 4px #f59e0b", backgroundColor: "rgba(251, 191, 36, 0.45)" },
  target: { background: "radial-gradient(circle, rgba(79, 70, 229, 0.6) 25%, transparent 27%)" },
  capture: { background: "radial-gradient(circle, transparent 54%, rgba(79, 70, 229, 0.6) 56%)" },
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

/**
 * Перетаскивание. Пальцем: фигура крупнее и поднята над пальцем — иначе палец закрывает и её, и клетку, куда
 * её ставят; клетка под пальцем обведена широким кольцом, которое видно вокруг пальца. Мышью: фигура чуть
 * приподнята, клетка обведена рамкой. Так принято в шахматных приложениях; код свой.
 *
 * Сдвиг и увеличение стоят не здесь, а в globals.css, на рисунке внутри фигуры (`[data-drag]`): библиотека
 * ставит под указатель середину того, что измерила, и сдвиг самой фигуры сводит на нет.
 */
const DRAG_PIECE: CSSProperties = { transform: "none" };
const DROP_SQUARE = {
  touch: {
    boxShadow: "0 0 0 18px rgba(79, 70, 229, 0.32), inset 0 0 0 4px #4f46e5",
    position: "relative",
    zIndex: 2,
  },
  mouse: { boxShadow: "inset 0 0 0 4px #4f46e5" },
} as const satisfies Record<string, CSSProperties>;

/** Курсор клавиатуры: двойная рамка (синяя по краю, белая внутри) видна и на светлой, и на тёмной клетке. */
const CURSOR_SHADOW = "inset 0 0 0 3px #4f46e5, inset 0 0 0 6px #fff";

const BOARD_KEYS = new Set<string>([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);

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
  showTurn = true,
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
  /** Квадратик в углу рамки: □ — ходят белые, ■ — чёрные (как в шахматных книгах). Только для FEN 8 × 8. */
  showTurn?: boolean;
  className?: string;
}) {
  const t = useT();
  const lang = useLang();
  const motion = useMotionAllowed();
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

  // Клавиатура: рамка-курсор ходит стрелками, Enter или пробел — «нажать» на клетку. Так же, как пальцем:
  // у досок с onSquare — их собственная логика выбора, у досок только с перетаскиванием — «откуда», затем «куда».
  const interactive = !!onSquare || (draggable && !!onDrop);
  const [cursor, setCursor] = useState<string | null>(null);
  const [keyboard, setKeyboard] = useState(false);
  const [keyFrom, setKeyFrom] = useState<string | null>(null);
  const [said, setSaid] = useState("");
  const pointerAt = useRef(0);
  // Чем сейчас управляют доской: от этого зависит вид фигуры при перетаскивании.
  const [finger, setFinger] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Звук хода: сравниваем новую расстановку с прошлой.
  const themeId = useStore((s) => s.settings.boardTheme);
  const theme = boardThemeOf(themeId);
  // Набор фигур — тоже настройка устройства; на печати фигуры всегда классические (чёрно-белые диаграммы).
  const pieceSetId = useStore((s) => s.settings.pieceSet);
  const pieces = piecesOf(frame === "print" ? undefined : pieceSetId);
  const key = positionKey(position);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- key и есть расстановка
  const onBoard = useMemo(() => snapshotOf(position, cols), [key, cols]);
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

  // Фигуры библиотеки — каждая отдельная остановка Tab (32 на полной доске). Доска с клавиатуры — одна
  // остановка; фигуры убираем из порядка Tab (и после каждого хода — новые узлы). Библиотека даёт фигуре
  // роль кнопки без названия — подписываем её: «белый конь, g1».
  // useLayoutEffect, а не useEffect: подписи ставятся в том же шаге, что и фигуры. Иначе между появлением доски
  // и подписями есть окно (15–30 мс, на слабом телефоне до 150 мс), когда 16–32 кнопки стоят без названия.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const tidy = () =>
      frame.querySelectorAll('[aria-roledescription="draggable"]').forEach((el) => {
        if (el.hasAttribute("tabindex")) el.removeAttribute("tabindex");
        const square = el.closest('[id*="-square-"]')?.id.match(/-square-([a-z]\d+)$/)?.[1];
        // Какая это фигура, берём у самого узла (data-piece), а не из расстановки: пока идёт анимация хода
        // или сменилась задача, узел уже на доске, а расстановка в состоянии ещё прежняя — и фигура оставалась без имени.
        const code = el.querySelector("[data-piece]")?.getAttribute("data-piece") ?? (square ? onBoard[square] : "");
        const words = code ? PIECE_WORDS[code] : undefined;
        const name = words && square ? `${words[lang === "uz" ? 1 : 0]}, ${square}` : null;
        if (name && el.getAttribute("aria-label") !== name) el.setAttribute("aria-label", name);
      });
    tidy();
    const mo = new MutationObserver(tidy);
    mo.observe(frame, { subtree: true, childList: true, attributes: true, attributeFilter: ["tabindex"] });
    return () => mo.disconnect();
  }, [onBoard, lang]);

  const squareStyles: Record<string, CSSProperties> = {};
  for (const [sq, m] of Object.entries(marks)) if (m) squareStyles[sq] = MARK_STYLE[m];
  if (keyFrom) squareStyles[keyFrom] = { ...squareStyles[keyFrom], ...MARK_STYLE.selected };
  if (rejected) squareStyles[rejected.square] = { ...squareStyles[rejected.square], ...REJECTED_STYLE };
  if (keyboard && cursor) {
    const under = squareStyles[cursor]?.boxShadow;
    squareStyles[cursor] = {
      ...squareStyles[cursor],
      boxShadow: under ? `${CURSOR_SHADOW}, ${under}` : CURSOR_SHADOW,
    };
  }
  const coords = notation === "auto" ? maxWidth >= COORDS_MIN_WIDTH : notation;
  const { files, ranks } = coordLabels(cols, rows, orientation);
  // Левая нижняя клетка — в ней первая буква и последняя цифра; от неё цвета клеток чередуются. У обычной доски
  // она тёмная (a1 или h8); у доски с нечётной стороной, повёрнутой за чёрных, может оказаться светлой.
  const cornerDark = orientation === "white" || (cols + rows) % 2 === 0;
  // Подпись на клетке — цветом соседней: на угловой и «таких же» клетках и на остальных.
  const onCorner = cornerDark ? theme.light : theme.dark;
  const offCorner = cornerDark ? theme.dark : theme.light;
  const turn = typeof position === "string" ? position.split(" ")[1] : undefined;
  // Без обоих королей это учебная расстановка, а не позиция партии: «чей ход» там не важен.
  const placement = typeof position === "string" ? position.split(" ")[0] : "";
  const turnSide =
    showTurn && cols === 8 && rows === 8 && (turn === "w" || turn === "b") && /K/.test(placement) && /k/.test(placement)
      ? turn
      : null;
  const turnText = turnSide === "w" ? t("ходят белые", "oqlar yuradi") : t("ходят чёрные", "qoralar yuradi");
  const dragAllowed = (square: string, piece: string) => {
    if (piece === "star") return false;
    if (canDrag) return canDrag(square, piece);
    return !turn || piece[0] === turn;
  };

  const describe = (square: string, from: string | null = keyFrom) => {
    const words = PIECE_WORDS[onBoard[square]];
    const what = words ? (lang === "uz" ? words[1] : words[0]) : t("пусто", "boʻsh");
    const picked = from === square || marks[square] === "selected" ? t(", выбрана", ", tanlangan") : "";
    return `${square}, ${what}${picked}`;
  };
  const startSquare = () =>
    cursor ?? Object.keys(marks).find((sq) => marks[sq] === "selected") ?? centerSquare(cols, rows, orientation);
  const press = (square: string) => {
    if (onSquare) return tapSquare(square);
    if (!onDrop) return;
    if (!keyFrom) {
      const piece = onBoard[square];
      if (piece && dragAllowed(square, piece)) {
        setKeyFrom(square);
        setSaid(describe(square, square));
      } else reject(square);
      return;
    }
    setKeyFrom(null);
    if (keyFrom === square) return setSaid(describe(square, null));
    if (!onDrop(keyFrom, square)) reject(square);
  };
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!interactive || promotion || e.altKey || e.ctrlKey || e.metaKey) return;
    const here = startSquare();
    if (BOARD_KEYS.has(e.key)) {
      e.preventDefault();
      const next = stepSquare(here, e.key as BoardKey, cols, rows, orientation);
      setKeyboard(true);
      setCursor(next);
      setSaid(describe(next));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setKeyboard(true);
      setCursor(here);
      press(here);
    } else if (e.key === "Escape" && keyFrom) {
      setKeyFrom(null);
      setSaid(describe(here, null));
    }
  };
  return (
    <div
      className={cn(
        "board-frame mx-auto w-full touch-manipulation overflow-hidden select-none",
        frame === "print" ? "rounded-md bg-surface ring-1 ring-black" : "rounded-xl shadow-card",
        className,
      )}
      // Доска не выше экрана: на ноутбуке и в альбомной ориентации телефона она целиком видна вместе с заголовком.
      // На широком экране размер задаёт раскладка (.board-stage в globals.css): доска растёт до высоты окна.
      style={{
        maxWidth: frame === "print" ? maxWidth : `var(--board-size, min(${maxWidth}px, calc(100svh - 8rem)))`,
        backgroundColor: frame === "print" ? undefined : theme.frame,
      }}
      data-board-theme={frame === "print" ? undefined : theme.id}
      ref={frameRef}
      role={interactive ? "application" : "group"}
      aria-label={[label ?? t("Шахматная доска", "Shaxmat taxtasi"), turnSide && turnText].filter(Boolean).join(", ")}
      aria-describedby={interactive ? `${id}-keys` : undefined}
      tabIndex={interactive ? 0 : undefined}
      data-board={id}
      data-drag={finger ? "touch" : "mouse"}
      data-rejected={rejected ? rejected.square : undefined}
      data-cursor={keyboard && cursor ? cursor : undefined}
      onPointerDownCapture={(e) => {
        sfxUnlock();
        pointerAt.current = Date.now();
        setKeyboard(false);
        setFinger(e.pointerType === "touch");
      }}
      onKeyDown={interactive ? onKeyDown : undefined}
      onFocus={(e) => {
        // Пришли клавишей Tab, а не пальцем или мышью — сразу показываем курсор и называем клетку.
        if (!interactive || e.target !== e.currentTarget || Date.now() - pointerAt.current < 500) return;
        const here = startSquare();
        setKeyboard(true);
        setCursor(here);
        setSaid(describe(here));
      }}
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        setKeyboard(false);
        setKeyFrom(null);
      }}
    >
      {interactive && (
        <>
          <span id={`${id}-keys`} className="sr-only">
            {t("Стрелки — выбрать клетку, Enter — нажать на неё.", "Strelkalar — katakni tanlash, Enter — uni bosish.")}
          </span>
          <span className="sr-only" aria-live="polite" aria-atomic="true" data-board-said>
            {keyboard ? said : ""}
          </span>
        </>
      )}
      <div
        className="board-grid"
        data-frame={frame}
        data-coords-off={coords ? undefined : ""}
        // Цвета подписей внутри клеток (телефон, главная доска экрана): подпись на клетке — цветом соседней.
        style={
          {
            "--coord-file-odd": onCorner,
            "--coord-file-even": offCorner,
            "--coord-rank-odd": rows % 2 ? onCorner : offCorner,
            "--coord-rank-even": rows % 2 ? offCorner : onCorner,
          } as CSSProperties
        }
      >
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
              pieces,
              squareStyles,
              allowDragging: draggable && !promotion,
              // Маленькое дрожание пальца — ещё нажатие, а не перетаскивание.
              dragActivationDistance: 8,
              draggingPieceStyle: DRAG_PIECE,
              dropSquareStyle: finger ? DROP_SQUARE.touch : DROP_SQUARE.mouse,
              canDragPiece: ({ piece, square }) => !!square && dragAllowed(square, piece.pieceType),
              allowDrawingArrows: false,
              // Пока выбирают фигуру для превращения, стрелки не мешают.
              arrows: promotion
                ? []
                : arrows.map((a) => ({ startSquare: a.from, endSquare: a.to, color: a.color ?? "#16a34a" })),
              animationDurationInMs: 180,
              // Родитель выключил анимации или система просит меньше движения — фигура встаёт сразу.
              showAnimations: motion,
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
          {promotion && (
            <PromotionPicker request={promotion} cols={cols} rows={rows} orientation={orientation} pieces={pieces} />
          )}
        </div>
        {coords && turnSide && <span className="board-turn" data-turn={turnSide} title={turnText} aria-hidden />}
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
  pieces,
}: {
  request: PromotionRequest;
  cols: number;
  rows: number;
  orientation: "white" | "black";
  pieces: PieceRenderObject;
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
        const Svg = pieces[`${request.color}${p.toUpperCase()}`];
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
              "absolute grid place-items-center rounded-full bg-surface shadow-lift outline-offset-2 hover:bg-sun-soft focus-visible:outline-3 focus-visible:outline-brand",
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
