"use client";

import { useRef, useState, type MouseEvent } from "react";
import { Button, cn } from "@/components/ui";
import type { VennRegion } from "@/content/types";
import { askExplain, praise, retrySub } from "@/lib/feedback";
import { recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { checkVenn, regionAt, regionName, VENN, VENN_ORDER } from "@/lib/venn";
import { Feedback, type FeedbackState } from "./Feedback";

export interface VennChip {
  id: string;
  label: string;
  tone?: "given" | "placed" | "selected" | "wrong";
}

const TONE: Record<NonNullable<VennChip["tone"]>, { fill: string; stroke: string; text: string }> = {
  given: { fill: "#f1f5f9", stroke: "#94a3b8", text: "#475569" },
  placed: { fill: "#ffffff", stroke: "#4f46e5", text: "#1d2140" },
  selected: { fill: "#fef3c7", stroke: "#f59e0b", text: "#1d2140" },
  wrong: { fill: "#fff4d6", stroke: "#d97706", text: "#7a4b00" },
};

const HEIGHT = 350;

/** Позиции надписей внутри области. */
function layout(region: VennRegion, n: number): { x: number; y: number }[] {
  if (region === "none") {
    const perRow = 7;
    const rows = Math.ceil(n / perRow);
    return Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / perRow);
      const inRow = Math.min(perRow, n - row * perRow);
      const col = i - row * perRow;
      return { x: 240 + (col - (inRow - 1) / 2) * 60, y: HEIGHT - 40 - (rows - 1 - row) * 36 };
    });
  }
  const centerX = region === "a" ? 116 : region === "b" ? 364 : 240;
  const cols = region !== "ab" && n > 4 ? 2 : 1;
  const colX = cols === 1 ? [centerX] : [centerX - 28, centerX + 28];
  const rows = Math.ceil(n / cols);
  const step = rows > 4 ? 32 : 38;
  return Array.from({ length: n }, (_, i) => ({
    x: colX[i % cols],
    y: VENN.a.cy - ((rows - 1) * step) / 2 + Math.floor(i / cols) * step,
  }));
}

/** Два круга Эйлера с надписями в областях. Если передан onRegion — по областям можно нажимать. */
export function VennDiagram({
  sets,
  regions,
  onRegion,
  onChip,
}: {
  sets: readonly [string, string];
  regions: Partial<Record<VennRegion, VennChip[]>>;
  onRegion?: (region: VennRegion) => void;
  onChip?: (id: string) => void;
}) {
  const click = (e: MouseEvent<SVGSVGElement>) => {
    const ctm = e.currentTarget.getScreenCTM();
    if (!onRegion || !ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    onRegion(regionAt(pt.x, pt.y));
  };

  return (
    <svg
      viewBox={`0 0 ${VENN.width} ${HEIGHT}`}
      width="100%"
      className={cn("max-w-[520px]", onRegion && "cursor-pointer")}
      role="img"
      aria-label={`Круги Эйлера: «${sets[0]}» и «${sets[1]}»`}
      onClick={onRegion ? click : undefined}
    >
      <rect
        x={2}
        y={2}
        width={VENN.width - 4}
        height={HEIGHT - 4}
        rx={18}
        fill="#fafaf9"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      <circle
        cx={VENN.a.cx}
        cy={VENN.a.cy}
        r={VENN.a.r}
        fill="#4f46e5"
        fillOpacity="0.1"
        stroke="#4f46e5"
        strokeWidth="3"
      />
      <circle
        cx={VENN.b.cx}
        cy={VENN.b.cy}
        r={VENN.b.r}
        fill="#f59e0b"
        fillOpacity="0.12"
        stroke="#d97706"
        strokeWidth="3"
      />
      <text x={VENN.a.cx - 40} y={30} textAnchor="middle" fontSize="21" fontWeight="900" fill="#3730a3">
        {sets[0]}
      </text>
      <text x={VENN.b.cx + 40} y={30} textAnchor="middle" fontSize="21" fontWeight="900" fill="#b45309">
        {sets[1]}
      </text>
      {VENN_ORDER.map((region) => {
        const chips = regions[region] ?? [];
        const pos = layout(region, chips.length);
        return chips.map((chip, i) => {
          const tone = TONE[chip.tone ?? "placed"];
          const w = Math.max(44, 18 + chip.label.length * 13);
          const content = (
            <>
              <rect
                x={pos[i].x - w / 2}
                y={pos[i].y - 16}
                width={w}
                height={32}
                rx={10}
                fill={tone.fill}
                stroke={tone.stroke}
                strokeWidth={chip.tone === "selected" ? 3 : 2}
              />
              <text x={pos[i].x} y={pos[i].y + 7} textAnchor="middle" fontSize="21" fontWeight="900" fill={tone.text}>
                {chip.label}
              </text>
            </>
          );
          return onChip && chip.tone !== "given" ? (
            <g
              key={chip.id}
              role="button"
              tabIndex={0}
              aria-label={`${chip.label}: переложить`}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onChip(chip.id);
              }}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChip(chip.id)}
            >
              {content}
            </g>
          ) : (
            <g key={chip.id}>{content}</g>
          );
        });
      })}
    </svg>
  );
}

