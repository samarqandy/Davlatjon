/** Доска тренера, хранение: проверка урока из хранилища, запись с пределами, настройки и вид доски «для класса». */
import { describe, expect, it } from "vitest";
import { BOARD_THEMES, CLASS_BOARD_THEME, DEFAULT_BOARD_THEME, boardThemeOf, isBoardThemeId } from "@/lib/boardLook";
import { EMPTY_FEN, LIMITS, START_FEN, apply, newLesson, startHistory, type Action } from "@/lib/mentor/model";
import type { MentorLesson } from "@/lib/mentor/model";
import {
  DEFAULT_PREFS,
  LESSONS_KEY,
  MAX_CHARS,
  MAX_LESSONS,
  PREFS_KEY,
  openLesson,
  parseLesson,
  parsePrefs,
  readPrefs,
  readSaved,
  writeLesson,
  writePrefs,
} from "@/lib/mentor/store";

// ─── Помощники ──────────────────────────────────────────────────────────────

const rawBoard = (over: Record<string, unknown> = {}) => ({
  id: "b1",
  task: "Ход белых",
  start: START_FEN,
  line: ["e2e4", "e7e5"],
  shapes: {
    "0": { arrows: [{ from: "e2", to: "e4", c: "G" }], rings: [{ sq: "e4", c: "R" }], signs: { e5: "tick" } },
  },
  orientation: "white",
  ...over,
});
const rawLesson = (over: Record<string, unknown> = {}) => ({
  version: 1,
  id: "l1",
  title: "Урок",
  createdAt: 1,
  updatedAt: 2,
  boards: [rawBoard()],
  ...over,
});
const withShapes = (shapes: unknown) => rawLesson({ boards: [rawBoard({ shapes: { "0": shapes } })] });

/** Хранилище в памяти: считает записи; можно заставить запись бросать ошибку. */
function memory(initial: Record<string, string> = {}, fail?: () => never) {
  const data = new Map(Object.entries(initial));
  let writes = 0;
  return {
    data,
    get writes() {
      return writes;
    },
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (fail) fail();
      writes++;
      data.set(k, v);
    },
  };
}

function lessonAt(id: string, updatedAt: number): MentorLesson {
  return { ...newLesson(`Урок ${id}`, updatedAt), id };
}

/** Урок, собранный правками тренера: две доски, ходы, знаки, задание, поворот. */
function builtLesson(): MentorLesson {
  const actions: Action[] = [
    { t: "play", uci: "e2e4" },
    { t: "play", uci: "e7e5" },
    { t: "arrow", from: "g1", to: "f3", c: "B" },
    { t: "ring", sq: "f7", c: "R" },
    { t: "sign", sq: "e5", kind: "ask" },
    { t: "setTask", text: "Найди лучший ход" },
    { t: "addBoard" },
    { t: "setPosition", fen: "8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1" },
    { t: "play", uci: "e2e4" },
    { t: "flip" },
    { t: "setLessonTitle", text: "Пешечный бой" },
  ];
  let h = startHistory(newLesson("Урок", 1000));
  for (const a of actions) h = apply(h, a).history;
  return h.doc.lesson;
}

// ─── parseLesson ────────────────────────────────────────────────────────────

