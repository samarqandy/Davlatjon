"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Сегодняшняя дата «ГГГГ-ММ-ДД» — на сервере пустая строка, чтобы не было расхождений при гидратации. */
export function useToday(): string {
  return useSyncExternalStore(noop, todayIso, () => "");
}
