/** Интервальное повторение задач по математике: расписание, новая попытка отдельно от первой, дело дня, слияние. */
import { afterEach, describe, expect, it } from "vitest";
import { allDays } from "@/content/program";
import { doneOn } from "@/lib/quest";
import { reviewHref } from "@/lib/routes";
import { reviewId, sourceTaskId, struggled } from "@/lib/state";
import {
  DEFAULT_STATE,
  dueTasks,
  finishTaskReview,
  getState,
  isoDay,
  markSolved,
  openHint,
  recordCheck,
  replaceState,
  sanitize,
  saveTaskInput,
  startTaskReview,
  chessPuzzleMiss,
  chessPuzzleSolved,
} from "@/lib/store";
import { mergeStates } from "@/lib/sync";
import { VOICE_CLIPS } from "@/lib/voice";

const DAY = 86_400_000;
const ID = "w1d1t1";
const t0 = new Date(2026, 8, 1, 10).getTime();

afterEach(() => replaceState(DEFAULT_STATE));

/** Решить задачу в первый раз: wrong неверных проверок, потом верная. */
function solveFirst(id: string, wrong: number) {
  for (let i = 0; i < wrong; i++) recordCheck(id, false);
  recordCheck(id, true);
}

/** Повторить задачу: новая попытка с чистого листа, затем итог попытки. */
function review(id: string, now: number, opts: { wrong?: number; hints?: number } = {}) {
  startTaskReview(id, now);
  for (let i = 0; i < (opts.hints ?? 0); i++) openHint(reviewId(id));
  for (let i = 0; i < (opts.wrong ?? 0); i++) recordCheck(reviewId(id), false);
  recordCheck(reviewId(id), true);
  // Время решения берём у попытки: одна попытка учитывается один раз.
  replaceState({
    ...getState(),
    taskReviews: { [reviewId(id)]: { ...getState().taskReviews[reviewId(id)], solvedAt: now } },
  });
  finishTaskReview(id);
}

describe("какие задачи возвращаются", () => {
  it("решённая сразу — не возвращается; с ошибкой или двумя подсказками — завтра", () => {
    replaceState(sanitize({}));
    solveFirst("w1d1t1", 0);
    solveFirst("w1d1t2", 1);
    openHint("w1d1t3");
    solveFirst("w1d1t3", 0);
    openHint("w1d1t4");
    openHint("w1d1t4");
    solveFirst("w1d1t4", 0);
    const tasks = getState().tasks;
    expect(tasks.w1d1t1.due).toBeUndefined();
    expect(tasks.w1d1t3.due).toBeUndefined();
    expect(tasks.w1d1t2).toMatchObject({ box: 1 });
    expect(tasks.w1d1t4).toMatchObject({ box: 1 });
    const tomorrow = isoDay(Date.now() + DAY);
    expect(dueTasks(tasks, isoDay(Date.now()))).toEqual([]);
    expect(dueTasks(tasks, tomorrow)).toEqual(["w1d1t2", "w1d1t4"]);
    expect(struggled({ missed: 0, hints: 1, checks: 1 })).toBe(false);
    // Открытый вопрос отмечает сам ребёнок, проверки нет — даже с подсказками на повторение не идёт.
    openHint("w1d7r");
    openHint("w1d7r");
    markSolved("w1d7r");
    expect(getState().tasks.w1d7r.status).toBe("solved");
    expect(getState().tasks.w1d7r.due).toBeUndefined();
  });

  it("нерешённая задача в очередь не попадает, даже если в ней были ошибки", () => {
    replaceState(sanitize({}));
    recordCheck(ID, false);
    expect(dueTasks(getState().tasks, isoDay(Date.now() + 30 * DAY))).toEqual([]);
  });
});

