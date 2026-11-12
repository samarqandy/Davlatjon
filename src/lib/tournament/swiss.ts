/**
 * Швейцарская система. Основные правила ФИДЕ (C.04.1) соблюдаются всегда, пока это возможно:
 * двое не играют друг с другом дважды; свободным от игры (очко без игры) участник бывает один раз;
 * никто не играет одним цветом три раза подряд, и разница «белые − чёрные» не выходит за ±2.
 * Порядок пар — как в голландской системе (C.04.3): участники с равными очками делятся пополам,
 * верхняя половина играет с нижней; кому пары не хватило, спускается к следующей группе очков.
 *
 * Это не сертифицированная ФИДЕ программа: полный перебор критериев голландской системы (история «спусков»,
 * правила для лидеров последнего тура) здесь не делается. Для школьного и клубного турнира этого достаточно,
 * для рейтингового — нужна программа из списка ФИДЕ.
 *
 * Тупиков нет: перед тем как поставить пару, проверяем паросочетанием (matching.ts), что остальных
 * участников ещё можно разбить на пары.
 */
import { maxMatching } from "./matching";
import type { Color, PairingNote, TGame, TPlayer, TRound, Tournament } from "./types";
import { isForfeit, pointsIn } from "./types";

/** Очко за свободный тур (C.04.1, п. 3: столько же, сколько за победу). */
export const BYE_POINTS = 1;

interface Seat {
  id: string;
  seed: number;
  score: number;
  /** С кем уже играл (или был назначен играть — неявка тоже считается встречей). */
  met: Set<string>;
  /** Цвета сыгранных партий по порядку. */
  colors: Color[];
  /** Уже получал очко без игры (свободный тур или неявка соперника) — свободным больше не бывает. */
  hadFreePoint: boolean;
}

/** Участники, которых нужно свести в туре с номером round (с единицы). */
export function activePlayers(t: Tournament, round: number): TPlayer[] {
  return t.players.filter((p) => (p.joinedRound ?? 1) <= round && (p.withdrawnAfter ?? Infinity) >= round);
}

function seats(t: Tournament, round: number): Seat[] {
  const byId = new Map<string, Seat>();
  for (const p of activePlayers(t, round))
    byId.set(p.id, { id: p.id, seed: p.seed, score: 0, met: new Set(), colors: [], hadFreePoint: false });
  for (const r of t.rounds)
    for (const g of r.games) {
      const w = byId.get(g.white);
      const b = g.black === null ? undefined : byId.get(g.black);
      if (g.black === null) {
        if (w) {
          w.score += BYE_POINTS;
          w.hadFreePoint = true;
        }
        continue;
      }
      w?.met.add(g.black);
      b?.met.add(g.white);
      if (!g.result) continue;
      if (w) w.score += pointsIn(g, g.white, BYE_POINTS) ?? 0;
      if (b) b.score += pointsIn(g, g.black, BYE_POINTS) ?? 0;
      if (isForfeit(g)) {
        // Победа без игры: цвета нет, а очко без игры уже получено.
        const winner = g.result === "+-" ? w : b;
        if (winner) winner.hadFreePoint = true;
      } else {
        w?.colors.push("w");
        b?.colors.push("b");
      }
    }
  return [...byId.values()].sort(byRank);
}

/** Порядок участников: больше очков — выше, при равных — меньший стартовый номер. */
const byRank = (a: Seat, b: Seat) => b.score - a.score || a.seed - b.seed;

const colorDiff = (s: Seat) => s.colors.reduce((d, c) => d + (c === "w" ? 1 : -1), 0);

type Strength = 0 | 1 | 2 | 3;

/** Пожелание цвета (C.04.3, п. 1.7): 3 — обязательное, 2 — сильное, 1 — слабое (чередовать), 0 — нет. */
function preference(s: Seat): { color: Color | null; strength: Strength } {
  const diff = colorDiff(s);
  const n = s.colors.length;
  const lastTwo = n >= 2 && s.colors[n - 1] === s.colors[n - 2] ? s.colors[n - 1] : null;
  if (diff > 1 || lastTwo === "w") return { color: "b", strength: 3 };
  if (diff < -1 || lastTwo === "b") return { color: "w", strength: 3 };
  if (diff === 1) return { color: "b", strength: 2 };
  if (diff === -1) return { color: "w", strength: 2 };
  if (n > 0) return { color: s.colors[n - 1] === "w" ? "b" : "w", strength: 1 };
  return { color: null, strength: 0 };
}

