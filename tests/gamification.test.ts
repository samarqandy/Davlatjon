/** 3-й этап: опыт и уровни, задание дня, мягкая серия, сертификат, короны и новые тренажёры. */
import { describe, expect, it } from "vitest";
import { CHESS_LEVELS } from "@/content/chess";
import { allDays } from "@/content/program";
import { longDate, rankEarnedAt, weekCertificateHref, weekEarnedAt } from "@/lib/certificate";
import { loadPosition } from "@/lib/chess";
import { bestCrowns, crownsFor, crownsForWin, robotPersona } from "@/lib/crowns";
import {
  KNIGHT_ROUNDS,
  knightDistance,
  knightRound,
  knightStars,
  knightSteps,
  MEMORY_ROUNDS,
  memoryRound,
  pawnDanger,
  piecesInDanger,
  safetyQuestion,
} from "@/lib/miniDrills";
import { gentleStreak, questDone, questFor, questStars, weekActiveDays } from "@/lib/quest";
import { DEFAULT_STATE, isoDay, type AppState, type ChessGameRecord, type TaskProgress } from "@/lib/state";
import { levelName, showsNumbers } from "@/lib/workshop";
import { chessContent } from "@/content/chess/content";
import { COLLECTION_TOTAL, XP_PER_CARD, cardsOpen, heroCards, newCardAt, xpToNextCard } from "@/lib/collection";
import { XP, rewardFor, xpForLevel, xpLevel, xpTotal } from "@/lib/xp";

const at = (day: string, hour = 12) => new Date(`${day}T${String(hour).padStart(2, "0")}:00:00`).getTime();
const state = (patch: Partial<AppState> = {}): AppState => ({ ...structuredClone(DEFAULT_STATE), ...patch });
const task = (solvedAt: number, hints = 0): TaskProgress =>
  ({ status: "solved", hints, checks: 1, missed: 0, solvedAt, timeMs: 1000, marks: {} }) as TaskProgress;

/** Детерминированный генератор для тренажёров. */
function rng(seed: number) {
  let x = seed;
  return () => {
    x = (x * 1103515245 + 12345) % 2 ** 31;
    return x / 2 ** 31;
  };
}

describe("опыт и уровни", () => {
  it("пустой прогресс — 0 опыта и первый уровень", () => {
    expect(xpTotal(state())).toBe(0);
    expect(xpLevel(0)).toEqual({ level: 1, into: 0, need: 50 });
  });

  it("пороги уровней растут: 0, 50, 150, 300, 500", () => {
    expect([1, 2, 3, 4, 5].map(xpForLevel)).toEqual([0, 50, 150, 300, 500]);
    expect(xpLevel(49).level).toBe(1);
    expect(xpLevel(50)).toEqual({ level: 2, into: 0, need: 100 });
    expect(xpLevel(160)).toEqual({ level: 3, into: 10, need: 150 });
  });

  it("подсказки опыт не уменьшают, партия с победой — больше поражения", () => {
    const d = at("2026-09-28");
    const s = state({
      tasks: { a: task(d), b: task(d, 2) },
      chessGames: [
        { id: "g1", at: d, mode: "robot", level: 1, color: "w", result: "win", moves: 20 },
        { id: "g2", at: d, mode: "robot", level: 1, color: "w", result: "loss", moves: 20 },
      ],
      chessDrills: { safety: 4, find: 12 },
    });
    expect(xpTotal(s)).toBe(XP.task * 2 + XP.game * 2 + XP.win + XP.drill);
  });

  it("звание за уровень шахматной школы даёт бонус", () => {
    const level = CHESS_LEVELS[0];
    const chess = Object.fromEntries(level.exercises.map((e) => [e.id, { solvedAt: at("2026-09-28"), misses: 0 }]));
    expect(xpTotal(state({ chess }))).toBe(level.exercises.length * XP.exercise + XP.rank);
  });
});

