/** Доска: подписи на рамке, звуки ходов, превращение, «почему так нельзя», съеденные фигуры. */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { classifyChange, coordLabels, snapshotOf } from "@/lib/board";
import { illegalReason, isPromotionMove } from "@/lib/chess";
import { PAWN_BATTLE_FEN } from "@/lib/engine/search";
import { capturedPieces, withOdds } from "@/lib/play";

const START = new Chess().fen();

/** Позиция после ходов из начальной (или данной) позиции. */
function after(moves: string[], fen = START): string {
  const c = new Chess(fen);
  for (const m of moves) c.move(m);
  return c.fen();
}

/** Что прозвучит после хода san из позиции fen. */
function soundOf(fen: string, san: string) {
  const next = after([san], fen);
  return classifyChange(snapshotOf(fen), snapshotOf(next), { fen: next });
}

describe("подписи на рамке", () => {
  it("белые: буквы a–h слева направо, цифры 8–1 сверху вниз; чёрные — наоборот", () => {
    expect(coordLabels(8, 8, "white")).toEqual({ files: [..."abcdefgh"], ranks: [..."87654321"] });
    expect(coordLabels(8, 8, "black")).toEqual({ files: [..."hgfedcba"], ranks: [..."12345678"] });
  });
  it("доска N × N (задача о ферзях)", () => {
    expect(coordLabels(5, 5, "white")).toEqual({ files: [..."abcde"], ranks: [..."54321"] });
  });
});

describe("снимок доски", () => {
  it("FEN 8 × 8 и учебная доска с числами больше 9", () => {
    const s = snapshotOf(START);
    expect(Object.keys(s)).toHaveLength(32);
    expect(s.e1).toBe("wK");
    expect(s.d8).toBe("bQ");
    expect(snapshotOf("10/3Q6 w - - 0 1", 10)).toEqual({ d1: "wQ" });
    expect(snapshotOf({ c3: "star", a1: "wR" })).toEqual({ c3: "star", a1: "wR" });
  });
});

describe("звук хода", () => {
  it("ход, взятие, взятие на проходе, рокировки, превращение, шах", () => {
    expect(soundOf(START, "e4")).toEqual({ kind: "move", check: false });
    const capture = after(["e4", "d5"]);
    expect(soundOf(capture, "exd5")?.kind).toBe("capture");
    const ep = after(["e4", "a6", "e5", "d5"]);
    expect(soundOf(ep, "exd6")?.kind).toBe("capture");
    const castle = "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1";
    expect(soundOf(castle, "O-O")?.kind).toBe("castle");
    expect(soundOf(castle, "O-O-O")?.kind).toBe("castle");
    expect(soundOf("r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1", "O-O")?.kind).toBe("castle");
    const promo = "8/4P3/8/8/8/k7/8/K7 w - - 0 1";
    expect(soundOf(promo, "e8=Q")?.kind).toBe("promote");
    expect(soundOf("3r4/4P3/8/8/8/k7/8/K7 w - - 0 1", "exd8=N")?.kind).toBe("promote");
    expect(soundOf("4k3/8/8/8/8/8/8/R3K3 w - - 0 1", "Ra8+")).toEqual({ kind: "move", check: true });
    expect(soundOf("4k3/8/8/8/8/8/4r3/R3K3 w - - 0 1", "Kxe2")).toEqual({ kind: "capture", check: false });
  });

  it("звёздочка собрана; на учебной доске без королей шах не ищем", () => {
    const e = classifyChange({ a1: "wR", a5: "star" }, { a5: "wR" }, { rows: 8, cols: 8 });
    expect(e).toEqual({ kind: "collect", check: false });
    const k = classifyChange(snapshotOf("8/8/8/8/8/8/8/R7 w - - 0 1"), snapshotOf("R7/8/8/8/8/8/8/8 b - - 0 1"), {
      fen: "R7/8/8/8/8/8/8/8 b - - 0 1",
    });
    expect(k).toEqual({ kind: "move", check: false });
  });

  it("тишина: первая отрисовка, та же позиция, новая задача, возврат после ошибки, взятие хода назад", () => {
    const a = snapshotOf(START);
    const b = snapshotOf(after(["e4"]));
    expect(classifyChange(null, a)).toBeNull();
    expect(classifyChange(a, a)).toBeNull();
    expect(classifyChange(a, snapshotOf("4k3/8/8/8/8/8/8/4K3 w - - 0 1"))).toBeNull();
    expect(classifyChange(b, a, { before: a })).toBeNull();
    const c1 = snapshotOf(after(["e4", "d5"]));
    const c2 = snapshotOf(after(["e4", "d5", "exd5"]));
    expect(classifyChange(c2, c1)).toBeNull();
  });
});

describe("превращение и «почему так нельзя»", () => {
  it("ход пешки на последнюю горизонталь — нужно выбрать фигуру", () => {
    expect(isPromotionMove("8/4P3/8/8/8/k7/8/K7 w - - 0 1", "e7", "e8")).toBe(true);
    expect(isPromotionMove("3r4/4P3/8/8/8/k7/8/K7 w - - 0 1", "e7", "d8")).toBe(true);
    expect(isPromotionMove("8/8/8/8/8/k7/4p3/K7 b - - 0 1", "e2", "e1")).toBe(true);
    expect(isPromotionMove("8/8/4P3/8/8/k7/8/K7 w - - 0 1", "e6", "e7")).toBe(false);
  });

  it("причины: король под шахом, связанная фигура, клетка под ударом; обычный промах — без причины", () => {
    // Шах ладьёй по вертикали e: пешка a2 не закрывает.
    expect(illegalReason("4r1k1/8/8/8/8/8/P7/4K3 w - - 0 1", "a2", "a3")).toBe("in-check");
    // Конь e2 связан ладьёй e8.
    expect(illegalReason("4r1k1/8/8/8/8/8/4N3/4K3 w - - 0 1", "e2", "c3")).toBe("pinned");
    // Король не может встать на e2 — её бьёт ладья.
    expect(illegalReason("4r1k1/8/8/8/8/8/8/3K4 w - - 0 1", "d1", "e2")).toBe("king-attacked");
    expect(illegalReason(START, "e2", "e5")).toBeNull();
    expect(illegalReason(START, "e2", "e4")).toBeNull();
  });
});

describe("съеденные фигуры", () => {
  it("обычная партия", () => {
    expect(capturedPieces(START)).toEqual({ w: [], b: [] });
    expect(capturedPieces(after(["e4", "d5", "exd5"]))).toEqual({ w: [], b: ["bP"] });
  });
  it("фора и пешечный бой: никаких «лишних» съеденных с первого хода", () => {
    const odds = withOdds(START, { side: "w", piece: "q" });
    expect(capturedPieces(odds, odds)).toEqual({ w: [], b: [] });
    expect(capturedPieces(PAWN_BATTLE_FEN, PAWN_BATTLE_FEN)).toEqual({ w: [], b: [] });
  });
  it("превращённая пешка — ушедшая пешка, а не лишний ферзь", () => {
    const start = "4k3/4P3/8/8/8/8/8/4K3 w - - 0 1";
    expect(capturedPieces("4k1Q1/8/8/8/8/8/8/4K3 b - - 0 1", start)).toEqual({ w: [], b: [] });
  });
});
