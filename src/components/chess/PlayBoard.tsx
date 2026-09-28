"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink, cn } from "@/components/ui";
import { isInCheck, legalTargets, pieceAt, playMove, ruSan, type Color } from "@/lib/chess";
import { ROBOT_LEVELS, pawnBattleBest, robotMove, searchBest } from "@/lib/engine/search";
import {
  capturedPieces,
  clockLabel,
  formatClock,
  kingOf,
  oddsLabel,
  playStatus,
  startFen,
  withOdds,
  type ClockSetting,
  type EndgameVariant,
  type Odds,
  type PlayMode,
} from "@/lib/play";
import { pluralize } from "@/lib/plural";
import { random } from "@/lib/random";
import { recordChessGame } from "@/lib/store";
import { ChessBoard, PieceIcon, type SquareMark } from "./ChessBoard";

export interface PlayConfig {
  mode: PlayMode;
  /** Уровень робота 1–5. */
  level: number;
  /** За кого играет ребёнок. */
  color: Color;
  variant?: EndgameVariant;
  /** Шахматные часы (только вдвоём). */
  clock?: ClockSetting;
  /** Фора: одна сторона играет без фигуры. */
  odds?: Odds;
}

const newGameId = () => `g${Math.floor(random() * 36 ** 8).toString(36)}`;

function initialFen(config: PlayConfig): string {
  const fen = startFen(config.mode, config.variant);
  return config.odds ? withOdds(fen, config.odds) : fen;
}

interface Ply {
  san: string;
  uci: string;
  fen: string;
}

const movesWord = (n: number) => pluralize(n, "ход", "хода", "ходов");

/** Ход робота для режима. */
function computerMove(config: PlayConfig, fen: string): string | null {
  if (config.mode === "pawns") return pawnBattleBest(fen, Math.min(2 + config.level, 6));
  if (config.mode === "endgame") return searchBest(fen, { depth: 3, timeMs: 700 }).uci;
  return robotMove(fen, config.level);
}

