/** Возраст ребёнка → профиль: открытые уровни шахмат, сложность задачи дня, советы. */
import { describe, expect, it } from "vitest";
import { CHESS_LEVELS } from "@/content/chess";
import { PUZZLES, dailyPuzzle } from "@/content/chess/puzzles";
import { AGE_MAX, AGE_MIN, PROFILES, ageProfile, profileMeta } from "@/lib/age";
import { levelStatuses } from "@/lib/chessProgress";
import { sanitize } from "@/lib/store";

describe("возраст и профиль занятий", () => {
  it("возраст переводится в профиль, без возраста — младший", () => {
    expect(ageProfile(undefined)).toBe("junior");
    expect(ageProfile(6)).toBe("junior");
    expect(ageProfile(8)).toBe("junior");
    expect(ageProfile(9)).toBe("middle");
    expect(ageProfile(10)).toBe("middle");
    expect(ageProfile(11)).toBe("senior");
    expect(ageProfile(15)).toBe("senior");
    expect(AGE_MIN).toBeLessThan(AGE_MAX);
    for (const p of Object.values(PROFILES)) {
      expect(p.robotLevel).toBeGreaterThanOrEqual(1);
      expect(p.robotLevel).toBeLessThanOrEqual(5);
      expect(p.openLevels).toBeGreaterThanOrEqual(1);
      expect(p.openLevels).toBeLessThanOrEqual(CHESS_LEVELS.length);
      expect(p.about.length).toBeGreaterThan(40);
    }
    expect(profileMeta(12).openLevels).toBe(CHESS_LEVELS.length);
  });

  it("возраст сохраняется только целым числом от 6 до 15", () => {
    expect(sanitize({ settings: { age: 10 } }).settings.age).toBe(10);
    expect(sanitize({ settings: { age: 15 } }).settings.age).toBe(15);
    expect(sanitize({ settings: { age: 3 } }).settings.age).toBeUndefined();
    expect(sanitize({ settings: { age: 40 } }).settings.age).toBeUndefined();
    expect(sanitize({ settings: { age: "9" } }).settings.age).toBeUndefined();
    expect(sanitize({ settings: { age: 9.5 } }).settings.age).toBeUndefined();
    expect(sanitize({}).settings.age).toBeUndefined();
  });

  it("уровни шахмат открываются по возрасту или все сразу по решению родителя", () => {
    const open = (settings: Record<string, unknown>) =>
      levelStatuses(CHESS_LEVELS, sanitize({ settings })).map((s) => s.unlocked);
    expect(open({})).toEqual([true, false, false, false, false, false]);
    expect(open({ age: 8 })).toEqual([true, false, false, false, false, false]);
    expect(open({ age: 9 })).toEqual([true, true, true, false, false, false]);
    expect(open({ age: 12 })).toEqual([true, true, true, true, true, true]);
    expect(open({ chessOpenAll: true })).toEqual([true, true, true, true, true, true]);
  });

  it("задача дня по возрасту сложнее, но в один день у всех одна", () => {
    const day = new Date(2026, 8, 27);
    for (const min of [1, 2, 3] as const) {
      const p = dailyPuzzle(day, min);
      expect(p.stars).toBeGreaterThanOrEqual(min);
      expect(dailyPuzzle(day, min).id).toBe(p.id);
    }
    expect(PUZZLES.filter((p) => p.stars >= 3).length).toBeGreaterThanOrEqual(5);
    // Для младших задача дня — как раньше, без фильтра.
    expect(dailyPuzzle(day).id).toBe(dailyPuzzle(day, 1).id);
  });
});
