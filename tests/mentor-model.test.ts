/** Доска тренера, модель урока: стрелки и знаки, отмена, расстановка, пробные варианты, доски, FEN и PGN. */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { snapshotOf } from "@/lib/board";
import {
  EMPTY_FEN,
  LIMITS,
  PIECE_CODES,
  START_FEN,
  apply,
  currentBoard,
  currentPly,
  fensOf,
  isFenShape,
  isSquare,
  newBoard,
  newLesson,
  normalizeFen,
  parseMentorSetup,
  persistable,
  piecesToFen,
  playUci,
  shapesAt,
  startHistory,
  type Action,
  type History,
  type MentorBoard,
  type Result,
  type ShapeColor,
  type SignKind,
} from "@/lib/mentor/model";
import { parseLesson } from "@/lib/mentor/store";

// ─── Помощники ──────────────────────────────────────────────────────────────

const LINE = ["e2e4", "e7e5", "g1f3", "b8c6"];
const PAWNS_ONLY = "8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1";
const QUEEN_VS_PAWNS = "8/pppppppp/8/8/8/8/8/3Q4 w - - 0 1";
const FILES = "abcdefgh";
const ALL_SQ = [...FILES].flatMap((f) => [1, 2, 3, 4, 5, 6, 7, 8].map((r) => `${f}${r}`));

/** Урок из досок: у каждой — начало и ходы; история пустая, на экране — первая доска, начальная позиция. */
function lessonOf(...boards: Partial<MentorBoard>[]): History {
  const lesson = newLesson("Урок");
  return startHistory({ ...lesson, boards: boards.map((b) => ({ ...newBoard(b.start), ...b })) });
}
const fresh = (start = START_FEN) => lessonOf({ start });
const withLine = (line = LINE, start = START_FEN) => lessonOf({ start, line });

function run(h: History, ...actions: Action[]): Result {
  let r: Result = { history: h };
  for (const a of actions) r = apply(r.history, a);
  return r;
}
const go = (h: History, ...actions: Action[]) => run(h, ...actions).history;
const board = (h: History) => currentBoard(h.doc);
const fen = (h: History) => currentPly(h.doc).fen;
const placement = (f: string) => f.split(" ")[0];
const field = (f: string, i: number) => f.split(" ")[i];

// ─── Стрелки, кольца, знаки ─────────────────────────────────────────────────

describe("стрелки и знаки", () => {
  it("стрелка по двум клеткам добавляется", () => {
    const h = go(fresh(), { t: "arrow", from: "e2", to: "e4", c: "G" });
    expect(shapesAt(board(h), 0).arrows).toEqual([{ from: "e2", to: "e4", c: "G" }]);
    expect(h.past).toHaveLength(1);
  });

  it("та же стрелка того же цвета убирается, и пустой ход не хранится", () => {
    const h = go(fresh(), { t: "arrow", from: "e2", to: "e4", c: "G" }, { t: "arrow", from: "e2", to: "e4", c: "G" });
    expect(shapesAt(board(h), 0).arrows).toEqual([]);
    expect(board(h).shapes).toEqual({});
  });

  it("та же стрелка другого цвета перекрашивается на месте", () => {
    const h = go(
      fresh(),
      { t: "arrow", from: "e2", to: "e4", c: "G" },
      { t: "arrow", from: "d2", to: "d4", c: "B" },
      { t: "arrow", from: "e2", to: "e4", c: "R" },
    );
    expect(shapesAt(board(h), 0).arrows).toEqual([
      { from: "e2", to: "e4", c: "R" },
      { from: "d2", to: "d4", c: "B" },
    ]);
  });

  it("обратная стрелка — другая стрелка", () => {
    const h = go(fresh(), { t: "arrow", from: "e2", to: "e4", c: "G" }, { t: "arrow", from: "e4", to: "e2", c: "G" });
    expect(shapesAt(board(h), 0).arrows).toHaveLength(2);
  });

  it("стрелка в ту же клетку или с чужой клетки не принимается", () => {
    const h = fresh();
    for (const a of [
      { t: "arrow", from: "e2", to: "e2", c: "G" },
      { t: "arrow", from: "i9", to: "e4", c: "G" },
      { t: "arrow", from: "e2", to: "", c: "G" },
    ] as Action[]) {
      const r = apply(h, a);
      expect(r.refused).toBe(true);
      expect(r.history).toBe(h);
    }
  });

  it("кольцо: то же — убрать, другой цвет — перекрасить", () => {
    let h = go(fresh(), { t: "ring", sq: "e4", c: "G" });
    expect(shapesAt(board(h), 0).rings).toEqual([{ sq: "e4", c: "G" }]);
    h = go(h, { t: "ring", sq: "e4", c: "Y" });
    expect(shapesAt(board(h), 0).rings).toEqual([{ sq: "e4", c: "Y" }]);
    h = go(h, { t: "ring", sq: "e4", c: "Y" });
    expect(shapesAt(board(h), 0).rings).toEqual([]);
    expect(apply(h, { t: "ring", sq: "z0", c: "G" }).refused).toBe(true);
  });

  it("знак: тот же — убрать, другой — заменить", () => {
    let h = go(fresh(), { t: "sign", sq: "f7", kind: "tick" });
    expect(shapesAt(board(h), 0).signs).toEqual({ f7: "tick" });
    h = go(h, { t: "sign", sq: "f7", kind: "cross" });
    expect(shapesAt(board(h), 0).signs).toEqual({ f7: "cross" });
    h = go(h, { t: "sign", sq: "f7", kind: "cross" });
    expect(shapesAt(board(h), 0).signs).toEqual({});
    expect(board(h).shapes).toEqual({});
  });

  it("25-я стрелка не принимается: клетка мигает, история та же", () => {
    const targets = ALL_SQ.filter((s) => s !== "a1");
    let h = fresh();
    for (const to of targets.slice(0, LIMITS.arrows)) h = go(h, { t: "arrow", from: "a1", to, c: "G" });
    expect(shapesAt(board(h), 0).arrows).toHaveLength(24);
    const r = apply(h, { t: "arrow", from: "a1", to: targets[24], c: "G" });
    expect(r.rejected).toBe(targets[24]);
    expect(r.history).toBe(h);
    // На пределе перекрасить и убрать можно.
    const recolour = apply(h, { t: "arrow", from: "a1", to: targets[0], c: "R" });
    expect(recolour.rejected).toBeUndefined();
    expect(shapesAt(board(recolour.history), 0).arrows[0].c).toBe("R");
    const removed = go(h, { t: "arrow", from: "a1", to: targets[0], c: "G" });
    expect(shapesAt(board(removed), 0).arrows).toHaveLength(23);
  });

  // Кольцо и знак — по одному на клетку, клеток 64, так что 65-го не бывает: новое — это перекраска или замена.
  it("64 кольца и 64 знака заполняют доску; ещё одно — перекраска, а не отказ", () => {
    let h = fresh();
    for (const sq of ALL_SQ) h = go(h, { t: "ring", sq, c: "G" }, { t: "sign", sq, kind: "ask" });
    const s = shapesAt(board(h), 0);
    expect(s.rings).toHaveLength(LIMITS.rings);
    expect(Object.keys(s.signs)).toHaveLength(LIMITS.signs);
    const ring = apply(h, { t: "ring", sq: "h8", c: "B" });
    expect(ring.rejected).toBeUndefined();
    expect(shapesAt(board(ring.history), 0).rings).toHaveLength(64);
    const sign = apply(h, { t: "sign", sq: "h8", kind: "tick" });
    expect(sign.rejected).toBeUndefined();
    expect(shapesAt(board(sign.history), 0).signs.h8).toBe("tick");
  });

  it("«Стереть» убирает только текущий ход; на пустом ходе — ничего", () => {
    let h = go(
      withLine(),
      { t: "arrow", from: "e2", to: "e4", c: "G" },
      { t: "next" },
      { t: "ring", sq: "e4", c: "R" },
      { t: "sign", sq: "e5", kind: "ask" },
    );
    h = go(h, { t: "clearShapes" });
    expect(board(h).shapes["1"]).toBeUndefined();
    expect(shapesAt(board(h), 0).arrows).toHaveLength(1);
    const again = apply(h, { t: "clearShapes" });
    expect(again.history).toBe(h);
  });

  it("у каждого хода свои стрелки: при листании возвращаются", () => {
    let h = go(withLine(), { t: "arrow", from: "e2", to: "e4", c: "G" }, { t: "next" });
    expect(shapesAt(board(h), h.doc.ply).arrows).toEqual([]);
    h = go(h, { t: "ring", sq: "e4", c: "B" }, { t: "next" }, { t: "sign", sq: "f3", kind: "tick" });
    h = go(h, { t: "first" });
    expect(shapesAt(board(h), h.doc.ply).arrows).toEqual([{ from: "e2", to: "e4", c: "G" }]);
    h = go(h, { t: "next" });
    expect(shapesAt(board(h), h.doc.ply)).toEqual({ arrows: [], rings: [{ sq: "e4", c: "B" }], signs: {} });
    h = go(h, { t: "next" });
    expect(shapesAt(board(h), h.doc.ply).signs).toEqual({ f3: "tick" });
  });
});

