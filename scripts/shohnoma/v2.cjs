/* eslint-disable -- одноразовые проверки чертежа книги (CommonJS, вне сборки); см. README.md рядом. */
const { Chess } = require("chess.js");
const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
function mat(c) {
  let w = 0,
    b = 0;
  for (const row of c.board())
    for (const s of row)
      if (s) {
        if (s.color === "w") w += VAL[s.type];
        else b += VAL[s.type];
      }
  return { w, b };
}
function info(fen, label) {
  const c = new Chess(fen);
  const m = c.moves();
  console.log(
    `[${label}] check=${c.isCheck()} mate=${c.isCheckmate()} stale=${c.isStalemate()} n=${m.length}: ${m.join(" ")}`,
  );
  return c;
}
function after(fen, ...sans) {
  const c = new Chess(fen);
  for (const s of sans) c.move(s);
  return c;
}
function line(sans, label) {
  const c = new Chess();
  for (const s of sans) c.move(s);
  console.log(
    `[${label}] check=${c.isCheck()} mate=${c.isCheckmate()} n=${c.moves().length}: ${c.moves().join(" ")} | material ${JSON.stringify(mat(c))}`,
  );
  return c;
}
function mateIn1Moves(c) {
  return c.moves().filter((m) => {
    const d = new Chess(c.fen());
    d.move(m);
    return d.isCheckmate();
  });
}
function splitSafe(c) {
  const ok = [],
    bad = [];
  for (const m of c.moves()) {
    const d = new Chess(c.fen());
    d.move(m);
    (mateIn1Moves(d).length ? bad : ok).push(m);
  }
  return { ok, bad };
}
console.log("== 2.2 Shoh! Uch eshik (old 2.5)");
info("R3r1k1/8/8/8/8/8/8/4KB2 w - - 0 1", "three doors");
info("6rk/8/8/8/8/8/5n1P/5R1K w - - 0 1", "half-demo");
info("4r1k1/5ppp/8/8/8/8/3P1P2/3QKB2 w - - 0 1", "block right piece");
{
  const c = after("4r1k1/5ppp/8/8/8/8/3P1P2/3QKB2 w - - 0 1", "Qe2");
  console.log(
    "  after Qe2 black captures:",
    c
      .moves()
      .filter((m) => m.includes("x"))
      .join(" "),
  );
}
info("6k1/5ppp/8/8/8/8/6qP/7K w - - 0 1", "take by king");
info("6k1/5Qpp/8/8/8/8/8/6K1 b - - 0 1", "pair a");
info("6k1/5Qpp/8/8/8/1B6/8/6K1 b - - 0 1", "pair b");
info("4R1k1/5ppp/8/8/1b6/8/8/6K1 b - - 0 1", "black");
info("4R1k1/5ppp/8/8/8/8/8/6K1 b - - 0 1", "black w/o bishop");
{
  const c = line(["e4", "c5", "Nf3", "d6", "Bb5+"], "sicilian Bb5+");
  const d = new Chess(c.fen());
  d.move("Qd7");
  console.log(
    "  after Qd7 white captures:",
    d
      .moves()
      .filter((m) => m.includes("x"))
      .join(" "),
  );
}
console.log("-- NEW clean losing check (replaces Jerome):");
{
  const c = line(["e4", "e5", "Qh5", "Nc6", "Qxf7+"], "3.Qxf7+");
  const d = line(["e4", "e5", "Qh5", "Nc6", "Qxf7+", "Kxf7"], "...Kxf7");
  console.log(
    "  white captures after Kxf7:",
    d
      .moves()
      .filter((m) => m.includes("x"))
      .join(" ") || "none",
    "| white checks:",
    d
      .moves()
      .filter((m) => m.includes("+"))
      .join(" ") || "none",
  );
  // 3-ply material search: can white win material back within 2 own moves?
  let best = -99;
  for (const m1 of d.moves()) {
    const e = new Chess(d.fen());
    e.move(m1);
    let worst = 99;
    for (const r of e.moves()) {
      const f = new Chess(e.fen());
      f.move(r);
      let bestc = mat(f).w - mat(f).b;
      for (const m2 of f.moves().filter((x) => x.includes("x"))) {
        const g = new Chess(f.fen());
        g.move(m2);
        // allow black recapture
        let w2 = mat(g).w - mat(g).b;
        for (const r2 of g.moves().filter((x) => x.includes("x"))) {
          const h = new Chess(g.fen());
          h.move(r2);
          w2 = Math.min(w2, mat(h).w - mat(h).b);
        }
        bestc = Math.max(bestc, w2);
      }
      worst = Math.min(worst, bestc);
    }
    best = Math.max(best, worst);
  }
  console.log(
    "  material now (w-b):",
    mat(d).w - mat(d).b,
    "; best white can force in 2 own moves (captures, 1 recapture):",
    best,
  );
}
{
  const c = info("r5k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1", "rook check that loses the rook");
  const d = after(c.fen(), "Rd8+");
  console.log("  after Rd8+ black legal:", d.moves().join(" "));
  const e = after(c.fen(), "Rd8+", "Rxd8");
  console.log("  material after Rxd8:", JSON.stringify(mat(e)), "black then threatens mate-in-1 if white passes?");
}
console.log("== 2.3 Mot (old 2.6)");
info("7k/6Q1/6K1/8/8/8/8/8 b - - 0 1", "open");
console.log(
  " Re8#",
  after("6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1", "Re8").isCheckmate(),
  " Rb8#",
  after("7k/R7/8/8/8/8/8/1R4K1 w - - 0 1", "Rb8").isCheckmate(),
);
line(["e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6", "Qxf7#"], "scholar");
console.log(
  " a:",
  after("6k1/5pp1/7p/8/8/8/8/4R1K1 w - - 0 1", "Re8").moves().join(" "),
  "| b:",
  after("6k1/5ppp/8/8/8/8/1r6/R5K1 w - - 0 1", "Ra8").moves().join(" "),
  "| c:",
  after("3r2k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1", "Re8").moves().join(" "),
);
line(["f3", "e5", "g4", "Qh4#"], "fool");
{
  const s = splitSafe(new Chess("6k1/5ppp/8/8/8/8/r7/4R1K1 b - - 0 1"));
  console.log(" defence: safe=", s.ok.join(" "), "| allow mate=", s.bad.join(" "));
}
{
  const c = new Chess();
  for (const m of ["e4", "e5", "Qh5", "Nc6", "Bc4"]) c.move(m);
  const s = splitSafe(c);
  console.log(" scholar def: avoid mate-in-1 =", s.ok.join(" "), "| allow =", s.bad.join(" "));
}
console.log("== safe checks example");
{
  const base = new Chess("r3k3/8/8/8/8/8/8/3Q2K1 w - - 0 1");
  for (const m of base.moves().filter((m) => m.includes("+"))) {
    const d = new Chess(base.fen());
    d.move(m);
    console.log(
      " ",
      m,
      "black captures:",
      d
        .moves()
        .filter((x) => x.includes("x"))
        .join(" ") || "-",
    );
  }
}
console.log("== NEW samples for mandated chapters");
{
  const c = new Chess("7k/5Q2/6K1/8/8/8/8/8 w - - 0 1");
  const mates = mateIn1Moves(c);
  const stale = c.moves().filter((m) => {
    const d = new Chess(c.fen());
    d.move(m);
    return d.isStalemate();
  });
  console.log(" 2.4 mate moves:", mates.join(" "), "| stalemating moves:", stale.join(" "));
}
for (const f of [
  "8/8/8/8/8/8/8/K1k4B w - - 0 1",
  "8/8/8/8/8/8/8/K1k4N w - - 0 1",
  "8/8/8/8/8/8/8/K1k4R w - - 0 1",
  "8/8/8/8/8/8/8/K1k4P w - - 0 1".replace("P", "1"),
]) {
  try {
    const c = new Chess(f);
    console.log(" 2.4 insufficient?", f.split(" ")[0], c.isInsufficientMaterial());
  } catch (e) {
    console.log(" bad fen", f, e.message);
  }
}
{
  const c = new Chess("4k3/8/8/8/1p6/8/P7/4K3 w - - 0 1");
  c.move("a4");
  const ep = c.moves({ verbose: true }).filter((m) => m.flags.includes("e"));
  console.log(" 2.6 en passant after 1.a4:", ep.map((m) => m.san).join(" "), "| fen", c.fen());
}
{
  const c = new Chess("4k3/8/8/8/8/8/R7/1R4K1 w - - 0 1");
  c.move("Ra7");
  const rep = c.moves();
  console.log(" 2.7 ladder: after Ra7 black:", rep.join(" "));
  for (const r of rep) {
    const d = new Chess(c.fen());
    d.move(r);
    const m = mateIn1Moves(d);
    console.log("   ", r, "-> mates:", m.join(" "));
  }
}
{
  const c = new Chess("5k2/8/6K1/8/8/8/8/1R6 w - - 0 1");
  console.log(" 3.8 immediate mates:", mateIn1Moves(c).join(" ") || "none");
  const d = new Chess(c.fen());
  d.move("Re1");
  console.log("   after Re1 black legal:", d.moves().join(" "));
  d.move("Kg8");
  console.log("   then mates:", mateIn1Moves(d).join(" "));
  // which first moves lead to forced mate in 2 (all black replies allow mate in 1)?
  const m2 = c.moves().filter((m) => {
    const e = new Chess(c.fen());
    e.move(m);
    if (e.isCheckmate() || e.isStalemate()) return false;
    return e.moves().every((r) => {
      const f = new Chess(e.fen());
      f.move(r);
      return mateIn1Moves(f).length > 0;
    });
  });
  console.log("   all mate-in-2 keys:", m2.join(" "));
}
