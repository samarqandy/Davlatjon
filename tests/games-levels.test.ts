/**
 * Партии по уровням (GAMES-3, scripts/games/build-levels.mjs): в файлах нет ников, ссылок, турниров и точных дат;
 * рейтинги в коридоре уровня и округлены; каждая партия проигрывается по правилам; «мат» и «решающая ошибка»
 * посчитаны верно; отбор и PGN работают.
 */
import { Chess } from "chess.js";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { OPENING_NAMES } from "@/content/chess/openingNames";
import { libraryPgn } from "@/lib/games/library";
import {
  EMPTY_LEVEL_QUERY,
  LEVELS,
  filterLevel,
  levelOf,
  levelUrl,
  loadLevel,
  prepareLevel,
  resetLevelsForTest,
  type LevelFile,
} from "@/lib/games/levels";

const read = (level: 1 | 2 | 3) =>
  JSON.parse(fs.readFileSync(path.join("public", levelUrl(level)), "utf8")) as LevelFile;
const FILES = LEVELS.map((level) => ({ level, file: read(level) }));
const ALLOWED = new Set(["id", "lv", "we", "be", "y", "mo", "res", "tc", "m", "op", "eco", "mt", "x"]);

describe("файлы уровней", () => {
  it("по 1000 партий; лицензия CC0 и источник; уровень и коридор рейтинга в файле", () => {
    for (const { level, file } of FILES) {
      expect(file.level).toBe(level);
      expect(file.count).toBe(1000);
      expect(file.games).toHaveLength(1000);
      expect(file.license).toBe("CC0");
      expect(file.sourceUrl).toBe("https://database.lichess.org/");
      expect(file.ratingFrom).toBe([1000, 1400, 1800][level - 1]);
      expect(fs.statSync(path.join("public", levelUrl(level))).size).toBeLessThan(700_000);
    }
  });

  it("ничего, что указывает на аккаунт: только наши поля, без ников, ссылок, турниров и дат", () => {
    for (const { file } of FILES) {
      for (const g of file.games) {
        for (const key of Object.keys(g)) expect(ALLOWED.has(key), `${g.id}: ${key}`).toBe(true);
        expect(JSON.stringify(g), g.id).not.toMatch(/lichess\.org\/|https?:/);
        expect(g.id).toMatch(/^lv[123]-\d{4}$/);
      }
    }
  });

  it("рейтинги — в коридоре уровня (с учётом округления до 50), разница не больше 200", () => {
    for (const { file } of FILES) {
      for (const g of file.games) {
        for (const r of [g.we!, g.be!]) {
          expect(r % 50, g.id).toBe(0);
          expect(r, g.id).toBeGreaterThanOrEqual(file.ratingFrom);
          expect(r, g.id).toBeLessThanOrEqual(file.ratingTo + 1);
        }
        expect(Math.abs(g.we! - g.be!), g.id).toBeLessThanOrEqual(250);
      }
    }
  });

  it("партия проигрывается по правилам, не короче 20 ходов; «мат» — правда мат; ничьих не больше трети", () => {
    for (const { file } of FILES) {
      let draws = 0;
      for (const g of file.games) {
        const chess = new Chess();
        const moves = g.m.split(" ");
        expect(moves.length, g.id).toBeGreaterThanOrEqual(40);
        for (const u of moves) chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
        expect(chess.isCheckmate(), g.id).toBe(g.mt === 1);
        if (g.mt) expect(g.res, g.id).toBe(chess.turn() === "w" ? "0-1" : "1-0");
        if (g.res === "1/2-1/2") draws++;
        expect(["r", "c"]).toContain(g.tc);
      }
      expect(draws).toBeLessThanOrEqual(1000 / 3);
    }
  }, 120_000);

  it("решающая ошибка — ход проигравшей стороны внутри партии; у ничьих её нет", () => {
    let marked = 0;
    for (const { file } of FILES) {
      for (const g of file.games) {
        if (g.x === undefined) continue;
        marked++;
        expect(g.res, g.id).not.toBe("1/2-1/2");
        expect(g.x, g.id).toBeGreaterThanOrEqual(1);
        expect(g.x, g.id).toBeLessThanOrEqual(g.m.split(" ").length);
        // Полуход x нечётный — ход белых: значит, проиграли белые.
        expect(g.x % 2 === 1 ? "0-1" : "1-0", g.id).toBe(g.res);
      }
    }
    expect(marked).toBeGreaterThan(600);
  });

  it("дебют и код ECO — из нашего списка названий", () => {
    for (const { file } of FILES) {
      for (const g of file.games) {
        if (g.op) expect(OPENING_NAMES[g.op], `${g.id}: ${g.op}`).toBeTruthy();
        if (g.eco) expect(g.eco).toMatch(/^[A-E]\d\d$/);
      }
      expect(file.games.filter((g) => g.op).length).toBeGreaterThan(950);
    }
  });
});

