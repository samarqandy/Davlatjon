import { CHESS_LEVELS, CHESS_SCHOOL, LEVEL_EXTRAS } from "../index";
import { bishopUz } from "../uz/bishop";
import { kingUz } from "../uz/king";
import { knightUz } from "../uz/knight";
import { pawnUz } from "../uz/pawn";
import { queenUz } from "../uz/queen";
import { rookUz } from "../uz/rook";
import { extrasUz, schoolUz } from "../uz/school";
import { chessPart } from "./make";

/** Уровни школы (фигуры), шапка школы и дополнения к уровням. */
export const LEVELS = chessPart(
  { levels: CHESS_LEVELS, school: CHESS_SCHOOL, extras: LEVEL_EXTRAS },
  {
    levels: { pawn: pawnUz, knight: knightUz, bishop: bishopUz, rook: rookUz, queen: queenUz, king: kingUz },
    school: schoolUz,
    extras: extrasUz,
  },
);
