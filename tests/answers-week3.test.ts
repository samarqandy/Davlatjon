/**
 * Неделя 3: каждый ответ из ключа для родителя проверяется независимым расчётом или перебором.
 */
import { describe, expect, it } from "vitest";
import type { Cell, VennRegion } from "@/content/types";
import { ALPHABET } from "@/content/week3/day6";
import { decode, encode, RU_ALPHABET } from "@/lib/cipher";
import { isLosing, robotMove, winningMove } from "@/lib/nim";
import { minWeighings } from "@/lib/scales";
import { inversions, swapAt } from "@/lib/swapSort";
import { oddPoints } from "@/lib/strokes";
import { waysToBalance } from "@/lib/weights";
import { answer, numbers, permutations, task, texts, times, visual } from "./helpers";

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
/** Все наборы из n логических значений. */
const bits = (n: number) => range(0, 2 ** n - 1).map((m) => Array.from({ length: n }, (_, i) => Boolean((m >> i) & 1)));
/** Минус в текстах — настоящий «−». */
const evalExpr = (s: string) =>
  s
    .replace(/−/g, "-")
    .split(/(?=[+-])/)
    .reduce((acc, part) => acc + Number(part.replace(/\s/g, "")), 0);
const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const hhmm = (min: number) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;

/** Кратчайшие ходы коня по доске cols × rows от клетки from. */
function knightDistances(cols: number, rows: number, from: Cell): Map<string, number> {
  const key = (c: Cell) => `${c[0]},${c[1]}`;
  const dist = new Map([[key(from), 0]]);
  const queue: Cell[] = [from];
  const jumps = [
    [1, 2],
    [2, 1],
    [-1, 2],
    [-2, 1],
    [1, -2],
    [2, -1],
    [-1, -2],
    [-2, -1],
  ];
  while (queue.length) {
    const [c, r] = queue.shift()!;
    for (const [dc, dr] of jumps) {
      const n: Cell = [c + dc, r + dr];
      if (n[0] < 0 || n[1] < 0 || n[0] >= cols || n[1] >= rows || dist.has(key(n))) continue;
      dist.set(key(n), dist.get(key([c, r]))! + 1);
      queue.push(n);
    }
  }
  return dist;
}

/** Периметр фигуры из клеточек: стороны, у которых нет соседа. */
function perimeter(cells: readonly Cell[]): number {
  const set = new Set(cells.map(([c, r]) => `${c},${r}`));
  let p = 0;
  for (const [c, r] of cells)
    for (const [dc, dr] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ])
      if (!set.has(`${c + dc},${r + dr}`)) p++;
  return p;
}

/** Можно ли обойти все линии фигуры одним росчерком (перебор с возвратом, без правила Эйлера). */
function drawable(lines: readonly (readonly [number, number])[], points: number): boolean {
  const used = lines.map(() => false);
  const walk = (at: number, left: number): boolean => {
    if (left === 0) return true;
    return lines.some(([a, b], i) => {
      if (used[i] || (a !== at && b !== at)) return false;
      used[i] = true;
      const ok = walk(a === at ? b : a, left - 1);
      used[i] = false;
      return ok;
    });
  };
  return range(0, points - 1).some((start) => walk(start, lines.length));
}

/** Лёгкую фальшивую монету среди s подозреваемых (и g точно настоящих) можно найти за k взвешиваний? */
function canFind(s: number, g: number, k: number): boolean {
  if (s <= 1) return true;
  if (k === 0) return false;
  for (let a = 0; a <= s; a++)
    for (let b = 0; a + b <= s; b++)
      for (let x = 0; x <= g; x++) {
        const y = a + x - b;
        if (y < 0 || x + y > g || a + x === 0) continue;
        const rest = s - a - b;
        const next = (n: number) => n === 0 || canFind(n, g + s - n, k - 1);
        if (next(a) && next(b) && next(rest)) return true;
      }
  return false;
}

