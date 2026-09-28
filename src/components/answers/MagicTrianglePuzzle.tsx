"use client";

import { useState } from "react";
import { Button, cn } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { magicSum, SIDES, sideSums, type TriangleValues } from "@/lib/magicTriangle";
import { addFound, markSolved, saveTaskInput, useTask } from "@/lib/store";
import { Feedback, type FeedbackState } from "./Feedback";

/** Координаты кружков: 3 угла и 3 середины сторон. */
const SPOTS = [
  { x: 170, y: 34 },
  { x: 40, y: 262 },
  { x: 300, y: 262 },
  { x: 105, y: 148 },
  { x: 170, y: 262 },
  { x: 235, y: 148 },
];

/** Где написать сумму стороны (снаружи треугольника). */
const SUM_SPOTS = [
  { x: 72, y: 128 },
  { x: 170, y: 306 },
  { x: 268, y: 128 },
];

export function TriangleBoard({
  values,
  selected = null,
  onSelect,
  showSums = false,
}: {
  values: TriangleValues;
  selected?: number | null;
  onSelect?: (i: number) => void;
  showSums?: boolean;
}) {
  const t = useT();
  const sums = sideSums(values);
  return (
    <svg
      viewBox="0 0 340 320"
      width="100%"
      className="max-w-[340px]"
      role="img"
      aria-label={t("Треугольник с шестью кружками", "Olti doirachali uchburchak")}
    >
      <polygon
        points={`${SPOTS[0].x},${SPOTS[0].y} ${SPOTS[1].x},${SPOTS[1].y} ${SPOTS[2].x},${SPOTS[2].y}`}
        fill="#fdf4ff"
        stroke="#a21caf"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {SPOTS.map((p, i) => {
        const v = values[i];
        const circle = (
          <>
            <circle
              cx={p.x}
              cy={p.y}
              r={26}
              fill={selected === i ? "#fef3c7" : "#fff"}
              stroke={selected === i ? "#f59e0b" : "#86198f"}
              strokeWidth={selected === i ? 5 : 3}
            />
            <text x={p.x} y={p.y + 11} textAnchor="middle" fontSize="30" fontWeight="900" fill="#1d2140">
              {v ?? ""}
            </text>
          </>
        );
        return onSelect ? (
          <g
            key={i}
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            aria-label={t(`Кружок ${i + 1}${v ? `: ${v}` : ""}`, `${i + 1}-doiracha${v ? `: ${v}` : ""}`)}
            onClick={() => onSelect(i)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(i)}
          >
            {circle}
          </g>
        ) : (
          <g key={i}>{circle}</g>
        );
      })}
      {showSums &&
        SIDES.map((_, i) =>
          sums[i] === null ? null : (
            <g key={i}>
              <rect x={SUM_SPOTS[i].x - 22} y={SUM_SPOTS[i].y - 16} width={44} height={26} rx={9} fill="#a21caf" />
              <text
                x={SUM_SPOTS[i].x}
                y={SUM_SPOTS[i].y + 3}
                textAnchor="middle"
                fontSize="16"
                fontWeight="900"
                fill="#fff"
              >
                {sums[i]}
              </text>
            </g>
          ),
        )}
    </svg>
  );
}

