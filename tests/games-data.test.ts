/**
 * Файлы базы партий (public/data/games, собирает scripts/games/build-games.mjs): лицензии и источники на месте,
 * каждая партия проигрывается по правилам, нет повторов, дебюты названы по нашему списку, код ECO и начало эндшпиля
 * верны, файлы не разрослись.
 */
import { Chess } from "chess.js";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { OPENING_NAMES } from "@/content/chess/openingNames";
import { EMPTY_QUERY, LIBRARY_FILES, OPENING_GROUPS, filterGames, prepare, type LibFile } from "@/lib/games/library";
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

  it("армагеддонов нет: две классические партии одних игроков в одном туре турнира не бывают", () => {
    const seen = new Map<string, string>();
    for (const g of ALL.filter((x) => x.tc === "c" && x.rd)) {
      const key = [g.w, g.b, g.ev, g.rd].join("|");
      expect(seen.get(key), `${g.id} и ${seen.get(key)}`).toBeUndefined();
      seen.set(key, g.id);
    }
  });

  it("имена в одном порядке «Фамилия, Имя»: один игрок не записан и так, и наоборот", () => {
    const names = new Set(ALL.flatMap((g) => [g.w, g.b]));
    for (const n of names) {
      const [a, b] = n.split(", ");
      if (b) expect(names.has(`${b}, ${a}`), n).toBe(false);
    }
    // Игроки без номера FIDE в трансляциях записаны «Фамилия Имя» — порядок не переворачивается.
    expect(names.has("Smirnov, Anton")).toBe(true);
    expect(names.has("Anton, Smirnov")).toBe(false);
  });

  it("дата партии — только из источников, где она точно дата партии (не из трансляций)", () => {
    const broadcasts = FILES.find((f) => f.file.set === "lichess")!.file.games;
    expect(broadcasts.filter((g) => g.d)).toEqual([]);
  });

  it("в названиях турниров нет служебных пометок базы-источника", () => {
    for (const g of ALL) expect(g.ev, g.id).not.toMatch(/;|\bolm\b/);
  });

  it("дебют — семейство из нашего списка названий (RU и UZ)", () => {
    for (const g of ALL) if (g.op) expect(OPENING_NAMES[g.op], `${g.id}: ${g.op}`).toBeTruthy();
    expect(ALL.filter((g) => g.op).length / ALL.length).toBeGreaterThan(0.9);
  });

  it("код ECO — у каждой партии с начальной позиции, по форме «B90»; группы дебютов — в своих кодах ECO", () => {
    for (const g of ALL) {
      if (g.fen) expect(g.eco, g.id).toBeUndefined();
      else expect(g.eco, g.id).toMatch(/^[A-E]\d\d$/);
    }
    // Название дебюта — по нашей книге, код — по списку Lichess: они должны говорить об одном и том же дебюте.
    const RANGES: Record<string, RegExp> = {
      "g:italian": /^C5/,
      "g:sicilian": /^B[2-9]/,
      "g:ruy": /^C[6-9]/,
      "g:french": /^C[01]/,
      "g:carokann": /^B1/,
      "g:qg": /^D[0-6]/,
      "g:kid": /^E[6-9]/,
    };
    const games = FILES.flatMap(({ file }) => prepare(file));
    for (const group of OPENING_GROUPS) {
      const found = filterGames(games, { ...EMPTY_QUERY, op: group.key });
      expect(found.length, group.key).toBeGreaterThanOrEqual(10);
      const inRange = found.filter((g) => RANGES[group.key].test(g.eco ?? ""));
      expect(inRange.length / found.length, group.key).toBeGreaterThan(0.95);
    }
  });

  it("дебют — по позиции, а не по порядку ходов: партия, пришедшая в ферзевый гамбит через 1.d4 Nf6 2.Nf3, — ферзевый гамбит", () => {
    const games = FILES.flatMap(({ file }) => prepare(file));
    const byId = (id: string) => games.find((g) => g.id === id)!;
    // Каруана — Карлсен, ЧМ-2018, партии 2 и 7: 1.d4 Nf6 2.Nf3 d5 3.c4 e6 4.Nc3 Be7 5.Bf4 — атака Гарвица (D37).
    for (const id of ["wp-1379339785-1", "wp-1379339785-6"])
      expect([byId(id).op, byId(id).eco], id).toEqual(["Queen's Gambit Declined", "D37"]);
    // 1.c4 e6 2.Nc3 d5 3.d4 Nf6 4.cxd5 exd5 5.Bg5 — разменный вариант ферзевого гамбита (D35), а не английское начало.
    expect([byId("lb-4nFtKUUk").op, byId("lb-4nFtKUUk").eco]).toEqual(["Queen's Gambit Declined", "D35"]);
    // Ларсен — Глигорич, 1956: 1.Nf3 c5 2.e4 d6 3.d4 — сицилианская защита, вариант Найдорфа (B92).
    expect([byId("kf-larsen-v-gligoric-1956").op, byId("kf-larsen-v-gligoric-1956").eco]).toEqual([
      "Sicilian Defense",
      "B92",
    ]);
    // Каруана — Карлсен, ЧМ-2018, партия 1: Россолимо (B31) — тот же порядок ходов, что и в списке.
    expect(byId("wp-1379339785-0").eco).toBe("B31");
    const qg = filterGames(games, { ...EMPTY_QUERY, op: "g:qg" }).map((g) => g.id);
    expect(qg).toContain("wp-1379339785-1");
    expect(qg).toContain("lb-4nFtKUUk");
  });

  it("начало эндшпиля: первый полуход, после которого у каждой стороны фигур не больше чем на 8 пешек, и дальше ещё ≥ 8 полуходов", () => {
    const VALUE: Record<string, number> = { n: 3, b: 3, r: 5, q: 9 };
    const endgame = (chess: Chess) => {
      const m = { w: 0, b: 0 };
      for (const row of chess.board()) for (const p of row) if (p) m[p.color] += VALUE[p.type] ?? 0;
      return m.w <= 8 && m.b <= 8;
    };
    let count = 0;
    for (const g of ALL) {
      const moves = g.m.split(" ");
      const chess = new Chess(g.fen ?? START_FEN);
      let first: number | undefined;
      moves.forEach((u, i) => {
        chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
        if (first === undefined && endgame(chess)) first = i + 1;
      });
      const expected = first !== undefined && moves.length - first >= 8 ? first : undefined;
      expect(g.en, g.id).toBe(expected);
      if (g.en !== undefined) count++;
    }
    expect(count).toBeGreaterThan(200);
  }, 180_000);

  it("разделы для учеников не пустые: знаменитые, эндшпиль, короткие победы", () => {
    const games = FILES.flatMap(({ file }) => prepare(file));
    for (const section of ["famous", "endgame", "short"] as const)
      expect(filterGames(games, { ...EMPTY_QUERY, section }).length, section).toBeGreaterThan(20);
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
