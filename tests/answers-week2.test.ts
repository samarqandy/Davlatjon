/**
 * Неделя 2: каждый ответ из ключа для родителя проверяется независимым расчётом или перебором.
 */
import { describe, expect, it } from "vitest";
import type { Cell, Dir } from "@/content/types";
import { timeMatches } from "@/lib/checks";
import { replayCrossing, crossingSolved, shortestCrossing } from "@/lib/crossing";
import { cubeFaces, foldsIntoCube, OPPOSITE_FACE } from "@/lib/cube";
import { evaluate, usesForbidden } from "@/lib/expression";
import { shortestTime } from "@/lib/graph";
import { shortestHanoi } from "@/lib/hanoi";
import { replayJugs, shortestJugs, type JugsAction } from "@/lib/jugs";
import { runPerformer, shortestPrograms } from "@/lib/performer";
import { mirror, normalize, rotate, shapeKey } from "@/lib/polyomino";
import { allShortestPrograms, parseMap, runProgram, shortestLength } from "@/lib/robot";
import { sudokuSolutions } from "@/lib/sudoku";
import { possibleTops, wallTop } from "@/lib/wall";
import { addMinutes, answer, numbers, permutations, task, times, visual } from "./helpers";

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);

/** Все повороты и отражения фигуры. */
function orientations(cells: readonly Cell[]): Cell[][] {
  const out = new Map<string, Cell[]>();
  let cur = normalize(cells);
  for (let m = 0; m < 2; m++) {
    for (let i = 0; i < 4; i++) {
      out.set(shapeKey(cur), cur);
      cur = rotate(cur);
    }
    cur = mirror(cur);
  }
  return [...out.values()];
}

/** Можно ли без щелей и наложений покрыть клетки region фигурами pieces (перебор с возвратом). */
function canTile(region: Set<string>, pieces: Cell[][]): boolean {
  if (pieces.length === 0) return region.size === 0;
  if (region.size === 0) return false;
  const [fc, fr] = [...region].map((k) => k.split(",").map(Number)).sort((a, b) => a[1] - b[1] || a[0] - b[0])[0];
  return pieces.some((piece, pi) =>
    orientations(piece).some((o) => {
      const [ac, ar] = o[0];
      const placed = o.map(([c, r]) => `${c - ac + fc},${r - ar + fr}`);
      if (!placed.every((k) => region.has(k))) return false;
      const rest = new Set([...region].filter((k) => !placed.includes(k)));
      return canTile(
        rest,
        pieces.filter((_, j) => j !== pi),
      );
    }),
  );
}

const rect = (cols: number, rows: number) =>
  new Set(range(0, cols * rows - 1).map((i) => `${i % cols},${Math.floor(i / cols)}`));

/** Сколько квадратов любого размера в прямоугольнике из клеток. */
const squaresIn = (cols: number, rows: number) =>
  sum(range(1, Math.min(cols, rows)).map((k) => (cols - k + 1) * (rows - k + 1)));

/** Отрезки (спички) дорожки из n квадратов или n треугольников, построенные заново. */
function matchCount(shape: "squares" | "triangles", n: number): number {
  const edges = new Set<string>();
  const add = (a: string, b: string) => edges.add([a, b].sort().join("|"));
  for (let i = 0; i < n; i++) {
    if (shape === "squares") {
      const [tl, tr, bl, br] = [`${i},0`, `${i + 1},0`, `${i},1`, `${i + 1},1`];
      add(tl, tr);
      add(bl, br);
      add(tl, bl);
      add(tr, br);
    } else {
      // Вершины: низ — (k, 0), верх — (k + ½, 1) записываем как k.5
      const k = Math.floor(i / 2);
      const tri = i % 2 === 0 ? [`${k}`, `${k + 1}`, `${k}.5`] : [`${k}.5`, `${k + 1}.5`, `${k + 1}`];
      add(tri[0], tri[1]);
      add(tri[1], tri[2]);
      add(tri[0], tri[2]);
    }
  }
  return edges.size;
}

