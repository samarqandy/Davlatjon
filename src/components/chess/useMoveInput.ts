"use client";

import { useCallback, useMemo, useState } from "react";
import type { IllegalReason } from "@/lib/chess";
import type { T } from "@/lib/lang";
import type { PromotionPiece, PromotionRequest } from "./ChessBoard";

/**
 * Выбор фигуры при превращении пешки. Запрос живёт, пока позиция та же:
 * позиция сменилась (ход робота, новая задача) — выбор закрывается сам.
 */
export function usePromotion(fen: string): {
  request: PromotionRequest | null;
  ask: (square: string, color: "w" | "b", then: (piece: PromotionPiece) => void) => void;
} {
  const [asked, setAsked] = useState<{
    fen: string;
    square: string;
    color: "w" | "b";
    then: (piece: PromotionPiece) => void;
  } | null>(null);
  const ask = useCallback(
    (square: string, color: "w" | "b", then: (piece: PromotionPiece) => void) => setAsked({ fen, square, color, then }),
    [fen],
  );
  const request = useMemo<PromotionRequest | null>(
    () =>
      asked && asked.fen === fen
        ? {
            square: asked.square,
            color: asked.color,
            onPick: (piece) => {
              setAsked(null);
              asked.then(piece);
            },
            onCancel: () => setAsked(null),
          }
        : null,
    [asked, fen],
  );
  return { request, ask };
}

/** Почему так ходить нельзя — простыми словами. */
export function illegalText(reason: IllegalReason, t: T): string {
  switch (reason) {
    case "in-check":
      return t("Твой король под шахом — сначала защити его!", "Shohing shax ostida — avval uni himoya qil!");
    case "pinned":
      return t(
        "Эта фигура закрывает короля: уйдёт — и король окажется под ударом.",
        "Bu figura shohni toʻsib turibdi: ketsa, shoh zarba ostida qoladi.",
      );
    case "king-attacked":
      return t("Туда королю нельзя: эта клетка под ударом.", "Shoh u yerga bora olmaydi: bu katak zarba ostida.");
  }
}
