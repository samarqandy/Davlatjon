/** Доска тренера, рисунок: центры клеток, стрелки (у коня — «буквой Г») и наконечники. */
import { describe, expect, it } from "vitest";
import {
  arrowGeometry,
  isKnightJump,
  pathOf,
  polygonOf,
  squareCenter,
  squareRect,
  type Point,
} from "@/lib/mentor/geometry";

const FILES = "abcdefgh";
const ALL_SQ = [...FILES].flatMap((f) => [1, 2, 3, 4, 5, 6, 7, 8].map((r) => `${f}${r}`));
const dist = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const close = (a: Point, b: Point) => {
  expect(a[0]).toBeCloseTo(b[0], 9);
  expect(a[1]).toBeCloseTo(b[1], 9);
};

describe("клетки", () => {
  it("центры клеток за белых и за чёрных", () => {
    expect(squareCenter("a1", "white")).toEqual([0.5, 7.5]);
    expect(squareCenter("h8", "white")).toEqual([7.5, 0.5]);
    expect(squareCenter("e4", "white")).toEqual([4.5, 4.5]);
    expect(squareCenter("a1", "black")).toEqual([7.5, 0.5]);
    expect(squareCenter("h8", "black")).toEqual([0.5, 7.5]);
  });

  it("за чёрных доска повёрнута на 180°: каждая клетка — отражение через центр", () => {
    for (const sq of ALL_SQ) {
      const [x, y] = squareCenter(sq, "white");
      expect(squareCenter(sq, "black")).toEqual([8 - x, 8 - y]);
    }
  });

  it("все 64 центра разные и внутри доски", () => {
    for (const o of ["white", "black"] as const) {
      const seen = new Set(ALL_SQ.map((sq) => squareCenter(sq, o).join(",")));
      expect(seen.size).toBe(64);
      for (const sq of ALL_SQ) {
        const [x, y] = squareCenter(sq, o);
        expect(x > 0 && x < 8 && y > 0 && y < 8).toBe(true);
      }
    }
  });

  it("клетка в процентах для знаков", () => {
    expect(squareRect("a8", "white")).toEqual({ left: 0, top: 0, size: 12.5 });
    expect(squareRect("h1", "white")).toEqual({ left: 87.5, top: 87.5, size: 12.5 });
    expect(squareRect("a1", "black")).toEqual({ left: 87.5, top: 0, size: 12.5 });
    expect(squareRect("e4", "white")).toEqual({ left: 50, top: 50, size: 12.5 });
  });

  it("ход коня узнаётся во все 8 сторон и только он", () => {
    const jumps = ALL_SQ.filter((sq) => isKnightJump("d4", sq)).sort();
    expect(jumps).toEqual(["b3", "b5", "c2", "c6", "e2", "e6", "f3", "f5"]);
    expect(isKnightJump("g1", "f3")).toBe(true);
    expect(isKnightJump("f3", "g1")).toBe(true);
    expect(isKnightJump("a1", "a1")).toBe(false);
    expect(isKnightJump("a1", "c3")).toBe(false);
    expect(isKnightJump("a1", "h8")).toBe(false);
  });
});

