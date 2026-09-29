/**
 * Банк задач из открытой базы Lichess (CC0). Задачи лежат в public/puzzles/<тема>.json — их собирает
 * scripts/build-puzzles.mjs — и загружаются, только когда понадобятся.
 *
 * Формат Lichess: позиция — до хода соперника. Первый ход в строке делает соперник, дальше —
 * ход решающей стороны, ответ соперника, снова ход… Засчитывается ход из строки и любой мат.
 */
import { useEffect, useState } from "react";
import bank from "@/content/chess/puzzle-bank.json";
import type { PuzzleTheme } from "@/content/chess/puzzles";
import { playMove, type PieceType } from "./chess";
import { random } from "./random";

export interface BankPuzzle {
  /** Ключ прогресса «тема/id», например «fork/0009B». */
  key: string;
  id: string;
  theme: PuzzleTheme;
  /** Позиция до хода соперника. */
  fen: string;
  /** Ходы UCI: ход соперника, решение, ответ, решение… */
  moves: string[];
  rating: number;
  /** Мат в столько ходов; 0 — задача не на мат. */
  mate: number;
}

interface BankIndex {
  source: string;
  license: string;
  total: number;
  mix: number;
  version: string;
  themes: Partial<Record<PuzzleTheme, { count: number; min: number; max: number }>>;
}

export const BANK = bank as BankIndex;

/** Сколько задач из базы в теме (в «пате» их нет — там только задачи школы). */
export function bankCount(theme: PuzzleTheme): number {
  return BANK.themes[theme]?.count ?? 0;
}

export const bankKey = (theme: PuzzleTheme, id: string) => `${theme}/${id}`;

/** Тема задачи из базы по ключу прогресса; у задач школы ключ без «/». */
export function themeOfKey(key: string): PuzzleTheme | undefined {
  const [theme, id] = key.split("/");
  return id && theme in BANK.themes ? (theme as PuzzleTheme) : undefined;
}

type Row = [id: string, fen: string, moves: string, rating: number, mate: number, theme?: PuzzleTheme];

export function parseRows(rows: readonly Row[], theme?: PuzzleTheme): BankPuzzle[] {
  return rows.map(([id, fen, moves, rating, mate, own]) => {
    const t = (own ?? theme) as PuzzleTheme;
    return { key: bankKey(t, id), id, theme: t, fen, moves: moves.split(" "), rating, mate };
  });
}

const loaded = new Map<string, Promise<BankPuzzle[]>>();

/** Задачи темы или общий набор «mix». Загружаются один раз; без интернета их отдаёт офлайн-кэш. */
export function loadBank(name: PuzzleTheme | "mix"): Promise<BankPuzzle[]> {
  let p = loaded.get(name);
  if (!p) {
    p = fetch(`/puzzles/${name}.json?v=${BANK.version}`)
      .then((r) => {
        if (!r.ok) throw new Error(`puzzles/${name}: ${r.status}`);
        return r.json() as Promise<{ puzzles: Row[] }>;
      })
      .then((d) => parseRows(d.puzzles, name === "mix" ? undefined : name));
    p.catch(() => loaded.delete(name));
    loaded.set(name, p);
  }
  return p;
}

/**
 * Без интернета задачи отдаёт офлайн-кэш, но только те темы, что уже загружались. Поэтому, пока страница задач
 * открыта с интернетом, по одной подгружаем в кэш и остальные темы (всего около 600 КБ, один раз на версию банка).
 */
export async function prefetchBank(): Promise<void> {
  if (typeof caches === "undefined" || !navigator.serviceWorker?.controller || !navigator.onLine) return;
  for (const name of [...Object.keys(BANK.themes), "mix"]) {
    const url = `/puzzles/${name}.json?v=${BANK.version}`;
    try {
      if (!(await caches.match(url))) await fetch(url);
    } catch {
      return;
    }
  }
}

/** Задача из базы по ключу прогресса. */
export async function findBankPuzzle(key: string): Promise<BankPuzzle | undefined> {
  const theme = themeOfKey(key);
  return theme ? (await loadBank(theme)).find((p) => p.key === key) : undefined;
}

