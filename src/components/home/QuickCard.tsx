"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { useHydrated, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";

/** Короткая карточка «Быстрые примеры» на главной: десять вопросов за пару минут. */
export function QuickCard() {
  const t = useT();
  const hydrated = useHydrated();
  const today = useToday();
  const done = useStore((s) => (today ? Object.keys(s.quick).some((k) => k.startsWith(`${today}:`)) : false));
  return (
    <Link
      href="/quick"
      data-quick-card
      className="flex items-center gap-4 rounded-[2rem] border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift sm:p-5"
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sun-soft text-3xl" aria-hidden>
        ⚡
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xl font-black">{t("Быстрые примеры", "Tez mashq")}</span>
        <span className="block text-sm text-muted">
          {hydrated && done
            ? t(
                "Сегодня серия уже есть. Можно ещё — вопросы каждый раз новые.",
                "Bugun seriya bor. Yana boʻladi — savollar har safar yangi.",
              )
            : t("Десять вопросов за пару минут — каждый раз новые.", "Ikki daqiqada oʻnta savol — har safar yangi.")}
        </span>
      </span>
      <span className="text-2xl font-black text-brand" aria-hidden>
        ▶
      </span>
    </Link>
  );
}
