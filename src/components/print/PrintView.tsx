"use client";

import Link from "next/link";
import { useState } from "react";
import { ParentGate } from "@/components/parent/ParentGate";
import { Button, cn } from "@/components/ui";
import type { Day } from "@/content/types";
import { setHash, useHash } from "@/lib/useHash";
import { AnswersSheet, WorksheetSheet } from "./PrintSheets";

type Variant = "tasks" | "answers" | "all";

const VARIANTS: { id: Variant; label: string; hint: string }[] = [
  { id: "tasks", label: "📝 Задания", hint: "Листы для ребёнка — без ответов" },
  { id: "answers", label: "🔐 Ответы", hint: "Лист для взрослого: ответы, объяснения, подсказки" },
  { id: "all", label: "📚 Всё вместе", hint: "Сначала задания, потом ответы на отдельных листах" },
];

export function PrintView({ days, title, backHref }: { days: Day[]; title: string; backHref: string }) {
  const hash = useHash();
  const variant: Variant = hash === "#answers" ? "answers" : hash === "#all" ? "all" : "tasks";
  const [withSpace, setWithSpace] = useState(true);
  const needsParent = variant !== "tasks";

  return (
    <div className="min-h-dvh bg-[#e9e6de] print:bg-white">
      <div className="no-print sticky top-0 z-20 border-b border-line bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <Link
            href={backHref}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl hover:bg-black/5"
            aria-label="Назад"
          >
            ←
          </Link>
          <div className="mr-auto min-w-0">
            <p className="text-xs font-bold text-muted">Печать</p>
            <h1 className="truncate font-black">{title}</h1>
          </div>
          <div className="flex rounded-2xl bg-paper p-1" role="tablist" aria-label="Что печатать">
            {VARIANTS.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={variant === v.id}
                title={v.hint}
                onClick={() => setHash(`#${v.id}`)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-extrabold transition",
                  variant === v.id ? "bg-white text-brand-dark shadow-sm" : "text-muted hover:text-ink",
                )}
              >
                {v.label}
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
            Место для решения
          </label>
          <Button onClick={() => window.print()} size="md">
            🖨 Печать
          </Button>
        </div>
        <p className="mx-auto max-w-5xl px-4 pb-2 text-xs text-muted">
          {VARIANTS.find((v) => v.id === variant)?.hint}. Совет: в окне печати можно выбрать «Сохранить как PDF». Формат
          A4, масштаб 100%.
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
