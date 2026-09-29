"use client";

/**
 * Два языка платформы: русский и узбекский (латиница). Язык хранится в настройках на этом устройстве.
 * Тексты интерфейса пишутся парами прямо в компоненте: t("Играть", "Oʻynash") — так перевод всегда рядом
 * со смыслом, а узбекский текст можно писать живым языком, а не дословно (правила — docs/uzbek-style.md).
 * Всё, что не зависит от React, — в src/lib/lang.ts (здесь оно тоже доступно).
 */
import { useCallback, useMemo } from "react";
import { fillName, nameFor, namesFor, personalize, type Names } from "./childName";
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

/** Имя ребёнка на языке интерфейса (до загрузки прогресса — нейтральное «Друг» / «Doʻst»). */
export function useChildName(): string {
  const lang = useLang();
  return useStore((s) => nameFor(lang, s.settings));
}

/** Что подставлять вместо меток {name} и {child}. Строки — чтобы не пересоздавать объект при каждой отрисовке. */
export function useNames(): Names {
  const lang = useLang();
  const name = useStore((s) => namesFor(lang, s.settings).name);
  const child = useStore((s) => namesFor(lang, s.settings).child);
  return useMemo(() => ({ name, child }), [name, child]);
}

/** Пара текстов → текст на языке интерфейса; метки {name} и {child} заменяются именем ребёнка. */
export function useT(): T {
  const lang = useLang();
  const names = useNames();
  return useCallback((ru: string, uz: string) => fillName(lang === "uz" ? uz : ru, names), [lang, names]);
}

/** Данные на обоих языках → нужная версия, с именем ребёнка вместо меток. */
export function useBoth<V>(both: Both<V>): V {
  const lang = useLang();
  const names = useNames();
  return useMemo(() => personalize(lang === "uz" ? both.uz : both.ru, lang, names), [both, lang, names]);
}

/** Запись хода на текущем языке. */
export function useSan(): (san: string) => string {
  const lang = useLang();
  return useCallback((san: string) => sanFor(lang, san), [lang]);
}
