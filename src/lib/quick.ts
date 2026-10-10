/**
 * «Быстрые примеры»: короткие серии из 10 вопросов, которые собираются на лету.
 * Две колоды: «числа» (счёт, сравнение, ряды, таблица умножения) и «картинки» (для тех, кто ещё не читает:
 * сосчитай, где больше, продолжи узор, найди лишнее). Вопросы не зависят от языка: примеры и картинки
 * понятны без слов, а подпись к виду вопроса добавляет интерфейс.
 * Генератор чистый: тот же `seed` даёт ту же серию — так его можно проверять тестами.
 */
export type Deck = "numbers" | "little";
export type QuickLevel = 1 | 2 | 3;
export type QuestionKind =
  "add" | "sub" | "missing" | "compare" | "next" | "times" | "div" | "count" | "more" | "pattern" | "odd" | "bigger";

export interface Question {
  kind: QuestionKind;
  /** Что показать ребёнку: пример, ряд чисел или ряд картинок. Пусто — только варианты (задача «найди лишнее»). */
  show: string;
  /** Варианты ответа — по ним нажимают. */
  options: string[];
  /** Индекс верного варианта. */
  answer: number;
}

export const QUICK_COUNT = 10;
/** Столько верных ответов из десяти засчитывают серию (опыт и звёзды). */
export const QUICK_PASS = 7;

/** Маленький детерминированный генератор случайных чисел (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;
const int = (r: Rand, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
const choice = <T>(r: Rand, items: readonly T[]): T => items[Math.floor(r() * items.length)];

function shuffle<T>(r: Rand, items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Уровень по возрасту: у колоды «числа» — от 6 лет, у колоды «картинки» — от 4. */
export function quickLevel(deck: Deck, age: number | undefined): QuickLevel {
  const a = age ?? 7;
  if (deck === "little") return a <= 4 ? 1 : a === 5 ? 2 : 3;
  return a <= 7 ? 1 : a <= 9 ? 2 : 3;
}

/** Какая колода подходит по возрасту: до шести лет — картинки, дальше — числа. */
export function defaultDeck(age: number | undefined): Deck {
  return age !== undefined && age <= 5 ? "little" : "numbers";
}

/** Четыре числа-варианта: верное и три правдоподобных (рядом, с ошибкой в десятке). Индекс верного — в `answer`. */
function numberOptions(r: Rand, right: number, hi = Infinity): { options: string[]; answer: number } {
  const near = [1, -1, 2, -2, 10, -10, 3, -3].map((d) => right + d).filter((n) => n >= 0 && n <= hi && n !== right);
  const wrong = shuffle(r, near).slice(0, 3);
  for (let n = right + 4; wrong.length < 3; n++) if (n !== right && !wrong.includes(n)) wrong.push(n);
  const all = shuffle(r, [right, ...wrong]);
  return { options: all.map(String), answer: all.indexOf(right) };
}

const OPS = ["<", "=", ">"] as const;

function numbersQuestion(r: Rand, level: QuickLevel): Question {
  const kinds: QuestionKind[] =
    level === 1
      ? ["add", "add", "sub", "sub", "missing", "compare", "next"]
      : level === 2
        ? ["add", "sub", "missing", "compare", "next", "times", "div"]
        : ["add", "sub", "missing", "compare", "next", "times", "div", "times"];
  const kind = choice(r, kinds);
  switch (kind) {
    case "add": {
      const [a, b] =
        level === 1
          ? (() => {
              const a = int(r, 1, 9);
              return [a, int(r, 1, 10 - a)];
            })()
          : level === 2
            ? [int(r, 3, 19), int(r, 3, 19)]
            : [int(r, 12, 99), int(r, 12, 99)];
      return { kind, show: `${a} + ${b} = ?`, ...numberOptions(r, a + b) };
    }
    case "sub": {
      const top = level === 1 ? 10 : level === 2 ? 20 : 100;
      const a = int(r, Math.min(5, top), top);
      const b = int(r, 1, level === 3 ? a - 5 : a - 1);
      return { kind, show: `${a} − ${b} = ?`, ...numberOptions(r, a - b) };
    }
    case "missing": {
      const top = level === 1 ? 10 : level === 2 ? 20 : 100;
      const c = int(r, 5, top);
      const a = int(r, 1, c - 1);
      return r() < 0.5
        ? { kind, show: `${a} + ? = ${c}`, ...numberOptions(r, c - a) }
        : { kind, show: `${c} − ? = ${a}`, ...numberOptions(r, c - a) };
    }
    case "compare": {
      const top = level === 1 ? 20 : level === 2 ? 40 : 200;
      const a = int(r, 1, top);
      let b = r() < 0.2 ? a : int(r, 1, top);
      // Для старших сравнивают значения выражений: 7 + 5 ? 13.
      if (level >= 2) {
        const x = int(r, 2, Math.floor(top / 2));
        const y = int(r, 2, Math.floor(top / 2));
        b = r() < 0.25 ? x + y : int(r, Math.max(2, x + y - 3), x + y + 3);
        return { kind, show: `${x} + ${y} ? ${b}`, options: [...OPS], answer: OPS.indexOf(cmp(x + y, b)) };
      }
      return { kind, show: `${a} ? ${b}`, options: [...OPS], answer: OPS.indexOf(cmp(a, b)) };
    }
    case "next": {
      const step =
        level === 1
          ? choice(r, [1, 2, 5, 10])
          : level === 2
            ? choice(r, [2, 3, 4, 5, 10])
            : choice(r, [3, 4, 6, 7, 9, 25]);
      const down = level >= 2 && r() < 0.3;
      const start = down ? int(r, step * 5, step * 5 + 20) : int(r, 0, 12);
      const row = Array.from({ length: 4 }, (_, i) => (down ? start - step * i : start + step * i));
      const next = down ? start - step * 4 : start + step * 4;
      return { kind, show: `${row.join(", ")}, ?`, ...numberOptions(r, next) };
    }
    case "times": {
      const table = level === 2 ? choice(r, [2, 5, 10]) : int(r, 2, 9);
      const m = int(r, level === 2 ? 1 : 2, level === 2 ? 10 : 9);
      return { kind, show: `${table} × ${m} = ?`, ...numberOptions(r, table * m) };
    }
    default: {
      // Деление без остатка — по таблице умножения.
      const d = level === 2 ? 2 : int(r, 2, 9);
      const q = int(r, 2, level === 2 ? 10 : 9);
      return { kind: "div", show: `${d * q} ÷ ${d} = ?`, ...numberOptions(r, q) };
    }
  }
}

