/** Курс «Слон»: комбинации «мат в 2 хода» и открытое нападение — объяснения проверены перебором chess.js. */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { matingMoves } from "@/lib/chess";

const uci = (m: { from: string; to: string; promotion?: string }) => `${m.from}${m.to}${m.promotion ?? ""}`;
/** После хода first у соперника нет ответа, который спасает от мата следующим ходом. */
function mateInTwo(fen: string, first: string): boolean {
  const c = new Chess(fen);
  c.move({ from: first.slice(0, 2), to: first.slice(2, 4) });
  if (c.isCheckmate()) return true;
  const replies = c.moves({ verbose: true });
  return (
    replies.length > 0 &&
    replies.every((r) => {
      const d = new Chess(c.fen());
      d.move(r);
      return matingMoves(d.fen()).length > 0;
    })
  );
}
const firstMovesMatingInTwo = (fen: string) =>
  new Chess(fen)
    .moves({ verbose: true })
    .map(uci)
    .filter((u) => mateInTwo(fen, u));

describe("курс «Слон»: мат в 2 хода", () => {
  it("связка: Фh6! матует, Сxh7 — нет; g7 не бьёт h6", () => {
    const fen = "1n5k/6pp/8/8/8/2BB4/3Q4/6K1 w - - 0 1";
    expect(mateInTwo(fen, "d2h6")).toBe(true);
    expect(mateInTwo(fen, "d3h7")).toBe(false);
    const c = new Chess(fen);
    c.move("Qh6");
    expect(c.moves()).not.toContain("gxh6");
  });

  it("рентген: Лxd8+ — единственный мат в 2 хода", () => {
    expect(firstMovesMatingInTwo("3r2k1/2q2ppp/8/8/8/8/3R1PPP/3Q2K1 w - - 0 1")).toEqual(["d2d8"]);
    const c = new Chess("3r2k1/2q2ppp/8/8/8/8/3R1PPP/3Q2K1 w - - 0 1");
    c.move("Rd7");
    expect(c.moves()).toContain("Qxd7");
  });

  it("засада: Лh1 — единственный мат в 2 хода; пешка g7 связана слоном a1", () => {
    const fen = "6rk/6p1/8/7N/8/8/6K1/B3R3 w - - 0 1";
    expect(firstMovesMatingInTwo(fen)).toEqual(["e1h1"]);
    const c = new Chess(fen);
    c.move("Rh1");
    expect(c.moves({ square: "g7" })).toEqual([]);
    expect(mateInTwo(fen, "e1e8")).toBe(false);
    expect(mateInTwo(fen, "h5f6")).toBe(false);
  });

  it("двойной шах: после Кd6 шахуют и конь, и ладья", () => {
    const c = new Chess("3qkb2/3p1p2/8/8/4N3/8/6PP/4R1K1 w - - 0 1");
    c.move("Nd6#");
    expect(c.isCheckmate()).toBe(true);
    expect(c.attackers("e8", "w").sort()).toEqual(["d6", "e1"]);
  });
});

describe("курс «Слон»: открытое нападение", () => {
  it("Кf5+ — на любой ответ ладья берёт ферзя; после Кe6 чёрные матуют Фxd1#", () => {
    const fen = "3q4/6pp/7k/8/3N4/8/5PPP/3R2K1 w - - 0 1";
    const c = new Chess(fen);
    c.move("Nf5+");
    for (const r of c.moves()) {
      const d = new Chess(c.fen());
      d.move(r);
      expect(
        d.moves().some((m) => m.startsWith("Rxd8")),
        r,
      ).toBe(true);
    }
    const e = new Chess(fen);
    e.move("Ne6");
    e.move("Qxd1#");
    expect(e.isCheckmate()).toBe(true);
  });
});

describe("курс «Слон»: уничтожение защиты, отвлечение, завлечение", () => {
  it("уничтожение защиты: Лxf6 — мат в 2; Фxh7+ берёт конь", () => {
    const fen = "7k/6pp/5n2/6N1/8/7Q/8/5RK1 w - - 0 1";
    expect(mateInTwo(fen, "f1f6")).toBe(true);
    expect(mateInTwo(fen, "h3h7")).toBe(false);
  });

  it("отвлечение: Лa8+ — единственный мат в 2; Фxg7+ — нет", () => {
    const fen = "7k/2q3pp/8/5NQ1/8/8/5PPP/R5K1 w - - 0 1";
    expect(firstMovesMatingInTwo(fen)).toEqual(["a1a8"]);
  });

  it("завлечение: Фg8+ — единственный мат в 2: Лxg8 вынужден, затем Кf7#", () => {
    const fen = "4r2k/6pp/8/6N1/2Q5/1B6/6PP/6K1 w - - 0 1";
    expect(firstMovesMatingInTwo(fen)).toEqual(["c4g8"]);
    const c = new Chess(fen);
    c.move("Qg8+");
    expect(c.moves()).toEqual(["Rxg8"]);
    c.move("Rxg8");
    c.move("Nf7#");
    expect(c.isCheckmate()).toBe(true);
  });
});

