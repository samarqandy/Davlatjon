"use client";

/**
 * Аккаунт в браузере: кто вошёл и какие способы входа включены (спрашиваем сервер один раз),
 * выход из аккаунта. Без входа всё работает как раньше — прогресс живёт в этом браузере.
 */
import { useSyncExternalStore } from "react";

export interface AccountInfo {
  status: "loading" | "ready";
  user: { name: string; provider: "google" | "telegram" } | null;
  providers: { google: boolean; telegram: boolean; botName?: string };
}

const LOADING: AccountInfo = { status: "loading", user: null, providers: { google: false, telegram: false } };

let info: AccountInfo = LOADING;
let requested = false;
const listeners = new Set<() => void>();

function emit(next: AccountInfo) {
  info = next;
  for (const l of listeners) l();
}

export async function refreshAccount(): Promise<AccountInfo> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    const data = (await res.json()) as Omit<AccountInfo, "status">;
    emit({ status: "ready", user: data.user ?? null, providers: data.providers ?? LOADING.providers });
  } catch {
    emit({ ...info, status: "ready" });
  }
  return info;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!requested) {
    requested = true;
    void refreshAccount();
  }
  return () => listeners.delete(listener);
}

export function useAccount(): AccountInfo {
  return useSyncExternalStore(
    subscribe,
    () => info,
    () => LOADING,
  );
}

/** Можно ли вообще войти на этом сайте (настроен ли хотя бы один способ). */
export function loginAvailable(a: AccountInfo): boolean {
  return a.providers.google || a.providers.telegram;
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
  await refreshAccount();
}
