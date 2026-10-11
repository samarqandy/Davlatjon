"use client";

import { Chess } from "chess.js";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { RichText } from "@/components/RichText";
import { Button, ProgressBar, cn } from "@/components/ui";
import type { EndgameDrill, EndgameLesson } from "@/content/chess/endgames";
import { legalTargets, pieceAt, playMove } from "@/lib/chess";
import { bestMoves, kingCatches, moveOutcome, pawnSquare, robotMove } from "@/lib/endgame";
import { useLang, useSan, useT } from "@/lib/i18n";
import { chessEndgameSolved, useHydrated, useStore } from "@/lib/store";
import { useChess } from "@/lib/useChess";
import { cue } from "@/lib/voice";
import { ChessBoard, PieceIcon, type SquareMark } from "./ChessBoard";

/** Школа эндшпиля: король и пешка против короля — правило квадрата, оппозиция, ключевые поля, игра с роботом. */
export function EndgameSchool() {
  const t = useT();
  const hydrated = useHydrated();
  const { endgameSchool, endgames, endgameMates } = useChess();
  const solved = useStore((s) => s.chessEndgames);
  const all = endgames.flatMap((l) => l.drills);
  const done = hydrated ? all.filter((d) => solved[d.id]).length : 0;

  return (
    <div className="space-y-8">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← {t("Шахматная школа", "Shaxmat maktabi")}
      </Link>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{endgameSchool.subtitle}</p>
          <h1 className="text-3xl font-black">{endgameSchool.title}</h1>
          <p className="mt-1 text-muted">{endgameSchool.about}</p>
        </div>
        <div className="w-56 rounded-2xl bg-white px-4 py-3 shadow-card">
          <p className="text-sm font-extrabold text-muted">
            {t(`Решено ${done} из ${all.length}`, `${all.length} tadan ${done} tasi yechildi`)}
          </p>
          <ProgressBar value={done} max={all.length} className="mt-2" />
        </div>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label={t("Уроки", "Darslar")}>
        {endgames.map((l, i) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className="rounded-2xl bg-white px-3 py-2 text-sm font-extrabold shadow-card hover:bg-brand-soft"
          >
            <span aria-hidden>{l.emoji}</span> {i + 1}. {l.title}
          </a>
        ))}
      </nav>

      {endgames.map((lesson, i) => (
        <Lesson key={lesson.id} lesson={lesson} n={i + 1} solved={hydrated ? solved : {}} />
      ))}

      <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="mates-h">
        <h2 id="mates-h" className="text-2xl font-black">
          ♛ {t("Пешка стала ферзём — что дальше?", "Piyoda farzin boʻldi — endi-chi?")}
        </h2>
        <p className="mt-1 text-muted">
          {t(
            "Партию ещё нужно выиграть — поставить мат одинокому королю. Потренируйся:",
            "Partiyani hali yutish kerak — yolgʻiz shohga mot qilish lozim. Mashq qil:",
          )}
        </p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {endgameMates.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                className="flex h-full flex-col rounded-2xl border-2 border-line p-4 transition hover:border-brand/40 hover:bg-brand-soft/40"
              >
                <span className="text-3xl" aria-hidden>
                  {m.emoji}
                </span>
                <span className="mt-1 font-black">{m.title}</span>
                <span className="text-sm text-muted">{m.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Lesson({ lesson, n, solved }: { lesson: EndgameLesson; n: number; solved: Record<string, number> }) {
  const t = useT();
  const count = lesson.drills.filter((d) => solved[d.id]).length;
  const demoMarks: Record<string, SquareMark> = {};
  for (const sq of lesson.demo?.highlight ?? []) demoMarks[sq] = "good";
  return (
    <section
      id={lesson.id}
      className="scroll-mt-24 space-y-4 rounded-3xl bg-white p-5 shadow-card"
      aria-labelledby={`${lesson.id}-h`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold tracking-wide text-muted uppercase">{t(`Урок ${n}`, `${n}-dars`)}</p>
          <h2 id={`${lesson.id}-h`} className="text-2xl font-black">
            <span aria-hidden>{lesson.emoji}</span> {lesson.title}
          </h2>
          <p className="mt-1 text-lg font-bold text-brand-dark">{lesson.idea}</p>
        </div>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-extrabold text-brand-dark">
          {count}/{lesson.drills.length}
        </span>
      </div>
      <div className="gap-6 lg:flex lg:items-start">
        <div className="min-w-0 flex-1 space-y-2 text-lg leading-relaxed">
          {lesson.text.map((p) => (
            <p key={p}>
              <RichText text={p} />
            </p>
          ))}
        </div>
        {lesson.demo && (
          <figure className="mt-4 lg:mt-0 lg:w-80 lg:shrink-0">
            <ChessBoard
              id={`demo-${lesson.id}`}
              position={lesson.demo.fen}
              marks={demoMarks}
              maxWidth={320}
              label={lesson.demo.caption}
            />
            <figcaption className="mt-2 text-sm text-muted">{lesson.demo.caption}</figcaption>
          </figure>
        )}
      </div>
      <ol className="grid gap-4 md:grid-cols-2">
        {lesson.drills.map((d) => (
          <li key={d.id}>
            {d.kind === "square" && <SquareDrill drill={d} solved={!!solved[d.id]} />}
            {d.kind === "find" && <FindDrill drill={d} solved={!!solved[d.id]} />}
            {d.kind === "play" && <PlayDrill drill={d} solved={!!solved[d.id]} />}
          </li>
        ))}
      </ol>
    </section>
  );
}

function DrillFrame({ solved, title, children }: { solved: boolean; title: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "h-full space-y-3 rounded-2xl border-2 p-4",
        solved ? "border-mint/50 bg-mint-soft/40" : "border-line",
      )}
    >
      <p className="font-black">
        {solved && (
          <span className="mr-1 text-mint" aria-hidden>
            ✓
          </span>
        )}
        {title}
      </p>
      {children}
    </div>
  );
}

/** «Догонит ли король пешку?» — ответ кнопкой, потом показываем квадрат. */
function SquareDrill({ drill, solved }: { drill: EndgameDrill; solved: boolean }) {
  const t = useT();
  const [answer, setAnswer] = useState<boolean | null>(null);
  const truth = kingCatches(drill.fen);
  const marks: Record<string, SquareMark> = {};
  if (answer !== null) for (const sq of pawnSquare(drill.fen)) marks[sq] = "good";
  const choose = (catches: boolean) => {
    setAnswer(catches);
    if (catches === truth) {
      chessEndgameSolved(drill.id);
      cue("praise-chess");
    } else cue("retry-chess");
  };
  return (
    <DrillFrame solved={solved} title={drill.prompt}>
      <ChessBoard id={drill.id} position={drill.fen} marks={marks} maxWidth={360} label={drill.prompt} />
      {answer === null ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => choose(true)}>
            👑 {t("Догонит", "Yetib oladi")}
          </Button>
          <Button variant="secondary" onClick={() => choose(false)}>
            🏃 {t("Не догонит", "Yetib ololmaydi")}
          </Button>
        </div>
      ) : (
        <div role="status" className="space-y-2">
          <p className={cn("font-black", answer === truth ? "text-[#047857]" : "text-[#b45309]")}>
            {answer === truth
              ? t("Верно!", "Toʻgʻri!")
              : truth
                ? t("Не совсем: король догонит.", "Unchalik emas: shoh yetib oladi.")
                : t("Не совсем: король не догонит.", "Unchalik emas: shoh yetib ololmaydi.")}
          </p>
          <p className="text-sm">{drill.why}</p>
          <Button variant="ghost" size="sm" onClick={() => setAnswer(null)}>
            ↺ {t("Ещё раз", "Yana bir bor")}
          </Button>
        </div>
      )}
    </DrillFrame>
  );
}

