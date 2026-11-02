import type { ChessCourseLesson, ChessCourseModule } from "@/content/chess/types";

/**
 * Ступень курса для страниц курса, диплома и карточек. Каждая ступень — свой модуль (step1.ts, step2.ts),
 * чтобы страница ступени тянула в браузер только свой контент.
 */
export interface CourseStep {
  n: number;
  /** Адрес страницы курса; диплом — `${href}/diploma`. */
  href: string;
  /** Урок с итоговым тестом: его упражнения нужны для диплома. */
  final: string;
  /** Фигура ступени — на дипломе и в карточках. */
  piece: string;
  /** Звание на дипломе. */
  award: { ru: string; uz: string };
  /** Тексты, модули и уроки ступени на языке интерфейса (хук). */
  useContent: () => {
    info: { title: string; subtitle: string; about: string };
    modules: ChessCourseModule[];
    lessons: ChessCourseLesson[];
  };
}

export const diplomaHref = (step: Pick<CourseStep, "href">) => `${step.href}/diploma`;