// ─── Отмена и повтор ────────────────────────────────────────────────────────

describe("отмена и повтор", () => {
  const undoesExactly = (h: History, a: Action) => {
    const r = apply(h, a);
    expect(r.history.doc).not.toBe(h.doc);
    expect(r.history.past.at(-1)).toBe(h.doc);
    const back = apply(r.history, { t: "undo" }).history;
    expect(back.doc).toBe(h.doc);
    expect(back.future[0]).toBe(r.history.doc);
    return r.history;
  };

  it("отмена возвращает ровно прежний урок: расстановка, стрелка, удаление доски, позиция, ход", () => {
    undoesExactly(fresh(), { t: "place", sq: "e4", piece: "wN" });
    undoesExactly(fresh(), { t: "arrow", from: "g1", to: "f3", c: "B" });
    undoesExactly(lessonOf({ line: LINE }, { start: EMPTY_FEN }), { t: "deleteBoard" });
    undoesExactly(fresh(), { t: "setPosition", fen: PAWNS_ONLY });
    const atEnd = go(withLine(), { t: "last" });
    const after = undoesExactly(atEnd, { t: "play", uci: "f1b5" });
    expect(board(after).line).toEqual([...LINE, "f1b5"]);
  });

  it("листание в историю не попадает и «повтор» не стирает", () => {
    const base = lessonOf({ line: LINE }, { line: ["d2d4"] });
    const edited = go(base, { t: "flip" }, { t: "flip" }, { t: "undo" });
    expect(edited.future).toHaveLength(1);
    const navs: Action[] = [
      { t: "goto", ply: 3 },
      { t: "next" },
      { t: "prev" },
      { t: "last" },
      { t: "first" },
      { t: "selectBoard", i: 1 },
      { t: "selectBoard", i: 0, at: "end" },
    ];
    let h = edited;
    for (const a of navs) {
      h = apply(h, a).history;
      expect(h.past).toBe(edited.past);
      expect(h.future).toBe(edited.future);
    }
    // Тот же ход, что дальше в линии, — тоже листание.
    h = go(h, { t: "first" });
    const step = apply(h, { t: "play", uci: "e2e4" }).history;
    expect(step.past).toBe(edited.past);
    expect(step.doc.ply).toBe(1);
    expect(board(step).line).toEqual(LINE);
    expect(step.doc.trial).toBeNull();
  });

  it("буквы задания подряд — одна правка; после другой правки — новая", () => {
    let h = go(fresh(), { t: "setTask", text: "Х" }, { t: "setTask", text: "Хо" }, { t: "setTask", text: "Ход" });
    expect(h.past).toHaveLength(1);
    expect(board(h).task).toBe("Ход");
    expect(board(go(h, { t: "undo" })).task).toBe("");

    h = go(fresh(), { t: "setTask", text: "a" }, { t: "flip" }, { t: "setTask", text: "ab" });
    expect(h.past).toHaveLength(3);
    h = go(h, { t: "undo" });
    expect(board(h).task).toBe("a");

    // Название урока — своё поле: чередование — отдельные правки.
    h = go(
      fresh(),
      { t: "setTask", text: "a" },
      { t: "setLessonTitle", text: "Т" },
      { t: "setTask", text: "ab" },
      { t: "setLessonTitle", text: "Те" },
      { t: "setLessonTitle", text: "Тем" },
    );
    expect(h.past).toHaveLength(4);
    expect(h.doc.lesson.title).toBe("Тем");
  });

  it("после листания или отмены буквы — уже новая правка", () => {
    let h = go(withLine(), { t: "setTask", text: "a" }, { t: "next" }, { t: "setTask", text: "ab" });
    expect(h.past).toHaveLength(2);
    h = go(fresh(), { t: "setTask", text: "a" }, { t: "undo" }, { t: "setTask", text: "b" });
    expect(h.past).toHaveLength(1);
    expect(h.future).toEqual([]);
    expect(board(go(h, { t: "undo" })).task).toBe("");
  });

  it("задание и название обрезаются по пределу; то же самое — не правка", () => {
    let h = go(fresh(), { t: "setTask", text: "я".repeat(300) }, { t: "setLessonTitle", text: "т".repeat(300) });
    expect(board(h).task).toHaveLength(LIMITS.task);
    expect(h.doc.lesson.title).toHaveLength(LIMITS.title);
    const same = apply(h, { t: "setTask", text: "я".repeat(500) });
    expect(same.history).toBe(h);
    h = go(fresh());
    expect(apply(h, { t: "setLessonTitle", text: "Урок" }).history).toBe(h);
  });

  it("повтор возвращает правку; новая правка стирает «повтор»", () => {
    const h = go(fresh(), { t: "arrow", from: "e2", to: "e4", c: "G" }, { t: "flip" });
    const edited = h.doc;
    const undone = go(h, { t: "undo" }, { t: "undo" });
    expect(undone.future).toHaveLength(2);
    const redone = go(undone, { t: "redo" }, { t: "redo" });
    expect(redone.doc).toBe(edited);
    expect(apply(redone, { t: "redo" }).history).toBe(redone);
    const branched = go(undone, { t: "redo" }, { t: "ring", sq: "d4", c: "G" });
    expect(branched.future).toEqual([]);
    expect(apply(branched, { t: "redo" }).history).toBe(branched);
  });

  it("отмена без истории — ничего", () => {
    const h = fresh();
    expect(apply(h, { t: "undo" }).history).toBe(h);
    expect(apply(h, { t: "redo" }).history).toBe(h);
  });

  it("история — не больше 100 правок, отменить можно ровно 100", () => {
    let h = fresh();
    const docs = [h.doc];
    for (let i = 0; i < 150; i++) {
      h = go(h, { t: "flip" });
      docs.push(h.doc);
    }
    expect(h.past).toHaveLength(LIMITS.history);
    expect(h.past.every((d, i) => d === docs[50 + i])).toBe(true);
    for (let i = 0; i < 100; i++) h = go(h, { t: "undo" });
    expect(h.doc).toBe(docs[50]);
    expect(go(h, { t: "undo" }).doc).toBe(docs[50]);
  });

  it("открытие урока сбрасывает историю", () => {
    const h = go(withLine(), { t: "flip" }, { t: "setTask", text: "a" }, { t: "undo" });
    const other = { ...newLesson("Другой"), boards: [newBoard(), newBoard(EMPTY_FEN)] };
    const loaded = go(h, { t: "load", lesson: other });
    expect(loaded.past).toEqual([]);
    expect(loaded.future).toEqual([]);
    expect(loaded.typing).toBeUndefined();
    expect(loaded.doc).toEqual({ lesson: other, board: 0, ply: 0, trial: null });
  });

  it("startHistory не выходит за доски", () => {
    const l = { ...newLesson("x"), boards: [newBoard(), newBoard()] };
    expect(startHistory(l, 7).doc.board).toBe(1);
    expect(startHistory(l, -3).doc.board).toBe(0);
  });
});

