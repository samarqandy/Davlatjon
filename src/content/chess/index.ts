import { bishop } from "./bishop";
import { king } from "./king";
import { knight } from "./knight";
import { pawn } from "./pawn";
import { queen } from "./queen";
import { rook } from "./rook";
import type { ChessExercise, ChessLevel, ChessLevelId } from "./types";

/** Шесть званий шахматной школы — от Пешки до Короля. */
export const CHESS_LEVELS: ChessLevel[] = [pawn, knight, bishop, rook, queen, king];

export const CHESS_SCHOOL = {
  title: "Шахматная школа",
  subtitle: "Шесть званий: от Пешки до Короля",
  about:
    "Каждый уровень — это урок, правила, словарик, интересные факты и упражнения на настоящей шахматной доске. Реши все упражнения уровня — и получи новое звание!",
};

export function getChessLevel(id: string): ChessLevel | undefined {
  return CHESS_LEVELS.find((l) => l.id === id);
}

export function chessLevelHref(id: ChessLevelId): string {
  return `/chess/${id}`;
}

export function allChessExercises(): { level: ChessLevel; exercise: ChessExercise }[] {
  return CHESS_LEVELS.flatMap((level) => level.exercises.map((exercise) => ({ level, exercise })));
}

/** Словарик шахматиста: все термины всех уровней. */
export function chessGlossary() {
  return CHESS_LEVELS.flatMap((level) => level.terms.map((t) => ({ ...t, level })));
}

export type { ChessExercise, ChessLevel, ChessLevelId } from "./types";
