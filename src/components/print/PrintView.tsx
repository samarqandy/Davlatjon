"use client";

import Link from "next/link";
import { useState } from "react";
import { ParentGate } from "@/components/parent/ParentGate";
import { Button, cn } from "@/components/ui";
import type { Day } from "@/content/types";
import { useTitleTranslation } from "@/lib/docTitle";
import { useBoth, useT, type Both } from "@/lib/i18n";
import { setHash, useHash } from "@/lib/useHash";
import { AnswersSheet, WorksheetSheet } from "./PrintSheets";

type Variant = "tasks" | "answers" | "all";

const VARIANTS: { id: Variant; label: Both<string>; hint: Both<string> }[] = [
  {
    id: "tasks",
    label: { ru: "📝 Задания", uz: "📝 Topshiriqlar" },
    hint: { ru: "Листы для ребёнка — без ответов", uz: "Bola uchun varaqlar — javoblarsiz" },
  },
  {
    id: "answers",
    label: { ru: "🔐 Ответы", uz: "🔐 Javoblar" },
    hint: {
      ru: "Лист для взрослого: ответы, объяснения, подсказки",
      uz: "Kattalar uchun varaq: javoblar, tushuntirishlar, maslahatlar",
    },
  },
  {
    id: "all",
    label: { ru: "📚 Всё вместе", uz: "📚 Hammasi birga" },
    hint: {
      ru: "Сначала задания, потом ответы на отдельных листах",
      uz: "Avval topshiriqlar, keyin alohida varaqlarda javoblar",
    },
  },
];

/** Заголовок вкладки «Печать: день 3. …» — сообщаем перевод названия дня. */
function DayTabTitle({ ru, uz }: { ru: Day; uz: Day }) {
  useTitleTranslation(`день ${ru.day}. ${ru.title}`, `${uz.day}-kun. ${uz.title}`);
  return null;
}

/** Дни и заголовок приходят с сервера на обоих языках; лист для взрослого — с ответами. */
export function PrintView({
  days: bothDays,
  title: bothTitle,
  backHref,
}: {
  days: Both<Day[]>;
  title: Both<string>;
  backHref: string;
}) {
  const t = useT();
  const days = useBoth(bothDays);
  const title = useBoth(bothTitle);
  const hash = useHash();
  const variant: Variant = hash === "#answers" ? "answers" : hash === "#all" ? "all" : "tasks";
  const [withSpace, setWithSpace] = useState(true);
  const needsParent = variant !== "tasks";
  const hint = VARIANTS.find((v) => v.id === variant)!.hint;

  return (
    <div className="min-h-dvh bg-[#e9e6de] print:bg-white">
      {bothDays.ru.length === 1 && <DayTabTitle ru={bothDays.ru[0]} uz={bothDays.uz[0]} />}
      <div className="no-print sticky top-0 z-20 border-b border-line bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <Link
            href={backHref}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl hover:bg-black/5"
            aria-label={t("Назад", "Orqaga")}
          >
            ←
          </Link>
          <div className="mr-auto min-w-0">
            <p className="text-xs font-bold text-muted">{t("Печать", "Chop etish")}</p>
            <h1 className="truncate font-black">{title}</h1>
          </div>
          <div
            className="flex rounded-2xl bg-paper p-1"
            role="tablist"
            aria-label={t("Что печатать", "Nimani chop etamiz")}
          >
            {VARIANTS.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={variant === v.id}
                title={t(v.hint.ru, v.hint.uz)}
                onClick={() => setHash(`#${v.id}`)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-extrabold transition",
                  variant === v.id ? "bg-white text-brand-dark shadow-sm" : "text-muted hover:text-ink",
                )}
              >
                {t(v.label.ru, v.label.uz)}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm font-bold text-muted">
            <input
              type="checkbox"
              checked={withSpace}
              onChange={(e) => setWithSpace(e.target.checked)}
              className="h-4 w-4 accent-[#4f46e5]"
            />
            {t("Место для решения", "Yechish uchun joy")}
          </label>
          <Button onClick={() => window.print()} size="md">
            🖨 {t("Печать", "Chop etish")}
          </Button>
        </div>
        <p className="mx-auto max-w-5xl px-4 pb-2 text-xs text-muted">
          {t(hint.ru, hint.uz)}.{" "}
          {t(
            "Совет: в окне печати можно выбрать «Сохранить как PDF». Формат A4, масштаб 100%.",
            "Maslahat: chop etish oynasida «PDF sifatida saqlash» bandini tanlashingiz mumkin. Format — A4, masshtab — 100%.",
          )}
        </p>
      </div>

      <div className="mx-auto max-w-[230mm] overflow-x-auto px-2 py-6 print:max-w-none print:overflow-visible print:p-0">
        {variant !== "answers" && days.map((d) => <WorksheetSheet key={`w-${d.id}`} day={d} withSpace={withSpace} />)}
        {needsParent && (
          <ParentGate compact>
            {days.map((d) => (
              <AnswersSheet key={`a-${d.id}`} day={d} />
            ))}
          </ParentGate>
        )}
      </div>
    </div>
  );
}
