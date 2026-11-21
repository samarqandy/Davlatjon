/* eslint-disable -- одноразовые проверки чертежа книги (CommonJS, вне сборки); см. README.md рядом. */
const fs = require("fs");
const { Chess } = require("chess.js");
const dir = require("path").join(__dirname, "../../") + "public/puzzles/";
const out = {};
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".json")) continue;
  const th = f.replace(".json", "");
  const rows = JSON.parse(fs.readFileSync(dir + f));
  const arr = Array.isArray(rows) ? rows : rows.puzzles || rows.rows || [];
  const s = { n: arr.length, lt800: 0, lt1000: 0, lt1200: 0, lt1400: 0, ge1400: 0, plies: {}, black: 0 };
  const byPiece = {};
  for (const r of arr) {
    const [id, fen, uci, rating] = r;
    const mv = uci.split(" ");
    if (rating < 800) s.lt800++;
    if (rating < 1000) s.lt1000++;
    if (rating < 1200) s.lt1200++;
    if (rating < 1400) s.lt1400++;
    else s.ge1400++;
    s.plies[mv.length] = (s.plies[mv.length] || 0) + 1;
    // who solves: in lichess format first move is opponent's
    const c = new Chess(fen);
    const solverIsBlack = c.turn() === "w";
    if (solverIsBlack) s.black++;
    if (th === "fork") {
      try {
        c.move({ from: mv[0].slice(0, 2), to: mv[0].slice(2, 4), promotion: mv[0][4] });
        const m = c.move({ from: mv[1].slice(0, 2), to: mv[1].slice(2, 4), promotion: mv[1][4] });
        byPiece[m.piece] = (byPiece[m.piece] || 0) + 1;
        if (rating < 1000) byPiece[m.piece + "<1000"] = (byPiece[m.piece + "<1000"] || 0) + 1;
      } catch (e) {
        byPiece.err = (byPiece.err || 0) + 1;
      }
    }
  }
  if (th === "fork") s.byPiece = byPiece;
  out[th] = s;
}
for (const [k, v] of Object.entries(out)) console.log(k.padEnd(12), JSON.stringify(v));
