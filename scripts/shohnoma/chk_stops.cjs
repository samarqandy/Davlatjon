/* eslint-disable -- одноразовые проверки чертежа книги (CommonJS, вне сборки); см. README.md рядом. */
const fs = require("fs");
const { Chess } = require("chess.js");
function grab(file) {
  const s = fs.readFileSync(file, "utf8");
  const out = {};
  const re = /id: "([^"]+)"[\s\S]*?moves:\s*(\[[^\]]*\]|"[^"]*")/g;
  let m;
  while ((m = re.exec(s))) {
    const v = m[2];
    out[m[1]] = v.startsWith("[")
      ? (v.match(/"([^"]+)"/g) || []).map((x) => x.slice(1, -1))
      : v.slice(1, -1).split(" ");
  }
  return out;
}
const g = { ...grab("src/content/chess/games.ts"), ...grab("src/content/chess/gamesMore.ts") };
function mateIn(c, n) {
  // side to move mates in <=n
  for (const m of c.moves()) {
    const d = new Chess(c.fen());
    d.move(m);
    if (d.isCheckmate()) return 1;
  }
  if (n === 1) return 0;
  for (const m of c.moves()) {
    const d = new Chess(c.fen());
    d.move(m);
    if (d.isGameOver()) continue;
    let ok = true;
    for (const r of d.moves()) {
      const e = new Chess(d.fen());
      e.move(r);
      if (!mateIn(e, n - 1)) {
        ok = false;
        break;
      }
    }
    if (ok) return 1 + 0;
  }
  return 0;
}
function minMate(c, max) {
  for (let n = 1; n <= max; n++) if (mateIn(c, n)) return n;
  return null;
}
for (const [id, stopsFromEnd] of [
  ["reti-tartakower", [5]],
  ["opera", [5, 3]],
  ["legal", [5, 3]],
  ["immortal", [5]],
  ["evergreen", [7, 5]],
]) {
  const mv = g[id];
  for (const k of stopsFromEnd) {
    const c = new Chess();
    for (const x of mv.slice(0, mv.length - k)) c.move(x);
    console.log(id, "before", mv[mv.length - k], "min mate", minMate(c, 3));
  }
}
console.log(
  "lasker-bauer len",
  g["lasker-bauer"]?.length,
  "dbk",
  g["deep-blue-kasparov"]?.length,
  "ka",
  g["kasimdzhanov-adams"]?.length,
);
for (const id of ["lasker-bauer", "deep-blue-kasparov", "kasimdzhanov-adams"]) {
  const c = new Chess();
  let bad = null;
  for (const x of g[id]) {
    try {
      c.move(x);
    } catch (e) {
      bad = x;
      break;
    }
  }
  console.log(id, bad ? "ILLEGAL " + bad : "ok");
}
