/**
 * Узбекская версия контента — «накладка» на русский: тот же объект, но только с текстами.
 * Структура, ответы, позиции и id берутся из русского оригинала, поэтому перевод не может
 * сломать задачу. Массивы объектов с id накладываются по id, остальные массивы — по порядку.
 *
 * Правило проверяют тесты: после наложения в узбекском контенте не остаётся ни одной
 * кириллической буквы, а накладка не трогает строки без кириллицы (FEN, ходы, id).
 */
import type { Lang } from "@/lib/i18n";

/** Накладка для типа T: только строки, всё необязательно. */
export type Uz<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? U extends { id: string }
      ? { readonly [id: string]: Uz<U> } | readonly (Uz<U> | null | undefined)[]
      : readonly (Uz<U> | null | undefined)[]
    : T extends object
      ? { readonly [K in keyof T]?: Uz<T[K]> }
      : never;

export function overlay<T>(base: T, uz: unknown): T {
  if (uz === undefined || uz === null) return base;
  if (typeof base === "string") return (typeof uz === "string" ? uz : base) as T;
  if (Array.isArray(base)) {
    if (Array.isArray(uz)) return base.map((b, i) => overlay(b, uz[i])) as T;
    if (typeof uz === "object") {
      const byId = uz as Record<string, unknown>;
      return base.map((b) => (isWithId(b) ? overlay(b, byId[b.id]) : b)) as T;
    }
    return base;
  }
  if (base && typeof base === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(uz as Record<string, unknown>)) {
      if (k in out) out[k] = overlay(out[k], v);
    }
    return out as T;
  }
  return base;
}

function isWithId(x: unknown): x is { id: string } {
  return !!x && typeof x === "object" && typeof (x as { id?: unknown }).id === "string";
}

/** Выбрать язык: для русского — оригинал, для узбекского — оригинал с накладкой. */
export function localize<T>(base: T, uz: unknown, lang: Lang): T {
  return lang === "uz" ? overlay(base, uz) : base;
}

// ---------------------------------------------------------------------------
// Проверки для тестов
// ---------------------------------------------------------------------------

const CYRILLIC = /[А-Яа-яЁё]/;

/** Пути к строкам, где осталась кириллица (в узбекской версии их быть не должно). */
export function cyrillicPaths(x: unknown, path = "", out: string[] = []): string[] {
  if (typeof x === "string") {
    if (CYRILLIC.test(x)) out.push(`${path}: ${x.slice(0, 60)}`);
  } else if (Array.isArray(x)) {
    x.forEach((v, i) => cyrillicPaths(v, `${path}[${i}]`, out));
  } else if (x && typeof x === "object") {
    for (const [k, v] of Object.entries(x)) cyrillicPaths(v, path ? `${path}.${k}` : k, out);
  }
  return out;
}

/**
 * Ошибки накладки: ключи и id, которых нет в оригинале (опечатки), и замена строк без кириллицы
 * (позиции, ходы, id — их переводить нельзя).
 */
export function overlayProblems(base: unknown, uz: unknown, path = "", out: string[] = []): string[] {
  if (uz === undefined || uz === null) return out;
  if (typeof base === "string") {
    if (typeof uz !== "string") out.push(`${path}: ожидалась строка`);
    else if (!CYRILLIC.test(base) && uz !== base) out.push(`${path}: заменена строка без кириллицы «${base}»`);
    return out;
  }
  if (Array.isArray(base)) {
    if (Array.isArray(uz)) {
      if (uz.length > base.length) out.push(`${path}: лишние элементы (${uz.length} > ${base.length})`);
      uz.forEach((v, i) => overlayProblems(base[i], v, `${path}[${i}]`, out));
    } else if (typeof uz === "object") {
      const ids = new Map(base.filter(isWithId).map((b) => [b.id, b]));
      for (const [id, v] of Object.entries(uz as Record<string, unknown>)) {
        if (!ids.has(id)) out.push(`${path}: нет элемента с id «${id}»`);
        else overlayProblems(ids.get(id), v, `${path}.${id}`, out);
      }
    }
    return out;
  }
  if (base && typeof base === "object") {
    if (typeof uz !== "object") {
      out.push(`${path}: ожидался объект`);
      return out;
    }
    for (const [k, v] of Object.entries(uz as Record<string, unknown>)) {
      if (!(k in (base as object))) out.push(`${path ? `${path}.` : ""}${k}: нет такого поля в оригинале`);
      else overlayProblems((base as Record<string, unknown>)[k], v, path ? `${path}.${k}` : k, out);
    }
    return out;
  }
  out.push(`${path}: в оригинале не строка — переводить нечего`);
  return out;
}