describe("задание дня", () => {
  const day = "2026-09-29";

  it("три дела: задачи тренажёра, задача по математике и третье дело", () => {
    const goals = questFor(state(), day);
    expect(goals).toHaveLength(3);
    expect(goals[0]).toMatchObject({ kind: "puzzles", need: 3, have: 0 });
    expect(goals[1]).toMatchObject({ kind: "task", need: 1 });
    expect(["exercise", "game"]).toContain(goals[2].kind);
    expect(questDone(goals)).toBe(false);
  });

  it("сделанное в этот день засчитывается, в другой — нет", () => {
    const puzzles = Object.fromEntries(["p1", "p2", "p3"].map((id) => [id, { solvedAt: at(day), misses: 0 }]));
    const s = state({
      chessPuzzles: { ...puzzles, old: { solvedAt: at("2026-09-20"), misses: 0 } },
      tasks: { a: task(at(day)) },
      chessGames: [{ id: "g", at: at(day), mode: "robot", level: 1, color: "w", result: "loss", moves: 9 }],
      chess: { e1: { solvedAt: at(day), misses: 0 } },
    });
    const goals = questFor(s, day);
    expect(goals.every((g) => g.have >= g.need)).toBe(true);
    expect(questDone(goals)).toBe(true);
    expect(questStars(s, [day, "2026-09-20"])).toBe(1);
    expect(questFor(s, "2026-09-30").every((g) => g.have === 0)).toBe(true);
  });

  it("когда вся математика решена, вместо задачи — партия, и дела не повторяются", () => {
    const tasks = Object.fromEntries(
      allDays()
        .flatMap((d) => d.tasks)
        .map((x) => [x.id, task(at("2026-09-01"))]),
    );
    for (const d of ["2026-09-28", "2026-09-29"]) {
      const goals = questFor(state({ tasks }), d);
      expect(goals.map((g) => g.kind)).not.toContain("task");
      expect(new Set(goals.map((g) => g.kind + g.need)).size).toBe(goals.length);
    }
  });
});

describe("мягкая серия", () => {
  const days = (...list: string[]) => Object.fromEntries(list.map((d) => [d, 1]));

  it("подряд без пропусков", () => {
    expect(gentleStreak(days("2026-09-27", "2026-09-28", "2026-09-29"), "2026-09-29")).toEqual({
      days: 3,
      frozen: [],
    });
  });

  it("сегодня ещё не занимались — серия считается до вчера", () => {
    expect(gentleStreak(days("2026-09-27", "2026-09-28"), "2026-09-29").days).toBe(2);
  });

  it("один пропуск в неделю прощается, второй за ту же неделю — рвёт", () => {
    // 2026-09-28 — понедельник. Пропущен вторник 29-го.
    const s = gentleStreak(days("2026-09-28", "2026-09-30", "2026-10-01"), "2026-10-01");
    expect(s).toEqual({ days: 3, frozen: ["2026-09-29"] });
    // Пропуски в среду и пятницу одной недели: засчитываются только дни после второго пропуска.
    const t = gentleStreak(days("2026-09-28", "2026-09-29", "2026-10-01", "2026-10-03"), "2026-10-03");
    expect(t.days).toBe(2);
  });

  it("два пропуска подряд рвут серию", () => {
    expect(gentleStreak(days("2026-09-24", "2026-09-27", "2026-09-28"), "2026-09-28").days).toBe(2);
  });

  it("без занятий серии нет, и «замороженных» дней тоже", () => {
    expect(gentleStreak({}, "2026-09-29")).toEqual({ days: 0, frozen: [] });
  });

  it("цель недели считает дни с понедельника", () => {
    expect(weekActiveDays(days("2026-09-27", "2026-09-28", "2026-09-30"), "2026-10-01")).toBe(2);
  });
});

describe("сертификат о звании", () => {
  const level = CHESS_LEVELS[1];

  it("дата звания — день последнего решённого упражнения, пока не всё решено — null", () => {
    const chess = Object.fromEntries(
      level.exercises.map((e, i) => [e.id, { solvedAt: at("2026-09-01") + i, misses: 0 }]),
    );
    const last = at("2026-09-01") + level.exercises.length - 1;
    expect(rankEarnedAt(level, { chess })).toBe(last);
    delete chess[level.exercises[0].id];
    expect(rankEarnedAt(level, { chess })).toBeNull();
  });

  it("дата словами на двух языках", () => {
    expect(longDate(at("2026-09-29"), "ru")).toBe("29 сентября 2026 г.");
    expect(longDate(at("2026-09-29"), "uz")).toBe("2026-yil 29-sentabr");
    expect(longDate(at("2026-01-05"), "uz")).toBe("2026-yil 5-yanvar");
  });
});

