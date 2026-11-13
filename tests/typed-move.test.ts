/** Ход, записанный текстом: русская, международная запись и фигурки; значки не обязательны; неясный ход не делается. */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { matchTypedMove } from "@/lib/typedMove";

const START = new Chess().fen();
const uci = (fen: string, text: string) => {
  const r = matchTypedMove(fen, text);
  return r.kind === "move" ? r.uci : r.kind;
};
const after = (...sans: string[]) => {
  const c = new Chess();
  for (const s of sans) c.move(s);
  return c.fen();
};

describe("ход, записанный текстом", () => {
  it("пешка и фигура: русские буквы, международные, фигурки, клетки", () => {
    for (const text of ["e4", "e2e4", "e2-e4", " e4 ", "E4", "е4"]) expect(uci(START, text), text).toBe("e2e4");
    for (const text of ["Кf3", "Nf3", "♘f3", "кf3", "nf3", "g1f3", "К f3", "Кf3!"]) {
      expect(uci(START, text), text).toBe("g1f3");
    }
  });

  it("взятие, шах и мат можно писать со значками и без них", () => {
    const fen = after("e4", "d5");
    for (const text of ["exd5", "ed5", "ed", "e:d5", "e4d5", "eхd5"]) expect(uci(fen, text), text).toBe("e4d5");
    // Детский мат: Фxf7#.
    const mate = after("e4", "e5", "Bc4", "Nc6", "Qh5", "Nf6");
    for (const text of ["Фxf7#", "Фf7", "Qxf7", "♕f7", "фf7", "h5f7"]) expect(uci(mate, text), text).toBe("h5f7");
  });

  it("рокировка: нули, буквы «О», с чёрточками и без", () => {
    const fen = "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1";
    for (const text of ["0-0", "O-O", "00", "о-о", "0 - 0"]) expect(uci(fen, text), text).toBe("e1g1");
    for (const text of ["0-0-0", "O-O-O", "000"]) expect(uci(fen, text), text).toBe("e1c1");
    expect(uci(START, "0-0")).toBe("none");
  });

  it("слон и пешка «b»: большая буква — слон, маленькая — пешка; если пешка так не ходит — слон", () => {
    // И слон f1 может пойти на c4, и пешка b3 может взять на c4.
    const both = "4k3/8/8/8/2p5/1P6/8/4KB2 w - - 0 1";
    expect(uci(both, "Bc4")).toBe("f1c4");
    expect(uci(both, "Сc4")).toBe("f1c4");
    expect(uci(both, "bc4")).toBe("b3c4");
    expect(uci(both, "bxc4")).toBe("b3c4");
    // Пешки «b» нет — «bc4» может быть только слоном.
    expect(uci("4k3/8/8/8/2p5/8/8/4KB2 w - - 0 1", "bc4")).toBe("f1c4");
  });

  it("два коня на одно поле: без уточнения — «неясно», с уточнением — ход", () => {
    const fen = "4k3/8/8/8/8/8/8/1N2KN2 w - - 0 1";
    const r = matchTypedMove(fen, "Кd2");
    expect(r.kind).toBe("ambiguous");
    if (r.kind === "ambiguous") expect(r.sans.sort()).toEqual(["Nbd2", "Nfd2"]);
    expect(uci(fen, "Кbd2")).toBe("b1d2");
    expect(uci(fen, "Nfd2")).toBe("f1d2");
    expect(uci(fen, "b1d2")).toBe("b1d2");
  });

  it("превращение: без буквы — в ферзя, с буквой — в названную фигуру", () => {
    const fen = "8/4P1k1/8/8/8/8/8/4K3 w - - 0 1";
    for (const text of ["e8", "e8Ф", "e8=Q", "e8♕", "e7e8"]) expect(uci(fen, text), text).toBe("e7e8q");
    expect(uci(fen, "e8К")).toBe("e7e8n");
    expect(uci(fen, "e8=R")).toBe("e7e8r");
    expect(uci(fen, "e8л")).toBe("e7e8r");
  });

  it("невозможный ход и пустая строка — «нет такого хода»", () => {
    for (const text of ["", "   ", "e5", "Кe5", "Фh5", "привет", "z9"]) expect(uci(START, text), text).toBe("none");
  });

  it("за чёрных и с короткой записью короля", () => {
    const fen = after("e4");
    expect(uci(fen, "e5")).toBe("e7e5");
    expect(uci(fen, "Кf6")).toBe("g8f6");
    expect(uci("4k3/8/8/8/8/8/8/4K3 w - - 0 1", "Крe2")).toBe("e1e2");
    expect(uci("4k3/8/8/8/8/8/8/4K3 w - - 0 1", "крd1")).toBe("e1d1");
  });

  it("ход, набранный целиком на русской раскладке: «е2е4», «сd4»", () => {
    // Здесь «е» и «с» — кириллические.
    expect(uci(START, "е2е4")).toBe("e2e4");
    expect(uci(START, "с4")).toBe("c2c4");
    expect(uci(after("e4", "c5", "d4"), "сd4")).toBe("c5d4");
    // Строчная «с» — и вертикаль, и слон: если на d4 бьют и пешка c, и слон, ход не делается — просим уточнить.
    const both = "4k3/8/8/8/3n4/2P1B3/8/4K3 w - - 0 1";
    expect(uci(both, "сd4")).toBe("ambiguous");
    expect(uci(both, "cd4")).toBe("c3d4");
    expect(uci(both, "Сd4")).toBe("e3d4");
  });

  it("любой возможный ход находится по своей записи — на позициях настоящей партии", () => {
    const game = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d4 Nbd7".split(" ");
    const c = new Chess();
    for (const [i, san] of game.entries()) {
      // Каждая четвёртая позиция (последняя — где на d7 идут оба коня): тест остаётся быстрым и на медленной машине.
      for (const m of i % 4 === 3 ? c.moves({ verbose: true }) : []) {
        const r = matchTypedMove(c.fen(), m.san);
        expect(r.kind === "move" && r.uci, `${c.fen()} ${m.san}`).toBe(m.from + m.to + (m.promotion ?? ""));
      }
      c.move(san);
    }
  });
});
