/** Турниры: таблицы Бергера, швейцарская система, сетка на выбывание, таблица с дополнительными показателями. */
import { describe, expect, it } from "vitest";
import {
  addLatePlayer,
  canEditPairs,
  canEditRound,
  canPairNext,
  canUndoRound,
  createTournament,
  isFinished,
  pairNextRound,
  parsePlayers,
  setResult,
  setTotalRounds,
  swapColors,
  swapPlayers,
  toggleWithdrawn,
  totalRoundsRange,
  undoRound,
  updatePlayer,
} from "@/lib/tournament/engine";
import { bracketOrder, knockoutPlaces } from "@/lib/tournament/knockout";
import { matchingSize } from "@/lib/tournament/matching";
import { bergerRounds, roundRobinRounds } from "@/lib/tournament/roundRobin";
import { roundText, standingsText } from "@/lib/tournament/share";
import { standings } from "@/lib/tournament/standings";
import {
  activePlayers,
  maxSwissRounds,
  pairSwissRound,
  recommendedSwissRounds,
  roundIssues,
} from "@/lib/tournament/swiss";
import type { Color, GameResult, Tournament } from "@/lib/tournament/types";

/** Повторяемая «случайность» для тестов. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const names = (n: number) => Array.from({ length: n }, (_, i) => ({ name: `Игрок ${i + 1}`, rating: 2000 - i * 10 }));

function make(format: Tournament["format"], n: number, extra: Partial<Parameters<typeof createTournament>[0]> = {}) {
  const t = createTournament({ name: "Тест", format, players: names(n), seeding: "list", ...extra }, rng(7), 1_000);
  if ("error" in t) throw new Error(t.error);
  return t;
}

/** Таблицы из Справочника ФИДЕ, C.05, приложение 1 (текст приложения, прочитан 12.11.2026). */
const FIDE_BERGER: Record<number, string[]> = {
  4: ["1-4, 2-3", "4-3, 1-2", "2-4, 3-1"],
  6: ["1-6, 2-5, 3-4", "6-4, 5-3, 1-2", "2-6, 3-1, 4-5", "6-5, 1-4, 2-3", "3-6, 4-2, 5-1"],
  8: [
    "1-8, 2-7, 3-6, 4-5",
    "8-5, 6-4, 7-3, 1-2",
    "2-8, 3-1, 4-7, 5-6",
    "8-6, 7-5, 1-4, 2-3",
    "3-8, 4-2, 5-1, 6-7",
    "8-7, 1-6, 2-5, 3-4",
    "4-8, 5-3, 6-2, 7-1",
  ],
  10: [
    "1-10, 2-9, 3-8, 4-7, 5-6",
    "10-6, 7-5, 8-4, 9-3, 1-2",
    "2-10, 3-1, 4-9, 5-8, 6-7",
    "10-7, 8-6, 9-5, 1-4, 2-3",
    "3-10, 4-2, 5-1, 6-9, 7-8",
    "10-8, 9-7, 1-6, 2-5, 3-4",
    "4-10, 5-3, 6-2, 7-1, 8-9",
    "10-9, 1-8, 2-7, 3-6, 4-5",
    "5-10, 6-4, 7-3, 8-2, 9-1",
  ],
  12: [
    "1-12, 2-11, 3-10, 4-9, 5-8, 6-7",
    "12-7, 8-6, 9-5, 10-4, 11-3, 1-2",
    "2-12, 3-1, 4-11, 5-10, 6-9, 7-8",
    "12-8, 9-7, 10-6, 11-5, 1-4, 2-3",
    "3-12, 4-2, 5-1, 6-11, 7-10, 8-9",
    "12-9, 10-8, 11-7, 1-6, 2-5, 3-4",
    "4-12, 5-3, 6-2, 7-1, 8-11, 9-10",
    "12-10, 11-9, 1-8, 2-7, 3-6, 4-5",
    "5-12, 6-4, 7-3, 8-2, 9-1, 10-11",
    "12-11, 1-10, 2-9, 3-8, 4-7, 5-6",
    "6-12, 7-5, 8-4, 9-3, 10-2, 11-1",
  ],
  16: [
    "1-16, 2-15, 3-14, 4-13, 5-12, 6-11, 7-10, 8-9",
    "16-9, 10-8, 11-7, 12-6, 13-5, 14-4, 15-3, 1-2",
    "2-16, 3-1, 4-15, 5-14, 6-13, 7-12, 8-11, 9-10",
    "16-10, 11-9, 12-8, 13-7, 14-6, 15-5, 1-4, 2-3",
    "3-16, 4-2, 5-1, 6-15, 7-14, 8-13, 9-12, 10-11",
    "16-11, 12-10, 13-9, 14-8, 15-7, 1-6, 2-5, 3-4",
    "4-16, 5-3, 6-2, 7-1, 8-15, 9-14, 10-13, 11-12",
    "16-12, 13-11, 14-10, 15-9, 1-8, 2-7, 3-6, 4-5",
    "5-16, 6-4, 7-3, 8-2, 9-1, 10-15, 11-14, 12-13",
    "16-13, 14-12, 15-11, 1-10, 2-9, 3-8, 4-7, 5-6",
    "6-16, 7-5, 8-4, 9-3, 10-2, 11-1, 12-15, 13-14",
    "16-14, 15-13, 1-12, 2-11, 3-10, 4-9, 5-8, 6-7",
    "7-16, 8-6, 9-5, 10-4, 11-3, 12-2, 13-1, 14-15",
    "16-15, 1-14, 2-13, 3-12, 4-11, 5-10, 6-9, 7-8",
    "8-16, 9-7, 10-6, 11-5, 12-4, 13-3, 14-2, 15-1",
  ],
};

