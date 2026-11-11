/**
 * Задача дня: одна и та же в один день; minStars — сложность по возрасту (у старших — от трёх звёзд).
 * Отдельно от самих задач: главной шахмат хватает короткого списка (id, название, звёзды, позиция).
 */
export function pickDaily<T extends { stars: number }>(puzzles: readonly T[], date: Date, minStars = 1): T {
  const pool = puzzles.filter((p) => p.stars >= minStars);
  const list = pool.length ? pool : puzzles;
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return list[((day % list.length) + list.length) % list.length];
}
