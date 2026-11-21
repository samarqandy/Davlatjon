/**
 * Партии по уровням (GAMES-3): партии обычных игроков из открытой базы Lichess (CC0), по три файла —
 * уровень 1 (рейтинг 1000–1399), 2 (1400–1799), 3 (1800–2199). Собирает scripts/games/build-levels.mjs: ников,
 * ссылок, турниров и точных дат в файлах нет, рейтинги округлены до 50. Файл уровня грузится, когда его открыли.
 */
import { OPENING_GROUPS, searchKey, type GameResult, type LibGame, type LoadedGame } from "./library";
import { OPENING_NAMES } from "@/content/chess/openingNames";

export type Level = 1 | 2 | 3;
export const LEVELS: readonly Level[] = [1, 2, 3];

export interface LevelFile {
  set: string;
  level: Level;
  ratingFrom: number;
  ratingTo: number;
  license: string;
  licenseUrl: string;
  source: string;
  sourceUrl: string;
  attribution: string;
  count: number;
  games: (Omit<LibGame, "w" | "b" | "ev" | "src"> & { lv: Level })[];
}

export type LevelMeta = Omit<LevelFile, "games"> & { url: string };

export const levelUrl = (level: Level) => `/data/games/levels-${level}.cc0.json`;

/** Уровень партии по её id («lv2-0017» → 2) или null. */
export function levelOf(id: string): Level | null {
  const m = /^lv([123])-\d+$/.exec(id);
  return m ? (Number(m[1]) as Level) : null;
}

/** Партии файла уровня — в общем виде партии базы: без имён и турнира, источник — база Lichess. */
export function prepareLevel(file: LevelFile): LoadedGame[] {
  return file.games.map((g) => {
    const op = g.op ? OPENING_NAMES[g.op] : undefined;
    return {
      ...g,
      w: "",
      b: "",
      ev: "",
      src: file.sourceUrl,
      set: file.set,
      plies: g.m.split(" ").length,
      // Искать можно по дебюту: «итальянская», «sitsiliya».
      text: searchKey([g.op ?? "", op?.ru ?? "", op?.uz ?? "", g.eco ?? ""].join(" ")),
      uz: false,
      championship: false,
    };
  });
}

const loading = new Map<Level, Promise<{ games: LoadedGame[]; meta: LevelMeta }>>();

/** Загрузить файл уровня (один раз за страницу); при сбое следующая попытка грузит заново. */
export function loadLevel(level: Level, fetcher: typeof fetch = fetch) {
  let p = loading.get(level);
  if (!p) {
    const url = levelUrl(level);
    p = fetcher(url)
      .then((r) => {
        if (!r.ok) throw new Error(`level ${level}: ${r.status}`);
        return r.json() as Promise<LevelFile>;
      })
      .then((file) => {
        if (!Array.isArray(file.games)) throw new Error(`level ${level}: no games`);
        const { games, ...meta } = file;
        return { games: prepareLevel({ ...file, games }), meta: { ...meta, url } };
      });
    p.catch(() => loading.delete(level));
    loading.set(level, p);
  }
  return p;
}

export interface LevelQuery {
  /** Группа дебютов («g:italian») или «any». */
  op: string;
  result: "any" | GameResult;
  /** Только партии, закончившиеся матом. */
  mate: boolean;
  /** Только партии с отмеченной решающей ошибкой. */
  mistake: boolean;
  /** Только короткие: до 30 ходов. */
  short: boolean;
}

export const EMPTY_LEVEL_QUERY: LevelQuery = { op: "any", result: "any", mate: false, mistake: false, short: false };

export function filterLevel(games: readonly LoadedGame[], q: LevelQuery): LoadedGame[] {
  const group = OPENING_GROUPS.find((g) => g.key === q.op);
  return games.filter(
    (g) =>
      (q.op === "any" || (group ? group.families.includes(g.op ?? "") : g.op === q.op)) &&
      (q.result === "any" || g.res === q.result) &&
      (!q.mate || g.mt === 1) &&
      (!q.mistake || g.x !== undefined) &&
      (!q.short || g.plies <= 60),
  );
}

/** Только для тестов. */
export function resetLevelsForTest() {
  loading.clear();
}