/** Найди единственный верный ход: проверка по точной таблице. */
function FindDrill({ drill, solved }: { drill: EndgameDrill; solved: boolean }) {
  const t = useT();
  const san = useSan();
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<{ ok: boolean; san: string; uci: string } | null>(null);
  const [hint, setHint] = useState(false);
  const turn = drill.fen.split(" ")[1] as "w" | "b";
  const good = bestMoves(drill.fen);

  const tryMove = (from: string, to: string): boolean => {
    if (result?.ok) return false;
    const played = playMove(drill.fen, from, to, "q");
    if (!played) return false;
    const ok = good.includes(played.uci);
    setResult({ ok, san: played.san, uci: played.uci });
    setSelected(null);
    if (ok) {
      chessEndgameSolved(drill.id);
      cue("praise-chess");
    } else cue("retry-chess");
    return true;
  };
  const tap = (sq: string) => {
    if (result?.ok) return;
    if (result && !result.ok) setResult(null);
    const p = pieceAt(drill.fen, sq);
    if (p && p.color === turn) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected) tryMove(selected, sq);
  };

  const position = result?.ok
    ? (playMove(drill.fen, result.uci.slice(0, 2), result.uci.slice(2, 4))?.fen ?? drill.fen)
    : drill.fen;
  const marks: Record<string, SquareMark> = {};
  if (selected) {
    marks[selected] = "selected";
    for (const sq of legalTargets(drill.fen, selected)) marks[sq] = "target";
  }
  if (result) {
    marks[result.uci.slice(0, 2)] = result.ok ? "good" : "bad";
    marks[result.uci.slice(2, 4)] = result.ok ? "good" : "bad";
  }
  return (
    <DrillFrame solved={solved} title={drill.prompt}>
      <ChessBoard
        id={drill.id}
        position={position}
        marks={marks}
        onSquare={tap}
        onDrop={tryMove}
        draggable={!result?.ok}
        orientation={turn === "w" ? "white" : "black"}
        maxWidth={440}
        label={drill.prompt}
      />
      {result?.ok ? (
        <p role="status" className="text-sm">
          <b className="text-[#047857]">{t("Верно!", "Toʻgʻri!")}</b> {drill.why}
        </p>
      ) : result ? (
        <p role="status" className="text-sm font-bold text-[#b45309]">
          {turn === drillStrongSide(drill.fen)
            ? t(
                `${san(result.san)} — после этого хода победа ускользает. Попробуй другой.`,
                `${san(result.san)} — bu yurishdan keyin gʻalaba qoʻldan ketadi. Boshqasini sinab koʻr.`,
              )
            : t(
                `${san(result.san)} — после этого хода белые выигрывают. Попробуй другой.`,
                `${san(result.san)} — bu yurishdan keyin oqlar yutadi. Boshqasini sinab koʻr.`,
              )}
        </p>
      ) : (
        <p className="text-sm text-muted">
          {t("Нажми на фигуру, потом на клетку — или перетащи.", "Donani, keyin katakni bos — yoki surib olib bor.")}
        </p>
      )}
      {!result?.ok && drill.hint && (
        <div>
          {hint ? (
            <p className="rounded-xl bg-sun-soft px-3 py-2 text-sm font-semibold">💡 {drill.hint}</p>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setHint(true)}>
              💡 {t("Подсказка", "Maslahat")}
            </Button>
          )}
        </div>
      )}
    </DrillFrame>
  );
}

