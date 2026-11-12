/**
 * Как называется дебют партии: по первым ходам ищем самую длинную знакомую последовательность в книге дебютов
 * (src/content/chess/opening-book.json — из открытого списка Lichess, CC0) и берём название её семейства.
 *
 * Порядок ходов важен: книга знает последовательности, а не позиции, поэтому та же позиция, полученная другим
 * порядком ходов, может называться общее («Дебют ферзевой пешки») или не называться совсем.
 */
import { useEffect, useMemo, useState } from "react";
import type { OpeningNames } from "@/content/chess/openingNames";

export interface OpeningMatch extends OpeningNames {
  /** Семейство в списке Lichess (по-английски) — для тестов и отладки. */
  family: string;
  /** Сколько первых полуходов партии совпало с книгой. */
  plies: number;
}

export interface OpeningBookData {
  families: string[];
  lines: [moves: string, family: number][];
}

export interface OpeningBook {
  find(sans: readonly string[]): OpeningMatch | null;
}

export const STANDARD_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Партия начата с обычной расстановки? У партии с форой или из своей позиции дебюта нет. */
export const isStandardStart = (fen: string | undefined) =>
  !fen || fen.split(" ").slice(0, 4).join(" ") === STANDARD_START.split(" ").slice(0, 4).join(" ");

export function makeOpeningBook(data: OpeningBookData, names: Record<string, OpeningNames>): OpeningBook {
  const byLine = new Map(data.lines);
  const longest = data.lines.reduce((max, [moves]) => Math.max(max, moves.split(" ").length), 0);
  return {
    find(sans) {
      const moves = sans.slice(0, longest).map((san) => san.replace(/[+#]/g, ""));
      // От длинного к короткому: первое семейство, у которого есть наше название. Редкие и шуточные
      // семейства без названия пропускаются — показывается более общее.
      for (let k = moves.length; k > 0; k--) {
        const index = byLine.get(moves.slice(0, k).join(" "));
        if (index === undefined) continue;
        const family = data.families[index];
        const name = names[family];
        if (name) return { ...name, family, plies: k };
      }
      return null;
    },
  };
}

let loading: Promise<OpeningBook> | null = null;

/** Книга грузится отдельным файлом и только когда понадобилась: на доске анализа и в разборе партии. */
export function loadOpeningBook(): Promise<OpeningBook> {
  loading ??= Promise.all([import("@/content/chess/opening-book.json"), import("@/content/chess/openingNames")]).then(
    ([book, names]) => makeOpeningBook(book.default as unknown as OpeningBookData, names.OPENING_NAMES),
  );
  return loading;
}

/** Название дебюта для ходов партии (в записи chess.js). Пока книга не загружена или ходов нет — null. */
export function useOpening(sans: readonly string[], enabled = true): OpeningMatch | null {
  const [book, setBook] = useState<OpeningBook | null>(null);
  const wanted = enabled && sans.length > 0;
  useEffect(() => {
    if (!wanted || book) return;
    let alive = true;
    void loadOpeningBook().then((loaded) => {
      if (alive) setBook(loaded);
    });
    return () => {
      alive = false;
    };
  }, [wanted, book]);
  const key = wanted ? sans.join(" ") : "";
  return useMemo(() => (book && key ? book.find(key.split(" ")) : null), [book, key]);
}
