"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { PUZZLES, PUZZLE_THEMES } from "@/content/chess/puzzles";
import { useT } from "@/lib/i18n";
import { ChessBoard } from "./ChessBoard";

/** Лист задач для решения на бумаге: диаграммы без ответов. Ответы — в разделе для родителей. */
export function ChessPrint() {
  const t = useT();
  const themes = PUZZLE_THEMES.filter((th) =>
    ["mate1", "mate2", "fork", "skewer", "promotion", "stalemate"].includes(th.id),
  );
  const list = themes.flatMap((th) => PUZZLES.filter((p) => p.theme === th.id && p.stars <= 3).slice(0, 3));
  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link href="/chess" className="text-sm font-extrabold text-brand hover:underline">
          {t("← Шахматная школа", "← Shaxmat maktabi")}
        </Link>
        <Button onClick={() => window.print()}>🖨 {t("Печать", "Chop etish")}</Button>
      </div>
      <p className="no-print text-sm text-muted">
        {t(
          "Лист для ребёнка — без ответов. Ответы к задачам есть в разделе для родителей («Шахматы»). Формат A4, две колонки диаграмм.",
          "Varaq bola uchun — javoblarsiz. Masalalarning javoblari ota-onalar boʻlimida («Shaxmat»). Format — A4, diagrammalar ikki ustunda.",
        )}
      </p>
      <div className="mx-auto max-w-[190mm] rounded-2xl bg-white p-6 shadow-card print:max-w-none print:rounded-none print:p-0 print:shadow-none">
        <header className="mb-4 flex items-baseline justify-between border-b-2 border-ink/70 pb-2">
          <div>
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
              {t("Лаборатория Давлатжона · шахматы", "Davlatjon laboratoriyasi · shaxmat")}
            </p>
            <h1 className="text-2xl font-black">{t("Шахматные задачи", "Shaxmat masalalari")}</h1>
          </div>
          <p className="text-sm">
            {t("Имя: ________________ Дата: __________", "Ism: ________________ Sana: __________")}
          </p>
        </header>
        <p className="mb-4 text-sm">
          {t(
            "Реши задачу на диаграмме и запиши ход. Например: ",
            "Diagrammadagi masalani yech va yurishni yozib qoʻy. Masalan: ",
          )}
          <b>{t("Лa8#", "♖a8#")}</b> {t("или", "yoki")} <b>{t("Кf6+", "♘f6+")}</b>
          {t(
            ". Обозначения: Кр — король, Ф — ферзь, Л — ладья, С — слон, К — конь; пешку не пишут.",
            ". Belgilar: ♔ — shoh, ♕ — farzin, ♖ — rux, ♗ — fil, ♘ — ot; piyoda belgisiz yoziladi.",
          )}
        </p>
        <ol className="grid grid-cols-2 gap-x-6 gap-y-5">
          {list.map((p, i) => {
            const white = p.fen.split(" ")[1] === "w";
            return (
              <li key={p.id} className="break-inside-avoid">
                <p className="mb-1 text-sm font-black">
                  {i + 1}.{" "}
                  {p.mateIn
                    ? t(`Мат в ${p.mateIn} ход${p.mateIn === 1 ? "" : "а"}`, `${p.mateIn} yurishda mot`)
                    : t("Найди лучший ход", "Eng yaxshi yurishni top")}{" "}
                  · {"⭐".repeat(p.stars)} ·{" "}
                  {white ? t("ходят белые", "oqlar yuradi") : t("ходят чёрные", "qoralar yuradi")}
                </p>
                <ChessBoard
                  id={`print-${p.id}`}
                  position={p.fen}
                  orientation={white ? "white" : "black"}
                  maxWidth={230}
                  frame="print"
                  notation
                  className="!mx-0"
                />
                <p className="mt-1 text-sm">{t("Ответ: ______________", "Javob: ______________")}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
