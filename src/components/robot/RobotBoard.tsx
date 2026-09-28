"use client";

import type { Cell } from "@/content/types";
import { useT } from "@/lib/i18n";
import { cellKey, type RobotMap } from "@/lib/robot";

export interface RobotBoardProps {
  map: RobotMap;
  legend?: Record<string, { emoji: string; name: string }>;
  robot?: Cell;
  trail?: Cell[];
  collected?: number[];
  crash?: Cell | null;
  cell?: number;
  className?: string;
}

/** Клетчатое поле робота. Одинаково рисуется на экране и на бумаге. */
export function RobotBoard({
  map,
  legend,
  robot = map.start,
  trail = [],
  collected = [],
  crash = null,
  cell = 56,
  className,
}: RobotBoardProps) {
  const t = useT();
  const W = map.cols * cell;
  const H = map.rows * cell;
  const center = (c: Cell) => ({ x: c[0] * cell + cell / 2, y: c[1] * cell + cell / 2 });
  const trailKeys = new Set(trail.map(cellKey));
  const emojiSize = cell * 0.56;
  const rPos = center(robot);

  return (
    <svg
      viewBox={`-3 -3 ${W + 6} ${H + 6}`}
      width="100%"
      className={className}
      style={{ maxWidth: W + 6 }}
      role="img"
      aria-label={t(`Поле ${map.cols} на ${map.rows} клеток`, `${map.cols}×${map.rows} katakli maydon`)}
    >
      <rect x={-3} y={-3} width={W + 6} height={H + 6} rx={12} fill="#eef2ff" />
      {Array.from({ length: map.rows }, (_, r) =>
        Array.from({ length: map.cols }, (_, c) => {
          const wall = map.walls.has(`${c},${r}`);
          return (
            <rect
              key={`${c}-${r}`}
              x={c * cell + 2}
              y={r * cell + 2}
              width={cell - 4}
              height={cell - 4}
              rx={8}
              fill={wall ? "#334155" : trailKeys.has(`${c},${r}`) ? "#dbeafe" : "#ffffff"}
              stroke={wall ? "#1e293b" : "#c7d2fe"}
              strokeWidth={1.5}
            />
          );
        }),
      )}
      {map.goal && (
        <text x={center(map.goal).x} y={center(map.goal).y + emojiSize * 0.36} textAnchor="middle" fontSize={emojiSize}>
          🚩
        </text>
      )}
      {map.stars.map((s, i) => (
        <text
          key={`star-${i}`}
          x={center(s).x}
          y={center(s).y + emojiSize * 0.36}
          textAnchor="middle"
          fontSize={emojiSize}
          opacity={collected.includes(i) ? 0.18 : 1}
        >
          ⭐
        </text>
      ))}
      {map.items.map((it) => (
        <text
          key={it.key}
          x={center(it.cell).x}
          y={center(it.cell).y + emojiSize * 0.36}
          textAnchor="middle"
          fontSize={emojiSize}
        >
          {legend?.[it.key]?.emoji ?? it.key}
        </text>
      ))}
      {trail.slice(1).map((c, i) => (
        <circle key={`t-${i}`} cx={center(c).x} cy={center(c).y + cell * 0.32} r={3} fill="#6366f1" opacity={0.6} />
      ))}
      {crash && (
        <g>
          <rect
            x={crash[0] * cell + 4}
            y={crash[1] * cell + 4}
            width={cell - 8}
            height={cell - 8}
            rx={8}
            fill="none"
            stroke="#e11d48"
            strokeWidth={3}
            strokeDasharray="6 4"
          />
          <text x={center(crash).x} y={center(crash).y + 8} textAnchor="middle" fontSize={cell * 0.45}>
            💥
          </text>
        </g>
      )}
      <g style={{ transform: `translate(${rPos.x}px, ${rPos.y}px)`, transition: "transform 0.28s ease-in-out" }}>
        <circle r={cell * 0.36} fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} />
        <text y={emojiSize * 0.36} textAnchor="middle" fontSize={emojiSize}>
          🤖
        </text>
      </g>
    </svg>
  );
}
