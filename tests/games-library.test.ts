/** База партий доски тренера (MENTOR-3): поиск по-русски и по-узбекски, разделы, фильтры, подписи, загрузка. */
import { afterEach, describe, expect, it } from "vitest";
import {
  EMPTY_QUERY,
  LIBRARY_FILES,
  PLAYER_CHIPS,
  eventText,
  filterGames,
  gameTask,
  isUzbek,
  loadLibrary,
  openingFamilies,
  prepare,
  resetLibraryForTest,
  resultText,
  roundText,
  searchKey,
  sortGames,
  type GameQuery,
  type LibFile,
  type LibGame,
} from "@/lib/games/library";

const ru = (r: string) => r;
const uz = (_: string, u: string) => u;

const game = (over: Partial<LibGame>): LibGame => ({
  id: "x",
  w: "White, A",
  b: "Black, B",
  ev: "Test Open 2020",
  y: 2020,
  res: "1-0",
  tc: "c",
  m: "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1 f8e7",
  src: "test",
  ...over,
});

const FILE: LibFile = {
  set: "test",
  license: "CC BY-SA 4.0",
  source: "test",
  sourceUrl: "https://example.org",
  attribution: "test",
  games: [
    game({
      id: "sindarov",
      w: "Sindarov, Javokhir",
      b: "Wei, Yi",
      ev: "FIDE World Cup 2025 · Finals",
      si: "Goa",
      y: 2025,
      rd: "game 1",
      op: "Sicilian Defense",
    }),
    game({
      id: "carlsen",
      w: "Carlsen, Magnus",
      b: "Nepomniachtchi, Ian",
      ev: "FIDE World Championship 2021",
      si: "Dubai",
      y: 2021,
      rd: "6",
      res: "1/2-1/2",
      op: "Ruy Lopez",
    }),
    game({
      id: "kasim",
      w: "Kasimdzhanov, Rustam",
      b: "Adams, Michael",
      ev: "FIDE World Chess Championship 2004",
      si: "Tripoli",
      y: 2004,
      rd: "2",
    }),
    game({
      id: "olymp",
      w: "Ivanchuk, Vasyl",
      b: "Abdusattorov, Nodirbek",
      ev: "46th Chess Olympiad 2026",
      si: "Samarkand",
      y: 2026,
      rd: "11",
      res: "0-1",
    }),
    game({
      id: "rapid",
      w: "Abdusattorov, Nodirbek",
      b: "Carlsen, Magnus",
      ev: "FIDE World Rapid Championship 2021",
      si: "Warsaw",
      y: 2021,
      rd: "9",
      tc: "r",
    }),
    game({
      id: "immortal",
      w: "Anderssen, Adolf",
      b: "Kieseritzky, Lionel",
      ev: "London",
      y: 1851,
      t: "Immortal Game",
    }),
    game({ id: "vakhidov", w: "Vakhidov, Jakhongir", b: "Omonov, Someone", ev: "Test Open 2022", y: 2022, res: "0-1" }),
  ],
};
const GAMES = sortGames(prepare(FILE));
const ids = (q: Partial<GameQuery>) => filterGames(GAMES, { ...EMPTY_QUERY, ...q }).map((g) => g.id);

describe("ключ поиска", () => {
  it("кириллица — латиницей, регистр и знаки не важны, узбекские апострофы убираются", () => {
    expect(searchKey("Синдаров")).toBe("sindarov");
    expect(searchKey("  КАСПАРОВ, Гарри ")).toBe("kasparov garri");
    expect(searchKey("Oʻzbekiston")).toBe("ozbekiston");
    expect(searchKey("Ёқуббоев")).toBe("yoqubboev");
    expect(searchKey("Nepomniachtchi, Ian")).toBe("nepomniachtchi ian");
    expect(searchKey("Сергей Карякин")).toBe("sergey karyakin");
    expect(searchKey("Mahé de La Bourdonnais")).toBe("mahe de la bourdonnais");
  });
});

