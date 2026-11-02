import { PUZZLES, PUZZLE_THEMES } from "../puzzles";
import { puzzlesUz, themesUz } from "../uz/puzzles";
import { chessPart } from "./make";

/** Задачи школы и их темы. */
export const PUZZLE_PART = chessPart(
  { puzzles: PUZZLES, themes: PUZZLE_THEMES },
  { puzzles: puzzlesUz, themes: themesUz },
);
