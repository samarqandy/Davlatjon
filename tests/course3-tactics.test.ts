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
