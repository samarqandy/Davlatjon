/**
 * Каждый ответ из ключа для родителя проверяется независимым расчётом или перебором.
 * Если кто-то поменяет условие задачи и забудет поменять ответ — тест упадёт.
 */
import { describe, expect, it } from "vitest";
import type { Cell, Dir } from "@/content/types";
import { signsValue, timeMatches } from "@/lib/checks";
import { foldsIntoCube } from "@/lib/cube";
import { evaluate, usesForbidden } from "@/lib/expression";
import { shortestTime } from "@/lib/graph";
import { possibleSums } from "@/lib/magicTriangle";
import { allPartitions } from "@/lib/partition";
import { isCongruent, isRotationOf } from "@/lib/polyomino";
import {
  DIRS,
  allShortestPrograms,
  compress,
  distance,
  parseMap,
  runProgram,
  sameCell,
  shortestLength,
} from "@/lib/robot";
import { addMinutes, answer, numbers, permutations, task, times } from "./helpers";

describe("День 1", () => {
  it("19 + 19 + 19 и удобные пары", () => {
    expect(numbers("w1d1t1").sum).toBe(19 + 19 + 19);
    expect(numbers("w1d1t2").sum).toBe(6 + 7 + 4 + 3 + 5 + 5);
  });

  it("домики: решение единственное", () => {
    const animals = ["cat", "dog", "parrot"];
    const houses = ["red", "blue", "green"];
    const solutions = permutations(animals)
      .map((p) => Object.fromEntries(houses.map((h, i) => [h, p[i]])) as Record<string, string>)
      .filter((s) => s.red !== "cat" && s.blue !== "cat" && s.red !== "dog");
    expect(solutions).toEqual([answer("w1d1t3", "assign").correct]);
  });

  it("ряды чисел", () => {
    const n = numbers("w1d1t4");
    expect([n.a5, n.a6]).toEqual([12 + 3, 12 + 6]);
    expect(n.b5).toBe(16 * 2);
  });

  it("робот: кратчайшая программа из 7 команд", () => {
    const p = answer("w1d1t5", "robot").puzzle;
    const map = parseMap(p.map);
    expect(shortestLength(map)).toBe(p.optimal);
    for (const prog of ["UUURRRR", "RRUURUR"]) {
      expect(runProgram(map, [...prog] as Dir[]).reachedGoal, prog).toBe(true);
    }
  });

  it("симметрия: половинки одинаковой ширины", () => {
    const { left } = answer("w1d1t6", "symmetry");
    expect(new Set(left.map((r) => r.length)).size).toBe(1);
  });

  it("наклейки: 23 монеты по 5", () => {
    const n = numbers("w1d1t7");
    expect(n.stickers).toBe(Math.floor(23 / 5));
    expect(n.left).toBe(23 % 5);
  });

  it("квадраты в фигуре 3 × 2", () => {
    const count = (cols: number, rows: number) => {
      let total = 0;
      for (let k = 1; k <= Math.min(cols, rows); k++) total += (cols - k + 1) * (rows - k + 1);
      return total;
    };
    expect(numbers("w1d1t8").squares).toBe(count(3, 2));
    expect(count(3, 3)).toBe(14);
  });
});

