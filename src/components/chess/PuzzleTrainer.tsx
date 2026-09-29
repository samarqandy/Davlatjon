"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Feedback, type FeedbackState } from "@/components/answers/Feedback";
import { Button } from "@/components/ui";
import type { ChessPuzzle } from "@/content/chess/puzzles";
import { isInCheck, isPromotionMove, legalTargets, pieceAt, playMove, type Color, type PieceType } from "@/lib/chess";
import { matingMovesIn, searchBest } from "@/lib/engine/search";
import { useSan, useT } from "@/lib/i18n";
import { kingOf } from "@/lib/play";
import { pluralize } from "@/lib/plural";
import { judgeLineMove, playUci, solutionLine, type BankPuzzle } from "@/lib/puzzleBank";
import { starsFor } from "@/lib/puzzleRating";
import { chessPuzzleMiss, chessPuzzleRated, chessPuzzleSolved, getState } from "@/lib/store";
import { useChess } from "@/lib/useChess";
import { ChessBoard, type PromotionPiece, type SquareMark } from "./ChessBoard";
import { usePromotion } from "./useMoveInput";

const STARS = (n: number) => "⭐".repeat(n);

/** Задача школы (с текстами) или задача из базы Lichess. */
export type AnyPuzzle = ChessPuzzle | BankPuzzle;

export const isBankPuzzle = (p: AnyPuzzle): p is BankPuzzle => "moves" in p;

/** Ключ прогресса и React-ключ задачи. */
export const puzzleKey = (p: AnyPuzzle) => (isBankPuzzle(p) ? p.key : p.id);

interface Step {
  fen: string;
  /** Сколько ходов до мата осталось решающей стороне (0 — не мат или задача на один ход). */
  matesLeft: number;
  /** Задача из базы: номер ожидаемого хода в строке решения. */
  ply: number;
}

/** Принимаемые ходы задачи школы на текущем шаге. */
function acceptedMoves(puzzle: ChessPuzzle, step: Step): string[] {
  if (step.matesLeft > 0) return matingMovesIn(step.fen, step.matesLeft);
  return puzzle.solution ?? [];
}

const squares = (uci: string): [string, string] => [uci.slice(0, 2), uci.slice(2, 4)];

/**
 * Одна задача на доске. Задачи школы: мат в N — засчитывается любой ход, ведущий к мату (проверяет движок),
 * иначе — ходы из списка. Задачи Lichess: сначала ходит соперник, дальше — строка решения; ответы соперника
 * берутся из неё же, засчитывается и любой мат. Первая попытка задачи из базы меняет скрытый рейтинг (rated).
 */
