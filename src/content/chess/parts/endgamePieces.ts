import { ENDGAME_PIECES, ENDGAME_PIECES_SCHOOL } from "../endgamePieces";
import { endgamePiecesSchoolUz, endgamePiecesUz } from "../uz/endgamePieces";
import { chessPart } from "./make";

/** Школа эндшпиля, часть 2: ладья, ферзь и слон. */
export const ENDGAME_PIECES_PART = chessPart(
  { endgamePiecesSchool: ENDGAME_PIECES_SCHOOL, endgamePieces: ENDGAME_PIECES },
  { endgamePiecesSchool: endgamePiecesSchoolUz, endgamePieces: endgamePiecesUz },
);
