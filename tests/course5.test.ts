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

describe("курс «Ферзь»: классика и итоговый тест", () => {
  it("Стейниц — Барделебен (Гастингс, 1895): позиция из партии, показанный мат ведёт к мату", () => {
    const moves =
      "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 d5 exd5 Nxd5 O-O Be6 Bg5 Be7 Bxd5 Bxd5 Nxd5 Qxd5 Bxe7 Nxe7 Re1 f6 Qe2 Qd7 Rac1 c6 d5 cxd5 Nd4 Kf7 Ne6 Rhc8 Qg4 g6 Ng5+ Ke8";
    const c = play(moves);
    expect(c.fen().split(" ")[0]).toBe("r1r1k3/pp1qn2p/5pp1/3p2N1/6Q1/8/PP3PPP/2R1R1K1");
    const end = play(
      `${moves} Rxe7+ Kf8 Rf7+ Kg8 Rg7+ Kh8 Rxh7+ Kg8 Rg7+ Kh8 Qh4+ Kxg7 Qh7+ Kf8 Qh8+ Ke7 Qg7+ Ke8 Qg8+ Ke7 Qf7+ Kd8 Qf8+ Qe8 Nf7+ Kd7 Qd6#`,
    );
    expect(end.isCheckmate()).toBe(true);
    // Взять ладью g7 королём — ферзь g4 забирает ферзя d7 с шахом.
    const g = play(`${moves} Rxe7+ Kf8 Rf7+ Kg8 Rg7+ Kxg7 Qxd7+`);
    expect(g.inCheck()).toBe(true);
  });

  it("Ротлеви — Рубинштейн (Лодзь, 1907): позиция из партии; после Лh3 почти на любой ход белых — мат в 1", () => {
    const moves =
      "d4 d5 Nf3 e6 e3 c5 c4 Nc6 Nc3 Nf6 dxc5 Bxc5 a3 a6 b4 Bd6 Bb2 O-O Qd2 Qe7 Bd3 dxc4 Bxc4 b5 Bd3 Rd8 Qe2 Bb7 O-O Ne5 Nxe5 Bxe5 f4 Bc7 e4 Rac8 e5 Bb6+ Kh1 Ng4 Be4 Qh4 g3";
    const c = play(moves);
    expect(c.fen().split(" ")[0]).toBe("2rr2k1/1b3ppp/pb2p3/1p2P3/1P2BPnq/P1N3P1/1B2Q2P/R4R1K");
    const end = play(`${moves} Rxc3 gxh4 Rd2 Qxd2 Bxe4+ Qg2 Rh3`);
    const replies = end.moves();
    const mated = replies.filter((r) => {
      const d = new Chess(end.fen());
      d.move(r);
      return matingMoves(d.fen()).length > 0;
    });
    expect(mated.length / replies.length).toBeGreaterThan(0.8);
    const wrong = new Chess(c.fen());
    wrong.move("Rd2");
    expect(wrong.moves()).toContain("Qxd2");
  });

  it("итоговый тест: маты и единственные первые ходы", () => {
    expect(matingMoves("6rk/6pp/7N/8/8/8/6PP/6K1 w - - 0 1")).toEqual(["h6f7"]);
    for (const [fen, good, bad] of [
      ["7k/5rpp/5B1q/2R3Q1/8/8/5P1P/6K1 w - - 0 1", "c5c8", "g5g7"],
      ["4k3/3ppp2/1q3n2/8/7Q/5R2/5P1P/K7 w - - 0 1", "h4h8", "f3f6"],
    ]) {
      expect(forcesMate(fen, good, 2), good).toBe(true);
      const c = new Chess(fen);
      c.move({ from: bad.slice(0, 2), to: bad.slice(2, 4) });
      const ok =
        c.moves().length > 0 &&
        c.moves({ verbose: true }).every((r) => {
          const e = new Chess(c.fen());
          e.move(r);
          return matingMoves(e.fen()).length > 0;
        });
      expect(ok, bad).toBe(false);
    }
  });
});
