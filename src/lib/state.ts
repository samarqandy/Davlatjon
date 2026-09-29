/**
 * Формат прогресса: типы, состояние по умолчанию и приведение данных к текущему формату.
 * Без React и без браузера — поэтому этим пользуются и сервер (синхронизация с аккаунтом), и тесты.
 * Сам стор (localStorage + подписки) — в src/lib/store.ts.
 */
import { cleanChildName } from "./childName";
import type { PuzzleLevel, PuzzleRating } from "./puzzleRating";

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
  /** Звуки ходов на доске. Настройка устройства, по умолчанию включена. */
  boardSounds?: boolean;
  /** Язык платформы: русский или узбекский. */
  lang?: "ru" | "uz";
  /** Имя ребёнка — как записали при первом запуске (любой алфавит). */
  childName?: string;
  /** Как писать имя по-узбекски латиницей, если оно записано кириллицей (иначе — автоматически). */
  childNameUz?: string;
  /** Когда имя меняли в последний раз (мс) — при слиянии устройств побеждает последнее. */
  childNameAt?: number;
  /** Сложность задач из базы: легче своего уровня, по силам (по умолчанию) или труднее. */
  puzzleLevel?: PuzzleLevel;
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
  /** Партия с роботом: сколько раз ребёнок брал подсказку и отменял ход (для корон). */
  hints?: number;
  undos?: number;
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

/** «Дятел»: один набор задач решается три круга подряд — с каждым кругом быстрее. */
export interface WoodpeckerRound {
  ms: number;
  misses: number;
  at: number;
}

export interface Woodpecker {
  /** Задачи набора (ключи банка «тема/id»). */
  keys: string[];
  /** Пройденные круги. */
  rounds: WoodpeckerRound[];
  /** Текущий круг: сколько задач решено, сколько на них ушло времени и было ошибок. */
  index: number;
  ms: number;
  misses: number;
  at: number;
}

export const WOODPECKER_ROUNDS = 3;

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
  /** Задачи: id задачи школы или «тема/id» задачи из базы → прогресс. */
  chessPuzzles: Record<string, ChessPuzzleProgress>;
  /** Скрытый рейтинг задач из базы (появляется после первой такой задачи). */
  chessRating?: PuzzleRating;
  /** «Дятел»: текущий набор и пройденные круги. */
  chessWoodpecker?: Woodpecker;
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
  /** Школа эндшпиля: задание → когда решено. */
  chessEndgames: Record<string, number>;
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
  chessEndgames: {},
}) as AppState;

export const EMPTY_CHESS: ChessExerciseProgress = Object.freeze({ misses: 0 }) as ChessExerciseProgress;

export const EMPTY_TASK: TaskProgress = Object.freeze({
  hints: 0,
  checks: 0,
  missed: 0,
  timeMs: 0,
  marks: {},
}) as TaskProgress;

export function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Приводит данные из файла или старой версии к текущему формату. */
const finite = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);

function ratingOf(x: unknown): PuzzleRating | undefined {
  if (!isObject(x) || !finite(x.r) || !finite(x.rd) || !finite(x.n) || !finite(x.at)) return undefined;
  return { r: x.r, rd: x.rd, n: x.n, at: x.at };
}

function woodpeckerOf(x: unknown): Woodpecker | undefined {
  if (!isObject(x) || !Array.isArray(x.keys) || !x.keys.every((k) => typeof k === "string")) return undefined;
  if (!Array.isArray(x.rounds) || !finite(x.index) || !finite(x.ms) || !finite(x.misses) || !finite(x.at))
    return undefined;
  const rounds = x.rounds.filter(
    (r): r is WoodpeckerRound => isObject(r) && finite(r.ms) && finite(r.misses) && finite(r.at),
  );
  return { keys: x.keys as string[], rounds, index: x.index, ms: x.ms, misses: x.misses, at: x.at };
}

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
      boardSounds: settings.boardSounds !== false,
      childName: cleanChildName(settings.childName),
      childNameUz: cleanChildName(settings.childNameUz),
      childNameAt:
        Number.isFinite(settings.childNameAt) && (settings.childNameAt as number) > 0
          ? (settings.childNameAt as number)
          : undefined,
      lang: settings.lang === "uz" ? "uz" : "ru",
      puzzleLevel:
        settings.puzzleLevel === "easy" || settings.puzzleLevel === "hard" ? settings.puzzleLevel : undefined,
    },
    chess: isObject(raw.chess) ? (raw.chess as AppState["chess"]) : {},
    chessGames: Array.isArray(raw.chessGames) ? (raw.chessGames as ChessGameRecord[]) : [],
    chessPuzzles: isObject(raw.chessPuzzles) ? (raw.chessPuzzles as AppState["chessPuzzles"]) : {},
    chessRating: ratingOf(raw.chessRating),
    chessWoodpecker: woodpeckerOf(raw.chessWoodpecker),
    chessStreak: typeof raw.chessStreak === "number" ? raw.chessStreak : 0,
    chessOpenings: isObject(raw.chessOpenings) ? (raw.chessOpenings as AppState["chessOpenings"]) : {},
    chessGamesViewed: isObject(raw.chessGamesViewed) ? (raw.chessGamesViewed as AppState["chessGamesViewed"]) : {},
    chessDiary: Array.isArray(raw.chessDiary) ? (raw.chessDiary as ChessDiaryEntry[]) : [],
    chessOwnPuzzles: isObject(raw.chessOwnPuzzles) ? (raw.chessOwnPuzzles as AppState["chessOwnPuzzles"]) : {},
    chessGuess: isObject(raw.chessGuess) ? (raw.chessGuess as AppState["chessGuess"]) : {},
    chessDrills: isObject(raw.chessDrills) ? (raw.chessDrills as AppState["chessDrills"]) : {},
    chessEndgames: isObject(raw.chessEndgames) ? (raw.chessEndgames as AppState["chessEndgames"]) : {},
    welcomed: raw.welcomed === true,
  };
}
