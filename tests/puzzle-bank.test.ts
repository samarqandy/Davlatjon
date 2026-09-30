/** Банк задач Lichess: файлы, законность каждой задачи, выбор задач, скрытый рейтинг, «Дятел». */
import fs from "node:fs";
import path from "node:path";
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { woodpeckerMedal, woodpeckerSet, WOODPECKER_SIZE } from "@/components/chess/PuzzleBankViews";
import { seededRandom } from "@/components/chess/PuzzleHub";
import bankIndex from "@/content/chess/puzzle-bank.json";
import { PUZZLE_THEMES, type PuzzleTheme } from "@/content/chess/puzzles";
import { chessContent } from "@/content/chess/content";
import { matingMovesIn } from "@/lib/engine/search";
import {
  judgeLineMove,
  ladderOrder,
  parseRows,
  pickNext,
  playUci,
  solutionLine,
  themeOfKey,
  type BankPuzzle,
} from "@/lib/puzzleBank";
import { ratePuzzle, showsRatingNumber, startRating, starsFor, targetRating } from "@/lib/puzzleRating";
import { accuracy, solvedCount, strongWeak, themeOf, themeStats } from "@/lib/puzzleStats";
import {
  DEFAULT_STATE,
  chessPuzzleRated,
  getState,
  replaceState,
  sanitize,
  woodpeckerSolved,
  woodpeckerStart,
} from "@/lib/store";
import { mergeStates } from "@/lib/sync";

const DIR = path.join(process.cwd(), "public", "puzzles");
const read = (name: string) =>
  JSON.parse(fs.readFileSync(path.join(DIR, `${name}.json`), "utf8")) as { theme: string; puzzles: never[] };
const themes = Object.keys(bankIndex.themes) as PuzzleTheme[];
const bank = new Map(themes.map((theme) => [theme, parseRows(read(theme).puzzles, theme)]));
const all = [...bank.values()].flat();
const mix = parseRows(read("mix").puzzles);

describe("банк задач: файлы", () => {
  it("темы банка — наши темы; оглавление совпадает с файлами", () => {
    const ours = new Set(PUZZLE_THEMES.map((t) => t.id));
    for (const theme of themes) {
      expect(ours.has(theme), theme).toBe(true);
      const list = bank.get(theme)!;
      const info = bankIndex.themes[theme as keyof typeof bankIndex.themes];
      expect(list.length, theme).toBe(info.count);
      expect(list[0].rating).toBe(info.min);
      expect(list.at(-1)!.rating).toBe(info.max);
      expect(list.length, theme).toBeGreaterThanOrEqual(200);
    }
    expect(all.length).toBe(bankIndex.total);
    expect(mix.length).toBe(bankIndex.mix);
    // Пат — только задачи школы.
    expect(themes).not.toContain("stalemate");
  });

  it("у каждой темы есть подсказка на обоих языках — у задач из базы своих текстов нет", () => {
    for (const lang of ["ru", "uz"] as const)
      for (const theme of chessContent(lang).themes)
        expect(theme.hint.length, `${lang} ${theme.id}`).toBeGreaterThan(20);
  });

  it("задачи упорядочены по рейтингу, id не повторяются, общий набор — из тех же задач", () => {
    const keys = new Set<string>();
    for (const [theme, list] of bank) {
      for (let i = 1; i < list.length; i++) expect(list[i].rating).toBeGreaterThanOrEqual(list[i - 1].rating);
      for (const p of list) {
        expect(keys.has(p.id), `${theme}/${p.id} встречается дважды`).toBe(false);
        keys.add(p.id);
        expect(themeOfKey(p.key)).toBe(theme);
      }
    }
    const byKey = new Set(all.map((p) => p.key));
    for (const p of mix) expect(byKey.has(p.key), p.key).toBe(true);
  });

  it("каждая задача законна: ходы UCI, не длиннее трёх своих ходов, рейтинг 400–1900, мат — это мат", () => {
    const bad: string[] = [];
    for (const p of all) {
      const chess = new Chess(p.fen);
      if (!/^[0-9A-Za-z]{5}$/.test(p.id)) bad.push(`${p.key}: id`);
      if (p.moves.length % 2 || p.moves.length > 6) bad.push(`${p.key}: длина ${p.moves.length}`);
      if (p.rating < 400 || p.rating >= 1900) bad.push(`${p.key}: рейтинг ${p.rating}`);
      try {
        for (const uci of p.moves) {
          if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci)) throw new Error(uci);
          chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
        }
      } catch (e) {
        bad.push(`${p.key}: ход ${(e as Error).message}`);
        continue;
      }
      if (p.mate && (!chess.isCheckmate() || p.moves.length !== p.mate * 2)) bad.push(`${p.key}: не мат в ${p.mate}`);
    }
    expect(bad).toEqual([]);
    // Почти 5 000 задач — около пяти секунд даже на быстрой машине; вместе с другими тестами бывает дольше.
  }, 60_000);

  it("свой движок подтверждает маты: все маты в 1 и 2 хода и каждый четвёртый мат в 3", () => {
    const bad: string[] = [];
    let checked = 0;
    for (const p of all.filter((x) => x.mate > 0)) {
      if (p.mate === 3 && checked++ % 4) continue;
      const fen = playUci(p.fen, p.moves[0])!.fen;
      if (!matingMovesIn(fen, p.mate).includes(p.moves[1])) bad.push(p.key);
    }
    expect(bad).toEqual([]);
  }, 60_000);
});