/** Выполнить цепочку действий «+6», «удвой», «−10». */
function applyChain(start: number, steps: string[]): number {
  return steps.reduce((v, s) => {
    if (s === "удвой") return v * 2;
    const n = Number(s.slice(1));
    return s.startsWith("+") ? v + n : v - n;
  }, start);
}

/** Сдвиг на карте с буквами столбцов: «Г2» + (dc, dr). */
function moveCell(cell: string, cols: string[], moves: [number, number][]): string {
  let c = cols.indexOf(cell[0]);
  let r = Number(cell.slice(1));
  for (const [dc, dr] of moves) {
    c += dc;
    r += dr;
  }
  return `${cols[c]}${r}`;
}

describe("Неделя 2 · День 1", () => {
  it("до сотни и две ленты", () => {
    const n = numbers("w2d1t1");
    expect([n.a, n.b, n.c]).toEqual([100 - 64, 100 - 27, 100 - 85]);
    const r = numbers("w2d1t2");
    expect(r.red).toBe(25 + 8);
    expect(r.both).toBe(25 + r.red);
  });

  it("очередь", () => {
    const n = numbers("w2d1t3");
    const queue = (ahead: number, behind: number) => ahead + 1 + behind;
    expect(n.a).toBe(queue(4, 5));
    expect(n.b).toBe(queue(5 - 1, 5 - 1));
  });

  it("квадраты из фишек: 1, 4, 9, 16, 25", () => {
    const v = visual("w2d1t4", "dots");
    expect(v.figures).toEqual(range(1, 4).map((k) => ({ cols: k, rows: k })));
    const n = numbers("w2d1t4");
    expect(n.n5).toBe(5 * 5);
    expect(n.add).toBe(5 * 5 - 4 * 4);
    expect(sum([1, 3, 5, 7, 9])).toBe(n.n5);
  });

  it("лабиринт: 15 команд, два кратчайших пути", () => {
    const p = answer("w2d1t5", "robot").puzzle;
    const map = parseMap(p.map);
    expect(shortestLength(map)).toBe(p.optimal);
    const run = runProgram(map, [..."RRDDLLDDRRRRDRR"] as Dir[]);
    expect(run.reachedGoal).toBe(true);
    expect(allShortestPrograms(map)).toHaveLength(2);
  });

  it("кубики: 10 штук, 3 спрятаны, до блока 3 × 2 × 3 не хватает 8", () => {
    const h = visual("w2d1t6", "isoCubes").heights;
    const n = numbers("w2d1t6");
    expect(n.cubes).toBe(sum(h.flat()));
    expect(n.add).toBe(3 * 2 * 3 - sum(h.flat()));
    let hidden = 0;
    h.forEach((row, r) =>
      row.forEach((height, c) => {
        for (let z = 0; z < height; z++) {
          const top = z + 1 < height;
          const front = (h[r + 1]?.[c] ?? 0) > z;
          const right = (h[r]?.[c + 1] ?? 0) > z;
          if (top && front && right) hidden++;
        }
      }),
    );
    expect(hidden).toBe(3);
  });

  it("лестница и часы: промежутков на один меньше", () => {
    const s = numbers("w2d1t7");
    expect(s.steps).toBe((4 - 1) * 12);
    expect(s.floor).toBe(24 / 12 + 1);
    const pause = 6 / (4 - 1);
    expect(numbers("w2d1t8").seconds).toBe((7 - 1) * pause);
    expect((12 - 1) * pause).toBe(22);
  });
});

