/**
 * Тренажёры расчёта: раунды строятся из банка задач, и каждый ответ — точный.
 * «Не зевни!»: после зевка есть мат в один ход, после двух других ходов — нет. «Ходы в уме»: в позиции, которой
 * нет на доске, мат ставит ровно один из трёх ходов. «Сосчитай удары»: числа совпадают с доской, без «рентгена»
 * и связок.
 */
import fs from "node:fs";
import path from "node:path";
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import {
  blindRound,
  blunderRound,
  countQuestions,
  countRound,
  mateInOne,
  plainSan,
  type DrillSource,
} from "@/lib/calcDrills";

/** Задачи темы из public/puzzles — те же файлы, что грузит страница. */
function bank(name: string): DrillSource[] {
  const file = path.join(process.cwd(), "public", "puzzles", `${name}.json`);
  const rows = JSON.parse(fs.readFileSync(file, "utf8")).puzzles as [string, string, string][];
  return rows.map(([, fen, moves]) => ({ fen, moves: moves.split(" ") }));
}
/** Предсказуемые «случайные» числа, чтобы тест каждый раз шёл одинаково. */
function seeded(seed = 7) {
  let x = seed;
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
}
const play = (fen: string, ...ucis: string[]) => {
  const c = new Chess(fen);
  for (const u of ucis) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
  return c;
};

describe("мат в один ход", () => {
  it("находит мат и не выдумывает его", () => {
    expect(mateInOne("6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1")).toBe("d1d8");
    expect(mateInOne("6k1/5pp1/7p/8/8/8/5PPP/3R2K1 w - - 0 1")).toBeNull();
    expect(mateInOne(new Chess().fen())).toBeNull();
  });
});

describe("«Не зевни!»", () => {
  const rng = seeded();
  const rounds = bank("mate1").flatMap((p) => blunderRound(p, rng) ?? []);

  it("раундов из банка хватает на много подходов", () => {
    expect(rounds.length).toBeGreaterThan(150);
  });

  it("зевок допускает мат в один ход, два других хода — нет; все ходы возможны", () => {
    // Каждый третий раунд: проверка одного — это перебор ответов соперника на три хода, а раундов две сотни.
    for (const r of rounds.filter((_, i) => i % 3 === 0)) {
      expect(r.options, r.fen).toHaveLength(3);
      expect(new Set(r.options).size, r.fen).toBe(3);
      expect(new Chess(r.fen).turn(), r.fen).toBe(r.color);
      r.options.forEach((u, i) => {
        const next = play(r.fen, u);
        const mate = mateInOne(next.fen());
        if (i === r.bad) {
          expect(mate, `${r.fen} ${u}`).not.toBeNull();
          expect(play(next.fen(), r.punish).isCheckmate(), `${r.fen} ${u} ${r.punish}`).toBe(true);
        } else {
          expect(mate, `${r.fen} ${u}`).toBeNull();
          expect(next.isGameOver(), `${r.fen} ${u}`).toBe(false);
        }
      });
    }
  });

  it("зевок стоит на разных местах — не всегда первым", () => {
    expect(new Set(rounds.map((r) => r.bad))).toEqual(new Set([0, 1, 2]));
  });

  it("позиция под шахом и задача без мата не подходят", () => {
    expect(blunderRound({ fen: "4k3/8/8/8/8/8/4r3/4K3 w - - 0 1", moves: ["e1e2"] }, rng)).toBeNull();
    expect(blunderRound({ fen: new Chess().fen(), moves: ["e2e4"] }, rng)).toBeNull();
  });
});

describe("«Ходы в уме»", () => {
  const rng = seeded(11);
  const rounds = bank("mate2").flatMap((p) => blindRound(p, rng) ?? []);

  it("раундов из банка хватает на много подходов", () => {
    expect(rounds.length).toBeGreaterThan(200);
  });

  it("доска показывает позицию до двух ходов; после них мат ставит ровно один из трёх ходов", () => {
    for (const r of rounds) {
      const c = new Chess(r.fen);
      expect(c.turn(), r.fen).toBe(r.color);
      c.move(r.line[0]);
      c.move(r.line[1]);
      expect(c.fen(), r.fen).toBe(r.final);
      expect(new Set(r.options).size, r.fen).toBe(3);
      const mates = r.options.map((u) => play(r.final, u).isCheckmate());
      expect(mates.filter(Boolean), r.fen).toHaveLength(1);
      expect(mates[r.mate], r.fen).toBe(true);
    }
  });

  it("в вариантах ответа нет значков шаха и мата", () => {
    expect(plainSan("Qxf7#")).toBe("Qxf7");
    expect(plainSan("Rd8+")).toBe("Rd8");
    expect(plainSan("O-O")).toBe("O-O");
  });

  it("задача не на мат в два хода не подходит", () => {
    expect(blindRound({ fen: new Chess().fen(), moves: ["e2e4", "e7e5"] }, rng)).toBeNull();
  });
});

describe("«Сосчитай удары»", () => {
  it("считает нападающих и защитников", () => {
    // Белый конь e5: нападают пешка d6 и конь c6, защищают пешка d4 и конь f3.
    const fen = "4k3/8/2np4/4N3/3P4/5N2/8/4K3 w - - 0 1";
    const q = countQuestions(fen).find((x) => x.square === "e5")!;
    expect(q.color).toBe("w");
    expect(q.attackers).toEqual(["c6", "d6"]);
    expect(q.defenders).toEqual(["d4", "f3"]);
  });

  it("не спрашивает про клетку с «рентгеном»: вторая ладья стоит за первой", () => {
    const fen = "3rk3/3r4/8/8/8/8/3N4/3RK3 w - - 0 1";
    expect(countQuestions(fen).find((x) => x.square === "d2")).toBeUndefined();
  });

  it("не спрашивает про связанную фигуру-защитника", () => {
    // Конь c3 защищал бы пешку d5, но он связан слоном b4 с королём e1.
    const fen = "4k3/8/4p3/3P4/1b6/2N5/8/4K3 w - - 0 1";
    expect(countQuestions(fen).find((x) => x.square === "d5")).toBeUndefined();
  });

  it("не спрашивает, когда на доске шах, и про фигуру, на которую никто не нападает", () => {
    expect(countQuestions("4k3/8/8/8/8/8/4r3/4K3 w - - 0 1")).toEqual([]);
    expect(countQuestions(new Chess().fen())).toEqual([]);
  });

  it("на позициях банка: числа совпадают с доской, ответы помещаются в кнопки 0–4", () => {
    const rng = seeded(3);
    let found = 0;
    for (const p of bank("mix").slice(0, 300)) {
      const fen = play(p.fen, p.moves[0]).fen();
      const q = countRound(fen, rng);
      if (!q) continue;
      found++;
      const c = new Chess(fen);
      const piece = c.get(q.square as never)!;
      expect(piece.color, fen).toBe(q.color);
      expect(piece.type, fen).not.toBe("k");
      const enemy = q.color === "w" ? "b" : "w";
      expect(c.attackers(q.square as never, enemy).sort(), fen).toEqual(q.attackers);
      expect(c.attackers(q.square as never, q.color).sort(), fen).toEqual(q.defenders);
      expect(q.attackers.length, fen).toBeGreaterThanOrEqual(1);
      expect(q.attackers.length, fen).toBeLessThanOrEqual(4);
      expect(q.defenders.length, fen).toBeLessThanOrEqual(4);
    }
    expect(found).toBeGreaterThan(200);
  });
});
