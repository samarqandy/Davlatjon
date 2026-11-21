/* eslint-disable -- одноразовые проверки чертежа книги (CommonJS, вне сборки); см. README.md рядом. */
const { Chess } = require("chess.js");
const V = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const mat = (c) => {
  let s = 0;
  for (const r of c.board()) for (const q of r) if (q) s += (q.color === "w" ? 1 : -1) * V[q.type];
  return s;
};
const play = (fen, ...m) => {
  const c = new Chess(fen);
  for (const x of m) c.move(x);
  return c;
};
const mates1 = (c) => c.moves().filter((m) => play(c.fen(), m).isCheckmate());
// best material for side to move after its move and opponent's best reply (2 ply), from mover's view
function gain2(c) {
  const me = c.turn() === "w" ? 1 : -1;
  let best = -99;
  for (const m of c.moves()) {
    const d = play(c.fen(), m);
    if (d.isCheckmate()) return 99;
    let worst = 99;
    for (const r of d.moves()) {
      const e = play(d.fen(), r);
      worst = Math.min(worst, e.isCheckmate() ? -99 : me * mat(e));
    }
    if (!d.moves().length) worst = 0;
    best = Math.max(best, worst);
  }
  return best;
}
console.log("== 2.2 losing rook check");
{
  const c = new Chess("r5k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1");
  const d = play(c.fen(), "Rd8+");
  console.log("after Rd8+ replies", d.moves().join(" "));
  const e = play(d.fen(), "Rxd8");
  console.log(
    "material w-b",
    mat(e),
    "black mates next if white passes?",
    mates1(new Chess(e.fen().replace(" w ", " b "))).join(" "),
    "white best 2-ply",
    gain2(e),
  );
}
console.log("== 2.2 opening: 1.e4 e5 2.Qh5 Nc6 3.Qxf7+");
{
  const c = play(undefined, "e4", "e5", "Qh5", "Nc6");
  const d = play(c.fen(), "Qxf7+");
  console.log("replies", d.moves().join(" "));
  const e = play(d.fen(), "Kxf7");
  console.log("material", mat(e), "white 2-ply best", gain2(e));
  // 4-ply: white move, black reply, white move, black reply
  let best = -99;
  for (const m1 of e.moves()) {
    const f = play(e.fen(), m1);
    let w1 = 99;
    for (const r1 of f.moves()) {
      const g = play(f.fen(), r1);
      w1 = Math.min(w1, gain2(g));
    }
    best = Math.max(best, w1);
  }
  console.log("white 4-ply best material", best);
}
console.log("== 2.3 defence 6k1/5ppp/8/8/8/8/r7/4R1K1 b");
{
  const c = new Chess("6k1/5ppp/8/8/8/8/r7/4R1K1 b - - 0 1");
  const acc = [],
    bad = [];
  for (const m of c.moves()) {
    const d = play(c.fen(), m);
    const mt = mates1(d);
    if (mt.length) {
      bad.push(m + "(" + mt + ")");
      continue;
    }
    // white best material after 1 move + black reply
    const g = gain2(d);
    const base = mat(d);
    (g - base >= 3 ? bad : acc).push(m + (g - base >= 3 ? "(loses " + (g - base) + ")" : ""));
  }
  console.log("accept", acc.join(" "));
  console.log("bad", bad.join(" "));
}
console.log("== 2.4 counts");
{
  const c = new Chess("7k/5Q2/6K1/8/8/8/8/8 w - - 0 1");
  const all = c.moves();
  const st = all.filter((m) => play(c.fen(), m).isStalemate());
  console.log("legal", all.length, "mates", mates1(c).join(" "), "stalemates", st.length, st.join(" "));
}
console.log("== 2.6 e.p. legal only once");
{
  const c = play("4k3/8/8/8/1p6/8/P7/4K3 w - - 0 1", "a4");
  console.log(
    "ep",
    c
      .moves({ verbose: true })
      .filter((m) => m.flags.includes("e"))
      .map((m) => m.san),
  );
  const d = play(c.fen(), "Ke7", "Kd2");
  console.log("after a tempo ep still?", d.moves({ verbose: true }).filter((m) => m.flags.includes("e")).length);
}
console.log("== 2.7 ladder 4k3/8/8/8/8/8/R7/1R4K1 w");
{
  const c = new Chess("4k3/8/8/8/8/8/R7/1R4K1 w - - 0 1");
  console.log("mate in1?", mates1(c).join(" ") || "none");
  const d = play(c.fen(), "Ra7");
  for (const r of d.moves()) console.log(" ", r, "->", mates1(play(d.fen(), r)).join(" "));
}
console.log("== 3.8");
{
  const c = new Chess("5k2/8/6K1/8/8/8/8/1R6 w - - 0 1");
  const keys = c.moves().filter((m) => {
    const e = play(c.fen(), m);
    if (e.isCheckmate() || e.isStalemate()) return false;
    return e.moves().every((r) => mates1(play(e.fen(), r)).length > 0);
  });
  console.log("mate-in-2 keys", keys.join(" "), "| immediate", mates1(c).join(" ") || "none");
}
