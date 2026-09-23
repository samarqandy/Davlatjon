"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui";
import type { GraphPuzzle as GraphSpec } from "@/content/types";
import { askExplain, praise } from "@/lib/feedback";
import { edgeBetween, pathTime } from "@/lib/graph";
import { addFound, recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { Feedback, type FeedbackState } from "./Feedback";

/** Карта дорог. Если передан onNode — по вершинам можно нажимать. */
export function GraphMap({
  puzzle,
  path = [],
  onNode,
}: {
  puzzle: GraphSpec;
  path?: string[];
  onNode?: (id: string) => void;
}) {
  const W = 420;
  const H = 250;
  const pos = (id: string) => puzzle.nodes.find((n) => n.id === id)!;
  const onPath = (a: string, b: string) =>
    path.some((p, i) => i > 0 && ((path[i - 1] === a && p === b) || (path[i - 1] === b && p === a)));
  const last = path[path.length - 1];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      className="max-w-[520px]"
      role="img"
      aria-label="Карта дорог с минутами"
    >
      <rect x="0" y="0" width={W} height={H} rx="18" fill="#f0fdf4" />
      {puzzle.edges.map((e) => {
        const a = pos(e.a);
        const b = pos(e.b);
        const active = onPath(e.a, e.b);
        return (
          <g key={`${e.a}-${e.b}`}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={active ? "#4f46e5" : "#94a3b8"}
              strokeWidth={active ? 7 : 5}
              strokeLinecap="round"
            />
            <circle
              cx={(a.x + b.x) / 2}
              cy={(a.y + b.y) / 2}
              r={16}
              fill="#fff"
              stroke={active ? "#4f46e5" : "#64748b"}
              strokeWidth="2"
            />
            <text
              x={(a.x + b.x) / 2}
              y={(a.y + b.y) / 2 + 6}
              textAnchor="middle"
              fontSize="17"
              fontWeight="900"
              fill="#1d2140"
            >
              {e.w}
            </text>
          </g>
        );
      })}
      {puzzle.nodes.map((n) => {
        const inPath = path.includes(n.id);
        const isEnd = n.id === puzzle.start || n.id === puzzle.finish;
        const content = (
          <>
            <circle
              cx={n.x}
              cy={n.y}
              r={28}
              fill={inPath ? "#e0e7ff" : "#fff"}
              stroke={n.id === last ? "#f59e0b" : isEnd ? "#4f46e5" : "#475569"}
              strokeWidth={n.id === last ? 4 : 2.5}
            />
            <text x={n.x} y={n.y + 10} textAnchor="middle" fontSize="27">
              {n.emoji}
            </text>
            <text
              x={n.x}
              y={n.y + 47}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill="#1d2140"
              stroke="#f0fdf4"
              strokeWidth="4"
              paintOrder="stroke"
            >
              {n.label}
            </text>
          </>
        );
        return onNode ? (
          <g
            key={n.id}
            role="button"
            tabIndex={0}
            aria-label={n.label}
            className="cursor-pointer"
            onClick={() => onNode(n.id)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onNode(n.id)}
          >
            {content}
          </g>
        ) : (
          <g key={n.id}>{content}</g>
        );
      })}
    </svg>
  );
}

export function GraphPuzzle({ taskId, puzzle }: { taskId: string; puzzle: GraphSpec }) {
  const progress = useTask(taskId);
  const [path, setPath] = useState<string[]>(() => (progress.input?.path as string[]) ?? [puzzle.start]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const label = (id: string) => puzzle.nodes.find((n) => n.id === id)?.label ?? id;
  const time = pathTime(puzzle.edges, path) ?? 0;

  const update = (next: string[]) => {
    setPath(next);
    saveTaskInput(taskId, { path: next });
  };

  const onNode = (id: string) => {
    const last = path[path.length - 1];
    if (last === puzzle.finish) return;
    if (id === last && path.length > 1) {
      update(path.slice(0, -1));
      setFeedback(null);
      return;
    }
    if (path.includes(id)) {
      setFeedback({
        tone: "info",
        text: `В «${label(id)}» ты уже был.`,
        sub: "Нажми на последнее место в пути, чтобы вернуться на шаг назад.",
      });
      return;
    }
    if (!edgeBetween(puzzle.edges, last, id)) {
      setFeedback({
        tone: "info",
        text: `От «${label(last)}» до «${label(id)}» нет прямой дороги.`,
        sub: "Выбери место, куда ведёт дорога.",
      });
      return;
    }
    const next = [...path, id];
    update(next);
    setFeedback(null);
    if (id === puzzle.finish) {
      const total = pathTime(puzzle.edges, next) ?? 0;
      const n = attempts.current++;
      const ok = total === puzzle.optimal;
      recordCheck(taskId, ok);
      addFound(taskId, `${total}:${next.join(">")}`);
      setFeedback(
        ok
          ? { tone: "success", text: `${praise(n)} ${total} ${puzzle.unit} — самый быстрый путь!`, sub: askExplain(n) }
          : {
              tone: "retry",
              text: `Ты доехал за ${total} ${puzzle.unit}.`,
              sub: "А можно быстрее? Нажми «Заново» и попробуй другой путь.",
            },
      );
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-muted">Нажимай на места по порядку, чтобы проложить путь от дома.</p>
      <div className="rounded-3xl bg-white p-2 shadow-card">
        <GraphMap puzzle={puzzle} path={path} onNode={onNode} />
      </div>
      <p className="rounded-2xl bg-white px-4 py-2 font-bold shadow-card">
        {path.map(label).join(" → ")}
        {path.length > 1 && (
          <span className="ml-2 text-brand">
            = {time} {puzzle.unit}
          </span>
        )}
      </p>
      <Button
        variant="secondary"
        onClick={() => {
          update([puzzle.start]);
          setFeedback(null);
        }}
        disabled={path.length === 1}
      >
        ↺ Заново
      </Button>
      <Feedback state={feedback} />
    </div>
  );
}
