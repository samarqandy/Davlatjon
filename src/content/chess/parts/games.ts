import { FAMOUS_GAMES } from "../games";
import { gamesUz } from "../uz/games";
import { chessPart } from "./make";

/** Знаменитые партии. */
export const GAME_PART = chessPart({ games: FAMOUS_GAMES }, { games: gamesUz });