// ─── Расстановка ────────────────────────────────────────────────────────────

describe("расстановка", () => {
  it("поставить, заменить, убрать той же фигурой и ластиком", () => {
    let h = go(fresh(), { t: "place", sq: "e4", piece: "wN" });
    expect(placement(fen(h))).toBe("rnbqkbnr/pppppppp/8/8/4N3/8/PPPPPPPP/RNBQKBNR");
    h = go(h, { t: "place", sq: "e4", piece: "bQ" });
    expect(placement(fen(h))).toBe("rnbqkbnr/pppppppp/8/8/4q3/8/PPPPPPPP/RNBQKBNR");
    h = go(h, { t: "place", sq: "e4", piece: "bQ" });
    expect(placement(fen(h))).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    h = go(h, { t: "place", sq: "e2", piece: null });
    expect(placement(fen(h))).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPP1PPP/RNBQKBNR");
    const nothing = apply(h, { t: "place", sq: "e2", piece: null });
    expect(nothing.history).toBe(h);
  });

  it("неизвестная фигура или клетка — отказ", () => {
    const h = fresh();
    for (const a of [
      { t: "place", sq: "e4", piece: "wX" },
      { t: "place", sq: "e4", piece: "" },
      { t: "place", sq: "e9", piece: "wN" },
    ] as Action[]) {
      const r = apply(h, a);
      expect(r.refused).toBe(true);
      expect(r.history).toBe(h);
    }
  });

  // Была ошибка: CODE_TO_FEN — обычный объект, и `CODE_TO_FEN["toString"]` находил метод прототипа.
  it("имя из прототипа («toString», «constructor») — тоже не фигура", () => {
    const h = fresh();
    for (const piece of ["toString", "constructor", "hasOwnProperty"]) {
      const r = apply(h, { t: "place", sq: "e4", piece });
      expect(r.refused).toBe(true);
      expect(isFenShape(currentBoard(r.history.doc).start)).toBe(true);
    }
  });

  it("пешка на крайней горизонтали не ставится", () => {
    const h = fresh(EMPTY_FEN);
    for (const [sq, piece] of [
      ["e8", "wP"],
      ["a1", "wP"],
      ["h8", "bP"],
      ["d1", "bP"],
    ]) {
      const r = apply(h, { t: "place", sq, piece });
      expect(r.rejected).toBe(sq);
      expect(r.history).toBe(h);
    }
  });

  it("второй король той же стороны переезжает, а не появляется", () => {
    let h = go(fresh(), { t: "place", sq: "d4", piece: "wK" });
    let p = snapshotOf(fen(h));
    expect(Object.values(p).filter((x) => x === "wK")).toHaveLength(1);
    expect(p.d4).toBe("wK");
    expect(p.e1).toBeUndefined();
    expect(field(fen(h), 2)).toBe("kq");
    h = go(h, { t: "place", sq: "d5", piece: "bK" });
    p = snapshotOf(fen(h));
    expect(Object.entries(p).filter(([, x]) => x === "bK")).toEqual([["d5", "bK"]]);
    expect(field(fen(h), 2)).toBe("-");
  });

  it("свободный ход: переставить, взять, нельзя с пустой клетки и пешкой на край", () => {
    let h = go(fresh(), { t: "freeMove", from: "e2", to: "e5" });
    expect(placement(fen(h))).toBe("rnbqkbnr/pppppppp/8/4P3/8/8/PPPP1PPP/RNBQKBNR");
    h = go(h, { t: "freeMove", from: "d1", to: "d8" });
    expect(snapshotOf(fen(h)).d8).toBe("wQ");
    expect(snapshotOf(fen(h)).d1).toBeUndefined();
    const empty = apply(h, { t: "freeMove", from: "e4", to: "e6" });
    expect(empty.rejected).toBe("e4");
    expect(empty.history).toBe(h);
    const pawn = apply(h, { t: "freeMove", from: "a2", to: "b8" });
    expect(pawn.rejected).toBe("b8");
    const bPawn = apply(h, { t: "freeMove", from: "a7", to: "a1" });
    expect(bPawn.rejected).toBe("a1");
    expect(apply(h, { t: "freeMove", from: "a2", to: "a2" }).history).toBe(h);
    expect(apply(h, { t: "freeMove", from: "a2", to: "a9" }).refused).toBe(true);
  });

  it("расстановка → FEN → расстановка: ничего не теряется", () => {
    const fens = [
      START_FEN,
      EMPTY_FEN,
      PAWNS_ONLY,
      QUEEN_VS_PAWNS,
      "r1bq1rk1/pp2bppp/2n1pn2/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 b - - 0 1",
      "7k/P7/8/8/8/8/7p/K7 w - - 0 1",
      "QQQQQQQQ/8/8/8/8/8/8/qqqqqqqq w - - 0 1",
    ];
    for (const f of fens) {
      const turn = field(f, 1) as "w" | "b";
      const back = piecesToFen(snapshotOf(f), turn);
      expect(placement(back)).toBe(placement(f));
      expect(snapshotOf(back)).toEqual(snapshotOf(f));
    }
    expect(piecesToFen(snapshotOf(START_FEN), "w")).toBe(START_FEN);
  });

  it("рокировки — только когда король и ладья на местах; без королей — «-»", () => {
    const start = snapshotOf(START_FEN);
    expect(field(piecesToFen(start, "w"), 2)).toBe("KQkq");
    const noA1 = { ...start };
    delete noA1.a1;
    expect(field(piecesToFen(noA1, "w"), 2)).toBe("Kkq");
    const noH8 = { ...start };
    delete noH8.h8;
    expect(field(piecesToFen(noH8, "w"), 2)).toBe("KQq");
    const kingAway = { ...start, f1: "wK" } as Record<string, string>;
    delete kingAway.e1;
    expect(field(piecesToFen(kingAway, "w"), 2)).toBe("kq");
    // Чужая ладья в углу не даёт рокировки.
    expect(field(piecesToFen({ ...start, a1: "bR" }, "w"), 2)).toBe("Kkq");
    expect(field(piecesToFen(snapshotOf(PAWNS_ONLY), "b"), 2)).toBe("-");
    expect(piecesToFen({}, "b")).toBe("8/8/8/8/8/8/8/8 b - - 0 1");
  });

  it("после расстановки взятия на проходе нет, счётчики — с начала", () => {
    const h = go(fresh("4k3/8/8/8/3pP3/8/8/4K3 b - e3 7 31"), { t: "place", sq: "a1", piece: "wN" });
    expect(field(fen(h), 3)).toBe("-");
    expect(fen(h).endsWith(" 0 1")).toBe(true);
    expect(field(piecesToFen(snapshotOf(START_FEN), "w"), 3)).toBe("-");
  });

  it("очередь хода: меняется, то же — ничего, взятие на проходе сбрасывается", () => {
    let h = fresh("4k3/8/8/8/3pP3/8/8/4K3 b - e3 0 1");
    expect(apply(h, { t: "setTurn", turn: "b" }).history).toBe(h);
    h = go(h, { t: "setTurn", turn: "w" });
    expect(field(fen(h), 1)).toBe("w");
    expect(field(fen(h), 3)).toBe("-");
    expect(h.past).toHaveLength(1);
  });

  it("правка в середине партии: позиция становится началом, ходы забываются, знаки хода — на начало", () => {
    let h = go(
      withLine(),
      { t: "arrow", from: "a2", to: "a4", c: "G" },
      { t: "next" },
      { t: "ring", sq: "e4", c: "R" },
      { t: "next" },
      { t: "sign", sq: "e5", kind: "cross" },
      { t: "prev" },
    );
    const afterE4 = fen(h);
    h = go(h, { t: "place", sq: "a3", piece: "wN" });
    const b = board(h);
    expect(h.doc.ply).toBe(0);
    expect(b.line).toEqual([]);
    expect(placement(b.start)).toBe(placement(piecesToFen({ ...snapshotOf(afterE4), a3: "wN" }, "b")));
    expect(field(b.start, 1)).toBe("b");
    expect(b.shapes).toEqual({ "0": { arrows: [], rings: [{ sq: "e4", c: "R" }], signs: {} } });
  });

  it("правка в начале партии с ходами тоже забывает ходы", () => {
    const h = go(withLine(), { t: "arrow", from: "a2", to: "a4", c: "G" }, { t: "setTurn", turn: "b" });
    expect(board(h).line).toEqual([]);
    expect(Object.keys(board(h).shapes)).toEqual(["0"]);
    expect(field(board(h).start, 1)).toBe("b");
  });

  it("позиция из FEN: проверка, задание — только в пустое, ходы — одной правкой и конец партии на экране", () => {
    const bad = fresh();
    const r = apply(bad, { t: "setPosition", fen: "8/8/8/8 w - - 0 1" });
    expect(r.refused).toBe(true);
    expect(r.history).toBe(bad);

    let h = go(fresh(), { t: "setPosition", fen: "8/8/8/8/8/8/8/8 b", task: "т".repeat(200) });
    expect(board(h).start).toBe("8/8/8/8/8/8/8/8 b - - 0 1");
    expect(board(h).task).toHaveLength(LIMITS.task);
    h = go(h, { t: "setPosition", fen: START_FEN, task: "другое", line: LINE });
    expect(board(h).task).toHaveLength(LIMITS.task);
    expect(board(h).line).toEqual(LINE);
    expect(h.doc.ply).toBe(4);
    expect(h.past).toHaveLength(2);
    expect(board(go(h, { t: "undo" })).start).toBe("8/8/8/8/8/8/8/8 b - - 0 1");
    const empty = go(fresh(), { t: "setPosition", fen: START_FEN, line: [] });
    expect(empty.doc.ply).toBe(0);
  });

  it("ходы из PGN обрезаются до 400", () => {
    const long = Array.from({ length: 125 }, () => ["g1f3", "g8f6", "f3g1", "f6g8"]).flat();
    const h = go(fresh(), { t: "setPosition", fen: START_FEN, line: long });
    expect(board(h).line).toHaveLength(LIMITS.plies);
    expect(h.doc.ply).toBe(LIMITS.plies);
  });

  // Была ошибка: setPosition хранил ходы как есть. Модель листает только до плохого хода, а parseLesson
  // отвергает такой урок целиком — после перезагрузки урок молча пропадал.
  it("ходы, которые нельзя сделать, не попадают в урок (урок потом открывается)", () => {
    const h = go(fresh(), { t: "setPosition", fen: START_FEN, line: ["e2e4", "e2e5", "e7e5"] });
    expect(h.doc.ply).toBe(1);
    const saved = persistable(h.doc);
    expect(parseLesson(JSON.parse(JSON.stringify(saved)))).not.toBeNull();
  });
});

