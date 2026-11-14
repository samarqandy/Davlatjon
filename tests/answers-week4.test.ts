/**
 * Неделя 4 (геометрия): каждый ответ из ключа для родителя проверяется независимым расчётом или перебором —
 * по самим рисункам задачи (клетки фигур, высоты столбиков, карты), а не по готовым числам.
 */
import { describe, expect, it } from "vitest";
import type { Cell } from "@/content/types";
import { HOLE, SQUARE_WITH_HOLE } from "@/content/week4/day3";
import { STAIRS_4 } from "@/content/week4/day4";
import { NET, NET_LABELS, PLAN, PYRAMID_3, TOWER } from "@/content/week4/day5";
import { allShortestPrograms, parseMap, shortestLength } from "@/lib/robot";
import { answer, numbers, task, times, visual } from "./helpers";

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
const key = (c: Cell) => `${c[0]},${c[1]}`;

/** Фигура без учёта сдвига: клетки, прижатые к левому верхнему углу, в одном порядке. */
function normalize(cells: readonly Cell[]): string {
  const minC = Math.min(...cells.map((c) => c[0]));
  const minR = Math.min(...cells.map((c) => c[1]));
  return cells
    .map(([c, r]) => [c - minC, r - minR] as const)
    .map(key)
    .sort()
    .join(" ");
}
const rotate = (cells: readonly Cell[]): Cell[] => cells.map(([c, r]) => [-r, c] as const);
const mirror = (cells: readonly Cell[]): Cell[] => cells.map(([c, r]) => [-c, r] as const);
const flipUpDown = (cells: readonly Cell[]): Cell[] => cells.map(([c, r]) => [c, -r] as const);
function rotations(cells: readonly Cell[]): string[] {
  const out: string[] = [];
  let cur: Cell[] = [...cells];
  for (let i = 0; i < 4; i++) {
    out.push(normalize(cur));
    cur = rotate(cur);
  }
  return out;
}

/** Периметр фигуры из клеток: стороны клеток, у которых нет соседа. */
function perimeter(cells: readonly Cell[]): number {
  const set = new Set(cells.map(key));
  let p = 0;
  for (const [c, r] of cells)
    for (const [dc, dr] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ])
      if (!set.has(key([c + dc, r + dr]))) p++;
  return p;
}
const rect = (cols: number, rows: number): Cell[] =>
  range(0, rows - 1).flatMap((r) => range(0, cols - 1).map((c) => [c, r] as const));

/** Ответы задач с выбором и сопоставлением. */
const choice = (id: string) => answer(id, "choice");
const assign = (id: string) => answer(id, "assign").correct;
/** Клетки фигуры в варианте ответа. */
function optionCells(id: string, option: string): Cell[] {
  const o = choice(id).options.find((x) => x.id === option)!;
  if (o.visual?.type !== "polyomino") throw new Error(`${id}/${option}: нет фигуры`);
  return o.visual.cells as Cell[];
}

