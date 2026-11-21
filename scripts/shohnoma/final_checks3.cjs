/* eslint-disable -- одноразовые проверки чертежа книги (CommonJS, вне сборки); см. README.md рядом. */
const fs = require("fs");
const { Chess } = require("chess.js");
const play = (fen, ...m) => {
  const c = fen ? new Chess(fen) : new Chess();
  for (const x of m) c.move(x);
  return c;
};
function mateIn(c, n) {
  for (const m of c.moves()) {
    if (play(c.fen(), m).isCheckmate()) return true;
  }
  if (n === 1) return false;
  for (const m of c.moves()) {
    const d = play(c.fen(), m);
    if (d.isGameOver()) continue;
    if (d.moves().every((r) => mateIn(play(d.fen(), r), n - 1))) return true;
  }
  return false;
}
const s = fs.readFileSync(require("path").join(__dirname, "../../") + "src/content/chess/games.ts", "utf8");
const i = s.indexOf('id: "immortal"');
const j = s.indexOf("moves", i);
const mv = (s.slice(j, s.indexOf("]", j)).match(/"([^"]+)"/g) || []).map((x) => x.slice(1, -1));
const k = mv.length - 5;
const c = new Chess();
for (const x of mv.slice(0, k)) c.move(x);
console.log("immortal stop", mv.slice(k).join(" "), "mate<=2", mateIn(c, 2), "mate<=3", mateIn(c, 3));