export function PuzzlePlayer({
  puzzle,
  onSolved,
  onFailed,
  next,
  rated = true,
}: {
  puzzle: AnyPuzzle;
  onSolved?: (misses: number) => void;
  onFailed?: () => void;
  next?: { label: string; onClick: () => void };
  rated?: boolean;
}) {
  const t = useT();
  const san = useSan();
  const { puzzles, themes } = useChess();
  const bank = isBankPuzzle(puzzle) ? puzzle : null;
  const classic = isBankPuzzle(puzzle) ? null : puzzle;
  const key = puzzleKey(puzzle);
  // Первый ход соперника в задаче из базы.
  const intro = useMemo(() => (bank ? playUci(bank.fen, bank.moves[0]) : null), [bank]);
  const line = useMemo(() => bank?.moves.slice(1) ?? [], [bank]);
  // Тексты: у задач школы — свои (на языке интерфейса; задачи из партий ребёнка — как есть), у задач из базы — от темы.
  const theme = themes.find((x) => x.id === (bank?.theme ?? classic?.theme));
  const text = classic
    ? (puzzles.find((p) => p.id === classic.id) ?? classic)
    : { title: theme?.name ?? "", hint: theme?.hint ?? "", explanation: "", source: `Lichess · ${bank!.id}` };
  const start: Step = {
    fen: intro?.fen ?? puzzle.fen,
    matesLeft: bank ? bank.mate : (classic!.mateIn ?? 0),
    ply: 0,
  };
  const solver = start.fen.split(" ")[1] as Color;
  const [step, setStep] = useState<Step>(start);
  const [shown, setShown] = useState(puzzle.fen);
  const [selected, setSelected] = useState<string | null>(null);
  const [last, setLast] = useState<[string, string] | null>(null);
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failed = useRef(false);
  const ratedOnce = useRef(false);
  // Последний ход соперника: после неверной попытки подсветка возвращается к нему.
  const oppLast = useRef<[string, string] | null>(null);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  // Задача из базы начинается с хода соперника: показываем позицию до него, потом сам ход.
  useEffect(() => {
    if (!bank || !intro) return;
    const id = setTimeout(() => {
      oppLast.current = squares(bank.moves[0]);
      setShown(intro.fen);
      setLast(oppLast.current);
      setFeedback({
        tone: "info",
        text: t(`Соперник сыграл ${san(intro.san)}. Твой ход!`, `Raqib ${san(intro.san)} yurdi. Navbat senda!`),
      });
    }, 700);
    return () => clearTimeout(id);
    // Ход соперника показываем один раз для каждой задачи.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank, intro]);

  const accepted = classic ? acceptedMoves(classic, step) : line[step.ply] ? [line[step.ply]] : [];
  const promo = usePromotion(shown);
  const hintFrom = misses >= 3 && accepted[0] ? accepted[0].slice(0, 2) : null;
  const hintTo = misses >= 4 && accepted[0] ? accepted[0].slice(2, 4) : null;

  /** Скрытый рейтинг меняет только первая попытка задачи, которую раньше не встречали. */
  const rateOnce = (win: boolean) => {
    if (!bank || !rated || ratedOnce.current) return;
    ratedOnce.current = true;
    if (!getState().chessPuzzles[key]) chessPuzzleRated(bank.rating, win);
  };

  const solvedText = (played: { san: string; mate: boolean }): FeedbackState => ({
    tone: "success",
    text: t(
      `${san(played.san)}${played.mate ? " — мат!" : " — верно!"} ${misses === 0 ? "С первой попытки! 🎉" : ""}`,
      `${san(played.san)}${played.mate ? " — mot!" : " — toʻgʻri!"} ${misses === 0 ? "Birinchi urinishdayoq! 🎉" : ""}`,
    ),
    sub: bank ? t(`Решение: ${solutionLine(bank, san)}`, `Yechim: ${solutionLine(bank, san)}`) : text.explanation,
  });

  const left = (matesLeft: number) =>
    matesLeft === 1
      ? t("Теперь поставь мат!", "Endi mot qil!")
      : matesLeft > 1
        ? t(`Осталось ${pluralize(matesLeft, "ход", "хода", "ходов")} до мата.`, `Motgacha ${matesLeft} yurish qoldi.`)
        : t("Найди следующий сильный ход.", "Keyingi kuchli yurishni top.");

  const miss = (mate: boolean) => {
    const n = misses + 1;
    setMisses(n);
    rateOnce(false);
    chessPuzzleMiss(key);
    if (!failed.current) {
      failed.current = true;
      onFailed?.();
    }
    setBusy(true);
    setFeedback({
      tone: "retry",
      text: mate
        ? t(
            "Это мат, но задача была другая — впрочем, засчитано!",
            "Bu ham mot, garchi masalada boshqa yechim kutilgan boʻlsa-da — hisobga olindi!",
          )
        : n === 1
          ? t("Пока не то. Попробуй ещё раз.", "Hali toʻgʻri emas — yana oʻylab koʻr.")
          : n === 2
            ? t("Ещё не то. Загляни в подсказку ниже.", "Bu ham emas. Pastdagi maslahatga qarab koʻr.")
            : t("Подсвечена фигура, которой нужно ходить.", "Qaysi dona yurishi kerakligi belgilab qoʻyildi."),
      sub: n >= 2 ? text.hint : undefined,
    });
    return n;
  };

  const retryLater = () => {
    timer.current = setTimeout(() => {
      setShown(step.fen);
      setLast(oppLast.current);
      setBusy(false);
    }, 900);
  };

  /** Ход в задаче из базы: строка решения, ответы соперника — из неё же. */
  const attemptLine = (played: NonNullable<ReturnType<typeof playMove>>) => {
    const verdict = judgeLineMove(line, step.ply, played);
    if (verdict.kind === "solved") {
      setDone(true);
      rateOnce(misses === 0);
      chessPuzzleSolved(key, misses === 0);
      setFeedback(solvedText(played));
      onSolved?.(misses);
      return;
    }
    if (verdict.kind === "wrong") {
      miss(false);
      retryLater();
      return;
    }
    setBusy(true);
    setFeedback({
      tone: "info",
      text: t(`${san(played.san)} — верно! Соперник отвечает…`, `${san(played.san)} — toʻgʻri! Raqib javob beryapti…`),
    });
    timer.current = setTimeout(() => {
      const reply = playUci(played.fen, verdict.reply);
      const fen = reply?.fen ?? played.fen;
      const matesLeft = step.matesLeft > 0 ? step.matesLeft - 1 : 0;
      oppLast.current = squares(verdict.reply);
      setStep({ fen, matesLeft, ply: step.ply + 2 });
      setShown(fen);
      setLast(oppLast.current);
      setBusy(false);
      setFeedback({
        tone: "info",
        text: reply
          ? t(`Соперник ответил ${san(reply.san)}.`, `Raqib ${san(reply.san)} bilan javob berdi.`)
          : t("Твой ход.", "Navbat senda."),
        sub: left(matesLeft),
      });
    }, 700);
  };

  const attempt = (from: string, to: string, promotion?: PromotionPiece): boolean => {
    if (done || busy || shown !== step.fen) return false;
    if (!promotion && isPromotionMove(step.fen, from, to)) {
      promo.ask(to, solver, (piece) => attempt(from, to, piece));
      return true;
    }
    const played = playMove(step.fen, from, to, promotion ?? "q");
    if (!played) return false;
    setSelected(null);
    setShown(played.fen);
    setLast([from, to]);
    if (bank) {
      attemptLine(played);
      return true;
    }
    if (accepted.includes(played.uci)) {
      const matesLeft = step.matesLeft > 0 ? step.matesLeft - 1 : 0;
      if (played.mate || matesLeft === 0) {
        setDone(true);
        chessPuzzleSolved(key, misses === 0);
        setFeedback(solvedText(played));
        onSolved?.(misses);
        return true;
      }
      // Соперник защищается, как может, и ход снова наш.
      setBusy(true);
      setFeedback({
        tone: "info",
        text: t(
          `${san(played.san)} — верно! Соперник защищается…`,
          `${san(played.san)} — toʻgʻri! Raqib himoyalanyapti…`,
        ),
      });
      timer.current = setTimeout(() => {
        const reply = searchBest(played.fen, { depth: 2, timeMs: 400 }).uci;
        const after = reply
          ? playMove(played.fen, reply.slice(0, 2), reply.slice(2, 4), (reply[4] as PieceType | undefined) ?? "q")
          : null;
        const fen = after?.fen ?? played.fen;
        oppLast.current = reply ? squares(reply) : null;
        setStep({ fen, matesLeft, ply: 0 });
        setShown(fen);
        setLast(oppLast.current);
        setBusy(false);
        setFeedback({
          tone: "info",
          text: after
            ? t(`Соперник ответил ${san(after.san)}.`, `Raqib ${san(after.san)} bilan javob berdi.`)
            : t("Твой ход.", "Navbat senda."),
          sub: left(matesLeft),
        });
      }, 700);
      return true;
    }
    const n = miss(played.mate);
    if (played.mate && step.matesLeft === 1) {
      // Любой мат в один ход — тоже решение.
      setDone(true);
      chessPuzzleSolved(key, false);
      setBusy(false);
      onSolved?.(n);
      return true;
    }
    retryLater();
    return true;
  };

  const tap = (sq: string) => {
    if (done || busy || shown !== step.fen) return;
    const piece = pieceAt(step.fen, sq);
    if (piece && piece.color === solver) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected) attempt(selected, sq);
    else setSelected(null);
  };

  const marks: Record<string, SquareMark> = {};
  if (last) {
    marks[last[0]] = "last";
    marks[last[1]] = "last";
  }
  if (isInCheck(shown)) {
    const k = kingOf(shown, shown.split(" ")[1] as Color);
    if (k) marks[k] = "check";
  }
  if (hintFrom && !done) marks[hintFrom] = "hint";
  if (selected) {
    marks[selected] = "selected";
    for (const sq of legalTargets(step.fen, selected)) marks[sq] = pieceAt(step.fen, sq) ? "capture" : "target";
  }

  const mateIn = bank ? bank.mate : (classic!.mateIn ?? 0);
  const goal =
    mateIn === 1
      ? t("Поставь мат в 1 ход", "1 yurishda mot qil")
      : mateIn === 2
        ? t("Поставь мат в 2 хода", "2 yurishda mot qil")
        : mateIn === 3
          ? t("Поставь мат в 3 хода", "3 yurishda mot qil")
          : bank?.theme === "defense"
            ? t("Найди ход, который спасает", "Qutqaradigan yurishni top")
            : t("Найди лучший ход", "Eng yaxshi yurishni top");
  const stars = bank ? starsFor(bank.rating) : classic!.stars;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-3">
        <ChessBoard
          id={`puzzle-${puzzle.id}`}
          position={shown}
          marks={marks}
          orientation={solver === "w" ? "white" : "black"}
          onSquare={tap}
          draggable={!done && !busy}
          onDrop={(from, to) => attempt(from, to)}
          promotion={promo.request}
          arrows={hintTo && hintFrom && !done ? [{ from: hintFrom, to: hintTo, color: "#10b981" }] : []}
          maxWidth={480}
        />
        <Feedback state={feedback} />
      </div>
      <aside className="space-y-3">
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
            {STARS(stars)} · {solver === "w" ? t("ходят белые", "oqlar yuradi") : t("ходят чёрные", "qoralar yuradi")}
          </p>
          <h2 className="mt-1 text-xl font-black">
            {bank && theme ? `${theme.emoji} ` : ""}
            {text.title}
          </h2>
          <p className="mt-1 text-lg font-bold text-brand-dark">{goal}</p>
          {text.source && <p className="mt-1 text-xs text-muted">{text.source}</p>}
          <p className="mt-2 text-sm text-muted">
            {t(
              "Нажми на фигуру, потом на клетку — или перетащи фигуру.",
              "Avval donani, keyin katakni bos — yoki donani sudrab olib bor.",
            )}
          </p>
        </div>
        {!done && misses < 2 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setMisses(2);
              // Подсказка в задаче из базы — как ошибка: рейтинг не растёт, задача вернётся на повторение.
              if (bank) {
                rateOnce(false);
                chessPuzzleMiss(key);
              }
              setFeedback({ tone: "info", text: t("Подсказка", "Maslahat"), sub: text.hint });
            }}
          >
            💡 {t("Подсказка", "Maslahat")}
          </Button>
        )}
        {done && next && (
          <Button onClick={next.onClick} size="lg">
            {next.label}
          </Button>
        )}
      </aside>
    </div>
  );
}