describe("круговая система: таблицы Бергера", () => {
  it.each(Object.keys(FIDE_BERGER).map(Number))("%i участников — тур в тур как в приложении ФИДЕ", (n) => {
    const ours = bergerRounds(n).map((round) => round.map(([w, b]) => `${w}-${b}`).join(", "));
    expect(ours).toEqual(FIDE_BERGER[n]);
  });

  it("нечётное число участников: старший номер таблицы — свободен от игры", () => {
    // 5 участников играют по таблице для шести: соперник «шестого» отдыхает.
    const rounds = bergerRounds(5);
    expect(rounds).toHaveLength(5);
    expect(rounds.map((r) => r[0])).toEqual([
      [1, null],
      [4, null],
      [2, null],
      [5, null],
      [3, null],
    ]);
    for (const round of rounds) expect(round).toHaveLength(3);
  });

  it.each([3, 4, 5, 6, 7, 8, 9, 10, 13, 16, 21, 24])("%i участников: каждый с каждым по разу, цвета поровну", (n) => {
    const ids = Array.from({ length: n }, (_, i) => `p${i + 1}`);
    const rounds = roundRobinRounds(ids);
    expect(rounds).toHaveLength(n % 2 === 0 ? n - 1 : n);
    const met = new Set<string>();
    const whites = new Map<string, number>(ids.map((id) => [id, 0]));
    const games = new Map<string, number>(ids.map((id) => [id, 0]));
    for (const round of rounds) {
      const busy = new Set<string>();
      for (const g of round.games) {
        for (const id of [g.white, g.black]) {
          if (id === null) continue;
          expect(busy.has(id), `${id} дважды в туре`).toBe(false);
          busy.add(id);
        }
        if (g.black === null) continue;
        const key = [g.white, g.black].sort().join("|");
        expect(met.has(key), key).toBe(false);
        met.add(key);
        whites.set(g.white, whites.get(g.white)! + 1);
        games.set(g.white, games.get(g.white)! + 1);
        games.set(g.black, games.get(g.black)! + 1);
      }
      expect(busy.size).toBe(n);
    }
    expect(met.size).toBe((n * (n - 1)) / 2);
    for (const id of ids) {
      expect(games.get(id)).toBe(n - 1);
      const w = whites.get(id)!;
      // Чётное поле — партий нечётное число, разница в одну; нечётное поле — ровно пополам.
      expect(Math.abs(w - (n - 1 - w))).toBe(n % 2 === 0 ? 1 : 0);
    }
  });

  it.each([4, 6, 8, 10, 12])(
    "два круга, %i участников: дважды разными цветами, никто не играет три раза одним цветом подряд",
    (n) => {
      const ids = Array.from({ length: n }, (_, i) => `p${i + 1}`);
      const rounds = roundRobinRounds(ids, true);
      expect(rounds).toHaveLength(2 * (n - 1));
      const seen = new Map<string, number>();
      const colors = new Map<string, Color[]>(ids.map((id) => [id, []]));
      for (const round of rounds)
        for (const g of round.games) {
          seen.set(`${g.white}>${g.black}`, (seen.get(`${g.white}>${g.black}`) ?? 0) + 1);
          colors.get(g.white)!.push("w");
          colors.get(g.black!)!.push("b");
        }
      expect(seen.size).toBe(n * (n - 1));
      expect([...seen.values()].every((v) => v === 1)).toBe(true);
      for (const [id, list] of colors) {
        expect(list.filter((c) => c === "w")).toHaveLength(n - 1);
        expect(list.join(""), id).not.toMatch(/www|bbb/);
      }
    },
  );
});

describe("паросочетание", () => {
  it("на случайных графах совпадает с полным перебором", () => {
    const random = rng(42);
    const brute = (n: number, edges: [number, number][]): number => {
      let best = 0;
      const go = (i: number, used: number, count: number) => {
        best = Math.max(best, count);
        for (let k = i; k < edges.length; k++) {
          const [a, b] = edges[k];
          if (used & (1 << a) || used & (1 << b)) continue;
          go(k + 1, used | (1 << a) | (1 << b), count + 1);
        }
      };
      go(0, 0, 0);
      return best;
    };
    for (let run = 0; run < 400; run++) {
      const n = 2 + Math.floor(random() * 9);
      const density = 0.15 + random() * 0.6;
      const edges: [number, number][] = [];
      const adj: number[][] = Array.from({ length: n }, () => []);
      for (let a = 0; a < n; a++)
        for (let b = a + 1; b < n; b++)
          if (random() < density) {
            edges.push([a, b]);
            adj[a].push(b);
            adj[b].push(a);
          }
      expect(matchingSize(n, adj), JSON.stringify(edges)).toBe(brute(n, edges));
    }
  });

  it("нечётные циклы («цветки»): пятиугольник с хвостом сводится полностью", () => {
    // 0-1-2-3-4-0 и хвост 4-5: без сжатия цикла жадный поиск теряет пару.
    const adj = [[1, 4], [0, 2], [1, 3], [2, 4], [3, 0, 5], [4]];
    expect(matchingSize(6, adj)).toBe(3);
  });
});

/** Сыграть тур: results(game) → результат. */
function play(t: Tournament, pick: (white: string, black: string) => GameResult): Tournament {
  const r = t.rounds.length - 1;
  let out = t;
  t.rounds[r].games.forEach((g, board) => {
    if (g.black !== null) out = setResult(out, r, board, pick(g.white, g.black));
  });
  return out;
}

function colorsOf(t: Tournament): Map<string, Color[]> {
  const out = new Map<string, Color[]>(t.players.map((p) => [p.id, []]));
  for (const round of t.rounds)
    for (const g of round.games) {
      if (g.black === null || g.result === "+-" || g.result === "-+") continue;
      out.get(g.white)!.push("w");
      out.get(g.black)!.push("b");
    }
  return out;
}

