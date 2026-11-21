/**
 * «Сборник задач» (src/lib/puzzleSets.ts): номера по трудности, состояние номера из общего прогресса,
 * счёт, поиск следующей задачи по кругу, главы и адреса экранов.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BANK, parseRows, type BankPuzzle } from "@/lib/puzzleBank";
import {
  SET_CHAPTER,
  chapterOf,
  chapters,
  nextWith,
  parseSetHash,
  setCounts,
  setHashOf,
  setOrder,
  setStatus,
} from "@/lib/puzzleSets";
import type { PuzzleTheme } from "@/content/chess/puzzles";
import type { ChessPuzzleProgress } from "@/lib/state";

const THEMES = Object.keys(BANK.themes);
const read = (theme: string): BankPuzzle[] =>
  parseRows(
    JSON.parse(fs.readFileSync(path.join("public/puzzles", `${theme}.json`), "utf8")).puzzles,
    theme as PuzzleTheme,
  );

describe("порядок сборника", () => {
  it("в каждой теме — все задачи файла, по рейтингу, без повторов; номер не зависит от порядка в файле", () => {
    for (const theme of THEMES) {
      const list = read(theme);
      const order = setOrder(list);
      expect(order).toHaveLength(BANK.themes[theme as PuzzleTheme]!.count);
      expect(new Set(order.map((p) => p.key)).size).toBe(order.length);
      for (let i = 1; i < order.length; i++) expect(order[i].rating).toBeGreaterThanOrEqual(order[i - 1].rating);
      expect(setOrder([...list].reverse()).map((p) => p.key)).toEqual(order.map((p) => p.key));
    }
  });
});

describe("состояние номера и счёт", () => {
  const progress: Record<string, ChessPuzzleProgress> = {
    a: { misses: 0, solvedAt: 1 },
    b: { misses: 2, solvedAt: 1 },
    c: { misses: 1 },
  };
  const keys = ["a", "b", "c", "d", "e"];

  it("не открывалась / с первой попытки / с ошибкой / не решена", () => {
    expect(setStatus(undefined)).toBe("new");
    expect(setStatus(progress.a)).toBe("clean");
    expect(setStatus(progress.b)).toBe("solved");
    expect(setStatus(progress.c)).toBe("open");
  });

  it("счёт по номерам", () => {
    expect(setCounts(keys, progress)).toEqual({ total: 5, clean: 1, solved: 1, open: 1, fresh: 2 });
  });

  it("следующая — по кругу, текущая проверяется последней; нет такой — -1", () => {
    expect(nextWith(keys, progress, ["new"])).toBe(3);
    expect(nextWith(keys, progress, ["new"], 3)).toBe(4);
    expect(nextWith(keys, progress, ["new"], 4)).toBe(3);
    expect(nextWith(keys, progress, ["open"], 2)).toBe(2);
    expect(nextWith(keys, { ...progress, c: { misses: 1, solvedAt: 2 } }, ["open"], 2)).toBe(-1);
    expect(nextWith([], progress, ["new"])).toBe(-1);
  });
});

describe("главы и адреса", () => {
  it("главы по 50 номеров, последняя — короче", () => {
    expect(SET_CHAPTER).toBe(50);
    expect(chapters(310)).toHaveLength(7);
    expect(chapters(310).at(-1)).toEqual({ from: 300, to: 310 });
    expect(chapters(50)).toEqual([{ from: 0, to: 50 }]);
    expect(chapterOf(0)).toBe(0);
    expect(chapterOf(49)).toBe(0);
    expect(chapterOf(50)).toBe(1);
    expect(chapterOf(-1)).toBe(0);
  });

  it("адреса туда и обратно; чужие и битые адреса не принимаются", () => {
    expect(parseSetHash("#sets", THEMES)).toEqual({ kind: "index" });
    expect(parseSetHash(setHashOf("fork"), THEMES)).toEqual({ kind: "grid", theme: "fork" });
    expect(parseSetHash(setHashOf("fork", 11), THEMES)).toEqual({
      kind: "puzzle",
      theme: "fork",
      index: 11,
      fix: false,
    });
    expect(setHashOf("pin", 0, true)).toBe("#fix-pin-1");
    expect(parseSetHash("#fix-pin-1", THEMES)).toEqual({ kind: "puzzle", theme: "pin", index: 0, fix: true });
    expect(parseSetHash("#set-nothing", THEMES)).toBeNull();
    expect(parseSetHash("#set-fork-0", THEMES)).toBeNull();
    expect(parseSetHash("#fix-fork", THEMES)).toBeNull();
    expect(parseSetHash("#set-fork-12345", THEMES)).toBeNull();
    expect(parseSetHash("#theme-fork", THEMES)).toBeNull();
  });
});
