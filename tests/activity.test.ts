import { describe, expect, it } from "vitest";
import { limitStatus, minutesByDay, withActivity, withExtra } from "@/lib/activity";
import { DEFAULT_STATE, sanitize, type AppState } from "@/lib/state";
import { mergeStates, sameProgress } from "@/lib/sync";

const base = (patch: Partial<AppState> = {}): AppState => ({ ...DEFAULT_STATE, ...patch });

describe("активное время", () => {
  it("складывается по дням, лишнее и отрицательное игнорируется", () => {
    let s = base();
    s = withActivity(s, "2026-10-05", 60_000);
    s = withActivity(s, "2026-10-05", 30_000);
    s = withActivity(s, "2026-10-05", -5);
    s = withActivity(s, "2026-10-06", 0);
    expect(s.activity).toEqual({ "2026-10-05": { ms: 90_000 } });
  });

  it("хранит не больше 120 последних дней", () => {
    let s = base();
    for (let i = 0; i < 130; i++)
      s = withActivity(
        s,
        `2026-${String(1 + Math.floor(i / 28)).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
        1000,
      );
    expect(Object.keys(s.activity)).toHaveLength(120);
  });

  it("минуты по дням идут подряд, дни без занятий — нули", () => {
    const s = withActivity(base(), "2026-10-06", 5 * 60_000);
    expect(minutesByDay(s, "2026-10-05", "2026-10-07")).toEqual([
      { day: "2026-10-05", minutes: 0 },
      { day: "2026-10-06", minutes: 5 },
      { day: "2026-10-07", minutes: 0 },
    ]);
  });
});

describe("дневное ограничение", () => {
  const withLimit = (min: number | undefined) => base({ settings: { ...DEFAULT_STATE.settings, dailyLimitMin: min } });

  it("без ограничения (нет значения или 0) оно не наступает никогда", () => {
    for (const m of [undefined, 0]) {
      const s = withActivity(withLimit(m), "2026-10-05", 10 * 3_600_000);
      expect(limitStatus(s, "2026-10-05")).toMatchObject({ limitMin: null, remainingMs: null, reached: false });
    }
  });

  it("наступает, когда активное время дошло до предела, и откладывается на разрешённое родителем", () => {
    let s = withActivity(withLimit(30), "2026-10-05", 29 * 60_000);
    expect(limitStatus(s, "2026-10-05").reached).toBe(false);
    s = withActivity(s, "2026-10-05", 60_000);
    expect(limitStatus(s, "2026-10-05").reached).toBe(true);
    s = withExtra(s, "2026-10-05", 15 * 60_000);
    expect(limitStatus(s, "2026-10-05")).toMatchObject({ reached: false, remainingMs: 15 * 60_000 });
    // На следующий день — снова полный запас.
    expect(limitStatus(s, "2026-10-06").remainingMs).toBe(30 * 60_000);
  });
});

describe("активность в сохранении и слиянии", () => {
  it("sanitize отбрасывает мусор и ограничивает значения", () => {
    const s = sanitize({
      activity: {
        "2026-10-05": { ms: 5000, extra: 1000 },
        вчера: { ms: 1 },
        "2026-10-06": { ms: -1 },
        "2026-10-07": { ms: 99 * 3_600_000 },
        "2026-10-08": "x",
      },
      settings: { dailyLimitMin: 33, goalDays: 9, reportToTelegram: "yes" },
    });
    expect(s.activity).toEqual({ "2026-10-05": { ms: 5000, extra: 1000 }, "2026-10-07": { ms: 24 * 3_600_000 } });
    expect(s.settings.dailyLimitMin).toBeUndefined();
    expect(s.settings.goalDays).toBeUndefined();
    expect(s.settings.reportToTelegram).toBeUndefined();
    expect(sanitize({ settings: { dailyLimitMin: 0, goalDays: 4, reportToTelegram: false } }).settings).toMatchObject({
      dailyLimitMin: 0,
      goalDays: 4,
      reportToTelegram: false,
    });
  });

  it("слияние берёт большее за день и сохраняет настройки родителя; результат не зависит от порядка", () => {
    const a = base({
      activity: { "2026-10-05": { ms: 5000 } },
      settings: { ...DEFAULT_STATE.settings, dailyLimitMin: 30 },
    });
    const b = base({
      activity: { "2026-10-05": { ms: 9000, extra: 600_000 }, "2026-10-06": { ms: 1000 } },
      settings: { ...DEFAULT_STATE.settings, goalDays: 4, reportToTelegram: true },
    });
    const ab = mergeStates(a, b);
    expect(ab.activity).toEqual({ "2026-10-05": { ms: 9000, extra: 600_000 }, "2026-10-06": { ms: 1000 } });
    expect(ab.settings).toMatchObject({ dailyLimitMin: 30, goalDays: 4, reportToTelegram: true });
    expect(mergeStates(b, a).activity).toEqual(ab.activity);
  });

  it("смена настроек родителя считается изменением прогресса — она уйдёт в аккаунт", () => {
    const a = base();
    const b = base({ settings: { ...DEFAULT_STATE.settings, reportToTelegram: true } });
    expect(sameProgress(a, b)).toBe(false);
  });
});
