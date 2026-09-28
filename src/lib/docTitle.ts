"use client";

/**
 * Заголовок вкладки по-узбекски. Next.js пишет заголовок по-русски (метаданные собираются на сервере),
 * а здесь части заголовка между « · » переводятся на узбекский. Постоянные части — в словаре,
 * изменяемые (название дня, уровня, партии) страница сообщает сама через useTitleTranslation.
 */
import { useEffect } from "react";
import type { Lang } from "./lang";

const TITLE_UZ: Record<string, string> = {
  "Лаборатория Давлатжона": "Davlatjon laboratoriyasi",
  "Лаборатория Давлатжона — математика, логика, алгоритмы":
    "Davlatjon laboratoriyasi — matematika, mantiq, algoritmlar",
  Шахматы: "Shaxmat",
  "Шахматная школа": "Shaxmat maktabi",
  "Координаты и запись ходов": "Koordinatalar va yurishlar yozuvi",
  Энциклопедия: "Ensiklopediya",
  Дебюты: "Debyutlar",
  "Разбор партий": "Partiyalar tahlili",
  Играть: "Oʻynash",
  "Тайны и легенды": "Sirlar va afsonalar",
  Задачи: "Masalalar",
  "Дневник партий": "Partiyalar kundaligi",
  "Награды и календарь": "Mukofotlar va taqvim",
  "Задачи для печати": "Chop etish uchun masalalar",
  "Знаменитые партии": "Mashhur partiyalar",
  "Мои задачи": "Mening masalalarim",
  "Недельный обзор": "Haftalik sharh",
  Настройки: "Sozlamalar",
  "Шахматы — для родителей": "Shaxmat — ota-onalar uchun",
  "Методичка для родителей": "Ota-onalar uchun qoʻllanma",
  "Для родителей": "Ota-onalar uchun",
  "Уровень не найден": "Daraja topilmadi",
  "Партия не найдена": "Partiya topilmadi",
  "День не найден": "Kun topilmadi",
  "Страница не найдена": "Sahifa topilmadi",
  Печать: "Chop etish",
};

/** Части заголовка, которые знает только сама страница (название дня, партии), — страница сообщает их сюда. */
const dynamicTitles = new Map<string, string>();
const titleListeners = new Set<() => void>();

/** Страница с изменяемым заголовком сообщает его перевод: «День 3. Смотри внимательно» → «3-kun. Diqqat bilan qara». */
export function useTitleTranslation(ru: string, uz: string) {
  useEffect(() => {
    dynamicTitles.set(ru, uz);
    for (const l of titleListeners) l();
  }, [ru, uz]);
}

function translatePart(part: string): string {
  const known = TITLE_UZ[part] ?? dynamicTitles.get(part);
  if (known) return known;
  let m = part.match(/^Печать: неделя (\d+)$/);
  if (m) return `Chop etish: ${m[1]}-hafta`;
  m = part.match(/^Ответы: день (\d+)$/);
  if (m) return `Javoblar: ${m[1]}-kun`;
  m = part.match(/^Печать: (.+)$/);
  if (m) return `Chop etish: ${dynamicTitles.get(m[1]) ?? m[1]}`;
  return part;
}

export function translateTitle(title: string): string {
  return title
    .split(" · ")
    .map((p) => translatePart(p))
    .join(" · ");
}

export function watchTitle(lang: Lang): (() => void) | undefined {
  if (lang !== "uz") return undefined;
  let original = document.title;
  let applying = false;
  const apply = () => {
    if (applying) return;
    applying = true;
    const next = translateTitle(original);
    if (document.title !== next) document.title = next;
    applying = false;
  };
  const observer = new MutationObserver(() => {
    if (applying) return;
    // Новый заголовок от Next.js — запоминаем русский оригинал и переводим.
    if (document.title !== translateTitle(original)) original = document.title;
    apply();
  });
  observer.observe(document.head, { childList: true, subtree: true, characterData: true });
  titleListeners.add(apply);
  apply();
  return () => {
    observer.disconnect();
    titleListeners.delete(apply);
    document.title = original;
  };
}
