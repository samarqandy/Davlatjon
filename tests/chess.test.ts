/**
 * Шахматная школа: каждая позиция и каждый ответ проверяются библиотекой chess.js
 * и независимым перебором.
 */
import { Chess, type Square } from "chess.js";
import { describe, expect, it } from "vitest";
import { CHESS_LEVELS, allChessExercises, chessGlossary } from "@/content/chess";
import type { ChessExercise } from "@/content/chess/types";
import {
  PIECE_VALUE,
  isLightSquare,
  legalTargets,
  matingMoves,
  pieceTargets,
  playMove,
  queensAttack,
  queensInConflict,
  queensSolutions,
  ruSan,
  shortestStarsPath,
  squareName,
  type PieceType,
} from "@/lib/chess";

type Of<K extends ChessExercise["kind"]> = Extract<ChessExercise, { kind: K }>;
const exercises = allChessExercises().map((x) => x.exercise);
const byKind = <K extends ChessExercise["kind"]>(kind: K) => exercises.filter((e): e is Of<K> => e.kind === kind);
const exercise = <K extends ChessExercise["kind"]>(id: string, kind: K) => {
  const e = exercises.find((x) => x.id === id);
  if (!e || e.kind !== kind) throw new Error(`Нет упражнения ${id} (${kind})`);
  return e as Of<K>;
};

const ALL_SQUARES = Array.from({ length: 64 }, (_, i) => squareName(i % 8, Math.floor(i / 8) + 1));
const load = (fen: string) => new Chess(fen, { skipValidation: true });

/** Позиция по-настоящему возможна: оба короля на месте, и у того, кто не ходит, нет шаха. */
function isLegalPosition(fen: string): boolean {
  let chess: Chess;
  try {
    chess = new Chess(fen);
  } catch {
    return false;
  }
  const waiting = chess.turn() === "w" ? "b" : "w";
  const king = chess
    .board()
    .flat()
    .find((p) => p?.type === "k" && p.color === waiting);
  return !!king && !chess.isAttacked(king.square, chess.turn());
}

/** FEN из набора фигур (без звёздочек). */
function fenFromPieces(pieces: Record<string, string>, turn: "w" | "b" = "w"): string {
  const rows: string[] = [];
  for (let r = 8; r >= 1; r--) {
    let row = "";
    let empty = 0;
    for (let c = 0; c < 8; c++) {
      const p = pieces[squareName(c, r)];
      if (!p || p === "star") {
        empty++;
        continue;
      }
      if (empty) row += empty;
      empty = 0;
      row += p[0] === "w" ? p[1].toUpperCase() : p[1].toLowerCase();
    }
    rows.push(row + (empty ? empty : ""));
  }
  return `${rows.join("/")} ${turn} - - 0 1`;
}

/** Независимые правила ходов (без учёта шахов) — для учебных позиций без королей. */
function simpleTargets(fen: string, from: string): string[] {
  const chess = load(fen);
  const piece = chess.get(from as Square)!;
  const at = (sq: string) => chess.get(sq as Square);
  const [fc, fr] = [from.charCodeAt(0) - 97, Number(from[1])];
  const inside = (c: number, r: number) => c >= 0 && c < 8 && r >= 1 && r <= 8;
  const out: string[] = [];
  const tryAdd = (c: number, r: number) => {
    if (!inside(c, r)) return false;
    const sq = squareName(c, r);
    const other = at(sq);
    if (!other) {
      out.push(sq);
      return true;
    }
    if (other.color !== piece.color) out.push(sq);
    return false;
  };
  const ray = (dirs: number[][]) => {
    for (const [dc, dr] of dirs) for (let k = 1; tryAdd(fc + dc * k, fr + dr * k); k++);
  };
  const diag = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const line = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  switch (piece.type) {
    case "n":
      for (const [dc, dr] of [
        [1, 2],
        [2, 1],
        [2, -1],
        [1, -2],
        [-1, -2],
        [-2, -1],
        [-2, 1],
        [-1, 2],
      ])
        tryAdd(fc + dc, fr + dr);
      break;
    case "b":
      ray(diag);
      break;
    case "r":
      ray(line);
      break;
    case "q":
      ray([...diag, ...line]);
      break;
    case "p": {
      const dir = piece.color === "w" ? 1 : -1;
      const start = piece.color === "w" ? 2 : 7;
      if (inside(fc, fr + dir) && !at(squareName(fc, fr + dir))) {
        out.push(squareName(fc, fr + dir));
        if (fr === start && !at(squareName(fc, fr + 2 * dir))) out.push(squareName(fc, fr + 2 * dir));
      }
      for (const dc of [-1, 1]) {
        if (!inside(fc + dc, fr + dir)) continue;
        const other = at(squareName(fc + dc, fr + dir));
        if (other && other.color !== piece.color) out.push(squareName(fc + dc, fr + dir));
      }
      break;
    }
    case "k":
      for (const [dc, dr] of [...diag, ...line]) tryAdd(fc + dc, fr + dr);
      break;
  }
  return out.sort();
}