describe("Неделя 2 · День 2", () => {
  it("задуманные числа", () => {
    const n = numbers("w2d2t1");
    expect(n.a + 15).toBe(40);
    expect(n.b - 8).toBe(27);
    expect(n.c * 2).toBe(30);
  });

  it("цепочка задом наперёд: ответ единственный", () => {
    const chain = visual("w2d2t2", "chain");
    const fits = range(0, 100).filter((x) => applyChain(x, chain.steps) === chain.end);
    expect(fits).toEqual([numbers("w2d2t2").x]);
    expect(applyChain(10, chain.steps)).toBe(22);
  });

  it("яблоки: было 12, Али взял 6", () => {
    const fits = range(1, 100).filter((total) => {
      if (total % 2) return false;
      const afterAli = total / 2;
      if (afterAli % 2) return false;
      return afterAli / 2 === 3;
    });
    const n = numbers("w2d2t3");
    expect(fits).toEqual([n.total]);
    expect(n.ali).toBe(n.total / 2);
  });

  it("ряды назад", () => {
    const n = numbers("w2d2t4");
    const a = [n.a1, n.a2, 17, 21, 25, 29];
    expect(a.every((x, i) => i === 0 || x - a[i - 1] === 4)).toBe(true);
    const b = [n.b1, n.b2, 12, 24, 48];
    expect(b.every((x, i) => i === 0 || x === b[i - 1] * 2)).toBe(true);
  });

  it("Удвоитель: 6 команд, две кратчайшие программы, а жадный способ — 13", () => {
    const p = answer("w2d2t5", "performer").puzzle;
    expect(shortestPrograms(p)).toEqual({ length: p.optimal, count: 2 });
    // Из ответа: ×2, +1, ×2, ×2, ×2, +1
    const run = runPerformer(p, [1, 0, 1, 1, 1, 0]);
    expect(run.values).toEqual([1, 2, 3, 6, 12, 24, 25]);
    // «Удваивать, пока можно»: 4 удвоения до 16 и ещё 9 раз «+1».
    let v = 1;
    let steps = 0;
    while (v * 2 <= p.target) {
      v *= 2;
      steps++;
    }
    expect(steps + (p.target - v)).toBe(13);
    expect(shortestPrograms({ ...p, target: 50 }).length).toBe(7);
  });

  it("откуда пришёл пират и откуда вылетел попугай", () => {
    const grid = visual("w2d2t6", "coordGrid");
    const t = times("w2d2t6");
    const at = (cell: string) => grid.items.find((i) => i.cell === cell)?.emoji;
    expect(
      at(
        moveCell(t.pirate, grid.cols, [
          [0, 3],
          [-2, 0],
        ]),
      ),
    ).toBe("🌴");
    expect(
      at(
        moveCell(t.parrot, grid.cols, [
          [2, 0],
          [0, -1],
          [-3, 0],
        ]),
      ),
    ).toBe("🪨");
    expect(at(t.pirate)).toBeUndefined();
    expect(at(t.parrot)).toBeUndefined();
  });

  it("во сколько вставать", () => {
    const t = times("w2d2t7");
    expect(timeMatches(addMinutes("8:30", -20), t.leave)).toBe(true);
    expect(timeMatches(addMinutes("8:30", -20 - 35), t.wake)).toBe(true);
  });

  it("кувшинки", () => {
    // Доля пруда по дням: на 10-й день — весь пруд, каждый день вдвое больше.
    const share = (day: number) => 1 / 2 ** (10 - day);
    const n = numbers("w2d2t8");
    expect(share(n.half)).toBe(1 / 2);
    expect(share(n.quarter)).toBe(1 / 4);
  });
});