describe("стрелки", () => {
  it("конь g1–f3: три точки, сначала длинная (вертикальная) сторона", () => {
    const { shaft, head } = arrowGeometry("g1", "f3", "white");
    expect(shaft).toHaveLength(3);
    close(shaft[0], [6.5, 7.5]);
    close(shaft[1], [6.5, 5.5]);
    close(shaft[2], [6.15, 5.5]);
    close(head[0], [5.65, 5.5]);
    // Первая сторона длиннее второй.
    expect(dist(shaft[0], shaft[1])).toBeCloseTo(2, 9);
    expect(dist(shaft[1], head[0]) + 0.15).toBeCloseTo(1, 9);
  });

  it("конь b1–d2: длинная сторона горизонтальная — она и первая", () => {
    const { shaft, head } = arrowGeometry("b1", "d2", "white");
    expect(shaft).toHaveLength(3);
    close(shaft[0], [1.5, 7.5]);
    close(shaft[1], [3.5, 7.5]);
    close(head[0], [3.5, 6.65]);
  });

  it("у любого хода коня первый отрезок — 2 клетки, второй — 1", () => {
    for (const from of ALL_SQ) {
      for (const to of ALL_SQ.filter((t) => isKnightJump(from, t))) {
        for (const o of ["white", "black"] as const) {
          const { shaft } = arrowGeometry(from, to, o);
          expect(shaft).toHaveLength(3);
          expect(dist(shaft[0], shaft[1])).toBeCloseTo(2, 9);
          const [a, b] = [shaft[0], shaft[1]];
          expect(a[0] === b[0] || a[1] === b[1]).toBe(true);
        }
      }
    }
  });

  it("e2–e4: прямая из двух точек", () => {
    const { shaft, head } = arrowGeometry("e2", "e4", "white");
    expect(shaft).toHaveLength(2);
    close(shaft[0], [4.5, 6.5]);
    close(shaft[1], [4.5, 5.15]);
    close(head[0], [4.5, 4.65]);
  });

  it("острие не доходит до центра клетки ровно на 0,15 — у всех стрелок и при любом повороте", () => {
    for (const from of ["a1", "e4", "g1", "h8", "b7"]) {
      for (const to of ALL_SQ) {
        if (to === from) continue;
        for (const o of ["white", "black"] as const) {
          const { head } = arrowGeometry(from, to, o);
          expect(dist(head[0], squareCenter(to, o))).toBeCloseTo(0.15, 9);
        }
      }
    }
  });

  it("наконечник симметричен: углы на равном расстоянии, основание — посередине, ширина и длина — заданные", () => {
    for (const [from, to, opts] of [
      ["e2", "e4", undefined],
      ["a1", "h8", undefined],
      ["g1", "f3", undefined],
      ["h8", "a7", { headLength: 0.3, headWidth: 0.4 }],
    ] as const) {
      const headLength = opts?.headLength ?? 0.5;
      const headWidth = opts?.headWidth ?? 0.55;
      const { shaft, head } = arrowGeometry(from, to, "white", opts);
      const [tip, l, r] = head;
      const base = shaft[shaft.length - 1];
      expect(dist(tip, l)).toBeCloseTo(dist(tip, r), 9);
      close([(l[0] + r[0]) / 2, (l[1] + r[1]) / 2], base);
      expect(dist(l, r)).toBeCloseTo(headWidth, 9);
      expect(dist(tip, base)).toBeCloseTo(headLength, 9);
      // Основание поперёк направления стрелки.
      const dot = (l[0] - r[0]) * (tip[0] - base[0]) + (l[1] - r[1]) * (tip[1] - base[1]);
      expect(dot).toBeCloseTo(0, 9);
    }
  });

  it("за чёрных стрелка — отражение стрелки за белых", () => {
    for (const [from, to] of [
      ["g1", "f3"],
      ["e2", "e4"],
      ["a1", "h8"],
      ["b8", "c6"],
    ]) {
      const w = arrowGeometry(from, to, "white");
      const b = arrowGeometry(from, to, "black");
      const flip = ([x, y]: Point): Point => [8 - x, 8 - y];
      expect(b.shaft).toHaveLength(w.shaft.length);
      w.shaft.forEach((p, i) => close(b.shaft[i], flip(p)));
      close(b.head[0], flip(w.head[0]));
    }
  });

  it("стрелка в ту же клетку не даёт NaN", () => {
    const { shaft, head } = arrowGeometry("e4", "e4", "white");
    for (const [x, y] of [...shaft, ...head]) expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
  });

  it("путь и многоугольник для SVG — с округлением до тысячных", () => {
    expect(
      pathOf([
        [6.5, 7.5],
        [6.5, 5.5],
        [6.15, 5.5],
      ]),
    ).toBe("M6.5 7.5 L6.5 5.5 L6.15 5.5");
    expect(
      pathOf([
        [1.23456, 2],
        [0, -0.0004],
      ]),
    ).toBe("M1.235 2 L0 0");
    expect(
      polygonOf([
        [1, 2],
        [3.33333, 4],
        [5, 6.0006],
      ]),
    ).toBe("1,2 3.333,4 5,6.001");
    const { shaft } = arrowGeometry("g1", "f3", "white");
    expect(pathOf(shaft)).toBe("M6.5 7.5 L6.5 5.5 L6.15 5.5");
  });
});
