"use client";

import { Chess } from "chess.js";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { RichText } from "@/components/RichText";
import { Button, cn } from "@/components/ui";
import { FAMOUS_GAMES, type FamousGame } from "@/content/chess/games";
import { type ChessImage, chessImages } from "@/content/chess/images";
import { CHESS_LEVELS } from "@/content/chess";
import { ruSan } from "@/lib/chess";
import { chessGameViewed, useHydrated, useStore } from "@/lib/store";
import { ChessBoard, type SquareMark } from "./ChessBoard";
import { PhotoStrip, Portrait } from "./Figure";
import { GuessGame, guessHero } from "./GuessGame";

/** Позиции после каждого полухода (индекс 0 — начальная). */
export function replayPositions(moves: string[]): { fen: string; from: string; to: string; san: string }[] {
  const chess = new Chess();
  const out = [{ fen: chess.fen(), from: "", to: "", san: "" }];
  for (const m of moves) {
    const mv = chess.move(m);
    out.push({ fen: chess.fen(), from: mv.from, to: mv.to, san: mv.san });
  }
  return out;
}

/** Портреты игроков в ряд, чуть внахлёст. */
function Faces({ images, size }: { images: ChessImage[]; size: number }) {
  const people = images.filter((i) => i.kind === "person");
  if (!people.length) return null;
  return (
    <span className="flex -space-x-2">
      {people.map((i) => (
        <Portrait key={i.id} image={i} size={size} />
      ))}
    </span>
  );
}

