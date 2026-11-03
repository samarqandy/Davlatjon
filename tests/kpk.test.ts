/** Решатель «король и пешка против короля» сверяется с известными правилами эндшпиля. */
import { describe, expect, it } from "vitest";
import { kpkWins } from "./helpers/kpk";

describe("решатель КП против К", () => {
  it("король на шестой горизонтали перед пешкой выигрывает при любой очереди хода", () => {
    expect(kpkWins("e6", "e8", "e5", "w")).toBe(true);
    expect(kpkWins("e6", "e8", "e5", "b")).toBe(true);
  });

  it("крайняя пешка — ничья, если король соперника в углу", () => {
    expect(kpkWins("a6", "a8", "a5", "w")).toBe(false);
  });

  it("оппозиция решает: кто ходит — тот уступает", () => {
    expect(kpkWins("e5", "e7", "e4", "w")).toBe(false);
    expect(kpkWins("e5", "e7", "e4", "b")).toBe(true);
  });
});

describe("курс «Слон»: ответы в пешечном эндшпиле проверены решателем", () => {
  it("оппозиция: Крe5 выигрывает, e5 — только ничья", () => {
    // Белые: Крd4, пешка e4; чёрные: Крe7.
    expect(kpkWins("e5", "e7", "e4", "b")).toBe(true);
    expect(kpkWins("d4", "e7", "e5", "b")).toBe(false);
  });

  it("квадрат: Крf5 входит в квадрат и спасает, Крg5 проигрывает", () => {
    // Белые: Крh1, пешка b4; ход чёрных, король g4.
    expect(kpkWins("h1", "f5", "b4", "w")).toBe(false);
    expect(kpkWins("h1", "g5", "b4", "w")).toBe(true);
  });

  it("цугцванг: в оппозиции проигрывает тот, кто ходит", () => {
    expect(kpkWins("e5", "e7", "e4", "w")).toBe(false);
    expect(kpkWins("e5", "e7", "e4", "b")).toBe(true);
  });
});
