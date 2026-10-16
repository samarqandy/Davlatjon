"use client";

import Link from "next/link";
import { Button, cn, ProgressBar } from "@/components/ui";
import type { ChessTest } from "@/content/chess/types";
import { useTitleTranslation } from "@/lib/docTitle";
import { useT } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import type { AppState } from "@/lib/state";
import { useChess } from "@/lib/useChess";
import { setHash, useHash } from "@/lib/useHash";
import { ChessExerciseView } from "./ChessExercises";

/** Результат: решено с первой попытки (балл), решено с ошибками, не решено. */
export type ItemMark = "perfect" | "retry" | "open";

export function markOf(state: AppState, id: string): ItemMark {
  const p = state.chess[id];
  if (!p?.solvedAt) return "open";
  return p.misses === 0 ? "perfect" : "retry";
}

export function testScore(state: AppState, test: ChessTest): { score: number; done: number; total: number } {
  const marks = test.exercises.map((e) => markOf(state, e.id));
  return {
    score: marks.filter((m) => m === "perfect").length,
    done: marks.filter((m) => m !== "open").length,
    total: marks.length,
  };
}

/** Звёзды за результат: 10 из 12 — три, 8 — две, 6 — одна. */
export function starsFor(score: number): number {
  return score >= 10 ? 3 : score >= 8 ? 2 : score >= 6 ? 1 : 0;
}

