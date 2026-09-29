/**
 * Банк задач из открытой базы Lichess (CC0: https://database.lichess.org/#puzzles).
 *
 * Отбирает задачи, которые подходят детям: рейтинг 400–1900, популярные (popularity ≥ 85,
 * решали ≥ 500 раз, рейтинг устоялся), решение не длиннее трёх своих ходов. Каждая задача
 * попадает в одну нашу тему (по порядку THEMES — от самой узнаваемой идеи к общей), внутри темы —
 * поровну по ступенькам сложности, лучшие по популярности. Каждая проверяется chess.js:
 * все ходы законны, задача на мат заканчивается матом.
 *
 * Пишет public/puzzles/<тема>.json, public/puzzles/mix.json (понемногу из каждой темы и ступеньки —
 * для «Шторма», «Серии» и «Дятла») и src/content/chess/puzzle-bank.json (оглавление).
 *
 * Запуск:
 *   curl -O https://database.lichess.org/lichess_db_puzzle.csv.zst
 *   node scripts/build-puzzles.mjs lichess_db_puzzle.csv.zst
 * Файл .zst читается встроенным zstd (Node 22.15+); можно передать и распакованный .csv.
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { Transform } from "node:stream";
import zlib from "node:zlib";
import { createHash } from "node:crypto";
import { Chess } from "chess.js";

const OUT_DIR = "public/puzzles";
const INDEX = "src/content/chess/puzzle-bank.json";

/** Наша тема ← метки Lichess. Порядок важен: задача уходит в первую подходящую тему. */
const THEMES = [
  ["smothered", ["smotheredMate"]],
  ["backrank", ["backRankMate"]],
  ["doublecheck", ["doubleCheck"]],
  ["discovered", ["discoveredCheck"]],
  ["promotion", ["promotion"]],
  ["mate1", ["mateIn1"]],
  ["mate2", ["mateIn2"]],
  ["mate3", ["mateIn3"]],
  ["fork", ["fork"]],
  ["skewer", ["skewer"]],
  ["pin", ["pin"]],
  ["trapped", ["trappedPiece"]],
  ["defender", ["capturingDefender"]],
  ["deflection", ["deflection"]],
  ["attraction", ["attraction"]],
  ["hanging", ["hangingPiece"]],
  ["defense", ["defensiveMove"]],
  ["pawnend", ["pawnEndgame"]],
];

/** Ступеньки сложности (рейтинг Lichess) и сколько задач брать с каждой: малышам нужнее простые. */
const BINS = [400, 700, 1000, 1300, 1600, 1900];
const QUOTA = [80, 80, 70, 50, 30];
/** Сколько задач с каждой ступеньки каждой темы идёт в общий набор. */
const MIX_PER_BIN = 8;

const MIN_POPULARITY = 85;
const MIN_PLAYS = 500;
const MAX_RATING_DEVIATION = 90;
/** Своих ходов в решении не больше трёх: первый ход в строке — ход соперника. */
const MAX_PLIES = 6;

/**
 * Убирает «пропускаемые» кадры zstd. pzstd, которым сжата база, ставит такой кадр перед каждым
 * обычным и пишет в него длину следующего кадра; встроенный zstd Node на них спотыкается.
 */
function stripSkippableFrames() {
  let buf = Buffer.alloc(0);
  let passLeft = 0;
  let passAll = false;
  return new Transform({
    transform(chunk, _enc, done) {
      buf = Buffer.concat([buf, chunk]);
      const out = [];
      for (;;) {
        if (passAll) {
          out.push(buf);
          buf = Buffer.alloc(0);
          break;
        }
        if (passLeft > 0) {
          const n = Math.min(passLeft, buf.length);
          out.push(buf.subarray(0, n));
          buf = buf.subarray(n);
          passLeft -= n;
          if (passLeft > 0) break;
          continue;
        }
        if (buf.length < 8) break;
        if ((buf.readUInt32LE(0) & 0xfffffff0) !== 0x184d2a50) {
          // Обычный кадр без подсказки о длине: дальше пропускаем всё как есть.
          passAll = true;
          continue;
        }
        const size = buf.readUInt32LE(4);
        if (buf.length < 8 + size) break;
        passLeft = size === 4 ? buf.readUInt32LE(8) : 0;
        buf = buf.subarray(8 + size);
      }
      done(null, out.length ? Buffer.concat(out) : undefined);
    },
    flush(done) {
      done(null, buf.length ? buf : undefined);
    },
  });
}

function binOf(rating) {
  for (let i = BINS.length - 2; i >= 0; i--) if (rating >= BINS[i]) return i;
  return -1;
}

