/**
 * Ход турнира: создание с жеребьёвкой стартовых номеров, следующий тур, результаты, выбывшие и опоздавшие.
 * Функции чистые: получают турнир и возвращают новый — хранение отдельно (store.ts).
 */
import { knockoutFirstRound, knockoutNextRound, knockoutRounds } from "./knockout";
import { roundRobinRounds } from "./roundRobin";
import {
  colorsFor,
  maxSwissRounds,
  pairSwissRound,
  recommendedSwissRounds,
  roundIssues,
  type SwissError,
} from "./swiss";
import type { Color, GameResult, PairingNote, TGame, TPlayer, Tournament, TournamentFormat } from "./types";
import { FORMAT_LIMITS, roundDone } from "./types";

/** Как раздаются стартовые номера: жребий, по рейтингу (сильнейший — первый) или как в списке. */
export type Seeding = "lot" | "rating" | "list";

export interface NewTournament {
  name: string;
  format: TournamentFormat;
  players: { name: string; rating?: number }[];
  seeding: Seeding;
  /** Швейцарская: число туров; не задано — предложенное. */
  rounds?: number;
  thirdPlace?: boolean;
}

export type CreateError = "tooFew" | "tooMany";

/**
 * Список участников из текста: по одному в строке. Номер в начале («1. Али») отбрасывается,
 * число из трёх-четырёх цифр в конце строки («Али 1200») — рейтинг.
 */
export function parsePlayers(text: string): { name: string; rating?: number }[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^\s*\d{1,3}[.)]\s*/, "").trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(.*\S)[\s,;]+(\d{3,4})$/);
      return m ? { name: m[1].replace(/[,;]$/, "").trim(), rating: Number(m[2]) } : { name: line };
    });
}

