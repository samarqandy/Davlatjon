/**
 * Весь шахматный контент одним объектом — на русском или на узбекском.
 * Узбекская версия собирается из русской и накладки src/content/chess/uz (см. src/content/localize.ts).
 */
import type { Lang } from "@/lib/i18n";
import { overlay, type Uz } from "../localize";
import {
  CHESS_MATH,
  FIDE_NOTE,
  PIECE_NAMES,
  POLGAR_NOTE,
  RECORDS,
  TIMELINE,
  UZBEK_CHESS,
  WOMEN_CHAMPIONS,
  WORLD_CHAMPIONS,
} from "./encyclopedia";
import { FAMOUS_GAMES } from "./games";
import { CHESS_IMAGES, type ChessImage } from "./images";
import { CHESS_LEVELS, CHESS_SCHOOL, LEVEL_EXTRAS } from "./index";
import { OPENINGS, OPENING_CATEGORIES, OPENING_PRINCIPLES } from "./openings";
import { PUZZLES, PUZZLE_THEMES } from "./puzzles";
import { DID_YOU_KNOW, DILARAM, PIECE_NAMES_RU, RIDDLES, SAGES, SECRETS, TURK_OPTIONS, TURK_REVEAL } from "./secrets";
import { CHESS_UZ } from "./uz";

export const CHESS_RU = {
  levels: CHESS_LEVELS,
  school: CHESS_SCHOOL,
  extras: LEVEL_EXTRAS,
  puzzles: PUZZLES,
  themes: PUZZLE_THEMES,
  openings: OPENINGS,
  openingCategories: OPENING_CATEGORIES,
  openingPrinciples: OPENING_PRINCIPLES,
  games: FAMOUS_GAMES,
  secrets: SECRETS,
  sages: SAGES,
  riddles: RIDDLES,
  didYouKnow: DID_YOU_KNOW,
  dilaram: DILARAM,
  pieceNames: PIECE_NAMES_RU,
  turkOptions: TURK_OPTIONS,
  turkReveal: TURK_REVEAL,
  timeline: TIMELINE,
  worldChampions: WORLD_CHAMPIONS,
  womenChampions: WOMEN_CHAMPIONS,
  fideNote: FIDE_NOTE,
  polgarNote: POLGAR_NOTE,
  pieceNamesTable: PIECE_NAMES,
  records: RECORDS,
  chessMath: CHESS_MATH,
  uzbekChess: UZBEK_CHESS,
  images: CHESS_IMAGES,
};

export type ChessContent = typeof CHESS_RU;
export type ChessContentUz = Uz<ChessContent>;

const cache: Partial<Record<Lang, ChessContent>> = { ru: CHESS_RU };

/** Шахматный контент на нужном языке (узбекский собирается один раз и запоминается). */
export function chessContent(lang: Lang): ChessContent {
  return (cache[lang] ??= overlay(CHESS_RU, CHESS_UZ));
}

const imageMaps: Partial<Record<Lang, Map<string, ChessImage>>> = {};

/** Картинка с подписью на нужном языке. */
export function chessImageIn(lang: Lang, id: string | undefined): ChessImage | undefined {
  if (!id) return undefined;
  const map = (imageMaps[lang] ??= new Map(chessContent(lang).images.map((i) => [i.id, i])));
  return map.get(id);
}

/** Картинки по списку id — те, что есть на диске, с подписями на нужном языке. */
export function chessImagesIn(lang: Lang, ids: string[] | undefined): ChessImage[] {
  return (ids ?? []).map((id) => chessImageIn(lang, id)).filter((i): i is ChessImage => !!i);
}
