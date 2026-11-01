/**
 * Весь шахматный контент одним объектом — на русском или на узбекском.
 * Узбекская версия собирается из русской и накладки src/content/chess/uz (см. src/content/localize.ts).
 */
import type { Lang } from "@/lib/lang";
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
import { ENDGAME_LESSONS, ENDGAME_MATES, ENDGAME_SCHOOL } from "./endgames";
import { FAMOUS_GAMES } from "./games";
import { CHESS_IMAGES, type ChessImage } from "./images";
import { CHESS_LEVELS, CHESS_SCHOOL, LEVEL_EXTRAS } from "./index";
import { OPENINGS, OPENING_CATEGORIES, OPENING_PRINCIPLES } from "./openings";
import { PUZZLES, PUZZLE_THEMES } from "./puzzles";
import { DIALOGUES, NEW_VIEWS, THOUGHTS } from "./insights";
import { DID_YOU_KNOW, DILARAM, PIECE_NAMES_RU, RIDDLES, SAGES, SECRETS, TURK_OPTIONS, TURK_REVEAL } from "./secrets";
import { COURSE_1, COURSE_1_LESSONS, COURSE_1_MODULES } from "./course";
import { TACTICS, TACTICS_SCHOOL } from "./tactics";
import { CHESS_TESTS } from "./tests";
import type { ChessExercise, ChessTactic } from "./types";
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
  thoughts: THOUGHTS,
  dialogues: DIALOGUES,
  newViews: NEW_VIEWS,
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
  endgameSchool: ENDGAME_SCHOOL,
  endgames: ENDGAME_LESSONS,
  endgameMates: ENDGAME_MATES,
  tactics: TACTICS,
  tacticsSchool: TACTICS_SCHOOL,
  tests: CHESS_TESTS,
  course1: COURSE_1,
  course1Modules: COURSE_1_MODULES,
  course1Lessons: COURSE_1_LESSONS,
};

export type ChessContent = typeof CHESS_RU;
/** Накладка по частям контента (сам объект целиком не заменяется). */
export type ChessContentUz = { readonly [K in keyof ChessContent]?: Uz<ChessContent[K]> };

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

/**
 * Уроки курса с готовым списком упражнений: сначала подключённые по id (refs) из уровней и тактики — на том же языке,
 * потом собственные упражнения урока. Неизвестный id — ошибка контента, её ловят тесты.
 */
export function courseLessons(content: ChessContent): (ChessTactic & { piece?: string })[] {
  const pool = new Map<string, ChessExercise>();
  for (const l of content.levels) for (const e of l.exercises) pool.set(e.id, e);
  for (const t of content.tactics) for (const e of t.exercises) pool.set(e.id, e);
  return content.course1Lessons.map(({ refs, ...lesson }) => ({
    ...lesson,
    exercises: [...refs.flatMap((id) => pool.get(id) ?? []), ...lesson.exercises],
  }));
}