describe("День 2", () => {
  it("устный счёт", () => {
    expect(numbers("w1d2t1").sum).toBe(46 + 29);
    expect(numbers("w1d2t2").diff).toBe(50 - 27);
  });

  it("числовая машина: правило «удвоить и прибавить 1»", () => {
    const task3 = task("w1d2t3");
    const machine = task3.body.find((b) => b.type === "visual");
    if (machine?.type !== "visual" || machine.visual.type !== "machine") throw new Error("нет машины");
    const rule = (x: number) => 2 * x + 1;
    machine.visual.rows
      .filter((r) => r.input !== null && r.output !== null)
      .forEach((r) => expect(rule(r.input!)).toBe(r.output));
    expect(numbers("w1d2t3").out7).toBe(rule(7));
    expect(rule(numbers("w1d2t3").in13)).toBe(13);
    // Правило «+4» подходит только к первой паре.
    expect(3 + 4).toBe(7);
    expect(5 + 4).not.toBe(11);
  });

  it("фигуры: 8-я — синий квадрат", () => {
    const shapes = ["circle", "square", "triangle"];
    const colors = ["red", "blue"];
    const eighth = { shape: shapes[7 % 3], color: colors[7 % 2] };
    const a = answer("w1d2t5", "choice");
    const chosen = a.options.find((o) => o.id === a.correct[0]);
    expect(chosen?.visual).toEqual({ type: "shape", shape: eighth });
    // 12-я — синий треугольник.
    expect({ shape: shapes[11 % 3], color: colors[11 % 2] }).toEqual({ shape: "triangle", color: "blue" });
  });

  it("программа приводит робота к ключу, а к шарику ведёт замена 2-й или 3-й команды", () => {
    const p = answer("w1d2t6", "robot").puzzle;
    const map = parseMap(p.map);
    const run = runProgram(map, p.program!);
    expect(run.status).toBe("ok");
    const itemAt = (cell: Cell) => map.items.find((i) => sameCell(i.cell, cell))?.key;
    expect(itemAt(run.end)).toBe(p.traceAnswer);

    const ways: string[] = [];
    p.program!.forEach((_, i) =>
      DIRS.forEach((d) => {
        if (d === p.program![i]) return;
        const prog = [...p.program!];
        prog[i] = d;
        const r = runProgram(map, prog);
        if (r.status === "ok" && itemAt(r.end) === "b") ways.push(`${i + 1}:${d}`);
      }),
    );
    expect(ways).toEqual(["2:L", "3:L"]);
  });

  it("кубики: 5 штук, один спрятан", () => {
    const task7 = task("w1d2t7");
    const v = task7.body.find((b) => b.type === "visual");
    if (v?.type !== "visual" || v.visual.type !== "isoCubes") throw new Error("нет кубиков");
    const h = v.visual.heights;
    const total = h.flat().reduce((s, x) => s + x, 0);
    expect(numbers("w1d2t7").cubes).toBe(total);
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
    expect(hidden).toBe(1);
  });

  it("время мультфильмов", () => {
    const t = times("w1d2t8");
    expect(timeMatches(addMinutes("17:30", 45), t.end)).toBe(true);
    expect(timeMatches(addMinutes("20:10", -45), t.start)).toBe(true);
  });

  it("весы", () => {
    const pear = 2;
    const melon = 3 * pear;
    expect(numbers("w1d2t9").melon).toBe(melon);
    expect(numbers("w1d2t9").melonPear).toBe(melon + pear);
  });
});

describe("День 3", () => {
  it("ошибки Незнайки", () => {
    const examples = { a: [27 + 18, 35], b: [40 - 16, 24], c: [33 + 29, 62], d: [52 - 25, 37] };
    const wrong = Object.entries(examples)
      .filter(([, [real, written]]) => real !== written)
      .map(([k]) => k);
    expect(wrong).toEqual(answer("w1d3t1", "choice").correct);
  });

  it("прикидка", () => {
    const sign = (a: number, b: number) => (a < b ? "lt" : a > b ? "gt" : "eq");
    expect(answer("w1d3t2", "assign").correct).toEqual({
      a: sign(38 + 49, 100),
      b: sign(51 + 52, 100),
      c: sign(99 - 48, 50),
    });
  });

  it("ваза: неправду говорит ровно один только в одном случае", () => {
    const suspects = ["cat", "dog", "parrot"];
    const culprits = suspects.filter((culprit) => {
      const truths = [culprit === "dog", culprit === "parrot", culprit !== "parrot"];
      return truths.filter((t) => !t).length === 1;
    });
    expect(culprits).toEqual(answer("w1d3t3", "choice").correct);
  });

  it("сломанные ряды", () => {
    const n = numbers("w1d3t4");
    const a = [5, 10, 15, 21, 25, 30];
    a[a.indexOf(n.aWrong)] = n.aFix;
    expect(a.every((x, i) => i === 0 || x - a[i - 1] === 5)).toBe(true);
    const b = [2, 4, 8, 16, 30, 64];
    b[b.indexOf(n.bWrong)] = n.bFix;
    expect(b.every((x, i) => i === 0 || x === b[i - 1] * 2)).toBe(true);
  });

  it("отладка: ошибка на 3-м шаге, исправление единственное", () => {
    const p = answer("w1d3t5", "robot").puzzle;
    const map = parseMap(p.map);
    const buggy = runProgram(map, p.program!);
    expect(buggy.status).toBe("wall");
    expect(buggy.failedAt).toBe(2);
    const fixes: string[] = [];
    p.program!.forEach((_, i) =>
      DIRS.forEach((d) => {
        if (d === p.program![i]) return;
        const prog = [...p.program!];
        prog[i] = d;
        if (runProgram(map, prog).reachedGoal) fixes.push(`${i + 1}:${d}`);
      }),
    );
    expect(fixes).toEqual(["3:R"]);
    expect(shortestLength(map)).toBe(p.optimal);
  });

  it("повороты фигуры", () => {
    const t = task("w1d3t6");
    const base = t.body.find((b) => b.type === "visual");
    if (base?.type !== "visual" || base.visual.type !== "polyomino") throw new Error("нет фигуры");
    const a = answer("w1d3t6", "choice");
    const rotated = a.options
      .filter(
        (o) =>
          o.visual?.type === "polyomino" &&
          isRotationOf(base.visual.type === "polyomino" ? base.visual.cells : [], o.visual.cells),
      )
      .map((o) => o.id);
    expect(rotated).toEqual(a.correct);
    // Остальные — зеркальные: совпадают только с переворотом.
    for (const o of a.options) {
      if (o.visual?.type === "polyomino" && base.visual.type === "polyomino") {
        expect(isCongruent(base.visual.cells, o.visual.cells)).toBe(true);
      }
    }
  });

  it("чек", () => {
    const n = numbers("w1d3t7");
    expect(n.total).toBe(4 + 9 + 15);
    expect(n.change).toBe(50 - n.total);
  });

  it("код от сейфа: каждая подсказка нужна", () => {
    const digitSum = (x: number) => Math.floor(x / 10) + (x % 10);
    const clues = [
      (x: number) => digitSum(x) === 9,
      (x: number) => x % 2 === 0,
      (x: number) => Math.floor(x / 10) > x % 10,
      (x: number) => x < 70,
    ];
    const twoDigit = Array.from({ length: 90 }, (_, i) => i + 10);
    const fit = (cs: typeof clues) => twoDigit.filter((x) => cs.every((c) => c(x)));
    expect(fit(clues)).toEqual([numbers("w1d3t8").code]);
    clues.forEach((_, i) => expect(fit(clues.filter((__, j) => j !== i)).length).toBeGreaterThan(1));
    expect(fit(clues.slice(0, 3))).toEqual([54, 72, 90]);
  });
});

