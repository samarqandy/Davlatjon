/**
 * Названия дебютов из открытого списка Lichess (lichess-org/chess-openings, CC0 — общественное достояние).
 *
 * В списке около 3 900 строк: «код, название, ходы». Название до двоеточия — семейство («Sicilian Defense»),
 * после — вариант. Детям хватает семейства, поэтому из списка берётся только то, что нужно, чтобы узнать его
 * по ходам: строка остаётся, если её семейство не совпадает с семейством ближайшей более короткой строки.
 * Получается несколько сотен строк вместо тысяч.
 *
 * Каждая строка проверяется chess.js: все ходы законны с начальной позиции. Ходы записываются без «+» и «#».
 *
 * Пишет src/content/chess/opening-book.json: { source, families, lines: [[ходы, номер семейства], …] }.
 * Русские и узбекские названия семейств — в src/content/chess/openingNames.ts (пишутся руками).
 *
 * Запуск:
 *   mkdir openings && cd openings
 *   for f in a b c d e; do curl -O https://raw.githubusercontent.com/lichess-org/chess-openings/master/$f.tsv; done
 *   cd .. && node scripts/build-opening-book.mjs openings <ревизия или дата источника>
 *   npx prettier --write src/content/chess/opening-book.json
 */
import fs from "node:fs";
import path from "node:path";
import { Chess } from "chess.js";

const OUT = "src/content/chess/opening-book.json";
const [dir, revision = "?"] = process.argv.slice(2);
if (!dir) {
  console.error("Нужна папка с файлами a.tsv … e.tsv");
  process.exit(1);
}

const family = (name) => name.split(":")[0].trim();
const clean = (san) => san.replace(/[+#]/g, "");

/** Ходы строки в записи chess.js; строка с незаконным ходом — ошибка источника, останавливаемся. */
function movesOf(pgn, where) {
  const chess = new Chess();
  const out = [];
  for (const token of pgn.split(/\s+/)) {
    if (!token || /^\d+\.+$/.test(token)) continue;
    let move;
    try {
      move = chess.move(token);
    } catch {
      move = null;
    }
    if (!move) throw new Error(`${where}: ход «${token}» незаконен в «${pgn}»`);
    out.push(clean(move.san));
  }
  return out;
}

const byLine = new Map();
let rows = 0;
for (const file of ["a", "b", "c", "d", "e"]) {
  const text = fs.readFileSync(path.join(dir, `${file}.tsv`), "utf8");
  text
    .split("\n")
    .slice(1)
    .forEach((row, i) => {
      if (!row.trim()) return;
      const [, name, pgn] = row.split("\t");
      rows++;
      const key = movesOf(pgn, `${file}.tsv:${i + 2}`).join(" ");
      // Одна и та же последовательность ходов встречается под двумя названиями редко; берём первое.
      if (!byLine.has(key)) byLine.set(key, family(name));
    });
}

/** Семейство ближайшей более короткой строки — то, что покажет поиск, если этой строки не будет. */
function inherited(key) {
  const moves = key.split(" ");
  for (let k = moves.length - 1; k > 0; k--) {
    const found = byLine.get(moves.slice(0, k).join(" "));
    if (found) return found;
  }
  return null;
}

const kept = [...byLine].filter(([key, fam]) => inherited(key) !== fam);
const families = [...new Set(kept.map(([, fam]) => fam))].sort((a, b) => a.localeCompare(b, "en"));
const lines = kept
  .map(([key, fam]) => [key, families.indexOf(fam)])
  .sort((a, b) => a[0].split(" ").length - b[0].split(" ").length || a[0].localeCompare(b[0], "en"));

const book = {
  source: `lichess-org/chess-openings (CC0), ${revision}`,
  families,
  lines,
};
fs.writeFileSync(OUT, `${JSON.stringify(book)}\n`);
console.log(`Строк в источнике: ${rows}; разных последовательностей: ${byLine.size}.`);
console.log(`В книге: ${lines.length} строк, ${families.length} семейств, ${fs.statSync(OUT).size} байт → ${OUT}`);
