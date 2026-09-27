"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";
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
  const gate = useParentGate();
  const hydrated = useHydrated();
  const days = useStore((s) => s.days);
  const week = hydrated ? reviewWeek(weeks, days) : (weeks[0]?.number ?? 1);
  const links = [
    { href: "/parent", label: "📊 Обзор", active: path === "/parent" },
    {
      href: `/parent/week/${week}/review`,
      label: "📝 Недельный обзор",
      active: /^\/parent\/week\/\d+\/review$/.test(path),
    },
    { href: "/parent/guide", label: "📘 Методичка", active: path === "/parent/guide" },
    { href: "/parent/settings", label: "⚙️ Настройки", active: path === "/parent/settings" },
  ];
  return (
    <div className="no-print mb-6 flex flex-wrap items-center gap-2">
      <nav className="flex flex-wrap gap-1.5" aria-label="Раздел для родителей">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-extrabold transition",
              l.active ? "bg-ink text-white" : "bg-white text-muted shadow-sm hover:text-ink",
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      {gate === "unlocked" && (
        <button
          type="button"
          onClick={lockParent}
          className="ml-auto rounded-xl px-3 py-2 text-sm font-bold text-muted hover:bg-black/5"
        >
          🔒 Закрыть раздел
        </button>
      )}
    </div>
  );
}
