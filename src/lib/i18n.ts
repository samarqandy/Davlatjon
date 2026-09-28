"use client";

/**
 * Два языка платформы: русский и узбекский (латиница). Язык хранится в настройках на этом устройстве.
 * Тексты интерфейса пишутся парами прямо в компоненте: t("Играть", "Oʻynash") — так перевод всегда рядом
 * со смыслом, а узбекский текст можно писать живым языком, а не дословно (правила — docs/uzbek-style.md).
 * Всё, что не зависит от React, — в src/lib/lang.ts (здесь оно тоже доступно).
 */
import { useCallback } from "react";
import { sanFor, type Both, type Lang, type T } from "./lang";
import { getState, updateSettings, useStore } from "./store";

export * from "./lang";

export function useLang(): Lang {
  return useStore((s) => (s.settings.lang === "uz" ? "uz" : "ru"));
}

export function currentLang(): Lang {
  return getState().settings.lang === "uz" ? "uz" : "ru";
}

export function setLang(lang: Lang) {
  updateSettings({ lang });
}

export function useT(): T {
  const lang = useLang();
  return useCallback((ru: string, uz: string) => (lang === "uz" ? uz : ru), [lang]);
}

export function useBoth<V>(both: Both<V>): V {
  return useLang() === "uz" ? both.uz : both.ru;
}

/** Запись хода на текущем языке. */
export function useSan(): (san: string) => string {
  const lang = useLang();
  return useCallback((san: string) => sanFor(lang, san), [lang]);
}
