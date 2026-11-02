/**
 * Курс по ступеням: модули покрывают все уроки, подключённые упражнения существуют,
 * а ответы новых упражнений проверены независимым кодом (chess.js и src/lib/tactics.ts).
 */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { CHESS_RU, chessContent, courseLessons } from "@/content/chess/content";
import type { ChessExercise } from "@/content/chess/types";
import { legalTargets, matingMoves, pieceTargets, shortestStarsPath } from "@/lib/chess";
import { cyrillicPaths } from "@/content/localize";
import { tacticMoves, type TacticGoal } from "@/lib/tactics";

const ALL = "abcdefgh".split("").flatMap((f) => [1, 2, 3, 4, 5, 6, 7, 8].map((r) => `${f}${r}`));
/** Ступени курса: модули и уроки каждой. */
const STEPS = [
  { name: "ступень 1", modules: CHESS_RU.course1Modules, lessons: CHESS_RU.course1Lessons },
  { name: "ступень 2", modules: CHESS_RU.course2Modules, lessons: CHESS_RU.course2Lessons },
  { name: "ступень 3", modules: CHESS_RU.course3Modules, lessons: CHESS_RU.course3Lessons },
];
const allLessons = STEPS.flatMap((s) => s.lessons);
const lessons = courseLessons(CHESS_RU, allLessons);
const own = allLessons.flatMap((l) => l.exercises);
type Of<K extends ChessExercise["kind"]> = Extract<ChessExercise, { kind: K }>;
const byKind = <K extends ChessExercise["kind"]>(k: K) => own.filter((e): e is Of<K> => e.kind === k);

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

describe("курс: структура", () => {
  it("модули перечисляют каждый урок ровно один раз и в порядке уроков", () => {
    for (const step of STEPS)
      expect(
        step.modules.flatMap((m) => m.lessons),
        step.name,
      ).toEqual(step.lessons.map((l) => l.id));
  });

  it("у каждой ступени свои уроки (c1-…, c2-…, c3-…), а id модулей не повторяются между ступенями", () => {
    STEPS.forEach((step, i) => {
      expect(step.lessons.length, step.name).toBeGreaterThan(0);
      for (const l of step.lessons) expect(l.id.startsWith(`c${i + 1}-`), l.id).toBe(true);
    });
    const moduleIds = STEPS.flatMap((s) => s.modules.map((m) => m.id));
    expect(new Set(moduleIds).size).toBe(moduleIds.length);
  });

  it("подключённые упражнения существуют, у каждого урока есть упражнения", () => {
    for (const [i, l] of allLessons.entries()) {
      expect(lessons[i].exercises.length, l.id).toBe(l.refs.length + l.exercises.length);
      expect(lessons[i].exercises.length, l.id).toBeGreaterThan(0);
      expect(lessons[i].lesson.length, l.id).toBeGreaterThan(0);
    }
  });

  it("id уроков и новых упражнений уникальны и не совпадают с уровнями и тактикой", () => {
    const ids = allLessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    const elsewhere = new Set([
      ...CHESS_RU.levels.flatMap((l) => l.exercises.map((e) => e.id)),
      ...CHESS_RU.tactics.flatMap((t) => t.exercises.map((e) => e.id)),
    ]);
    const ownIds = own.map((e) => e.id);
    expect(new Set(ownIds).size).toBe(ownIds.length);
    for (const id of ownIds) expect(elsewhere.has(id), id).toBe(false);
  });

  it("доски уроков: позиции читаются, клетки подсветок и стрелок существуют", () => {
    for (const l of allLessons)
      for (const card of l.lesson) {
        if (!card.demo) continue;
        // Учебные расстановки бывают без королей — читаем без проверки правил, как в уровнях.
        expect(() => new Chess(card.demo!.fen, { skipValidation: true }), l.id).not.toThrow();
        for (const sq of [...(card.demo.highlight ?? []), ...(card.demo.arrows ?? []).flat()])
          expect(ALL, l.id).toContain(sq);
      }
  });
});