/** Все клетки из текста вида «a1 → b3 → c5». */
const routeIn = (text: string) => text.match(/[a-h][1-8](?: → [a-h][1-8])+/)?.[0].split(" → ") ?? null;

describe("шахматная школа: структура", () => {
  it("шесть уровней по порядку: Пешка, Конь, Слон, Ладья, Ферзь, Король", () => {
    expect(CHESS_LEVELS.map((l) => l.id)).toEqual(["pawn", "knight", "bishop", "rook", "queen", "king"]);
    expect(CHESS_LEVELS.map((l) => l.order)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(CHESS_LEVELS.map((l) => l.uz)).toEqual(["piyoda", "ot", "fil", "rux", "farzin", "shoh"]);
  });

  it("в каждом уровне есть урок, правила, термины, факты и упражнения", () => {
    for (const l of CHESS_LEVELS) {
      expect(l.lesson.length, l.id).toBeGreaterThanOrEqual(3);
      expect(l.rules.length, l.id).toBeGreaterThanOrEqual(3);
      expect(l.terms.length, l.id).toBeGreaterThanOrEqual(3);
      expect(l.facts.length, l.id).toBeGreaterThanOrEqual(3);
      expect(l.exercises.length, l.id).toBeGreaterThanOrEqual(6);
      expect(
        l.terms.some((t) => t.uz === l.uz),
        l.id,
      ).toBe(true);
      for (const e of l.exercises) {
        expect(e.id.startsWith(`${l.id}-`), e.id).toBe(true);
        expect(e.hint.length, e.id).toBeGreaterThan(20);
        expect(e.why.length, e.id).toBeGreaterThan(20);
      }
    }
    const ids = exercises.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    const terms = chessGlossary().map((t) => t.term);
    expect(new Set(terms).size).toBe(terms.length);
  });

  it("все позиции читаются, а в задачах на ход — возможны в настоящей партии", () => {
    for (const l of CHESS_LEVELS) {
      for (const card of l.lesson) {
        if (!card.demo) continue;
        expect(() => load(card.demo!.fen), `${l.id}: ${card.title}`).not.toThrow();
        for (const sq of [...(card.demo.highlight ?? []), ...(card.demo.arrows ?? []).flat()])
          expect(ALL_SQUARES, `${l.id}: ${card.title}`).toContain(sq);
      }
    }
    for (const e of byKind("move")) {
      if (e.goal === "promote") continue;
      expect(isLegalPosition(e.fen), e.id).toBe(true);
    }
    for (const e of byKind("quiz"))
      for (const q of e.questions) if (q.fen) expect(isLegalPosition(q.fen), e.id).toBe(true);
  });
});

describe("шахматная школа: ответы", () => {
  it("«найди клетку»: все клетки существуют и не повторяются", () => {
    for (const e of byKind("squares")) {
      e.targets.forEach((t) => expect(ALL_SQUARES).toContain(t));
      expect(new Set(e.targets).size).toBe(e.targets.length);
    }
  });

  it("«куда пойдёт фигура»: ответ совпадает с chess.js и с независимым подсчётом", () => {
    for (const e of byKind("moves")) {
      const fromChess = legalTargets(e.fen, e.from);
      expect([...e.answer].sort(), e.id).toEqual(fromChess);
      const hasKings = /k/.test(e.fen.split(" ")[0]) && /K/.test(e.fen.split(" ")[0]);
      // Без королей шахов нет — правила ходов считаем сами.
      if (!hasKings) expect(simpleTargets(e.fen, e.from), e.id).toEqual(fromChess);
    }
  });

  it("звёздочки: наименьшее число ходов совпадает с поиском в ширину, путь из объяснения — правильный", () => {
    for (const e of byKind("stars")) {
      const puzzle = { size: { cols: 8, rows: 8 }, piece: e.piece, start: e.start, stars: e.stars, blocks: e.blocks };
      const path = shortestStarsPath(puzzle);
      expect(path, e.id).not.toBeNull();
      expect(path!.length, e.id).toBe(e.optimal);
      const route = routeIn(e.why);
      expect(route, e.id).not.toBeNull();
      expect(route![0]).toBe(e.start);
      const blocked = new Set(e.blocks ?? []);
      for (let i = 1; i < route!.length; i++)
        expect(pieceTargets(e.piece, route![i - 1], puzzle.size, blocked), `${e.id}: ход ${i}`).toContain(route![i]);
      expect(route!.length - 1).toBe(e.optimal);
      e.stars.forEach((s) => expect(route, e.id).toContain(s));
      [...e.stars, ...(e.blocks ?? [])].forEach((s) => expect(s).not.toBe(e.start));
    }
  });

  it("правила ходов учебной доски совпадают с chess.js", () => {
    const types: Exclude<PieceType, "p">[] = ["n", "b", "r", "q", "k"];
    let seed = 7;
    const rand = (n: number) => {
      seed = (seed * 1103515245 + 12345) % 2 ** 31;
      return seed % n;
    };
    for (let round = 0; round < 60; round++) {
      const type = types[round % types.length];
      const from = ALL_SQUARES[rand(64)];
      const blocks = new Set(Array.from({ length: 6 }, () => ALL_SQUARES[rand(48) + 8]).filter((s) => s !== from));
      const pieces: Record<string, string> = { [from]: `w${type.toUpperCase()}` };
      blocks.forEach((b) => (pieces[b] = "wP"));
      const fen = fenFromPieces(pieces);
      expect(pieceTargets(type, from, { cols: 8, rows: 8 }, blocks), `${type} ${from}`).toEqual(
        legalTargets(fen, from),
      );
    }
  });

  it("найди ход: ответы — ровно те ходы, что подходят под задачу", () => {
    const recapturable = (fen: string, uci: string) => {
      const after = playMove(fen, uci.slice(0, 2), uci.slice(2, 4))!;
      return load(after.fen)
        .moves({ verbose: true })
        .some((m) => m.to === uci.slice(2, 4));
    };
    for (const e of byKind("move")) {
      const all = load(e.fen).moves({ verbose: true });
      const uci = (m: (typeof all)[number]) => `${m.from}${m.to}${m.promotion ?? ""}`;
      let expected: string[];
      switch (e.goal) {
        case "mate":
          expected = matingMoves(e.fen);
          break;
        case "capture":
          expected = all.filter((m) => m.captured && !recapturable(e.fen, uci(m))).map(uci);
          break;
        case "promote":
          expected = all.filter((m) => m.promotion === "q").map(uci);
          break;
        case "castle":
          expected = all.filter((m) => m.isKingsideCastle() || m.isQueensideCastle()).map(uci);
          break;
        case "fork":
          expected = all
            .filter((m) => {
              const after = load(e.fen);
              after.move(m);
              if (!after.inCheck()) return false;
              return after
                .board()
                .flat()
                .some(
                  (p) =>
                    p &&
                    p.color !== m.color &&
                    p.type !== "k" &&
                    PIECE_VALUE[p.type] >= 3 &&
                    after.attackers(p.square, m.color).includes(m.to),
                );
            })
            .map(uci);
          break;
      }
      expect([...e.solutions].sort(), e.id).toEqual(expected.sort());
    }
  });

  it("нажми на клетку", () => {
    const whoChecks = exercise("king-who-checks", "pick");
    const fen = fenFromPieces(whoChecks.pieces);
    expect(isLegalPosition(fen)).toBe(true);
    expect(load(fen).inCheck()).toBe(true);
    expect(load(fen).attackers("e1", "b").sort()).toEqual(whoChecks.answer);

    const star = exercise("bishop-unreachable", "pick");
    const start = Object.keys(star.pieces).find((s) => star.pieces[s] === "wB")!;
    const stars = Object.keys(star.pieces).filter((s) => star.pieces[s] === "star");
    const unreachable = stars.filter(
      (s) => shortestStarsPath({ size: { cols: 8, rows: 8 }, piece: "b", start, stars: [s] }) === null,
    );
    expect(unreachable).toEqual(star.answer);
    expect(stars.filter((s) => isLightSquare(s) !== isLightSquare(start))).toEqual(star.answer);
  });

  it("вопросы с досками и числами", () => {
    const mateQuiz = exercise("king-mate-or-stalemate", "quiz");
    for (const q of mateQuiz.questions) {
      const c = new Chess(q.fen!);
      const truth = c.isCheckmate() ? "Мат" : c.isStalemate() ? "Пат" : c.inCheck() ? "Шах" : "—";
      expect(q.options[q.correct]).toBe(truth);
    }
    const count = (piece: string, sq: string) => legalTargets(fenFromPieces({ [sq]: piece }), sq).length;
    const queenQuiz = exercise("queen-quiz", "quiz");
    expect(Number(queenQuiz.questions[0].options[queenQuiz.questions[0].correct])).toBe(count("wQ", "d4"));
    expect(Number(queenQuiz.questions[1].options[queenQuiz.questions[1].correct])).toBe(count("wQ", "a1"));
    const bishopQuiz = exercise("bishop-quiz", "quiz");
    expect(Number(bishopQuiz.questions[0].options[bishopQuiz.questions[0].correct])).toBe(count("wB", "d4"));
    const rookQuiz = exercise("rook-quiz", "quiz");
    expect(Number(rookQuiz.questions[0].options[rookQuiz.questions[0].correct])).toBe(count("wR", "a1"));
    const knightQuiz = exercise("knight-quiz", "quiz");
    expect(Number(knightQuiz.questions[2].options[knightQuiz.questions[2].correct])).toBe(count("wN", "a1"));
    const board = exercise("pawn-board-quiz", "quiz");
    expect(board.questions[0].options[board.questions[0].correct]).toBe(isLightSquare("h1") ? "Светлая" : "Тёмная");
    expect(board.questions[1].options[board.questions[1].correct]).toBe(isLightSquare("a1") ? "Светлая" : "Тёмная");
    expect(load(board.questions[2].fen!).get(board.questions[2].options[board.questions[2].correct] as Square)).toEqual(
      { type: "q", color: "w" },
    );
    for (const e of byKind("quiz"))
      for (const q of e.questions) {
        expect(q.correct, e.id).toBeGreaterThanOrEqual(0);
        expect(q.correct, e.id).toBeLessThan(q.options.length);
      }
  });

  it("ферзи: у доски 4 × 4 два решения — и они названы в объяснении", () => {
    for (const e of byKind("queens")) {
      const sols = queensSolutions(e.size);
      expect(sols.length, e.id).toBeGreaterThan(0);
      for (const s of sols) expect(queensInConflict(s)).toEqual([]);
      for (const s of sols) for (const sq of s) expect(e.why).toContain(sq);
    }
    expect(queensSolutions(4)).toHaveLength(2);
    expect(queensSolutions(5)).toHaveLength(10);
    expect(queensSolutions(8)).toHaveLength(92);
    expect(queensAttack("a1", "h8")).toBe(true);
    expect(queensAttack("a1", "b3")).toBe(false);
  });
});

describe("шахматная логика", () => {
  it("цвет клеток и русская запись ходов", () => {
    expect([isLightSquare("a1"), isLightSquare("h1"), isLightSquare("e4"), isLightSquare("d4")]).toEqual([
      false,
      true,
      true,
      false,
    ]);
    expect(ruSan("Re8#")).toBe("Лe8#");
    expect(ruSan("Nxf7+")).toBe("Кxf7+");
    expect(ruSan("exd8=Q")).toBe("exd8=Ф");
    expect(ruSan("O-O")).toBe("0-0");
    expect(ruSan("Kf1")).toBe("Крf1");
  });

  it("ход пешкой с превращением и мат", () => {
    const promo = playMove("8/4P3/8/8/8/8/8/8 w - - 0 1", "e7", "e8");
    expect(promo?.san).toBe("e8=Q");
    expect(playMove("6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1", "a1", "a8")?.mate).toBe(true);
    expect(playMove("6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1", "a1", "b2")).toBeNull();
  });
});

describe("шахматная школа: текст", () => {
  const texts: { id: string; text: string }[] = [];
  for (const l of CHESS_LEVELS) {
    texts.push(...[l.title, l.goal, ...l.rules, ...l.facts].map((text) => ({ id: l.id, text })));
    for (const c of l.lesson) texts.push(...[c.title, ...c.text].map((text) => ({ id: l.id, text })));
    for (const t of l.terms) texts.push({ id: l.id, text: `${t.term} ${t.text}` });
    for (const e of l.exercises) {
      texts.push(...[e.title, e.prompt, e.hint, e.why].map((text) => ({ id: e.id, text })));
      if (e.kind === "quiz")
        for (const q of e.questions) texts.push(...[q.text, ...q.options].map((text) => ({ id: e.id, text })));
    }
  }

  it("без латинских букв внутри русских слов и без слова «неправильно»", () => {
    for (const { id, text } of texts) {
      expect(text.match(/[А-Яа-яЁё]+[A-Za-z]+[А-Яа-яЁё]*|[A-Za-z]+[А-Яа-яЁё]+/g), `${id}: ${text}`).toBeNull();
      expect(/неправильн/i.test(text), `${id}: ${text}`).toBe(false);
    }
  });

  it("разметка сбалансирована, нет двойных пробелов", () => {
    for (const { id, text } of texts) {
      expect((text.match(/\*\*/g) ?? []).length % 2, `${id}: ${text}`).toBe(0);
      expect((text.match(/`/g) ?? []).length % 2, `${id}: ${text}`).toBe(0);
      expect(/ {2,}/.test(text), `${id}: ${text}`).toBe(false);
      expect(/ [,.!?:;]/.test(text.replace(/`[^`]*`/g, "X")), `${id}: ${text}`).toBe(false);
    }
  });
});
