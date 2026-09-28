/** Случайное число от 0 до 1 — вынесено из компонентов, чтобы не вызывать Math.random при отрисовке. */
export function random(): number {
  return Math.random();
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}
