"use client";

import { useState } from "react";
import { ListenButton } from "@/components/ListenButton";
import { RichText } from "@/components/RichText";
import { Button, cn } from "@/components/ui";
import type { ChessDemo, ChessLessonCard } from "@/content/chess/types";
import { legalTargets, pieceAt } from "@/lib/chess";
import { useLang, useT } from "@/lib/i18n";
import { VOICE_CLIPS } from "@/lib/voice";
import { ChessBoard, type SquareMark } from "./ChessBoard";

/** Доска урока: подсветка, стрелки, а в интерактивной — ходы фигуры по нажатию. */
export function DemoBoard({ id, demo }: { id: string; demo: ChessDemo }) {
  const t = useT();
  const [selected, setSelected] = useState<string | null>(null);
  const marks: Record<string, SquareMark> = {};
  for (const sq of demo.highlight ?? []) marks[sq] = "hint";
  if (selected) {
    marks[selected] = "selected";
    for (const sq of legalTargets(demo.fen, selected)) marks[sq] = pieceAt(demo.fen, sq) ? "capture" : "target";
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
          {selected
            ? t(
                "Точки — клетки, куда может пойти фигура. Нажми на другую фигуру.",
                "Nuqtalar — dona yura oladigan kataklar. Endi boshqa donani bosib koʻr.",
              )
            : t("👆 Нажми на фигуру", "👆 Biror donani bos")}
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
  const t = useT();
  const lang = useLang();
  const [step, setStep] = useState(0);
  const card = cards[step];
  const last = step === cards.length - 1;
  return (
    <div className="space-y-4">
      <div className="flex gap-1.5" aria-label={t("Шаги урока", "Dars qadamlari")}>
        {cards.map((c, i) => (
          <button
            key={c.title}
            type="button"
            onClick={() => setStep(i)}
            aria-label={t(`Шаг ${i + 1}: ${c.title}`, `${i + 1}-qadam: ${c.title}`)}
            aria-current={i === step ? "step" : undefined}
            className={cn("h-2.5 flex-1 rounded-full transition", i <= step ? "bg-brand" : "bg-line")}
          />
        ))}
      </div>
      <article className="grid gap-5 rounded-3xl bg-white p-5 shadow-card md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
        <div className="space-y-3">
          <p className="text-sm font-extrabold text-muted">
            {t(`Шаг ${step + 1} из ${cards.length}`, `${step + 1}-qadam, jami ${cards.length} ta`)}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-2xl font-black">{card.title}</h3>
            <ListenButton key={step} src={VOICE_CLIPS.lesson(levelId, step, lang)} />
          </div>
          {card.text.map((text, i) => (
            <p key={i} className="text-lg leading-relaxed">
              <RichText text={text} />
            </p>
          ))}
        </div>
        {card.demo && <DemoBoard key={step} id={`demo-${levelId}-${step}`} demo={card.demo} />}
      </article>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={() => setStep(step - 1)} disabled={step === 0}>
          {t("← Назад", "← Orqaga")}
        </Button>
        {last ? (
          <Button onClick={onDone}>{t("К упражнениям 🎯", "Mashqlarga oʻtish 🎯")}</Button>
        ) : (
          <Button onClick={() => setStep(step + 1)}>{t("Дальше →", "Keyingisi →")}</Button>
        )}
      </div>
    </div>
  );
}
