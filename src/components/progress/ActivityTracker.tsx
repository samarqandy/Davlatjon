"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { limitStatus } from "@/lib/activity";
import { addActiveTime, getState, isoDay } from "@/lib/store";

const TICK_MS = 5_000;
/** Если полторы минуты ничего не нажимали и не листали, считаем, что ребёнок отошёл. */
const IDLE_MS = 90_000;
const FLUSH_MS = 30_000;
const EVENTS = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;

/** Страницы взрослых и печать — не время ребёнка. */
export const isChildPath = (path: string) => !path.startsWith("/parent") && !/\/print\/?$/.test(path);

/**
 * Считает активное время ребёнка: вкладка видна и недавно что-то нажимали. Раз в полминуты и при
 * сворачивании записывает в прогресс (по дням) — по нему строятся отчёт для родителя и дневное ограничение.
 * Ребёнку время нигде не показывается.
 */
export function ActivityTracker() {
  const path = usePathname();
  const counting = useRef(false);

  useEffect(() => {
    counting.current = isChildPath(path);
  }, [path]);

  useEffect(() => {
    let last = performance.now();
    let lastTouch = last;
    let pending = 0;
    let sinceFlush = 0;

    const flush = () => {
      if (pending >= 1000) addActiveTime(pending);
      pending = 0;
      sinceFlush = 0;
    };
    const touch = () => {
      lastTouch = performance.now();
    };
    const tick = () => {
      const now = performance.now();
      const elapsed = Math.min(now - last, TICK_MS * 2);
      last = now;
      sinceFlush += elapsed;
      const active =
        counting.current &&
        document.visibilityState === "visible" &&
        now - lastTouch < IDLE_MS &&
        !limitStatus(getState(), isoDay(Date.now())).reached;
      if (active) pending += elapsed;
      if (sinceFlush >= FLUSH_MS) flush();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else {
        last = performance.now();
        touch();
      }
    };

    for (const e of EVENTS) window.addEventListener(e, touch, { passive: true, capture: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    const interval = setInterval(tick, TICK_MS);
    return () => {
      clearInterval(interval);
      for (const e of EVENTS) window.removeEventListener(e, touch, { capture: true });
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, []);

  return null;
}
