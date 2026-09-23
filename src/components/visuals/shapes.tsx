import { COLOR_HEX, COLOR_NAME_RU } from "@/content/meta";
import type { Cell, ShapeSpec } from "@/content/types";
import { bounds } from "@/lib/polyomino";

const SHAPE_NAME_RU: Record<ShapeSpec["shape"], string> = {
  circle: "круг",
  square: "квадрат",
  triangle: "треугольник",
  star: "звезда",
};

export function shapeLabel(s: ShapeSpec): string {
  return `${COLOR_NAME_RU[s.color]} ${SHAPE_NAME_RU[s.shape]}`;
}

export function ShapeIcon({ shape, size = 48 }: { shape: ShapeSpec; size?: number }) {
  const fill = COLOR_HEX[shape.color];
  const stroke = "#1d2140";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={shapeLabel(shape)}>
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
          <span className="h-4 text-[11px] leading-4 text-muted">{s ? COLOR_NAME_RU[s.color] : ""}</span>
        </div>
      ))}
    </div>
  );
}

/** Фигура из клеточек. */
export function PolyominoVisual({
  cells,
  size = 26,
  color = "#c7d2fe",
}: {
  cells: readonly Cell[];
  size?: number;
  color?: string;
}) {
  const { cols, rows } = bounds(cells);
  const pad = 2;
  return (
    <svg
      width={cols * size + pad * 2}
      height={rows * size + pad * 2}
      viewBox={`${-pad} ${-pad} ${cols * size + pad * 2} ${rows * size + pad * 2}`}
      role="img"
      aria-label={`Фигура из ${cells.length} клеточек`}
    >
      {cells.map(([c, r]) => (
        <rect
          key={`${c},${r}`}
          x={c * size}
          y={r * size}
          width={size}
          height={size}
          fill={color}
          stroke="#1d2140"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

export function GridFigureVisual({ cols, rows }: { cols: number; rows: number }) {
  const s = 56;
  return (
    <svg
      width={cols * s + 8}
      height={rows * s + 8}
      viewBox={`-4 -4 ${cols * s + 8} ${rows * s + 8}`}
      role="img"
      aria-label={`Прямоугольник ${cols} на ${rows} клеточки`}
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
      aria-label={`Треугольник, из вершины проведено линий: ${lines}`}
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
      aria-label={`Лесенки из кубиков: от 1 до ${count} ступенек`}
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
  const s = 44;
  const pad = 8;
  return (
    <svg
      width={cols * s + pad * 2}
      height={rows * s + pad * 2}
      viewBox={`0 0 ${cols * s + pad * 2} ${rows * s + pad * 2}`}
      role="img"
      aria-label={`Шоколадка ${rows} на ${cols} долек`}
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
      aria-label="Фигура из кубиков"
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