/** Перемешать по жребию (Фишер — Йетс). */
export function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function createTournament(
  input: NewTournament,
  random: () => number = Math.random,
  now = Date.now(),
): Tournament | { error: CreateError } {
  const limits = FORMAT_LIMITS[input.format];
  const entered = input.players.map((p) => ({ ...p, name: p.name.trim() })).filter((p) => p.name);
  if (entered.length < limits.min) return { error: "tooFew" };
  if (entered.length > limits.max) return { error: "tooMany" };

  const ordered =
    input.seeding === "lot"
      ? shuffled(entered, random)
      : input.seeding === "rating"
        ? // Устойчивая сортировка: при равном рейтинге (и без рейтинга) порядок — как в списке.
          [...entered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        : entered;
  const stamp = now.toString(36);
  const players: TPlayer[] = ordered.map((p, i) => ({
    id: `${stamp}-${i + 1}`,
    name: p.name,
    ...(p.rating ? { rating: p.rating } : {}),
    seed: i + 1,
  }));
  const ids = players.map((p) => p.id);
  const n = players.length;
  const base = {
    version: 1 as const,
    id: `t${stamp}${Math.floor(random() * 36 ** 3).toString(36)}`,
    name: input.name.trim(),
    format: input.format,
    createdAt: now,
    players,
    initialColor: (random() < 0.5 ? "w" : "b") as Color,
  };

  if (input.format === "roundRobin" || input.format === "doubleRoundRobin") {
    const rounds = roundRobinRounds(ids, input.format === "doubleRoundRobin");
    return { ...base, rounds, totalRounds: rounds.length };
  }
  if (input.format === "knockout") {
    return {
      ...base,
      rounds: [knockoutFirstRound(ids)],
      totalRounds: knockoutRounds(n),
      thirdPlace: !!input.thirdPlace && n >= 4,
    };
  }
  const totalRounds = Math.min(maxSwissRounds(n), Math.max(1, Math.round(input.rounds ?? recommendedSwissRounds(n))));
  const draft: Tournament = { ...base, rounds: [], totalRounds };
  const first = pairSwissRound(draft);
  if ("error" in first) return { error: "tooFew" };
  return { ...draft, rounds: [first.round] };
}

/** Последний сведённый тур сыгран, и объявленные туры ещё не кончились. */
export function canPairNext(t: Tournament): boolean {
  if (t.format === "roundRobin" || t.format === "doubleRoundRobin") return false;
  const last = t.rounds[t.rounds.length - 1];
  return !!last && roundDone(last) && t.rounds.length < t.totalRounds;
}

export function isFinished(t: Tournament): boolean {
  return t.rounds.length >= t.totalRounds && t.rounds.every(roundDone);
}

export type PairError = SwissError | "notReady";

export function pairNextRound(t: Tournament): Tournament | { error: PairError } {
  if (!canPairNext(t)) return { error: "notReady" };
  if (t.format === "knockout") {
    const round = knockoutNextRound(t);
    return round ? { ...t, rounds: [...t.rounds, round] } : { error: "notReady" };
  }
  const next = pairSwissRound(t);
  return "error" in next ? next : { ...t, rounds: [...t.rounds, next.round] };
}

/**
 * В каком туре можно менять результаты. Круговая и швейцарская — в любом сведённом: исправленный результат
 * прошлого тура пересчитывает таблицу и учитывается в следующих жеребьёвках, а уже составленные пары остаются
 * (так поступает судья и по правилам ФИДЕ). Олимпийская — только в последнем: победитель уже играет дальше.
 */
export function canEditRound(t: Tournament, roundIndex: number): boolean {
  if (t.format === "knockout") return roundIndex === t.rounds.length - 1;
  return roundIndex >= 0 && roundIndex < t.rounds.length;
}

/** Тур, после которого уже проведена жеребьёвка следующего (швейцарская): результат в нём можно исправить, но не стереть. */
const isPastSwissRound = (t: Tournament, roundIndex: number) =>
  t.format === "swiss" && roundIndex < t.rounds.length - 1;

export function setResult(
  t: Tournament,
  roundIndex: number,
  board: number,
  result: GameResult | undefined,
): Tournament {
  const game = t.rounds[roundIndex]?.games[board];
  if (!game || game.black === null || !canEditRound(t, roundIndex)) return t;
  // На выбывание ничьей быть не может: кто-то должен пройти дальше.
  if (t.format === "knockout" && result === "1/2") return t;
  // Без результата прошлый тур оказался бы «несыгранным» при уже сведённом следующем.
  if (!result && isPastSwissRound(t, roundIndex)) return t;
  const rounds = t.rounds.map((round, r) =>
    r !== roundIndex
      ? round
      : {
          ...round,
          games: round.games.map((g, b) =>
            b !== board ? g : result ? { white: g.white, black: g.black, result } : { white: g.white, black: g.black },
          ),
        },
  );
  return { ...t, rounds };
}

/** Пары можно править руками в швейцарской — в последнем сведённом туре, пока он не сыгран. */
export function canEditPairs(t: Tournament): boolean {
  const last = t.rounds[t.rounds.length - 1];
  return t.format === "swiss" && !!last && !roundDone(last);
}

/** Тур после ручной правки: пометка «manual» и всё, что теперь идёт против правил жеребьёвки. */
function withManualRound(t: Tournament, roundIndex: number, games: TGame[]): Tournament {
  const draft = { ...t, rounds: t.rounds.map((round, r) => (r === roundIndex ? { games } : round)) };
  const issues = roundIssues(draft, roundIndex);
  const notes: PairingNote[] = ["manual", ...(issues.rematches.length ? (["rematch"] as const) : []), ...issues.notes];
  return { ...t, rounds: draft.rounds.map((round, r) => (r === roundIndex ? { games, notes } : round)) };
}

/**
 * Поменять двух участников местами в последнем туре (швейцарская): брат с сестрой, ученики одного тренера,
 * ошибка в списке. Партии с результатом не трогаем. Цвета в новых парах ставятся по правилам; двое из одной
 * пары просто меняются цветами. Свободный от игры тоже меняется — тогда свободным становится другой.
 */
export function swapPlayers(t: Tournament, a: string, b: string): Tournament {
  if (!canEditPairs(t) || a === b) return t;
  const roundIndex = t.rounds.length - 1;
  const games = t.rounds[roundIndex].games;
  const ia = games.findIndex((g) => g.white === a || g.black === a);
  const ib = games.findIndex((g) => g.white === b || g.black === b);
  if (ia < 0 || ib < 0 || games[ia].result || games[ib].result) return t;
  if (ia === ib) return swapColors(t, ia);
  const put = (g: TGame, from: string, to: string): TGame => ({
    white: g.white === from ? to : g.white,
    black: g.black === from ? to : g.black,
  });
  const next = games.map((g, i) => {
    const moved = i === ia ? put(g, a, b) : i === ib ? put(g, b, a) : g;
    if (moved === g || moved.black === null) return moved;
    const [white, black] = colorsFor(t, roundIndex, moved.white, moved.black);
    return { white, black };
  });
  return withManualRound(t, roundIndex, next);
}

/** Поменять цвета в паре последнего тура (швейцарская), пока у партии нет результата. */
export function swapColors(t: Tournament, board: number): Tournament {
  if (!canEditPairs(t)) return t;
  const roundIndex = t.rounds.length - 1;
  const games = t.rounds[roundIndex].games;
  const game = games[board];
  if (!game || game.black === null || game.result) return t;
  const next = games.map((g, i) => (i === board ? { white: game.black!, black: game.white } : g));
  return withManualRound(t, roundIndex, next);
}

/** Отменить жеребьёвку последнего тура (швейцарская, олимпийская), пока в нём нет результатов. */
export function canUndoRound(t: Tournament): boolean {
  if (t.format !== "swiss" && t.format !== "knockout") return false;
  const last = t.rounds[t.rounds.length - 1];
  return t.rounds.length > 1 && !!last && last.games.every((g) => !g.result);
}

export function undoRound(t: Tournament): Tournament {
  return canUndoRound(t) ? { ...t, rounds: t.rounds.slice(0, -1) } : t;
}

/** Швейцарская: участник выбыл — в следующих турах пару не получает. Повторный вызов возвращает его. */
export function toggleWithdrawn(t: Tournament, playerId: string): Tournament {
  if (t.format !== "swiss") return t;
  return {
    ...t,
    players: t.players.map((p) => {
      if (p.id !== playerId) return p;
      const { withdrawnAfter, ...rest } = p;
      return withdrawnAfter === undefined ? { ...rest, withdrawnAfter: t.rounds.length } : rest;
    }),
  };
}

/** Швейцарская: опоздавший вступает со следующего тура, пропущенные туры — без очков. */
export function addLatePlayer(t: Tournament, entry: { name: string; rating?: number }): Tournament {
  const name = entry.name.trim();
  if (t.format !== "swiss" || !name || t.rounds.length >= t.totalRounds) return t;
  if (t.players.length >= FORMAT_LIMITS.swiss.max) return t;
  const seed = Math.max(...t.players.map((p) => p.seed)) + 1;
  const player: TPlayer = {
    id: `${t.id}-late-${seed}`,
    name,
    ...(entry.rating ? { rating: entry.rating } : {}),
    seed,
    joinedRound: t.rounds.length + 1,
  };
  return { ...t, players: [...t.players, player] };
}

/** Исправить имя или рейтинг участника (опечатка). Стартовый номер и пары не меняются. */
export function updatePlayer(t: Tournament, playerId: string, entry: { name: string; rating?: number }): Tournament {
  const name = entry.name.trim().slice(0, 80);
  if (!name) return t;
  const rating = entry.rating && entry.rating > 0 ? Math.round(entry.rating) : undefined;
  return {
    ...t,
    players: t.players.map((p) => {
      if (p.id !== playerId) return p;
      const next: TPlayer = { ...p, name };
      if (rating) next.rating = rating;
      else delete next.rating;
      return next;
    }),
  };
}

/** Швейцарская: сколько туров ещё можно объявить и до скольких убавить. */
export function totalRoundsRange(t: Tournament): { min: number; max: number } {
  return { min: Math.max(1, t.rounds.length), max: Math.max(t.rounds.length, maxSwissRounds(t.players.length)) };
}

/** Швейцарская: изменить число туров по ходу турнира (пришло меньше участников, решили сыграть ещё тур). */
export function setTotalRounds(t: Tournament, total: number): Tournament {
  if (t.format !== "swiss") return t;
  const { min, max } = totalRoundsRange(t);
  const next = Math.min(max, Math.max(min, Math.round(total)));
  return next === t.totalRounds ? t : { ...t, totalRounds: next };
}
