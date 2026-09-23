/**
 * Фразы обратной связи. По мастер-промпту — никогда не говорим «неправильно»:
 * «Давай проверим твою идею», «Какая часть точно верная?», «Проверим на маленьком примере?»
 */

const PRAISE = ["Ответ совпадает! 🎉", "Так и есть! ✨", "Сошлось! 🌟", "Точно! 👏"];

const EXPLAIN = [
  "А теперь самое интересное: как ты это узнал?",
  "Сможешь объяснить, почему это так?",
  "Как бы ты доказал это маме или папе?",
  "Можно ли решить по-другому?",
];

const RETRY_TITLE = ["Давай проверим твою идею! 🤔", "Пока не сходится.", "Интересная попытка!", "Не сдавайся!"];

const RETRY_SUB = [
  "Какая часть решения точно верная?",
  "Что мы знаем точно? Попробуй проверить на маленьком примере.",
  "Прочитай условие ещё раз — может быть, что-то ускользнуло?",
  "Сравни свой ответ с условием шаг за шагом.",
];

export function praise(n: number): string {
  return PRAISE[n % PRAISE.length];
}

export function askExplain(n: number): string {
  return EXPLAIN[n % EXPLAIN.length];
}

export function retryTitle(n: number): string {
  return RETRY_TITLE[n % RETRY_TITLE.length];
}

/** Подсказка, что делать дальше; после нескольких попыток — предложить подсказку или взрослого. */
export function retrySub(n: number, hintsLeft: boolean): string {
  const base = RETRY_SUB[n % RETRY_SUB.length];
  if (n < 2) return base;
  return hintsLeft ? `${base} Можно открыть подсказку 💡` : `${base} Обсуди задачу со взрослым — вместе разберётесь.`;
}
