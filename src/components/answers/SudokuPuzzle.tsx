"use client";

import { useRef, useState } from "react";
import { cn } from "@/components/ui";
import { askExplain, praise, retrySub } from "@/lib/feedback";
import { useLang, useT } from "@/lib/i18n";
import { sudokuConflicts, type SudokuGrid } from "@/lib/sudoku";
import { recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { CheckButton } from "./CheckButton";
import { Feedback, type FeedbackState } from "./Feedback";

/** Толстые линии между прямоугольниками судоку. */
function borders(r: number, c: number, n: number, box: readonly [number, number]) {
  const thick = "3px solid #1d2140";
  const thin = "1px solid #cbd5e1";
  return {
    borderTop: r === 0 || r % box[1] === 0 ? thick : thin,
    borderLeft: c === 0 || c % box[0] === 0 ? thick : thin,
    borderBottom: r === n - 1 ? thick : undefined,
    borderRight: c === n - 1 ? thick : undefined,
  };
}

/** Сетка судоку для печати: только данные числа. */
export function SudokuPrint({ grid, box }: { grid: SudokuGrid; box: readonly [number, number] }) {
  const n = grid.length;
  return (
    <div className="inline-grid" style={{ gridTemplateColumns: `repeat(${n}, 13mm)` }}>
      {grid.map((row, r) =>
        row.map((v, c) => (
          <span
            key={`${r}-${c}`}
            className="flex h-[13mm] items-center justify-center text-2xl font-black"
            style={borders(r, c, n, box)}
          >
            {v ?? ""}
          </span>
        )),
      )}
    </div>
  );
}

export function SudokuPuzzle({
  taskId,
  grid,
  box,
  hintsLeft,
}: {
  taskId: string;
  grid: SudokuGrid;
  box: [number, number];
  hintsLeft: boolean;
}) {
  const t = useT();
  const lang = useLang();
  const progress = useTask(taskId);
  const n = grid.length;
  const [values, setValues] = useState<Record<string, string>>(
    () => (progress.input?.sudoku as Record<string, string>) ?? {},
  );
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);

  const filledGrid = (): SudokuGrid =>
    grid.map((row, r) => row.map((v, c) => v ?? (values[`${r}-${c}`] ? Number(values[`${r}-${c}`]) : null)));
  const blanks = grid.flatMap((row, r) => row.flatMap((v, c) => (v === null ? [`${r}-${c}`] : [])));
  const filled = blanks.every((k) => values[k]);

  const set = (key: string, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const v = digit && Number(digit) >= 1 && Number(digit) <= n ? digit : "";
    const next = { ...values, [key]: v };
    setValues(next);
    setConflicts(new Set());
    setFeedback(null);
    saveTaskInput(taskId, { sudoku: next });
  };

  const check = () => {
    const i = attempts.current++;
    const bad = sudokuConflicts(filledGrid(), box);
    setConflicts(bad);
    const ok = filled && bad.size === 0;
    recordCheck(taskId, ok);
    setFeedback(
      ok
        ? {
            tone: "success",
            text: praise(i, lang),
            sub: t(
              `В каждой строке, столбце и квадрате — все числа! ${askExplain(i, lang)}`,
              `Har bir qator, ustun va kvadratda hamma sonlar bor! ${askExplain(i, lang)}`,
            ),
          }
        : {
            tone: "retry",
            text: t(
              "Посмотри на клетки, выделенные жёлтым: там числа повторяются.",
              "Sariq rangli kataklarga qara: u yerda sonlar takrorlanyapti.",
            ),
            sub: retrySub(i, hintsLeft, lang),
          },
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted">
        {t(`Впиши в пустые клетки числа от 1 до ${n}.`, `Boʻsh kataklarga 1 dan ${n} gacha sonlarni yoz.`)}
      </p>
      <div
        className="inline-grid rounded-xl bg-white p-1 shadow-card"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 4rem))` }}
      >
        {grid.map((row, r) =>
          row.map((v, c) => {
            const key = `${r}-${c}`;
            const bad = conflicts.has(key);
            return (
              <div
                key={key}
                className={cn(
                  "tabular flex h-16 w-16 items-center justify-center text-3xl font-black",
                  bad ? "bg-sun-soft" : v !== null ? "bg-[#f1f5f9]" : "bg-white",
                )}
                style={borders(r, c, n, box)}
              >
                {v !== null ? (
                  <span className="text-[#475569]">{v}</span>
                ) : (
                  <input
                    inputMode="numeric"
                    aria-label={t(`Строка ${r + 1}, столбец ${c + 1}`, `${r + 1}-qator, ${c + 1}-ustun`)}
                    value={values[key] ?? ""}
                    onChange={(e) => set(key, e.target.value)}
                    className="h-full w-full bg-transparent text-center text-3xl font-black text-brand-dark outline-none focus:bg-brand-soft"
                    placeholder="·"
                  />
                )}
              </div>
            );
          }),
        )}
      </div>
      <div>
        <CheckButton
          ready={filled}
          onCheck={check}
          onNotReady={setFeedback}
          missing={["✏️ Впиши цифры во все пустые клетки", "✏️ Boʻsh kataklarning hammasiga raqam yoz"]}
        />
      </div>
      <Feedback state={feedback} />
    </div>
  );
}