/** Основные правила швейцарской системы (ФИДЕ, C.04.1) для всех сведённых туров. */
function expectSwissRules(t: Tournament) {
  const met = new Set<string>();
  const byes = new Map<string, number>();
  t.rounds.forEach((round, index) => {
    const active = activePlayers({ ...t, rounds: t.rounds.slice(0, index) }, index + 1).map((p) => p.id);
    const seen: string[] = [];
    for (const g of round.games) {
      seen.push(g.white);
      if (g.black === null) {
        byes.set(g.white, (byes.get(g.white) ?? 0) + 1);
        continue;
      }
      seen.push(g.black);
      const key = [g.white, g.black].sort().join("|");
      expect(met.has(key), `повторная встреча ${key} в туре ${index + 1}`).toBe(false);
      met.add(key);
    }
    // Каждый участник сведён ровно один раз; свободный — только при нечётном числе.
    expect([...seen].sort()).toEqual([...active].sort());
    expect(round.games.filter((g) => g.black === null)).toHaveLength(active.length % 2);
  });
  const relaxedBye = t.rounds.some((r) => r.notes?.includes("repeatBye"));
  if (!relaxedBye) for (const [id, count] of byes) expect(count, `свободен дважды: ${id}`).toBe(1);
  const relaxedColor = t.rounds.some((r) => r.notes?.includes("color"));
  if (!relaxedColor)
    for (const [id, list] of colorsOf(t)) {
      expect(list.join(""), `три раза подряд один цвет: ${id}`).not.toMatch(/www|bbb/);
      let diff = 0;
      for (const c of list) {
        diff += c === "w" ? 1 : -1;
        expect(Math.abs(diff), `разница цветов: ${id}`).toBeLessThanOrEqual(2);
      }
    }
}

describe("швейцарская система", () => {
  it("первый тур: верхняя половина против нижней, цвет по жребию чередуется по доскам", () => {
    const t = make("swiss", 8);
    const seed = new Map(t.players.map((p) => [p.id, p.seed]));
    const pairs = t.rounds[0].games.map((g) => [seed.get(g.white)!, seed.get(g.black!)!]);
    const top = t.initialColor === "w";
    expect(pairs).toEqual(
      top
        ? [
            [1, 5],
            [6, 2],
            [3, 7],
            [8, 4],
          ]
        : [
            [5, 1],
            [2, 6],
            [7, 3],
            [4, 8],
          ],
    );
  });

  it("второй тур: победители с победителями, и цвета меняются — пары «крест-накрест»", () => {
    let t = make("swiss", 8);
    const seed = new Map(t.players.map((p) => [p.id, p.seed]));
    // Старший номер всегда побеждает.
    t = play(t, (w, b) => (seed.get(w)! < seed.get(b)! ? "1-0" : "0-1"));
    const next = pairNextRound(t);
    if ("error" in next) throw new Error(next.error);
    const pairs = next.rounds[1].games.map((g) => [seed.get(g.white)!, seed.get(g.black!)!].sort((a, b) => a - b));
    // Победители 1–4: у 1 и 3 один цвет, у 2 и 4 другой — поэтому 1–4 и 2–3, а не 1–3 и 2–4.
    expect(pairs.slice(0, 2)).toEqual([
      [1, 4],
      [2, 3],
    ]);
    expect(pairs.slice(2)).toEqual([
      [5, 8],
      [6, 7],
    ]);
    // Никто не играет вторую партию тем же цветом.
    for (const list of colorsOf(play(next, () => "1/2")).values()) expect(list.join("")).toMatch(/^(wb|bw)$/);
  });

  it.each([4, 5, 6, 7, 8, 9, 11, 12, 16, 17, 24, 31, 40])(
    "%i участников, случайные результаты: правила ФИДЕ соблюдены во всех турах",
    (n) => {
      for (const seed of [1, 2, 3]) {
        const random = rng(n * 100 + seed);
        let t = createTournament(
          { name: "S", format: "swiss", players: names(n), seeding: "lot" },
          random,
          seed,
        ) as Tournament;
        expect(t.totalRounds).toBe(recommendedSwissRounds(n));
        for (;;) {
          t = play(t, () => (["1-0", "0-1", "1/2"] as const)[Math.floor(random() * 3)]);
          if (!canPairNext(t)) break;
          const next = pairNextRound(t);
          if ("error" in next) throw new Error(`${n} участников, тур ${t.rounds.length + 1}: ${next.error}`);
          t = next;
        }
        expect(isFinished(t)).toBe(true);
        expectSwissRules(t);
        // При рекомендованном числе туров правила нарушать не приходится.
        expect(t.rounds.flatMap((r) => r.notes ?? [])).toEqual([]);
      }
    },
  );

  it("при равном числе споров о цвете порядок важнее: первый номер группы играет с первым из нижней половины", () => {
    // Семь участников, в первом туре победили белые: по очку у номеров 1, 3, 5 (все играли белыми) и у 7-го,
    // свободного от игры. Спор о цвете неизбежен в одной паре при любом раскладе — значит, пары по порядку: 1–5, 3–7.
    let t = make("swiss", 7, { rounds: 4 });
    t = pairNextRound(play(t, () => "1-0")) as Tournament;
    const seed = new Map(t.players.map((p) => [p.id, p.seed]));
    const pairs = t.rounds[1].games
      .filter((g) => g.black !== null)
      .map((g) => [seed.get(g.white)!, seed.get(g.black!)!].sort((a, b) => a - b).join("–"));
    expect(pairs).toEqual(expect.arrayContaining(["1–5", "3–7"]));
  });

  it("пары — в своей группе очков или в соседней: «спусков» почти столько, сколько неизбежно", () => {
    // Группа с нечётным числом участников отдаёт одного вниз; он идёт по соседним группам до следующей нечётной.
    // Неизбежное число пар с разными очками — сумма таких расстояний.
    const unavoidable = (sizes: number[]) => {
      let total = 0;
      let open = -1;
      sizes.forEach((size, i) => {
        if (size % 2 === 0) return;
        if (open < 0) open = i;
        else {
          total += i - open;
          open = -1;
        }
      });
      return total;
    };
    let cross = 0;
    let bound = 0;
    const tournaments = 30;
    for (let seed = 1; seed <= tournaments; seed++) {
      const random = rng(seed);
      let t = make("swiss", 32, { rounds: 6 });
      const scores = new Map(t.players.map((p) => [p.id, 0]));
      for (let r = 0; r < 6; r++) {
        const groups = new Map<number, number>();
        for (const x of scores.values()) groups.set(x, (groups.get(x) ?? 0) + 1);
        bound += unavoidable([...groups.entries()].sort((x, y) => y[0] - x[0]).map(([, size]) => size));
        const gaps = t.rounds[r].games.map((g) => Math.abs(scores.get(g.white)! - scores.get(g.black!)!));
        cross += gaps.filter((x) => x > 0).length;
        expect(Math.max(...gaps), `seed ${seed}, тур ${r + 1}`).toBeLessThanOrEqual(1.5);
        t = play(t, () => (["1-0", "0-1", "1/2"] as const)[Math.floor(random() * 3)]);
        for (const g of t.rounds[r].games) {
          scores.set(g.white, scores.get(g.white)! + (g.result === "1-0" ? 1 : g.result === "1/2" ? 0.5 : 0));
          scores.set(g.black!, scores.get(g.black!)! + (g.result === "0-1" ? 1 : g.result === "1/2" ? 0.5 : 0));
        }
        if (r < 5) t = pairNextRound(t) as Tournament;
      }
    }
    expect(cross).toBeGreaterThanOrEqual(bound);
    // Лишние «спуски» бывают из-за запрета повторных встреч и цвета. На 32 участниках и шести турах их в среднем
    // чуть больше одного на турнир (замер на 60 турнирах: 78); порог — два на турнир.
    expect(cross - bound).toBeLessThanOrEqual(2 * tournaments);
  });

  it("туров почти столько же, сколько участников: повторных встреч нет, тупик честно называется", () => {
    let impossible = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const random = rng(seed);
      const n = 5 + (seed % 4);
      let t = make("swiss", n, { rounds: maxSwissRounds(n), seeding: "lot" });
      for (;;) {
        t = play(t, () => (["1-0", "0-1", "1/2"] as const)[Math.floor(random() * 3)]);
        if (!canPairNext(t)) break;
        const next = pairNextRound(t);
        if ("error" in next) {
          expect(next.error).toBe("impossible");
          impossible++;
          break;
        }
        t = next;
      }
      // Что бы ни случилось, двое не играют друг с другом дважды.
      const met = new Set<string>();
      for (const round of t.rounds)
        for (const g of round.games) {
          if (g.black === null) continue;
          const key = [g.white, g.black].sort().join("|");
          expect(met.has(key)).toBe(false);
          met.add(key);
        }
    }
    // Тупики при таком числе туров бывают (шесть участников: два «треугольника» несыгранных пар).
    expect(impossible).toBeGreaterThan(0);
  });

  it("выбывший больше не получает пару, опоздавший вступает со следующего тура", () => {
    let t = make("swiss", 8, { rounds: 4 });
    t = play(t, () => "1-0");
    const gone = t.players[2].id;
    t = toggleWithdrawn(t, gone);
    t = addLatePlayer(t, { name: "Опоздавший" });
    const late = t.players[t.players.length - 1];
    expect(late).toMatchObject({ seed: 9, joinedRound: 2 });
    t = pairNextRound(t) as Tournament;
    const ids = t.rounds[1].games.flatMap((g) => [g.white, g.black]);
    expect(ids).not.toContain(gone);
    expect(ids).toContain(late.id);
    expectSwissRules(t);
    // Вернуть выбывшего можно тем же действием.
    expect(toggleWithdrawn(t, gone).players[2].withdrawnAfter).toBeUndefined();
  });

  it("150 участников, восемь туров — за разумное время", () => {
    const random = rng(9);
    const started = Date.now();
    let t = make("swiss", 150, { rounds: 8, seeding: "lot" });
    for (let r = 1; r < 8; r++) {
      t = play(t, () => (["1-0", "0-1", "1/2"] as const)[Math.floor(random() * 3)]);
      t = pairNextRound(t) as Tournament;
    }
    expectSwissRules(t);
    expect(Date.now() - started).toBeLessThan(20_000);
  }, 30_000);

  it("жеребьёвка без участников — ошибка, а не пустой тур", () => {
    const t = make("swiss", 4);
    expect(pairSwissRound({ ...t, players: t.players.slice(0, 1), rounds: [] })).toEqual({ error: "tooFew" });
  });
});

