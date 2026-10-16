import { describe, expect, it } from "vitest";
import { DEFAULT_STATE, sanitize } from "@/lib/state";
import {
  ageBand,
  bestCategory,
  nextBase,
  parseQuery,
  weekKey,
  weeklyGain,
} from "@/lib/leaderboard";
import { mergeStates } from "@/lib/sync";
import { xpBreakdown, xpTotal, type XpBreakdown } from "@/lib/xp";

const b = (o: Partial<XpBreakdown>): XpBreakdown => ({ total: 0, math: 0, chess: 0, puzzles: 0, quick: 0, ...o });

describe("рейтинг: чистая логика", () => {
  it("возрастные группы; без возраста — средняя", () => {
    expect([4, 6, 7, 9, 10, 15].map(ageBand)).toEqual(["4-6", "4-6", "7-9", "7-9", "10+", "10+"]);
    expect(ageBand(undefined)).toBe("7-9");
  });

  it("неделя начинается в понедельник по Ташкенту", () => {
    // 2026-10-12 — понедельник. Воскресенье 19:30 UTC = понедельник 00:30 в Ташкенте.
    expect(weekKey(Date.UTC(2026, 9, 12, 0, 0))).toBe("2026-10-12");
    expect(weekKey(Date.UTC(2026, 9, 18, 18, 59))).toBe("2026-10-12");
    expect(weekKey(Date.UTC(2026, 9, 18, 19, 0))).toBe("2026-10-19");
    expect(weekKey(Date.UTC(2026, 9, 15, 10, 0))).toBe("2026-10-12");
  });

  it("начало недели: новая запись — текущие очки; та же неделя — прежняя; новая неделя — последние очки", () => {
    const cur = b({ total: 50 });
    expect(nextBase(null, cur, "w2")).toEqual(cur);
    const prev = { week: "w1", base: b({ total: 10 }), totals: b({ total: 40 }) };
    expect(nextBase(prev, cur, "w1")).toEqual(prev.base);
    expect(nextBase(prev, cur, "w2")).toEqual(prev.totals);
  });

  it("прирост не бывает отрицательным", () => {
    expect(weeklyGain(b({ total: 30 }), b({ total: 10 }), "total")).toBe(20);
    expect(weeklyGain(b({ total: 5 }), b({ total: 10 }), "total")).toBe(0);
  });

  it("запрос: неизвестное → значения по умолчанию", () => {
    expect(parseQuery(new URLSearchParams("scope=x&cat=y&age=z"))).toEqual({ scope: "week", category: "total", age: "all" });
    expect(parseQuery(new URLSearchParams("scope=all&cat=chess&age=10%2B"))).toEqual({ scope: "all", category: "chess", age: "10+" });
  });

  it("сильнейшее направление", () => {
    expect(bestCategory(b({ total: 0 }))).toBeNull();
    expect(bestCategory(b({ total: 30, math: 10, chess: 20 }))).toBe("chess");
    expect(bestCategory(b({ total: 20, math: 10, quick: 10 }))).toBe("math");
  });

  it("разбивка очков в сумме даёт общий опыт", () => {
    const state = sanitize({
      ...DEFAULT_STATE,
      tasks: { "w1d1t1": { solvedAt: 1, tries: 0 } },
      chess: { "x-1": { solvedAt: 1, misses: 0 } },
    });
    const br = xpBreakdown(state);
    expect(br.math + br.chess + br.puzzles + br.quick).toBe(br.total);
    expect(xpTotal(state)).toBe(br.total);
  });

  it("настройка участия переживает слияние, в том числе явное «выключено»", () => {
    const on = { ...DEFAULT_STATE, settings: { ...DEFAULT_STATE.settings, leaderboard: true } };
    const off = { ...DEFAULT_STATE, settings: { ...DEFAULT_STATE.settings, leaderboard: false } };
    expect(mergeStates(on, DEFAULT_STATE).settings.leaderboard).toBe(true);
    expect(mergeStates(off, on).settings.leaderboard).toBe(false);
    expect(sanitize(off).settings.leaderboard).toBe(false);
    expect(sanitize({ ...DEFAULT_STATE, settings: { ...DEFAULT_STATE.settings, leaderboard: "yes" } }).settings.leaderboard).toBeUndefined();
  });
});

describe("sanitize: испорченные записи не роняют страницы", () => {
  it("выбрасывает null и числа из словарей, достраивает marks", () => {
    const s = sanitize({
      version: 99,
      tasks: { a: null, b: 1, c: { status: "solved" } },
      chess: { x: null, y: { solvedAt: 1, misses: 0 } },
      chessOpenings: { o: "no", p: 3 },
      quick: { q: NaN, r: 2 },
      myProblems: [null, 5, { id: "m" }],
    });
    expect(Object.keys(s.tasks)).toEqual(["c"]);
    expect(s.tasks.c.marks).toEqual({});
    expect(Object.keys(s.chess)).toEqual(["y"]);
    expect(s.chessOpenings).toEqual({ p: 3 });
    expect(s.quick).toEqual({ r: 2 });
    expect(s.myProblems).toHaveLength(1);
    expect(() => xpBreakdown(s)).not.toThrow();
  });
});
