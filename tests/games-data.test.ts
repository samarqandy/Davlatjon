/**
 * Файлы базы партий (public/data/games, собирает scripts/games/build-games.mjs): лицензии и источники на месте,
 * каждая партия проигрывается по правилам, нет повторов, дебюты названы по нашему списку, файлы не разрослись.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { OPENING_NAMES } from "@/content/chess/openingNames";
import { LIBRARY_FILES, prepare, type LibFile } from "@/lib/games/library";
import { LIMITS, START_FEN, fensOf, isUci } from "@/lib/mentor/model";

const read = (url: string) =>
  JSON.parse(fs.readFileSync(path.join("public", url), "utf8")) as LibFile & { count: number };
const FILES = LIBRARY_FILES.map((url) => ({ url, file: read(url) }));
const ALL = FILES.flatMap(({ file }) => file.games);

/** Сжатый файл уходит браузеру; несжатый — предел, чтобы база не разрослась незаметно. */
const MAX_BYTES: Record<string, number> = {
  "/data/games/broadcasts.cc-by-sa-4.0.json": 900_000,
  "/data/games/wikimedia.cc-by-sa-4.0.json": 200_000,
  "/data/games/public-domain.json": 50_000,
};

describe("файлы базы партий", () => {
  it("у каждого файла — набор, лицензия, источник и подпись; число партий совпадает", () => {
    for (const { url, file } of FILES) {
      expect(file.set, url).toBeTruthy();
      expect(file.license, url).toBeTruthy();
      expect(file.sourceUrl, url).toMatch(/^https:\/\//);
      expect(file.attribution, url).toBeTruthy();
      expect(file.games.length, url).toBe(file.count);
      expect(file.games.length, url).toBeGreaterThan(10);
      expect(fs.statSync(path.join("public", url)).size, url).toBeLessThan(MAX_BYTES[url]);
    }
  });

  it("лицензия — в имени файла и в файле: BY-SA отдельно от общественного достояния", () => {
    for (const { url, file } of FILES) {
      if (url.includes("cc-by-sa-4.0")) {
        expect(file.license).toBe("CC BY-SA 4.0");
        expect(file.licenseUrl).toBe("https://creativecommons.org/licenses/by-sa/4.0/");
      } else expect(file.license).toBe("Public domain");
    }
    const attribution = fs.readFileSync("public/data/games/ATTRIBUTION.md", "utf8");
    for (const { url, file } of FILES) expect(attribution).toContain(`${path.basename(url)} — ${file.count} партий`);
  });

  it("у каждой партии — источник: ссылка на трансляцию, правка статьи или книга", () => {
    for (const { file } of FILES) {
      for (const g of file.games) {
        if (file.set === "lichess")
          expect(g.src, g.id).toMatch(/^https:\/\/lichess\.org\/broadcast\/.+\/.+\/\w{8}\/\w{8}$/);
        if (file.set === "wikimedia")
          expect(g.src, g.id).toMatch(/^https:\/\/(en\.wikipedia|commons\.wikimedia)\.org\/.*oldid=\d+/);
        if (file.set === "pd")
          expect(g.src, g.id).toMatch(/^J\. R\. Capablanca, Chess Fundamentals \(1921\), game \d+$/);
      }
    }
  });

  it("поля партии: результат, контроль, год, игроки; id не повторяются", () => {
    const ids = new Set<string>();
    for (const g of ALL) {
      expect(ids.has(g.id), g.id).toBe(false);
      ids.add(g.id);
      expect(["1-0", "0-1", "1/2-1/2"], g.id).toContain(g.res);
      expect(["c", "r", "b"], g.id).toContain(g.tc);
      expect(Number.isInteger(g.y) && g.y >= 1800 && g.y <= 2026, g.id).toBe(true);
      if (g.d) expect(g.d.startsWith(String(g.y)), g.id).toBe(true);
      expect(g.w.trim() && g.b.trim() && g.w !== g.b, g.id).toBeTruthy();
      expect(g.ev.trim(), g.id).toBeTruthy();
      for (const r of [g.we, g.be]) if (r !== undefined) expect(r >= 1000 && r <= 2900, g.id).toBe(true);
    }
  });

  it("каждая партия проигрывается по правилам целиком и помещается на доску тренера", () => {
    for (const g of ALL) {
      const moves = g.m.split(" ");
      expect(moves.every(isUci), g.id).toBe(true);
      expect(moves.length, g.id).toBeGreaterThanOrEqual(10);
      expect(moves.length, g.id).toBeLessThanOrEqual(LIMITS.plies);
      // fensOf останавливается на первом невозможном ходе.
      expect(fensOf(g.fen ?? START_FEN, moves).length - 1, g.id).toBe(moves.length);
    }
  }, 180_000);

  it("одна партия — один раз: те же игроки, год и первые 40 полуходов не повторяются", () => {
    const seen = new Map<string, string>();
    for (const g of ALL) {
      const key = [g.w, g.b, g.y, g.m.split(" ").slice(0, 40).join(" ")].join("|");
      expect(seen.get(key), `${g.id} повторяет ${seen.get(key)}`).toBeUndefined();
      seen.set(key, g.id);
    }
  });

  it("дебют — семейство из нашего списка названий (RU и UZ)", () => {
    for (const g of ALL) if (g.op) expect(OPENING_NAMES[g.op], `${g.id}: ${g.op}`).toBeTruthy();
    expect(ALL.filter((g) => g.op).length / ALL.length).toBeGreaterThan(0.9);
  });

  it("разделы не пустые: Узбекистан, чемпионаты мира, классика, последние годы; Синдаров, Карлсен, Каспаров, Карпов", () => {
    const games = FILES.flatMap(({ file }) => prepare(file));
    expect(games.filter((g) => g.uz).length).toBeGreaterThan(300);
    expect(games.filter((g) => g.championship).length).toBeGreaterThan(100);
    expect(games.filter((g) => g.y < 1950).length).toBeGreaterThan(15);
    expect(games.filter((g) => g.y >= 2020).length).toBeGreaterThan(500);
    for (const name of ["Sindarov", "Abdusattorov", "Carlsen", "Kasparov", "Karpov", "Kasimdzhanov", "Fischer"]) {
      expect(games.filter((g) => g.w.startsWith(name) || g.b.startsWith(name)).length, name).toBeGreaterThan(5);
    }
  });
});
