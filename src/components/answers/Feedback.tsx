"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (!text) return;
    // «мат» — по-русски, «mot» — по-узбекски.
    if (tone === "success") cheer(/мат|\bmot\b/i.test(text) ? "mate" : "praise");
    else if (tone === "retry") cheer("retry");
  }, [tone, text]);
  return (
    <div aria-live="polite" className={className}>
      {state && (
        <div
          key={state.text}
          className={cn("flex animate-pop gap-3 rounded-2xl border-2 px-4 py-3", STYLES[state.tone])}
        >
          <span className="text-2xl leading-none" aria-hidden>
            {ICONS[state.tone]}
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
