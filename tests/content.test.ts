/**
 * Проверка структуры контента и качества текста.
 * Правила взяты из мастер-промпта (структура дня, уровни, подсказки, язык).
 */
import { describe, expect, it } from "vitest";
import { SECTIONS } from "@/content/meta";
import { WEEKS, allDays, allTasks } from "@/content/program";
import type { Block, Task } from "@/content/types";

function blockTexts(b: Block): string[] {
  switch (b.type) {
    case "p":
    case "note":
      return [b.text];
    case "list":
      return b.items;
    case "question":
      return [b.label, b.text ?? ""];
    case "visual":
      return [];
  }
}

function taskTexts(t: Task): string[] {
  return [
    t.title,
    ...t.body.flatMap(blockTexts),
    ...t.followUps,
    ...t.hints,
    t.solution.answer,
    ...t.solution.explanation,
    ...(t.solution.discuss ?? []),
  ];
}

describe("структура программы", () => {
  it("первая неделя состоит из 7 дней по порядку", () => {
    const week = WEEKS[0];
    expect(week.number).toBe(1);
    expect(week.days.map((d) => d.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    week.days.forEach((d) => expect(d.id).toBe(`w${d.week}d${d.day}`));
  });

  it("в каждом дне 6–10 задач", () => {
    for (const day of allDays()) {
      expect(day.tasks.length, day.id).toBeGreaterThanOrEqual(6);
      expect(day.tasks.length, day.id).toBeLessThanOrEqual(10);
    }
  });

  it("идентификаторы задач уникальны и начинаются с идентификатора дня", () => {
    const ids = new Set<string>();
    for (const day of allDays()) {
      for (const t of day.tasks) {
        expect(t.id.startsWith(day.id), t.id).toBe(true);
        expect(ids.has(t.id), `повтор ${t.id}`).toBe(false);
        ids.add(t.id);
      }
    }
  });

  it("у каждой задачи 5 подсказок, вопросы после решения и ответ для родителя", () => {
    for (const t of allTasks()) {
      expect(t.hints, t.id).toHaveLength(5);
      t.hints.forEach((h) => expect(h.trim().length, t.id).toBeGreaterThan(10));
      expect(t.followUps.length, t.id).toBeGreaterThan(0);
      expect(t.solution.answer.trim(), t.id).not.toBe("");
      expect(t.solution.explanation.length, t.id).toBeGreaterThan(0);
      expect(SECTIONS[t.section], t.id).toBeDefined();
    }
  });

  it("задачи идут в порядке разделов дня", () => {
    const order = ["warmup", "logic", "pattern", "algorithm", "spatial", "real", "challenge", "research"];
    for (const day of allDays()) {
      const idx = day.tasks.map((t) => order.indexOf(t.section));
      // Порядок внутри дня может немного отличаться, но разминка — всегда в начале,
      // а задача-вызов и исследование — в конце.
      expect(day.tasks[0].section, day.id).toBe("warmup");
      const last = day.tasks[day.tasks.length - 1].section;
      expect(["challenge", "research"], day.id).toContain(last);
      expect(
        idx.every((i) => i >= 0),
        day.id,
      ).toBe(true);
    }
  });

  it("мини-исследование есть только в седьмой день, и оно последнее", () => {
    for (const day of allDays()) {
      const research = day.tasks.filter((t) => t.section === "research");
      if (day.day === 7) {
        expect(research).toHaveLength(1);
        expect(day.tasks[day.tasks.length - 1].section).toBe("research");
      } else {
        expect(research, day.id).toHaveLength(0);
      }
    }
  });

  it("за неделю соблюдён баланс типов задач", () => {
    const count = (s: string) => allTasks().filter((t) => t.section === s).length;
    expect(count("warmup")).toBeGreaterThanOrEqual(13);
    expect(count("logic")).toBeGreaterThanOrEqual(7);
    expect(count("pattern")).toBeGreaterThanOrEqual(7);
    expect(count("algorithm")).toBeGreaterThanOrEqual(7);
    expect(count("spatial")).toBeGreaterThanOrEqual(7);
    expect(count("real")).toBeGreaterThanOrEqual(6);
    expect(count("challenge")).toBeGreaterThanOrEqual(6);
  });

  it("задач уровня 🔴 и ⭐ немного, а сложность растёт к концу недели", () => {
    const hard = allTasks().filter((t) => t.level >= 4);
    expect(hard.length).toBeLessThanOrEqual(4);
    const avg = (d: number) => {
      const tasks = WEEKS[0].days[d - 1].tasks;
      return tasks.reduce((s, t) => s + t.level, 0) / tasks.length;
    };
    expect(avg(1)).toBeLessThan(avg(4));
    expect(avg(1)).toBeLessThan(avg(6));
    expect(avg(1)).toBeLessThan(avg(7));
  });

  it("у каждого дня заполнен раздел для родителя", () => {
    for (const day of allDays()) {
      expect(day.parent.skills.length, day.id).toBeGreaterThan(0);
      expect(day.parent.observe.length, day.id).toBeGreaterThan(0);
      expect(day.parent.mistakes.length, day.id).toBeGreaterThan(0);
      expect(day.parent.question.trim(), day.id).not.toBe("");
    }
  });

  it("в недельном обзоре 10 вопросов наблюдения", () => {
    expect(WEEKS[0].review).toHaveLength(10);
  });
});

describe("качество текста", () => {
  const all = allTasks().flatMap((t) => taskTexts(t).map((text) => ({ id: t.id, text })));

  it("в русских словах нет латинских букв-двойников", () => {
    for (const { id, text } of all) {
      const mixed = text.match(/[А-Яа-яЁё]+[A-Za-z]+[А-Яа-яЁё]*|[A-Za-z]+[А-Яа-яЁё]+/g);
      expect(mixed, `${id}: ${text}`).toBeNull();
    }
  });

  it("разметка сбалансирована: `…` и **…**", () => {
    for (const { id, text } of all) {
      expect((text.match(/`/g) ?? []).length % 2, `${id}: ${text}`).toBe(0);
      expect((text.match(/\*\*/g) ?? []).length % 2, `${id}: ${text}`).toBe(0);
    }
  });

  it("в математических выражениях используется настоящий минус «−»", () => {
    for (const { id, text } of all) {
      const math = text.match(/`[^`]*`/g) ?? [];
      for (const m of math) expect(/\d\s*-\s*\d/.test(m), `${id}: ${m}`).toBe(false);
    }
  });

  it("условия для ребёнка не содержат слова «неправильно»", () => {
    for (const t of allTasks()) {
      const childTexts = [...t.body.flatMap(blockTexts), ...t.hints, ...t.followUps];
      for (const text of childTexts) expect(/неправильн/i.test(text), `${t.id}: ${text}`).toBe(false);
    }
  });

  it("нет двойных пробелов и пробелов перед знаками препинания", () => {
    for (const { id, text } of all) {
      expect(/ {2,}/.test(text), `${id}: «${text}»`).toBe(false);
      expect(/ [,.!?:;](?!\.)/.test(text.replace(/`[^`]*`/g, "X")), `${id}: «${text}»`).toBe(false);
    }
  });
});
