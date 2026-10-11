"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mascot } from "@/components/Mascot";
import { Button, ButtonLink, ProgressBar, cn } from "@/components/ui";
import { useTitleTranslation } from "@/lib/docTitle";
import { useLang, useT } from "@/lib/i18n";
import {
  QUICK_COUNT,
  QUICK_PASS,
  defaultDeck,
  makeQuiz,
  quickKey,
  quickLevel,
  quickStars,
  type Deck,
  type Question,
  type QuestionKind,
} from "@/lib/quick";
import { playSfx } from "@/lib/sfx";
import { QUICK_PROMPT_CLIPS, VOICE_CLIPS, playClip, soundOn } from "@/lib/voice";
import { ListenButton } from "@/components/ListenButton";
import { isoDay, quickRecord, useHydrated, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";
import { showsNumbers } from "@/lib/workshop";

/** Какая запись произносит вопрос: примеры на «сколько будет» делят одну. */
const PROMPT_CLIP: Record<QuestionKind, (typeof QUICK_PROMPT_CLIPS)[number]> = {
  add: "quick-how-many",
  sub: "quick-how-many",
  times: "quick-how-many",
  div: "quick-how-many",
  missing: "quick-missing",
  compare: "quick-compare",
  next: "quick-next",
  count: "quick-count",
  more: "quick-more",
  pattern: "quick-pattern",
  odd: "quick-odd",
  bigger: "quick-bigger",
};

const PROMPTS: Record<QuestionKind, { ru: string; uz: string }> = {
  add: { ru: "Сколько будет?", uz: "Nechta boʻladi?" },
  sub: { ru: "Сколько будет?", uz: "Nechta boʻladi?" },
  times: { ru: "Сколько будет?", uz: "Nechta boʻladi?" },
  div: { ru: "Сколько будет?", uz: "Nechta boʻladi?" },
  missing: { ru: "Какое число пропущено?", uz: "Qaysi son tushib qolgan?" },
  compare: { ru: "Выбери знак", uz: "Belgini tanla" },
  next: { ru: "Какое число дальше?", uz: "Keyingi son qaysi?" },
  count: { ru: "Сколько всего?", uz: "Hammasi nechta?" },
  more: { ru: "Где больше?", uz: "Qayerda koʻp?" },
  pattern: { ru: "Что дальше?", uz: "Keyin nima?" },
  odd: { ru: "Найди лишнее", uz: "Ortiqchasini top" },
  bigger: { ru: "Какое число больше?", uz: "Qaysi son katta?" },
};

type Phase =
  | { name: "idle" }
  | { name: "play"; quiz: Question[]; i: number; score: number; picked: number | null }
  | { name: "done"; score: number };

/** «Быстрые примеры»: десять вопросов подряд, ответ — нажатием на крупный вариант. */
export function QuickView() {
  const t = useT();
  const hydrated = useHydrated();
  useTitleTranslation("Быстрые примеры", "Tez mashq");
  const age = useStore((s) => s.settings.age);
  const numbers = useStore((s) => showsNumbers(s.settings.age));
  const best = useStore((s) => s.quick);
  const [chosen, setChosen] = useState<Deck | null>(null);
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const deck = chosen ?? defaultDeck(age);
  const level = quickLevel(deck, age);

  const start = () =>
    setPhase({ name: "play", quiz: makeQuiz(deck, level, Date.now() % 2_147_483_647), i: 0, score: 0, picked: null });

  const pick = (index: number) => {
    if (phase.name !== "play" || phase.picked !== null) return;
    const right = index === phase.quiz[phase.i].answer;
    if (right) playSfx("collect");
    setPhase({ ...phase, picked: index, score: phase.score + (right ? 1 : 0) });
  };

  // Ответ виден секунду-две, потом — следующий вопрос или итог.
  const picked = phase.name === "play" ? phase.picked : null;
  useEffect(() => {
    if (phase.name !== "play" || picked === null) return;
    const right = picked === phase.quiz[phase.i].answer;
    const timer = setTimeout(
      () => {
        if (phase.i + 1 >= phase.quiz.length) {
          quickRecord(isoDay(Date.now()), deck, phase.score);
          setPhase({ name: "done", score: phase.score });
        } else setPhase({ ...phase, i: phase.i + 1, picked: null });
      },
      right ? 700 : 1600,
    );
    return () => clearTimeout(timer);
  }, [phase, picked, deck]);

  const todayIso = useToday();
  const today = hydrated && todayIso ? best[quickKey(todayIso, deck)] : undefined;

  return (
    <div className="space-y-5">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← {t("На главную", "Bosh sahifaga")}
      </Link>

      {phase.name === "idle" && (
        <section className="space-y-5 rounded-3xl bg-white p-6 shadow-card" data-quick="idle">
          <div className="flex items-center gap-3">
            <Mascot size={72} />
            <div>
              <h1 className="text-3xl font-black">⚡ {t("Быстрые примеры", "Tez mashq")}</h1>
              <p className="text-muted">
                {t(
                  `${QUICK_COUNT} вопросов подряд. Нажимай на ответ — ошибаться можно, правильный ответ покажется.`,
                  `${QUICK_COUNT} ta savol ketma-ket. Javobni bos — xato qilsang, toʻgʻrisi koʻrsatiladi.`,
                )}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3" role="group" aria-label={t("Что решаем", "Nimani yechamiz")}>
            {(["numbers", "little"] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={deck === d}
                data-quick-deck={d}
                onClick={() => setChosen(d)}
                className={cn(
                  "min-h-20 rounded-2xl border-2 px-3 text-lg font-black transition",
                  deck === d ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-brand/40",
                )}
              >
                <span className="block text-3xl" aria-hidden>
                  {d === "numbers" ? "➕" : "🍎"}
                </span>
                {d === "numbers" ? t("Числа", "Sonlar") : t("Картинки", "Rasmlar")}
              </button>
            ))}
          </div>
          {today !== undefined && (
            <p className="rounded-2xl bg-mint-soft px-3 py-2 text-sm font-bold text-[#047857]" data-quick-today>
              {t(
                `Сегодня лучший результат: ${today} из ${QUICK_COUNT}`,
                `Bugungi eng yaxshi natija: ${QUICK_COUNT} tadan ${today} tasi`,
              )}
            </p>
          )}
          <Button size="lg" className="w-full" onClick={start} data-quick-start>
            {t("Поехали! ▶", "Ketdik! ▶")}
          </Button>
        </section>
      )}

      {phase.name === "play" && <Play phase={phase} onPick={pick} autoplay={deck === "little"} />}

      {phase.name === "done" && (
        <section className="space-y-4 rounded-3xl bg-white p-6 text-center shadow-card" data-quick="done">
          <Mascot size={88} className="mx-auto" />
          <h1 className="text-3xl font-black">
            {phase.score >= QUICK_PASS
              ? t("Отлично! 🎉", "Zoʻr! 🎉")
              : phase.score >= 4
                ? t("Хорошая серия!", "Yaxshi seriya!")
                : t("Получится лучше с новой попытки!", "Yangi urinishda yaxshiroq chiqadi!")}
          </h1>
          <p className="text-5xl" aria-label={t("Звёзды", "Yulduzlar")} data-quick-stars={quickStars(phase.score)}>
            {"⭐".repeat(quickStars(phase.score)) || "🌱"}
          </p>
          <p className="text-xl font-black" data-quick-score>
            {t(`${phase.score} из ${QUICK_COUNT}`, `${QUICK_COUNT} tadan ${phase.score} tasi`)}
          </p>
          {phase.score >= QUICK_PASS && numbers && (
            <p className="text-sm font-bold text-muted">
              {t("Серия засчитана: +5 XP (раз в день)", "Seriya hisoblandi: +5 XP (kuniga bir marta)")}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={start} data-quick-again>
              {t("Ещё раз", "Yana bir marta")}
            </Button>
            <ButtonLink href="/" variant="secondary" size="lg">
              {t("На главную", "Bosh sahifaga")}
            </ButtonLink>
          </div>
        </section>
      )}
    </div>
  );
}

function Play({
  phase,
  onPick,
  autoplay,
}: {
  phase: Extract<Phase, { name: "play" }>;
  onPick: (index: number) => void;
  /** Малышам вопрос читается сам, остальным — по кнопке. */
  autoplay: boolean;
}) {
  const t = useT();
  const lang = useLang();
  const q = phase.quiz[phase.i];
  const promptSrc = VOICE_CLIPS.short(PROMPT_CLIP[q.kind], lang);
  useEffect(() => {
    if (autoplay && promptSrc && soundOn()) playClip(promptSrc, "quick-question");
  }, [autoplay, promptSrc, phase.i]);
  const prompt = PROMPTS[q.kind];
  const answered = phase.picked !== null;
  const wide = q.options.length > 4;
  return (
    <section
      className="space-y-5 rounded-3xl bg-white p-5 shadow-card sm:p-6"
      data-quick="play"
      data-quick-kind={q.kind}
    >
      <div className="flex items-center gap-3">
        <ProgressBar value={phase.i + (answered ? 1 : 0)} max={phase.quiz.length} className="flex-1" />
        <span className="text-sm font-black tabular-nums">
          {phase.i + 1}/{phase.quiz.length}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <p className="text-center text-lg font-extrabold text-muted">{t(prompt.ru, prompt.uz)}</p>
        <ListenButton src={promptSrc} label={t("Ещё раз", "Yana")} data-quick-listen />
      </div>
      {q.show && (
        <p className="text-center text-4xl leading-snug font-black break-words sm:text-5xl" data-quick-show>
          {q.show}
        </p>
      )}
      <div
        className={cn("grid gap-3", wide ? "grid-cols-3" : q.options.length === 3 ? "grid-cols-3" : "grid-cols-2")}
        role="group"
        aria-label={t("Варианты ответа", "Javob variantlari")}
      >
        {q.options.map((option, i) => {
          const isRight = i === q.answer;
          const state = !answered ? "idle" : isRight ? "right" : i === phase.picked ? "wrong" : "idle";
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => onPick(i)}
              data-quick-option={i}
              data-quick-result={answered ? (isRight ? "right" : i === phase.picked ? "wrong" : "") : undefined}
              className={cn(
                "min-h-20 rounded-2xl border-2 px-2 text-3xl font-black transition sm:text-4xl",
                state === "right" && "border-mint bg-mint-soft",
                state === "wrong" && "border-rose bg-rose/10",
                state === "idle" && "border-line bg-white enabled:hover:border-brand/50 enabled:active:scale-95",
                answered && state === "idle" && "opacity-50",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      <p className="min-h-6 text-center font-bold" role="status" aria-live="polite">
        {answered &&
          (phase.picked === q.answer
            ? t("Верно! ✓", "Toʻgʻri! ✓")
            : t("Правильный ответ — зелёный", "Toʻgʻri javob — yashil rangda"))}
      </p>
    </section>
  );
}