describe("Неделя 3 · День 1", () => {
  it("знаешь одно — узнаешь другое", () => {
    const n = numbers("w3d1t1");
    expect([n.a, n.b, n.c, n.d]).toEqual([27 + 16, 26 + 15, 42 - 15, 42 - 27]);
  });

  it("правило наоборот: верны а), в), д)", () => {
    const rules: Record<string, (n: number) => boolean> = {
      a: (n) => n % 10 !== 5 || n % 2 === 1,
      b: (n) => n % 2 === 0 || n % 10 === 5,
      c: (n) => n <= 20 || n > 10,
      d: (n) => n <= 10 || n > 20,
      e: (n) => n % 2 === 1 || (n + 2) % 2 === 0,
    };
    const always = Object.keys(rules).filter((id) => range(0, 500).every(rules[id]));
    expect(always).toEqual(answer("w3d1t2", "choice").correct);
  });

  it("зонтик: да, неизвестно, нет, неизвестно", () => {
    const worlds = bits(2).filter(([rain, umbrella]) => !rain || umbrella);
    const ask = (known: (w: boolean[]) => boolean, question: (w: boolean[]) => boolean) => {
      const values = new Set(worlds.filter(known).map(question));
      return values.size === 2 ? "unknown" : values.has(true) ? "yes" : "no";
    };
    expect({
      a: ask(
        ([rain]) => rain,
        ([, umbrella]) => umbrella,
      ),
      b: ask(
        ([, umbrella]) => umbrella,
        ([rain]) => rain,
      ),
      c: ask(
        ([, umbrella]) => !umbrella,
        ([rain]) => rain,
      ),
      d: ask(
        ([rain]) => !rain,
        ([, umbrella]) => umbrella,
      ),
    }).toEqual(answer("w3d1t3", "assign").correct);
  });

  it("машина с условием: 22 получается из 11 и из 44", () => {
    const machine = (n: number) => (n % 2 === 0 ? n / 2 : n * 2);
    for (const row of visual("w3d1t4", "machine").rows)
      if (row.input !== null && row.output !== null) expect(machine(row.input)).toBe(row.output);
    const n = numbers("w3d1t4");
    expect([n.out9, n.out16]).toEqual([machine(9), machine(16)]);
    expect(range(1, 200).filter((x) => machine(x) === 22)).toEqual([n.in22small, n.in22big]);
  });

  it("дорога к единице: от 13 — 6 шагов, от 20 — 7", () => {
    const steps = (n: number) => {
      let s = 0;
      while (n !== 1) {
        n = n % 2 === 0 ? n / 2 : n + 1;
        s++;
      }
      return s;
    };
    expect(steps(6)).toBe(4);
    const n = numbers("w3d1t5");
    expect([n.from13, n.from20]).toEqual([steps(13), steps(20)]);
    expect(range(1, 50).filter((x) => steps(x) === 3)).toEqual([3, 8]);
  });

  it("часы в зеркале: на рисунке — отражение настоящего времени", () => {
    const t = times("w3d1t6");
    const clocks = [visual("w3d1t6", "clock", 0), visual("w3d1t6", "clock", 1)];
    clocks.forEach((c) => expect(c.mirror).toBe(true));
    expect([t.a, t.b]).toEqual(clocks.map((c) => c.time));
    // В зеркале видно «12:00 минус настоящее время»: 9:00 и 1:30.
    expect(clocks.map((c) => hhmm((12 * 60 - minutes(c.time)) % (12 * 60)))).toEqual(["9:00", "1:30"]);
  });

  it("бесплатная доставка: с соком дешевле", () => {
    const cost = (order: number) => (order >= 100 ? order : order + 15);
    const n = numbers("w3d1t7");
    expect([n.a, n.b]).toEqual([cost(90), cost(90 + 12)]);
    expect(n.b).toBeLessThan(n.a);
  });

  it("кино: пошёл только Дима", () => {
    const names = ["ali", "bobur", "vika", "dima"];
    const worlds = bits(4).filter(([a, b, v, d]) => (!a || b) && (!b || v) && (v || d) && !v);
    expect(worlds).toHaveLength(1);
    const went = names.filter((_, i) => worlds[0][i]);
    expect(went).toEqual(answer("w3d1t8", "choice").correct);
  });
});

