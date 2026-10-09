"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink, cn } from "@/components/ui";
import {
  illegalReason,
  isInCheck,
  isPromotionMove,
  legalTargets,
  pieceAt,
  playMove,
  type Color,
  type PieceType,
} from "@/lib/chess";
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
import { crownsFromHelp, robotPersona } from "@/lib/crowns";
import { pluralize } from "@/lib/plural";
import { random } from "@/lib/random";
import { cheer } from "@/lib/voice";
import { recordChessGame, removeChessGame } from "@/lib/store";
import { ChessBoard, PieceIcon, type PromotionPiece, type SquareMark } from "./ChessBoard";
import { illegalText, usePromotion } from "./useMoveInput";

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
  const [undos, setUndos] = useState(0);
  const [resigned, setResigned] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  // Снимок прежней партии на 8 секунд после «Новая партия» — чтобы случайное нажатие не стоило партии.
  const [previous, setPrevious] = useState<{
    start: string;
    plies: Ply[];
    hints: number;
    undos: number;
    clock: { w: number; b: number };
    gameId: string;
  } | null>(null);
  const previousTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        reason: t("Партия закончена.", "Partiya tugadi."),
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
  const captured = capturedPieces(fen, start);
  const promo = usePromotion(fen);
  const [illegal, setIllegal] = useState<string | null>(null);
  const myMoves = withRobot ? Math.ceil(plies.length / 2) : plies.length;

  // Ход робота — чуть погодя, чтобы ребёнок увидел свой ход.
  useEffect(() => {
    if (!withRobot || myTurn || status.over) return;
    timer.current = setTimeout(() => {
      const uci = computerMove(config, fen);
      setThinking(false);
      if (!uci) return;
      const played = playMove(fen, uci.slice(0, 2), uci.slice(2, 4), (uci[4] as PieceType | undefined) ?? "q");
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
      ...(config.mode === "robot" ? { hints, undos } : {}),
    });
  }, [status.over, status.winner, status.mate, withRobot, config, myMoves, gameId, start, plies, hints, undos]);

  const tryMove = (from: string, to: string, promotion?: PromotionPiece): boolean => {
    if (!myTurn || status.over || thinking) return false;
    if (!promotion && isPromotionMove(fen, from, to)) {
      promo.ask(to, turn, (piece) => tryMove(from, to, piece));
      return true;
    }
    const played = playMove(fen, from, to, promotion ?? "q");
    if (!played) {
      const reason = illegalReason(fen, from, to);
      setIllegal(reason ? illegalText(reason, t) : null);
      return false;
    }
    setIllegal(null);
    setPlies((p) => [...p, { san: played.san, uci: played.uci, fen: played.fen }]);
    if (config.clock && plies.length > 0) setClock((c) => ({ ...c, [turn]: c[turn] + config.clock!.inc * 1000 }));
    setSelected(null);
    setHint(null);
    if (withRobot) setThinking(true);
    return true;
  };

  const tap = (sq: string): boolean | void => {
    if (!myTurn || status.over || thinking) return;
    const piece = pieceAt(fen, sq);
    if (piece && piece.color === turn) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (!selected || tryMove(selected, sq)) return;
    setSelected(null);
    // Ход нельзя сделать из-за короля — подсказываем почему; просто мимо — тихо снимаем выбор.
    if (illegalReason(fen, selected, sq)) return false;
  };

  const undo = () => {
    if (thinking) return;
    // С роботом отменяем и его ответ, чтобы снова был ход ребёнка.
    const back = withRobot && plies.length >= 2 && turn === config.color ? 2 : 1;
    if (!status.over) setUndos((u) => u + 1);
    // Партия уже записана (сдача, мат, время), а ребёнок вернул ход: запись снимаем, иначе потеряется настоящий итог.
    if (recorded.current) {
      removeChessGame(gameId);
      recorded.current = false;
    }
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
    if (plies.length >= 2 && !status.over) {
      setPrevious({ start, plies, hints, undos, clock, gameId });
      if (previousTimer.current) clearTimeout(previousTimer.current);
      previousTimer.current = setTimeout(() => setPrevious(null), 8000);
    }
    setConfirmEnd(false);
    setStart(initialFen(config));
    setGameId(newGameId());
    setClock({ w: clockMs, b: clockMs });
    setFlag(null);
    setPlies([]);
    setSelected(null);
    setHint(null);
    setHints(0);
    setUndos(0);
    setResigned(false);
    setThinking(withRobot && config.color === "b");
    recorded.current = false;
  };

  const restorePrevious = () => {
    if (!previous) return;
    if (previousTimer.current) clearTimeout(previousTimer.current);
    setStart(previous.start);
    setGameId(previous.gameId);
    setClock(previous.clock);
    setPlies(previous.plies);
    setHints(previous.hints);
    setUndos(previous.undos);
    setFlag(null);
    setResigned(false);
    setSelected(null);
    setHint(null);
    setThinking(false);
    recorded.current = false;
    setPrevious(null);
  };

  useEffect(
    () => () => {
      if (previousTimer.current) clearTimeout(previousTimer.current);
    },
    [],
  );

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
  // Трофеи игрока сверху — съеденные фигуры того, кто снизу, и наоборот.
  const topTrophies = orientation === "white" ? captured.w : captured.b;
  const bottomTrophies = orientation === "white" ? captured.b : captured.w;

  const robot = robotLevels(lang)[config.level - 1];
  const persona = config.mode === "robot" ? robotPersona(config.level, lang) : undefined;
  const robotSays = !persona
    ? null
    : !status.over
      ? persona.hello
      : status.winner === config.color
        ? persona.lost
        : status.winner === "draw"
          ? null
          : persona.won;
  const crowns =
    config.mode === "robot" && status.over && status.winner === config.color
      ? crownsFromHelp(hints + undos, !!config.odds)
      : 0;
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
            pieces={topTrophies}
            lead={worth(topTrophies) - worth(bottomTrophies)}
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
          canDrag={(_, piece) => piece[0] === turn}
          promotion={promo.request}
          arrows={hint ? [{ from: hint.slice(0, 2), to: hint.slice(2, 4), color: "#10b981" }] : []}
          maxWidth={520}
        />
        <div className="flex items-center gap-2">
          <CapturedRow
            pieces={bottomTrophies}
            lead={worth(bottomTrophies) - worth(topTrophies)}
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
        {illegal && (
          <p role="status" data-illegal className="rounded-2xl bg-rose/10 px-4 py-2 text-sm font-bold text-rose">
            {illegal}
          </p>
        )}
        {crowns > 0 && (
          <p className="rounded-2xl bg-sun-soft px-4 py-2 font-black text-[#7a4b00]" data-crowns={crowns}>
            <span className="mr-1 text-2xl">{"👑".repeat(crowns)}</span>
            {crowns === 3
              ? t(
                  "Три короны — победа без подсказок и отмен ходов!",
                  "Uchta toj — maslahatsiz va yurishni qaytarmasdan gʻalaba!",
                )
              : crowns === 2
                ? t(
                    "Две короны. Без подсказок и отмен ходов будет три!",
                    "Ikkita toj. Maslahat va yurishni qaytarishsiz uchta boʻladi!",
                  )
                : t(
                    "Одна корона. Чем меньше подсказок и отмен, тем больше корон.",
                    "Bitta toj. Maslahat va qaytarish qancha kam boʻlsa, toj shuncha koʻp.",
                  )}
          </p>
        )}
        {robotSays && robot && (
          <div className="flex items-start gap-2" data-robot-says>
            <PieceIcon piece={robot.piece} className="h-10 w-10 shrink-0 rounded-xl bg-[#f0d9b5] p-0.5" />
            <p className="rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm font-bold shadow-card">{robotSays}</p>
          </div>
        )}
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
            <Button variant="ghost" size="sm" onClick={() => setConfirmEnd(true)} disabled={plies.length === 0}>
              🏁 {t("Закончить партию", "Partiyani tugatish")}
            </Button>
          )}
          <Button size="sm" variant={status.over ? "primary" : "secondary"} onClick={restart}>
            ↺ {t("Новая партия", "Yangi partiya")}
          </Button>
        </div>
        {previous && (
          <p
            role="status"
            data-previous-game
            className="flex flex-wrap items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold shadow-card"
          >
            {t("Началась новая партия.", "Yangi partiya boshlandi.")}
            <Button size="sm" variant="soft" onClick={restorePrevious}>
              ↩ {t("Вернуть прежнюю", "Avvalgisini qaytarish")}
            </Button>
          </p>
        )}
        {confirmEnd && !status.over && (
          <div
            role="alertdialog"
            aria-labelledby="end-title"
            data-confirm-end
            className="space-y-3 rounded-2xl border-2 border-line bg-white p-4 shadow-card"
          >
            <p id="end-title" className="text-lg font-black">
              {t("Закончим партию?", "Partiyani tugatamizmi?")}
            </p>
            <p className="text-sm text-muted">
              {t("Партию можно будет разобрать.", "Partiyani keyin tahlil qilsa boʻladi.")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button autoFocus onClick={() => setConfirmEnd(false)}>
                {t("Играть дальше", "Davom etish")}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setConfirmEnd(false);
                  setResigned(true);
                }}
              >
                {t("Закончить", "Tugatish")}
              </Button>
            </div>
          </div>
        )}
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

const VALUE: Record<string, number> = { Q: 9, R: 5, B: 3, N: 3, P: 1 };

/** Съеденные фигуры: одинаковые — стопкой (×N), справа — перевес в очках (+3). */
function CapturedRow({ pieces, label, lead }: { pieces: string[]; label: string; lead: number }) {
  const groups: [string, number][] = [];
  for (const p of pieces) {
    const g = groups.find(([q]) => q === p);
    if (g) g[1]++;
    else groups.push([p, 1]);
  }
  return (
    <div
      className="flex h-7 min-w-0 flex-1 items-center gap-1.5 overflow-hidden"
      aria-label={`${label}: ${pieces.length}`}
    >
      {groups.map(([p, n]) => (
        <span key={p} className="flex shrink-0 items-center">
          <PieceIcon piece={p} className="h-6 w-6 opacity-80" />
          {n > 1 && <span className="text-xs font-black text-muted">×{n}</span>}
        </span>
      ))}
      {lead > 0 && <span className="shrink-0 text-sm font-black text-muted">+{lead}</span>}
    </div>
  );
}

/** Сумма очков съеденных фигур. */
const worth = (pieces: string[]) => pieces.reduce((s, p) => s + (VALUE[p[1]] ?? 0), 0);