function drillStrongSide(fen: string): "w" | "b" {
  const board = fen.split(" ")[0];
  return board.includes("P") ? "w" : "b";
}

type PlayState = "playing" | "won" | "lost";

/** Игра с роботом, который знает позицию наизусть. */
function PlayDrill({ drill, solved }: { drill: EndgameDrill; solved: boolean }) {
  const t = useT();
  const lang = useLang();
  const san = useSan();
  const me = drill.fen.split(" ")[1] as "w" | "b";
  const [history, setHistory] = useState<{ fen: string; san: string; uci: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<PlayState>("playing");
  const [slip, setSlip] = useState(false);
  const [hint, setHint] = useState(false);
  const fen = history.length ? history[history.length - 1].fen : drill.fen;
  const turn = fen.split(" ")[1] as "w" | "b";
  const myMoves = history.filter((_, i) => i % 2 === 0).length;
  const robotThinking = state === "playing" && turn !== me;

  // Ход робота — после паузы, чтобы ребёнок успел увидеть свой ход.
  useEffect(() => {
    if (!robotThinking) return;
    const id = setTimeout(() => {
      const uci = robotMove(fen);
      if (!uci) return;
      const played = playMove(fen, uci.slice(0, 2), uci.slice(2, 4), "q");
      if (!played) return;
      setHistory((h) => [...h, { fen: played.fen, san: played.san, uci: played.uci }]);
      if (drill.goal === "hold" && played.uci.length === 5) setState("lost");
    }, 450);
    return () => clearTimeout(id);
  }, [robotThinking, fen, drill.goal]);

  const tryMove = (from: string, to: string): boolean => {
    if (state !== "playing" || turn !== me) return false;
    const chess = new Chess(fen);
    const legal = chess.moves({ verbose: true }).find((m) => m.from === from && m.to === to);
    if (!legal) return false;
    const outcome = moveOutcome(fen, legal);
    const played = playMove(fen, from, to, "q");
    if (!played) return false;
    setHistory((h) => [...h, { fen: played.fen, san: played.san, uci: played.uci }]);
    setSelected(null);
    if (drill.goal === "promote") {
      if (legal.promotion && outcome === "win") win();
      else if (outcome !== "win") setSlip(true);
    } else {
      if (outcome === "loss") setSlip(true);
      else if (legal.captured || played.stalemate || myMoves + 1 >= 12) win();
    }
    return true;
  };
  const win = () => {
    setState("won");
    chessEndgameSolved(drill.id);
    cue("praise-chess");
  };
  const tap = (sq: string) => {
    if (state !== "playing" || turn !== me) return;
    const p = pieceAt(fen, sq);
    if (p && p.color === me) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected) tryMove(selected, sq);
  };
  const restart = () => {
    setHistory([]);
    setState("playing");
    setSlip(false);
    setSelected(null);
  };
  const undo = () => {
    // Возвращаем свой ход (и ответ робота, если он уже успел).
    setHistory((h) => h.slice(0, Math.max(0, h.length - (h.length % 2 === 0 ? 2 : 1))));
    setSlip(false);
    setState("playing");
  };

  const marks: Record<string, SquareMark> = {};
  const last = history[history.length - 1];
  if (last) {
    marks[last.uci.slice(0, 2)] = "last";
    marks[last.uci.slice(2, 4)] = "last";
  }
  if (selected) {
    marks[selected] = "selected";
    for (const sq of legalTargets(fen, selected)) marks[sq] = "target";
  }

  const status =
    state === "won"
      ? drill.why
      : slip
        ? drill.goal === "promote"
          ? t(
              "Ой! Теперь робот удержит ничью. Верни ход или начни заново.",
              "Voy! Endi robot durangni ushlab qoladi. Yurishni qaytar yoki qaytadan boshla.",
            )
          : t(
              "Ой! Теперь белые выигрывают. Верни ход или начни заново.",
              "Voy! Endi oqlar yutadi. Yurishni qaytar yoki qaytadan boshla.",
            )
        : state === "lost"
          ? t("Пешка стала ферзём — попробуй ещё раз.", "Piyoda farzin boʻldi — yana bir bor urinib koʻr.")
          : robotThinking
            ? t("Робот думает…", "Robot oʻylayapti…")
            : drill.goal === "hold"
              ? t(
                  `Твой ход. Продержись ещё ${Math.max(0, 12 - myMoves)} ходов.`,
                  `Sening yurishing. Yana ${Math.max(0, 12 - myMoves)} ta yurish chida.`,
                )
              : t("Твой ход.", "Sening yurishing.");

  return (
    <DrillFrame solved={solved} title={drill.prompt}>
      <div className="flex items-center gap-2 text-sm font-bold text-muted">
        <PieceIcon piece={me === "w" ? "wK" : "bK"} className="h-6 w-6" />
        {me === "w"
          ? t("Ты играешь белыми", "Sen oqlar bilan oʻynaysan")
          : t("Ты играешь чёрными", "Sen qoralar bilan oʻynaysan")}
      </div>
      <ChessBoard
        id={drill.id}
        position={fen}
        marks={marks}
        onSquare={tap}
        onDrop={tryMove}
        draggable={state === "playing" && turn === me}
        orientation={me === "w" ? "white" : "black"}
        maxWidth={440}
        label={drill.prompt}
      />
      <p
        role="status"
        aria-live="polite"
        className={cn("text-sm font-bold", state === "won" && "text-[#047857]", slip && "text-[#b45309]")}
      >
        {state === "won" && "🎉 "}
        {status}
      </p>
      {history.length > 0 && (
        <p className="text-xs text-muted" lang={lang}>
          {history.map((h, i) => `${i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ""}${san(h.san)}`).join(" ")}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {(slip || state === "lost") && history.length > 0 && (
          <Button variant="secondary" size="sm" onClick={undo}>
            ↶ {t("Вернуть ход", "Yurishni qaytarish")}
          </Button>
        )}
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={restart}>
            ↺ {t("Начать заново", "Qaytadan boshlash")}
          </Button>
        )}
        {state === "playing" && drill.hint && !hint && (
          <Button variant="ghost" size="sm" onClick={() => setHint(true)}>
            💡 {t("Подсказка", "Maslahat")}
          </Button>
        )}
      </div>
      {hint && state === "playing" && (
        <p className="rounded-xl bg-sun-soft px-3 py-2 text-sm font-semibold">💡 {drill.hint}</p>
      )}
    </DrillFrame>
  );
}
