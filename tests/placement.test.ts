/** Вводный тест «с какой недели начать». */
import { describe, expect, it } from "vitest";
import { PLACEMENT, isCorrect, startWeekFor } from "@/lib/placement";

const answers = (right: string[]) => Object.fromEntries(PLACEMENT.map((q) => [q.id, right.includes(q.id)]));

describe("startWeekFor", () => {
  it("начинаем с первой недели, где что-то не получилось; всё верно — с третьей", () => {
    expect(startWeekFor(answers([]))).toBe(1);
    expect(startWeekFor(answers(["a1"]))).toBe(1);
    expect(startWeekFor(answers(["a1", "a2"]))).toBe(2);
    expect(startWeekFor(answers(["a1", "a2", "b1"]))).toBe(2);
    expect(startWeekFor(answers(["a1", "a2", "b1", "b2"]))).toBe(3);
    expect(startWeekFor(answers(PLACEMENT.map((q) => q.id)))).toBe(3);
    // Верные задачи третьей недели без первых не перепрыгивают через первую.
    expect(startWeekFor(answers(["c1", "c2"]))).toBe(1);
  });
});

describe("задачи теста", () => {
  it("по две на каждую неделю, обе языковые версии есть, ответ — целое число", () => {
    for (const week of [1, 2, 3]) expect(PLACEMENT.filter((q) => q.week === week)).toHaveLength(2);
    for (const q of PLACEMENT) {
      expect(q.ru.length).toBeGreaterThan(10);
      expect(q.uz.length).toBeGreaterThan(10);
      expect(/[А-Яа-яЁё]/.test(q.uz)).toBe(false);
      expect(Number.isInteger(q.answer)).toBe(true);
    }
  });

  it("ответы проверены вручную: 27+18, ряд на 3, 42−17, 5·8−12, ряд удвоения, 12+15−20", () => {
    const by = Object.fromEntries(PLACEMENT.map((q) => [q.id, q.answer]));
    expect(by).toEqual({ a1: 27 + 18, a2: 15, b1: 42 - 17, b2: 5 * 8 - 12, c1: 32, c2: 12 + 15 - 20 });
  });

  it("isCorrect принимает только целое число, равное ответу", () => {
    const q = PLACEMENT[0];
    expect(isCorrect(q, "45")).toBe(true);
    expect(isCorrect(q, " 45 ")).toBe(true);
    expect(isCorrect(q, "45.0")).toBe(false);
    expect(isCorrect(q, "")).toBe(false);
    expect(isCorrect(q, "abc")).toBe(false);
  });
});
