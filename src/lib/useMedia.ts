"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Подходит ли экран под медиа-запрос («(min-width: 40rem)»). На сервере и до загрузки — false:
 * то, что нужно только широкому экрану (доска-превью), на телефоне не загружается вовсе.
 */
export function useMedia(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
