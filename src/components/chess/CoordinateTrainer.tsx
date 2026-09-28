"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, cn } from "@/components/ui";
import { legalTargets, pieceAt } from "@/lib/chess";
import {
  DRILL_SECONDS,
  randomSquare,
  readTask,
  readTaskSolved,
  squareColor,
  squareOptions,
  type DrillMode,
  type ReadTask,
} from "@/lib/drills";
import { random } from "@/lib/random";
import { chessDrillRecord, useHydrated, useStore } from "@/lib/store";
import { ChessBoard, type SquareMark } from "./ChessBoard";

const EMPTY = "8/8/8/8/8/8/8/8 w - - 0 1";

const MODES: { id: DrillMode; emoji: string; title: string; about: string }[] = [
  { id: "find", emoji: "🎯", title: "Найди клетку", about: "Показано имя клетки — нажми на неё на доске." },
  { id: "name", emoji: "🔤", title: "Назови клетку", about: "Клетка подсвечена — выбери её имя." },
  {
    id: "color",
    emoji: "⚫⚪",
    title: "Какого цвета?",
    about: "Без доски: светлая клетка или тёмная? Шаг к игре вслепую.",
  },
  {
    id: "read",
    emoji: "📜",
    title: "Прочитай ход",
    about: "Запись вроде «Кf3» или «Сxc6» — сделай этот ход на доске.",
  },
];

