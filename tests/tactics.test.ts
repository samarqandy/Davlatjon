/**
 * Тактика: позиции упражнений возможны, а ответ — ровно те ходы, что подходят под приём (проверка независимым кодом).
 */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { CHESS_LEVELS } from "@/content/chess";
import { chessContent } from "@/content/chess/content";
import { TACTICS } from "@/content/chess/tactics";
import { matingMoves } from "@/lib/chess";
import { tacticMoves } from "@/lib/tactics";

const exercises = TACTICS.flatMap((t) => t.exercises);
const ALL = "abcdefgh".split("").flatMap((f) => [1, 2, 3, 4, 5, 6, 7, 8].map((r) => `${f}${r}`));

function legal(fen: string): boolean {
  let c: Chess;
  try {
    c = new Chess(fen);
  } catch {
    return false;
  }
  const waiting = c.turn() === "w" ? "b" : "w";
  const king = c
    .board()
    .flat()
    .find((p) => p?.type === "k" && p.color === waiting);
  return !!king && !c.isAttacked(king.square, c.turn()) && c.moves().length > 0;
}

describe("тактика: структура", () => {
  it("темы: четыре, у каждой урок, словарик и упражнения; id не повторяются и не пересекаются с уровнями", () => {
    expect(TACTICS.map((t) => t.id)).toEqual(["fork", "pin", "skewer", "discover", "mates", "traps"]);
    const ids = exercises.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    const levelIds = new Set(CHESS_LEVELS.flatMap((l) => l.exercises.map((e) => e.id)));
    for (const id of ids) expect(levelIds.has(id), id).toBe(false);
    for (const t of TACTICS) {
      expect(t.lesson.length, t.id).toBeGreaterThanOrEqual(3);
      expect(t.terms.length, t.id).toBeGreaterThan(0);
      expect(t.exercises.filter((e) => e.kind === "move").length, t.id).toBeGreaterThanOrEqual(2);
      expect(
        t.exercises.some((e) => e.kind === "quiz"),
        t.id,
      ).toBe(true);
      for (const e of t.exercises) expect(e.id.startsWith(`tac-${t.id}-`), e.id).toBe(true);
    }
  });

  it("доски уроков читаются, подсветка и стрелки — на существующих клетках", () => {
    for (const t of TACTICS)
      for (const card of t.lesson) {
        if (!card.demo) continue;
        expect(() => new Chess(card.demo!.fen), `${t.id}: ${card.title}`).not.toThrow();
        for (const sq of [...(card.demo.highlight ?? []), ...(card.demo.arrows ?? []).flat()])
          expect(ALL, `${t.id}: ${card.title}`).toContain(sq);
      }
  });
});

describe("тактика: ответы", () => {
  const moves = exercises.flatMap((e) => (e.kind === "move" ? [e] : []));

  it("позиции упражнений возможны; белые или чёрные — те, чей ход, а ответ — настоящий ход", () => {
    expect(moves.length).toBeGreaterThanOrEqual(16);
    for (const e of moves) {
      expect(legal(e.fen), e.id).toBe(true);
      const uci = new Chess(e.fen).moves({ verbose: true }).map((m) => `${m.from}${m.to}${m.promotion ?? ""}`);
      for (const s of e.solutions) expect(uci, e.id).toContain(s);
    }
  });

  it("ответ — ровно те ходы, которые подходят под приём (двойной удар, связка, сквозной удар, открытый шах)", () => {
    for (const e of moves) {
      expect(["double", "pin", "skewer", "discover", "mate"], e.id).toContain(e.goal);
      const expected =
        e.goal === "mate" ? matingMoves(e.fen) : tacticMoves(e.fen, e.goal as "double" | "pin" | "skewer" | "discover");
      expect([...e.solutions].sort(), e.id).toEqual([...expected].sort());
    }
  });

  it("в приёмах (не в матовых темах) правильный ход не ставит мат: приём — выигрыш материала", () => {
    for (const e of moves.filter((x) => x.goal !== "mate"))
      for (const s of e.solutions) {
        const c = new Chess(e.fen);
        c.move({ from: s.slice(0, 2), to: s.slice(2, 4), promotion: s[4] });
        expect(c.isCheckmate(), e.id).toBe(false);
      }
  });

  it("вопросы: правильный ответ существует, у вопроса с доской позиция возможна", () => {
    for (const e of exercises) {
      if (e.kind !== "quiz") continue;
      for (const q of e.questions) {
        expect(q.options.length, e.id).toBeGreaterThanOrEqual(2);
        expect(q.correct, e.id).toBeGreaterThanOrEqual(0);
        expect(q.correct, e.id).toBeLessThan(q.options.length);
        if (q.fen) expect(legal(q.fen), e.id).toBe(true);
      }
    }
  });
});

describe("тактика: узбекская версия", () => {
  it("позиции и ответы те же, в узбекском тексте нет кириллицы, число вариантов в вопросах совпадает", () => {
    const ru = chessContent("ru").tactics;
    const uz = chessContent("uz").tactics;
    expect(uz.map((t) => t.id)).toEqual(ru.map((t) => t.id));
    for (const [i, t] of ru.entries()) {
      expect(uz[i].exercises.length).toBe(t.exercises.length);
      for (const [j, e] of t.exercises.entries()) {
        const u = uz[i].exercises[j];
        expect(u.id).toBe(e.id);
        if (e.kind === "move" && u.kind === "move") {
          expect(u.fen).toBe(e.fen);
          expect(u.solutions).toEqual(e.solutions);
        }
        if (e.kind === "quiz" && u.kind === "quiz")
          e.questions.forEach((q, k) => {
            expect(u.questions[k].options.length).toBe(q.options.length);
            expect(u.questions[k].correct).toBe(q.correct);
          });
        expect(JSON.stringify(u), e.id).not.toMatch(/[А-Яа-яЁё]/);
      }
      expect(JSON.stringify(uz[i].lesson.map((c) => [c.title, c.text])), t.id).not.toMatch(/[А-Яа-яЁё]/);
    }
  });
});
