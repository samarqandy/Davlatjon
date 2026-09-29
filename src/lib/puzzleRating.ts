/**
 * Скрытый рейтинг задач — по формулам Глико, как на Lichess, только проще: рейтинг задачи считаем
 * точным (у задач Lichess он устоялся на тысячах решений). Нужен он не для таблицы рекордов,
 * а чтобы подбирать задачи «по силам»: ребёнку до 10 лет показываем только звёзды, а число видят старшие и родители.
 */

export interface PuzzleRating {
  /** Рейтинг. */
  r: number;
  /** Насколько он ещё неточен: сначала большой — рейтинг быстро находит свой уровень, потом меньше. */
  rd: number;
  /** Сколько задач учтено. */
  n: number;
  /** Когда обновлялся (для объединения устройств). */
  at: number;
}

export type PuzzleLevel = "easy" | "normal" | "hard";

export const RATING_MIN = 200;
export const RATING_MAX = 2800;
const START_RD = 300;
const MIN_RD = 60;
const PUZZLE_RD = 80;

/** Насколько задачи легче или труднее своего рейтинга на каждом уровне сложности. */
export const LEVEL_OFFSET: Record<PuzzleLevel, number> = { easy: -200, normal: 0, hard: 200 };

/** С чего начать: по возрасту (6 лет — 500, 12 и старше — 1000); без возраста — 600. */
export function startRating(age: number | undefined, now = Date.now()): PuzzleRating {
  const byAge = [500, 550, 600, 700, 800, 900, 1000];
  const r = age ? byAge[Math.min(Math.max(age - 6, 0), byAge.length - 1)] : 600;
  return { r, rd: START_RD, n: 0, at: now };
}

const Q = Math.log(10) / 400;
const g = (rd: number) => 1 / Math.sqrt(1 + (3 * Q * Q * rd * rd) / (Math.PI * Math.PI));

/** Новый рейтинг после задачи: win — решена с первой попытки, без ошибок и подсказок. */
export function ratePuzzle(me: PuzzleRating, puzzle: number, win: boolean, now = Date.now()): PuzzleRating {
  const gj = g(PUZZLE_RD);
  const expected = 1 / (1 + Math.pow(10, (-gj * (me.r - puzzle)) / 400));
  const d2 = 1 / (Q * Q * gj * gj * expected * (1 - expected));
  const inv = 1 / (me.rd * me.rd) + 1 / d2;
  const r = me.r + (Q / inv) * gj * ((win ? 1 : 0) - expected);
  return {
    r: Math.round(Math.min(RATING_MAX, Math.max(RATING_MIN, r))),
    rd: Math.max(MIN_RD, Math.round(Math.sqrt(1 / inv))),
    n: me.n + 1,
    at: now,
  };
}

/** Какой рейтинг задач искать на выбранном уровне сложности. */
export function targetRating(me: PuzzleRating, level: PuzzleLevel = "normal"): number {
  return me.r + LEVEL_OFFSET[level];
}

/** Звёзды по рейтингу: 1 — до 700, 2 — до 1000, 3 — до 1300, 4 — до 1600, 5 — выше. */
export function starsFor(rating: number): 1 | 2 | 3 | 4 | 5 {
  return rating < 700 ? 1 : rating < 1000 ? 2 : rating < 1300 ? 3 : rating < 1600 ? 4 : 5;
}

/** Число рейтинга показываем с 10 лет; младшим — только звёзды. */
export function showsRatingNumber(age: number | undefined): boolean {
  return (age ?? 0) >= 10;
}
