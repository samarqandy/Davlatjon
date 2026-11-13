/** Курс «Ферзь»: комбинации проверены перебором chess.js, партии — по записи ходов. */
import { Chess } from "chess.js";
import { describe, expect, it, vi } from "vitest";
import { COURSE_5_LESSONS } from "@/content/chess/course5";
import { matingMoves } from "@/lib/chess";
import { matingMovesIn, searchBest } from "@/lib/engine/search";

/** Мат не более чем в n ходов белых, где каждый ход белых — шах. */
function mateInChecks(fen: string, n: number): boolean {
  return new Chess(fen).moves({ verbose: true }).some((m) => forcesMate(fen, `${m.from}${m.to}`, n));
}
function forcesMate(fen: string, first: string, n: number): boolean {
  const d = new Chess(fen);
  d.move({ from: first.slice(0, 2), to: first.slice(2, 4) });
  if (!d.inCheck()) return false;
  if (d.isCheckmate()) return true;
  return (
    n > 1 &&
    d.moves({ verbose: true }).every((r) => {
      const e = new Chess(d.fen());
      e.move(r);
      return mateInChecks(e.fen(), n - 1);
    })
  );
}
const play = (moves: string) => {
  const c = new Chess();
  for (const m of moves.split(" ")) c.move(m);
  return c;
};

// Перебор вариантов под общей нагрузкой может идти дольше стандартных 5 секунд.
vi.setConfig({ testTimeout: 30_000 });

describe("курс «Ферзь»: комбинации", () => {
  it("связка: Фxh7# — единственный мат, конь f8 связан", () => {
    expect(matingMoves("R4n1k/4b1pp/8/7Q/8/3B4/6PP/6K1 w - - 0 1")).toEqual(["h5h7"]);
  });

  it("Рети — Тартаковер (Вена, 1910): позиция из партии, Фd8+ — мат в 3, Фxe4 — нет", () => {
    const c = play("e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Qd3 e5 dxe5 Qa5+ Bd2 Qxe5 O-O-O Nxe4");
    const fen = "rnb1kb1r/pp3ppp/2p5/4q3/4n3/3Q4/PPPB1PPP/2KR1BNR w kq - 0 9";
    expect(c.fen()).toBe(fen);
    expect(forcesMate(fen, "d3d8", 3)).toBe(true);
    c.move("Qd8+");
    c.move("Kxd8");
    c.move("Bg5+");
    expect(c.attackers("d8", "w").sort()).toEqual(["d1", "g5"]);
  });

  it("Э. Ласкер — Томас (Лондон, 1912): Фxh7+ — мат шахами, партия кончается матом Крd2#", () => {
    const moves = "d4 e6 Nf3 f5 Nc3 Nf6 Bg5 Be7 Bxf6 Bxf6 e4 fxe4 Nxe4 b6 Ne5 O-O Bd3 Bb7 Qh5 Qe7";
    const c = play(moves);
    const fen = "rn3rk1/pbppq1pp/1p2pb2/4N2Q/3PN3/3B4/PPP2PPP/R3K2R w KQ - 6 11";
    expect(c.fen()).toBe(fen);
    expect(forcesMate(fen, "h5h7", 8)).toBe(true);
    const alt = new Chess(fen);
    alt.move("Nxf6+");
    expect(alt.moves().filter((m) => m.endsWith("xf6"))).toEqual(expect.arrayContaining(["Rxf6", "gxf6", "Qxf6"]));
    const end = play(`${moves} Qxh7+ Kxh7 Nxf6+ Kh6 Neg4+ Kg5 h4+ Kf4 g3+ Kf3 Be2+ Kg2 Rh2+ Kg1 Kd2#`);
    expect(end.isCheckmate()).toBe(true);
  });

  it("завлечение: после Сxh7+ король идёт только на h8, затем Лxf8#", () => {
    const c = new Chess("2R2qk1/5ppp/b5B1/8/8/8/2Q2PPP/7K w - - 0 1");
    c.move("Bxh7+");
    expect(c.moves()).toEqual(["Kh8"]);
    c.move("Kh8");
    c.move("Rxf8#");
    expect(c.isCheckmate()).toBe(true);
  });

  it("спёртый мат: Кf7+ — мат в 4 шахами, быстрее мата нет; Фg8+ — нет", () => {
    const fen = "4r2k/6pp/8/3Q2N1/8/8/6PP/6K1 w - - 0 1";
    expect(forcesMate(fen, "g5f7", 4)).toBe(true);
    expect(mateInChecks(fen, 3)).toBe(false);
    expect(forcesMate(fen, "d5g8", 4)).toBe(false);
  });
});

