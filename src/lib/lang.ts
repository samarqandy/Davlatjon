/**
 * Языки платформы — то, что не зависит от React и браузера: можно вызывать и на сервере, и в тестах.
 * Хуки (useT, useLang, useSan…) — в src/lib/i18n.ts.
 */
import { ruSan } from "./chess";

export type Lang = "ru" | "uz";

export const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: "ru", label: "Русский", short: "RU" },
  { id: "uz", label: "Oʻzbekcha", short: "UZ" },
];

/** Пара «по-русски / по-узбекски» → текст на нужном языке. */
export type T = (ru: string, uz: string) => string;

export function tFor(lang: Lang): T {
  return (ru, uz) => (lang === "uz" ? uz : ru);
}

export function pick<V>(lang: Lang, ru: V, uz: V): V {
  return lang === "uz" ? uz : ru;
}

/** Данные на обоих языках — сервер готовит обе версии, клиент показывает нужную. */
export interface Both<V> {
  ru: V;
  uz: V;
}

/**
 * Число с существительным: по-русски — с падежом (3 задачи, 5 задач), по-узбекски существительное
 * после числа не меняется (3 ta masala, 5 ta masala).
 */
export function countText(lang: Lang, n: number, ru: [one: string, few: string, many: string], uz: string): string {
  if (lang === "uz") return `${n} ${uz}`;
  const mod10 = Math.abs(n) % 10;
  const mod100 = Math.abs(n) % 100;
  const word =
    mod10 === 1 && mod100 !== 11 ? ru[0] : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? ru[1] : ru[2];
  return `${n} ${word}`;
}

const FIGURINE: Record<string, string> = { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘" };

/**
 * Запись хода для узбекского интерфейса — фигурками: «♘f3», «♗xc6+», «e8=♕».
 * Буквы фигур в узбекском не устоялись, а значки понятны без перевода и приняты ФИДЕ.
 */
export function figurineSan(san: string): string {
  if (san.startsWith("O-O")) return san.replace(/O/g, "0");
  return san.replace(/^[KQRBN]/, (l) => FIGURINE[l]).replace(/=([QRBN])/, (_, l: string) => `=${FIGURINE[l]}`);
}

/** Запись хода на нужном языке: по-русски — «Кf3», по-узбекски — «♘f3». */
export function sanFor(lang: Lang, san: string): string {
  return lang === "uz" ? figurineSan(san) : ruSan(san);
}

/** Русская запись внутри текста («Фxf7#», «Крg8») → фигурки, для узбекских текстов, собранных из шаблонов. */
export function ruMovesToFigurine(text: string): string {
  const map: Record<string, string> = { Кр: "♔", Ф: "♕", Л: "♖", С: "♗", К: "♘" };
  return text.replace(/(?<![А-Яа-яЁё])(Кр|Ф|Л|С|К)(?=x?[a-h][1-8])/g, (m) => map[m]);
}
