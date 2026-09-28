"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink, cn, ProgressBar } from "@/components/ui";
import { ruSan } from "@/lib/chess";
import {
  KIND_META,
  analysisRecord,
  buildReview,
  evaluatePosition,
  gamePositions,
  type GameReview,
  type MoveKind,
  type PlyReview,
  type PositionEval,
} from "@/lib/engine/analysis";
import { ROBOT_LEVELS } from "@/lib/engine/search";
import { ODDS_PIECES, CLOCKS, clockLabel } from "@/lib/play";
import { gamePgn } from "@/lib/pgn";
import { pluralize } from "@/lib/plural";
import { saveChessAnalysis, useHydrated, useStore, type ChessGameRecord } from "@/lib/store";
import { setHash, useHash } from "@/lib/useHash";
import { ChessBoard, type SquareMark } from "./ChessBoard";

const RESULT = { win: "победа", loss: "поражение", draw: "ничья" } as const;

export function gameTitle(g: ChessGameRecord): string {
  if (g.mode === "two") return "Партия вдвоём";
  if (g.mode === "robot") return `Робот «${ROBOT_LEVELS[(g.level ?? 1) - 1]?.name ?? ""}»`;
  if (g.mode === "pawns") return "Пешечный бой";
  return "Тренировка мата";
}

function gameResultText(g: ChessGameRecord): string {
  if (g.mode === "two") return g.winner === "draw" ? "ничья" : g.winner === "b" ? "победили чёрные" : "победили белые";
  return RESULT[g.result];
}

/** Можно ли разобрать партию: есть ходы и это обычные шахматы. */
export function canReview(g: ChessGameRecord): boolean {
  return (g.mode === "robot" || g.mode === "two") && !!g.start && !!g.ucis && g.ucis.length > 1;
}

const reviewCache = new WeakMap<ChessGameRecord, GameReview | null>();

/** Готовый разбор из сохранённых оценок, если они есть. */
export function cachedReview(g: ChessGameRecord): GameReview | null {
  if (reviewCache.has(g)) return reviewCache.get(g)!;
  let review: GameReview | null = null;
  if (g.analysis && g.start && g.ucis && g.analysis.evals.length === g.ucis.length + 1) {
    const evals: PositionEval[] = g.analysis.evals.map((score, i) => ({ score, best: g.analysis!.best[i] }));
    review = buildReview(g.start, g.ucis, evals);
  }
  reviewCache.set(g, review);
  return review;
}

