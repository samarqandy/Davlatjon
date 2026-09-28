"use client";

/**
 * Два языка платформы: русский и узбекский (латиница). Язык хранится в настройках на этом устройстве.
 * Тексты интерфейса пишутся парами прямо в компоненте: t("Играть", "Oʻynash") — так перевод всегда рядом
 * со смыслом, а узбекский текст можно писать живым языком, а не дословно.
 */
import { useCallback } from "react";
import { ruSan } from "./chess";
import { getState, updateSettings, useStore } from "./store";

export type Lang = "ru" | "uz";

export const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: "ru", label: "Русский", short: "RU" },
  { id: "uz", label: "Oʻzbekcha", short: "UZ" },
];

export function useLang(): Lang {
  return useStore((s) => (s.settings.lang === "uz" ? "uz" : "ru"));
}

export function currentLang(): Lang {
  return getState().settings.lang === "uz" ? "uz" : "ru";
}

export function setLang(lang: Lang) {
  updateSettings({ lang });
}

/** Пара «по-русски / по-узбекски» → текст на текущем языке. */
export type T = (ru: string, uz: string) => string;

export function useT(): T {
  const lang = useLang();
  return useCallback((ru: string, uz: string) => (lang === "uz" ? uz : ru), [lang]);
}

export function pick<V>(lang: Lang, ru: V, uz: V): V {
  return lang === "uz" ? uz : ru;
}

/** Данные на обоих языках — сервер готовит обе версии, клиент показывает нужную. */
export interface Both<V> {
  ru: V;
  uz: V;
}

export function useBoth<V>(both: Both<V>): V {
  return useLang() === "uz" ? both.uz : both.ru;
}

/**
 * Число с существительным: по-русски — с падежом (3 задачи, 5 задач), по-узбекски существительное
 * после числа не меняется (3 ta masala, 5 ta masala).
 */
export function countText(lang: Lang, n: number, ru: [one: string, few: string, many: string], uz: string): string {
  if (lang === "uz") return `${n} ${uz}`;
  const mod10 = Math.abs(n) % 10;
  const mod100 = Math.abs(n) % 100;
  const word =
    mod10 === 1 && mod100 !== 11 ? ru[0] : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? ru[1] : ru[2];
  return `${n} ${word}`;
}

const FIGURINE: Record<string, string> = { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘" };

/**
 * Запись хода для узбекского интерфейса — фигурками: «♘f3», «♗xc6+», «e8=♕».
 * Буквы фигур в узбекском не устоялись, а значки понятны без перевода и приняты ФИДЕ.
 */
export function figurineSan(san: string): string {
  if (san.startsWith("O-O")) return san.replace(/O/g, "0");
  return san.replace(/^[KQRBN]/, (l) => FIGURINE[l]).replace(/=([QRBN])/, (_, l: string) => `=${FIGURINE[l]}`);
}

export function sanFor(lang: Lang, san: string): string {
  return lang === "uz" ? figurineSan(san) : ruSan(san);
}

/** Запись хода на текущем языке. */
export function useSan(): (san: string) => string {
  const lang = useLang();
  return useCallback((san: string) => sanFor(lang, san), [lang]);
}

/** Русская запись внутри текста («Фxf7#», «Крg8») → фигурки, для узбекских текстов, собранных из шаблонов. */
export function ruMovesToFigurine(text: string): string {
  const map: Record<string, string> = { Кр: "♔", Ф: "♕", Л: "♖", С: "♗", К: "♘" };
  return text.replace(/(?<![А-Яа-яЁё])(Кр|Ф|Л|С|К)(?=x?[a-h][1-8])/g, (m) => map[m]);
}
