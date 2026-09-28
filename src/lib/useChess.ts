"use client";

import { chessContent, chessImageIn, chessImagesIn, type ChessContent } from "@/content/chess/content";
import type { ChessImage } from "@/content/chess/images";
import { useLang } from "./i18n";

/** Шахматный контент на языке интерфейса: уровни, задачи, дебюты, партии, тайны, энциклопедия, картинки. */
export function useChess(): ChessContent {
  return chessContent(useLang());
}

/** Картинка (или список картинок) с подписью на языке интерфейса. */
export function useChessImage(id: string | undefined): ChessImage | undefined {
  return chessImageIn(useLang(), id);
}

export function useChessImages(ids: string[] | undefined): ChessImage[] {
  return chessImagesIn(useLang(), ids);
}