describe("курс «Ферзь»: ловля ферзя, атака, жертвы", () => {
  const replies = (fen: string, first: string) => {
    const c = new Chess(fen);
    c.move(first);
    return c;
  };
  it("ловля ферзя: после Сc3 на любой ответ белые забирают ферзя; после Сb4 — Фd4", () => {
    const c = replies("6k1/5ppp/8/B7/8/1B6/P2P4/qNK5 w - - 0 1", "Bc3");
    for (const r of c.moves({ verbose: true })) {
      const d = new Chess(c.fen());
      d.move(r);
      const q = d
        .board()
        .flat()
        .find((p) => p?.type === "q" && p.color === "b")!;
      expect(
        d.moves({ verbose: true }).some((m) => m.to === q.square),
        r.san,
      ).toBe(true);
    }
    expect(replies("6k1/5ppp/8/B7/8/1B6/P2P4/qNK5 w - - 0 1", "Bb4").moves()).toContain("Qd4");
  });

  it("взаимодействие: Фxg7# и Фg7# — единственные маты", () => {
    expect(matingMoves("5rk1/5ppp/8/8/6Q1/2B5/5PPP/6K1 w - - 0 1")).toEqual(["g4g7"]);
    expect(matingMoves("5rk1/5p1p/8/7N/3Q4/8/5PPP/6K1 w - - 0 1")).toEqual(["d4g7"]);
  });

  it("нерокировавшийся король: Лe4+ — мат в 2, король идёт только на d8", () => {
    const fen = "4k1B1/3p1pr1/8/7n/1Q5R/8/1K6/8 w - - 0 1";
    expect(forcesMate(fen, "h4e4", 2)).toBe(true);
    expect(replies(fen, "Re4+").moves()).toEqual(["Kd8"]);
  });

  it("жертвы на f7 и тихий ход: верные ходы матуют в 2, неверные — нет", () => {
    const two = (fen: string, first: string) => {
      const c = new Chess(fen);
      c.move({ from: first.slice(0, 2), to: first.slice(2, 4) });
      return (
        c.moves().length > 0 &&
        c.moves({ verbose: true }).every((r) => {
          const e = new Chess(c.fen());
          e.move(r);
          return matingMoves(e.fen()).length > 0;
        })
      );
    };
    expect(two("6k1/3rRpp1/7p/8/8/8/QK3PPP/8 w - - 0 1", "a2f7")).toBe(true);
    expect(two("6k1/3rRpp1/7p/8/8/8/QK3PPP/8 w - - 0 1", "e7f7")).toBe(false);
    expect(two("6k1/b4p1p/1R4p1/6b1/2B2Q2/8/5P2/6K1 w - - 0 1", "f4f7")).toBe(true);
    expect(two("6k1/b4p1p/1R4p1/6b1/2B2Q2/8/5P2/6K1 w - - 0 1", "b6g6")).toBe(false);
    expect(two("3B3k/6pp/8/2b5/8/1Q6/K6P/B7 w - - 0 1", "b3f7")).toBe(true);
    expect(two("3B3k/6pp/8/2b5/8/1Q6/K6P/B7 w - - 0 1", "b3g8")).toBe(false);
  });
});

describe("курс «Ферзь»: классика и итоговый тест", () => {
  it("Стейниц — Барделебен (Гастингс, 1895): позиция из партии, показанный мат ведёт к мату", () => {
    const moves =
      "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 d5 exd5 Nxd5 O-O Be6 Bg5 Be7 Bxd5 Bxd5 Nxd5 Qxd5 Bxe7 Nxe7 Re1 f6 Qe2 Qd7 Rac1 c6 d5 cxd5 Nd4 Kf7 Ne6 Rhc8 Qg4 g6 Ng5+ Ke8";
    const c = play(moves);
    expect(c.fen().split(" ")[0]).toBe("r1r1k3/pp1qn2p/5pp1/3p2N1/6Q1/8/PP3PPP/2R1R1K1");
    const end = play(
      `${moves} Rxe7+ Kf8 Rf7+ Kg8 Rg7+ Kh8 Rxh7+ Kg8 Rg7+ Kh8 Qh4+ Kxg7 Qh7+ Kf8 Qh8+ Ke7 Qg7+ Ke8 Qg8+ Ke7 Qf7+ Kd8 Qf8+ Qe8 Nf7+ Kd7 Qd6#`,
    );
    expect(end.isCheckmate()).toBe(true);
    // Взять ладью g7 королём — ферзь g4 забирает ферзя d7 с шахом.
    const g = play(`${moves} Rxe7+ Kf8 Rf7+ Kg8 Rg7+ Kxg7 Qxd7+`);
    expect(g.inCheck()).toBe(true);
  });

  it("Ротлеви — Рубинштейн (Лодзь, 1907): позиция из партии; после Лh3 почти на любой ход белых — мат в 1", () => {
    const moves =
      "d4 d5 Nf3 e6 e3 c5 c4 Nc6 Nc3 Nf6 dxc5 Bxc5 a3 a6 b4 Bd6 Bb2 O-O Qd2 Qe7 Bd3 dxc4 Bxc4 b5 Bd3 Rd8 Qe2 Bb7 O-O Ne5 Nxe5 Bxe5 f4 Bc7 e4 Rac8 e5 Bb6+ Kh1 Ng4 Be4 Qh4 g3";
    const c = play(moves);
    expect(c.fen().split(" ")[0]).toBe("2rr2k1/1b3ppp/pb2p3/1p2P3/1P2BPnq/P1N3P1/1B2Q2P/R4R1K");
    const end = play(`${moves} Rxc3 gxh4 Rd2 Qxd2 Bxe4+ Qg2 Rh3`);
    const replies = end.moves();
    const mated = replies.filter((r) => {
      const d = new Chess(end.fen());
      d.move(r);
      return matingMoves(d.fen()).length > 0;
    });
    expect(mated.length / replies.length).toBeGreaterThan(0.8);
    const wrong = new Chess(c.fen());
    wrong.move("Rd2");
    expect(wrong.moves()).toContain("Qxd2");
  });

  it("итоговый тест: маты и единственные первые ходы", () => {
    expect(matingMoves("6rk/6pp/7N/8/8/8/6PP/6K1 w - - 0 1")).toEqual(["h6f7"]);
    for (const [fen, good, bad] of [
      ["7k/5rpp/5B1q/2R3Q1/8/8/5P1P/6K1 w - - 0 1", "c5c8", "g5g7"],
      ["4k3/3ppp2/1q3n2/8/7Q/5R2/5P1P/K7 w - - 0 1", "h4h8", "f3f6"],
    ]) {
      expect(forcesMate(fen, good, 2), good).toBe(true);
      const c = new Chess(fen);
      c.move({ from: bad.slice(0, 2), to: bad.slice(2, 4) });
      const ok =
        c.moves().length > 0 &&
        c.moves({ verbose: true }).every((r) => {
          const e = new Chess(c.fen());
          e.move(r);
          return matingMoves(e.fen()).length > 0;
        });
      expect(ok, bad).toBe(false);
    }
  });
});

