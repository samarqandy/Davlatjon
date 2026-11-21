/* eslint-disable -- одноразовые проверки чертежа книги (CommonJS, вне сборки); см. README.md рядом. */
// Проверки для BLUEPRINT.final.md (2026-11-21). Запуск: node final_checks.cjs из любого каталога.
const fs = require("fs");
const { Chess } = require("chess.js");
const R = require("path").join(__dirname, "../../") + "";
const V = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const mat = (c) => {
  let s = 0;
  for (const r of c.board()) for (const q of r) if (q) s += (q.color === "w" ? 1 : -1) * V[q.type];
  return s;
};
const play = (fen, ...m) => {
  const c = fen ? new Chess(fen) : new Chess();
  for (const x of m) c.move(x);
  return c;
};
const mates1 = (c) => c.moves().filter((m) => play(c.fen(), m).isCheckmate());
function mateIn(c, n) {
  for (const m of c.moves()) {
    const d = play(c.fen(), m);
    if (d.isCheckmate()) return true;
  }
  if (n === 1) return false;
  for (const m of c.moves()) {
    const d = play(c.fen(), m);
    if (d.isGameOver()) continue;
    if (d.moves().every((r) => mateIn(play(d.fen(), r), n - 1))) return true;
  }
  return false;
}
const minMate = (c, max) => {
  for (let n = 1; n <= max; n++) if (mateIn(c, n)) return n;
  return null;
};
// gain for side to move: its move, opponent best reply (2 plies), material from mover's view
function gain2(c) {
  const me = c.turn() === "w" ? 1 : -1;
  let best = -99;
  for (const m of c.moves()) {
    const d = play(c.fen(), m);
    if (d.isCheckmate()) return 99;
    let worst = 99;
    if (!d.moves().length) worst = 0;
    for (const r of d.moves()) {
      const e = play(d.fen(), r);
      worst = Math.min(worst, e.isCheckmate() ? -99 : me * mat(e));
    }
    best = Math.max(best, worst);
  }
  return best;
}

