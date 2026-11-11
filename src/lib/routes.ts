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

/**
 * Экран повторения задачи: страница её дня с якорем «#review-<id задачи>». Неделя и день читаются из начала id
 * («w2d3t4», «w1d7r»), поэтому программа с условиями и ответами на главную страницу не попадает.
 */
export function reviewHref(taskId: string): string | null {
  const m = taskId.match(/^w(\d+)d(\d+)[a-z0-9]+$/);
  return m ? `/week/${m[1]}/day/${m[2]}#review-${taskId}` : null;
}