describe("День 1: фигуры", () => {
  it("углы и палочки", () => {
    expect(numbers("w4d1t1")).toEqual({ a: 3, b: 4, c: 3 * 3 + 2 * 4, d: 2 * 5 });
  });

  it("квадраты в сетке 3 × 3 и прямоугольники в сетке 3 × 2 — перебором", () => {
    const g = visual("w4d1t2", "gridFigure");
    let squares = 0;
    for (let s = 1; s <= Math.min(g.cols, g.rows); s++) squares += (g.cols - s + 1) * (g.rows - s + 1);
    expect(numbers("w4d1t2").squares).toBe(squares);

    const h = visual("w4d1t8", "gridFigure");
    let rects = 0;
    for (let w = 1; w <= h.cols; w++) for (let t = 1; t <= h.rows; t++) rects += (h.cols - w + 1) * (h.rows - t + 1);
    expect(numbers("w4d1t8").rects).toBe(rects);
  });

  it("цветные фигуры: решение единственное", () => {
    const colors = ["red", "blue", "green"];
    const fits: string[] = [];
    for (const circle of colors)
      for (const square of colors)
        for (const triangle of colors) {
          if (new Set([circle, square, triangle]).size < 3) continue;
          if (triangle === "red" || triangle === "blue") continue;
          if (circle === "blue") continue;
          fits.push(`${circle} ${square} ${triangle}`);
        }
    const a = assign("w4d1t3");
    expect(fits).toEqual([`${a.circle} ${a.square} ${a.triangle}`]);
  });

  it("треугольные числа", () => {
    const tri = (n: number) => sum(range(1, n));
    expect(visual("w4d1t4", "sequence").items.slice(0, 4)).toEqual([1, 2, 3, 4].map(tri));
    expect(numbers("w4d1t4")).toEqual({ fifth: tri(5), eighth: tri(8) });
  });

  it("карандаш: замкнулась ли линия и какая фигура", () => {
    const programs: Record<string, [number, number][]> = {
      a: [
        [3, 0],
        [0, 3],
        [-3, 0],
        [0, -3],
      ],
      b: [
        [4, 0],
        [0, 2],
        [-4, 0],
        [0, -2],
      ],
      c: [
        [3, 0],
        [0, 2],
        [-1, 0],
      ],
      d: [
        [2, 0],
        [0, 2],
        [-2, 0],
        [0, -1],
      ],
    };
    const kind = (steps: [number, number][]) => {
      const end = steps.reduce(([x, y], [dx, dy]) => [x + dx, y + dy], [0, 0]);
      if (end[0] !== 0 || end[1] !== 0 || steps.length !== 4) return "open";
      const sides = steps.map(([dx, dy]) => Math.abs(dx) + Math.abs(dy));
      return sides.every((s) => s === sides[0]) ? "square" : "rect";
    };
    expect(assign("w4d1t5")).toEqual(Object.fromEntries(Object.entries(programs).map(([k, v]) => [k, kind(v)])));
  });

  it("треугольники в квадрате с диагоналями — перебором троек точек", () => {
    const fig = visual("w4d1t6", "strokes").figures[0];
    const pts = fig.points;
    const collinear = (a: number, b: number, c: number) =>
      (pts[b][0] - pts[a][0]) * (pts[c][1] - pts[a][1]) - (pts[b][1] - pts[a][1]) * (pts[c][0] - pts[a][0]) === 0;
    const between = (a: number, m: number, b: number) =>
      collinear(a, m, b) &&
      Math.min(pts[a][0], pts[b][0]) <= pts[m][0] &&
      pts[m][0] <= Math.max(pts[a][0], pts[b][0]) &&
      Math.min(pts[a][1], pts[b][1]) <= pts[m][1] &&
      pts[m][1] <= Math.max(pts[a][1], pts[b][1]);
    const drawn = new Set(fig.lines.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`));
    const direct = (a: number, b: number) => drawn.has(`${Math.min(a, b)}-${Math.max(a, b)}`);
    /** Точки соединены отрезком рисунка — напрямую или через точку посередине на той же прямой. */
    const joined = (a: number, b: number) =>
      direct(a, b) || pts.some((_, m) => m !== a && m !== b && between(a, m, b) && direct(a, m) && direct(m, b));
    let count = 0;
    for (let a = 0; a < pts.length; a++)
      for (let b = a + 1; b < pts.length; b++)
        for (let c = b + 1; c < pts.length; c++)
          if (!collinear(a, b, c) && joined(a, b) && joined(b, c) && joined(a, c)) count++;
    expect(numbers("w4d1t6").triangles).toBe(count);
  });

  it("коврик: всего, у края и в середине", () => {
    const g = visual("w4d1t7", "gridFigure");
    const inner = (g.cols - 2) * (g.rows - 2);
    expect(numbers("w4d1t7")).toEqual({ all: g.cols * g.rows, edge: g.cols * g.rows - inner, inner });
  });
});

describe("День 2: симметрия", () => {
  it("ёлочка: строки левой половины одной ширины", () => {
    const a = answer("w4d2t2", "symmetry");
    expect(new Set(a.left.map((r) => r.length)).size).toBe(1);
  });

  it("перевёртыши — перебором", () => {
    const pal = (n: number) => String(n) === [...String(n)].reverse().join("");
    expect(numbers("w4d2t4")).toEqual({
      two: range(10, 99).filter(pal).length,
      hundred: range(100, 199).filter(pal).length,
      year: range(2027, 9999).find(pal),
    });
  });

  it("зеркальная программа: в вертикальном зеркале меняются только → и ←", () => {
    const flip: Record<string, string> = { "→": "←", "←": "→", "↑": "↑", "↓": "↓" };
    const source = "→ → ↑ → ↑ ↑";
    const mirrored = source
      .split(" ")
      .map((d) => flip[d])
      .join(" ");
    const a = choice("w4d2t5");
    expect(a.options.find((o) => o.id === a.correct[0])!.label).toBe(mirrored);
    expect(a.options.filter((o) => o.label === mirrored)).toHaveLength(1);
  });

  it("отражение фигуры: верный вариант — отражение, остальные — нет; подписи к неверным тоже верны", () => {
    const fig = visual("w4d2t6", "polyomino").cells as Cell[];
    expect(normalize(optionCells("w4d2t6", choice("w4d2t6").correct[0]))).toBe(normalize(mirror(fig)));
    expect(normalize(optionCells("w4d2t6", "same"))).toBe(normalize(fig));
    expect(normalize(optionCells("w4d2t6", "upside"))).toBe(normalize(flipUpDown(fig)));
    expect(normalize(optionCells("w4d2t6", "turned"))).toBe(normalize(rotate(rotate(fig))));
    for (const id of ["same", "upside", "turned"])
      expect(normalize(optionCells("w4d2t6", id))).not.toBe(normalize(mirror(fig)));
  });

  it("салфетка: дырочек столько, сколько слоёв под каждой", () => {
    expect(numbers("w4d2t7")).toEqual({ half: 2 * 2, quarter: 3 * 4, fold: 1 });
  });

  it("две оси симметрии: дорисовать нужно по отражениям", () => {
    const g = visual("w4d2t8", "cellGrid");
    const cells = g.rects.map((r) => [r.col, r.row] as Cell);
    const vert = (c: Cell): Cell => [g.cols - 1 - c[0], c[1]];
    const horiz = (c: Cell): Cell => [c[0], g.rows - 1 - c[1]];
    const one = new Set([...cells, ...cells.map(vert)].map(key));
    const both = new Set(
      [...cells, ...cells.map(vert), ...cells.map(horiz), ...cells.map((c) => vert(horiz(c)))].map(key),
    );
    expect(numbers("w4d2t8")).toEqual({ one: one.size - cells.length, both: both.size - cells.length });
  });
});

describe("День 3: разрезание", () => {
  it("клетки фигур", () => {
    const t = task("w4d3t1");
    const sizes = t.body.flatMap((b) =>
      b.type === "question" && b.visual?.type === "polyomino" ? [b.visual.cells.length] : [],
    );
    expect(Object.values(numbers("w4d3t1"))).toEqual(sizes);
  });

  it("прямоугольники из квадратиков — пары делителей", () => {
    const pairs = (n: number) => range(1, n).filter((a) => n % a === 0 && a <= n / a).length;
    expect(numbers("w4d3t2")).toEqual({ twelve: pairs(12), sixteen: pairs(16), twentyfour: pairs(24) });
  });

  it("правда о разрезании: квадрат 4 × 4, разрезанный лесенкой, — часть с периметром 16", () => {
    // Нижняя левая часть при разрезе «лесенкой» из угла в угол: в столбце c — c + 1 клетка снизу… до 4 × 4 это 10 клеток.
    const part: Cell[] = range(0, 3).flatMap((c) => range(3 - c, 3).map((r) => [c, r] as const));
    expect(perimeter(part)).toBe(perimeter(rect(4, 4)));
    expect(assign("w4d3t3").perim).toBe("no");
  });

  it("блин: 2, 4, 7, 11, 16", () => {
    const pieces = (n: number) => 1 + sum(range(1, n));
    expect([1, 2, 3].map(pieces)).toEqual([2, 4, 7]);
    expect(numbers("w4d3t4")).toEqual({ four: pieces(4), five: pieces(5) });
  });

  it("квадрат из листа: шаги в верном порядке", () => {
    expect(answer("w4d3t5", "order").correct).toEqual(["fold", "press", "cut", "open"]);
  });

  it("недостающий кусок: подходит поворотом только А, Б — только переворотом", () => {
    expect(normalize([...SQUARE_WITH_HOLE, ...HOLE])).toBe(normalize(rect(3, 3)));
    expect(visual("w4d3t6", "polyomino").cells).toEqual(SQUARE_WITH_HOLE);
    const hole = normalize(HOLE);
    const fitsByTurning = (id: string) => rotations(optionCells("w4d3t6", id)).includes(hole);
    const fitsByFlipping = (id: string) => rotations(mirror(optionCells("w4d3t6", id))).includes(hole);
    expect(["s", "z", "t", "l"].filter(fitsByTurning)).toEqual(choice("w4d3t6").correct);
    expect(fitsByFlipping("z")).toBe(true);
    expect(fitsByFlipping("t") || fitsByFlipping("l")).toBe(false);
  });

  it("плитка: пол 300 × 200 см", () => {
    expect(numbers("w4d3t7")).toEqual({ small: (300 / 50) * (200 / 50), big: (300 / 100) * (200 / 100) });
  });

  it("квадрат 4 × 4 на 10 и на 7 квадратов: решение уравнений единственное", () => {
    /** Сколько квадратов 1 × 1, 2 × 2, 3 × 3 при данном числе частей (3 × 3 — не больше одного). */
    const ways = (parts: number) => {
      const out: [number, number, number][] = [];
      for (let big = 0; big <= 1; big++)
        for (let mid = 0; mid <= 4; mid++) {
          const small = parts - big - mid;
          if (small >= 0 && small + 4 * mid + 9 * big === 16 && !(big === 1 && mid > 0)) out.push([small, mid, big]);
        }
      return out;
    };
    expect(ways(10)).toEqual([[8, 2, 0]]);
    expect(ways(7)).toEqual([[4, 3, 0]]);
    expect(numbers("w4d3t8")).toEqual({ ten: 2, seven: 4 });
  });
});

describe("День 4: периметр и площадь", () => {
  it("периметры прямоугольников", () => {
    const t = task("w4d4t1");
    const ps = t.body.flatMap((b) =>
      b.type === "question" && b.visual?.type === "gridFigure" ? [perimeter(rect(b.visual.cols, b.visual.rows))] : [],
    );
    expect(Object.values(numbers("w4d4t1"))).toEqual(ps);
  });

  it("уголок: площадь и периметр", () => {
    const cells = visual("w4d4t2", "polyomino").cells as Cell[];
    expect(numbers("w4d4t2")).toEqual({ area: cells.length, perimeter: perimeter(cells) });
  });

  it("площадь 12: самый маленький и самый большой периметр", () => {
    const a = answer("w4d4t3", "assign");
    const p = Object.fromEntries(
      a.options.map((o) => {
        if (o.visual?.type !== "gridFigure") throw new Error(o.id);
        expect(o.visual.cols * o.visual.rows).toBe(12);
        return [o.id, perimeter(rect(o.visual.cols, o.visual.rows))];
      }),
    );
    const sorted = Object.entries(p).sort((x, y) => x[1] - y[1]);
    expect(a.correct).toEqual({ min: sorted[0][0], max: sorted.at(-1)![0] });
  });

  it("лесенка: клетки, периметр и закономерность 4n", () => {
    expect(visual("w4d4t4", "polyomino").cells).toEqual(STAIRS_4);
    const stairs = (n: number): Cell[] =>
      range(0, n - 1).flatMap((c) => range(n - 1 - c, n - 1).map((r) => [c, r] as const));
    expect(normalize(stairs(4))).toBe(normalize(STAIRS_4));
    expect(numbers("w4d4t4")).toEqual({ area: STAIRS_4.length, p4: perimeter(STAIRS_4), p10: perimeter(stairs(10)) });
  });

  it("робот обходит грядку: 12 команд", () => {
    const a = answer("w4d4t5", "robot");
    expect(shortestLength(parseMap(a.puzzle.map))).toBe(12);
  });

  it("фигуры из четырёх клеток: меньше всех периметр у квадрата", () => {
    const a = choice("w4d4t6");
    const ps = a.options.map((o) => perimeter(optionCells("w4d4t6", o.id)));
    const min = Math.min(...ps);
    expect(a.options.filter((_, i) => ps[i] === min).map((o) => o.id)).toEqual(a.correct);
  });

  it("забор и площадь огорода 8 × 5", () => {
    expect(numbers("w4d4t7")).toEqual({ all: 2 * (8 + 5), wall: 2 * (8 + 5) - 8, area: 8 * 5 });
  });

  it("наклейки внахлёст — по клеткам", () => {
    const g = visual("w4d4t8", "cellGrid");
    const cover = new Map<string, number>();
    for (const r of g.rects)
      for (const c of range(r.col, r.col + r.w - 1))
        for (const row of range(r.row, r.row + r.h - 1)) cover.set(`${c},${row}`, (cover.get(`${c},${row}`) ?? 0) + 1);
    const covered = cover.size;
    expect(numbers("w4d4t8")).toEqual({
      covered,
      three: [...cover.values()].filter((n) => n === 3).length,
      free: g.cols * g.rows - covered,
    });
  });
});

describe("День 5: кубики", () => {
  const total = (h: number[][]) => sum(h.flat());

  it("лесенка и две постройки", () => {
    expect(numbers("w4d5t1").cubes).toBe(total(visual("w4d5t1", "isoCubes").heights));
    const t = task("w4d5t2");
    const counts = t.body.flatMap((b) =>
      b.type === "question" && b.visual?.type === "isoCubes" ? [total(b.visual.heights)] : [],
    );
    expect(Object.values(numbers("w4d5t2"))).toEqual(counts);
  });

  it("вид сверху: клетки, где стоит хотя бы один кубик", () => {
    expect(visual("w4d5t3", "isoCubes").heights).toEqual(TOWER);
    const top: Cell[] = TOWER.flatMap((row, r) => row.flatMap((h, c) => (h > 0 ? [[c, r] as const] : [])));
    const right = choice("w4d5t3").options.filter((o) => normalize(optionCells("w4d5t3", o.id)) === normalize(top));
    expect(right.map((o) => o.id)).toEqual(choice("w4d5t3").correct);
  });

  it("ступенчатая пирамида: этажи — квадраты нечётных чисел", () => {
    expect(visual("w4d5t4", "isoCubes").heights).toEqual(PYRAMID_3);
    const pyramid = (n: number) => sum(range(1, n).map((k) => (2 * k - 1) ** 2));
    expect(total(PYRAMID_3)).toBe(pyramid(3));
    expect(numbers("w4d5t4")).toEqual({ three: pyramid(3), four: pyramid(4) });
  });

  it("вид спереди и слева по плану; таблица в условии — тот же план", () => {
    const table = visual("w4d5t5", "table");
    expect(table.rows.map((r) => r.slice(1).map(Number))).toEqual(PLAN);
    const front = sum(range(0, 2).map((c) => Math.max(...PLAN.map((row) => row[c]))));
    const left = sum(PLAN.map((row) => Math.max(...row)));
    expect(numbers("w4d5t5")).toEqual({ total: total(PLAN), front, left });
  });

  it("развёртка: грани через одну в ряду — противоположные", () => {
    expect(visual("w4d5t6", "polyomino").cells).toEqual(NET);
    const at = (c: number, r: number) => NET.findIndex(([x, y]) => x === c && y === r);
    const opposite = new Map<number, number>();
    NET.forEach(([c, r], i) => {
      for (const [dc, dr] of [
        [2, 0],
        [0, 2],
      ]) {
        const j = at(c + dc, r + dr);
        if (j >= 0 && at(c + dc / 2, r + dr / 2) >= 0) {
          opposite.set(i, j);
          opposite.set(j, i);
        }
      }
    });
    expect(opposite.size).toBe(6);
    const a = answer("w4d5t6", "assign");
    const letter = (optionId: string) => a.options.find((o) => o.id === optionId)!.label;
    for (const item of a.items) {
      const face = NET_LABELS.indexOf(item.label.slice(-1));
      expect(letter(a.correct[item.id]), item.label).toBe(NET_LABELS[opposite.get(face)!]);
    }
  });

  it("покрашенный кубик 3 × 3 × 3 — перебором", () => {
    const n = 3;
    const painted = [0, 0, 0, 0];
    for (const x of range(0, n - 1))
      for (const y of range(0, n - 1))
        for (const z of range(0, n - 1)) painted[[x, y, z].filter((v) => v === 0 || v === n - 1).length]++;
    expect(numbers("w4d5t7")).toEqual({ three: painted[3], two: painted[2], one: painted[1], none: painted[0] });
  });

  it("меньше и больше всего кубиков при видах спереди 2, 1, 3 и слева 3, 2 — перебором", () => {
    const front = [2, 1, 3];
    const side = [3, 2];
    let min = Infinity;
    let max = -Infinity;
    const cells = 6;
    for (let m = 0; m < 4 ** cells; m++) {
      const h = range(0, cells - 1).map((i) => Math.floor(m / 4 ** i) % 4);
      const grid = [h.slice(0, 3), h.slice(3, 6)];
      const okFront = front.every((v, c) => Math.max(grid[0][c], grid[1][c]) === v);
      const okSide = side.every((v, r) => Math.max(...grid[r]) === v);
      if (!okFront || !okSide) continue;
      min = Math.min(min, sum(h));
      max = Math.max(max, sum(h));
    }
    expect(numbers("w4d5t8")).toEqual({ min, max });
  });
});

describe("День 6: карта", () => {
  const dirs = ["n", "e", "s", "w"];

  it("повороты", () => {
    const turn = (right: number) => dirs[(((0 + right) % 4) + 4) % 4];
    expect(assign("w4d6t1")).toEqual({ a: turn(1), b: turn(-1), c: turn(2), d: turn(-3) });
  });

  /** Клетка карты → [номер столбца, номер строки]. */
  const pos = (cols: string[], cell: string) => [cols.indexOf(cell[0]), Number(cell.slice(1))] as const;
  const cellOf = (cols: string[], c: number, r: number) => `${cols[c]}${r}`;

  it("где клад: шаги от дома и от дерева", () => {
    const g = visual("w4d6t2", "coordGrid");
    const from = (label: string) => pos(g.cols, g.items.find((i) => i.label === label)!.cell);
    const [hc, hr] = from("дом");
    const [tc, tr] = from("дерево");
    expect(times("w4d6t2")).toEqual({ first: cellOf(g.cols, hc + 2, hr + 3), second: cellOf(g.cols, tc - 4, tr - 2) });
  });

  it("клетка по приметам: подходит одна, и каждая примета нужна", () => {
    const g = visual("w4d6t3", "coordGrid");
    const well = pos(g.cols, g.items.find((i) => i.label === "колодец")!.cell);
    const busy = new Set(g.items.map((i) => i.cell));
    const empty = range(0, g.cols.length - 1)
      .flatMap((c) => range(1, g.rows).map((r) => [c, r] as const))
      .filter(([c, r]) => !busy.has(cellOf(g.cols, c, r)));
    const clues = [
      ([, r]: readonly [number, number]) => r === well[1],
      ([c, r]: readonly [number, number]) => Math.abs(c - well[0]) + Math.abs(r - well[1]) !== 1,
      ([c]: readonly [number, number]) => g.cols[c] !== "В",
    ];
    const fit = (list: typeof clues) =>
      empty.filter((p) => list.every((f) => f(p))).map(([c, r]) => cellOf(g.cols, c, r));
    expect(fit(clues)).toEqual([times("w4d6t3").treasure]);
    clues.forEach((_, i) => expect(fit(clues.filter((__, j) => j !== i)).length).toBeGreaterThan(1));
  });

  it("уголки квадрата: числа в клетках — номер уголка, суммы нечётных — квадраты", () => {
    const v = visual("w4d6t4", "polyomino");
    v.cells.forEach(([c, r], i) => expect(v.labels![i]).toBe(String(Math.max(c, r) + 1)));
    expect(numbers("w4d6t4")).toEqual({ corner: 8 * 8 - 7 * 7, sum: sum(range(1, 10).map((k) => 2 * k - 1)) });
  });

  it("лабиринт: 11 команд, путь единственный; короткие дороги: 6", () => {
    expect(allShortestPrograms(parseMap(answer("w4d6t5", "robot").puzzle.map))).toHaveLength(1);
    const p = answer("w4d6t6", "robot").puzzle;
    expect(allShortestPrograms(parseMap(p.map))).toHaveLength(p.pathsCount!);
  });

  it("план комнаты: 1 клетка = 50 см", () => {
    expect(numbers("w4d6t7")).toEqual({
      length: (8 * 50) / 100,
      width: (6 * 50) / 100,
      area: ((8 * 50) / 100) * ((6 * 50) / 100),
    });
  });

  it("четвёртая вершина наклонного квадрата и его площадь", () => {
    const g = visual("w4d6t8", "coordGrid");
    const [a, b, c] = g.items.map((i) => pos(g.cols, i.cell));
    const ab = [b[0] - a[0], b[1] - a[1]];
    const bc = [c[0] - b[0], c[1] - b[1]];
    expect(ab[0] * bc[0] + ab[1] * bc[1]).toBe(0);
    expect(ab[0] ** 2 + ab[1] ** 2).toBe(bc[0] ** 2 + bc[1] ** 2);
    const d = [a[0] + bc[0], a[1] + bc[1]];
    expect(times("w4d6t8").vertex).toBe(cellOf(g.cols, d[0], d[1]));
    expect(numbers("w4d6t8").area).toBe(ab[0] ** 2 + ab[1] ** 2);
  });
});

describe("День 7: мастер геометрии", () => {
  it("разминка", () => {
    expect(numbers("w4d7t1")).toEqual({ perimeter: 7 * 4, area: 6 * 4, cubes: 2 ** 3, axes: 4 });
  });

  it("точки и отрезки: на рисунке 4 точки соединены все со всеми", () => {
    const fig = visual("w4d7t3", "strokes").figures[0];
    const pairs = (n: number) => (n * (n - 1)) / 2;
    expect(fig.lines).toHaveLength(pairs(fig.points.length));
    expect(numbers("w4d7t3")).toEqual({ six: pairs(6), ten: pairs(10) });
  });

  it("куб 4 × 4 × 4: внутри куб 2 × 2 × 2", () => {
    expect(numbers("w4d7t5")).toEqual({ all: 64, outside: 64 - 2 ** 3, inside: 2 ** 3 });
  });

  it("рамка для фото", () => {
    expect(numbers("w4d7t6")).toEqual({ width: 10 + 4, height: 15 + 4, perimeter: 2 * (14 + 19) });
  });

  it("исследование: прямоугольники с периметром 24", () => {
    const sides = range(1, 11).filter((a) => a <= 12 - a);
    const areas = sides.map((a) => a * (12 - a));
    expect(numbers("w4d7t7")).toEqual({ count: sides.length, max: Math.max(...areas), min: Math.min(...areas) });
    const table = visual("w4d7t7", "table");
    expect(table.rows.map((r) => Number(r[0]))).toEqual(sides);
  });
});