describe("проверка урока", () => {
  it("годный урок принимается как есть", () => {
    expect(parseLesson(rawLesson())).toEqual(rawLesson());
  });

  it("мусор и чужая версия — нет", () => {
    for (const junk of [
      null,
      undefined,
      0,
      "урок",
      [],
      {},
      [rawLesson()],
      { version: 1 },
      JSON.stringify(rawLesson()),
    ]) {
      expect(parseLesson(junk)).toBeNull();
    }
    expect(parseLesson(rawLesson({ version: 2 }))).toBeNull();
    expect(parseLesson(rawLesson({ version: "1" }))).toBeNull();
  });

  it("без id урока или доски, с пустым id — нет", () => {
    expect(parseLesson(rawLesson({ id: undefined }))).toBeNull();
    expect(parseLesson(rawLesson({ id: "   " }))).toBeNull();
    expect(parseLesson(rawLesson({ id: 5 }))).toBeNull();
    expect(parseLesson(rawLesson({ boards: [rawBoard({ id: "" })] }))).toBeNull();
  });

  it("испорченная позиция или ходы — нет", () => {
    for (const start of ["8/8/8/8 w - - 0 1", "", 42, "P7/8/8/8/8/8/8/8 w - - 0 1", "KK6/8/8/8/8/8/8/8 w"]) {
      expect(parseLesson(rawLesson({ boards: [rawBoard({ start })] })), String(start)).toBeNull();
    }
    for (const line of [["e2e5"], ["e2e4", "e2e4"], ["hello"], ["e2e4", 5], "e2e4", null, ["e2e4q"]]) {
      expect(parseLesson(rawLesson({ boards: [rawBoard({ line, shapes: {} })] })), JSON.stringify(line)).toBeNull();
    }
    expect(
      parseLesson(rawLesson({ boards: [rawBoard({ start: "8/4P3/8/8/8/8/8/k6K w", line: ["e7e8"] })] })),
    ).toBeNull();
  });

  it("больше 400 ходов — нет", () => {
    const line = Array.from({ length: 101 }, () => ["g1f3", "g8f6", "f3g1", "f6g8"]).flat();
    expect(parseLesson(rawLesson({ boards: [rawBoard({ line, shapes: {} })] }))).toBeNull();
    expect(parseLesson(rawLesson({ boards: [rawBoard({ line: line.slice(0, 400), shapes: {} })] }))).not.toBeNull();
  });

  it("цвет «Z», знак на i9, неизвестный знак — нет", () => {
    expect(parseLesson(withShapes({ arrows: [{ from: "e2", to: "e4", c: "Z" }] }))).toBeNull();
    expect(parseLesson(withShapes({ rings: [{ sq: "e4", c: "Z" }] }))).toBeNull();
    expect(parseLesson(withShapes({ rings: [{ sq: "e4" }] }))).toBeNull();
    expect(parseLesson(withShapes({ signs: { i9: "tick" } }))).toBeNull();
    expect(parseLesson(withShapes({ signs: { e4: "smile" } }))).toBeNull();
    expect(parseLesson(withShapes({ signs: ["tick"] }))).toBeNull();
  });

  it("стрелки: больше 24, повтор, в ту же клетку — нет", () => {
    const sq = "abcdefgh".split("").flatMap((f) => [1, 2, 3, 4].map((r) => `${f}${r}`));
    const arrows = sq.slice(1, 26).map((to) => ({ from: "a1", to, c: "G" }));
    expect(parseLesson(withShapes({ arrows: arrows.slice(0, 24) }))).not.toBeNull();
    expect(parseLesson(withShapes({ arrows }))).toBeNull();
    const dup = { from: "e2", to: "e4", c: "G" };
    expect(parseLesson(withShapes({ arrows: [dup, { ...dup, c: "R" }] }))).toBeNull();
    expect(parseLesson(withShapes({ arrows: [{ from: "e4", to: "e4", c: "G" }] }))).toBeNull();
    expect(
      parseLesson(
        withShapes({
          rings: [
            { sq: "e4", c: "G" },
            { sq: "e4", c: "B" },
          ],
        }),
      ),
    ).toBeNull();
    expect(parseLesson(withShapes({ arrows: "e2e4" }))).toBeNull();
  });

  it("знаки на ходу, которого нет, или с ключом не-числом — нет", () => {
    const s = { rings: [{ sq: "e4", c: "G" }] };
    expect(parseLesson(rawLesson({ boards: [rawBoard({ shapes: { "2": s } })] }))).not.toBeNull();
    for (const k of ["3", "-1", "1.5", "abc", ""]) {
      expect(parseLesson(rawLesson({ boards: [rawBoard({ shapes: { [k]: s } })] })), k).toBeNull();
    }
    expect(parseLesson(rawLesson({ boards: [rawBoard({ shapes: [] })] }))).toBeNull();
  });

  it("пустые знаки хода отбрасываются, лишние поля — тоже", () => {
    const l = parseLesson({
      ...rawLesson({ boards: [{ ...rawBoard({ shapes: { "1": {}, "0": { arrows: [] } } }), extra: 1 }] }),
      owner: "кто-то",
    });
    expect(l?.boards[0].shapes).toEqual({});
    expect(l).not.toHaveProperty("owner");
    expect(l?.boards[0]).not.toHaveProperty("extra");
  });

  it("досок: 0 и 41 — нет, 40 — да; одинаковые id — нет", () => {
    const boards = (n: number) => Array.from({ length: n }, (_, i) => rawBoard({ id: `b${i}` }));
    expect(parseLesson(rawLesson({ boards: [] }))).toBeNull();
    expect(parseLesson(rawLesson({ boards: boards(41) }))).toBeNull();
    expect(parseLesson(rawLesson({ boards: boards(LIMITS.boards) }))?.boards).toHaveLength(40);
    expect(parseLesson(rawLesson({ boards: [rawBoard({ id: "x" }), rawBoard({ id: "x" })] }))).toBeNull();
    expect(parseLesson(rawLesson({ boards: [rawBoard({ id: "x" }), rawBoard({ id: " x " })] }))).toBeNull();
    expect(parseLesson(rawLesson({ boards: "b1" }))).toBeNull();
  });

  it("строки обрезаются: название — 80, задание — 140, id — 40; пробелы по краям убираются", () => {
    const l = parseLesson(
      rawLesson({
        id: `  ${"i".repeat(60)}  `,
        title: `  ${"т".repeat(200)}`,
        boards: [rawBoard({ task: `\n${"з".repeat(300)}`, id: "d".repeat(50) })],
      }),
    )!;
    expect(l.title).toBe("т".repeat(80));
    expect(l.boards[0].task).toBe("з".repeat(140));
    expect(l.id).toBe("i".repeat(40));
    expect(l.boards[0].id).toBe("d".repeat(40));
    expect(parseLesson(rawLesson({ title: "  Урок 1  " }))?.title).toBe("Урок 1");
    expect(parseLesson(rawLesson({ title: 7 }))?.title).toBe("");
  });

  it("короткий FEN дописывается, поворот — только white/black, время — только конечное число", () => {
    const l = parseLesson(
      rawLesson({
        createdAt: 5,
        updatedAt: Number.NaN,
        boards: [rawBoard({ start: "8/8/8/8/8/8/8/8 w", line: [], shapes: {}, orientation: "upside" })],
      }),
    )!;
    expect(l.boards[0].start).toBe(EMPTY_FEN);
    expect(l.boards[0].orientation).toBe("white");
    expect(l.updatedAt).toBe(5);
    const now = Date.now();
    const t = parseLesson(rawLesson({ createdAt: "вчера", updatedAt: undefined }))!;
    expect(t.createdAt).toBeGreaterThanOrEqual(now);
    expect(t.updatedAt).toBe(t.createdAt);
  });

  it("позиции без королей принимаются", () => {
    const l = parseLesson(
      rawLesson({ boards: [rawBoard({ start: "8/pppppppp/8/8/8/8/8/3Q4 w - - 0 1", line: ["d1d7"], shapes: {} })] }),
    );
    expect(l?.boards[0].line).toEqual(["d1d7"]);
  });
});

