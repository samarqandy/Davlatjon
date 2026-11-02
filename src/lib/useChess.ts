"use client";

import { chessImageIn, chessImagesIn } from "@/content/chess/imageLookup";
import type { ChessImage } from "@/content/chess/images";
import type { ChessPart } from "@/content/chess/parts/make";
import { useMemo } from "react";
import { personalize } from "./childName";
import { useLang, useNames } from "./i18n";

/**
 * Часть шахматного контента на языке интерфейса, с именем ребёнка в текстах.
 * Берём только нужную часть (src/content/chess/parts): страница не тянет в браузер весь контент школы.
 */
export function useChessPart<T extends object>(part: ChessPart<T>): T {
  const lang = useLang();
  const names = useNames();
  return useMemo(() => personalize(part.get(lang), lang, names), [part, lang, names]);
}

/** Картинка (или список картинок) с подписью на языке интерфейса. */
export function useChessImage(id: string | undefined): ChessImage | undefined {
  return chessImageIn(useLang(), id);
}

export function useChessImages(ids: string[] | undefined): ChessImage[] {
  return chessImagesIn(useLang(), ids);
}
