/**
 * Шахматная школа: шесть званий-уровней от Пешки до Короля.
 * Как и остальной контент — только данные; правила ходов проверяет chess.js.
 */

export type ChessLevelId = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

/** Фигура на доске: «wN» — белый конь, «bK» — чёрный король, «star» — звёздочка. */
export type BoardPiece = string;

/** Учебная доска в уроке. */
export interface ChessDemo {
  /** Позиция в записи FEN (доска 8 × 8). */
  fen: string;
  /** Подсвеченные клетки. */
  highlight?: string[];
  /** Стрелки «откуда → куда». */
  arrows?: [string, string][];
  /** Можно нажать на фигуру и увидеть, куда она ходит. */
  interactive?: boolean;
}

export interface ChessLessonCard {
  title: string;
  /** Абзацы с мини-разметкой: **жирный**, `математика`. */
  text: string[];
  demo?: ChessDemo;
}

export interface ChessTerm {
  term: string;
  text: string;
  /** Как это называется по-узбекски (для названий фигур). */
  uz?: string;
}

interface ExerciseBase {
  /** Стабильный идентификатор — по нему хранится прогресс. */
  id: string;
  title: string;
  prompt: string;
  /** Подсказка, если не получается. */
  hint: string;
  /** Объяснение после решения — и для родителя. */
  why: string;
}

export type ChessExercise =
  /** Найти клетки по названиям. */
  | (ExerciseBase & { kind: "squares"; targets: string[] })
  /** Отметить все клетки, куда может пойти фигура с клетки from. answer проверяется тестами через chess.js. */
  | (ExerciseBase & { kind: "moves"; fen: string; from: string; answer: string[] })
  /** Собрать звёздочки фигурой за наименьшее число ходов; blocks — свои пешки-преграды. */
  | (ExerciseBase & {
      kind: "stars";
      piece: "n" | "b" | "r" | "q" | "k";
      start: string;
      stars: string[];
      blocks?: string[];
      optimal: number;
    })
  /** Найти ход. goal: mate — любой мат, остальные — ход из solutions (запись «e2e4», «e7e8q»). */
  | (ExerciseBase & {
      kind: "move";
      fen: string;
      goal: "mate" | "capture" | "promote" | "fork" | "castle";
      solutions: string[];
    })
  /** Нажать на нужную клетку (фигуру или звёздочку). */
  | (ExerciseBase & { kind: "pick"; pieces: Record<string, BoardPiece>; answer: string[] })
  /** Вопросы с выбором ответа; к вопросу может прилагаться доска. */
  | (ExerciseBase & {
      kind: "quiz";
      questions: { text: string; fen?: string; options: string[]; correct: number }[];
    })
  /** Расставить size ферзей на доске size × size, чтобы они не били друг друга. */
  | (ExerciseBase & { kind: "queens"; size: number });

export interface ChessLegend {
  hook: string;
  title: string;
  story: string[];
  /** id картинки из images.ts. */
  image?: string;
  secret: string;
}

export interface ChessLevel {
  id: ChessLevelId;
  /** 1…6 */
  order: number;
  /** Фигура-символ уровня: «wP», «wN»… */
  piece: BoardPiece;
  /** Название по-русски: «Пешка». */
  name: string;
  /** Название по-узбекски: «piyoda». */
  uz: string;
  /** Тема уровня. */
  title: string;
  /** Чему научимся. */
  goal: string;
  /** Легенда уровня: вопрос-крючок, история с картинкой и «тайна», которая открывается в конце. */
  legend: ChessLegend;
  lesson: ChessLessonCard[];
  rules: string[];
  terms: ChessTerm[];
  facts: string[];
  exercises: ChessExercise[];
}
