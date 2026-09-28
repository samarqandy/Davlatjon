"use client";

import { useSyncExternalStore } from "react";

/**
 * Прогресс хранится в localStorage этого браузера.
 * Небольшой собственный стор на useSyncExternalStore: без лишних зависимостей
 * и без ошибок гидратации (на сервере и при гидратации — состояние по умолчанию).
 */

import {
  DEFAULT_STATE,
  EMPTY_CHESS,
  EMPTY_TASK,
  REVIEW_DAYS,
  STORAGE_KEY,
  isoDay,
  sanitize,
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
} from "./state";

export * from "./state";

let state: AppState = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = sanitize(JSON.parse(raw));
  } catch {
    state = DEFAULT_STATE;
  }
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

const noopSubscribe = () => () => {};

/** true после гидратации — можно показывать данные из localStorage. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useTask(taskId: string): TaskProgress {
  return useStore((s) => s.tasks[taskId] ?? EMPTY_TASK);
}

export function useChessExercise(id: string): ChessExerciseProgress {
  return useStore((s) => s.chess[id] ?? EMPTY_CHESS);
}

// ---------------------------------------------------------------------------
// Действия
// ---------------------------------------------------------------------------

export function updateTask(taskId: string, update: (t: TaskProgress) => Partial<TaskProgress>) {
  setState((s) => {
    const prev = s.tasks[taskId] ?? EMPTY_TASK;
    const next = { ...prev, ...update(prev) };
    return { ...s, tasks: { ...s.tasks, [taskId]: next } };
  });
}

export function setTaskMark(taskId: string, mark: keyof TaskMarks, value: boolean) {
  updateTask(taskId, (t) => ({ marks: { ...t.marks, [mark]: value } }));
}

export function saveTaskInput(taskId: string, input: Record<string, unknown>) {
  updateTask(taskId, (t) => ({ input: { ...t.input, ...input }, status: t.status ?? "started" }));
}

export function markSolved(taskId: string) {
  updateTask(taskId, (t) =>
    t.status === "solved" ? {} : { status: "solved", solvedAt: Date.now(), firstTry: t.missed === 0 && t.checks <= 1 },
  );
}

export function recordCheck(taskId: string, correct: boolean) {
  updateTask(taskId, (t) => ({
    checks: t.checks + 1,
    missed: correct ? t.missed : t.missed + 1,
    status: t.status ?? "started",
  }));
  if (correct) markSolved(taskId);
}

export function addFound(taskId: string, key: string) {
  updateTask(taskId, (t) => (t.found?.includes(key) ? {} : { found: [...(t.found ?? []), key] }));
}

export function addTime(taskId: string, ms: number) {
  if (ms <= 0) return;
  updateTask(taskId, (t) => ({ timeMs: t.timeMs + ms }));
}

export function openHint(taskId: string) {
  updateTask(taskId, (t) => ({ hints: Math.min(5, t.hints + 1), status: t.status ?? "started" }));
}

export function updateDay(dayId: string, patch: Partial<DayProgress>) {
  setState((s) => ({ ...s, days: { ...s.days, [dayId]: { ...s.days[dayId], ...patch } } }));
}

export function startDay(dayId: string) {
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

/**
 * Задача решена. clean — без ошибок в этой попытке: тогда задача из очереди повторения переходит
 * в следующую коробку (повторить позже), а после четвёртой — считается выученной.
 */
export function chessPuzzleSolved(id: string, clean = true, now = Date.now()) {
  setState((s) => {
    const p = s.chessPuzzles[id];
    let box = p?.box;
    let due = p?.due;
    if (box && clean && due && due <= isoDay(now)) {
      box += 1;
      due = box > REVIEW_DAYS.length ? undefined : isoDay(now + REVIEW_DAYS[box - 1] * 86_400_000);
      if (!due) box = undefined;
    }
    return {
      ...s,
      chessPuzzles: {
        ...s.chessPuzzles,
        [id]: { misses: p?.misses ?? 0, solvedAt: p?.solvedAt ?? now, box, due },
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

export function setWelcomed() {
  setState((s) => ({ ...s, welcomed: true }));
}

export function replaceState(next: AppState) {
  setState(() => next);
}

export function resetProgress() {
  setState((s) => ({ ...DEFAULT_STATE, settings: s.settings, welcomed: s.welcomed }));
}
