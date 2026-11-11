"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * Прогресс хранится в localStorage этого браузера.
 * Небольшой собственный стор на useSyncExternalStore: без лишних зависимостей
 * и без ошибок гидратации (на сервере и при гидратации — состояние по умолчанию).
 */

import { withActivity, withExtra } from "./activity";
import { REGISTRY_KEY, readRegistry, storageKeyFor } from "./profiles";
import { quickKey, type Deck } from "./quick";
import { cleanChildName } from "./childName";
import {
  DEFAULT_STATE,
  EMPTY_CHESS,
  EMPTY_TASK,
  REVIEW_DAYS,
  isReviewId,
  isoDay,
  reviewId,
  sanitize,
  struggled,
  type AppState,
  type ChessDiaryEntry,
  type ChessExerciseProgress,
  type ChessGameRecord,
  type ChessPuzzleProgress,
  type DayProgress,
  type MyProblem,
  type Settings,
  type TaskMarks,
  type TaskProgress,
  type Woodpecker,
  WOODPECKER_ROUNDS,
} from "./state";
import { ratePuzzle, startRating, type PuzzleRating } from "./puzzleRating";
import { chessArea, trackLearning } from "./analytics";

export * from "./state";

let state: AppState = DEFAULT_STATE;
let loaded = false;
/** Запись выбранного профиля: определяется один раз при загрузке; смена профиля перезагружает страницу. */
let storageKey = "";
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  storageKey = storageKeyFor(readRegistry().active);
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) state = sanitize(JSON.parse(raw));
  } catch {
    state = DEFAULT_STATE;
  }
  window.addEventListener("storage", (e) => {
    // В другой вкладке выбрали другого ребёнка — эта вкладка не должна дальше писать в чужой прогресс.
    if (e.key === REGISTRY_KEY && storageKeyFor(readRegistry().active) !== storageKey) {
      window.location.reload();
      return;
    }
    if (e.key !== storageKey) return;
    try {
      state = e.newValue ? sanitize(JSON.parse(e.newValue)) : DEFAULT_STATE;
    } catch {
      state = DEFAULT_STATE;
    }
    listeners.forEach((l) => l());
  });
}

function persist() {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Хранилище недоступно (приватный режим) — работаем в памяти.
  }
}

export function getState(): AppState {
  ensureLoaded();
  return state;
}

export function setState(update: (s: AppState) => AppState) {
  ensureLoaded();
  state = update(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  ensureLoaded();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Подписка на любые изменения прогресса (для синхронизации с аккаунтом). */
export function onStateChange(listener: () => void): () => void {
  return subscribe(listener);
}

/** Селектор должен возвращать часть состояния или примитив (не новый объект). */
export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(DEFAULT_STATE),
  );
}

/** Как useStore, но на сервере и при гидратации — заданное значение (например, язык, который знает сервер). */
export function useStoreOr<T>(selector: (s: AppState) => T, server: T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => server,
  );
}

const noopSubscribe = () => () => {};

/** true после гидратации — можно показывать данные из localStorage. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Где лежит прогресс: у повторной попытки («~id») — отдельно от первой, уже засчитанной. */
const taskBucket = (taskId: string) => (isReviewId(taskId) ? "taskReviews" : "tasks");

export function useTask(taskId: string): TaskProgress {
  return useStore((s) => s[taskBucket(taskId)][taskId] ?? EMPTY_TASK);
}

export function useChessExercise(id: string): ChessExerciseProgress {
  return useStore((s) => s.chess[id] ?? EMPTY_CHESS);
}

// ---------------------------------------------------------------------------
// Действия
// ---------------------------------------------------------------------------

export function updateTask(taskId: string, update: (t: TaskProgress) => Partial<TaskProgress>) {
  const bucket = taskBucket(taskId);
  setState((s) => {
    const prev = s[bucket][taskId] ?? EMPTY_TASK;
    const next = { ...prev, ...update(prev) };
    return { ...s, [bucket]: { ...s[bucket], [taskId]: next } };
  });
}

