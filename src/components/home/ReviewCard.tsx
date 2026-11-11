"use client";

import { ChevronRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { reviewHref } from "@/lib/routes";
import { dueTasks, useHydrated, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";

/**
 * «Повторение» на главной: задачи, которые в первый раз дались с трудом и которые пора решить ещё раз.
 * Карточки нет, пока повторять нечего, — пустое место главной не занимаем.
 */
export function ReviewCard() {
  const t = useT();
  const hydrated = useHydrated();
  const today = useToday();
  const tasks = useStore((s) => s.tasks);
  const due = hydrated && today ? dueTasks(tasks, today).filter((id) => reviewHref(id)) : [];
  const href = due[0] && reviewHref(due[0]);
  if (!href) return null;
  return (
    <Link
      href={href}
      data-review-card
      className="flex items-center gap-4 rounded-[2rem] border border-line bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift sm:p-5"
    >
      <span
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand"
        aria-hidden
      >
        <RotateCcw className="h-7 w-7" strokeWidth={2.5} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xl font-black">{t("Повторение", "Takrorlash")}</span>
        <span className="block text-sm text-muted" data-review-count={due.length}>
          {t(
            `${pluralize(due.length, "задача", "задачи", "задач")} — вспомним, как решать`,
            `${due.length} ta masala — yechimini eslaymiz`,
          )}
        </span>
      </span>
      <ChevronRight className="h-7 w-7 shrink-0 text-brand" strokeWidth={2.5} aria-hidden />
    </Link>
  );
}
