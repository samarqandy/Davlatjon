/** Словарь шахматиста: собран из уроков, без повторов, каждая ссылка ведёт в существующий урок. */
import { describe, expect, it } from "vitest";
import { chessContent } from "@/content/chess/content";
import { GLOSSARY_GROUPS, chessGlossary, glossaryKey } from "@/content/chess/glossary";
import type { Lang } from "@/lib/lang";

const LANGS: Lang[] = ["ru", "uz"];

describe("словарь шахматиста", () => {
  it.each(LANGS)("термины всех разделов, без повторов и пустых строк (%s)", (lang) => {
    const c = chessContent(lang);
    const entries = chessGlossary(lang);
    const sources = [
      ...c.levels,
      ...c.tactics,
      ...c.course1Lessons,
      ...c.course2Lessons,
      ...c.course3Lessons,
      ...c.course4Lessons,
      ...c.course5Lessons,
      ...c.endgamePieces,
    ];
    // Каждый термин из уроков есть в словаре; повторы убраны по русскому названию — число статей в языках одно.
    const written = new Set(sources.flatMap((s) => s.terms.map((t) => glossaryKey(t.term))));
    for (const key of entries.map((e) => glossaryKey(e.term))) expect(written, key).toContain(key);
    expect(entries.length).toBe(chessGlossary("ru").length);
    if (lang === "ru") expect(entries.map((e) => glossaryKey(e.term)).sort()).toEqual([...written].sort());
    expect(entries.length).toBeGreaterThan(150);
    for (const e of entries) {
      expect(e.term.trim(), e.href).not.toBe("");
      expect(e.text.trim(), e.term).not.toBe("");
      expect(e.lesson.trim(), e.term).not.toBe("");
      expect(GLOSSARY_GROUPS, e.term).toContain(e.group);
    }
    // В каждом разделе школы есть слова.
    for (const g of GLOSSARY_GROUPS)
      expect(
        entries.some((e) => e.group === g),
        g,
      ).toBe(true);
  });

  it("ссылки ведут в существующие уроки", () => {
    const c = chessContent("ru");
    const known = new Set<string>([
      ...c.levels.map((l) => `/chess/${l.id}`),
      ...c.tactics.map((t) => `/chess/tactics#${t.id}`),
      ...c.course1Lessons.map((l) => `/chess/course#${l.id}`),
      ...c.course2Lessons.map((l) => `/chess/course-2#${l.id}`),
      ...c.course3Lessons.map((l) => `/chess/course-3#${l.id}`),
      ...c.course4Lessons.map((l) => `/chess/course-4#${l.id}`),
      ...c.course5Lessons.map((l) => `/chess/course-5#${l.id}`),
      ...c.endgamePieces.map((l) => `/chess/endgames/pieces#${l.id}`),
    ]);
    for (const e of chessGlossary("ru")) expect(known, `${e.term}: ${e.href}`).toContain(e.href);
  });

  it("порядок — по алфавиту; узбекский список без кириллицы и той же длины", () => {
    const ru = chessGlossary("ru");
    const keys = ru.map((e) => glossaryKey(e.term));
    expect(keys).toEqual([...keys].sort(new Intl.Collator("ru").compare));
    const uz = chessGlossary("uz");
    expect(uz.length).toBe(ru.length);
    for (const e of uz) expect(`${e.term} ${e.text} ${e.lesson}`, e.href).not.toMatch(/[а-яё]/i);
  });

  it("ключ поиска: регистр, «ё» и апострофы не мешают", () => {
    expect(glossaryKey("Ёлочка")).toBe("елочка");
    expect(glossaryKey("Bogʻlash")).toBe("boglash");
    expect(glossaryKey("«Мат ферзю»")).toBe("мат ферзю");
  });
});
