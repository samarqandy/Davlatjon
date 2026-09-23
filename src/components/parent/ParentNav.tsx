"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";
import { lockParent, useParentGate } from "@/lib/parentGate";

const LINKS = [
  { href: "/parent", label: "📊 Обзор" },
  { href: "/parent/week/1/review", label: "📝 Недельный обзор" },
  { href: "/parent/guide", label: "📘 Методичка" },
  { href: "/parent/settings", label: "⚙️ Настройки" },
];

export function ParentNav() {
  const path = usePathname();
  const gate = useParentGate();
  return (
    <div className="no-print mb-6 flex flex-wrap items-center gap-2">
      <nav className="flex flex-wrap gap-1.5" aria-label="Раздел для родителей">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-extrabold transition",
              path === l.href ? "bg-ink text-white" : "bg-white text-muted shadow-sm hover:text-ink",
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
