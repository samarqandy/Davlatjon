import type { PerformerCommand, PerformerPuzzle } from "@/content/types";

/**
 * Исполнитель — «машина» с несколькими командами (Удвоитель, Кузнечик…).
 * Программа — список номеров команд.
 */

/** Надпись на кнопке: «+1», «−3», «×2». */
export function commandLabel(c: PerformerCommand): string {
  if (c.op === "add") return `+${c.value}`;
  if (c.op === "sub") return `−${c.value}`;
  return `×${c.value}`;
}

/** Как команду прочитать вслух: «прибавь 1», «отними 3», «удвой». */
export function commandName(c: PerformerCommand): string {
  if (c.op === "add") return `прибавь ${c.value}`;
  if (c.op === "sub") return `отними ${c.value}`;
  if (c.value === 2) return "удвой";
  if (c.value === 3) return "утрой";
  return `умножь на ${c.value}`;
}

export function applyCommand(value: number, c: PerformerCommand): number {
  if (c.op === "add") return value + c.value;
  if (c.op === "sub") return value - c.value;
  return value * c.value;
}

/** Границы чисел: по умолчанию от 0 до 1000. */
export function performerBounds(p: PerformerPuzzle): { min: number; max: number } {
  return { min: p.min ?? 0, max: p.max ?? 1000 };
}

export function inRange(p: PerformerPuzzle, value: number): boolean {
  const { min, max } = performerBounds(p);
  return value >= min && value <= max;
}

export interface PerformerRun {
  /** Числа по дороге, начиная со start. */
  values: number[];
  /** Номер команды (с нуля), после которой число вышло бы за границы, или null. */
  failedAt: number | null;
}

export function runPerformer(p: PerformerPuzzle, program: number[]): PerformerRun {
  const values = [p.start];
  for (let i = 0; i < program.length; i++) {
    const command = p.commands[program[i]];
    if (!command) return { values, failedAt: i };
    const next = applyCommand(values[values.length - 1], command);
    if (!inRange(p, next)) return { values, failedAt: i };
    values.push(next);
  }
  return { values, failedAt: null };
}

/** Все команды только увеличивают число — значит, «перелёт» через цель уже не исправить. */
export function onlyGrows(p: PerformerPuzzle): boolean {
  return p.commands.every((c) => (c.op === "add" && c.value > 0) || (c.op === "mul" && c.value > 1));
}

/** Кратчайшие программы: длина и их количество (поиск в ширину по числам). */
export function shortestPrograms(p: PerformerPuzzle): { length: number; count: number } {
  const dist = new Map<number, number>([[p.start, 0]]);
  const ways = new Map<number, number>([[p.start, 1]]);
  const queue = [p.start];
  while (queue.length) {
    const v = queue.shift()!;
    const d = dist.get(v)!;
    for (const c of p.commands) {
      const n = applyCommand(v, c);
      if (!inRange(p, n)) continue;
      if (!dist.has(n)) {
        dist.set(n, d + 1);
        ways.set(n, ways.get(v)!);
        queue.push(n);
      } else if (dist.get(n) === d + 1) {
        ways.set(n, ways.get(n)! + ways.get(v)!);
      }
    }
  }
  return dist.has(p.target)
    ? { length: dist.get(p.target)!, count: ways.get(p.target)! }
    : { length: Infinity, count: 0 };
}
