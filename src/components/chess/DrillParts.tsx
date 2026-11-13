"use client";

import { RotateCcw } from "lucide-react";
import { Button, Icon, ProgressBar } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { useStore } from "@/lib/store";

/** Общие части коротких тренажёров: строка раунда и итог подхода с рекордом. */

/** Итог подхода и кнопка «Ещё раз». id — ключ рекорда, max — сколько очков можно набрать. */
export function Finish({ id, max, score, onAgain }: { id: string; max: number; score: number; onAgain: () => void }) {
  const t = useT();
  const record = useStore((s) => s.chessDrills[id] ?? 0);
  return (
    <div className="rounded-3xl bg-sun-soft p-6 text-center" data-drill-done={score}>
      <p className="text-5xl" aria-hidden>
        {score >= max ? "🏆" : score >= max / 2 ? "🌟" : "💪"}
      </p>
      <p className="mt-2 text-2xl font-black">{t(`Результат: ${score} из ${max}`, `Natija: ${max} dan ${score}`)}</p>
      <p className="font-bold text-sun-ink">
        {score >= record
          ? t("Это твой рекорд!", "Bu sening rekording!")
          : t(`Рекорд — ${record}. Попробуй ещё!`, `Rekord — ${record}. Yana urinib koʻr!`)}
      </p>
      <Button className="mt-4" onClick={onAgain}>
        <Icon icon={RotateCcw} /> {t("Ещё раз", "Yana bir bor")}
      </Button>
    </div>
  );
}

/**
 * Строка раунда. Пока она на экране, идёт раунд — на телефоне шапка и подвал сайта убираются
 * (data-focus-screen, как в упражнениях курса): доска, вопрос и ответы должны помещаться на экран.
 * Выйти можно ссылкой «Все тренажёры» над заголовком.
 */
export function RoundBar({ round, total, score }: { round: number; total: number; score: number }) {
  const t = useT();
  return (
    <div data-focus-screen className="flex items-center gap-3">
      <ProgressBar value={round} max={total} className="flex-1" />
      <span className="text-sm font-extrabold text-muted tabular-nums">
        {t(`Раунд ${Math.min(round + 1, total)} из ${total}`, `${total} tadan ${Math.min(round + 1, total)}-raund`)} ·
        ⭐ {score}
      </span>
    </div>
  );
}
