/**
 * Узбекская версия контента: накладки без опечаток, без кириллицы и согласованы с ответами.
 * Правила — в docs/uzbek-style.md.
 */
import { describe, expect, it } from "vitest";
import { CHESS_RU, chessContent } from "@/content/chess/content";
import { CHESS_UZ } from "@/content/chess/uz";
import { cyrillicPaths, overlayProblems } from "@/content/localize";
import { levelsFor, sectionsFor, hintSteps, COLOR_NAME_UZ } from "@/content/meta";
import { allDays, WEEKS } from "@/content/program";
import type { AnswerSpec, Block, Day, Visual } from "@/content/types";
import { WEEKS_UZ, guideFor, localizeDay, localizeWeek } from "@/content/uz";
import { encode } from "@/lib/cipher";
import { figurineSan } from "@/lib/i18n";

const started = (x: unknown) => !!x && (typeof x === "string" ? x.length > 0 : Object.keys(x as object).length > 0);

describe("узбекский шахматный контент", () => {
  const UZ = chessContent("uz");
  const levelIds = CHESS_RU.levels.map((l) => l.id);
  const levelsUz = CHESS_UZ.levels as Record<string, unknown>;

  it.each(levelIds)("уровень %s: накладка без ошибок; начатый перевод — полный", (id) => {
    const base = CHESS_RU.levels.find((l) => l.id === id);
    expect(overlayProblems(base, levelsUz[id])).toEqual([]);
    if (started(levelsUz[id])) expect(cyrillicPaths(UZ.levels.find((l) => l.id === id))).toEqual([]);
  });

  const parts = (Object.keys(CHESS_RU) as (keyof typeof CHESS_RU)[]).filter((p) => p !== "levels");
  /** Таблица «как фигура называется на разных языках»: русское название там — на своём месте. */
  const allowed = (part: string, path: string) => part === "pieceNamesTable" && /\]\.ru: /.test(path);
  it.each(parts)("%s: накладка без ошибок; начатый перевод — полный", (part) => {
    expect(overlayProblems(CHESS_RU[part], CHESS_UZ[part])).toEqual([]);
    if (started(CHESS_UZ[part])) expect(cyrillicPaths(UZ[part]).filter((p) => !allowed(part, p))).toEqual([]);
  });

  it("загадки: ответ — один из вариантов и на узбекском", () => {
    for (const r of UZ.riddles) expect(r.options).toContain(r.answer);
  });

  it("названия фигур по-узбекски — привычные слова", () => {
    if (!started(CHESS_UZ.pieceNames)) return;
    expect(Object.values(UZ.pieceNames).map((n) => n.toLowerCase())).toEqual(
      expect.arrayContaining(["shoh", "farzin", "rux", "fil", "ot", "piyoda"]),
    );
  });

  it("ходы записываются фигурками", () => {
    expect(figurineSan("Nf3")).toBe("♘f3");
    expect(figurineSan("Qxf7#")).toBe("♕xf7#");
    expect(figurineSan("e8=Q+")).toBe("e8=♕+");
    expect(figurineSan("O-O-O")).toBe("0-0-0");
  });
});

describe("узбекская программа занятий", () => {
  const days = allDays();

  it.each(days.map((d) => d.id))("день %s: накладка без ошибок; начатый перевод — полный", (id) => {
    const day = days.find((d) => d.id === id)!;
    const uz = WEEKS_UZ[day.week]?.days[id];
    expect(overlayProblems(day, uz)).toEqual([]);
    if (started(uz)) expect(cyrillicPaths(localizeDay(day, "uz"))).toEqual([]);
  });

  it.each(WEEKS.map((w) => w.number))("неделя %i: название и цель — по-узбекски, если перевод начат", (n) => {
    const week = WEEKS.find((w) => w.number === n)!;
    const uz = WEEKS_UZ[n];
    if (!uz?.title) return;
    const w = localizeWeek(week, "uz");
    expect(cyrillicPaths({ title: w.title, subtitle: w.subtitle, goal: w.goal })).toEqual([]);
  });

  it.each(days.map((d) => d.id))("день %s: клетки карт и шифры согласованы с ответами", (id) => {
    const ru = days.find((d) => d.id === id)!;
    const uz = localizeDay(ru, "uz");
    ru.tasks.forEach((t, i) => {
      const u = uz.tasks[i];
      expect(coordsOf(u, "uz"), t.id).toEqual(coordsOf(t, "ru"));
      if (u.answer.kind === "cipher") {
        expect(encode(u.answer.answer, u.answer.shift, u.answer.alphabet), t.id).toBe(u.answer.encoded);
      }
    });
  });

  it("разделы, уровни, подсказки и цвета — по-узбекски", () => {
    expect(cyrillicPaths(sectionsFor("uz"))).toEqual([]);
    expect(cyrillicPaths(levelsFor("uz"))).toEqual([]);
    expect(cyrillicPaths(hintSteps("uz"))).toEqual([]);
    expect(cyrillicPaths(COLOR_NAME_UZ)).toEqual([]);
  });

  it("методичка и вопросы недельного обзора — по-узбекски", () => {
    const uz = guideFor("uz");
    expect(cyrillicPaths(uz)).toEqual([]);
    for (const w of WEEKS) expect(cyrillicPaths(localizeWeek(w, "uz").review), `week ${w.number}`).toEqual([]);
  });

  it("переведено всё: каждый день и каждая неделя", () => {
    for (const d of days) expect(started(WEEKS_UZ[d.week]?.days[d.id]), d.id).toBe(true);
    for (const w of WEEKS) {
      const uz = localizeWeek(w, "uz");
      expect(cyrillicPaths({ title: uz.title, subtitle: uz.subtitle, goal: uz.goal }), `week ${w.number}`).toEqual([]);
    }
  });
});

describe("узбекский шахматный контент — полнота", () => {
  it("у каждой части и каждого уровня есть перевод", () => {
    for (const part of Object.keys(CHESS_RU) as (keyof typeof CHESS_RU)[]) {
      const needs = cyrillicPaths(CHESS_RU[part]).length > 0;
      if (part === "levels") continue;
      if (needs) expect(started(CHESS_UZ[part]), part).toBe(true);
    }
    for (const l of CHESS_RU.levels)
      expect(started((CHESS_UZ.levels as Record<string, unknown>)[l.id]), l.id).toBe(true);
  });
});

/**
 * Все клетки карт задачи — в виде «номер столбца:строка», чтобы сравнить русскую и узбекскую версии:
 * буквы разные (Б3 и B3), а место на карте одно и то же.
 */
function coordsOf(t: Day["tasks"][number], lang: string): string[] {
  const out: string[] = [];
  const cell = (cols: string[], c: string) => {
    const col = cols.findIndex((x) => c.startsWith(x));
    out.push(col < 0 ? `?${lang}:${c}` : `${col}:${c.slice(cols[col].length)}`);
  };
  const visual = (v: Visual | undefined) => {
    if (v?.type === "coordGrid") for (const it of v.items) cell(v.cols, it.cell);
  };
  const block = (b: Block) => {
    if (b.type === "visual") visual(b.visual);
    if (b.type === "question") visual(b.visual);
  };
  t.body.forEach(block);
  const a: AnswerSpec = t.answer;
  if (a.kind === "fields") for (const f of a.fields) if (f.type === "coord") cell(f.cols, f.answer);
  return out;
}
