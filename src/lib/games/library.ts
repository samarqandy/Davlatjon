/**
 * Партии для доски тренера (MENTOR-3): поиск по игроку, году, турниру, дебюту, результату и разделам.
 *
 * Партии лежат в public/data/games отдельными файлами — по источнику и лицензии (их собирает
 * scripts/games/build-games.mjs): трансляции Lichess и Викисклад/Википедия — CC BY-SA 4.0, книги прошлого
 * века — общественное достояние. В сборку сайта эти файлы не входят: страница загружает их, когда тренер
 * открывает список. Свои пометки (разделы) считаем здесь, из данных партии, — в файлы-источники их не пишем.
 */
import { Chess } from "chess.js";

export type GameResult = "1-0" | "0-1" | "1/2-1/2";
export type TimeControl = "c" | "r" | "b";

export interface LibGame {
  id: string;
  /** Белые и чёрные: «Фамилия, Имя», как в источнике. */
  w: string;
  b: string;
  /** Рейтинги на момент партии, если известны. */
  we?: number;
  be?: number;
  /** Турнир (событие), город, год, дата «ГГГГ.ММ.ДД», тур. */
  ev: string;
  si?: string;
  y: number;
  d?: string;
  rd?: string;
  res: GameResult;
  /** Контроль: классика, рапид, блиц. */
  tc: TimeControl;
  /** Название партии в источнике, если оно есть («Immortal Game»). */
  t?: string;
  /** Начальная позиция, если не обычная. */
  fen?: string;
  /** Ходы в UCI через пробел. */
  m: string;
  /** Семейство дебюта (по открытому списку Lichess, CC0) — ключ в OPENING_NAMES. */
  op?: string;
  /** Код ECO по тому же списку. */
  eco?: string;
  /** Полуход, после которого на доске эндшпиль (у каждой стороны фигур не больше чем на ладью и лёгкую). */
  en?: number;
  /** Где партия взята (страница партии, правка статьи). */
  src: string;
}

export interface LibFile {
  /** Короткое имя набора: lichess, wikimedia, pd. */
  set: string;
  license: string;
  licenseUrl?: string;
  source: string;
  sourceUrl: string;
  attribution: string;
  games: LibGame[];
}

export type LibFileMeta = Omit<LibFile, "games"> & {
  /** Адрес файла набора: в нём у каждой партии — ссылка на источник (трансляцию, правку статьи, книгу). */
  url: string;
};

export const LIBRARY_FILES = [
  "/data/games/broadcasts.cc-by-sa-4.0.json",
  "/data/games/wikimedia.cc-by-sa-4.0.json",
  "/data/games/public-domain.json",
] as const;

export interface LoadedGame extends LibGame {
  set: string;
  /** Полуходов в партии. */
  plies: number;
  /** Строка для поиска: имена (и их русское и узбекское написание), турнир, город. */
  text: string;
  uz: boolean;
  championship: boolean;
}

/**
 * Узбекские шахматисты — как их имена пишутся в трансляциях FIDE: «Фамилия» (фамилия редкая, путаницы нет) или
 * «Фамилия, Имя». Список наш и короткий: игроки сборных Узбекистана на олимпиадах 2022–2026 и Рустам Касымджанов.
 * Добавить имя — одна строка. По этому же списку сборщик данных отбирает партии.
 */
export const UZ_PLAYERS = [
  "Abdusattorov",
  "Sindarov",
  "Yakubboev",
  "Vokhidov",
  "Kasimdzhanov",
  "Vakhidov, Jakhongir",
  "Suyarov, Mukhammadzokhid",
  "Abdisalimov, Abdimalik",
  "Nigmatov, Ortik",
  "Begmuratov, Khumoyun",
  "Saydaliev, Saidakbar",
  "Bakhrillaev, Bakhrom",
  "Abdurakhmonov, Mukhammadali",
  "Madaminov, Mukhiddin",
  "Rakhmatullaev, Almas",
  "Omonov, Asrorjon",
] as const;

