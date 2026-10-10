/**
 * Короткий вводный тест «С какой недели начать?»: шесть задач, по две на каждую неделю. Это не оценка,
 * а способ не скучать (сильному) и не потеряться (тому, кому нужна первая неделя): начинаем с той недели,
 * где впервые что-то оказалось новым. Ответов «верно/неверно» ребёнку не показываем.
 */
export type Week = 1 | 2 | 3;

export interface PlacementQuestion {
  id: string;
  week: Week;
  ru: string;
  uz: string;
  answer: number;
}

export const PLACEMENT: readonly PlacementQuestion[] = [
  { id: "a1", week: 1, ru: "Сколько будет 27 + 18?", uz: "27 + 18 nechaga teng?", answer: 45 },
  {
    id: "a2",
    week: 1,
    ru: "Продолжи ряд: 3, 6, 9, 12, … Какое число следующее?",
    uz: "Qatorni davom ettir: 3, 6, 9, 12, … Keyingi son qaysi?",
    answer: 15,
  },
  {
    id: "b1",
    week: 2,
    ru: "Задумали число. Если прибавить к нему 17, получится 42. Какое число задумали?",
    uz: "Bir son oʻylashdi. Unga 17 qoʻshilsa, 42 chiqadi. Qaysi son oʻylangan?",
    answer: 25,
  },
  {
    id: "b2",
    week: 2,
    ru: "У Лолы 5 пачек карандашей по 8 штук в каждой. Она отдала 12 карандашей. Сколько осталось?",
    uz: "Lolada 5 ta qadoq qalam bor, har birida 8 tadan. U 12 ta qalam berib yubordi. Nechta qoldi?",
    answer: 28,
  },
  {
    id: "c1",
    week: 3,
    ru: "Продолжи ряд: 2, 4, 8, 16, … Какое число следующее?",
    uz: "Qatorni davom ettir: 2, 4, 8, 16, … Keyingi son qaysi?",
    answer: 32,
  },
  {
    id: "c2",
    week: 3,
    ru: "В классе 20 детей. 12 любят футбол, 15 любят мультфильмы, и каждый любит хотя бы одно. Сколько детей любят и то и другое?",
    uz: "Sinfda 20 ta bola bor. 12 tasi futbolni, 15 tasi multfilmlarni yaxshi koʻradi, har biri kamida bittasini yaxshi koʻradi. Nechta bola ikkalasini ham yaxshi koʻradi?",
    answer: 7,
  },
];

/** Номер недели, с которой начать: первая, где хотя бы одна из двух задач не получилась. После всех шести — третья. */
export function startWeekFor(correct: Record<string, boolean>): Week {
  for (const week of [1, 2] as const) {
    const qs = PLACEMENT.filter((q) => q.week === week);
    if (!qs.every((q) => correct[q.id])) return week;
  }
  return 3;
}

export function isCorrect(q: PlacementQuestion, input: string): boolean {
  return /^\d{1,4}$/.test(input.trim()) && Number(input.trim()) === q.answer;
}
