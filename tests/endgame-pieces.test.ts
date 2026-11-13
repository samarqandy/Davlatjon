/**
 * Школа эндшпиля, часть 2 (ладья, ферзь, слон): позиции настоящие, а «верно» и «неверно» в упражнениях —
 * точный результат по таблицам окончаний. Ответы таблиц записаны в tests/fixtures/endgame-tablebase.json
 * (сверка с самими таблицами — `node scripts/check-endgames.mjs`, ей нужна сеть).
 */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { chessContent } from "@/content/chess/content";
import { ENDGAME_PIECES } from "@/content/chess/endgamePieces";
import { endgamePiecesUz } from "@/content/chess/uz/endgamePieces";
import tablebase from "./fixtures/endgame-tablebase.json";

type Result = "win" | "draw" | "loss";
const RANK: Record<Result, number> = { loss: 0, draw: 1, win: 2 };
const TABLE = tablebase.positions as Record<string, { result: Result; moves: Record<string, Result> }>;

const exercises = ENDGAME_PIECES.flatMap((t) => t.exercises);
const byId = (id: string) => {
  const e = exercises.find((x) => x.id === id);
  if (!e) throw new Error(`нет упражнения ${id}`);
  return e;
};
/** Позиция после ходов в записи UCI. */
function after(fen: string, ...moves: string[]): Chess {
  const c = new Chess(fen);
  for (const u of moves) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
  return c;
}
/** Цвет клетки: a1 — тёмная. */
const dark = (sq: string) => (sq.charCodeAt(0) - 96 + Number(sq[1])) % 2 === 0;

