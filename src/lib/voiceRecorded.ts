/**
 * Записанные условия задач, карточки уроков, подсказки и вопросы «Знаешь ли ты?»: «вид:id» → отпечаток текста
 * (см. voiceText.ts). Записи нет — нет и кнопки. Отдельно от voice.ts: список записей весит 15 КБ и нужен
 * только экранам с задачами и уроками.
 */
import recorded from "@/content/voice-clips.json";
import type { Lang } from "./lang";
import { sourceTaskId } from "./state";

const RECORDED = recorded as Record<Lang, Record<string, string>>;

function recordedClip(
  lang: Lang,
  kind: "tasks" | "lessons" | "dyk" | "exercises" | "hints",
  key: string,
  id: string,
): string | undefined {
  return RECORDED[lang][key] ? `/audio/${lang === "uz" ? "uz/" : ""}${kind}/${id}.mp3` : undefined;
}

export const RECORDED_CLIPS = {
  // Повторная попытка задачи («~id») читается той же записью, что и сама задача.
  task: (id: string, lang: Lang) => recordedClip(lang, "tasks", `task:${sourceTaskId(id)}`, sourceTaskId(id)),
  lesson: (levelId: string, index: number, lang: Lang) =>
    recordedClip(lang, "lessons", `lesson:${levelId}-${index}`, `${levelId}-${index}`),
  /** «Знаешь ли ты?»: part — вопрос (q) или ответ (a). */
  dyk: (index: number, part: "q" | "a", lang: Lang) =>
    recordedClip(lang, "dyk", `dyk:${index}-${part}`, `${index}-${part}`),
  /** Подсказка задачи (n — номер ступени с нуля). */
  hint: (taskId: string, n: number, lang: Lang) =>
    recordedClip(lang, "hints", `hint:${sourceTaskId(taskId)}-${n}`, `${sourceTaskId(taskId)}-${n}`),
  /** Условие шахматного упражнения: название и задание. */
  exercise: (id: string, lang: Lang) => recordedClip(lang, "exercises", `exercise:${id}`, id),
};
