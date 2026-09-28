"use client";

import { RichText } from "@/components/RichText";
import { Card } from "@/components/ui";
import type { GuideSection } from "@/content/guide";
import { useBoth, useT, type Both } from "@/lib/i18n";

export interface GuideContent {
  guide: GuideSection[];
  chain: string[];
}

/** Методичка для родителя: текст готовит сервер на обоих языках, здесь показываем нужный. */
export function ParentGuide({ content }: { content: Both<GuideContent> }) {
  const t = useT();
  const { guide, chain } = useBoth(content);
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{t("Методичка", "Qoʻllanma")}</p>
        <h1 className="text-3xl font-black">
          {t("Как заниматься с Давлатжоном", "Davlatjon bilan qanday shugʻullanish kerak")}
        </h1>
        <p className="mt-1 max-w-3xl text-muted">
          {t(
            "Коротко о главном: как устроена программа, как проводить занятие, давать подсказки и наблюдать — чтобы математика оставалась местом, где происходят интересные вещи.",
            "Eng muhimi qisqacha: dastur qanday tuzilgan, mashgʻulotni qanday oʻtkazish, maslahatni qanday berish va qanday kuzatish kerak — toki matematika qiziqarli kashfiyotlar olami boʻlib qolaversin.",
          )}
        </p>
      </div>

      <Card className="p-5">
        <p className="mb-3 text-sm font-extrabold text-muted uppercase">
          {t("Путь мысли, который мы тренируем", "Biz mashq qiladigan fikr yoʻli")}
        </p>
        <ol className="flex flex-wrap items-center gap-1.5">
          {chain.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span className="rounded-xl bg-brand-soft px-3 py-1.5 text-sm font-extrabold text-brand-dark">
                {step}
              </span>
              {i < chain.length - 1 && (
                <span className="text-muted" aria-hidden>
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {guide.map((s) => (
          <Card key={s.id} className="print-task p-5 sm:p-6">
            <h2 className="mb-2 text-xl font-black">
              <span aria-hidden>{s.emoji}</span> {s.title}
            </h2>
            {s.paragraphs?.map((p) => (
              <p key={p} className="mb-2 leading-relaxed">
                <RichText text={p} />
              </p>
            ))}
            {s.list && (
              <ul className="space-y-1.5">
                {s.list.map((item) => (
                  <li key={item} className="flex gap-2 leading-relaxed">
                    <span className="text-brand" aria-hidden>
                      ●
                    </span>
                    <span>
                      <RichText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {s.steps && (
              <ol className="mt-1 space-y-1.5">
                {s.steps.map((st) => (
                  <li key={st.title} className="grid grid-cols-[7.5rem_1fr] gap-2">
                    <span className="font-extrabold text-brand-dark">{st.title}</span>
                    <span>{st.text}</span>
                  </li>
                ))}
              </ol>
            )}
            {s.pairs && (
              <table className="w-full text-left text-[0.95rem]">
                <thead>
                  <tr className="text-sm text-muted">
                    <th className="pb-1 font-extrabold">{t("Вместо", "Buning oʻrniga")}</th>
                    <th className="pb-1 font-extrabold">{t("Лучше сказать", "Yaxshisi shunday deng")}</th>
                  </tr>
                </thead>
                <tbody>
                  {s.pairs.map((p) => (
                    <tr key={p.say} className="border-t border-line">
                      <td className="py-1.5 pr-3 text-rose line-through decoration-2">{p.avoid}</td>
                      <td className="py-1.5 font-bold text-[#047857]">{p.say}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
