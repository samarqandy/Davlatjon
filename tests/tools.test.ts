/**
 * Логика интерактивных инструментов: по этим правилам работают задачи на экране.
 */
import { describe, expect, it } from "vitest";
import type { CrossingPuzzle, PerformerPuzzle } from "@/content/types";
import { crossingSolved, replayCrossing, sail, shortestCrossing, CROSSING_START } from "@/lib/crossing";
import { canMove, hanoiSolved, hanoiStart, moveDisk, shortestHanoi } from "@/lib/hanoi";
import { applyJugs, isUseless, jugsReached, replayJugs } from "@/lib/jugs";
import { commandLabel, commandName, onlyGrows, runPerformer, shortestPrograms } from "@/lib/performer";
import { sudokuConflicts, sudokuSolutions } from "@/lib/sudoku";
import { buildWall, possibleTops } from "@/lib/wall";

describe("исполнитель", () => {
  const doubler: PerformerPuzzle = {
    name: "Удвоитель",
    emoji: "🤖",
    start: 1,
    target: 10,
    commands: [
      { op: "add", value: 1 },
      { op: "mul", value: 2 },
    ],
    max: 20,
    optimal: 4,
  };

  it("подписи команд", () => {
    expect(doubler.commands.map(commandLabel)).toEqual(["+1", "×2"]);
    expect(doubler.commands.map(commandName)).toEqual(["прибавь 1", "удвой"]);
    expect(commandLabel({ op: "sub", value: 3 })).toBe("−3");
    expect(commandName({ op: "sub", value: 3 })).toBe("отними 3");
  });

  it("программа останавливается, если число выходит за границы", () => {
    expect(runPerformer(doubler, [1, 1, 1, 1]).values).toEqual([1, 2, 4, 8, 16]);
    const r = runPerformer(doubler, [1, 1, 1, 1, 1]);
    expect(r.failedAt).toBe(4);
    expect(r.values.at(-1)).toBe(16);
  });

  it("кратчайшая программа и «только растёт»", () => {
    expect(shortestPrograms(doubler).length).toBe(4);
    expect(onlyGrows(doubler)).toBe(true);
    expect(onlyGrows({ ...doubler, commands: [{ op: "sub", value: 1 }] })).toBe(false);
    expect(shortestPrograms({ ...doubler, target: 99 }).length).toBe(Infinity);
  });
});

describe("ханойская башня", () => {
  it("большое кольцо нельзя класть на маленькое", () => {
    const s = hanoiStart(3);
    expect(s).toEqual([[3, 2, 1], [], []]);
    expect(canMove(s, 0, 2)).toBe(true);
    expect(canMove(s, 1, 2)).toBe(false);
    const s1 = moveDisk(s, 0, 2);
    expect(canMove(s1, 0, 2)).toBe(false);
    expect(moveDisk(s1, 0, 2)).toBe(s1);
    expect(canMove(s1, 0, 1)).toBe(true);
  });

  it("решение за 7 ходов собирает башню справа", () => {
    const moves: [number, number][] = [
      [0, 2],
      [0, 1],
      [2, 1],
      [0, 2],
      [1, 0],
      [1, 2],
      [0, 2],
    ];
    const end = moves.reduce((s, [a, b]) => moveDisk(s, a, b), hanoiStart(3));
    expect(hanoiSolved(end, 3)).toBe(true);
    expect(end[2]).toEqual([3, 2, 1]);
    expect(shortestHanoi(3)).toBe(moves.length);
  });
});