describe("короны за победы над роботом", () => {
  const game = (patch: Partial<ChessGameRecord>): ChessGameRecord => ({
    id: String(Math.random()),
    at: 1,
    mode: "robot",
    level: 3,
    color: "w",
    result: "win",
    moves: 30,
    ...patch,
  });

  it("победа — всегда корона; в режиме «Сам» — три, с форой — две", () => {
    expect(crownsForWin(false)).toBe(1);
    expect(crownsForWin(true)).toBe(3);
    expect(crownsForWin(true, true)).toBe(2);
    expect(crownsForWin(false, true)).toBe(1);
  });

  it("поражение, ничья и игра вдвоём корон не дают; помощь корону не отнимает", () => {
    expect(crownsFor(game({ result: "loss", hints: 0, undos: 0, solo: true }))).toBe(0);
    expect(crownsFor(game({ result: "draw", hints: 0, undos: 0, solo: true }))).toBe(0);
    expect(crownsFor(game({ mode: "two", hints: 0, undos: 0, solo: true }))).toBe(0);
    // Новые записи: подсказки и отмены на корону не влияют, считается только выбранный режим.
    expect(crownsFor(game({ hints: 9, undos: 9, solo: false }))).toBe(1);
    expect(crownsFor(game({ hints: 0, undos: 0, solo: true }))).toBe(3);
  });

  it("старые партии (до режима «Сам») не теряют корон", () => {
    expect(crownsFor(game({}))).toBe(1);
    expect(crownsFor(game({ hints: 0, undos: 0 }))).toBe(3);
    expect(crownsFor(game({ hints: 1, undos: 1 }))).toBe(2);
    expect(crownsFor(game({ hints: 5, undos: 0 }))).toBe(1);
    expect(crownsFor(game({ hints: 0, undos: 0, odds: "bq" }))).toBe(2);
  });

  it("лучший результат по каждому роботу", () => {
    const games = [game({ hints: 5, undos: 0 }), game({ hints: 0, undos: 0 }), game({ level: 4, hints: 1, undos: 0 })];
    expect(bestCrowns(games, 3)).toBe(3);
    expect(bestCrowns(games, 4)).toBe(2);
    expect(bestCrowns(games, 5)).toBe(0);
  });

  it("у каждого робота есть свои слова на двух языках; по-узбекски без кириллицы", () => {
    for (const level of [1, 2, 3, 4, 5]) {
      const ru = robotPersona(level, "ru")!;
      const uz = robotPersona(level, "uz")!;
      for (const line of [ru.hello, ru.lost, ru.won]) expect(line.length).toBeGreaterThan(10);
      for (const line of [uz.hello, uz.lost, uz.won]) expect(line).not.toMatch(/[Ѐ-ӿ]/);
    }
  });
});

describe("тренажёр «Кто в опасности?»", () => {
  it("висящая фигура и фигура под ударом более дешёвой — в опасности, защищённая — нет", () => {
    // Белые: конь e5 под ударом пешки d6 (дешевле) хотя и защищён; слон b5 под ударом ладьи b8 без защиты;
    // ладья a1 под ударом ладьи a8, но защищена ферзём d1 — равный размен, не опасность.
    const fen = "rr4k1/8/3p4/1B2N3/8/8/8/R2QK3 w - - 0 1";
    expect(loadPosition(fen).fen()).toBeTruthy();
    expect(piecesInDanger(fen, "w")).toEqual(["b5", "e5"]);
    expect(safetyQuestion(fen)?.danger).toEqual(["b5", "e5"]);
  });

  it("позиция с шахом для вопроса не годится", () => {
    expect(safetyQuestion("4k3/8/8/8/8/8/8/4K2r w - - 0 1")).toBeNull();
  });
});

describe("тренажёр «Запомни»", () => {
  it("фигуры разные, на разных клетках; пешки не на краю; спрашивают о фигуре с доски", () => {
    const r = rng(7);
    for (const count of MEMORY_ROUNDS) {
      const round = memoryRound(count, r);
      const squares = Object.keys(round.pieces);
      expect(squares).toHaveLength(count);
      expect(new Set(Object.values(round.pieces)).size).toBe(count);
      for (const [sq, p] of Object.entries(round.pieces)) if (p[1] === "P") expect(sq[1]).not.toMatch(/[18]/);
      expect(round.pieces[round.answer]).toBe(round.ask);
    }
  });
});

describe("тренажёр «Путь коня»", () => {
  it("расстояния коня на пустой доске", () => {
    expect(knightDistance("a1", "b3")).toBe(1);
    expect(knightDistance("a1", "h8")).toBe(6);
    expect(knightDistance("a1", "b2")).toBe(4);
    expect(knightSteps("a1")).toEqual(["b3", "c2"]);
  });

  it("пешки и битые ими клетки закрыты", () => {
    const danger = pawnDanger(["e5"]);
    expect([...danger].sort()).toEqual(["d4", "e5", "f4"]);
    expect(knightSteps("e2", danger)).not.toContain("f4");
    expect(knightSteps("e2", danger)).not.toContain("d4");
  });

  it("раунды решаемы, путь от двух до пяти ходов", () => {
    const r = rng(11);
    for (let i = 0; i < 40; i++) {
      const pawns = KNIGHT_ROUNDS[i % KNIGHT_ROUNDS.length];
      const round = knightRound(pawns, r);
      const forbidden = pawnDanger(round.pawns);
      expect(forbidden.has(round.start)).toBe(false);
      expect(forbidden.has(round.target)).toBe(false);
      expect(knightDistance(round.start, round.target, forbidden)).toBe(round.best);
      expect(round.best).toBeGreaterThanOrEqual(2);
      expect(round.best).toBeLessThanOrEqual(5);
    }
  });

  it("звёзды за путь", () => {
    expect(knightStars(3, 3)).toBe(3);
    expect(knightStars(4, 3)).toBe(2);
    expect(knightStars(6, 3)).toBe(1);
  });
});

