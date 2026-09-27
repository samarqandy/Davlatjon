"use client";

import { Fragment, useRef, useState } from "react";
import { Button, cn } from "@/components/ui";
import type { PerformerPuzzle as PerformerSpec } from "@/content/types";
import { askExplain, praise } from "@/lib/feedback";
import {
  applyCommand,
  commandLabel,
  commandName,
  inRange,
  onlyGrows,
  performerBounds,
  runPerformer,
} from "@/lib/performer";
import { plural, pluralize } from "@/lib/plural";
import { addFound, recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { Feedback, type FeedbackState } from "./Feedback";

const MAX_COMMANDS = 30;

/** Числовой луч с прыжками исполнителя. */
export function NumberLine({ puzzle, values }: { puzzle: PerformerSpec; values: number[] }) {
  const { min, max } = performerBounds(puzzle);
  const step = 26;
  const pad = 16;
  const W = (max - min) * step + pad * 2;
  const baseY = 70;
  const x = (v: number) => pad + (v - min) * step;
  const current = values[values.length - 1];
  return (
    <div className="max-w-full overflow-x-auto pb-1">
      <svg
        width={W}
        height={96}
        viewBox={`0 0 ${W} 96`}
        role="img"
        aria-label={`Числовой луч от ${min} до ${max}. ${puzzle.name} на числе ${current}`}
      >
        <line x1={pad - 8} y1={baseY} x2={W - 4} y2={baseY} stroke="#1d2140" strokeWidth="2.5" />
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((v) => (
          <g key={v}>
            <line x1={x(v)} y1={baseY - 6} x2={x(v)} y2={baseY + 6} stroke="#1d2140" strokeWidth="2" />
            <text
              x={x(v)}
              y={baseY + 22}
              textAnchor="middle"
              fontSize="13"
              fontWeight={v === puzzle.target ? 900 : 700}
              fill={v === puzzle.target ? "#b45309" : "#1d2140"}
            >
              {v}
            </text>
          </g>
        ))}
        <circle cx={x(puzzle.target)} cy={baseY} r={7} fill="#fde68a" stroke="#b45309" strokeWidth="2" />
        {values.slice(1).map((v, i) => {
          const from = x(values[i]);
          const to = x(v);
          const mid = (from + to) / 2;
          const lift = Math.min(40, 12 + Math.abs(to - from) / 4);
          return (
            <path
              key={i}
              d={`M ${from} ${baseY - 4} Q ${mid} ${baseY - 4 - lift * 2} ${to} ${baseY - 4}`}
              fill="none"
              stroke={v > values[i] ? "#4f46e5" : "#e11d48"}
              strokeWidth="2.5"
              strokeDasharray={i === values.length - 2 ? undefined : "5 4"}
              opacity={i === values.length - 2 ? 1 : 0.55}
            />
          );
        })}
        <text x={x(current)} y={baseY - 12} textAnchor="middle" fontSize="24">
          {puzzle.emoji}
        </text>
      </svg>
    </div>
  );
}

