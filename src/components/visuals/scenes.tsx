import { COLOR_HEX, COLOR_NAME_RU } from "@/content/meta";
import type { ColorName } from "@/content/types";

function HouseIcon({ color }: { color: string }) {
  return (
    <svg width="44" height="40" viewBox="0 0 44 40" aria-hidden>
      <polygon points="22,3 41,19 3,19" fill={color} stroke="#1d2140" strokeWidth="2" strokeLinejoin="round" />
      <rect x="8" y="19" width="28" height="18" fill={color} stroke="#1d2140" strokeWidth="2" />
      <rect x="18" y="25" width="8" height="12" fill="#fff" stroke="#1d2140" strokeWidth="1.5" />
    </svg>
  );
}

export function CardsVisual({ items }: { items: { emoji: string; label: string; color?: ColorName }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => {
        const color = item.color ? COLOR_HEX[item.color] : undefined;
        return (
          <div
            key={`${item.label}-${i}`}
            className="flex min-w-[5.5rem] flex-col items-center gap-1 rounded-2xl border-2 bg-white px-3 py-2"
            style={{ borderColor: color ? `${color}` : "var(--color-line)" }}
          >
            {item.emoji === "🏠" && color ? (
              <HouseIcon color={color} />
            ) : (
              <span className="text-4xl leading-none" aria-hidden>
                {item.emoji}
              </span>
            )}
            <span className="text-sm font-bold">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Наклон коромысла: тяжёлая чаша опускается. */
const TILT_DEG = 9;
const TILT_DY = 11;

function Scale({ left, right, tilt }: { left: string[]; right: string[]; tilt?: "left" | "right" }) {
  const w = 280;
  const dy = tilt === "left" ? TILT_DY : tilt === "right" ? -TILT_DY : 0;
  const pan = (cx: number, items: string[], shift: number) => (
    <g transform={`translate(0 ${shift})`}>
      <line x1={cx} y1={40} x2={cx - 38} y2={96} stroke="#6b7280" strokeWidth="1.5" />
      <line x1={cx} y1={40} x2={cx + 38} y2={96} stroke="#6b7280" strokeWidth="1.5" />
      <path d={`M ${cx - 50} 96 Q ${cx} 124 ${cx + 50} 96 Z`} fill="#e5e7eb" stroke="#374151" strokeWidth="2" />
      <text x={cx} y={92} textAnchor="middle" fontSize={items.length > 2 ? 24 : 28}>
        {items.join("")}
      </text>
    </g>
  );
  const label =
    tilt === "left"
      ? `Весы: ${left.join(" ")} тяжелее, чем ${right.join(" ")}`
      : tilt === "right"
        ? `Весы: ${right.join(" ")} тяжелее, чем ${left.join(" ")}`
        : `Весы: ${left.join(" ")} = ${right.join(" ")}`;
  return (
    <svg width={w} height={172} viewBox={`0 -8 ${w} 172`} role="img" aria-label={label}>
      <polygon points={`${w / 2 - 34},156 ${w / 2 + 34},156 ${w / 2},130`} fill="#9ca3af" />
      <rect x={w / 2 - 4} y={34} width={8} height={100} rx={3} fill="#6b7280" />
      <g transform={`rotate(${tilt === "left" ? -TILT_DEG : tilt === "right" ? TILT_DEG : 0} ${w / 2} 38)`}>
        <rect x={30} y={34} width={w - 60} height={8} rx={4} fill="#374151" />
      </g>
      <circle cx={w / 2} cy={38} r={7} fill="#f59e0b" stroke="#374151" strokeWidth="2" />
      {pan(48 + 22, left, dy)}
      {pan(w - 48 - 22, right, -dy)}
    </svg>
  );
}

export function BalanceVisual({ scales }: { scales: { left: string[]; right: string[]; tilt?: "left" | "right" }[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {scales.map((s, i) => (
        <div key={i} className="rounded-2xl border border-line bg-white p-2">
          <Scale {...s} />
        </div>
      ))}
    </div>
  );
}

function ShirtIcon({ color }: { color: string }) {
  return (
    <svg width="54" height="48" viewBox="0 0 54 48" aria-hidden>
      <path
        d="M18 4 L8 9 L2 20 L10 24 L13 19 L13 45 L41 45 L41 19 L44 24 L52 20 L46 9 L36 4 Q27 11 18 4 Z"
        fill={color}
        stroke="#1d2140"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PantsIcon({ color }: { color: string }) {
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" aria-hidden>
      <path
        d="M6 3 L38 3 L41 49 L26 49 L22 20 L18 49 L3 49 Z"
        fill={color}
        stroke="#1d2140"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OutfitsVisual({ shirts, pants }: { shirts: ColorName[]; pants: ColorName[] }) {
  const row = (title: string, colors: ColorName[], Icon: typeof ShirtIcon) => (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-20 text-sm font-extrabold text-muted">{title}</span>
      {colors.map((c) => (
        <div key={c} className="flex flex-col items-center rounded-2xl border border-line bg-white px-2 pt-2 pb-1">
          <Icon color={COLOR_HEX[c]} />
          <span className="text-xs font-bold text-muted">{COLOR_NAME_RU[c]}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div className="flex flex-col gap-3">
      {row("Футболки", shirts, ShirtIcon)}
      {row("Брюки", pants, PantsIcon)}
    </div>
  );
}

export function DecisionTreeVisual({
  first,
  second,
  boxes,
}: {
  first: string;
  second: string;
  boxes: [string, string, string, string];
}) {
  const W = 520;
  const node = (x: number, y: number, text: string, w = 190) => (
    <g>
      <rect x={x - w / 2} y={y - 23} width={w} height={46} rx={23} fill="#eef0ff" stroke="#4f46e5" strokeWidth="2" />
      <text x={x} y={y + 7} textAnchor="middle" fontSize="19" fontWeight="800" fill="#1d2140">
        {text}
      </text>
    </g>
  );
  const edge = (x1: number, y1: number, x2: number, y2: number, label: string) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4f46e5" strokeWidth="2.5" markerEnd="url(#dt-arrow)" />
      <rect x={(x1 + x2) / 2 - 22} y={(y1 + y2) / 2 - 13} width={44} height={24} rx={8} fill="#fff" stroke="#c7d2fe" />
      <text
        x={(x1 + x2) / 2}
        y={(y1 + y2) / 2 + 5}
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill={label === "Да" ? "#047857" : "#b91c1c"}
      >
        {label}
      </text>
    </g>
  );
  const leafX = [65, 195, 325, 455];
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} 300`}
      className="max-w-[520px]"
      role="img"
      aria-label={`Схема: ${first} Затем: ${second} Коробки ${boxes.join(", ")}`}
    >
      <defs>
        <marker
          id="dt-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
        </marker>
      </defs>
      {edge(W / 2 - 40, 50, 150, 112, "Да")}
      {edge(W / 2 + 40, 50, 370, 112, "Нет")}
      {edge(110, 158, leafX[0], 218, "Да")}
      {edge(190, 158, leafX[1], 218, "Нет")}
      {edge(330, 158, leafX[2], 218, "Да")}
      {edge(410, 158, leafX[3], 218, "Нет")}
      {node(W / 2, 30, first, 250)}
      {node(150, 136, second, 200)}
      {node(370, 136, second, 200)}
      {boxes.map((b, i) => (
        <g key={b}>
          <rect
            x={leafX[i] - 44}
            y={222}
            width={88}
            height={60}
            rx={10}
            fill="#fef3c7"
            stroke="#b45309"
            strokeWidth="2"
          />
          <text x={leafX[i]} y={246} textAnchor="middle" fontSize="15" fontWeight="700" fill="#92400e">
            Коробка
          </text>
          <text x={leafX[i]} y={273} textAnchor="middle" fontSize="25" fontWeight="900" fill="#1d2140">
            {b}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function CoordGridVisual({
  cols,
  rows,
  items,
  legend = true,
}: {
  cols: string[];
  rows: number;
  items: { cell: string; emoji: string; label: string }[];
  legend?: boolean;
}) {
  const s = 50;
  const offX = 30;
  const W = offX + cols.length * s + 6;
  const H = rows * s + 34;
  const pos = (cell: string) => {
    const col = cols.indexOf(cell[0]);
    const row = Number(cell.slice(1));
    return { x: offX + col * s, y: (rows - row) * s + 4 };
  };
  return (
    <div className="flex flex-wrap items-start gap-4">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Карта острова с клетками">
        <rect x={offX} y={4} width={cols.length * s} height={rows * s} rx={6} fill="#e0f2fe" />
        {Array.from({ length: rows }, (_, r) =>
          cols.map((_, c) => (
            <rect
              key={`${c}-${r}`}
              x={offX + c * s}
              y={4 + r * s}
              width={s}
              height={s}
              fill="#f0fdf4"
              stroke="#0f766e"
              strokeWidth="1.5"
            />
          )),
        )}
        {Array.from({ length: rows }, (_, r) => (
          <text
            key={r}
            x={offX - 12}
            y={4 + r * s + s / 2 + 6}
            textAnchor="middle"
            fontSize="17"
            fontWeight="800"
            fill="#1d2140"
          >
            {rows - r}
          </text>
        ))}
        {cols.map((c, i) => (
          <text
            key={c}
            x={offX + i * s + s / 2}
            y={rows * s + 26}
            textAnchor="middle"
            fontSize="17"
            fontWeight="800"
            fill="#1d2140"
          >
            {c}
          </text>
        ))}
        {items.map((it) => {
          const p = pos(it.cell);
          return (
            <text key={it.cell} x={p.x + s / 2} y={p.y + s / 2 + 10} textAnchor="middle" fontSize="28">
              {it.emoji}
            </text>
          );
        })}
      </svg>
      {legend && (
        <ul className="grid gap-1 text-sm">
          {items.map((it) => (
            <li key={it.cell} className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>
                {it.emoji}
              </span>
              <span className="font-semibold">— {it.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Округляем координаты: Math.cos/sin на сервере и в браузере могут отличаться в последних знаках. */
const r2 = (n: number) => Math.round(n * 100) / 100;

export function ClockVisual({ time, caption, mirror = false }: { time: string; caption?: string; mirror?: boolean }) {
  const [h, m] = time.split(":").map(Number);
  const r = 64;
  const c = 72;
  const minuteAngle = (m / 60) * 360;
  const hourAngle = (((h % 12) + m / 60) / 12) * 360;
  const hand = (angle: number, len: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x2: r2(c + Math.cos(rad) * len), y2: r2(c + Math.sin(rad) * len) };
  };
  return (
    <figure className="inline-flex flex-col items-center gap-1">
      <svg
        width={144}
        height={144}
        viewBox="0 0 144 144"
        role="img"
        aria-label={mirror ? "Часы, отражённые в зеркале" : `Часы показывают ${time}`}
      >
        <g transform={mirror ? "translate(144 0) scale(-1 1)" : undefined}>
          <circle cx={c} cy={c} r={r + 4} fill="#fff" stroke="#1d2140" strokeWidth="4" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = ((i + 1) * 30 - 90) * (Math.PI / 180);
            return (
              <text
                key={i}
                x={r2(c + Math.cos(a) * (r - 12))}
                y={r2(c + Math.sin(a) * (r - 12) + 5)}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill="#1d2140"
              >
                {i + 1}
              </text>
            );
          })}
          {Array.from({ length: 60 }, (_, i) => {
            const a = (i * 6 - 90) * (Math.PI / 180);
            const long = i % 5 === 0;
            return (
              <line
                key={i}
                x1={r2(c + Math.cos(a) * (r + 1))}
                y1={r2(c + Math.sin(a) * (r + 1))}
                x2={r2(c + Math.cos(a) * (r - (long ? 4 : 2)))}
                y2={r2(c + Math.sin(a) * (r - (long ? 4 : 2)))}
                stroke="#1d2140"
                strokeWidth={long ? 2 : 1}
              />
            );
          })}
          <line x1={c} y1={c} {...hand(hourAngle, 34)} stroke="#1d2140" strokeWidth="6" strokeLinecap="round" />
          <line x1={c} y1={c} {...hand(minuteAngle, 52)} stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
          <circle cx={c} cy={c} r={5} fill="#1d2140" />
        </g>
      </svg>
      {caption && <figcaption className="text-sm font-bold text-muted">{caption}</figcaption>}
    </figure>
  );
}

export function PoleVisual({ height, emoji }: { height: number; emoji: string }) {
  const step = 30;
  const top = 18;
  const H = top + height * step + 22;
  return (
    <svg width={150} height={H} viewBox={`0 0 150 ${H}`} role="img" aria-label={`Столб высотой ${height} метров`}>
      <rect x={60} y={top} width={16} height={height * step} rx={4} fill="#d6b48a" stroke="#7c5a33" strokeWidth="2" />
      {Array.from({ length: height + 1 }, (_, i) => {
        const y = top + (height - i) * step;
        return (
          <g key={i}>
            <line x1={54} y1={y} x2={82} y2={y} stroke="#7c5a33" strokeWidth="2" />
            <text x={46} y={y + 5} textAnchor="end" fontSize="14" fontWeight="800" fill="#1d2140">
              {i} м
            </text>
          </g>
        );
      })}
      <text x={96} y={top + height * step + 4} fontSize="26">
        {emoji}
      </text>
      <text x={96} y={top + 8} fontSize="20">
        🏁
      </text>
    </svg>
  );
}

const CALC_KEYS = ["7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", "(", ")", "="];

export function CalculatorVisual({ broken, target }: { broken: string[]; target?: number }) {
  return (
    <div className="inline-block rounded-3xl bg-[#1f2937] p-3 shadow-card">
      {target !== undefined && (
        <p className="mb-2 text-center text-sm font-extrabold text-[#fde68a]">Нужно получить: {target}</p>
      )}
      <div className="mb-2 rounded-xl bg-[#d9f99d] px-3 py-2 text-right font-mono text-2xl font-bold text-[#1a2e05]">
        0
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {CALC_KEYS.map((k) => {
          const isBroken = broken.includes(k);
          return (
            <span
              key={k}
              className={`relative flex h-9 w-11 items-center justify-center rounded-lg text-lg font-bold ${
                isBroken ? "bg-[#4b5563] text-[#9ca3af]" : "bg-[#f3f4f6] text-[#111827]"
              }`}
            >
              {k}
              {isBroken && (
                <span
                  className="absolute inset-0 flex items-center justify-center text-2xl font-black text-[#ef4444]"
                  aria-label="кнопка сломана"
                >
                  ✕
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
