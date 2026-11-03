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

describe("курс «Слон», пакет E3: КП против К, крайняя пешка, отталкивание плечом", () => {
  it("проведение: Крe6 выигрывает, e6 и Крd5 — ничья", () => {
    // Белые: Крd6, пешка e5; чёрные: Крe8; ход белых.
    expect(kpkWins("e6", "e8", "e5", "b")).toBe(true);
    expect(kpkWins("d6", "e8", "e6", "b")).toBe(false);
    expect(kpkWins("d6", "d8", "e6", "w")).toBe(false);
    expect(kpkWins("d5", "e8", "e5", "b")).toBe(false);
  });

  it("защита: Крe7 держит ничью, Крd8 и Крf8 проигрывают", () => {
    // Белые: Крe5, пешка e6; чёрные: Крe8; ход чёрных.
    expect(kpkWins("e5", "e7", "e6", "w")).toBe(false);
    expect(kpkWins("e5", "d8", "e6", "w")).toBe(true);
    expect(kpkWins("d6", "d8", "e6", "b")).toBe(true);
    expect(kpkWins("e5", "f8", "e6", "w")).toBe(true);
    expect(kpkWins("f6", "f8", "e6", "b")).toBe(true);
  });

  it("крайняя пешка: Крb8 спасает, после Крd7 белые выигрывают ходом Крb7", () => {
    expect(kpkWins("b6", "b8", "a5", "w")).toBe(false);
    expect(kpkWins("b6", "d7", "a5", "w")).toBe(true);
    expect(kpkWins("b7", "d7", "a5", "b")).toBe(true);
    expect(kpkWins("a6", "a8", "a5", "w")).toBe(false);
    expect(kpkWins("e6", "e8", "e5", "w")).toBe(true);
  });

  it("отталкивание плечом: только Крe5; после c6 и Крe4 спасает Крe6", () => {
    // Белые: Крf4, пешка c5; чёрные: Крf7; ход белых.
    expect(kpkWins("e5", "f7", "c5", "b")).toBe(true);
    expect(kpkWins("f4", "f7", "c6", "b")).toBe(false);
    expect(kpkWins("f4", "e6", "c6", "w")).toBe(false);
    expect(kpkWins("e4", "f7", "c5", "b")).toBe(false);
    expect(kpkWins("e4", "e6", "c5", "w")).toBe(false);
  });

  it("итоговый тест: Крd6 выигрывает, e6 и Крd5 — ничья", () => {
    // Белые: Крc5, пешка e5; чёрные: Крe8; ход белых.
    expect(kpkWins("d6", "e8", "e5", "b")).toBe(true);
    expect(kpkWins("c5", "e8", "e6", "b")).toBe(false);
    expect(kpkWins("d5", "e8", "e5", "b")).toBe(false);
  });
});
