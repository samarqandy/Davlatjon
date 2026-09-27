"use client";

import { useEffect, useRef, useState } from "react";
import { Button, cn } from "@/components/ui";
import { askExplain } from "@/lib/feedback";
import { robotMove } from "@/lib/nim";
import { plural, pluralize } from "@/lib/plural";
import { addFound, recordCheck, useTask } from "@/lib/store";
import { Feedback, type FeedbackState } from "./Feedback";

const stonesWord = (n: number) => pluralize(n, "камешек", "камешка", "камешков");

interface Move {
  who: "child" | "robot";
  took: number;
  left: number;
}

/** Камешки: оставшиеся — яркие, взятые — бледные. */
export function Stones({ total, left, print = false }: { total: number; left: number; print?: boolean }) {
  return (
    <div className="flex max-w-md flex-wrap justify-center gap-1.5" aria-label={`Осталось ${stonesWord(left)}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "inline-block rounded-full border-2 transition",
            print ? "h-[7mm] w-[9mm] border-ink/60" : "h-9 w-11 sm:h-10 sm:w-12",
            !print && (i < left ? "border-[#57534e] bg-[#a8a29e]" : "border-dashed border-[#d6d3d1] bg-transparent"),
          )}
          style={print ? undefined : { borderRadius: "50% 45% 50% 40%" }}
        />
      ))}
    </div>
  );
}

export function NimGame({ taskId, stones, take }: { taskId: string; stones: number; take: number[] }) {
  const progress = useTask(taskId);
  const [left, setLeft] = useState(stones);
  const [moves, setMoves] = useState<Move[]>([]);
  const [robotTurn, setRobotTurn] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const games = useRef({ played: 0, lost: 0 });
  const won = (progress.found ?? []).includes("win");
  const over = left === 0;

  useEffect(() => {
    if (!robotTurn || left === 0) return;
    const timer = setTimeout(() => {
      const took = robotMove(left, take);
      const rest = left - took;
      setLeft(rest);
      setMoves((m) => [...m, { who: "robot", took, left: rest }]);
      setRobotTurn(false);
      if (rest === 0) {
        games.current.played++;
        games.current.lost++;
        recordCheck(taskId, false);
        setFeedback({
          tone: "retry",
          text: "Последний камешек взял робот 🤖. Сыграем ещё?",
          sub:
            games.current.lost >= 2
              ? "Подсказка: посмотри в дневнике, сколько камешков робот оставляет тебе после своего хода. Какие это числа?"
              : "Подумай: сколько камешков выгодно оставить роботу перед его ходом?",
        });
      } else {
        setFeedback({
          tone: "info",
          text: `🤖 Робот взял ${stonesWord(took)}. Осталось ${stonesWord(rest)}.`,
          sub: "Твой ход!",
        });
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [robotTurn, left, take, taskId]);

  const move = (n: number) => {
    if (robotTurn || over || n > left) return;
    const rest = left - n;
    setLeft(rest);
    setMoves((m) => [...m, { who: "child", took: n, left: rest }]);
    if (rest === 0) {
      games.current.played++;
      recordCheck(taskId, true);
      addFound(taskId, "win");
      setFeedback({
        tone: "success",
        text: "Последний камешек — твой! Ты победил робота 🏆",
        sub: `Сможешь выигрывать всегда? Какой у тебя секрет? ${askExplain(games.current.played)}`,
      });
      return;
    }
    setRobotTurn(true);
    setFeedback({ tone: "info", text: "Робот думает…" });
  };

  const restart = () => {
    setLeft(stones);
    setMoves([]);
    setRobotTurn(false);
    setFeedback(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-4 shadow-card">
        <p className="text-lg font-black">
          Осталось: <span className="tabular">{stonesWord(left)}</span>
        </p>
        <Stones total={stones} left={left} />
        <p className={cn("text-sm font-extrabold", robotTurn ? "text-muted" : "text-brand")}>
          {over ? "Игра окончена" : robotTurn ? "🤖 Ход робота…" : "🙂 Твой ход"}
        </p>
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Сколько взять">
          {take.map((n) => (
            <Button key={n} size="lg" onClick={() => move(n)} disabled={robotTurn || over || n > left}>
              Взять {n}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant={over ? "primary" : "ghost"} onClick={restart}>
          ↺ Новая игра
        </Button>
        {won && (
          <span className="rounded-2xl bg-mint-soft px-3 py-1.5 text-sm font-extrabold text-[#065f46]">
            🏆 Робот побеждён
          </span>
        )}
      </div>

      <Feedback state={feedback} />

      {moves.length > 0 && (
        <div className="rounded-2xl bg-white p-3 shadow-card">
          <p className="mb-2 text-sm font-extrabold text-muted">Дневник игры</p>
          <ol className="space-y-1 text-[0.95rem]">
            {moves.map((m, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                <span className="w-6 text-right font-bold text-muted">{i + 1}.</span>
                <span className="font-bold">
                  {m.who === "child" ? "🙂 Я взял" : "🤖 Робот взял"} {m.took}
                </span>
                <span className="tabular text-sm text-muted">
                  → {plural(m.left, "остался", "осталось", "осталось")} {m.left}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
