/**
 * Партии по уровням (GAMES-3): собирает public/data/games/levels-{1,2,3}.cc0.json из открытой базы Lichess
 * (database.lichess.org, лицензия CC0).
 *
 * Месячный файл базы — около 30 ГБ (pgn.zst). Целиком он не нужен: файл состоит из независимых кадров zstd, перед
 * каждым — служебный кадр с его длиной, поэтому начало файла (первые сотни мегабайт, закреплённые контрольной суммой
 * в sources.json → levels) читается кадр за кадром встроенным в Node zstd.
 *
 * Отбор: рейтинговые партии с контролем «рапид» и «классика» (в блице ошибки часто от нехватки времени), закончены
 * матом, сдачей или соглашением (не по времени и не брошены), оба игрока в коридоре уровня, разница рейтингов не больше
 * 200, не меньше 20 ходов. Уровни: 1 — 1000–1399, 2 — 1400–1799, 3 — 1800–2199 (рейтинг Lichess).
 *
 * Детская безопасность: ники игроков, ссылка на партию, турнир, дата и время не переносятся — по ним можно найти
 * аккаунт. Рейтинг округляется вниз до 50, от даты остаются год и месяц. У партии свой id (номер в выборке).
 * Сами ходы — публичные данные: решительный человек найдёт исходную партию по ходам, поэтому мы не обещаем, что её
 * нельзя найти, а только не даём ссылок и ников.
 *
 * Берутся только партии, разобранные движком Lichess (у части партий в базе есть оценки). Из оценок переносится только одно: полуход «решающей ошибки» — ход
 * проигравшей стороны, после которого её шансы упали сильнее всего (не меньше чем на 30 процентных пунктов, по
 * формуле Lichess). Сами оценки, часы и комментарии не переносятся.
 *
 *   node --no-warnings scripts/games/build-levels.mjs --fetch   # скачать начало месячного файла в .cache/games/levels
 *   node --no-warnings scripts/games/build-levels.mjs           # собрать файлы уровней
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { Chess } from "chess.js";
import { openingOf } from "./openings.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const CACHE = path.join(ROOT, ".cache/games/levels");
const OUT_DIR = path.join(ROOT, "public/data/games");
const SOURCES = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "sources.json"), "utf8"));
const CFG = SOURCES.levels;
const UA = "DataBuildScript/1.0 (offline, low-volume)";
const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
const PART = path.join(CACHE, `${CFG.month}.part.pgn.zst`);

/** Сколько партий брать на уровень и границы уровней (по рейтингу Lichess, нижняя включительно). */
const PER_LEVEL = CFG.perLevel;
const LEVELS = [
  { level: 1, lo: 1000, hi: 1400 },
  { level: 2, lo: 1400, hi: 1800 },
  { level: 3, lo: 1800, hi: 2200 },
];
const MIN_PLIES = 40;
/** Не больше трети ничьих: детям интереснее и полезнее партии с результатом. */
const MAX_DRAW_SHARE = 1 / 3;

function fetchPart() {
  fs.mkdirSync(CACHE, { recursive: true });
  if (fs.existsSync(PART) && sha256(fs.readFileSync(PART)) === CFG.sha256) return;
  const url = `https://database.lichess.org/standard/lichess_db_standard_rated_${CFG.month}.pgn.zst`;
  console.log("lichess db", url, `0-${CFG.bytes - 1}`);
  execFileSync("curl", ["-sSfL", "--max-time", "1800", "-A", UA, "-r", `0-${CFG.bytes - 1}`, "-o", PART, url], {
    stdio: "inherit",
  });
  const got = sha256(fs.readFileSync(PART));
  if (CFG.sha256 && got !== CFG.sha256) {
    fs.rmSync(PART);
    throw new Error(`начало файла базы не совпало с контрольной суммой (получено ${got})`);
  }
  if (!CFG.sha256) console.log(`впишите в sources.json → levels.sha256: ${got}`);
}

