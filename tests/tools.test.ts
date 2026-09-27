/**
 * Логика интерактивных инструментов: по этим правилам работают задачи на экране.
 */
import { describe, expect, it } from "vitest";
import type { CrossingPuzzle, PerformerPuzzle } from "@/content/types";
import { crossingSolved, replayCrossing, sail, shortestCrossing, CROSSING_START } from "@/lib/crossing";
import { canMove, hanoiSolved, hanoiStart, moveDisk, shortestHanoi } from "@/lib/hanoi";
import { applyJugs, isUseless, jugsReached, replayJugs } from "@/lib/jugs";
import { commandLabel, commandName, onlyGrows, runPerformer, shortestPrograms } from "@/lib/performer";
import { fieldMatches, normalizeText } from "@/lib/checks";
import { decode, encode, RU_ALPHABET, shiftLetter } from "@/lib/cipher";
import { isLosing, robotMove, winningMove } from "@/lib/nim";
import { candidates, minWeighings, trickyWeigh, weigh } from "@/lib/scales";
import { oddPoints, oneStroke } from "@/lib/strokes";
import { sudokuConflicts, sudokuSolutions } from "@/lib/sudoku";
import { inversions, isSorted, swapAt } from "@/lib/swapSort";
import { checkVenn, regionAt, regionName, VENN } from "@/lib/venn";
import { buildWall, possibleTops } from "@/lib/wall";
import { balanceOf, waysToBalance } from "@/lib/weights";

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

describe("круги Эйлера", () => {
  it("область по точке рисунка", () => {
    expect(regionAt(VENN.a.cx - 60, VENN.a.cy)).toBe("a");
    expect(regionAt(VENN.b.cx + 60, VENN.b.cy)).toBe("b");
    expect(regionAt((VENN.a.cx + VENN.b.cx) / 2, VENN.a.cy)).toBe("ab");
    expect(regionAt(8, 8)).toBe("none");
  });

  it("названия областей и проверка раскладки", () => {
    expect(regionName("a", ["Чётные", "Больше 10"])).toBe("только «Чётные»");
    expect(regionName("ab", ["Чётные", "Больше 10"])).toBe("в обоих кругах");
    const correct = { x: "a", y: "ab", z: "none" } as const;
    expect(checkVenn(correct, { x: "a", y: "b" })).toEqual({ right: 1, wrong: ["y"], missing: ["z"] });
    expect(checkVenn(correct, { ...correct })).toEqual({ right: 3, wrong: [], missing: [] });
  });
});

describe("весы-детектив", () => {
  it("лёгкая монета поднимает свою чашу", () => {
    expect(weigh(2, [1, 2], [3, 4])).toBe("right");
    expect(weigh(4, [1, 2], [3, 4])).toBe("left");
    expect(weigh(5, [1, 2], [3, 4])).toBe("equal");
    expect(candidates(9, [{ left: [1, 2, 3], right: [4, 5, 6], result: "equal" }])).toEqual([7, 8, 9]);
  });

  it("хитрые весы оставляют как можно больше подозреваемых", () => {
    const all = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const r = trickyWeigh(all, [1, 2, 3, 4], [5, 6, 7, 8]);
    expect(r).not.toBe("equal");
    expect(candidates(9, [{ left: [1, 2, 3, 4], right: [5, 6, 7, 8], result: r }])).toHaveLength(4);
    expect(trickyWeigh(all, [1], [2])).toBe("equal");
    // При равенстве ответ зависит от случайного числа, но всегда оставляет максимум.
    const outcomes = new Set([0, 0.4, 0.8].map((x) => trickyWeigh(all, [1, 2, 3], [4, 5, 6], x)));
    expect(outcomes.size).toBe(3);
  });

  it("сколько взвешиваний нужно", () => {
    expect([1, 2, 3, 4, 9, 10, 27, 28].map(minWeighings)).toEqual([0, 1, 1, 2, 2, 3, 3, 4]);
  });
});

