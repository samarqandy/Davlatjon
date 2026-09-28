"use client";

import { useEffect, useId, useState, useSyncExternalStore, type RefObject } from "react";
import { cn } from "@/components/ui";
import { useLang, useT } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { canSpeak, onVoiceChange, onVoicesChanged, playClip, playingId, speak, stopVoice } from "@/lib/voice";

/**
 * Кнопка «Послушать»: запись диктора (src), а если её нет — голос браузера читает текст.
 * Текст можно передать строкой или взять из блока на странице (from).
 * Нет ни записи, ни голоса на языке интерфейса — кнопки нет.
 */
export function ListenButton({
  src,
  text,
  from,
  label,
  className,
}: {
  src?: string;
  text?: string;
  from?: RefObject<HTMLElement | null>;
  label?: string;
  className?: string;
}) {
  const id = useId();
  const t = useT();
  const lang = useLang();
  const sound = useStore((s) => s.settings.sound !== false);
  const [playing, setPlaying] = useState(false);
  const speech = useSyncExternalStore(
    onVoicesChanged,
    () => canSpeak(lang),
    () => false,
  );

  useEffect(() => onVoiceChange((now) => setPlaying(now === id)), [id]);
  useEffect(() => () => void (playingId() === id && stopVoice()), [id]);

  if (!sound || (!src && !speech)) return null;

  const read = () => {
    const x = text ?? from?.current?.innerText ?? "";
    if (x && canSpeak(lang)) speak(x, id, lang);
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
      {playing ? t("Стоп", "Toʻxtatish") : (label ?? t("Послушать", "Tinglash"))}
    </button>
  );
}