function parseHash(hash: string, tests: ChessTest[]): { test: ChessTest | null; index: number | null } {
  const m = hash.match(/^#(test-\d+)(?:-(\d+))?$/);
  const test = m ? (tests.find((x) => x.id === m[1]) ?? null) : null;
  if (!m || !test) return { test: null, index: null };
  return { test, index: m[2] ? Math.min(Math.max(Number(m[2]), 1), test.exercises.length) - 1 : null };
}

export function ChessTests() {
  const { tests } = useChess();
  const t = useT();
  const hash = useHash();
  const { test, index } = parseHash(hash, tests);
  useTitleTranslation("Контрольные тесты", t("Контрольные тесты", "Nazorat testlari"));
  return <div className="space-y-6">{test ? <TestRun test={test} index={index} /> : <Overview />}</div>;
}

function Stars({ n }: { n: number }) {
  const t = useT();
  return (
    <span aria-label={t(`Звёзд: ${n} из 3`, `Yulduzlar: 3 tadan ${n} tasi`)} data-stars={n}>
      {"⭐".repeat(n)}
      {"☆".repeat(3 - n)}
    </span>
  );
}

function Overview() {
  const t = useT();
  const { tests } = useChess();
  const state = useStore((s) => s);
  return (
    <>
      <Link href="/chess" className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        {t("← Шахматная школа", "← Shaxmat maktabi")}
      </Link>
      <header className="rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-6 text-white shadow-lift sm:p-8">
        <h1 className="text-3xl font-black sm:text-4xl">📝 {t("Контрольные тесты", "Nazorat testlari")}</h1>
        <p className="mt-3 text-lg text-white/90">
          {t(
            "Три теста по двенадцать вопросов. Подсказок нет. Балл даётся за ответ с первой попытки, но ошибиться можно: правильный ответ всё равно нужно найти.",
            "Oʻn ikki savoldan iborat uchta test. Maslahatlar yoʻq. Ball birinchi urinishdagi javob uchun beriladi, lekin xato qilsa boʻladi: baribir toʻgʻri javobni topish kerak.",
          )}
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-3" aria-label={t("Тесты", "Testlar")}>
        {tests.map((test) => {
          const r = testScore(state, test);
          return (
            <button
              key={test.id}
              type="button"
              data-chess-test={test.id}
              onClick={() => setHash(`#${test.id}`)}
              className="rounded-3xl bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <p className="text-4xl" aria-hidden>
                {test.emoji}
              </p>
              <h2 className="mt-2 text-xl font-black">{test.title}</h2>
              <p className="mt-1 text-sm text-muted">{test.intro}</p>
              <div className="mt-4 flex items-center gap-3">
                <ProgressBar value={r.done} max={r.total} className="flex-1" />
                <span className="text-sm font-extrabold whitespace-nowrap">
                  {r.done === r.total ? (
                    <>
                      {r.score}/{r.total} <Stars n={starsFor(r.score)} />
                    </>
                  ) : (
                    `${r.done} / ${r.total}`
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </section>
    </>
  );
}

function TestRun({ test, index }: { test: ChessTest; index: number | null }) {
  const t = useT();
  const state = useStore((s) => s);
  const r = testScore(state, test);
  const firstOpen = test.exercises.findIndex((e) => markOf(state, e.id) === "open");
  const finished = firstOpen === -1;
  // Без номера в адресе — следующий нерешённый вопрос; после последнего — итог.
  const current = index ?? (finished ? null : firstOpen);

  const go = (i: number | null) => {
    setHash(i === null ? `#${test.id}` : `#${test.id}-${i + 1}`, { keepScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setHash("#")}
        className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
      >
        {t("← Все тесты", "← Barcha testlar")}
      </button>
      <header className="rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-5 text-white shadow-lift sm:p-7">
        <h1 className="text-2xl leading-tight font-black sm:text-3xl">
          {test.emoji} {test.title}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={r.done} max={r.total} className="flex-1 bg-white/20" />
          <span className="text-sm font-extrabold whitespace-nowrap">{`${r.done} / ${r.total}`}</span>
        </div>
      </header>

      <div className="flex flex-wrap gap-1.5" aria-label={t("Вопросы теста", "Test savollari")}>
        {test.exercises.map((e, i) => {
          const mark = markOf(state, e.id);
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => go(i)}
              aria-label={t(
                `Вопрос ${i + 1}${mark === "perfect" ? " (верно с первой попытки)" : mark === "retry" ? " (решён с ошибками)" : ""}`,
                `${i + 1}-savol${mark === "perfect" ? " (birinchi urinishda toʻgʻri)" : mark === "retry" ? " (xatolar bilan yechilgan)" : ""}`,
              )}
              aria-current={i === current ? "step" : undefined}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center rounded-xl border-2 px-2 text-base font-black transition",
                i === current
                  ? "border-brand bg-brand text-white"
                  : mark === "perfect"
                    ? "border-mint/50 bg-mint-soft text-[#065f46]"
                    : mark === "retry"
                      ? "border-sun/60 bg-sun-soft text-[#7a4b00]"
                      : "border-line bg-white hover:border-brand/40",
              )}
            >
              {mark === "perfect" && i !== current ? "✓" : i + 1}
            </button>
          );
        })}
      </div>

      {current === null ? (
        <section className="rounded-3xl bg-white p-6 text-center shadow-card" data-test-result={r.score}>
          <p className="text-5xl" aria-hidden>
            {starsFor(r.score) === 3 ? "🏆" : starsFor(r.score) > 0 ? "🎉" : "🌱"}
          </p>
          <h2 className="mt-2 text-3xl font-black">
            {t(`${r.score} из ${r.total}`, `${r.total} tadan ${r.score} tasi`)}
          </h2>
          <p className="mt-1 text-4xl">
            <Stars n={starsFor(r.score)} />
          </p>
          <p className="mt-3 text-lg text-muted">
            {r.score >= 10
              ? t("Отличный результат!", "Ajoyib natija!")
              : r.score >= 6
                ? t(
                    "Хорошо! Вопросы, где были ошибки, помечены жёлтым — вернись к ним и посмотри объяснение.",
                    "Yaxshi! Xato qilingan savollar sariq rangda — ularga qaytib, izohni koʻrib chiq.",
                  )
                : t(
                    "Это только начало. Повтори уроки и загляни в вопросы, где были ошибки.",
                    "Bu endi boshlanishi. Darslarni takrorla va xato qilingan savollarga qaytib koʻr.",
                  )}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button variant="secondary" onClick={() => setHash("#")}>
              {t("Все тесты", "Barcha testlar")}
            </Button>
          </div>
        </section>
      ) : (
        <section aria-label={t("Вопрос", "Savol")} className="space-y-4">
          <div className="rounded-3xl bg-paper p-1 sm:p-2">
            <ChessExerciseView key={test.exercises[current].id} exercise={test.exercises[current]} test />
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button variant="secondary" onClick={() => go(current - 1)} disabled={current === 0}>
              {t("← Назад", "← Orqaga")}
            </Button>
            {markOf(state, test.exercises[current].id) !== "open" && (
              <Button onClick={() => go(current < test.exercises.length - 1 ? current + 1 : null)} data-test-next>
                {current < test.exercises.length - 1 ? t("Дальше →", "Keyingisi →") : t("Результат →", "Natija →")}
              </Button>
            )}
          </div>
        </section>
      )}
    </>
  );
}
