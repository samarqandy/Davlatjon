import { describe, expect, it } from "vitest";
import { allTasks } from "@/content/program";
import { withActivity } from "@/lib/activity";
import { addDays, rangeText, reportLines, telegramText, weekStart, weeklyReport } from "@/lib/report";
import { DEFAULT_STATE, type AppState, type TaskProgress } from "@/lib/state";

const at = (day: string, h = 12) => new Date(`${day}T${String(h).padStart(2, "0")}:00:00`).getTime();
const task = (patch: Partial<TaskProgress>): TaskProgress => ({
  hints: 0,
  checks: 1,
  missed: 0,
  timeMs: 0,
  marks: {},
  ...patch,
});
const base = (patch: Partial<AppState> = {}): AppState => ({ ...DEFAULT_STATE, ...patch });

describe("неделя", () => {
  it("начинается с понедельника, воскресенье относится к прошедшей неделе", () => {
    expect(weekStart("2026-10-07")).toBe("2026-10-05");
    expect(weekStart("2026-10-05")).toBe("2026-10-05");
    expect(weekStart("2026-10-11")).toBe("2026-10-05");
    expect(weekStart("2026-10-12")).toBe("2026-10-12");
    expect(addDays("2026-10-30", 3)).toBe("2026-11-02");
  });
  it("диапазон дат читается на обоих языках", () => {
    expect(rangeText("2026-10-05", "2026-10-11", "ru")).toBe("5–11 октября");
    expect(rangeText("2026-09-28", "2026-10-04", "ru")).toBe("28 сентября – 4 октября");
    expect(rangeText("2026-10-05", "2026-10-11", "uz")).toBe("5–11-oktyabr");
  });
});

describe("отчёт за неделю", () => {
  const [t1, t2, t3] = allTasks();

  it("тихая неделя — спокойное сообщение, без упрёков", () => {
    const r = weeklyReport(base(), "2026-10-07");
    expect(r.quiet).toBe(true);
    expect(r.days).toHaveLength(7);
    const text = reportLines(r, "ru")[0].text;
    expect(text).toMatch(/нормально/);
    expect(text).not.toMatch(/не занимал|пропустил|ничего/i);
  });

  it("считает только то, что сделано на этой неделе", () => {
    let s = base({
      tasks: {
        [t1.id]: task({
          status: "solved",
          solvedAt: at("2026-10-06"),
          timeMs: 4 * 60_000,
          hints: 2,
          marks: { explained: true },
        }),
        [t2.id]: task({ status: "solved", solvedAt: at("2026-10-08"), timeMs: 2 * 60_000, marks: { hard: true } }),
        [t3.id]: task({ status: "solved", solvedAt: at("2026-09-30"), timeMs: 9 * 60_000 }),
      },
      chessGames: [
        { id: "g1", at: at("2026-10-07"), mode: "robot", color: "w", result: "win", moves: 20 },
        { id: "g2", at: at("2026-10-07", 15), mode: "robot", color: "w", result: "loss", moves: 20 },
        { id: "g0", at: at("2026-10-01"), mode: "robot", color: "w", result: "win", moves: 20 },
      ],
      chess: { a: { solvedAt: at("2026-10-09"), misses: 0 } },
    });
    s = withActivity(s, "2026-10-06", 12 * 60_000);
    const r = weeklyReport(s, "2026-10-09");
    expect(r.math).toMatchObject({ solved: 2, helped: 1, medianMin: 3, explained: 1, hard: 1 });
    expect(r.chess).toMatchObject({ exercises: 1, games: 2, wins: 1 });
    expect(r.minutes).toBe(12);
    expect(r.activeDays).toBe(4);
    expect(r.quiet).toBe(false);
    expect(r.goalDays).toBe(5);
  });

  it("подсказка подана как хорошая привычка, а цель — как приглашение; без процентов и сравнений", () => {
    const s = base({
      tasks: { [t1.id]: task({ status: "solved", solvedAt: at("2026-10-06"), hints: 3, timeMs: 60_000 }) },
      settings: { ...DEFAULT_STATE.settings, goalDays: 4 },
    });
    for (const lang of ["ru", "uz"] as const) {
      const text = telegramText(weeklyReport(s, "2026-10-06"), lang);
      expect(text).not.toMatch(/%|рейтинг|reyting|лучше всех|медленн|sekin|отстаёт|qolib/i);
      expect(text).not.toMatch(/Давлатжон|Davlatjon/);
    }
    const ru = reportLines(weeklyReport(s, "2026-10-06"), "ru")
      .map((l) => l.text)
      .join("\n");
    expect(ru).toMatch(/приглашение недели — 4 дня/);
    expect(ru).toMatch(/просить помощь — часть учёбы/);
    const uz = reportLines(weeklyReport(s, "2026-10-06"), "uz")
      .map((l) => l.text)
      .join("\n");
    expect(uz).not.toMatch(/[Ѐ-ӿ]/);
  });
});
