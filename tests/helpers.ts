/** Общие помощники для проверки ответов. */
import { findTask } from "@/content/program";
import type { AnswerSpec, Task } from "@/content/types";

export function task(id: string): Task {
  const found = findTask(id);
  if (!found) throw new Error(`Нет задачи ${id}`);
  return found.task;
}

export function answer<K extends AnswerSpec["kind"]>(id: string, kind: K): Extract<AnswerSpec, { kind: K }> {
  const a = task(id).answer;
  if (a.kind !== kind) throw new Error(`${id}: ожидался ответ ${kind}, а в задаче ${a.kind}`);
  return a as Extract<AnswerSpec, { kind: K }>;
}

/** Ответы числовых полей задачи: id поля → число. */
export function numbers(id: string): Record<string, number> {
  const a = answer(id, "fields");
  return Object.fromEntries(a.fields.map((f) => [f.id, f.type === "number" ? f.answer : NaN]));
}

/** Ответы полей «время» и «клетка карты»: id поля → строка. */
export function times(id: string): Record<string, string> {
  const a = answer(id, "fields");
  return Object.fromEntries(a.fields.map((f) => [f.id, f.type === "time" || f.type === "coord" ? f.answer : ""]));
}

/** Ответы текстовых полей: id поля → слово. */
export function texts(id: string): Record<string, string> {
  const a = answer(id, "fields");
  return Object.fromEntries(a.fields.map((f) => [f.id, f.type === "text" ? f.answer : ""]));
}

export function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  return items.flatMap((x, i) => permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((p) => [x, ...p]));
}

export const addMinutes = (hhmm: string, minutes: number) => {
  const [h, m] = hhmm.split(":").map(Number);
  const total = (h * 60 + m + minutes + 24 * 60) % (24 * 60);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

/** Первая иллюстрация нужного типа в условии задачи (в том числе внутри вопросов а), б)…). */
export function visual<T extends string>(id: string, type: T, index = 0) {
  const visuals = task(id).body.flatMap((b) =>
    b.type === "visual" ? [b.visual] : b.type === "question" && b.visual ? [b.visual] : [],
  );
  const found = visuals.filter((v) => v.type === type)[index];
  if (!found) throw new Error(`${id}: нет иллюстрации ${type}`);
  return found as Extract<(typeof visuals)[number], { type: T }>;
}
