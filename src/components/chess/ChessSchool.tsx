"use client";

import Link from "next/link";
import { cn, ProgressBar } from "@/components/ui";
import { CHESS_LEVELS, CHESS_SCHOOL, chessGlossary, chessLevelHref } from "@/content/chess";
import { currentRank, levelStatuses } from "@/lib/chessProgress";
import { useHydrated, useStore } from "@/lib/store";
import { PieceIcon } from "./ChessBoard";

export function ChessSchool() {
  const hydrated = useHydrated();
  const state = useStore((s) => s);
  const statuses = levelStatuses(CHESS_LEVELS, state);
  const rank = hydrated ? currentRank(CHESS_LEVELS, state) : null;
  const solved = statuses.reduce((s, x) => s + x.solved, 0);
  const total = statuses.reduce((s, x) => s + x.total, 0);
  const glossary = chessGlossary();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-6 text-white shadow-lift sm:p-8">
        <div className="absolute -top-6 -right-4 flex gap-2 opacity-20" aria-hidden>
          <PieceIcon piece="bN" className="h-40 w-40" />
        </div>
        <p className="text-lg font-bold text-white/80">♞ Для Давлатжона</p>
        <h1 className="mt-1 text-3xl leading-tight font-black sm:text-4xl">{CHESS_SCHOOL.title}</h1>
        <p className="mt-1 text-xl font-bold text-white/85">{CHESS_SCHOOL.subtitle}</p>
        <p className="mt-3 max-w-2xl text-white/85">{CHESS_SCHOOL.about}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-3xl bg-white/12 p-4 ring-1 ring-white/25">
          {rank ? (
            <>
              <PieceIcon piece={rank.piece} className="h-14 w-14 rounded-2xl bg-[#f0d9b5] p-1" />
              <div>
                <p className="text-sm font-extrabold tracking-wide text-white/70 uppercase">Твоё звание</p>
                <p className="text-2xl font-black">
                  {rank.name} <span className="text-base font-bold text-white/70">· {rank.uz}</span>
                </p>
              </div>
            </>
          ) : (
            <p className="text-lg font-bold">Звания пока нет — начни с уровня «Пешка»!</p>
          )}
          <div className="ml-auto min-w-48 flex-1 sm:max-w-64">
            <p className="text-sm font-bold text-white/80">
              Упражнений решено: {hydrated ? solved : 0} из {total}
            </p>
            <ProgressBar value={hydrated ? solved : 0} max={total} className="mt-1 bg-white/20" />
          </div>
        </div>
      </section>

      <section aria-labelledby="chess-levels">
        <h2 id="chess-levels" className="mb-3 text-2xl font-black">
          Уровни и звания
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHESS_LEVELS.map((level, i) => {
            const st = statuses[i];
            const open = !hydrated || st.unlocked;
            const inner = (
              <>
                <div className="flex items-center gap-3">
                  <PieceIcon
                    piece={level.piece}
                    className={cn("h-16 w-16 shrink-0 rounded-2xl bg-[#f0d9b5] p-1", !open && "opacity-40 grayscale")}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold tracking-wide text-muted uppercase">Уровень {level.order}</p>
                    <p className="text-xl font-black">{level.name}</p>
                    <p lang="uz" className="text-sm font-bold text-muted">
                      {level.uz}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "ml-auto shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold",
                      hydrated && st.passed
                        ? "bg-sun-soft text-[#7a4b00]"
                        : open
                          ? "bg-brand-soft text-brand-dark"
                          : "bg-line/60 text-muted",
                    )}
                  >
                    {hydrated && st.passed ? "🏅 звание" : open ? "открыт" : "🔒 закрыт"}
                  </span>
                </div>
                <p className="mt-3 font-bold">{level.title}</p>
                <p className="mt-1 text-sm text-muted">{level.goal}</p>
                <div className="mt-3 flex items-center gap-2">
                  <ProgressBar value={hydrated ? st.solved : 0} max={st.total} className="flex-1" />
                  <span className="text-xs font-extrabold whitespace-nowrap text-muted">
                    {hydrated ? st.solved : 0} из {st.total}
                  </span>
                </div>
              </>
            );
            return (
              <li key={level.id}>
                {open ? (
                  <Link
                    href={chessLevelHref(level.id)}
                    className="block h-full rounded-3xl border-2 border-transparent bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand/30"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="h-full rounded-3xl border-2 border-dashed border-line bg-white/70 p-4" aria-disabled>
                    {inner}
                    <p className="mt-2 text-xs font-bold text-muted">
                      Откроется после звания «{CHESS_LEVELS[i - 1]?.name}».
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <h2 className="text-xl font-black">🧭 Как заниматься</h2>
          <ul className="mt-3 space-y-2 text-lg">
            <li>📖 Сначала прочитай урок и понажимай на фигуры на доске.</li>
            <li>🎯 Потом реши упражнения. Если трудно — открой подсказку.</li>
            <li>🏅 Решил все упражнения уровня — получаешь звание, и открывается следующий уровень.</li>
            <li>♟ А лучше всего — сыграй партию с папой или мамой!</li>
          </ul>
        </div>
        <details className="group rounded-3xl bg-white p-5 shadow-card">
          <summary className="cursor-pointer text-xl font-black">
            📚 Словарик шахматиста <span className="text-base font-bold text-muted">({glossary.length} слов)</span>
          </summary>
          <dl className="mt-3 space-y-2.5">
            {glossary.map((t) => (
              <div key={t.term}>
                <dt className="font-black">
                  {t.term}
                  {t.uz && (
                    <span lang="uz" className="ml-2 text-sm font-extrabold text-brand-dark">
                      {t.uz}
                    </span>
                  )}
                </dt>
                <dd className="text-sm text-muted">{t.text}</dd>
              </div>
            ))}
          </dl>
        </details>
      </section>
    </div>
  );
}
