"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useT } from "@/lib/i18n";
import { updateSettings, useHydrated, useStore } from "@/lib/store";

/** Тему сменили — html[data-theme] обновляется сразу (до отрисовки его ставит скрипт в <head>). Цвета — в globals.css. */
export function ThemeSync() {
  const dark = useStore((s) => s.settings.theme === "dark");
  useEffect(() => {
    const h = document.documentElement;
    if (dark) h.dataset.theme = "dark";
    else delete h.dataset.theme;
  }, [dark]);
  return null;
}

/** Кнопка в шапке: светлая или тёмная тема. Настройка хранится на устройстве вместе с остальными. */
export function ThemeToggle() {
  const t = useT();
  const hydrated = useHydrated();
  const dark = useStore((s) => s.settings.theme === "dark") && hydrated;
  const Icon = dark ? Sun : Moon;
  return (
    <button
      type="button"
      data-theme-toggle
      aria-pressed={dark}
      aria-label={t("Тёмная тема", "Tungi mavzu")}
      title={t("Тёмная тема", "Tungi mavzu")}
      onClick={() => updateSettings({ theme: dark ? undefined : "dark" })}
      className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-muted transition hover:bg-black/5 hover:text-ink"
    >
      <Icon aria-hidden className="h-5 w-5" strokeWidth={2.25} />
    </button>
  );
}
