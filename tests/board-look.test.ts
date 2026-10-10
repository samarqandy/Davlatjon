/** Вид доски и набор звуков ходов: список вариантов, проверка значений и сохранение в настройках. */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  BOARD_THEMES,
  DEFAULT_BOARD_THEME,
  SOUND_SETS,
  boardThemeOf,
  isBoardThemeId,
  isSoundSetId,
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

describe("настройки доски в сохранённом состоянии", () => {
  it("допустимые значения сохраняются, недопустимые отбрасываются", () => {
    const ok = sanitize({ settings: { boardTheme: "violet", boardSoundSet: "soft" } });
    expect(ok.settings.boardTheme).toBe("violet");
    expect(ok.settings.boardSoundSet).toBe("soft");
    const bad = sanitize({ settings: { boardTheme: "<script>", boardSoundSet: "x" } });
    expect(bad.settings.boardTheme).toBeUndefined();
    expect(bad.settings.boardSoundSet).toBeUndefined();
  });
});