describe("курс: ответы", () => {
  it("«найди ход»: позиция возможна, ответ — ровно те ходы, что подходят под задачу", () => {
    const moves = byKind("move");
    expect(moves.length).toBeGreaterThanOrEqual(10);
    for (const e of moves) {
      if (e.goal !== "promote") expect(legal(e.fen), e.id).toBe(true);
      const all = new Chess(e.fen).moves({ verbose: true });
      const uci = (m: (typeof all)[number]) => `${m.from}${m.to}${m.promotion ?? ""}`;
      let expected: string[];
      if (e.goal === "mate") expected = matingMoves(e.fen);
      else if (e.goal === "promote") expected = all.filter((m) => m.promotion === "q").map(uci);
      else if (e.goal === "castle")
        expected = all.filter((m) => m.isKingsideCastle() || m.isQueensideCastle()).map(uci);
      else if (e.goal === "capture")
        expected = all
          .filter((m) => {
            if (!m.captured) return false;
            const after = new Chess(e.fen);
            after.move(m);
            return !after.moves({ verbose: true }).some((x) => x.to === m.to);
          })
          .map(uci);
      else expected = tacticMoves(e.fen, e.goal as TacticGoal);
      expect([...e.solutions].sort(), e.id).toEqual(expected.sort());
    }
  });

  it("«куда пойдёт фигура»: ответ совпадает с chess.js", () => {
    for (const e of byKind("moves")) expect([...e.answer].sort(), e.id).toEqual(legalTargets(e.fen, e.from));
  });

  it("лабиринты: путь в объяснении настоящий и самый короткий", () => {
    const route = (text: string) => text.match(/[a-h][1-8](?: → [a-h][1-8])+/)?.[0].split(" → ") ?? null;
    for (const e of byKind("stars")) {
      const size = { cols: 8, rows: 8 };
      const blocked = new Set(e.blocks ?? []);
      const best = shortestStarsPath({ size, piece: e.piece, start: e.start, stars: e.stars, blocks: e.blocks });
      expect(best?.length, e.id).toBe(e.optimal);
      const r = route(e.why);
      expect(r?.[0], e.id).toBe(e.start);
      expect(r!.length - 1, e.id).toBe(e.optimal);
      for (let i = 1; i < r!.length; i++)
        expect(pieceTargets(e.piece, r![i - 1], size, blocked), e.id).toContain(r![i]);
      for (const s of e.stars) expect(r, e.id).toContain(s);
    }
  });

  it("«как сыграть лучше»: позиция возможна, ходы разные и по правилам, верный ход в списке", () => {
    const choices = byKind("choose");
    expect(choices.length).toBeGreaterThanOrEqual(5);
    for (const e of choices) {
      expect(legal(e.fen), e.id).toBe(true);
      expect(e.moves.length, e.id).toBeGreaterThanOrEqual(2);
      expect(e.moves.length, e.id).toBeLessThanOrEqual(3);
      expect(new Set(e.moves).size, e.id).toBe(e.moves.length);
      expect(e.correct, e.id).toBeGreaterThanOrEqual(0);
      expect(e.correct, e.id).toBeLessThan(e.moves.length);
      const all = new Chess(e.fen).moves({ verbose: true }).map((m) => `${m.from}${m.to}${m.promotion ?? ""}`);
      for (const u of e.moves) expect(all, `${e.id}: ${u}`).toContain(u);
      // Если среди вариантов есть мат — верный ход и есть мат.
      const mates = matingMoves(e.fen);
      if (e.moves.some((u) => mates.includes(u))) expect(mates, e.id).toContain(e.moves[e.correct]);
    }
  });

  it("«найди клетку»: клетки существуют и не повторяются", () => {
    for (const e of byKind("squares")) {
      for (const s of e.targets) expect(ALL, e.id).toContain(s);
      expect(new Set(e.targets).size, e.id).toBe(e.targets.length);
    }
  });

  it("вопросы: правильный ответ существует, позиции при вопросах возможны", () => {
    for (const e of byKind("quiz"))
      for (const q of e.questions) {
        expect(q.options.length, e.id).toBeGreaterThanOrEqual(2);
        expect(q.correct, e.id).toBeGreaterThanOrEqual(0);
        expect(q.correct, e.id).toBeLessThan(q.options.length);
        if (q.fen) expect(legal(q.fen), e.id).toBe(true);
      }
  });
});

describe("курс: узбекская версия", () => {
  it("уроки с подключёнными упражнениями — без кириллицы, ответы те же", () => {
    const content = chessContent("uz");
    const uz = courseLessons(content, [
      ...content.course1Lessons,
      ...content.course2Lessons,
      ...content.course3Lessons,
    ]);
    expect(cyrillicPaths(uz)).toEqual([]);
    expect(uz.map((l) => l.exercises.map((e) => e.id))).toEqual(lessons.map((l) => l.exercises.map((e) => e.id)));
  });
});
