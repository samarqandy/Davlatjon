/**
 * Мини-игры без королей (src/lib/engine/mini.ts, src/lib/play.ts): правила победы, ничьи, ход робота
 * и то, что позиции каталога правильные и играются на доске интерфейса (chess.js без проверки королей).
 */
import { describe, expect, it } from "vitest";
import { findMove, makeMove, parseFen, toFen } from "@/lib/engine/board";
import { miniBest, miniResult } from "@/lib/engine/mini";
import { playMove } from "@/lib/chess";
import { MINI_GAMES, miniText, playStatus, startFen } from "@/lib/play";

const result = (fen: string) => miniResult(parseFen(fen));

describe("каталог мини-игр", () => {
  it("пять игр по порядку книги; без королей; белые ходят первыми; тексты на двух языках без кириллицы в узбекском", () => {
    expect(MINI_GAMES.map((g) => g.id)).toEqual(["rook", "bishop", "knight", "queen", "squad"]);
    for (const g of MINI_GAMES) {
      expect(g.fen.split(" ")[0], g.id).not.toMatch(/[kK]/);
      expect(g.fen.split(" ")[1]).toBe("w");
      expect(result(g.fen), g.id).toBeNull();
      expect(startFen("mini", undefined, g)).toBe(g.fen);
      expect(miniText(g, "uz").name).not.toMatch(/[А-Яа-яЁё]/);
      expect(miniText(g, "uz").about).not.toMatch(/[А-Яа-яЁё'`’]/);
      expect(miniText(g, "ru").name).toBe(g.name);
    }
  });

  it("первые ходы делаются на доске интерфейса", () => {
    for (const g of MINI_GAMES) {
      const uci = miniBest(g.fen, 1, () => 0)!;
      const played = playMove(g.fen, uci.slice(0, 2), uci.slice(2, 4), "q");
      expect(played, g.id).not.toBeNull();
      expect(result(played!.fen), g.id).toBeNull();
    }
  });
});

describe("правила", () => {
  it("все фигуры соперника взяты — победа", () => {
    expect(result("8/8/8/8/8/8/8/R7 b - - 0 1")).toBe("w");
    expect(result("8/p7/8/8/8/8/8/8 w - - 0 1")).toBe("b");
  });

  it("пешка на последней горизонтали — победа своей стороны", () => {
    expect(result("8/8/8/8/8/8/8/R2p4 w - - 0 1")).toBe("b");
    expect(result("3P4/8/8/8/8/8/p7/8 b - - 0 1")).toBe("w");
  });

  it("нечем ходить — проиграл", () => {
    // Пешка чёрных упёрлась в ладью, других фигур нет.
    expect(result("8/8/8/8/8/p7/R7/8 b - - 0 1")).toBe("w");
  });

  it("причина победы и ничьи — словами; повторение и 50 ходов — ничья", () => {
    expect(playStatus("mini", "8/8/8/8/8/8/8/R7 b - - 0 1", [])).toMatchObject({
      over: true,
      winner: "w",
      reason: "Все фигуры соперника взяты!",
    });
    expect(playStatus("mini", "8/8/8/8/8/8/8/R2p4 w - - 0 1", [], "uz").reason).toBe(
      "Qoralarning piyodasi chetga yetib bordi!",
    );
    expect(playStatus("mini", "8/8/8/8/8/p7/R7/8 b - - 0 1", []).reason).toBe("Сопернику нечем ходить.");
    const fen = "8/p7/8/8/8/8/8/R7 w - - 0 1";
    expect(playStatus("mini", fen, [fen, fen, fen])).toMatchObject({ over: true, winner: "draw" });
    expect(playStatus("mini", "8/p7/8/8/8/8/8/R7 w - - 100 80", [])).toMatchObject({ over: true, winner: "draw" });
    expect(playStatus("mini", fen, [fen])).toEqual({ over: false });
  });
});

describe("робот", () => {
  it("забирает незащищённую фигуру и проводит пешку, когда её не догнать", () => {
    // Ладья под боем пешки — робот за чёрных берёт.
    expect(miniBest("8/8/8/8/8/1p6/R7/8 b - - 0 1", 1)).toBe("b3a2");
    // Пешка в шаге от края — идёт в ферзи, то есть побеждает.
    expect(miniBest("8/8/8/8/8/8/p7/7R b - - 0 1", 2)).toBe("a2a1q");
  });

  it("ладья за белых не отдаёт пешке проход: «хитрый» ход перекрывает поле", () => {
    // Пешка a3 идёт вперёд; ладья должна успеть на первую горизонталь или забрать её.
    const uci = miniBest("8/8/8/8/8/p7/8/7R w - - 0 1", 3)!;
    const pos = parseFen("8/8/8/8/8/p7/8/7R w - - 0 1");
    makeMove(pos, findMove(pos, uci)!);
    const reply = miniBest(toFen(pos), 3)!;
    makeMove(pos, findMove(pos, reply)!);
    expect(miniResult(pos)).not.toBe("b");
  });
});
