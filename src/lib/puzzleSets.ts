/**
 * «Сборник задач»: задачи одной темы из базы Lichess — как в задачнике, по номерам, от лёгких к трудным.
 *
 * Отдельного прогресса у сборника нет: состояние номера берётся из общего прогресса задач (chessPuzzles),
 * поэтому задача, решённая в «Задачах по силам» или «Шторме», и в сборнике отмечена решённой — и наоборот.
 */
import type { PuzzleTheme } from "@/content/chess/puzzles";
import type { BankPuzzle } from "./puzzleBank";
import type { ChessPuzzleProgress } from "./state";

/** Номеров в одной главе сборника. */
export const SET_CHAPTER = 50;

/**
 * Состояние номера:
 * new — ещё не открывали; clean — решена, и ни в одной попытке не было ошибки или подсказки; solved — решена,
 * но ошибки или подсказки были (счёт ошибок общий для всех попыток во всех режимах); open — была ошибка или
 * показано решение, а сама задача ещё не решена.
 */
export type SetStatus = "new" | "clean" | "solved" | "open";

export function setStatus(p: ChessPuzzleProgress | undefined): SetStatus {
  if (!p) return "new";
  if (p.solvedAt) return p.misses ? "solved" : "clean";
  return "open";
}

/** Порядок задач сборника: по рейтингу, при равном — по id. Номер задачи — её место плюс один. */
export function setOrder(list: readonly BankPuzzle[]): BankPuzzle[] {
  return [...list].sort((a, b) => a.rating - b.rating || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export interface SetCounts {
  total: number;
  clean: number;
  solved: number;
  open: number;
  fresh: number;
}

export function setCounts(keys: readonly string[], progress: Readonly<Record<string, ChessPuzzleProgress>>): SetCounts {
  const out: SetCounts = { total: keys.length, clean: 0, solved: 0, open: 0, fresh: 0 };
  for (const key of keys) {
    const s = setStatus(progress[key]);
    if (s === "new") out.fresh++;
    else out[s]++;
  }
  return out;
}

/**
 * Следующий номер (индекс с нуля) после `after` с одним из состояний; ищем по кругу, сам `after` — последним.
 * Нет такого — -1.
 */
export function nextWith(
  keys: readonly string[],
  progress: Readonly<Record<string, ChessPuzzleProgress>>,
  wanted: readonly SetStatus[],
  after = -1,
): number {
  const n = keys.length;
  for (let step = 1; step <= n; step++) {
    const i = (((after + step) % n) + n) % n;
    if (wanted.includes(setStatus(progress[keys[i]]))) return i;
  }
  return -1;
}

/** Ближайший номер в одну сторону от `from` (без круга) с одним из состояний; нет — -1. */
export function stepWith(
  keys: readonly string[],
  progress: Readonly<Record<string, ChessPuzzleProgress>>,
  wanted: readonly SetStatus[],
  from: number,
  dir: 1 | -1,
): number {
  for (let i = from + dir; i >= 0 && i < keys.length; i += dir)
    if (wanted.includes(setStatus(progress[keys[i]]))) return i;
  return -1;
}

/** Главы сборника: «1–50», «51–100»… — индексы с нуля, конец не включается. */
export function chapters(total: number): { from: number; to: number }[] {
  const out: { from: number; to: number }[] = [];
  for (let from = 0; from < total; from += SET_CHAPTER) out.push({ from, to: Math.min(from + SET_CHAPTER, total) });
  return out;
}

/** Глава, в которой лежит номер. */
export const chapterOf = (index: number) => Math.floor(Math.max(index, 0) / SET_CHAPTER);

/**
 * Адреса экранов сборника:
 * #sets — оглавление; #set-<тема> — номера темы; #set-<тема>-<номер> — задача (номер с единицы);
 * #fix-<тема>-<номер> — та же задача в режиме «нерешённые»: «дальше» ведёт к следующей нерешённой.
 */
export type SetRoute =
  | { kind: "index" }
  | { kind: "grid"; theme: PuzzleTheme }
  | { kind: "puzzle"; theme: PuzzleTheme; index: number; fix: boolean };

export function parseSetHash(hash: string, themes: readonly string[]): SetRoute | null {
  if (hash === "#sets") return { kind: "index" };
  const m = hash.match(/^#(set|fix)-([a-z0-9]+)(?:-(\d{1,4}))?$/);
  if (!m || !themes.includes(m[2])) return null;
  const theme = m[2] as PuzzleTheme;
  if (!m[3]) return m[1] === "set" ? { kind: "grid", theme } : null;
  const n = Number(m[3]);
  if (n < 1) return null;
  return { kind: "puzzle", theme, index: n - 1, fix: m[1] === "fix" };
}

export const setHashOf = (theme: PuzzleTheme, index?: number, fix = false) =>
  index === undefined ? `#set-${theme}` : `#${fix ? "fix" : "set"}-${theme}-${index + 1}`;
