/**
 * Мини-игры без королей (src/lib/engine/mini.ts, src/lib/play.ts): правила победы, ничьи, ход робота
 * и то, что позиции каталога правильные и играются на доске интерфейса (chess.js без проверки королей).
 */
import { describe, expect, it } from "vitest";
import { findMove, makeMove, parseFen, toFen } from "@/lib/engine/board";
import { miniBest, miniResult } from "@/lib/engine/mini";
import { playMove } from "@/lib/chess";
import { MINI_GAMES, miniPlayed, miniText, playStatus, startFen } from "@/lib/play";

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
      reason: "Все фигуры чёрных взяты!",
    });
    expect(playStatus("mini", "8/8/8/8/8/8/8/R2p4 w - - 0 1", [], "uz").reason).toBe(
      "Qoralarning piyodasi chetga yetib bordi!",
    );
    expect(playStatus("mini", "8/8/8/8/8/p7/R7/8 b - - 0 1", []).reason).toBe("Чёрным нечем ходить.");
    // Проиграть может и ребёнок: причина называет цвет, а не «соперника».
    expect(playStatus("mini", "8/p7/8/8/8/8/8/8 w - - 0 1", []).reason).toBe("Все фигуры белых взяты!");
    const fen = "8/p7/8/8/8/8/8/R7 w - - 0 1";
    expect(playStatus("mini", fen, [fen, fen, fen])).toMatchObject({ over: true, winner: "draw" });
    expect(playStatus("mini", "8/p7/8/8/8/8/8/R7 w - - 100 80", [])).toMatchObject({ over: true, winner: "draw" });
    expect(playStatus("mini", fen, [fen])).toEqual({ over: false });
  });
});

describe("пешка на краю — в настоящей игре", () => {
  it("ход пешки на последнюю горизонталь через доску интерфейса кончает игру, пешка остаётся пешкой", () => {
    // Чёрные: пешка a2 идёт на a1; ладья h1 не успевает.
    const raw = playMove("8/8/8/8/8/8/p7/7R b - - 0 1", "a2", "a1", "q")!;
    expect(raw.fen.split(" ")[0]).toBe("8/8/8/8/8/8/8/q6R");
    const played = miniPlayed(raw);
    expect(played.fen.split(" ")[0]).toBe("8/8/8/8/8/8/8/p6R");
    expect(played.san).toBe("a1");
    expect(playStatus("mini", played.fen, [])).toMatchObject({
      over: true,
      winner: "b",
      reason: "Пешка чёрных дошла до края!",
    });
    // Белые в «отряде»: пешка со взятием на последнюю горизонталь.
    const capture = miniPlayed(playMove("2r5/3P4/8/8/8/8/8/R7 w - - 0 1", "d7", "c8", "q")!);
    expect(capture.fen.split(" ")[0]).toBe("2P5/8/8/8/8/8/8/R7");
    expect(playStatus("mini", capture.fen, [], "uz").reason).toBe("Oqlarning piyodasi chetga yetib bordi!");
  });

  it("ход без превращения не меняется", () => {
    const raw = playMove(MINI_GAMES[0].fen, "h1", "h7", "q")!;
    expect(miniPlayed(raw)).toBe(raw);
  });
});

describe("робот", () => {
  it("ладья встаёт перед пешкой, которая шагнёт на край: иначе пешка выигрывает", () => {
    expect(miniBest("8/8/8/8/8/8/p7/7R w - - 0 1", 2)).toBe("h1a1");
  });

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