export function FamousGamesList() {
  const hydrated = useHydrated();
  const viewed = useStore((s) => s.chessGamesViewed);
  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← Шахматная школа
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Знаменитые партии</p>
        <h1 className="text-3xl font-black">Партии, которые знает весь мир</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Разбери партию ход за ходом: на каждом важном ходу — объяснение для ребёнка, а самые красивые позиции показаны
          отдельно. Все ходы проверены шахматной программой.
        </p>
      </header>
      <ol className="grid gap-4 md:grid-cols-2">
        {FAMOUS_GAMES.map((g) => {
          const positions = replayPositions(g.moves);
          const level = CHESS_LEVELS.find((l) => l.id === g.level);
          return (
            <li key={g.id}>
              <Link
                href={`/chess/games/${g.id}`}
                className="flex h-full gap-4 rounded-3xl bg-white p-4 shadow-card transition hover:-translate-y-0.5"
              >
                <ChessBoard
                  id={`preview-${g.id}`}
                  position={positions[positions.length - 1].fen}
                  maxWidth={150}
                  className="!mx-0 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
                    {g.year ? `${g.year} · ` : ""}
                    {g.place}
                  </p>
                  <p className="text-xl font-black">{g.title}</p>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold">
                    <Faces images={chessImages(g.pictures)} size={28} />
                    <span>
                      {g.white} — {g.black} · {g.result}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm text-muted">{g.story[0]}</p>
                  <p className="mt-2 text-xs font-extrabold text-brand-dark">
                    {Math.ceil(g.moves.length / 2)} ходов · уровень «{level?.name}»
                    {hydrated && viewed[g.id] ? " · ✅ разобрана" : ""}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function GameReplay({ game }: { game: FamousGame }) {
  const positions = useMemo(() => replayPositions(game.moves), [game.moves]);
  const [ply, setPly] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = game.moves.length;
  const level = CHESS_LEVELS.find((l) => l.id === game.level);
  const pictures = chessImages(game.pictures);
  const [guess, setGuess] = useState(false);
  const hero = guessHero(game);
  const guessBest = useStore((s) => s.chessGuess[game.id]);

  const isPlaying = playing && ply < total;

  useEffect(() => {
    if (!isPlaying) return;
    timer.current = setTimeout(() => setPly((p) => p + 1), game.comments[ply + 1] ? 2600 : 1300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isPlaying, ply, game.comments]);

  useEffect(() => {
    if (ply === total) chessGameViewed(game.id);
  }, [ply, total, game.id]);

  const go = (p: number) => {
    setPlaying(false);
    setPly(Math.min(Math.max(p, 0), total));
  };

  const cur = positions[ply];
  const marks: Record<string, SquareMark> = {};
  if (ply > 0) {
    marks[cur.from] = "last";
    marks[cur.to] = "last";
  }
  const comment = game.comments[ply];
  const moveLabel = ply === 0 ? "Начальная позиция" : `${Math.ceil(ply / 2)}${ply % 2 ? "." : "…"} ${ruSan(cur.san)}`;

  return (
    <div className="space-y-5">
      <Link
        href="/chess/games"
        className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline"
      >
        ← Все партии
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
          {game.year ? `${game.year} · ` : ""}
          {game.place}
          {game.event ? ` · ${game.event}` : ""}
        </p>
        <h1 className="text-3xl font-black">{game.title}</h1>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-bold">
          <Faces images={pictures} size={44} />
          <span>
            {game.white} — {game.black} · {game.result} · {game.era}
          </span>
        </p>
      </header>

      <section className="grid gap-3 rounded-3xl bg-white p-5 shadow-card md:grid-cols-2">
        {game.story.map((p, i) => (
          <p key={i} className="text-lg leading-relaxed">
            {p}
          </p>
        ))}
      </section>

      {pictures.length > 0 && (
        <section aria-labelledby="pictures">
          <h2 id="pictures" className="mb-3 text-2xl font-black">
            📷 Кто играл и где
          </h2>
          <PhotoStrip images={pictures} />
        </section>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border-2 border-brand/30 bg-brand-soft/50 p-4">
        <p className="min-w-0 flex-1 font-bold">
          {guess
            ? "Режим «Угадай ход»: делай ходы за победителя — ответы соперника появятся сами."
            : `🎯 Сыграй как ${hero.name}: угадывай ходы победителя и получай очки.`}
          {guessBest && !guess && (
            <span className="ml-1 text-sm text-muted">
              Рекорд: {guessBest.score} из {guessBest.max}.
            </span>
          )}
        </p>
        <Button size="sm" variant={guess ? "secondary" : "primary"} onClick={() => setGuess((g) => !g)}>
          {guess ? "← К разбору партии" : "Играть «Угадай ход»"}
        </Button>
      </div>

      {guess ? (
        <GuessGame game={game} onExit={() => setGuess(false)} />
      ) : (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]" aria-label="Разбор партии">
          <div className="space-y-3">
            <ChessBoard
              id={`game-${game.id}`}
              position={cur.fen}
              marks={marks}
              maxWidth={520}
              label={`Позиция после хода ${moveLabel}`}
            />
            <div className="flex flex-wrap items-center gap-1.5">
              <Button variant="secondary" size="sm" onClick={() => go(0)} disabled={ply === 0} aria-label="В начало">
                ⏮
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => go(ply - 1)}
                disabled={ply === 0}
                aria-label="Ход назад"
              >
                ◀
              </Button>
              <Button size="sm" onClick={() => go(ply + 1)} disabled={ply === total} aria-label="Ход вперёд">
                Дальше ▶
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => go(total)}
                disabled={ply === total}
                aria-label="В конец"
              >
                ⏭
              </Button>
              <Button
                variant={isPlaying ? "sun" : "soft"}
                size="sm"
                onClick={() => {
                  if (isPlaying) setPlaying(false);
                  else {
                    if (ply === total) setPly(0);
                    setPlaying(true);
                  }
                }}
              >
                {isPlaying ? "⏸ Пауза" : "▶ Смотреть"}
              </Button>
              <span className="ml-auto text-sm font-extrabold text-muted">
                {ply} / {total}
              </span>
            </div>
            <div
              className={cn(
                "min-h-20 rounded-2xl border-2 px-4 py-3",
                comment ? "border-brand/30 bg-brand-soft/60" : "border-line bg-white",
              )}
              aria-live="polite"
            >
              <p className="text-sm font-extrabold text-muted">{moveLabel}</p>
              <p className="mt-1 text-lg font-semibold">
                {comment ??
                  (ply === total
                    ? `Партия окончена: ${game.result}.`
                    : "Нажимай «Дальше» — на важных ходах появятся объяснения.")}
              </p>
            </div>
          </div>
          <aside className="rounded-2xl bg-white p-3 shadow-card">
            <p className="mb-2 text-sm font-extrabold text-muted">Ходы партии</p>
            <ol className="grid max-h-[420px] grid-cols-[auto_1fr_1fr] gap-x-2 gap-y-0.5 overflow-y-auto text-[0.95rem]">
              {Array.from({ length: Math.ceil(total / 2) }, (_, i) => (
                <li key={i} className="contents">
                  <span className="text-muted">{i + 1}.</span>
                  {[2 * i + 1, 2 * i + 2].map((p) =>
                    p <= total ? (
                      <button
                        key={p}
                        type="button"
                        onClick={() => go(p)}
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-left font-bold hover:bg-brand-soft",
                          p === ply && "bg-brand text-white hover:bg-brand",
                          game.comments[p] && p !== ply && "text-brand-dark underline decoration-dotted",
                        )}
                      >
                        {ruSan(positions[p].san)}
                      </button>
                    ) : (
                      <span key={p} />
                    ),
                  )}
                </li>
              ))}
            </ol>
          </aside>
        </section>
      )}

      <section aria-labelledby="moments">
        <h2 id="moments" className="mb-3 text-2xl font-black">
          🖼️ Главные моменты
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {game.keyMoments.map((k) => (
            <button
              key={k.ply}
              type="button"
              onClick={() => go(k.ply)}
              className={cn(
                "rounded-3xl bg-white p-3 text-left shadow-card transition hover:-translate-y-0.5",
                k.ply === ply && "ring-4 ring-sun",
              )}
            >
              <ChessBoard
                id={`moment-${game.id}-${k.ply}`}
                position={positions[k.ply].fen}
                maxWidth={220}
                className="!mx-0"
              />
              <p className="mt-2 text-xs font-extrabold text-muted">Ход {Math.ceil(k.ply / 2)}</p>
              <p className="text-sm font-bold">{k.caption}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-mint-soft/70 p-5">
          <h2 className="text-lg font-black">🎓 Чему учит партия</h2>
          <p className="mt-1 text-lg">
            <RichText text={game.lesson} />
          </p>
          {level && (
            <Link
              href={`/chess/${level.id}`}
              className="mt-2 inline-block text-sm font-extrabold text-brand hover:underline"
            >
              Уровень «{level.name}» →
            </Link>
          )}
        </div>
        <div className="rounded-3xl bg-sun-soft/70 p-5">
          <h2 className="text-lg font-black">💡 Интересно</h2>
          <ul className="mt-1 space-y-1.5">
            {game.facts.map((f) => (
              <li key={f} className="flex gap-2">
                <span aria-hidden>•</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
