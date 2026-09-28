"use client";

import { useEffect } from "react";
import { useAccount } from "@/lib/account";
import { getState, onStateChange, replaceState, useHydrated } from "@/lib/store";
import { mergeStates, sameProgress } from "@/lib/sync";

/** keepalive-запрос браузер отправит даже при закрытии вкладки, но только небольшой. */
const KEEPALIVE_LIMIT = 60_000;
const DEBOUNCE_MS = 3000;

/**
 * Синхронизация прогресса с аккаунтом. Работает только когда родитель вошёл через Google или Telegram:
 * при открытии сайта прогресс этого браузера сливается с аккаунтом, дальше изменения
 * отправляются через несколько секунд после последнего действия и при закрытии вкладки.
 */
export function AccountSync() {
  const hydrated = useHydrated();
  const account = useAccount();
  const userKey = account.user ? `${account.user.provider}:${account.user.name}` : null;

  useEffect(() => {
    if (!hydrated || !userKey) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let applying = false;
    let stopped = false;
    let dirty = false;

    const push = async (keepalive = false) => {
      clearTimeout(timer);
      dirty = false;
      const body = JSON.stringify({ state: getState() });
      try {
        const res = await fetch("/api/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: keepalive && body.length < KEEPALIVE_LIMIT,
        });
        if (!res.ok || stopped) return;
        const { state: remote } = (await res.json()) as { state: unknown };
        const local = getState();
        const merged = mergeStates(local, remote);
        if (!sameProgress(merged, local)) {
          applying = true;
          replaceState(merged);
          applying = false;
        }
      } catch {
        // Нет сети — отправим при следующем изменении.
      }
    };

    void push();
    const off = onStateChange(() => {
      if (applying) return;
      dirty = true;
      clearTimeout(timer);
      timer = setTimeout(() => void push(), DEBOUNCE_MS);
    });
    const onHide = () => {
      if (document.visibilityState === "hidden" && dirty) void push(true);
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      stopped = true;
      clearTimeout(timer);
      off();
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [hydrated, userKey]);

  return null;
}
