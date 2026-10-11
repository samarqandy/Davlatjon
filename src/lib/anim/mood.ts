/** Настроения птицы Парвоз. Порядок задаёт число для Rive-входа `mood`. */
export const MOODS = ["idle", "happy", "thinking", "correct", "incorrect", "celebration"] as const;
export type Mood = (typeof MOODS)[number];

/** Что сказать Rive: число для `mood` и (для разовых реакций) имя триггера. */
export interface RiveCommand {
  mood: number;
  trigger: string | null;
}

/**
 * Циклические настроения (покой, радость, раздумье, праздник) задаются числом `mood`.
 * Разовые («верно», «подумаем ещё») запускаются триггером и сами возвращаются в покой, поэтому `mood` остаётся 0:
 * так следующий ответ снова сработает, а птица не «застревает» в реакции.
 */
export function riveCommand(mood: Mood): RiveCommand {
  if (mood === "correct") return { mood: 0, trigger: "correct" };
  if (mood === "incorrect") return { mood: 0, trigger: "incorrect" };
  return { mood: MOODS.indexOf(mood), trigger: null };
}

/** Настроение птицы под ответ: верно — радуется, «подумаем ещё» — мягко наклоняет голову, подсказка — задумывается. Грусти нет. */
export function feedbackMood(tone: "success" | "retry" | "info"): Mood {
  if (tone === "success") return "correct";
  if (tone === "retry") return "incorrect";
  return "thinking";
}
