"use client";

import { useTaskId } from "@/components/task/TaskContext";
import { saveTaskInput, useStore } from "@/lib/store";

const NEXT: Record<string, string> = { "": "✗", "✗": "✓", "✓": "" };
const EMPTY: Record<string, string> = {};

/** Таблица для логических задач: нажатие по клетке — ✗, ещё раз — ✓, ещё раз — пусто. */
export function LogicGrid({
  rows,
  cols,
  corner,
  print,
}: {
  rows: string[];
  cols: string[];
  corner?: string;
  print?: boolean;
}) {
  const taskId = useTaskId();
  const saved = useStore((s) =>
    taskId ? (s.tasks[taskId]?.input?.logicGrid as Record<string, string> | undefined) : undefined,
  );
  const marks = print ? EMPTY : (saved ?? EMPTY);

  const toggle = (key: string) => {
    if (!taskId) return;
    saveTaskInput(taskId, { logicGrid: { ...marks, [key]: NEXT[marks[key] ?? ""] } });
  };

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-line bg-paper px-2 py-1.5 text-left text-xs font-bold text-muted">
              {corner ?? ""}
            </th>
            {cols.map((c) => (
              <th
                key={c}
                className="min-w-20 border border-line bg-brand-soft px-2 py-1.5 font-extrabold text-brand-dark"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r}>
              <th className="border border-line bg-brand-soft px-3 py-1.5 text-left font-extrabold whitespace-nowrap text-brand-dark">
                {r}
              </th>
              {cols.map((c, j) => {
                const key = `${i}-${j}`;
                const v = marks[key] ?? "";
                return (
                  <td key={c} className="h-11 border border-line bg-white p-0 text-center">
                    {print ? null : (
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        className={`h-11 w-full text-2xl font-black ${v === "✓" ? "text-mint" : "text-rose"} hover:bg-brand-soft/50`}
                        aria-label={`${r} — ${c}: ${v === "✓" ? "да" : v === "✗" ? "нет" : "пусто"}`}
                      >
                        {v}
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
