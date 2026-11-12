/** Вид доски и набор звуков ходов: список вариантов, проверка значений и сохранение в настройках. */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  BOARD_THEMES,
  DEFAULT_BOARD_THEME,
  DEFAULT_PIECE_SET,
  PIECE_SETS,
  SOUND_SETS,
  boardThemeOf,
  fenCells,
  isBoardThemeId,
  isPieceSetId,
  isSoundSetId,
  pieceSetOf,
  pieceSrc,
} from "@/lib/boardLook";
import { sanitize } from "@/lib/state";

describe("цвета доски", () => {
  it("у каждой темы есть название на двух языках, три цвета и уникальный id", () => {
    const ids = new Set(BOARD_THEMES.map((t) => t.id));
    expect(ids.size).toBe(BOARD_THEMES.length);
    for (const t of BOARD_THEMES) {
      expect(t.ru).toBeTruthy();
      expect(t.uz).toBeTruthy();
      for (const c of [t.light, t.dark, t.frame]) expect(c).toMatch(/^#[0-9a-f]{6}$/i);
      expect(t.light).not.toBe(t.dark);
    }
  });

  it("неизвестная или пустая тема превращается в дерево по умолчанию", () => {
    expect(boardThemeOf(undefined)).toBe(DEFAULT_BOARD_THEME);
    expect(boardThemeOf("nope")).toBe(DEFAULT_BOARD_THEME);
    expect(boardThemeOf("green").id).toBe("green");
    expect(isBoardThemeId("blue")).toBe(true);
    expect(isBoardThemeId("nope")).toBe(false);
    expect(isBoardThemeId(3)).toBe(false);
  });
});

describe("наборы звуков", () => {
  it("записанные деревянные — первые (по умолчанию), мягкие синтезированные — второй вариант", () => {
    expect(SOUND_SETS.map((s) => s.id)).toEqual(["wood", "soft"]);
    expect(isSoundSetId("soft")).toBe(true);
    expect(isSoundSetId("loud")).toBe(false);
  });

  it("все записанные звуки лежат на месте и не пустые", () => {
    for (const k of ["move", "capture", "castle", "promote", "check", "illegal"]) {
      const f = path.join(process.cwd(), "public/audio/sfx", `${k}.mp3`);
      expect(fs.statSync(f).size, k).toBeGreaterThan(2000);
    }
  });
});

describe("наборы фигур", () => {
  const CODES = ["wK", "wQ", "wR", "wB", "wN", "wP", "bK", "bQ", "bR", "bB", "bN", "bP"];
  const dir = path.join(process.cwd(), "public/pieces");
  const extra = PIECE_SETS.filter((p) => p.id !== "classic");

  it("классические — первые (по умолчанию); неизвестный набор превращается в них", () => {
    expect(DEFAULT_PIECE_SET.id).toBe("classic");
    expect(pieceSetOf(undefined)).toBe(DEFAULT_PIECE_SET);
    expect(pieceSetOf("nope")).toBe(DEFAULT_PIECE_SET);
    expect(isPieceSetId("celtic")).toBe(true);
    expect(isPieceSetId("../etc")).toBe(false);
    expect(pieceSrc("celtic", "wN")).toBe("/pieces/celtic/wN.svg");
    expect(new Set(PIECE_SETS.map((p) => p.id)).size).toBe(PIECE_SETS.length);
  });

  it("у каждого свободного набора — все 12 фигур, автор, лицензия и её текст рядом с файлами", () => {
    expect(extra.length).toBeGreaterThan(0);
    const readme = fs.readFileSync(path.join(dir, "README.md"), "utf8");
    for (const set of extra) {
      expect(set.author, set.id).toBeTruthy();
      expect(set.license, set.id).toBeTruthy();
      // Берём только то, что не ставит условий на наш код и подходит учебному центру.
      expect(set.license, set.id).toMatch(/^(MIT|Apache 2\.0|CC0|CC BY 4\.0)$/);
      expect(fs.statSync(path.join(dir, set.id, "LICENSE.txt")).size, set.id).toBeGreaterThan(500);
      expect(readme, set.id).toContain(`\`${set.id}\``);
      expect(readme, set.id).toContain(set.author!);
      for (const code of CODES) {
        const svg = fs.readFileSync(path.join(dir, set.id, `${code}.svg`), "utf8");
        expect(svg, `${set.id}/${code}`).toMatch(/^<svg[\s>]/);
        // Чужая картинка не должна ничего исполнять и ничего подгружать со стороны.
        expect(svg, `${set.id}/${code}`).not.toMatch(/<script|<foreignObject|<image|\son\w+=|href="(?!#)/i);
      }
    }
  });

  it("в папке наборов нет лишнего: каждая папка описана в списке", () => {
    const folders = fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isDirectory());
    expect(folders.sort()).toEqual(extra.map((p) => p.id).sort());
  });
});

describe("настройки доски в сохранённом состоянии", () => {
  it("допустимые значения сохраняются, недопустимые отбрасываются", () => {
    const ok = sanitize({ settings: { boardTheme: "violet", boardSoundSet: "soft" } });
    expect(ok.settings.boardTheme).toBe("violet");
    expect(ok.settings.boardSoundSet).toBe("soft");
    const bad = sanitize({ settings: { boardTheme: "<script>", boardSoundSet: "x" } });
    expect(bad.settings.boardTheme).toBeUndefined();
    expect(bad.settings.boardSoundSet).toBeUndefined();
    expect(sanitize({ settings: { pieceSet: "celtic" } }).settings.pieceSet).toBe("celtic");
    // Классические — значение по умолчанию: в настройках его не храним.
    expect(sanitize({ settings: { pieceSet: "classic" } }).settings.pieceSet).toBeUndefined();
    expect(sanitize({ settings: { pieceSet: "../../x" } }).settings.pieceSet).toBeUndefined();
  });
});

describe("позиция для доски-картинки", () => {
  it("начальная позиция: 64 клетки от a8 к h1, фигуры на своих местах", () => {
    const cells = fenCells("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    expect(cells).toHaveLength(64);
    expect(cells.slice(0, 8)).toEqual(["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"]);
    expect(cells.slice(8, 16).every((c) => c === "bP")).toBe(true);
    expect(cells.slice(16, 48).every((c) => c === null)).toBe(true);
    expect(cells[60]).toBe("wK");
    expect(cells.filter(Boolean)).toHaveLength(32);
  });

  it("пустые клетки считаются цифрами; годится и запись без хвоста", () => {
    const cells = fenCells("4k3/8/8/3q4/8/8/4P3/4K3");
    expect(cells[4]).toBe("bK");
    expect(cells[27]).toBe("bQ");
    expect(cells[52]).toBe("wP");
    expect(cells.filter(Boolean)).toHaveLength(4);
  });

  it("ошибочная запись — пустая доска, а не сдвинутые фигуры", () => {
    for (const bad of ["", "8/8/8", "rnbqkbnr/ppppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", "мусор"]) {
      const cells = fenCells(bad);
      expect(cells, bad).toHaveLength(64);
      expect(
        cells.every((c) => c === null),
        bad,
      ).toBe(true);
    }
  });
});
