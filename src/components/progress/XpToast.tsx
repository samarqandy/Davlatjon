"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { getState, onStateChange, useStore } from "@/lib/store";
import { showsNumbers } from "@/lib/workshop";
import { playReward } from "@/lib/sfx";
import { rewardFor, xpLevel, xpTotal } from "@/lib/xp";

/**
 * «+10 XP ⭐» на секунду-две после решённой задачи, партии или упражнения — на любой странице.
 * Большие скачки (синхронизация с аккаунтом, сброс) не показываем.
 */
export function XpToast() {
  const [toast, setToast] = useState<{ id: number; gain: number; level: number | null } | null>(null);
  const t = useT();
  const numbers = useStore((s) => showsNumbers(s.settings.age));

  useEffect(() => {
    let prev = xpTotal(getState());
    let hide: ReturnType<typeof setTimeout> | undefined;
    const off = onStateChange(() => {
      const xp = xpTotal(getState());
      const gain = xp - prev;
      const reward = rewardFor(prev, xp);
      prev = xp;
      if (!reward) return;
      playReward(reward);
      setToast({ id: Date.now(), gain, level: reward === "level" ? xpLevel(xp).level : null });
      clearTimeout(hide);
      hide = setTimeout(() => setToast(null), reward === "level" ? 2800 : 1800);
    });
    return () => {
      off();
      clearTimeout(hide);
    };
  }, []);

  if (!toast) return null;
  if (toast.level)
    return (
      <div
        key={toast.id}
        role="status"
        data-level-toast
        className="pointer-events-none fixed top-20 right-4 left-4 z-50 mx-auto w-fit animate-pop rounded-3xl bg-brand px-5 py-3 text-center text-xl font-black text-white shadow-lift"
      >
        🎉 {t("Новый уровень!", "Yangi daraja!")}
        {numbers && <span className="ml-2 rounded-xl bg-white/20 px-2">{toast.level}</span>}
      </div>
    );
  return (
    <div
      key={toast.id}
      role="status"
      data-xp-toast
      className="pointer-events-none fixed top-20 right-4 z-50 animate-pop rounded-2xl bg-sun px-4 py-2 text-lg font-black text-ink shadow-lift"
    >
      {numbers ? `+${toast.gain} XP ⭐` : "⭐"}
    </div>
  );
}
