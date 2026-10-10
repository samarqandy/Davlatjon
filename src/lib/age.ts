"use client";

import type { Lang } from "./lang";
import { useStore } from "./store";

/**
 * Возраст ребёнка → профиль занятий. Возраст спрашивают при первом запуске,
 * изменить его можно в настройках родителя. Без возраста — младший профиль.
 */
export type AgeProfile = "junior" | "middle" | "senior";

export const AGE_MIN = 6;
export const AGE_MAX = 15;

export interface ProfileMeta {
  id: AgeProfile;
  name: string;
  ages: string;
  about: string;
  /** Робот, с которого советуем начать (1 — «Пешка», 2 — «Конь», 3 — «Слон»). */
  robotLevel: number;
  robotName: string;
  /** Задача дня и серия — от стольких звёзд. */
  minStars: 1 | 2 | 3;
  /** Сколько уровней шахматной школы открыто сразу. */
  openLevels: number;
  /** Задания дня этого уровня и ниже — разминка, которую можно пропустить. */
  warmupBelow: number;
}

export const PROFILES: Record<AgeProfile, ProfileMeta> = {
  junior: {
    id: "junior",
    name: "Младший",
    ages: "6–8 лет",
    about:
      "Всё по порядку: задания дня одно за другим, шахматные уровни открываются по очереди, робот «Пешка», задача дня с одной звезды.",
    robotLevel: 1,
    robotName: "Пешка",
    minStars: 1,
    openLevels: 1,
    warmupBelow: 0,
  },
  middle: {
    id: "middle",
    name: "Средний",
    ages: "9–10 лет",
    about:
      "Лёгкие задания дня — разминка, главные — 🟡🟠🔴. Открыты три уровня шахмат, робот «Конь», задача дня от двух звёзд.",
    robotLevel: 2,
    robotName: "Конь",
    minStars: 2,
    openLevels: 3,
    warmupBelow: 1,
  },
  senior: {
    id: "senior",
    name: "Старший",
    ages: "11 лет и старше",
    about:
      "Задания 🟢 и 🟡 — разминка, которую можно пропустить. Открыты все уровни шахмат, робот «Слон», задача дня от трёх звёзд, разделы «для тех, кто постарше» раскрыты сразу.",
    robotLevel: 3,
    robotName: "Слон",
    minStars: 3,
    openLevels: 6,
    warmupBelow: 2,
  },
};

export function ageProfile(age: number | undefined): AgeProfile {
  if (!age || age <= 8) return "junior";
  if (age <= 10) return "middle";
  return "senior";
}

export function profileMeta(age: number | undefined): ProfileMeta {
  return PROFILES[ageProfile(age)];
}

/** Тексты профиля по-узбекски: название, возраст, описание; имя робота — как на кнопке робота. */
const PROFILES_UZ: Record<AgeProfile, { name: string; ages: string; about: string; robotName: string }> = {
  junior: {
    name: "Kichiklar",
    ages: "6–8 yosh",
    about:
      "Hammasi tartib bilan: kunning topshiriqlari birin-ketin, shaxmat darajalari navbat bilan ochiladi, robot «Piyoda», kun masalasi bir yulduzchadan.",
    robotName: "Piyoda",
  },
  middle: {
    name: "Oʻrta yosh",
    ages: "9–10 yosh",
    about:
      "Qulay topshiriqlar — razminka, asosiylari — 🟡🟠🔴. Shaxmatning uchta darajasi ochiq, robot «Ot», kun masalasi ikki yulduzchadan.",
    robotName: "Ot",
  },
  senior: {
    name: "Kattalar",
    ages: "11 yosh va undan katta",
    about:
      "🟢 va 🟡 topshiriqlar — xohlasang oʻtkazib yuborsa boʻladigan razminka. Shaxmatning barcha darajalari ochiq, robot «Fil», kun masalasi uch yulduzchadan, «kattaroqlar uchun» boʻlimlari darhol ochiq.",
    robotName: "Fil",
  },
};

/** Профиль с текстами на нужном языке. */
export function profileText(meta: ProfileMeta, lang: Lang): ProfileMeta {
  return lang === "uz" ? { ...meta, ...PROFILES_UZ[meta.id] } : meta;
}

/** Профиль ребёнка из настроек; до гидратации — младший. */
export function useAgeProfile(): ProfileMeta {
  const age = useStore((s) => s.settings.age);
  return profileMeta(age);
}