/** Набор задач для компонента: null — ещё грузится, "error" — загрузить не удалось. */
export function useBank(name: PuzzleTheme | "mix" | null): BankPuzzle[] | null | "error" {
  const [got, setGot] = useState<{ name: string; list: BankPuzzle[] | "error" } | null>(null);
  useEffect(() => {
    if (!name) return;
    let live = true;
    loadBank(name).then(
      (list) => live && setGot({ name, list }),
      () => live && setGot({ name, list: "error" }),
    );
    return () => {
      live = false;
    };
  }, [name]);
  return name && got?.name === name ? got.list : null;
}

/**
 * Следующая задача: из ещё не встречавшихся — поближе к нужному рейтингу. Чтобы задачи не шли
 * всегда в одном порядке, берём случайную из пяти ближайших. Все встречались — undefined.
 */
export function pickNext(
  list: readonly BankPuzzle[],
  target: number,
  seen: (key: string) => boolean,
  rnd: () => number = random,
): BankPuzzle | undefined {
  const near = list
    .filter((p) => !seen(p.key))
    .sort((a, b) => Math.abs(a.rating - target) - Math.abs(b.rating - target) || (a.key < b.key ? -1 : 1))
    .slice(0, 5);
  return near.length ? near[Math.floor(rnd() * near.length)] : undefined;
}

/**
 * Лесенка для «Серии» и «Шторма»: задачи общего набора по возрастанию рейтинга, начиная с from,
 * через step (с небольшим разбросом) — каждая следующая чуть труднее предыдущей.
 */
export function ladderOrder(
  list: readonly BankPuzzle[],
  from: number,
  rnd: () => number = random,
  step = 10,
  count = 80,
): BankPuzzle[] {
  const sorted = [...list].sort((a, b) => a.rating - b.rating || (a.key < b.key ? -1 : 1));
  const first = sorted.findIndex((p) => p.rating >= from);
  const out: BankPuzzle[] = [];
  for (let i = first < 0 ? 0 : first; out.length < count && i < sorted.length; i += step) {
    const p = sorted[Math.min(sorted.length - 1, i + Math.floor(rnd() * 3))];
    if (!out.includes(p)) out.push(p);
  }
  return out;
}

export type LineVerdict = { kind: "wrong" } | { kind: "solved" } | { kind: "reply"; reply: string };

/**
 * Ход решающей стороны. line — ходы после первого хода соперника: [решение, ответ, решение, …];
 * ply — номер ожидаемого хода. Засчитывается ход из строки и любой мат.
 */
export function judgeLineMove(
  line: readonly string[],
  ply: number,
  played: { uci: string; mate: boolean },
): LineVerdict {
  if (played.mate) return { kind: "solved" };
  if (played.uci !== line[ply]) return { kind: "wrong" };
  return ply + 1 < line.length ? { kind: "reply", reply: line[ply + 1] } : { kind: "solved" };
}

/** Сыграть ход в записи UCI («e7e8q»). */
export function playUci(fen: string, uci: string) {
  return playMove(fen, uci.slice(0, 2), uci.slice(2, 4), (uci[4] as PieceType | undefined) ?? "q");
}

/** Решение записью, ходы считаем от единицы: «1. Кf7+ Крg8 2. Кh6#» или «1… Фxd4 2. Лe1 Фd1#». */
export function solutionLine(p: BankPuzzle, san: (s: string) => string = (s) => s): string {
  let fen = playUci(p.fen, p.moves[0])?.fen ?? p.fen;
  let n = 1;
  const parts: string[] = [];
  p.moves.slice(1).forEach((uci, i) => {
    const white = fen.split(" ")[1] === "w";
    const m = playUci(fen, uci);
    if (!m) return;
    parts.push(white ? `${n}. ${san(m.san)}` : i === 0 ? `${n}… ${san(m.san)}` : san(m.san));
    if (!white) n++;
    fen = m.fen;
  });
  return parts.join(" ");
}
