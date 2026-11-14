/**
 * Вид доски и звук ходов. Это настройка устройства (как и «звуки ходов»): ребёнок выбирает цвета доски
 * и набор звуков, родитель может сделать то же в настройках.
 */

export interface BoardTheme {
  id: string;
  ru: string;
  uz: string;
  /** Светлые клетки, тёмные клетки, рамка доски (на ней белые подписи a–h и 1–8). */
  light: string;
  dark: string;
  frame: string;
}

export const BOARD_THEMES: readonly BoardTheme[] = [
  { id: "wood", ru: "Дерево", uz: "Yogʻoch", light: "#f0d9b5", dark: "#b58863", frame: "#7c5a33" },
  { id: "green", ru: "Зелёная", uz: "Yashil", light: "#eeeed2", dark: "#6f9a4d", frame: "#35502a" },
  { id: "blue", ru: "Морская", uz: "Dengiz", light: "#dee8ee", dark: "#6f93ab", frame: "#2f4a5c" },
  { id: "violet", ru: "Фиалка", uz: "Binafsha", light: "#efe6f7", dark: "#9a78bd", frame: "#4f3470" },
  { id: "berry", ru: "Ягодная", uz: "Rezavor", light: "#fbe6ec", dark: "#d27a96", frame: "#8a3150" },
] as const;

export const DEFAULT_BOARD_THEME = BOARD_THEMES[0];

/**
 * Доска тренера в режиме класса (проектор, интерактивная панель): клетки контрастнее обычного «дерева»
 * (4,3 : 1 вместо 2,3 : 1) — на засвеченном проекторе обычные клетки сливаются. Ребёнку в «Моей доске»
 * не предлагается.
 */
export const CLASS_BOARD_THEME: BoardTheme = {
  id: "class",
  ru: "Для класса",
  uz: "Sinf uchun",
  light: "#f7efe2",
  dark: "#946642",
  frame: "#3b2a1a",
};

export function boardThemeOf(id: string | undefined): BoardTheme {
  return BOARD_THEMES.find((t) => t.id === id) ?? DEFAULT_BOARD_THEME;
}

export function isBoardThemeId(id: unknown): id is string {
  return typeof id === "string" && BOARD_THEMES.some((t) => t.id === id);
}

/**
 * Наборы фигур. «classic» — фигуры библиотеки доски; остальные — свободные наборы из public/pieces
 * (автор и лицензия — там же, в README.md и LICENSE.txt). Наборы под GPL, AGPL и «некоммерческие» не берём.
 */
export interface PieceSet {
  id: string;
  ru: string;
  uz: string;
  /** Автор и лицензия — показываем рядом с выбором: этого требуют MIT и Apache 2.0. */
  author?: string;
  license?: string;
}

export const PIECE_SETS: readonly PieceSet[] = [
  { id: "classic", ru: "Классические", uz: "Klassik" },
  { id: "celtic", ru: "Объёмные", uz: "Hajmli", author: "Maurizio Monge", license: "MIT" },
  { id: "chessnut", ru: "Чёткие", uz: "Aniq", author: "Alexis Luengas", license: "Apache 2.0" },
] as const;

export const DEFAULT_PIECE_SET = PIECE_SETS[0];

export function isPieceSetId(id: unknown): id is string {
  return typeof id === "string" && PIECE_SETS.some((p) => p.id === id);
}

export const pieceSetOf = (id: string | undefined): PieceSet =>
  PIECE_SETS.find((p) => p.id === id) ?? DEFAULT_PIECE_SET;

/** Фигуры позиции по клеткам, от a8 к h1 — как их рисуют на диаграмме за белых. Ошибочная запись — пустая доска. */
export function fenCells(fen: string): (string | null)[] {
  const cells: (string | null)[] = [];
  for (const char of fen.split(" ")[0] ?? "") {
    if (char === "/") continue;
    if (/[1-8]/.test(char)) for (let k = 0; k < Number(char); k++) cells.push(null);
    else if (/[prnbqk]/i.test(char)) cells.push((char === char.toUpperCase() ? "w" : "b") + char.toUpperCase());
  }
  return cells.length === 64 ? cells : Array.from({ length: 64 }, () => null);
}

/** Адрес картинки фигуры набора («wN», «bK»); у классического набора картинок нет — он рисуется кодом. */
export const pieceSrc = (setId: string, piece: string) => `/pieces/${setId}/${piece}.svg`;

/** Наборы звуков ходов: записанное дерево (по умолчанию) и мягкие синтезированные «игровые» звуки. */
export const SOUND_SETS = [
  { id: "wood", ru: "Деревянные", uz: "Yogʻoch" },
  { id: "soft", ru: "Мягкие", uz: "Yumshoq" },
] as const;

export type SoundSetId = (typeof SOUND_SETS)[number]["id"];

export function isSoundSetId(id: unknown): id is SoundSetId {
  return SOUND_SETS.some((s) => s.id === id);
}