it("isoDay и время теста в одном часовом поясе", () => {
  expect(isoDay(at("2026-09-29"))).toBe("2026-09-29");
});

describe("названия уровней", () => {
  it("у каждого уровня есть имя на двух языках, после десятого — последнее", () => {
    for (let n = 1; n <= 10; n++) {
      expect(levelName(n, "ru").name).toBeTruthy();
      expect(levelName(n, "uz").name).not.toMatch(/[Ѐ-ӿ]/);
    }
    expect(levelName(25, "ru")).toEqual(levelName(10, "ru"));
    expect(levelName(0, "ru")).toEqual(levelName(1, "ru"));
  });
  it("числа показываются только с десяти лет", () => {
    expect(showsNumbers(undefined)).toBe(false);
    expect(showsNumbers(9)).toBe(false);
    expect(showsNumbers(10)).toBe(true);
  });
});

describe("звук-награда", () => {
  it("обычный рост опыта — короткий звон, переход через порог уровня — фанфара", () => {
    expect(rewardFor(10, 20)).toBe("win");
    expect(rewardFor(45, 55)).toBe("level");
    expect(rewardFor(xpForLevel(3) - 1, xpForLevel(3))).toBe("level");
  });
  it("без роста и при больших скачках (синхронизация, сброс) звука нет", () => {
    expect(rewardFor(20, 20)).toBeNull();
    expect(rewardFor(50, 10)).toBeNull();
    expect(rewardFor(0, 101)).toBeNull();
  });
});

describe("сертификат недели", () => {
  const week = { days: [{ id: "a" }, { id: "b" }, { id: "c" }] };

  it("дата — день последнего завершённого дня; пока не все дни пройдены — null", () => {
    const days = { a: { completedAt: 100 }, b: { completedAt: 300 }, c: { completedAt: 200 } };
    expect(weekEarnedAt(week, { days } as never)).toBe(300);
    expect(weekEarnedAt(week, { days: { a: days.a, b: days.b } } as never)).toBeNull();
    expect(weekEarnedAt({ days: [] }, { days } as never)).toBeNull();
  });

  it("ссылка ведёт на лист недели", () => {
    expect(weekCertificateHref(2)).toBe("/certificate/week/2");
  });
});

describe("коллекция героев", () => {
  const content = chessContent("ru");
  const cards = heroCards(content);

  it("число карточек совпадает с константой; номера идут подряд, мудрецы первыми", () => {
    expect(cards).toHaveLength(COLLECTION_TOTAL);
    expect(cards.map((c) => c.no)).toEqual(cards.map((_, i) => i + 1));
    expect(cards.slice(0, content.sages.length).every((c) => c.kind === "sage")).toBe(true);
    expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
  });

  it("у каждой карточки есть имя, текст и картинка из набора; на узбекском то же число", () => {
    const ids = new Set(content.images.map((i) => i.id));
    for (const c of cards) {
      expect(c.name && c.note && c.where).toBeTruthy();
      expect(c.image && ids.has(c.image)).toBe(true);
    }
    expect(heroCards(chessContent("uz"))).toHaveLength(cards.length);
  });

  it("открытие: одна карточка за каждые XP_PER_CARD, не больше всех", () => {
    expect(cardsOpen(0, 23)).toBe(0);
    expect(cardsOpen(XP_PER_CARD - 1, 23)).toBe(0);
    expect(cardsOpen(XP_PER_CARD, 23)).toBe(1);
    expect(cardsOpen(10_000, 23)).toBe(23);
    expect(xpToNextCard(10, 23)).toBe(XP_PER_CARD - 10);
    expect(xpToNextCard(10_000, 23)).toBeNull();
  });

  it("новая карточка — только при обычном росте опыта через порог", () => {
    expect(newCardAt(XP_PER_CARD - 5, XP_PER_CARD + 5, 23)).toBe(true);
    expect(newCardAt(1, 6, 23)).toBe(false);
    expect(newCardAt(0, 500, 23)).toBe(false);
    expect(newCardAt(XP_PER_CARD + 5, XP_PER_CARD - 5, 23)).toBe(false);
  });
});
