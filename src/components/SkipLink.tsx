"use client";

import { useT } from "@/lib/i18n";

/** Первая ссылка на странице: с клавиатуры и экранного диктора можно сразу перейти к содержимому, минуя меню. */
export function SkipLink() {
  const t = useT();
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-xl bg-brand px-4 py-2 font-extrabold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
    >
      {t("Перейти к содержимому", "Asosiy qismga oʻtish")}
    </a>
  );
}
