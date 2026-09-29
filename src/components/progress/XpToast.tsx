"use client";

import { useEffect, useState } from "react";
import { getState, onStateChange } from "@/lib/store";
import { xpTotal } from "@/lib/xp";

/**
 * «+10 XP ⭐» на секунду-две после решённой задачи, партии или упражнения — на любой странице.
 * Большие скачки (синхронизация с аккаунтом, сброс) не показываем.
 */
export function XpToast() {
  const [toast, setToast] = useState<{ id: number; gain: number } | null>(null);

  useEffect(() => {
    let prev = xpTotal(getState());
    let hide: ReturnType<typeof setTimeout> | undefined;
    const off = onStateChange(() => {
      const xp = xpTotal(getState());
      const gain = xp - prev;
      prev = xp;
      if (gain <= 0 || gain > 100) return;
      setToast({ id: Date.now(), gain });
      clearTimeout(hide);
      hide = setTimeout(() => setToast(null), 1800);
    });
    return () => {
      off();
      clearTimeout(hide);
    };
  }, []);

  if (!toast) return null;
  return (
    <div
      key={toast.id}
      role="status"
      data-xp-toast
      className="pointer-events-none fixed right-4 bottom-4 z-50 animate-pop rounded-2xl bg-sun px-4 py-2 text-lg font-black text-ink shadow-lift"
    >
      +{toast.gain} XP ⭐
    </div>
  );
}
