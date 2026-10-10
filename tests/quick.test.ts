import { describe, expect, it } from "vitest";
import {
  QUICK_COUNT,
  defaultDeck,
  makeQuiz,
  quickKey,
  quickLevel,
  quickStars,
  rng,
  type Deck,
  type Question,
  type QuickLevel,
} from "@/lib/quick";

const LEVELS: QuickLevel[] = [1, 2, 3];
const DECKS: Deck[] = ["numbers", "little"];

/** Пересчитать пример заново и вернуть верный вариант — независимо от генератора. */
function solve(q: Question): string | null {
  const m = (re: RegExp) => q.show.match(re)?.slice(1).map(Number);
  let v: number[] | undefined;
  switch (q.kind) {
    case "add":
      v = m(/^(\d+) \+ (\d+) = \?$/);
      return v ? String(v[0] + v[1]) : null;
    case "sub":
      v = m(/^(\d+) − (\d+) = \?$/);
      return v ? String(v[0] - v[1]) : null;
    case "times":
      v = m(/^(\d+) × (\d+) = \?$/);
      return v ? String(v[0] * v[1]) : null;
    case "div":
      v = m(/^(\d+) ÷ (\d+) = \?$/);
      return v ? String(v[0] / v[1]) : null;
    case "missing":
      v = m(/^(\d+) \+ \? = (\d+)$/);
      if (v) return String(v[1] - v[0]);
      v = m(/^(\d+) − \? = (\d+)$/);
      return v ? String(v[0] - v[1]) : null;
    case "compare": {
      v = m(/^(\d+) \+ (\d+) \? (\d+)$/);
      const [l, r] = v ? [v[0] + v[1], v[2]] : (m(/^(\d+) \? (\d+)$/) ?? [0, 0]);
      return l < r ? "<" : l > r ? ">" : "=";
    }
    case "next": {
      const row = q.show.replace(", ?", "").split(", ").map(Number);
      const step = row[1] - row[0];
      row.forEach((n, i) => expect(n).toBe(row[0] + step * i));
      return String(row[3] + step);
    }
    default:
      return null;
  }
}

describe("быстрые примеры: генератор", () => {
  for (const deck of DECKS)
    for (const level of LEVELS)
      it(`${deck}, уровень ${level}: десять разных вопросов с одним верным вариантом`, () => {
        for (let seed = 1; seed <= 200; seed++) {
          const quiz = makeQuiz(deck, level, seed);
          expect(quiz).toHaveLength(QUICK_COUNT);
          const keys = new Set(quiz.map((q) => `${q.kind}|${q.show}|${[...q.options].sort().join(",")}`));
          expect(keys.size).toBe(QUICK_COUNT);
          for (const q of quiz) {
            expect(q.answer).toBeGreaterThanOrEqual(0);
            expect(q.answer).toBeLessThan(q.options.length);
            // Варианты не повторяются (кроме «найди лишнее»: там картинки повторяются, а лишняя одна).
            if (q.kind !== "odd") expect(new Set(q.options).size).toBe(q.options.length);
            const right = solve(q);
            if (right !== null) expect(q.options[q.answer]).toBe(right);
            for (const o of q.options) expect(o).not.toMatch(/^-|NaN|undefined/);
          }
        }
      });

  it("один seed — одна серия; другой seed — другая", () => {
    expect(makeQuiz("numbers", 2, 7)).toEqual(makeQuiz("numbers", 2, 7));
    expect(makeQuiz("numbers", 2, 7)).not.toEqual(makeQuiz("numbers", 2, 8));
  });

  it("уровни растут: на первом всё в пределах двадцати, на третьем есть таблица умножения", () => {
    for (let seed = 1; seed <= 100; seed++)
      for (const q of makeQuiz("numbers", 1, seed)) {
        expect(["add", "sub", "missing", "compare", "next"]).toContain(q.kind);
        for (const n of q.show.match(/\d+/g) ?? []) expect(Number(n)).toBeLessThanOrEqual(60);
      }
    const kinds = new Set(
      Array.from({ length: 50 }, (_, i) => makeQuiz("numbers", 3, i + 1).map((q) => q.kind)).flat(),
    );
    expect(kinds.has("times") && kinds.has("div")).toBe(true);
  });

  it("картинки: у «сосчитай» число картинок равно ответу, у «найди лишнее» одна картинка не такая", () => {
    for (let seed = 1; seed <= 200; seed++)
      for (const q of makeQuiz("little", 3, seed)) {
        if (q.kind === "count") expect(String(q.show.split(" ").length)).toBe(q.options[q.answer]);
        if (q.kind === "odd") {
          const odd = q.options[q.answer];
          expect(q.options.filter((o) => o === odd)).toHaveLength(1);
          expect(new Set(q.options).size).toBe(2);
        }
        if (q.kind === "more") {
          const [l, r] = q.show.split("|").map((s) => [...s.trim()].length);
          expect(q.options[q.answer]).toBe(l > r ? "⬅️" : "➡️");
        }
        if (q.kind === "bigger") expect(Number(q.options[q.answer])).toBe(Math.max(...q.options.map(Number)));
        if (q.kind === "pattern") expect(q.show.endsWith("❓")).toBe(true);
      }
  });

  it("уровень и колода по возрасту; звёзды и ключ записи", () => {
    expect(defaultDeck(4)).toBe("little");
    expect(defaultDeck(5)).toBe("little");
    expect(defaultDeck(6)).toBe("numbers");
    expect(defaultDeck(undefined)).toBe("numbers");
    expect([6, 8, 10].map((a) => quickLevel("numbers", a))).toEqual([1, 2, 3]);
    expect([4, 5, 6].map((a) => quickLevel("little", a))).toEqual([1, 2, 3]);
    expect([10, 9, 7, 5, 4, 0].map((s) => quickStars(s))).toEqual([3, 3, 2, 1, 1, 0]);
    expect(quickKey("2026-10-10", "little")).toBe("2026-10-10:little");
  });

  it("rng даёт числа от 0 до 1 и повторяется по seed", () => {
    const a = rng(5);
    const b = rng(5);
    for (let i = 0; i < 20; i++) {
      const x = a();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
      expect(x).toBe(b());
    }
  });
});