describe("уровни в коде", () => {
  afterEach(() => resetLevelsForTest());
  const games = prepareLevel(read(1));

  it("уровень по id; партия без имён и турнира, источник — база Lichess", () => {
    expect(levelOf("lv2-0017")).toBe(2);
    expect(levelOf("lb-abc")).toBeNull();
    expect(levelOf("lv4-0001")).toBeNull();
    expect(games[0]).toMatchObject({ w: "", b: "", ev: "", src: "https://database.lichess.org/", set: "level-1" });
    expect(games[0].plies).toBe(games[0].m.split(" ").length);
  });

  it("отбор: мат, решающая ошибка, короткие, результат, группа дебютов", () => {
    const mates = filterLevel(games, { ...EMPTY_LEVEL_QUERY, mate: true });
    expect(mates.length).toBeGreaterThan(100);
    expect(mates.every((g) => g.mt === 1)).toBe(true);
    expect(filterLevel(games, { ...EMPTY_LEVEL_QUERY, mistake: true }).every((g) => g.x !== undefined)).toBe(true);
    expect(filterLevel(games, { ...EMPTY_LEVEL_QUERY, short: true }).every((g) => g.plies <= 60)).toBe(true);
    expect(filterLevel(games, { ...EMPTY_LEVEL_QUERY, result: "0-1" }).every((g) => g.res === "0-1")).toBe(true);
    const italian = filterLevel(games, { ...EMPTY_LEVEL_QUERY, op: "g:italian" });
    expect(italian.length).toBeGreaterThan(10);
    expect(italian.every((g) => g.op === "Italian Game")).toBe(true);
    expect(filterLevel(games, EMPTY_LEVEL_QUERY)).toHaveLength(1000);
  });

  it("PGN партии уровня: имена «?», рейтинги, месяц, источник и CC0", () => {
    const g = games[0];
    const pgn = libraryPgn(g, { license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" });
    const chess = new Chess();
    chess.loadPgn(pgn);
    expect(chess.getHeaders()).toMatchObject({
      White: "?",
      Black: "?",
      WhiteElo: String(g.we),
      Site: "lichess.org",
      Date: `${g.y}.${String(g.mo).padStart(2, "0")}.??`,
      Source: "https://database.lichess.org/",
      License: "CC0 https://creativecommons.org/publicdomain/zero/1.0/",
    });
    expect(chess.history().length).toBe(g.plies);
  });

  it("загрузка: один раз на уровень; сбой — следующая попытка грузит заново", async () => {
    const calls: string[] = [];
    const ok = (async (url: string) => {
      calls.push(url);
      return { ok: true, json: async () => read(2) } as Response;
    }) as unknown as typeof fetch;
    const bad = (async (url: string) => {
      calls.push(url);
      return { ok: false, status: 503 } as Response;
    }) as unknown as typeof fetch;
    await expect(loadLevel(2, bad)).rejects.toThrow();
    const loaded = await loadLevel(2, ok);
    expect(loaded.games).toHaveLength(1000);
    expect(loaded.meta.url).toBe(levelUrl(2));
    await loadLevel(2, ok);
    expect(calls).toEqual([levelUrl(2), levelUrl(2)]);
  });
});
