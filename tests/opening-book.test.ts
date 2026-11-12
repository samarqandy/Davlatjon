/** Книга дебютов: данные из открытого списка Lichess, наши названия и поиск названия по ходам партии. */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import book from "@/content/chess/opening-book.json";
import { OPENING_NAMES } from "@/content/chess/openingNames";
import { isStandardStart, makeOpeningBook, STANDARD_START, type OpeningBookData } from "@/lib/openingBook";

const data = book as unknown as OpeningBookData;
const opening = makeOpeningBook(data, OPENING_NAMES);
/** Ходы партии в записи chess.js — как их получает экран (со знаками «+» и «#»). */
const sans = (pgn: string) => {
  const chess = new Chess();
  return pgn.split(" ").map((move) => chess.move(move).san);
};
const ru = (pgn: string) => opening.find(sans(pgn))?.ru ?? null;

describe("книга дебютов: данные", () => {
  it("источник записан; каждая строка — законные ходы с начальной позиции, без «+» и «#», без повторов", () => {
    expect(book.source).toMatch(/lichess-org\/chess-openings \(CC0\)/);
    expect(data.lines.length).toBeGreaterThan(300);
    const seen = new Set<string>();
    for (const [moves, family] of data.lines) {
      expect(seen.has(moves), moves).toBe(false);
      seen.add(moves);
      expect(moves).not.toMatch(/[+#]/);
      expect(data.families[family], moves).toBeTypeOf("string");
      const chess = new Chess();
      for (const move of moves.split(" ")) expect(() => chess.move(move), `${moves}: ${move}`).not.toThrow();
    }
  });

  it("строка хранится, только если меняет название: у более короткой знакомой строки семейство другое", () => {
    const byLine = new Map(data.lines);
    for (const [moves, family] of data.lines) {
      const parts = moves.split(" ");
      for (let k = parts.length - 1; k > 0; k--) {
        const above = byLine.get(parts.slice(0, k).join(" "));
        if (above === undefined) continue;
        expect(above, moves).not.toBe(family);
        break;
      }
    }
  });
});

describe("книга дебютов: названия", () => {
  it("каждое название относится к семейству из книги — без опечаток в ключах", () => {
    for (const family of Object.keys(OPENING_NAMES)) expect(data.families, family).toContain(family);
  });

  it("по-русски — кириллицей, по-узбекски — латиницей с правильными апострофами", () => {
    for (const [family, name] of Object.entries(OPENING_NAMES)) {
      expect(name.ru, family).toMatch(/^[А-ЯЁ«]/);
      expect(name.ru, family).not.toMatch(/[A-Za-z]/);
      expect(name.uz, family).not.toMatch(/[А-Яа-яЁё]/);
      expect(name.uz, family).not.toMatch(/[`'‘’]/);
      expect(name.uz, family).toMatch(/^[A-Z«]/);
    }
  });

  it("названо больше трёх четвертей строк книги; без названия — только редкие семейства", () => {
    // Замер 12.11.2026: 77 % строк. Остальное — экзотика с десятками порядков ходов («Pterodactyl Defense» —
    // 31 строка) и шуточные начала; им показывается более общее название.
    const named = data.lines.filter(([, family]) => OPENING_NAMES[data.families[family]]).length;
    expect(named / data.lines.length).toBeGreaterThanOrEqual(0.75);
    // Все первые ходы, которыми дети начинают партию на самом деле, названы.
    for (const first of ["e4", "d4", "c4", "Nf3", "e3", "d3", "g3", "b3", "f4", "Nc3", "a3", "a4", "h3"])
      expect(opening.find([first]), first).not.toBeNull();
  });
});

describe("книга дебютов: поиск по ходам партии", () => {
  it("известные дебюты называются так, как принято по-русски", () => {
    expect(ru("e4 e5 Nf3 Nc6 Bc4")).toBe("Итальянская партия");
    expect(ru("e4 e5 Nf3 Nc6 Bb5 a6 Ba4")).toBe("Испанская партия");
    expect(ru("e4 e5 Nf3 Nf6")).toBe("Русская партия");
    expect(ru("e4 c5 Nf3 d6 d4")).toBe("Сицилианская защита");
    expect(ru("e4 e6 d4 d5")).toBe("Французская защита");
    expect(ru("e4 c6 d4 d5")).toBe("Защита Каро-Канн");
    expect(ru("d4 d5 c4")).toBe("Ферзевый гамбит");
    expect(ru("d4 d5 c4 dxc4")).toBe("Принятый ферзевый гамбит");
    expect(ru("d4 d5 c4 e6")).toBe("Отказанный ферзевый гамбит");
    expect(ru("d4 Nf6 c4 g6 Nc3 Bg7")).toBe("Староиндийская защита");
    expect(ru("e4 e5 f4 exf4")).toBe("Принятый королевский гамбит");
    expect(ru("c4")).toBe("Английское начало");
  });

  it("название уточняется по ходу партии: от общего к точному", () => {
    expect(ru("e4")).toBe("Дебют королевской пешки");
    expect(ru("e4 e5 Nf3")).toBe("Дебют королевского коня");
    expect(ru("e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4")).toBe("Итальянская партия");
    expect(opening.find(sans("e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4"))?.plies).toBeGreaterThanOrEqual(5);
  });

  it("знаки шаха в записи хода поиску не мешают", () => {
    // 1. e4 e5 2. Фh5 Кc6 3. Сc4 Кf6 4. Фxf7# — детский мат; ходы приходят со знаком «#».
    const moves = sans("e4 e5 Qh5 Nc6 Bc4 Nf6 Qxf7#");
    expect(moves.at(-1)).toBe("Qxf7#");
    expect(opening.find(moves)?.ru).toBe("Дебют королевской пешки");
  });

  it("редкое семейство без нашего названия уступает более общему; незнакомое начало не называется", () => {
    // 1. e4 e5 2. Крe2 в списке есть как шуточная «Bongcloud Attack» — названия ей не даём.
    expect(data.families).toContain("Bongcloud Attack");
    expect(OPENING_NAMES["Bongcloud Attack"]).toBeUndefined();
    const found = opening.find(sans("e4 e5 Ke2"));
    expect(found?.ru).toBe("Дебют королевской пешки");
    expect(found?.plies).toBe(1);
    expect(opening.find([])).toBeNull();
    // 1. h4 — в списке «Kádas Opening», названия у нас нет, более общего тоже.
    expect(opening.find(sans("h4"))).toBeNull();
  });

  it("дебют есть только у партии с обычной расстановки", () => {
    expect(isStandardStart(undefined)).toBe(true);
    expect(isStandardStart(STANDARD_START)).toBe(true);
    // Фора «без ферзя» и своя позиция — не дебют.
    expect(isStandardStart("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1")).toBe(false);
    expect(isStandardStart("4k3/8/8/8/8/8/4P3/4K3 w - - 0 1")).toBe(false);
  });
});