// ─── Ходы и пробный вариант ─────────────────────────────────────────────────

describe("ходы и «что если?»", () => {
  it("ход в конце партии продолжает её без пробного варианта", () => {
    const h = go(withLine(), { t: "last" }, { t: "play", uci: "f1c4" });
    expect(board(h).line).toEqual([...LINE, "f1c4"]);
    expect(h.doc.ply).toBe(5);
    expect(h.doc.trial).toBeNull();
  });

  it("другой ход в середине — пробный вариант; «вернуться» восстанавливает партию, знаки и ход", () => {
    let h = go(
      withLine(),
      { t: "goto", ply: 2 },
      { t: "arrow", from: "g1", to: "f3", c: "G" },
      { t: "next" },
      { t: "ring", sq: "f3", c: "R" },
      { t: "last" },
      { t: "sign", sq: "c6", kind: "ask" },
      { t: "goto", ply: 2 },
    );
    const before = board(h);
    h = go(h, { t: "play", uci: "d2d4" });
    expect(board(h).line).toEqual(["e2e4", "e7e5", "d2d4"]);
    expect(h.doc.ply).toBe(3);
    expect(h.doc.trial).toEqual({ line: LINE, shapes: before.shapes, ply: 2 });
    // Знаки дальше точки ветвления в варианте не видны.
    expect(Object.keys(board(h).shapes)).toEqual(["2"]);
    h = go(h, { t: "play", uci: "e5d4" }, { t: "play", uci: "f1c4" });
    expect(h.doc.trial?.line).toEqual(LINE);
    h = go(h, { t: "returnToLine" });
    expect(board(h).line).toEqual(LINE);
    expect(board(h).shapes).toEqual(before.shapes);
    expect(h.doc.ply).toBe(2);
    expect(h.doc.trial).toBeNull();
    expect(apply(h, { t: "returnToLine" }).history).toBe(h);
  });

  it("«оставить вариант» делает его партией", () => {
    let h = go(withLine(), { t: "goto", ply: 1 }, { t: "play", uci: "c7c5" });
    h = go(h, { t: "keepTrial" });
    expect(h.doc.trial).toBeNull();
    expect(board(h).line).toEqual(["e2e4", "c7c5"]);
    expect(persistable(h.doc).boards[0].line).toEqual(["e2e4", "c7c5"]);
    expect(apply(h, { t: "keepTrial" }).history).toBe(h);
  });

  it("«обрезать» убирает дальние ходы и их знаки; в конце без варианта — ничего", () => {
    let h = go(
      withLine(),
      { t: "goto", ply: 2 },
      { t: "ring", sq: "e5", c: "G" },
      { t: "next" },
      { t: "ring", sq: "f3", c: "G" },
      { t: "goto", ply: 2 },
    );
    h = go(h, { t: "truncate" });
    expect(board(h).line).toEqual(["e2e4", "e7e5"]);
    expect(Object.keys(board(h).shapes)).toEqual(["2"]);
    expect(h.doc.ply).toBe(2);
    expect(apply(h, { t: "truncate" }).history).toBe(h);
  });

  it("«обрезать» в варианте делает вариант партией", () => {
    const h = go(withLine(), { t: "goto", ply: 2 }, { t: "play", uci: "d2d4" }, { t: "truncate" });
    expect(h.doc.trial).toBeNull();
    expect(board(h).line).toEqual(["e2e4", "e7e5", "d2d4"]);
  });

  it("нельзя сделать ход — клетка мигает; не ход вовсе — без клетки", () => {
    const h = withLine();
    const r = apply(h, { t: "play", uci: "e2e5" });
    expect(r.rejected).toBe("e5");
    expect(r.history).toBe(h);
    const junk = apply(h, { t: "play", uci: "hello" });
    expect(junk.rejected).toBeUndefined();
    expect(junk.history).toBe(h);
    // Ход не той стороны.
    expect(apply(h, { t: "play", uci: "e7e5" }).rejected).toBe("e5");
  });

  it("превращение: e7e8q, без буквы — ферзь, e7e8n — конь", () => {
    const start = "8/4P3/8/8/8/8/8/k6K w - - 0 1";
    const q = go(fresh(start), { t: "play", uci: "e7e8q" });
    expect(snapshotOf(fen(q)).e8).toBe("wQ");
    expect(board(q).line).toEqual(["e7e8q"]);
    const bare = go(fresh(start), { t: "play", uci: "e7e8" });
    expect(board(bare).line).toEqual(["e7e8q"]);
    const n = go(fresh(start), { t: "play", uci: "e7e8n" });
    expect(snapshotOf(fen(n)).e8).toBe("wN");
    expect(board(n).line).toEqual(["e7e8n"]);
    // Ход «как в партии», но в другую фигуру — уже вариант.
    const trial = go(lessonOf({ start, line: ["e7e8n"] }), { t: "play", uci: "e7e8" });
    expect(trial.doc.trial?.line).toEqual(["e7e8n"]);
    const same = apply(lessonOf({ start, line: ["e7e8q"] }), { t: "play", uci: "e7e8" }).history;
    expect(same.past).toEqual([]);
    expect(same.doc.ply).toBe(1);
  });

  it("позиции без королей: пешки и ферзь ходят, шаха и мата нет", () => {
    let h = go(fresh(PAWNS_ONLY), { t: "play", uci: "e2e4" }, { t: "play", uci: "d7d5" }, { t: "play", uci: "e4d5" });
    expect(board(h).line).toEqual(["e2e4", "d7d5", "e4d5"]);
    expect(snapshotOf(fen(h)).d5).toBe("wP");
    h = go(fresh(QUEEN_VS_PAWNS), { t: "play", uci: "d1d7" });
    expect(board(h).line).toEqual(["d1d7"]);
    expect(snapshotOf(fen(h)).d7).toBe("wQ");
    const info = currentPly(h.doc);
    expect([info.check, info.mate, info.stalemate]).toEqual([false, false, false]);
    h = go(fresh(QUEEN_VS_PAWNS), { t: "play", uci: "d1h5" }, { t: "play", uci: "g7g6" }, { t: "play", uci: "h5g6" });
    expect(board(h).line).toHaveLength(3);
  });

  it("в сохраняемом уроке — партия, а не пробный вариант", () => {
    const h = go(withLine(), { t: "goto", ply: 2 }, { t: "play", uci: "d2d4" }, { t: "setTask", text: "Мат" });
    const saved = persistable(h.doc);
    expect(saved.boards[0].line).toEqual(LINE);
    expect(saved.boards[0].task).toBe("Мат");
    expect(board(h).line).toEqual(["e2e4", "e7e5", "d2d4"]);
    const plain = withLine();
    expect(persistable(plain.doc)).toBe(plain.doc.lesson);
  });

  it("уход на другую доску возвращает партию", () => {
    let h = go(lessonOf({ line: LINE }, { start: EMPTY_FEN }), { t: "goto", ply: 2 }, { t: "play", uci: "d2d4" });
    h = go(h, { t: "selectBoard", i: 1 });
    expect(h.doc.trial).toBeNull();
    expect(h.doc.lesson.boards[0].line).toEqual(LINE);
    expect(h.past).toHaveLength(1);
    h = go(h, { t: "selectBoard", i: 0 });
    expect(h.doc.ply).toBe(0);
    expect(board(h).line).toEqual(LINE);
    // И «дальше» с конца варианта — тоже.
    h = go(h, { t: "goto", ply: 1 }, { t: "play", uci: "c7c5" }, { t: "next" });
    expect(h.doc.board).toBe(1);
    expect(h.doc.lesson.boards[0].line).toEqual(LINE);
  });

  it("на той же доске «в начало/в конец» вариант не трогает", () => {
    let h = go(withLine(), { t: "goto", ply: 2 }, { t: "play", uci: "d2d4" });
    expect(apply(h, { t: "selectBoard", i: 0 }).history).toBe(h);
    h = go(h, { t: "selectBoard", i: 0, at: "start" });
    expect(h.doc.ply).toBe(0);
    expect(h.doc.trial).not.toBeNull();
  });

  it("предел 400 ходов: дальше нельзя, а вариант с 399-го — можно", () => {
    const line = Array.from({ length: 100 }, () => ["g1f3", "g8f6", "f3g1", "f6g8"]).flat();
    let h = go(withLine(line), { t: "last" });
    expect(h.doc.ply).toBe(400);
    const r = apply(h, { t: "play", uci: "e2e4" });
    expect(r.refused).toBe(true);
    expect(r.history).toBe(h);
    h = go(h, { t: "prev" }, { t: "play", uci: "e7e5" });
    expect(board(h).line).toHaveLength(400);
    expect(h.doc.trial?.line).toBe(line);
  });
});

