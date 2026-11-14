/**
 * Партии для доски тренера (MENTOR-3): собирает public/data/games/*.json из открытых источников.
 *
 * Источники (точные адреса, правки и контрольные суммы — в scripts/games/sources.json):
 *  - трансляции Lichess (lichess.org/broadcast) — CC BY-SA 4.0. Берём партии узбекских шахматистов и Карлсена,
 *    матчи за звание чемпиона мира 2021–2024, решающие партии турниров претендентов и супертурниров, поздние стадии
 *    Кубка мира 2025;
 *  - Википедия и Викисклад — CC BY-SA 4.0: знаменитые партии и матчи за звание чемпиона мира (набор Kingfisher,
 *    github.com/mardakurt/kingfisher, и статьи Википедии по закреплённым правкам);
 *  - Х. Р. Капабланка, «Chess Fundamentals» (1921) — общественное достояние: 14 партий книги (только ходы).
 *
 * Из источника берутся только сведения о партии: игроки, рейтинги, турнир, город, дата, тур, результат и ходы.
 * Оценки движка, время на часах, комментарии и пометки источника не переносятся. Каждый ход проверяется chess.js
 * и записывается в UCI. Дебют (семейство) считается по нашей книге дебютов (открытый список Lichess, CC0).
 * Наборы с разными лицензиями пишутся в разные файлы, рядом — ATTRIBUTION.md.
 *
 * Запуск (Node 22.18+: модули .ts из src читаются напрямую):
 *   node scripts/games/build-games.mjs --fetch      # скачать недостающие исходники в .cache/games (по одному запросу)
 *   node scripts/games/build-games.mjs              # собрать public/data/games из .cache/games
 *   node scripts/games/build-games.mjs --wiki-list  # показать партии в закреплённых статьях (для sources.json)
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { Chess } from "chess.js";
import { makeOpeningBook } from "../../src/lib/openingBook.ts";
import { OPENING_NAMES } from "../../src/content/chess/openingNames.ts";
import { isUzbek } from "../../src/lib/games/library.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const CACHE = path.join(ROOT, ".cache/games");
const OUT_DIR = path.join(ROOT, "public/data/games");
const SOURCES = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "sources.json"), "utf8"));
const UA = "DataBuildScript/1.0 (offline, low-volume)";
const args = new Set(process.argv.slice(2));

const sha256 = (text) => createHash("sha256").update(text).digest("hex");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ───────────────────────── скачивание ───────────────────────── */

/** curl, а не fetch: так скачивание идёт через системный прокси и с теми же настройками, что и в терминале. */
function download(url, file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  execFileSync("curl", ["-sSfL", "--max-time", "180", "-A", UA, "-o", file, url], { stdio: "inherit" });
  return fs.readFileSync(file, "utf8");
}

