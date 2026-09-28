/** Школа эндшпиля: точная таблица «король и пешка против короля» и задания, которые на ней стоят. */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { ENDGAME_LESSONS, allEndgameDrills } from "@/content/chess/endgames";
import { kpkProbe } from "@/lib/engine/kpk";
import { bestMoves, kingCatches, pawnSquare, positionOutcome, robotMove } from "@/lib/endgame";

describe("таблица KPK", () => {
  it("классические позиции", () => {
    // Оппозиция: при ходе белых — ничья, при ходе чёрных — выигрыш.
    expect(kpkProbe("8/8/4k3/8/4K3/4P3/8/8 w - - 0 1")).toBe("draw");
    expect(kpkProbe("8/8/4k3/8/4K3/4P3/8/8 b - - 0 1")).toBe("win");
    // Король на шестой горизонтали перед пешкой выигрывает при любой очереди хода.
    expect(kpkProbe("4k3/8/4K3/4P3/8/8/8/8 w - - 0 1")).toBe("win");
    expect(kpkProbe("4k3/8/4K3/4P3/8/8/8/8 b - - 0 1")).toBe("win");
    // Крайняя пешка и король в углу — ничья.
    expect(kpkProbe("7k/8/7K/7P/8/8/8/8 w - - 0 1")).toBe("draw");
    // Пешка у чёрных: та же оппозиция, отражённая по вертикали.
    expect(kpkProbe("8/8/4p3/4k3/8/4K3/8/8 b - - 0 1")).toBe("draw");
    expect(kpkProbe("8/8/4p3/4k3/8/4K3/8/8 w - - 0 1")).toBe("win");
    expect(kpkProbe("8/8/8/8/8/8/8/K6k w - - 0 1")).toBeNull();
  });
});

describe("задания школы эндшпиля", () => {
  const drills = allEndgameDrills();

  it("идентификаторы уникальны, позиции корректны", () => {
    expect(new Set(drills.map((d) => d.id)).size).toBe(drills.length);
    for (const d of drills) expect(() => new Chess(d.fen), d.id).not.toThrow();
  });

  it("правило квадрата: ответы совпадают с точной таблицей", () => {
    const expected: Record<string, boolean> = {
      "square-1": true,
      "square-2": false,
      "square-3": true,
      "square-4": false,
      "square-5": false,
    };
    for (const d of drills.filter((x) => x.kind === "square")) expect(kingCatches(d.fen), d.id).toBe(expected[d.id]);
    expect(pawnSquare(drills.find((d) => d.id === "square-1")!.fen)).toHaveLength(25);
    expect(pawnSquare(drills.find((d) => d.id === "square-2")!.fen)).toHaveLength(16);
    expect(pawnSquare(drills.find((d) => d.id === "square-5")!.fen).sort()).toContain("g8");
  });

  it("найди ход: верный ход единственный, и именно он назван в объяснении", () => {
    for (const d of drills.filter((x) => x.kind === "find")) {
      const moves = bestMoves(d.fen);
      expect(moves, d.id).toHaveLength(1);
      const named = d.why.match(/Кр([a-h][1-8])/)?.[1];
      expect(moves[0].slice(2, 4), d.id).toBe(named);
    }
  });

  it("игра с роботом: цель достижима, и робот честно защищается", () => {
    for (const d of drills.filter((x) => x.kind === "play")) {
      expect(positionOutcome(d.fen), d.id).toBe(d.goal === "promote" ? "win" : "draw");
      // За ребёнка тоже играет робот (он ходит только лучшими ходами), чтобы проверить, что партия доходит до цели.
      const chess = new Chess(d.fen);
      const me = chess.turn();
      let promoted = false;
      for (let ply = 0; ply < 60 && !chess.isGameOver(); ply++) {
        const uci = robotMove(chess.fen());
        if (chess.turn() === me) expect(bestMoves(chess.fen()), `${d.id} ply ${ply}`).toContain(uci);
        expect(uci, `${d.id} ply ${ply}`).toBeTruthy();
        const m = chess.move({ from: uci!.slice(0, 2), to: uci!.slice(2, 4), promotion: uci![4] });
        if (m.promotion) {
          promoted = true;
          break;
        }
        if (m.captured) break;
      }
      expect(promoted, d.id).toBe(d.goal === "promote");
    }
  });

  it("в каждом уроке есть текст и задания", () => {
    for (const l of ENDGAME_LESSONS) {
      expect(l.text.length, l.id).toBeGreaterThan(0);
      expect(l.drills.length, l.id).toBeGreaterThan(0);
    }
  });
});
