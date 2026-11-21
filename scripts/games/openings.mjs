/**
 * Общий для сборщиков партий (build-games.mjs, build-levels.mjs) определитель дебюта по позиции.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { Chess } from "chess.js";
import { OPENING_NAMES } from "../../src/content/chess/openingNames.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const CACHE = path.join(ROOT, ".cache/games");
const SOURCES = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "sources.json"), "utf8"));
const sha256 = (text) => createHash("sha256").update(text).digest("hex");

/** Те же жетоны ходов, что и в build-games.mjs: строки списка дебютов — «1. e4 e5 2. Nf3». */
function lineTokens(pgn) {
  return pgn
    .split(/\s+/)
    .map((t) => t.replace(/^\d+\.+/, ""))
    .filter(Boolean);
}

/**
 * Дебют партии — по позиции, как его определяет сам Lichess (README списка: «play moves backwards until a named
 * position is found»). Открытый список дебютов Lichess (lichess-org/chess-openings, CC0) проигрывается один раз,
 * и каждой его позиции (расстановка, очередь хода, рокировки, взятие на проходе) сопоставляются код ECO и семейство.
 * В партии берётся последняя позиция из списка, у семейства которой есть наше название по-русски и по-узбекски:
 * партия, пришедшая в ферзевый гамбит другим порядком ходов, — ферзевый гамбит, а не «Индийская защита».
 * Код ECO и семейство — от одной и той же позиции, чтобы подпись «Название (код)» не спорила сама с собой.
 * Таблица строится только при сборке: `--fetch` должен уметь заменить испорченный файл, а не падать на нём.
 * Файлы закреплены коммитом и контрольными суммами (sources.json → openings).
 */
let openingPositions = null;
const epd = (chess) => chess.fen().split(" ").slice(0, 4).join(" ");

function openingTable() {
  if (openingPositions) return openingPositions;
  openingPositions = new Map();
  for (const [name, digest] of Object.entries(SOURCES.openings.files)) {
    const file = path.join(CACHE, "openings", name);
    if (!fs.existsSync(file)) throw new Error(`${name}: нет файла списка дебютов — сначала --fetch`);
    const text = fs.readFileSync(file, "utf8");
    if (sha256(text) !== digest) throw new Error(`${name}: контрольная сумма не совпала — запустите --fetch`);
    for (const row of text.split("\n").slice(1)) {
      const [eco, title, pgn] = row.split("\t");
      if (!eco || !title || !pgn) continue;
      const chess = new Chess();
      for (const token of lineTokens(pgn)) chess.move(token);
      openingPositions.set(epd(chess), { eco, family: title.split(":")[0].trim() });
    }
  }
  return openingPositions;
}

/** Код ECO и семейство дебюта партии с обычной расстановки (ходы — в UCI). */
export function openingOf(uci) {
  const table = openingTable();
  const chess = new Chess();
  let named;
  let any;
  for (const u of uci) {
    chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    const hit = table.get(epd(chess));
    if (!hit) continue;
    any = hit;
    if (OPENING_NAMES[hit.family]) named = hit;
  }
  const pick = named ?? any;
  return { eco: pick?.eco, op: named?.family };
}
