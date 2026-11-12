/**
 * Ход турнира: создание с жеребьёвкой стартовых номеров, следующий тур, результаты, выбывшие и опоздавшие.
 * Функции чистые: получают турнир и возвращают новый — хранение отдельно (store.ts).
 */
import { knockoutFirstRound, knockoutNextRound, knockoutRounds } from "./knockout";
import { roundRobinRounds } from "./roundRobin";
import { maxSwissRounds, pairSwissRound, recommendedSwissRounds, type SwissError } from "./swiss";
import type { Color, GameResult, TPlayer, Tournament, TournamentFormat } from "./types";
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
 * Результаты можно менять в любом туре круговой системы; в швейцарской и олимпийской — только в последнем
 * сведённом: от прежних туров уже зависит жеребьёвка следующих.
 */
export function canEditRound(t: Tournament, roundIndex: number): boolean {
  if (t.format === "roundRobin" || t.format === "doubleRoundRobin") return roundIndex < t.rounds.length;
  return roundIndex === t.rounds.length - 1;
}

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