// ─── Листание ───────────────────────────────────────────────────────────────

describe("листание", () => {
  const two = () => lessonOf({ line: LINE }, { line: ["d2d4"] });

  it("«дальше» с конца доски — на следующую доску, «назад» с начала — в конец предыдущей", () => {
    let h = go(two(), { t: "last" }, { t: "next" });
    expect([h.doc.board, h.doc.ply]).toEqual([1, 0]);
    h = go(h, { t: "prev" });
    expect([h.doc.board, h.doc.ply]).toEqual([0, 4]);
    h = go(h, { t: "selectBoard", i: 1, at: "end" });
    expect([h.doc.board, h.doc.ply]).toEqual([1, 1]);
    expect(apply(h, { t: "next" }).history).toBe(h);
    const start = two();
    expect(apply(start, { t: "prev" }).history).toBe(start);
  });

  it("переход к ходу не выходит за партию; номер округляется", () => {
    const h = withLine();
    expect(go(h, { t: "goto", ply: -3 }).doc.ply).toBe(0);
    expect(go(h, { t: "goto", ply: 99 }).doc.ply).toBe(4);
    expect(go(h, { t: "goto", ply: 2.6 }).doc.ply).toBe(3);
    expect(go(h, { t: "last" }, { t: "first" }).doc.ply).toBe(0);
  });

  it("номер доски не выходит за урок", () => {
    expect(go(two(), { t: "selectBoard", i: 99 }).doc.board).toBe(1);
    expect(go(two(), { t: "selectBoard", i: 1 }, { t: "selectBoard", i: -5 }).doc.board).toBe(0);
  });

  it("испорченный хвост партии не листается", () => {
    const h = lessonOf({ line: ["e2e4", "e2e4", "e7e5"] });
    expect(go(h, { t: "last" }).doc.ply).toBe(1);
    // Ход с конца годной части заменяет испорченный хвост.
    const played = go(h, { t: "last" }, { t: "play", uci: "e7e5" });
    expect(board(played).line).toEqual(["e2e4", "e7e5"]);
    expect(played.doc.trial).toBeNull();
  });
});

