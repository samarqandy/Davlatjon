"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COLLECTION_HREF, COLLECTION_TOTAL, newCardAt } from "@/lib/collection";
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
  const [toast, setToast] = useState<{ id: number; gain: number; level: number | null; card: boolean } | null>(null);
  const t = useT();
  const numbers = useStore((s) => showsNumbers(s.settings.age));

  useEffect(() => {
    let prev = xpTotal(getState());
    let hide: ReturnType<typeof setTimeout> | undefined;
    const off = onStateChange(() => {
      const xp = xpTotal(getState());
      const gain = xp - prev;
      const reward = rewardFor(prev, xp);
      const card = newCardAt(prev, xp, COLLECTION_TOTAL);
      prev = xp;
      if (!reward) return;
      playReward(reward);
      setToast({ id: Date.now(), gain, level: reward === "level" ? xpLevel(xp).level : null, card });
      clearTimeout(hide);
      hide = setTimeout(() => setToast(null), reward === "level" || card ? 3200 : 1800);
    });
    return () => {
      off();
      clearTimeout(hide);
    };
  }, []);

  if (!toast) return null;
  const cardLink = toast.card && (
    <Link
      href={COLLECTION_HREF}
      data-card-toast
      className="pointer-events-auto mt-2 block rounded-xl bg-white/90 px-3 py-1 text-base font-black text-ink"
    >
      🃏 {t("Новая карточка героя!", "Yangi qahramon kartochkasi!")}
    </Link>
  );
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
        {cardLink}
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
      {cardLink}
    </div>
  );
}
