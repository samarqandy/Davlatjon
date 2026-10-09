/**
 * Фразы обратной связи. По мастер-промпту — никогда не говорим «неправильно»:
 * «Давай проверим твою идею», «Какая часть точно верная?», «Проверим на маленьком примере?»
 * Узбекские фразы — свои, живые, а не перевод русских (docs/uzbek-style.md).
 */
import type { Both, Lang } from "./lang";

const PRAISE: Both<string[]> = {
  ru: ["Ответ совпадает! 🎉", "Так и есть! ✨", "Сошлось! 🌟", "Точно! 👏"],
  uz: ["Toʻgʻri! 🎉", "Aynan shunday! ✨", "Barakalla! 🌟", "Ofarin! 👏"],
};

const EXPLAIN: Both<string[]> = {
  ru: [
    "А теперь самое интересное: как ты это узнал?",
    "Сможешь объяснить, почему это так?",
    "Как это доказать маме или папе?",
    "Можно ли решить по-другому?",
  ],
  uz: [
    "Endi eng qizigʻi: buni qanday bilding?",
    "Nega aynan shunday ekanini tushuntirib bera olasanmi?",
    "Buni oyingga yoki dadangga qanday isbotlab berarding?",
    "Boshqa usul bilan ham yechsa boʻladimi?",
  ],
};

const RETRY_TITLE: Both<string[]> = {
  ru: ["Давай проверим твою идею! 🤔", "Пока не сходится.", "Интересная попытка!", "Не сдавайся!"],
  uz: [
    "Qani, fikringni birga tekshiraylik! 🤔",
    "Hali toʻgʻri emas — yana oʻylab koʻr.",
    "Qiziq fikr!",
    "Boʻsh kelma!",
  ],
};

const RETRY_SUB: Both<string[]> = {
  ru: [
    "Какая часть решения точно верная?",
    "Что мы знаем точно? Попробуй проверить на маленьком примере.",
    "Прочитай условие ещё раз — может быть, что-то ускользнуло?",
    "Сравни свой ответ с условием шаг за шагом.",
  ],
  uz: [
    "Yechimning qaysi qismi aniq toʻgʻri?",
    "Nima aniq maʼlum? Kichkina misolda tekshirib koʻr.",
    "Shartni yana bir bor oʻqib chiq — balki biror narsa eʼtibordan chetda qolgandir?",
    "Javobingni shart bilan qadamma-qadam solishtirib chiq.",
  ],
};

export function praise(n: number, lang: Lang = "ru"): string {
  return PRAISE[lang][n % PRAISE[lang].length];
}

export function askExplain(n: number, lang: Lang = "ru"): string {
  return EXPLAIN[lang][n % EXPLAIN[lang].length];
}

export function retryTitle(n: number, lang: Lang = "ru"): string {
  return RETRY_TITLE[lang][n % RETRY_TITLE[lang].length];
}

/** Подсказка, что делать дальше; после нескольких попыток — предложить подсказку или взрослого. */
export function retrySub(n: number, hintsLeft: boolean, lang: Lang = "ru"): string {
  const base = RETRY_SUB[lang][n % RETRY_SUB[lang].length];
  if (n < 2) return base;
  if (lang === "uz") {
    return hintsLeft
      ? `${base} Maslahatni ochsang ham boʻladi 💡`
      : `${base} Masalani kattalar bilan birga koʻrib chiq — birgalikda albatta uddalaysizlar.`;
  }
  return hintsLeft ? `${base} Можно открыть подсказку 💡` : `${base} Обсуди задачу со взрослым — вместе разберётесь.`;
}
