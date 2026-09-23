"use client";

import { useRef, useState } from "react";
import { Button, cn } from "@/components/ui";
import { PolyominoVisual, ShapeIcon } from "@/components/visuals/shapes";
import type { AnswerSpec, Option } from "@/content/types";
import { checkAssign, checkChoice, checkOrder, orderMatches } from "@/lib/checks";
import { askExplain, praise, retrySub, retryTitle } from "@/lib/feedback";
import { recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { Feedback, type FeedbackState } from "./Feedback";

type ChoiceSpec = Extract<AnswerSpec, { kind: "choice" }>;
type AssignSpec = Extract<AnswerSpec, { kind: "assign" }>;
type OrderSpec = Extract<AnswerSpec, { kind: "order" }>;

function OptionContent({ option }: { option: Option }) {
  if (option.visual?.type === "shape") {
    return (
      <span className="flex flex-col items-center gap-1">
        <span className="text-sm font-black text-muted">{option.label}</span>
        <ShapeIcon shape={option.visual.shape} size={52} />
      </span>
    );
  }
  if (option.visual?.type === "polyomino") {
    return (
      <span className="flex flex-col items-center gap-2">
        <span className="text-base font-black text-muted">{option.label}</span>
        <PolyominoVisual cells={option.visual.cells} size={24} />
      </span>
    );
  }
  return <span className="text-lg font-bold">{option.label}</span>;
}

export function ChoiceAnswer({ taskId, spec, hintsLeft }: { taskId: string; spec: ChoiceSpec; hintsLeft: boolean }) {
  const progress = useTask(taskId);
  const [selected, setSelected] = useState<string[]>(() => (progress.input?.choice as string[]) ?? []);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);

  const toggle = (id: string) => {
    const next = spec.multiple ? (selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]) : [id];
    setSelected(next);
    setFeedback(null);
    saveTaskInput(taskId, { choice: next });
  };

  const check = () => {
    const res = checkChoice(spec, selected);
    const n = attempts.current++;
    recordCheck(taskId, res.correct);
    if (res.correct) setFeedback({ tone: "success", text: praise(n), sub: askExplain(n) });
    else if (spec.multiple && res.extra === 0)
      setFeedback({
        tone: "retry",
        text: "Всё, что ты отметил, подходит! Но это ещё не всё.",
        sub: "Найди остальные варианты.",
      });
    else if (spec.multiple && res.missing === 0)
      setFeedback({
        tone: "retry",
        text: "Проверь каждый отмеченный вариант ещё раз.",
        sub: "Один из них, похоже, лишний.",
      });
    else setFeedback({ tone: "retry", text: retryTitle(n), sub: retrySub(n, hintsLeft) });
  };

  const hasVisuals = spec.options.some((o) => o.visual);

  return (
    <div className="space-y-4">
      <p className="font-bold">{spec.prompt}</p>
      <div className={cn("grid gap-2", hasVisuals ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2")}>
        {spec.options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              aria-pressed={on}
              className={cn(
                "flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 transition",
                on
                  ? "border-brand bg-brand-soft shadow-[inset_0_0_0_2px_var(--color-brand)]"
                  : "border-line bg-white hover:border-brand/40",
                !hasVisuals && "justify-start text-left",
              )}
            >
              {spec.multiple && !hasVisuals && (
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-sm",
                    on ? "border-brand bg-brand text-white" : "border-line",
                  )}
                >
                  {on ? "✓" : ""}
                </span>
              )}
              <OptionContent option={o} />
            </button>
          );
        })}
      </div>
      <Button onClick={check} disabled={selected.length === 0} size="lg">
        Проверить
      </Button>
      <Feedback state={feedback} />
    </div>
  );
}

