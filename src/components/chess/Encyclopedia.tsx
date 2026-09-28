"use client";

import Link from "next/link";
import { useState } from "react";
import { RichText } from "@/components/RichText";
import { cn } from "@/components/ui";
import { useLang, useT } from "@/lib/i18n";
import { useChess, useChessImage } from "@/lib/useChess";
import { PieceIcon } from "./ChessBoard";
import { Figure, ImageCredits, Portrait } from "./Figure";

/** Аватарка по id картинки — если картинка есть. */
function Face({ id, size, className }: { id?: string; size: number; className?: string }) {
  const img = useChessImage(id);
  return img ? <Portrait image={img} size={size} className={className} /> : null;
}

/** Картинка с подписью по id — если картинка есть. */
function Pic({ id, className, sizes }: { id?: string; className?: string; sizes?: string }) {
  const img = useChessImage(id);
  return img ? <Figure image={img} className={className} sizes={sizes} /> : null;
}

/** Карта-схема: откуда и куда шли шахматы. */
function JourneyMap() {
  const t = useT();
  const stops = [
    { x: 60, y: 150, emoji: "🐘", name: t("Индия", "Hindiston"), when: t("VI век", "VI asr") },
    { x: 190, y: 90, emoji: "🏺", name: t("Персия", "Eron"), when: t("VII век", "VII asr") },
    { x: 320, y: 60, emoji: "🏛️", name: t("Самарканд", "Samarqand"), when: t("VII–VIII века", "VII–VIII asrlar") },
    { x: 430, y: 130, emoji: "📜", name: t("Багдад", "Bagʻdod"), when: t("IX век", "IX asr") },
    { x: 560, y: 80, emoji: "⛵", name: t("Испания", "Ispaniya"), when: t("XI век", "XI asr") },
    { x: 680, y: 140, emoji: "♛", name: t("Европа", "Yevropa"), when: t("XV век", "XV asr") },
    { x: 770, y: 70, emoji: "🌍", name: t("Весь мир", "Butun dunyo"), when: t("сегодня", "bugun") },
  ];
  const path = stops.map((s, i) => `${i === 0 ? "M" : "L"} ${s.x} ${s.y}`).join(" ");
  return (
    <svg
      viewBox="0 0 830 210"
      width="100%"
      role="img"
      aria-label={t(
        "Путь шахмат: Индия, Персия, Самарканд, Багдад, Испания, Европа, весь мир",
        "Shaxmat yoʻli: Hindiston, Eron, Samarqand, Bagʻdod, Ispaniya, Yevropa, butun dunyo",
      )}
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
  const t = useT();
  const lang = useLang();
  const {
    chessMath,
    fideNote,
    images,
    pieceNamesTable,
    polgarNote,
    records,
    timeline,
    uzbekChess,
    womenChampions,
    worldChampions,
  } = useChess();
  const [open, setOpen] = useState<string | null>(null);
  const sections = [
    ["history", t("🗺️ Путь шахмат", "🗺️ Shaxmat yoʻli")],
    ["uzbekistan", t("🇺🇿 Узбекистан", "🇺🇿 Oʻzbekiston")],
    ["champions", t("🏆 Чемпионы", "🏆 Chempionlar")],
    ["names", t("🔤 Имена фигур", "🔤 Donalarning nomlari")],
    ["records", t("📚 Рекорды и факты", "📚 Rekordlar va faktlar")],
    ["math", t("🧮 Шахматы и математика", "🧮 Shaxmat va matematika")],
    ["credits", t("📷 Откуда картинки", "📷 Rasmlar qayerdan olingan")],
  ] as const;
  return (
    <div className="space-y-8">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        {t("← Шахматная школа", "← Shaxmat maktabi")}
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
          {t("Энциклопедия", "Ensiklopediya")}
        </p>
        <h1 className="text-3xl font-black">{t("Всё о шахматах", "Shaxmat haqida hamma narsa")}</h1>
        <p className="mt-1 max-w-2xl text-muted">
          {t(
            "Откуда пришли шахматы, кто был чемпионом, почему слон называется слоном и сколько зёрен помещается на доске.",
            "Shaxmat qayerdan kelgan, kimlar chempion boʻlgan, fil nega fil deb ataladi va taxtaga qancha don sigʻadi.",
          )}
        </p>
        <nav className="mt-3 flex flex-wrap gap-1.5" aria-label={t("Разделы энциклопедии", "Ensiklopediya boʻlimlari")}>
          {sections.map(([id, label]) => (
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
          {t("🗺️ Путь шахмат: полторы тысячи лет", "🗺️ Shaxmat yoʻli: bir yarim ming yil")}
        </h2>
        <div className="rounded-3xl bg-white p-3 shadow-card">
          <JourneyMap />
        </div>
        <ol className="relative space-y-3 border-l-4 border-[#e5c07b] pl-5">
          {timeline.map((ev) => (
            <li
              key={ev.title}
              className={cn("relative rounded-2xl p-4 shadow-card", ev.local ? "bg-sun-soft/70" : "bg-white")}
            >
              <span
                className="absolute top-5 -left-[31px] flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-sm"
                aria-hidden
              >
                {ev.emoji}
              </span>
              <div className="sm:flex sm:items-start sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
                    {ev.when} · {ev.place}
                    {ev.local ? " · 🇺🇿" : ""}
                  </p>
                  <p className="text-lg font-black">{ev.title}</p>
                  <p className="mt-1">{ev.text}</p>
                </div>
                <Pic
                  id={ev.image}
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
          🇺🇿 {uzbekChess.title}
        </h2>
        <div className="rounded-3xl bg-white p-5 shadow-card">
          {uzbekChess.paragraphs.map((p) => (
            <p key={p} className="mt-2 text-lg leading-relaxed first:mt-0">
              {p}
            </p>
          ))}
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {uzbekChess.people.map((p) => (
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
          {t("🏆 Чемпионы мира", "🏆 Jahon chempionlari")}
        </h2>
        <div className="overflow-x-auto rounded-3xl bg-white p-2 shadow-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-extrabold tracking-wide text-muted uppercase">
                <th className="px-3 py-2">№</th>
                <th className="px-3 py-2">{t("Чемпион", "Chempion")}</th>
                <th className="px-3 py-2">{t("Страна", "Mamlakat")}</th>
                <th className="px-3 py-2">{t("Годы", "Yillar")}</th>
                <th className="px-3 py-2">{t("Интересно", "Qiziqarli")}</th>
              </tr>
            </thead>
            <tbody>
              {worldChampions.map((c) => (
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
        <p className="rounded-2xl bg-sun-soft/70 px-4 py-3 text-sm">{fideNote}</p>
        <h3 className="text-xl font-black">{t("Чемпионки мира", "Ayollar orasida jahon chempionlari")}</h3>
        <ul className="grid gap-3 md:grid-cols-5">
          {womenChampions.map((c) => (
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
          <p>{polgarNote}</p>
        </div>
      </section>

      <section id="names" className="scroll-mt-24 space-y-3" aria-labelledby="names-h">
        <h2 id="names-h" className="text-2xl font-black">
          {t("🔤 Имена фигур на трёх языках", "🔤 Donalarning uch tildagi nomlari")}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pieceNamesTable.map((p) => (
            <li key={p.piece} className="flex gap-3 rounded-3xl bg-white p-4 shadow-card">
              <PieceIcon piece={p.piece} className="h-16 w-16 shrink-0 rounded-2xl bg-[#f0d9b5] p-1" />
              {lang === "uz" ? (
                // По-узбекски главное — узбекское имя, русское и английское подписаны, чтобы было понятно, где какое.
                <div>
                  <p lang="uz" className="text-xl font-black">
                    {p.uz.charAt(0).toUpperCase() + p.uz.slice(1)}
                  </p>
                  <p className="mt-0.5 text-sm">
                    <span className="font-bold text-muted">ruscha:</span>{" "}
                    <span lang="ru" className="rounded-lg bg-brand-soft px-2 py-0.5 font-extrabold text-brand-dark">
                      {p.ru}
                    </span>{" "}
                    <span className="font-bold text-muted">inglizcha:</span>{" "}
                    <span lang="en" className="font-bold">
                      {p.en}
                    </span>
                  </p>
                  <p className="mt-1 text-sm">{p.origin}</p>
                </div>
              ) : (
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
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="records" className="scroll-mt-24 space-y-3" aria-labelledby="records-h">
        <h2 id="records-h" className="text-2xl font-black">
          {t("📚 Рекорды и факты", "📚 Rekordlar va faktlar")}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((r) => (
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
          {t("🧮 Шахматы и математика", "🧮 Shaxmat va matematika")}
        </h2>
        <p className="text-muted">
          {t(
            "Подумай сам, потом открой ответ. Многие задачи ты уже встречал на неделях лаборатории!",
            "Avval oʻzing oʻylab koʻr, keyin javobni och. Bu masalalarning koʻpini laboratoriya haftalarida uchratgansan!",
          )}
        </p>
        <ul className="grid gap-3 md:grid-cols-2">
          {chessMath.map((m, i) => (
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
                  {t("Показать ответ", "Javobni koʻrsatish")}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="credits" className="scroll-mt-24 space-y-3" aria-labelledby="credits-h">
        <h2 id="credits-h" className="text-2xl font-black">
          {t("📷 Откуда картинки", "📷 Rasmlar qayerdan olingan")}
        </h2>
        <p className="text-sm text-muted">
          {t(
            "Все фотографии и картины в энциклопедии взяты из Wikimedia Commons. Они в общественном достоянии или под свободными лицензиями Creative Commons, которые разрешают использовать картинку, если назвать автора. Для сайта картинки уменьшены.",
            "Ensiklopediyadagi barcha fotosuratlar va rasmlar Wikimedia Commons saytidan olingan. Ular jamoat mulki hisoblanadi yoki Creative Commons erkin litsenziyalari bilan tarqatiladi: muallifi koʻrsatilsa, bunday rasmdan foydalanish mumkin. Sayt uchun rasmlar kichraytirilgan.",
          )}
        </p>
        <div className="rounded-3xl bg-white p-4 shadow-card">
          <ImageCredits images={images} />
        </div>
      </section>
    </div>
  );
}
