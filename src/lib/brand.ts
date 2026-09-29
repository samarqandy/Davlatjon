/**
 * Название платформы — «Davlatjon», как домен. Одно на оба языка, латиницей.
 * Имя ребёнка сюда не входит: его записывают при первом запуске (src/lib/childName.ts).
 */
export const BRAND = "Davlatjon";

/** Полное название: вкладка браузера, установленное приложение. */
export const BRAND_TITLE = {
  ru: "Davlatjon — математика, логика и шахматы",
  uz: "Davlatjon — matematika, mantiq va shaxmat",
} as const;

/** Подпись под логотипом. */
export const BRAND_TAGLINE = {
  ru: "математика · логика · шахматы",
  uz: "matematika · mantiq · shaxmat",
} as const;