export function CoordinateTrainer() {
  const [mode, setMode] = useState<DrillMode | null>(null);
  const records = useStore((s) => s.chessDrills);
  const hydrated = useHydrated();
  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← Шахматная школа
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Тренажёр</p>
        <h1 className="text-3xl font-black">Координаты и запись ходов</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Сильные шахматисты видят доску с закрытыми глазами и читают партии из книг. Тренируйся по полминуты — и имена
          клеток и русская запись ходов станут родными.
        </p>
      </header>
      {mode ? (
        <Drill key={mode} mode={mode} onExit={() => setMode(null)} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className="flex flex-col rounded-3xl bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5"
            >
              <span className="text-3xl" aria-hidden>
                {m.emoji}
              </span>
              <span className="mt-1 text-xl font-black">{m.title}</span>
              <span className="mt-1 flex-1 text-sm text-muted">{m.about}</span>
              <span className="mt-3 text-xs font-extrabold text-brand-dark">
                {DRILL_SECONDS[m.id]} секунд
                {hydrated && records[m.id] ? ` · рекорд ${records[m.id]}` : ""}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface Round {
  target: string;
  options: string[];
  task: ReadTask | null;
}

function newRound(mode: DrillMode, prev?: string): Round {
  if (mode === "read") return { target: "", options: [], task: readTask(random) };
  const target = randomSquare(random, prev);
  return { target, options: mode === "name" ? squareOptions(target, random) : [], task: null };
}

function Drill({ mode, onExit }: { mode: DrillMode; onExit: () => void }) {
  const meta = MODES.find((m) => m.id === mode)!;
  const record = useStore((s) => s.chessDrills[mode] ?? 0);
  const [round, setRound] = useState<Round>(() => newRound(mode));
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [flash, setFlash] = useState<{ sq: string; ok: boolean } | null>(null);
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [labels, setLabels] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const running = endsAt !== null && now < endsAt;
  const over = endsAt !== null && now >= endsAt;
  const left = endsAt === null ? DRILL_SECONDS[mode] : Math.max(0, Math.ceil((endsAt - now) / 1000));

  useEffect(() => {
    if (endsAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [endsAt]);

  useEffect(() => {
    if (over) chessDrillRecord(mode, score);
  }, [over, mode, score]);

  const start = () => {
    const t = Date.now();
    setNow(t);
    setEndsAt(t + DRILL_SECONDS[mode] * 1000);
    setScore(0);
    setWrong(0);
    setFlash(null);
    setSelected(null);
    setRound(newRound(mode));
  };

  const answer = (ok: boolean, sq?: string) => {
    if (!running) return;
    if (ok) {
      setScore((s) => s + 1);
      setRound((r) => newRound(mode, r.target));
      setSelected(null);
    } else setWrong((w) => w + 1);
    setFlash(sq ? { sq, ok } : null);
  };

  const tapFind = (sq: string) => answer(sq === round.target, sq);

  const tapRead = (sq: string) => {
    const task = round.task;
    if (!task || !running) return;
    const piece = pieceAt(task.fen, sq);
    const side = task.fen.split(" ")[1];
    if (piece && piece.color === side) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected) answer(readTaskSolved(task, selected, sq), sq);
  };

  const marks: Record<string, SquareMark> = {};
  if (mode === "name") marks[round.target] = "selected";
  if (flash) marks[flash.sq] = flash.ok ? "good" : "bad";
  if (mode === "read" && selected && round.task) {
    marks[selected] = "selected";
    for (const t of legalTargets(round.task.fen, selected)) marks[t] = "target";
  }

  const prompt =
    mode === "find"
      ? round.target
      : mode === "color"
        ? round.target
        : mode === "read"
          ? (round.task?.notation ?? "")
          : "?";

  return (
    <section className="space-y-4" aria-label={meta.title}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-black">
          {meta.emoji} {meta.title}
        </h2>
        <Button variant="ghost" size="sm" onClick={onExit}>
          ← Другой режим
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-3">
          {(mode === "find" || mode === "read" || mode === "name") && (
            <ChessBoard
              id={`drill-${mode}`}
              position={mode === "read" ? (round.task?.fen ?? EMPTY) : EMPTY}
              marks={marks}
              orientation={mode === "read" ? (round.task?.fen.split(" ")[1] === "b" ? "black" : "white") : orientation}
              notation={mode === "read" || mode === "name" ? true : labels}
              onSquare={mode === "find" ? tapFind : mode === "read" ? tapRead : undefined}
              draggable={mode === "read" && running}
              onDrop={
                mode === "read"
                  ? (from, to) => {
                      if (!round.task || !running) return false;
                      answer(readTaskSolved(round.task, from, to), to);
                      return false;
                    }
                  : undefined
              }
              maxWidth={480}
            />
          )}
          {mode === "color" && (
            <div className="rounded-3xl bg-white p-8 text-center shadow-card">
              <p className="text-sm font-extrabold text-muted">Какого цвета клетка?</p>
              <p className="mt-2 text-7xl font-black" aria-live="polite">
                {running ? round.target : "?"}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  disabled={!running}
                  onClick={() => answer(squareColor(round.target) === "light")}
                  className="h-20 w-32 rounded-2xl border-4 border-[#b58863] bg-[#f0d9b5] text-lg font-black text-[#7a4b00] disabled:opacity-50"
                >
                  светлая
                </button>
                <button
                  type="button"
                  disabled={!running}
                  onClick={() => answer(squareColor(round.target) === "dark")}
                  className="h-20 w-32 rounded-2xl border-4 border-[#7c5a33] bg-[#b58863] text-lg font-black text-white disabled:opacity-50"
                >
                  тёмная
                </button>
              </div>
            </div>
          )}
        </div>
        <aside className="space-y-3">
          <div className="rounded-2xl bg-white p-4 text-center shadow-card">
            <p className="text-sm font-extrabold text-muted">{running ? "Время" : over ? "Время вышло!" : "Готов?"}</p>
            <p className={cn("text-5xl font-black tabular-nums", running && left <= 5 && "text-rose")}>{left}</p>
            {(mode === "find" || mode === "read") && running && (
              <p className="mt-3 text-sm font-extrabold text-muted">
                {mode === "find" ? "Найди клетку" : "Сделай ход"}
              </p>
            )}
            {(mode === "find" || mode === "read") && running && (
              <p className="text-5xl font-black text-brand-dark" aria-live="polite">
                {prompt}
              </p>
            )}
            {mode === "name" && running && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {round.options.map((o) => (
                  <Button key={o} variant="soft" size="lg" onClick={() => answer(o === round.target)}>
                    {o}
                  </Button>
                ))}
              </div>
            )}
            <p className="mt-3 text-lg font-black">
              Верно: {score}
              {wrong > 0 && <span className="text-sm font-bold text-muted"> · промахов {wrong}</span>}
            </p>
            <p className="text-sm text-muted">Рекорд: {Math.max(record, over ? score : 0)}</p>
          </div>
          {!running && (
            <Button size="lg" className="w-full" onClick={start}>
              {over ? "↺ Ещё раз" : "▶ Старт"}
            </Button>
          )}
          {over && (
            <p className="rounded-2xl bg-sun-soft px-4 py-3 font-semibold">
              {score > record && record > 0
                ? `🏆 Новый рекорд: ${score}!`
                : score >= 20
                  ? "🔥 Отличная скорость!"
                  : "Каждая попытка делает глаз зорче."}
            </p>
          )}
          {mode === "find" && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setOrientation((o) => (o === "white" ? "black" : "white"))}
              >
                🔄 {orientation === "white" ? "Смотреть за чёрных" : "Смотреть за белых"}
              </Button>
              <Button size="sm" variant={labels ? "success" : "secondary"} onClick={() => setLabels((l) => !l)}>
                {labels ? "✓ Буквы и цифры видны" : "Показать буквы и цифры"}
              </Button>
            </div>
          )}
          {mode === "read" && (
            <p className="text-sm text-muted">
              Кр — король, Ф — ферзь, Л — ладья, С — слон, К — конь, у пешки буквы нет. «x» — взятие, «+» — шах, 0-0 —
              рокировка.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
