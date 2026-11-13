/** «Закрепи»: у каждого урока из списка есть настоящая тема центра задач, и в ней есть что решать. */
import { describe, expect, it } from "vitest";
import { CHESS_RU } from "@/content/chess/content";
import { LESSON_PRACTICE } from "@/content/chess/lessonPractice";
import { PUZZLES, PUZZLE_THEMES } from "@/content/chess/puzzles";
import { bankCount } from "@/lib/puzzleBankIndex";

const lessons = [
  ...CHESS_RU.tactics,
  ...CHESS_RU.course1Lessons,
  ...CHESS_RU.course2Lessons,
  ...CHESS_RU.course3Lessons,
  ...CHESS_RU.course4Lessons,
  ...CHESS_RU.course5Lessons,
];

describe("закрепление урока в центре задач", () => {
  it("ключи — существующие уроки, темы — существующие темы с задачами", () => {
    const ids = new Set(lessons.map((l) => l.id));
    const themes = new Set(PUZZLE_THEMES.map((x) => x.id));
    for (const [lesson, theme] of Object.entries(LESSON_PRACTICE)) {
      expect(ids, lesson).toContain(lesson);
      expect(themes, `${lesson}: ${theme}`).toContain(theme);
      const own = PUZZLES.filter((p) => p.theme === theme).length;
      expect(own + bankCount(theme), `${lesson}: ${theme}`).toBeGreaterThanOrEqual(5);
    }
  });

  it("закрепление есть больше чем у половины уроков с упражнениями «найди ход»", () => {
    const tactical = lessons.filter((l) => l.exercises.some((e) => e.kind === "move" || e.kind === "choose"));
    const covered = tactical.filter((l) => LESSON_PRACTICE[l.id]);
    expect(covered.length / tactical.length).toBeGreaterThan(0.5);
  });
});
