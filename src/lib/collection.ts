/**
 * Коллекция карточек героев: мудрецы Востока и чемпионы мира. Карточки открываются сами по мере опыта —
 * по одной за каждые XP_PER_CARD очков, в порядке коллекции. Ничего отдельно не хранится: сколько карточек
 * открыто, считается из опыта, поэтому прогресс не теряется и одинаково виден на всех устройствах.
 */
import type { ChessContent } from "@/content/chess/content";

export const XP_PER_CARD = 30;

/** Сколько всего карточек (5 мудрецов + 18 чемпионов). Число держим здесь, чтобы не тянуть весь шахматный контент в каждую страницу; тест сверяет его с контентом. */
export const COLLECTION_TOTAL = 23;

export interface HeroCard {
  id: string;
  kind: "sage" | "champion";
  /** Номер в коллекции, с единицы. */
  no: number;
  name: string;
  /** Где и когда жил. */
  where: string;
  /** Главное о герое — одной-двумя фразами. */
  note: string;
  /** Совет за доской (у мудрецов). */
  advice?: string;
  image?: string;
}

/** Все карточки по порядку: сначала мудрецы Востока, потом чемпионы мира от первого к последнему. */
export function heroCards(c: Pick<ChessContent, "sages" | "worldChampions">): HeroCard[] {
  const sages = c.sages.map((s, i) => ({
    id: `sage-${i + 1}`,
    kind: "sage" as const,
    name: s.name,
    where: s.where,
    note: s.fact,
    advice: s.advice,
    image: s.image,
  }));
  const champions = c.worldChampions.map((w) => ({
    id: `champion-${w.n}`,
    kind: "champion" as const,
    name: w.name,
    where: `${w.country} · ${w.years}`,
    note: w.note,
    image: w.image,
  }));
  return [...sages, ...champions].map((card, i) => ({ ...card, no: i + 1 }));
}

/** Сколько карточек открыто при таком опыте. */
export function cardsOpen(xp: number, total: number): number {
  return Math.max(0, Math.min(total, Math.floor(xp / XP_PER_CARD)));
}

/** Сколько опыта до следующей карточки; null — коллекция собрана. */
export function xpToNextCard(xp: number, total: number): number | null {
  const open = cardsOpen(xp, total);
  return open >= total ? null : (open + 1) * XP_PER_CARD - xp;
}

/** Открылась ли новая карточка, когда опыт вырос с `prev` до `next` (большие скачки — синхронизация — не считаем). */
export function newCardAt(prev: number, next: number, total: number): boolean {
  const gain = next - prev;
  return gain > 0 && gain <= 100 && cardsOpen(next, total) > cardsOpen(prev, total);
}

export const COLLECTION_HREF = "/chess/collection";
