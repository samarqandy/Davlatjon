"use client";

import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/Mascot";
import { cn } from "@/components/ui";
import { useTaskId } from "@/components/task/TaskContext";
import { feedbackMood } from "@/lib/anim/mood";
import { praiseCue, retryCue } from "@/lib/feedback";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { scrollBehavior } from "@/lib/motion";
import { useMotionAllowed } from "@/lib/useMotion";
import { cue, type Cue } from "@/lib/voice";

export type FeedbackTone = "success" | "retry" | "info";

export interface FeedbackState {
  tone: FeedbackTone;
  text: string;
  sub?: string;
  /** Какую реплику сказать вместо выбранной по тексту (например, «почти» для числа, близкого к верному). */
  voice?: Cue;
}

const STYLES: Record<FeedbackTone, string> = {
  success: "border-mint/40 bg-mint-soft text-[#065f46]",
  retry: "border-sun/40 bg-sun-soft text-[#7a4b00]",
  info: "border-brand/25 bg-brand-soft text-brand-dark",
};

/** Смайлик остаётся только у нейтральных сообщений: за верный ответ и «подумаем ещё» реагирует птица Парвоз. */
const INFO_ICON = "💬";

export function Feedback({
  state,
  className,
  context = "task",
  silent = false,
}: {
  state: FeedbackState | null;
  className?: string;
  /** Где показан ответ: в задаче по математике и логике или в шахматном упражнении — от этого зависят слова голоса. */
  context?: "task" | "chess";
  /** Без реплики голосом: в быстрых режимах (шторм) задача сменяется раньше, чем договорит диктор. */
  silent?: boolean;
}) {
  const tone = state?.tone;
  const text = state?.text;
  const sub = state?.sub;
  const voice = state?.voice;
  const lang = useLang();
  const taskId = useTaskId();
  const hints = useStore((s) => (taskId ? (s.tasks[taskId]?.hints ?? 0) : 0));
  const motion = useMotionAllowed();
  const box = useRef<HTMLDivElement>(null);
  // Сколько неверных проверок подряд было до этого ответа: от этого зависит, за что хвалим и что советуем.
  const retries = useRef(0);
  // Каждый новый ответ (новый объект состояния) — новая попытка, даже с тем же текстом: снова анимация, голос
  // и объявление для экранного диктора. Иначе повторный такой же неверный ход оставался без ответа.
  const [seen, setSeen] = useState(state);
  const [attempt, setAttempt] = useState(0);
  if (state !== seen) {
    setSeen(state);
    if (state) setAttempt(attempt + 1);
  }
  useEffect(() => {
    if (!text) return;
    if (silent) return;
    // Ответ не должен прятаться под нижней панелью: подкручиваем страницу, только если он ниже видимого.
    // Уже видимую карточку не трогаем — иначе доска «прыгает» вверх, пока ребёнок смотрит на ход.
    const el = box.current;
    if (el && !fullyVisible(el)) el.scrollIntoView?.({ block: "nearest", behavior: scrollBehavior(motion) });
    if (tone === "success") {
      // «мат» — по-русски, «mot» — по-узбекски.
      cue(
        /мат|\bmot\b/i.test(text) ? "mate" : context === "chess" ? "praise-chess" : praiseCue(retries.current, hints),
      );
      retries.current = 0;
    } else if (tone === "retry") {
      retries.current += 1;
      cue(voice ?? (context === "chess" ? "retry-chess" : retryCue(text, sub, lang, retries.current)));
    }
    // hints читаем в момент ответа; смена числа подсказок сама по себе реплику не вызывает.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, tone, text, sub, voice, lang, context, silent]);
  return (
    <div aria-live="polite" className={className}>
      {state && (
        <div
          key={`${state.text}#${attempt}`}
          ref={box}
          className={cn(
            "flex animate-pop scroll-mb-[calc(var(--bottom-bar,0px)+1rem)] gap-3 rounded-2xl border-2 px-4 py-3",
            STYLES[state.tone],
          )}
        >
          {state.tone === "info" ? (
            <span className="relative text-2xl leading-none" aria-hidden>
              {INFO_ICON}
            </span>
          ) : (
            <span className="relative shrink-0" aria-hidden>
              <Mascot mood={feedbackMood(state.tone)} size={context === "chess" ? 36 : 44} />
              {state.tone === "success" && motion && <Sparkles />}
            </span>
          )}
          <div className="space-y-0.5">
            <p className="font-extrabold">{state.text}</p>
            {state.sub && <p className="text-[0.95em] font-semibold opacity-90">{state.sub}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/** Праздник за верный ответ: несколько звёздочек разлетаются от значка (при «уменьшить движение» их нет). */
function Sparkles() {
  const dirs = [
    ["-2.2rem", "-2.6rem"],
    ["0rem", "-3rem"],
    ["2.2rem", "-2.6rem"],
    ["-2.8rem", "-0.6rem"],
    ["2.8rem", "-0.6rem"],
  ];
  return (
    <span className="pointer-events-none absolute inset-0 motion-reduce:hidden" data-sparkles>
      {dirs.map((d, i) => (
        <span
          key={i}
          className="absolute top-1/2 left-1/2 animate-[spark_0.9s_ease-out_both] text-base"
          style={{ "--dx": d[0], "--dy": d[1], animationDelay: `${i * 40}ms` } as React.CSSProperties}
        >
          {i % 2 ? "⭐" : "✨"}
        </span>
      ))}
    </span>
  );
}

/** Карточка целиком на экране с учётом её отступа от нижней панели (scroll-margin). */
function fullyVisible(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  // Карточка появляется с увеличением (pop): считаем по настоящему размеру, а не по уменьшенному.
  const h = el.offsetHeight || r.height;
  const top = r.top + (r.height - h) / 2;
  const style = getComputedStyle(el);
  const below = parseFloat(style.scrollMarginBottom) || 0;
  const above = parseFloat(style.scrollMarginTop) || 0;
  return top - above >= 0 && top + h + below <= window.innerHeight;
}
