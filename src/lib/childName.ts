/**
 * Имя ребёнка: как его записать, как показать на каждом языке и как подставить в тексты.
 * В текстах вместо имени стоит метка: {name} — именительный падеж (и по-русски, и по-узбекски),
 * {name:ga}, {name:ning}, {name:da}… — узбекское имя с окончанием.
 * Для родителей — {child}: имя, а пока его нет — «ребёнок» / «farzandingiz» (а не детское «Друг»).
 * Без React: работает и на сервере, и в тестах.
 */
import type { Lang } from "./lang";
import type { Settings } from "./state";

export const CHILD_NAME_MAX = 24;

/** Пока имени нет (или страница ещё загружается) — нейтральное обращение. */
export const NAME_FALLBACK: Record<Lang, string> = { ru: "Друг", uz: "Doʻst" };

/** То же в текстах для родителей. */
export const CHILD_FALLBACK: Record<Lang, string> = { ru: "ребёнок", uz: "farzandingiz" };

/** Что подставлять: {name} — ребёнку, {child} — родителям. */
export interface Names {
  name: string;
  child: string;
}

const CYRILLIC = /[\u0400-\u04FF]/;

/**
 * Приводит введённое имя в порядок: только буквы, пробел, дефис, точка и апостроф
 * (скобки и звёздочки сломали бы метки и разметку текста), не длиннее 24 знаков,
 * «анна» → «Анна», узбекские oʻ/gʻ — с правильным знаком. Пустое имя — undefined.
 */
export function cleanChildName(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  let name = raw
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\s.'ʻʼ’‘`-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  name = Array.from(name).slice(0, CHILD_NAME_MAX).join("").trim();
  if (!/\p{L}/u.test(name)) return undefined;
  if (name === name.toLowerCase())
    name = name.replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, letter: string) => sep + letter.toUpperCase());
  // Oʻ, gʻ — «перевёрнутая запятая»; остальные апострофы — узбекский «тутуқ белгиси» ʼ.
  return name.replace(/([oOgG])['ʻʼ’‘`]/g, "$1ʻ").replace(/['’‘`]/g, "ʼ");
}

const LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  ж: "j",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "x",
  ч: "ch",
  ш: "sh",
  щ: "sh",
  ц: "s",
  ы: "i",
  ь: "",
  ъ: "ʼ",
  э: "e",
  ё: "yo",
  ю: "yu",
  я: "ya",
  ў: "oʻ",
  қ: "q",
  ғ: "gʻ",
  ҳ: "h",
};
const VOWELS = "аеёиоуўэюяыaeiou";

/** Имя, записанное кириллицей, — узбекской латиницей: Шерзод → Sherzod, Ўткир → Oʻtkir. */
export function latinize(name: string): string {
  let out = "";
  for (let i = 0; i < name.length; i++) {
    const ch = name[i];
    const lower = ch.toLowerCase();
    let lat: string;
    if (lower === "е") {
      const prev = name[i - 1]?.toLowerCase();
      lat = !prev || !/\p{L}/u.test(prev) || VOWELS.includes(prev) ? "ye" : "e";
    } else lat = LATIN[lower] ?? ch;
    out += ch !== lower && lat ? lat[0].toUpperCase() + lat.slice(1) : lat;
  }
  return out;
}

/** Какое имя показывать: по-русски — как записано; по-узбекски — латиницей. */
export function nameFor(lang: Lang, s: Pick<Settings, "childName" | "childNameUz">): string {
  if (!s.childName) return NAME_FALLBACK[lang];
  if (lang === "ru") return s.childName;
  return s.childNameUz ?? (CYRILLIC.test(s.childName) ? latinize(s.childName) : s.childName);
}

/** Имя для обеих меток. */
export function namesFor(lang: Lang, s: Pick<Settings, "childName" | "childNameUz">): Names {
  const name = nameFor(lang, s);
  return { name, child: s.childName ? name : CHILD_FALLBACK[lang] };
}

/**
 * Узбекское окончание к имени. Меняется только дательный падеж:
 * после k — -ka (Otabekka), после q — -qa (Ortiqqa); остальные окончания просто пишутся слитно.
 */
export function uzSuffix(name: string, suffix: string): string {
  if (suffix.startsWith("g") && !/gʻ$/i.test(name)) {
    const last = name.slice(-1).toLowerCase();
    if (last === "k" || last === "к") return `${name}k${suffix.slice(1)}`;
    if (last === "q" || last === "қ") return `${name}q${suffix.slice(1)}`;
  }
  return name + suffix;
}

export const NAME_TOKEN = /\{(name|child)(?::([a-zʻ]+))?\}/g;

/** Подставить имя вместо меток {name}, {child} и {name:окончание}. В начале предложения — с большой буквы. */
export function fillName(text: string, names: Names | string): string {
  if (!text.includes("{name") && !text.includes("{child")) return text;
  const n = typeof names === "string" ? { name: names, child: names } : names;
  return text.replace(NAME_TOKEN, (_, which: "name" | "child", suffix: string | undefined, at: number) => {
    const word = suffix ? uzSuffix(n[which], suffix) : n[which];
    return /^\s*$|[.!?«"]\s*$/.test(text.slice(0, at)) ? word[0].toUpperCase() + word.slice(1) : word;
  });
}

const cache = new WeakMap<object, Map<string, unknown>>();

/**
 * То же для целого объекта контента (день, методичка, вопросы обзора).
 * Части без меток возвращаются как есть, а результат запоминается — чтобы объекты не пересоздавались при каждой отрисовке.
 */
export function personalize<V>(value: V, lang: Lang, names: Names): V {
  return walk(value, `${lang}|${names.name}|${names.child}`, names) as V;
}

function walk(value: unknown, key: string, names: Names): unknown {
  if (typeof value === "string") return fillName(value, names);
  if (!value || typeof value !== "object") return value;
  const proto = Object.getPrototypeOf(value);
  if (!Array.isArray(value) && proto !== Object.prototype && proto !== null) return value;
  let byName = cache.get(value);
  if (byName?.has(key)) return byName.get(key);
  let changed = false;
  let result: unknown;
  if (Array.isArray(value)) {
    const next = value.map((v) => {
      const w = walk(v, key, names);
      if (w !== v) changed = true;
      return w;
    });
    result = changed ? next : value;
  } else {
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const w = walk(v, key, names);
      if (w !== v) changed = true;
      next[k] = w;
    }
    result = changed ? next : value;
  }
  if (!byName) cache.set(value, (byName = new Map()));
  byName.set(key, result);
  return result;
}
