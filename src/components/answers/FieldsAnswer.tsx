"use client";

import { useRef, useState } from "react";
import { cn } from "@/components/ui";
import type { Field } from "@/content/types";
import { checkFields } from "@/lib/checks";
import { askExplain, praise, retrySub, retryTitle } from "@/lib/feedback";
import { useLang, useT } from "@/lib/i18n";
import { recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { CheckButton } from "./CheckButton";
import { Feedback, type FeedbackState } from "./Feedback";

export function FieldsAnswer({ taskId, fields, hintsLeft }: { taskId: string; fields: Field[]; hintsLeft: boolean }) {
  const t = useT();
  const lang = useLang();
  const progress = useTask(taskId);
  const [values, setValues] = useState<Record<string, string>>(
    () => (progress.input?.fields as Record<string, string>) ?? {},
  );
  const [marks, setMarks] = useState<Record<string, boolean | null>>({});
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);

  const set = (id: string, v: string) => {
    const next = { ...values, [id]: v };
    setValues(next);
    setMarks((m) => ({ ...m, [id]: null }));
    // Подсказка «сначала впиши ответ» устарела, как только ребёнок начал писать.
    setFeedback((f) => (f?.tone === "info" ? null : f));
    saveTaskInput(taskId, { fields: next });
  };

  const allFilled = fields.every((f) => isFilled(f, values[f.id] ?? ""));

  const check = () => {
    const res = checkFields(fields, values);
    const n = attempts.current++;
    setMarks(res.perField);
    recordCheck(taskId, res.allCorrect);
    if (res.allCorrect) {
      setFeedback({ tone: "success", text: praise(n, lang), sub: askExplain(n, lang) });
    } else {
      const some = Object.values(res.perField).some((v) => v === true);
      setFeedback({
        tone: "retry",
        text:
          some && fields.length > 1
            ? t(
                "Часть ответа сходится ✓ — проверь остальное.",
                "Javobning bir qismi toʻgʻri ✓ — qolganini tekshirib koʻr.",
              )
            : retryTitle(n, lang),
        sub: retrySub(n, hintsLeft, lang),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <div
            key={f.id}
            className={cn(
              "rounded-2xl border-2 bg-white px-3 py-2.5 transition",
              marks[f.id] === true ? "border-mint" : "border-line",
            )}
          >
            <label className="mb-1.5 block text-sm font-extrabold text-muted" htmlFor={`${taskId}-${f.id}`}>
              {f.label}
              {marks[f.id] === true && <span className="ml-1.5 text-mint">✓</span>}
            </label>
            {f.type === "number" && (
              <div className="flex items-center gap-2">
                <input
                  id={`${taskId}-${f.id}`}
                  inputMode="numeric"
                  autoComplete="off"
                  value={values[f.id] ?? ""}
                  onChange={(e) =>
                    // Минус нужен только там, где ответ — отрицательное число.
                    set(f.id, e.target.value.replace(f.answer < 0 ? /[^\d-]/g : /[^\d]/g, "").slice(0, 5))
                  }
                  onKeyDown={(e) => e.key === "Enter" && allFilled && check()}
                  className="tabular h-12 w-28 rounded-xl border-2 border-line bg-paper px-3 text-center text-2xl font-extrabold outline-none focus:border-brand"
                  placeholder="?"
                />
                {f.suffix && <span className="font-bold text-muted">{f.suffix}</span>}
              </div>
            )}
            {f.type === "time" && (
              <TimeInput id={`${taskId}-${f.id}`} value={values[f.id] ?? ""} onChange={(v) => set(f.id, v)} />
            )}
            {f.type === "coord" && (
              <CoordInput cols={f.cols} rows={f.rows} value={values[f.id] ?? ""} onChange={(v) => set(f.id, v)} />
            )}
            {f.type === "text" && (
              <input
                id={`${taskId}-${f.id}`}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={values[f.id] ?? ""}
                onChange={(e) => set(f.id, e.target.value.toUpperCase().slice(0, 24))}
                onKeyDown={(e) => e.key === "Enter" && allFilled && check()}
                className="h-12 w-full max-w-64 rounded-xl border-2 border-line bg-paper px-3 text-2xl font-extrabold tracking-widest uppercase outline-none focus:border-brand"
                placeholder={t("слово", "soʻz")}
              />
            )}
          </div>
        ))}
      </div>
      <CheckButton ready={allFilled} onCheck={check} onNotReady={setFeedback} />
      <Feedback state={feedback} />
    </div>
  );
}

function isFilled(f: Field, v: string): boolean {
  switch (f.type) {
    case "number":
      return /^-?\d+$/.test(v.trim());
    case "time":
      return /^\d{1,2}:\d{2}$/.test(v);
    case "coord":
      return f.cols.some((c) => v.startsWith(c)) && /\d$/.test(v);
    case "text":
      return v.trim().length > 0;
  }
}

function TimeInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const t = useT();
  const [h = "", m = ""] = value.split(":");
  const minutesRef = useRef<HTMLInputElement>(null);
  const cls =
    "h-12 w-16 rounded-xl border-2 border-line bg-paper px-2 text-center text-2xl font-extrabold tabular outline-none focus:border-brand";
  return (
    <div className="flex items-center gap-1.5">
      <input
        id={id}
        inputMode="numeric"
        aria-label={t("часы", "soat")}
        placeholder={t("чч", "ss")}
        value={h}
        className={cls}
        onChange={(e) => {
          const nh = e.target.value.replace(/\D/g, "").slice(0, 2);
          onChange(`${nh}:${m}`);
          if (nh.length === 2) minutesRef.current?.focus();
        }}
      />
      <span className="text-2xl font-black">:</span>
      <input
        ref={minutesRef}
        inputMode="numeric"
        aria-label={t("минуты", "daqiqa")}
        placeholder={t("мм", "dd")}
        value={m}
        className={cls}
        onChange={(e) => onChange(`${h}:${e.target.value.replace(/\D/g, "").slice(0, 2)}`)}
      />
    </div>
  );
}

function CoordInput({
  cols,
  rows,
  value,
  onChange,
}: {
  cols: string[];
  rows: number;
  value: string;
  onChange: (v: string) => void;
}) {
  const t = useT();
  const col = cols.find((c) => value.startsWith(c)) ?? "";
  const row = value.slice(col.length);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="flex h-12 min-w-16 items-center justify-center rounded-xl border-2 border-line bg-paper px-3 text-2xl font-extrabold">
          {col || "·"}
          {row || "·"}
        </span>
      </div>
      <div className="flex flex-wrap gap-1" role="group" aria-label={t("Буква столбца", "Ustun harfi")}>
        {cols.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(`${c}${row}`)}
            className={cn(
              "h-10 w-10 rounded-xl border-2 text-lg font-extrabold",
              c === col ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1" role="group" aria-label={t("Номер строки", "Qator raqami")}>
        {Array.from({ length: rows }, (_, i) => String(i + 1)).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange(`${col}${r}`)}
            className={cn(
              "h-10 w-10 rounded-xl border-2 text-lg font-extrabold",
              r === row ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40",
            )}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