/** Кадры zstd по одному: перед каждым — служебный кадр (магия 0x184D2A50) с длиной следующего кадра. */
function* frames(buf) {
  let off = 0;
  while (off + 12 <= buf.length) {
    if (buf.readUInt32LE(off) !== 0x184d2a50) throw new Error(`неожиданный кадр на ${off}`);
    const skip = buf.readUInt32LE(off + 4);
    const size = buf.readUInt32LE(off + 8);
    off += 8 + skip;
    if (off + size > buf.length) return; // последний кадр обрезан диапазоном — не нужен
    yield zlib.zstdDecompressSync(buf.subarray(off, off + size)).toString("utf8");
    off += size;
  }
}

const tag = (head, name) => head.match(new RegExp(`^\\[${name} "([^"]*)"\\]$`, "m"))?.[1];

/** Ходы и оценки после каждого хода (с точки зрения белых, в сантипешках; мат — ±100000). */
function parseMoves(movetext) {
  const sans = [];
  const evals = [];
  const re = /(\{[^}]*\})|(\S+)/g;
  for (const m of movetext.matchAll(re)) {
    if (m[1]) {
      const e = m[1].match(/\[%eval (#?-?[\d.]+)\]/);
      if (e && sans.length) {
        const v = e[1];
        evals[sans.length - 1] = v.startsWith("#")
          ? v.includes("-")
            ? -100000
            : 100000
          : Math.round(parseFloat(v) * 100);
      }
      continue;
    }
    const t = m[2];
    if (/^\d+\.+$/.test(t) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)) continue;
    sans.push(t.replace(/[!?]+$/, ""));
  }
  return { sans, evals };
}

/** Шансы стороны (белых), 0..100, — формула Lichess. */
const winPct = (cp) => 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * Math.max(-1000, Math.min(1000, cp)))) - 1);

/** Полуход решающей ошибки проигравшей стороны (1-based) или undefined. */
function decisiveMistake(evals, plies, res) {
  if (res === "1/2-1/2" || evals.filter((e) => e !== undefined).length < plies * 0.9) return undefined;
  const loserIsWhite = res === "0-1";
  let best;
  let bestDrop = 30;
  let prev = 20; // начальная позиция: около +0.2
  for (let i = 0; i < plies; i++) {
    const cur = evals[i];
    // У матующего последнего хода в базе Lichess оценки нет: это ход победителя, он не может быть ошибкой
    // проигравшего — просто заканчиваем.
    if (cur === undefined) {
      if (i === plies - 1) break;
      return undefined;
    }
    const moverWhite = i % 2 === 0;
    if (moverWhite === loserIsWhite) {
      const before = loserIsWhite ? winPct(prev) : 100 - winPct(prev);
      const after = loserIsWhite ? winPct(cur) : 100 - winPct(cur);
      if (before - after > bestDrop) {
        bestDrop = before - after;
        best = i + 1;
      }
    }
    prev = cur;
  }
  return best;
}

/** Вниз до 50: 1375 → 1350, а не 1400 — округлённый рейтинг не вылезает за коридор уровня («1000–1400»). */
const round50 = (r) => Math.floor(r / 50) * 50;