// ─── Доски ──────────────────────────────────────────────────────────────────

describe("доски урока", () => {
  it("новая доска — текущая позиция без ходов, сразу за текущей", () => {
    let h = go(lessonOf({ line: LINE, task: "Задание" }, { start: EMPTY_FEN }), { t: "flip" }, { t: "goto", ply: 2 });
    const here = fen(h);
    h = go(h, { t: "addBoard" });
    const { boards } = h.doc.lesson;
    expect(boards).toHaveLength(3);
    expect(h.doc.board).toBe(1);
    expect(h.doc.ply).toBe(0);
    expect(boards[1]).toMatchObject({ start: here, line: [], task: "", shapes: {}, orientation: "black" });
    expect(boards[1].id).not.toBe(boards[0].id);
    expect(boards[2].start).toBe(EMPTY_FEN);
  });

  it("новая доска из варианта: позиция варианта, а у старой доски — партия", () => {
    let h = go(withLine(), { t: "goto", ply: 2 }, { t: "play", uci: "d2d4" });
    const here = fen(h);
    h = go(h, { t: "addBoard" });
    expect(h.doc.lesson.boards[1].start).toBe(here);
    expect(h.doc.lesson.boards[0].line).toEqual(LINE);
    expect(h.doc.trial).toBeNull();
  });

  it("копия доски — то, что на экране (с вариантом), с новым id и на том же ходу", () => {
    let h = go(
      withLine(),
      { t: "setTask", text: "Найди" },
      { t: "goto", ply: 2 },
      { t: "play", uci: "d2d4" },
      { t: "arrow", from: "e5", to: "d4", c: "R" },
    );
    const visible = board(h);
    h = go(h, { t: "dupBoard" });
    const [orig, copy] = h.doc.lesson.boards;
    expect(copy).toEqual({ ...visible, id: copy.id });
    expect(copy.id).not.toBe(orig.id);
    expect(copy.line).toEqual(["e2e4", "e7e5", "d2d4"]);
    expect(copy.task).toBe("Найди");
    expect(orig.line).toEqual(LINE);
    expect([h.doc.board, h.doc.ply, h.doc.trial]).toEqual([1, 3, null]);
    // Копия — глубокая: правка копии не трогает оригинал.
    expect(copy.shapes).not.toBe(visible.shapes);
  });

  it("удаление единственной доски — чистая доска с начальной позицией", () => {
    const h0 = go(lessonOf({ start: EMPTY_FEN, line: [], task: "x" }), { t: "flip" });
    const h = go(h0, { t: "deleteBoard" });
    const [b] = h.doc.lesson.boards;
    expect(h.doc.lesson.boards).toHaveLength(1);
    expect(b).toMatchObject({ start: START_FEN, line: [], task: "", shapes: {}, orientation: "white" });
    expect(b.id).not.toBe(board(h0).id);
    expect([h.doc.board, h.doc.ply]).toEqual([0, 0]);
    expect(board(go(h, { t: "undo" })).start).toBe(EMPTY_FEN);
  });

  it("удаление доски: остаёмся на месте, с последней — на предыдущую", () => {
    const three = () => lessonOf({ task: "1" }, { task: "2" }, { task: "3" });
    let h = go(three(), { t: "selectBoard", i: 1 }, { t: "deleteBoard" });
    expect(h.doc.lesson.boards.map((b) => b.task)).toEqual(["1", "3"]);
    expect(h.doc.board).toBe(1);
    h = go(three(), { t: "selectBoard", i: 2, at: "end" }, { t: "deleteBoard" });
    expect(h.doc.board).toBe(1);
    expect(board(h).task).toBe("2");
  });

  it("досок не больше 40", () => {
    let h = fresh();
    for (let i = 1; i < LIMITS.boards; i++) h = go(h, { t: i % 2 ? "addBoard" : "dupBoard" });
    expect(h.doc.lesson.boards).toHaveLength(40);
    expect(new Set(h.doc.lesson.boards.map((b) => b.id)).size).toBe(40);
    for (const t of ["addBoard", "dupBoard"] as const) {
      const r = apply(h, { t });
      expect(r.refused).toBe(true);
      expect(r.history).toBe(h);
    }
  });
});

// ─── FEN и PGN ──────────────────────────────────────────────────────────────

