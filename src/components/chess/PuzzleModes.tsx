"use client";

import { useEffect, useState } from "react";
import { Button, cn } from "@/components/ui";
import { PUZZLES, getPuzzle } from "@/content/chess/puzzles";
import { pluralize } from "@/lib/plural";
import { random } from "@/lib/random";
import { chessDrillRecord, duePuzzles, useStore } from "@/lib/store";
import { setHash } from "@/lib/useHash";
import { useToday } from "@/lib/useToday";
import { PuzzlePlayer } from "./PuzzleTrainer";

export const STORM_SECONDS = 180;
export const STORM_PENALTY = 10;

function Back() {
  return (
    <button type="button" onClick={() => setHash("#all")} className="text-sm font-extrabold text-brand hover:underline">
      ← Все задачи
    </button>
  );
}

/** Порядок задач для шторма: от лёгких к трудным, внутри одной сложности — вперемешку. */
export function stormOrder(rnd: () => number): string[] {
  return PUZZLES.map((p) => ({ id: p.id, k: p.stars + rnd() }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.id);
}

/** «Шторм»: три минуты, решай сколько успеешь. Ошибка — минус 10 секунд и следующая задача. */
export function StormView() {
  const best = useStore((s) => s.chessDrills.storm ?? 0);
  const [order, setOrder] = useState<string[]>(() => stormOrder(random));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const running = endsAt !== null && now < endsAt && index < order.length;
  const over = endsAt !== null && !running;
  const left = endsAt === null ? STORM_SECONDS : Math.max(0, Math.ceil((endsAt - now) / 1000));

  useEffect(() => {
    if (endsAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [endsAt]);

  useEffect(() => {
    if (over) chessDrillRecord("storm", score);
  }, [over, score]);

  const start = () => {
    const t = Date.now();
    setOrder(stormOrder(random));
    setIndex(0);
    setScore(0);
    setNow(t);
    setEndsAt(t + STORM_SECONDS * 1000);
  };

  const puzzle = getPuzzle(order[Math.min(index, order.length - 1)])!;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Back />
        <p className="text-lg font-black">
          ⚡ {score} · ⏱{" "}
          <span className={cn("tabular-nums", running && left <= 20 && "text-rose")}>
            {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
          </span>
        </p>
      </div>
      <h1 className="text-2xl font-black">⚡ Шторм</h1>
      {!running && (
        <div className="rounded-3xl bg-white p-6 text-center shadow-card">
          {over ? (
            <>
              <p className="text-5xl" aria-hidden>
                {score >= 15 ? "🏆" : score >= 8 ? "🔥" : "💪"}
              </p>
              <p className="mt-2 text-2xl font-black">
                Решено {pluralize(score, "задача", "задачи", "задач")} за 3 минуты!
              </p>
              <p className="mt-1 text-muted">{score > 0 && score >= best ? "Это твой рекорд!" : `Рекорд: ${best}.`}</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold">
                Три минуты — решай столько задач, сколько успеешь. Сначала лёгкие, потом всё труднее.
              </p>
              <p className="mt-1 text-sm text-muted">
                Ошибка — минус {STORM_PENALTY} секунд и следующая задача. Рекорд: {best}.
              </p>
            </>
          )}
          <Button size="lg" className="mt-4" onClick={start}>
            {over ? "↺ Ещё раз" : "▶ Старт"}
          </Button>
        </div>
      )}
      {running && (
        <PuzzlePlayer
          key={`${puzzle.id}-${index}`}
          puzzle={puzzle}
          onSolved={(misses) => {
            if (misses === 0) setScore((s) => s + 1);
            setTimeout(() => setIndex((i) => i + 1), 600);
          }}
          onFailed={() => {
            setEndsAt((e) => (e === null ? e : e - STORM_PENALTY * 1000));
            setTimeout(() => setIndex((i) => i + 1), 900);
          }}
        />
      )}
    </div>
  );
}

/** Повторение: задачи с ошибками возвращаются через 1, 3, 7 и 21 день. */
export function RepeatView() {
  const today = useToday();
  const progress = useStore((s) => s.chessPuzzles);
  const [queue, setQueue] = useState<string[] | null>(null);
  const due = today ? duePuzzles(progress, today) : [];
  const list = queue ?? [];
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(0);
  const id = list[Math.min(index, list.length - 1)];
  const puzzle = id ? getPuzzle(id) : undefined;

  return (
    <div className="space-y-4">
      <Back />
      <header>
        <h1 className="text-2xl font-black">🔁 Повторение</h1>
        <p className="text-muted">
          Задачи, в которых были ошибки, возвращаются через день, потом через 3, 7 и 21 день. Реши без ошибки — и задача
          уйдёт дальше. Так трудное запоминается навсегда.
        </p>
      </header>
      {queue === null ? (
        <div className="rounded-3xl bg-white p-6 text-center shadow-card">
          <p className="text-xl font-black">
            {due.length
              ? `На сегодня: ${pluralize(due.length, "задача", "задачи", "задач")}`
              : "На сегодня повторять нечего."}
          </p>
          {due.length > 0 ? (
            <Button className="mt-3" onClick={() => setQueue(due)}>
              Начать повторение
            </Button>
          ) : (
            <Button className="mt-3" onClick={() => setHash("#all")}>
              К задачам
            </Button>
          )}
        </div>
      ) : !puzzle || index >= list.length ? (
        <div className="rounded-3xl bg-mint-soft p-6 text-center">
          <p className="text-5xl" aria-hidden>
            ✅
          </p>
          <p className="mt-2 text-xl font-black">
            {done ? `Повторено: ${done}. На сегодня всё!` : "На сегодня повторять нечего."}
          </p>
          <Button className="mt-3" onClick={() => setHash("#all")}>
            К задачам
          </Button>
        </div>
      ) : (
        <>
          <p className="font-bold text-muted">
            Задача {index + 1} из {list.length}
          </p>
          <PuzzlePlayer
            key={puzzle.id}
            puzzle={puzzle}
            onSolved={() => setDone((d) => d + 1)}
            next={{ label: "Следующая →", onClick: () => setIndex((i) => i + 1) }}
          />
        </>
      )}
    </div>
  );
}
