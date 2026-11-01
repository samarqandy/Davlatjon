/** Адреса дней — без импорта программы: иначе клиент получает все задачи с ответами ради одной строки. */
type DayRef = { week: number; day: number };

export function dayHref(day: DayRef): string {
  return `/week/${day.week}/day/${day.day}`;
}

export function printHref(day: DayRef): string {
  return `/week/${day.week}/day/${day.day}/print`;
}

export function parentDayHref(day: DayRef): string {
  return `/parent/week/${day.week}/day/${day.day}`;
}
