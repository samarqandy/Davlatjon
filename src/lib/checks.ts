import type { AnswerSpec, Field } from "@/content/types";

type ChoiceSpec = Extract<AnswerSpec, { kind: "choice" }>;
type AssignSpec = Extract<AnswerSpec, { kind: "assign" }>;
type OrderSpec = Extract<AnswerSpec, { kind: "order" }>;

/** «18.15», «18 15», «6:15» → минуты от начала суток (варианты). */
export function parseTime(input: string): number | null {
  const m = input.trim().match(/^(\d{1,2})\s*[:.\-\s]\s*(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

export function timeMatches(input: string, answer: string): boolean {
  const given = parseTime(input);
  const expected = parseTime(answer);
  if (given === null || expected === null) return false;
  // Ребёнок может записать вечернее время по-домашнему: 6:15 вместо 18:15.
  return given === expected || given + 12 * 60 === expected;
}

const LATIN_TO_CYRILLIC: Record<string, string> = {
  A: "А",
  B: "В",
  E: "Е",
  K: "К",
  M: "М",
  H: "Н",
  O: "О",
  P: "Р",
  C: "С",
  T: "Т",
  X: "Х",
};

export function normalizeCoord(input: string): string {
  return [...input.trim().toUpperCase().replace(/\s+/g, "")].map((ch) => LATIN_TO_CYRILLIC[ch] ?? ch).join("");
}

export function parseNumber(input: string): number | null {
  const cleaned = input.trim().replace(/\s+/g, "").replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  return Number(cleaned);
}

export function fieldMatches(field: Field, value: string): boolean {
  switch (field.type) {
    case "number":
      return parseNumber(value) === field.answer;
    case "time":
      return timeMatches(value, field.answer);
    case "coord":
      return normalizeCoord(value) === normalizeCoord(field.answer);
  }
}

export interface FieldsResult {
  allCorrect: boolean;
  /** true — совпало, false — не совпало, null — поле пустое. */
  perField: Record<string, boolean | null>;
  filled: number;
}

export function checkFields(fields: Field[], values: Record<string, string>): FieldsResult {
  const perField: Record<string, boolean | null> = {};
  let filled = 0;
  for (const f of fields) {
    const v = values[f.id]?.trim() ?? "";
    if (!v) {
      perField[f.id] = null;
      continue;
    }
    filled++;
    perField[f.id] = fieldMatches(f, v);
  }
  return { allCorrect: fields.every((f) => perField[f.id] === true), perField, filled };
}

export interface ChoiceResult {
  correct: boolean;
  /** Сколько верных вариантов не отмечено. */
  missing: number;
  /** Сколько отмечено лишних. */
  extra: number;
}

export function checkChoice(spec: ChoiceSpec, selected: string[]): ChoiceResult {
  const correct = new Set(spec.correct);
  const chosen = new Set(selected);
  const missing = [...correct].filter((id) => !chosen.has(id)).length;
  const extra = [...chosen].filter((id) => !correct.has(id)).length;
  return { correct: missing === 0 && extra === 0, missing, extra };
}

export interface AssignResult {
  allCorrect: boolean;
  correctCount: number;
  total: number;
  filled: number;
}

export function checkAssign(spec: AssignSpec, values: Record<string, string>): AssignResult {
  let correctCount = 0;
  let filled = 0;
  for (const item of spec.items) {
    if (values[item.id]) filled++;
    if (values[item.id] === spec.correct[item.id]) correctCount++;
  }
  return { allCorrect: correctCount === spec.items.length, correctCount, total: spec.items.length, filled };
}

export function checkOrder(spec: OrderSpec, order: string[]): boolean {
  return order.length === spec.correct.length && order.every((id, i) => id === spec.correct[i]);
}

/** Сколько элементов стоят на своих местах. */
export function orderMatches(spec: OrderSpec, order: string[]): number {
  return order.filter((id, i) => id === spec.correct[i]).length;
}

export function signsValue(numbers: number[], signs: ("+" | "−")[]): number {
  return numbers.slice(1).reduce((acc, n, i) => (signs[i] === "+" ? acc + n : acc - n), numbers[0]);
}
