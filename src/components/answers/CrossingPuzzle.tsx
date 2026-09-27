"use client";

import { useRef, useState } from "react";
import { Button, cn } from "@/components/ui";
import type { CrossingPuzzle as CrossingSpec } from "@/content/types";
import {
  bankItems,
  bankOf,
  CROSSING_START,
  crossingSolved,
  replayCrossing,
  sail,
  type CrossingState,
  type Side,
} from "@/lib/crossing";
import { askExplain, praise } from "@/lib/feedback";
import { pluralize } from "@/lib/plural";
import { addFound, recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { Feedback, type FeedbackState } from "./Feedback";

const tripsWord = (n: number) => pluralize(n, "переправа", "переправы", "переправ");

/** Река, два берега и лодка. Если передан onItem — по пассажирам можно нажимать. */
export function RiverScene({
  puzzle,
  state = CROSSING_START,
  boatLoad = [],
  onItem,
}: {
  puzzle: CrossingSpec;
  state?: CrossingState;
  boatLoad?: string[];
  onItem?: (id: string) => void;
}) {
  const item = (id: string) => puzzle.items.find((i) => i.id === id)!;
  const bank = (side: Side) => {
    const ids = bankItems(puzzle, state, side).filter((id) => !boatLoad.includes(id));
    const driverHere = state.boat === side;
    return (
      <div
        className="flex min-h-40 flex-col items-center gap-1.5 rounded-2xl bg-[#dcfce7] p-2"
        aria-label={side === "left" ? "Левый берег" : "Правый берег"}
      >
        <span className="text-xs font-extrabold text-[#166534]">
          {side === "left" ? "Левый берег" : "Правый берег"}
        </span>
        {ids.map((id) => {
          const it = item(id);
          const canBoard = onItem && driverHere;
          return canBoard ? (
            <button
              key={id}
              type="button"
              onClick={() => onItem(id)}
              className="flex h-12 w-full max-w-24 items-center justify-center gap-1 rounded-xl border-2 border-[#16a34a]/40 bg-white text-3xl transition hover:border-[#16a34a]"
              aria-label={`${it.name}: посадить в лодку`}
            >
              {it.emoji}
            </button>
          ) : (
            <span
              key={id}
              className="flex h-12 items-center justify-center text-3xl"
              title={it.name}
              aria-label={it.name}
            >
              {it.emoji}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(5.5rem,0.9fr)_minmax(0,1fr)] items-stretch gap-1.5">
      {bank("left")}
      <div
        className="relative flex flex-col justify-center rounded-2xl bg-[#bfdbfe] p-1.5"
        style={{
          backgroundImage: "repeating-linear-gradient(170deg, rgb(255 255 255 / 0.35) 0 4px, transparent 4px 18px)",
        }}
        aria-label="Река"
      >
        <div
          className={cn("flex flex-col items-center gap-1", state.boat === "left" ? "self-start" : "self-end")}
          aria-label={`Лодка у ${state.boat === "left" ? "левого" : "правого"} берега`}
        >
          <div className="flex min-h-12 items-end gap-0.5">
            <span className="text-2xl" aria-hidden>
              {puzzle.driver.emoji}
            </span>
            {boatLoad.map((id) =>
              onItem ? (
                <button
                  key={id}
                  type="button"
                  onClick={() => onItem(id)}
                  className="rounded-lg bg-white/70 text-2xl"
                  aria-label={`${item(id).name}: высадить из лодки`}
                >
                  {item(id).emoji}
                </button>
              ) : (
                <span key={id} className="text-2xl">
                  {item(id).emoji}
                </span>
              ),
            )}
          </div>
          <span className="text-4xl leading-none" aria-hidden>
            🛶
          </span>
        </div>
      </div>
      {bank("right")}
    </div>
  );
}

export function CrossingPuzzle({
  taskId,
  puzzle,
  hintsLeft,
}: {
  taskId: string;
  puzzle: CrossingSpec;
  hintsLeft: boolean;
}) {
  const progress = useTask(taskId);
  const [trips, setTrips] = useState<string[][]>(() => {
    const saved = progress.input?.trips;
    if (!Array.isArray(saved)) return [];
    const r = replayCrossing(puzzle, saved as string[][]);
    return (saved as string[][]).slice(0, r.applied);
  });
  const [boatLoad, setBoatLoad] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const { state } = replayCrossing(puzzle, trips);
  const solved = crossingSolved(puzzle, state);
  const item = (id: string) => puzzle.items.find((i) => i.id === id)!;

  const saveTrips = (next: string[][]) => {
    setTrips(next);
    saveTaskInput(taskId, { trips: next });
  };

  const onItem = (id: string) => {
    if (solved) return;
    setFeedback(null);
    if (boatLoad.includes(id)) {
      setBoatLoad(boatLoad.filter((x) => x !== id));
      return;
    }
    if (bankOf(state, id) !== state.boat) return;
    if (boatLoad.length >= puzzle.capacity) {
      setFeedback({
        tone: "info",
        text: `В лодке место только для ${puzzle.capacity === 1 ? "одного пассажира" : pluralize(puzzle.capacity, "пассажира", "пассажиров", "пассажиров")}.`,
        sub: "Сначала высади того, кто уже сидит в лодке.",
      });
      return;
    }
    setBoatLoad([...boatLoad, id]);
  };

  const go = () => {
    const r = sail(puzzle, state, boatLoad);
    if (!r.ok) {
      if (r.reason === "eaten") {
        const n = attempts.current++;
        recordCheck(taskId, false);
        setFeedback({
          tone: "retry",
          text: `Стоп! Если ${puzzle.driver.name.toLowerCase()} уплывёт, ${r.conflict.text}`,
          sub:
            n >= 2 && hintsLeft
              ? "Так плыть нельзя. Можно открыть подсказку 💡"
              : "Так плыть нельзя. Подумай, кого лучше взять с собой.",
        });
      }
      setBoatLoad([]);
      return;
    }
    const next = [...trips, boatLoad];
    saveTrips(next);
    setBoatLoad([]);
    if (crossingSolved(puzzle, r.next)) {
      const n = attempts.current++;
      recordCheck(taskId, true);
      addFound(taskId, `len:${next.length}`);
      setFeedback(
        next.length <= puzzle.optimal
          ? {
              tone: "success",
              text: `${praise(n)} Все на другом берегу — за ${tripsWord(next.length)}!`,
              sub: `Быстрее не бывает. ${askExplain(n)}`,
            }
          : {
              tone: "success",
              text: `Все на другом берегу! Понадобилось ${tripsWord(next.length)}.`,
              sub: "А можно быстрее? Попробуй найти план покороче.",
            },
      );
    } else {
      setFeedback(null);
    }
  };

  const undo = () => {
    saveTrips(trips.slice(0, -1));
    setBoatLoad([]);
    setFeedback(null);
  };

  const reset = () => {
    saveTrips([]);
    setBoatLoad([]);
    setFeedback(null);
  };

  const toRight = state.boat === "left";

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted">
        Нажми на того, кого {puzzle.driver.name.toLowerCase()} возьмёт в лодку, а потом — «Плыть». Можно плыть и одному.
      </p>
      <RiverScene puzzle={puzzle} state={state} boatLoad={boatLoad} onItem={onItem} />
      <div className="flex flex-wrap items-center gap-2">
        <Button size="lg" onClick={go} disabled={solved}>
          {toRight ? "Плыть →" : "← Плыть"}
        </Button>
        <Button variant="secondary" onClick={undo} disabled={trips.length === 0}>
          ↶ Отменить поездку
        </Button>
        <Button variant="ghost" onClick={reset} disabled={trips.length === 0}>
          ↺ Сначала
        </Button>
      </div>
      <Feedback state={feedback} />
      {trips.length > 0 && (
        <div className="rounded-2xl bg-white p-3 shadow-card">
          <p className="mb-2 text-sm font-extrabold text-muted">Мои поездки: {trips.length}</p>
          <ol className="flex flex-wrap gap-1.5">
            {trips.map((t, i) => (
              <li key={i} className="rounded-xl bg-brand-soft px-2.5 py-1 font-extrabold text-brand-dark">
                <span className="mr-1 text-xs opacity-70">{i + 1}.</span>
                {i % 2 === 1 && "← "}
                {puzzle.driver.emoji}
                {t.map((id) => item(id).emoji).join("")}
                {i % 2 === 0 && " →"}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
