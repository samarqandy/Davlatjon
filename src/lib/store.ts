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
  /** Родитель открыл все уровни шахматной школы. */
  chessOpenAll?: boolean;
  /** Возраст ребёнка (6–15): от него зависят советы и сложность. Спрашивается при первом запуске. */
  age?: number;
  /** Озвучка: голос диктора, похвала и чтение вслух. По умолчанию включена. */
  sound?: boolean;
  /** Язык платформы: русский или узбекский. */
  lang?: "ru" | "uz";
}

/** Сыгранная с роботом или вдвоём партия. */
export interface ChessGameRecord {
  id: string;
  at: number;
  /** robot — с роботом, two — вдвоём, pawns — пешечный бой, endgame — тренировка мата. */
  mode: "robot" | "two" | "pawns" | "endgame";
  /** Уровень робота (1–5) или название тренировки. */
  level?: number;
  variant?: string;
  /** За кого играл ребёнок. */
  color: "w" | "b";
  result: "win" | "loss" | "draw";
  moves: number;
  /** Кто победил (для партии вдвоём result считается за белых). */
  winner?: "w" | "b" | "draw";
  /** Начальная позиция и все ходы (e2e4) — для разбора партии. */
  start?: string;
  ucis?: string[];
  /** Часы «5+3» и фора «bq» (чёрные без ферзя). */
  clock?: string;
  odds?: string;
  /** Оценки движка для каждой позиции — сохраняются после разбора. */
  analysis?: {
    evals: number[];
    best: (string | null)[];
    /** Точность белых и чёрных, %. */
    acc?: { w: number; b: number };
    /** Ошибки и зевки — для задач «из твоих партий». */
    moments?: ReviewMoment[];
  };
}

export interface ReviewMoment {
  ply: number;
  side: "w" | "b";
  fen: string;
  san: string;
  best: string;
  bestSan: string;
  kind: "mistake" | "blunder";
}

export interface ChessPuzzleProgress {
  solvedAt?: number;
  misses: number;
  /** Интервальное повторение: коробка 1–4 и день следующего повторения «ГГГГ-ММ-ДД». */
  box?: number;
  due?: string;
}

/** Через сколько дней повторить задачу из коробки 1, 2, 3, 4. */
export const REVIEW_DAYS = [1, 3, 7, 21];

export function isoDay(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export interface ChessDiaryEntry {
  id: string;
  createdAt: number;
  date: string;
  opponent: string;
  color: "w" | "b";
  result: "win" | "loss" | "draw";
  notes: string;
}

export interface ChessExerciseProgress {
  solvedAt?: number;
  /** Сколько раз не получилось. */
  misses: number;
  /** Лучший результат: меньше всего ходов (звёздочки). */
  best?: number;
  /** Найденные решения (ферзи). */
  found?: string[];
}

export interface AppState {
  version: 1;
  tasks: Record<string, TaskProgress>;
  days: Record<string, DayProgress>;
  myProblems: MyProblem[];
  /** Недельный обзор: неделя → вопрос → заметка. */
  reviews: Record<string, Record<string, string>>;
  settings: Settings;
  /** Шахматная школа: упражнение → прогресс. */
  chess: Record<string, ChessExerciseProgress>;
  /** Партии с роботом и вдвоём (последние 200). */
  chessGames: ChessGameRecord[];
  /** Задачи: id → прогресс. */
  chessPuzzles: Record<string, ChessPuzzleProgress>;
  /** Лучшая серия решённых задач подряд. */
  chessStreak: number;
  /** Выученные дебюты: «id:side» → когда. */
  chessOpenings: Record<string, number>;
  /** Просмотренные до конца знаменитые партии: id → когда. */
  chessGamesViewed: Record<string, number>;
  chessDiary: ChessDiaryEntry[];
  /** Задачи из своих партий: «idПартии:полуход» → когда решена. */
  chessOwnPuzzles: Record<string, number>;
  /** «Сыграй как…»: лучший счёт в знаменитой партии. */
  chessGuess: Record<string, { score: number; max: number }>;
  /** Тренажёр координат: режим → рекорд. */
  chessDrills: Record<string, number>;
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
  chess: {},
  chessGames: [],
  chessPuzzles: {},
  chessStreak: 0,
  chessOpenings: {},
  chessGamesViewed: {},
  chessDiary: [],
  chessOwnPuzzles: {},
  chessGuess: {},
  chessDrills: {},
}) as AppState;

export const EMPTY_CHESS: ChessExerciseProgress = Object.freeze({ misses: 0 }) as ChessExerciseProgress;

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
      chessOpenAll: settings.chessOpenAll === true,
      age:
        Number.isInteger(settings.age) && (settings.age as number) >= 6 && (settings.age as number) <= 15
          ? (settings.age as number)
          : undefined,
      sound: settings.sound !== false,
      lang: settings.lang === "uz" ? "uz" : "ru",
    },
    chess: isObject(raw.chess) ? (raw.chess as AppState["chess"]) : {},
    chessGames: Array.isArray(raw.chessGames) ? (raw.chessGames as ChessGameRecord[]) : [],
    chessPuzzles: isObject(raw.chessPuzzles) ? (raw.chessPuzzles as AppState["chessPuzzles"]) : {},
    chessStreak: typeof raw.chessStreak === "number" ? raw.chessStreak : 0,
    chessOpenings: isObject(raw.chessOpenings) ? (raw.chessOpenings as AppState["chessOpenings"]) : {},
    chessGamesViewed: isObject(raw.chessGamesViewed) ? (raw.chessGamesViewed as AppState["chessGamesViewed"]) : {},
    chessDiary: Array.isArray(raw.chessDiary) ? (raw.chessDiary as ChessDiaryEntry[]) : [],
    chessOwnPuzzles: isObject(raw.chessOwnPuzzles) ? (raw.chessOwnPuzzles as AppState["chessOwnPuzzles"]) : {},
    chessGuess: isObject(raw.chessGuess) ? (raw.chessGuess as AppState["chessGuess"]) : {},
    chessDrills: isObject(raw.chessDrills) ? (raw.chessDrills as AppState["chessDrills"]) : {},
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
