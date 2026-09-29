/**
 * Шахматная энциклопедия: партии, дебюты, задачи и справочник проверяются движком и chess.js.
 */
import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import {
  CHESS_MATH,
  FIDE_NOTE,
  PIECE_NAMES,
  POLGAR_NOTE,
  RECORDS,
  TIMELINE,
  UZBEK_CHESS,
  WOMEN_CHAMPIONS,
  WORLD_CHAMPIONS,
} from "@/content/chess/encyclopedia";
import { FAMOUS_GAMES } from "@/content/chess/games";
import { CHESS_LEVELS } from "@/content/chess";
import { OPENINGS, OPENING_CATEGORIES, OPENING_PRINCIPLES } from "@/content/chess/openings";
import { PUZZLES, PUZZLE_THEMES, dailyPuzzle, puzzlesByTheme } from "@/content/chess/puzzles";
import { inCheck, legalMoves, makeMove, parseFen } from "@/lib/engine/board";
import { matingMovesIn, scoreMoves } from "@/lib/engine/search";
import { bankCount } from "@/lib/puzzleBank";

/** Позиция возможна в партии: оба короля есть, сторона не на ходу не под шахом. */
function isLegalPosition(fen: string): boolean {
  try {
    const chess = new Chess(fen);
    const waiting = chess.turn() === "w" ? "b" : "w";
    const king = chess
      .board()
      .flat()
      .find((p) => p?.type === "k" && p.color === waiting);
    return !!king && !chess.isAttacked(king.square, chess.turn());
  } catch {
    return false;
  }
}

const texts: { id: string; text: string }[] = [];
for (const g of FAMOUS_GAMES)
  texts.push(
    ...[
      g.title,
      ...g.story,
      ...Object.values(g.comments),
      g.lesson,
      ...g.facts,
      ...g.keyMoments.map((k) => k.caption),
    ].map((text) => ({ id: g.id, text })),
  );
for (const o of OPENINGS) texts.push(...[o.name, o.idea, ...o.plan, ...o.facts].map((text) => ({ id: o.id, text })));
for (const p of PUZZLES) texts.push(...[p.title, p.hint, p.explanation].map((text) => ({ id: p.id, text })));
for (const t of TIMELINE) texts.push({ id: t.title, text: t.text });
for (const c of [...WORLD_CHAMPIONS, ...WOMEN_CHAMPIONS]) texts.push({ id: c.name, text: c.note });
for (const r of RECORDS) texts.push({ id: r.title, text: r.text });
for (const m of CHESS_MATH) texts.push({ id: m.question, text: `${m.question} ${m.answer} ${m.link ?? ""}` });
texts.push(
  ...UZBEK_CHESS.paragraphs.map((text) => ({ id: "uz", text })),
  { id: "fide", text: FIDE_NOTE },
  { id: "polgar", text: POLGAR_NOTE },
);