// ─── readSaved и openLesson ─────────────────────────────────────────────────

describe("чтение и открытие", () => {
  const stored = (value: unknown) => memory({ [LESSONS_KEY]: JSON.stringify(value) });

  it("испорченное, чужое, недоступное — пустой список", () => {
    expect(readSaved(memory({ [LESSONS_KEY]: "{не json" }))).toEqual({ lessons: [] });
    expect(readSaved(memory())).toEqual({ lessons: [] });
    expect(readSaved(null)).toEqual({ lessons: [] });
    expect(readSaved(stored({ version: 2, lessons: [rawLesson()] }))).toEqual({ lessons: [] });
    expect(readSaved(stored({ version: 1, lessons: "много" }))).toEqual({ lessons: [] });
    expect(readSaved(stored([rawLesson()]))).toEqual({ lessons: [] });
    const throwing = {
      getItem: () => {
        throw new Error("SecurityError");
      },
    };
    expect(readSaved(throwing)).toEqual({ lessons: [] });
  });

  it("испорченные уроки пропускаются, повторы — тоже, свежие — сверху", () => {
    const s = stored({
      version: 1,
      lessons: [
        rawLesson({ id: "a", updatedAt: 10 }),
        rawLesson({ id: "bad", boards: [] }),
        rawLesson({ id: "b", updatedAt: 30 }),
        rawLesson({ id: "a", updatedAt: 99, title: "повтор" }),
        "мусор",
        rawLesson({ id: "c", updatedAt: 20 }),
      ],
      current: { lessonId: "c", board: 0.6 },
    });
    const saved = readSaved(s);
    expect(saved.lessons.map((l) => l.id)).toEqual(["b", "c", "a"]);
    expect(saved.lessons.find((l) => l.id === "a")?.title).toBe("Урок");
    expect(saved.current).toEqual({ lessonId: "c", board: 1 });
  });

  it("открытый урок помнится, только если он есть; доска не меньше 0", () => {
    const base = { version: 1, lessons: [rawLesson({ id: "a" })] };
    expect(readSaved(stored({ ...base, current: { lessonId: "zz", board: 0 } })).current).toBeUndefined();
    expect(readSaved(stored({ ...base, current: { lessonId: "a", board: "1" } })).current).toBeUndefined();
    expect(readSaved(stored({ ...base, current: { lessonId: "a", board: -4 } })).current).toEqual({
      lessonId: "a",
      board: 0,
    });
    expect(readSaved(stored({ ...base, current: "a" }))).not.toHaveProperty("current");
  });

  it("ничего не сохранено — новый урок с начальной позицией и данным названием", () => {
    const { lesson, board } = openLesson({ lessons: [] }, "Урок 1");
    expect(board).toBe(0);
    expect(lesson.title).toBe("Урок 1");
    expect(lesson.version).toBe(1);
    expect(lesson.boards).toHaveLength(1);
    expect(lesson.boards[0]).toMatchObject({ start: START_FEN, line: [], task: "", shapes: {} });
    expect(parseLesson(JSON.parse(JSON.stringify(lesson)))).toEqual(lesson);
  });

  it("открывается последний открытый урок, его доска — в пределах урока", () => {
    const a = parseLesson(rawLesson({ id: "a", boards: [rawBoard({ id: "1" }), rawBoard({ id: "2" })] }))!;
    const b = parseLesson(rawLesson({ id: "b" }))!;
    expect(openLesson({ lessons: [b, a], current: { lessonId: "a", board: 1 } }, "x")).toEqual({ lesson: a, board: 1 });
    expect(openLesson({ lessons: [b, a], current: { lessonId: "a", board: 9 } }, "x")).toEqual({ lesson: a, board: 1 });
    expect(openLesson({ lessons: [b, a] }, "x")).toEqual({ lesson: b, board: 0 });
    expect(openLesson({ lessons: [b, a], current: { lessonId: "gone", board: 3 } }, "x")).toEqual({
      lesson: b,
      board: 0,
    });
  });
});