describe("Неделя 3 · День 2", () => {
  it("и, или, не", () => {
    const pool = true;
    const iceCream = true;
    const cinema = false;
    const football = false;
    const truth = {
      a: pool && iceCream,
      b: cinema || pool,
      c: cinema && pool,
      d: !cinema,
      e: football || cinema,
    };
    expect(Object.fromEntries(Object.entries(truth).map(([k, v]) => [k, v ? "true" : "false"]))).toEqual(
      answer("w3d2t1", "assign").correct,
    );
  });

  it("одна цифра сбилась: три способа", () => {
    const digits = [4, 7, 2, 8, 6, 5];
    const fixes: string[] = [];
    digits.forEach((d, i) => {
      for (let x = 0; x <= 9; x++) {
        if (x === d || (x === 0 && i % 2 === 0)) continue;
        const v = [...digits];
        v[i] = x;
        if (v[0] * 10 + v[1] + v[2] * 10 + v[3] === v[4] * 10 + v[5]) fixes.push(v.join(""));
      }
    });
    expect(fixes.sort()).toEqual(["372865", "471865", "472875"]);
    expect(numbers("w3d2t2").ways).toBe(fixes.length);
  });

  it("варенье съела Вика: только при ней правду сказал один", () => {
    const culprits = ["ali", "bobur", "vika"].filter((c) => {
      const said = [c === "bobur", c !== "bobur", c !== "vika"];
      return said.filter(Boolean).length === 1;
    });
    expect(culprits).toEqual(answer("w3d2t3", "choice").correct);
  });

  it("рыцари в ряд чередуются", () => {
    const rows = bits(7).filter((k) => k[0] && range(0, 5).every((i) => k[i] === !k[i + 1]));
    expect(rows).toHaveLength(1);
    const kind = (i: number) => (rows[0][i] ? "knight" : "liar");
    expect({ second: kind(1), fifth: kind(4), seventh: kind(6) }).toEqual(answer("w3d2t4", "assign").correct);
    expect(rows[0].filter(Boolean)).toHaveLength(4);
  });

  it("лампочка: 8 положений, горит при 3", () => {
    const all = bits(3);
    const n = numbers("w3d2t5");
    expect(n.all).toBe(all.length);
    expect(n.on).toBe(all.filter(([a, b, c]) => a && (b || c)).length);
  });

  it("скамейка: единственная рассадка, и каждое условие нужно", () => {
    const conditions = [
      (p: string[]) => p.indexOf("ali") === 0 || p.indexOf("ali") === 2,
      (p: string[]) => Math.abs(p.indexOf("ali") - p.indexOf("bobur")) === 1,
      (p: string[]) => p.indexOf("vika") < p.indexOf("bobur"),
    ];
    const seatings = (conds: typeof conditions) =>
      permutations(["ali", "bobur", "vika"]).filter((p) => conds.every((c) => c(p)));
    expect(seatings(conditions)).toEqual([answer("w3d2t6", "order").correct]);
    conditions.forEach((_, i) => expect(seatings(conditions.filter((__, j) => j !== i))).toHaveLength(2));
  });

  it("расписание автобуса", () => {
    const buses = range(0, 12).map((i) => 7 * 60 + 15 * i);
    const has = (t: string) => buses.includes(minutes(t));
    const truth = {
      a: has("8:00"),
      b: has("8:40"),
      c: buses[buses.indexOf(minutes("7:30")) + 1] === minutes("7:45"),
      d: buses.filter((t) => t >= minutes("7:00") && t <= minutes("7:59")).length === 4,
      e: has("9:10"),
    };
    expect(Object.fromEntries(Object.entries(truth).map(([k, v]) => [k, v ? "true" : "false"]))).toEqual(
      answer("w3d2t7", "assign").correct,
    );
  });

  it("три жителя острова: решение единственное", () => {
    const worlds = bits(3).filter(([a, b, c]) => a === !b && b === !c && c === (!a && !b));
    expect(worlds).toHaveLength(1);
    const kind = (k: boolean) => (k ? "knight" : "liar");
    const [a, b, c] = worlds[0];
    expect({ a: kind(a), b: kind(b), c: kind(c) }).toEqual(answer("w3d2t8", "assign").correct);
  });
});

