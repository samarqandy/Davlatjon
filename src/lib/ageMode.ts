/**
 * Возрастной режим интерфейса (DESIGN.md): малышу (до 7 лет) — крупнее и с картинками, подростку (11+) —
 * спокойнее и строже, без детских украшений. Это только вид: сложность заданий задаёт профиль из age.ts.
 * Та же формула стоит в скрипте <head> (headScript.ts), чтобы режим включался до первой отрисовки.
 */
export type AgeMode = "kid" | "junior" | "teen";

export function ageMode(age: number | undefined): AgeMode {
  if (!age) return "junior";
  if (age <= 7) return "kid";
  if (age <= 10) return "junior";
  return "teen";
}
