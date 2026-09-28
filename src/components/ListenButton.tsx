"use client";

import { useEffect, useId, useState, type RefObject } from "react";
import { cn } from "@/components/ui";
import { useStore } from "@/lib/store";
import { onVoiceChange, playClip, playingId, speak, stopVoice } from "@/lib/voice";

/**
 * Кнопка «Послушать»: запись диктора (src), а если её нет — голос браузера читает текст.
 * Текст можно передать строкой или взять из блока на странице (from).
 */
export function ListenButton({
  src,
  text,
  from,
  label = "Послушать",
  className,
}: {
  src?: string;
  text?: string;
  from?: RefObject<HTMLElement | null>;
  label?: string;
  className?: string;
}) {
  const id = useId();
  const sound = useStore((s) => s.settings.sound !== false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => onVoiceChange((now) => setPlaying(now === id)), [id]);
  useEffect(() => () => void (playingId() === id && stopVoice()), [id]);

  if (!sound) return null;

  const read = () => {
    const t = text ?? from?.current?.innerText ?? "";
    if (t) speak(t, id);
  };

  return (
    <button
      type="button"
      onClick={() => {
        if (playing) stopVoice();
        else if (src) playClip(src, id, read);
        else read();
      }}
      aria-pressed={playing}
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3 py-1 text-sm font-extrabold transition",
        playing ? "bg-brand text-white" : "bg-brand-soft text-brand-dark hover:bg-[#e0e3ff]",
        className,
      )}
    >
      <span aria-hidden>{playing ? "⏹" : "🔊"}</span>
      {playing ? "Стоп" : label}
    </button>
  );
}
