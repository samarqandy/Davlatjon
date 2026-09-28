"use client";

import { COLOR_HEX } from "@/content/meta";
import type { Cell, ColorName } from "@/content/types";
import { useT } from "@/lib/i18n";

/** Реплики персонажей: значок, имя и «облачко» с тем, что сказано. */
export function SpeechVisual({ items }: { items: { emoji: string; name: string; text: string }[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it.name} className="flex items-start gap-3">
          <span className="flex w-16 shrink-0 flex-col items-center">
            <span className="text-4xl leading-none" aria-hidden>
              {it.emoji}
            </span>
            <span className="mt-1 text-xs font-extrabold text-muted">{it.name}</span>
          </span>
          <span className="relative rounded-2xl border-2 border-line bg-white px-4 py-2.5 font-bold">
            <span
              className="absolute top-4 -left-[7px] h-3 w-3 rotate-45 border-b-2 border-l-2 border-line bg-white"
              aria-hidden
            />
            «{it.text}»
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Таблица кода: знак сверху, код снизу. */
export function CodeTableVisual({ pairs }: { pairs: [string, string][] }) {
  const t = useT();
  return (
    <div className="flex flex-wrap gap-1" role="table" aria-label={t("Таблица кода", "Kod jadvali")}>
      {pairs.map(([sign, code]) => (
        <div
          key={sign}
          role="row"
          className="flex w-9 flex-col overflow-hidden rounded-lg border border-line bg-white text-center"
        >
          <span role="cell" className="bg-brand-soft py-0.5 text-base font-black text-brand-dark">
            {sign}
          </span>
          <span role="cell" className="tabular py-0.5 text-sm font-bold">
            {code}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Фигуры из отрезков — задача «нарисуй одним росчерком». */
export function StrokesVisual({
  figures,
}: {
  figures: { label: string; points: [number, number][]; lines: [number, number][] }[];
}) {
  const t = useT();
  const size = 120;
  const pad = 10;
  const k = (size - pad * 2) / 100;
  return (
    <div className="flex flex-wrap gap-4">
      {figures.map((f) => (
        <figure key={f.label} className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-white p-2">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label={t(
              `Фигура ${f.label}: ${f.lines.length} линий`,
              `«${f.label}» shakl: ${f.lines.length} ta chiziq`,
            )}
          >
            {f.lines.map(([a, b], i) => (
              <line
                key={i}
                x1={pad + f.points[a][0] * k}
                y1={pad + f.points[a][1] * k}
                x2={pad + f.points[b][0] * k}
                y2={pad + f.points[b][1] * k}
                stroke="#1d2140"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
            {f.points.map(([x, y], i) => (
              <circle key={i} cx={pad + x * k} cy={pad + y * k} r={4} fill="#4f46e5" />
            ))}
          </svg>
          <figcaption className="text-base font-black text-muted">{f.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Шахматная доска: клетки в шахматном порядке и фигуры-значки. */
export function ChessboardVisual({
  cols,
  rows,
  pieces,
}: {
  cols: number;
  rows: number;
  pieces: { cell: Cell; emoji: string }[];
}) {
  const t = useT();
  const s = 52;
  return (
    <svg
      width={cols * s + 6}
      height={rows * s + 6}
      viewBox={`-3 -3 ${cols * s + 6} ${rows * s + 6}`}
      role="img"
      aria-label={t(`Доска ${cols} на ${rows} клетки`, `${cols}×${rows} katakli taxta`)}
    >
      <rect x={-3} y={-3} width={cols * s + 6} height={rows * s + 6} rx={6} fill="#7c5a33" />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${c}-${r}`}
            x={c * s}
            y={r * s}
            width={s}
            height={s}
            fill={(c + r) % 2 === 0 ? "#f0d9b5" : "#b58863"}
          />
        )),
      )}
      {pieces.map((p) => (
        <text
          key={`${p.cell[0]}-${p.cell[1]}`}
          x={p.cell[0] * s + s / 2}
          y={p.cell[1] * s + s / 2 + 12}
          textAnchor="middle"
          fontSize="34"
        >
          {p.emoji}
        </text>
      ))}
    </svg>
  );
}

/** Клетчатое поле с цветными прямоугольниками; там, где они перекрываются, цвета смешиваются. */
export function CellGridVisual({
  cols,
  rows,
  rects,
}: {
  cols: number;
  rows: number;
  rects: { col: number; row: number; w: number; h: number; color: ColorName }[];
}) {
  const t = useT();
  const s = 40;
  return (
    <svg
      width={cols * s + 6}
      height={rows * s + 6}
      viewBox={`-3 -3 ${cols * s + 6} ${rows * s + 6}`}
      role="img"
      aria-label={t(
        `Клетчатое поле ${cols} на ${rows} с ${rects.length} прямоугольниками`,
        `${cols}×${rows} katakli maydon, unda ${rects.length} ta toʻgʻri toʻrtburchak`,
      )}
    >
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r.col * s}
          y={r.row * s}
          width={r.w * s}
          height={r.h * s}
          fill={COLOR_HEX[r.color]}
          fillOpacity="0.45"
          stroke={COLOR_HEX[r.color]}
          strokeWidth="3"
        />
      ))}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${c}-${r}`}
            x={c * s}
            y={r * s}
            width={s}
            height={s}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1"
          />
        )),
      )}
    </svg>
  );
}
