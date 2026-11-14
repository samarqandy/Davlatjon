"use client";

import { useEffect, useState } from "react";

export type WakeLockStatus = "on" | "off" | "unsupported";

type WakeLockSentinelLike = { released: boolean; release: () => Promise<void> };
type WakeLockNavigator = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
};

/**
 * Экран не гаснет, пока идёт показ классу (enabled). Браузер снимает запрет, когда вкладку прячут, —
 * при возвращении просим снова. Если браузер не умеет или отказал, ничего не ломается: только статус.
 */
export function useWakeLock(enabled: boolean): WakeLockStatus {
  const [status, setStatus] = useState<WakeLockStatus>("off");
  useEffect(() => {
    if (!enabled) return;
    const nav = navigator as WakeLockNavigator;
    if (!nav.wakeLock) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- возможность браузера узнаём только в браузере
      setStatus("unsupported");
      return;
    }
    let lock: WakeLockSentinelLike | null = null;
    let stopped = false;
    const request = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const next = await nav.wakeLock!.request("screen");
        if (stopped) {
          void next.release().catch(() => undefined);
          return;
        }
        lock = next;
        setStatus("on");
      } catch {
        setStatus("off");
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible" && (!lock || lock.released)) void request();
    };
    void request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      document.removeEventListener("visibilitychange", onVisible);
      if (lock && !lock.released) void lock.release().catch(() => undefined);
      setStatus("off");
    };
  }, [enabled]);
  return status;
}
