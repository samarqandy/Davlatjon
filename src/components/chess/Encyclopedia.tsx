"use client";

import Link from "next/link";
import { useState } from "react";
import { RichText } from "@/components/RichText";
import { cn } from "@/components/ui";
import {
  CHESS_MATH,
  FIDE_NOTE,
  PIECE_NAMES,
  POLGAR_NOTE,
  RECORDS,
  TIMELINE,
  UZBEK_CHESS,
  WOMEN_CHAMPIONS,
  WORLD_CHAMPIONS,
} from "@/content/chess/encyclopedia";
import { CHESS_IMAGES, chessImage } from "@/content/chess/images";
import { PieceIcon } from "./ChessBoard";
import { Figure, ImageCredits, Portrait } from "./Figure";

const SECTIONS = [
  ["history", "🗺️ Путь шахмат"],
  ["uzbekistan", "🇺🇿 Узбекистан"],
  ["champions", "🏆 Чемпионы"],
  ["names", "🔤 Имена фигур"],
  ["records", "📚 Рекорды и факты"],
  ["math", "🧮 Шахматы и математика"],
  ["credits", "📷 Откуда картинки"],
] as const;

/** Аватарка по id картинки — если картинка есть. */
function Face({ id, size, className }: { id?: string; size: number; className?: string }) {
  const img = id ? chessImage(id) : undefined;
  return img ? <Portrait image={img} size={size} className={className} /> : null;
}

/** Картинка с подписью по id — если картинка есть. */
function Pic({ id, className, sizes }: { id?: string; className?: string; sizes?: string }) {
  const img = id ? chessImage(id) : undefined;
  return img ? <Figure image={img} className={className} sizes={sizes} /> : null;
}

