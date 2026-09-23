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
export function hintLabel(i: number): string {
  const step = HINT_STEPS[i];
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