/**
 * Как тренер может набрать фамилию: по-русски или по-узбекски. Обычная транслитерация (ниже) почти всё
 * находит сама; здесь — фамилии, которые пишутся иначе («Карлсен» — Carlsen, «Qosimjonov» — Kasimdzhanov).
 */
const ALIASES: Record<string, string[]> = {
  Carlsen: ["Карлсен", "Karlsen"],
  Kasimdzhanov: ["Касымджанов", "Qosimjonov", "Kasimjanov"],
  Yakubboev: ["Якуббоев", "Yoqubboyev", "Yoqubboev"],
  Vokhidov: ["Вохидов", "Vohidov"],
  Vakhidov: ["Вахидов", "Vohidov"],
  Fischer: ["Фишер", "Fisher"],
  Capablanca: ["Капабланка", "Kapablanka"],
  Morphy: ["Морфи", "Morfi"],
  Spassky: ["Спасский", "Spasskiy"],
  Korchnoi: ["Корчной", "Korchnoy"],
  Anderssen: ["Андерсен", "Andersen"],
  Kieseritzky: ["Кизерицкий"],
  Nepomniachtchi: ["Непомнящий", "Nepomnyashchiy"],
  Ding: ["Дин Лижэнь", "Дин", "Ding Liren"],
  Praggnanandhaa: ["Прагнанандха", "Pragg"],
  Firouzja: ["Фирузджа"],
  Caruana: ["Каруана"],
  "Wei, Yi": ["Вэй И"],
  Gukesh: ["Гукеш"],
  Botvinnik: ["Ботвинник"],
  Rubinstein: ["Рубинштейн"],
  Steinitz: ["Стейниц"],
  Alekhine: ["Алехин", "Alyoxin"],
  Topalov: ["Топалов"],
};

const CYR: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
  ў: "o",
  қ: "q",
  ғ: "g",
  ҳ: "h",
};

