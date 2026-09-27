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

/** Что ещё открывается на каждом уровне: игра, задачи, дебюты, партии. */
export interface LevelExtras {
  /** Адрес режима игры, например «/chess/play#pawns-1-w». */
  play?: { href: string; label: string; about: string };
  puzzles?: { theme: string; label: string }[];
  openings?: string[];
  games?: string[];
}

export const LEVEL_EXTRAS: Record<ChessLevelId, LevelExtras> = {
  pawn: {
    play: {
      href: "/chess/play#pawns-1-w",
      label: "Пешечный бой",
      about: "Только пешки: кто первым доведёт пешку до края.",
    },
    puzzles: [{ theme: "hanging", label: "Бесплатная фигура" }],
    openings: ["scholar-defense"],
    games: ["fools-mate", "scholars-mate"],
  },
  knight: {
    play: {
      href: "/chess/play#robot-1-w",
      label: "Робот «Пешка»",
      about: "Первая настоящая партия с самым слабым роботом.",
    },
    puzzles: [{ theme: "fork", label: "Вилка" }],
    openings: ["four-knights", "italian"],
    games: ["opera"],
  },
  bishop: {
    play: { href: "/chess/play#robot-2-w", label: "Робот «Конь»", about: "Робот уже берёт всё, что плохо стоит." },
    puzzles: [
      { theme: "pin", label: "Связка" },
      { theme: "skewer", label: "Сквозной удар" },
    ],
    openings: ["spanish", "scotch"],
    games: ["legal"],
  },
  rook: {
    play: {
      href: "/chess/play#endgame-krr",
      label: "Мат двумя ладьями",
      about: "Лестница: две ладьи загоняют короля на край.",
    },
    puzzles: [{ theme: "mate1", label: "Мат в 1 ход" }],
    openings: ["queens-gambit", "london"],
    games: ["reti-tartakower"],
  },
  queen: {
    play: {
      href: "/chess/play#endgame-kq",
      label: "Мат ферзём",
      about: "Король и ферзь против короля — главный приём.",
    },
    puzzles: [
      { theme: "discovered", label: "Открытый шах" },
      { theme: "stalemate", label: "Мат, а не пат" },
    ],
    openings: ["sicilian", "evans", "kings-gambit"],
    games: ["immortal", "evergreen"],
  },
  king: {
    play: {
      href: "/chess/play#robot-3-w",
      label: "Робот «Слон»",
      about: "Серьёзный соперник: считает на два хода вперёд.",
    },
    puzzles: [
      { theme: "mate2", label: "Мат в 2 хода" },
      { theme: "mate3", label: "Мат в 3 хода" },
    ],
    openings: ["caro-kann", "kings-indian"],
    games: ["game-of-the-century"],
  },
};

export type { ChessExercise, ChessLevel, ChessLevelId } from "./types";
