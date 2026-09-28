"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink, cn } from "@/components/ui";
import { isInCheck, legalTargets, pieceAt, playMove, type Color } from "@/lib/chess";
import { pawnBattleBest, robotLevels, robotMove, searchBest } from "@/lib/engine/search";
import { useLang, useSan, useT } from "@/lib/i18n";
import {
  capturedPieces,
  clockLabel,
  endgameText,
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
  type PlayStatus,
} from "@/lib/play";
import { pluralize } from "@/lib/plural";
import { random } from "@/lib/random";
import { cheer } from "@/lib/voice";
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
  const t = useT();
  const lang = useLang();
  const san = useSan();
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
  const status: PlayStatus = resigned
    ? {
        over: true,
        winner: config.color === "w" ? ("b" as const) : ("w" as const),
        reason: t("Ты сдался. Ничего страшного — сыграем ещё!", "Sen taslim boʻlding. Hechqisi yoʻq — yana oʻynaymiz!"),
      }
    : flag
      ? {
          over: true,
          winner: flag === "w" ? ("b" as const) : ("w" as const),
          reason: t(
            `Время ${flag === "w" ? "белых" : "чёрных"} вышло!`,
            `${flag === "w" ? "Oqlar" : "Qoralar"}ning vaqti tugadi!`,
          ),
        }
      : playStatus(config.mode, fen, positions, lang);
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
    if (status.mate && (!withRobot || status.winner === config.color)) cheer("mate");
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
  }, [status.over, status.winner, status.mate, withRobot, config, myMoves, gameId, start, plies]);

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
    for (const sq of legalTargets(fen, selected)) marks[sq] = pieceAt(fen, sq) ? "capture" : "target";
  }
  const orientation = (config.color === "b") !== flipped ? "black" : "white";

  const robot = robotLevels(lang)[config.level - 1];
  const variant = config.variant ? endgameText(config.variant, lang) : undefined;
  const title =
    config.mode === "robot"
      ? t(`Робот «${robot?.name ?? ""}»`, `Robot «${robot?.name ?? ""}»`)
      : config.mode === "two"
        ? t("Партия вдвоём", "Ikki kishilik partiya")
        : config.mode === "pawns"
          ? t("Пешечный бой", "Piyodalar jangi")
          : (variant?.name ?? t("Тренировка", "Mashq"));
  const topSide: Color = orientation === "white" ? "b" : "w";
  const clockBox = (side: Color) =>
    config.clock ? (
      <div
        className={cn(
          "ml-auto rounded-xl px-3 py-1 font-mono text-xl font-black tabular-nums",
          clockRunning && turn === side ? "bg-ink text-white" : "bg-white text-ink shadow-card",
          clock[side] < 20_000 && "text-rose",
        )}
        aria-label={t(`Часы ${side === "w" ? "белых" : "чёрных"}`, `${side === "w" ? "Oqlar" : "Qoralar"}ning soati`)}
      >
        {formatClock(clock[side])}
      </div>
    ) : null;

  const sideName = (side: Color | undefined) =>
    t(side === "w" ? "белые" : "чёрные", side === "w" ? "Oqlar" : "Qoralar");
  const statusText = status.over
    ? status.winner === "draw"
      ? `🤝 ${status.reason}`
      : withRobot
        ? status.winner === config.color
          ? t(`🏆 Победа! ${status.reason}`, `🏆 Gʻalaba! ${status.reason}`)
          : t(`${status.reason} Робот выиграл — сыграем ещё?`, `${status.reason} Robot yutdi — yana oʻynaymizmi?`)
        : t(
            `🏆 ${status.reason} Победили ${sideName(status.winner)}.`,
            `🏆 ${status.reason} ${sideName(status.winner)} yutdi.`,
          )
    : thinking
      ? t("🤖 Робот думает…", "🤖 Robot oʻylayapti…")
      : inCheck
        ? t(`⚠️ Шах! Ходят ${sideName(turn)}.`, `⚠️ Shoh! ${sideName(turn)} yuradi.`)
        : withRobot
          ? t("🙂 Твой ход", "🙂 Navbat senda")
          : t(`Ходят ${sideName(turn)}`, `${sideName(turn)} yuradi`);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-black">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onExit}>
            ← {t("Выбрать другой режим", "Boshqa rejimni tanlash")}
          </Button>
        </div>
        {(config.odds || config.clock) && (
          <p className="text-sm font-bold text-muted">
            {config.odds && t(`🎁 Фора: ${oddsLabel(config.odds)}. `, `🎁 Fora: ${oddsLabel(config.odds, lang)}. `)}
            {config.clock &&
              t(`⏱ ${clockLabel(config.clock)} на партию.`, `⏱ Partiyaga ${clockLabel(config.clock, lang)}.`)}
          </p>
        )}
        <div className="flex items-center gap-2">
          <CapturedRow
            pieces={orientation === "white" ? captured.w : captured.b}
            label={t("Взято у соперника сверху", "Raqibdan olingan donalar (yuqorida)")}
          />
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
          <CapturedRow
            pieces={orientation === "white" ? captured.b : captured.w}
            label={t("Взято у соперника снизу", "Raqibdan olingan donalar (pastda)")}
          />
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
            🔎{" "}
            {t(
              "Разбор партии: где были ошибки и лучшие ходы",
              "Partiya tahlili: qayerda xato, qayerda eng yaxshi yurish boʻlgan",
            )}
          </ButtonLink>
        )}
      </div>

      <aside className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={showHint} disabled={!myTurn || status.over || thinking}>
            💡 {t("Подсказка", "Maslahat")}
            {hints ? ` (${hints})` : ""}
          </Button>
          <Button variant="secondary" size="sm" onClick={undo} disabled={plies.length === 0 || thinking}>
            ↶ {t("Отменить", "Ortga qaytarish")}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setFlipped((f) => !f)}>
            🔄 {t("Перевернуть", "Taxtani aylantirish")}
          </Button>
          {withRobot && !status.over && (
            <Button variant="ghost" size="sm" onClick={() => setResigned(true)} disabled={plies.length === 0}>
              🏳️ {t("Сдаться", "Taslim boʻlish")}
            </Button>
          )}
          <Button size="sm" onClick={restart}>
            ↺ {t("Новая партия", "Yangi partiya")}
          </Button>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-card">
          <p className="mb-2 text-sm font-extrabold text-muted">
            {t("Ходы", "Yurishlar")} ·{" "}
            {t(movesWord(Math.ceil(plies.length / 2)), `${Math.ceil(plies.length / 2)} ta yurish`)}
            {config.variant &&
              t(` · цель: до ${config.variant.target}`, ` · maqsad: ${config.variant.target} yurishgacha`)}
          </p>
          <ol
            className="grid max-h-72 grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 overflow-y-auto text-[0.95rem]"
            aria-label={t("Список ходов", "Yurishlar roʻyxati")}
          >
            {Array.from({ length: Math.ceil(plies.length / 2) }, (_, i) => (
              <li key={i} className="contents">
                <span className="text-muted">{i + 1}.</span>
                <span className="font-bold">{san(plies[2 * i].san)}</span>
                <span className="font-bold">{plies[2 * i + 1] ? san(plies[2 * i + 1].san) : ""}</span>
              </li>
            ))}
          </ol>
          {plies.length === 0 && (
            <p className="text-sm text-muted">{t("Партия ещё не началась.", "Partiya hali boshlanmadi.")}</p>
          )}
        </div>
        {config.mode === "robot" && <p className="text-sm font-bold text-muted">{robot?.about}</p>}
        {config.mode === "endgame" && (
          <p className="text-sm font-bold text-muted">
            {variant?.about}{" "}
            {t(
              "Если получится пат — партия закончится вничью, и её придётся начать заново.",
              "Agar pat boʻlib qolsa — partiya durang bilan tugaydi va uni qaytadan boshlashga toʻgʻri keladi.",
            )}
          </p>
        )}
        {config.mode === "pawns" && (
          <p className="text-sm font-bold text-muted">
            {t(
              "Только пешки! Кто первым доведёт пешку до последней горизонтали — победил. Если ходить нечем — проиграл.",
              "Faqat piyodalar! Kim piyodasini birinchi boʻlib oxirgi gorizontalga olib borsa — oʻsha yutadi. Yurishga imkoni qolmagan tomon yutqazadi.",
            )}
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
