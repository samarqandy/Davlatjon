/**
 * Часть шахматного контента: русский оригинал и узбекская накладка вместе.
 * Каждая часть — свой модуль, поэтому страница тянет в браузер только те части, что ей нужны
 * (раньше каждая шахматная страница грузила весь контент: ~150 КБ gzip).
 */
import type { Lang } from "@/lib/lang";
import { overlay, type Uz } from "../../localize";

export interface ChessPart<T> {
  readonly ru: T;
  /** Узбекская накладка (для сборки общего CHESS_UZ и тестов). */
  readonly uz: { readonly [K in keyof T]?: Uz<T[K]> };
  /** Часть на нужном языке; узбекская собирается один раз. */
  get(lang: Lang): T;
}

export function chessPart<T extends object>(ru: T, uz: { readonly [K in keyof T]?: Uz<T[K]> }): ChessPart<T> {
  let built: T | undefined;
  return { ru, uz, get: (lang) => (lang === "uz" ? (built ??= overlay(ru, uz)) : ru) };
}
