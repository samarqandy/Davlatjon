"use client";

import { useState } from "react";
import { ChildNameField } from "@/components/ChildNameField";
import { Mascot } from "@/components/Mascot";
import { ListenButton } from "@/components/ListenButton";
import { Button, cn } from "@/components/ui";
import { AGE_MAX, AGE_MIN, PROFILES, ageProfile, profileText } from "@/lib/age";
import { cleanChildName } from "@/lib/childName";
import { LANGS, setLang, useLang, useT } from "@/lib/i18n";
import { setChildName, setWelcomed, updateSettings } from "@/lib/store";
import { VOICE_CLIPS } from "@/lib/voice";
import { skipName } from "@/lib/welcome";

const AGES = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i);

/**
 * Первый запуск в два коротких экрана: язык (с голосом) → возраст и, по желанию, имя.
 * Кнопка «Поехали!» всегда доступна: возраст и имя можно не называть — их можно указать позже.
 */
export function Welcome() {
  const t = useT();
  const lang = useLang();
  const [step, setStep] = useState<0 | 1>(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);

  const start = () => {
    if (cleanChildName(name)) setChildName(name);
    else skipName();
    if (age) updateSettings({ age });
    setWelcomed();
  };
  const profile = age ? profileText(PROFILES[ageProfile(age)], lang) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      data-welcome-step={step}
    >
      <div className="my-auto w-full max-w-lg animate-pop rounded-[2rem] bg-white p-6 shadow-lift sm:p-8">
        {step === 0 ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3" aria-hidden>
              <Mascot size={88} float />
            </div>
            <h2 id="welcome-title" className="text-3xl font-black">
              {t("Привет! Добро пожаловать в лабораторию!", "Salom! Laboratoriyaga xush kelibsan!")}
            </h2>
            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Язык · Til">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id)}
                  aria-pressed={lang === l.id}
                  className={cn(
                    "min-h-16 rounded-2xl border-2 px-3 text-xl font-black transition",
                    lang === l.id ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40",
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <ListenButton
              large
              src={VOICE_CLIPS.welcome(lang)}
              label={t("Послушать приветствие", "Salomlashuvni tinglash")}
              className="w-full justify-center"
            />
            <ul
              className="grid grid-cols-1 gap-2 text-lg font-bold sm:grid-cols-3 sm:text-base"
              aria-label={t("Три правила", "Uchta qoida")}
            >
              <li className="flex items-center gap-2 rounded-2xl bg-brand-soft/60 px-3 py-2">
                <span aria-hidden>🐢</span>
                {t("Не торопись", "Shoshilma")}
              </li>
              <li className="flex items-center gap-2 rounded-2xl bg-brand-soft/60 px-3 py-2">
                <span aria-hidden>💡</span>
                {t("Подсказки — по одной", "Maslahat — bittadan")}
              </li>
              <li className="flex items-center gap-2 rounded-2xl bg-brand-soft/60 px-3 py-2">
                <span aria-hidden>💬</span>
                {t("Объясни, почему", "Nega ekanini ayt")}
              </li>
            </ul>
            <Button size="lg" className="w-full" onClick={() => setStep(1)}>
              {t("Дальше →", "Keyingisi →")}
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <h2 id="welcome-title" className="text-3xl font-black">
              {t("Сколько тебе лет?", "Necha yoshdasan?")}
            </h2>
            <div className="grid grid-cols-5 gap-2" role="group" aria-label={t("Возраст", "Yosh")}>
              {AGES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAge(a)}
                  aria-pressed={age === a}
                  className={cn(
                    "min-h-14 rounded-2xl border-2 text-xl font-black transition",
                    age === a ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40",
                  )}
                >
                  {a === AGE_MAX ? `${a}+` : a}
                </button>
              ))}
            </div>
            {profile && (
              <p className="rounded-2xl bg-brand-soft/60 px-3 py-2 text-sm font-semibold" aria-live="polite">
                {t(`${profile.name} профиль`, `«${profile.name}» rejimi`)} · {profile.ages}. {profile.about}
              </p>
            )}
            <ChildNameField
              value={name}
              onChange={setName}
              onEnter={start}
              label={t("Как тебя зовут? (можно пропустить)", "Isming nima? (oʻtkazib yuborsa boʻladi)")}
            />
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <Button variant="secondary" size="lg" aria-label={t("Назад", "Orqaga")} onClick={() => setStep(0)}>
                ←
              </Button>
              <Button size="lg" onClick={start}>
                {t("Поехали! 🚀", "Ketdik! 🚀")}
              </Button>
            </div>
            <p className="text-sm text-muted">
              {t(
                "Возраст и имя можно указать позже: их меняют родители в своём разделе.",
                "Yosh va ismni keyinroq ham kiritish mumkin: ularni ota-onalar oʻz boʻlimida oʻzgartiradi.",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