describe("Неделя 2 · День 3", () => {
  it("десятки и нечётные числа", () => {
    expect(numbers("w2d3t1").a).toBe(10 + 20 + 30 + 40);
    expect(numbers("w2d3t1").b).toBe(11 + 12 + 13 + 14);
    const odd = (k: number) => range(1, k).map((i) => 2 * i - 1);
    expect(numbers("w2d3t2").a).toBe(sum(odd(5)));
    expect(numbers("w2d3t2").b).toBe(sum(odd(10)));
    expect(sum(odd(6))).toBe(36);
  });

  it("цифры на страницах", () => {
    const digits = (to: number) => range(1, to).join("");
    const n = numbers("w2d3t3");
    expect(n.digits).toBe(digits(20).length);
    expect(n.ones).toBe([...digits(20)].filter((d) => d === "1").length);
    expect(digits(30).length).toBe(51);
    expect([...digits(20)].filter((d) => d === "2").length).toBe(3);
  });

  it("дорожка из спичек", () => {
    expect(visual("w2d3t4", "matches")).toEqual({ type: "matches", shape: "squares", figures: [1, 2, 3] });
    const n = numbers("w2d3t4");
    expect(n.m5).toBe(matchCount("squares", 5));
    expect(n.m10).toBe(matchCount("squares", 10));
    expect(matchCount("squares", 7)).toBe(22);
  });

  it("ханойская башня: 1, 3, 7, 15 ходов", () => {
    const a = answer("w2d3t5", "hanoi");
    expect(shortestHanoi(a.disks)).toBe(a.optimal);
    expect([1, 2, 4].map(shortestHanoi)).toEqual([1, 3, 15]);
  });

  it("квадраты в фигуре 4 × 4", () => {
    const g = visual("w2d3t6", "gridFigure");
    expect(numbers("w2d3t6").squares).toBe(squaresIn(g.cols, g.rows));
    expect(squaresIn(5, 5)).toBe(55);
  });

  it("столики в кафе", () => {
    const seats = (tables: number) => 2 * tables + 2;
    const n = numbers("w2d3t7");
    expect(n.people).toBe(seats(5));
    expect(range(1, 30).filter((t) => seats(t) === 20)).toEqual([n.tables]);
  });

  it("лягушка: 8 способов — и все они выписаны в ответе", () => {
    const ways = (n: number): string[] =>
      n === 0 ? [""] : [...ways(n - 1).map((w) => `${w}1`), ...(n >= 2 ? ways(n - 2).map((w) => `${w}2`) : [])];
    expect(numbers("w2d3t8").ways).toBe(ways(5).length);
    expect(ways(6)).toHaveLength(13);
    const listed = task("w2d3t8")
      .solution.explanation.find((e) => e.startsWith("Все 8 способов"))!
      .replace(/^[^:]+:\s*/, "")
      .replace(/\.$/, "")
      .split(";")
      .map((w) => w.replace(/[\s,]/g, ""));
    expect(new Set(listed)).toEqual(new Set(ways(5)));
  });
});

