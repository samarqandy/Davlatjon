/**
 * Словарь шахматиста: термины всех разделов школы одним списком — для страницы /chess/glossary.
 *
 * Термины уже написаны в уроках (блок «Словарик» в конце урока) на двух языках; здесь они только собираются:
 * звания («Основы»), раздел «Тактика», пять ступеней курса и эндшпиль (ладья, ферзь, слон). У каждого термина —
 * урок, где он объясняется с доской и упражнениями. Одинаковые термины из разных уроков показываются один раз —
 * по первому уроку.
 * Собирается на сервере: тексты уроков и позиции в браузер не попадают.
 */
import type { Lang } from "@/lib/lang";
import { chessContent } from "./content";

export type GlossaryGroup = "basics" | "tactics" | "step1" | "step2" | "step3" | "step4" | "step5" | "endgame";

export const GLOSSARY_GROUPS: GlossaryGroup[] = [
  "basics",
  "tactics",
  "step1",
  "step2",
  "step3",
  "step4",
  "step5",
  "endgame",
];

export interface GlossaryEntry {
  term: string;
  text: string;
  /** Название по-узбекски рядом с русским (есть у названий фигур). */
  uz?: string;
  group: GlossaryGroup;
  /** Урок, где термин объясняется: название и адрес. */
  lesson: string;
  href: string;
}

/** Ключ для сравнения и поиска: без регистра, «ё» как «е», без апострофов и кавычек. */
export function glossaryKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[ʻʼ'’`«»"]/g, "")
    .trim();
}

/** Все термины по порядку разделов: звания, тактика, ступени курса, эндшпиль. Порядок одинаков на обоих языках. */
function collect(lang: Lang): GlossaryEntry[] {
  const c = chessContent(lang);
  const all: GlossaryEntry[] = [];
  for (const level of c.levels)
    for (const t of level.terms) all.push({ ...t, group: "basics", lesson: level.title, href: `/chess/${level.id}` });
  for (const topic of c.tactics)
    for (const t of topic.terms)
      all.push({ ...t, group: "tactics", lesson: topic.title, href: `/chess/tactics#${topic.id}` });
  const steps = [c.course1Lessons, c.course2Lessons, c.course3Lessons, c.course4Lessons, c.course5Lessons];
  steps.forEach((lessons, i) => {
    const base = i === 0 ? "/chess/course" : `/chess/course-${i + 1}`;
    for (const lesson of lessons)
      for (const t of lesson.terms)
        all.push({ ...t, group: `step${i + 1}` as GlossaryGroup, lesson: lesson.title, href: `${base}#${lesson.id}` });
  });
  for (const topic of c.endgamePieces)
    for (const t of topic.terms)
      all.push({ ...t, group: "endgame", lesson: topic.title, href: `/chess/endgames/pieces#${topic.id}` });
  return all;
}

/**
 * Словарь на нужном языке. Повторы убираются по русскому названию — так в обоих языках одни и те же статьи,
 * даже если один русский термин в разных уроках переведён на узбекский по-разному (берётся перевод первого урока).
 */
export function chessGlossary(lang: Lang): GlossaryEntry[] {
  const ru = collect("ru");
  const local = lang === "ru" ? ru : collect(lang);
  const seen = new Set<string>();
  const unique = local.filter((_, i) => {
    const key = glossaryKey(ru[i].term);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const collator = new Intl.Collator(lang === "uz" ? "uz" : "ru");
  return unique.sort((a, b) => collator.compare(glossaryKey(a.term), glossaryKey(b.term)));
}