export function PlayBoard({ config, onExit }: { config: PlayConfig; onExit: () => void }) {
  const [start, setStart] = useState(() => initialFen(config));
  const [gameId, setGameId] = useState(newGameId);
  const clockMs = config.clock ? config.clock.base * 60_000 : 0;
  const [clock, setClock] = useState({ w: clockMs, b: clockMs });
  const [flag, setFlag] = useState<Color | null>(null);
  const lastTick = useRef(0);
  const [plies, setPlies] = useState<Ply[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [thinking, setThinking] = useState(config.mode !== "two" && config.color === "b");
  const [hint, setHint] = useState<string | null>(null);
  const [hints, setHints] = useState(0);
  const [resigned, setResigned] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const recorded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fen = plies.length ? plies[plies.length - 1].fen : start;
  const turn = fen.split(" ")[1] as Color;
  const withRobot = config.mode !== "two";
  const myTurn = !withRobot || turn === config.color;
  const positions = [start, ...plies.map((p) => p.fen)];
  const status = resigned
    ? {
        over: true,
        winner: config.color === "w" ? ("b" as const) : ("w" as const),
        reason: "Ты сдался. Ничего страшного — сыграем ещё!",
      }
    : flag
      ? {
          over: true,
          winner: flag === "w" ? ("b" as const) : ("w" as const),
          reason: `Время ${flag === "w" ? "белых" : "чёрных"} вышло!`,
        }
      : playStatus(config.mode, fen, positions);
  const clockRunning = !!config.clock && !status.over && plies.length > 0;

  // Часы: идут у той стороны, чей ход, начиная с первого хода белых.
  useEffect(() => {
    if (!clockRunning) return;
    lastTick.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = now - lastTick.current;
      lastTick.current = now;
      setClock((c) => {
        const left = Math.max(0, c[turn] - dt);
        if (left === 0) setFlag(turn);
        return { ...c, [turn]: left };
      });
    }, 100);
    return () => clearInterval(id);
  }, [clockRunning, turn]);
  const last = plies[plies.length - 1];
  const inCheck = !status.over && isInCheck(fen);
  const captured = capturedPieces(fen);
  const myMoves = withRobot ? Math.ceil(plies.length / 2) : plies.length;

  // Ход робота — чуть погодя, чтобы ребёнок увидел свой ход.
  useEffect(() => {
    if (!withRobot || myTurn || status.over) return;
    timer.current = setTimeout(() => {
      const uci = computerMove(config, fen);
      setThinking(false);
      if (!uci) return;
      const played = playMove(fen, uci.slice(0, 2), uci.slice(2, 4), "q");
      if (played) setPlies((p) => [...p, { san: played.san, uci: played.uci, fen: played.fen }]);
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, myTurn, withRobot, status.over]);

  // Запоминаем результат один раз — вместе с ходами, чтобы потом разобрать партию.
  useEffect(() => {
    if (!status.over || recorded.current || plies.length === 0) return;
    recorded.current = true;
    recordChessGame({
      id: gameId,
      mode: config.mode,
      level: config.mode === "robot" || config.mode === "pawns" ? config.level : undefined,
      variant: config.variant?.id,
      color: config.color,
      result: status.winner === "draw" ? "draw" : status.winner === config.color ? "win" : "loss",
      winner: status.winner,
      moves: myMoves,
      start,
      ucis: plies.map((p) => p.uci),
      clock: config.clock?.id,
      odds: config.odds ? `${config.odds.side}${config.odds.piece}` : undefined,
    });
  }, [status.over, status.winner, config, myMoves, gameId, start, plies]);

  const tryMove = (from: string, to: string): boolean => {
    if (!myTurn || status.over || thinking) return false;
    const played = playMove(fen, from, to, "q");
    if (!played) return false;
    setPlies((p) => [...p, { san: played.san, uci: played.uci, fen: played.fen }]);
    if (config.clock && plies.length > 0) setClock((c) => ({ ...c, [turn]: c[turn] + config.clock!.inc * 1000 }));
    setSelected(null);
    setHint(null);
    if (withRobot) setThinking(true);
    return true;
  };

  const tap = (sq: string) => {
    if (!myTurn || status.over || thinking) return;
    const piece = pieceAt(fen, sq);
    if (piece && piece.color === turn) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected) tryMove(selected, sq);
  };

  const undo = () => {
    if (thinking) return;
    // С роботом отменяем и его ответ, чтобы снова был ход ребёнка.
    const back = withRobot && plies.length >= 2 && turn === config.color ? 2 : 1;
    setPlies((p) => p.slice(0, -back));
    setSelected(null);
    setHint(null);
    setResigned(false);
    setThinking(false);
  };

  const showHint = () => {
    if (!myTurn || status.over) return;
    const uci = config.mode === "pawns" ? pawnBattleBest(fen, 4) : searchBest(fen, { depth: 3, timeMs: 800 }).uci;
    setHint(uci);
    setHints((h) => h + 1);
  };

  const restart = () => {
    setStart(initialFen(config));
    setGameId(newGameId());
    setClock({ w: clockMs, b: clockMs });
    setFlag(null);
    setPlies([]);
    setSelected(null);
    setHint(null);
    setHints(0);
    setResigned(false);
    setThinking(withRobot && config.color === "b");
    recorded.current = false;
  };

  const marks: Record<string, SquareMark> = {};
  if (last) {
    marks[last.uci.slice(0, 2)] = "last";
    marks[last.uci.slice(2, 4)] = "last";
  }
  if (inCheck) {
    const k = kingOf(fen, turn);
    if (k) marks[k] = "check";
  }
  if (selected) {
    marks[selected] = "selected";
    for (const t of legalTargets(fen, selected)) marks[t] = pieceAt(fen, t) ? "capture" : "target";
  }
  const orientation = (config.color === "b") !== flipped ? "black" : "white";

  const title =
    config.mode === "robot"
      ? `Робот «${ROBOT_LEVELS[config.level - 1]?.name ?? ""}»`
      : config.mode === "two"
        ? "Партия вдвоём"
        : config.mode === "pawns"
          ? "Пешечный бой"
          : (config.variant?.name ?? "Тренировка");
  const topSide: Color = orientation === "white" ? "b" : "w";
  const clockBox = (side: Color) =>
    config.clock ? (
      <div
        className={cn(
          "ml-auto rounded-xl px-3 py-1 font-mono text-xl font-black tabular-nums",
          clockRunning && turn === side ? "bg-ink text-white" : "bg-white text-ink shadow-card",
          clock[side] < 20_000 && "text-rose",
        )}
        aria-label={`Часы ${side === "w" ? "белых" : "чёрных"}`}
      >
        {formatClock(clock[side])}
      </div>
    ) : null;

  const statusText = status.over
    ? status.winner === "draw"
      ? `🤝 ${status.reason}`
      : withRobot
        ? status.winner === config.color
          ? `🏆 Победа! ${status.reason}`
          : `${status.reason} Робот выиграл — сыграем ещё?`
        : `🏆 ${status.reason} Победили ${status.winner === "w" ? "белые" : "чёрные"}.`
    : thinking
      ? "🤖 Робот думает…"
      : inCheck
        ? `⚠️ Шах! Ходят ${turn === "w" ? "белые" : "чёрные"}.`
        : withRobot
          ? "🙂 Твой ход"
          : `Ходят ${turn === "w" ? "белые" : "чёрные"}`;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-black">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onExit}>
            ← Выбрать другой режим
          </Button>
        </div>
        {(config.odds || config.clock) && (
          <p className="text-sm font-bold text-muted">
            {config.odds && `🎁 Фора: ${oddsLabel(config.odds)}. `}
            {config.clock && `⏱ ${clockLabel(config.clock)} на партию.`}
          </p>
        )}
        <div className="flex items-center gap-2">
          <CapturedRow pieces={orientation === "white" ? captured.w : captured.b} label="Взято у соперника сверху" />
          {clockBox(topSide)}
        </div>
        <ChessBoard
          id="play"
          position={fen}
          marks={marks}
          orientation={orientation}
          onSquare={tap}
          draggable={myTurn && !status.over && !thinking}
          onDrop={(from, to) => tryMove(from, to)}
          arrows={hint ? [{ from: hint.slice(0, 2), to: hint.slice(2, 4), color: "#10b981" }] : []}
          maxWidth={520}
        />
        <div className="flex items-center gap-2">
          <CapturedRow pieces={orientation === "white" ? captured.b : captured.w} label="Взято у соперника снизу" />
          {clockBox(topSide === "w" ? "b" : "w")}
        </div>
        <p
          className={cn(
            "rounded-2xl px-4 py-3 text-lg font-black",
            status.over ? "bg-sun-soft text-[#7a4b00]" : inCheck ? "bg-rose/10 text-rose" : "bg-white shadow-card",
          )}
          aria-live="polite"
        >
          {statusText}
        </p>
        {status.over && (config.mode === "robot" || config.mode === "two") && plies.length > 1 && (
          <ButtonLink href={`/chess/review#${gameId}`} variant="sun">
            🔎 Разбор партии: где были ошибки и лучшие ходы
          </ButtonLink>
        )}
      </div>

      <aside className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={showHint} disabled={!myTurn || status.over || thinking}>
            💡 Подсказка{hints ? ` (${hints})` : ""}
          </Button>
          <Button variant="secondary" size="sm" onClick={undo} disabled={plies.length === 0 || thinking}>
            ↶ Отменить
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setFlipped((f) => !f)}>
            🔄 Перевернуть
          </Button>
          {withRobot && !status.over && (
            <Button variant="ghost" size="sm" onClick={() => setResigned(true)} disabled={plies.length === 0}>
              🏳️ Сдаться
            </Button>
          )}
          <Button size="sm" onClick={restart}>
            ↺ Новая партия
          </Button>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-card">
          <p className="mb-2 text-sm font-extrabold text-muted">
            Ходы · {movesWord(Math.ceil(plies.length / 2))}
            {config.variant && ` · цель: до ${config.variant.target}`}
          </p>
          <ol
            className="grid max-h-72 grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 overflow-y-auto text-[0.95rem]"
            aria-label="Список ходов"
          >
            {Array.from({ length: Math.ceil(plies.length / 2) }, (_, i) => (
              <li key={i} className="contents">
                <span className="text-muted">{i + 1}.</span>
                <span className="font-bold">{ruSan(plies[2 * i].san)}</span>
                <span className="font-bold">{plies[2 * i + 1] ? ruSan(plies[2 * i + 1].san) : ""}</span>
              </li>
            ))}
          </ol>
          {plies.length === 0 && <p className="text-sm text-muted">Партия ещё не началась.</p>}
        </div>
        {config.mode === "robot" && (
          <p className="text-sm font-bold text-muted">{ROBOT_LEVELS[config.level - 1]?.about}</p>
        )}
        {config.mode === "endgame" && (
          <p className="text-sm font-bold text-muted">
            {config.variant?.about} Если получится пат — партия закончится вничью, и её придётся начать заново.
          </p>
        )}
        {config.mode === "pawns" && (
          <p className="text-sm font-bold text-muted">
            Только пешки! Кто первым доведёт пешку до последней горизонтали — победил. Если ходить нечем — проиграл.
          </p>
        )}
      </aside>
    </div>
  );
}

function CapturedRow({ pieces, label }: { pieces: string[]; label: string }) {
  return (
    <div className="flex h-7 items-center gap-0.5" aria-label={`${label}: ${pieces.length}`}>
      {pieces.map((p, i) => (
        <PieceIcon key={i} piece={p} className="h-6 w-6 opacity-80" />
      ))}
    </div>
  );
}