describe("обмен соседей", () => {
  it("беспорядки, проверка и обмен", () => {
    expect(inversions([1, 2, 3])).toBe(0);
    expect(inversions([3, 2, 1])).toBe(3);
    expect(isSorted([1, 2, 2, 5])).toBe(true);
    expect(isSorted([2, 1])).toBe(false);
    const cards = [4, 1, 3];
    expect(swapAt(cards, 0)).toEqual([1, 4, 3]);
    expect(cards).toEqual([4, 1, 3]);
  });
});

describe("игра с камешками", () => {
  it("проигрышные позиции и ход робота", () => {
    expect([0, 1, 2, 3, 4, 5, 6].map((n) => isLosing(n, [1, 2]))).toEqual([
      true,
      false,
      false,
      true,
      false,
      false,
      true,
    ]);
    expect(winningMove(7, [1, 2])).toBe(1);
    expect(winningMove(6, [1, 2])).toBeNull();
    expect(robotMove(6, [1, 2])).toBe(1);
    expect(robotMove(2, [1, 2])).toBe(2);
    expect(robotMove(1, [1, 2])).toBe(1);
    // Другие правила: брать 1, 3 или 4.
    expect(isLosing(2, [1, 3, 4])).toBe(true);
    expect(isLosing(7, [1, 3, 4])).toBe(true);
  });
});

describe("шифр Цезаря", () => {
  it("сдвиг по кругу и расшифровка", () => {
    expect(RU_ALPHABET).toHaveLength(33);
    expect(shiftLetter("А", 1)).toBe("Б");
    expect(shiftLetter("Я", 1)).toBe("А");
    expect(shiftLetter("А", -1)).toBe("Я");
    expect(shiftLetter("!", 5)).toBe("!");
    expect(encode("ПРИВЕТ МИР", 2)).toBe("СТКДЖФ ОКТ");
    expect(decode(encode("ЁЛКА", 7), 7)).toBe("ЁЛКА");
    expect(encode("ДОМ", 33)).toBe("ДОМ");
  });

  it("текстовый ответ: без учёта регистра, пробелов, «ё» и латинских двойников", () => {
    expect(normalizeText("  мОлОдец ")).toBe("МОЛОДЕЦ");
    expect(normalizeText("ёлка")).toBe("ЕЛКА");
    expect(normalizeText("KOT")).toBe("КОТ");
    const field = { type: "text", id: "w", label: "слово", answer: "МЁД" } as const;
    expect(fieldMatches(field, "мед")).toBe(true);
    expect(fieldMatches(field, "мёд ")).toBe(true);
    expect(fieldMatches(field, "мёдд")).toBe(false);
  });
});

describe("весы с гирями", () => {
  it("груз слева, гири справа или слева", () => {
    expect(balanceOf(5, [1, 3, 9], [null, "left", "right"])).toEqual({ left: 8, right: 9 });
    expect(balanceOf(5, [1, 3, 9], ["left", "left", "right"])).toEqual({ left: 9, right: 9 });
    expect(waysToBalance(5, [1, 3, 9], true)).toBe(1);
    expect(waysToBalance(5, [1, 3, 9], false)).toBe(0);
    expect(waysToBalance(3, [1, 2, 3], false)).toBe(2);
  });
});

describe("одним росчерком", () => {
  it("нечётные точки и правило Эйлера", () => {
    const square = {
      points: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ] as [number, number][],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ] as [number, number][],
    };
    expect(oddPoints(square)).toBe(0);
    expect(oneStroke(square)).toBe(true);
    const cross = { ...square, lines: [...square.lines, [0, 2], [1, 3]] as [number, number][] };
    expect(oddPoints(cross)).toBe(4);
    expect(oneStroke(cross)).toBe(false);
    // Две отдельные чёрточки — нечётных точек четыре, и они не связаны.
    const apart = {
      points: square.points,
      lines: [
        [0, 1],
        [2, 3],
      ] as [number, number][],
    };
    expect(oneStroke(apart)).toBe(false);
  });
});