/** Для поиска: строчные буквы, кириллица — латиницей, без апострофов и знаков. «Синдаров» → «sindarov». */
export function searchKey(text: string): string {
  // Сначала кириллица (иначе разложение NFKD превратит «й» в «и», а «ё» в «е»), потом убираем ударения латиницы.
  return text
    .toLowerCase()
    .normalize("NFC")
    .replace(/[а-яёўқғҳ]/g, (ch) => CYR[ch] ?? ch)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ʻʼ'’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Названия знаменитых партий по-русски и по-узбекски (наши подписи; в источнике — по-английски). */
export const TITLES: Record<string, { ru: string; uz: string }> = {
  "Immortal Game": { ru: "Бессмертная партия", uz: "Oʻlmas partiya" },
  "Evergreen Game": { ru: "Вечнозелёная партия", uz: "Doimo yashil partiya" },
  "Opera Game": { ru: "Партия в опере", uz: "Operadagi partiya" },
  "The Game of the Century": { ru: "Партия века", uz: "Asr partiyasi" },
  "Immortal Draw": { ru: "Бессмертная ничья", uz: "Oʻlmas durang" },
  "Immortal Zugzwang Game": { ru: "Бессмертная партия на цугцванг", uz: "Sugsvang boʻyicha oʻlmas partiya" },
  "Immortal Losing Game": { ru: "Бессмертная проигранная партия", uz: "Yutqazilgan oʻlmas partiya" },
  "Kasparov's Immortal": { ru: "Бессмертная партия Каспарова", uz: "Kasparovning oʻlmas partiyasi" },
  "Kasparov versus the World": { ru: "Каспаров против всего мира", uz: "Kasparov butun dunyoga qarshi" },
};

/** Как тренер может назвать турнир по-русски или по-узбекски. */
const EVENT_ALIASES: [RegExp, string][] = [
  [/Olympiad/, "Олимпиада Olimpiada"],
  [/World Cup/, "Кубок мира Jahon kubogi"],
  [/Candidates/, "Турнир претендентов Nomzodlar turniri"],
  [/World (Chess )?Championship/, "Чемпионат мира Матч на первенство мира Jahon chempionati"],
  [/Rapid/, "Рапид Быстрые шахматы Tezkor shaxmat"],
  [/Grand Swiss/, "Гран-swiss Гранд-свисс"],
  [/Samarkand/, "Samarqand"],
];

const surname = (name: string) => name.split(",")[0].trim();

export const isUzbek = (name: string) =>
  UZ_PLAYERS.some((p) => (p.includes(",") ? name.startsWith(p) : surname(name) === p));

const CHAMPIONSHIP = /world (chess )?championship|world champion/i;

export function prepare(file: LibFile): LoadedGame[] {
  return file.games.map((g) => {
    const names = [g.w, g.b].flatMap((n) => {
      const s = surname(n);
      const extra = Object.entries(ALIASES).find(([k]) => s.startsWith(k) || n.includes(k))?.[1] ?? [];
      return [n, ...extra];
    });
    const title = g.t ? [g.t, TITLES[g.t]?.ru ?? "", TITLES[g.t]?.uz ?? ""] : [];
    const events = EVENT_ALIASES.filter(([re]) => re.test(`${g.ev} ${g.si ?? ""}`)).map(([, words]) => words);
    return {
      ...g,
      set: file.set,
      plies: g.m ? g.m.split(" ").length : 0,
      text: searchKey([...names, ...title, g.ev, g.si ?? "", ...events].join(" ")),
      uz: isUzbek(g.w) || isUzbek(g.b),
      championship: CHAMPIONSHIP.test(g.ev) && !/women|junior|youth|rapid|blitz|antichess/i.test(g.ev),
    };
  });
}

export type Section = "all" | "uz" | "championship" | "famous" | "classic" | "modern" | "endgame" | "short";

export interface GameQuery {
  text: string;
  section: Section;
  /** Годы «от» и «до» включительно (0 — без границы). */
  from: number;
  to: number;
  result: "any" | GameResult;
  tc: "any" | TimeControl;
  /** Семейство дебюта, группа дебютов («g:qg») или «any». */
  op: string;
}

/**
 * Дебюты, которые проходят в школе, — кнопками; группа объединяет семейства одного дебюта (принятый и отказанный
 * ферзевый гамбит — оба «Ферзевый гамбит»). name — ключ названия в OPENING_NAMES.
 */
export const OPENING_GROUPS: { key: string; name: string; families: string[] }[] = [
  { key: "g:italian", name: "Italian Game", families: ["Italian Game"] },
  { key: "g:sicilian", name: "Sicilian Defense", families: ["Sicilian Defense"] },
  { key: "g:ruy", name: "Ruy Lopez", families: ["Ruy Lopez"] },
  { key: "g:french", name: "French Defense", families: ["French Defense"] },
  { key: "g:carokann", name: "Caro-Kann Defense", families: ["Caro-Kann Defense"] },
  {
    key: "g:qg",
    name: "Queen's Gambit",
    families: ["Queen's Gambit", "Queen's Gambit Declined", "Queen's Gambit Accepted"],
  },
  { key: "g:kid", name: "King's Indian Defense", families: ["King's Indian Defense"] },
];

const opMatches = (g: LibGame, op: string) =>
  op === "any" ||
  (op.startsWith("g:") ? !!OPENING_GROUPS.find((x) => x.key === op)?.families.includes(g.op ?? "") : g.op === op);

/** Короткая победа — решённая партия не длиннее 30 ходов: такие партии ребёнку проще всего разобрать. */
export const SHORT_PLIES = 60;

export const EMPTY_QUERY: GameQuery = { text: "", section: "all", from: 0, to: 0, result: "any", tc: "any", op: "any" };

/**
 * Разделы. Классика — до 1950 года; последние годы — с 2020 (трансляции); знаменитые — партии со своим названием
 * и знаменитые партии из статей и книги (не матчи за звание); эндшпиль — партия дошла до эндшпиля и в нём ещё
 * было что играть; короткие победы — решённые партии не длиннее 30 ходов.
 */
export function inSection(g: LoadedGame, s: Section): boolean {
  switch (s) {
    case "all":
      return true;
    case "uz":
      return g.uz;
    case "championship":
      return g.championship;
    case "famous":
      return !!g.t || g.set === "pd" || (g.set === "wikimedia" && !g.championship);
    case "classic":
      return g.y < 1950;
    case "modern":
      return g.y >= 2020;
    case "endgame":
      return g.en !== undefined;
    case "short":
      return g.res !== "1/2-1/2" && g.plies <= SHORT_PLIES;
  }
}

/** Отбор по запросу. Каждое слово запроса должно найтись (в любом порядке): «sindarov 2025». */
export function filterGames(games: readonly LoadedGame[], q: GameQuery): LoadedGame[] {
  const words = searchKey(q.text).split(" ").filter(Boolean);
  return games.filter((g) => {
    if (!inSection(g, q.section)) return false;
    if (q.from && g.y < q.from) return false;
    if (q.to && g.y > q.to) return false;
    if (q.result !== "any" && g.res !== q.result) return false;
    if (q.tc !== "any" && g.tc !== q.tc) return false;
    if (!opMatches(g, q.op)) return false;
    return words.every((w) => (/^\d{4}$/.test(w) ? String(g.y) === w : g.text.includes(w)));
  });
}

/** Новые сверху, внутри года — по дате и турниру. */
export function sortGames(games: LoadedGame[]): LoadedGame[] {
  return games.sort((a, b) => b.y - a.y || (b.d ?? "").localeCompare(a.d ?? "") || a.ev.localeCompare(b.ev));
}

export interface Library {
  games: LoadedGame[];
  files: LibFileMeta[];
  /** Наборы (адреса файлов), которые не загрузились: показываем «Не все партии загрузились» и «Ещё раз». */
  missing: string[];
}

let loading: Promise<Library> | null = null;

/**
 * Загрузить все наборы (один раз за страницу). Набор, который не загрузился, пропускается, а следующее открытие
 * базы попробует снова — сеть в школе бывает с перебоями.
 */
export function loadLibrary(fetcher: typeof fetch = fetch) {
  loading ??= Promise.all(
    LIBRARY_FILES.map((url) =>
      fetcher(url)
        .then((r) => (r.ok ? (r.json() as Promise<LibFile>) : null))
        .catch(() => null),
    ),
  ).then((files) => {
    const loaded = files.flatMap((f, i) => (f && Array.isArray(f.games) ? [{ f, url: LIBRARY_FILES[i] }] : []));
    const ok = loaded.map((x) => x.f);
    const missing = LIBRARY_FILES.filter((url) => !loaded.some((x) => x.url === url));
    if (missing.length) loading = null;
    if (!ok.length) throw new Error("library unavailable");
    return {
      missing,
      games: sortGames(ok.flatMap(prepare)),
      files: loaded.map(({ f, url }) => ({
        url,
        set: f.set,
        license: f.license,
        licenseUrl: f.licenseUrl,
        source: f.source,
        sourceUrl: f.sourceUrl,
        attribution: f.attribution,
      })),
    };
  });
  return loading;
}

/** Быстрый выбор игрока одним нажатием (на панели печатать долго): что ищем и как подписать кнопку. */
export const PLAYER_CHIPS: { q: string; ru: string; uz: string }[] = [
  { q: "Sindarov", ru: "Синдаров", uz: "Sindarov" },
  { q: "Abdusattorov", ru: "Абдусатторов", uz: "Abdusattorov" },
  { q: "Yakubboev", ru: "Якуббоев", uz: "Yoqubboyev" },
  { q: "Kasimdzhanov", ru: "Касымджанов", uz: "Qosimjonov" },
  { q: "Carlsen", ru: "Карлсен", uz: "Karlsen" },
  { q: "Kasparov", ru: "Каспаров", uz: "Kasparov" },
  { q: "Karpov", ru: "Карпов", uz: "Karpov" },
  { q: "Fischer", ru: "Фишер", uz: "Fisher" },
  { q: "Capablanca", ru: "Капабланка", uz: "Kapablanka" },
  { q: "Gukesh", ru: "Гукеш", uz: "Gukesh" },
];

export const resultText = (r: GameResult) => (r === "1-0" ? "1–0" : r === "0-1" ? "0–1" : "½–½");

/** Матч (за звание чемпиона мира): номер тура — это номер партии матча. */
const isMatch = (g: LibGame) => /World (Chess )?Championship/.test(g.ev) && !/Rapid|Blitz/.test(g.ev);

/** Тур или партия матча — подписью на языке страницы. «tiebreak 1, rapid 2» — как в источнике, по-английски. */
export function roundText(g: LibGame, t: (ru: string, uz: string) => string): string | null {
  if (!g.rd) return null;
  const n = /^(?:game )?(\d+)$/.exec(g.rd)?.[1];
  if (!n) return /^tie/.test(g.rd) ? t("тай-брейк", "tay-breyk") : null;
  return isMatch(g) || g.rd.startsWith("game") ? t(`партия ${n}`, `${n}-partiya`) : t(`тур ${n}`, `${n}-tur`);
}

/** Турнир и год одной строкой: год не повторяем, если он уже есть в названии турнира. */
export const eventText = (g: LibGame) => (/\b\d{4}\b/.test(g.ev) ? g.ev : `${g.ev}, ${g.y}`);

/**
 * Задание на доске урока: кто с кем, где и когда (до 140 знаков, как у задания). Результата нет: класс видит
 * задание с первого хода, а чем кончится партия, ученики узнают по ходу разбора.
 */
export function gameTask(g: LoadedGame, t: (ru: string, uz: string) => string): string {
  const title = g.t ? (TITLES[g.t] ? t(TITLES[g.t].ru, TITLES[g.t].uz) : g.t) : null;
  const round = roundText(g, t);
  const parts = [title, `${g.w} – ${g.b}`, eventText(g), round].filter(Boolean);
  return parts.join(" · ").slice(0, 140);
}

/** Дебюты, которые есть в базе: от частого к редкому (для списка «Дебют»). */
export function openingFamilies(games: readonly LoadedGame[]): [family: string, count: number][] {
  const counts = new Map<string, number>();
  for (const g of games) if (g.op) counts.set(g.op, (counts.get(g.op) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/**
 * Партия в PGN — для «Скачать PGN». Ходы — в записи SAN (их читает любая шахматная программа), в заголовке —
 * источник и лицензия: партия из файла CC BY-SA остаётся под CC BY-SA и в скачанном файле.
 */
export function libraryPgn(g: LibGame, file?: Pick<LibFileMeta, "license" | "licenseUrl">): string {
  const chess = g.fen ? new Chess(g.fen) : new Chess();
  for (const u of g.m.split(" ")) chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] ?? "q" });
  const tags: [string, string | number | undefined][] = [
    ["Event", g.ev],
    ["Site", g.si ?? "?"],
    ["Date", g.d ?? `${g.y}.??.??`],
    ["Round", g.rd ?? "?"],
    ["White", g.w],
    ["Black", g.b],
    ["Result", g.res],
    ["WhiteElo", g.we],
    ["BlackElo", g.be],
    ["ECO", g.eco],
    ["Source", g.src],
    ["License", file ? [file.license, file.licenseUrl].filter(Boolean).join(" ") : undefined],
  ];
  if (g.fen) tags.push(["SetUp", "1"], ["FEN", g.fen]);
  for (const [k, v] of tags) if (v !== undefined && v !== "") chess.setHeader(k, String(v));
  const pgn = chess.pgn();
  return /(1-0|0-1|1\/2-1\/2|\*)\s*$/.test(pgn) ? pgn : `${pgn} ${g.res}`;
}

/** Только для тестов. */
export function resetLibraryForTest() {
  loading = null;
}
