/**
 * Части шахматного контента (src/content/chess/parts): вместе — ровно весь контент, без пересечений,
 * и узбекская часть — то же, что узбекская версия целиком.
 */
import { describe, expect, it } from "vitest";
import { CHESS_PARTS, CHESS_RU, chessContent } from "@/content/chess/content";

describe("части шахматного контента", () => {
  it("каждый ключ — ровно в одной части", () => {
    const keys = CHESS_PARTS.flatMap((p) => Object.keys(p.ru));
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.sort()).toEqual(Object.keys(CHESS_RU).sort());
  });

  it("узбекская часть совпадает с узбекским контентом целиком", () => {
    const uz = chessContent("uz") as Record<string, unknown>;
    for (const part of CHESS_PARTS)
      for (const [key, value] of Object.entries(part.get("uz"))) expect(value, key).toBe(uz[key]);
  });

  it("русская часть — оригинал без копий", () => {
    for (const part of CHESS_PARTS) expect(part.get("ru")).toBe(part.ru);
  });
});