// ─── writeLesson ────────────────────────────────────────────────────────────

describe("запись", () => {
  it("без хранилища — «недоступно»", () => {
    expect(writeLesson(null, lessonAt("a", 1), 0)).toBe("unavailable");
  });

  it("урок туда и обратно — тот же самый", () => {
    const lesson = builtLesson();
    expect(lesson.boards).toHaveLength(2);
    const s = memory();
    expect(writeLesson(s, lesson, 1)).toBe("ok");
    const saved = readSaved(s);
    expect(saved.lessons).toEqual([lesson]);
    expect(saved.current).toEqual({ lessonId: lesson.id, board: 1 });
    expect(parseLesson(JSON.parse(JSON.stringify(lesson)))).toEqual(lesson);
    expect(openLesson(saved, "x")).toEqual({ lesson, board: 1 });
  });

  it("тот же урок заменяется, а не повторяется", () => {
    const s = memory();
    writeLesson(s, lessonAt("a", 1), 0);
    writeLesson(s, lessonAt("b", 2), 0);
    writeLesson(s, { ...lessonAt("a", 3), title: "Новое" }, 0);
    const saved = readSaved(s);
    expect(saved.lessons.map((l) => [l.id, l.title])).toEqual([
      ["a", "Новое"],
      ["b", "Урок b"],
    ]);
  });

  it("уроков не больше 50: новый — сверху, самый старый уходит", () => {
    const old = Array.from({ length: MAX_LESSONS }, (_, i) => lessonAt(`old${i}`, i + 1));
    const s = memory({ [LESSONS_KEY]: JSON.stringify({ version: 1, lessons: old }) });
    expect(writeLesson(s, lessonAt("new", 1000), 0)).toBe("ok");
    const raw = JSON.parse(s.data.get(LESSONS_KEY)!);
    expect(raw.lessons).toHaveLength(MAX_LESSONS);
    expect(raw.lessons[0].id).toBe("new");
    const saved = readSaved(s);
    expect(saved.lessons).toHaveLength(MAX_LESSONS);
    expect(saved.lessons[0].id).toBe("new");
    expect(saved.lessons.some((l) => l.id === "old0")).toBe(false);
    expect(saved.lessons.at(-1)?.id).toBe("old1");
    const times = saved.lessons.map((l) => l.updatedAt);
    expect(times).toEqual([...times].sort((x, y) => y - x));
  });

  it("больше 2 млн знаков — «места нет», и хранилище не трогаем", () => {
    const before = JSON.stringify({ version: 1, lessons: [lessonAt("keep", 1)] });
    const s = memory({ [LESSONS_KEY]: before });
    const huge = { ...lessonAt("huge", 2), title: "x".repeat(MAX_CHARS) };
    expect(writeLesson(s, huge, 0)).toBe("full");
    expect(s.writes).toBe(0);
    expect(s.data.get(LESSONS_KEY)).toBe(before);
  });

  it("ровно 2 млн знаков ещё пишется, на один больше — уже нет", () => {
    const probe = memory();
    const lesson = { ...lessonAt("edge", 1), title: "" };
    writeLesson(probe, lesson, 0);
    const base = probe.data.get(LESSONS_KEY)!.length;
    const exact = memory();
    expect(writeLesson(exact, { ...lesson, title: "x".repeat(MAX_CHARS - base) }, 0)).toBe("ok");
    expect(exact.data.get(LESSONS_KEY)!.length).toBe(MAX_CHARS);
    const over = memory();
    expect(writeLesson(over, { ...lesson, title: "x".repeat(MAX_CHARS - base + 1) }, 0)).toBe("full");
    expect(over.writes).toBe(0);
  });

  it("браузер отказал из-за места — «места нет»; по другой причине — «недоступно»", () => {
    const quota = memory({}, () => {
      throw new DOMException("переполнено", "QuotaExceededError");
    });
    expect(writeLesson(quota, lessonAt("a", 1), 0)).toBe("full");
    const firefox = memory({}, () => {
      throw new DOMException("переполнено", "NS_ERROR_DOM_QUOTA_REACHED");
    });
    expect(writeLesson(firefox, lessonAt("a", 1), 0)).toBe("full");
    const security = memory({}, () => {
      throw new DOMException("нельзя", "SecurityError");
    });
    expect(writeLesson(security, lessonAt("a", 1), 0)).toBe("unavailable");
    const plain = memory({}, () => {
      throw new Error("QuotaExceededError");
    });
    expect(writeLesson(plain, lessonAt("a", 1), 0)).toBe("unavailable");
  });
});

