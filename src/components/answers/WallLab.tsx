"use client";

import { useState } from "react";
import { Button, cn } from "@/components/ui";
import { plural } from "@/lib/plural";
import { addFound, markSolved, saveTaskInput, useTask } from "@/lib/store";
import { buildWall } from "@/lib/wall";
import { Feedback, type FeedbackState } from "./Feedback";

/** Стенка из кирпичей; нижний ряд можно нажимать (onBrick). */
export function WallBoard({
  bottom,
  selected = null,
  onBrick,
  print = false,
}: {
  bottom: (number | null)[];
  selected?: number | null;
  onBrick?: (i: number) => void;
  print?: boolean;
}) {
  const rows = buildWall(bottom).reverse();
  const brick = print ? "h-[9mm] w-[13mm] text-lg" : "h-12 w-16 text-2xl";
  return (
    <div className="inline-flex flex-col items-center gap-1">
      {rows.map((row, ri) => {
        const isBottom = ri === rows.length - 1;
        return (
          <div key={ri} className="flex gap-1">
            {row.map((v, i) => {
              const cls = cn(
                "tabular flex items-center justify-center rounded-lg border-2 font-black",
                brick,
                print
                  ? "border-ink/60 bg-white"
                  : isBottom && selected === i
                    ? "border-sun bg-sun-soft"
                    : ri === 0 && v !== null
                      ? "border-[#b45309] bg-[#fde68a]"
                      : "border-[#d97706] bg-[#ffedd5]",
              );
              return isBottom && onBrick ? (
                <button
                  key={i}
                  type="button"
                  onClick={() => onBrick(i)}
                  aria-pressed={selected === i}
                  aria-label={`Нижний кирпич ${i + 1}${v === null ? "" : `: ${v}`}`}
                  className={cls}
                >
                  {v ?? ""}
                </button>
              ) : (
                <span key={i} className={cls}>
                  {v ?? ""}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function WallLab({ taskId, numbers, tops }: { taskId: string; numbers: number[]; tops: number[] }) {
  const progress = useTask(taskId);
  const size = numbers.length;
  const [bottom, setBottom] = useState<(number | null)[]>(() => {
    const saved = progress.input?.wall;
    return Array.isArray(saved) && saved.length === size ? (saved as (number | null)[]) : Array(size).fill(null);
  });
  const [selected, setSelected] = useState<number | null>(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const found = (progress.found ?? []).filter((f) => f.startsWith("top:")).map((f) => Number(f.slice(4)));
  const low = Math.min(...tops) - 1;
  const high = Math.max(...tops) + 1;
  const journal = Array.from({ length: high - low + 1 }, (_, i) => low + i);

  const place = (n: number) => {
    if (selected === null) return;
    const next = bottom.map((v) => (v === n ? null : v));
    next[selected] = n;
    setBottom(next);
    saveTaskInput(taskId, { wall: next });
    const empty = next.findIndex((v) => v === null);
    setSelected(empty === -1 ? null : empty);
    if (empty !== -1) {
      setFeedback(null);
      return;
    }
    const rows = buildWall(next);
    const top = rows[rows.length - 1][0]!;
    const isNew = !found.includes(top);
    addFound(taskId, `top:${top}`);
    const total = found.length + (isNew ? 1 : 0);
    if (total >= 2) markSolved(taskId);
    setFeedback({
      tone: "success",
      text: `Наверху получилось ${top}! ${isNew ? "Новое открытие 🔬" : "Это число уже есть в дневнике."}`,
      sub: isNew
        ? total >= tops.length
          ? "Ты нашёл все числа, которые могут быть наверху! Почему среди них нет нечётных?"
          : "Запиши расстановку в таблицу. Что будет, если поменять местами два средних числа?"
        : "Попробуй получить наверху другое число.",
    });
  };

  const clear = () => {
    const empty = Array(size).fill(null);
    setBottom(empty);
    setSelected(0);
    setFeedback(null);
    saveTaskInput(taskId, { wall: empty });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted">
        Нажми на нижний кирпич, а потом на число. Когда все кирпичи внизу заполнены, стенка посчитает всё сама.
      </p>
      <div className="flex flex-wrap items-start gap-5">
        <div className="rounded-3xl bg-white p-4 shadow-card">
          <WallBoard bottom={bottom} selected={selected} onBrick={(i) => setSelected(i === selected ? null : i)} />
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Числа">
            {numbers.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => place(n)}
                disabled={selected === null}
                className={cn(
                  "h-14 w-14 rounded-2xl border-2 text-2xl font-black transition",
                  bottom.includes(n)
                    ? "border-[#fed7aa] bg-[#fff7ed] text-[#fdba74]"
                    : "border-[#d97706] bg-white text-[#b45309] hover:bg-[#fff7ed]",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <Button variant="ghost" onClick={clear}>
            Очистить стенку
          </Button>
          <div className="rounded-2xl bg-white p-3 shadow-card">
            <p className="mb-2 text-sm font-extrabold text-muted">Дневник исследователя: что получалось наверху?</p>
            <div className="flex max-w-80 flex-wrap gap-1.5">
              {journal.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "flex h-10 min-w-10 items-center justify-center rounded-xl px-2 text-lg font-black",
                    found.includes(t)
                      ? "bg-[#d97706] text-white"
                      : "border-2 border-dashed border-[#fed7aa] text-[#fdba74]",
                  )}
                  title={found.includes(t) ? "получалось" : "ещё не получалось"}
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm font-bold text-muted">
              Найдено: {found.length} {plural(found.length, "число", "числа", "чисел")}
            </p>
          </div>
        </div>
      </div>
      <Feedback state={feedback} />
    </div>
  );
}