const better = (a, b) => b.popularity - a.popularity || b.plays - a.plays || (a.id < b.id ? -1 : 1);

/** Все ходы законны; задача на мат заканчивается матом. */
function valid(p) {
  if (p.moves.length % 2 !== 0) return false;
  const chess = new Chess(p.fen);
  try {
    for (const uci of p.moves) chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
  } catch {
    return false;
  }
  return p.mate ? chess.isCheckmate() && p.moves.length === p.mate * 2 : true;
}

async function main() {
  const file = process.argv[2];
  if (!file || !fs.existsSync(file)) {
    console.error("Использование: node scripts/build-puzzles.mjs lichess_db_puzzle.csv.zst");
    process.exit(1);
  }
  const raw = fs.createReadStream(file);
  const input = file.endsWith(".zst") ? raw.pipe(stripSkippableFrames()).pipe(zlib.createZstdDecompress()) : raw;
  const lines = readline.createInterface({ input, crlfDelay: Infinity });

  // Кандидаты по теме и ступеньке; держим с запасом втрое, лишнее время от времени отсекаем.
  const pools = new Map(THEMES.map(([theme]) => [theme, BINS.slice(1).map(() => [])]));
  let columns = null;
  let total = 0;
  for await (const line of lines) {
    if (!columns) {
      columns = Object.fromEntries(line.split(",").map((name, i) => [name, i]));
      continue;
    }
    total++;
    const f = line.split(",");
    const rating = Number(f[columns.Rating]);
    const moves = f[columns.Moves].split(" ");
    const bin = binOf(rating);
    if (bin < 0 || rating >= BINS[BINS.length - 1] || moves.length > MAX_PLIES) continue;
    const popularity = Number(f[columns.Popularity]);
    const plays = Number(f[columns.NbPlays]);
    if (popularity < MIN_POPULARITY || plays < MIN_PLAYS) continue;
    if (Number(f[columns.RatingDeviation]) > MAX_RATING_DEVIATION) continue;
    const tags = new Set(f[columns.Themes].split(" "));
    const theme = THEMES.find(([, from]) => from.some((tag) => tags.has(tag)))?.[0];
    if (!theme) continue;
    const mate = [1, 2, 3].find((n) => tags.has(`mateIn${n}`)) ?? 0;
    const pool = pools.get(theme)[bin];
    pool.push({ id: f[columns.PuzzleId], fen: f[columns.FEN], moves, rating, popularity, plays, mate });
    const keep = QUOTA[bin] * 3;
    if (pool.length > keep * 4) pool.sort(better).length = keep;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const index = { source: "https://database.lichess.org/#puzzles", license: "CC0", total: 0, themes: {} };
  const mix = [];
  const hash = createHash("sha256");
  for (const [theme] of THEMES) {
    const chosen = [];
    pools.get(theme).forEach((pool, bin) => {
      const picked = [];
      for (const p of pool.sort(better)) {
        if (picked.length === QUOTA[bin]) break;
        if (valid(p)) picked.push(p);
      }
      chosen.push(...picked);
      for (const p of picked.slice(0, MIX_PER_BIN)) mix.push([theme, p]);
    });
    chosen.sort((a, b) => a.rating - b.rating || (a.id < b.id ? -1 : 1));
    const puzzles = chosen.map((p) => [p.id, p.fen, p.moves.join(" "), p.rating, p.mate]);
    const json = JSON.stringify({ theme, puzzles });
    fs.writeFileSync(path.join(OUT_DIR, `${theme}.json`), json + "\n");
    hash.update(json);
    index.themes[theme] = {
      count: puzzles.length,
      min: chosen[0]?.rating ?? 0,
      max: chosen.at(-1)?.rating ?? 0,
    };
    index.total += puzzles.length;
    console.log(
      `${theme.padEnd(12)} ${String(puzzles.length).padStart(4)}  ${index.themes[theme].min}–${index.themes[theme].max}`,
    );
  }
  mix.sort((a, b) => a[1].rating - b[1].rating || (a[1].id < b[1].id ? -1 : 1));
  const mixJson = JSON.stringify({
    theme: "mix",
    puzzles: mix.map(([theme, p]) => [p.id, p.fen, p.moves.join(" "), p.rating, p.mate, theme]),
  });
  fs.writeFileSync(path.join(OUT_DIR, "mix.json"), mixJson + "\n");
  hash.update(mixJson);
  index.mix = mix.length;
  index.version = hash.digest("hex").slice(0, 10);
  fs.writeFileSync(INDEX, JSON.stringify(index, null, 2) + "\n");
  console.log(
    `Просмотрено ${total} задач, в банке ${index.total}, в общем наборе ${mix.length}, версия ${index.version}.`,
  );
}

await main();
