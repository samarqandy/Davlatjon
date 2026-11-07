/**
 * Весь шахматный контент одним объектом — на русском или на узбекском (для сервера, печати и тестов).
 * В браузере компоненты берут только нужные части (src/content/chess/parts, хук useChessPart), чтобы
 * страница не грузила весь контент. Узбекская версия собирается из русской и накладки src/content/chess/uz.
 */
import type { Lang } from "@/lib/lang";
import type { Uz } from "../localize";
import { COURSE_PART } from "./parts/course";
import { COURSE2_PART } from "./parts/course2";
import { COURSE3_PART } from "./parts/course3";
import { COURSE4_PART } from "./parts/course4";
import { DID_YOU_KNOW_PART } from "./parts/didYouKnow";
import { ENCYCLOPEDIA_PART } from "./parts/encyclopedia";
import { ENDGAME_PART } from "./parts/endgames";
import { GAME_PART } from "./parts/games";
import { IMAGE_PART } from "./parts/images";
import { INSIGHT_PART } from "./parts/insights";
import { LEVELS } from "./parts/levels";
import { OPENING_PART } from "./parts/openings";
import { PUZZLE_PART } from "./parts/puzzles";
import { SAGE_PART } from "./parts/sages";
import { SECRET_PART } from "./parts/secrets";
import { TACTIC_PART } from "./parts/tactics";
import { TEST_PART } from "./parts/tests";

export { courseLessons } from "./courseLessons";
export { chessImageIn, chessImagesIn } from "./imageLookup";

/** Все части по порядку: из них собираются и CHESS_RU, и узбекская версия, и накладка CHESS_UZ. */
export const CHESS_PARTS = [
  LEVELS,
  PUZZLE_PART,
  OPENING_PART,
  GAME_PART,
  SECRET_PART,
  SAGE_PART,
  INSIGHT_PART,
  DID_YOU_KNOW_PART,
  ENCYCLOPEDIA_PART,
  IMAGE_PART,
  ENDGAME_PART,
  TACTIC_PART,
  TEST_PART,
  COURSE_PART,
  COURSE2_PART,
  COURSE3_PART,
  COURSE4_PART,
] as const;

type PartValue<P> = P extends { ru: infer T } ? T : never;
type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

export type ChessContent = UnionToIntersection<PartValue<(typeof CHESS_PARTS)[number]>>;

export const CHESS_RU = Object.assign({}, ...CHESS_PARTS.map((p) => p.ru)) as ChessContent;

/** Накладка по частям контента (сам объект целиком не заменяется). */
export type ChessContentUz = { readonly [K in keyof ChessContent]?: Uz<ChessContent[K]> };

const cache: Partial<Record<Lang, ChessContent>> = { ru: CHESS_RU };

/** Шахматный контент на нужном языке (узбекский собирается один раз и запоминается). */
export function chessContent(lang: Lang): ChessContent {
  return (cache[lang] ??= Object.assign({}, ...CHESS_PARTS.map((p) => p.get(lang))) as ChessContent);
}
