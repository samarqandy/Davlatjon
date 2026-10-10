import type { Lang } from "@/lib/lang";
import type { Level, SectionId } from "./types";

export interface SectionMeta {
  id: SectionId;
  emoji: string;
  name: string;
  /** Короткое пояснение для родителя. */
  about: string;
  /** Основной цвет раздела. */
  color: string;
  /** Светлый фон раздела. */
  tint: string;
}

export const SECTIONS: Record<SectionId, SectionMeta> = {
  warmup: {
    id: "warmup",
    emoji: "🔢",
    name: "Разминка",
    about: "Устный счёт и гибкость: как посчитать удобнее и быстрее.",
    color: "#0284c7",
    tint: "#e0f2fe",
  },
  logic: {
    id: "logic",
    emoji: "🧩",
    name: "Логика",
    about: "Рассуждения, исключение вариантов, «если… то…».",
    color: "#7c3aed",
    tint: "#ede9fe",
  },
  pattern: {
    id: "pattern",
    emoji: "🔍",
    name: "Закономерности",
    about: "Найти скрытое правило и проверить его.",
    color: "#0d9488",
    tint: "#ccfbf1",
  },
  algorithm: {
    id: "algorithm",
    emoji: "🤖",
    name: "Алгоритмы",
    about: "Шаги, повторение, условия, поиск лучшего пути.",
    color: "#4f46e5",
    tint: "#e0e7ff",
  },
  spatial: {
    id: "spatial",
    emoji: "📐",
    name: "Пространство",
    about: "Клетки, симметрия, повороты, кубики, координаты.",
    color: "#ea580c",
    tint: "#ffedd5",
  },
  real: {
    id: "real",
    emoji: "🌍",
    name: "Математика вокруг нас",
    about: "Деньги, время, покупки, дороги — математика в жизни.",
    color: "#16a34a",
    tint: "#dcfce7",
  },
  challenge: {
    id: "challenge",
    emoji: "⭐",
    name: "Задача со звёздочкой",
    about: "Одна задача потруднее: подумать подольше и не сдаваться.",
    color: "#d97706",
    tint: "#fef3c7",
  },
  research: {
    id: "research",
    emoji: "🧠",
    name: "Мини-исследование",
    about: "Решить, объяснить, найти другой способ, изменить условие, исследовать, придумать свою задачу.",
    color: "#c026d3",
    tint: "#fae8ff",
  },
};

export const SECTION_ORDER: SectionId[] = [
  "warmup",
  "logic",
  "pattern",
  "algorithm",
  "spatial",
  "real",
  "challenge",
  "research",
];

export interface LevelMeta {
  level: Level;
  emoji: string;
  name: string;
  about: string;
  color: string;
}

export const LEVELS: Record<Level, LevelMeta> = {
  1: {
    level: 1,
    emoji: "🟢",
    name: "Комфортно",
    about: "Можно решить самостоятельно.",
    color: "#16a34a",
  },
  2: {
    level: 2,
    emoji: "🟡",
    name: "Надо подумать",
    about: "Нужно порассуждать.",
    color: "#ca8a04",
  },
  3: {
    level: 3,
    emoji: "🟠",
    name: "Нестандартно",
    about: "Нужна новая идея.",
    color: "#ea580c",
  },
  4: {
    level: 4,
    emoji: "🔴",
    name: "Олимпиада",
    about: "Олимпиадная задача для этого возраста — глубокое рассуждение.",
    color: "#dc2626",
  },
  5: {
    level: 5,
    emoji: "⭐",
    name: "Исследование",
    about: "Несколько решений и подходов, нужен эксперимент.",
    color: "#9333ea",
  },
};

/** Подпись шага подсказки с двоеточием: «Что известно?» — без двоеточия. */
export function hintLabel(i: number, lang: Lang = "ru"): string {
  const step = hintSteps(lang)[i];
  return step.endsWith("?") ? step : `${step}:`;
}

/** Общая лестница подсказок (раздел 9 мастер-промпта). */
export const HINT_STEPS = [
  "Перечитай условие",
  "Что известно?",
  "Нарисуй или запиши",
  "Реши задачу поменьше",
  "Идея",
] as const;

