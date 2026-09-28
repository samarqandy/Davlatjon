/** Разбор партии, фора, часы и тренажёр координат. */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { sanOf, ruSan } from "@/lib/chess";
import { analysisRecord, analyzeGame, isAlmostBest, moveAccuracy, winChance } from "@/lib/engine/analysis";
import { readTask, readTaskSolved, squareColor, squareOptions } from "@/lib/drills";
import { CLOCKS, ODDS_PIECES, formatClock, withOdds } from "@/lib/play";

const START = new Chess().fen();

function seeded(seed = 7) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

describe("разбор партии", () => {
  it("шансы и точность", () => {
    expect(winChance(0)).toBeCloseTo(50);
    expect(winChance(300)).toBeGreaterThan(70);
    expect(winChance(-300)).toBeLessThan(30);
    expect(winChance(100000)).toBeGreaterThan(99);
    expect(moveAccuracy(0)).toBeCloseTo(100, 0);
    expect(moveAccuracy(30)).toBeLessThan(30);
  });

  it("детский мат: чёрные зевают мат, белые ставят его", () => {
    const ucis = ["e2e4", "e7e5", "f1c4", "b8c6", "d1h5", "g8f6", "h5f7"];
    const r = analyzeGame(START, ucis);
    expect(r.plies).toHaveLength(7);
    const nf6 = r.plies[5];
    expect(nf6.kind).toBe("blunder");
    expect(nf6.reason).toMatch(/мат/);
    expect(nf6.reason).toContain("Фxf7#");
    expect(r.plies[6].kind).toBe("mate");
    expect(r.sides.w.counts.blunder).toBe(0);
    expect(r.sides.w.accuracy).toBeGreaterThan(r.sides.b.accuracy);
    expect(r.whiteWin).toHaveLength(8);
    expect(r.whiteWin[7]).toBeGreaterThan(99);
  });

  it("ферзь под ударом и пропущенное взятие объясняются словами", () => {
    const r = analyzeGame(START, ["e2e4", "e7e5", "g1f3", "d8h4", "a2a3"]);
    const qh4 = r.plies[3];
    expect(["mistake", "blunder"]).toContain(qh4.kind);
    expect(qh4.reason).toMatch(/ферзя/);
    expect(qh4.reason).toMatch(/Кxh4/);
    const a3 = r.plies[4];
    expect(["mistake", "blunder"]).toContain(a3.kind);
    expect(a3.reason).toMatch(/Можно было взять ферзя: Кxh4/);
  });

  it("сохраняемая запись: оценки, точность и ошибки для задач", () => {
    const ucis = ["e2e4", "e7e5", "f1c4", "b8c6", "d1h5", "g8f6", "h5f7"];
    const r = analyzeGame(START, ucis);
    const evals = r.whiteWin.map((_, i) => ({ score: 0, best: i < ucis.length ? ucis[i] : null }));
    const rec = analysisRecord(evals, r);
    expect(rec.evals).toHaveLength(8);
    expect(rec.acc).toEqual({ w: r.sides.w.accuracy, b: r.sides.b.accuracy });
    const m = rec.moments!.find((x) => x.ply === 6)!;
    expect(m.kind).toBe("blunder");
    expect(m.side).toBe("b");
    expect(new Chess(m.fen).turn()).toBe("b");
  });

  it("ход почти как лучший — засчитывается", () => {
    // Любое взятие ферзя конём — лучший ход; ход ладьёй — нет.
    const fen = "rnb1kbnr/pppp1ppp/8/4p3/4P2q/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3";
    expect(isAlmostBest(fen, "f3h4", "f3h4")).toBe(true);
    expect(isAlmostBest(fen, "a2a3", "f3h4")).toBe(false);
  });
});

describe("фора и часы", () => {
  it("фигура убрана, позиция правильная, рокировка с убранной ладьёй запрещена", () => {
    for (const o of ODDS_PIECES)
      for (const side of ["w", "b"] as const) {
        const fen = withOdds(START, { side, piece: o.id });
        const chess = new Chess(fen);
        expect(chess.get(o.square[side] as never)).toBeFalsy();
        expect(chess.board().flat().filter(Boolean)).toHaveLength(31);
      }
    expect(withOdds(START, { side: "w", piece: "r" }).split(" ")[2]).toBe("Kkq");
    expect(withOdds(START, { side: "b", piece: "r" }).split(" ")[2]).toBe("KQk");
  });

  it("время на часах", () => {
    expect(formatClock(5 * 60_000)).toBe("5:00");
    expect(formatClock(61_500)).toBe("1:02");
    expect(formatClock(8_340)).toBe("8.3");
    expect(formatClock(-5)).toBe("0.0");
    expect(new Set(CLOCKS.map((c) => c.id)).size).toBe(CLOCKS.length);
  });
});

describe("тренажёр координат", () => {
  it("цвет клеток и варианты названий", () => {
    expect(squareColor("a1")).toBe("dark");
    expect(squareColor("h1")).toBe("light");
    expect(squareColor("e4")).toBe("light");
    expect(squareColor("d4")).toBe("dark");
    const rnd = seeded();
    for (let i = 0; i < 50; i++) {
      const opts = squareOptions("e4", rnd);
      expect(opts).toHaveLength(4);
      expect(new Set(opts).size).toBe(4);
      expect(opts).toContain("e4");
      for (const o of opts) expect(o).toMatch(/^[a-h][1-8]$/);
    }
  });

  it("«прочитай ход»: запись совпадает с ходом, ход возможен", () => {
    const rnd = seeded(11);
    for (let i = 0; i < 25; i++) {
      const t = readTask(rnd);
      expect(ruSan(sanOf(t.fen, t.uci))).toBe(t.notation);
      expect(readTaskSolved(t, t.uci.slice(0, 2), t.uci.slice(2, 4))).toBe(true);
      const chess = new Chess(t.fen);
      expect(chess.moves({ verbose: true }).some((m) => m.from + m.to === t.uci.slice(0, 4))).toBe(true);
    }
  });
});