const puzzle = (over: Partial<BankPuzzle>): BankPuzzle => ({
  key: "fork/aaaaa",
  id: "aaaaa",
  theme: "fork",
  fen: "",
  moves: [],
  rating: 1000,
  mate: 0,
  ...over,
});

describe("задача из базы на доске", () => {
  const line = ["e2e4", "e7e5", "g1f3"];

  it("ход из строки — ответ соперника из неё же; последний ход — решено; другой ход — ошибка", () => {
    expect(judgeLineMove(line, 0, { uci: "e2e4", mate: false })).toEqual({ kind: "reply", reply: "e7e5" });
    expect(judgeLineMove(line, 2, { uci: "g1f3", mate: false })).toEqual({ kind: "solved" });
    expect(judgeLineMove(line, 0, { uci: "d2d4", mate: false })).toEqual({ kind: "wrong" });
  });

  it("любой мат засчитывается, превращение сравнивается вместе с фигурой", () => {
    expect(judgeLineMove(line, 0, { uci: "d1h5", mate: true })).toEqual({ kind: "solved" });
    expect(judgeLineMove(["e7e8n"], 0, { uci: "e7e8q", mate: false })).toEqual({ kind: "wrong" });
    expect(judgeLineMove(["e7e8n"], 0, { uci: "e7e8n", mate: false })).toEqual({ kind: "solved" });
  });

  it("решение записью — ходы считаются от единицы, за белых и за чёрных", () => {
    const white = bank.get("mate1")!.find((p) => playUci(p.fen, p.moves[0])!.fen.split(" ")[1] === "w")!;
    expect(solutionLine(white)).toMatch(/^1\. \S+#$/);
    const black = bank.get("mate2")!.find((p) => playUci(p.fen, p.moves[0])!.fen.split(" ")[1] === "b")!;
    expect(solutionLine(black)).toMatch(/^1… \S+ 2\. \S+ \S+#$/);
    expect(solutionLine(black, (s) => `[${s}]`)).toContain("[");
  });
});

describe("выбор задач", () => {
  const list = [400, 600, 800, 1000, 1200, 1400].map((rating, i) => puzzle({ key: `fork/p${i}`, id: `p${i}`, rating }));

  it("ещё не встречавшаяся и ближе всего к нужному рейтингу; всё встречалось — ничего", () => {
    expect(
      pickNext(
        list,
        1000,
        () => false,
        () => 0,
      )!.rating,
    ).toBe(1000);
    expect(
      pickNext(
        list,
        1000,
        (k) => k === "fork/p3",
        () => 0,
      )!.rating,
    ).not.toBe(1000);
    expect(pickNext(list, 1000, () => true)).toBeUndefined();
    // Случайная — только из пяти ближайших.
    const far = new Set(
      [0.999, 0.5, 0.2].map(
        (r) =>
          pickNext(
            list,
            400,
            () => false,
            () => r,
          )!.rating,
      ),
    );
    expect([...far].every((r) => r <= 1200)).toBe(true);
  });

  it("лесенка для «Серии» и «Шторма»: от нужного рейтинга и всё труднее, без повторов", () => {
    const order = ladderOrder(mix, 800, seededRandom(0.42));
    expect(order.length).toBeGreaterThan(30);
    expect(order[0].rating).toBeGreaterThanOrEqual(800);
    expect(order[0].rating).toBeLessThan(900);
    expect(new Set(order.map((p) => p.key)).size).toBe(order.length);
    for (let i = 1; i < order.length; i++) expect(order[i].rating).toBeGreaterThanOrEqual(order[i - 1].rating);
  });

  it("«Дятел»: 20 задач около своего уровня, не больше двух из темы, сначала — новые", () => {
    const seen = new Set(mix.slice(0, 300).map((p) => p.key));
    const keys = woodpeckerSet(mix, 900, (k) => seen.has(k), seededRandom(0.7));
    expect(keys).toHaveLength(WOODPECKER_SIZE);
    expect(new Set(keys).size).toBe(WOODPECKER_SIZE);
    const perTheme = new Map<string, number>();
    for (const k of keys) perTheme.set(themeOfKey(k)!, (perTheme.get(themeOfKey(k)!) ?? 0) + 1);
    expect(Math.max(...perTheme.values())).toBeLessThanOrEqual(2);
    expect(keys.some((k) => seen.has(k))).toBe(false);
    const ratings = keys.map((k) => mix.find((p) => p.key === k)!.rating);
    expect(Math.max(...ratings.map((r) => Math.abs(r - 900)))).toBeLessThan(400);
  });
});

describe("скрытый рейтинг", () => {
  it("начинается по возрасту", () => {
    expect(startRating(6).r).toBe(500);
    expect(startRating(9).r).toBe(700);
    expect(startRating(15).r).toBe(1000);
    expect(startRating(undefined).r).toBe(600);
  });

  it("решил с первой попытки — растёт, ошибся — падает; чем больше задач, тем спокойнее меняется", () => {
    const me = startRating(9, 0);
    const win = ratePuzzle(me, 700, true, 1);
    const loss = ratePuzzle(me, 700, false, 1);
    expect(win.r).toBeGreaterThan(me.r);
    expect(loss.r).toBeLessThan(me.r);
    expect(win.rd).toBeLessThan(me.rd);
    expect(win.n).toBe(1);
    expect(win.at).toBe(1);
    // Трудная задача решена — рейтинг растёт сильнее, чем за лёгкую.
    expect(ratePuzzle(me, 1100, true).r - me.r).toBeGreaterThan(ratePuzzle(me, 400, true).r - me.r);
    let settled = me;
    for (let i = 0; i < 60; i++) settled = ratePuzzle(settled, settled.r, i % 2 === 0);
    expect(settled.rd).toBe(60);
    const step = Math.abs(ratePuzzle(settled, settled.r, true).r - settled.r);
    expect(step).toBeLessThan(Math.abs(win.r - me.r));
  });

  it("звёзды, число с 10 лет, уровни сложности", () => {
    expect([450, 800, 1100, 1500, 1800].map(starsFor)).toEqual([1, 2, 3, 4, 5]);
    expect(showsRatingNumber(9)).toBe(false);
    expect(showsRatingNumber(10)).toBe(true);
    const me = startRating(10, 0);
    expect(targetRating(me, "easy")).toBeLessThan(targetRating(me));
    expect(targetRating(me, "hard")).toBeGreaterThan(targetRating(me));
  });

  it("первая задача из базы создаёт рейтинг от возраста и сразу его меняет", () => {
    replaceState(sanitize({ settings: { age: 12 } }));
    chessPuzzleRated(1400, true, 5);
    expect(getState().chessRating).toMatchObject({ n: 1, at: 5 });
    expect(getState().chessRating!.r).toBeGreaterThan(1000);
    replaceState(DEFAULT_STATE);
  });
});

describe("статистика по темам", () => {
  it("задачи школы и из базы — в своих темах; сильные и слабые темы — от пяти задач", () => {
    expect(themeOf("m1-backrank")).toBe("mate1");
    expect(themeOf("fork/0009B")).toBe("fork");
    expect(themeOf("nope")).toBeUndefined();
    const progress: Record<string, { misses: number; solvedAt?: number }> = {};
    for (let i = 0; i < 6; i++) progress[`fork/f${i}`] = { misses: 0, solvedAt: 1 };
    for (let i = 0; i < 6; i++) progress[`pin/p${i}`] = { misses: i < 4 ? 1 : 0, solvedAt: 1 };
    progress["skewer/s0"] = { misses: 1 };
    const stats = themeStats(progress);
    expect(stats.get("fork")).toEqual({ theme: "fork", tried: 6, solved: 6, clean: 6 });
    expect(accuracy(stats.get("pin")!)).toBeCloseTo(2 / 6);
    const { strong, weak } = strongWeak(stats);
    expect(strong.map((s) => s.theme)).toEqual(["fork"]);
    expect(weak.map((s) => s.theme)).toEqual(["pin"]);
    expect(solvedCount(progress)).toBe(12);
  });
});

describe("рейтинг и «Дятел» в прогрессе", () => {
  it("сохраняются и проверяются при загрузке; сложность — только известные значения", () => {
    const rating = { r: 900, rd: 120, n: 5, at: 10 };
    const woodpecker = {
      keys: ["fork/a"],
      rounds: [{ ms: 1000, misses: 1, at: 3 }],
      index: 0,
      ms: 0,
      misses: 0,
      at: 4,
    };
    const s = sanitize({ chessRating: rating, chessWoodpecker: woodpecker, settings: { puzzleLevel: "hard" } });
    expect(s.chessRating).toEqual(rating);
    expect(s.chessWoodpecker).toEqual(woodpecker);
    expect(s.settings.puzzleLevel).toBe("hard");
    const broken = sanitize({
      chessRating: { r: "x" },
      chessWoodpecker: { keys: [1] },
      settings: { puzzleLevel: "x" },
    });
    expect(broken.chessRating).toBeUndefined();
    expect(broken.chessWoodpecker).toBeUndefined();
    expect(broken.settings.puzzleLevel).toBeUndefined();
  });

  it("между устройствами побеждает то, где рейтинг и «Дятла» обновляли позже", () => {
    const a = { chessRating: { r: 900, rd: 100, n: 10, at: 10 } };
    const b = { chessRating: { r: 950, rd: 90, n: 12, at: 20 } };
    expect(mergeStates(a, b).chessRating!.r).toBe(950);
    expect(mergeStates(b, a).chessRating!.r).toBe(950);
    expect(mergeStates(a, {}).chessRating!.r).toBe(900);
  });

  it("«Дятел»: задачи круга по порядку, после последней круг записывается; три круга — медаль", () => {
    replaceState(sanitize({}));
    woodpeckerStart(["fork/a", "pin/b"], 1);
    woodpeckerSolved(3000, 1, 2);
    expect(getState().chessWoodpecker).toMatchObject({ index: 1, ms: 3000, misses: 1, rounds: [] });
    woodpeckerSolved(2000, 0, 3);
    expect(getState().chessWoodpecker).toMatchObject({ index: 0, ms: 0, rounds: [{ ms: 5000, misses: 1, at: 3 }] });
    replaceState(DEFAULT_STATE);

    const round = (ms: number, misses = 0) => ({ ms, misses, at: 0 });
    expect(woodpeckerMedal([round(100), round(80)])).toBeNull();
    expect(woodpeckerMedal([round(100), round(70), round(50, 2)])).toBe("🥇");
    expect(woodpeckerMedal([round(100), round(90), round(80, 5)])).toBe("🥈");
    expect(woodpeckerMedal([round(100), round(120), round(110)])).toBe("🥉");
  });
});
