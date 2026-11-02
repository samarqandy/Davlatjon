/** Диплом ступени курса: итоговый тест решён и набрана нужная доля упражнений; дата — когда выполнены оба условия. */
import { describe, expect, it } from "vitest";
import { COURSE_DIPLOMA_SHARE, courseDiplomaNeed, courseEarnedAt } from "@/lib/certificate";

const solved = (pairs: [string, number][]) => ({
  chess: Object.fromEntries(pairs.map(([id, at]) => [id, { solvedAt: at, misses: 0 }])),
});
const ALL = Array.from({ length: 10 }, (_, i) => `e${i + 1}`);
const FINAL = ["e9", "e10"];

describe("диплом ступени", () => {
  it("нужная доля — 80 %, с округлением вверх", () => {
    expect(COURSE_DIPLOMA_SHARE).toBe(0.8);
    expect(courseDiplomaNeed(10)).toBe(8);
    expect(courseDiplomaNeed(11)).toBe(9);
  });

  it("без итогового теста диплома нет, даже если решено почти всё", () => {
    expect(courseEarnedAt(ALL, FINAL, solved(ALL.slice(0, 9).map((id, i) => [id, i + 1])))).toBeNull();
  });

  it("тест решён, но упражнений мало — диплома нет", () => {
    expect(
      courseEarnedAt(
        ALL,
        FINAL,
        solved([
          ["e1", 1],
          ["e9", 2],
          ["e10", 3],
        ]),
      ),
    ).toBeNull();
  });

  it("дата — момент, когда выполнено последнее из двух условий", () => {
    // Восьмое по счёту решение (вместе с тестом) — в момент 60, тест закончен в 50 → диплом в 60.
    const early = ALL.slice(0, 6).map((id, i): [string, number] => [id, (i + 1) * 10]);
    expect(courseEarnedAt(ALL, FINAL, solved([...early, ["e9", 40], ["e10", 50]]))).toBe(60);
    // Тест закончен позже, чем набралась доля.
    const many = ALL.slice(0, 8).map((id, i): [string, number] => [id, (i + 1) * 10]);
    expect(courseEarnedAt(ALL, FINAL, solved([...many, ["e9", 100], ["e10", 200]]))).toBe(200);
  });

  it("пустой курс — диплома нет", () => {
    expect(courseEarnedAt([], [], solved([]))).toBeNull();
  });
});
