"use client";

/**
 * Короткая вибрация в ответ на действие — на телефонах, где браузер её умеет (Android; на iPhone функции нет).
 * Только для итогов: верный ответ, «попробуй ещё», ход, который сделать нельзя, конец занятия. На каждое
 * нажатие не вибрируем. Включается вместе со звуками доски: вызывает её sfx.ts после своей проверки настройки.
 */
export type Haptic = "success" | "retry" | "illegal" | "finish";

/** Длительности в миллисекундах: вибрация, пауза, вибрация… Короткие — отклик, а не будильник. */
export const HAPTIC_PATTERNS: Record<Haptic, number[]> = {
  success: [18],
  retry: [12, 60, 12],
  illegal: [8],
  finish: [20, 70, 20, 70, 40],
};

export function haptic(kind: Haptic) {
  if (typeof window === "undefined") return;
  // Для проверок: какой отклик хотели дать.
  window.dispatchEvent(new CustomEvent("haptic", { detail: kind }));
  if (typeof navigator.vibrate !== "function") return;
  try {
    // До первого касания страницы браузер вибрацию не даёт — вернёт false, это не ошибка.
    navigator.vibrate(HAPTIC_PATTERNS[kind]);
  } catch {
    // Вибрация запрещена настройками браузера или страницы — остаёмся без неё.
  }
}