describe("День 4", () => {
  it("соседние числа", () => {
    const n = numbers("w1d4t1");
    expect(n.small + n.big).toBe(25);
    expect(n.big - n.small).toBe(1);
    expect(Array.from({ length: 30 }, (_, a) => a + a + 1)).not.toContain(30);
  });

  it("знаки: решение каждого примера единственное", () => {
    const a = answer("w1d4t2", "signs");
    for (const row of a.rows) {
      const n = row.numbers.length - 1;
      const found: string[] = [];
      for (let mask = 0; mask < 1 << n; mask++) {
        const signs = Array.from({ length: n }, (_, i) => (mask & (1 << i) ? "−" : "+")) as ("+" | "−")[];
        if (signsValue(row.numbers, signs) === row.result) found.push(signs.join(""));
      }
      expect(found).toEqual([row.answer.join("")]);
    }
  });

  it("наряды, лесенки, треугольники, рукопожатия", () => {
    expect(numbers("w1d4t3").outfits).toBe(3 * 2);
    const tri = (n: number) => (n * (n + 1)) / 2;
    expect(numbers("w1d4t4").s5).toBe(tri(5));
    expect(numbers("w1d4t4").s6).toBe(tri(6));
    const choose2 = (n: number) => (n * (n - 1)) / 2;
    expect(numbers("w1d4t6").triangles).toBe(choose2(2 + 2));
    expect(numbers("w1d4t8").shakes).toBe(choose2(4));
  });

  it("все короткие пути робота", () => {
    const p = answer("w1d4t5", "robot").puzzle;
    const map = parseMap(p.map);
    expect(shortestLength(map)).toBe(p.optimal);
    expect(allShortestPrograms(map)).toHaveLength(p.pathsCount!);
  });

  it("билеты в кино", () => {
    const variants: [number, number][] = [];
    for (let adults = 1; adults <= 4; adults++) {
      for (let kids = 1; kids <= 8; kids++) if (adults * 20 + kids * 10 === 80) variants.push([adults, kids]);
    }
    expect(variants).toEqual([
      [1, 6],
      [2, 4],
      [3, 2],
    ]);
    expect(numbers("w1d4t7").variants).toBe(variants.length);
  });
});

