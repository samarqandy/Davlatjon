"use client";

import { useEffect } from "react";
import { cn } from "@/components/ui";
import { watchTitle } from "@/lib/docTitle";
import { LANGS, setLang, useLang } from "@/lib/i18n";
import { useHydrated } from "@/lib/store";

/** Переключатель RU / UZ. */
export function LangSwitch({ className }: { className?: string }) {
  const lang = useLang();
  const hydrated = useHydrated();
  return (
    <div
      className={cn("flex rounded-xl bg-black/5 p-0.5 text-xs font-black", className)}
      role="group"
      aria-label="Язык · Til"
    >
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => setLang(l.id)}
          aria-pressed={hydrated && lang === l.id}
          title={l.label}
          className={cn(
            "min-h-8 rounded-[10px] px-2 transition",
            hydrated && lang === l.id ? "bg-white text-brand-dark shadow-sm" : "text-muted hover:text-ink",
          )}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

/** Держит <html lang> и заголовок вкладки в согласии с выбранным языком и снимает «ожидание» после загрузки. */
export function LangSync() {
  const lang = useLang();
  const hydrated = useHydrated();
  useEffect(() => {
    if (!hydrated) return;
    const h = document.documentElement;
    h.lang = lang;
    h.classList.remove("i18n-wait");
    return watchTitle(lang);
  }, [lang, hydrated]);
  return null;
}
