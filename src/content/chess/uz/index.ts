/** Узбекская накладка на шахматный контент: собрана из файлов этой папки. */
import type { ChessContentUz } from "../content";
import {
  chessMathUz,
  fideNoteUz,
  pieceNamesTableUz,
  polgarNoteUz,
  recordsUz,
  timelineUz,
  uzbekChessUz,
  womenChampionsUz,
  worldChampionsUz,
} from "./encyclopedia";
import { gamesUz } from "./games";
import { imagesUz } from "./images";
import { bishopUz } from "./bishop";
import { kingUz } from "./king";
import { knightUz } from "./knight";
import { openingCategoriesUz, openingPrinciplesUz, openingsUz } from "./openings";
import { pawnUz } from "./pawn";
import { puzzlesUz, themesUz } from "./puzzles";
import { queenUz } from "./queen";
import { rookUz } from "./rook";
import { extrasUz, schoolUz } from "./school";
import {
  didYouKnowUz,
  dilaramUz,
  pieceNamesUz,
  riddlesUz,
  sagesUz,
  secretsUz,
  turkOptionsUz,
  turkRevealUz,
} from "./secrets";

export const CHESS_UZ: ChessContentUz = {
  levels: { pawn: pawnUz, knight: knightUz, bishop: bishopUz, rook: rookUz, queen: queenUz, king: kingUz },
  school: schoolUz,
  extras: extrasUz,
  puzzles: puzzlesUz,
  themes: themesUz,
  openings: openingsUz,
  openingCategories: openingCategoriesUz,
  openingPrinciples: openingPrinciplesUz,
  games: gamesUz,
  secrets: secretsUz,
  sages: sagesUz,
  riddles: riddlesUz,
  didYouKnow: didYouKnowUz,
  dilaram: dilaramUz,
  pieceNames: pieceNamesUz,
  turkOptions: turkOptionsUz,
  turkReveal: turkRevealUz || undefined,
  timeline: timelineUz,
  worldChampions: worldChampionsUz,
  womenChampions: womenChampionsUz,
  fideNote: fideNoteUz || undefined,
  polgarNote: polgarNoteUz || undefined,
  pieceNamesTable: pieceNamesTableUz,
  records: recordsUz,
  chessMath: chessMathUz,
  uzbekChess: uzbekChessUz,
  images: imagesUz,
};