describe("День 5", () => {
  it("цепочки", () => {
    expect(numbers("w1d5t1").result).toBe(7 + 8 - 5 + 20 - 10);
    expect(numbers("w1d5t2").x + 6 - 10).toBe(15);
  });

  it("повтор: короткая запись и сдвиг робота", () => {
    const prog = [..."RRRUURRRUU"] as Dir[];
    expect(compress(prog)).toBe("3→ 2↑ 3→ 2↑");
    const n = numbers("w1d5t3");
    const loop = [..."RRU".repeat(3)] as Dir[];
    expect(loop.filter((d) => d === "R")).toHaveLength(n.right);
    expect(loop.filter((d) => d === "U")).toHaveLength(n.up);
  });

  it("машина-сортировщик", () => {
    const a = answer("w1d5t4", "assign");
    const box = (x: number) => (x > 20 ? (x % 2 === 0 ? "A" : "B") : x % 2 === 0 ? "V" : "G");
    const expected = Object.fromEntries(a.items.map((i) => [i.id, box(Number(i.label))]));
    expect(a.correct).toEqual(expected);
    expect(Object.values(expected)).not.toContain("A");
  });

  it("прыгающий ряд", () => {
    const n = numbers("w1d5t5");
    expect([n.n7, n.n8]).toEqual([10 - 3, 1 + 3]);
    expect(n.n7 + n.n8).toBe(11);
  });

  it("карта сокровищ", () => {
    const t = times("w1d5t6");
    const cols = ["А", "Б", "В", "Г", "Д"];
    // Клад: столбец пальмы (В5), строка камня (Г1).
    expect(t.treasure).toBe("В1");
    // Пират: Б2 → 3 вправо → 2 вверх.
    expect(t.pirate).toBe(`${cols[cols.indexOf("Б") + 3]}${2 + 2}`);
    const task6 = task("w1d5t6");
    const grid = task6.body.find((b) => b.type === "visual");
    if (grid?.type !== "visual" || grid.visual.type !== "coordGrid") throw new Error("нет карты");
    expect(grid.visual.items.find((i) => i.cell === t.pirate)?.emoji).toBe("🦜");
    expect(grid.visual.items.find((i) => i.cell === t.treasure)).toBeUndefined();
  });

  it("поезд", () => {
    const t = times("w1d5t7");
    expect(timeMatches(addMinutes("8:00", 130), t.tashkent)).toBe(true);
    expect(timeMatches(addMinutes("18:40", 130), t.samarkand)).toBe(true);
  });

  it("улитка", () => {
    const snail = (height: number, up: number, down: number) => {
      let pos = 0;
      for (let day = 1; day < 100; day++) {
        pos += up;
        if (pos >= height) return day;
        pos -= down;
      }
      return -1;
    };
    expect(numbers("w1d5t8").day).toBe(snail(6, 3, 2));
    expect(snail(10, 3, 2)).toBe(8);
  });
});

describe("День 6", () => {
  it("пять чисел подряд", () => {
    expect(numbers("w1d6t1").sum).toBe(8 + 9 + 10 + 11 + 12);
  });

  it("сломанный калькулятор: примеры из ответа работают", () => {
    const a = answer("w1d6t2", "expressions");
    for (const expr of ["49+1", "40+10", "30+20", "60-10", "70-20", "48+2", "99-49", "26+24"]) {
      const r = evaluate(expr);
      expect(r.ok && r.value === a.target, expr).toBe(true);
      expect(usesForbidden(expr, a.forbidden), expr).toBe(false);
    }
    expect(usesForbidden("25+25", a.forbidden)).toBe(true);
    const r55 = evaluate("60-4-1");
    expect(r55.ok && r55.value).toBe(55);
  });

  it("шоколадка: разломов на 1 меньше, чем долек", () => {
    expect(numbers("w1d6t3").breaks).toBe(4 * 3 - 1);
  });

  it("ряд 1, 2, 4: известные правила дают свои ответы", () => {
    const a = answer("w1d6t4", "rules");
    const next: Record<number, number> = {
      8: 4 * 2,
      7: 4 + 3,
      5: 4 + 1,
      1: 1,
    };
    for (const k of a.known) expect(next[k.value]).toBe(k.value);
  });

  it("самый быстрый путь", () => {
    const p = answer("w1d6t5", "graph").puzzle;
    expect(shortestTime(p)).toBe(p.optimal);
    const closed = p.edges.filter((e) => !(e.a === "park" && e.b === "shop"));
    expect(shortestTime({ ...p, edges: closed })).toBe(12);
  });

  it("квадрат 4 × 4 режется на две одинаковые части 6 способами", () => {
    expect(allPartitions(4)).toHaveLength(answer("w1d6t6", "partition").distinct);
  });

  it("тетради", () => {
    let best = Infinity;
    for (let sets = 0; sets <= 3; sets++) {
      for (let single = 0; single <= 9; single++) {
        if (sets * 4 + single >= 9) best = Math.min(best, sets * 10 + single * 3);
      }
    }
    expect(numbers("w1d6t7").price).toBe(best);
  });

  it("куры и кролики: решение единственное", () => {
    const sols: [number, number][] = [];
    for (let hens = 0; hens <= 7; hens++) {
      const rabbits = 7 - hens;
      if (hens * 2 + rabbits * 4 === 20) sols.push([hens, rabbits]);
    }
    expect(sols).toEqual([[numbers("w1d6t8").hens, numbers("w1d6t8").rabbits]]);
  });
});

