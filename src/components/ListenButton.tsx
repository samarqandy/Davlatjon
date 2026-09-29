"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { onVoiceChange, playClip, playingId, stopVoice } from "@/lib/voice";

/**
 * Кнопка «Послушать»: проигрывает запись диктора (src).
 * Голос браузера не подставляется: нет записи на языке интерфейса или звук выключен — кнопки нет.
 */
export function ListenButton({ src, label, className }: { src?: string; label?: string; className?: string }) {
  const id = useId();
  const t = useT();
  const sound = useStore((s) => s.settings.sound !== false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => onVoiceChange((now) => setPlaying(now === id)), [id]);
  useEffect(() => () => void (playingId() === id && stopVoice()), [id]);

  if (!sound || !src) return null;

  return (
    <button
      type="button"
      onClick={() => (playing ? stopVoice() : playClip(src, id))}
      aria-pressed={playing}
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3 py-1 text-sm font-extrabold transition",
        playing ? "bg-brand text-white" : "bg-brand-soft text-brand-dark hover:bg-[#e0e3ff]",
        className,
      )}
    >
      <span aria-hidden>{playing ? "⏹" : "🔊"}</span>
      {playing ? t("Стоп", "Toʻxtatish") : (label ?? t("Послушать", "Tinglash"))}
    </button>
  );
}
