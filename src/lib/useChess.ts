"use client";

import { chessContent, chessImageIn, chessImagesIn, type ChessContent } from "@/content/chess/content";
import type { ChessImage } from "@/content/chess/images";
import { useMemo } from "react";
import { personalize } from "./childName";
import { useLang, useNames } from "./i18n";

/** Шахматный контент на языке интерфейса: уровни, задачи, дебюты, партии, тайны, энциклопедия, картинки. */
export function useChess(): ChessContent {
  const lang = useLang();
  const names = useNames();
  return useMemo(() => personalize(chessContent(lang), lang, names), [lang, names]);
}

/** Картинка (или список картинок) с подписью на языке интерфейса. */
export function useChessImage(id: string | undefined): ChessImage | undefined {
  return chessImageIn(useLang(), id);
}

export function useChessImages(ids: string[] | undefined): ChessImage[] {
  return chessImagesIn(useLang(), ids);
}
