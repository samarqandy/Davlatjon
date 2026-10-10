"use client";

import { useState } from "react";
import { MascotSays } from "@/components/Mascot";
import { Button, cn } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { PLACEMENT, isCorrect, startWeekFor, type Week } from "@/lib/placement";
import { updateSettings, useHydrated, useStore } from "@/lib/store";

/**
 * «С какой недели начнём?» — на главной у тех, кто ещё ничего не решал. Шесть коротких задач,
 * потом предложение начать с подходящей недели. Можно отказаться и идти с первого дня.
 */
export function PlacementCard() {
  const t = useT();
  const hydrated = useHydrated();
  const decided = useStore((s) => s.settings.startWeek !== undefined);
  const fresh = useStore((s) => Object.keys(s.tasks).length === 0);
  const age = useStore((s) => s.settings.age ?? 0);
  const [phase, setPhase] = useState<"offer" | "quiz" | "result">("offer");
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [correct, setCorrect] = useState<Record<string, boolean>>({});
  const [week, setWeek] = useState<Week>(1);

  // Тест для тех, кто уже читает и считает свободно; малышам он только испугает.
  if (!hydrated || decided || !fresh || age < 8) return null;

  const q = PLACEMENT[index];
  const answer = (skip: boolean) => {
    const next = { ...correct, [q.id]: !skip && isCorrect(q, value) };
    setCorrect(next);
    setValue("");
    if (index + 1 < PLACEMENT.length) setIndex(index + 1);
    else {
      setWeek(startWeekFor(next));
      setPhase("result");
    }
  };

  return (
    <section className="rounded-[2rem] border-2 border-brand/25 bg-white p-5 shadow-card sm:p-6" data-placement={phase}>
      {phase === "offer" && (
        <div className="space-y-3">
          <MascotSays>
            {t(
              "Хочешь, подберём, с какой недели тебе интереснее начать?",
              "Qaysi haftadan boshlash qiziqroq ekanini birga aniqlaymizmi?",
            )}
          </MascotSays>
          <p className="text-sm text-muted">
            {t(
              "Шесть коротких задач, без оценок и без спешки. Если не хочется — начни с первого дня.",
              "Oltita qisqa masala, baholarsiz va shoshilmasdan. Xohlamasang — birinchi kundan boshla.",
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setPhase("quiz")}>{t("Попробовать", "Sinab koʻrish")}</Button>
            <Button variant="ghost" onClick={() => updateSettings({ startWeek: 1 })}>
              {t("С первого дня", "Birinchi kundan")}
            </Button>
          </div>
        </div>
      )}
      {phase === "quiz" && (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) answer(false);
          }}
        >
          <p className="text-sm font-extrabold text-muted">
            {t(`Задача ${index + 1} из ${PLACEMENT.length}`, `${index + 1}-masala, jami ${PLACEMENT.length} ta`)}
          </p>
          <p className="child-text text-xl font-bold">{t(q.ru, q.uz)}</p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
              inputMode="numeric"
              autoComplete="off"
              aria-label={t("Ответ", "Javob")}
              placeholder="?"
              className="tabular h-12 w-28 rounded-xl border-2 border-line bg-paper px-3 text-center text-2xl font-extrabold outline-none focus:border-brand"
              data-placement-input
            />
            <Button type="submit" disabled={!value.trim()}>
              {index + 1 < PLACEMENT.length ? t("Дальше", "Keyingisi") : t("Готово", "Tayyor")}
            </Button>
            <Button variant="ghost" onClick={() => answer(true)}>
              {t("Пока не знаю", "Hozircha bilmayman")}
            </Button>
          </div>
        </form>
      )}
      {phase === "result" && (
        <div className="space-y-3" aria-live="polite">
          <MascotSays>
            {week === 1
              ? t(
                  "Начнём с первой недели — там много интересного!",
                  "Birinchi haftadan boshlaymiz — u yerda qiziq narsalar koʻp!",
                )
              : t(
                  `Отлично! Начнём с недели ${week}: первые задачи тебе уже знакомы.`,
                  `Zoʻr! ${week}-haftadan boshlaymiz: dastlabki masalalar senga tanish.`,
                )}
          </MascotSays>
          <div className="flex flex-wrap gap-2">
            <Button variant="success" onClick={() => updateSettings({ startWeek: week })} data-placement-accept>
              {t(`Начать с недели ${week}`, `${week}-haftadan boshlash`)}
            </Button>
            {week > 1 && (
              <Button variant="secondary" onClick={() => updateSettings({ startWeek: 1 })}>
                {t("Лучше с самого начала", "Yaxshisi boshidan")}
              </Button>
            )}
          </div>
          <p className={cn("text-xs text-muted")}>
            {t(
              "Все недели остаются открытыми — вернуться назад можно в любой момент.",
              "Hamma haftalar ochiq qoladi — istalgan payt orqaga qaytish mumkin.",
            )}
          </p>
        </div>
      )}
    </section>
  );
}
