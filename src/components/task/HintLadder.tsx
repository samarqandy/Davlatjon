"use client";

import { useEffect, useState } from "react";
import { RichText } from "@/components/RichText";
import { Button, cn } from "@/components/ui";
import { hintSteps } from "@/content/meta";
import { useLang, useT } from "@/lib/i18n";
import { openHint, useStore, useTask } from "@/lib/store";

const PAUSE_SECONDS = 15;

/**
 * Лестница из 5 подсказок (раздел 9 мастер-промпта).
 * Подсказки открываются по одной; между ними — короткая пауза на размышление.
 * Полный ответ ребёнок не видит никогда — он только в разделе для родителя.
 */
export function HintLadder({ taskId, hints }: { taskId: string; hints: readonly string[] }) {
  const progress = useTask(taskId);
  const t = useT();
  const steps = hintSteps(useLang());
  const pause = useStore((s) => s.settings.hintPause);
  const [cooldown, setCooldown] = useState(0);
  const opened = progress.hints;
  // Задача решена: новые подсказки не нужны и только отвлекают; уже открытые остаются.
  const solved = progress.status === "solved";

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const open = () => {
    openHint(taskId);
    if (pause && opened + 1 < hints.length) setCooldown(PAUSE_SECONDS);
  };

  if (solved && opened === 0) return null;

  return (
    <section
      id="hints"
      className="scroll-mt-24 rounded-3xl border border-[#fde68a] bg-[#fffbeb] p-4"
      aria-label={t("Подсказки", "Maslahatlar")}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-lg font-extrabold">💡 {t("Подсказки", "Maslahatlar")}</h3>
        <div
          className="flex gap-1"
          aria-label={t(
            `Открыто подсказок: ${opened} из ${hints.length}`,
            `${hints.length} ta maslahatdan ${opened} tasi ochildi`,
          )}
        >
          {hints.map((_, i) => (
            <span key={i} className={cn("h-2.5 w-2.5 rounded-full", i < opened ? "bg-sun" : "bg-[#fde68a]")} />
          ))}
        </div>
      </div>

      {opened === 0 && !solved && (
        <p className="mb-3 text-[0.95em] text-[#7a4b00]">
          {t(
            "Трудно? Подсказки открываются по одной. Сначала попробуй подумать — это самое интересное!",
            "Qiynaldingmi? Maslahatlar bittadan ochiladi. Avval oʻzing oʻylab koʻr — eng qizigʻi shunda!",
          )}
        </p>
      )}

      <ol className="space-y-2">
        {hints.slice(0, opened).map((h, i) => (
          <li key={i} className="animate-fade-up rounded-2xl bg-white px-3.5 py-2.5 shadow-sm">
            <span className="mb-0.5 block text-xs font-extrabold tracking-wide text-[#b45309] uppercase">
              {i + 1}. {steps[i]}
            </span>
            <span className="child-text leading-relaxed">
              <RichText text={h} />
            </span>
          </li>
        ))}
      </ol>

      {solved ? null : opened < hints.length ? (
        <div className="mt-3 flex items-center gap-3">
          <Button variant="sun" onClick={open} disabled={cooldown > 0}>
            {opened === 0
              ? t("Открыть подсказку", "Maslahatni ochish")
              : t(`Подсказка ${opened + 1}`, `${opened + 1}-maslahat`)}
          </Button>
          {cooldown > 0 && (
            <span className="flex items-center gap-2 text-sm font-bold text-[#7a4b00]" aria-live="polite">
              <CountdownRing value={cooldown} max={PAUSE_SECONDS} />
              {t("Подумай с этой подсказкой…", "Shu maslahat bilan oʻylab koʻr…")}
            </span>
          )}
        </div>
      ) : (
        <p className="mt-3 text-[0.95em] font-bold text-[#7a4b00]">
          {t(
            "Подсказки закончились. Обсуди задачу со взрослым — вместе разберётесь!",
            "Maslahatlar tugadi. Masalani kattalar bilan birga koʻrib chiq — birgalikda albatta uddalaysizlar!",
          )}
        </p>
      )}
    </section>
  );
}

function CountdownRing({ value, max }: { value: number; max: number }) {
  const r = 11;
  const c = 2 * Math.PI * r;
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <circle cx="14" cy="14" r={r} fill="none" stroke="#fde68a" strokeWidth="4" />
      <circle
        cx="14"
        cy="14"
        r={r}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="4"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / max)}
        transform="rotate(-90 14 14)"
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
}
