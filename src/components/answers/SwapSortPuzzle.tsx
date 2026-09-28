"use client";

import { Fragment, useRef, useState } from "react";
import { Button, cn } from "@/components/ui";
import { askExplain, praise } from "@/lib/feedback";
import { countText, useLang, useT, type Lang } from "@/lib/i18n";
import { addFound, recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { isSorted, swapAt } from "@/lib/swapSort";
import { Feedback, type FeedbackState } from "./Feedback";

const swapsWord = (n: number, lang: Lang) => countText(lang, n, ["обмен", "обмена", "обменов"], "ta almashtirish");

/** Ряд карточек с числами. */
export function CardRow({ cards, print = false }: { cards: readonly number[]; print?: boolean }) {
  return (
    <div className="flex gap-1.5">
      {cards.map((c, i) => (
        <span
          key={i}
          className={cn(
            "tabular flex items-center justify-center rounded-xl border-2 font-black",
            print
              ? "h-[11mm] w-[9mm] border-ink/60 text-xl"
              : "h-16 w-12 border-brand/40 bg-white text-3xl shadow-card",
          )}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export function SwapSortPuzzle({ taskId, cards, optimal }: { taskId: string; cards: number[]; optimal: number }) {
  const t = useT();
  const lang = useLang();
  const progress = useTask(taskId);
  const [order, setOrder] = useState<number[]>(() => {
    const saved = progress.input?.order;
    return Array.isArray(saved) && saved.length === cards.length ? (saved as number[]) : cards;
  });
  const [swaps, setSwaps] = useState<number>(() => Number(progress.input?.swaps ?? 0));
  const [flash, setFlash] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const sorted = isSorted(order);

  const save = (next: number[], count: number) => {
    setOrder(next);
    setSwaps(count);
    saveTaskInput(taskId, { order: next, swaps: count });
  };

  const swap = (i: number) => {
    if (sorted) return;
    const next = swapAt(order, i);
    const count = swaps + 1;
    save(next, count);
    setFlash(i);
    if (!isSorted(next)) {
      setFeedback(null);
      return;
    }
    const n = attempts.current++;
    recordCheck(taskId, true);
    addFound(taskId, `len:${count}`);
    setFeedback(
      count <= optimal
        ? {
            tone: "success",
            text: t(
              `${praise(n, lang)} По порядку — за ${swapsWord(count, lang)}!`,
              `${praise(n, lang)} ${swapsWord(count, lang)}da tartibga solding!`,
            ),
            sub: t(
              `Быстрее не бывает. А можешь доказать, что меньше чем за ${swapsWord(optimal, lang)} нельзя? ${askExplain(n, lang)}`,
              `Bundan tezroq boʻlmaydi. ${optimal} tadan kam almashtirish bilan boʻlmasligini isbotlay olasanmi? ${askExplain(n, lang)}`,
            ),
          }
        : {
            tone: "success",
            text: t(
              `Все карточки по порядку! Понадобилось ${swapsWord(count, lang)}.`,
              `Hamma kartochkalar tartibda! Buning uchun ${swapsWord(count, lang)} kerak boʻldi.`,
            ),
            sub: t(
              "А можно обойтись меньшим числом обменов? Попробуй ещё раз.",
              "Kamroq almashtirish bilan eplasa boʻlmaydimi? Yana urinib koʻr.",
            ),
          },
    );
  };

  const restart = () => {
    save(cards, 0);
    setFlash(null);
    setFeedback(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted">
        {t(
          "Нажми на ⇄ между карточками, чтобы поменять их местами.",
          "Ikki kartochkaning oʻrnini almashtirish uchun ular orasidagi ⇄ belgisini bos.",
        )}
      </p>
      <div className="flex justify-center overflow-x-auto rounded-3xl bg-white p-4 shadow-card">
        <div className="flex items-center">
          {order.map((c, i) => (
            <Fragment key={i}>
              <span
                className={cn(
                  "tabular flex h-16 w-10 items-center justify-center rounded-xl border-2 text-3xl font-black transition sm:h-20 sm:w-14 sm:text-4xl",
                  sorted
                    ? "border-mint bg-mint-soft text-[#065f46]"
                    : flash !== null && (i === flash || i === flash + 1)
                      ? "border-sun bg-sun-soft"
                      : "border-brand/40 bg-brand-soft",
                )}
              >
                {c}
              </span>
              {i < order.length - 1 && (
                <button
                  type="button"
                  onClick={() => swap(i)}
                  disabled={sorted}
                  aria-label={t(
                    `Поменять ${order[i]} и ${order[i + 1]}`,
                    `${order[i]} bilan ${order[i + 1]} ni almashtirish`,
                  )}
                  className="mx-0.5 flex h-11 w-7 items-center justify-center rounded-lg text-xl font-black text-brand transition hover:bg-brand-soft disabled:opacity-30 sm:mx-1 sm:w-10"
                >
                  ⇄
                </button>
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="tabular rounded-2xl bg-white px-4 py-2 text-lg font-black shadow-card">
          {t(`Обменов: ${swaps}`, `Almashtirishlar: ${swaps}`)}
        </span>
        <Button variant="ghost" onClick={restart} disabled={swaps === 0}>
          ↺ {t("Сначала", "Qaytadan boshlash")}
        </Button>
      </div>
      <Feedback state={feedback} />
    </div>
  );
}