describe("Неделя 3 · День 3", () => {
  it("кто что любит: 5, 5, 2, 9", () => {
    const r = visual("w3d3t1", "venn").regions;
    const count = (...regions: VennRegion[]) => sum(regions.map((x) => r[x]?.length ?? 0));
    const n = numbers("w3d3t1");
    expect([n.football, n.swim, n.both, n.all]).toEqual([
      count("a", "ab"),
      count("b", "ab"),
      count("ab"),
      count("a", "b", "ab", "none"),
    ]);
  });

  it("все, некоторые, ни один", () => {
    const xs = visual("w3d3t2", "sequence").items as number[];
    const truth: Record<string, boolean> = {
      a: xs.every((x) => x % 2 === 0),
      b: xs.some((x) => x > 20),
      c: !xs.some((x) => x % 10 === 5),
      d: xs.every((x) => x > 10),
      e: xs.some((x) => x % 2 === 1),
    };
    expect(Object.keys(truth).filter((k) => truth[k])).toEqual(answer("w3d3t2", "choice").correct);
  });

  it("разложи по кругам", () => {
    const a = answer("w3d3t3", "venn");
    const region = (n: number): VennRegion => {
      const even = n % 2 === 0;
      const big = n > 10;
      return even && big ? "ab" : even ? "a" : big ? "b" : "none";
    };
    for (const item of a.items) expect(a.correct[item.id], item.label).toBe(region(Number(item.label)));
    for (const g of a.given ?? []) expect(g.region).toBe(region(Number(g.label)));
  });

  it("угадай правило круга: правила подходят только одни", () => {
    const r = visual("w3d3t4", "venn").regions;
    const nums = (regions: VennRegion[]) => regions.flatMap((x) => (r[x] ?? []).map(Number));
    const everything = nums(["a", "ab", "b", "none"]);
    const rules: Record<string, (n: number) => boolean> = {
      even: (n) => n % 2 === 0,
      end5: (n) => n % 10 === 5,
      less20: (n) => n < 20,
      more20: (n) => n > 20,
    };
    const fits = (inside: number[]) =>
      Object.keys(rules).filter((id) => everything.every((n) => rules[id](n) === inside.includes(n)));
    expect(fits(nums(["a", "ab"]))).toEqual([answer("w3d3t4", "assign").correct.c1]);
    expect(fits(nums(["b", "ab"]))).toEqual([answer("w3d3t4", "assign").correct.c2]);
  });

  it("сито: 15, 10, 8 — и порядок шагов не важен", () => {
    const steps = [(n: number) => n % 2 === 0, (n: number) => n > 20, (n: number) => n % 10 === 5];
    let left = range(1, 30);
    const counts = steps.map((drop) => (left = left.filter((n) => !drop(n))).length);
    const n = numbers("w3d3t5");
    expect(counts).toEqual([n.step1, n.step2, n.step3]);
    for (const order of permutations([0, 1, 2])) {
      const rest = order.reduce((xs, i) => xs.filter((x) => !steps[i](x)), range(1, 30));
      expect(rest).toEqual([1, 3, 7, 9, 11, 13, 17, 19]);
    }
  });

  it("два прямоугольника: 4, 20, 15", () => {
    const g = visual("w3d3t6", "cellGrid");
    const cells = g.rects.map((rc) => {
      const s = new Set<string>();
      for (let c = rc.col; c < rc.col + rc.w; c++) for (let r = rc.row; r < rc.row + rc.h; r++) s.add(`${c},${r}`);
      return s;
    });
    const both = [...cells[0]].filter((k) => cells[1].has(k)).length;
    const any = new Set([...cells[0], ...cells[1]]).size;
    const n = numbers("w3d3t6");
    expect([n.both, n.any, n.none]).toEqual([both, any, g.cols * g.rows - any]);
  });

  it("кружки: единственное решение", () => {
    const fits = range(0, 25).filter((both) => {
      const onlyArt = 15 - both;
      const onlyMusic = 12 - both;
      return onlyArt >= 0 && onlyMusic >= 0 && onlyArt + onlyMusic + both + 4 === 25;
    });
    const n = numbers("w3d3t7");
    expect(fits).toEqual([n.both]);
    expect(n.onlyArt).toBe(15 - n.both);
  });

  it("яблоки и груши: от 6 до 12", () => {
    const possible = range(0, 20).filter((both) => {
      const onlyA = 12 - both;
      const onlyP = 14 - both;
      const none = 20 - onlyA - onlyP - both;
      return onlyA >= 0 && onlyP >= 0 && none >= 0;
    });
    const n = numbers("w3d3t8");
    expect([Math.min(...possible), Math.max(...possible)]).toEqual([n.min, n.max]);
  });
});

