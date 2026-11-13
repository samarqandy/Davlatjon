"use client";

import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn, Icon } from "@/components/ui";
import { GLOSSARY_GROUPS, glossaryKey, type GlossaryEntry, type GlossaryGroup } from "@/content/chess/glossary";
import { useBoth, useLang, useT, type Both } from "@/lib/i18n";

/**
 * Словарь шахматиста: все термины школы на одной странице, с поиском.
 *
 * Термин — определение — урок, где его объясняют с доской и упражнениями. Отдельные справочные страницы
 * с определениями приёмов есть у больших тренировочных сайтов; у нас определения уже были написаны в уроках,
 * но лежали по одному в конце каждого урока — найти нужное слово было нельзя.
 */
export function Glossary({ entries }: { entries: Both<GlossaryEntry[]> }) {
  const t = useT();
  const lang = useLang();
  const all = useBoth(entries);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<GlossaryGroup | "all">("all");

  const groupName = (g: GlossaryGroup) =>
    g === "basics"
      ? t("Основы", "Asoslar")
      : g === "tactics"
        ? t("Тактика", "Taktika")
        : t(`Ступень ${g.slice(4)}`, `${g.slice(4)}-bosqich`);

  const found = useMemo(() => {
    const q = glossaryKey(query);
    return all.filter(
      (e) =>
        (group === "all" || e.group === group) &&
        (!q || glossaryKey(e.term).includes(q) || glossaryKey(e.text).includes(q)),
    );
  }, [all, query, group]);

  /** Список по первой букве: «А», «Б», … */
  const letters = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    for (const e of found) {
      const letter = glossaryKey(e.term).charAt(0).toUpperCase();
      map.set(letter, [...(map.get(letter) ?? []), e]);
    }
    return [...map];
  }, [found]);

  const chip = (on: boolean) =>
    cn(
      "min-h-11 shrink-0 rounded-full border-2 px-4 text-sm font-extrabold transition",
      on ? "border-brand bg-brand-soft text-brand-dark" : "border-line bg-surface hover:border-brand/40",
    );

  return (
    <div className="space-y-5" data-glossary>
      <header className="space-y-1">
        <Link
          href="/chess"
          className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
        >
          <Icon icon={ArrowLeft} /> {t("Шахматная школа", "Shaxmat maktabi")}
        </Link>
        <h1 className="text-3xl leading-tight font-black">{t("Словарь шахматиста", "Shaxmatchi lugʻati")}</h1>
        <p className="text-muted">
          {t(
            `${all.length} слов из уроков школы. Найди слово — и открой урок, где оно объясняется на доске.`,
            `Maktab darslaridan ${all.length} ta soʻz. Soʻzni top — va u taxtada tushuntirilgan darsni och.`,
          )}
        </p>
      </header>

      <label className="relative block">
        <span className="sr-only">{t("Найти слово", "Soʻzni topish")}</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Найти слово: вилка, цугцванг…", "Soʻzni topish: ayri, sugsvang…")}
          className="w-full rounded-2xl border-2 border-line bg-surface py-3 pr-4 pl-12 text-lg font-bold outline-none focus:border-brand"
          data-glossary-search
        />
      </label>

      <div
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
        role="group"
        aria-label={t("Раздел школы", "Maktab boʻlimi")}
      >
        <button
          type="button"
          className={chip(group === "all")}
          aria-pressed={group === "all"}
          onClick={() => setGroup("all")}
        >
          {t("Все", "Hammasi")}
        </button>
        {GLOSSARY_GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            className={chip(group === g)}
            aria-pressed={group === g}
            onClick={() => setGroup(g)}
            data-glossary-group={g}
          >
            {groupName(g)}
          </button>
        ))}
      </div>

      <p className="text-sm font-bold text-muted" aria-live="polite" data-glossary-count>
        {found.length === all.length
          ? t(`Всего слов: ${all.length}`, `Jami soʻzlar: ${all.length}`)
          : t(`Найдено: ${found.length}`, `Topildi: ${found.length}`)}
      </p>

      {found.length === 0 ? (
        <p className="rounded-3xl bg-surface p-5 font-bold shadow-card">
          {t(
            "Такого слова в словаре пока нет. Попробуй написать короче или выбери «Все».",
            "Lugʻatda hozircha bunday soʻz yoʻq. Qisqaroq yozib koʻr yoki «Hammasi»ni tanla.",
          )}
        </p>
      ) : (
        letters.map(([letter, items]) => (
          <section key={letter} aria-label={letter} className="space-y-2">
            <h2 className="text-xl font-black text-brand-dark" aria-hidden>
              {letter}
            </h2>
            <dl className="space-y-2">
              {items.map((e) => (
                <div
                  key={`${e.group}-${e.term}`}
                  className="rounded-3xl bg-surface p-4 shadow-card"
                  data-glossary-entry
                >
                  <dt className="text-lg leading-snug font-black">
                    {e.term}
                    {e.uz && lang === "ru" && (
                      <span lang="uz" className="ml-2 text-sm font-extrabold text-brand-dark">
                        {e.uz}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-1 text-muted">{e.text}</dd>
                  <dd className="mt-1">
                    <Link
                      href={e.href}
                      className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
                    >
                      {groupName(e.group)}: {e.lesson} <Icon icon={ArrowRight} />
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))
      )}
    </div>
  );
}