describe("эндшпиль: ладья, ферзь и слон", () => {
  it("пять уроков: в каждом рассказ с доской, словарик и не меньше двух упражнений", () => {
    expect(ENDGAME_PIECES.map((t) => t.id)).toEqual([
      "eg-lucena",
      "eg-philidor",
      "eg-queen-pawn",
      "eg-queen-rook-pawn",
      "eg-wrong-bishop",
    ]);
    const ids = exercises.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of ENDGAME_PIECES) {
      expect(t.lesson.length, t.id).toBeGreaterThanOrEqual(2);
      expect(
        t.lesson.some((card) => card.demo),
        t.id,
      ).toBe(true);
      expect(t.terms.length, t.id).toBeGreaterThanOrEqual(1);
      expect(t.exercises.length, t.id).toBeGreaterThanOrEqual(2);
      for (const e of t.exercises) expect(e.id.startsWith(`${t.id}-`), e.id).toBe(true);
    }
  });

  it("id упражнений не совпадают с упражнениями остальной школы (прогресс хранится по id)", () => {
    const c = chessContent("ru");
    const other = [
      ...c.levels,
      ...c.tactics,
      ...c.course1Lessons,
      ...c.course2Lessons,
      ...c.course3Lessons,
      ...c.course4Lessons,
      ...c.course5Lessons,
    ].flatMap((x) => x.exercises.map((e) => e.id));
    for (const e of exercises) expect(other, e.id).not.toContain(e.id);
  });

  it("каждая позиция (урок, упражнение, вопрос) — настоящая и записана в таблице результатов", () => {
    const fens = [
      ...ENDGAME_PIECES.flatMap((t) => t.lesson.flatMap((card) => (card.demo ? [card.demo.fen] : []))),
      ...exercises.flatMap((e) =>
        e.kind === "choose" ? [e.fen] : e.kind === "quiz" ? e.questions.flatMap((q) => (q.fen ? [q.fen] : [])) : [],
      ),
    ];
    expect(fens.length).toBeGreaterThanOrEqual(20);
    for (const fen of fens) {
      expect(() => new Chess(fen), fen).not.toThrow();
      expect(TABLE[fen], fen).toBeDefined();
    }
    // И наоборот: в таблице нет позиций, которых уже нет в уроках.
    for (const fen of Object.keys(TABLE)) expect(fens, fen).toContain(fen);
  });

  it("упражнения «как сыграть лучше»: верный ход сохраняет результат позиции, неверный — упускает", () => {
    const choose = exercises.filter((e) => e.kind === "choose");
    expect(choose.length).toBe(9);
    for (const e of choose) {
      expect(e.moves.length, e.id).toBe(2);
      for (const u of e.moves) expect(() => after(e.fen, u), `${e.id}: ${u}`).not.toThrow();
      const saved = TABLE[e.fen];
      const right = saved.moves[e.moves[e.correct]];
      expect(right, e.id).toBe(saved.result);
      for (const [i, u] of e.moves.entries())
        if (i !== e.correct) expect(RANK[saved.moves[u]], `${e.id}: ${u}`).toBeLessThan(RANK[right]);
    }
  });

  it("сильнейшая сторона выигрывает, слабейшая спасается: по таблицам", () => {
    const result = (id: string) => {
      const e = byId(id);
      if (e.kind !== "choose") throw new Error(id);
      return TABLE[e.fen].result;
    };
    for (const id of ["eg-lucena-king", "eg-lucena-bridge", "eg-queen-pawn-check", "eg-queen-pawn-king"])
      expect(result(id), id).toBe("win");
    for (const id of ["eg-philidor-wait", "eg-philidor-back", "eg-queen-rook-pawn-corner", "eg-wrong-bishop-run"])
      expect(result(id), id).toBe("draw");
    expect(result("eg-wrong-bishop-stalemate")).toBe("win");
  });

  it("стрелки в уроках — возможные ходы, которые не портят позицию", () => {
    for (const t of ENDGAME_PIECES)
      for (const card of t.lesson)
        for (const [from, to] of card.demo?.arrows ?? []) {
          const fen = card.demo!.fen;
          expect(() => after(fen, from + to), `${t.id}: ${from}${to}`).not.toThrow();
          expect(TABLE[fen].moves[from + to], `${t.id}: ${from}${to}`).toBe(TABLE[fen].result);
        }
  });

  it("мост: король идёт к ладье, и только потом ладья закрывает его от шаха", () => {
    const king = byId("eg-lucena-king");
    const bridge = byId("eg-lucena-bridge");
    if (king.kind !== "choose" || bridge.kind !== "choose") throw new Error("kind");
    expect(new Chess(king.fen).isCheck()).toBe(true);
    // Ранний мост: ладью забирают с шахом, и король до неё не дотягивается.
    const early = after(king.fen, "c4f4", "f1f4");
    expect(early.isCheck()).toBe(true);
    expect(early.moves({ verbose: true }).some((m) => m.to === "f4")).toBe(false);
    // Верно: Крe5, новый шах — и ладья закрывает короля на e4; это позиция второго упражнения.
    expect(after(king.fen, "f6e5", "f1e1").fen().split(" ")[0]).toBe(bridge.fen.split(" ")[0]);
    expect(after(bridge.fen, "c4e4").isCheck()).toBe(false);
    // Король бросил пешку — её забирают.
    expect(
      after(bridge.fen, "e5f5", "e1e7")
        .board()
        .flat()
        .filter((p) => p?.type === "p"),
    ).toHaveLength(0);
  });

  it("Филидор: после хода пешки ладья шахует сзади; взятие пешки теряет ладью", () => {
    const back = byId("eg-philidor-back");
    if (back.kind !== "choose") throw new Error("kind");
    const lost = after(back.fen, "h6d6", "e5d6");
    expect(
      lost
        .board()
        .flat()
        .filter((p) => p?.type === "r"),
    ).toHaveLength(1);
    // С первой горизонтали ладья даёт шах: 1... Лh1 2. Крe6 Лe1+.
    expect(after(back.fen, "h6h1", "e5e6", "h1e1").isCheck()).toBe(true);
  });

  it("ферзь против пешки: после шаха король встаёт перед пешкой или теряет её; ранний размен — ничья", () => {
    const check = byId("eg-queen-pawn-check");
    const king = byId("eg-queen-pawn-king");
    if (check.kind !== "choose" || king.kind !== "choose") throw new Error("kind");
    const pos = after(check.fen, "f3e3");
    expect(pos.isCheck()).toBe(true);
    expect(
      pos
        .moves({ verbose: true })
        .map((m) => m.to)
        .sort(),
    ).toEqual(["d1", "f1"]);
    expect(() => after(check.fen, "f3e3", "e1f1", "e3d2")).not.toThrow();
    // 1... Крd1 — это позиция второго упражнения.
    expect(after(check.fen, "f3e3", "e1d1").fen().split(" ")[0]).toBe(king.fen.split(" ")[0]);
    // Король пошёл вместо шаха — пешка превращается.
    expect(
      after(check.fen, "a8b7", "d2d1q")
        .board()
        .flat()
        .filter((p) => p?.type === "q"),
    ).toHaveLength(2);
    // Ферзь взял защищённую пешку — его бьют, на доске два короля.
    expect(after(king.fen, "e3d2", "d1d2").isInsufficientMaterial()).toBe(true);
  });

  it("ладейная и слоновая пешка: пат в углу — настоящий", () => {
    const corner = byId("eg-queen-rook-pawn-corner");
    const quiz = byId("eg-queen-rook-pawn-quiz");
    if (corner.kind !== "choose" || quiz.kind !== "quiz") throw new Error("kind");
    expect(new Chess(corner.fen).isCheck()).toBe(true);
    // Король в углу: белый король сделал шаг — пат.
    expect(after(corner.fen, "g1h1", "a8b7").isStalemate()).toBe(true);
    // Король ушёл от угла — пешку забирают.
    expect(() => after(corner.fen, "g1f1", "g3h2")).not.toThrow();
    const [take, step] = quiz.questions;
    expect(after(take.fen!, "g3f2").isStalemate()).toBe(true);
    expect(new Chess(step.fen!).isStalemate()).toBe(true);
    // Ответы: «пат», «пат», «ладейной и слоновой» — и стоят они не всегда первыми.
    expect(quiz.questions.map((q) => q.options[q.correct])).toEqual(["пат", "пат", "ладейной и слоновой"]);
    expect(new Set(quiz.questions.map((q) => q.correct)).size).toBeGreaterThan(1);
  });

  it("слон и крайняя пешка: цвет слона и угла, пат и выигрыш — как в тексте", () => {
    const run = byId("eg-wrong-bishop-run");
    const right = byId("eg-wrong-bishop-stalemate");
    if (run.kind !== "choose" || right.kind !== "choose") throw new Error("kind");
    const bishop = (fen: string) => {
      const c = new Chess(fen);
      for (const row of c.board()) for (const p of row) if (p?.type === "b") return p.square;
      throw new Error("нет слона");
    };
    // Пешка «a» превращается на a8 — белом поле. Слон «не того цвета» — чернопольный.
    expect(dark("a8")).toBe(false);
    expect(dark(bishop(run.fen))).toBe(true);
    expect(dark(bishop(right.fen))).toBe(false);
    // Слон того цвета: Сe4+ Крb8, a7+ Крc8, a8Ф+.
    const line = after(right.fen, "d3e4", "a8b8", "a6a7", "b8c8", "a7a8q");
    expect(line.isCheck()).toBe(true);
    expect(after(right.fen, "d3e4").moves()).toHaveLength(1);
    // Пешка вплотную без шаха — пат.
    expect(after(right.fen, "a6a7").isStalemate()).toBe(true);
  });

  it("узбекский перевод: каждый урок, упражнение и вопрос; столько же карточек и терминов", () => {
    const uz = chessContent("uz").endgamePieces;
    expect(Object.keys(endgamePiecesUz).sort()).toEqual(ENDGAME_PIECES.map((t) => t.id).sort());
    for (const [i, t] of ENDGAME_PIECES.entries()) {
      const u = uz[i];
      expect(u.title, t.id).not.toBe(t.title);
      expect(u.lesson.length, t.id).toBe(t.lesson.length);
      expect(u.terms.length, t.id).toBe(t.terms.length);
      for (const [k, card] of t.lesson.entries()) {
        expect(u.lesson[k].demo, t.id).toEqual(card.demo);
        expect(u.lesson[k].text.length, t.id).toBe(card.text.length);
      }
      for (const [k, e] of t.exercises.entries()) {
        const ue = u.exercises[k];
        const text = JSON.stringify([ue.title, ue.prompt, ue.hint, ue.why, ue.kind === "quiz" ? ue.questions : []]);
        expect(text, e.id).not.toMatch(/[а-яё]/i);
        if (e.kind === "quiz" && ue.kind === "quiz") {
          expect(ue.questions.length, e.id).toBe(e.questions.length);
          for (const [n, q] of e.questions.entries()) {
            expect(ue.questions[n].options.length, e.id).toBe(q.options.length);
            expect(ue.questions[n].fen, e.id).toBe(q.fen);
          }
        }
      }
      expect(JSON.stringify([u.title, u.idea, u.lesson.map((c) => [c.title, c.text]), u.terms]), t.id).not.toMatch(
        /[а-яё]/i,
      );
    }
  });
});