describe("День 7", () => {
  it("удвоение", () => {
    const n = numbers("w1d7t1");
    expect([n.d15, n.d24, n.d38, n.d45]).toEqual([30, 48, 76, 90]);
  });

  it("рост: порядок единственный, и каждое утверждение нужно", () => {
    const a = answer("w1d7t2", "order");
    const rules: [string, string][] = [
      ["ali", "bobur"],
      ["bobur", "vika"],
      ["dima", "ali"],
    ];
    const fits = (rs: [string, string][]) =>
      permutations(a.items.map((i) => i.id)).filter((p) => rs.every(([hi, lo]) => p.indexOf(hi) < p.indexOf(lo)));
    expect(fits(rules)).toEqual([a.correct]);
    rules.forEach((_, i) => expect(fits(rules.filter((__, j) => j !== i)).length).toBeGreaterThan(1));
  });

  it("волшебный квадрат: ответ верный и единственный", () => {
    const a = answer("w1d7t3", "magicSquare");
    const lines = (g: number[][]) => [
      ...g,
      ...[0, 1, 2].map((c) => g.map((row) => row[c])),
      [g[0][0], g[1][1], g[2][2]],
      [g[0][2], g[1][1], g[2][0]],
    ];
    const isMagic = (g: number[][]) => lines(g).every((l) => l.reduce((s, x) => s + x, 0) === 15);
    expect(isMagic(a.answer)).toBe(true);
    expect([...a.answer.flat()].sort((x, y) => x - y)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const empty: [number, number][] = [];
    a.grid.forEach((row, r) => row.forEach((v, c) => v === null && empty.push([r, c])));
    const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => !a.grid.flat().includes(x));
    const completions = permutations(missing).filter((p) => {
      const g = a.grid.map((row) => [...row]) as number[][];
      empty.forEach(([r, c], i) => (g[r][c] = p[i]));
      return isMagic(g);
    });
    expect(completions).toHaveLength(1);
  });

  it("робот собирает звёзды: 16 команд, а «сначала ближайшая» даёт 18", () => {
    const p = answer("w1d7t4", "robot").puzzle;
    const map = parseMap(p.map);
    expect(shortestLength(map)).toBe(p.optimal);
    const example = [..."RRRRULLULLUURRRR"] as Dir[];
    const run = runProgram(map, example);
    expect(run.reachedGoal && run.allStars).toBe(true);
    expect(example).toHaveLength(16);
    // «Жадный» порядок: каждый раз идти к ближайшей звезде.
    let cur: Cell = map.start;
    const left = [...map.stars];
    let greedy = 0;
    while (left.length) {
      left.sort((x, y) => distance(map, cur, x) - distance(map, cur, y));
      const next = left.shift()!;
      greedy += distance(map, cur, next);
      cur = next;
    }
    greedy += distance(map, cur, map.goal!);
    expect(greedy).toBe(18);
  });

  it("развёртки куба", () => {
    const a = answer("w1d7t5", "choice");
    const folds = a.options
      .filter((o) => o.visual?.type === "polyomino" && foldsIntoCube(o.visual.cells))
      .map((o) => o.id);
    expect(folds).toEqual(a.correct);
  });

  it("волшебный треугольник: возможны суммы 9–12, углы — как в ответе", () => {
    const a = answer("w1d7r", "magicTriangle");
    const sums = possibleSums(a.numbers);
    expect([...sums.keys()].sort((x, y) => x - y)).toEqual(a.sums);
    const corners = (s: number) =>
      new Set([...(sums.get(s) ?? [])].map((v) => [v[0], v[1], v[2]].sort((x, y) => x - y).join(",")));
    expect(corners(9)).toEqual(new Set(["1,2,3"]));
    expect(corners(10)).toEqual(new Set(["1,3,5"]));
    expect(corners(11)).toEqual(new Set(["2,4,6"]));
    expect(corners(12)).toEqual(new Set(["4,5,6"]));
  });
});

describe("все задачи-роботы", () => {
  it("указанная длина кратчайшей программы совпадает с расчётом", async () => {
    const { allTasks } = await import("@/content/program");
    for (const t of allTasks()) {
      if (t.answer.kind !== "robot" || t.answer.puzzle.optimal === undefined) continue;
      expect(shortestLength(parseMap(t.answer.puzzle.map)), t.id).toBe(t.answer.puzzle.optimal);
    }
  });
});
