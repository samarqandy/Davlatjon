import { describe, expect, it } from "vitest";
import { WEEKS } from "@/content/program";
import { summarizeWeek } from "@/content/summary";
import { nextDayStep } from "@/lib/nextStep";
import { DEFAULT_STATE, type AppState, type TaskProgress } from "@/lib/state";

const days = WEEKS.flatMap((w) => summarizeWeek(w).days);
const solved: TaskProgress = { status: "solved", hints: 0, checks: 1, missed: 0, timeMs: 1, marks: {}, solvedAt: 1 };
const base = (patch: Partial<AppState> = {}): AppState => ({ ...DEFAULT_STATE, ...patch });

describe("следующий шаг", () => {
  it("в начале — первый день, ссылка ведёт на его вступление", () => {
    const step = nextDayStep(days, base())!;
    expect(step.day.id).toBe(days[0].id);
    expect(step.started).toBe(false);
    expect(step.href).toBe("/week/1/day/1");
  });

  it("начатый день продолжается с первой нерешённой задачи, а не с начала", () => {
    const d = days[0];
    const s = base({ tasks: { [d.tasks[0].id]: solved, [d.tasks[1].id]: solved }, days: { [d.id]: { startedAt: 1 } } });
    const step = nextDayStep(days, s)!;
    expect(step.started).toBe(true);
    expect(step.taskNumber).toBe(3);
    expect(step.href).toBe("/week/1/day/1#task-3");
  });

  it("все задачи решены, а день не закрыт — ведём к итогам дня", () => {
    const d = days[0];
    const tasks = Object.fromEntries(d.tasks.map((t) => [t.id, solved]));
    const step = nextDayStep(days, base({ tasks, days: { [d.id]: { startedAt: 1 } } }))!;
    expect(step.taskNumber).toBe(d.tasks.length + 1);
    expect(step.href).toBe("/week/1/day/1#finish");
  });

  it("пройденные дни пропускаются; когда пройдено всё — шага нет", () => {
    const done = Object.fromEntries(days.slice(0, 2).map((d) => [d.id, { completedAt: 1 }]));
    expect(nextDayStep(days, base({ days: done }))!.day.id).toBe(days[2].id);
    const all = Object.fromEntries(days.map((d) => [d.id, { completedAt: 1 }]));
    expect(nextDayStep(days, base({ days: all }))).toBeNull();
  });
});

describe("начало не с первой недели (по вводному тесту)", () => {
  it("«дальше» предлагает дни не раньше выбранной недели, а пройденное раньше не мешает", () => {
    const s = base({ settings: { ...DEFAULT_STATE.settings, startWeek: 2 } });
    const step = nextDayStep(days, s)!;
    expect(step.day.week).toBe(2);
    expect(step.href).toBe("/week/2/day/1");
    expect(nextDayStep(days, base({ settings: { ...DEFAULT_STATE.settings, startWeek: 1 } }))!.day.week).toBe(1);
  });
});