describe("узбекские шахматисты", () => {
  it("по фамилии и по «фамилии, имени»; однофамилец из другого списка — нет", () => {
    expect(isUzbek("Sindarov, Javokhir")).toBe(true);
    expect(isUzbek("Abdusattorov, Nodirbek")).toBe(true);
    expect(isUzbek("Vakhidov, Jakhongir")).toBe(true);
    expect(isUzbek("Omonov, Asrorjon")).toBe(true);
    expect(isUzbek("Omonov, Someone")).toBe(false);
    expect(isUzbek("Carlsen, Magnus")).toBe(false);
    // Фамилия целиком: «Sindarova» — не «Sindarov».
    expect(isUzbek("Sindarova, X")).toBe(false);
  });
});

describe("поиск", () => {
  it("фамилия латиницей, кириллицей и по-узбекски находит одно и то же", () => {
    expect(ids({ text: "Carlsen" })).toEqual(["carlsen", "rapid"]);
    expect(ids({ text: "Карлсен" })).toEqual(["carlsen", "rapid"]);
    expect(ids({ text: "karlsen" })).toEqual(["carlsen", "rapid"]);
    expect(ids({ text: "Синдаров" })).toEqual(["sindarov"]);
    expect(ids({ text: "Qosimjonov" })).toEqual(["kasim"]);
    expect(ids({ text: "Касымджанов" })).toEqual(["kasim"]);
    expect(ids({ text: "Непомнящий" })).toEqual(["carlsen"]);
  });

  it("слова — в любом порядке; четыре цифры — год партии; турнир и город по-русски", () => {
    expect(ids({ text: "2021 карлсен" })).toEqual(["carlsen", "rapid"]);
    expect(ids({ text: "абдусатторов 2026" })).toEqual(["olymp"]);
    expect(ids({ text: "олимпиада" })).toEqual(["olymp"]);
    expect(ids({ text: "Samarqand" })).toEqual(["olymp"]);
    expect(ids({ text: "кубок мира" })).toEqual(["sindarov"]);
    expect(ids({ text: "Бессмертная" })).toEqual(["immortal"]);
    expect(ids({ text: "oʻlmas" })).toEqual(["immortal"]);
    expect(ids({ text: "1852" })).toEqual([]);
  });

  it("разделы: Узбекистан, чемпионаты мира (без рапида), классика до 1950, последние годы", () => {
    expect(ids({ section: "uz" })).toEqual(["olymp", "sindarov", "vakhidov", "rapid", "kasim"]);
    expect(ids({ section: "championship" })).toEqual(["carlsen", "kasim"]);
    expect(ids({ section: "classic" })).toEqual(["immortal"]);
    expect(ids({ section: "modern" })).toEqual(["olymp", "sindarov", "vakhidov", "carlsen", "rapid"]);
  });

  it("фильтры: годы, результат, контроль, дебют — вместе с поиском", () => {
    expect(ids({ from: 2021, to: 2022 })).toEqual(["vakhidov", "carlsen", "rapid"]);
    expect(ids({ to: 1900 })).toEqual(["immortal"]);
    expect(ids({ result: "0-1" })).toEqual(["olymp", "vakhidov"]);
    expect(ids({ tc: "r" })).toEqual(["rapid"]);
    expect(ids({ op: "Ruy Lopez" })).toEqual(["carlsen"]);
    expect(ids({ text: "carlsen", tc: "c" })).toEqual(["carlsen"]);
  });

  it("новые партии сверху", () => {
    expect(GAMES.map((g) => g.y)).toEqual([...GAMES.map((g) => g.y)].sort((a, b) => b - a));
  });

  it("кнопки быстрого выбора находят игрока", () => {
    for (const chip of PLAYER_CHIPS.filter((c) =>
      ["Sindarov", "Carlsen", "Kasimdzhanov", "Abdusattorov"].includes(c.q),
    )) {
      expect(ids({ text: chip.q }).length).toBeGreaterThan(0);
    }
  });
});

