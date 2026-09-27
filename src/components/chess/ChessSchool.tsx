"use client";

import Link from "next/link";
import { cn, ProgressBar } from "@/components/ui";
import { CHESS_LEVELS, CHESS_SCHOOL, chessGlossary, chessLevelHref } from "@/content/chess";
import { FAMOUS_GAMES } from "@/content/chess/games";
import { OPENINGS } from "@/content/chess/openings";
import { PUZZLES, dailyPuzzleFor } from "@/content/chess/puzzles";
import { RIDDLES, SECRETS } from "@/content/chess/secrets";
import { useAgeProfile } from "@/lib/age";
import { currentRank, levelStatuses } from "@/lib/chessProgress";
import { useHydrated, useStore } from "@/lib/store";
import { ChessBoard, PieceIcon } from "./ChessBoard";
import { DidYouKnow } from "./DidYouKnow";

export function ChessSchool() {
  const hydrated = useHydrated();
  const state = useStore((s) => s);
  const statuses = levelStatuses(CHESS_LEVELS, state);
  const rank = hydrated ? currentRank(CHESS_LEVELS, state) : null;
  const solved = statuses.reduce((s, x) => s + x.solved, 0);
  const total = statuses.reduce((s, x) => s + x.total, 0);
  const glossary = chessGlossary();
  const profile = useAgeProfile();
  const daily = dailyPuzzleFor(profile.minStars);
  const puzzlesSolved = hydrated ? PUZZLES.filter((p) => state.chessPuzzles[p.id]?.solvedAt).length : 0;
  const openingsLearned = hydrated ? new Set(Object.keys(state.chessOpenings).map((k) => k.split(":")[0])).size : 0;
  const gamesViewed = hydrated ? Object.keys(state.chessGamesViewed).length : 0;
  const played = hydrated ? state.chessGames.length : 0;
  const wins = hydrated ? state.chessGames.filter((g) => g.result === "win").length : 0;

  const sections = [
    {
      href: "/chess/play",
      emoji: "🤖",
      title: "Играть",
      text: "С роботом пяти уровней, вдвоём на одном экране, пешечный бой, тренировка мата.",
      stat: played ? `${played} партий · ${wins} побед` : "Сыграй первую партию!",
    },
    {
      href: "/chess/puzzles",
      emoji: "🎯",
      title: "Задачи",
      text: `${PUZZLES.length} задач: маты, вилки, связки, комбинации из великих партий. Задача дня и серия.`,
      stat: `${puzzlesSolved} из ${PUZZLES.length} решено`,
    },
    {
      href: "/chess/openings",
      emoji: "📖",
      title: "Дебюты",
      text: `Пять правил дебюта и ${OPENINGS.length} дебютов с идеями, историей и тренажёром ходов.`,
      stat: `${openingsLearned} из ${OPENINGS.length} выучено`,
    },
    {
      href: "/chess/games",
      emoji: "🏛️",
      title: "Знаменитые партии",
      text: `${FAMOUS_GAMES.length} легендарных партий с объяснениями и картинками главных моментов.`,
      stat: `${gamesViewed} из ${FAMOUS_GAMES.length} разобрано`,
    },
    {
      href: "/chess/secrets",
      emoji: "🔮",
      title: "Тайны и легенды",
      text: "Учёные Хорезма и Бухары, сказания «Шахнаме», машина «Турок», путешествие коня и загадки про фигуры.",
      stat: `${SECRETS.length} историй · ${RIDDLES.length} загадок`,
    },
    {
      href: "/chess/history",
      emoji: "🗺️",
      title: "Энциклопедия",
      text: "История от Индии до Самарканда, чемпионы мира, имена фигур, рекорды, шахматы и математика.",
      stat: "Открывай и читай",
    },
    {
      href: "/chess/diary",
      emoji: "✍️",
      title: "Дневник партий",
      text: "Записывай партии с папой, мамой и друзьями — и что ты в них понял.",
      stat: hydrated && state.chessDiary.length ? `${state.chessDiary.length} записей` : "Пока пусто",
    },
  ];

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

      <section aria-labelledby="chess-sections">
        <h2 id="chess-sections" className="mb-3 text-2xl font-black">
          Разделы школы
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col rounded-3xl border-2 border-transparent bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand/30"
            >
              <p className="text-3xl" aria-hidden>
                {s.emoji}
              </p>
              <p className="mt-1 text-xl font-black">{s.title}</p>
              <p className="mt-1 flex-1 text-sm text-muted">{s.text}</p>
              <p className="mt-3 text-xs font-extrabold text-brand-dark">{s.stat}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]" aria-labelledby="daily-home">
        <div>
          <h2 id="daily-home" className="mb-3 text-2xl font-black">
            Уровни и звания
          </h2>
          <ol className="grid gap-3 sm:grid-cols-2">
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
                      <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
                        Уровень {level.order} · {"⭐".repeat(level.order)}
                      </p>
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
                    <div
                      className="h-full rounded-3xl border-2 border-dashed border-line bg-white/70 p-4"
                      aria-disabled
                    >
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
        </div>
        <aside className="space-y-4">
          <DidYouKnow />
          <Link
            href="/chess/puzzles#daily"
            className="block rounded-3xl bg-white p-4 shadow-card transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-extrabold tracking-wide text-muted uppercase">📅 Задача дня</p>
            <p className="text-lg font-black">{daily.title}</p>
            <p className="mb-2 text-xs font-bold text-muted">
              {"⭐".repeat(daily.stars)} · {daily.fen.split(" ")[1] === "w" ? "ходят белые" : "ходят чёрные"}
              {hydrated && state.chessPuzzles[daily.id]?.solvedAt ? " · ✅" : ""}
            </p>
            <ChessBoard
              id="hub-daily"
              position={daily.fen}
              orientation={daily.fen.split(" ")[1] === "w" ? "white" : "black"}
              maxWidth={280}
              className="!mx-0"
            />
          </Link>
          <div className="rounded-3xl bg-white p-4 shadow-card">
            <h2 className="text-lg font-black">🧭 Как заниматься</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>📖 Прочитай урок уровня и понажимай на фигуры.</li>
              <li>
                🖨{" "}
                <Link href="/chess/print" className="font-extrabold text-brand hover:underline">
                  Распечатай задачи
                </Link>{" "}
                — решай на бумаге.
              </li>
              <li>🎯 Реши упражнения — получишь звание и следующий уровень.</li>
              <li>🤖 Сыграй с роботом «{profile.robotName}» — он тебе по силам.</li>
              <li>🏛️ Разбери знаменитую партию — там самые красивые идеи.</li>
              <li>♟ И играй с папой или мамой — записывай партии в дневник.</li>
            </ul>
          </div>
          <details className="rounded-3xl bg-white p-4 shadow-card">
            <summary className="cursor-pointer text-lg font-black">
              📚 Словарик <span className="text-sm font-bold text-muted">({glossary.length} слов)</span>
            </summary>
            <dl className="mt-3 space-y-2">
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
        </aside>
      </section>
    </div>
  );
}