describe("расписание повторений", () => {
  it("без ошибок — через 3, 7 и 21 день, потом задача выучена; с ошибкой — снова завтра", () => {
    replaceState(
      sanitize({ tasks: { [ID]: { status: "solved", solvedAt: t0, missed: 1, box: 1, due: isoDay(t0 + DAY) } } }),
    );
    let t = t0 + DAY;
    for (const [i, days] of [3, 7, 21].entries()) {
      review(ID, t);
      expect(getState().tasks[ID]).toMatchObject({ box: i + 2, due: isoDay(t + days * DAY), reviewedAt: t });
      t += days * DAY;
    }
    // Ошибка на последнем шаге возвращает в первую коробку.
    review(ID, t, { wrong: 1 });
    expect(getState().tasks[ID]).toMatchObject({ box: 1, due: isoDay(t + DAY) });
    // Подсказка при повторении — тоже «не выучено».
    t += DAY;
    review(ID, t, { hints: 1 });
    expect(getState().tasks[ID]).toMatchObject({ box: 1, due: isoDay(t + DAY) });
    // Четыре чистых повторения подряд — задача уходит из очереди.
    for (const days of [1, 3, 7, 21]) {
      t += days * DAY;
      review(ID, t);
    }
    expect(getState().tasks[ID].box).toBeUndefined();
    expect(getState().tasks[ID].due).toBeUndefined();
    expect(dueTasks(getState().tasks, isoDay(t + 365 * DAY))).toEqual([]);
  });

  it("одна решённая попытка учитывается один раз, нерешённая — не учитывается", () => {
    replaceState(sanitize({ tasks: { [ID]: { status: "solved", solvedAt: t0, missed: 1, box: 1, due: isoDay(t0) } } }));
    startTaskReview(ID);
    recordCheck(reviewId(ID), false);
    finishTaskReview(ID);
    expect(getState().tasks[ID]).toMatchObject({ box: 1, due: isoDay(t0) });
    expect(getState().tasks[ID].reviewedAt).toBeUndefined();
    review(ID, t0);
    const once = getState().tasks[ID];
    finishTaskReview(ID);
    expect(getState().tasks[ID]).toEqual(once);
  });
});

describe("новая попытка не трогает первую", () => {
  it("ввод, проверки и подсказки повторения лежат отдельно; первая попытка, решённость и счётчики — как были", () => {
    replaceState(
      sanitize({
        tasks: {
          [ID]: {
            status: "solved",
            solvedAt: t0,
            missed: 2,
            checks: 3,
            hints: 1,
            input: { a: "57" },
            box: 1,
            due: isoDay(t0),
          },
        },
      }),
    );
    startTaskReview(ID);
    saveTaskInput(reviewId(ID), { a: "50" });
    openHint(reviewId(ID));
    recordCheck(reviewId(ID), false);
    const { tasks, taskReviews } = getState();
    expect(tasks[ID]).toMatchObject({ status: "solved", missed: 2, checks: 3, hints: 1, input: { a: "57" } });
    expect(taskReviews[reviewId(ID)]).toMatchObject({
      status: "started",
      missed: 1,
      checks: 1,
      hints: 1,
      input: { a: "50" },
    });
    expect(Object.keys(tasks)).toEqual([ID]);
    // Начатая попытка переживает перезагрузку страницы: ответ и счёт ошибок на месте.
    startTaskReview(ID, t0);
    expect(getState().taskReviews[reviewId(ID)]).toMatchObject({ missed: 1, input: { a: "50" } });
    expect(getState().tasks[ID].status).toBe("solved");
  });

  it("решённая попытка стирается, только когда задачу снова пора повторить; тренировка до срока расписание не двигает", () => {
    replaceState(sanitize({ tasks: { [ID]: { status: "solved", solvedAt: t0, missed: 1, box: 1, due: isoDay(t0) } } }));
    review(ID, t0);
    expect(getState().tasks[ID]).toMatchObject({ box: 2, due: isoDay(t0 + 3 * DAY) });
    // Назавтра срок ещё не подошёл: попытка на месте, экран покажет её решённой.
    startTaskReview(ID, t0 + DAY);
    expect(getState().taskReviews[reviewId(ID)].status).toBe("solved");
    // Срок подошёл — чистый лист.
    startTaskReview(ID, t0 + 3 * DAY);
    expect(getState().taskReviews).toEqual({});
    // Задача, решённая до срока (зашли по прямой ссылке), повторением не считается.
    replaceState(
      sanitize({ tasks: { [ID]: { status: "solved", solvedAt: t0, missed: 1, box: 2, due: isoDay(t0 + 5 * DAY) } } }),
    );
    recordCheck(reviewId(ID), true);
    replaceState({
      ...getState(),
      taskReviews: { [reviewId(ID)]: { ...getState().taskReviews[reviewId(ID)], solvedAt: t0 + DAY } },
    });
    finishTaskReview(ID);
    expect(getState().tasks[ID]).toMatchObject({ box: 2, due: isoDay(t0 + 5 * DAY) });
    expect(getState().tasks[ID].reviewedAt).toBeUndefined();
  });

  it("озвучка повторения — та же запись, что у задачи", () => {
    expect(sourceTaskId(reviewId(ID))).toBe(ID);
    expect(VOICE_CLIPS.task(reviewId(ID), "ru")).toBe(VOICE_CLIPS.task(ID, "ru"));
    expect(VOICE_CLIPS.hint(reviewId(ID), 0, "ru")).toBe(VOICE_CLIPS.hint(ID, 0, "ru"));
  });
});

