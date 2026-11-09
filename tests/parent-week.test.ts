/** «Эта неделя» для родителя: окно 7 дней, подсчёты и совет. */
import { describe, expect, it } from "vitest";
import { weekSummary } from "@/lib/parentWeek";
import { DEFAULT_STATE, type AppState } from "@/lib/state";

const at = (day: string) => new Date(`${day}T10:00:00`).getTime();
const task = (day: string, extra: Partial<AppState["tasks"][string]> = {}) => ({
  status: "solved" as const,
  hints: 0,
  checks: 1,
  missed: 0,
  solvedAt: at(day),
  firstTry: true,
  timeMs: 1000,
  marks: {},
  ...extra,
});

describe("неделя для родителя", () => {
  it("пустой прогресс — совет начать", () => {
    const w = weekSummary(DEFAULT_STATE, "2026-11-09");
    expect(w.days).toHaveLength(7);
    expect(w.days[6].day).toBe("2026-11-09");
    expect(w).toMatchObject({ activeDays: 0, math: 0, chess: 0, tip: "start" });
  });

  it("считает только последние 7 дней и чистые/трудные задачи", () => {
    const s: AppState = {
      ...DEFAULT_STATE,
      tasks: {
        a: task("2026-11-09"),
        b: task("2026-11-08", { hints: 2, firstTry: false }),
        c: task("2026-11-03"),
        old: task("2026-11-02"),
      },
      chess: { "c1-game-1": { solvedAt: at("2026-11-07"), misses: 0 } },
      activity: { "2026-11-09": { ms: 20 * 60_000 } } as AppState["activity"],
    };
    const w = weekSummary(s, "2026-11-09");
    expect(w.math).toBe(3);
    expect(w.mathClean).toBe(2);
    expect(w.mathHard).toBe(1);
    expect(w.chess).toBe(1);
    expect(w.minutes).toBe(20);
    expect(w.activeDays).toBe(4);
    expect(w.tip).toBe("praise");
  });

  it("мало дней — совет про ритм", () => {
    const s: AppState = { ...DEFAULT_STATE, tasks: { a: task("2026-11-09") } };
    expect(weekSummary(s, "2026-11-09").tip).toBe("rhythm");
  });
});
