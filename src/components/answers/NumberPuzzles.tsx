"use client";

import { useRef, useState } from "react";
import { RichText } from "@/components/RichText";
import { Button, cn } from "@/components/ui";
import type { AnswerSpec } from "@/content/types";
import { signsValue } from "@/lib/checks";
import { evaluate, prettyExpression, usesForbidden } from "@/lib/expression";
import { askExplain, praise, retrySub } from "@/lib/feedback";
import { addFound, markSolved, recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { Feedback, type FeedbackState } from "./Feedback";

type SignsSpec = Extract<AnswerSpec, { kind: "signs" }>;
type RulesSpec = Extract<AnswerSpec, { kind: "rules" }>;

// ---------------------------------------------------------------------------
// Знаки + и −
// ---------------------------------------------------------------------------

export function SignsPuzzle({ taskId, spec, hintsLeft }: { taskId: string; spec: SignsSpec; hintsLeft: boolean }) {
  const progress = useTask(taskId);
  const [signs, setSigns] = useState<("+" | "−" | "")[][]>(
    () => (progress.input?.signs as ("+" | "−" | "")[][]) ?? spec.rows.map((r) => r.answer.map(() => "")),
  );
  const [results, setResults] = useState<(number | null)[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);

  const toggle = (row: number, i: number) => {
    const next = signs.map((r) => [...r]);
    next[row][i] = next[row][i] === "+" ? "−" : "+";
    setSigns(next);
    setResults([]);
    setFeedback(null);
    saveTaskInput(taskId, { signs: next });
  };

  const filled = signs.every((r) => r.every((s) => s !== ""));

  const check = () => {
    const n = attempts.current++;
    const values = spec.rows.map((row, i) => signsValue(row.numbers, signs[i] as ("+" | "−")[]));
    setResults(values);
    const ok = values.every((v, i) => v === spec.rows[i].result);
    recordCheck(taskId, ok);
    setFeedback(
      ok
        ? { tone: "success", text: praise(n), sub: askExplain(n) }
        : { tone: "retry", text: "Посмотри, что получается в каждой строчке.", sub: retrySub(n, hintsLeft) },
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted">Нажимай на окошки: + или −.</p>
      <div className="space-y-3">
        {spec.rows.map((row, ri) => (
          <div key={ri} className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-white px-3 py-2.5 shadow-card">
            {row.numbers.map((num, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="tabular text-3xl font-black">{num}</span>
                {i < row.numbers.length - 1 && (
                  <button
                    type="button"
                    onClick={() => toggle(ri, i)}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl border-2 text-3xl font-black transition",
                      signs[ri][i]
                        ? "border-brand bg-brand-soft text-brand-dark"
                        : "border-dashed border-brand/60 bg-white text-brand/40",
                    )}
                    aria-label={`Знак ${i + 1}: ${signs[ri][i] || "пусто"}`}
                  >
                    {signs[ri][i] || "?"}
                  </button>
                )}
              </span>
            ))}
            <span className="text-3xl font-black">= {row.result}</span>
            {results[ri] !== undefined && results[ri] !== null && (
              <span
                className={cn(
                  "ml-2 rounded-lg px-2 py-0.5 text-sm font-extrabold",
                  results[ri] === row.result ? "bg-mint-soft text-[#047857]" : "bg-sun-soft text-[#7a4b00]",
                )}
              >
                {results[ri] === row.result ? "✓ верно" : `получается ${results[ri]}`}
              </span>
            )}
          </div>
        ))}
      </div>
      <Button onClick={check} size="lg" disabled={!filled}>
        Проверить
      </Button>
      <Feedback state={feedback} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Сломанный калькулятор
// ---------------------------------------------------------------------------

const KEYS = ["7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", "(", ")", "⌫"];

export function ExpressionsPuzzle({
  taskId,
  target,
  forbidden,
}: {
  taskId: string;
  target: number;
  forbidden: string[];
}) {
  const progress = useTask(taskId);
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const found = (progress.found ?? []).filter((f) => !f.startsWith("?"));

  const press = (k: string) => {
    setResult(null);
    setFeedback(null);
    if (k === "⌫") setExpr((e) => e.slice(0, -1));
    else if (expr.length < 24) setExpr((e) => e + k);
  };

  const equals = () => {
    const r = evaluate(expr);
    if (!r.ok) {
      setResult("…");
      setFeedback({
        tone: "info",
        text: "Пример записан не до конца.",
        sub: "Проверь, чтобы после каждого знака стояло число.",
      });
      return;
    }
    setResult(String(r.value));
    if (usesForbidden(expr, forbidden)) return;
    const pretty = prettyExpression(expr);
    if (r.value !== target) {
      setFeedback({
        tone: "retry",
        text: `Получилось ${r.value}, а нужно ${target}.`,
        sub: "Что нужно изменить, чтобы получилось ровно столько?",
      });
      return;
    }
    if (found.includes(pretty)) {
      setFeedback({ tone: "info", text: "Этот способ у тебя уже есть!", sub: "Найди другой." });
      return;
    }
    addFound(taskId, pretty);
    const total = found.length + 1;
    if (total >= 2) markSolved(taskId);
    setFeedback({
      tone: "success",
      text: `Получилось ${target}! Найдено способов: ${total}.`,
      sub: total === 1 ? "Отлично! А теперь найди другой способ." : "А есть способ ещё короче или необычнее?",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="w-[15.5rem] rounded-3xl bg-[#1f2937] p-3 shadow-card">
          <div className="mb-2 min-h-16 rounded-xl bg-[#d9f99d] px-3 py-2 text-right font-mono text-[#1a2e05]">
            <div className="min-h-6 text-lg break-all">{expr || " "}</div>
            <div className="text-2xl font-black">{result !== null ? `= ${result}` : " "}</div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {KEYS.map((k) => {
              const broken = forbidden.includes(k);
              return (
                <button
                  key={k}
                  type="button"
                  disabled={broken}
                  onClick={() => press(k)}
                  className={cn(
                    "relative h-11 rounded-lg text-xl font-bold transition active:scale-95",
                    broken ? "bg-[#4b5563] text-[#9ca3af]" : "bg-[#f3f4f6] text-[#111827] hover:bg-white",
                  )}
                  aria-label={broken ? `кнопка ${k} сломана` : k === "⌫" ? "стереть" : k}
                >
                  {k}
                  {broken && (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-[#ef4444]">
                      ✕
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => (setExpr(""), setResult(null), setFeedback(null))}
              className="h-11 rounded-lg bg-[#f87171] text-lg font-bold text-white"
            >
              C
            </button>
            <button
              type="button"
              onClick={equals}
              disabled={!expr}
              className="h-11 rounded-lg bg-sun text-xl font-black text-ink disabled:opacity-50"
            >
              =
            </button>
          </div>
        </div>
        {found.length > 0 && (
          <div className="min-w-48 flex-1 rounded-2xl bg-white p-3 shadow-card">
            <p className="mb-2 text-sm font-extrabold text-muted">Мои способы: {found.length}</p>
            <ul className="flex flex-wrap gap-2">
              {found.map((f) => (
                <li key={f} className="tabular rounded-xl bg-mint-soft px-3 py-1 font-extrabold text-[#065f46]">
                  {f} = {target}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Feedback state={feedback} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Несколько правил
// ---------------------------------------------------------------------------

export function RulesAnswer({ taskId, spec }: { taskId: string; spec: RulesSpec }) {
  const progress = useTask(taskId);
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const found = progress.found ?? [];
  const knownFound = found.filter((f) => !f.startsWith("?"));

  const check = () => {
    const v = Number(value);
    if (!Number.isFinite(v) || value === "") return;
    const known = spec.known.find((k) => k.value === v);
    if (known) {
      if (knownFound.includes(String(v))) {
        setFeedback({
          tone: "info",
          text: `Число ${v} у тебя уже есть.`,
          sub: "Придумай другое правило — и другое число!",
        });
      } else {
        addFound(taskId, String(v));
        recordCheck(taskId, knownFound.length + 1 >= 2);
        setFeedback({
          tone: "success",
          text: `Да, следующим может быть ${v}! Расскажи взрослому своё правило.`,
          sub:
            knownFound.length + 1 >= 2
              ? "Ты нашёл разные правила — значит, по трём числам нельзя точно узнать правило!"
              : "А теперь придумай ДРУГОЕ правило.",
        });
      }
    } else {
      addFound(taskId, `?${v}`);
      setFeedback({
        tone: "info",
        text: `Интересно! Объясни взрослому, по какому правилу получается ${v}.`,
        sub: "Если правило подходит к числам 1, 2, 4 — это тоже верный ответ.",
      });
    }
    setValue("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <label className="block">
          <span className="mb-1 block text-sm font-extrabold text-muted">{spec.label}</span>
          <input
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 3))}
            onKeyDown={(e) => e.key === "Enter" && check()}
            className="tabular h-12 w-28 rounded-xl border-2 border-line bg-white px-3 text-center text-2xl font-extrabold outline-none focus:border-brand"
            placeholder="?"
          />
        </label>
        <Button onClick={check} size="lg" disabled={!value}>
          Проверить
        </Button>
      </div>
      <Feedback state={feedback} />
      {found.length > 0 && (
        <p className="text-sm font-bold text-muted">
          Мои ответы:{" "}
          {found.map((f) => (
            <span
              key={f}
              className="mr-1.5 inline-block rounded-lg bg-brand-soft px-2 py-0.5 font-extrabold text-brand-dark"
            >
              {f.replace("?", "")}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Открытая задача
// ---------------------------------------------------------------------------

export function OpenAnswer({ taskId, prompt }: { taskId: string; prompt: string }) {
  const progress = useTask(taskId);
  const [notes, setNotes] = useState<string>(() => (progress.input?.notes as string) ?? "");
  const solved = progress.status === "solved";
  return (
    <div className="space-y-3">
      <p className="font-bold">
        <RichText text={prompt} />
      </p>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-muted">
          Можешь записать здесь свои мысли (необязательно):
        </span>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            saveTaskInput(taskId, { notes: e.target.value });
          }}
          rows={3}
          className="w-full rounded-2xl border-2 border-line bg-white px-3 py-2 text-lg outline-none focus:border-brand"
        />
      </label>
      <Button variant={solved ? "success" : "primary"} size="lg" onClick={() => markSolved(taskId)} disabled={solved}>
        {solved ? "✓ Готово" : "✅ Я решил и рассказал взрослому"}
      </Button>
    </div>
  );
}
