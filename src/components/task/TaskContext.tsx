"use client";

import { createContext, useContext } from "react";

/** Идентификатор задачи для интерактивных иллюстраций (например, таблицы с ✗ и ✓). */
export const TaskIdContext = createContext<string | null>(null);

export function useTaskId(): string | null {
  return useContext(TaskIdContext);
}
