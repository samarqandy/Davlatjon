/** Русское склонение по числу: 1 команда, 2 команды, 5 команд. */
export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = Math.abs(n) % 10;
  const mod100 = Math.abs(n) % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function pluralize(n: number, one: string, few: string, many: string): string {
  return `${n} ${plural(n, one, few, many)}`;
}

/** «7 мин» из миллисекунд, для родителя. */
export function formatMinutes(ms: number, lang: "ru" | "uz" = "ru"): string {
  const min = Math.round(ms / 60000);
  if (min < 1) return lang === "uz" ? "bir daqiqadan kam" : "меньше минуты";
  return lang === "uz" ? `${min} daqiqa` : `${min} мин`;
}
