/** Повторение задач, шторм, награды, календарь и запись партии в PGN. */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { stormOrder } from "@/components/chess/PuzzleModes";
import { PUZZLES } from "@/content/chess/puzzles";
import { activityDays, awards, dayStreak, earned } from "@/lib/awards";
import { gamePgn } from "@/lib/pgn";
import { withOdds } from "@/lib/play";
import {
  DEFAULT_STATE,
  chessPuzzleMiss,
  chessPuzzleSolved,
  duePuzzles,
  getState,
  isoDay,
  replaceState,
  sanitize,
  type ChessGameRecord,
} from "@/lib/store";

const DAY = 86_400_000;

describe("интервальное повторение задач", () => {
  it("ошибка — повторить завтра; решено без ошибки в срок — следующая коробка; после четвёртой — выучено", () => {
    replaceState(sanitize({}));
    const t0 = new Date(2026, 8, 1, 10).getTime();
    const id = PUZZLES[0].id;
    chessPuzzleMiss(id, t0);
    chessPuzzleSolved(id, false, t0);
    expect(getState().chessPuzzles[id]).toMatchObject({ box: 1, due: isoDay(t0 + DAY) });
    expect(duePuzzles(getState().chessPuzzles, isoDay(t0))).toEqual([]);
    expect(duePuzzles(getState().chessPuzzles, isoDay(t0 + DAY))).toEqual([id]);

    // Решение раньше срока ничего не меняет.
    chessPuzzleSolved(id, true, t0);
    expect(getState().chessPuzzles[id].box).toBe(1);

    let t = t0 + DAY;
    const expected = [3, 7, 21];
    for (const [i, days] of expected.entries()) {
      chessPuzzleSolved(id, true, t);
      expect(getState().chessPuzzles[id]).toMatchObject({ box: i + 2, due: isoDay(t + days * DAY) });
      t += days * DAY;
    }
    chessPuzzleSolved(id, true, t);
    expect(getState().chessPuzzles[id].due).toBeUndefined();
    expect(getState().chessPuzzles[id].box).toBeUndefined();
    expect(getState().chessPuzzles[id].solvedAt).toBe(t0);
    replaceState(DEFAULT_STATE);
  });
});

describe("шторм", () => {
  it("все задачи по одному разу, от лёгких к трудным", () => {
    let s = 3;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const order = stormOrder(rnd);
    expect([...order].sort()).toEqual(PUZZLES.map((p) => p.id).sort());
    const stars = order.map((id) => PUZZLES.find((p) => p.id === id)!.stars);
    expect(stars).toEqual([...stars].sort((a, b) => a - b));
  });
});

describe("награды и календарь", () => {
  it("в начале наград нет, у каждой — цель и понятное описание", () => {
    const list = awards(sanitize({}));
    expect(list.length).toBeGreaterThanOrEqual(20);
    expect(list.filter(earned)).toEqual([]);
    expect(new Set(list.map((a) => a.id)).size).toBe(list.length);
    for (const a of list) {
      expect(a.need).toBeGreaterThan(0);
      expect(a.text).toMatch(/[А-Яа-я]/);
    }
  });

  it("награды приходят за дела", () => {
    const at = new Date(2026, 8, 20, 12).getTime();
    const s = sanitize({
      chessGames: [
        {
          id: "g1",
          at,
          mode: "robot",
          level: 3,
          color: "w",
          result: "win",
          moves: 20,
          analysis: { evals: [], best: [], acc: { w: 85, b: 40 } },
        },
      ],
      chessPuzzles: Object.fromEntries(PUZZLES.slice(0, 10).map((p) => [p.id, { solvedAt: at, misses: 0 }])),
      chessDrills: { storm: 12, find: 25 },
      chessStreak: 11,
    });
    const got = new Set(
      awards(s)
        .filter(earned)
        .map((a) => a.id),
    );
    for (const id of [
      "win-1",
      "win-bishop",
      "puzzles-10",
      "storm-10",
      "coords-20",
      "streak-10",
      "review-1",
      "accuracy-80",
    ])
      expect(got.has(id), id).toBe(true);
    expect(got.has("win-queen")).toBe(false);
    expect(got.has("puzzles-all")).toBe(false);
  });

  it("календарь считает дела по дням, серия — дни подряд", () => {
    const d = (day: number) => new Date(2026, 8, day, 15).getTime();
    const s = sanitize({
      chessGames: [{ id: "a", at: d(10), mode: "robot", level: 1, color: "w", result: "win", moves: 5 }],
      chessPuzzles: {
        x: { solvedAt: d(11), misses: 0 },
        y: { solvedAt: d(12), misses: 0 },
        z: { solvedAt: d(12), misses: 1 },
      },
    });
    const days = activityDays(s);
    expect(days).toEqual({ "2026-09-10": 1, "2026-09-11": 1, "2026-09-12": 2 });
    expect(dayStreak(days, "2026-09-12")).toBe(3);
    expect(dayStreak(days, "2026-09-13")).toBe(3);
    expect(dayStreak(days, "2026-09-14")).toBe(0);
  });
});

describe("PGN", () => {
  it("партия с роботом читается любой программой", () => {
    const g: ChessGameRecord = {
      id: "g2",
      at: new Date(2026, 8, 27).getTime(),
      mode: "robot",
      level: 2,
      color: "b",
      result: "loss",
      winner: "w",
      moves: 4,
      start: new Chess().fen(),
      ucis: ["e2e4", "e7e5", "f1c4", "b8c6", "d1h5", "g8f6", "h5f7"],
    };
    const pgn = gamePgn(g, "ru", "Анна");
    expect(pgn).toContain('[White "Робот «Конь»"]');
    expect(pgn).toContain('[Black "Анна"]');
    expect(pgn).toContain('[Site "Parvoz Edu"]');
    expect(gamePgn(g)).toContain('[Black "Друг"]');
    expect(pgn).toContain('[Result "1-0"]');
    expect(pgn).toContain('[Date "2026.09.27"]');
    expect(pgn).toMatch(/4\. Qxf7# 1-0$/);
    const back = new Chess();
    back.loadPgn(pgn);
    expect(back.isCheckmate()).toBe(true);
  });

  it("партия с форой записывает начальную позицию", () => {
    const start = withOdds(new Chess().fen(), { side: "b", piece: "q" });
    const pgn = gamePgn({
      id: "g3",
      at: 0,
      mode: "two",
      color: "w",
      result: "draw",
      winner: "draw",
      moves: 1,
      start,
      ucis: ["e2e4", "e7e5"],
    });
    expect(pgn).toContain('[SetUp "1"]');
    expect(pgn).toContain(`[FEN "${start}"]`);
    expect(pgn).toMatch(/1\/2-1\/2$/);
    const back = new Chess();
    back.loadPgn(pgn);
    expect(back.history()).toEqual(["e4", "e5"]);
  });
});