describe("Неделя 3 · День 4", () => {
  it("сравни, не вычисляя", () => {
    const a = answer("w3d4t1", "assign");
    const sign = (l: number, r: number) => (l > r ? "gt" : l < r ? "lt" : "eq");
    for (const item of a.items) {
      const [left, right] = item.label.slice(3).split("☐");
      expect(a.correct[item.id], item.label).toBe(sign(evalExpr(left), evalExpr(right)));
    }
  });

  it("гири в равновесии", () => {
    const n = numbers("w3d4t2");
    expect(7 + 5).toBe(9 + n.a);
    expect(15 + n.b).toBe(8 + 8 + 8);
    expect(n.c + n.c).toBe(12 + 6);
  });

  it("что покажут весы: перебор всех весов", () => {
    const outcomes: Record<string, Set<string>> = { a: new Set(), b: new Set(), c: new Set(), d: new Set() };
    const cmp = (l: number, r: number) => (l > r ? "left" : l < r ? "right" : "equal");
    for (let rabbit = 1; rabbit <= 20; rabbit++) {
      const cat = 2 * rabbit;
      for (let dog = 1; dog <= 150; dog++) {
        if (!(dog > cat + rabbit)) continue;
        outcomes.a.add(cmp(dog, 3 * rabbit));
        outcomes.b.add(cmp(dog, 4 * rabbit));
        outcomes.c.add(cmp(2 * cat, 4 * rabbit));
        outcomes.d.add(cmp(2 * rabbit, dog));
      }
    }
    const verdict = Object.fromEntries(
      Object.entries(outcomes).map(([k, v]) => [k, v.size === 1 ? [...v][0] : "unknown"]),
    );
    expect(verdict).toEqual(answer("w3d4t3", "assign").correct);
  });

  it("вдвое тяжелее: сумма гирь на 1 меньше следующей", () => {
    const weights = range(0, 6).map((i) => 2 ** i);
    expect(visual("w3d4t4", "sequence").items.slice(0, 4)).toEqual(weights.slice(0, 4));
    const n = numbers("w3d4t4");
    expect([n.sixth, n.sum5, n.sum6]).toEqual([weights[5], sum(weights.slice(0, 5)), sum(weights.slice(0, 6))]);
    range(1, 6).forEach((k) => expect(sum(weights.slice(0, k))).toBe(weights[k] - 1));
  });

  it("фальшивые монеты: взвешиваний хватает и меньше нельзя", () => {
    for (const id of ["w3d4t5", "w3d4t8"]) {
      const a = answer(id, "scales");
      expect(canFind(a.coins, 0, a.weighings), id).toBe(true);
      expect(canFind(a.coins, 0, a.weighings - 1), id).toBe(false);
      expect(minWeighings(a.coins)).toBe(a.weighings);
    }
    expect(canFind(27, 0, 3)).toBe(true);
    expect(canFind(10, 0, 2)).toBe(false);
  });

  it("одинаковые по площади: периметры 10, 14, 14, 12", () => {
    const figures = task("w3d4t6").body.flatMap((b) =>
      b.type === "question" && b.visual?.type === "polyomino" ? [b.visual.cells] : [],
    );
    figures.forEach((f) => expect(f).toHaveLength(6));
    const n = numbers("w3d4t6");
    expect(figures.map(perimeter)).toEqual([n.a, n.b, n.c, n.d]);
  });

  it("что больше и на сколько", () => {
    const n = numbers("w3d4t7");
    expect(n.time).toBe(90 - (60 + 10));
    expect(n.length).toBe(2 * 100 - 150);
    expect(n.price).toBe(2 * 7 - 3 * 4);
  });
});

