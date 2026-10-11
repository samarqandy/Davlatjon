/**
 * Какой текст озвучен в каждой записи диктора. По этим текстам строится оглавление записей
 * (src/content/voice-clips.json): для каждой записи — отпечаток текста, с которого её записали.
 * Изменился текст задачи или урока — тест скажет, что запись устарела и её надо перезаписать.
 */
import type { ChessExercise, ChessLessonCard } from "@/content/chess/types";
import type { Block } from "@/content/types";

/** Условие задачи — то, что озвучивает кнопка «Прочитать» (метки имени остаются как есть). */
export function taskVoiceText(body: readonly Block[]): string {
  return body
    .flatMap((b) =>
      b.type === "p" || b.type === "note"
        ? [b.text]
        : b.type === "list"
          ? b.items
          : b.type === "question"
            ? [b.label, b.text ?? ""]
            : [],
    )
    .filter(Boolean)
    .join("\n");
}

export function lessonVoiceText(card: Pick<ChessLessonCard, "title" | "text">): string {
  return [card.title, ...card.text].join("\n");
}

/** Условие упражнения: название и задание — так их читает диктор. */
export function exerciseVoiceText(ex: Pick<ChessExercise, "title" | "prompt">): string {
  return `${ex.title.replace(/[.!?:\s]+$/, "")}. ${ex.prompt}`;
}

/** Отпечаток текста (FNV-1a, 32 бита) — короткий и одинаковый везде. */
export function textHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
