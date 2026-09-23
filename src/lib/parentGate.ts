"use client";

import { useSyncExternalStore } from "react";

/**
 * «Замок» для раздела родителя: PIN-код хранится в виде хэша в localStorage,
 * а разблокировка действует до закрытия вкладки (sessionStorage).
 * Это мягкая защита от случайного подглядывания ребёнка, а не система безопасности.
 */

const PIN_KEY = "davlatjon-lab:pin";
const UNLOCK_KEY = "davlatjon-lab:parent-unlocked";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function hash(pin: string): Promise<string> {
  const data = new TextEncoder().encode(`davlatjon-lab:${pin}`);
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Запасной вариант для небезопасного контекста (http в локальной сети).
  let h = 5381;
  for (const byte of data) h = ((h << 5) + h + byte) >>> 0;
  return `djb2-${h.toString(16)}`;
}

function read(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function write(storage: "local" | "session", key: string, value: string | null) {
  try {
    const s = storage === "local" ? window.localStorage : window.sessionStorage;
    if (value === null) s.removeItem(key);
    else s.setItem(key, value);
  } catch {
    // ignore
  }
}

export function hasPin(): boolean {
  return read("local", PIN_KEY) !== null;
}

export async function createPin(pin: string) {
  write("local", PIN_KEY, await hash(pin));
  write("session", UNLOCK_KEY, "1");
  emit();
}

export async function unlockWithPin(pin: string): Promise<boolean> {
  const stored = read("local", PIN_KEY);
  if (!stored) return false;
  const ok = stored === (await hash(pin));
  if (ok) {
    write("session", UNLOCK_KEY, "1");
    emit();
  }
  return ok;
}

export function lockParent() {
  write("session", UNLOCK_KEY, null);
  emit();
}

export function forgetPin() {
  write("local", PIN_KEY, null);
  write("session", UNLOCK_KEY, null);
  emit();
}

type GateState = "locked" | "unlocked" | "no-pin" | "unknown";

function snapshot(): GateState {
  if (typeof window === "undefined") return "unknown";
  if (!hasPin()) return "no-pin";
  return read("session", UNLOCK_KEY) === "1" ? "unlocked" : "locked";
}

export function useParentGate(): GateState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    snapshot,
    () => "unknown",
  );
}