// ─── Настройки ──────────────────────────────────────────────────────────────

describe("настройки показа", () => {
  it("не объект — настройки по умолчанию", () => {
    for (const raw of [null, undefined, 1, "left", [], [DEFAULT_PREFS]]) expect(parsePrefs(raw)).toEqual(DEFAULT_PREFS);
  });

  it("каждое плохое значение заменяется своим значением по умолчанию", () => {
    expect(
      parsePrefs({
        side: "up",
        coords: "yes",
        low: 1,
        look: "dark",
        speed: "fast",
        showMoves: null,
        mode: "erase",
        color: "Z",
      }),
    ).toEqual(DEFAULT_PREFS);
    expect(parsePrefs({ side: "right", coords: false, mode: "setup", color: "Y", junk: 1 })).toEqual({
      ...DEFAULT_PREFS,
      side: "right",
      coords: false,
      mode: "setup",
      color: "Y",
    });
  });

  it("запись и чтение; испорченное и недоступное хранилище — по умолчанию, без ошибок", () => {
    const s = memory();
    const prefs = { ...DEFAULT_PREFS, low: true, look: "device", speed: "normal", showMoves: true } as const;
    writePrefs(s, prefs);
    expect(readPrefs(s)).toEqual(prefs);
    expect(readPrefs(memory({ [PREFS_KEY]: "{" }))).toEqual(DEFAULT_PREFS);
    expect(readPrefs(null)).toEqual(DEFAULT_PREFS);
    const broken = memory({}, () => {
      throw new DOMException("переполнено", "QuotaExceededError");
    });
    expect(() => writePrefs(broken, prefs)).not.toThrow();
    expect(() => writePrefs(null, prefs)).not.toThrow();
  });
});

