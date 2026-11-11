/**
 * Сводка для главной шахмат — собирается на сервере (app/[lang]/chess/page.tsx). Странице нужны названия,
 * счётчики, словарик и короткий список задач для «задачи дня»; тексты уроков, позиции упражнений, истории и
 * список записей диктора в браузер не попадают (раньше — около 330 КБ скриптов на двух языках).
 */
import type { Lang } from "@/lib/lang";
import { RECORDED_CLIPS } from "@/lib/voiceRecorded";
import { chessContent, courseLessons } from "./content";
import type { ChessLevelId } from "./types";

export interface ChessHubSummary {
  school: { title: string; about: string };
  /** Шесть званий: фигура, название и id упражнений — для прогресса и замков. */
  levels: { id: ChessLevelId; piece: string; name: string; exercises: { id: string }[] }[];
  /** Словарик: термины всех уровней по порядку. */
  glossary: { term: string; text: string; uz?: string }[];
  /** Ступени курса по порядку: название и уроки с id упражнений. */
  steps: { title: string; lessons: { id: string; title: string; exercises: string[] }[] }[];
  /** id упражнений раздела «Тактика». */
  tacticExercises: string[];
  /** Задачи школы — столько, сколько нужно для карточки «задача дня». */
  puzzles: { id: string; title: string; stars: number; fen: string }[];
  /** «Знаешь ли ты?»: вопрос, ответ и готовые адреса записей диктора (если записаны). */
  didYouKnow: { q: string; a: string; href?: string; voiceQ?: string; voiceA?: string }[];
}

export function chessHubSummary(lang: Lang): ChessHubSummary {
  const c = chessContent(lang);
  const pool = { levels: c.levels, tactics: c.tactics };
  const courses = [
    [c.course1, c.course1Lessons],
    [c.course2, c.course2Lessons],
    [c.course3, c.course3Lessons],
    [c.course4, c.course4Lessons],
    [c.course5, c.course5Lessons],
  ] as const;
  return {
    school: { title: c.school.title, about: c.school.about },
    levels: c.levels.map((l) => ({
      id: l.id,
      piece: l.piece,
      name: l.name,
      exercises: l.exercises.map((e) => ({ id: e.id })),
    })),
    glossary: c.levels.flatMap((l) => l.terms.map(({ term, text, uz }) => ({ term, text, ...(uz ? { uz } : {}) }))),
    steps: courses.map(([course, lessons]) => ({
      title: course.title,
      lessons: courseLessons(pool, lessons).map((l) => ({
        id: l.id,
        title: l.title,
        exercises: l.exercises.map((e) => e.id),
      })),
    })),
    tacticExercises: c.tactics.flatMap((x) => x.exercises.map((e) => e.id)),
    puzzles: c.puzzles.map((p) => ({ id: p.id, title: p.title, stars: p.stars, fen: p.fen })),
    didYouKnow: c.didYouKnow.map((item, i) => {
      const voiceQ = RECORDED_CLIPS.dyk(i, "q", lang);
      const voiceA = RECORDED_CLIPS.dyk(i, "a", lang);
      return { ...item, ...(voiceQ ? { voiceQ } : {}), ...(voiceA ? { voiceA } : {}) };
    }),
  };
}