describe("Неделя 2 · День 4", () => {
  it("одинаковые числа", () => {
    const n = numbers("w2d4t1");
    expect(range(0, 50).filter((x) => 3 * x === 27)).toEqual([n.a]);
    expect(range(0, 50).filter((x) => 2 * x + 5 === 25)).toEqual([n.b]);
    expect(range(0, 50).filter((x) => 3 * x === 45)).toEqual([n.c]);
  });

  it("спрятанные цифры: решения единственные", () => {
    const a: number[][] = [];
    const b: number[][] = [];
    for (let x = 0; x <= 9; x++) {
      for (let y = 0; y <= 9; y++) {
        if (x > 0 && x * 10 + 5 + (30 + y) === 82) a.push([x * 10 + 5, 30 + y]);
        if (y > 0 && 60 + x - (y * 10 + 4) === 29) b.push([60 + x, y * 10 + 4]);
      }
    }
    const n = numbers("w2d4t2");
    expect(a).toEqual([[n.a1, n.a2]]);
    expect(b).toEqual([[n.b1, n.b2]]);
  });

  it("папа вдвое старше", () => {
    expect(range(0, 60).filter((x) => 32 + x === 2 * (8 + x))).toEqual([numbers("w2d4t3").years]);
  });

  it("стенка-загадка", () => {
    const n = numbers("w2d4t4");
    expect(visual("w2d4t4", "pyramid", 0).rows[0]).toEqual([36]);
    expect(visual("w2d4t4", "pyramid", 1).rows[0]).toEqual([32]);
    expect(range(0, 50).filter((x) => wallTop([x, x, x]) === 36)).toEqual([n.a]);
    expect(range(0, 50).filter((x) => wallTop([x, x + 1, x + 2]) === 32)).toEqual([n.b1]);
    expect([n.b2, n.b3]).toEqual([n.b1 + 1, n.b1 + 2]);
    expect(wallTop([10, 10, 10])).toBe(40);
  });

  it("переправа: 7 поездок, два плана, и план из ответа работает", () => {
    const p = answer("w2d4t5", "crossing").puzzle;
    expect(shortestCrossing(p)).toEqual({ trips: p.optimal, plans: 2 });
    const plan = [["goat"], [], ["wolf"], ["goat"], ["cabbage"], [], ["goat"]];
    const r = replayCrossing(p, plan);
    expect(r.applied).toBe(plan.length);
    expect(crossingSolved(p, r.state)).toBe(true);
    // Начать можно только с козы.
    expect(replayCrossing(p, [["wolf"]]).applied).toBe(0);
    expect(replayCrossing(p, [["cabbage"]]).applied).toBe(0);
  });

  it("прямоугольник 2 × 4 складывается только из фигур А и Г", () => {
    const a = answer("w2d4t6", "choice");
    const pairs: string[] = [];
    a.options.forEach((x, i) =>
      a.options.forEach((y, j) => {
        if (j <= i || x.visual?.type !== "polyomino" || y.visual?.type !== "polyomino") return;
        if (canTile(rect(4, 2), [x.visual.cells, y.visual.cells])) pairs.push(`${x.id}${y.id}`);
      }),
    );
    expect(pairs).toEqual([a.correct.join("")]);
  });

  it("ровно 50: два способа; на 30 — только книга и краски", () => {
    const cards = visual("w2d4t7", "cards").items;
    const prices = cards.map((c) => Number(c.label.split("—")[1]));
    const subsets = (target: number) =>
      range(1, 2 ** prices.length - 1).filter((mask) => sum(prices.filter((_, i) => mask & (1 << i))) === target);
    expect(subsets(50)).toHaveLength(numbers("w2d4t7").ways);
    expect(subsets(30).map((m) => cards.filter((_, i) => m & (1 << i)).map((c) => c.emoji))).toEqual([["📘", "🎨"]]);
    const cheapest4 = sum([...prices].sort((x, y) => x - y).slice(0, 4));
    expect(cheapest4).toBeGreaterThan(50);
  });

  it("переливания: 6 действий, а 1 л и 2 л — за 4 и 2", () => {
    const a = answer("w2d4t8", "jugs");
    expect(shortestJugs(a.capacities, a.target)).toBe(a.optimal);
    const plan: JugsAction[] = [
      { type: "fill", jug: 1 },
      { type: "pour", from: 1 },
      { type: "empty", jug: 0 },
      { type: "pour", from: 1 },
      { type: "fill", jug: 1 },
      { type: "pour", from: 1 },
    ];
    expect(replayJugs(a.capacities, plan).slice(1)).toEqual([
      [0, 5],
      [3, 2],
      [0, 2],
      [2, 0],
      [2, 5],
      [3, 4],
    ]);
    // Если наполнять маленькое ведро и переливать в большое — 8 действий.
    const smallFirst: JugsAction[] = [
      { type: "fill", jug: 0 },
      { type: "pour", from: 0 },
      { type: "fill", jug: 0 },
      { type: "pour", from: 0 },
      { type: "empty", jug: 1 },
      { type: "pour", from: 0 },
      { type: "fill", jug: 0 },
      { type: "pour", from: 0 },
    ];
    expect(replayJugs(a.capacities, smallFirst).at(-1)).toEqual([0, 4]);
    expect(shortestJugs(a.capacities, 1)).toBe(4);
    expect(shortestJugs(a.capacities, 2)).toBe(2);
  });
});

