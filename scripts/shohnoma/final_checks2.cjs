/* eslint-disable -- одноразовые проверки чертежа книги (CommonJS, вне сборки); см. README.md рядом. */
const { Chess } = require("chess.js");
const play = (fen, ...m) => {
  const c = fen ? new Chess(fen) : new Chess();
  for (const x of m) c.move(x);
  return c;
};
const mates1 = (c) => c.moves().filter((m) => play(c.fen(), m).isCheckmate());
console.log("4.15 lines:");
for (const line of [
  ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5", "Na5"],
  ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5", "Nxd5", "Nxf7", "Kxf7"],
]) {
  try {
    const c = play(null, ...line);
    console.log(" ok", line.join(" "), c.inCheck() ? "check" : "");
  } catch (e) {
    console.log(" ILLEGAL", line.join(" "), e.message);
  }
}
console.log("3.7 sister (black to move, white threatens Rd8#): 6k1/5ppp/8/8/8/8/5PPP/3R2K1 b");
{
  const c = new Chess("6k1/5ppp/8/8/8/8/5PPP/3R2K1 b - - 0 1");
  const pass = new Chess(c.fen().replace(" b ", " w "));
  console.log(" threat", mates1(pass).join(" "));
  const ok = c.moves().filter((m) => mates1(play(c.fen(), m)).length === 0);
  console.log(" accept", ok.join(" "), "of", c.moves().length);
}