describe("повторение — дело дня", () => {
  it("повторённая задача по математике и шахматная задача считаются в задании дня", () => {
    const day = isoDay(t0 + DAY);
    replaceState(sanitize({ tasks: { [ID]: { status: "solved", solvedAt: t0, missed: 1, box: 1, due: day } } }));
    expect(doneOn(getState(), "task", day)).toBe(0);
    review(ID, t0 + DAY);
    expect(doneOn(getState(), "task", day)).toBe(1);

    chessPuzzleMiss("p1", t0);
    chessPuzzleSolved("p1", false, t0);
    expect(doneOn(getState(), "puzzles", day)).toBe(0);
    chessPuzzleSolved("p1", true, t0 + DAY);
    expect(doneOn(getState(), "puzzles", day)).toBe(1);
    // Ошибка в задаче, которую пора было повторить, — тоже повторение этого дня.
    chessPuzzleMiss("p2", t0);
    chessPuzzleSolved("p2", false, t0);
    chessPuzzleMiss("p2", t0 + DAY);
    expect(doneOn(getState(), "puzzles", day)).toBe(2);
  });
});

describe("слияние с аккаунтом", () => {
  it("расписание — с устройства, где повторяли позже; незаконченная попытка остаётся только на этом устройстве", () => {
    const local = {
      tasks: {
        [ID]: { status: "solved", solvedAt: t0, missed: 1, box: 3, due: "2026-09-20", reviewedAt: t0 + 5 * DAY },
      },
      taskReviews: { [reviewId(ID)]: { status: "started", checks: 1, missed: 1, hints: 0, timeMs: 0, marks: {} } },
    };
    const remote = { tasks: { [ID]: { status: "solved", solvedAt: t0, missed: 1, box: 1, due: "2026-09-02" } } };
    for (const merged of [mergeStates(local, remote), mergeStates(remote, local)])
      expect(merged.tasks[ID]).toMatchObject({ box: 3, due: "2026-09-20", reviewedAt: t0 + 5 * DAY });
    // Выученная задача (срока больше нет) не возвращается в очередь из-за старой копии на другом устройстве.
    const learned = { tasks: { [ID]: { status: "solved", solvedAt: t0, missed: 1, reviewedAt: t0 + 40 * DAY } } };
    for (const merged of [mergeStates(learned, local), mergeStates(local, learned)]) {
      expect(merged.tasks[ID].due).toBeUndefined();
      expect(merged.tasks[ID].box).toBeUndefined();
    }
    expect(Object.keys(mergeStates(local, remote).taskReviews)).toEqual([reviewId(ID)]);
    expect(mergeStates(remote, local).taskReviews).toEqual({});
  });
});

describe("адрес экрана повторения", () => {
  it("у каждой задачи программы адрес собирается из её id: неделя и день совпадают с программой", () => {
    for (const day of allDays())
      for (const task of day.tasks)
        expect(reviewHref(task.id), task.id).toBe(`/week/${day.week}/day/${day.day}#review-${task.id}`);
    expect(reviewHref("чужой-id")).toBeNull();
  });
});