export function ReviewHub() {
  const hash = useHash();
  const games = useStore((s) => s.chessGames);
  const hydrated = useHydrated();
  const id = hash.replace(/^#/, "");
  const game = id ? games.find((g) => g.id === id) : undefined;
  if (hydrated && game && canReview(game)) return <ReviewView key={game.id} game={game} />;
  return <ReviewList notFound={hydrated && !!id && !game} />;
}

function dateText(at: number): string {
  const d = new Date(at);
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function ReviewList({ notFound }: { notFound: boolean }) {
  const hydrated = useHydrated();
  const games = useStore((s) => s.chessGames);
  const list = hydrated ? games.filter(canReview) : [];
  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← Шахматная школа
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Разбор партий</p>
        <h1 className="text-3xl font-black">Робот-тренер смотрит твои партии</h1>
        <p className="mt-1 max-w-2xl text-muted">
          После каждой партии робот проверяет все ходы: где был лучший ход, где неточность, а где фигура осталась под
          боем. Он объясняет ошибки простыми словами и делает из них задачи — чтобы в следующий раз ты их нашёл сам.
        </p>
      </header>
      {notFound && (
        <p className="rounded-2xl bg-sun-soft px-4 py-3 font-semibold">Такой партии нет на этом устройстве.</p>
      )}
      {hydrated && list.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-center shadow-card">
          <p className="text-5xl" aria-hidden>
            🤖
          </p>
          <p className="mt-2 text-lg font-black">Сыграй партию с роботом или вдвоём — и её можно будет разобрать.</p>
          <ButtonLink href="/chess/play" className="mt-3">
            Играть
          </ButtonLink>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {list.map((g) => {
            const acc = g.analysis?.acc;
            const mine = g.mode === "robot" && acc ? acc[g.color] : null;
            return (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => setHash(`#${g.id}`)}
                  className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5"
                >
                  <span className="text-3xl" aria-hidden>
                    {g.mode === "two" ? "👨‍👦" : "🤖"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-black">
                      {gameTitle(g)} · {gameResultText(g)}
                    </span>
                    <span className="block text-sm text-muted">
                      {dateText(g.at)} · {pluralize(Math.ceil(g.ucis!.length / 2), "ход", "хода", "ходов")}
                      {g.mode === "robot" && ` · ты ${g.color === "w" ? "белыми" : "чёрными"}`}
                    </span>
                  </span>
                  <span className="text-right text-sm font-extrabold">
                    {mine !== null ? (
                      <>
                        <span className="block text-2xl text-brand-dark">{mine}%</span>
                        точность
                      </>
                    ) : acc ? (
                      <span className="text-brand-dark">
                        {acc.w}% / {acc.b}%
                      </span>
                    ) : (
                      <span className="text-brand">Разобрать →</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Оценки считаются по одной позиции за раз, чтобы страница не зависала. */
function useAnalysis(game: ChessGameRecord): { review: GameReview | null; done: number; total: number } {
  const cached = useMemo(() => cachedReview(game), [game]);
  const fens = useMemo(() => gamePositions(game.start!, game.ucis!), [game.start, game.ucis]);
  const [evals, setEvals] = useState<PositionEval[]>([]);
  const complete = !cached && evals.length === fens.length;

  useEffect(() => {
    if (cached || evals.length >= fens.length) return;
    const t = setTimeout(() => setEvals((e) => [...e, evaluatePosition(fens[e.length])]), 0);
    return () => clearTimeout(t);
  }, [cached, evals, fens]);

  const fresh = useMemo(
    () => (complete ? buildReview(game.start!, game.ucis!, evals) : null),
    [complete, evals, game.start, game.ucis],
  );

  useEffect(() => {
    if (fresh) saveChessAnalysis(game.id, analysisRecord(evals, fresh));
  }, [fresh, evals, game.id]);

  return { review: cached ?? fresh, done: cached ? fens.length : evals.length, total: fens.length };
}

function ReviewView({ game }: { game: ChessGameRecord }) {
  const { review, done, total } = useAnalysis(game);
  const [ply, setPly] = useState(0);
  const sides: ("w" | "b")[] = game.mode === "two" ? ["w", "b"] : [game.color];
  const hero = game.mode === "robot" ? game.color : null;

  return (
    <div className="space-y-5">
      <button type="button" onClick={() => setHash("")} className="text-sm font-extrabold text-brand hover:underline">
        ← Все мои партии
      </button>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Разбор партии · {dateText(game.at)}</p>
        <h1 className="text-3xl font-black">
          {gameTitle(game)} · {gameResultText(game)}
        </h1>
        <p className="font-bold text-muted">
          {hero && `Ты играл ${hero === "w" ? "белыми" : "чёрными"} · `}
          {pluralize(Math.ceil(game.ucis!.length / 2), "ход", "хода", "ходов")}
          {game.odds &&
            ` · фора: ${game.odds[0] === "w" ? "белые" : "чёрные"} ${ODDS_PIECES.find((o) => o.id === game.odds![1])?.label ?? ""}`}
          {game.clock && ` · часы ${clockLabel(CLOCKS.find((c) => c.id === game.clock) ?? CLOCKS[0])}`}
        </p>
      </header>

      <PgnButtons game={game} />

      {!review ? (
        <div className="rounded-3xl bg-white p-6 shadow-card" aria-live="polite">
          <p className="text-lg font-black">🤖 Робот-тренер смотрит партию…</p>
          <p className="text-sm text-muted">
            Проверено позиций: {done} из {total}
          </p>
          <ProgressBar value={done} max={total} className="mt-3" />
        </div>
      ) : (
        <ReviewBody game={game} review={review} sides={sides} hero={hero} ply={ply} setPly={setPly} />
      )}
    </div>
  );
}

const KIND_ORDER: MoveKind[] = ["best", "good", "inaccuracy", "mistake", "blunder"];

function ReviewBody({
  game,
  review,
  sides,
  hero,
  ply,
  setPly,
}: {
  game: ChessGameRecord;
  review: GameReview;
  sides: ("w" | "b")[];
  hero: "w" | "b" | null;
  ply: number;
  setPly: (p: number) => void;
}) {
  const total = review.plies.length;
  const cur: PlyReview | undefined = review.plies[ply - 1];
  const fen = cur ? cur.fenAfter : game.start!;
  const moments = review.plies
    .filter((p) => sides.includes(p.side) && (p.kind === "mistake" || p.kind === "blunder" || p.kind === "inaccuracy"))
    .sort((a, b) => b.drop - a.drop)
    .slice(0, 5)
    .sort((a, b) => a.ply - b.ply);

  const marks: Record<string, SquareMark> = {};
  if (cur) {
    marks[cur.uci.slice(0, 2)] = "last";
    marks[cur.uci.slice(2, 4)] = "last";
  }
  const showBest = cur && cur.best && cur.best !== cur.uci && cur.kind !== "good" && cur.kind !== "best";
  const orientation = game.mode === "robot" && game.color === "b" ? "black" : "white";

  return (
    <>
      <section className={cn("grid gap-3", sides.length > 1 && "md:grid-cols-2")} aria-label="Точность">
        {sides.map((side) => {
          const s = review.sides[side];
          return (
            <div key={side} className="rounded-3xl bg-white p-5 shadow-card">
              <p className="text-sm font-extrabold text-muted">
                {hero ? "Твоя точность" : side === "w" ? "Точность белых" : "Точность чёрных"}
              </p>
              <p className="text-4xl font-black text-brand-dark">{s.accuracy}%</p>
              <ul className="mt-2 flex flex-wrap gap-1.5 text-sm font-bold">
                {KIND_ORDER.map((k) => (
                  <li
                    key={k}
                    className="rounded-full px-2.5 py-0.5"
                    style={{ color: KIND_META[k].color, background: `${KIND_META[k].color}14` }}
                  >
                    {KIND_META[k].mark && `${KIND_META[k].mark} `}
                    {KIND_META[k].label}: {s.counts[k]}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-muted">{accuracyWords(s.accuracy)}</p>
            </div>
          );
        })}
      </section>

      <AdvantageChart review={review} sides={sides} ply={ply} onPick={setPly} />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <ChessBoard
            id="review"
            position={fen}
            marks={marks}
            orientation={orientation}
            arrows={
              showBest && cur?.best ? [{ from: cur.best.slice(0, 2), to: cur.best.slice(2, 4), color: "#10b981" }] : []
            }
            maxWidth={520}
            label={cur ? `Позиция после хода ${ruSan(cur.san)}` : "Начальная позиция"}
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <Button variant="secondary" size="sm" onClick={() => setPly(0)} disabled={ply === 0} aria-label="В начало">
              ⏮
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPly(ply - 1)}
              disabled={ply === 0}
              aria-label="Ход назад"
            >
              ◀
            </Button>
            <Button size="sm" onClick={() => setPly(ply + 1)} disabled={ply === total} aria-label="Ход вперёд">
              Дальше ▶
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPly(total)}
              disabled={ply === total}
              aria-label="В конец"
            >
              ⏭
            </Button>
            <span className="ml-auto text-sm font-extrabold text-muted">
              {ply} / {total}
            </span>
          </div>
          <MoveComment cur={cur} hero={hero} />
        </div>
        <aside className="rounded-2xl bg-white p-3 shadow-card">
          <p className="mb-2 text-sm font-extrabold text-muted">Ходы партии</p>
          <ol
            className="grid max-h-[460px] grid-cols-[auto_1fr_1fr] gap-x-2 gap-y-0.5 overflow-y-auto text-[0.95rem]"
            aria-label="Ходы с оценками"
          >
            {Array.from({ length: Math.ceil(total / 2) }, (_, i) => (
              <li key={i} className="contents">
                <span className="text-muted">{i + 1}.</span>
                {[2 * i + 1, 2 * i + 2].map((p) => {
                  const r = review.plies[p - 1];
                  if (!r) return <span key={p} />;
                  const meta = KIND_META[r.kind];
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPly(p)}
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-left font-bold hover:bg-brand-soft",
                        p === ply && "bg-brand text-white hover:bg-brand",
                      )}
                      style={p === ply || !meta.mark ? undefined : { color: meta.color }}
                    >
                      {ruSan(r.san)}
                      {meta.mark && r.kind !== "mate" ? meta.mark : ""}
                    </button>
                  );
                })}
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section aria-labelledby="moments-h">
        <h2 id="moments-h" className="mb-3 text-2xl font-black">
          🎯 Главные моменты
        </h2>
        {moments.length === 0 ? (
          <p className="rounded-2xl bg-mint-soft px-4 py-3 font-semibold">
            Серьёзных ошибок не найдено — отличная партия! 🎉
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {moments.map((m) => (
              <button
                key={m.ply}
                type="button"
                onClick={() => {
                  setPly(m.ply);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-3xl bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5"
              >
                <p
                  className="text-xs font-extrabold tracking-wide uppercase"
                  style={{ color: KIND_META[m.kind].color }}
                >
                  Ход {Math.ceil(m.ply / 2)} · {KIND_META[m.kind].label}
                </p>
                <p className="font-black">
                  {ruSan(m.san)} → лучше {m.bestSan ? ruSan(m.bestSan) : "—"}
                </p>
                <p className="mt-1 line-clamp-3 text-sm text-muted">{m.reason}</p>
              </button>
            ))}
          </div>
        )}
        {moments.some((m) => m.kind !== "inaccuracy") && (
          <ButtonLink href="/chess/puzzles#mine" variant="sun" className="mt-3">
            🧩 Реши эти моменты как задачи
          </ButtonLink>
        )}
      </section>
    </>
  );
}

function accuracyWords(a: number): string {
  if (a >= 85) return "Играл как настоящий мастер!";
  if (a >= 70) return "Очень хорошая партия — почти без ошибок.";
  if (a >= 50) return "Хорошо! Посмотри главные моменты — там спрятаны уроки.";
  return "Партия с приключениями. Разбери ошибки — и в следующий раз будет лучше.";
}

function MoveComment({ cur, hero }: { cur: PlyReview | undefined; hero: "w" | "b" | null }) {
  if (!cur)
    return (
      <p className="rounded-2xl border-2 border-line bg-white px-4 py-3 text-lg font-semibold">
        Нажимай «Дальше» или на ход в списке — робот-тренер расскажет о каждом ходе.
      </p>
    );
  const meta = KIND_META[cur.kind];
  const who = hero ? (cur.side === hero ? "Твой ход" : "Ход робота") : cur.side === "w" ? "Ход белых" : "Ход чёрных";
  const text =
    cur.kind === "best"
      ? "Робот-тренер сыграл бы так же. 👍"
      : cur.kind === "mate"
        ? "Мат! Партия окончена. 🎉"
        : cur.kind === "good"
          ? `Хороший ход.${cur.bestSan ? ` Робот-тренер предлагал ${ruSan(cur.bestSan)} — но разница небольшая.` : ""}`
          : cur.reason;
  return (
    <div
      className="rounded-2xl border-2 px-4 py-3"
      style={{ borderColor: `${meta.color}55`, background: `${meta.color}10` }}
      aria-live="polite"
    >
      <p className="text-sm font-extrabold text-muted">
        {who} {Math.ceil(cur.ply / 2)}
        {cur.side === "w" ? "." : "…"} {ruSan(cur.san)} ·{" "}
        <span style={{ color: meta.color }}>
          {meta.mark} {meta.label}
        </span>
      </p>
      <p className="mt-1 text-lg font-semibold">{text}</p>
      {cur.best && cur.best !== cur.uci && cur.kind !== "good" && cur.kind !== "best" && (
        <p className="mt-1 text-sm font-bold text-[#065f46]">Зелёная стрелка — лучший ход.</p>
      )}
    </div>
  );
}

/** Шансы белых по ходу партии: светлая часть — белые, тёмная — чёрные. Нажми — перейдёшь к ходу. */
function AdvantageChart({
  review,
  sides,
  ply,
  onPick,
}: {
  review: GameReview;
  sides: ("w" | "b")[];
  ply: number;
  onPick: (p: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 120;
  const n = review.whiteWin.length - 1;
  const x = (i: number) => (n === 0 ? 0 : (i / n) * W);
  const y = (v: number) => H - (v / 100) * H;
  const line = review.whiteWin.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const bad = review.plies.filter((p) => sides.includes(p.side) && (p.kind === "mistake" || p.kind === "blunder"));
  const active = hover ?? ply;
  const pickAt = (clientX: number, rect: DOMRect) =>
    Math.max(0, Math.min(n, Math.round(((clientX - rect.left) / rect.width) * n)));
  const tip = hover !== null ? review.plies[hover - 1] : undefined;

  return (
    <section className="rounded-3xl bg-white p-4 shadow-card" aria-labelledby="chart-h">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="chart-h" className="text-lg font-black">
          📈 Кто был ближе к победе
        </h2>
        <p className="text-sm text-muted">
          {hover !== null
            ? `${hover === 0 ? "Начало" : `Ход ${Math.ceil(hover / 2)}${tip ? ` · ${ruSan(tip.san)}` : ""}`} · шансы белых ${Math.round(review.whiteWin[hover])}%`
            : "Выше середины — лучше белым, ниже — чёрным. Нажми на график, чтобы перейти к ходу."}
        </p>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="mt-2 h-28 w-full cursor-pointer touch-none overflow-hidden rounded-xl"
        role="img"
        aria-label="График шансов белых по ходу партии"
        onPointerMove={(e) => setHover(pickAt(e.clientX, e.currentTarget.getBoundingClientRect()))}
        onPointerLeave={() => setHover(null)}
        onClick={(e) => onPick(pickAt(e.clientX, e.currentTarget.getBoundingClientRect()))}
      >
        <rect x={0} y={0} width={W} height={H} fill="#57534e" />
        <path d={area} fill="#f5f5f4" />
        <line
          x1={0}
          x2={W}
          y1={H / 2}
          y2={H / 2}
          stroke="#a8a29e"
          strokeWidth={1}
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={x(active)}
          x2={x(active)}
          y1={0}
          y2={H}
          stroke="#4f46e5"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
        {bad.map((p) => (
          <circle
            key={p.ply}
            cx={x(p.ply)}
            cy={y(review.whiteWin[p.ply])}
            r={5}
            fill={KIND_META[p.kind].color}
            stroke="#ffffff"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {bad.length > 0 && (
        <p className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-muted">
          <span>
            <span
              className="mr-1 inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: KIND_META.mistake.color }}
            />
            ошибка ?
          </span>
          <span>
            <span
              className="mr-1 inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: KIND_META.blunder.color }}
            />
            зевок ??
          </span>
        </p>
      )}
    </section>
  );
}

/** Скачать партию в PGN или скопировать — чтобы открыть на Lichess или показать тренеру. */
function PgnButtons({ game }: { game: ChessGameRecord }) {
  const [copied, setCopied] = useState(false);
  const pgn = () => gamePgn(game);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          const url = URL.createObjectURL(new Blob([pgn()], { type: "application/x-chess-pgn" }));
          const a = document.createElement("a");
          a.href = url;
          a.download = `partiya-${game.id}.pgn`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        ⬇️ Скачать PGN
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          void navigator.clipboard?.writeText(pgn()).then(() => setCopied(true));
        }}
      >
        {copied ? "✓ Скопировано" : "📋 Скопировать запись"}
      </Button>
      <span className="text-xs text-muted">PGN открывается на Lichess, Chess.com и в любой шахматной программе.</span>
    </div>
  );
}