export function setTaskMark(taskId: string, mark: keyof TaskMarks, value: boolean) {
  updateTask(taskId, (t) => ({ marks: { ...t.marks, [mark]: value } }));
}

export function saveTaskInput(taskId: string, input: Record<string, unknown>) {
  updateTask(taskId, (t) => ({ input: { ...t.input, ...input }, status: t.status ?? "started" }));
}

export function markSolved(taskId: string, now = Date.now()) {
  const review = isReviewId(taskId);
  if (!review && getState().tasks[taskId]?.status !== "solved") trackLearning("task_solved");
  updateTask(taskId, (t) =>
    t.status === "solved"
      ? {}
      : {
          status: "solved",
          solvedAt: now,
          firstTry: t.missed === 0 && t.checks <= 1,
          // Задача далась с трудом — вернётся на повторение завтра (первая коробка).
          ...(!review && struggled(t) ? { box: 1, due: isoDay(now + 86_400_000) } : {}),
        },
  );
}

/** Где лежит прогресс задачи — для чтения из состояния (повторная попытка «~id» хранится отдельно). */
export const taskProgress = (s: AppState, taskId: string): TaskProgress | undefined => s[taskBucket(taskId)][taskId];

/**
 * Задачу снова пора повторить: прошлая решённая попытка стирается, и ребёнок решает с чистого листа.
 * Начатая, но не решённая попытка остаётся — после перезагрузки страницы ответ и счёт ошибок на месте.
 */
export function startTaskReview(taskId: string, now = Date.now()) {
  const key = reviewId(taskId);
  setState((s) => {
    const due = s.tasks[taskId]?.due;
    if (s.taskReviews[key]?.status !== "solved" || !due || due > isoDay(now)) return s;
    const rest = { ...s.taskReviews };
    delete rest[key];
    return { ...s, taskReviews: rest };
  });
}

/**
 * Повторная попытка решена: без ошибок и подсказок — задача переходит в следующую коробку (через 3, 7,
 * 21 день), после четвёртой считается выученной; иначе возвращается в первую — повторить завтра.
 * Срок считается от дня решения. Засчитывается только попытка, решённая в день повторения или позже
 * (тренировка раньше срока расписание не двигает), и только один раз.
 */
export function finishTaskReview(taskId: string) {
  setState((s) => {
    const attempt = s.taskReviews[reviewId(taskId)];
    const task = s.tasks[taskId];
    if (!task?.due || attempt?.status !== "solved" || !attempt.solvedAt) return s;
    if (task.reviewedAt === attempt.solvedAt || isoDay(attempt.solvedAt) < task.due) return s;
    const clean = attempt.missed === 0 && attempt.hints === 0;
    const box = clean ? (task.box ?? 1) + 1 : 1;
    const learned = box > REVIEW_DAYS.length;
    return {
      ...s,
      tasks: {
        ...s.tasks,
        [taskId]: {
          ...task,
          reviewedAt: attempt.solvedAt,
          box: learned ? undefined : box,
          due: learned ? undefined : isoDay(attempt.solvedAt + REVIEW_DAYS[box - 1] * 86_400_000),
        },
      },
    };
  });
}

/** Задачи по математике, которые пора повторить сегодня: сначала те, что ждут дольше. */
export function dueTasks(tasks: Record<string, TaskProgress>, today: string): string[] {
  return Object.entries(tasks)
    .filter(([, t]) => t.status === "solved" && t.due && t.due <= today)
    .sort((a, b) => (a[1].due! < b[1].due! ? -1 : a[1].due! > b[1].due! ? 1 : a[0] < b[0] ? -1 : 1))
    .map(([id]) => id);
}