describe("Неделя 2 · День 5", () => {
  it("чётное или нечётное", () => {
    const parity = (x: number) => (x % 2 === 0 ? "even" : "odd");
    expect(answer("w2d5t1", "assign").correct).toEqual({
      a: parity(23 + 45),
      b: parity(17 + 30),
      c: parity(50 - 21),
      d: parity(11 + 13 + 15 + 17),
    });
  });

  it("сумма и разность не меняются", () => {
    const n = numbers("w2d5t2");
    expect(n.a).toBe(38 + 57);
    expect(n.b).toBe(63 - 28);
    expect(38 + 57).toBe(40 + 55);
    expect(63 - 28).toBe(65 - 30);
  });

  it("стаканчики: три перевернуть нельзя, а четыре — можно за 2 хода", () => {
    /** Наименьшее число ходов (переворачиваем ровно два), или -1, если нельзя. */
    const flips = (cups: number) => {
      const goal = (1 << cups) - 1;
      const dist = new Map([[0, 0]]);
      const queue = [0];
      while (queue.length) {
        const s = queue.shift()!;
        if (s === goal) return dist.get(s)!;
        for (let i = 0; i < cups; i++)
          for (let j = i + 1; j < cups; j++) {
            const n = s ^ (1 << i) ^ (1 << j);
            if (!dist.has(n)) {
              dist.set(n, dist.get(s)! + 1);
              queue.push(n);
            }
          }
      }
      return -1;
    };
    expect(flips(3)).toBe(-1);
    expect(answer("w2d5t3", "choice").correct).toEqual(["never"]);
    expect(flips(4)).toBe(2);
  });

  it("девятки: сумма цифр всегда 9", () => {
    const n = numbers("w2d5t4");
    expect([n.n6, n.n7]).toEqual([45 + 9, 54 + 9]);
    const row = range(1, 10).map((k) => 9 * k);
    row.forEach((x) => expect(sum([...String(x)].map(Number))).toBe(9));
    expect(row).toContain(72);
    expect(row).not.toContain(75);
  });

  it("вернётся ли робот: А и В; программа-возвращение всегда чётной длины", () => {
    const a = answer("w2d5t5", "choice");
    const delta: Record<string, [number, number]> = { "→": [1, 0], "←": [-1, 0], "↑": [0, -1], "↓": [0, 1] };
    const returns = (arrows: string[]) => {
      const [x, y] = arrows.reduce(([px, py], d) => [px + delta[d][0], py + delta[d][1]], [0, 0]);
      return x === 0 && y === 0;
    };
    const back = a.options.filter((o) => returns(o.label.split(":")[1].trim().split(" "))).map((o) => o.id);
    expect(back).toEqual(a.correct);
    // Перебором: ни одна программа из 1, 3, 5 или 7 команд не возвращает робота.
    const arrows = Object.keys(delta);
    for (const len of [1, 3, 5, 7]) {
      let any = false;
      for (let code = 0; code < 4 ** len && !any; code++) {
        const prog = range(0, len - 1).map((i) => arrows[Math.floor(code / 4 ** i) % 4]);
        any = returns(prog);
      }
      expect(any, `длина ${len}`).toBe(false);
    }
  });

  it("поворот на пол-оборота не меняет только фигуры А и В", () => {
    const a = answer("w2d5t6", "choice");
    const same = a.options
      .filter(
        (o) => o.visual?.type === "polyomino" && shapeKey(rotate(rotate(o.visual.cells))) === shapeKey(o.visual.cells),
      )
      .map((o) => o.id);
    expect(same).toEqual(a.correct);
    // Фигура Б (буква Т) симметрична в зеркале, но не при повороте.
    const b = a.options.find((o) => o.id === "b")!;
    if (b.visual?.type !== "polyomino") throw new Error("нет фигуры Б");
    expect(shapeKey(mirror(b.visual.cells))).toBe(shapeKey(b.visual.cells));
  });

  it("марки поровну", () => {
    let d = 30;
    let al = 10;
    let days = 0;
    while (d !== al) {
      d -= 2;
      al += 2;
      days++;
    }
    const n = numbers("w2d5t7");
    expect([n.days, n.each]).toEqual([days, d]);
    expect(10 + 2 * 6 - (30 - 2 * 6)).toBe(4);
  });

  it("доминошки: без противоположных углов покрыть нельзя, без соседних — можно", () => {
    const cells = visual("w2d5t8", "polyomino").cells;
    const region = new Set(cells.map(([c, r]) => `${c},${r}`));
    expect(region).toEqual(new Set([...rect(4, 4)].filter((k) => k !== "0,0" && k !== "3,3")));
    const domino: Cell[] = [
      [0, 0],
      [1, 0],
    ];
    const seven = Array.from({ length: 7 }, () => domino);
    expect(canTile(region, seven)).toBe(false);
    expect(answer("w2d5t8", "choice").correct).toEqual(["no"]);
    const black = cells.filter(([c, r]) => (c + r) % 2 === 0).length;
    expect([black, cells.length - black]).toEqual([6, 8]);
    const adjacent = new Set([...rect(4, 4)].filter((k) => k !== "0,0" && k !== "3,0"));
    expect(canTile(adjacent, seven)).toBe(true);
  });
});