describe("олимпийская система", () => {
  it("сетка: первый и второй номера встречаются только в финале", () => {
    expect(bracketOrder(2)).toEqual([1, 2]);
    expect(bracketOrder(4)).toEqual([1, 4, 2, 3]);
    expect(bracketOrder(8)).toEqual([1, 8, 4, 5, 2, 7, 3, 6]);
    const order = bracketOrder(16);
    expect(order.indexOf(1) < 8).not.toBe(order.indexOf(2) < 8);
    for (let i = 0; i < 16; i += 2) expect(order[i] + order[i + 1]).toBe(17);
  });

  it("пять участников: трое сильнейших проходят первый тур без игры, дальше — до финала и матча за третье место", () => {
    let t = make("knockout", 5, { thirdPlace: true });
    const seed = new Map(t.players.map((p) => [p.id, p.seed]));
    const show = (r: number) => t.rounds[r].games.map((g) => [seed.get(g.white), g.black ? seed.get(g.black) : null]);
    expect(t.totalRounds).toBe(3);
    expect(show(0)).toEqual([
      [1, null],
      [4, 5],
      [2, null],
      [3, null],
    ]);
    // Ничья на выбывание не записывается.
    expect(setResult(t, 0, 1, "1/2")).toBe(t);
    expect(canPairNext(t)).toBe(false);
    t = setResult(t, 0, 1, "0-1");
    t = pairNextRound(t) as Tournament;
    expect(show(1).map((p) => [...p].sort())).toEqual([
      [1, 5],
      [2, 3],
    ]);
    t = play(t, (w, b) => (seed.get(w)! < seed.get(b)! ? "1-0" : "0-1"));
    t = pairNextRound(t) as Tournament;
    // Финал 1–2 и матч за третье место 3–5.
    expect(show(2).map((p) => [...p].sort())).toEqual([
      [1, 2],
      [3, 5],
    ]);
    expect(knockoutPlaces(t)).toEqual({ first: null, second: null, third: [] });
    t = play(t, (w, b) => (seed.get(w)! < seed.get(b)! ? "1-0" : "0-1"));
    expect(isFinished(t)).toBe(true);
    const places = knockoutPlaces(t);
    expect([places.first, places.second, ...places.third].map((id) => seed.get(id!))).toEqual([1, 2, 3]);
  });

  it("без матча за третье место третьи — оба проигравших в полуфинале", () => {
    let t = make("knockout", 4);
    const seed = new Map(t.players.map((p) => [p.id, p.seed]));
    t = play(t, (w, b) => (seed.get(w)! < seed.get(b)! ? "1-0" : "0-1"));
    t = pairNextRound(t) as Tournament;
    expect(t.rounds[1].games).toHaveLength(1);
    t = play(t, () => "+-");
    expect(
      knockoutPlaces(t)
        .third.map((id) => seed.get(id))
        .sort(),
    ).toEqual([3, 4]);
  });

  it("жеребьёвку последнего тура можно отменить, пока нет результатов", () => {
    let t = make("knockout", 4);
    expect(canUndoRound(t)).toBe(false);
    t = play(t, () => "1-0");
    t = pairNextRound(t) as Tournament;
    expect(canUndoRound(t)).toBe(true);
    expect(undoRound(t).rounds).toHaveLength(1);
    t = setResult(t, 1, 0, "1-0");
    expect(canUndoRound(t)).toBe(false);
  });
});

