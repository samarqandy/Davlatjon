/**
 * Обезличенная статистика (Vercel Web Analytics): без cookie, без имени ребёнка и без содержимого ответов.
 * Считаем только, сколько раз начинают занятия и решают задачи, — чтобы видеть, где дети бросают и что
 * улучшать в интерфейсе. Вне браузера и при любой ошибке молчим: учёба не должна от этого зависеть.
 */
import { track } from "@vercel/analytics";

export type LearningEvent = "day_start" | "task_solved" | "chess_solved";

/** Направление упражнения шахматной школы по его id: «c3-…» → «course-3», иначе — уровни и тактика. */
export function chessArea(id: string): string {
  const step = /^c(\d)-/.exec(id)?.[1];
  return step ? `course-${step}` : "school";
}

export function trackLearning(event: LearningEvent, props: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  try {
    track(event, props);
  } catch {
    // статистика недоступна — ничего страшного
  }
}
