/**
 * Даты на экране — через Intl, одинаково на обоих языках: «05.10.2026» и «05.10, 09:07».
 * Узбекская локаль Intl ставит косую черту («05/10/2026»), а в Узбекистане привычны точки, поэтому формат — русский:
 * в нём только цифры, слов нет.
 */
const DAY = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
const STAMP = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** «05.10.2026» */
export function dayText(ms: number): string {
  return DAY.format(ms);
}

/** «05.10, 09:07» */
export function stampText(ms: number): string {
  return STAMP.format(ms);
}