let persistAsked = false;
/** После первой решённой задачи просим браузер не стирать прогресс при нехватке места. */
function askPersist() {
  if (persistAsked || typeof navigator === "undefined") return;
  persistAsked = true;
  try {
    void navigator.storage?.persist?.().catch(() => {});
  } catch {
    // браузер без этой возможности — прогресс просто хранится как обычно
  }
}

export function recordCheck(taskId: string, correct: boolean) {
  updateTask(taskId, (t) => ({
    checks: t.checks + 1,
    missed: correct ? t.missed : t.missed + 1,
    status: t.status ?? "started",
  }));
  if (correct) {
    markSolved(taskId);
    askPersist();
  }
}

export function addFound(taskId: string, key: string) {
  updateTask(taskId, (t) => (t.found?.includes(key) ? {} : { found: [...(t.found ?? []), key] }));
}

export function addTime(taskId: string, ms: number) {
  if (ms <= 0) return;
  updateTask(taskId, (t) => ({ timeMs: t.timeMs + ms }));
}

/** Прибавить активное время к сегодняшнему дню (вызывает ActivityTracker). */
export function addActiveTime(ms: number) {
  setState((s) => withActivity(s, isoDay(Date.now()), ms));
}

/** Родитель (после PIN-кода) добавляет время на сегодня. */
export function extendToday(ms: number) {
  setState((s) => withExtra(s, isoDay(Date.now()), ms));
}

export function openHint(taskId: string) {
  updateTask(taskId, (t) => ({ hints: Math.min(5, t.hints + 1), status: t.status ?? "started" }));
}

export function updateDay(dayId: string, patch: Partial<DayProgress>) {
  setState((s) => ({ ...s, days: { ...s.days, [dayId]: { ...s.days[dayId], ...patch } } }));
}

export function startDay(dayId: string) {
  if (!getState().days[dayId]?.startedAt) trackLearning("day_start");
  setState((s) =>
    s.days[dayId]?.startedAt ? s : { ...s, days: { ...s.days, [dayId]: { ...s.days[dayId], startedAt: Date.now() } } },
  );
}

export function setReviewNote(weekKey: string, questionId: string, note: string) {
  setState((s) => ({
    ...s,
    reviews: { ...s.reviews, [weekKey]: { ...s.reviews[weekKey], [questionId]: note } },
  }));
}

export function addProblem(p: Omit<MyProblem, "id" | "createdAt">) {
  setState((s) => ({
    ...s,
    myProblems: [{ ...p, id: `p${Date.now().toString(36)}`, createdAt: Date.now() }, ...s.myProblems],
  }));
}

export function removeProblem(id: string) {
  setState((s) => ({ ...s, myProblems: s.myProblems.filter((p) => p.id !== id) }));
}

function updateChess(id: string, update: (p: ChessExerciseProgress) => Partial<ChessExerciseProgress>) {
  setState((s) => {
    const prev = s.chess[id] ?? EMPTY_CHESS;
    return { ...s, chess: { ...s.chess, [id]: { ...prev, ...update(prev) } } };
  });
}

/** Упражнение шахматной школы решено; best — сколько ходов понадобилось. */
export function chessSolved(id: string, best?: number) {
  if (!getState().chess[id]?.solvedAt) trackLearning("chess_solved", { area: chessArea(id) });
  updateChess(id, (p) => ({
    solvedAt: p.solvedAt ?? Date.now(),
    ...(best !== undefined ? { best: Math.min(best, p.best ?? Infinity) } : {}),
  }));
}

export function chessMiss(id: string) {
  updateChess(id, (p) => ({ misses: p.misses + 1 }));
}

export function chessFound(id: string, key: string) {
  updateChess(id, (p) => (p.found?.includes(key) ? {} : { found: [...(p.found ?? []), key] }));
}

export function recordChessGame(game: Omit<ChessGameRecord, "id" | "at"> & { id?: string }): string {
  const id = game.id ?? `g${Date.now().toString(36)}`;
  setState((s) => ({
    ...s,
    chessGames: [{ ...game, id, at: Date.now() }, ...s.chessGames.filter((g) => g.id !== id)].slice(0, 200),
  }));
  return id;
}

