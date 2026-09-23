"use client";

import { useSyncExternalStore } from "react";

/**
 * Прогресс хранится в localStorage этого браузера.
 * Небольшой собственный стор на useSyncExternalStore: без лишних зависимостей
 * и без ошибок гидратации (на сервере и при гидратации — состояние по умолчанию).
 */

export interface TaskMarks {
  explained?: boolean;
  anotherWay?: boolean;
  liked?: boolean;
  hard?: boolean;
}

export interface TaskProgress {
  status?: "started" | "solved";
  /** Сколько подсказок открыто (0–5). */
  hints: number;
  /** Сколько раз нажата «Проверить». */
  checks: number;
  /** Сколько проверок не сошлось. */
  missed: number;
  solvedAt?: number;
  /** Решена с первой проверки. */
  firstTry?: boolean;
  /** Время на задаче, мс. */
  timeMs: number;
  marks: TaskMarks;
  /** Найденные варианты в задачах с несколькими ответами. */
  found?: string[];
  /** Сохранённый ввод ребёнка. */
  input?: Record<string, unknown>;
  /** Наблюдения родителя. */
  parentChips?: string[];
  parentNote?: string;
}

export interface DayProgress {
  startedAt?: number;
  completedAt?: number;
  favorite?: string;
  hardest?: string;
  mood?: string;
  parentNote?: string;
}

export interface MyProblem {
  id: string;
  createdAt: number;
  title: string;
  text: string;
  answer?: string;
}

export interface Settings {
  /** Пауза перед следующей подсказкой. */
  hintPause: boolean;
  /** Крупный текст. */
  bigText: boolean;
}

export interface AppState {
  version: 1;
  tasks: Record<string, TaskProgress>;
  days: Record<string, DayProgress>;
  myProblems: MyProblem[];
  /** Недельный обзор: неделя → вопрос → заметка. */
  reviews: Record<string, Record<string, string>>;
  settings: Settings;
  welcomed?: boolean;
}

export const STORAGE_KEY = "davlatjon-lab:v1";

export const DEFAULT_STATE: AppState = Object.freeze({
  version: 1,
  tasks: {},
  days: {},
  myProblems: [],
  reviews: {},
  settings: { hintPause: true, bigText: false },
}) as AppState;

export const EMPTY_TASK: TaskProgress = Object.freeze({
  hints: 0,
  checks: 0,
  missed: 0,
  timeMs: 0,
  marks: {},
}) as TaskProgress;

let state: AppState = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Приводит данные из файла или старой версии к текущему формату. */
export function sanitize(raw: unknown): AppState {
  if (!isObject(raw)) return DEFAULT_STATE;
  const settings = isObject(raw.settings) ? raw.settings : {};
  return {
    version: 1,
    tasks: isObject(raw.tasks) ? (raw.tasks as AppState["tasks"]) : {},
    days: isObject(raw.days) ? (raw.days as AppState["days"]) : {},
    myProblems: Array.isArray(raw.myProblems) ? (raw.myProblems as MyProblem[]) : [],
    reviews: isObject(raw.reviews) ? (raw.reviews as AppState["reviews"]) : {},
    settings: {
      hintPause: typeof settings.hintPause === "boolean" ? settings.hintPause : true,
      bigText: typeof settings.bigText === "boolean" ? settings.bigText : false,
    },
    welcomed: raw.welcomed === true,
  };
}

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