describe("переправа", () => {
  const p: CrossingPuzzle = {
    driver: { emoji: "👨‍🌾", name: "Крестьянин" },
    items: [
      { id: "wolf", emoji: "🐺", name: "волк" },
      { id: "goat", emoji: "🐐", name: "коза" },
      { id: "cabbage", emoji: "🥬", name: "капуста" },
    ],
    conflicts: [
      { eater: "wolf", eaten: "goat", text: "волк съест козу!" },
      { eater: "goat", eaten: "cabbage", text: "коза съест капусту!" },
    ],
    capacity: 1,
    optimal: 7,
  };

  it("нельзя оставить волка с козой", () => {
    const r = sail(p, CROSSING_START, ["cabbage"]);
    expect(r.ok).toBe(false);
    if (!r.ok && r.reason === "eaten") expect(r.conflict.eater).toBe("wolf");
  });

  it("нельзя взять больше пассажиров, чем мест, или того, кто на другом берегу", () => {
    expect(sail(p, CROSSING_START, ["goat", "wolf"])).toEqual({ ok: false, reason: "invalid" });
    const after = sail(p, CROSSING_START, ["goat"]);
    expect(after.ok).toBe(true);
    if (after.ok) {
      expect(after.next).toEqual({ right: ["goat"], boat: "right" });
      expect(sail(p, after.next, ["wolf"])).toEqual({ ok: false, reason: "invalid" });
    }
  });

  it("переигрывание останавливается на первой невозможной поездке", () => {
    const r = replayCrossing(p, [["goat"], [], ["goat"], ["cabbage"]]);
    // Третья поездка невозможна: коза на правом берегу, а лодка — у левого.
    expect(r.applied).toBe(2);
    expect(crossingSolved(p, r.state)).toBe(false);
    expect(shortestCrossing(p).trips).toBe(7);
  });
});

describe("переливания", () => {
  const caps: [number, number] = [3, 5];

  it("переливаем, пока одно ведро не опустеет или другое не наполнится", () => {
    expect(applyJugs(caps, [0, 5], { type: "pour", from: 1 })).toEqual([3, 2]);
    expect(applyJugs(caps, [2, 0], { type: "pour", from: 0 })).toEqual([0, 2]);
    expect(applyJugs(caps, [3, 4], { type: "pour", from: 0 })).toEqual([2, 5]);
    expect(applyJugs(caps, [1, 1], { type: "empty", jug: 1 })).toEqual([1, 0]);
  });

  it("бесполезные действия и цель", () => {
    expect(isUseless(caps, [3, 0], { type: "fill", jug: 0 })).toBe(true);
    expect(isUseless(caps, [0, 0], { type: "pour", from: 0 })).toBe(true);
    expect(isUseless(caps, [0, 0], { type: "fill", jug: 1 })).toBe(false);
    expect(jugsReached([3, 4], 4)).toBe(true);
    expect(replayJugs(caps, [{ type: "fill", jug: 0 }])).toEqual([
      [0, 0],
      [3, 0],
    ]);
  });
});

describe("судоку", () => {
  it("находит повторы в строке, столбце и квадрате", () => {
    const grid = [
      [1, 1, null, null],
      [null, null, null, null],
      [null, null, 2, null],
      [null, null, null, 2],
    ];
    expect(sudokuConflicts(grid, [2, 2])).toEqual(new Set(["0-0", "0-1", "2-2", "3-3"]));
  });

  it("у пустой сетки много решений, у заполненной — одно", () => {
    const empty = Array.from({ length: 4 }, () => Array(4).fill(null));
    expect(sudokuSolutions(empty, [2, 2], 3)).toHaveLength(3);
    const full = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ];
    expect(sudokuSolutions(full, [2, 2])).toEqual([full]);
  });
});

describe("числовая стенка", () => {
  it("строится снизу вверх, пустые кирпичи остаются пустыми", () => {
    expect(buildWall([1, 2, 3, 4])).toEqual([[1, 2, 3, 4], [3, 5, 7], [8, 12], [20]]);
    expect(buildWall([1, null, 3])).toEqual([[1, null, 3], [null, null], [null]]);
  });

  it("все верхушки для 1, 2, 3", () => {
    const tops = possibleTops([1, 2, 3]);
    expect([...tops.keys()].sort()).toEqual([7, 8, 9]);
    expect(tops.get(9)).toEqual([
      [1, 3, 2],
      [2, 3, 1],
    ]);
  });
});