/** Убрать запись о партии (например, когда ребёнок отменил сдачу и партия продолжилась). */
export function removeChessGame(id: string) {
  setState((s) =>
    s.chessGames.some((g) => g.id === id) ? { ...s, chessGames: s.chessGames.filter((g) => g.id !== id) } : s,
  );
}

export function saveChessAnalysis(id: string, analysis: NonNullable<ChessGameRecord["analysis"]>) {
  setState((s) => ({ ...s, chessGames: s.chessGames.map((g) => (g.id === id ? { ...g, analysis } : g)) }));
}

export function chessOwnPuzzleSolved(key: string) {
  setState((s) => ({ ...s, chessOwnPuzzles: { ...s.chessOwnPuzzles, [key]: s.chessOwnPuzzles[key] ?? Date.now() } }));
}

export function chessGuessScored(id: string, score: number, max: number) {
  setState((s) =>
    (s.chessGuess[id]?.score ?? -1) >= score ? s : { ...s, chessGuess: { ...s.chessGuess, [id]: { score, max } } },
  );
}

export function chessDrillRecord(mode: string, score: number) {
  setState((s) =>
    (s.chessDrills[mode] ?? 0) >= score ? s : { ...s, chessDrills: { ...s.chessDrills, [mode]: score } },
  );
}

/** Результат серии «быстрых примеров»: за день на колоду хранится лучший. */
export function quickRecord(day: string, deck: Deck, score: number) {
  const key = quickKey(day, deck);
  setState((s) => ((s.quick[key] ?? -1) >= score ? s : { ...s, quick: { ...s.quick, [key]: score } }));
}

/**
 * Задача решена. clean — без ошибок в этой попытке: тогда задача из очереди повторения переходит
 * в следующую коробку (повторить позже), а после четвёртой — считается выученной.
 */
export function chessPuzzleSolved(id: string, clean = true, now = Date.now()) {
  setState((s) => {
    const p = s.chessPuzzles[id];
    let box = p?.box;
    let due = p?.due;
    // Задача из очереди повторения, и её срок подошёл: это повторение — оно считается делом дня.
    const reviewed = !!box && !!due && due <= isoDay(now);
    if (box && clean && due && due <= isoDay(now)) {
      box += 1;
      due = box > REVIEW_DAYS.length ? undefined : isoDay(now + REVIEW_DAYS[box - 1] * 86_400_000);
      if (!due) box = undefined;
    }
    return {
      ...s,
      chessPuzzles: {
        ...s.chessPuzzles,
        [id]: {
          misses: p?.misses ?? 0,
          solvedAt: p?.solvedAt ?? now,
          box,
          due,
          ...(reviewed ? { reviewedAt: now } : p?.reviewedAt ? { reviewedAt: p.reviewedAt } : {}),
        },
      },
    };
  });
}

/** Ошибка в задаче: она попадает в первую коробку — повторить завтра. */
export function chessPuzzleMiss(id: string, now = Date.now()) {
  setState((s) => ({
    ...s,
    chessPuzzles: {
      ...s.chessPuzzles,
      [id]: {
        ...s.chessPuzzles[id],
        misses: (s.chessPuzzles[id]?.misses ?? 0) + 1,
        box: 1,
        due: isoDay(now + 86_400_000),
        // Ошибка в задаче, которую сегодня пора было повторить, — тоже повторение.
        ...((s.chessPuzzles[id]?.due ?? "9") <= isoDay(now) ? { reviewedAt: now } : {}),
      },
    },
  }));
}

/** Задачи, которые пора повторить сегодня. */
export function duePuzzles(progress: Record<string, ChessPuzzleProgress>, today: string): string[] {
  return Object.entries(progress)
    .filter(([, p]) => p.due && p.due <= today)
    .sort((a, b) => (a[1].due! < b[1].due! ? -1 : 1))
    .map(([id]) => id);
}

