/** Шахматные уровни: следующий открывается при решении ~70 % упражнений, звание — только за все. */
import { describe, expect, it } from "vitest";
import { CHESS_LEVELS } from "@/content/chess";
import { currentRank, levelStatuses, unlockNeed } from "@/lib/chessProgress";
import { DEFAULT_STATE, type AppState } from "@/lib/state";

const solved = (levelIndex: number, count: number): AppState["chess"] =>
  Object.fromEntries(CHESS_LEVELS[levelIndex].exercises.slice(0, count).map((e) => [e.id, { solvedAt: 1, misses: 0 }]));
const state = (chess: AppState["chess"], settings: Partial<AppState["settings"]> = {}): AppState => ({
  ...structuredClone(DEFAULT_STATE),
  chess,
  settings: { ...DEFAULT_STATE.settings, age: 7, ...settings },
});

describe("мягкий замок уровней", () => {
  it("порог: из семи упражнений нужно пять, не меньше одного", () => {
    expect([1, 6, 7, 9].map(unlockNeed)).toEqual([1, 5, 5, 7]);
  });

  it("следующий уровень открывается на пороге, а звание не выдаётся до решения всех упражнений", () => {
    const total = CHESS_LEVELS[0].exercises.length;
    const need = unlockNeed(total);
    expect(levelStatuses(CHESS_LEVELS, state(solved(0, need - 1)))[1].unlocked).toBe(false);
    const at = levelStatuses(CHESS_LEVELS, state(solved(0, need)));
    expect(at[1].unlocked).toBe(true);
    expect(at[0].passed).toBe(false);
    expect(currentRank(CHESS_LEVELS, state(solved(0, need)))).toBeNull();
    expect(currentRank(CHESS_LEVELS, state(solved(0, total)))?.id).toBe(CHESS_LEVELS[0].id);
  });

  it("третий уровень закрыт, пока во втором решено меньше порога", () => {
    const need = unlockNeed(CHESS_LEVELS[1].exercises.length);
    const chess = { ...solved(0, 7), ...solved(1, need - 1) };
    const st = levelStatuses(CHESS_LEVELS, state(chess));
    expect(st[1].unlocked).toBe(true);
    expect(st[2].unlocked).toBe(false);
  });

  it("родитель может открыть все уровни сразу", () => {
    expect(levelStatuses(CHESS_LEVELS, state({}, { chessOpenAll: true })).every((s) => s.unlocked)).toBe(true);
  });
});