function build() {
  if (!fs.existsSync(PART)) throw new Error("нет начала файла базы — сначала --fetch");
  const buf = fs.readFileSync(PART);
  if (CFG.sha256 && sha256(buf) !== CFG.sha256) throw new Error("начало файла базы не совпало с контрольной суммой");
  const picked = Object.fromEntries(LEVELS.map((l) => [l.level, { games: [], draws: 0 }]));
  const stats = { seen: 0, rapidClassical: 0, rejected: {} };
  const reject = (why) => (stats.rejected[why] = (stats.rejected[why] ?? 0) + 1);
  const full = () => LEVELS.every((l) => picked[l.level].games.length >= PER_LEVEL);

  outer: for (const text of frames(buf)) {
    for (const chunk of text.split(/\n\n(?=\[Event )/)) {
      if (full()) break outer;
      stats.seen++;
      const split = chunk.indexOf("\n\n");
      if (split < 0) continue;
      const head = chunk.slice(0, split);
      const event = tag(head, "Event") ?? "";
      if (!/^Rated (Rapid|Classical) /.test(event)) continue;
      stats.rapidClassical++;
      if (tag(head, "Variant") && tag(head, "Variant") !== "Standard") continue;
      if (tag(head, "Termination") !== "Normal") {
        reject("termination");
        continue;
      }
      const res = tag(head, "Result");
      if (!["1-0", "0-1", "1/2-1/2"].includes(res)) continue;
      const we = Number(tag(head, "WhiteElo"));
      const be = Number(tag(head, "BlackElo"));
      if (!we || !be || Math.abs(we - be) > 200) {
        reject("rating gap");
        continue;
      }
      const lvl = LEVELS.find((l) => we >= l.lo && we < l.hi && be >= l.lo && be < l.hi);
      if (!lvl) {
        reject("level");
        continue;
      }
      const bucket = picked[lvl.level];
      if (bucket.games.length >= PER_LEVEL) continue;
      if (res === "1/2-1/2" && bucket.draws >= PER_LEVEL * MAX_DRAW_SHARE) {
        reject("draw share");
        continue;
      }
      const { sans, evals } = parseMoves(chunk.slice(split + 2));
      if (sans.length < MIN_PLIES) {
        reject("short");
        continue;
      }
      // Только разобранные движком Lichess партии: у каждой решённой партии можно показать решающую ошибку.
      if (evals.filter((e) => e !== undefined).length < sans.length * 0.9) {
        reject("no eval");
        continue;
      }
      const chess = new Chess();
      const uci = [];
      let ok = true;
      for (const san of sans) {
        try {
          const mv = chess.move(san);
          uci.push(mv.from + mv.to + (mv.promotion ?? ""));
        } catch {
          ok = false;
          break;
        }
      }
      if (!ok) {
        reject("illegal");
        continue;
      }
      const tc = event.startsWith("Rated Classical") ? "c" : "r";
      const date = tag(head, "UTCDate") ?? tag(head, "Date") ?? "";
      const { eco, op } = openingOf(uci);
      const g = {
        id: `lv${lvl.level}-${String(bucket.games.length + 1).padStart(4, "0")}`,
        lv: lvl.level,
        we: round50(we),
        be: round50(be),
        y: Number(date.slice(0, 4)),
        mo: Number(date.slice(5, 7)),
        res,
        tc,
        m: uci.join(" "),
        op,
        eco,
        mt: chess.isCheckmate() ? 1 : undefined,
        x: decisiveMistake(evals, sans.length, res),
      };
      bucket.games.push(g);
      if (res === "1/2-1/2") bucket.draws++;
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const counts = {};
  for (const l of LEVELS) {
    const games = picked[l.level].games;
    if (games.length < PER_LEVEL) console.warn(`уровень ${l.level}: только ${games.length} из ${PER_LEVEL}`);
    const meta = {
      set: `level-${l.level}`,
      level: l.level,
      ratingFrom: l.lo,
      ratingTo: l.hi - 1,
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      source: "Lichess open database",
      sourceUrl: "https://database.lichess.org/",
      attribution: `Партии из открытой базы Lichess (database.lichess.org, ${CFG.month}), лицензия CC0. Ники, ссылки, турниры и точные даты убраны, рейтинги округлены вниз до 50.`,
      count: games.length,
    };
    const body = games
      .map((g) => JSON.stringify(Object.fromEntries(Object.entries(g).filter(([, v]) => v !== undefined))))
      .join(",\n");
    fs.writeFileSync(
      path.join(OUT_DIR, `levels-${l.level}.cc0.json`),
      `${JSON.stringify(meta).slice(0, -1)},"games":[\n${body}\n]}\n`,
    );
    counts[l.level] = {
      games: games.length,
      draws: picked[l.level].draws,
      mates: games.filter((g) => g.mt).length,
      mistakes: games.filter((g) => g.x).length,
    };
  }
  console.log({ seen: stats.seen, rapidClassical: stats.rapidClassical, rejected: stats.rejected, counts });
}

if (process.argv.includes("--fetch")) fetchPart();
else build();