/** Карта-схема: откуда и куда шли шахматы. */
function JourneyMap() {
  const stops = [
    { x: 60, y: 150, emoji: "🐘", name: "Индия", when: "VI век" },
    { x: 190, y: 90, emoji: "🏺", name: "Персия", when: "VII век" },
    { x: 320, y: 60, emoji: "🏛️", name: "Самарканд", when: "VII–VIII века" },
    { x: 430, y: 130, emoji: "📜", name: "Багдад", when: "IX век" },
    { x: 560, y: 80, emoji: "⛵", name: "Испания", when: "XI век" },
    { x: 680, y: 140, emoji: "♛", name: "Европа", when: "XV век" },
    { x: 770, y: 70, emoji: "🌍", name: "Весь мир", when: "сегодня" },
  ];
  const path = stops.map((s, i) => `${i === 0 ? "M" : "L"} ${s.x} ${s.y}`).join(" ");
  return (
    <svg
      viewBox="0 0 830 210"
      width="100%"
      role="img"
      aria-label="Путь шахмат: Индия, Персия, Самарканд, Багдад, Испания, Европа, весь мир"
      className="max-w-4xl"
    >
      <rect x="0" y="0" width="830" height="210" rx="24" fill="#fdf6e3" />
      <path
        d={path}
        fill="none"
        stroke="#b45309"
        strokeWidth="4"
        strokeDasharray="10 8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {stops.map((s) => (
        <g key={s.name}>
          <circle cx={s.x} cy={s.y} r="26" fill="#fff" stroke="#7c5a33" strokeWidth="3" />
          <text x={s.x} y={s.y + 9} textAnchor="middle" fontSize="26">
            {s.emoji}
          </text>
          <text x={s.x} y={s.y + 48} textAnchor="middle" fontSize="15" fontWeight="900" fill="#1d2140">
            {s.name}
          </text>
          <text x={s.x} y={s.y + 65} textAnchor="middle" fontSize="12" fontWeight="700" fill="#6b7280">
            {s.when}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Encyclopedia() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-8">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← Шахматная школа
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Энциклопедия</p>
        <h1 className="text-3xl font-black">Всё о шахматах</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Откуда пришли шахматы, кто был чемпионом, почему слон называется слоном и сколько зёрен помещается на доске.
        </p>
        <nav className="mt-3 flex flex-wrap gap-1.5" aria-label="Разделы энциклопедии">
          {SECTIONS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-xl bg-white px-3 py-1.5 text-sm font-extrabold text-brand-dark shadow-sm hover:bg-brand-soft"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section id="history" className="scroll-mt-24 space-y-4" aria-labelledby="history-h">
        <h2 id="history-h" className="text-2xl font-black">
          🗺️ Путь шахмат: полторы тысячи лет
        </h2>
        <div className="rounded-3xl bg-white p-3 shadow-card">
          <JourneyMap />
        </div>
        <ol className="relative space-y-3 border-l-4 border-[#e5c07b] pl-5">
          {TIMELINE.map((t) => (
            <li
              key={t.title}
              className={cn("relative rounded-2xl p-4 shadow-card", t.local ? "bg-sun-soft/70" : "bg-white")}
            >
              <span
                className="absolute top-5 -left-[31px] flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-sm"
                aria-hidden
              >
                {t.emoji}
              </span>
              <div className="sm:flex sm:items-start sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
                    {t.when} · {t.place}
                    {t.local ? " · 🇺🇿" : ""}
                  </p>
                  <p className="text-lg font-black">{t.title}</p>
                  <p className="mt-1">{t.text}</p>
                </div>
                <Pic
                  id={t.image}
                  className="mt-3 sm:mt-0 sm:w-52 sm:shrink-0"
                  sizes="(max-width: 640px) 100vw, 208px"
                />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="uzbekistan" className="scroll-mt-24 space-y-3" aria-labelledby="uz-h">
        <h2 id="uz-h" className="text-2xl font-black">
          🇺🇿 {UZBEK_CHESS.title}
        </h2>
        <div className="rounded-3xl bg-white p-5 shadow-card">
          {UZBEK_CHESS.paragraphs.map((p) => (
            <p key={p} className="mt-2 text-lg leading-relaxed first:mt-0">
              {p}
            </p>
          ))}
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {UZBEK_CHESS.people.map((p) => (
              <li key={p.name} className="flex gap-3 rounded-2xl bg-brand-soft/60 p-3">
                <Face id={p.image} size={64} />
                <div className="min-w-0">
                  <p className="font-black">{p.name}</p>
                  <p className="text-xs font-bold text-muted">{p.years}</p>
                  <p className="mt-1 text-sm">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="champions" className="scroll-mt-24 space-y-3" aria-labelledby="champ-h">
        <h2 id="champ-h" className="text-2xl font-black">
          🏆 Чемпионы мира
        </h2>
        <div className="overflow-x-auto rounded-3xl bg-white p-2 shadow-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-extrabold tracking-wide text-muted uppercase">
                <th className="px-3 py-2">№</th>
                <th className="px-3 py-2">Чемпион</th>
                <th className="px-3 py-2">Страна</th>
                <th className="px-3 py-2">Годы</th>
                <th className="px-3 py-2">Интересно</th>
              </tr>
            </thead>
            <tbody>
              {WORLD_CHAMPIONS.map((c) => (
                <tr key={c.n} className="border-t border-line">
                  <td className="tabular px-3 py-2 font-black">{c.n}</td>
                  <td className="px-3 py-2 font-black whitespace-nowrap">
                    <span className="flex items-center gap-2">
                      <Face id={c.image} size={40} />
                      {c.name}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted">{c.country}</td>
                  <td className="tabular px-3 py-2 whitespace-nowrap">{c.years}</td>
                  <td className="px-3 py-2">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="rounded-2xl bg-sun-soft/70 px-4 py-3 text-sm">{FIDE_NOTE}</p>
        <h3 className="text-xl font-black">Чемпионки мира</h3>
        <ul className="grid gap-3 md:grid-cols-5">
          {WOMEN_CHAMPIONS.map((c) => (
            <li key={c.n} className="rounded-2xl bg-white p-3 shadow-card">
              <Face id={c.image} size={72} className="mb-2" />
              <p className="font-black">{c.name}</p>
              <p className="text-xs font-bold text-muted">
                {c.country} · {c.years}
              </p>
              <p className="mt-1 text-sm">{c.note}</p>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 rounded-2xl bg-brand-soft/60 px-4 py-3 text-sm">
          <Face id="polgar" size={56} />
          <p>{POLGAR_NOTE}</p>
        </div>
      </section>

      <section id="names" className="scroll-mt-24 space-y-3" aria-labelledby="names-h">
        <h2 id="names-h" className="text-2xl font-black">
          🔤 Имена фигур на трёх языках
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PIECE_NAMES.map((p) => (
            <li key={p.piece} className="flex gap-3 rounded-3xl bg-white p-4 shadow-card">
              <PieceIcon piece={p.piece} className="h-16 w-16 shrink-0 rounded-2xl bg-[#f0d9b5] p-1" />
              <div>
                <p className="text-xl font-black">
                  {p.ru}{" "}
                  <span
                    lang="uz"
                    className="rounded-lg bg-brand-soft px-2 py-0.5 text-sm font-extrabold text-brand-dark"
                  >
                    {p.uz}
                  </span>{" "}
                  <span lang="en" className="text-sm font-bold text-muted">
                    {p.en}
                  </span>
                </p>
                <p className="mt-1 text-sm">{p.origin}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="records" className="scroll-mt-24 space-y-3" aria-labelledby="records-h">
        <h2 id="records-h" className="text-2xl font-black">
          📚 Рекорды и факты
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RECORDS.map((r) => (
            <li
              key={r.title}
              className={cn("rounded-3xl bg-white p-4 shadow-card", r.image && "sm:col-span-2 sm:flex sm:gap-4")}
            >
              <Pic id={r.image} className="mb-3 sm:mb-0 sm:w-64 sm:shrink-0" sizes="(max-width: 640px) 100vw, 256px" />
              <div>
                <p className="text-3xl" aria-hidden>
                  {r.emoji}
                </p>
                <p className="mt-1 font-black">{r.title}</p>
                <p className="mt-1 text-sm">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="math" className="scroll-mt-24 space-y-3" aria-labelledby="math-h">
        <h2 id="math-h" className="text-2xl font-black">
          🧮 Шахматы и математика
        </h2>
        <p className="text-muted">
          Подумай сам, потом открой ответ. Многие задачи ты уже встречал на неделях лаборатории!
        </p>
        <ul className="grid gap-3 md:grid-cols-2">
          {CHESS_MATH.map((m, i) => (
            <li key={i} className="rounded-3xl bg-white p-4 shadow-card">
              <p className="text-lg font-bold">
                <span aria-hidden>{m.emoji} </span>
                <RichText text={m.question} />
              </p>
              {open === String(i) ? (
                <div className="mt-2 rounded-2xl bg-mint-soft/70 px-3 py-2">
                  <p className="font-semibold">
                    <RichText text={m.answer} />
                  </p>
                  {m.link && <p className="mt-1 text-sm text-muted">{m.link}</p>}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpen(String(i))}
                  className="mt-2 text-sm font-extrabold text-brand hover:underline"
                >
                  Показать ответ
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="credits" className="scroll-mt-24 space-y-3" aria-labelledby="credits-h">
        <h2 id="credits-h" className="text-2xl font-black">
          📷 Откуда картинки
        </h2>
        <p className="text-sm text-muted">
          Все фотографии и картины в энциклопедии взяты из Wikimedia Commons. Они в общественном достоянии или под
          свободными лицензиями Creative Commons, которые разрешают использовать картинку, если назвать автора. Для
          сайта картинки уменьшены.
        </p>
        <div className="rounded-3xl bg-white p-4 shadow-card">
          <ImageCredits images={CHESS_IMAGES} />
        </div>
      </section>
    </div>
  );
}