describe("разбор FEN и PGN", () => {
  it("isFenShape отвергает испорченные записи", () => {
    for (const bad of [
      "8/8/8/8 w - - 0 1",
      "zzzz/8/8/8/8/8/8/8 w - - 0 1",
      "P7/8/8/8/8/8/8/8 w - - 0 1",
      "8/8/8/8/8/8/8/p7 w - - 0 1",
      "KK6/8/8/8/8/8/8/8 w - - 0 1",
      "k7/8/8/8/8/8/8/k7 w - - 0 1",
      "8/8/8/8/8/8/8/8 w KX - 0 1",
      "8/8/8/8/8/8/8/8 w KK - 0 1",
      "8/8/8/8/8/8/8/8 w qk - 0 1",
      "8/8/8/8/8/8/8/8 w - e4 0 1",
      "8/8/8/8/8/8/8/8 w - i3 0 1",
      "8/8/8/8/8/8/8/8 w - e33 0 1",
      "8/8/8/8/8/8/8/8 x - - 0 1",
      "8/8/8/8/8/8/8/8 w - - x 1",
      "8/8/8/8/8/8/8/8 w - - 0 -1",
      "8/8/8/8/8/8/8/8 w - - 0 1 extra",
      "8/8/8/8/8/8/8/8",
      "9/8/8/8/8/8/8/8 w",
      "7/8/8/8/8/8/8/8 w",
      "ppppppppp/8/8/8/8/8/8/8 w",
      "8/8/8/8/8/8/8/ w",
      "8/8/8/8/8/8/8/8/8 w",
      "",
      "   ",
    ]) {
      expect(isFenShape(bad), bad).toBe(false);
    }
    for (const notString of [null, undefined, 42, {}, ["8/8/8/8/8/8/8/8", "w"]]) {
      expect(isFenShape(notString)).toBe(false);
    }
  });

  it("isFenShape принимает позиции без королей и короткую запись", () => {
    for (const good of [
      START_FEN,
      EMPTY_FEN,
      PAWNS_ONLY,
      QUEEN_VS_PAWNS,
      "8/8/8/8/8/8/8/8 w",
      "4k3/8/8/8/8/8/8/8 b",
      "  8/8/8/8/8/8/8/8   w   -  -  0  1 ",
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
      "8/8/8/8/8/8/8/8 w Qk - 12 40",
    ]) {
      expect(isFenShape(good), good).toBe(true);
    }
  });

  // Были ошибки: isFenShape повторяет проверку chess.js без королей, но потеряла два её правила.
  it("две цифры подряд (R11K4) — не FEN: иначе при расстановке пропадает король", () => {
    const h = go(fresh(), { t: "setPosition", fen: "4k3/8/8/8/8/8/8/R11K4 w - - 0 1" });
    const after = go(h, { t: "place", sq: "e4", piece: "wP" });
    expect(placement(fen(after))).toContain("K");
  });

  it("взятие на проходе не той стороны (e3 при ходе белых) — не FEN: иначе пешка бьёт пустую клетку", () => {
    const h = go(fresh(), { t: "setPosition", fen: "4k3/8/8/8/4P3/8/3P4/4K3 w - e3 0 1" });
    expect(apply(h, { t: "play", uci: "d2e3" }).rejected).toBe("e3");
  });

  // Была ошибка: права на рокировку из FEN не сверялись с доской, а chess.js с skipValidation им верит.
  it("рокировка без ладьи невозможна", () => {
    const h = go(fresh(), { t: "setPosition", fen: "4k3/8/8/8/8/8/8/4K3 w KQkq - 0 1" });
    expect(apply(h, { t: "play", uci: "e1g1" }).rejected).toBe("g1");
  });

  it("рокировка короля не с e1 невозможна (иначе конь g1 «рокируется» на e1)", () => {
    const h = go(fresh(), { t: "setPosition", fen: "4k3/8/8/8/8/8/8/3K2N1 w K - 0 1" });
    expect(apply(h, { t: "play", uci: "d1f1" }).rejected).toBe("f1");
  });

  it("normalizeFen дописывает поля короткой записи и не меняет полную", () => {
    expect(normalizeFen("8/8/8/8/8/8/8/8 w")).toBe(EMPTY_FEN);
    // Права на рокировку без короля и ладьи на месте отбрасываются.
    expect(normalizeFen("8/8/8/8/8/8/8/8 b KQ")).toBe("8/8/8/8/8/8/8/8 b - - 0 1");
    expect(normalizeFen("r3k3/8/8/8/8/8/8/4K2R w KQkq - 0 1")).toBe("r3k3/8/8/8/8/8/8/4K2R w Kq - 0 1");
    // Взятие на проходе — только если пешка соперника и вправду только что прошла на два поля.
    expect(normalizeFen("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2")).toBe("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2");
    expect(normalizeFen("4k3/8/8/4P3/8/8/8/4K3 w - d6 0 2")).toBe("4k3/8/8/4P3/8/8/8/4K3 w - - 0 2");
    expect(normalizeFen(START_FEN)).toBe(START_FEN);
    expect(normalizeFen(`  ${START_FEN}  `)).toBe(START_FEN);
    expect(normalizeFen(normalizeFen("8/8/8/8/8/8/8/8 w"))).toBe(EMPTY_FEN);
  });

  it("parseMentorSetup: FEN без королей и короткий FEN", () => {
    expect(parseMentorSetup(PAWNS_ONLY)).toEqual({ start: PAWNS_ONLY, line: [] });
    expect(parseMentorSetup(` ${QUEEN_VS_PAWNS}\n`)).toEqual({ start: QUEEN_VS_PAWNS, line: [] });
    expect(parseMentorSetup("8/8/8/8/8/8/8/8 w")).toEqual({ start: EMPTY_FEN, line: [] });
  });

  it("parseMentorSetup: партия PGN — главная линия", () => {
    expect(parseMentorSetup("1. e4 e5 2. Nf3 Nc6 *")).toEqual({ start: START_FEN, line: LINE });
    expect(parseMentorSetup("1. e4 (1. d4 d5) e5 {Так играют чаще} 2. Nf3 $1 *")?.line).toEqual([
      "e2e4",
      "e7e5",
      "g1f3",
    ]);
    expect(parseMentorSetup("1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. O-O *")?.line.at(-1)).toBe("e1g1");
    const headers = '[Event "Урок"]\n[White "Ученик"]\n\n1. d4 d5 2. c4 1-0';
    expect(parseMentorSetup(headers)).toEqual({ start: START_FEN, line: ["d2d4", "d7d5", "c2c4"] });
  });

  it("parseMentorSetup: PGN с [FEN] и превращением", () => {
    const pgn = '[SetUp "1"]\n[FEN "8/4P3/8/8/8/8/8/k6K w - - 0 1"]\n\n1. e8=N *';
    expect(parseMentorSetup(pgn)).toEqual({ start: "8/4P3/8/8/8/8/8/k6K w - - 0 1", line: ["e7e8n"] });
    const onlyHeader = parseMentorSetup('[FEN "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1"]\n\n*');
    expect(onlyHeader).toEqual({ start: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1", line: [] });
  });

  it("parseMentorSetup: длинная партия обрезается до 400 ходов, и каждый ход делается", () => {
    const moves = Array.from({ length: 101 }, (_, i) => `${2 * i + 1}. Nf3 Nf6 ${2 * i + 2}. Ng1 Ng8`).join(" ");
    const r = parseMentorSetup(`${moves} *`);
    expect(r?.line).toHaveLength(LIMITS.plies);
    expect(fensOf(r!.start, r!.line)).toHaveLength(LIMITS.plies + 1);
  });

  it("parseMentorSetup отвергает текст, пустое, испорченное и невозможные ходы", () => {
    for (const bad of [
      "hello",
      "",
      "   \n ",
      "8/8/8/8 w - - 0 1",
      "1. e4 e5 2. Ke3 *",
      "e4 e5 Nf3",
      "12.5",
      "[Event",
    ]) {
      expect(parseMentorSetup(bad), bad).toBeNull();
    }
  });

  it("fensOf останавливается на первом невозможном ходе", () => {
    const f = fensOf(START_FEN, ["e2e4", "e7e5", "e1e3", "g1f3"]);
    expect(f).toHaveLength(3);
    expect(f.map((p) => p.san)).toEqual([undefined, "e4", "e5"]);
    expect(f[0]).toEqual({ fen: START_FEN, check: false, mate: false, stalemate: false });
    expect(fensOf(START_FEN, ["zzzz", "e2e4"])).toHaveLength(1);
    // Буква превращения у обычного хода и превращение без буквы — тоже невозможные ходы.
    expect(fensOf(START_FEN, ["e2e4q"])).toHaveLength(1);
    expect(fensOf("8/4P3/8/8/8/8/8/k6K w - - 0 1", ["e7e8"])).toHaveLength(1);
    expect(fensOf("8/4P3/8/8/8/8/8/k6K w - - 0 1", ["e7e8r"])[1].san).toBe("e8=R");
    // Одинаковый запрос — тот же ответ из памяти.
    expect(fensOf(START_FEN, LINE)).toBe(fensOf(START_FEN, LINE));
  });

  it("fensOf: шах бывает и у одинокого короля, мат и пат — только при обоих королях", () => {
    const mate = fensOf(START_FEN, ["f2f3", "e7e5", "g2g4", "d8h4"]);
    expect(mate.at(-1)).toMatchObject({ san: "Qh4#", check: true, mate: true, stalemate: false });
    const stale = fensOf("7k/5Q2/6K1/8/8/8/8/8 b - - 0 1", []);
    expect(stale[0].stalemate).toBe(true);
    const lonely = fensOf("4k3/8/8/8/8/8/8/3Q4 w - - 0 1", ["d1d8"]);
    expect(lonely[1]).toMatchObject({ check: true, mate: false, stalemate: false });
  });

  it("playUci: ход и превращение по умолчанию в ферзя", () => {
    expect(playUci(START_FEN, "e2e4")?.uci).toBe("e2e4");
    expect(playUci(START_FEN, "e2e5")).toBeNull();
    expect(playUci("8/4P3/8/8/8/8/8/k6K w - - 0 1", "e7e8")?.uci).toBe("e7e8q");
  });
});

// ─── Свойства: случайные правки ─────────────────────────────────────────────

describe("случайные правки не ломают урок", () => {
  const COLORS: ShapeColor[] = ["G", "R", "B", "Y"];
  const KINDS: SignKind[] = ["tick", "cross", "ask"];
  const FENS = [START_FEN, EMPTY_FEN, PAWNS_ONLY, QUEEN_VS_PAWNS, "8/4P3/8/8/8/8/8/k6K w - - 0 1"];
  const PGNS = ["1. e4 e5 2. Nf3 Nc6 *", "1. d4 d5 2. c4 *", '[FEN "8/4P3/8/8/8/8/8/k6K w - - 0 1"]\n\n1. e8=Q *'];

  function rng(seed: number) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 2 ** 32;
    };
  }

  function legalUci(fenNow: string, rand: () => number): string | null {
    try {
      const moves = new Chess(fenNow, { skipValidation: true })
        .moves({ verbose: true })
        .filter((m) => isSquare(m.from) && isSquare(m.to));
      if (!moves.length) return null;
      const m = moves[Math.floor(rand() * moves.length)];
      return `${m.from}${m.to}${m.promotion ?? ""}`;
    } catch {
      return null;
    }
  }

  function randomAction(h: History, rand: () => number): Action {
    const pick = <T>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)];
    const sq = () => pick(ALL_SQ);
    const roll = Math.floor(rand() * 27);
    if (roll < 6) {
      const uci = legalUci(fen(h), rand);
      return uci ? { t: "play", uci } : { t: "next" };
    }
    switch (roll) {
      case 6:
        return { t: "goto", ply: Math.floor(rand() * 12) - 2 };
      case 7:
        return { t: "next" };
      case 8:
        return { t: "prev" };
      case 9:
        return pick([{ t: "first" }, { t: "last" }] as const);
      case 10:
        return { t: "selectBoard", i: Math.floor(rand() * 5) - 1, at: pick(["start", "end", undefined] as const) };
      case 11:
      case 12:
        return { t: "arrow", from: sq(), to: sq(), c: pick(COLORS) };
      case 13:
        return { t: "ring", sq: sq(), c: pick(COLORS) };
      case 14:
        return { t: "sign", sq: sq(), kind: pick(KINDS) };
      case 15:
        return { t: "clearShapes" };
      case 16:
        return { t: "place", sq: sq(), piece: pick([...PIECE_CODES, null]) };
      case 17:
        return { t: "freeMove", from: sq(), to: sq() };
      case 18:
        return { t: "setTurn", turn: pick(["w", "b"] as const) };
      case 19:
        return { t: "flip" };
      case 20:
        return { t: "setTask", text: pick(["", "Мат в 1", "Ход белых", "x".repeat(200)]) };
      case 21:
        return { t: "setLessonTitle", text: pick(["Урок", "Тема", "y".repeat(100)]) };
      case 22:
        return pick([{ t: "addBoard" }, { t: "dupBoard" }, { t: "deleteBoard" }] as const);
      case 23:
        return pick([{ t: "returnToLine" }, { t: "keepTrial" }, { t: "truncate" }] as const);
      case 24:
        return pick([{ t: "undo" }, { t: "redo" }] as const);
      case 25: {
        const p = parseMentorSetup(pick(PGNS))!;
        return { t: "setPosition", fen: p.start, line: p.line };
      }
      default:
        return { t: "setPosition", fen: pick(FENS) };
    }
  }

  function deepFreeze<T>(o: T): T {
    if (o && typeof o === "object" && !Object.isFrozen(o)) {
      for (const v of Object.values(o)) deepFreeze(v);
      Object.freeze(o);
    }
    return o;
  }

  function checkInvariants(h: History, where: string) {
    const d = h.doc;
    const { boards } = d.lesson;
    expect(boards.length >= 1 && boards.length <= LIMITS.boards, where).toBe(true);
    expect(d.board >= 0 && d.board < boards.length, where).toBe(true);
    const total = fensOf(boards[d.board].start, boards[d.board].line).length - 1;
    expect(d.ply >= 0 && d.ply <= total, `${where}: ply ${d.ply} из ${total}`).toBe(true);
    expect(new Set(boards.map((b) => b.id)).size, where).toBe(boards.length);
    expect(h.past.length, where).toBeLessThanOrEqual(LIMITS.history);
    for (const b of boards) {
      expect(isFenShape(b.start), `${where}: ${b.start}`).toBe(true);
      expect(fensOf(b.start, b.line).length, `${where}: ${b.line.join(" ")}`).toBe(b.line.length + 1);
      for (const [k, s] of Object.entries(b.shapes)) {
        expect(/^\d+$/.test(k) && Number(k) <= b.line.length, `${where}: ключ ${k}`).toBe(true);
        expect(s.arrows.length + s.rings.length + Object.keys(s.signs).length, where).toBeGreaterThan(0);
        expect(s.arrows.length, where).toBeLessThanOrEqual(LIMITS.arrows);
      }
    }
    if (d.trial) {
      const b = boards[d.board];
      expect(fensOf(b.start, d.trial.line).length, where).toBe(d.trial.line.length + 1);
      expect(d.trial.ply, where).toBeLessThanOrEqual(d.trial.line.length);
    }
    const saved = persistable(d);
    expect(parseLesson(JSON.parse(JSON.stringify(saved))), where).toEqual(saved);
  }

  for (const seed of [1, 2, 3, 4, 5, 6]) {
    it(`последовательность №${seed}: урок цел, вход не меняется, отмена и повтор сходятся`, () => {
      const rand = rng(seed);
      let h = fresh();
      for (let step = 0; step < 220; step++) {
        const a = randomAction(h, rand);
        deepFreeze(h);
        h = apply(h, a).history;
        checkInvariants(h, `№${seed}, шаг ${step}, ${JSON.stringify(a)}`);
      }
      const final = h.doc;
      const n = h.past.length;
      for (let i = 0; i < n; i++) h = go(h, { t: "undo" });
      expect(h.past).toEqual([]);
      for (let i = 0; i < n; i++) h = go(h, { t: "redo" });
      expect(h.doc).toBe(final);
    });
  }
});
