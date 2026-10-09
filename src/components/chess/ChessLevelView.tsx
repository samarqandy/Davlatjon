"use client";

import Link from "next/link";
import { useState } from "react";
import { RichText } from "@/components/RichText";
import { Button, ButtonLink, cn, ProgressBar } from "@/components/ui";
import { CHESS_LEVELS, chessLevelHref } from "@/content/chess";
import { chessImagesIn } from "@/content/chess/content";
import type { ChessLevel } from "@/content/chess/types";
import { certificateHref } from "@/lib/certificate";
import { levelStatuses } from "@/lib/chessProgress";
import { useTitleTranslation } from "@/lib/docTitle";
import { useLang, useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { useHydrated, useStore } from "@/lib/store";
import { useChess, useChessImage } from "@/lib/useChess";
import { setHash, useHash } from "@/lib/useHash";
import { PieceIcon } from "./ChessBoard";
import { Figure, Portrait } from "./Figure";
import { ListenButton } from "@/components/ListenButton";
import { VOICE_CLIPS } from "@/lib/voice";
import { ChessExerciseView } from "./ChessExercises";
import { ChessLesson } from "./ChessLesson";

type Tab = "lesson" | "exercises" | "dictionary";

function parseHash(hash: string, total: number): { tab: Tab; exercise: number } {
  const m = hash.match(/^#exercise-(\d+)$/);
  if (m) return { tab: "exercises", exercise: Math.min(Math.max(Number(m[1]), 1), total) - 1 };
  if (hash === "#exercises") return { tab: "exercises", exercise: 0 };
  if (hash === "#dictionary") return { tab: "dictionary", exercise: 0 };
  return { tab: "lesson", exercise: 0 };
}

export function ChessLevelView({ levelId }: { levelId: string }) {
  const t = useT();
  const lang = useLang();
  const { levels } = useChess();
  const index = levels.findIndex((l) => l.id === levelId);
  const level = levels[index];
  // Заголовок вкладки «Шахматы · Пешка» → «Shaxmat · Piyoda».
  useTitleTranslation(CHESS_LEVELS[index].name, level.name);
  const state = useStore((s) => s);
  const statuses = levelStatuses(levels, state);
  const status = statuses[index];
  const hash = useHash();
  const { tab, exercise } = parseHash(hash, level.exercises.length);
  const prev = levels[index - 1];
  const next = levels[index + 1];
  const solvedIds = new Set(level.exercises.filter((e) => state.chess[e.id]?.solvedAt).map((e) => e.id));

  const goExercise = (i: number) => {
    setHash(`#exercise-${i + 1}`, { keepScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        {t("← Шахматная школа", "← Shaxmat maktabi")}
      </Link>

      <header className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-5 text-white shadow-lift sm:p-7">
        <div className="flex items-center gap-4">
          <PieceIcon
            piece={level.piece}
            className="h-20 w-20 shrink-0 rounded-3xl bg-[#f0d9b5] p-1.5 sm:h-24 sm:w-24"
          />
          <div className="min-w-0">
            <p className="text-sm font-extrabold tracking-wide text-white/70 uppercase">
              {t(`Уровень ${level.order} из ${levels.length}`, `${level.order}-daraja, jami ${levels.length} ta`)}
            </p>
            <h1 className="text-3xl leading-tight font-black sm:text-4xl">{level.name}</h1>
            {lang === "uz" ? (
              // Узбекское название уже в заголовке — подсказка «o‘zbekcha: …» не нужна.
              <p className="text-base font-bold text-white/80">{level.title}</p>
            ) : (
              <p className="text-base font-bold text-white/80">
                o‘zbekcha: <span lang="uz">{level.uz}</span> · {level.title}
              </p>
            )}
          </div>
        </div>
        <p className="mt-4 text-lg text-white/90">{level.goal}</p>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={status.solved} max={status.total} className="flex-1 bg-white/20" />
          <span className="text-sm font-extrabold whitespace-nowrap">
            {t(`${status.solved} из ${status.total}`, `${status.solved} / ${status.total}`)}
          </span>
        </div>
      </header>

      {!status.unlocked ? (
        <LockedLevel prev={prev} level={level} need={index > 0 ? statuses[index - 1].need : 0} />
      ) : (
        <>
          {status.passed && <RankEarned level={level} next={next} />}

          <nav
            className="grid grid-cols-3 gap-1.5 rounded-2xl bg-white p-1.5 shadow-card"
            aria-label={t("Разделы уровня", "Daraja boʻlimlari")}
          >
            {(
              [
                ["lesson", t("📖 Урок", "📖 Dars"), "#lesson"],
                [
                  "exercises",
                  t(`🎯 Упражнения ${status.solved}/${status.total}`, `🎯 Mashqlar ${status.solved}/${status.total}`),
                  "#exercises",
                ],
                ["dictionary", t("📚 Словарик и факты", "📚 Lugʻat va faktlar"), "#dictionary"],
              ] as const
            ).map(([id, label, href]) => (
              <button
                key={id}
                type="button"
                onClick={() => setHash(href, { keepScroll: true })}
                aria-current={tab === id ? "page" : undefined}
                className={cn(
                  "rounded-xl px-2 py-2.5 text-sm leading-tight font-extrabold transition sm:px-4 sm:text-base",
                  tab === id ? "bg-brand text-white" : "text-muted hover:bg-brand-soft hover:text-brand-dark",
                )}
              >
                {label}
              </button>
            ))}
          </nav>

          {tab === "lesson" && (
            <>
              <LevelLegend level={level} />
              <ChessLesson levelId={level.id} cards={level.lesson} onDone={() => goExercise(0)} />
            </>
          )}

          {tab === "exercises" && (
            <section className="space-y-4" aria-label={t("Упражнения", "Mashqlar")}>
              <div className="flex flex-wrap gap-1.5">
                {level.exercises.map((e, i) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => goExercise(i)}
                    aria-label={t(
                      `Упражнение ${i + 1}: ${e.title}${solvedIds.has(e.id) ? " (решено)" : ""}`,
                      `${i + 1}-mashq: ${e.title}${solvedIds.has(e.id) ? " (yechilgan)" : ""}`,
                    )}
                    aria-current={i === exercise ? "step" : undefined}
                    className={cn(
                      "flex h-11 min-w-11 items-center justify-center rounded-xl border-2 px-2 text-base font-black transition",
                      i === exercise
                        ? "border-brand bg-brand text-white"
                        : solvedIds.has(e.id)
                          ? "border-mint/50 bg-mint-soft text-[#065f46]"
                          : "border-line bg-white hover:border-brand/40",
                    )}
                  >
                    {solvedIds.has(e.id) && i !== exercise ? "✓" : i + 1}
                  </button>
                ))}
              </div>
              <div className="rounded-3xl bg-paper p-1 sm:p-2">
                <ChessExerciseView key={level.exercises[exercise].id} exercise={level.exercises[exercise]} />
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button variant="secondary" onClick={() => goExercise(exercise - 1)} disabled={exercise === 0}>
                  {t("← Назад", "← Orqaga")}
                </Button>
                {exercise < level.exercises.length - 1 ? (
                  <Button onClick={() => goExercise(exercise + 1)}>
                    {t("Следующее упражнение →", "Keyingi mashq →")}
                  </Button>
                ) : next && status.passed ? (
                  <ButtonLink href={chessLevelHref(next.id)}>
                    {t(`Следующий уровень: ${next.name} →`, `Keyingi daraja: ${next.name} →`)}
                  </ButtonLink>
                ) : null}
              </div>
            </section>
          )}

          {tab === "dictionary" && <Dictionary level={level} />}

          <Extras levelId={level.id} />
        </>
      )}
    </div>
  );
}

/** Легенда уровня: вопрос-крючок, история с картинкой и «тайна», которую открывают нажатием. */
function LevelLegend({ level }: { level: ChessLevel }) {
  const [revealed, setRevealed] = useState(false);
  const hydrated = useHydrated();
  const t = useT();
  const lang = useLang();
  const img = useChessImage(level.legend.image);
  return (
    <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="legend-h">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-extrabold tracking-wide text-brand uppercase">
          {t("🔮 Легенда уровня", "🔮 Daraja afsonasi")}
        </p>
        <ListenButton src={VOICE_CLIPS.legend(level.id, lang)} label={t("Послушать легенду", "Afsonani tinglash")} />
      </div>
      <h2 id="legend-h" className="mt-1 text-2xl leading-snug font-black">
        {level.legend.hook}
      </h2>
      <div className="mt-3 gap-5 sm:flex sm:items-start">
        <div className="min-w-0 flex-1 space-y-2 text-lg leading-relaxed">
          <p className="font-black text-brand-dark">{level.legend.title}</p>
          {level.legend.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {hydrated && revealed ? (
            <p className="rounded-2xl bg-sun-soft px-4 py-3 font-semibold" aria-live="polite">
              🗝️ <b>{t("Тайна уровня.", "Daraja siri.")}</b> {level.legend.secret}
            </p>
          ) : (
            <Button variant="sun" size="sm" onClick={() => setRevealed(true)}>
              {t("🗝️ Открыть тайну уровня", "🗝️ Daraja sirini ochish")}
            </Button>
          )}
        </div>
        {img && (
          <Figure image={img} className="mt-4 sm:mt-0 sm:w-64 sm:shrink-0" sizes="(max-width: 640px) 100vw, 256px" />
        )}
      </div>
    </section>
  );
}

function LockedLevel({ prev, level, need }: { prev: ChessLevel | undefined; level: ChessLevel; need: number }) {
  const t = useT();
  return (
    <section className="rounded-3xl border-2 border-dashed border-line bg-white p-6 text-center shadow-card">
      <p className="text-5xl" aria-hidden>
        🔒
      </p>
      <h2 className="mt-2 text-2xl font-black">{t("Этот уровень пока закрыт", "Bu daraja hozircha yopiq")}</h2>
      <p className="mt-2 text-lg font-bold text-brand-dark">
        {t("Здесь ты узнаешь", "Bu yerda bilib olasan")}: {level.legend.hook}
      </p>
      {prev && (
        <p className="mt-2 text-lg text-muted">
          {t(
            `Он откроется, когда ты решишь ${pluralize(need, "упражнение", "упражнения", "упражнений")} уровня «${prev.name}».`,
            `«${prev.name}» darajasida ${need} ta mashq yechsang ochiladi.`,
          )}
        </p>
      )}
      {prev && (
        <ButtonLink href={chessLevelHref(prev.id)} className="mt-4">
          {t(`К уровню «${prev.name}»`, `«${prev.name}» darajasiga oʻtish`)}
        </ButtonLink>
      )}
    </section>
  );
}

function RankEarned({ level, next }: { level: ChessLevel; next: ChessLevel | undefined }) {
  const t = useT();
  return (
    <section className="flex flex-wrap items-center gap-4 rounded-3xl border-2 border-sun/50 bg-sun-soft p-5">
      <span className="text-5xl" aria-hidden>
        🏅
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-black">
          {t(`Звание «${level.name}» получено!`, `«${level.name}» unvonini olding!`)}
        </p>
        <p className="font-semibold text-[#7a4b00]">
          {next
            ? t(`Теперь открыт уровень «${next.name}».`, `Endi «${next.name}» darajasi ochildi.`)
            : t(
                "Вся шахматная школа пройдена. Настоящий король! 👑",
                "Butun shaxmat maktabini tamomlading. Haqiqiy shoh! 👑",
              )}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <ButtonLink href={certificateHref(level.id)} variant="sun" data-certificate-link>
          🏅 {t("Сертификат", "Sertifikat")}
        </ButtonLink>
        {next && (
          <ButtonLink href={chessLevelHref(next.id)}>
            {t(`Уровень «${next.name}» →`, `«${next.name}» darajasi →`)}
          </ButtonLink>
        )}
      </div>
    </section>
  );
}

function Dictionary({ level }: { level: ChessLevel }) {
  const t = useT();
  const lang = useLang();
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-3xl bg-white p-5 shadow-card">
        <h3 className="text-xl font-black">{t("📏 Правила", "📏 Qoidalar")}</h3>
        <ul className="mt-3 space-y-2">
          {level.rules.map((r) => (
            <li key={r} className="flex gap-2 text-lg">
              <span className="text-brand" aria-hidden>
                •
              </span>
              <span>
                <RichText text={r} />
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-3xl bg-white p-5 shadow-card">
        <h3 className="text-xl font-black">{t("🔤 Словарик", "🔤 Lugʻat")}</h3>
        <dl className="mt-3 space-y-3">
          {level.terms.map((term, i) => (
            <div key={i}>
              <dt className="text-lg font-black">
                {term.term}
                {/* По-узбекски термин уже узбекский — ярлычок с узбекским названием нужен только русскому тексту. */}
                {term.uz && lang === "ru" && (
                  <span
                    lang="uz"
                    className="ml-2 rounded-lg bg-brand-soft px-2 py-0.5 text-sm font-extrabold text-brand-dark"
                  >
                    {term.uz}
                  </span>
                )}
              </dt>
              <dd className="text-muted">{term.text}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="rounded-3xl bg-white p-5 shadow-card lg:col-span-2">
        <h3 className="text-xl font-black">{t("💡 Интересные факты", "💡 Qiziqarli faktlar")}</h3>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {level.facts.map((f) => (
            <li key={f} className="rounded-2xl bg-sun-soft/60 p-4 font-semibold">
              {f}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** Что ещё открывает уровень: игра, задачи, дебюты и партии из других разделов школы. */
function Extras({ levelId }: { levelId: ChessLevel["id"] }) {
  const t = useT();
  const lang = useLang();
  const { extras, openings: allOpenings, games: allGames } = useChess();
  const x = extras[levelId];
  const openings = (x.openings ?? []).map((id) => allOpenings.find((o) => o.id === id)).filter((o) => o !== undefined);
  const games = (x.games ?? []).map((id) => allGames.find((g) => g.id === id)).filter((g) => g !== undefined);
  const card = "flex flex-col gap-1 rounded-2xl bg-white p-4 shadow-card";
  const link = "text-sm font-extrabold text-brand hover:underline";
  return (
    <section className="space-y-3" aria-labelledby="extras">
      <h2 id="extras" className="text-xl font-black">
        {t("🎮 Что ещё есть на этом уровне", "🎮 Bu darajada yana nimalar bor")}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {x.play && (
          <div className={card}>
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">{t("Играть", "Oʻynash")}</p>
            <p className="font-black">{x.play.label}</p>
            <p className="flex-1 text-sm text-muted">{x.play.about}</p>
            <Link href={x.play.href} className={link}>
              {t("Открыть доску →", "Taxtani ochish →")}
            </Link>
          </div>
        )}
        {x.puzzles && x.puzzles.length > 0 && (
          <div className={card}>
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">{t("Задачи", "Masalalar")}</p>
            {x.puzzles.map((p) => (
              <Link key={p.theme} href={`/chess/puzzles#theme-${p.theme}`} className={link}>
                {p.label} →
              </Link>
            ))}
          </div>
        )}
        {openings.length > 0 && (
          <div className={card}>
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">{t("Дебюты", "Debyutlar")}</p>
            {openings.map((o) => (
              <Link key={o.id} href={`/chess/openings#open-${o.id}`} className={link}>
                {o.name} →
              </Link>
            ))}
          </div>
        )}
        {games.length > 0 && (
          <div className={card}>
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
              {t("Знаменитые партии", "Mashhur partiyalar")}
            </p>
            {games.map((g) => {
              const face = chessImagesIn(lang, g.pictures).find((i) => i.kind === "person");
              return (
                <Link key={g.id} href={`/chess/games/${g.id}`} className={`${link} flex items-center gap-2`}>
                  {face && <Portrait image={face} size={32} />}
                  <span>{g.title} →</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
