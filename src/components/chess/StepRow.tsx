import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/components/ui";

/** Шаг в полоске: решён, решён с ошибками (контрольный тест) или ещё открыт. */
export interface Step {
  key: string;
  /** Название для экранного диктора: «Упражнение 2: Ходы пешки (решено)». */
  label: string;
  state: "done" | "retry" | "open";
}

/**
 * Строка над упражнением: «закрыть», полоска шагов и, если нужно, кнопка справа — всё в одну строку.
 *
 * Атрибут `data-focus-screen` на телефоне и планшете убирает шапку и подвал сайта (правило в `globals.css`):
 * место отдано заданию и доске. Так устроены экраны упражнений курса и тактики; здесь то же — отдельным
 * компонентом, для страниц уровней и контрольных тестов.
 */
export function StepRow({
  closeLabel,
  onClose,
  stripLabel,
  steps,
  current,
  onStep,
  end,
}: {
  closeLabel: string;
  onClose: () => void;
  stripLabel: string;
  steps: readonly Step[];
  current: number;
  onStep: (index: number) => void;
  end?: ReactNode;
}) {
  return (
    <div data-focus-screen className="flex items-center gap-1">
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl hover:bg-black/5"
      >
        <X className="h-6 w-6" strokeWidth={2.5} aria-hidden />
      </button>
      <ol data-step-strip className="flex min-w-0 flex-1 items-center gap-1" aria-label={stripLabel}>
        {steps.map((step, i) => (
          <li key={step.key} className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onStep(i)}
              aria-label={step.label}
              aria-current={i === current ? "step" : undefined}
              className="flex h-11 w-full items-center"
            >
              <span
                aria-hidden
                className={cn(
                  "block w-full rounded-full",
                  i === current ? "h-3.5" : "h-2.5",
                  step.state === "done"
                    ? "bg-mint"
                    : step.state === "retry"
                      ? "bg-sun"
                      : i === current
                        ? "bg-brand"
                        : "bg-line",
                )}
              />
            </button>
          </li>
        ))}
      </ol>
      {end}
    </div>
  );
}