describe("таблица", () => {
  it("круговая: очки, Зоннеборн-Бергер, личная встреча, деление места", () => {
    let t = make("roundRobin", 4);
    const [a, b, c, d] = t.players.map((p) => p.id);
    const result = (x: string, y: string, xPoints: 1 | 0.5 | 0) => {
      t.rounds.forEach((round, r) =>
        round.games.forEach((g, board) => {
          if (g.white === x && g.black === y)
            t = setResult(t, r, board, xPoints === 1 ? "1-0" : xPoints === 0 ? "0-1" : "1/2");
          if (g.white === y && g.black === x)
            t = setResult(t, r, board, xPoints === 1 ? "0-1" : xPoints === 0 ? "1-0" : "1/2");
        }),
      );
    };
    // a обыграл b, но проиграл c; b обыграл c; все трое обыграли d: у a, b, c по 2 очка.
    result(a, b, 1);
    result(a, c, 0);
    result(b, c, 1);
    result(a, d, 1);
    result(b, d, 1);
    result(c, d, 1);
    expect(isFinished(t)).toBe(true);
    const rows = standings(t);
    expect(rows.map((r) => r.points)).toEqual([2, 2, 2, 0]);
    // Круг «a > b > c > a»: личные встречи равны (по 1), Зоннеборн-Бергер равен (по 2) — место делят.
    expect(rows.slice(0, 3).map((r) => [r.direct, r.sonnebornBerger, r.rank])).toEqual([
      [1, 2, 1],
      [1, 2, 1],
      [1, 2, 1],
    ]);
    expect(rows[3]).toMatchObject({ rank: 4, sonnebornBerger: 0 });

    // Теперь c сыграл с d вничью: у a и b по 2, личная встреча за a.
    result(c, d, 0.5);
    const next = standings(t);
    expect(next.map((r) => [r.player.id, r.points, r.rank])).toEqual([
      [a, 2, 1],
      [b, 2, 2],
      [c, 1.5, 3],
      [d, 0.5, 4],
    ]);
    expect(next[0].direct).toBe(1);
    expect(next[1].direct).toBe(0);
  });

  it("круговая: пока личные встречи не сыграны, они не решают", () => {
    let t = make("roundRobin", 4);
    t = setResult(t, 0, 0, "1-0");
    t = setResult(t, 0, 1, "1-0");
    for (const row of standings(t).filter((r) => r.points === 1)) expect(row.direct).toBeNull();
  });

  it("швейцарская: Бухгольц — сумма очков соперников; свободный тур считается по статье 16", () => {
    // Пять участников, три тура: каждый тур один свободен.
    let t = make("swiss", 5, { rounds: 3 });
    const seed = new Map(t.players.map((p) => [p.id, p.seed]));
    for (let r = 0; r < 3; r++) {
      t = play(t, (w, b) => (seed.get(w)! < seed.get(b)! ? "1-0" : "0-1"));
      if (r < 2) t = pairNextRound(t) as Tournament;
    }
    const rows = standings(t);
    const points = new Map(rows.map((r) => [r.player.id, r.points]));
    expect(rows.reduce((s, r) => s + r.points, 0)).toBe(3 * 2 + 3 * 1);
    for (const row of rows) {
      let sum = 0;
      let hadBye = false;
      for (const round of t.rounds)
        for (const g of round.games) {
          if (g.white !== row.player.id && g.black !== row.player.id) continue;
          if (g.black === null) {
            hadBye = true;
            // Условный соперник: очки самого участника, но не больше половины от числа туров.
            sum += Math.min(row.points, 0.5 * t.totalRounds);
          } else sum += points.get(g.white === row.player.id ? g.black : g.white)!;
        }
      expect(row.buchholz, row.player.name).toBe(sum);
      expect(row.buchholzCut1!).toBeLessThanOrEqual(row.buchholz!);
      if (hadBye) expect(row.played).toBe(2);
    }
    // Места идут по убыванию очков, затем показателей.
    for (let i = 1; i < rows.length; i++) expect(rows[i - 1].points).toBeGreaterThanOrEqual(rows[i].points);
    expect(rows[0].player.seed).toBe(1);
  });

  it("швейцарская: выбывший — его несыгранные туры для соперников считаются ничьими, а «без худшего» отбрасывает пропуск", () => {
    let t = make("swiss", 6, { rounds: 3 });
    const seed = new Map(t.players.map((p) => [p.id, p.seed]));
    t = play(t, (w, b) => (seed.get(w)! < seed.get(b)! ? "1-0" : "0-1"));
    const gone = t.players.find((p) => p.seed === 1)!;
    const beaten = t.rounds[0].games
      .flatMap((g) => [g.white, g.black])
      .find((id, i, all) => {
        const pair = all[i % 2 === 0 ? i + 1 : i - 1];
        return pair === gone.id;
      })!;
    t = toggleWithdrawn(t, gone.id);
    t = pairNextRound(t) as Tournament;
    t = play(t, () => "1/2");
    t = pairNextRound(t) as Tournament;
    t = play(t, () => "1/2");
    const rows = standings(t);
    const goneRow = rows.find((r) => r.player.id === gone.id)!;
    expect(goneRow.points).toBe(1);
    // Соперник выбывшего получает в Бухгольц 1 + 0,5 + 0,5 = 2 очка за него.
    const opp = rows.find((r) => r.player.id === beaten)!;
    const others = t.rounds
      .slice(1)
      .flatMap((r) => r.games)
      .filter((g) => g.white === beaten || g.black === beaten)
      .map((g) =>
        g.black === null
          ? Math.min(opp.points, 1.5)
          : rows.find((r) => r.player.id === (g.white === beaten ? g.black : g.white))!.points,
      );
    expect(opp.buchholz).toBe(2 + others.reduce((s, x) => s + x, 0));
    // У выбывшего два пропуска: условный соперник с его очком; «без худшего» убирает один из них.
    expect(goneRow.buchholzCut1).toBe(goneRow.buchholz! - 1);
  });
});