describe("Неделя 2 · День 6", () => {
  it("знакомый приём", () => {
    expect(numbers("w2d6t1").a).toBe(17 + 26 + 13 + 14);
    expect(numbers("w2d6t1").b).toBe(19 + 36 + 21 + 4);
  });

  it("сломанный калькулятор: примеры из ответа работают", () => {
    const a = answer("w2d6t2", "expressions");
    expect(visual("w2d6t2", "calculator")).toMatchObject({ broken: a.forbidden, target: a.target });
    for (const expr of ["28+7", "29+6", "42-7", "40-6+1", "17+18", "26+9"]) {
      const r = evaluate(expr);
      expect(r.ok && r.value === a.target, expr).toBe(true);
      expect(usesForbidden(expr, a.forbidden), expr).toBe(false);
    }
    expect(usesForbidden("30+5", a.forbidden)).toBe(true);
    for (const expr of ["49+4", "60-7"]) {
      const r = evaluate(expr);
      expect(r.ok && r.value).toBe(53);
      expect(usesForbidden(expr, a.forbidden)).toBe(false);
    }
  });

  it("слова из букв — это пути робота", () => {
    const words = (letters: string) => new Set(permutations([...letters]).map((p) => p.join("")));
    expect(words("ААББ").size).toBe(numbers("w2d6t3").words);
    expect(words("АААББ").size).toBe(10);
    const paths = answer("w1d4t5", "robot").puzzle.pathsCount;
    expect(words("ААББ").size).toBe(paths);
  });

  it("треугольники из спичек", () => {
    expect(visual("w2d6t4", "matches")).toEqual({ type: "matches", shape: "triangles", figures: [1, 2, 3, 4] });
    const n = numbers("w2d6t4");
    expect(n.m10).toBe(matchCount("triangles", 10));
    expect(range(1, 40).filter((k) => matchCount("triangles", k) === 31)).toEqual([n.t31]);
    expect(matchCount("triangles", 20)).toBe(41);
  });

  it("дорога в зоопарк: 15 минут единственным путём, без дороги — 17 двумя путями", () => {
    const p = answer("w2d6t5", "graph").puzzle;
    expect(shortestTime(p)).toBe(p.optimal);
    const paths = (edges: typeof p.edges) => {
      const out: [number, string][] = [];
      const walk = (cur: string, path: string[], w: number) => {
        if (cur === p.finish) return out.push([w, path.join(">")]);
        for (const e of edges) {
          const next = e.a === cur ? e.b : e.b === cur ? e.a : null;
          if (next && !path.includes(next)) walk(next, [...path, next], w + e.w);
        }
      };
      walk(p.start, [p.start], 0);
      const best = Math.min(...out.map(([w]) => w));
      return { best, routes: out.filter(([w]) => w === best).map(([, r]) => r) };
    };
    expect(paths(p.edges)).toEqual({ best: 15, routes: ["home>bazaar>library>fountain>zoo"] });
    const closed = p.edges.filter((e) => !(e.a === "library" && e.b === "fountain"));
    expect(paths(closed).best).toBe(17);
    expect(paths(closed).routes).toHaveLength(2);
  });

  it("зеркальная ракета: половинки одинаковой ширины", () => {
    const { left } = answer("w2d6t6", "symmetry");
    expect(new Set(left.map((r) => r.length)).size).toBe(1);
  });

  it("велосипеды и машины: решение единственное", () => {
    const sols = range(0, 9)
      .filter((cars) => (9 - cars) * 2 + cars * 4 === 26)
      .map((cars) => [9 - cars, cars]);
    const n = numbers("w2d6t7");
    expect(sols).toEqual([[n.bikes, n.cars]]);
  });

  it("турнир на выбывание: игр на одну меньше, чем команд", () => {
    const games = (teams: number) => {
      let left = teams;
      let played = 0;
      while (left > 1) {
        const round = Math.floor(left / 2);
        played += round;
        left -= round;
      }
      return played;
    };
    expect(numbers("w2d6t8").games).toBe(games(16));
    expect(games(16)).toBe(8 + 4 + 2 + 1);
    expect(games(20)).toBe(19);
  });
});

