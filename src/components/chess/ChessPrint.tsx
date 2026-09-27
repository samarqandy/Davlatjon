"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { PUZZLES, PUZZLE_THEMES } from "@/content/chess/puzzles";
import { ChessBoard } from "./ChessBoard";

/** Лист задач для решения на бумаге: диаграммы без ответов. Ответы — в разделе для родителей. */
export function ChessPrint() {
  const themes = PUZZLE_THEMES.filter((t) =>
    ["mate1", "mate2", "fork", "skewer", "promotion", "stalemate"].includes(t.id),
  );
  const list = themes.flatMap((t) => PUZZLES.filter((p) => p.theme === t.id && p.stars <= 3).slice(0, 3));
  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link href="/chess" className="text-sm font-extrabold text-brand hover:underline">
          ← Шахматная школа
        </Link>
        <Button onClick={() => window.print()}>🖨 Печать</Button>
      </div>
      <p className="no-print text-sm text-muted">
        Лист для ребёнка — без ответов. Ответы к задачам есть в разделе для родителей («Шахматы»). Формат A4, две
        колонки диаграмм.
      </p>
      <div className="mx-auto max-w-[190mm] rounded-2xl bg-white p-6 shadow-card print:max-w-none print:rounded-none print:p-0 print:shadow-none">
        <header className="mb-4 flex items-baseline justify-between border-b-2 border-ink/70 pb-2">
          <div>
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
              Лаборатория Давлатжона · шахматы
            </p>
            <h1 className="text-2xl font-black">Шахматные задачи</h1>
          </div>
          <p className="text-sm">Имя: ________________ Дата: __________</p>
        </header>
        <p className="mb-4 text-sm">
          Реши задачу на диаграмме и запиши ход. Например: <b>Лa8#</b> или <b>Кf6+</b>. Обозначения: Кр — король, Ф —
          ферзь, Л — ладья, С — слон, К — конь; пешку не пишут.
        </p>
        <ol className="grid grid-cols-2 gap-x-6 gap-y-5">
          {list.map((p, i) => {
            const white = p.fen.split(" ")[1] === "w";
            return (
              <li key={p.id} className="break-inside-avoid">
                <p className="mb-1 text-sm font-black">
                  {i + 1}. {p.mateIn ? `Мат в ${p.mateIn} ход${p.mateIn === 1 ? "" : "а"}` : "Найди лучший ход"} ·{" "}
                  {"⭐".repeat(p.stars)} · {white ? "ходят белые" : "ходят чёрные"}
                </p>
                <ChessBoard
                  id={`print-${p.id}`}
                  position={p.fen}
                  orientation={white ? "white" : "black"}
                  maxWidth={230}
                  className="!mx-0 !rounded-md !border-2 !shadow-none"
                />
                <p className="mt-1 text-sm">Ответ: ______________</p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