describe("создание турнира", () => {
  it("мало или слишком много участников — ошибка", () => {
    const base = { name: "T", seeding: "list" as const };
    expect(createTournament({ ...base, format: "roundRobin", players: names(2) })).toEqual({ error: "tooFew" });
    expect(createTournament({ ...base, format: "swiss", players: names(3) })).toEqual({ error: "tooFew" });
    expect(createTournament({ ...base, format: "knockout", players: names(65) })).toEqual({ error: "tooMany" });
    expect(createTournament({ ...base, format: "doubleRoundRobin", players: names(13) })).toEqual({ error: "tooMany" });
    // Пустые строки участниками не считаются.
    expect(
      createTournament({ ...base, format: "roundRobin", players: [{ name: "А" }, { name: " " }, { name: "Б" }] }),
    ).toEqual({ error: "tooFew" });
  });

  it("список участников из текста: номера в начале строк отбрасываются, число в конце — рейтинг", () => {
    expect(parsePlayers("1. Али 1200\n2) Вали, 1540\n\n  Гани  \nДони-младший 3\nАбдулла Каримов;1800")).toEqual([
      { name: "Али", rating: 1200 },
      { name: "Вали", rating: 1540 },
      { name: "Гани" },
      { name: "Дони-младший 3" },
      { name: "Абдулла Каримов", rating: 1800 },
    ]);
    expect(parsePlayers(" \n\n")).toEqual([]);
  });

  it("стартовые номера: по жребию, по рейтингу, как в списке", () => {
    const players = [
      { name: "Али", rating: 1200 },
      { name: "Вали", rating: 1500 },
      { name: "Гани" },
      { name: "Дони", rating: 1500 },
    ];
    const order = (seeding: "lot" | "rating" | "list", seed = 3) =>
      (createTournament({ name: "T", format: "roundRobin", players, seeding }, rng(seed), 5) as Tournament).players.map(
        (p) => p.name,
      );
    expect(order("list")).toEqual(["Али", "Вали", "Гани", "Дони"]);
    expect(order("rating")).toEqual(["Вали", "Дони", "Али", "Гани"]);
    const lot = order("lot");
    expect([...lot].sort()).toEqual(["Али", "Вали", "Гани", "Дони"]);
    // Жребий повторяем при том же источнике случайности и различается при другом.
    expect(order("lot")).toEqual(lot);
    const variants = new Set([1, 2, 3, 4, 5, 6, 7, 8].map((s) => order("lot", s).join()));
    expect(variants.size).toBeGreaterThan(3);
  });

  it("результаты: круговая и швейцарская — в любом сведённом туре; олимпийская — только в последнем", () => {
    const rr = make("roundRobin", 4);
    expect(canEditRound(rr, 2)).toBe(true);
    expect(canPairNext(rr)).toBe(false);
    let sw = make("swiss", 4, { rounds: 3 });
    sw = play(sw, () => "1-0");
    sw = pairNextRound(sw) as Tournament;
    expect(canEditRound(sw, 0)).toBe(true);
    expect(canEditRound(sw, 2)).toBe(false);
    let ko = make("knockout", 4);
    ko = pairNextRound(play(ko, () => "1-0")) as Tournament;
    expect(canEditRound(ko, 0)).toBe(false);
    expect(setResult(ko, 0, 0, "0-1")).toBe(ko);
    expect(setResult(sw, 1, 0, "1/2").rounds[1].games[0].result).toBe("1/2");
    // Стереть результат.
    expect(setResult(setResult(sw, 1, 0, "1/2"), 1, 0, undefined).rounds[1].games[0].result).toBeUndefined();
    // Пока тур не сыгран, следующий не сводится.
    expect(pairNextRound(sw)).toEqual({ error: "notReady" });
  });

  it("число туров швейцарской: предложенное растёт с числом участников и не превышает возможного", () => {
    expect([4, 6, 8, 9, 16, 17, 32, 64, 150].map(recommendedSwissRounds)).toEqual([3, 3, 3, 5, 5, 6, 6, 7, 9]);
    expect(maxSwissRounds(6)).toBe(5);
    expect(maxSwissRounds(7)).toBe(7);
    expect((make("swiss", 6, { rounds: 99 }) as Tournament).totalRounds).toBe(5);
  });
});

