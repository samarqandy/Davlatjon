"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { cn } from "@/components/ui";
import { ANIM_ASSETS } from "@/lib/anim/assets";
import type { Mood } from "@/lib/anim/mood";
import { useMotionAllowed } from "@/lib/useMotion";

// Rive с его WASM (~370 КБ gzip) — отдельным куском и только там, где есть файл птицы и анимации включены.
const MascotRive = dynamic(() => import("./MascotRive"), { ssr: false, loading: () => null });

/** Запасная анимация птицы из logo.webp: CSS-классы `mascot-m-*` в globals.css. */
const FALLBACK_CLASS: Record<Mood, string> = {
  idle: "animate-float",
  happy: "mascot-m-happy",
  thinking: "mascot-m-thinking",
  correct: "mascot-m-correct",
  incorrect: "mascot-m-incorrect",
  celebration: "mascot-m-celebration",
};

/**
 * Птица Парвоз с настроением. Без файла `mascot.riv` рисуется логотип с CSS-анимацией;
 * с файлом (ANIM_ASSETS.mascot.available) поверх включается Rive. При «уменьшить движение» птица неподвижна.
 */
export function MascotLive({
  mood = "idle",
  size = 72,
  className,
}: {
  mood?: Mood;
  size?: number;
  className?: string;
}) {
  const motion = useMotionAllowed();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const useRiveFile = motion && ANIM_ASSETS.mascot.available && !failed;
  const riveShown = useRiveFile && ready;
  return (
    <div
      className={cn("relative shrink-0 select-none", className)}
      style={{ width: size, height: Math.round((size * 267) / 256) }}
      data-mascot
      data-mood={mood}
      data-motion={motion ? "on" : "off"}
      data-engine={riveShown ? "rive" : "fallback"}
    >
      <Image
        src="/logo.webp"
        alt=""
        width={size}
        height={Math.round((size * 267) / 256)}
        unoptimized
        aria-hidden
        className={cn("h-full w-full", motion && FALLBACK_CLASS[mood], riveShown && "invisible")}
      />
      {useRiveFile && <MascotRive mood={mood} onReady={() => setReady(true)} onFail={() => setFailed(true)} />}
    </div>
  );
}
