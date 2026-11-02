import type { ChessCourseLesson, ChessExercise, ChessLevel, ChessTactic } from "./types";

/**
 * Уроки курса с готовым списком упражнений: сначала подключённые по id (refs) из уровней и тактики — на том же языке,
 * потом собственные упражнения урока. Неизвестный id — ошибка контента, её ловят тесты.
 * Без данных внутри — части контента приходят аргументом, поэтому модуль не тянет в браузер лишнего.
 */
export function courseLessons(
  content: {
    levels: readonly ChessLevel[];
    tactics: readonly ChessTactic[];
    course1Lessons?: readonly ChessCourseLesson[];
  },
  /** Уроки нужной ступени; по умолчанию — ступень 1. */
  lessons: readonly ChessCourseLesson[] = content.course1Lessons ?? [],
): (ChessTactic & { piece?: string })[] {
  const pool = new Map<string, ChessExercise>();
  for (const l of content.levels) for (const e of l.exercises) pool.set(e.id, e);
  for (const t of content.tactics) for (const e of t.exercises) pool.set(e.id, e);
  return lessons.map(({ refs, ...lesson }) => ({
    ...lesson,
    exercises: [...refs.flatMap((id) => pool.get(id) ?? []), ...lesson.exercises],
  }));
}