describe("правки судьи", () => {
  /** Швейцарская на шесть: первый тур сыгран (белые победили), второй сведён. */
  const twoRounds = () => pairNextRound(play(make("swiss", 6, { rounds: 4 }), () => "1-0")) as Tournament;

  it("результат прошлого тура исправляется: таблица пересчитана, пары следующего тура остались", () => {
    const t = twoRounds();
    const first = t.rounds[0].games[0];
    const before = standings(t);
    const fixed = setResult(t, 0, 0, "0-1");
    expect(fixed.rounds[0].games[0].result).toBe("0-1");
    expect(fixed.rounds[1]).toEqual(t.rounds[1]);
    const points = (rows: ReturnType<typeof standings>, id: string) => rows.find((r) => r.player.id === id)!.points;
    expect(points(before, first.white)).toBe(1);
    expect(points(standings(fixed), first.white)).toBe(0);
    expect(points(standings(fixed), first.black!)).toBe(1);
    // Стереть результат прошлого тура нельзя: при сведённом следующем он не может оказаться несыгранным.
    expect(setResult(t, 0, 0, undefined)).toBe(t);
    // Исправленный результат учитывается в следующей жеребьёвке.
    const third = pairNextRound(play(fixed, () => "1/2")) as Tournament;
    expectSwissRules(third);
  });

  it("двое меняются местами: каждый сведён один раз, цвета — по правилам, тур помечен", () => {
    const t = twoRounds();
    const [g1, g2] = t.rounds[1].games;
    const swapped = swapPlayers(t, g1.black!, g2.black!);
    const round = swapped.rounds[1];
    expect(round.notes).toContain("manual");
    expect(new Set([round.games[0].white, round.games[0].black])).toEqual(new Set([g1.white, g2.black]));
    expect(new Set([round.games[1].white, round.games[1].black])).toEqual(new Set([g2.white, g1.black]));
    const ids = round.games.flatMap((g) => [g.white, g.black]).filter(Boolean);
    expect(new Set(ids).size).toBe(6);
    // Никто не играет одним цветом три раза подряд (после двух туров это невозможно), а повторных встреч
    // программа не скрывает: пометка стоит ровно тогда, когда они есть.
    expect(round.notes?.includes("rematch")).toBe(roundIssues(swapped, 1).rematches.length > 0);
    // Обратная правка возвращает те же пары (цвета могут стоять иначе — их ставит правило).
    const back = swapPlayers(swapped, g1.black!, g2.black!);
    const pairsOf = (x: Tournament) => x.rounds[1].games.map((g) => [g.white, g.black].sort().join("|")).sort();
    expect(pairsOf(back)).toEqual(pairsOf(t));
  });

  it("повторная встреча после правки видна: пометка и имена пары", () => {
    const t = twoRounds();
    const met = new Map<string, string>();
    for (const g of t.rounds[0].games) {
      met.set(g.white, g.black!);
      met.set(g.black!, g.white);
    }
    // Свести заново пару первого тура: соперника первого участника меняем на того, с кем он уже играл.
    const a = t.rounds[1].games[0].white;
    const now = t.rounds[1].games[0].black!;
    const old = met.get(a)!;
    const swapped = swapPlayers(t, now, old);
    expect(swapped.rounds[1].notes).toEqual(expect.arrayContaining(["manual", "rematch"]));
    expect(roundIssues(swapped, 1).rematches.map((p) => [...p].sort().join("|"))).toContain([a, old].sort().join("|"));
    // Следующая жеребьёвка снова не сводит их: встреча учтена.
    const third = pairNextRound(play(swapped, () => "1/2")) as Tournament;
    for (const g of third.rounds[2].games)
      expect([g.white, g.black].sort().join("|")).not.toBe([a, old].sort().join("|"));
  });

  it("цвета в паре меняются; двое из одной пары при обмене просто меняются цветами", () => {
    const t = twoRounds();
    const g = t.rounds[1].games[0];
    const flipped = swapColors(t, 0);
    expect(flipped.rounds[1].games[0]).toEqual({ white: g.black, black: g.white });
    expect(flipped.rounds[1].notes).toContain("manual");
    expect(swapPlayers(t, g.white, g.black!).rounds[1].games[0]).toEqual({ white: g.black, black: g.white });
  });

  it("свободный от игры меняется с участником: свободным становится другой", () => {
    let t = make("swiss", 5, { rounds: 3 });
    const bye = t.rounds[0].games.find((g) => g.black === null)!.white;
    const other = t.rounds[0].games[0].white;
    t = swapPlayers(t, bye, other);
    expect(t.rounds[0].games.find((g) => g.black === null)!.white).toBe(other);
    expect(t.rounds[0].games.flatMap((g) => [g.white, g.black])).toContain(bye);
    expect(new Set(t.rounds[0].games.flatMap((g) => [g.white, g.black]).filter(Boolean)).size).toBe(5);
  });

  it("править пары можно только в последнем туре швейцарской и только у партий без результата", () => {
    const t = twoRounds();
    const [g1, g2] = t.rounds[1].games;
    const played = setResult(t, 1, 0, "1-0");
    expect(swapPlayers(played, g1.black!, g2.black!)).toBe(played);
    expect(swapColors(played, 0)).toBe(played);
    expect(canEditPairs(played)).toBe(true);
    expect(canEditPairs(play(t, () => "1-0"))).toBe(false);
    const rr = make("roundRobin", 4);
    expect(canEditPairs(rr)).toBe(false);
    expect(swapColors(rr, 0)).toBe(rr);
    // Участник из прошлого тура не в счёт: менять можно только тех, кто стоит в последнем.
    expect(swapPlayers(t, g1.white, "нет-такого")).toBe(t);
    // Отмена жеребьёвки и новая — снова пары программы, без пометки.
    const again = pairNextRound(undoRound(swapColors(t, 0))) as Tournament;
    expect(again.rounds[1].notes ?? []).not.toContain("manual");
  });

  it("имя и рейтинг участника исправляются, номер и пары — нет", () => {
    const t = make("swiss", 4);
    const p = t.players[0];
    const renamed = updatePlayer(t, p.id, { name: "  Алишер  ", rating: 1234.4 });
    expect(renamed.players[0]).toMatchObject({ id: p.id, seed: p.seed, name: "Алишер", rating: 1234 });
    expect(renamed.rounds).toBe(t.rounds);
    expect(updatePlayer(renamed, p.id, { name: "Алишер" }).players[0].rating).toBeUndefined();
    expect(updatePlayer(t, p.id, { name: "   " })).toBe(t);
  });

  it("число туров швейцарской меняется по ходу: не меньше сведённых и не больше возможного", () => {
    let t = make("swiss", 6, { rounds: 3 });
    expect(totalRoundsRange(t)).toEqual({ min: 1, max: 5 });
    expect(setTotalRounds(t, 9).totalRounds).toBe(5);
    t = pairNextRound(play(t, () => "1-0")) as Tournament;
    expect(setTotalRounds(t, 1).totalRounds).toBe(2);
    // Турнир закончен — судья добавляет тур, и жеребьёвка снова возможна.
    let done = setTotalRounds(t, 2);
    done = play(done, () => "1/2");
    expect(isFinished(done)).toBe(true);
    const more = setTotalRounds(done, 3);
    expect(isFinished(more)).toBe(false);
    expect(canPairNext(more)).toBe(true);
    expect(setTotalRounds(make("roundRobin", 4), 9).totalRounds).toBe(3);
  });
});

