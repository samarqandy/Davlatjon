import type { ChessLevelId } from "./types";

/**
 * Упражнения шести званий — только id, без уроков и позиций: опыту, заданию дня и главной странице нужен
 * лишь счёт решённого, а сами уровни весят десятки килобайт. Совпадение с уровнями проверяет
 * tests/counts.test.ts.
 */
export const LEVEL_EXERCISE_IDS: Record<ChessLevelId, readonly string[]> = {
  pawn: [
    "pawn-squares",
    "pawn-board-quiz",
    "pawn-moves",
    "pawn-blocked",
    "pawn-capture",
    "pawn-promotion",
    "pawn-rules-quiz",
  ],
  knight: [
    "knight-moves",
    "knight-corner",
    "knight-jump",
    "knight-stars",
    "knight-journey",
    "knight-fork",
    "knight-quiz",
  ],
  bishop: [
    "bishop-moves",
    "bishop-blocked",
    "bishop-stars",
    "bishop-unreachable",
    "bishop-detour",
    "bishop-free-piece",
    "bishop-quiz",
  ],
  rook: ["rook-moves", "rook-blocked", "rook-stars", "rook-maze", "rook-hunt", "rook-quiz"],
  queen: [
    "queen-quiz",
    "queen-moves",
    "queen-stars",
    "queen-eight",
    "queen-best-capture",
    "queen-fork",
    "queen-values",
  ],
  king: [
    "king-moves",
    "king-who-checks",
    "king-escape",
    "king-mate-rank",
    "king-mate-queen",
    "king-smothered",
    "king-ladder",
    "king-mate-or-stalemate",
    "king-castle",
  ],
};

/** Адрес страницы звания. */
export function chessLevelHref(id: ChessLevelId): string {
  return `/chess/${id}`;
}
