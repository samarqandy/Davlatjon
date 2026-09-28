"use client";

import { COLOR_HEX, colorName } from "@/content/meta";
import type { Cell, ShapeSpec } from "@/content/types";
import { useLang, useT, type Lang } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { bounds } from "@/lib/polyomino";

const SHAPE_NAME: Record<Lang, Record<ShapeSpec["shape"], string>> = {
  ru: { circle: "круг", square: "квадрат", triangle: "треугольник", star: "звезда" },
  uz: { circle: "doira", square: "kvadrat", triangle: "uchburchak", star: "yulduz" },
};

/** «красный круг» / «qizil doira». */
export function shapeLabel(s: ShapeSpec, lang: Lang = "ru"): string {
  return `${colorName(s.color, lang)} ${SHAPE_NAME[lang][s.shape]}`;
}

export function ShapeIcon({ shape, size = 48 }: { shape: ShapeSpec; size?: number }) {
  const lang = useLang();
  const fill = COLOR_HEX[shape.color];
  const stroke = "#1d2140";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={shapeLabel(shape, lang)}>
      {shape.shape === "circle" && <circle cx="24" cy="24" r="18" fill={fill} stroke={stroke} strokeWidth="2" />}
      {shape.shape === "square" && (
        <rect x="7" y="7" width="34" height="34" rx="3" fill={fill} stroke={stroke} strokeWidth="2" />
      )}
      {shape.shape === "triangle" && (
        <polygon points="24,5 44,41 4,41" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      )}
      {shape.shape === "star" && (
        <polygon
          points="24,4 29.5,17.5 44,18.5 33,28 36.5,42.5 24,34.5 11.5,42.5 15,28 4,18.5 18.5,17.5"
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function ShapesVisual({ items, print }: { items: (ShapeSpec | null)[]; print?: boolean }) {
  const lang = useLang();
  return (
    <div className="flex flex-wrap items-end gap-2">
      {items.map((s, i) => (
        <div key={i} className="flex w-16 flex-col items-center gap-1">
          <span className="text-xs font-bold text-muted">{i + 1}</span>
          {s ? (
            <ShapeIcon shape={s} size={52} />
          ) : (
            <span
              className={
                print
                  ? "flex h-[52px] w-[52px] items-center justify-center rounded-lg border-2 border-ink/60"
                  : "flex h-[52px] w-[52px] items-center justify-center rounded-lg border-2 border-dashed border-brand/60 bg-brand-soft text-2xl font-extrabold text-brand"
              }
            >
              {print ? "" : "?"}
            </span>
          )}
          <span className="h-4 text-[11px] leading-4 text-muted">{s ? colorName(s.color, lang) : ""}</span>
        </div>
      ))}
    </div>
  );
}

/** Фигура из клеточек; labels — надписи в клетках (в том же порядке, что cells). */
export function PolyominoVisual({
  cells,
  labels,
  size = 26,
  color = "#c7d2fe",
}: {
  cells: readonly Cell[];
  labels?: readonly string[];
  size?: number;
  color?: string;
}) {
  const t = useT();
  const { cols, rows } = bounds(cells);
  const pad = 2;
  return (
    <svg
      width={cols * size + pad * 2}
      height={rows * size + pad * 2}
      viewBox={`${-pad} ${-pad} ${cols * size + pad * 2} ${rows * size + pad * 2}`}
      role="img"
      aria-label={
        labels
          ? t(
              `Фигура из ${cells.length} клеточек с числами ${labels.join(", ")}`,
              `${cells.length} ta katakdan iborat shakl, ichidagi sonlar: ${labels.join(", ")}`,
            )
          : t(`Фигура из ${cells.length} клеточек`, `${cells.length} ta katakdan iborat shakl`)
      }
    >
      {cells.map(([c, r], i) => (
        <g key={`${c},${r}`}>
          <rect x={c * size} y={r * size} width={size} height={size} fill={color} stroke="#1d2140" strokeWidth="2" />
          {labels?.[i] && (
            <text
              x={c * size + size / 2}
              y={r * size + size / 2 + size * 0.19}
              textAnchor="middle"
              fontSize={size * 0.55}
              fontWeight="900"
              fill="#1d2140"
            >
              {labels[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/** Прямоугольники из точек — «точечные» числа. */
export function DotsVisual({ figures }: { figures: { cols: number; rows: number }[] }) {
  const t = useT();
  const gap = 18;
  const pad = 6;
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
      {figures.map((f, i) => {
        const w = (f.cols - 1) * gap + pad * 2 + 12;
        const h = (f.rows - 1) * gap + pad * 2 + 12;
        return (
          <figure key={i} className="flex flex-col items-center gap-1">
            <svg
              width={w}
              height={h}
              viewBox={`0 0 ${w} ${h}`}
              role="img"
              aria-label={t(`Фигура ${i + 1} из точек`, `Nuqtalardan tuzilgan ${i + 1}-shakl`)}
            >
              {Array.from({ length: f.rows }, (_, r) =>
                Array.from({ length: f.cols }, (_, c) => (
                  <circle
                    key={`${c}-${r}`}
                    cx={pad + 6 + c * gap}
                    cy={pad + 6 + r * gap}
                    r={6}
                    fill="#6366f1"
                    stroke="#312e81"
                    strokeWidth="1.5"
                  />
                )),
              )}
            </svg>
            <figcaption className="text-sm font-extrabold text-muted">{i + 1}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}

type Point = readonly [number, number];

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Спичка: палочка с красной головкой, чуть короче отрезка — чтобы спички не сливались. */
function Match({ a, b }: { a: Point; b: Point }) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const cut = 3.5 / len;
  const x1 = r2(a[0] + dx * cut);
  const y1 = r2(a[1] + dy * cut);
  const x2 = r2(b[0] - dx * cut);
  const y2 = r2(b[1] - dy * cut);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4a15a" strokeWidth="5" strokeLinecap="round" />
      <circle cx={x2} cy={y2} r={4.2} fill="#dc2626" />
    </g>
  );
}

/** Отрезки дорожки из n квадратов или n треугольников. */
function matchSegments(shape: "squares" | "triangles", n: number, unit: number): [Point, Point][] {
  if (shape === "squares") {
    const segs: [Point, Point][] = [];
    for (let i = 0; i < n; i++) {
      segs.push([
        [i * unit, 0],
        [(i + 1) * unit, 0],
      ]);
      segs.push([
        [i * unit, unit],
        [(i + 1) * unit, unit],
      ]);
    }
    for (let i = 0; i <= n; i++)
      segs.push([
        [i * unit, 0],
        [i * unit, unit],
      ]);
    return segs;
  }
  // Треугольники: вершины внизу — (k·unit, h), вверху — (k·unit + unit/2, 0).
  const h = r2(unit * 0.866);
  const bottom = (k: number): Point => [k * unit, h];
  const top = (k: number): Point => [k * unit + unit / 2, 0];
  const seen = new Map<string, [Point, Point]>();
  const add = (a: Point, b: Point) => {
    const key = [a.join(","), b.join(",")].sort().join("|");
    if (!seen.has(key)) seen.set(key, [a, b]);
  };
  for (let j = 0; j < n; j++) {
    const k = Math.floor(j / 2);
    if (j % 2 === 0) {
      add(bottom(k), bottom(k + 1));
      add(bottom(k), top(k));
      add(top(k), bottom(k + 1));
    } else {
      add(top(k), top(k + 1));
      add(top(k), bottom(k + 1));
      add(bottom(k + 1), top(k + 1));
    }
  }
  return [...seen.values()];
}

/** Дорожки из спичек: квадраты или треугольники в ряд. */
export function MatchesVisual({ shape, figures }: { shape: "squares" | "triangles"; figures: number[] }) {
  const t = useT();
  const unit = shape === "squares" ? 42 : 46;
  const pad = 8;
  return (
    <div className="flex flex-wrap items-end gap-x-7 gap-y-3">
      {figures.map((n) => {
        const segs = matchSegments(shape, n, unit);
        const xs = segs.flatMap(([a, b]) => [a[0], b[0]]);
        const ys = segs.flatMap(([a, b]) => [a[1], b[1]]);
        const w = Math.max(...xs) + pad * 2;
        const h = Math.max(...ys) + pad * 2;
        return (
          <figure key={n} className="flex flex-col items-center gap-1">
            <svg
              width={w}
              height={h}
              viewBox={`${-pad} ${-pad} ${w} ${h}`}
              role="img"
              aria-label={t(
                `Дорожка из спичек: ${
                  shape === "squares"
                    ? pluralize(n, "квадрат", "квадрата", "квадратов")
                    : pluralize(n, "треугольник", "треугольника", "треугольников")
                }`,
                `Gugurt choʻplaridan yoʻlak: ${n} ta ${shape === "squares" ? "kvadrat" : "uchburchak"}`,
              )}
            >
              {segs.map(([a, b], i) => (
                <Match key={i} a={a} b={b} />
              ))}
            </svg>
            <figcaption className="text-sm font-extrabold text-muted">{n}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}

export function GridFigureVisual({ cols, rows }: { cols: number; rows: number }) {
  const t = useT();
  const s = 56;
  return (
    <svg
      width={cols * s + 8}
      height={rows * s + 8}
      viewBox={`-4 -4 ${cols * s + 8} ${rows * s + 8}`}
      role="img"
      aria-label={t(`Прямоугольник ${cols} на ${rows} клеточки`, `${cols}×${rows} katakli toʻgʻri toʻrtburchak`)}
    >
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${c}-${r}`}
            x={c * s}
            y={r * s}
            width={s}
            height={s}
            fill="#fff"
            stroke="#1d2140"
            strokeWidth="3"
          />
        )),
      )}
    </svg>
  );
}

export function TriangleFanVisual({ lines }: { lines: number }) {
  const t = useT();
  const w = 260;
  const h = 200;
  const apex = { x: w / 2, y: 12 };
  const left = { x: 12, y: h - 12 };
  const right = { x: w - 12, y: h - 12 };
  const parts = lines + 1;
  const feet = Array.from({ length: lines }, (_, i) => left.x + ((right.x - left.x) * (i + 1)) / parts);
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={t(
        `Треугольник, из вершины проведено линий: ${lines}`,
        `Uchburchak, uchidan ${lines} ta chiziq oʻtkazilgan`,
      )}
    >
      <polygon
        points={`${apex.x},${apex.y} ${left.x},${left.y} ${right.x},${right.y}`}
        fill="#fff7e6"
        stroke="#1d2140"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {feet.map((x) => (
        <line key={x} x1={apex.x} y1={apex.y} x2={x} y2={left.y} stroke="#1d2140" strokeWidth="3" />
      ))}
    </svg>
  );
}

export function StaircasesVisual({ count }: { count: number }) {
  const t = useT();
  const s = 16;
  const gap = 26;
  const widths = Array.from({ length: count }, (_, i) => (i + 1) * s);
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * (count - 1) + 4;
  const maxH = count * s;
  let x = 2;
  return (
    <svg
      width={totalW}
      height={maxH + 30}
      viewBox={`0 0 ${totalW} ${maxH + 30}`}
      role="img"
      aria-label={t(
        `Лесенки из кубиков: от 1 до ${count} ступенек`,
        `Kubiklardan yasalgan zinalar: 1 dan ${count} gacha pogʻona`,
      )}
    >
      {widths.map((wdt, i) => {
        const n = i + 1;
        const x0 = x;
        x += wdt + gap;
        return (
          <g key={n}>
            {Array.from({ length: n }, (_, col) =>
              Array.from({ length: col + 1 }, (_, k) => (
                <rect
                  key={`${col}-${k}`}
                  x={x0 + col * s}
                  y={maxH - (k + 1) * s + 2}
                  width={s}
                  height={s}
                  fill="#fde68a"
                  stroke="#92400e"
                  strokeWidth="1.5"
                />
              )),
            )}
            <text x={x0 + wdt / 2} y={maxH + 22} textAnchor="middle" fontSize="15" fontWeight="800" fill="#1d2140">
              {n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ChocolateVisual({ cols, rows }: { cols: number; rows: number }) {
  const t = useT();
  const s = 44;
  const pad = 8;
  return (
    <svg
      width={cols * s + pad * 2}
      height={rows * s + pad * 2}
      viewBox={`0 0 ${cols * s + pad * 2} ${rows * s + pad * 2}`}
      role="img"
      aria-label={t(`Шоколадка ${rows} на ${cols} долек`, `${rows}×${cols} boʻlakli shokolad`)}
    >
      <rect x="0" y="0" width={cols * s + pad * 2} height={rows * s + pad * 2} rx="10" fill="#5b3a29" />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <g key={`${c}-${r}`}>
            <rect
              x={pad + c * s + 2}
              y={pad + r * s + 2}
              width={s - 4}
              height={s - 4}
              rx="5"
              fill="#7b4a33"
              stroke="#3f261a"
              strokeWidth="1.5"
            />
            <rect x={pad + c * s + 7} y={pad + r * s + 7} width={s - 14} height={s - 14} rx="3" fill="#8d5a3f" />
          </g>
        )),
      )}
    </svg>
  );
}

/** Фигура из кубиков в изометрии. heights[ряд][столбец], ряд 0 — дальний. */
export function IsoCubesVisual({ heights }: { heights: number[][] }) {
  const t = useT();
  const s = 46;
  // √3/2 и 1/2 записаны явно: Math.cos/sin могут давать разные последние знаки на сервере и в браузере.
  const cx = 0.8660254 * s;
  const cy = 0.5 * s;
  const round = (n: number) => Math.round(n * 100) / 100;
  const P = (x: number, y: number, z: number) => [round((x - y) * cx), round((x + y) * cy - z * s)] as const;
  const cubes: { x: number; y: number; z: number }[] = [];
  heights.forEach((row, y) => row.forEach((h, x) => Array.from({ length: h }, (_, z) => cubes.push({ x, y, z }))));
  cubes.sort((a, b) => a.x + a.y + a.z - (b.x + b.y + b.z) || a.z - b.z);
  const pts = cubes.flatMap(({ x, y, z }) =>
    [0, 1].flatMap((dx) => [0, 1].flatMap((dy) => [0, 1].map((dz) => P(x + dx, y + dy, z + dz)))),
  );
  const minX = Math.min(...pts.map((p) => p[0])) - 4;
  const maxX = Math.max(...pts.map((p) => p[0])) + 4;
  const minY = Math.min(...pts.map((p) => p[1])) - 4;
  const maxY = Math.max(...pts.map((p) => p[1])) + 4;
  const poly = (corners: (readonly [number, number])[]) => corners.map((p) => p.join(",")).join(" ");
  return (
    <svg
      width={maxX - minX}
      height={maxY - minY}
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      role="img"
      aria-label={t("Фигура из кубиков", "Kubiklardan yasalgan shakl")}
    >
      {cubes.map(({ x, y, z }) => (
        <g key={`${x}-${y}-${z}`} stroke="#312e81" strokeWidth="2" strokeLinejoin="round">
          <polygon
            points={poly([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)])}
            fill="#e0e7ff"
          />
          <polygon
            points={poly([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)])}
            fill="#a5b4fc"
          />
          <polygon
            points={poly([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)])}
            fill="#818cf8"
          />
        </g>
      ))}
    </svg>
  );
}
