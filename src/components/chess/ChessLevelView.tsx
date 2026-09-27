"use client";

import Link from "next/link";
import { useState } from "react";
import { RichText } from "@/components/RichText";
import { Button, ButtonLink, cn, ProgressBar } from "@/components/ui";
import { CHESS_LEVELS, LEVEL_EXTRAS, chessLevelHref } from "@/content/chess";
import { FAMOUS_GAMES } from "@/content/chess/games";
import { chessImage, chessImages } from "@/content/chess/images";
import { OPENINGS } from "@/content/chess/openings";
import type { ChessLevel } from "@/content/chess/types";
import { levelStatuses } from "@/lib/chessProgress";
import { useHydrated, useStore } from "@/lib/store";
import { setHash, useHash } from "@/lib/useHash";
import { PieceIcon } from "./ChessBoard";
import { Figure, Portrait } from "./Figure";
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
  const index = CHESS_LEVELS.findIndex((l) => l.id === levelId);
  const level = CHESS_LEVELS[index];
  const state = useStore((s) => s);
  const statuses = levelStatuses(CHESS_LEVELS, state);
  const status = statuses[index];
  const hash = useHash();
  const { tab, exercise } = parseHash(hash, level.exercises.length);
  const prev = CHESS_LEVELS[index - 1];
  const next = CHESS_LEVELS[index + 1];
  const solvedIds = new Set(level.exercises.filter((e) => state.chess[e.id]?.solvedAt).map((e) => e.id));

  const goExercise = (i: number) => {
    setHash(`#exercise-${i + 1}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← Шахматная школа
      </Link>

      <header className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-5 text-white shadow-lift sm:p-7">
        <div className="flex items-center gap-4">
          <PieceIcon
            piece={level.piece}
            className="h-20 w-20 shrink-0 rounded-3xl bg-[#f0d9b5] p-1.5 sm:h-24 sm:w-24"
          />
          <div className="min-w-0">
            <p className="text-sm font-extrabold tracking-wide text-white/70 uppercase">
              Уровень {level.order} из {CHESS_LEVELS.length}
            </p>
            <h1 className="text-3xl leading-tight font-black sm:text-4xl">{level.name}</h1>
            <p className="text-base font-bold text-white/80">
              o‘zbekcha: <span lang="uz">{level.uz}</span> · {level.title}
            </p>
          </div>
        </div>
        <p className="mt-4 text-lg text-white/90">{level.goal}</p>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={status.solved} max={status.total} className="flex-1 bg-white/20" />
          <span className="text-sm font-extrabold whitespace-nowrap">
            {status.solved} из {status.total}
          </span>
        </div>
      </header>

      {!status.unlocked ? (
        <LockedLevel prev={prev} level={level} />
      ) : (
        <>
          {status.passed && <RankEarned level={level} next={next} />}

          <nav className="grid grid-cols-3 gap-1.5 rounded-2xl bg-white p-1.5 shadow-card" aria-label="Разделы уровня">
            {(
              [
                ["lesson", "📖 Урок", "#lesson"],
                ["exercises", `🎯 Упражнения ${status.solved}/${status.total}`, "#exercises"],
                ["dictionary", "📚 Словарик и факты", "#dictionary"],
              ] as const
            ).map(([id, label, href]) => (
              <button
                key={id}
                type="button"
                onClick={() => setHash(href)}
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
            <section className="space-y-4" aria-label="Упражнения">
              <div className="flex flex-wrap gap-1.5">
                {level.exercises.map((e, i) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => goExercise(i)}
                    aria-label={`Упражнение ${i + 1}: ${e.title}${solvedIds.has(e.id) ? " (решено)" : ""}`}
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
                  ← Назад
                </Button>
                {exercise < level.exercises.length - 1 ? (
                  <Button onClick={() => goExercise(exercise + 1)}>Следующее упражнение →</Button>
                ) : next && status.passed ? (
                  <ButtonLink href={chessLevelHref(next.id)}>Следующий уровень: {next.name} →</ButtonLink>
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
  const img = level.legend.image ? chessImage(level.legend.image) : undefined;
  return (
    <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="legend-h">
      <p className="text-xs font-extrabold tracking-wide text-brand uppercase">🔮 Легенда уровня</p>
      <h2 id="legend-h" className="mt-1 text-2xl leading-snug font-black">
        {level.legend.hook}
      </h2>
      <div className="mt-3 gap-5 sm:flex sm:items-start">
        <div className="min-w-0 flex-1 space-y-2 text-lg leading-relaxed">
          <p className="font-black text-brand-dark">{level.legend.title}</p>
          {level.legend.story.map((t) => (
            <p key={t}>{t}</p>
          ))}
          {hydrated && revealed ? (
            <p className="rounded-2xl bg-sun-soft px-4 py-3 font-semibold" aria-live="polite">
              🗝️ <b>Тайна уровня.</b> {level.legend.secret}
            </p>
          ) : (
            <Button variant="sun" size="sm" onClick={() => setRevealed(true)}>
              🗝️ Открыть тайну уровня
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

function LockedLevel({ prev, level }: { prev: ChessLevel | undefined; level: ChessLevel }) {
  return (
    <section className="rounded-3xl border-2 border-dashed border-line bg-white p-6 text-center shadow-card">
      <p className="text-5xl" aria-hidden>
        🔒
      </p>
      <h2 className="mt-2 text-2xl font-black">Этот уровень пока закрыт</h2>
      <p className="mt-2 text-lg font-bold text-brand-dark">Здесь ты узнаешь: {level.legend.hook}</p>
      {prev && (
        <p className="mt-2 text-lg text-muted">
          Он откроется, когда ты получишь звание «{prev.name}»: реши все упражнения предыдущего уровня.
        </p>
      )}
      {prev && (
        <ButtonLink href={chessLevelHref(prev.id)} className="mt-4">
          К уровню «{prev.name}»
        </ButtonLink>
      )}
    </section>
  );
}

function RankEarned({ level, next }: { level: ChessLevel; next: ChessLevel | undefined }) {
  return (
    <section className="flex flex-wrap items-center gap-4 rounded-3xl border-2 border-sun/50 bg-sun-soft p-5">
      <span className="text-5xl" aria-hidden>
        🏅
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-black">Звание «{level.name}» получено!</p>
        <p className="font-semibold text-[#7a4b00]">
          {next ? `Теперь открыт уровень «${next.name}».` : "Ты прошёл всю шахматную школу. Настоящий король! 👑"}
        </p>
      </div>
      {next && <ButtonLink href={chessLevelHref(next.id)}>Уровень «{next.name}» →</ButtonLink>}
    </section>
  );
}

function Dictionary({ level }: { level: ChessLevel }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-3xl bg-white p-5 shadow-card">
        <h3 className="text-xl font-black">📏 Правила</h3>
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
        <h3 className="text-xl font-black">🔤 Словарик</h3>
        <dl className="mt-3 space-y-3">
          {level.terms.map((t) => (
            <div key={t.term}>
              <dt className="text-lg font-black">
                {t.term}
                {t.uz && (
                  <span
                    lang="uz"
                    className="ml-2 rounded-lg bg-brand-soft px-2 py-0.5 text-sm font-extrabold text-brand-dark"
                  >
                    {t.uz}
                  </span>
                )}
              </dt>
              <dd className="text-muted">{t.text}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="rounded-3xl bg-white p-5 shadow-card lg:col-span-2">
        <h3 className="text-xl font-black">💡 Интересные факты</h3>
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
  const x = LEVEL_EXTRAS[levelId];
  const openings = (x.openings ?? []).map((id) => OPENINGS.find((o) => o.id === id)).filter((o) => o !== undefined);
  const games = (x.games ?? []).map((id) => FAMOUS_GAMES.find((g) => g.id === id)).filter((g) => g !== undefined);
  const card = "flex flex-col gap-1 rounded-2xl bg-white p-4 shadow-card";
  const link = "text-sm font-extrabold text-brand hover:underline";
  return (
    <section className="space-y-3" aria-labelledby="extras">
      <h2 id="extras" className="text-xl font-black">
        🎮 Что ещё есть на этом уровне
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {x.play && (
          <div className={card}>
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">Играть</p>
            <p className="font-black">{x.play.label}</p>
            <p className="flex-1 text-sm text-muted">{x.play.about}</p>
            <Link href={x.play.href} className={link}>
              Открыть доску →
            </Link>
          </div>
        )}
        {x.puzzles && x.puzzles.length > 0 && (
          <div className={card}>
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">Задачи</p>
            {x.puzzles.map((p) => (
              <Link key={p.theme} href={`/chess/puzzles#theme-${p.theme}`} className={link}>
                {p.label} →
              </Link>
            ))}
          </div>
        )}
        {openings.length > 0 && (
          <div className={card}>
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">Дебюты</p>
            {openings.map((o) => (
              <Link key={o.id} href={`/chess/openings#open-${o.id}`} className={link}>
                {o.name} →
              </Link>
            ))}
          </div>
        )}
        {games.length > 0 && (
          <div className={card}>
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">Знаменитые партии</p>
            {games.map((g) => {
              const face = chessImages(g.pictures).find((i) => i.kind === "person");
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