/** Lichess просит не больше одного запроса за раз: всё по очереди, с паузой. На отказ — потуровая загрузка. */
async function fetchBroadcast(id) {
  const file = path.join(CACHE, "lichess", `${id}.pgn`);
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8").startsWith("[Event ")) return;
  const text = download(`https://lichess.org/api/broadcast/${id}.pgn`, file);
  await sleep(2000);
  if (text.startsWith("[Event ")) return;
  const tour = JSON.parse(download(`https://lichess.org/api/broadcast/${id}`, `${file}.json`));
  fs.rmSync(`${file}.json`);
  const parts = [];
  for (const round of tour.rounds ?? []) {
    await sleep(2000);
    parts.push(download(`https://lichess.org/api/broadcast/round/${round.id}.pgn`, `${file}.part`));
  }
  fs.rmSync(`${file}.part`, { force: true });
  fs.writeFileSync(file, parts.join("\n\n"));
}

async function fetchAll() {
  for (const tour of SOURCES.broadcasts) {
    console.log("lichess", tour.id, tour.event);
    await fetchBroadcast(tour.id);
  }
  for (const [name, digest] of Object.entries(SOURCES.kingfisher.files)) {
    const file = path.join(CACHE, "kingfisher", name);
    if (fs.existsSync(file) && sha256(fs.readFileSync(file)) === digest) continue;
    console.log("kingfisher", name);
    download(SOURCES.kingfisher.base + name, file);
  }
  for (const [name, digest] of Object.entries(SOURCES.openings.files)) {
    const file = path.join(CACHE, "openings", name);
    if (fs.existsSync(file) && sha256(fs.readFileSync(file)) === digest) continue;
    console.log("openings", name);
    download(SOURCES.openings.base + name, file);
  }
  for (const article of SOURCES.wiki) {
    const file = path.join(CACHE, "wiki", `${article.oldid}.wiki`);
    if (fs.existsSync(file)) continue;
    console.log("wiki", article.title, article.oldid);
    download(`https://en.wikipedia.org/w/index.php?oldid=${article.oldid}&action=raw`, file);
    await sleep(8000);
  }
}

/* ───────────────────────── разбор PGN ───────────────────────── */

const RESULTS = { "1-0": "1-0", "0-1": "0-1", "1/2-1/2": "1/2-1/2", "½-½": "1/2-1/2" };
const normResult = (text) => RESULTS[String(text).replace(/[–—]/g, "-").replace(/\s/g, "")] ?? null;

function splitPgn(text) {
  const games = [];
  for (const chunk of text.replace(/\r/g, "").split(/\n\s*\n(?=\[)/)) {
    const tags = {};
    for (const m of chunk.matchAll(/^\[(\w+)\s+"((?:[^"\\]|\\.)*)"\]\s*$/gm)) {
      tags[m[1]] = m[2].replace(/\\(["\\])/g, "$1");
    }
    if (!tags.White) continue;
    const movetext = chunk.replace(/^\[.*\]\s*$/gm, "").trim();
    games.push({ tags, movetext });
  }
  return games;
}

/** Ходы из текста партии: без комментариев, вариантов, номеров, пометок и результата. */
function sanTokens(movetext) {
  let s = movetext.replace(/\{[^}]*\}/g, " ").replace(/;[^\n]*/g, " ");
  for (let prev = ""; prev !== s;) {
    prev = s;
    s = s.replace(/\([^()]*\)/g, " ");
  }
  s = s.replace(/\$\d+/g, " ");
  const out = [];
  for (let token of s.split(/\s+/)) {
    token = token.replace(/^\d+\.+/, "").replace(/[!?]+$/, "");
    if (!token || normResult(token) || token === "*") continue;
    token = token.replace(/^0-0-0/, "O-O-O").replace(/^0-0/, "O-O");
    out.push(token);
  }
  return out;
}

/** Сила фигур в пешках — для границы эндшпиля. */
const VALUE = { n: 3, b: 3, r: 5, q: 9 };

/** Эндшпиль: у каждой стороны фигур (без пешек и короля) не больше чем на ладью с лёгкой фигурой — 8 очков. */
function isEndgame(chess) {
  const material = { w: 0, b: 0 };
  for (const row of chess.board()) for (const p of row) if (p && VALUE[p.type]) material[p.color] += VALUE[p.type];
  return material.w <= 8 && material.b <= 8;
}

/** Проиграть ходы. Незаконный ход — ошибка источника: партия не берётся. */
function replay(sans, fen) {
  const chess = fen ? new Chess(fen) : new Chess();
  const uci = [];
  const san = [];
  let endgame;
  for (const token of sans) {
    let move;
    try {
      move = chess.move(token);
    } catch {
      return { error: `ход ${uci.length + 1}: ${token}` };
    }
    uci.push(move.from + move.to + (move.promotion ?? ""));
    san.push(move.san);
    if (endgame === undefined && isEndgame(chess)) endgame = uci.length;
  }
  return { uci, san, mate: chess.isCheckmate(), endgame };
}

/* ───────────────────────── имена ───────────────────────── */

const cleanName = (raw) =>
  raw
    .replace(/\s*\([A-Z]{3}\)\s*$/, "")
    .replace(/^(.+,\s*.+?)\s+[A-Z]{3}$/, "$1")
    .replace(/\s+/g, " ")
    .replace(/^([^,]+)\.$/, "$1")
    .trim();
const looseKey = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");

/**
 * Одно написание имени на игрока. В трансляциях одно и то же имя бывает записано по-разному («Gukesh D»,
 * «Gukesh D.», «Gukesh, D»): берём самое частое написание для номера FIDE, остальные сводим к нему.
 */
function makeNames(allGames) {
  const byFide = new Map();
  for (const { tags } of allGames) {
    for (const side of ["White", "Black"]) {
      const id = tags[`${side}FideId`];
      if (!id || id === "0") continue;
      const counts = byFide.get(id) ?? new Map();
      const name = cleanName(tags[side]);
      counts.set(name, (counts.get(name) ?? 0) + 1);
      byFide.set(id, counts);
    }
  }
  const canonById = new Map();
  const canonByLoose = new Map();
  for (const [id, counts] of byFide) {
    const best = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
    canonById.set(id, best);
    for (const name of counts.keys()) canonByLoose.set(looseKey(name), best);
  }
  // Игроки без номера FIDE: написание с запятой («Dreev, Aleksey») важнее написания без неё («Dreev Aleksey»).
  for (const { tags } of allGames) {
    for (const side of ["White", "Black"]) {
      const name = cleanName(tags[side]);
      if (name.includes(",") && !canonByLoose.has(looseKey(name))) canonByLoose.set(looseKey(name), name);
    }
  }
  /**
   * kind: "broadcast" — имя из трансляции, там порядок «Фамилия Имя» («Smirnov Anton» → «Smirnov, Anton»);
   * "book" — из статьи или книги, там «Имя Фамилия» («Anatoly Karpov» → «Karpov, Anatoly»).
   */
  return (raw, fideId, kind = "book") => {
    if (fideId && canonById.has(fideId)) return canonById.get(fideId);
    const name = cleanName(raw);
    if (SOURCES.names[name]) return SOURCES.names[name];
    const known = canonByLoose.get(looseKey(name));
    if (known) return known;
    if (name.includes(",") || !name.includes(" ")) return name;
    const words = name.split(" ");
    if (kind === "broadcast") return words.length === 2 ? `${words[0]}, ${words[1]}` : name;
    return `${words.at(-1)}, ${words.slice(0, -1).join(" ")}`;
  };
}

/* ───────────────────────── общее ───────────────────────── */

/**
 * Код ECO — по полному открытому списку дебютов Lichess (lichess-org/chess-openings, CC0): самая длинная строка
 * списка, с которой совпадают первые ходы партии. Файлы закреплены контрольными суммами (sources.json → openings).
 */
const ECO_LINES = (() => {
  const lines = new Map();
  for (const [name, digest] of Object.entries(SOURCES.openings.files)) {
    const file = path.join(CACHE, "openings", name);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    if (sha256(text) !== digest) throw new Error(`${name}: контрольная сумма не совпала — список дебютов изменился`);
    for (const row of text.split("\n").slice(1)) {
      const [eco, , pgn] = row.split("\t");
      if (!eco || !pgn) continue;
      lines.set(
        sanTokens(pgn)
          .map((t) => t.replace(/[+#]/g, ""))
          .join(" "),
        eco,
      );
    }
  }
  return lines;
})();
const ECO_LONGEST = Math.max(0, ...[...ECO_LINES.keys()].map((k) => k.split(" ").length));

function ecoOf(sans) {
  const moves = sans.slice(0, ECO_LONGEST).map((s) => s.replace(/[+#]/g, ""));
  for (let k = moves.length; k > 0; k--) {
    const eco = ECO_LINES.get(moves.slice(0, k).join(" "));
    if (eco) return eco;
  }
  return undefined;
}

const book = makeOpeningBook(
  JSON.parse(fs.readFileSync(path.join(ROOT, "src/content/chess/opening-book.json"), "utf8")),
  OPENING_NAMES,
);
const elo = (v) => (/^\d{3,4}$/.test(v ?? "") && +v > 0 ? +v : undefined);
const fullDate = (v) => (/^\d{4}\.\d{2}\.\d{2}$/.test(v ?? "") ? v : undefined);
const yearOf = (...dates) => {
  for (const d of dates) if (/^\d{4}/.test(d ?? "")) return +d.slice(0, 4);
  return undefined;
};

/** Партия для файла: только наши короткие поля, без пустых значений. */
function entry(g) {
  const out = {};
  for (const key of [
    "id",
    "w",
    "b",
    "we",
    "be",
    "ev",
    "si",
    "y",
    "d",
    "rd",
    "res",
    "tc",
    "t",
    "fen",
    "m",
    "op",
    "eco",
    "en",
    "src",
  ]) {
    if (g[key] !== undefined && g[key] !== "") out[key] = g[key];
  }
  return out;
}

function finish(game, sans) {
  const played = replay(sans, game.fen);
  if (played.error) return { error: played.error };
  if (played.uci.length < 10) return { error: "меньше десяти полуходов" };
  const opening = game.fen ? null : book.find(played.san);
  // Эндшпиль, в котором ещё есть что показать (хотя бы 8 полуходов), — с этого полухода кнопка «К эндшпилю».
  const en = played.endgame !== undefined && played.uci.length - played.endgame >= 8 ? played.endgame : undefined;
  return {
    ...game,
    m: played.uci.join(" "),
    op: opening?.family,
    eco: game.fen ? undefined : ecoOf(played.san),
    en,
    plies: played.uci.length,
    mate: played.mate,
  };
}

const surnameKey = (name) => name.split(/[,\s]/)[0].toLowerCase();
/** Одна и та же партия из двух источников: те же игроки, год, результат и первые 40 полуходов. */
const dupKey = (g) => [surnameKey(g.w), surnameKey(g.b), g.y, g.res, g.m.split(" ").slice(0, 40).join(" ")].join("|");

/* ───────────────────────── трансляции Lichess ───────────────────────── */

const FOCUS = (name) => isUzbek(name) || /^Carlsen\b/.test(name);

/** Первые показания часов белых и чёрных в секундах (из [%clk h:mm:ss]), если они есть. */
function firstClocks(movetext) {
  return [...movetext.matchAll(/\[%clk (\d+):(\d\d):(\d\d)\]/g)]
    .slice(0, 2)
    .map((m) => +m[1] * 3600 + +m[2] * 60 + +m[3]);
}

/**
 * Контроль времени. null — партия не берётся (армагеддон, «внезапная смерть», неизвестный тай-брейк).
 * Если по туру выходит классика, а часы с первых ходов показывают меньше часа, — это не классика: у армагеддона
 * у белых и чёрных разное время (Norway Chess 2024 выкладывал армагеддоны в том же туре, что и классику).
 */
function timeControl(tags, slug, kind, movetext = "") {
  const tc = timeControlOf(tags, slug, kind);
  if (tc !== "c") return tc;
  const clocks = firstClocks(movetext);
  if (clocks.length < 2 || Math.max(...clocks) >= 3600) return tc;
  if (Math.abs(clocks[0] - clocks[1]) > 60) return null;
  return Math.max(...clocks) <= 600 ? "b" : "r";
}

function timeControlOf(tags, slug, kind) {
  if (/armageddon|sudden-death/.test(slug)) return null;
  if (/blitz/.test(slug)) return "b";
  if (/rapid/.test(slug) || kind === "rapid") return "r";
  const m = /^(\d+)\+(\d+)$/.exec(tags.TimeControl ?? "");
  if (m) {
    const total = +m[1] + 60 * +m[2];
    return total <= 600 ? "b" : total < 3600 ? "r" : "c";
  }
  if (/tie-?break/.test(slug)) return null;
  return "c";
}

/** Номер тура из адреса тура трансляции: «round-3» → «3», «game-2» → «game 2», «tiebreak-1-rapid-1» → «tiebreak 1, rapid 1». */
function roundLabel(slug) {
  const round = /^round-(\d+)$/.exec(slug);
  if (round) return round[1];
  return slug
    .replace(/-(\d+)/g, " $1")
    .replace(/ (\d+) (rapid|blitz)/, " $1, $2")
    .replace(/-/g, " ");
}

function keepBroadcast(kind, g, tc) {
  const focus = FOCUS(g.w) || FOCUS(g.b);
  const decisive = g.res !== "1/2-1/2";
  switch (kind) {
    case "wcc":
      return true;
    case "candidates":
    case "elite":
      return focus || (decisive && tc === "c");
    case "worldcup-late":
      return focus || tc === "c";
    default:
      return focus;
  }
}

function buildBroadcasts(nameOf, report) {
  const games = [];
  for (const tour of SOURCES.broadcasts) {
    const file = path.join(CACHE, "lichess", `${tour.id}.pgn`);
    const parsed = splitPgn(fs.readFileSync(file, "utf8"));
    let kept = 0;
    for (const { tags, movetext } of parsed) {
      if ((tags.Variant ?? "Standard") !== "Standard" || tags.FEN) continue;
      const res = normResult(tags.Result);
      if (!res) continue;
      const url = tags.GameURL ?? "";
      const slug = /broadcast\/[^/]+\/([^/]+)\//.exec(tags.BroadcastURL ?? url)?.[1] ?? "";
      const tc = timeControl(tags, slug, tour.kind, movetext);
      if (!tc) continue;
      const stage = tour.stage ? (tags.BroadcastName ?? "").split("|").at(-1).trim() : "";
      const g = {
        id: `lb-${url.split("/").at(-1)}`,
        w: nameOf(tags.White, tags.WhiteFideId, "broadcast"),
        b: nameOf(tags.Black, tags.BlackFideId, "broadcast"),
        we: elo(tags.WhiteElo),
        be: elo(tags.BlackElo),
        ev: stage ? `${tour.event} · ${stage}` : tour.event,
        si: tour.site,
        // Число месяца не берём: в трансляциях это часто дата заведения тура, а не партии (у Tata Steel 2026 все
        // 13 туров — 15 и 17 января, у финала Кубка мира 2025 — дата раньше полуфинала). Год надёжен.
        y: yearOf(tags.UTCDate, tags.Date) ?? tour.year,
        rd: roundLabel(slug),
        res,
        tc,
        src: url,
      };
      if (!keepBroadcast(tour.kind, g, tc)) continue;
      const done = finish(g, sanTokens(movetext));
      if (done.error) {
        report.skipped.push(`${tour.id} ${g.w} – ${g.b}: ${done.error}`);
        continue;
      }
      games.push(done);
      kept++;
    }
    report.tours.push(`${tour.event}${tour.stage ? " (stage)" : ""} [${tour.id}]: ${kept} из ${parsed.length}`);
  }
  return games;
}

/* ───────────────────────── Википедия ───────────────────────── */

const BLOCK = /\{\{\s*block indent\s*\|/iy;

/** Шаблоны {{block indent|1=…}} статьи с ходами партий и ближайший заголовок перед каждым. */
function wikiBlocks(text) {
  const blocks = [];
  let heading = "";
  let i = 0;
  while (i < text.length) {
    const lineStart = i === 0 || text[i - 1] === "\n";
    if (lineStart) {
      const line = text.slice(i, text.indexOf("\n", i) === -1 ? text.length : text.indexOf("\n", i));
      const h = /^=+\s*(.*?)\s*=+\s*$/.exec(line);
      if (h) heading = h[1];
    }
    BLOCK.lastIndex = i;
    if (BLOCK.test(text)) {
      let depth = 0;
      let j = i;
      for (; j < text.length; j++) {
        if (text.startsWith("{{", j)) {
          depth++;
          j++;
        } else if (text.startsWith("}}", j)) {
          depth--;
          j++;
          if (depth === 0) break;
        }
      }
      const body = text.slice(i, j + 1);
      const bold = cleanWiki(body);
      if (/^1\.\s*\S/.test(bold)) blocks.push({ heading, text: bold });
      i = j + 1;
      continue;
    }
    i++;
  }
  return blocks;
}

function cleanWiki(body) {
  let s = body.slice(2, -2).replace(/^\s*block indent\s*\|\s*(?:1\s*=)?/i, "");
  s = s.replace(/<ref[^>]*\/>/g, "").replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "");
  s = s.replace(/\{\{(?:nowrap|chessAN)\|([^{}]*)\}\}/gi, "$1").replace(/\{\{chesspunc\|[^{}]*\}\}/gi, "");
  s = s.replace(/\{\{[^{}]*\}\}/g, " ");
  const after = s
    .split(/<br\s*\/?>/i)
    .slice(1)
    .join(" ");
  const parts = [...(after || s).matchAll(/'''([\s\S]*?)'''/g)].map((m) => m[1]);
  return parts
    .join(" ")
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/\(diagram\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Убрать шаблоны вместе с вложенными (диаграммы, ссылки на источники). */
function stripTemplates(text) {
  let out = "";
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    if (text.startsWith("{{", i)) {
      depth++;
      i++;
    } else if (depth && text.startsWith("}}", i)) {
      depth--;
      i++;
    } else if (!depth) out += text[i];
  }
  return out;
}

/**
 * Партия, разобранная в тексте раздела: ходы идут жирными кусками между абзацами (сначала первые ходы, потом
 * «12.O-O O-O» и так далее). Берём раздел от заголовка до следующего заголовка и склеиваем жирные куски с ходами.
 */
function wikiSection(text, heading) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => /^=+/.test(l) && l.replace(/=/g, "").trim().startsWith(heading));
  if (start < 0) return null;
  const end = lines.findIndex((l, n) => n > start && /^=+/.test(l));
  const body = stripTemplates(lines.slice(start + 1, end < 0 ? undefined : end).join("\n"))
    .replace(/<ref[^>]*\/>/g, "")
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "");
  const parts = [...body.matchAll(/'''([\s\S]*?)'''/g)].map((m) => m[1].trim()).filter((p) => /^\d+\.+\s*\S/.test(p));
  return parts.join(" ");
}

function wikiResult(text) {
  const last = text.trim().split(/\s+/).at(-1);
  return normResult(last);
}

function listWiki() {
  for (const article of SOURCES.wiki) {
    const file = path.join(CACHE, "wiki", `${article.oldid}.wiki`);
    if (!fs.existsSync(file)) {
      console.log(`нет ${file}`);
      continue;
    }
    console.log(`\n== ${article.title} (${article.oldid})`);
    wikiBlocks(fs.readFileSync(file, "utf8")).forEach((b, n) => {
      const played = replay(sanTokens(b.text));
      const state = played.error ? `ОШИБКА ${played.error}` : `${played.uci.length} полуходов`;
      console.log(`#${n} [${b.heading}] ${wikiResult(b.text) ?? "?"} · ${state} · ${b.text.slice(0, 50)}`);
    });
  }
}

function buildWiki(nameOf, report) {
  const games = [];
  for (const article of SOURCES.wiki) {
    const file = path.join(CACHE, "wiki", `${article.oldid}.wiki`);
    const text = fs.readFileSync(file, "utf8");
    const blocks = wikiBlocks(text);
    const src = `https://en.wikipedia.org/w/index.php?title=${encodeURIComponent(article.title.replace(/ /g, "_"))}&oldid=${article.oldid}`;
    for (const meta of article.games) {
      // Партия — шаблон {{block indent}} по номеру или раздел статьи по заголовку (тогда результат — из sources.json).
      const moves = meta.section ? wikiSection(text, meta.section) : blocks[meta.block]?.text;
      const where = meta.section ?? `#${meta.block}`;
      if (!moves) throw new Error(`${article.title}: нет партии ${where}`);
      const res = meta.section ? meta.res : wikiResult(moves);
      if (res !== meta.res) throw new Error(`${article.title} ${where}: результат ${res}, ожидали ${meta.res}`);
      const g = {
        id: `wp-${article.oldid}-${meta.section ? meta.section.toLowerCase().replace(/[^a-z0-9]+/g, "-") : meta.block}`,
        w: nameOf(meta.w),
        b: nameOf(meta.b),
        ev: meta.ev ?? article.event,
        si: meta.si ?? article.site,
        y: meta.y ?? article.year,
        d: meta.d,
        rd: meta.rd,
        res,
        tc: meta.tc ?? "c",
        src,
      };
      const done = finish(g, sanTokens(moves));
      if (done.error) throw new Error(`${article.title} ${where}: ${done.error}`);
      games.push(done);
    }
    report.tours.push(`${article.title} (${article.oldid}): ${article.games.length}`);
  }
  return games;
}

/* ───────────────────────── Kingfisher ───────────────────────── */

function readKingfisher(name) {
  const text = fs.readFileSync(path.join(CACHE, "kingfisher", name), "utf8");
  const digest = SOURCES.kingfisher.files[name];
  if (sha256(text) !== digest) throw new Error(`${name}: контрольная сумма не совпала — файл изменился`);
  return splitPgn(text);
}

/** Знаменитые партии и матчи (Викисклад, Википедия) — CC BY-SA 4.0. */
function buildFamous(nameOf, report) {
  const games = [];
  for (const { tags, movetext } of readKingfisher("famous-games-and-championship-classics.pgn")) {
    const label = /\(([^()]*)\)\s*$/.exec(tags.Event ?? "")?.[1] ?? "";
    const named = SOURCES.kingfisher.titles[label.replace(/,\s*\d{4}$/, "")];
    const res = normResult(tags.Result);
    const g = {
      id: `kf-${(tags.Title ?? tags.Event)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`,
      w: nameOf(tags.White),
      b: nameOf(tags.Black),
      // Пометки базы-источника в названии турнира («London m4 ;HCL 18») — убираем или заменяем понятным названием.
      ev: SOURCES.events[tags.OriginalEvent ?? tags.Event] ?? (tags.OriginalEvent ?? tags.Event).replace(/\s*;.*$/, ""),
      si: tags.Site && tags.Site !== "?" ? tags.Site : undefined,
      y: yearOf(tags.Date),
      d: fullDate(tags.Date),
      rd: tags.Round && tags.Round !== "?" && tags.Round !== "-" ? tags.Round : undefined,
      res,
      tc: /rapid/i.test(tags.Event ?? "") ? "r" : "c",
      t: named,
      src: tags.Source,
    };
    if (!res || !g.y) {
      report.skipped.push(`kingfisher ${g.id}: нет результата или года`);
      continue;
    }
    const done = finish(g, sanTokens(movetext));
    if (done.error) {
      report.skipped.push(`kingfisher ${g.w} – ${g.b}: ${done.error}`);
      continue;
    }
    // Источник обрывает запись (Aronian – Anand 2013: три полухода из 46) — такую партию не берём.
    const expected = +(tags.PlyCount ?? 0);
    if (expected && Math.abs(expected - done.plies) > 1) {
      report.skipped.push(`kingfisher ${g.w} – ${g.b}: ${done.plies} полуходов вместо ${expected}`);
      continue;
    }
    games.push(done);
  }
  report.tours.push(`Kingfisher, famous games: ${games.length}`);
  return games;
}

/** Капабланка, «Chess Fundamentals» (1921) — общественное достояние. Только ходы, без примечаний автора. */
function buildCapablanca(nameOf, report) {
  const games = readKingfisher("capablanca-chess-fundamentals-1921.pgn").map(({ tags, movetext }, n) => {
    const res = normResult(tags.Result);
    const g = {
      id: `cf-1921-${n + 1}`,
      w: nameOf(tags.White),
      b: nameOf(tags.Black),
      ev: tags.Event && tags.Event !== "?" ? tags.Event : "Chess Fundamentals",
      si: tags.Site && tags.Site !== "?" ? tags.Site : undefined,
      y: yearOf(tags.Date),
      res,
      tc: "c",
      src: `J. R. Capablanca, Chess Fundamentals (1921), game ${n + 1}`,
    };
    const done = finish(g, sanTokens(movetext));
    if (done.error || !res || !g.y)
      throw new Error(`Капабланка, партия ${n + 1}: ${done.error ?? "нет результата или года"}`);
    return done;
  });
  report.tours.push(`Capablanca 1921: ${games.length}`);
  return games;
}

/* ───────────────────────── запись ───────────────────────── */

function writeSet(file, meta, games) {
  const sorted = games
    .map(entry)
    .sort(
      (a, b) =>
        b.y - a.y || (b.d ?? "").localeCompare(a.d ?? "") || a.ev.localeCompare(b.ev) || a.id.localeCompare(b.id),
    );
  const head = JSON.stringify({ ...meta, count: sorted.length }).slice(0, -1);
  const body = sorted.map((g) => JSON.stringify(g)).join(",\n");
  fs.writeFileSync(path.join(OUT_DIR, file), `${head},"games":[\n${body}\n]}\n`);
  return sorted.length;
}

function attribution(counts) {
  const { files } = SOURCES;
  return `# Партии для доски тренера — источники и лицензии

Файлы в этой папке собирает \`scripts/games/build-games.mjs\` (список источников — \`scripts/games/sources.json\`).
Из источников взяты только сведения о партиях: игроки, рейтинги, турнир, город, дата, тур, результат и ходы.
Изменения: ходы проверены и переписаны в запись UCI; имена игроков приведены к одному написанию; оценки движка,
время на часах, комментарии и пометки источников удалены; добавлены посчитанные программой семейство дебюта и код
ECO (по открытому списку дебютов Lichess, CC0) и полуход, с которого партия перешла в эндшпиль. Наши подписи,
разделы и заметки в эти файлы не входят.

## ${files.broadcasts.file} — ${counts.broadcasts} партий

${files.broadcasts.attribution}
Лицензия: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Источник: ${files.broadcasts.sourceUrl}
У каждой партии в поле \`src\` — ссылка на неё в трансляции. Этот файл распространяется на тех же условиях
(CC BY-SA 4.0).

## ${files.wikimedia.file} — ${counts.wikimedia} партий

${files.wikimedia.attribution}
Лицензия: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Источник: ${files.wikimedia.sourceUrl}
У каждой партии в поле \`src\` — правка статьи или страницы файла, откуда взяты ходы. Этот файл распространяется
на тех же условиях (CC BY-SA 4.0).

## ${files.pd.file} — ${counts.pd} партий

${files.pd.attribution}
Общественное достояние: книга издана в 1921 году, автор умер в 1942 году. Ходы сверены с текстом книги
(Project Gutenberg, электронная книга №33870) по расшифровке ${SOURCES.kingfisher.repo} (MIT).
`;
}

async function main() {
  if (args.has("--fetch")) {
    await fetchAll();
    return;
  }
  if (args.has("--wiki-list")) {
    listWiki();
    return;
  }
  const report = { tours: [], skipped: [] };
  const allBroadcast = SOURCES.broadcasts.flatMap((t) =>
    splitPgn(fs.readFileSync(path.join(CACHE, "lichess", `${t.id}.pgn`), "utf8")),
  );
  const nameOf = makeNames(allBroadcast);

  const broadcasts = buildBroadcasts(nameOf, report);
  const wiki = [...buildWiki(nameOf, report), ...buildFamous(nameOf, report)];
  const pd = buildCapablanca(nameOf, report);

  // Одна партия — один раз: трансляция важнее статьи, статья важнее книги.
  const seen = new Map();
  const ids = new Set();
  const unique = (list, set) =>
    list.filter((g) => {
      const key = dupKey(g);
      if (seen.has(key)) {
        report.skipped.push(`повтор ${set}: ${g.w} – ${g.b} ${g.y} (уже есть ${seen.get(key)})`);
        return false;
      }
      if (ids.has(g.id)) throw new Error(`повтор id ${g.id}`);
      seen.set(key, g.id);
      ids.add(g.id);
      return true;
    });
  const sets = {
    broadcasts: unique(broadcasts, "broadcasts"),
    wikimedia: unique(wiki, "wikimedia"),
    pd: unique(pd, "pd"),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const counts = {};
  for (const [key, games] of Object.entries(sets)) {
    const { file, ...meta } = SOURCES.files[key];
    counts[key] = writeSet(file, meta, games);
  }
  fs.writeFileSync(path.join(OUT_DIR, "ATTRIBUTION.md"), attribution(counts));

  console.log(report.tours.join("\n"));
  console.log(`\nпропущено: ${report.skipped.length}`);
  for (const line of report.skipped.slice(0, 60)) console.log("  " + line);
  console.log("\nитого:", counts);
}

await main();