function cmp(a: number, b: number): (typeof OPS)[number] {
  return a < b ? "<" : a > b ? ">" : "=";
}

const THINGS = ["🍎", "⭐", "🐟", "🚗", "🌸", "🐥", "🎈", "🍪"] as const;
const SHAPES = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"] as const;

function littleQuestion(r: Rand, level: QuickLevel): Question {
  const kind = choice(r, ["count", "count", "more", "pattern", "odd", "bigger"] as const);
  switch (kind) {
    case "count": {
      const n = int(r, 1, level === 1 ? 5 : 10);
      const item = choice(r, THINGS);
      return { kind, show: Array.from({ length: n }, () => item).join(" "), ...numberOptions(r, n, 10) };
    }
    case "more": {
      const item = choice(r, THINGS);
      const hi = level === 1 ? 6 : 10;
      const a = int(r, 1, hi);
      let b = int(r, 1, hi);
      if (b === a) b = a === hi ? a - 1 : a + 1;
      const group = (n: number) => Array.from({ length: n }, () => item).join("");
      return { kind, show: `${group(a)}   |   ${group(b)}`, options: ["⬅️", "➡️"], answer: a > b ? 0 : 1 };
    }
    case "pattern": {
      const palette = shuffle(r, SHAPES);
      const [x, y, z] = palette;
      const unit =
        level === 1
          ? [x, y]
          : level === 2
            ? choice(r, [
                [x, x, y],
                [x, y, y],
              ])
            : [x, y, z];
      const row = Array.from({ length: unit.length * 2 + 1 }, (_, i) => unit[i % unit.length]);
      const right = row.pop()!;
      const wrong = shuffle(
        r,
        palette.filter((p) => p !== right),
      ).slice(0, 2);
      const all = shuffle(r, [right, ...wrong]);
      return { kind, show: `${row.join("")}❓`, options: all, answer: all.indexOf(right) };
    }
    case "odd": {
      const [item, other] = shuffle(r, [...THINGS]);
      const size = level === 1 ? 4 : 6;
      const at = int(r, 0, size - 1);
      return { kind, show: "", options: Array.from({ length: size }, (_, i) => (i === at ? other : item)), answer: at };
    }
    default: {
      const hi = level === 1 ? 10 : level === 2 ? 20 : 50;
      const a = int(r, 1, hi);
      let b = int(r, 1, hi);
      if (b === a) b = a === hi ? a - 1 : a + 1;
      const options = [a, b].map(String);
      return { kind: "bigger", show: "", options, answer: a > b ? 0 : 1 };
    }
  }
}

/** Серия вопросов: без повторов, при одном `seed` всегда одна и та же. */
export function makeQuiz(deck: Deck, level: QuickLevel, seed: number, count = QUICK_COUNT): Question[] {
  const r = rng(seed);
  const out: Question[] = [];
  const seen = new Set<string>();
  for (let guard = 0; out.length < count && guard < count * 40; guard++) {
    const q = deck === "numbers" ? numbersQuestion(r, level) : littleQuestion(r, level);
    const key = `${q.kind}|${q.show}|${[...q.options].sort().join(",")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

/** Звёзды за серию: 3 — почти без ошибок, 2 — засчитано, 1 — хорошая попытка, 0 — ещё потренироваться. */
export function quickStars(score: number, total = QUICK_COUNT): 0 | 1 | 2 | 3 {
  const share = total ? score / total : 0;
  return share >= 0.9 ? 3 : share >= QUICK_PASS / QUICK_COUNT ? 2 : share >= 0.4 ? 1 : 0;
}

/** Ключ записи в состоянии: день и колода («2026-10-10:numbers»). */
export const quickKey = (day: string, deck: Deck) => `${day}:${deck}`;
