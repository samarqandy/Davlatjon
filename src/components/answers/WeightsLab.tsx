"use client";

import { useState } from "react";
import { Button, cn } from "@/components/ui";
import { plural } from "@/lib/plural";
import { addFound, markSolved, useTask } from "@/lib/store";
import { balanceOf, waysToBalance, type WeightPlace } from "@/lib/weights";
import { Feedback, type FeedbackState } from "./Feedback";

type Item = { label: string; kind: "load" | "weight" };
type WeightSet = { weights: number[]; bothPans: boolean; max: number };

/** Сколько гирь или грузов нужно найти, чтобы исследование считалось сделанным. */
const TO_SOLVE = 6;

/** Весы с грузом и гирями. tilt — какая чаша тяжелее. */
export function WeightScale({ left, right, tilt }: { left: Item[]; right: Item[]; tilt: "left" | "right" | "equal" }) {
  const w = 340;
  const pivot = { x: w / 2, y: 40 };
  const arm = 118;
  const angle = tilt === "left" ? -8 : tilt === "right" ? 8 : 0;
  const rad = (angle * Math.PI) / 180;
  const end = (side: -1 | 1) => ({ x: pivot.x + side * arm * Math.cos(rad), y: pivot.y + side * arm * Math.sin(rad) });
  const pan = (side: -1 | 1, items: Item[]) => {
    const e = end(side);
    const panY = e.y + 84;
    const perRow = 3;
    return (
      <g>
        <line x1={e.x} y1={e.y} x2={e.x - 48} y2={panY} stroke="#6b7280" strokeWidth="1.5" />
        <line x1={e.x} y1={e.y} x2={e.x + 48} y2={panY} stroke="#6b7280" strokeWidth="1.5" />
        {items.map((it, i) => {
          const row = Math.floor(i / perRow);
          const inRow = Math.min(perRow, items.length - row * perRow);
          const cx = e.x + ((i % perRow) - (inRow - 1) / 2) * 36;
          const base = panY - 2 - row * 30;
          return it.kind === "load" ? (
            <g key={i}>
              <rect
                x={cx - 17}
                y={base - 28}
                width={34}
                height={28}
                rx={4}
                fill="#c084fc"
                stroke="#6b21a8"
                strokeWidth="2"
              />
              <text x={cx} y={base - 9} textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff">
                {it.label}
              </text>
            </g>
          ) : (
            <g key={i}>
              <path
                d={`M ${cx - 10} ${base - 24} L ${cx + 10} ${base - 24} L ${cx + 15} ${base} L ${cx - 15} ${base} Z`}
                fill="#475569"
                stroke="#1e293b"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx={cx} cy={base - 28} r={4} fill="none" stroke="#1e293b" strokeWidth="2" />
              <text x={cx} y={base - 7} textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">
                {it.label}
              </text>
            </g>
          );
        })}
        <path
          d={`M ${e.x - 60} ${panY} Q ${e.x} ${panY + 26} ${e.x + 60} ${panY} Z`}
          fill="#e5e7eb"
          stroke="#374151"
          strokeWidth="2"
        />
      </g>
    );
  };
  const text = (items: Item[]) => items.map((i) => i.label).join(" и ") || "ничего";
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${w} 200`}
      className="max-w-[380px]"
      role="img"
      aria-label={`Весы: слева ${text(left)}, справа ${text(right)} — ${
        tilt === "equal" ? "равновесие" : tilt === "left" ? "перевесила левая чаша" : "перевесила правая чаша"
      }`}
    >
      <polygon points={`${w / 2 - 40},194 ${w / 2 + 40},194 ${w / 2},166`} fill="#9ca3af" />
      <rect x={w / 2 - 4} y={36} width={8} height={136} rx={3} fill="#6b7280" />
      <line
        x1={end(-1).x}
        y1={end(-1).y}
        x2={end(1).x}
        y2={end(1).y}
        stroke="#374151"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx={pivot.x} cy={pivot.y} r={7} fill="#f59e0b" stroke="#374151" strokeWidth="2" />
      {pan(-1, left)}
      {pan(1, right)}
    </svg>
  );
}

export function setLabel(s: WeightSet): string {
  return `Гири ${s.weights.join(", ")}${s.bothPans ? " — на обе чаши" : ""}`;
}

/** Какие грузы от 1 до max набором нельзя уравновесить. */
export function impossibleLoads(s: WeightSet): number[] {
  return Array.from({ length: s.max }, (_, i) => i + 1).filter((l) => waysToBalance(l, s.weights, s.bothPans) === 0);
}

export function WeightsLab({ taskId, sets }: { taskId: string; sets: WeightSet[] }) {
  const progress = useTask(taskId);
  const [active, setActive] = useState(0);
  const [load, setLoad] = useState(1);
  const [places, setPlaces] = useState<WeightPlace[]>(() => sets[0].weights.map(() => null));
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const set = sets[active];
  const foundAll = progress.found ?? [];
  const found = foundAll
    .filter((f) => f.startsWith(`set${active}:`))
    .map((f) => Number(f.slice(`set${active}:`.length)));
  const b = balanceOf(load, set.weights, places);
  const tilt = b.left > b.right ? "left" : b.left < b.right ? "right" : "equal";

  const evaluate = (nextLoad: number, nextPlaces: WeightPlace[]) => {
    const nb = balanceOf(nextLoad, set.weights, nextPlaces);
    if (nb.left !== nb.right || nextPlaces.every((p) => p === null)) {
      setFeedback(null);
      return;
    }
    const key = `set${active}:${nextLoad}`;
    const isNew = !foundAll.includes(key);
    addFound(taskId, key);
    const total = foundAll.filter((f) => f.startsWith("set")).length + (isNew ? 1 : 0);
    if (total >= TO_SOLVE) markSolved(taskId);
    const lefts = set.weights.filter((_, i) => nextPlaces[i] === "left");
    const rights = set.weights.filter((_, i) => nextPlaces[i] === "right");
    const equation = `${[nextLoad, ...lefts].join(" + ")} = ${rights.join(" + ")}`;
    const now = new Set([...found, ...(isNew ? [nextLoad] : [])]);
    const impossible = impossibleLoads(set);
    const complete = set.max - impossible.length === now.size;
    setFeedback({
      tone: "success",
      text: `Равновесие! ${equation}${isNew ? " — новое открытие 🔬" : ""}`,
      sub: complete
        ? impossible.length === 0
          ? `Все грузы от 1 до ${set.max} уравновешены! Как ты думаешь, почему это получилось?`
          : `Все возможные грузы найдены. Не получаются: ${impossible.join(", ")}. Почему?`
        : isNew
          ? "Груз отмечен в дневнике. Какой попробуешь дальше?"
          : "Этот груз уже есть в дневнике. Может быть, найдёшь другой способ?",
    });
  };

  const choose = (i: number) => {
    setActive(i);
    setLoad(1);
    setPlaces(sets[i].weights.map(() => null));
    setFeedback(null);
  };

  const toggle = (i: number) => {
    const order: WeightPlace[] = set.bothPans ? [null, "right", "left"] : [null, "right"];
    const next = [...places];
    next[i] = order[(order.indexOf(places[i]) + 1) % order.length];
    setPlaces(next);
    evaluate(load, next);
  };

  const pick = (l: number) => {
    setLoad(l);
    evaluate(l, places);
  };

  const leftItems: Item[] = [
    { label: `${load}`, kind: "load" },
    ...set.weights.filter((_, i) => places[i] === "left").map((w) => ({ label: `${w}`, kind: "weight" as const })),
  ];
  const rightItems: Item[] = set.weights
    .filter((_, i) => places[i] === "right")
    .map((w) => ({ label: `${w}`, kind: "weight" as const }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Наборы гирь">
        {sets.map((s, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => choose(i)}
            className={cn(
              "rounded-2xl border-2 px-3 py-2 text-sm font-extrabold transition",
              i === active ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40",
            )}
          >
            {setLabel(s)}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-3 shadow-card">
        <WeightScale left={leftItems} right={rightItems} tilt={tilt} />
        <p className="text-sm font-bold text-muted">
          Слева — груз <b className="text-[#6b21a8]">{load} кг</b>. Нажимай на гири:{" "}
          {set.bothPans ? "на правую чашу, на левую, снять." : "поставить на правую чашу или снять."}
        </p>
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Гири">
          {set.weights.map((wt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              aria-label={`Гиря ${wt} кг: ${places[i] === "left" ? "на левой чаше" : places[i] === "right" ? "на правой чаше" : "не на весах"}`}
              className={cn(
                "flex h-16 min-w-16 flex-col items-center justify-center rounded-2xl border-2 px-2 transition",
                places[i] === "right"
                  ? "border-[#d97706] bg-[#fff7ed]"
                  : places[i] === "left"
                    ? "border-brand bg-brand-soft"
                    : "border-line bg-white hover:border-brand/40",
              )}
            >
              <span className="text-xl font-black">{wt} кг</span>
              <span className="text-[0.65rem] font-extrabold text-muted">
                {places[i] === "right" ? "справа" : places[i] === "left" ? "слева" : "не на весах"}
              </span>
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setPlaces(set.weights.map(() => null));
            setFeedback(null);
          }}
          disabled={places.every((p) => p === null)}
        >
          Снять все гири
        </Button>
      </div>

      <Feedback state={feedback} />

      <div className="rounded-2xl bg-white p-3 shadow-card">
        <p className="mb-2 text-sm font-extrabold text-muted">
          Дневник исследователя: какие грузы уравновешены? Нажми на число, чтобы положить такой груз.
        </p>
        <div className="flex max-w-md flex-wrap gap-1.5">
          {Array.from({ length: set.max }, (_, i) => i + 1).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => pick(l)}
              aria-pressed={l === load}
              className={cn(
                "tabular flex h-10 min-w-10 items-center justify-center rounded-xl px-2 text-lg font-black transition",
                found.includes(l)
                  ? "bg-[#7c3aed] text-white"
                  : "border-2 border-dashed border-[#ddd6fe] text-[#a78bfa] hover:border-[#a78bfa]",
                l === load && "ring-4 ring-sun",
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm font-bold text-muted">
          Уравновешено: {found.length} {plural(found.length, "груз", "груза", "грузов")} из {set.max}
        </p>
      </div>
    </div>
  );
}
