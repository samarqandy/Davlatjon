/* eslint-disable -- одноразовые проверки чертежа книги (CommonJS, вне сборки); см. README.md рядом. */
// Позиции и линии, добавленные или перенесённые при правке чертежа по аудиту программы (2026-11-21).
const { Chess } = require("chess.js");
const play = (fen, ...m) => {
  const c = fen ? new Chess(fen) : new Chess();
  for (const x of m) c.move(x);
  return c;
};
const after = (c, m) => {
  const d = new Chess(c.fen());
  d.move(m);
  return d;
};
const mateInOne = (c) => c.moves().filter((m) => after(c, m).isCheckmate());

// 2.7 (позиция-«сестра» главы 2.4): превращение в ладью, чтобы не дать пат.
{
  const fen = "8/k1P5/2K5/8/8/8/8/8 w - - 0 1";
  for (const p of ["q", "r", "b", "n"]) {
    const c = new Chess(fen);
    c.move({ from: "c7", to: "c8", promotion: p });
    console.log(
      "2.7 c8=" + p.toUpperCase(),
      "stalemate",
      c.isStalemate(),
      "check",
      c.inCheck(),
      "black moves",
      c.moves().join(","),
    );
  }
  const r = play(fen, "c8=R", "Ka6");
  console.log("2.7 after c8=R Ka6: mate in one", mateInOne(r).join(","));
}

// 2.4: превращение в коня ради мата — единственный матующий ход.
{
  const c = new Chess("7K/6P1/6pk/6pp/8/8/8/8 w - - 0 1");
  console.log("2.4 legal moves", c.moves().length, "mates in one", mateInOne(c).join(","));
  const q = after(c, "g8=Q");
  console.log("2.4 g8=Q: check", q.inCheck(), "stalemate", q.isStalemate(), "black moves", q.moves().join(","));
}

// 2.3 образец мата и 3.7 позиция-«сестра»: после 1.e4 e5 2.Qh5 Nc6 3.Bc4 какой ход чёрных снимает мат в один ход.
{
  const m = play(null, "e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6", "Qxf7#");
  console.log("2.3 4.Qxf7# mate", m.isCheckmate());
  const c = play(null, "e4", "e5", "Qh5", "Nc6", "Bc4");
  console.log(
    "3.7 white threat now (white to move after a pass):",
    mateInOne(new Chess(c.fen().replace(" b ", " w "))).join(","),
  );
  const all = c.moves();
  const safe = all.filter((x) => mateInOne(after(c, x)).length === 0);
  console.log("3.7 black moves", all.length, "stop mate in one", safe.length, safe.join(","));
  for (const x of ["g6", "Qe7"]) console.log("2.11 3..." + x, "stops mate", safe.includes(x));
}

// 3.10 занятие «f7: двое нападают — один защищает» (позиция не менялась, перепроверена после переноса).
{
  const c = play(null, "e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5");
  console.log("3.10 f7 attackers", c.attackers("f7", "w").join(","), "defenders", c.attackers("f7", "b").join(","));
  const d = after(c, "d5");
  console.log("3.10 after 4...d5 f7 attackers", d.attackers("f7", "w").join(","));
}

// 2.7 «Yurish bormi?» (позиция не менялась, перепроверена после переноса главы пата).
{
  const c = new Chess("7k/5Q2/6K1/8/8/8/8/8 w - - 0 1");
  const all = c.moves();
  const mates = all.filter((x) => after(c, x).isCheckmate());
  const stale = all.filter((x) => after(c, x).isStalemate());
  console.log("2.7 7k/5Q2/6K1: moves", all.length, "mate", mates.length, "stalemate", stale.length);
}

// 3.7: какие из спасающих от мата ходов отдают ферзя (ферзь берётся, а отыграть его ферзём сразу нельзя).
{
  const c = play(null, "e4", "e5", "Qh5", "Nc6", "Bc4");
  for (const x of ["Qg5", "Qh4"]) {
    const d = after(c, x);
    const take = d
      .moves({ verbose: true })
      .filter((m) => m.captured === "q")
      .map((m) => m.san);
    const back = take.map((t) =>
      after(d, t)
        .moves({ verbose: true })
        .some((m) => m.captured === "q"),
    );
    console.log("3.7 3..." + x, "white takes queen", take.join(","), "black recaptures queen", back.join(","));
  }
}
