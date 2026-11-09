/** Курс «Ферзь»: комбинации проверены перебором chess.js, партии — по записи ходов. */
import { Chess } from "chess.js";
import { describe, expect, it, vi } from "vitest";
import { matingMoves } from "@/lib/chess";

/** Мат не более чем в n ходов белых, где каждый ход белых — шах. */
function mateInChecks(fen: string, n: number): boolean {
  return new Chess(fen).moves({ verbose: true }).some((m) => forcesMate(fen, `${m.from}${m.to}`, n));
}
function forcesMate(fen: string, first: string, n: number): boolean {
  const d = new Chess(fen);
  d.move({ from: first.slice(0, 2), to: first.slice(2, 4) });
  if (!d.inCheck()) return false;
  if (d.isCheckmate()) return true;
  return (
    n > 1 &&
    d.moves({ verbose: true }).every((r) => {
      const e = new Chess(d.fen());
      e.move(r);
      return mateInChecks(e.fen(), n - 1);
    })
  );
}
const play = (moves: string) => {
  const c = new Chess();
  for (const m of moves.split(" ")) c.move(m);
  return c;
};

// Перебор вариантов под общей нагрузкой может идти дольше стандартных 5 секунд.
vi.setConfig({ testTimeout: 30_000 });

describe("курс «Ферзь»: комбинации", () => {
  it("связка: Фxh7# — единственный мат, конь f8 связан", () => {
    expect(matingMoves("R4n1k/4b1pp/8/7Q/8/3B4/6PP/6K1 w - - 0 1")).toEqual(["h5h7"]);
  });

  it("Рети — Тартаковер (Вена, 1910): позиция из партии, Фd8+ — мат в 3, Фxe4 — нет", () => {
    const c = play("e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Qd3 e5 dxe5 Qa5+ Bd2 Qxe5 O-O-O Nxe4");
    const fen = "rnb1kb1r/pp3ppp/2p5/4q3/4n3/3Q4/PPPB1PPP/2KR1BNR w kq - 0 9";
    expect(c.fen()).toBe(fen);
    expect(forcesMate(fen, "d3d8", 3)).toBe(true);
    c.move("Qd8+");
    c.move("Kxd8");
    c.move("Bg5+");
    expect(c.attackers("d8", "w").sort()).toEqual(["d1", "g5"]);
  });

  it("Э. Ласкер — Томас (Лондон, 1912): Фxh7+ — мат шахами, партия кончается матом Крd2#", () => {
    const moves = "d4 e6 Nf3 f5 Nc3 Nf6 Bg5 Be7 Bxf6 Bxf6 e4 fxe4 Nxe4 b6 Ne5 O-O Bd3 Bb7 Qh5 Qe7";
    const c = play(moves);
    const fen = "rn3rk1/pbppq1pp/1p2pb2/4N2Q/3PN3/3B4/PPP2PPP/R3K2R w KQ - 6 11";
    expect(c.fen()).toBe(fen);
    expect(forcesMate(fen, "h5h7", 8)).toBe(true);
    const alt = new Chess(fen);
    alt.move("Nxf6+");
    expect(alt.moves().filter((m) => m.endsWith("xf6"))).toEqual(expect.arrayContaining(["Rxf6", "gxf6", "Qxf6"]));
    const end = play(`${moves} Qxh7+ Kxh7 Nxf6+ Kh6 Neg4+ Kg5 h4+ Kf4 g3+ Kf3 Be2+ Kg2 Rh2+ Kg1 Kd2#`);
    expect(end.isCheckmate()).toBe(true);
  });

  it("завлечение: после Сxh7+ король идёт только на h8, затем Лxf8#", () => {
    const c = new Chess("2R2qk1/5ppp/b5B1/8/8/8/2Q2PPP/7K w - - 0 1");
    c.move("Bxh7+");
    expect(c.moves()).toEqual(["Kh8"]);
    c.move("Kh8");
    c.move("Rxf8#");
    expect(c.isCheckmate()).toBe(true);
  });

  it("спёртый мат: Кf7+ — мат в 4 шахами, быстрее мата нет; Фg8+ — нет", () => {
    const fen = "4r2k/6pp/8/3Q2N1/8/8/6PP/6K1 w - - 0 1";
    expect(forcesMate(fen, "g5f7", 4)).toBe(true);
    expect(mateInChecks(fen, 3)).toBe(false);
    expect(forcesMate(fen, "d5g8", 4)).toBe(false);
  });
});

describe("курс «Ферзь»: ловля ферзя, атака, жертвы", () => {
  const replies = (fen: string, first: string) => {
    const c = new Chess(fen);
    c.move(first);
    return c;
  };
  it("ловля ферзя: после Сc3 на любой ответ белые забирают ферзя; после Сb4 — Фd4", () => {
    const c = replies("6k1/5ppp/8/B7/8/1B6/P2P4/qNK5 w - - 0 1", "Bc3");
    for (const r of c.moves({ verbose: true })) {
      const d = new Chess(c.fen());
      d.move(r);
      const q = d
        .board()
        .flat()
        .find((p) => p?.type === "q" && p.color === "b")!;
      expect(
        d.moves({ verbose: true }).some((m) => m.to === q.square),
        r.san,
      ).toBe(true);
    }
    expect(replies("6k1/5ppp/8/B7/8/1B6/P2P4/qNK5 w - - 0 1", "Bb4").moves()).toContain("Qd4");
  });

  it("взаимодействие: Фxg7# и Фg7# — единственные маты", () => {
    expect(matingMoves("5rk1/5ppp/8/8/6Q1/2B5/5PPP/6K1 w - - 0 1")).toEqual(["g4g7"]);
    expect(matingMoves("5rk1/5p1p/8/7N/3Q4/8/5PPP/6K1 w - - 0 1")).toEqual(["d4g7"]);
  });

  it("нерокировавшийся король: Лe4+ — мат в 2, король идёт только на d8", () => {
    const fen = "4k1B1/3p1pr1/8/7n/1Q5R/8/1K6/8 w - - 0 1";
    expect(forcesMate(fen, "h4e4", 2)).toBe(true);
    expect(replies(fen, "Re4+").moves()).toEqual(["Kd8"]);
  });

  it("жертвы на f7 и тихий ход: верные ходы матуют в 2, неверные — нет", () => {
    const two = (fen: string, first: string) => {
      const c = new Chess(fen);
      c.move({ from: first.slice(0, 2), to: first.slice(2, 4) });
      return (
        c.moves().length > 0 &&
        c.moves({ verbose: true }).every((r) => {
          const e = new Chess(c.fen());
          e.move(r);
          return matingMoves(e.fen()).length > 0;
        })
      );
    };
    expect(two("6k1/3rRpp1/7p/8/8/8/QK3PPP/8 w - - 0 1", "a2f7")).toBe(true);
    expect(two("6k1/3rRpp1/7p/8/8/8/QK3PPP/8 w - - 0 1", "e7f7")).toBe(false);
    expect(two("6k1/b4p1p/1R4p1/6b1/2B2Q2/8/5P2/6K1 w - - 0 1", "f4f7")).toBe(true);
    expect(two("6k1/b4p1p/1R4p1/6b1/2B2Q2/8/5P2/6K1 w - - 0 1", "b6g6")).toBe(false);
    expect(two("3B3k/6pp/8/2b5/8/1Q6/K6P/B7 w - - 0 1", "b3f7")).toBe(true);
    expect(two("3B3k/6pp/8/2b5/8/1Q6/K6P/B7 w - - 0 1", "b3g8")).toBe(false);
  });
});
