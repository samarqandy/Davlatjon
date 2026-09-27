"use client";

import { useState } from "react";
import { RichText } from "@/components/RichText";
import { Button, cn } from "@/components/ui";
import type { ChessDemo, ChessLessonCard } from "@/content/chess/types";
import { legalTargets, pieceAt } from "@/lib/chess";
import { ChessBoard, type SquareMark } from "./ChessBoard";

/** Доска урока: подсветка, стрелки, а в интерактивной — ходы фигуры по нажатию. */
export function DemoBoard({ id, demo }: { id: string; demo: ChessDemo }) {
  const [selected, setSelected] = useState<string | null>(null);
  const marks: Record<string, SquareMark> = {};
  for (const sq of demo.highlight ?? []) marks[sq] = "hint";
  if (selected) {
    marks[selected] = "selected";
    for (const t of legalTargets(demo.fen, selected)) marks[t] = pieceAt(demo.fen, t) ? "capture" : "target";
  }
  return (
    <div className="space-y-2">
      <ChessBoard
        id={id}
        position={demo.fen}
        marks={marks}
        arrows={(demo.arrows ?? []).map(([from, to]) => ({ from, to }))}
        onSquare={
          demo.interactive ? (sq) => setSelected(pieceAt(demo.fen, sq) && sq !== selected ? sq : null) : undefined
        }
      />
      {demo.interactive && (
        <p className="text-center text-sm font-bold text-muted">
          {selected ? "Точки — клетки, куда может пойти фигура. Нажми на другую фигуру." : "👆 Нажми на фигуру"}
        </p>
      )}
    </div>
  );
}

/** Урок уровня: карточки по одной, с доской. */
export function ChessLesson({
  levelId,
  cards,
  onDone,
}: {
  levelId: string;
  cards: ChessLessonCard[];
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  const card = cards[step];
  const last = step === cards.length - 1;
  return (
    <div className="space-y-4">
      <div className="flex gap-1.5" aria-label="Шаги урока">
        {cards.map((c, i) => (
          <button
            key={c.title}
            type="button"
            onClick={() => setStep(i)}
            aria-label={`Шаг ${i + 1}: ${c.title}`}
            aria-current={i === step ? "step" : undefined}
            className={cn("h-2.5 flex-1 rounded-full transition", i <= step ? "bg-brand" : "bg-line")}
          />
        ))}
      </div>
      <article className="grid gap-5 rounded-3xl bg-white p-5 shadow-card md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
        <div className="space-y-3">
          <p className="text-sm font-extrabold text-muted">
            Шаг {step + 1} из {cards.length}
          </p>
          <h3 className="text-2xl font-black">{card.title}</h3>
          {card.text.map((t, i) => (
            <p key={i} className="text-lg leading-relaxed">
              <RichText text={t} />
            </p>
          ))}
        </div>
        {card.demo && <DemoBoard key={step} id={`demo-${levelId}-${step}`} demo={card.demo} />}
      </article>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={() => setStep(step - 1)} disabled={step === 0}>
          ← Назад
        </Button>
        {last ? (
          <Button onClick={onDone}>К упражнениям 🎯</Button>
        ) : (
          <Button onClick={() => setStep(step + 1)}>Дальше →</Button>
        )}
      </div>
    </div>
  );
}
