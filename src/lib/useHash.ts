"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

/** Текущий #якорь адреса. На сервере — пустая строка. */
export function useHash(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
}

/**
 * Перейти к другому «экрану» страницы (#storm, #theme-fork, #open-italian…). Новый экран открывается с верха:
 * иначе ребёнок, нажавший кнопку в середине длинной страницы, попадал в середину нового экрана — без заголовка
 * и кнопки «Назад». Для вкладок и шагов, где положение на странице надо сохранить, — keepScroll.
 * Кнопка «Назад» браузера сюда не попадает: она сама возвращает положение списка.
 */
export function setHash(hash: string, options: { keepScroll?: boolean } = {}) {
  if (window.location.hash === hash) return;
  window.location.hash = hash;
  // Если в документе есть элемент с таким id, браузер сам прокрутит к нему — не мешаем.
  const anchored = hash.length > 1 && !!document.getElementById(hash.slice(1));
  if (!options.keepScroll && !anchored) window.scrollTo({ top: 0, behavior: "instant" });
}

/** Заменить якорь, не добавляя шаг в историю: кнопка «Назад» не должна возвращать на промежуточный адрес. */
export function replaceHash(hash: string) {
  if (window.location.hash === hash) return;
  history.replaceState(history.state, "", hash);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}
