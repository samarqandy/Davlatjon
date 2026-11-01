/**
 * Русская запись хода — без шахматного движка: этот модуль подключается к каждой странице через lang.ts,
 * а chess.js нужен только шахматным разделам.
 */
const RU_LETTER: Record<string, string> = { K: "Кр", Q: "Ф", R: "Л", B: "С", N: "К" };

/** Русская запись хода: буквы фигур — Кр, Ф, Л, С, К; рокировка — 0-0. «Re8#» → «Лe8#». */
export function ruSan(san: string): string {
  if (san.startsWith("O-O")) return san.replace(/O/g, "0");
  return san.replace(/^[KQRBN]/, (l) => RU_LETTER[l]).replace(/=([QRBN])/, (_, l: string) => `=${RU_LETTER[l]}`);
}