export function VennPuzzle({
  taskId,
  sets,
  items,
  correct,
  given = [],
  hintsLeft,
}: {
  taskId: string;
  sets: [string, string];
  items: { id: string; label: string }[];
  correct: Record<string, VennRegion>;
  given?: { label: string; region: VennRegion }[];
  hintsLeft: boolean;
}) {
  const progress = useTask(taskId);
  const [placed, setPlaced] = useState<Record<string, VennRegion>>(
    () => (progress.input?.venn as Record<string, VennRegion>) ?? {},
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const label = (id: string) => items.find((i) => i.id === id)?.label ?? id;
  const pool = items.filter((i) => !placed[i.id]);

  const save = (next: Record<string, VennRegion>) => {
    setPlaced(next);
    setWrong([]);
    saveTaskInput(taskId, { venn: next });
  };

  const place = (region: VennRegion) => {
    if (!selected) {
      setFeedback({
        tone: "info",
        text: "Сначала выбери, что положить.",
        sub: "Нажми на число, а потом — на место в кругах.",
      });
      return;
    }
    save({ ...placed, [selected]: region });
    setSelected(null);
    setFeedback(null);
  };

  const check = () => {
    const n = attempts.current++;
    const res = checkVenn(correct, placed);
    recordCheck(taskId, res.wrong.length === 0 && res.missing.length === 0);
    if (res.wrong.length === 0) {
      setFeedback({ tone: "success", text: praise(n), sub: askExplain(n) });
      return;
    }
    if (n >= 1) setWrong(res.wrong);
    setFeedback({
      tone: "retry",
      text: `Сходится: ${res.right} из ${items.length}.`,
      sub: n >= 1 ? "Проверь то, что выделено жёлтым: подходит ли оно к надписям кругов?" : retrySub(n, hintsLeft),
    });
  };

  const regions: Partial<Record<VennRegion, VennChip[]>> = {};
  given.forEach((g, i) => (regions[g.region] ??= []).push({ id: `given-${i}`, label: g.label, tone: "given" }));
  items.forEach((it) => {
    const r = placed[it.id];
    if (!r) return;
    (regions[r] ??= []).push({
      id: it.id,
      label: it.label,
      tone: selected === it.id ? "selected" : wrong.includes(it.id) ? "wrong" : "placed",
    });
  });

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-muted">
        Нажми на число, а потом — на то место в кругах, где оно должно лежать.
      </p>
      <div
        className="flex min-h-12 flex-wrap items-center gap-2 rounded-2xl bg-white p-2 shadow-card"
        aria-label="Что разложить"
      >
        {pool.length === 0 ? (
          <span className="px-2 text-sm font-bold text-muted">Всё разложено! Можно проверить.</span>
        ) : (
          pool.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setSelected(selected === it.id ? null : it.id)}
              aria-pressed={selected === it.id}
              className={cn(
                "tabular h-11 min-w-12 rounded-xl border-2 px-3 text-xl font-black transition",
                selected === it.id ? "border-sun bg-sun-soft" : "border-brand/30 bg-brand-soft hover:border-brand",
              )}
            >
              {it.label}
            </button>
          ))
        )}
      </div>
      <div className="rounded-3xl bg-white p-2 shadow-card">
        <VennDiagram
          sets={sets}
          regions={regions}
          onRegion={place}
          onChip={(id) => setSelected(selected === id ? null : id)}
        />
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Куда положить">
        {VENN_ORDER.map((r) => (
          <Button key={r} size="sm" variant="secondary" onClick={() => place(r)} disabled={!selected}>
            {regionName(r, sets)}
          </Button>
        ))}
      </div>
      <Button onClick={check} size="lg" disabled={pool.length > 0}>
        Проверить
      </Button>
      <Feedback state={feedback} />
      {selected && placed[selected] && (
        <p className="text-sm font-bold text-muted">
          Выбрано «{label(selected)}». Нажми на новое место — или на кнопку ниже.
        </p>
      )}
    </div>
  );
}
