"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/components/ui";
import { cheer } from "@/lib/voice";

export type FeedbackTone = "success" | "retry" | "info";

export interface FeedbackState {
  tone: FeedbackTone;
  text: string;
  sub?: string;
}

const STYLES: Record<FeedbackTone, string> = {
  success: "border-mint/40 bg-mint-soft text-[#065f46]",
  retry: "border-sun/40 bg-sun-soft text-[#7a4b00]",
  info: "border-brand/25 bg-brand-soft text-brand-dark",
};

const ICONS: Record<FeedbackTone, string> = { success: "🎉", retry: "🤔", info: "💬" };

export function Feedback({ state, className }: { state: FeedbackState | null; className?: string }) {
  const tone = state?.tone;
  const text = state?.text;
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!text) return;
    // Ответ не должен прятаться под нижней панелью: подкручиваем страницу, если он ниже видимого.
    box.current?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    // «мат» — по-русски, «mot» — по-узбекски.
    if (tone === "success") cheer(/мат|\bmot\b/i.test(text) ? "mate" : "praise");
    else if (tone === "retry") cheer("retry");
  }, [tone, text]);
  return (
    <div aria-live="polite" className={className}>
      {state && (
        <div
          key={state.text}
          ref={box}
          className={cn("flex animate-pop scroll-mb-28 gap-3 rounded-2xl border-2 px-4 py-3", STYLES[state.tone])}
        >
          <span className="relative text-2xl leading-none" aria-hidden>
            {ICONS[state.tone]}
            {state.tone === "success" && <Sparkles />}
          </span>
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
