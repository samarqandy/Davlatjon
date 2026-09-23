"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

/** Текущий #якорь адреса. На сервере — пустая строка. */
export function useHash(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
}

export function setHash(hash: string) {
  if (window.location.hash === hash) return;
  window.location.hash = hash;
}
