/** Контрольные тесты: по двенадцать вопросов, id не пересекаются, ответы проверены в chess.test.ts, узбекский текст без кириллицы. */
import { describe, expect, it } from "vitest";
import { CHESS_LEVELS } from "@/content/chess";
import { chessContent } from "@/content/chess/content";
import { TACTICS } from "@/content/chess/tactics";
import { CHESS_TESTS } from "@/content/chess/tests";
import { starsFor } from "@/components/chess/ChessTests";

describe("контрольные тесты", () => {
  it("три теста по двенадцать вопросов; id уникальны и не пересекаются с уровнями и тактикой", () => {
    expect(CHESS_TESTS.map((t) => t.id)).toEqual(["test-1", "test-2", "test-3"]);
    const taken = new Set([
      ...CHESS_LEVELS.flatMap((l) => l.exercises.map((e) => e.id)),
      ...TACTICS.flatMap((t) => t.exercises.map((e) => e.id)),
    ]);
    const seen = new Set<string>();
    for (const t of CHESS_TESTS) {
      expect(t.exercises, t.id).toHaveLength(12);
      t.exercises.forEach((e, i) => {
        expect(e.id).toBe(`${t.id}-${i + 1}`);
        expect(taken.has(e.id), e.id).toBe(false);
        expect(seen.has(e.id), e.id).toBe(false);
        seen.add(e.id);
      });
      // В каждом тесте есть и ходы на доске, и вопросы с выбором.
      expect(
        t.exercises.some((e) => e.kind === "move"),
        t.id,
      ).toBe(true);
      expect(
        t.exercises.some((e) => e.kind === "quiz"),
        t.id,
      ).toBe(true);
    }
  });

  it("вопрос-викторина в тесте — ровно один вопрос с одним верным ответом", () => {
    for (const t of CHESS_TESTS)
      for (const e of t.exercises) {
        if (e.kind !== "quiz") continue;
        expect(e.questions, e.id).toHaveLength(1);
        expect(e.questions[0].correct).toBeLessThan(e.questions[0].options.length);
      }
  });

  it("звёзды: 10 из 12 — три, 8 — две, 6 — одна", () => {
    expect([12, 10, 9, 8, 7, 6, 5, 0].map(starsFor)).toEqual([3, 3, 2, 2, 1, 1, 0, 0]);
  });

  it("узбекская версия: те же позиции и ответы, без кириллицы", () => {
    const ru = chessContent("ru").tests;
    const uz = chessContent("uz").tests;
    for (const [i, t] of ru.entries()) {
      expect(uz[i].exercises.length).toBe(t.exercises.length);
      for (const [j, e] of t.exercises.entries()) {
        const u = uz[i].exercises[j];
        expect(u.id).toBe(e.id);
        if (e.kind === "move" && u.kind === "move") expect(u.fen).toBe(e.fen);
        if (e.kind === "quiz" && u.kind === "quiz")
          e.questions.forEach((q, k) => {
            expect(u.questions[k].options.length, e.id).toBe(q.options.length);
            expect(u.questions[k].correct, e.id).toBe(q.correct);
          });
        expect(JSON.stringify(u), e.id).not.toMatch(/[А-Яа-яЁё]/);
      }
      expect(`${uz[i].title}${uz[i].intro}`).not.toMatch(/[А-Яа-яЁё]/);
    }
  });
});
