"use client";

import { cn } from "@/components/ui";
import type { Dialogue, NewView, QuoteLevel, Thought } from "@/content/chess/insights";
import { useT } from "@/lib/i18n";

/** Плашка надёжности цитаты: честно говорим, откуда она. */
function LevelBadge({ level }: { level: QuoteLevel }) {
  const t = useT();
  const map: Record<QuoteLevel, { text: string; cls: string }> = {
    primary: { text: t("📖 Из книги автора", "📖 Muallifning kitobidan"), cls: "bg-mint-soft text-[#047857]" },
    quoted: {
      text: t("🔎 По цитате в другом источнике", "🔎 Boshqa manbadagi keltirish"),
      cls: "bg-brand-soft text-brand-dark",
    },
    attributed: {
      text: t("❓ Приписывают, источника не нашли", "❓ Nisbat beriladi, manba topilmadi"),
      cls: "bg-sun-soft text-[#7a4b00]",
    },
  };
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-extrabold", map[level].cls)}>
      {map[level].text}
    </span>
  );
}

/** «Мысли великих»: короткая цитата, откуда она, что значит и что попробовать. */
export function Thoughts({ thoughts }: { thoughts: Thought[] }) {
  const t = useT();
  return (
    <ul className="grid gap-3 sm:grid-cols-2" data-thoughts>
      {thoughts.map((q) => (
        <li key={q.id} className="flex flex-col rounded-3xl bg-white p-4 shadow-card sm:p-5" data-thought={q.id}>
          <blockquote className="text-lg leading-snug font-black">«{q.quote}»</blockquote>
          <p className="mt-2 font-extrabold">
            {q.author} <span className="text-sm font-bold text-muted">· {q.where}</span>
          </p>
          <p className="mt-1 text-xs font-bold text-muted">{q.source}</p>
          <div className="mt-1">
            <LevelBadge level={q.level} />
          </div>
          <p className="mt-3 text-[0.95rem]">
            <b>{t("Что это значит: ", "Bu nima degani: ")}</b>
            {q.meaning}
          </p>
          <p className="mt-2 rounded-2xl bg-sun-soft/70 px-3 py-2 text-[0.95rem] font-semibold text-[#7a4b00]">
            <span aria-hidden>🎯</span> <b>{t("Попробуй: ", "Sinab koʻr: ")}</b>
            {q.try}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** «Разговоры»: придуманные сцены, где герой приходит к новой мысли; факты в них настоящие. */
export function Dialogues({ dialogues }: { dialogues: Dialogue[] }) {
  const t = useT();
  return (
    <div className="space-y-3" data-dialogues>
      {dialogues.map((d) => {
        const speakers = [...new Set(d.lines.map((l) => l.who))];
        return (
          <details
            key={d.id}
            id={`dialogue-${d.id}`}
            className="group rounded-3xl bg-white shadow-card"
            data-dialogue={d.id}
          >
            <summary className="flex min-h-14 cursor-pointer list-none items-start gap-3 rounded-3xl p-4 select-none hover:bg-brand-soft/30 sm:p-5 [&::-webkit-details-marker]:hidden">
              <span className="text-3xl" aria-hidden>
                {d.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg leading-snug font-black">{d.title}</span>
                <span className="mt-0.5 block text-sm font-bold text-muted">{d.hook}</span>
              </span>
              <span aria-hidden className="mt-1 text-sm font-black text-muted transition group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="space-y-3 px-4 pb-5 sm:px-5">
              <ol className="space-y-2">
                {d.lines.map((l, i) => {
                  const right = speakers.indexOf(l.who) % 2 === 1;
                  return (
                    <li key={i} className={cn("flex", right && "justify-end")}>
                      <p
                        className={cn(
                          "max-w-[88%] rounded-3xl px-4 py-2.5 text-[1.02rem] leading-snug",
                          right ? "rounded-br-lg bg-brand-soft" : "rounded-bl-lg bg-paper",
                        )}
                      >
                        <b className="block text-xs font-extrabold tracking-wide text-muted uppercase">{l.who}</b>
                        {l.text}
                      </p>
                    </li>
                  );
                })}
              </ol>
              <p className="rounded-2xl bg-mint-soft/70 px-4 py-3 font-bold text-[#065f46]">💡 {d.insight}</p>
              <p className="text-xs font-bold text-muted">
                {t("Придуманный разговор. На чём он держится: ", "Oʻylab topilgan suhbat. Nimaga tayanadi: ")}
                {d.basis}
              </p>
            </div>
          </details>
        );
      })}
    </div>
  );
}

/** «Новый взгляд»: «многие думают» — «а на самом деле», с подтверждениями. */
export function NewViews({ views }: { views: NewView[] }) {
  const t = useT();
  return (
    <ul className="grid gap-3 lg:grid-cols-2" data-views>
      {views.map((v) => (
        <li key={v.id} className="rounded-3xl bg-white p-4 shadow-card sm:p-5" data-view={v.id}>
          <p className="text-3xl" aria-hidden>
            {v.emoji}
          </p>
          <p className="mt-1 text-sm font-extrabold tracking-wide text-muted uppercase">
            {t("Многие думают", "Koʻpchilik shunday deb oʻylaydi")}
          </p>
          <p className="text-lg font-black text-muted line-through decoration-2">{v.myth}</p>
          <p className="mt-2 text-sm font-extrabold tracking-wide text-brand uppercase">
            {t("А на самом деле", "Aslida esa")}
          </p>
          <p className="text-lg leading-snug font-black">{v.truth}</p>
          <ul className="mt-3 space-y-1.5 text-[0.95rem]">
            {v.proof.map((p) => (
              <li key={p} className="flex gap-2">
                <span aria-hidden className="text-brand">
                  ●
                </span>
                {p}
              </li>
            ))}
          </ul>
          {v.note && (
            <details className="mt-3 rounded-2xl bg-brand-soft/50 px-3 py-2">
              <summary className="cursor-pointer text-sm font-extrabold text-brand-dark">
                {t("🔎 Взрослым: что сказано осторожно", "🔎 Kattalarga: nima ehtiyotkorlik bilan aytilgan")}
              </summary>
              <p className="mt-1 text-sm">{v.note}</p>
            </details>
          )}
        </li>
      ))}
    </ul>
  );
}
