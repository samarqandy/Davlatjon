"use client";

import { useSyncExternalStore } from "react";

/**
 * «Замок» для раздела родителя: PIN-код хранится в виде хэша в localStorage,
 * а разблокировка действует до закрытия вкладки (sessionStorage).
 *
 * Это мягкая защита от случайного подглядывания ребёнка, а не система безопасности: тот, кто умеет
 * очищать данные сайта, обойдёт её. Что она всё-таки делает:
 *  - подбор PIN-кода замедляется (три неверных попытки подряд — пауза, дальше длиннее);
 *  - сброс забытого PIN-кода открывается только через сутки после запроса, а верный PIN-код за это время
 *    отменяет запрос — ребёнок не сбросит замок за пять минут, а взрослый заметит запрос;
 *  - на самом экране ничего подсказывающего (слов для сброса) нет.
 */

const PIN_KEY = "davlatjon-lab:pin";
const UNLOCK_KEY = "davlatjon-lab:parent-unlocked";
const FAILS_KEY = "davlatjon-lab:pin-fails";
const RESET_KEY = "davlatjon-lab:pin-reset";

/** Через сколько после запроса можно сбросить забытый PIN-код. */
export const RESET_DELAY_MS = 24 * 60 * 60 * 1000;
/** Сколько неверных PIN-кодов подряд до паузы и какие бывают паузы: сначала минута, потом пять минут. */
export const FREE_TRIES = 3;
export const WAITS_MS = [60_000, 300_000] as const;

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

interface Fails {
  /** Неверных PIN-кодов подряд. */
  n: number;
  /** До какого момента (мс) пробовать нельзя. */
  until: number;
}

function readFails(): Fails {
  try {
    const raw = JSON.parse(read("local", FAILS_KEY) ?? "null") as Partial<Fails> | null;
    return { n: Number(raw?.n) || 0, until: Number(raw?.until) || 0 };
  } catch {
    return { n: 0, until: 0 };
  }
}

/** Сколько ещё ждать до следующей попытки, мс (0 — можно вводить). */
export function pinWaitMs(now: number = Date.now()): number {
  return Math.max(0, readFails().until - now);
}

/** Пауза после n-й неверной попытки подряд: после каждой третьей. */
export function waitAfterFails(n: number): number {
  if (n < FREE_TRIES || n % FREE_TRIES !== 0) return 0;
  return WAITS_MS[Math.min(n / FREE_TRIES - 1, WAITS_MS.length - 1)];
}

export async function createPin(pin: string) {
  write("local", PIN_KEY, await hash(pin));
  write("local", FAILS_KEY, null);
  write("local", RESET_KEY, null);
  write("session", UNLOCK_KEY, "1");
  emit();
}

export type UnlockResult = "ok" | "wrong" | "wait";

export async function unlockWithPin(pin: string, now: number = Date.now()): Promise<UnlockResult> {
  const stored = read("local", PIN_KEY);
  if (!stored) return "wrong";
  if (pinWaitMs(now) > 0) return "wait";
  if (stored === (await hash(pin))) {
    // Верный PIN-код: счётчик ошибок обнуляется, а запрос на сброс отменяется.
    write("local", FAILS_KEY, null);
    write("local", RESET_KEY, null);
    write("session", UNLOCK_KEY, "1");
    emit();
    return "ok";
  }
  const n = readFails().n + 1;
  write("local", FAILS_KEY, JSON.stringify({ n, until: waitAfterFails(n) ? now + waitAfterFails(n) : 0 }));
  return waitAfterFails(n) ? "wait" : "wrong";
}

/** Когда откроется сброс PIN-кода (мс), или null, если сброс не запрашивали. */
export function pinResetAt(): number | null {
  const raw = read("local", RESET_KEY);
  const at = raw === null ? NaN : Number(raw);
  return Number.isFinite(at) ? at : null;
}

/** Запросить сброс забытого PIN-кода: он станет доступен через сутки. Повторный запрос срок не продлевает. */
export function requestPinReset(now: number = Date.now()) {
  if (pinResetAt() === null) write("local", RESET_KEY, String(now + RESET_DELAY_MS));
  emit();
}

/** Сбросить PIN-код, если срок прошёл. */
export function confirmPinReset(now: number = Date.now()): boolean {
  const at = pinResetAt();
  if (at === null || now < at) return false;
  forgetPin();
  return true;
}

export function lockParent() {
  write("session", UNLOCK_KEY, null);
  emit();
}

export function forgetPin() {
  write("local", PIN_KEY, null);
  write("local", FAILS_KEY, null);
  write("local", RESET_KEY, null);
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
