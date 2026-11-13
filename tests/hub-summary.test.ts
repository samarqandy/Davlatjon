/** Сводка главной шахмат: совпадает с контентом, не тянет в браузер уроки и решения, остаётся лёгкой. */
import { describe, expect, it } from "vitest";
import { chessContent, courseLessons } from "@/content/chess/content";
import { chessGlossary } from "@/content/chess/glossary";
import { chessHubSummary } from "@/content/chess/hubSummary";
import { dailyPuzzle } from "@/content/chess/puzzles";
import { pickDaily } from "@/lib/dailyPuzzle";
import type { Lang } from "@/lib/lang";

const LANGS: Lang[] = ["ru", "uz"];

describe("сводка главной шахмат", () => {
  it.each(LANGS)("ступени курса, уровни, тактика и задачи совпадают с контентом (%s)", (lang) => {
    const c = chessContent(lang);
    const s = chessHubSummary(lang);
    const pool = { levels: c.levels, tactics: c.tactics };
    const courses = [
      [c.course1, c.course1Lessons],
      [c.course2, c.course2Lessons],
      [c.course3, c.course3Lessons],
      [c.course4, c.course4Lessons],
      [c.course5, c.course5Lessons],
    ] as const;
    expect(s.steps).toHaveLength(courses.length);
    courses.forEach(([course, lessons], i) => {
      expect(s.steps[i].title).toBe(course.title);
      expect(s.steps[i].lessons).toEqual(
        courseLessons(pool, lessons).map((l) => ({
          id: l.id,
          title: l.title,
          exercises: l.exercises.map((e) => e.id),
        })),
      );
      // У каждого урока есть упражнения: по ним считается «следующий шаг».
      for (const lesson of s.steps[i].lessons) expect(lesson.exercises.length, lesson.id).toBeGreaterThan(0);
    });
    expect(s.levels.map((l) => [l.id, l.piece, l.name, l.exercises.map((e) => e.id)])).toEqual(
      c.levels.map((l) => [l.id, l.piece, l.name, l.exercises.map((e) => e.id)]),
    );
    expect(s.glossaryCount).toBe(chessGlossary(lang).length);
    expect(s.tacticExercises).toEqual(c.tactics.flatMap((x) => x.exercises.map((e) => e.id)));
    expect(s.puzzles.map((p) => [p.id, p.title, p.stars, p.fen])).toEqual(
      c.puzzles.map((p) => [p.id, p.title, p.stars, p.fen]),
    );
    expect(s.didYouKnow.map((x) => [x.q, x.a])).toEqual(c.didYouKnow.map((x) => [x.q, x.a]));
    expect(s.school).toEqual({ title: c.school.title, about: c.school.about });
  });

  it("в сводке нет решений, подсказок и текстов уроков — и она лёгкая", () => {
    for (const lang of LANGS) {
      const json = JSON.stringify(chessHubSummary(lang));
      // Ключи полного контента: решения, подсказки, тексты уроков («lesson», не «lessons») и условия.
      for (const key of ["solution", "explanation", "hint", "why", "answer", "lesson", "mateIn", "prompt"])
        expect(json, `${lang}: ${key}`).not.toContain(`"${key}":`);
      // Было около 165 КБ скриптов на язык; сводка — в разы меньше.
      expect(json.length, lang).toBeLessThan(60_000);
    }
  });

  it("записи диктора: адрес есть только у записанных вопросов", () => {
    for (const lang of LANGS)
      for (const item of chessHubSummary(lang).didYouKnow) {
        if (item.voiceQ) expect(item.voiceQ).toMatch(/^\/audio\/(uz\/)?dyk\/\d+-q\.mp3$/);
        if (item.voiceA) expect(item.voiceA).toMatch(/^\/audio\/(uz\/)?dyk\/\d+-a\.mp3$/);
      }
    expect(chessHubSummary("ru").didYouKnow.some((x) => x.voiceQ)).toBe(true);
  });

  it("задача дня из короткого списка — та же, что из полного, в любой день и для любого возраста", () => {
    const short = chessHubSummary("ru").puzzles;
    for (let d = 0; d < 400; d += 7)
      for (const minStars of [1, 3, 5, 9]) {
        const date = new Date(2026, 0, 1 + d, 12);
        expect(pickDaily(short, date, minStars).id).toBe(dailyPuzzle(date, minStars).id);
      }
  });
});