describe("курс «Ферзь»: единственный ход в защите", () => {
  const sans = (fen: string) => new Chess(fen).moves();
  const after = (fen: string, san: string) => {
    const c = new Chess(fen);
    c.move(san);
    return c.fen();
  };

  it("шах ферзём и конём: спасает только Фd4 — остальные три хода ведут к мату", () => {
    const fen = "6k1/pp3pp1/7p/2q5/6n1/2P5/PP4PP/3QR1K1 w - - 0 1";
    expect(sans(fen).sort()).toEqual(["Kf1", "Kh1", "Qd4", "Re3"]);
    // Крf1 — мат в один ход; Крh1 и Лe3 — спёртый мат шахами не более чем за 4 хода.
    expect(matingMoves(after(fen, "Kf1"))).toEqual(["c5f2"]);
    expect(mateInChecks(after(fen, "Kh1"), 4)).toBe(true);
    expect(mateInChecks(after(fen, "Re3"), 4)).toBe(true);
    // После Фd4 мата шахами нет, а на взятие ферзя есть ответ пешкой: ферзи разменяны.
    const saved = after(fen, "Qd4");
    expect(mateInChecks(saved, 4)).toBe(false);
    const line = new Chess(saved);
    line.move("Qxd4+");
    expect(line.moves()).toContain("cxd4");
    line.move("cxd4");
    expect(line.fen().split(" ")[0]).not.toMatch(/[qQ]/);
  });

  it("две ладьи на первой горизонтали: спасает только Лxd1 — закрываться бесполезно", () => {
    const fen = "3R4/p1p2pkp/4R1pq/8/8/8/1PP2QPP/1r1r3K w - - 0 1";
    expect(sans(fen).sort()).toEqual(["Qe1", "Qf1", "Qg1", "Re1", "Rxd1"]);
    for (const wrong of ["Qe1", "Qf1", "Qg1", "Re1"]) expect(mateInChecks(after(fen, wrong), 2), wrong).toBe(true);
    const saved = after(fen, "Rxd1");
    expect(mateInChecks(saved, 4)).toBe(false);
    // После Лxd1+ у белых есть чем закрыться.
    const line = new Chess(saved);
    line.move("Rxd1+");
    expect(line.moves()).toEqual(expect.arrayContaining(["Re1", "Qg1"]));
  });

  it("тихая защита: шаха нет, грозит Лe1#, спасает только Лa1 — и после неё у чёрных нет перевеса", () => {
    const lesson = COURSE_5_LESSONS.find((l) => l.id === "c5-only-move")!;
    const ex = lesson.exercises.find((e) => e.id === "c5-only-move-quiet")!;
    if (ex.kind !== "choose") throw new Error("упражнение должно быть выбором хода");
    const fen = ex.fen;
    expect(ex.moves[ex.correct]).toBe("a7a1");
    expect(new Chess(fen).inCheck()).toBe(false);
    // Фигур поровну: ладья и две лёгкие фигуры, по пять пешек.
    const count = (pieces: string) => [...fen.split(" ")[0]].filter((ch) => pieces.includes(ch)).length;
    expect([count("R"), count("N"), count("P")]).toEqual([1, 2, 5]);
    expect([count("r"), count("b"), count("p")]).toEqual([1, 2, 5]);
    // Угроза: пропусти белые ход — мат один, Лe1#.
    expect(matingMoves(fen.replace(" w ", " b "))).toEqual(["e8e1"]);
    // Пешка g2 связана слоном b7: форточки на g2 нет.
    expect(sans(fen).filter((san) => san.startsWith("g"))).toEqual([]);
    // Все ходы, кроме четырёх, пропускают мат в один ход — в том числе взятие слона и форточка h3.
    const notMated = sans(fen).filter((san) => matingMoves(after(fen, san)).length === 0);
    expect(notMated.sort()).toEqual(["Ne2", "Ne4", "Ra1", "Ra8"]);
    for (const wrong of ["Rxb7", "Nxd6", "h3", "h4"]) expect(matingMoves(after(fen, wrong)), wrong).toEqual(["e8e1"]);
    // Конь, закрывший линию «e», теряется даром; после Лa8 Сxa8 угроза мата осталась, а защищать поле e1 уже нечем.
    for (const wrong of ["Ne2", "Ne4"])
      expect(searchBest(after(fen, wrong), { depth: 4, timeMs: 60_000 }).score, wrong).toBeGreaterThanOrEqual(300);
    const cornered = after(after(fen, "Ra8"), "Bxa8");
    for (const san of sans(cornered)) {
      const next = after(cornered, san);
      const lost = matingMoves(next).length > 0 || searchBest(next, { depth: 3, timeMs: 60_000 }).score >= 300;
      expect(lost, `Ra8 Bxa8 ${san}`).toBe(true);
    }
    // После Лa1 у чёрных нет ни мата, ни перевеса: поиск движка на глубину 6 (оценка в сотых долях пешки).
    const saved = searchBest(after(fen, "Ra1"), { depth: 6, timeMs: 90_000 });
    expect(saved.depth).toBe(6);
    expect(Math.abs(saved.score)).toBeLessThanOrEqual(100);
    // Поиск на глубину 6 на нагруженной машине идёт дольше обычного — времени с запасом.
  }, 180_000);
});

