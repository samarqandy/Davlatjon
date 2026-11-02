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
} from "../encyclopedia";
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
} from "../uz/encyclopedia";
import { chessPart } from "./make";

/** Энциклопедия: история, чемпионы, рекорды, шахматы в Узбекистане. */
export const ENCYCLOPEDIA_PART = chessPart(
  {
    timeline: TIMELINE,
    worldChampions: WORLD_CHAMPIONS,
    womenChampions: WOMEN_CHAMPIONS,
    fideNote: FIDE_NOTE,
    polgarNote: POLGAR_NOTE,
    pieceNamesTable: PIECE_NAMES,
    records: RECORDS,
    chessMath: CHESS_MATH,
    uzbekChess: UZBEK_CHESS,
  },
  {
    timeline: timelineUz,
    worldChampions: worldChampionsUz,
    womenChampions: womenChampionsUz,
    fideNote: fideNoteUz || undefined,
    polgarNote: polgarNoteUz || undefined,
    pieceNamesTable: pieceNamesTableUz,
    records: recordsUz,
    chessMath: chessMathUz,
    uzbekChess: uzbekChessUz,
  },
);
