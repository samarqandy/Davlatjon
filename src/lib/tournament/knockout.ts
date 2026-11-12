/**
 * Олимпийская система (на выбывание). Сетка по стартовым номерам: первый и второй номера могут встретиться
 * только в финале, сильнейшие получают свободный первый тур, если участников не степень двойки.
 */
import type { TGame, TRound, Tournament } from "./types";
import { loserOf, roundDone, winnerOf } from "./types";

/** Порядок стартовых номеров в сетке размера size (степень двойки): 1–8, 4–5, 3–6, 2–7 для восьми. */
export function bracketOrder(size: number): number[] {
  let order = [1];
  while (order.length < size) {
    const next = order.length * 2 + 1;
    order = order.flatMap((s) => [s, next - s]);
  }
  return order;
}

export function bracketSize(players: number): number {
  let size = 1;
  while (size < players) size *= 2;
  return size;
}

/** Сколько туров до победителя. */
export function knockoutRounds(players: number): number {
  return Math.max(1, Math.log2(bracketSize(players)));
}

/** Первый тур: ids[i] — участник со стартовым номером i + 1. Белые — у старшего номера пары. */
export function knockoutFirstRound(ids: readonly string[]): TRound {
  const order = bracketOrder(bracketSize(ids.length));
  const games: TGame[] = [];
  for (let i = 0; i < order.length; i += 2) {
    const [a, b] = [order[i], order[i + 1]].sort((x, y) => x - y);
    games.push({ white: ids[a - 1], black: b <= ids.length ? ids[b - 1] : null });
  }
  return { games };
}

/** Партии сетки без матча за третье место (он всегда последний в финальном туре). */
export function bracketGames(t: Tournament, roundIndex: number): TGame[] {
  const games = t.rounds[roundIndex]?.games ?? [];
  const isFinalRound = roundIndex === t.totalRounds - 1;
  return isFinalRound && games.length > 1 ? games.slice(0, 1) : games;
}

/**
 * Следующий тур: победители идут дальше по сетке. Цвет: белыми играет тот, кто меньше играл белыми;
 * при равенстве — старший стартовый номер. В финальном туре, если выбрано, добавляется матч за третье место.
 */
export function knockoutNextRound(t: Tournament): TRound | null {
  const last = t.rounds[t.rounds.length - 1];
  if (!last || !roundDone(last) || t.rounds.length >= t.totalRounds) return null;
  const seed = new Map(t.players.map((p) => [p.id, p.seed]));
  const whites = new Map<string, number>();
  for (const r of t.rounds)
    for (const g of r.games) if (g.black !== null) whites.set(g.white, (whites.get(g.white) ?? 0) + 1);
  const game = (a: string, b: string): TGame => {
    const wa = whites.get(a) ?? 0;
    const wb = whites.get(b) ?? 0;
    const aWhite = wa !== wb ? wa < wb : seed.get(a)! < seed.get(b)!;
    return aWhite ? { white: a, black: b } : { white: b, black: a };
  };
  const prev = bracketGames(t, t.rounds.length - 1);
  const winners = prev.map(winnerOf);
  if (winners.some((w) => w === null)) return null;
  const games: TGame[] = [];
  for (let i = 0; i < winners.length; i += 2) games.push(game(winners[i]!, winners[i + 1]!));
  const nextIsFinal = t.rounds.length === t.totalRounds - 1;
  if (nextIsFinal && t.thirdPlace) {
    const losers = prev.map(loserOf).filter((x): x is string => x !== null);
    if (losers.length === 2) games.push(game(losers[0], losers[1]));
  }
  return { games };
}

export interface KnockoutPlaces {
  first: string | null;
  second: string | null;
  /** Третье место: победитель матча за третье место или оба проигравших в полуфинале. */
  third: string[];
}

export function knockoutPlaces(t: Tournament): KnockoutPlaces {
  const finalRound = t.rounds[t.totalRounds - 1];
  const final = finalRound?.games[0];
  const first = final ? winnerOf(final) : null;
  const second = final && first ? loserOf(final) : null;
  let third: string[] = [];
  if (first) {
    const small = finalRound.games[1];
    if (small) {
      const w = winnerOf(small);
      third = w ? [w] : [];
    } else if (t.totalRounds >= 2) {
      third = bracketGames(t, t.totalRounds - 2)
        .map(loserOf)
        .filter((x): x is string => x !== null);
    }
  }
  return { first, second, third };
}