export function PerformerPuzzle({
  taskId,
  puzzle,
  hintsLeft,
}: {
  taskId: string;
  puzzle: PerformerSpec;
  hintsLeft: boolean;
}) {
  const progress = useTask(taskId);
  const [program, setProgram] = useState<number[]>(() => {
    const saved = progress.input?.program;
    return Array.isArray(saved) && runPerformer(puzzle, saved as number[]).failedAt === null ? (saved as number[]) : [];
  });
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const { values } = runPerformer(puzzle, program);
  const current = values[values.length - 1];
  const { min, max } = performerBounds(puzzle);

  const update = (next: number[]) => {
    setProgram(next);
    saveTaskInput(taskId, { program: next });
  };

  const evaluate = (prog: number[]) => {
    const n = attempts.current++;
    const len = prog.length;
    recordCheck(taskId, true);
    addFound(taskId, `len:${len}`);
    setFeedback(
      len <= puzzle.optimal
        ? {
            tone: "success",
            text: `${praise(n)} Получилось ${puzzle.target}!`,
            sub: `Программа из ${pluralize(len, "команды", "команд", "команд")} — короче не бывает. ${askExplain(n)}`,
          }
        : {
            tone: "success",
            text: `Получилось ${puzzle.target}! Программа из ${pluralize(len, "команды", "команд", "команд")}.`,
            sub: "А можно короче? Попробуй найти программу покороче.",
          },
    );
  };

  const press = (i: number) => {
    if (program.length >= MAX_COMMANDS) {
      setFeedback({
        tone: "info",
        text: "Программа получилась очень длинной.",
        sub: "Начни сначала — и поищи путь короче.",
      });
      return;
    }
    const next = applyCommand(current, puzzle.commands[i]);
    if (!inRange(puzzle, next)) {
      setFeedback({
        tone: "info",
        text:
          next < min
            ? puzzle.line
              ? `${puzzle.name} не может прыгнуть левее ${min}.`
              : `${puzzle.name} не работает с числами меньше ${min}.`
            : puzzle.line
              ? `${puzzle.name} не может прыгнуть правее ${max}.`
              : `${puzzle.name} не работает с числами больше ${max}.`,
        sub: "Попробуй другую команду.",
      });
      return;
    }
    const prog = [...program, i];
    update(prog);
    if (next === puzzle.target) evaluate(prog);
    else if (next > puzzle.target && onlyGrows(puzzle)) {
      const n = attempts.current++;
      setFeedback({
        tone: "retry",
        text: `Уже ${next} — больше, чем ${puzzle.target}.`,
        sub: `${puzzle.name} умеет только увеличивать число. Нажми «Отменить» и попробуй по-другому.${
          n >= 2 && hintsLeft ? " Можно открыть подсказку 💡" : ""
        }`,
      });
    } else setFeedback(null);
  };

  const undo = () => {
    update(program.slice(0, -1));
    setFeedback(null);
  };

  const reset = () => {
    update([]);
    setFeedback(null);
  };

  const reached = current === puzzle.target;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-4xl" aria-hidden>
              {puzzle.emoji}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-muted">{puzzle.name}</p>
              <p className="text-sm font-bold text-muted">
                Начало: <b className="text-ink">{puzzle.start}</b> · Цель:{" "}
                <b className="text-[#b45309]">{puzzle.target}</b>
              </p>
            </div>
          </div>
          <div
            className={cn(
              "tabular ml-auto flex h-16 min-w-24 items-center justify-center rounded-2xl border-2 px-4 text-4xl font-black",
              reached ? "border-mint bg-mint-soft text-[#047857]" : "border-brand/30 bg-paper text-ink",
            )}
            aria-live="polite"
            aria-label={`Сейчас число ${current}`}
          >
            {current}
          </div>
        </div>
        {puzzle.line && (
          <div className="mt-3">
            <NumberLine puzzle={puzzle} values={values} />
          </div>
        )}
        {program.length > 0 && (
          <p
            className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1.5 text-lg font-extrabold"
            aria-label="Числа по дороге"
          >
            {values.map((v, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <span className="inline-flex items-center text-sm text-brand">
                    <span className="rounded-md bg-brand-soft px-1.5 py-0.5">
                      {commandLabel(puzzle.commands[program[i - 1]])}
                    </span>
                    <span aria-hidden>→</span>
                  </span>
                )}
                <span className={cn("tabular rounded-lg px-1.5", i === values.length - 1 && "bg-sun-soft")}>{v}</span>
              </Fragment>
            ))}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-stretch gap-2" role="group" aria-label="Команды">
        {puzzle.commands.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => press(i)}
            className="flex min-w-28 flex-col items-center justify-center rounded-2xl bg-brand px-4 py-2 text-white shadow-[0_4px_0_0_#3730a3] transition active:translate-y-[2px] active:shadow-[0_2px_0_0_#3730a3]"
            aria-label={`Команда: ${commandName(c)}`}
          >
            <span className="text-3xl font-black">{commandLabel(c)}</span>
            <span className="text-xs font-bold text-white/85">{commandName(c)}</span>
          </button>
        ))}
        <div className="flex flex-col gap-1.5">
          <Button variant="secondary" size="sm" onClick={undo} disabled={program.length === 0}>
            ⌫ Отменить
          </Button>
          <Button variant="ghost" size="sm" onClick={reset} disabled={program.length === 0}>
            Сначала
          </Button>
        </div>
      </div>

      <p className="text-sm font-bold text-muted">
        Программа:{" "}
        {program.length === 0 ? (
          "пока пусто — нажимай команды"
        ) : (
          <>
            <span className="text-ink">{program.map((i) => commandLabel(puzzle.commands[i])).join("  ")}</span> ·{" "}
            {program.length} {plural(program.length, "команда", "команды", "команд")}
          </>
        )}
      </p>

      <Feedback state={feedback} />
    </div>
  );
}
