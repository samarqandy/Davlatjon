"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { cn } from "@/components/ui";
import { ANIM_ASSETS } from "@/lib/anim/assets";
import type { Mood } from "@/lib/anim/mood";
import { useMotionAllowed } from "@/lib/useMotion";

/** Меньше — значок (например, в карточке ответа): там хватает CSS-анимации. */
const RIVE_MIN_SIZE = 56;

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
  // Rive (WASM ~370 КБ и рисование каждый кадр) — только для заметной птицы (не значка в ответе)
  // и только когда она показалась на экране и браузер свободен: птица ниже экрана ничего не грузит.
  const big = size >= RIVE_MIN_SIZE;
  const [armed, setArmed] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!motion || !big || armed || !ANIM_ASSETS.mascot.available) return;
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let idle: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const arm = () => setArmed(true);
        idle =
          typeof window.requestIdleCallback === "function"
            ? window.requestIdleCallback(arm, { timeout: 1500 })
            : window.setTimeout(arm, 300);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (idle === undefined) return;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [motion, big, armed]);
  const useRiveFile = motion && big && armed && ANIM_ASSETS.mascot.available && !failed;
  const riveShown = useRiveFile && ready;
  return (
    <div
      ref={box}
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
        className={cn("h-full w-full", motion && !riveShown && FALLBACK_CLASS[mood], riveShown && "invisible")}
      />
      {useRiveFile && <MascotRive mood={mood} onReady={() => setReady(true)} onFail={() => setFailed(true)} />}
    </div>
  );
}