describe("Неделя 2 · День 7", () => {
  it("какой инструмент?", () => {
    const n = numbers("w2d7t1");
    expect(n.a - 17).toBe(25);
    expect(n.b).toBe(10 / 2 + 1);
    const pairs = range(0, 30).filter((big) => big + (big - 4) === 30);
    expect(pairs).toEqual([n.c]);
  });

  it("мини-судоку: решение единственное, первая клетка — 2", () => {
    const a = answer("w2d7t2", "sudoku");
    expect(sudokuSolutions(a.grid, a.box, 5)).toEqual([a.answer]);
    const candidates = range(1, 4).filter((v) => !a.grid[0].includes(v) && !a.grid.map((row) => row[1]).includes(v));
    expect(candidates).toEqual([2]);
  });

  it("знакомые числа: Фибоначчи, как у лягушки", () => {
    const n = numbers("w2d7t3");
    const seq = [1, 1, 2, 3, 5, 8, n.n7, n.n8];
    expect(seq.every((x, i) => i < 2 || x === seq[i - 1] + seq[i - 2])).toBe(true);
    expect(seq[7] + seq[6]).toBe(34);
  });

  it("кузнечик: 5 прыжков; на 3 — за 7", () => {
    const p = answer("w2d7t4", "performer").puzzle;
    expect(shortestPrograms(p).length).toBe(p.optimal);
    expect(runPerformer(p, [0, 1, 0, 1, 1]).values).toEqual([0, 5, 2, 7, 4, 1]);
    expect(runPerformer(p, [0, 0, 1, 1, 1]).values.at(-1)).toBe(1);
    // Первый прыжок назад невозможен: левее нуля нельзя.
    expect(runPerformer(p, [1]).failedAt).toBe(0);
    expect(shortestPrograms({ ...p, target: 3 }).length).toBe(7);
  });

  it("кубик: напротив 1 — 6, напротив 2 — 5, напротив 3 — 4", () => {
    const net = visual("w2d7t5", "polyomino");
    expect(foldsIntoCube(net.cells)).toBe(true);
    const faces = cubeFaces(net.cells)!;
    const labelOf = new Map(net.cells.map(([c, r], i) => [faces.get(`${c},${r}`)!, net.labels![i]]));
    const opposite = (label: string) => {
      const i = net.labels!.indexOf(label);
      const [c, r] = net.cells[i];
      return labelOf.get(OPPOSITE_FACE[faces.get(`${c},${r}`)!]);
    };
    expect(answer("w2d7t5", "assign").correct).toEqual({ f1: opposite("1"), f2: opposite("2"), f3: opposite("3") });
    ["1", "2", "3"].forEach((l) => expect(Number(l) + Number(opposite(l))).toBe(7));
  });

  it("мороженое и сок", () => {
    const sols = range(0, 14)
      .filter((ice) => 2 * ice + (14 - ice) === 22)
      .map((ice) => [ice, 14 - ice]);
    const n = numbers("w2d7t6");
    expect(sols).toEqual([[n.iceCream, n.juice]]);
  });

  it("числовая стенка: наверху 16, 18, 20, 22 или 24 — как в ответе", () => {
    const a = answer("w2d7r", "wallLab");
    const tops = possibleTops(a.numbers);
    expect([...tops.keys()].sort((x, y) => x - y)).toEqual(a.tops);
    expect(wallTop([1, 2, 3, 4])).toBe(20);
    expect(new Set(tops.get(22)!.map((p) => p.join(",")))).toEqual(
      new Set(["1,2,4,3", "1,4,2,3", "3,2,4,1", "3,4,2,1"]),
    );
    expect([...possibleTops([1, 2, 3]).keys()].sort()).toEqual([7, 8, 9]);
    // Верх = сумма всех + два раза сумма средних.
    for (const [top, arrangements] of tops)
      for (const [x, b, c, y] of arrangements) expect(top).toBe(x + b + c + y + 2 * (b + c));
  });
});
