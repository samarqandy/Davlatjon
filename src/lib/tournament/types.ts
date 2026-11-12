/**
 * Турнир: участники, туры, результаты. Всё хранится в браузере организатора (см. store.ts) — имена детей
 * на сервер не уходят. Правила жеребьёвки — по Справочнику ФИДЕ (см. docs/TOURNAMENTS.md).
 */

/** Системы: круговая (в один и в два круга), швейцарская, олимпийская (на выбывание). */
export type TournamentFormat = "roundRobin" | "doubleRoundRobin" | "swiss" | "knockout";

/** «+-» и «-+» — победа и поражение без игры (соперник не явился). */
export type GameResult = "1-0" | "0-1" | "1/2" | "+-" | "-+";

export type Color = "w" | "b";

export interface TPlayer {
  id: string;
  name: string;
  rating?: number;
  /** Стартовый номер, с единицы: по нему идут таблицы Бергера, сетка и порядок при равных очках. */
  seed: number;
  /** Швейцарская: выбыл после тура с этим номером — в следующих турах пару не получает. */
  withdrawnAfter?: number;
  /** Швейцарская: вступил в турнир с этого тура (по умолчанию — с первого). */
  joinedRound?: number;
}

/** Партия тура. black: null — участник свободен от игры (в швейцарской системе это очко без игры). */
export interface TGame {
  white: string;
  black: string | null;
  result?: GameResult;
}

/** Что пришлось нарушить, чтобы провести жеребьёвку тура: организатор должен это видеть. */
export type PairingNote = "color" | "repeatBye";

export interface TRound {
  games: TGame[];
  notes?: PairingNote[];
}

export interface Tournament {
  version: 1;
  id: string;
  name: string;
  format: TournamentFormat;
  createdAt: number;
  players: TPlayer[];
  /** Круговая — все туры сразу; швейцарская и олимпийская — по одному, после результатов предыдущего. */
  rounds: TRound[];
  /** Сколько туров объявлено (швейцарская — выбирает организатор, остальные — считаются сами). */
  totalRounds: number;
  /** Швейцарская: цвет, выпавший по жребию первому номеру в первом туре. */
  initialColor: Color;
  /** Олимпийская: играть ли матч за третье место. */
  thirdPlace?: boolean;
}

export const FORMAT_LIMITS: Record<TournamentFormat, { min: number; max: number }> = {
  roundRobin: { min: 3, max: 24 },
  doubleRoundRobin: { min: 3, max: 12 },
  swiss: { min: 4, max: 150 },
  knockout: { min: 2, max: 64 },
};

export const isBye = (g: TGame): g is TGame & { black: null } => g.black === null;

/** Победитель партии (для сетки): у свободного от игры — он сам; без результата и при ничьей — null. */
export function winnerOf(g: TGame): string | null {
  if (g.black === null) return g.white;
  if (g.result === "1-0" || g.result === "+-") return g.white;
  if (g.result === "0-1" || g.result === "-+") return g.black;
  return null;
}

export function loserOf(g: TGame): string | null {
  if (g.black === null) return null;
  if (g.result === "1-0" || g.result === "+-") return g.black;
  if (g.result === "0-1" || g.result === "-+") return g.white;
  return null;
}

/** Очки участника за партию; undefined — результата ещё нет. */
export function pointsIn(g: TGame, playerId: string, byePoints: number): number | undefined {
  if (g.black === null) return g.white === playerId ? byePoints : undefined;
  if (!g.result) return undefined;
  const white = g.white === playerId;
  if (g.result === "1/2") return 0.5;
  const whiteWon = g.result === "1-0" || g.result === "+-";
  return white === whiteWon ? 1 : 0;
}

export const isForfeit = (g: TGame) => g.result === "+-" || g.result === "-+";

/** Тур закончен: у всех партий есть результат. */
export const roundDone = (r: TRound) => r.games.every((g) => g.black === null || !!g.result);
