"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import { EXTEND_CHOICES, limitStatus } from "@/lib/activity";
import { useT } from "@/lib/i18n";
import { hasPin, unlockWithPin } from "@/lib/parentGate";
import { extendToday, getState, isoDay, onStateChange, useHydrated, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";
import { xpTotal } from "@/lib/xp";
import { isChildPath } from "./ActivityTracker";

/**
 * «На сегодня хватит»: когда родитель задал дневное ограничение и оно исчерпано, ребёнок видит не таймер и
 * не «блокировку» посреди дела, а спокойную карточку — в удобный момент: сразу при открытии сайта, при
 * переходе на другую страницу или когда он завершил дело (задача, упражнение, партия).
 * Продлить может только взрослый: PIN-код прямо здесь или настройки в разделе родителя.
 */
export function RestCard() {
  const t = useT();
  const path = usePathname();
  const hydrated = useHydrated();
  const today = useToday();
  const reached = useStore((s) => (today ? limitStatus(s, today).reached : false));
  // Уже исчерпано при открытии сайта — показываем сразу; иначе ждём удобного момента.
  const [armed, setArmed] = useState(
    () => typeof window !== "undefined" && limitStatus(getState(), isoDay(Date.now())).reached,
  );
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setArmed(true);
  }
  if (!reached && armed) setArmed(false);

  useEffect(() => {
    let prev = xpTotal(getState());
    return onStateChange(() => {
      const now = xpTotal(getState());
      if (now > prev) setArmed(true);
      prev = now;
    });
  }, []);

  if (!hydrated || !reached || !armed || !isChildPath(path)) return null;
  return <Card t={t} onExtended={() => setArmed(false)} />;
}

function Card({ t, onExtended }: { t: ReturnType<typeof useT>; onExtended: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [adult, setAdult] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [granted, setGranted] = useState(false);

  useEffect(() => heading.current?.focus(), []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await unlockWithPin(pin);
    setPin("");
    if (result === "ok") {
      setError(null);
      setGranted(true);
    } else {
      setError(
        result === "wait"
          ? t("Подождите немного и попробуйте снова.", "Biroz kuting va yana urinib koʻring.")
          : t("PIN-код не подошёл.", "PIN-kod mos kelmadi."),
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rest-title"
      data-rest-card
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-paper p-4"
    >
      <div className="w-full max-w-md space-y-5 rounded-3xl border border-line bg-white p-6 text-center shadow-lift sm:p-8">
        <div className="text-6xl" aria-hidden>
          🌙
        </div>
        <h2 id="rest-title" ref={heading} tabIndex={-1} className="text-3xl font-black outline-none">
          {t("На сегодня хватит!", "Bugunga yetarli!")}
        </h2>
        <p className="child-text text-lg">
          {t(
            "Хорошая работа! Всё сохранено — завтра продолжим. А сейчас можно размяться, попить воды или порисовать.",
            "Ajoyib ish! Hammasi saqlandi — ertaga davom etamiz. Hozir esa choʻzilib olish, suv ichish yoki rasm chizish mumkin.",
          )}
        </p>

        <div className="border-t border-line pt-4">
          {!adult ? (
            <button
              type="button"
              onClick={() => setAdult(true)}
              className="min-h-11 rounded-xl px-3 text-sm font-bold text-muted underline underline-offset-4"
            >
              {t("Для взрослых", "Kattalar uchun")}
            </button>
          ) : granted ? (
            <div className="space-y-2" data-rest-extend>
              <p className="text-sm font-bold text-muted">
                {t("Добавить времени на сегодня:", "Bugunga vaqt qoʻshish:")}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {EXTEND_CHOICES.map((m) => (
                  <Button
                    key={m}
                    variant="soft"
                    className="min-h-11"
                    onClick={() => {
                      extendToday(m * 60_000);
                      onExtended();
                    }}
                  >
                    +{m} {t("мин", "daq")}
                  </Button>
                ))}
              </div>
            </div>
          ) : hasPin() ? (
            <form onSubmit={submit} className="space-y-2">
              <label className="block text-sm font-bold text-muted" htmlFor="rest-pin">
                {t("PIN-код взрослого", "Kattalar PIN-kodi")}
              </label>
              <div className="flex justify-center gap-2">
                <input
                  id="rest-pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="tabular h-12 w-28 rounded-xl border-2 border-line bg-paper px-3 text-center text-2xl font-extrabold tracking-widest outline-none focus:border-brand"
                />
                <Button type="submit" disabled={pin.length !== 4}>
                  {t("Открыть", "Ochish")}
                </Button>
              </div>
              {error && (
                <p role="alert" className="text-sm font-bold text-[#7a4b00]">
                  {error}
                </p>
              )}
            </form>
          ) : (
            <p className="text-sm text-muted">
              {t("Взрослым: чтобы продлить время, ", "Kattalarga: vaqtni uzaytirish uchun ")}
              <Link href="/parent" className="font-bold text-brand underline">
                {t("задайте PIN-код в разделе для родителей", "ota-onalar boʻlimida PIN-kod oʻrnating")}
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
