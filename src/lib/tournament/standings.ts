/**
 * Таблица турнира: очки и дополнительные показатели (Справочник ФИДЕ, C.07, редакция с 1 марта 2026 года).
 *
 * Швейцарская: очки → Бухгольц без худшего результата → Бухгольц → Зоннеборн-Бергер → число побед.
 * Несыгранные туры считаются по статье 16: для соперников очки участника «поправляются» (16.3), а в его
 * собственных показателях на месте несыгранного тура стоит условный соперник с его же очками (16.4).
 * Круговая: очки → личные встречи → Зоннеборн-Бергер → число побед (Бухгольц в круговой не применяют).
 */
import { BYE_POINTS } from "./swiss";
import type { TGame, TPlayer, Tournament } from "./types";
import { pointsIn } from "./types";

export interface StandingRow {
  player: TPlayer;
  /** Место; у делящих место оно одинаковое. */
  rank: number;
  points: number;
  /** Сыграно партий за доской. */
  played: number;
  wins: number;
  /** Бухгольц без худшего результата и полный (швейцарская). */
  buchholzCut1?: number;
  buchholz?: number;
  sonnebornBerger: number;
  /** Очки в личных встречах с теми, у кого столько же очков (круговая); null — не все встречи сыграны. */
  direct?: number | null;
}

type Kind = "game" | "bye" | "forfeitWin" | "forfeitLoss" | "absent";

interface Entry {
  kind: Kind;
  opponent: string | null;
  points: number;
}

/** Что было у участника в каждом туре; тур без результата в запись не попадает. */
function history(t: Tournament, byePoints: number): Map<string, Entry[]> {
  const out = new Map<string, Entry[]>(t.players.map((p) => [p.id, []]));
  const swiss = t.format === "swiss";
  t.rounds.forEach((round) => {
    const seen = new Set<string>();
    const add = (id: string, g: TGame, opponent: string | null) => {
      seen.add(id);
      const points = pointsIn(g, id, byePoints);
      if (points === undefined) return;
      const forfeit = g.result === "+-" || g.result === "-+";
      const kind: Kind = g.black === null ? "bye" : forfeit ? (points === 1 ? "forfeitWin" : "forfeitLoss") : "game";
      out.get(id)?.push({ kind, opponent, points });
    };
    for (const g of round.games) {
      add(g.white, g, g.black);
      if (g.black !== null) add(g.black, g, g.white);
    }
    // Швейцарская: кого в туре не сводили (выбыл или ещё не вступил) — у того тур без очков.
    if (swiss)
      for (const p of t.players)
        if (!seen.has(p.id)) out.get(p.id)?.push({ kind: "absent", opponent: null, points: 0 });
  });
  return out;
}

export function standings(t: Tournament): StandingRow[] {
  const swiss = t.format === "swiss";
  const byePoints = swiss ? BYE_POINTS : 0;
  const hist = history(t, byePoints);
  const points = new Map<string, number>();
  for (const [id, entries] of hist)
    points.set(
      id,
      entries.reduce((s, e) => s + e.points, 0),
    );

  /** Очки участника для показателей его соперников (16.3): пропуски в конце турнира считаются ничьими. */
  const adjusted = new Map<string, number>();
  for (const [id, entries] of hist) {
    let trailing = 0;
    for (let i = entries.length - 1; i >= 0 && (entries[i].kind === "absent" || entries[i].kind === "forfeitLoss"); i--)
      if (entries[i].kind === "absent") trailing++;
    adjusted.set(id, points.get(id)! + (swiss ? trailing * 0.5 : 0));
  }

  const rows: StandingRow[] = t.players.map((player) => {
    const entries = hist.get(player.id)!;
    const own = points.get(player.id)!;
    // Вклад каждого тура: очки соперника (или условного соперника на месте несыгранного тура).
    const contributions = entries.map((e) => {
      if (e.kind === "game") return { e, value: adjusted.get(e.opponent!)! };
      if (!swiss) return { e, value: e.opponent ? points.get(e.opponent)! : 0 };
      const cap =
        e.kind === "forfeitWin" || e.kind === "forfeitLoss" ? adjusted.get(e.opponent!)! : 0.5 * t.totalRounds;
      return { e, value: Math.min(own, cap) };
    });
    const sonnebornBerger = contributions.reduce((s, c) => s + c.e.points * c.value, 0);
    const row: StandingRow = {
      player,
      rank: 0,
      points: own,
      played: entries.filter((e) => e.kind === "game").length,
      wins: entries.filter((e) => e.points === 1 && e.kind !== "bye").length,
      sonnebornBerger,
    };
    if (swiss) {
      const buchholz = contributions.reduce((s, c) => s + c.value, 0);
      // «Без худшего»: если были пропуски по своей воле (неявка, выбыл), отбрасывается такой тур (16.5).
      const voluntary = contributions.filter((c) => c.e.kind === "absent" || c.e.kind === "forfeitLoss");
      const pool = voluntary.length ? voluntary : contributions;
      const cut = pool.length ? Math.min(...pool.map((c) => c.value)) : 0;
      row.buchholz = buchholz;
      row.buchholzCut1 = buchholz - cut;
    }
    return row;
  });

  if (!swiss) {
    // Личные встречи: очки в партиях между теми, у кого поровну очков, — если все эти партии сыграны.
    const groups = new Map<number, StandingRow[]>();
    for (const row of rows) groups.set(row.points, [...(groups.get(row.points) ?? []), row]);
    for (const group of groups.values()) {
      if (group.length < 2) continue;
      const ids = new Set(group.map((r) => r.player.id));
      const need = (group.length - 1) * (t.format === "doubleRoundRobin" ? 2 : 1);
      for (const row of group) {
        const mutual = hist.get(row.player.id)!.filter((e) => e.opponent !== null && ids.has(e.opponent));
        row.direct = mutual.length === need ? mutual.reduce((s, e) => s + e.points, 0) : null;
      }
      if (group.some((r) => r.direct === null)) for (const row of group) row.direct = null;
    }
  }

  const keys = (r: StandingRow): number[] =>
    swiss
      ? [r.points, r.buchholzCut1 ?? 0, r.buchholz ?? 0, r.sonnebornBerger, r.wins]
      : [r.points, r.direct ?? 0, r.sonnebornBerger, r.wins];
  const compare = (a: StandingRow, b: StandingRow) => {
    const ka = keys(a);
    const kb = keys(b);
    for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return kb[i] - ka[i];
    return 0;
  };
  rows.sort((a, b) => compare(a, b) || a.player.seed - b.player.seed);
  rows.forEach((row, i) => {
    row.rank = i > 0 && compare(rows[i - 1], row) === 0 ? rows[i - 1].rank : i + 1;
  });
  return rows;
}
