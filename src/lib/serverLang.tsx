"use client";

/**
 * Язык, который знает сервер: страница собрана под /ru или /uz (proxy.ts выбирает по cookie «lang»).
 * На сервере и при гидратации useLang отдаёт его — HTML сразу на нужном языке, без скрытой страницы и подмены текста.
 */
import { createContext, type ReactNode } from "react";
import type { Lang } from "./lang";

export const ServerLangContext = createContext<Lang>("ru");

export function ServerLangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <ServerLangContext value={lang}>{children}</ServerLangContext>;
}
