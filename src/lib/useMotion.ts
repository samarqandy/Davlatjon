"use client";

import { useSyncExternalStore } from "react";
import { REDUCED_MOTION_QUERY, motionAllowed } from "@/lib/motion";
import { useStore } from "@/lib/store";

function subscribeMedia(onChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function osReduces(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Система просит «уменьшить движение». На сервере считаем, что нет: CSS всё равно сам выключит свои анимации. */
export function useOsReducedMotion(): boolean {
  return useSyncExternalStore(subscribeMedia, osReduces, () => false);
}

/** Показывать ли анимации (Rive, конфетти, Lottie, прыжки птицы): система не просит тишины и родитель их не выключил. */
export function useMotionAllowed(): boolean {
  const reduce = useOsReducedMotion();
  const setting = useStore((s) => s.settings.animations);
  return motionAllowed(reduce, setting);
}