describe("знаменитые партии", () => {
  it("каждая партия разыгрывается по правилам и заканчивается матом", () => {
    for (const g of FAMOUS_GAMES) {
      const chess = new Chess();
      g.moves.forEach((m, i) => expect(() => chess.move(m), `${g.id}: полуход ${i + 1} ${m}`).not.toThrow());
      expect(chess.isCheckmate(), g.id).toBe(true);
      expect(g.result, g.id).toBe(chess.turn() === "b" ? "1-0" : "0-1");
      for (const ply of Object.keys(g.comments).map(Number)) {
        expect(ply, `${g.id}: комментарий ${ply}`).toBeGreaterThanOrEqual(1);
        expect(ply, `${g.id}: комментарий ${ply}`).toBeLessThanOrEqual(g.moves.length);
      }
      for (const k of g.keyMoments) expect(k.ply, `${g.id}: момент ${k.ply}`).toBeLessThanOrEqual(g.moves.length);
      expect(g.keyMoments.at(-1)?.ply, g.id).toBe(g.moves.length);
      expect(
        CHESS_LEVELS.map((l) => l.id),
        g.id,
      ).toContain(g.level);
    }
    const ids = FAMOUS_GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("дебюты", () => {
  it("линии возможны, коды и категории на месте", () => {
    for (const o of OPENINGS) {
      const chess = new Chess();
      o.moves.forEach((m, i) => expect(() => chess.move(m), `${o.id}: ${i + 1} ${m}`).not.toThrow());
      expect(o.eco, o.id).toMatch(/^[A-E]\d\d$/);
      expect(OPENING_CATEGORIES[o.category], o.id).toBeDefined();
      expect(o.moves.length, o.id).toBeGreaterThanOrEqual(4);
      if (o.id === "legal-trap") expect(chess.isCheckmate()).toBe(true);
    }
    const ids = OPENINGS.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const cat of Object.keys(OPENING_CATEGORIES))
      expect(
        OPENINGS.some((o) => o.category === cat),
        cat,
      ).toBe(true);
    expect(OPENING_PRINCIPLES.length).toBeGreaterThanOrEqual(4);
  });
});

describe("задачи", () => {
  it("позиции возможны в партии, темы и сложность на месте", () => {
    const ids = PUZZLES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PUZZLES) {
      expect(isLegalPosition(p.fen), p.id).toBe(true);
      expect(
        PUZZLE_THEMES.some((t) => t.id === p.theme),
        p.id,
      ).toBe(true);
      expect(p.mateIn !== undefined || (p.solution?.length ?? 0) > 0, p.id).toBe(true);
    }
    // В каждой теме есть задачи: школы или из базы Lichess (у новых тем — только из базы).
    for (const t of PUZZLE_THEMES) expect(puzzlesByTheme(t.id).length + bankCount(t.id), t.id).toBeGreaterThan(0);
    expect(PUZZLES.filter((p) => p.stars === 1).length).toBeGreaterThanOrEqual(8);
    expect(PUZZLES.filter((p) => p.stars >= 4).length).toBeGreaterThanOrEqual(3);
  });

  it("мат в N ходов: мат есть, а быстрее — нет", () => {
    for (const p of PUZZLES.filter((x) => x.mateIn)) {
      const mates = matingMovesIn(p.fen, p.mateIn!);
      expect(mates.length, p.id).toBeGreaterThan(0);
      if (p.mateIn! > 1) expect(matingMovesIn(p.fen, p.mateIn! - 1), p.id).toEqual([]);
      if (p.mateIn! >= 2) expect(mates.length, `${p.id}: первый ход должен быть единственным`).toBeLessThanOrEqual(2);
    }
  });

  it("«мат, а не пат»: есть ход, который ставит пат", () => {
    for (const p of PUZZLES.filter((x) => x.theme === "stalemate")) {
      const pos = parseFen(p.fen);
      const stalemates = legalMoves(pos).filter((m) => {
        const next = parseFen(p.fen);
        makeMove(next, m);
        return legalMoves(next).length === 0 && !inCheck(next);
      });
      expect(stalemates.length, p.id).toBeGreaterThan(0);
    }
  });

  it("выигрыш материала: решение — лучший ход с заметным отрывом", () => {
    for (const p of PUZZLES.filter((x) => x.solution)) {
      const ranked = scoreMoves(p.fen, 3);
      const best = ranked[0];
      expect(p.solution, `${p.id}: лучший ход ${best.uci}`).toContain(best.uci);
      const rival = ranked.find((r) => !p.solution!.includes(r.uci));
      expect(best.score - (rival?.score ?? -Infinity), `${p.id}: отрыв от ${rival?.uci}`).toBeGreaterThanOrEqual(150);
      for (const s of p.solution!) {
        const r = ranked.find((x) => x.uci === s);
        expect(r, `${p.id}: ход ${s} невозможен`).toBeDefined();
        expect(best.score - r!.score, `${p.id}: ход ${s} хуже лучшего`).toBeLessThanOrEqual(60);
      }
    }
  });

  it("задача дня одинакова в один день и разная в разные", () => {
    const a = dailyPuzzle(new Date(2026, 8, 27, 9));
    const b = dailyPuzzle(new Date(2026, 8, 27, 22));
    expect(a.id).toBe(b.id);
    const ids = new Set(Array.from({ length: PUZZLES.length }, (_, i) => dailyPuzzle(new Date(2026, 0, 1 + i)).id));
    expect(ids.size).toBe(PUZZLES.length);
  });
});

describe("энциклопедия", () => {
  it("лента истории по порядку, чемпионы пронумерованы, названия фигур совпадают с уровнями", () => {
    for (let i = 1; i < TIMELINE.length; i++)
      expect(TIMELINE[i].year, TIMELINE[i].title).toBeGreaterThanOrEqual(TIMELINE[i - 1].year);
    expect(TIMELINE.filter((t) => t.local).length).toBeGreaterThanOrEqual(5);
    expect(WORLD_CHAMPIONS.map((c) => c.n)).toEqual(WORLD_CHAMPIONS.map((_, i) => i + 1));
    expect(WOMEN_CHAMPIONS.map((c) => c.n)).toEqual(WOMEN_CHAMPIONS.map((_, i) => i + 1));
    expect(PIECE_NAMES.map((p) => p.uz).sort()).toEqual(CHESS_LEVELS.map((l) => l.uz).sort());
    expect(PIECE_NAMES.map((p) => p.ru).sort()).toEqual(CHESS_LEVELS.map((l) => l.name).sort());
    expect(RECORDS.length).toBeGreaterThanOrEqual(8);
    expect(CHESS_MATH.length).toBeGreaterThanOrEqual(5);
  });

  it("математика на доске: числа сходятся", () => {
    const squares = Array.from({ length: 8 }, (_, k) => (8 - k) ** 2).reduce((s, x) => s + x, 0);
    expect(squares).toBe(204);
    expect(2 ** 9).toBe(512);
    let grains = BigInt(1);
    for (let i = 0; i < 64; i++) grains *= BigInt(2);
    expect((grains - BigInt(1)).toString()).toBe("18446744073709551615");
    expect(RECORDS.some((r) => r.text.includes("18 446 744 073 709 551 615"))).toBe(true);
    expect(new Chess().moves()).toHaveLength(20);
  });
});

/** Русская нотация хода: «Фe7», «Крg8», «Лxd8+», «Кf3», «e8=Ф» — фигура по-русски, поле латиницей. */
const RU_MOVE = /(Кр|Ф|Л|С|К)?x?[a-h]?[1-8]?x?[a-h][1-8](=(Ф|Л|С|К))?[+#!?]*/g;

describe("тексты энциклопедии", () => {
  it("без латинских букв в русских словах, без «неправильно» и лишних пробелов", () => {
    for (const { id, text } of texts) {
      const plain = text.replace(RU_MOVE, " ");
      expect(plain.match(/[А-Яа-яЁё]+[A-Za-z]+[А-Яа-яЁё]*|[A-Za-z]+[А-Яа-яЁё]+/g), `${id}: ${text}`).toBeNull();
      expect(/неправильн/i.test(text), `${id}: ${text}`).toBe(false);
      expect(/ {2,}/.test(text), `${id}: ${text}`).toBe(false);
      expect(/ [,.!?:;]/.test(text.replace(/`[^`]*`/g, "X")), `${id}: ${text}`).toBe(false);
    }
  });
});
