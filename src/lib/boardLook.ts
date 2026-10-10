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

export function boardThemeOf(id: string | undefined): BoardTheme {
  return BOARD_THEMES.find((t) => t.id === id) ?? DEFAULT_BOARD_THEME;
}

export function isBoardThemeId(id: unknown): id is string {
  return typeof id === "string" && BOARD_THEMES.some((t) => t.id === id);
}

/** Наборы звуков ходов: записанное дерево (по умолчанию) и мягкие синтезированные «игровые» звуки. */
export const SOUND_SETS = [
  { id: "wood", ru: "Деревянные", uz: "Yogʻoch" },
  { id: "soft", ru: "Мягкие", uz: "Yumshoq" },
] as const;

export type SoundSetId = (typeof SOUND_SETS)[number]["id"];

export function isSoundSetId(id: unknown): id is SoundSetId {
  return SOUND_SETS.some((s) => s.id === id);
}
