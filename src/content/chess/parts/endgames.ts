import { ENDGAME_LESSONS, ENDGAME_MATES, ENDGAME_SCHOOL } from "../endgames";
import { endgameMatesUz, endgameSchoolUz, endgamesUz } from "../uz/endgames";
import { chessPart } from "./make";

/** Школа эндшпиля. */
export const ENDGAME_PART = chessPart(
  { endgameSchool: ENDGAME_SCHOOL, endgames: ENDGAME_LESSONS, endgameMates: ENDGAME_MATES },
  { endgameSchool: endgameSchoolUz, endgames: endgamesUz, endgameMates: endgameMatesUz },
);
