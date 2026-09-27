"use client";

import { useRef, useState } from "react";
import { Button, cn } from "@/components/ui";
import { askExplain, praise } from "@/lib/feedback";
import { applyJugs, isUseless, jugsReached, replayJugs, type JugsAction, type JugsState } from "@/lib/jugs";
import { pluralize } from "@/lib/plural";
import { addFound, recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { Feedback, type FeedbackState } from "./Feedback";

const stepsWord = (n: number) => pluralize(n, "действие", "действия", "действий");

/** Ведро без делений: видно только, сколько в нём воды. */
export function Bucket({
  capacity,
  amount,
  maxCapacity,
  highlight = false,
  showAmount = true,
}: {
  capacity: number;
  amount: number;
  maxCapacity: number;
  highlight?: boolean;
  showAmount?: boolean;
}) {
  const unit = 22;
  const h = capacity * unit;
  const top = (maxCapacity - capacity) * unit + 8;
  const H = maxCapacity * unit + 16;
  const wTop = 96;
  const wBottom = 74;
  const water = amount * unit;
  const y0 = top + h;
  const lerp = (y: number) => {
    const t = (y - top) / h;
    return wTop - (wTop - wBottom) * t;
  };
  const cx = 60;
  const waterTop = y0 - water;
  return (
    <svg
      width={120}
      height={H}
      viewBox={`0 0 120 ${H}`}
      role="img"
      aria-label={`Ведро на ${capacity} л: ${showAmount ? `в нём ${amount} л` : "пустое"}`}
    >
      {water > 0 && (
        <polygon
          points={`${cx - lerp(waterTop) / 2},${waterTop} ${cx + lerp(waterTop) / 2},${waterTop} ${cx + wBottom / 2},${y0} ${cx - wBottom / 2},${y0}`}
          fill="#60a5fa"
          opacity="0.85"
        />
      )}
      <polygon
        points={`${cx - wTop / 2},${top} ${cx + wTop / 2},${top} ${cx + wBottom / 2},${y0} ${cx - wBottom / 2},${y0}`}
        fill="none"
        stroke={highlight ? "#10b981" : "#1d2140"}
        strokeWidth={highlight ? 4 : 3}
        strokeLinejoin="round"
      />
      <path
        d={`M ${cx - wTop / 2 + 4} ${top} Q ${cx} ${top - 14} ${cx + wTop / 2 - 4} ${top}`}
        fill="none"
        stroke="#6b7280"
        strokeWidth="2"
      />
      {showAmount && (
        <text x={cx} y={y0 - 10} textAnchor="middle" fontSize="20" fontWeight="900" fill="#1d2140">
          {amount} л
        </text>
      )}
    </svg>
  );
}

export function JugsPuzzle({
  taskId,
  capacities,
  target,
  optimal,
}: {
  taskId: string;
  capacities: [number, number];
  target: number;
  optimal: number;
}) {
  const progress = useTask(taskId);
  const [actions, setActions] = useState<JugsAction[]>(() => {
    const saved = progress.input?.actions;
    return Array.isArray(saved) ? (saved as JugsAction[]) : [];
  });
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const states = replayJugs(capacities, actions);
  const current = states[states.length - 1];
  const done = jugsReached(current, target);
  const maxCap = Math.max(...capacities);
  const name = (j: 0 | 1) => `ведро на ${capacities[j]} л`;

  const save = (next: JugsAction[]) => {
    setActions(next);
    saveTaskInput(taskId, { actions: next });
  };

  const act = (a: JugsAction) => {
    if (done) return;
    if (isUseless(capacities, current, a)) {
      const why =
        a.type === "fill"
          ? `${capitalize(name(a.jug))} уже полное.`
          : a.type === "empty"
            ? `${capitalize(name(a.jug))} и так пустое.`
            : current[a.from] === 0
              ? `${capitalize(name(a.from))} пустое — переливать нечего.`
              : `${capitalize(name(a.from === 0 ? 1 : 0))} уже полное.`;
      setFeedback({ tone: "info", text: why, sub: "Это действие ничего не изменит. Попробуй другое." });
      return;
    }
    const next = [...actions, a];
    save(next);
    const s: JugsState = applyJugs(capacities, current, a);
    if (!jugsReached(s, target)) {
      setFeedback(null);
      return;
    }
    const n = attempts.current++;
    recordCheck(taskId, true);
    addFound(taskId, `len:${next.length}`);
    setFeedback(
      next.length <= optimal
        ? {
            tone: "success",
            text: `${praise(n)} Ровно ${target} л — за ${stepsWord(next.length)}!`,
            sub: `Быстрее не бывает. ${askExplain(n)}`,
          }
        : {
            tone: "success",
            text: `Получилось ${target} л! Понадобилось ${stepsWord(next.length)}.`,
            sub: "А можно быстрее? Попробуй найти путь покороче.",
          },
    );
  };

  const describe = (a: JugsAction) =>
    a.type === "fill"
      ? `Наполнить ${name(a.jug)}`
      : a.type === "empty"
        ? `Вылить ${name(a.jug)}`
        : `Перелить из ведра на ${capacities[a.from]} л в ведро на ${capacities[a.from === 0 ? 1 : 0]} л`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {([0, 1] as const).map((j) => (
          <div key={j} className="flex flex-col items-center gap-2 rounded-3xl bg-white p-2 shadow-card sm:p-3">
            <p className="text-sm font-extrabold text-muted">Ведро на {capacities[j]} л</p>
            <Bucket
              capacity={capacities[j]}
              amount={current[j]}
              maxCapacity={maxCap}
              highlight={current[j] === target}
            />
            <div className="flex flex-wrap justify-center gap-1.5">
              <Button size="sm" variant="soft" onClick={() => act({ type: "fill", jug: j })} disabled={done}>
                🚰 Наполнить
              </Button>
              <Button size="sm" variant="soft" onClick={() => act({ type: "empty", jug: j })} disabled={done}>
                Вылить
              </Button>
              <Button size="sm" variant="soft" onClick={() => act({ type: "pour", from: j })} disabled={done}>
                {j === 0 ? "Перелить →" : "← Перелить"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className={cn("tabular rounded-2xl bg-white px-4 py-2 text-lg font-black shadow-card")}>
          Действий: {actions.length}
        </span>
        <Button
          variant="secondary"
          onClick={() => {
            save(actions.slice(0, -1));
            setFeedback(null);
          }}
          disabled={actions.length === 0}
        >
          ↶ Отменить
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            save([]);
            setFeedback(null);
          }}
          disabled={actions.length === 0}
        >
          ↺ Сначала
        </Button>
      </div>

      <Feedback state={feedback} />

      {actions.length > 0 && (
        <div className="rounded-2xl bg-white p-3 shadow-card">
          <p className="mb-2 text-sm font-extrabold text-muted">Мои действия</p>
          <ol className="space-y-1 text-[0.95rem]">
            {actions.map((a, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                <span className="w-6 text-right font-bold text-muted">{i + 1}.</span>
                <span className="font-bold">{describe(a)}</span>
                <span className="tabular text-sm text-muted">
                  → {states[i + 1][0]} л и {states[i + 1][1]} л
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