/** Первая попытка задачи из базы меняет скрытый рейтинг: win — с первого раза, без ошибок и подсказок. */
export function chessPuzzleRated(puzzleRating: number, win: boolean, now = Date.now()) {
  setState((s) => ({
    ...s,
    chessRating: ratePuzzle(s.chessRating ?? startRating(s.settings.age, now), puzzleRating, win, now),
  }));
}

/** Рейтинг задач: записанный, а пока задач из базы не было — стартовый по возрасту. */
export function usePuzzleRating(): PuzzleRating {
  const rating = useStore((s) => s.chessRating);
  const age = useStore((s) => s.settings.age);
  return useMemo(() => rating ?? startRating(age, 0), [rating, age]);
}

/** «Дятел»: новый набор задач — круги начинаются заново. */
export function woodpeckerStart(keys: string[], now = Date.now()) {
  setState((s) => ({ ...s, chessWoodpecker: { keys, rounds: [], index: 0, ms: 0, misses: 0, at: now } }));
}

/** «Дятел»: задача набора решена. После последней круг записывается, и следующий начинается с первой задачи. */
export function woodpeckerSolved(ms: number, misses: number, now = Date.now()) {
  setState((s) => {
    const w = s.chessWoodpecker;
    if (!w || w.rounds.length >= WOODPECKER_ROUNDS) return s;
    const index = w.index + 1;
    const total = { ms: w.ms + ms, misses: w.misses + misses };
    const next: Woodpecker =
      index < w.keys.length
        ? { ...w, ...total, index, at: now }
        : { ...w, rounds: [...w.rounds, { ...total, at: now }], index: 0, ms: 0, misses: 0, at: now };
    return { ...s, chessWoodpecker: next };
  });
}

export function woodpeckerReset() {
  setState((s) => ({ ...s, chessWoodpecker: undefined }));
}

export function chessStreakReached(n: number) {
  setState((s) => (n > s.chessStreak ? { ...s, chessStreak: n } : s));
}

export function chessOpeningLearned(id: string, side: "white" | "black") {
  setState((s) => ({
    ...s,
    chessOpenings: { ...s.chessOpenings, [`${id}:${side}`]: s.chessOpenings[`${id}:${side}`] ?? Date.now() },
  }));
}

export function chessGameViewed(id: string) {
  setState((s) => ({ ...s, chessGamesViewed: { ...s.chessGamesViewed, [id]: s.chessGamesViewed[id] ?? Date.now() } }));
}

export function addChessDiary(entry: Omit<ChessDiaryEntry, "id" | "createdAt">) {
  setState((s) => ({
    ...s,
    chessDiary: [{ ...entry, id: `d${Date.now().toString(36)}`, createdAt: Date.now() }, ...s.chessDiary],
  }));
}

export function removeChessDiary(id: string) {
  setState((s) => ({ ...s, chessDiary: s.chessDiary.filter((e) => e.id !== id) }));
}

/** Задание школы эндшпиля решено (время первого решения не меняется). */
export function chessEndgameSolved(id: string, now = Date.now()) {
  setState((s) => (s.chessEndgames[id] ? s : { ...s, chessEndgames: { ...s.chessEndgames, [id]: now } }));
}

export function updateSettings(patch: Partial<Settings>) {
  setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

/** Записать имя ребёнка (и, если нужно, его узбекское написание латиницей). */
export function setChildName(name: string, uz?: string) {
  updateSettings({ childName: cleanChildName(name), childNameUz: cleanChildName(uz), childNameAt: Date.now() });
}

export function setWelcomed() {
  setState((s) => ({ ...s, welcomed: true }));
}

export function replaceState(next: AppState) {
  setState(() => next);
}

export function resetProgress() {
  setState((s) => ({ ...DEFAULT_STATE, settings: s.settings, welcomed: s.welcomed }));
}