/** Цвета в паре (C.04.3, п. 5.2). Возвращает того, кто играет белыми. */
function whiteOf(a: Seat, b: Seat, initial: Color): Seat {
  const [hi, lo] = byRank(a, b) <= 0 ? [a, b] : [b, a];
  const ph = preference(hi);
  const pl = preference(lo);
  const give = (s: Seat, c: Color) => (c === "w" ? s : s === hi ? lo : hi);
  // 5.2.1: оба пожелания выполнимы.
  if (ph.color && pl.color && ph.color !== pl.color) return give(hi, ph.color);
  if (ph.color && !pl.color) return give(hi, ph.color);
  if (pl.color && !ph.color) return give(lo, pl.color);
  if (ph.color && pl.color) {
    // 5.2.2: выполняем более сильное; при двух обязательных — у кого разница цветов больше.
    if (ph.strength !== pl.strength) return ph.strength > pl.strength ? give(hi, ph.color) : give(lo, pl.color);
    if (ph.strength === 3) {
      const dh = Math.abs(colorDiff(hi));
      const dl = Math.abs(colorDiff(lo));
      if (dh !== dl) return dh > dl ? give(hi, ph.color) : give(lo, pl.color);
    }
    // 5.2.3: чередуем относительно последнего тура, где у них были разные цвета.
    for (let i = 1; i <= Math.min(hi.colors.length, lo.colors.length); i++) {
      const ch = hi.colors[hi.colors.length - i];
      const cl = lo.colors[lo.colors.length - i];
      if (ch !== cl) return give(hi, ch === "w" ? "b" : "w");
    }
    // 5.2.4: пожелание того, кто выше.
    return give(hi, ph.color);
  }
  // 5.2.5: оба ещё не играли — у нечётного стартового номера цвет по жребию, у чётного — другой.
  return give(hi, hi.seed % 2 === 1 ? initial : initial === "w" ? "b" : "w");
}

export interface SwissPairing {
  round: TRound;
}

export type SwissError = "tooFew" | "impossible";

/**
 * Жеребьёвка следующего тура. Ошибка «impossible» — когда все возможные пары уже сыграны:
 * турнир пора заканчивать (так бывает, если туров объявлено почти столько же, сколько участников).
 */
export function pairSwissRound(t: Tournament): { round: TRound } | { error: SwissError } {
  const round = t.rounds.length + 1;
  const all = seats(t, round);
  if (all.length < 2) return { error: "tooFew" };

  // Сначала — все правила; если так свести нельзя, отпускаем цвет; затем — повторный свободный тур.
  const attempts: { strictColor: boolean; strictBye: boolean; notes: PairingNote[] }[] = [
    { strictColor: true, strictBye: true, notes: [] },
    { strictColor: false, strictBye: true, notes: ["color"] },
    { strictColor: false, strictBye: false, notes: ["color", "repeatBye"] },
  ];
  for (const attempt of attempts) {
    const games = tryPair(all, t.initialColor, attempt.strictColor, attempt.strictBye);
    if (!games) continue;
    // Примечание ставим, только если правило действительно нарушено, а не просто снято.
    const notes = attempt.notes.filter((note) => violated(note, games, all));
    return { round: notes.length ? { games, notes } : { games } };
  }
  return { error: "impossible" };
}

function violated(note: PairingNote, games: TGame[], all: Seat[]): boolean {
  const seat = new Map(all.map((s) => [s.id, s]));
  if (note === "repeatBye") return games.some((g) => g.black === null && seat.get(g.white)!.hadFreePoint);
  return games.some((g) => {
    if (g.black === null) return false;
    const w = preference(seat.get(g.white)!);
    const b = preference(seat.get(g.black)!);
    return (w.strength === 3 && w.color === "b") || (b.strength === 3 && b.color === "w");
  });
}

