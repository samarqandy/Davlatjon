/** Уроки бывшей ступени 3 переехали в ступень 4 «Ладья»: прогресс переносится с «c3-…» на «c4-…». */
import { describe, expect, it } from "vitest";
import { CHESS_RU, courseLessons } from "@/content/chess/content";
import { migrateCourseIds } from "@/lib/courseMigration";
import { sanitize } from "@/lib/state";

const step3 = courseLessons(CHESS_RU, CHESS_RU.course3Lessons).flatMap((l) => l.exercises.map((e) => e.id));
const step4 = courseLessons(CHESS_RU, CHESS_RU.course4Lessons).flatMap((l) => l.exercises.map((e) => e.id));

describe("перенос прогресса ступени 3 → 4", () => {
  it("каждое упражнение ступени 4 находит своё старое решение «c3-…»", () => {
    const old = Object.fromEntries(step4.map((id) => [id.replace(/^c4-/, "c3-"), { solvedAt: 1, misses: 0 }]));
    const moved = migrateCourseIds(old);
    for (const id of step4) expect(moved[id], id).toBeTruthy();
    expect(Object.keys(moved).some((k) => k.startsWith("c3-"))).toBe(false);
  });

  it("новые упражнения ступени 3 «Слон» не трогаются и не совпадают со старыми именами", () => {
    const own = Object.fromEntries(step3.map((id) => [id, { solvedAt: 2, misses: 0 }]));
    expect(migrateCourseIds(own)).toEqual(own);
    const moved = new Set(step4.map((id) => id.replace(/^c4-/, "c3-")));
    for (const id of step3) expect(moved.has(id), id).toBe(false);
  });

  it("sanitize переносит прогресс, а уже существующее решение «c4-…» не перезаписывается", () => {
    const s = sanitize({
      chess: {
        "c3-horwitz-g7": { solvedAt: 5, misses: 1 },
        "c4-square-choose": { solvedAt: 9, misses: 0 },
        "c3-square-choose": { solvedAt: 3, misses: 0 },
      },
    });
    expect(s.chess["c4-horwitz-g7"]).toEqual({ solvedAt: 5, misses: 1 });
    expect(s.chess["c4-square-choose"]).toEqual({ solvedAt: 9, misses: 0 });
    expect(s.chess["c3-horwitz-g7"]).toBeUndefined();
  });
});