export function AssignAnswer({ taskId, spec, hintsLeft }: { taskId: string; spec: AssignSpec; hintsLeft: boolean }) {
  const progress = useTask(taskId);
  const [values, setValues] = useState<Record<string, string>>(
    () => (progress.input?.assign as Record<string, string>) ?? {},
  );
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);

  const set = (item: string, option: string) => {
    const next = { ...values, [item]: option };
    setValues(next);
    setFeedback(null);
    saveTaskInput(taskId, { assign: next });
  };

  const check = () => {
    const res = checkAssign(spec, values);
    const n = attempts.current++;
    recordCheck(taskId, res.allCorrect);
    if (res.allCorrect) setFeedback({ tone: "success", text: praise(n), sub: askExplain(n) });
    else
      setFeedback({
        tone: "retry",
        text: `Сходится: ${res.correctCount} из ${res.total}.`,
        sub: retrySub(n, hintsLeft),
      });
  };

  const filled = spec.items.every((i) => values[i.id]);

  return (
    <div className="space-y-4">
      <p className="font-bold">{spec.prompt}</p>
      <div className="space-y-2">
        {spec.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2"
          >
            <span className="min-w-32 font-extrabold">{item.label}</span>
            <div className="flex flex-wrap gap-1.5">
              {spec.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => set(item.id, o.id)}
                  aria-pressed={values[item.id] === o.id}
                  className={cn(
                    "h-11 min-w-11 rounded-xl border-2 px-3 text-lg font-bold transition",
                    values[item.id] === o.id
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-paper hover:border-brand/40",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button onClick={check} disabled={!filled} size="lg">
        Проверить
      </Button>
      <Feedback state={feedback} />
    </div>
  );
}

export function OrderAnswer({ taskId, spec, hintsLeft }: { taskId: string; spec: OrderSpec; hintsLeft: boolean }) {
  const progress = useTask(taskId);
  const [order, setOrder] = useState<string[]>(() => (progress.input?.order as string[]) ?? []);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const label = (id: string) => spec.items.find((i) => i.id === id)?.label ?? id;

  const update = (next: string[]) => {
    setOrder(next);
    setFeedback(null);
    saveTaskInput(taskId, { order: next });
  };

  const check = () => {
    const ok = checkOrder(spec, order);
    const n = attempts.current++;
    recordCheck(taskId, ok);
    if (ok) setFeedback({ tone: "success", text: praise(n), sub: askExplain(n) });
    else
      setFeedback({
        tone: "retry",
        text: `На своих местах: ${orderMatches(spec, order)} из ${spec.items.length}.`,
        sub: retrySub(n, hintsLeft),
      });
  };

  return (
    <div className="space-y-4">
      <p className="font-bold">{spec.prompt}</p>
      <div className="flex flex-wrap gap-2">
        {spec.items
          .filter((i) => !order.includes(i.id))
          .map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => update([...order, i.id])}
              className="h-12 rounded-2xl border-2 border-line bg-white px-4 text-lg font-bold hover:border-brand/40"
            >
              {i.label}
            </button>
          ))}
      </div>
      <ol className="flex flex-wrap items-center gap-2">
        {spec.items.map((_, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {order[idx] ? (
              <button
                type="button"
                onClick={() => update(order.filter((_, j) => j !== idx))}
                className="h-12 rounded-2xl border-2 border-brand bg-brand-soft px-4 text-lg font-extrabold text-brand-dark"
                aria-label={`${idx + 1}: ${label(order[idx])}. Нажми, чтобы убрать`}
              >
                <span className="mr-1.5 text-sm opacity-60">{idx + 1}.</span>
                {label(order[idx])}
              </button>
            ) : (
              <span className="flex h-12 min-w-20 items-center justify-center rounded-2xl border-2 border-dashed border-line px-4 font-bold text-muted">
                {idx + 1}.
              </span>
            )}
            {idx < spec.items.length - 1 && <span className="text-xl font-black text-muted">›</span>}
          </li>
        ))}
      </ol>
      <div className="flex gap-2">
        <Button onClick={check} disabled={order.length !== spec.items.length} size="lg">
          Проверить
        </Button>
        <Button variant="ghost" size="lg" onClick={() => update([])} disabled={order.length === 0}>
          Сначала
        </Button>
      </div>
      <Feedback state={feedback} />
    </div>
  );
}