function tryPair(all: Seat[], initial: Color, strictColor: boolean, strictBye: boolean): TGame[] | null {
  const pref = new Map(all.map((s) => [s.id, preference(s)]));
  const compatible = (a: Seat, b: Seat) => {
    if (a.met.has(b.id)) return false;
    if (!strictColor) return true;
    const pa = pref.get(a.id)!;
    const pb = pref.get(b.id)!;
    return !(pa.strength === 3 && pb.strength === 3 && pa.color === pb.color);
  };
  /** Одинаковое пожелание цвета: кому-то из двоих придётся играть «не своим» цветом. */
  const clash = (a: Seat, b: Seat) => {
    const pa = pref.get(a.id)!;
    const pb = pref.get(b.id)!;
    return pa.color !== null && pa.color === pb.color;
  };
  const pairsIn = (group: Seat[], edge: (a: Seat, b: Seat) => boolean) => {
    const adj: number[][] = group.map(() => []);
    for (let i = 0; i < group.length; i++)
      for (let j = i + 1; j < group.length; j++)
        if (edge(group[i], group[j])) {
          adj[i].push(j);
          adj[j].push(i);
        }
    return maxMatching(group.length, adj).filter((m) => m !== -1).length / 2;
  };
  const perfect = (group: Seat[]) => group.length % 2 === 0 && pairsIn(group, compatible) * 2 === group.length;
  const without = (group: Seat[], ...out: Seat[]) => group.filter((s) => !out.includes(s));

  // Свободный от игры: последний по порядку, кто ещё не получал очка без игры, — лишь бы остальные сводились.
  let rest = all;
  let bye: Seat | null = null;
  if (all.length % 2 === 1) {
    for (let i = all.length - 1; i >= 0 && !bye; i--) {
      const candidate = all[i];
      if (strictBye && candidate.hadFreePoint) continue;
      if (perfect(without(all, candidate))) bye = candidate;
    }
    if (!bye) return null;
    rest = without(all, bye);
  } else if (!perfect(all)) return null;

  const pairs: [Seat, Seat][] = [];
  while (rest.length) {
    const top = rest[0];
    const bracket = rest.filter((s) => s.score === top.score);
    const half = Math.floor(bracket.length / 2);
    // Порядок кандидатов: нижняя половина группы сверху вниз, затем верхняя снизу вверх, затем следующие группы.
    const lower = bracket.slice(Math.max(half, 1));
    const upper = bracket.slice(1, Math.max(half, 1)).reverse();
    const inside = [...lower, ...upper].filter((c) => compatible(top, c));
    const below = rest.filter((s) => s.score !== top.score && compatible(top, s));

    const maxInside = pairsIn(bracket, compatible);
    const maxCalm = pairsIn(bracket, (a, b) => compatible(a, b) && !clash(a, b));
    const keepsRest = (c: Seat) => perfect(without(rest, top, c));
    const keepsPairs = (c: Seat) => pairsIn(without(bracket, top, c), compatible) === maxInside - 1;
    const calmAfter = (c: Seat) => pairsIn(without(bracket, top, c), (a, b) => compatible(a, b) && !clash(a, b));

    const choice =
      // Лучшее: пара внутри группы, без спора о цвете, и остальным в группе это не мешает.
      inside.find((c) => !clash(top, c) && keepsPairs(c) && calmAfter(c) === maxCalm - 1 && keepsRest(c)) ??
      // Спор о цвете неизбежен, но число «спокойных» пар в группе не уменьшается.
      inside.find((c) => keepsPairs(c) && calmAfter(c) === maxCalm && keepsRest(c)) ??
      inside.find((c) => keepsPairs(c) && keepsRest(c)) ??
      inside.find(keepsRest) ??
      below.find(keepsRest);
    if (!choice) return null;
    pairs.push([top, choice]);
    rest = without(rest, top, choice);
  }

  // Доски: сначала пары с большим числом очков, при равенстве — где выше старший участник.
  const key = ([a, b]: [Seat, Seat]) => [Math.max(a.score, b.score), a.score + b.score, -Math.min(a.seed, b.seed)];
  pairs.sort((x, y) => {
    const kx = key(x);
    const ky = key(y);
    return ky[0] - kx[0] || ky[1] - kx[1] || ky[2] - kx[2];
  });
  const games: TGame[] = pairs.map(([a, b]) => {
    const white = whiteOf(a, b, initial);
    return { white: white.id, black: white === a ? b.id : a.id };
  });
  if (bye) games.push({ white: bye.id, black: null });
  return games;
}

/** Сколько туров предложить: хватает, чтобы определить победителя, и ещё один — чтобы развести места. */
export function recommendedSwissRounds(players: number): number {
  const base = Math.max(3, Math.ceil(Math.log2(Math.max(players, 2))));
  return Math.min(maxSwissRounds(players), base + (players > 8 ? 1 : 0));
}

/** Больше туров объявлять нельзя: пар просто не хватит. */
export function maxSwissRounds(players: number): number {
  return Math.max(1, players % 2 === 0 ? players - 1 : players);
}
