/** Курс «Ладья»: пат, вечный шах и слабое превращение — объяснения уроков проверены по ходам chess.js. */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";

const replies = (c: Chess) => c.moves();

describe("курс «Ладья»: спасительные приёмы", () => {
  it("бешеная ладья: на Лc8+ единственный ответ Крxc8 — пат; после Лc2 мат Фe1#", () => {
    const c = new Chess("1k6/pp6/8/8/6p1/4q1Pp/7P/2R4K w - - 0 1");
    c.move("Rc8+");
    expect(replies(c)).toEqual(["Kxc8"]);
    c.move("Kxc8");
    expect(c.isStalemate()).toBe(true);
    const d = new Chess("1k6/pp6/8/8/6p1/4q1Pp/7P/2R4K w - - 0 1");
    d.move("Rc2");
    d.move("Qe1+");
    expect(d.isCheckmate()).toBe(true);
  });

  it("вечный шах: Фf6+ Крg8 Фg5+ Крh8 Фf6+ — у чёрных каждый раз единственный ход", () => {
    const start = "5r1k/5p1p/8/8/8/7K/pp3Q2/8 w - - 0 1";
    const c = new Chess(start);
    c.move("Qf6+");
    expect(replies(c)).toEqual(["Kg8"]);
    c.move("Kg8");
    c.move("Qg5+");
    expect(replies(c)).toEqual(["Kh8"]);
    c.move("Kh8");
    c.move("Qf6+");
    expect(replies(c)).toEqual(["Kg8"]);
  });

  it("слабое превращение: c8=Ф — пат, c8=Л оставляет ход Крa6", () => {
    const q = new Chess("8/k1P5/2K5/8/8/8/8/8 w - - 0 1");
    q.move("c8=Q");
    expect(q.isStalemate()).toBe(true);
    const r = new Chess("8/k1P5/2K5/8/8/8/8/8 w - - 0 1");
    r.move("c8=R");
    expect(replies(r)).toEqual(["Ka6"]);
  });

  it("ловушка пата: Фf7 и Фc7 — пат, Фf8 и Фc8 — мат", () => {
    for (const [fen, bad, good] of [
      ["7k/8/6K1/8/8/8/8/5Q2 w - - 0 1", "Qf7", "Qf8#"],
      ["k7/8/1K6/8/8/8/8/2Q5 w - - 0 1", "Qc7", "Qc8#"],
    ]) {
      const a = new Chess(fen);
      a.move(bad);
      expect(a.isStalemate(), fen).toBe(true);
      const b = new Chess(fen);
      b.move(good);
      expect(b.isCheckmate(), fen).toBe(true);
    }
  });
});
