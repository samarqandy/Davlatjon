/* eslint-disable -- одноразовые проверки чертежа книги (CommonJS, вне сборки); см. README.md рядом. */
const fs = require("fs");
const { Chess } = require("chess.js");
function grab(file) {
  const s = fs.readFileSync(file, "utf8");
  const out = {};
  const re = /id: "([^"]+)"[\s\S]*?moves: \[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(s))) {
    out[m[1]] = m[2].match(/"([^"]+)"/g)?.map((x) => x.slice(1, -1)) || [];
  }
  return out;
}
const g = {
  ...grab("src/content/chess/games.ts"),
  ...grab("src/content/chess/gamesMore.ts"),
  ...grab("src/content/chess/openings.ts"),
};
for (const id of [
  "fools-mate",
  "scholars-mate",
  "legal",
  "opera",
  "reti-tartakower",
  "lasker-bauer",
  "immortal",
  "evergreen",
  "deep-blue-kasparov",
  "kasimdzhanov-adams",
  "italian",
  "scholar-defense",
  "legal-trap",
  "queens-gambit",
  "london",
  "sicilian",
  "french",
  "scandinavian",
  "caro-kann",
]) {
  const mv = g[id];
  if (!mv) {
    console.log(id, "MISSING");
    continue;
  }
  const c = new Chess();
  let bad = null;
  for (let i = 0; i < mv.length; i++) {
    try {
      c.move(mv[i]);
    } catch (e) {
      bad = i + ":" + mv[i];
      break;
    }
  }
  console.log(
    id.padEnd(20),
    "plies",
    mv.length,
    bad ? "ILLEGAL at " + bad : "ok",
    c.isCheckmate() ? "MATE" : "",
    mv.slice(-6).join(" "),
  );
}