describe("турнир словами — для «Поделиться»", () => {
  it("пары тура швейцарской: белые слева, номера досок, свободный от игры — отдельной строкой", () => {
    const t = make("swiss", 5, { name: "Весенний", rounds: 3 });
    const lines = roundText(t, 0, "ru").split("\n");
    expect(lines[0]).toBe("Весенний");
    expect(lines[1]).toBe("Тур 1 из 3. Белые — слева.");
    // Пять участников: две партии и один свободный.
    expect(lines.slice(2, 4).every((l, i) => l.startsWith(`${i + 1}. `) && l.includes(" — "))).toBe(true);
    expect(lines[4]).toMatch(/^Свободен от игры \(1 очко\): /);
    expect(lines).toHaveLength(5);
    // Каждый участник назван ровно один раз.
    const body = lines.slice(2).join("\n");
    for (const p of t.players) expect(body.split(p.name).length - 1, p.name).toBe(1);
    // Порядок в строке — как в партии: белые слева.
    const g = t.rounds[0].games[0];
    const name = (id: string) => t.players.find((p) => p.id === id)!.name;
    expect(lines[2]).toBe(`1. ${name(g.white)} — ${name(g.black!)}`);
  });

  it("сыгранная партия — с результатом; тура с таким номером нет — пустая строка", () => {
    const t = play(make("swiss", 4, { rounds: 3 }), () => "1/2");
    const games = roundText(t, 0, "ru").split("\n").slice(2);
    expect(games).toHaveLength(2);
    for (const line of games) {
      expect(line).toContain(" ½–½ ");
      expect(line).not.toContain(" — ");
    }
    expect(roundText(t, 5, "ru")).toBe("");
  });

  it("таблица: место, имя, очки; делящие место стоят под одним номером", () => {
    const first = make("roundRobin", 4, { name: "Класс" });
    expect(standingsText(first, "ru").split("\n").slice(0, 2)).toEqual(["Класс", "Таблица"]);
    const t = setResult(setResult(first, 0, 0, "1-0"), 0, 1, "1/2");
    const lines = standingsText(t, "ru").split("\n");
    expect(lines[1]).toBe("Таблица после 1 тура (всего 3)");
    expect(lines).toHaveLength(6);
    expect(lines[2]).toMatch(/^1\. .+ — 1$/);
    expect(lines[3]).toMatch(/^2\. .+ — ½$/);
    expect(lines[4]).toMatch(/^2\. .+ — ½$/);
    expect(lines[5]).toMatch(/^4\. .+ — 0$/);
  });

  it("законченный турнир — «Итоговая таблица»", () => {
    let t = make("roundRobin", 3);
    t.rounds.forEach((r, ri) =>
      r.games.forEach((g, board) => {
        if (g.black !== null) t = setResult(t, ri, board, "1-0");
      }),
    );
    expect(standingsText(t, "ru").split("\n").slice(0, 2)).toEqual(["Тест", "Итоговая таблица"]);
  });

  it("олимпийская: названия туров, матч за третье место и призёры", () => {
    let t = make("knockout", 4, { name: "Кубок", thirdPlace: true });
    expect(roundText(t, 0, "ru").split("\n")[1]).toBe("Полуфинал. Белые — слева.");
    t = pairNextRound(play(t, () => "1-0")) as Tournament;
    const final = roundText(t, 1, "ru").split("\n");
    expect(final[1]).toBe("Финал. Белые — слева.");
    expect(final[2]).toMatch(/^1\. /);
    expect(final[3]).toMatch(/^За 3-е место: /);
    t = play(t, () => "0-1");
    const all = standingsText(t, "ru");
    expect(all).toContain("Полуфинал:");
    expect(all).toContain("Финал:");
    expect(all).toMatch(/1 место: .+\n2 место: .+\n3 место: .+$/);
    // Название турнира в сетке — один раз, в первой строке.
    expect(all.split("Кубок").length - 1).toBe(1);
  });

  it("олимпийская не на степень двойки: свободные проходят дальше без игры", () => {
    const t = make("knockout", 3);
    expect(roundText(t, 0, "ru")).toMatch(/Проходят дальше без игры: /);
  });

  it("по-узбекски — латиница, без русских букв (кроме имён)", () => {
    const t = play(
      make("swiss", 5, { name: "Bahor", players: ["Ali", "Vali", "Gani", "Sardor", "Aziz"].map((name) => ({ name })) }),
      () => "1-0",
    );
    for (const text of [roundText(t, 0, "uz"), standingsText(t, "uz")]) {
      expect(text).not.toMatch(/[а-яё]/i);
      expect(text).not.toMatch(/[`'‘’]/);
    }
    expect(roundText(t, 0, "uz")).toContain("Oqlar — chapda.");
    expect(roundText(t, 0, "uz")).toMatch(/Oʻyindan ozod \(1 ochko\): /);
  });
});