describe("подписи", () => {
  const byId = (id: string) => GAMES.find((g) => g.id === id)!;

  it("результат, тур или партия матча, турнир с годом", () => {
    expect(resultText("1-0")).toBe("1–0");
    expect(resultText("1/2-1/2")).toBe("½–½");
    expect(roundText(byId("carlsen"), ru)).toBe("партия 6");
    expect(roundText(byId("carlsen"), uz)).toBe("6-partiya");
    expect(roundText(byId("olymp"), ru)).toBe("тур 11");
    expect(roundText(byId("rapid"), ru)).toBe("тур 9");
    expect(roundText(byId("sindarov"), ru)).toBe("партия 1");
    expect(roundText({ ...byId("sindarov"), rd: "tiebreak 1, rapid 2" }, ru)).toBe("тай-брейк");
    expect(roundText(byId("immortal"), ru)).toBeNull();
    expect(eventText(byId("immortal"))).toBe("London, 1851");
    expect(eventText(byId("olymp"))).toBe("46th Chess Olympiad 2026");
  });

  it("задание на доске: название, игроки, турнир — без результата, не длиннее 140 знаков", () => {
    expect(gameTask(byId("immortal"), ru)).toBe(
      "Бессмертная партия · Anderssen, Adolf – Kieseritzky, Lionel · London, 1851",
    );
    expect(gameTask(byId("immortal"), uz)).toMatch(/^Oʻlmas partiya · /);
    const task = gameTask(byId("carlsen"), ru);
    expect(task).toBe("Carlsen, Magnus – Nepomniachtchi, Ian · FIDE World Championship 2021 · партия 6");
    expect(task).not.toMatch(/½|1–0|0–1/);
    expect(gameTask({ ...byId("carlsen"), ev: "x".repeat(300) }, ru)).toHaveLength(140);
  });

  it("дебюты в базе — от частого к редкому", () => {
    expect(openingFamilies(GAMES)).toEqual([
      ["Ruy Lopez", 1],
      ["Sicilian Defense", 1],
    ]);
  });
});

describe("загрузка", () => {
  afterEach(() => resetLibraryForTest());

  const fetcher = (files: Record<string, LibFile | null>, calls: string[] = []) =>
    (async (url: string) => {
      calls.push(url);
      const f = files[url];
      if (f === undefined) throw new Error("offline");
      return { ok: !!f, json: async () => f } as Response;
    }) as unknown as typeof fetch;

  it("все наборы — одним списком, новые сверху; сведения о наборах без партий; второй раз — без загрузки", async () => {
    const calls: string[] = [];
    const other: LibFile = { ...FILE, set: "pd", games: [game({ id: "pd1", y: 1921 })] };
    const f = fetcher({ [LIBRARY_FILES[0]]: FILE, [LIBRARY_FILES[1]]: null, [LIBRARY_FILES[2]]: other }, calls);
    const lib = await loadLibrary(f);
    expect(lib.games).toHaveLength(FILE.games.length + 1);
    expect(lib.games[0].y).toBe(2026);
    expect(lib.games.find((g) => g.id === "pd1")?.set).toBe("pd");
    expect(lib.files.map((x) => x.set)).toEqual(["test", "pd"]);
    expect(lib.files[0]).not.toHaveProperty("games");
    await loadLibrary(f);
    expect(calls).toHaveLength(3);
  });

  it("ни один набор не загрузился — ошибка, и следующая попытка грузит заново", async () => {
    const calls: string[] = [];
    await expect(loadLibrary(fetcher({}, calls))).rejects.toThrow();
    await expect(loadLibrary(fetcher({ [LIBRARY_FILES[0]]: FILE }, calls))).resolves.toBeTruthy();
    expect(calls).toHaveLength(6);
  });
});