describe("курс «Ферзь»: развязывание, мельница, отвлечение, линии", () => {
  /** Упражнение «выбери ход» из курса: позиция и ходы — те самые, что видит ученик. */
  const choose = (lessonId: string, exerciseId: string) => {
    const ex = COURSE_5_LESSONS.find((l) => l.id === lessonId)?.exercises.find((e) => e.id === exerciseId);
    if (ex?.kind !== "choose") throw new Error(`${exerciseId}: упражнение должно быть выбором хода`);
    return { fen: ex.fen, right: ex.moves[ex.correct], wrong: ex.moves.filter((_, i) => i !== ex.correct) };
  };
  const after = (fen: string, ...sans: string[]) => {
    const c = new Chess(fen);
    for (const san of sans) c.move(san);
    return c;
  };
  /** После хода `first` на любой ответ чёрных у белых есть мат в один ход. */
  const matesNext = (fen: string, first: string) => {
    const c = new Chess(fen);
    c.move({ from: first.slice(0, 2), to: first.slice(2, 4) });
    return (
      c.moves().length > 0 &&
      c.moves({ verbose: true }).every((r) => {
        const e = new Chess(c.fen());
        e.move(r);
        return matingMoves(e.fen()).length > 0;
      })
    );
  };

  it("развязывание: Кe6+ — шах, на любой ответ конь берёт ладью d8; после Кf3 теряется ферзь", () => {
    const { fen, right, wrong } = choose("c5-unpin", "c5-unpin-check");
    expect([right, wrong]).toEqual(["d4e6", ["d4f3"]]);
    const c = after(fen, "Ne6+");
    expect(c.inCheck()).toBe(true);
    expect(c.moves().length).toBeGreaterThan(0);
    for (const reply of c.moves()) {
      const takes = after(c.fen(), reply)
        .moves({ verbose: true })
        .some((m) => m.from === "e6" && m.to === "d8");
      expect(takes, reply).toBe(true);
    }
    expect(after(fen, "Nf3").moves()).toContain("Rxd1+");
  });

  it("идея Легаля: позиция из дебюта; на взятие ферзя — мат в два хода, на взятие коня — Фxg4", () => {
    const { fen, right } = choose("c5-legal", "c5-legal-choose");
    expect(play("e4 e5 Nf3 d6 Bc4 Bg4 Nc3 g6").fen()).toBe(fen);
    expect(right).toBe("f3e5");
    const line = after(fen, "Nxe5", "Bxd1", "Bxf7+");
    expect(line.moves()).toEqual(["Ke7"]);
    line.move("Ke7");
    line.move("Nd5#");
    expect(line.isCheckmate()).toBe(true);
    expect(after(fen, "Nxe5", "dxe5").moves()).toContain("Qxg4");
  });

  it("идея Легаля не проходит: конь c6 бьёт на e5 и защищает слона g4 — белые без фигуры", () => {
    const { fen, right, wrong } = choose("c5-legal", "c5-legal-fails");
    expect(play("e4 e5 Nf3 Nc6 Bc4 d6 Nc3 Bg4").fen()).toBe(fen);
    expect([right, wrong]).toEqual(["h2h3", ["f3e5"]]);
    const c = after(fen, "Nxe5", "Nxe5");
    expect(c.attackers("g4", "b")).toContain("e5");
    // У белых нет ни мата, ни шаха слоном с выигрышем: на Фxg4 конь бьёт ферзя.
    expect(matingMoves(c.fen())).toEqual([]);
    expect(after(c.fen(), "Qxg4").moves()).toContain("Nxg4");
    const minor = (pieces: string) => [...c.fen().split(" ")[0]].filter((ch) => pieces.includes(ch)).length;
    expect(minor("NB")).toBe(minor("nb") - 1);
  });

  it("мельница: на каждый шах у короля один ход; ладья забирает две пешки, слона, коня и ладью", () => {
    const { fen, right, wrong } = choose("c5-windmill", "c5-windmill-start");
    expect([right, wrong]).toEqual(["g7f7", ["g7g3"]]);
    const c = new Chess(fen);
    const before = c
      .fen()
      .split(" ")[0]
      .replace(/[^a-z]/g, "").length;
    for (const [white, black] of [
      ["Rxf7+", "Kg8"],
      ["Rg7+", "Kh8"],
      ["Rxd7+", "Kg8"],
      ["Rg7+", "Kh8"],
      ["Rxb7+", "Kg8"],
      ["Rg7+", "Kh8"],
      ["Rxa7+", "Kg8"],
    ]) {
      c.move(white);
      expect(c.moves(), white).toEqual([black]);
      c.move(black);
    }
    c.move("Rxa8");
    expect(
      before -
        c
          .fen()
          .split(" ")[0]
          .replace(/[^a-z]/g, "").length,
    ).toBe(5);
    // Неверный шах: король уходит на h7, вскрытого шаха больше нет.
    expect(after(fen, "Rg3+").moves()).toContain("Kh7");
  });

  it("отвлечение: после Лe8 на любой ответ — мат в один ход; Фxf8+ не матует", () => {
    const { fen, right, wrong } = choose("c5-deflection", "c5-deflection-rook");
    expect([right, wrong]).toEqual(["e1e8", ["h6f8"]]);
    expect(matesNext(fen, right)).toBe(true);
    expect(matingMoves(after(fen, "Re8", "Qxe8").fen())).toEqual(["h6g7"]);
    expect(matesNext(fen, wrong[0])).toBe(false);
    expect(after(fen, "Qxf8+").moves()).toContain("Kxf8");
  });

  it("перекрытие: после Кd5 пешка проходит в ферзи при любой игре чёрных; сразу a8Ф — слон бьёт", () => {
    const { fen, right, wrong } = choose("c5-interference", "c5-interference-knight");
    expect([right, wrong]).toEqual(["b4d5", ["a7a8q"]]);
    const queens = (position: string, label: string) => {
      const d = after(position, "a8=Q");
      expect(d.attackers("a8", "b"), label).toEqual([]);
    };
    const c = after(fen, "Nd5");
    for (const reply of c.moves()) {
      const d = after(c.fen(), reply);
      if (reply !== "Bxd5") {
        queens(d.fen(), reply);
        continue;
      }
      // Слон взял коня: пешка c4 бьёт в ответ — диагональ закрыта пешкой.
      d.move("cxd5");
      for (const next of d.moves()) queens(after(d.fen(), next).fen(), `Bxd5 cxd5 ${next}`);
    }
    expect(after(fen, "a8=Q").moves()).toContain("Bxa8");
  });

  it("освобождение линии: Лh8+ Крxh8, Фh1+ Крg8, Фh7# — ответы единственные; после Фh5 чёрные бьют g6", () => {
    const { fen, right, wrong } = choose("c5-clearance", "c5-clearance-rook");
    expect([right, wrong]).toEqual(["h1h8", ["d1h5"]]);
    expect(forcesMate(fen, right, 3)).toBe(true);
    const c = after(fen, "Rh8+");
    expect(c.moves()).toEqual(["Kxh8"]);
    c.move("Kxh8");
    c.move("Qh1+");
    expect(c.moves()).toEqual(["Kg8"]);
    c.move("Kg8");
    c.move("Qh7#");
    expect(c.isCheckmate()).toBe(true);
    expect(after(fen, "Qh5").moves()).toContain("Qxg6");
    expect(matingMoves(after(fen, "Qh5", "Qxg6").fen())).toEqual([]);
  });

  it("последняя горизонталь: Фe8+ и Лe8+ матуют в два хода, Фb7 — нет", () => {
    const { fen, right, wrong } = choose("c5-back-rank", "c5-back-rank-queen");
    expect([right, wrong]).toEqual(["b5e8", ["b5b7"]]);
    expect(forcesMate(fen, right, 2)).toBe(true);
    expect(forcesMate(fen, "e1e8", 2)).toBe(true);
    expect(after(fen, "Qe8+").moves()).toEqual(["Rxe8"]);
    expect(matesNext(fen, wrong[0])).toBe(false);
  });

  /** Материал белых минус материал чёрных (пешка — 1, лёгкая фигура — 3, ладья — 5, ферзь — 9). */
  const balance = (fen: string) => {
    const value: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    let sum = 0;
    for (const ch of fen.split(" ")[0]) {
      const v = value[ch.toLowerCase()];
      if (v) sum += ch === ch.toLowerCase() ? -v : v;
    }
    return sum;
  };

  it("промежуточный ход: после Лxd8+ белые забирают ферзя и остаются с лишней ладьёй; после Сxe2 — поровну", () => {
    const { fen, right, wrong } = choose("c5-zwischenzug", "c5-zwischenzug-check");
    expect([right, wrong]).toEqual(["d1d8", ["f1e2"]]);
    const c = after(fen, "Rxd8+");
    expect(c.moves().sort()).toEqual(["Be8", "Kh7", "Qe8"]);
    for (const reply of c.moves()) {
      const d = after(c.fen(), reply);
      const takes = d.moves({ verbose: true }).find((m) => m.captured === "q");
      expect(takes, reply).toBeTruthy();
      d.move(takes!);
      expect(balance(d.fen()), reply).toBe(5);
    }
    expect(balance(after(fen, "Bxe2", "Rxd1+", "Bxd1").fen())).toBe(0);
  });

  it("вскрытие линии: Фxh7+ — единственный мат в три хода, ответы чёрных единственные", () => {
    const { fen, right, wrong } = choose("c5-open-file", "c5-open-file-queen");
    expect([right, wrong]).toEqual(["h4h7", ["d1h1"]]);
    expect(matingMovesIn(fen, 3)).toEqual(["h4h7"]);
    const c = after(fen, "Qxh7+");
    expect(c.moves()).toEqual(["Kxh7"]);
    c.move("Kxh7");
    c.move("Rh1+");
    expect(c.moves()).toEqual(["Kg8"]);
    c.move("Kg8");
    c.move("Rh8#");
    expect(c.isCheckmate()).toBe(true);
    // После Лh1 чёрные закрывают линию пешкой.
    expect(after(fen, "Rh1").moves()).toContain("h5");
  });

  it("пешка-гвоздь: Фxh7+ — единственный мат в два хода; Фg7+ теряет ферзя", () => {
    const { fen, right, wrong } = choose("c5-nail", "c5-nail-queen");
    expect([right, wrong]).toEqual(["h6h7", ["h6g7"]]);
    expect(matingMovesIn(fen, 2)).toEqual(["h6h7"]);
    const c = after(fen, "Qxh7+");
    expect(c.moves()).toEqual(["Kxh7"]);
    c.move("Kxh7");
    c.move("Rh3#");
    expect(c.isCheckmate()).toBe(true);
    expect(after(fen, "Qg7+").moves()).toEqual(["Rxg7"]);
    // Позиция на карточке урока: ферзь встаёт на g7 под защитой пешки — мат.
    const demo = COURSE_5_LESSONS.find((l) => l.id === "c5-nail")!.lesson[0].demo!;
    expect(matingMoves(demo.fen)).toEqual(["h6g7"]);
  });

  it("Ласкер — Бауэр (Амстердам, 1889): три позиции — из партии, запись ходов возможна до конца", () => {
    const start =
      "f4 d5 e3 Nf6 b3 e6 Bb2 Be7 Bd3 b6 Nf3 Bb7 Nc3 Nbd7 O-O O-O Ne2 c5 Ng3 Qc7 Ne5 Nxe5 Bxe5 Qc6 Qe2 a6 Nh5 Nxh5";
    const first = choose("c5-two-bishops", "c5-two-bishops-first");
    const second = choose("c5-two-bishops", "c5-two-bishops-second");
    const fork = choose("c5-two-bishops", "c5-two-bishops-fork");
    expect(play(start).fen()).toBe(first.fen);
    expect(play(`${start} Bxh7+ Kxh7 Qxh5+ Kg8`).fen()).toBe(second.fen);
    const attack = `${start} Bxh7+ Kxh7 Qxh5+ Kg8 Bxg7 Kxg7 Qg4+ Kh7 Rf3`;
    expect(play(`${attack} e5 Rh3+ Qh6 Rxh6+ Kxh6`).fen()).toBe(fork.fen);
    expect([first.right, second.right, fork.right]).toEqual(["d3h7", "e5g7", "g4d7"]);
    const end = play(
      `${attack} e5 Rh3+ Qh6 Rxh6+ Kxh6 Qd7 Bf6 Qxb7 Kg7 Rf1 Rab8 Qd7 Rfd8 Qg4+ Kf8 fxe5 Bg7 e6 Rb7 Qg6 f6 Rxf6+ Bxf6 Qxf6+ Ke8 Qh8+ Ke7 Qg7+`,
    );
    expect(end.inCheck()).toBe(true);

    // 15. Фxh5 вместо жертвы: чёрные закрывают диагональ слона d3 ходом f5.
    expect(after(first.fen, "Qxh5").moves()).toContain("f5");
    // 17. Сxg7: кроме взятия слона и ходов пешки «f», любой ответ пропускает мат не позже чем в два хода.
    const taken = after(second.fen, "Bxg7");
    const alive = taken.moves().filter((san) => matingMovesIn(after(taken.fen(), san).fen(), 2).length === 0);
    expect(alive.sort()).toEqual(["Kxg7", "f5", "f6"]);
    // 18... Крf6 — мат в один ход.
    expect(matingMoves(after(taken.fen(), "Kxg7", "Qg4+", "Kf6").fen())).toEqual(["g4g5"]);
    // 17. Фg4 вместо жертвы: после f6 у белых нет мата в два хода.
    expect(matingMovesIn(after(second.fen, "Qg4", "f6").fen(), 2)).toEqual([]);
    // 19. Лf3: от мата в два хода спасают только ходы, отдающие материал, — в партии e5 и ферзь за ладью.
    const lift = play(attack);
    const saved = lift.moves().filter((san) => matingMovesIn(after(lift.fen(), san).fen(), 2).length === 0);
    expect(saved.sort()).toEqual(["Bg5", "Bh4", "e5"]);
    // 22. Фd7: на любой ответ ферзь берёт одного из слонов, и взять ферзя в ответ нечем.
    const forked = after(fork.fen, "Qd7");
    expect(forked.attackers("b7", "w")).toEqual(["d7"]);
    expect(forked.attackers("e7", "w")).toEqual(["d7"]);
    for (const reply of forked.moves()) {
      const d = after(forked.fen(), reply);
      const safe = d
        .moves({ verbose: true })
        .filter((m) => m.piece === "q" && m.captured === "b")
        .some((m) => after(d.fen(), m.san).attackers(m.to, "b").length === 0);
      expect(safe, reply).toBe(true);
    }
  });

  it("размен на поле связки: после Лxd7 Лxd7 Лd1 белые при любой игре остаются с лишней фигурой", () => {
    const { fen, right, wrong } = choose("c5-pin-exchange", "c5-pin-exchange-rook");
    expect([right, wrong]).toEqual(["d1d7", ["b5d7"]]);
    expect(balance(fen)).toBe(0);
    const c = after(fen, "Rxd7", "Rxd7", "Rd1");
    for (const reply of c.moves()) {
      const d = after(c.fen(), reply);
      // Лучшее взятие белых: после него чёрные могут взять что-то в ответ — считаем худший для белых случай.
      const best = Math.max(
        ...d
          .moves({ verbose: true })
          .filter((m) => m.captured)
          .map((m) => {
            const e = after(d.fen(), m.san);
            const recaptures = e.moves({ verbose: true }).filter((x) => x.captured);
            return Math.min(balance(e.fen()), ...recaptures.map((x) => balance(after(e.fen(), x.san).fen())));
          }),
      );
      expect(best, reply).toBeGreaterThanOrEqual(3);
    }
    expect(balance(after(fen, "Bxd7+", "Rxd7", "Rxd7", "Kxd7").fen())).toBe(0);
  });

  it("Шультен — Морфи (Нью-Йорк, 1857): позиции из партии, конь e2 связан и атакован дважды, в конце мат", () => {
    const start = "e4 e5 f4 d5 exd5 e4 Nc3 Nf6 d3 Bb4 Bd2 e3 Bxe3 O-O Bd2 Bxc3 bxc3 Re8+ Be2 Bg4 c4 c6 dxc6 Nxc6 Kf1";
    const rook = choose("c5-morphy-pin", "c5-morphy-pin-rook");
    const knight = choose("c5-morphy-pin", "c5-morphy-pin-knight");
    expect(play(start).fen()).toBe(rook.fen);
    expect(play(`${start} Rxe2 Nxe2`).fen()).toBe(knight.fen);
    expect([rook.right, knight.right]).toEqual(["e8e2", "c6d4"]);
    // До жертвы слона e2 защищают три фигуры; после Кd4 конь e2 атакован дважды, а уйти не может: за ним ферзь.
    expect(play(start).attackers("e2", "w").sort()).toEqual(["d1", "f1", "g1"]);
    const pinned = play(`${start} Rxe2 Nxe2 Nd4`);
    expect(pinned.attackers("e2", "b").sort()).toEqual(["d4", "g4"]);
    expect(pinned.attackers("e2", "w").sort()).toEqual(["d1", "f1"]);
    const attack = `${start} Rxe2 Nxe2 Nd4 Qb1 Bxe2+ Kf2 Ng4+ Kg1 Nf3+ gxf3 Qd4+ Kg2 Qf2+ Kh3 Qxf3+ Kh4 Nh6 Qg1 Nf5+ Kg5`;
    const mate = COURSE_5_LESSONS.find((l) => l.id === "c5-morphy-pin")!.exercises.find(
      (e) => e.id === "c5-morphy-pin-mate",
    )!;
    if (mate.kind !== "move") throw new Error("финал партии — упражнение на мат");
    expect(play(attack).fen()).toBe(mate.fen);
    expect(matingMoves(mate.fen)).toEqual(["f3h5"]);
  });

  it("отвлечение в защите: грозит Фg2#, спасает только Лc8+ — и после Фxc8 следует Лxc8#", () => {
    const { fen, right, wrong } = choose("c5-deflection-defence", "c5-deflection-defence-rook");
    expect([right, wrong]).toEqual(["c2c8", ["c2c3"]]);
    expect(matingMoves(fen.replace(" w ", " b "))).toEqual(["h3g2"]);
    const safe = new Chess(fen).moves().filter((san) => matingMoves(after(fen, san).fen()).length === 0);
    expect(safe).toEqual(["Rc8+"]);
    expect(after(fen, "Rc8+").moves()).toEqual(["Qxc8"]);
    expect(matingMoves(after(fen, "Rc8+", "Qxc8").fen())).toEqual(["c1c8"]);
  });

  it("завлечение под вилку: Лh8+ Крxh8, Кxf7+ — конь забирает ферзя; сразу Кxf7 теряет коня", () => {
    const { fen, right, wrong } = choose("c5-decoy-fork", "c5-decoy-fork-rook");
    expect([right, wrong]).toEqual(["h1h8", ["g5f7"]]);
    const start = balance(fen);
    expect(after(fen, "Rh8+").moves()).toEqual(["Kxh8"]);
    const fork = after(fen, "Rh8+", "Kxh8", "Nxf7+");
    for (const reply of fork.moves()) expect(balance(after(fork.fen(), reply, "Nxd6").fen()), reply).toBe(start + 5);
    expect(balance(after(fen, "Nxf7", "Kxf7").fen())).toBe(start - 2);
  });

  it("Фишер — Решевский (Нью-Йорк, 1958): после 11. Кe6 чёрные теряют ферзя, а на Крxe6 — мат шахами", () => {
    const start = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nc3 Bg7 Be3 Nf6 Bc4 O-O Bb3 Na5 e5 Ne8";
    const bishop = choose("c5-fischer", "c5-fischer-bishop");
    const knight = choose("c5-fischer", "c5-fischer-knight");
    expect(play(start).fen()).toBe(bishop.fen);
    expect(play(`${start} Bxf7+ Kxf7`).fen()).toBe(knight.fen);
    expect([bishop.right, knight.right]).toEqual(["b3f7", "d4e6"]);
    expect(play(`${start} Bxf7+ Kxf7 Ne6 dxe6 Qxd8`).isGameOver()).toBe(false);
    const losesQueen = (position: string) =>
      new Chess(position).moves().filter(
        (san) =>
          !after(position, san)
            .moves({ verbose: true })
            .some((m) => m.captured === "q"),
      );
    // Король взял слона: после Кe6 ферзь теряется при любом ответе, кроме взятия коня королём.
    expect(losesQueen(after(knight.fen, "Ne6").fen())).toEqual(["Kxe6"]);
    // Слона взяла ладья или король ушёл в угол — конь всё равно ловит ферзя.
    expect(losesQueen(after(bishop.fen, "Bxf7+", "Rxf7", "Ne6").fen())).toEqual([]);
    expect(losesQueen(after(bishop.fen, "Bxf7+", "Kh8", "Ne6").fen())).toEqual([]);
    // 11... Крxe6 12. Фd5+ Крf5 13. g4+ Крxg4 — ответы единственные, дальше мат шахами не позже чем в 4 хода.
    const walk = after(knight.fen, "Ne6", "Kxe6", "Qd5+");
    expect(walk.moves()).toEqual(["Kf5"]);
    walk.move("Kf5");
    walk.move("g4+");
    expect(walk.moves()).toEqual(["Kxg4"]);
    walk.move("Kxg4");
    expect(mateInChecks(walk.fen(), 4)).toBe(true);
  });

  it("захват пункта: после Лxf6 взятие ладьи ведёт к Фxh7#, иначе у белых лишний конь", () => {
    const { fen, right, wrong } = choose("c5-seize-point", "c5-seize-point-rook");
    expect([right, wrong]).toEqual(["f1f6", ["d3h7"]]);
    expect(balance(fen)).toBe(0);
    const c = after(fen, "Rxf6");
    const alive = c.moves().filter((san) => matingMoves(after(c.fen(), san).fen()).length === 0);
    expect(alive.sort()).toEqual(["Bf5", "Re8", "g6"]);
    for (const san of alive) expect(balance(after(c.fen(), san).fen()), san).toBe(3);
    for (const san of ["Qxf6", "gxf6"]) expect(matingMoves(after(c.fen(), san).fen()), san).toEqual(["d3h7"]);
    expect(after(fen, "Qxh7+").moves()).toEqual(["Nxh7"]);
  });

  it("Греко (около 1620): позиции из партии, шах пешкой открывает ладью h1, партия кончается матом", () => {
    const start = "e4 e6 d4 Nf6 Bd3 Nc6 Nf3 Be7 h4 O-O e5 Nd5";
    const { fen, right } = choose("c5-h7-greco", "c5-h7-greco-bishop");
    expect(play(start).fen()).toBe(fen);
    expect(right).toBe("d3h7");
    const opened = play(`${start} Bxh7+ Kxh7 Ng5+ Bxg5 hxg5+`);
    expect(opened.attackers("h7", "w")).toEqual(["h1"]);
    const mate = COURSE_5_LESSONS.find((l) => l.id === "c5-h7-greco")!.exercises.find(
      (e) => e.id === "c5-h7-greco-mate",
    )!;
    if (mate.kind !== "move") throw new Error("финал партии — упражнение на мат");
    expect(play(`${start} Bxh7+ Kxh7 Ng5+ Bxg5 hxg5+ Kg8 Qh5 f5 g6 Re8`).fen()).toBe(mate.fen);
    expect(matingMoves(mate.fen)).toEqual(["h5h8"]);
  });

  it("жертва на h6: если слона взять — мат в два хода; если не брать — белые выиграли пешку", () => {
    const { fen, right, wrong } = choose("c5-h6-sac", "c5-h6-sac-bishop");
    expect([right, wrong]).toEqual(["e3h6", ["d2d4"]]);
    const start = balance(fen);
    const c = after(fen, "Bxh6");
    expect(matingMovesIn(after(c.fen(), "gxh6").fen(), 2)).toEqual(["d2h6"]);
    for (const san of c.moves().filter((m) => m !== "gxh6"))
      expect(balance(after(c.fen(), san).fen()), san).toBe(start + 1);
    expect(matingMoves(after(fen, "Qd4", "f6").fen())).toEqual([]);
  });

  it("жертва на f6: Кf6+ — единственный мат в три хода", () => {
    const { fen, right, wrong } = choose("c5-f6-sac", "c5-f6-sac-knight");
    expect([right, wrong]).toEqual(["e4f6", ["d3g3"]]);
    expect(matingMovesIn(fen, 3)).toEqual(["e4f6"]);
    const c = after(fen, "Nf6+");
    expect(c.moves().sort()).toEqual(["Kh8", "gxf6"]);
    expect(matingMoves(after(c.fen(), "Kh8").fen())).toEqual(["d3h7"]);
    const line = after(c.fen(), "gxf6", "Qg3+");
    expect(line.moves()).toEqual(["Kh8"]);
    expect(matingMoves(after(line.fen(), "Kh8").fen())).toEqual(["b2f6"]);
    expect(after(fen, "Qg3").moves()).toContain("g6");
  });

  it("главный принцип атаки: на h7 три белые фигуры против одного короля — Фxh7#", () => {
    const lesson = COURSE_5_LESSONS.find((l) => l.id === "c5-attack-principle")!;
    const quiz = lesson.exercises.find((e) => e.id === "c5-attack-principle-count")!;
    const mate = lesson.exercises.find((e) => e.id === "c5-attack-principle-mate")!;
    if (quiz.kind !== "quiz" || mate.kind !== "move") throw new Error("в уроке вопросы и упражнение на мат");
    const c = new Chess(mate.fen);
    expect(c.attackers("h7", "w").sort()).toEqual(["d3", "g5", "h5"]);
    expect(c.attackers("h7", "b")).toEqual(["g8"]);
    expect(matingMoves(mate.fen)).toEqual(["h5h7"]);
    // Ответы на вопросы совпадают с доской: «три» нападают, защищает «одна — только король».
    expect(quiz.questions[0].fen).toBe(mate.fen);
    expect(quiz.questions[0].options[quiz.questions[0].correct]).toBe("три");
    expect(quiz.questions[1].options[quiz.questions[1].correct]).toBe("одна — только король");
    // У чёрных материала больше — перевес белых только на участке у короля.
    expect(balance(mate.fen)).toBeLessThan(0);
  });

  it("пешечный штурм: hxg6 — единственный мат в три хода; после h6 мата в один ход нет", () => {
    const { fen, right, wrong } = choose("c5-pawn-storm", "c5-pawn-storm-open");
    expect([right, wrong]).toEqual(["h5g6", ["h5h6"]]);
    expect(matingMovesIn(fen, 3)).toEqual(["h5g6"]);
    expect(matingMoves(after(fen, "hxg6", "hxg6").fen())).toContain("h2h8");
    expect(matingMoves(after(fen, "hxg6", "fxg6").fen())).toEqual(["h2h7"]);
    const closed = after(fen, "h6");
    for (const reply of closed.moves()) expect(matingMoves(after(closed.fen(), reply).fen()), reply).toEqual([]);
  });

  it("слабые поля: Фh6 — единственный мат в два хода", () => {
    const { fen, right, wrong } = choose("c5-weak-squares", "c5-weak-squares-queen");
    expect([right, wrong]).toEqual(["d2h6", ["d2d4"]]);
    expect(matingMovesIn(fen, 2)).toEqual(["d2h6"]);
    expect(matesNext(fen, right)).toBe(true);
    expect(matesNext(fen, wrong[0])).toBe(false);
  });

  it("спасение патом: после Фe3+ ответ один — Сxe3, и белым пат; остальные ходы без шаха проигрывают", () => {
    const { fen, right, wrong } = choose("c5-stalemate-save", "c5-stalemate-save-queen");
    expect([right, wrong]).toEqual(["e7e3", ["e7c5"]]);
    expect(balance(fen)).toBeLessThan(0);
    expect(matingMoves(fen.replace(" w ", " b ")).sort()).toEqual(["a2g2", "a2h2"]);
    const c = after(fen, "Qe3+");
    expect(c.moves()).toEqual(["Bxe3"]);
    expect(after(c.fen(), "Bxe3").isStalemate()).toBe(true);
    expect(matingMoves(after(fen, "Qxc5").fen()).sort()).toEqual(["a2g2", "a2h2"]);
    // Любой ход без шаха пропускает мат не позже чем в два хода.
    for (const san of new Chess(fen).moves().filter((m) => !m.includes("+")))
      expect(matingMovesIn(after(fen, san).fen(), 2).length, san).toBeGreaterThan(0);
  });

  it("Таль — Трингов (Амстердам, 1964): позиции из партии, 17. Фe6+ — единственный мат в три хода", () => {
    const start =
      "e4 g6 d4 Bg7 Nc3 d6 Nf3 c6 Bg5 Qb6 Qd2 Qxb2 Rb1 Qa3 Bc4 Qa5 O-O e6 Rfe1 a6 Bf4 e5 dxe5 dxe5 Qd6 Qxc3 Red1 Nd7";
    const bishop = choose("c5-tal", "c5-tal-bishop");
    const queen = choose("c5-tal", "c5-tal-queen");
    expect(play(start).fen()).toBe(bishop.fen);
    expect(play(`${start} Bxf7+ Kxf7 Ng5+ Ke8`).fen()).toBe(queen.fen);
    expect([bishop.right, queen.right]).toEqual(["c4f7", "d6e6"]);
    expect(new Chess(bishop.fen).attackers("f7", "b")).toEqual(["e8"]);
    expect(after(bishop.fen, "Bxf7+", "Kxf7", "Ng5+").moves()).toEqual(["Ke8"]);
    expect(matingMovesIn(queen.fen, 3)).toEqual(["d6e6"]);
    for (const line of [
      ["Qe6+", "Kf8", "Qf7#"],
      ["Qe6+", "Kd8", "Nf7+", "Kc7", "Qd6#"],
      ["Qe6+", "Ne7", "Qf7+", "Kd8", "Ne6#"],
    ])
      expect(after(queen.fen, ...line).isCheckmate(), line.join(" ")).toBe(true);
    expect(after(queen.fen, "Qe6+").moves().sort()).toEqual(["Kd8", "Kf8", "Ne7"]);
  });
});
