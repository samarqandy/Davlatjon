"use client";

import { BarChart3, BookOpen, ChessKnight, Lock, NotebookPen, Settings, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, Icon } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { lockParent, useParentGate } from "@/lib/parentGate";
import { useHydrated, useStore } from "@/lib/store";

export interface NavWeek {
  number: number;
  dayIds: string[];
}

/** Неделя для обзора: последняя, в которой ребёнок уже занимался (или первая). */
function reviewWeek(weeks: NavWeek[], days: Record<string, { startedAt?: number }>): number {
  const active = weeks.filter((w) => w.dayIds.some((id) => days[id]?.startedAt));
  return (active[active.length - 1] ?? weeks[0])?.number ?? 1;
}

export function ParentNav({ weeks }: { weeks: NavWeek[] }) {
  const path = usePathname();
  const t = useT();
  const gate = useParentGate();
  const hydrated = useHydrated();
  const days = useStore((s) => s.days);
  // Пока раздел не открыт PIN-кодом, меню не показываем: оно подсказывало бы ребёнку, что внутри.
  if (gate !== "unlocked") return null;
  const week = hydrated ? reviewWeek(weeks, days) : (weeks[0]?.number ?? 1);
  const links = [
    { href: "/parent", Glyph: BarChart3, label: t("Обзор", "Umumiy holat"), active: path === "/parent" },
    {
      href: `/parent/week/${week}/review`,
      Glyph: NotebookPen,
      label: t("Недельный обзор", "Haftalik sharh"),
      active: /^\/parent\/week\/\d+\/review$/.test(path),
    },
    {
      href: "/parent/report",
      Glyph: TrendingUp,
      label: t("Итоги недели", "Hafta yakunlari"),
      active: path === "/parent/report",
    },
    { href: "/parent/chess", Glyph: ChessKnight, label: t("Шахматы", "Shaxmat"), active: path === "/parent/chess" },
    { href: "/parent/guide", Glyph: BookOpen, label: t("Методичка", "Qoʻllanma"), active: path === "/parent/guide" },
    {
      href: "/parent/settings",
      Glyph: Settings,
      label: t("Настройки", "Sozlamalar"),
      active: path === "/parent/settings",
    },
  ];
  return (
    <div className="no-print mb-6 flex flex-wrap items-center gap-2">
      <nav className="flex flex-wrap gap-1.5" aria-label={t("Раздел для родителей", "Ota-onalar boʻlimi")}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-extrabold transition",
              l.active ? "bg-ink text-white" : "bg-surface text-muted shadow-sm hover:text-ink",
            )}
          >
            <Icon icon={l.Glyph} /> {l.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={lockParent}
        className="ml-auto min-h-11 rounded-xl px-3 py-2 text-sm font-bold text-muted hover:bg-black/5"
      >
        <Icon icon={Lock} /> {t("Закрыть раздел", "Boʻlimni yopish")}
      </button>
    </div>
  );
}
