"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

/** Есть ли на странице элемент, к которому браузер прокрутил бы по такому якорю. */
function hasAnchor(hash: string): boolean {
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // Якорь с «%» не по правилам — ищем как есть.
  }
  return !!id && (!!document.getElementById(id) || document.getElementsByName(id).length > 0);
}

/**
 * Ссылка на «экран» другой страницы (`/chess/puzzles#mine`, `/chess/review#<партия>`) открывает его с верха.
 *
 * Next при адресе с якорем ищет элемент с таким id и, не найдя, страницу не прокручивает совсем
 * (`layout-router`: «A missing hash target is still a handled scroll intent»). Наши якоря — названия экранов,
 * а не id элементов, поэтому ребёнок, нажавший ссылку внизу длинной страницы, попадал в середину нового экрана:
 * без заголовка, с доской, наполовину ушедшей за край. Внутри одной страницы то же самое делает `setHash`.
 *
 * Кнопки «Назад» и «Вперёд» браузера не трогаем: там положение страницы возвращает сам браузер.
 */
export function ScreenTop() {
  const pathname = usePathname();
  const shown = useRef<string | null>(null);
  const traversing = useRef(false);

  useEffect(() => {
    const onHistory = () => {
      traversing.current = true;
    };
    // Любое новое действие — уже не «Назад»: следующий переход по ссылке снова открывается с верха.
    const onAction = () => {
      traversing.current = false;
    };
    window.addEventListener("popstate", onHistory);
    window.addEventListener("pointerdown", onAction, true);
    window.addEventListener("keydown", onAction, true);
    return () => {
      window.removeEventListener("popstate", onHistory);
      window.removeEventListener("pointerdown", onAction, true);
      window.removeEventListener("keydown", onAction, true);
    };
  }, []);

  // До отрисовки: экран не должен мелькнуть в прежнем положении.
  useLayoutEffect(() => {
    const first = shown.current === null;
    shown.current = pathname;
    // Первая загрузка: положение выбирает браузер (обновление страницы возвращает его сам).
    if (first) return;
    if (traversing.current) {
      traversing.current = false;
      return;
    }
    const { hash } = window.location;
    // Без якоря страницу поднимает сам Next; к настоящему якорю он же и прокручивает.
    if (hash.length < 2 || hasAnchor(hash)) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