// ─── Вид доски «для класса» ─────────────────────────────────────────────────

/** Относительная яркость и контраст по WCAG 2. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("доска для класса", () => {
  it("помощник контраста считает как WCAG", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrast("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
  });

  it("не предлагается ребёнку: её нет среди тем, и id «class» не принимается", () => {
    expect(BOARD_THEMES).not.toContain(CLASS_BOARD_THEME);
    expect(BOARD_THEMES.map((t) => t.id)).not.toContain(CLASS_BOARD_THEME.id);
    expect(isBoardThemeId("class")).toBe(false);
    expect(boardThemeOf("class")).toBe(DEFAULT_BOARD_THEME);
  });

  it("цвета заданы как #rrggbb и названия на двух языках", () => {
    for (const c of [CLASS_BOARD_THEME.light, CLASS_BOARD_THEME.dark, CLASS_BOARD_THEME.frame]) {
      expect(c).toMatch(/^#[0-9a-f]{6}$/i);
    }
    expect(CLASS_BOARD_THEME.ru).toBeTruthy();
    expect(CLASS_BOARD_THEME.uz).toBeTruthy();
  });

  it("клетки различаются на проекторе (≥ 4 : 1) — сильнее обычного дерева", () => {
    const classCells = contrast(CLASS_BOARD_THEME.light, CLASS_BOARD_THEME.dark);
    expect(classCells).toBeGreaterThanOrEqual(4);
    expect(classCells).toBeGreaterThan(contrast(DEFAULT_BOARD_THEME.light, DEFAULT_BOARD_THEME.dark));
  });

  it("подписи на рамке читаются (≥ 7 : 1)", () => {
    expect(contrast(CLASS_BOARD_THEME.frame, "#fdf1dc")).toBeGreaterThanOrEqual(7);
  });
});
