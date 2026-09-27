/**
 * Робот и решатель задач: генератор ходов сверяется с chess.js и эталонными числами perft,
 * поиск находит маты и не зевает фигуры.
 */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { legalMoves, moveToUci, parseFen, perft, toFen } from "@/lib/engine/board";
import {
  PAWN_BATTLE_FEN,
  ROBOT_LEVELS,
  gameResult,
  matingMovesIn,
  mateInOne,
  pawnBattleBest,
  pawnBattleResult,
  robotMove,
  scoreMoves,
  searchBest,
} from "@/lib/engine/search";

const PERFT: [string, number[]][] = [
  ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", [20, 400, 8902]],
  ["r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", [48, 2039, 97862]],
  ["8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", [14, 191, 2812]],
  ["r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", [6, 264, 9467]],
  ["rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", [44, 1486, 62379]],
  ["r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10", [46, 2079, 89890]],
];

describe("генератор ходов", () => {
  it("эталонные числа perft", () => {
    for (const [fen, counts] of PERFT) {
      const pos = parseFen(fen);
      counts.forEach((n, i) => expect(perft(pos, i + 1), `${fen} глубина ${i + 1}`).toBe(n));
      expect(toFen(pos)).toBe(fen);
    }
  });

  it("совпадает с chess.js в случайных партиях", () => {
    let seed = 12345;
    const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
    for (let game = 0; game < 6; game++) {
      const chess = new Chess();
      for (let ply = 0; ply < 60 && !chess.isGameOver(); ply++) {
        const expected = chess
          .moves({ verbose: true })
          .map((m) => `${m.from}${m.to}${m.promotion ?? ""}`)
          .sort();
        const ours = legalMoves(parseFen(chess.fen())).map(moveToUci).sort();
        expect(ours, chess.fen()).toEqual(expected);
        const pick = expected[Math.floor(rand() * expected.length)];
        chess.move({ from: pick.slice(0, 2), to: pick.slice(2, 4), promotion: pick[4] });
      }
    }
  });
});

const OPERA =
  "e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#".split(
    " ",
  );
const fenAfter = (moves: string[], plies: number) => {
  const c = new Chess();
  moves.slice(0, plies).forEach((m) => c.move(m));
  return c.fen();
};

describe("поиск", () => {
  it("находит мат в один ход и предпочитает его", () => {
    const fen = "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1";
    expect(mateInOne(fen)).toBe("a1a8");
    expect(searchBest(fen, { depth: 2 }).uci).toBe("a1a8");
    expect(robotMove(fen, 3, () => 0.1)).toBe("a1a8");
  });

  it("мат в два хода: жертва ферзя Морфи — единственное решение", () => {
    const fen = fenAfter(OPERA, 30);
    expect(matingMovesIn(fen, 1)).toEqual([]);
    expect(matingMovesIn(fen, 2)).toEqual(["b3b8"]);
    expect(searchBest(fen, { depth: 3, timeMs: 5000 }).uci).toBe("b3b8");
  });

  it("не оставляет ферзя под боем", () => {
    const fen = "rnbqkbnr/pppp1ppp/8/4p3/3QP3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 3";
    for (const level of [3, 4]) {
      const uci = robotMove(fen, level, () => 0.5)!;
      expect(uci.startsWith("d4"), `уровень ${level}: ${uci}`).toBe(true);
    }
    const ranked = scoreMoves(fen, 2);
    expect(ranked[0].uci.startsWith("d4")).toBe(true);
  });

  it("глубина 3 в миттельшпиле укладывается в лимит времени", () => {
    const fen = "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4";
    const t = Date.now();
    const r = searchBest(fen, { depth: 3, timeMs: 3000 });
    expect(r.depth).toBe(3);
    expect(Date.now() - t).toBeLessThan(3000);
    expect(r.uci).not.toBeNull();
  });

  it("результат партии: мат, пат, недостаток материала", () => {
    expect(gameResult(parseFen("7k/6Q1/6K1/8/8/8/8/8 b - - 0 1"))).toBe("w");
    expect(gameResult(parseFen("k7/8/1Q6/8/8/8/8/2K5 b - - 0 1"))).toBe("draw");
    expect(gameResult(parseFen("k7/8/8/8/8/8/8/2K5 w - - 0 1"))).toBe("draw");
    expect(gameResult(parseFen("k7/8/8/8/8/8/8/1RK5 w - - 0 1"))).toBeNull();
  });

  it("пешечный бой: правила и ход робота", () => {
    const start = parseFen(PAWN_BATTLE_FEN);
    expect(pawnBattleResult(start)).toBeNull();
    expect(legalMoves(start)).toHaveLength(16);
    expect(pawnBattleResult(parseFen("3Q4/pppppppp/8/8/8/8/PPPPPPP1/8 b - - 0 1"))).toBe("w");
    expect(pawnBattleResult(parseFen("8/8/8/8/8/8/8/8 w - - 0 1"))).toBe("b");
    const uci = pawnBattleBest(PAWN_BATTLE_FEN, 3, () => 0.3)!;
    expect(legalMoves(start).map(moveToUci)).toContain(uci);
    // Робот проводит пешку, если может.
    expect(pawnBattleBest("8/2P5/8/8/8/8/p7/8 w - - 0 1", 2)).toBe("c7c8q");
  });

  it("уровни робота названы по фигурам и все делают возможный ход", () => {
    expect(ROBOT_LEVELS.map((l) => l.name)).toEqual(["Пешка", "Конь", "Слон", "Ладья", "Ферзь"]);
    const fen = "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3";
    const legal = new Chess(fen).moves({ verbose: true }).map((m) => `${m.from}${m.to}${m.promotion ?? ""}`);
    for (const level of [1, 2, 3, 4]) expect(legal, `уровень ${level}`).toContain(robotMove(fen, level, () => 0.7));
    expect(robotMove("7k/6Q1/6K1/8/8/8/8/8 b - - 0 1", 1)).toBeNull();
  });
});
