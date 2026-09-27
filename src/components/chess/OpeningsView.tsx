"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Feedback, type FeedbackState } from "@/components/answers/Feedback";
import { Button, cn } from "@/components/ui";
import {
  OPENINGS,
  OPENING_CATEGORIES,
  OPENING_PRINCIPLES,
  getOpening,
  type Opening,
  type OpeningCategory,
} from "@/content/chess/openings";
import { legalTargets, pieceAt, playMove, ruSan, type Color } from "@/lib/chess";
import { chessOpeningLearned, useHydrated, useStore } from "@/lib/store";
import { setHash, useHash } from "@/lib/useHash";
import { ChessBoard, type SquareMark } from "./ChessBoard";
import { replayPositions } from "./GameReplay";

const STARS = (n: number) => "⭐".repeat(n);
const CATEGORY_ORDER: OpeningCategory[] = ["open", "semiOpen", "closed", "gambit", "trap"];

export function OpeningsView() {
  const hash = useHash();
  const detail = hash.match(/^#open-(.+)$/);
  const train = hash.match(/^#train-([a-z0-9-]+)-(white|black)$/);
  if (train) {
    const opening = getOpening(train[1]);
    if (opening) return <OpeningTrainer key={hash} opening={opening} side={train[2] as "white" | "black"} />;
  }
  if (detail) {
    const opening = getOpening(detail[1]);
    if (opening) return <OpeningDetail key={opening.id} opening={opening} />;
  }
  return <OpeningsList />;
}

function OpeningsList() {
  const hydrated = useHydrated();
  const learned = useStore((s) => s.chessOpenings);
  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← Шахматная школа
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Дебюты</p>
        <h1 className="text-3xl font-black">Как начинать партию</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Дебют — это первые ходы партии. Сначала пять главных правил, потом {OPENINGS.length} дебютов с идеями и
          тренажёром: повтори ходы на доске, и дебют запомнится сам.
        </p>
      </header>

      <section aria-labelledby="principles" className="rounded-3xl bg-white p-5 shadow-card">
        <h2 id="principles" className="text-xl font-black">
          Пять правил дебюта
        </h2>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {OPENING_PRINCIPLES.map((p, i) => (
            <li key={p.title} className="rounded-2xl bg-brand-soft/60 p-3">
              <p className="text-2xl" aria-hidden>
                {p.emoji}
              </p>
              <p className="font-black">
                {i + 1}. {p.title}
              </p>
              <p className="text-sm text-muted">{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {CATEGORY_ORDER.map((cat) => (
        <section key={cat} aria-labelledby={`cat-${cat}`}>
          <h2 id={`cat-${cat}`} className="text-2xl font-black">
            {OPENING_CATEGORIES[cat].name}
          </h2>
          <p className="mb-3 text-muted">{OPENING_CATEGORIES[cat].about}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {OPENINGS.filter((o) => o.category === cat).map((o) => {
              const positions = replayPositions(o.moves);
              const done = hydrated && (learned[`${o.id}:white`] || learned[`${o.id}:black`]);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setHash(`#open-${o.id}`)}
                  className="flex gap-3 rounded-3xl bg-white p-3 text-left shadow-card transition hover:-translate-y-0.5"
                >
                  <ChessBoard
                    id={`op-${o.id}`}
                    position={positions[positions.length - 1].fen}
                    maxWidth={120}
                    className="!mx-0 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-muted">
                      {o.eco} · {STARS(o.stars)}
                      {done ? " · ✅" : ""}
                    </p>
                    <p className="text-lg leading-tight font-black">{o.name}</p>
                    <p className="mt-1 line-clamp-3 text-sm text-muted">{o.idea}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function OpeningDetail({ opening }: { opening: Opening }) {
  const positions = useMemo(() => replayPositions(opening.moves), [opening.moves]);
  const [ply, setPly] = useState(positions.length - 1);
  const learned = useStore((s) => s.chessOpenings);
  const hydrated = useHydrated();
  const cur = positions[ply];
  const marks: Record<string, SquareMark> = ply > 0 ? { [cur.from]: "last", [cur.to]: "last" } : {};
  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => setHash("#all")}
        className="text-sm font-extrabold text-brand hover:underline"
      >
        ← Все дебюты
      </button>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
          {OPENING_CATEGORIES[opening.category].name} · {opening.eco} · {STARS(opening.stars)}
        </p>
        <h1 className="text-3xl font-black">{opening.name}</h1>
        <p className="text-lg font-bold text-brand-dark">{opening.idea}</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          <ChessBoard id={`opening-${opening.id}`} position={cur.fen} marks={marks} maxWidth={480} />
          <div className="flex flex-wrap items-center gap-1.5">
            <Button variant="secondary" size="sm" onClick={() => setPly(0)} disabled={ply === 0}>
              ⏮
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPly((p) => Math.max(0, p - 1))}
              disabled={ply === 0}
            >
              ◀
            </Button>
            <Button
              size="sm"
              onClick={() => setPly((p) => Math.min(positions.length - 1, p + 1))}
              disabled={ply === positions.length - 1}
            >
              Дальше ▶
            </Button>
            <span className="ml-auto text-sm font-extrabold text-muted">
              {ply} / {positions.length - 1}
            </span>
          </div>
          <p
            className="flex flex-wrap gap-x-3 gap-y-1 rounded-2xl bg-white px-4 py-3 font-bold shadow-card"
            aria-label="Ходы дебюта"
          >
            {opening.moves.map((m, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPly(i + 1)}
                className={cn(
                  "rounded-md px-1 hover:bg-brand-soft",
                  i + 1 === ply && "bg-brand text-white hover:bg-brand",
                )}
              >
                {i % 2 === 0 ? `${i / 2 + 1}. ` : ""}
                {ruSan(m)}
              </button>
            ))}
          </p>
        </div>
        <aside className="space-y-3">
          <div className="rounded-2xl bg-white p-4 shadow-card">
            <p className="text-sm font-extrabold text-muted">Как играть</p>
            <ul className="mt-2 space-y-2">
              {opening.plan.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-brand" aria-hidden>
                    •
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            {opening.playedBy && <p className="mt-3 text-sm font-bold text-muted">Играли: {opening.playedBy}</p>}
          </div>
          <div className="rounded-2xl bg-sun-soft/70 p-4">
            <p className="text-sm font-extrabold text-[#7a4b00]">💡 Интересно</p>
            {opening.facts.map((f) => (
              <p key={f} className="mt-1 text-sm">
                {f}
              </p>
            ))}
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-card">
            <p className="text-sm font-extrabold text-muted">Тренажёр: повтори ходы на доске</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setHash(`#train-${opening.id}-white`)}>
                За белых{hydrated && learned[`${opening.id}:white`] ? " ✓" : ""}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setHash(`#train-${opening.id}-black`)}>
                За чёрных{hydrated && learned[`${opening.id}:black`] ? " ✓" : ""}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Ребёнок играет за side, компьютер отвечает ходами из книги. */
/** Итог тренажёра: без ошибок — отдельная похвала, с ошибками — тоже победа. */
function finishedFeedback(name: string, misses: number): FeedbackState {
  return {
    tone: "success",
    text: misses ? "Дебют сыгран до конца! 🎉" : "Дебют сыгран без ошибок! 🎉",
    sub: misses
      ? `Теперь ты знаешь, как начинается «${name}». Повтори ещё раз — и получится без подсказок.`
      : `Теперь ты знаешь, как начинается «${name}».`,
  };
}

function OpeningTrainer({ opening, side }: { opening: Opening; side: "white" | "black" }) {
  const positions = useMemo(() => replayPositions(opening.moves), [opening.moves]);
  const me: Color = side === "white" ? "w" : "b";
  const [ply, setPly] = useState(0);
  const [shown, setShown] = useState(positions[0].fen);
  const [selected, setSelected] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = opening.moves.length;
  const done = ply >= total;
  const turn = positions[ply].fen.split(" ")[1] as Color;
  const myTurn = !done && turn === me;
  const expected = done ? null : positions[ply + 1];

  // Компьютер делает книжный ход за другую сторону; если это последний ход линии — поздравляем.
  useEffect(() => {
    if (done || myTurn) return;
    timer.current = setTimeout(() => {
      setPly((p) => p + 1);
      setShown(positions[ply + 1].fen);
      setBusy(false);
      if (ply + 1 >= total) setFeedback(finishedFeedback(opening.name, misses));
    }, 600);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [done, myTurn, ply, positions, total, opening.name, misses]);

  useEffect(() => {
    if (done) chessOpeningLearned(opening.id, side);
  }, [done, opening.id, side]);

  const attempt = (from: string, to: string): boolean => {
    if (!myTurn || busy || !expected) return false;
    const played = playMove(positions[ply].fen, from, to, "q");
    if (!played) return false;
    setSelected(null);
    if (played.fen === expected.fen) {
      setPly((p) => p + 1);
      setShown(expected.fen);
      setBusy(true);
      setFeedback(
        ply + 1 >= total
          ? finishedFeedback(opening.name, misses)
          : { tone: "info", text: `${ruSan(played.san)} — верно!`, sub: misses ? undefined : "Так держать." },
      );
      return true;
    }
    const n = misses + 1;
    setMisses(n);
    setShown(played.fen);
    setBusy(true);
    setFeedback({
      tone: "retry",
      text:
        n === 1
          ? "В этом дебюте ходят по-другому."
          : n === 2
            ? "Подсвечена фигура, которой нужно ходить."
            : "Стрелка показывает ход.",
      sub: n === 1 ? "Вспомни ходы дебюта и попробуй ещё раз." : undefined,
    });
    timer.current = setTimeout(() => {
      setShown(positions[ply].fen);
      setBusy(false);
    }, 900);
    return true;
  };

  const tap = (sq: string) => {
    if (!myTurn || busy) return;
    const fen = positions[ply].fen;
    const piece = pieceAt(fen, sq);
    if (piece && piece.color === me) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected) attempt(selected, sq);
  };

  const marks: Record<string, SquareMark> = {};
  if (ply > 0 && shown === positions[ply].fen) {
    marks[positions[ply].from] = "last";
    marks[positions[ply].to] = "last";
  }
  if (misses >= 2 && expected && myTurn) marks[expected.from] = "hint";
  if (selected) {
    marks[selected] = "selected";
    for (const t of legalTargets(positions[ply].fen, selected))
      marks[t] = pieceAt(positions[ply].fen, t) ? "capture" : "target";
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setHash(`#open-${opening.id}`)}
        className="text-sm font-extrabold text-brand hover:underline"
      >
        ← {opening.name}
      </button>
      <h1 className="text-2xl font-black">
        Повтори дебют за {side === "white" ? "белых" : "чёрных"}: {opening.name}
      </h1>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-3">
          <ChessBoard
            id={`train-${opening.id}`}
            position={shown}
            marks={marks}
            orientation={side}
            onSquare={tap}
            draggable={myTurn && !busy}
            onDrop={(from, to) => attempt(from, to)}
            arrows={
              misses >= 3 && expected && myTurn ? [{ from: expected.from, to: expected.to, color: "#10b981" }] : []
            }
            maxWidth={480}
          />
          <Feedback state={feedback} />
        </div>
        <aside className="space-y-3">
          <div className="rounded-2xl bg-white p-4 shadow-card">
            <p className="text-sm font-extrabold text-muted">
              Ход {Math.min(ply, total)} из {total}
            </p>
            <p className="mt-1 text-lg font-black">{done ? "Готово!" : myTurn ? "🙂 Твой ход" : "📖 Ход из книги…"}</p>
            <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-sm font-bold">
              {opening.moves.map((m, i) => (
                <span key={i} className={cn("rounded px-1", i < ply ? "bg-mint-soft text-[#065f46]" : "text-muted")}>
                  {i % 2 === 0 ? `${i / 2 + 1}.` : ""}
                  {i < ply ? ruSan(m) : "…"}
                </span>
              ))}
            </p>
          </div>
          <p className="text-sm text-muted">{opening.idea}</p>
          {done && (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setHash(`#train-${opening.id}-${side === "white" ? "black" : "white"}`)}>
                Теперь за {side === "white" ? "чёрных" : "белых"} →
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setHash("#all")}>
                Другой дебют
              </Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
