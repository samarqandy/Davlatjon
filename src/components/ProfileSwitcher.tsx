"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { readProfileState, switchProfile } from "@/lib/profiles";
import { useProfiles } from "@/lib/useProfiles";

/**
 * Кто сейчас занимается. Показывается, только если на устройстве больше одного ребёнка:
 * кнопка с аватаркой в шапке открывает список — нажал на свою картинку, и открылся свой прогресс.
 */
export function ProfileSwitcher() {
  const t = useT();
  const reg = useProfiles();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  if (!reg || reg.list.length < 2) return null;
  const rows = reg.list.map((p) => {
    const s = readProfileState(p.id).settings;
    return { id: p.id, avatar: s.avatar ?? "🐣", name: s.childName ?? t("Друг", "Doʻst"), age: s.age };
  });
  const current = rows.find((r) => r.id === reg.active) ?? rows[0];

  return (
    <div ref={box} className="relative" data-profile-switcher>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t(
          `Сейчас занимается: ${current.name}. Сменить`,
          `Hozir shugʻullanmoqda: ${current.name}. Almashtirish`,
        )}
        className="flex min-h-11 items-center gap-1.5 rounded-xl bg-white px-2.5 py-1 text-sm font-extrabold shadow-card hover:bg-brand-soft/50"
      >
        <span aria-hidden className="text-2xl leading-none">
          {current.avatar}
        </span>
        <span className="hidden max-w-24 truncate sm:inline">{current.name}</span>
        <span aria-hidden className="text-xs text-muted">
          ▾
        </span>
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute right-0 z-40 mt-2 w-60 space-y-1 rounded-2xl border border-line bg-white p-2 shadow-lift"
        >
          <li
            role="presentation"
            className="px-2 pt-1 pb-0.5 text-xs font-extrabold tracking-wide text-muted uppercase"
          >
            {t("Кто занимается?", "Kim shugʻullanyapti?")}
          </li>
          {rows.map((r) => (
            <li key={r.id} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={r.id === reg.active}
                data-profile-pick={r.id}
                onClick={() => (r.id === reg.active ? setOpen(false) : switchProfile(r.id))}
                className={cn(
                  "flex min-h-12 w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left font-extrabold transition",
                  r.id === reg.active ? "bg-brand-soft text-brand-dark" : "hover:bg-black/5",
                )}
              >
                <span aria-hidden className="text-3xl leading-none">
                  {r.avatar}
                </span>
                <span className="flex-1 truncate">{r.name}</span>
                {r.id === reg.active && <span aria-hidden>✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
