/** «Мысли великих», разговоры и «новый взгляд»: у каждой цитаты есть источник, разговоры помечены как придуманные, перевод полный. */
import { describe, expect, it } from "vitest";
import { chessContent } from "@/content/chess/content";
import { DIALOGUES, NEW_VIEWS, THOUGHTS } from "@/content/chess/insights";
import { MORE_SECRETS } from "@/content/chess/stories";

const CYR = /[Ѐ-ӿ]/;
const strings = (x: unknown): string[] =>
  typeof x === "string"
    ? [x]
    : Array.isArray(x)
      ? x.flatMap(strings)
      : x && typeof x === "object"
        ? Object.values(x).flatMap(strings)
        : [];

describe("мысли великих", () => {
  it("у каждой цитаты есть источник и пометка надёжности; неподтверждённые названы прямо", () => {
    expect(THOUGHTS.length).toBeGreaterThanOrEqual(16);
    expect(new Set(THOUGHTS.map((q) => q.id)).size).toBe(THOUGHTS.length);
    for (const q of THOUGHTS) {
      expect(q.quote.length, q.id).toBeGreaterThan(15);
      expect(q.source.length, q.id).toBeGreaterThan(8);
      expect(["primary", "quoted", "attributed"]).toContain(q.level);
      expect(q.meaning.length, q.id).toBeGreaterThan(20);
      expect(q.try.length, q.id).toBeGreaterThan(15);
      if (q.level === "attributed") expect(q.source + q.author, q.id).toMatch(/приписыва|не найден/i);
    }
    // Главное правило: большинство цитат проверено по источнику.
    expect(THOUGHTS.filter((q) => q.level !== "attributed").length).toBeGreaterThan(THOUGHTS.length * 0.8);
  });
});

describe("разговоры и новый взгляд", () => {
  it("разговор: два героя, вывод, и честно сказано, что он придуман", () => {
    expect(DIALOGUES.length).toBeGreaterThanOrEqual(7);
    expect(new Set(DIALOGUES.map((d) => d.id)).size).toBe(DIALOGUES.length);
    for (const d of DIALOGUES) {
      expect(d.lines.length, d.id).toBeGreaterThanOrEqual(4);
      expect(new Set(d.lines.map((l) => l.who)).size, d.id).toBeGreaterThanOrEqual(2);
      expect(d.insight.length, d.id).toBeGreaterThan(20);
      expect(d.basis, d.id).toMatch(/придуман/);
      expect(strings(d).join(" "), d.id).not.toMatch(/неправильн/i);
    }
  });

  it("новый взгляд: миф, ответ и подтверждения; без процентов и рейтингов", () => {
    expect(NEW_VIEWS.length).toBeGreaterThanOrEqual(9);
    expect(new Set(NEW_VIEWS.map((v) => v.id)).size).toBe(NEW_VIEWS.length);
    for (const v of NEW_VIEWS) {
      expect(v.proof.length, v.id).toBeGreaterThanOrEqual(2);
      expect(strings(v).join(" "), v.id).not.toMatch(/%|неправильн/i);
    }
    // Про «шахматы делают умнее» — честно, с осторожной пометкой для взрослых.
    const smarter = NEW_VIEWS.find((v) => v.id === "smarter")!;
    expect(smarter.truth).toMatch(/доказательств пока нет/);
    expect(smarter.note).toBeTruthy();
  });
});

describe("по-узбекски всё переведено", () => {
  const ru = chessContent("ru");
  const uz = chessContent("uz");

  it("цитаты, разговоры и взгляды: те же id, то же число строк, ни одной кириллической буквы", () => {
    for (const key of ["thoughts", "dialogues", "newViews"] as const) {
      expect(
        uz[key].map((x) => x.id),
        key,
      ).toEqual(ru[key].map((x) => x.id));
      for (const s of strings(uz[key])) expect(CYR.test(s), `${key}: ${s}`).toBe(false);
    }
    uz.dialogues.forEach((d, i) => expect(d.lines.length, d.id).toBe(ru.dialogues[i].lines.length));
    uz.newViews.forEach((v, i) => expect(v.proof.length, v.id).toBe(ru.newViews[i].proof.length));
    uz.thoughts.forEach((q, i) => expect(q.level, q.id).toBe(ru.thoughts[i].level));
  });

  it("новые истории: тот же состав абзацев, ни одной кириллической буквы", () => {
    for (const s of MORE_SECRETS) {
      const t = uz.secrets.find((x) => x.id === s.id)!;
      expect(t.story.length, s.id).toBe(s.story.length);
      expect(!!t.deeper, s.id).toBe(!!s.deeper);
      for (const text of strings(t)) expect(CYR.test(text), `${s.id}: ${text}`).toBe(false);
    }
  });
});