describe("Неделя 3 · День 5", () => {
  it("три числа подряд: сумма — это среднее три раза; 40 не бывает", () => {
    const n = numbers("w3d5t1");
    expect([n.a, n.b, n.c]).toEqual([4 + 5 + 6, 9 + 10 + 11, 19 + 20 + 21]);
    const triples = range(0, 50).map((x) => x + (x + 1) + (x + 2));
    expect(triples.includes(40)).toBe(false);
    expect(triples.indexOf(99)).toBe(32);
  });

  it("контрпримеры: где сумма не больше слагаемого", () => {
    const a = answer("w3d5t2", "choice");
    const counter = a.options
      .filter((o) => {
        const [x, y, s] = o.label.split(/[+=]/).map((p) => Number(p.trim()));
        expect(x + y).toBe(s);
        return !(s > x && s > y);
      })
      .map((o) => o.id);
    expect(counter).toEqual(a.correct);
  });

  it("сумма цифр двузначного числа не больше 18", () => {
    const digitSum = (n: number) => sum(String(n).split("").map(Number));
    const sums = range(10, 99).map(digitSum);
    expect(Math.max(...sums)).toBe(18);
    expect(sums.includes(19)).toBe(false);
    expect(digitSum(19)).toBe(10);
    expect(Math.max(...range(100, 999).map(digitSum))).toBe(27);
  });

  it("последняя цифра удвоений: 10-е — 4, 20-е — 6", () => {
    const seq = visual("w3d5t4", "sequence").items.filter((x): x is number => typeof x === "number");
    expect(seq).toEqual(range(1, seq.length).map((k) => 2 ** k));
    const last = (k: number) => {
      let d = 1;
      for (let i = 0; i < k; i++) d = (d * 2) % 10;
      return d;
    };
    const n = numbers("w3d5t4");
    expect([n.tenth, n.twentieth]).toEqual([last(10), last(20)]);
    expect(2 ** 10).toBe(1024);
    expect(last(100)).toBe(6);
    expect(range(1, 200).some((k) => last(k) === 0)).toBe(false);
  });

  it("обмен соседей: 5 обменов — это меньше всего (поиск в ширину)", () => {
    const a = answer("w3d5t5", "swapSort");
    const target = [...a.cards].sort((x, y) => x - y).join(",");
    const dist = new Map([[a.cards.join(","), 0]]);
    const queue = [a.cards];
    while (queue.length) {
      const cur = queue.shift()!;
      for (let i = 0; i + 1 < cur.length; i++) {
        const next = swapAt(cur, i);
        if (!dist.has(next.join(","))) {
          dist.set(next.join(","), dist.get(cur.join(","))! + 1);
          queue.push(next);
        }
      }
    }
    expect(dist.get(target)).toBe(a.optimal);
    expect(inversions(a.cards)).toBe(a.optimal);
    // Путь из ответа.
    let cards = a.cards;
    for (const i of [0, 1, 3, 2, 1]) cards = swapAt(cards, i);
    expect(cards.join(",")).toBe(target);
  });

  it("одним росчерком: А и В (перебор линий и правило Эйлера)", () => {
    const figures = visual("w3d5t6", "strokes").figures;
    const ids = ["a", "b", "c", "d"];
    const ok = figures.map((f) => drawable(f.lines, f.points.length));
    expect(ids.filter((_, i) => ok[i])).toEqual(answer("w3d5t6", "choice").correct);
    expect(figures.map((f) => oddPoints(f))).toEqual([2, 4, 2, 4]);
    // Все линии фигур — разные, без повторов.
    for (const f of figures) {
      const keys = f.lines.map(([a, b]) => [a, b].sort().join("-"));
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it("наверняка: 3 носка и 13 учеников", () => {
    const surePair = (colors: number) =>
      range(1, 10).find((n) =>
        range(0, colors ** n - 1).every((code) => {
          const picked = Array.from({ length: n }, (_, i) => Math.floor(code / colors ** i) % colors);
          return new Set(picked).size < picked.length;
        }),
      );
    const n = numbers("w3d5t7");
    expect(n.socks).toBe(surePair(2));
    expect(surePair(3)).toBe(4);
    // 12 учеников могут родиться в 12 разных месяцах, 13-му места не хватит.
    expect(n.months).toBe(12 + 1);
  });

  it("монеты 1, 3, 5: 25 набирается только нечётным числом монет", () => {
    const can = (count: number) =>
      range(0, count).some((fives) =>
        range(0, count - fives).some((threes) => {
          const ones = count - fives - threes;
          return ones + 3 * threes + 5 * fives === 25;
        }),
      );
    const expected = Object.fromEntries([9, 10, 11, 12].map((c) => [`n${c}`, can(c) ? "yes" : "no"]));
    expect(expected).toEqual(answer("w3d5t8", "assign").correct);
    expect(5 * 1 + 4 * 5).toBe(25);
    expect(7 * 1 + 3 + 3 * 5).toBe(25);
    expect(range(1, 25).some((c) => c % 2 === 1 && can(c))).toBe(true);
    expect(range(1, 25).some((c) => c % 2 === 0 && can(c))).toBe(false);
  });
});

describe("Неделя 3 · День 6", () => {
  const num = (ch: string) => ALPHABET.indexOf(ch) + 1;

  it("алфавит в задачах — тот же, что в шифровальной машине", () => {
    expect(ALPHABET).toBe(RU_ALPHABET);
    expect([...ALPHABET]).toHaveLength(33);
    const pairs = visual("w3d6t1", "codeTable").pairs;
    expect(pairs.map(([ch, code]) => num(ch) === Number(code)).every(Boolean)).toBe(true);
  });

  it("буквы-числа", () => {
    const codes = task("w3d6t1")
      .body.flatMap((b) => (b.type === "question" && b.text ? [b.text.replace(/`/g, "")] : []))
      .map((s) =>
        s
          .split(", ")
          .map((x) => ALPHABET[Number(x) - 1])
          .join(""),
      );
    const t = texts("w3d6t1");
    expect(codes).toEqual([t.a, t.b, t.c]);
  });

  it("вес слова", () => {
    const weight = (w: string) => sum([...w].map(num));
    expect(weight("КОТ")).toBe(48);
    const n = numbers("w3d6t2");
    expect([n.dom, n.les, n.mama]).toEqual([weight("ДОМ"), weight("ЛЕС"), weight("МАМА")]);
  });

  it("позывные: одно решение, а без подсказки 5 — два", () => {
    const people = ["ali", "bobur", "vika", "dima"];
    const birds = ["falcon", "eagle"];
    const clues = [
      (p: string[]) => !["falcon", "eagle"].includes(p[0]),
      (p: string[]) => !["wolf", "tiger"].includes(p[2]),
      (p: string[]) => birds.includes(p[1]),
      (p: string[]) => !["falcon", "tiger"].includes(p[3]),
      (p: string[]) => p[2] !== "falcon",
    ];
    const solve = (cs: typeof clues) =>
      permutations(["falcon", "tiger", "wolf", "eagle"]).filter((p) => cs.every((c) => c(p)));
    const sols = solve(clues);
    expect(sols).toHaveLength(1);
    expect(Object.fromEntries(people.map((p, i) => [p, sols[0][i]]))).toEqual(answer("w3d6t3", "assign").correct);
    expect(solve(clues.slice(0, 4))).toHaveLength(2);
  });

  it("буква за буквой — это сдвиг на 1", () => {
    expect(encode("КОШКА", 1)).toBe("ЛПЩЛБ");
    expect(encode("ДОМ", 1)).toBe("ЕПН");
    const t = texts("w3d6t4");
    expect(t.encode).toBe(encode("СОК", 1));
    expect(t.decode).toBe(decode("НБНБ", 1));
  });

  it("шифр Цезаря", () => {
    const a = answer("w3d6t5", "cipher");
    expect(a.alphabet).toBe(RU_ALPHABET);
    expect(encode(a.answer, a.shift)).toBe(a.encoded);
    expect(decode(a.encoded, a.shift)).toBe(a.answer);
    expect(encode("ЛОГИКА", 3)).toBe("ОСЁЛНГ");
    expect(encode("Я", 3)).toBe("В");
  });

  it("буквы на карте", () => {
    const items = visual("w3d6t6", "coordGrid").items;
    const at = (cell: string) => items.find((i) => i.cell === cell)!.emoji;
    const where = (letter: string) => items.find((i) => i.emoji === letter)!.cell;
    expect(new Set(items.map((i) => i.emoji)).size).toBe(items.length);
    expect(["Б4", "Г2", "А1", "Д5", "В3", "А5"].map(at).join("")).toBe(texts("w3d6t6").word);
    const t = times("w3d6t6");
    expect([t.t, t.o, t.k]).toEqual(["Т", "О", "К"].map(where));
  });

  it("часы-перевёртыши", () => {
    const label = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}${String(m % 60).padStart(2, "0")}`;
    const isPal = (m: number) => label(m) === [...label(m)].reverse().join("");
    const all = range(0, 24 * 60 - 1).filter(isPal);
    const next = all.find((m) => m > minutes("12:21"))!;
    expect(hhmm(next)).toBe(times("w3d6t7").next);
    expect(all.filter((m) => m >= minutes("10:00") && m <= minutes("15:59")).length).toBe(numbers("w3d6t7").count);
    expect(all.find((m) => m > minutes("15:51"))).toBe(minutes("20:02"));
    expect(all.filter((m) => m >= minutes("20:00")).map(hhmm)).toEqual(["20:02", "21:12", "22:22", "23:32"]);
  });

  it("кодовый замок: код единственный, и каждая подсказка нужна", () => {
    const codes = range(102, 987)
      .map(String)
      .filter((s) => new Set(s).size === 3);
    const feedback = (guess: string, code: string) => {
      let right = 0;
      let moved = 0;
      [...guess].forEach((d, i) => {
        if (code[i] === d) right++;
        else if (code.includes(d)) moved++;
      });
      return `${right}${moved}`;
    };
    const clues: [string, string][] = [
      ["592", "00"],
      ["142", "10"],
      ["792", "01"],
      ["498", "02"],
    ];
    const solve = (cs: [string, string][]) => codes.filter((c) => cs.every(([g, f]) => feedback(g, c) === f));
    expect(solve(clues)).toEqual([String(numbers("w3d6t8").code)]);
    clues.forEach((_, i) => expect(solve(clues.filter((__, j) => j !== i)).length).toBeGreaterThan(1));
  });
});

describe("Неделя 3 · День 7", () => {
  it("разминка мастера", () => {
    const n = numbers("w3d7t1");
    expect(n.a + 15).toBe(60 - 20);
    range(0, 50).forEach((x) => expect(x + 7 + (50 - x - 7)).toBe(n.b));
    range(0, 30).forEach((sana) => {
      const lola = sana + 5;
      expect(sana + 5 - (lola - 5)).toBe(n.c);
    });
  });

  it("разговор у костра: 4 → 2 рыцаря, 6 → 3, а пятеро так сидеть не могут", () => {
    const circles = (n: number) => bits(n).filter((k) => k.every((ki, i) => ki === !k[(i + 1) % n]));
    const knights = (n: number) => [...new Set(circles(n).map((k) => k.filter(Boolean).length))];
    const a = numbers("w3d7t2");
    expect(knights(4)).toEqual([a.four]);
    expect(knights(6)).toEqual([a.six]);
    expect(circles(5)).toHaveLength(0);
  });

  it("сколько положений: удвоение", () => {
    expect(visual("w3d7t3", "sequence").items.slice(0, 3)).toEqual([2, 4, 8]);
    const n = numbers("w3d7t3");
    expect([n.four, n.five]).toEqual([bits(4).length, bits(5).length]);
  });

  it("последний камешек: первым ходом взять 1, ловушки — 3, 6, 9", () => {
    const a = answer("w3d7t4", "nim");
    expect(range(0, 30).filter((n) => isLosing(n, a.take))).toEqual(range(0, 10).map((k) => 3 * k));
    expect(isLosing(a.stones, a.take)).toBe(false);
    expect(winningMove(a.stones, a.take)).toBe(1);
    expect(winningMove(11, a.take)).toBe(2);
    // Секрет из ответа всегда обыгрывает робота.
    let pile = a.stones;
    let lastChild = false;
    while (pile > 0) {
      const mine = pile % 3 === 0 ? 1 : pile % 3;
      pile -= mine;
      lastChild = true;
      if (pile === 0) break;
      pile -= robotMove(pile, a.take);
      lastChild = false;
    }
    expect(lastChild).toBe(true);
  });

  it("конь на доске 3 × 3: 4 хода, 8 клеток; на 4 × 4 — 2 хода", () => {
    const board = visual("w3d7t5", "chessboard");
    const knight = board.pieces.find((p) => p.emoji === "♞")!.cell;
    const star = board.pieces.find((p) => p.emoji === "⭐")!.cell;
    const dist = knightDistances(board.cols, board.rows, knight);
    const n = numbers("w3d7t5");
    expect(dist.get(`${star[0]},${star[1]}`)).toBe(n.moves);
    expect(dist.size).toBe(n.cells);
    expect(dist.has("1,1")).toBe(false);
    expect(knightDistances(4, 4, [0, 3]).get("3,0")).toBe(2);
  });

  it("записка в магазин", () => {
    const n = numbers("w3d7t6");
    expect(n.noBananas).toBe(3 * 12 + 5);
    expect(n.bananas).toBe(2 * 16 + 5);
  });

  it("гири и весы", () => {
    const [s1, s2, s3] = answer("w3d7t7", "weightsLab").sets;
    range(1, s1.max).forEach((load) => expect(waysToBalance(load, s1.weights, s1.bothPans), `${load}`).toBe(1));
    expect(waysToBalance(s1.max + 1, s1.weights, s1.bothPans)).toBe(0);
    range(1, s2.max).forEach((load) =>
      expect(waysToBalance(load, s2.weights, s2.bothPans), `${load}`).toBeGreaterThan(0),
    );
    expect(range(1, s3.max).filter((load) => waysToBalance(load, s3.weights, s3.bothPans) === 0)).toEqual([4, 9, 14]);
    // Если добавить гирю 27 кг, получатся все грузы до 40.
    range(1, 40).forEach((load) => expect(waysToBalance(load, [1, 3, 9, 27], true)).toBeGreaterThan(0));
    expect(waysToBalance(41, [1, 3, 9, 27], true)).toBe(0);
    // Примеры из ответа.
    expect([8 + 2 + 1, 8 + 4 + 1, 8 + 4 + 2 + 1]).toEqual([11, 13, 15]);
    expect([2 + 1 === 3, 5 + 3 + 1 === 9, 7 + 3 === 9 + 1]).toEqual([true, true, true]);
  });
});