export const COLOR_HEX: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#facc15",
  black: "#1f2937",
  gray: "#9ca3af",
  purple: "#a855f7",
  orange: "#f97316",
};

export const COLOR_NAME_RU: Record<string, string> = {
  red: "красный",
  blue: "синий",
  green: "зелёный",
  yellow: "жёлтый",
  black: "чёрный",
  gray: "серый",
  purple: "фиолетовый",
  orange: "оранжевый",
};

export const COLOR_NAME_UZ: Record<string, string> = {
  red: "qizil",
  blue: "koʻk",
  green: "yashil",
  yellow: "sariq",
  black: "qora",
  gray: "kulrang",
  purple: "binafsha",
  orange: "toʻq sariq",
};

// ---------------------------------------------------------------------------
// По-узбекски
// ---------------------------------------------------------------------------

const SECTIONS_UZ: Record<SectionId, { name: string; about: string }> = {
  warmup: { name: "Razminka", about: "Ogʻzaki hisob va zukkolik: qanday hisoblasa qulayroq va tezroq." },
  logic: {
    name: "Mantiq",
    about: "Mulohaza yuritish, keraksiz variantlarni chiqarib tashlash, «agar… boʻlsa, unda…».",
  },
  pattern: { name: "Qonuniyatlar", about: "Yashirin qoidani topish va uni tekshirib koʻrish." },
  algorithm: { name: "Algoritmlar", about: "Qadamlar, takrorlash, shartlar, eng yaxshi yoʻlni izlash." },
  spatial: { name: "Fazoviy tasavvur", about: "Kataklar, simmetriya, burish, kubiklar, koordinatalar." },
  real: { name: "Atrofimizdagi matematika", about: "Pul, vaqt, xarid, yoʻl — hayotdagi matematika." },
  challenge: { name: "Yulduzchali masala", about: "Bitta qiyinroq masala: uzoqroq oʻylash va taslim boʻlmaslik." },
  research: {
    name: "Kichik tadqiqot",
    about: "Yechish, tushuntirish, boshqa yoʻlini topish, shartni oʻzgartirish, tadqiq qilish, oʻz masalangni tuzish.",
  },
};

const LEVELS_UZ: Record<Level, { name: string; about: string }> = {
  1: { name: "Qulay", about: "Mustaqil yechsa boʻladi." },
  2: { name: "Oʻylash kerak", about: "Biroz mulohaza yuritish kerak." },
  3: { name: "Gʻayrioddiy", about: "Yangi gʻoya kerak." },
  4: { name: "Olimpiada", about: "Shu yosh uchun olimpiada masalasi — chuqur mulohaza talab qiladi." },
  5: { name: "Tadqiqot", about: "Bir nechta yechim va yondashuv, tajriba kerak." },
};

const HINT_STEPS_UZ = [
  "Shartni qayta oʻqi",
  "Nima maʼlum?",
  "Chizib yoki yozib ol",
  "Kichikroq masalani yech",
  "Gʻoya",
];

const SECTIONS_BY_LANG: Record<Lang, Record<SectionId, SectionMeta>> = {
  ru: SECTIONS,
  uz: Object.fromEntries(Object.values(SECTIONS).map((s) => [s.id, { ...s, ...SECTIONS_UZ[s.id] }])) as Record<
    SectionId,
    SectionMeta
  >,
};

const LEVELS_BY_LANG: Record<Lang, Record<Level, LevelMeta>> = {
  ru: LEVELS,
  uz: Object.fromEntries(Object.values(LEVELS).map((l) => [l.level, { ...l, ...LEVELS_UZ[l.level] }])) as Record<
    Level,
    LevelMeta
  >,
};

export function sectionsFor(lang: Lang): Record<SectionId, SectionMeta> {
  return SECTIONS_BY_LANG[lang];
}

export function levelsFor(lang: Lang): Record<Level, LevelMeta> {
  return LEVELS_BY_LANG[lang];
}

export function hintSteps(lang: Lang): readonly string[] {
  return lang === "uz" ? HINT_STEPS_UZ : HINT_STEPS;
}

export function colorName(color: string, lang: Lang): string {
  return (lang === "uz" ? COLOR_NAME_UZ : COLOR_NAME_RU)[color] ?? color;
}