export function MagicTrianglePuzzle({ taskId, numbers, sums }: { taskId: string; numbers: number[]; sums: number[] }) {
  const t = useT();
  const progress = useTask(taskId);
  const [values, setValues] = useState<TriangleValues>(
    () => (progress.input?.triangle as TriangleValues) ?? Array(6).fill(null),
  );
  const [selected, setSelected] = useState<number | null>(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const found = (progress.found ?? []).filter((f) => f.startsWith("sum:")).map((f) => Number(f.slice(4)));

  const place = (n: number) => {
    if (selected === null) return;
    const next = values.map((v) => (v === n ? null : v));
    next[selected] = n;
    setValues(next);
    saveTaskInput(taskId, { triangle: next });
    const empty = next.findIndex((v) => v === null);
    setSelected(empty === -1 ? null : empty);
    const s = magicSum(next, numbers);
    if (s !== null) {
      const isNew = !found.includes(s);
      addFound(taskId, `sum:${s}`);
      if (s === 9 || found.length + (isNew ? 1 : 0) >= 2) markSolved(taskId);
      setFeedback({
        tone: "success",
        text: t(
          `На каждой стороне сумма ${s}! ${isNew ? "Новое открытие 🔬" : "Эта сумма уже есть в дневнике."}`,
          `Har bir tomonda yigʻindi ${s}! ${isNew ? "Yangi kashfiyot 🔬" : "Bu yigʻindi kundalikda allaqachon bor."}`,
        ),
        sub: isNew
          ? t(
              "Запиши, какие числа стоят в углах. А какая сумма получится, если поменять числа в углах?",
              "Burchaklarda qaysi sonlar turganini yozib qoʻy. Burchakdagi sonlarni almashtirsang, yigʻindi qancha chiqadi?",
            )
          : t("Попробуй получить другую сумму.", "Boshqa yigʻindi hosil qilib koʻr."),
      });
    } else if (next.every((v) => v !== null)) {
      setFeedback({
        tone: "info",
        text: t(
          "Все числа расставлены, но суммы на сторонах разные.",
          "Hamma sonlar joyida, lekin tomonlardagi yigʻindilar har xil.",
        ),
        sub: t(
          "Посмотри на суммы у сторон: какую сторону нужно «подправить»?",
          "Tomonlardagi yigʻindilarga qara: qaysi tomonni «tuzatish» kerak?",
        ),
      });
    } else {
      setFeedback(null);
    }
  };

  const clear = () => {
    const empty = Array(6).fill(null);
    setValues(empty);
    setSelected(0);
    setFeedback(null);
    saveTaskInput(taskId, { triangle: empty });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted">
        {t(
          "Нажми на кружок, а потом на число. Суммы сторон видны сразу — это лаборатория для опытов!",
          "Avval doirachani, keyin sonni bos. Tomonlar yigʻindisi darrov koʻrinadi — bu tajribalar laboratoriyasi!",
        )}
      </p>
      <div className="flex flex-wrap items-start gap-5">
        <div className="w-full max-w-[340px] rounded-3xl bg-white p-2 shadow-card">
          <TriangleBoard
            values={values}
            selected={selected}
            onSelect={(i) => setSelected(i === selected ? null : i)}
            showSums
          />
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("Числа", "Sonlar")}>
            {numbers.map((n) => {
              const used = values.includes(n);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => place(n)}
                  disabled={selected === null}
                  className={cn(
                    "h-14 w-14 rounded-2xl border-2 text-2xl font-black transition",
                    used
                      ? "border-[#e9d5ff] bg-[#faf5ff] text-[#a78bfa]"
                      : "border-[#a21caf] bg-white text-[#86198f] hover:bg-[#fdf4ff]",
                  )}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <Button variant="ghost" onClick={clear}>
            {t("Очистить треугольник", "Uchburchakni tozalash")}
          </Button>
          <div className="rounded-2xl bg-white p-3 shadow-card">
            <p className="mb-2 text-sm font-extrabold text-muted">
              {t("Дневник исследователя: какие суммы получились?", "Tadqiqotchi kundaligi: qanday yigʻindilar chiqdi?")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[8, 9, 10, 11, 12, 13].map((s) => (
                <span
                  key={s}
                  className={cn(
                    "flex h-10 min-w-10 items-center justify-center rounded-xl px-2 text-lg font-black",
                    found.includes(s)
                      ? "bg-[#a21caf] text-white"
                      : "border-2 border-dashed border-[#e9d5ff] text-[#c4b5fd]",
                  )}
                  title={found.includes(s) ? t("получилось", "chiqdi") : t("ещё не получалось", "hali chiqmagan")}
                >
                  {s}
                </span>
              ))}
            </div>
            {found.length === sums.length && (
              <p className="mt-2 text-sm font-bold text-[#86198f]">
                {t(
                  "Ты нашёл все возможные суммы! А почему не получаются 8 и 13?",
                  "Mumkin boʻlgan hamma yigʻindilarni topding! Nega 8 va 13 chiqmaydi?",
                )}
              </p>
            )}
          </div>
        </div>
      </div>
      <Feedback state={feedback} />
    </div>
  );
}