/** Мат не более чем в n ходов белых, где каждый ход белых — шах. */
function mateInChecks(fen: string, n: number): boolean {
  const c = new Chess(fen);
  return c.moves({ verbose: true }).some((m) => {
    const d = new Chess(fen);
    d.move(m);
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
  });
}

describe("курс «Слон»: финал ступени", () => {
  it("промежуточный шах: после Сxf7+ на любой ответ белые берут ферзя", () => {
    const c = new Chess("6k1/5ppp/8/8/2B5/8/5PPK/R2q4 w - - 0 1");
    c.move("Bxf7+");
    for (const r of c.moves()) {
      const d = new Chess(c.fen());
      d.move(r);
      expect(d.moves(), r).toContain("Rxd1");
    }
  });

  it("форточка: после h3 мата нет, после Фxa7 — Лc1#", () => {
    const fen = "2r3k1/p4ppp/8/8/Q7/8/5PPP/6K1 w - - 0 1";
    const a = new Chess(fen);
    a.move("h3");
    expect(matingMoves(a.fen())).toEqual([]);
    const b = new Chess(fen);
    b.move("Qxa7");
    expect(matingMoves(b.fen())).toEqual(["c8c1"]);
  });

  it("Морфи, 1858: Фb8+ — единственный мат в 2 хода", () => {
    expect(firstMovesMatingInTwo("4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 16")).toEqual(["b3b8"]);
  });

  it("Андерсен, 1852: после Фxd7+ мат шахами за 3 хода; после Сxe7 чёрные матуют Фxg2#", () => {
    const fen = "1r2k1r1/pbppnp1p/1b3P2/8/Q7/B1PB1q2/P4PPP/3R2K1 w - - 0 21";
    const c = new Chess(fen);
    c.move("Qxd7+");
    for (const r of c.moves()) {
      const d = new Chess(c.fen());
      d.move(r);
      expect(mateInChecks(d.fen(), 3), r).toBe(true);
    }
    const e = new Chess(fen);
    e.move("Bxe7");
    expect(matingMoves(e.fen())).toContain("f3g2");
  });

  it("итоговый тест: Фg8+ — единственный мат в 2 хода", () => {
    expect(firstMovesMatingInTwo("3r3k/6pp/8/6N1/2Q5/1B6/6PP/6K1 w - - 0 1")).toEqual(["c4g8"]);
  });
});

describe("курс: позиционные упражнения в бывших уроках-вопросах", () => {
  it("перекрытие: Кf6+ — единственный мат в 2; после него у чёрных только Кf8", () => {
    const fen = "1R1QN2k/3n2pp/8/5r2/8/8/5PKP/8 w - - 0 1";
    expect(firstMovesMatingInTwo(fen)).toEqual(["e8f6"]);
    const c = new Chess(fen);
    c.move("Nf6+");
    expect(c.moves()).toEqual(["Nf8"]);
    const d = new Chess(fen);
    d.move("Nd6+");
    expect(d.moves()).toContain("Rf8");
  });

  it("вечный шах: Фc6+ Крb8 Фb5+ Крa8 — у чёрных каждый раз один ход", () => {
    const c = new Chess("k1r5/p1p5/8/8/8/K7/2Q3pp/8 w - - 0 1");
    c.move("Qc6+");
    expect(c.moves()).toEqual(["Kb8"]);
    c.move("Kb8");
    c.move("Qb5+");
    expect(c.moves()).toEqual(["Ka8"]);
    c.move("Ka8");
    c.move("Qc6+");
    expect(c.moves()).toEqual(["Kb8"]);
  });

  it("блокировка: после Кd3 пешке d4 некуда идти; после Кc6 она идёт d3", () => {
    const a = new Chess("6k1/8/8/8/1N1p4/8/8/6K1 w - - 0 1");
    a.move("Nd3");
    expect(a.moves({ square: "d4" })).toEqual([]);
    const b = new Chess("6k1/8/8/8/1N1p4/8/8/6K1 w - - 0 1");
    b.move("Nc6");
    expect(b.moves({ square: "d4" })).toEqual(["d3"]);
  });

  it("отдалённая проходная: впереди a4 нет чёрных пешек на a и b, у пешек f2–h2 — есть", () => {
    const black = ["f7", "g7", "h7"];
    const passed = (sq: string) =>
      !black.some((b) => Math.abs(b.charCodeAt(0) - sq.charCodeAt(0)) <= 1 && Number(b[1]) > Number(sq[1]));
    expect(["a4", "f2", "g2", "h2"].filter(passed)).toEqual(["a4"]);
  });
});