console.log("== 3.9 f7 под двойным ударом: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5");
{
  const c = play(null, "e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5");
  console.log(
    "attackers f7 (w):",
    c.attackers("f7", "w").join(","),
    "| defenders f7 (b):",
    c.attackers("f7", "b").join(","),
  );
  const d = play(c.fen(), "d5");
  console.log("after 4...d5 attackers f7 (w):", d.attackers("f7", "w").join(","));
  // which black moves keep material: white move + black reply (2 plies) and white does not gain >=1 vs now
  const base = mat(c);
  const ok = [],
    bad = [];
  for (const m of c.moves()) {
    const e = play(c.fen(), m);
    const g = gain2(e);
    (g - base >= 2 ? bad : ok).push(m + "(" + (g - base) + ")");
  }
  console.log("2-ply ok:", ok.join(" "));
  console.log("2-ply loses:", bad.join(" "));
  const e = play(null, "e4", "e5", "Nf3", "Nc6", "Bc4", "h6");
  console.log(
    "after 3...h6, Ng5 legal?",
    e.moves().includes("Ng5"),
    "h-pawn takes after Ng5:",
    play(e.fen(), "Ng5").moves().includes("hxg5"),
  );
  const f = play(null, "e4", "e5", "Nf3", "Nc6", "Bc4", "Be7", "Ng5");
  console.log("3...Be7 4.Ng5: Bxg5 legal?", f.moves().includes("Bxg5"));
}
console.log("== 2.5 король и конь ставят мат королю с пешкой: 5K1k/5N1p/8/8/8/8/8/8 b");
{
  const c = new Chess("5K1k/5N1p/8/8/8/8/8/8 b - - 0 1");
  console.log("mate", c.isCheckmate(), "insufficient", c.isInsufficientMaterial());
  const d = new Chess("5K1k/5N2/8/8/8/8/8/8 b - - 0 1");
  console.log("same without h7: insufficient", d.isInsufficientMaterial(), "mate", d.isCheckmate());
}
console.log("== 2.2/3.7 Rd8+? r5k1/5ppp/8/8/8/8/5PPP/3R2K1 w");
{
  const c = new Chess("r5k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1");
  const d = play(c.fen(), "Rd8+");
  console.log("replies", d.moves().join(" "));
  const e = play(d.fen(), "Rxd8");
  console.log("material", mat(e));
  const pass = new Chess(e.fen().replace(" w ", " b "));
  console.log("black threat Rd1#?", mates1(pass).join(" "));
  // sister for 3.7: white to move must parry Rd1#
  const def = e.moves().filter((m) => {
    const x = play(e.fen(), m);
    return mates1(x).length === 0;
  });
  console.log("3.7 sister: white moves that stop mate", def.join(" "), "of", e.moves().length);
}
console.log("== 2.7 e.p.: только сразу");
{
  const c = play("4k3/8/8/8/1p6/8/P7/4K3 w - - 0 1", "a4");
  console.log(
    "ep now",
    c
      .moves({ verbose: true })
      .filter((m) => m.flags.includes("e"))
      .map((m) => m.san)
      .join(" "),
  );
  const d = play(c.fen(), "Ke7", "Kd2");
  console.log("after a tempo ep:", d.moves({ verbose: true }).filter((m) => m.flags.includes("e")).length);
  const p = new Chess("8/P3k3/8/8/8/8/8/4K3 w - - 0 1");
  console.log(
    "promotion options a8:",
    p
      .moves({ verbose: true })
      .filter((m) => m.promotion)
      .map((m) => m.san)
      .join(" "),
  );
}
// games
function grab(file) {
  const s = fs.readFileSync(R + file, "utf8");
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
const g = {
  ...grab("src/content/chess/games.ts"),
  ...grab("src/content/chess/gamesMore.ts"),
  ...grab("src/content/chess/openings.ts"),
};
function stopAt(id, san, max) {
  const mv = g[id];
  const i = mv.indexOf(san);
  const c = new Chess();
  for (const x of mv.slice(0, i)) c.move(x);
  return { ply: i, mate: minMate(c, max), tail: mv.slice(i).join(" ") };
}
console.log("== стопы партий");
for (const [id, san, max] of [
  ["reti-tartakower", "Qd8+", 4],
  ["reti-tartakower", "Bg5+", 3],
  ["evergreen", "Qxd7+", 4],
  ["evergreen", "Bf5+", 3],
  ["legal", "Bxf7+", 3],
  ["opera", "Qb8+", 3],
]) {
  const r = stopAt(id, san, max);
  console.log(id.padEnd(16), san.padEnd(6), "ply", r.ply, "min mate", r.mate, "|", r.tail);
}
console.log("== caro-kann");
{
  const mv = g["caro-kann"];
  const c = new Chess();
  let bad = null;
  for (const x of mv) {
    try {
      c.move(x);
    } catch (e) {
      bad = x;
      break;
    }
  }
  console.log(mv.join(" "), bad ? "ILLEGAL " + bad : "ok");
}
console.log("== вилка по фигуре (двухходовые задачи темы fork)");
{
  const rows = JSON.parse(fs.readFileSync(R + "public/puzzles/fork.json")).puzzles;
  const by = {},
    byFirst = {};
  let n2 = 0,
    none = 0,
    firstNotFork = 0;
  for (const [id, fen, uci, rating] of rows) {
    const mv = uci.split(" ");
    if (mv.length !== 4) continue;
    n2++;
    const c = new Chess(fen);
    const doMove = (u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    doMove(mv[0]);
    let found = null;
    for (let i = 1; i < mv.length; i += 2) {
      const m = doMove(mv[i]);
      const me = m.color,
        opp = me === "w" ? "b" : "w";
      const targets = [];
      for (const row of c.board())
        for (const q of row)
          if (q && q.color === opp && q.type !== "p") {
            if (c.attackers(q.square, me).includes(m.to)) targets.push(q.type);
          }
      if (i === 1) byFirst[m.piece] = (byFirst[m.piece] || 0) + 1;
      if (targets.length >= 2 && !found) {
        found = m.piece;
        if (i !== 1) firstNotFork++;
      }
      if (i + 1 < mv.length) doMove(mv[i + 1]);
    }
    if (found) by[found] = (by[found] || 0) + 1;
    else none++;
  }
  console.log(
    "two-move fork puzzles",
    n2,
    "by forking piece",
    JSON.stringify(by),
    "not classified",
    none,
    "fork on 2nd move",
    firstNotFork,
    "| by first move piece",
    JSON.stringify(byFirst),
  );
}
