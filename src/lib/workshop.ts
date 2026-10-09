/**
 * Названия уровней опыта. Детям до 10 лет вместо «Уровень 7» и «120 / 300 XP» показываем имя уровня:
 * числа превращают развитие в гонку, а имя — в путь. Названия нейтральны по роду: ни «молодец», ни «умник».
 */
import type { Lang } from "./lang";

interface LevelName {
  emoji: string;
  ru: string;
  uz: string;
}

const NAMES: LevelName[] = [
  { emoji: "🌱", ru: "Росточек", uz: "Niholcha" },
  { emoji: "🔦", ru: "Фонарик", uz: "Chiroq" },
  { emoji: "🧭", ru: "Компас", uz: "Kompas" },
  { emoji: "🔭", ru: "Телескоп", uz: "Teleskop" },
  { emoji: "🧩", ru: "Пазл", uz: "Jumboq" },
  { emoji: "⚙️", ru: "Шестерёнка", uz: "Tishli gʻildirak" },
  { emoji: "🚀", ru: "Ракета", uz: "Raketa" },
  { emoji: "🌟", ru: "Звезда", uz: "Yulduz" },
  { emoji: "🏰", ru: "Замок", uz: "Qasr" },
  { emoji: "👑", ru: "Корона", uz: "Toj" },
];

/** Имя уровня (с первого); после десятого остаётся последнее. */
export function levelName(level: number, lang: Lang): { emoji: string; name: string } {
  const n = NAMES[Math.min(Math.max(level, 1), NAMES.length) - 1];
  return { emoji: n.emoji, name: lang === "uz" ? n.uz : n.ru };
}

/** Числа уровня и опыта показываем с 10 лет; без указанного возраста действует младший профиль. */
export function showsNumbers(age: number | undefined): boolean {
  return age !== undefined && age >= 10;
}
