"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Eye, Lightbulb } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Feedback, type FeedbackState } from "@/components/answers/Feedback";
import { cn } from "@/components/ui";
import type { ChessPuzzle } from "@/content/chess/puzzles";
import { isInCheck, isPromotionMove, legalTargets, pieceAt, playMove, type Color, type PieceType } from "@/lib/chess";
import { matingMovesIn, searchBest } from "@/lib/engine/search";
import { useSan, useT } from "@/lib/i18n";
import { kingOf } from "@/lib/play";
import { pluralize } from "@/lib/plural";
import { judgeLineMove, playUci, solutionLine, type BankPuzzle } from "@/lib/puzzleBank";
import { starsFor } from "@/lib/puzzleRating";
import { chessPuzzleMiss, chessPuzzleRated, chessPuzzleSolved, getState } from "@/lib/store";
import { useChessPart } from "@/lib/useChess";
import { PUZZLE_PART } from "@/content/chess/parts/puzzles";
import { BarButton, BoardBar } from "./BoardBar";
import { ChessBoard, type PromotionPiece, type SquareMark } from "./ChessBoard";
import { usePromotion } from "./useMoveInput";

const STARS = (n: number) => "⭐".repeat(n);

/** Задача школы (с текстами) или задача из базы Lichess. */
export type AnyPuzzle = ChessPuzzle | BankPuzzle;

export const isBankPuzzle = (p: AnyPuzzle): p is BankPuzzle => "moves" in p;

/** Ключ прогресса и React-ключ задачи. */
export const puzzleKey = (p: AnyPuzzle) => (isBankPuzzle(p) ? p.key : p.id);

/** Позиция в записи решения: по ним после задачи можно пройтись кнопками «назад» и «вперёд». */
interface Frame {
  fen: string;
  last: [string, string] | null;
}

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
  quiet = false,
  themed = false,
  solution = true,
}: {
  puzzle: AnyPuzzle;
  onSolved?: (misses: number) => void;
  onFailed?: () => void;
  next?: { label: string; onClick: () => void };
  rated?: boolean;
  /** Без реплик диктора — для «Шторма», где задачи сменяются за секунды. */
  quiet?: boolean;
  /** Тема задачи из базы известна заранее (ребёнок сам её выбрал). Иначе название темы — подсказка: до решения прячем. */
  themed?: boolean;
  /** Можно ли посмотреть решение. В режимах на время и на серию — нельзя. */
  solution?: boolean;
}) {
  const t = useT();
  const san = useSan();
  const { puzzles, themes } = useChessPart(PUZZLE_PART);
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
  // Свой ход: клетка, куда пришла фигура, — зелёная (верно) или красная (не то). Ход соперника — жёлтый.
  const [lastTone, setLastTone] = useState<"good" | "bad" | null>(null);
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);
  // Решение показано по просьбе: задача не засчитана и вернётся на повторение.
  const [revealed, setRevealed] = useState(false);
  // Запись решения: позиции по порядку и та, что сейчас на доске после задачи.
  const [frames, setFrames] = useState<Frame[]>([{ fen: puzzle.fen, last: null }]);
  const [view, setView] = useState<number | null>(null);
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
      setLastTone(null);
      setFrames((f) => [...f, { fen: intro.fen, last: oppLast.current }]);
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

  const record = (fen: string, move: [string, string]) => setFrames((f) => [...f, { fen, last: move }]);

  /** Остаток решения с текущей позиции: ходы решающего и ответы соперника по очереди. */
  const restOfSolution = (): Frame[] => {
    const rest: Frame[] = [];
    let fen = step.fen;
    const push = (uci: string | undefined) => {
      const played = uci ? playUci(fen, uci) : null;
      if (!played) return false;
      fen = played.fen;
      rest.push({ fen, last: squares(uci!) });
      return true;
    };
    if (bank) {
      for (const uci of line.slice(step.ply)) if (!push(uci)) break;
      return rest;
    }
    // Задача школы: мат в N — ход движка к мату и лучшая защита; иначе — первый ход из списка.
    let matesLeft = step.matesLeft;
    if (matesLeft === 0) {
      push(classic!.solution?.[0]);
      return rest;
    }
    while (matesLeft > 0 && push(matingMovesIn(fen, matesLeft)[0])) {
      matesLeft -= 1;
      if (matesLeft === 0 || !push(searchBest(fen, { depth: 2, timeMs: 400 }).uci ?? undefined)) break;
    }
    return rest;
  };

  /** «Показать решение»: ходы проигрываются на доске. Это как ошибка — рейтинг не растёт, задача вернётся на повторение. */
  const reveal = () => {
    if (done || busy || shown !== step.fen) return;
    const rest = restOfSolution();
    if (rest.length === 0) return;
    rateOnce(false);
    chessPuzzleMiss(key);
    if (!failed.current) {
      failed.current = true;
      onFailed?.();
    }
    setSelected(null);
    setBusy(true);
    setFeedback({ tone: "info", text: t("Смотри решение на доске…", "Yechimni taxtada kuzat…") });
    const from = frames.length;
    const all = [...frames, ...rest];
    setFrames(all);
    const show = (i: number) => {
      const frame = all[i];
      setShown(frame.fen);
      setLast(frame.last);
      // Ходы решающего — зелёные, ответы соперника — жёлтые.
      setLastTone((i - from) % 2 === 0 ? "good" : null);
      if (i < all.length - 1) {
        timer.current = setTimeout(() => show(i + 1), 900);
        return;
      }
      setBusy(false);
      setRevealed(true);
      setDone(true);
      setView(i);
      setFeedback({
        tone: "info",
        text: t(
          "Вот решение. Эта задача ещё вернётся — на повторение.",
          "Yechim shu. Bu masala takrorlashda yana keladi.",
        ),
        sub: bank ? t(`Решение: ${solutionLine(bank, san)}`, `Yechim: ${solutionLine(bank, san)}`) : text.explanation,
      });
    };
    timer.current = setTimeout(() => show(from), 400);
  };

  /** После задачи: пройтись по записи решения. */
  const at = view ?? frames.length - 1;
  const go = (i: number) => {
    const frame = frames[i];
    if (!done || !frame) return;
    setView(i);
    setShown(frame.fen);
    setLast(frame.last);
    setLastTone(null);
  };

  /**
   * «Подсказка» — три ступени: сначала слова, потом подсвечена фигура, потом стрелка показывает ход.
   * Первая подсказка в задаче из базы — как ошибка: рейтинг не растёт, задача вернётся на повторение.
   */
  const hint = () => {
    if (done || misses >= 4) return;
    const n = Math.max(2, misses + 1);
    if (bank && misses < 2) {
      rateOnce(false);
      chessPuzzleMiss(key);
    }
    setMisses(n);
    setFeedback({
      tone: "info",
      text:
        n === 2
          ? t("Подсказка", "Maslahat")
          : n === 3
            ? t("Подсвечена фигура, которой нужно ходить.", "Qaysi dona yurishi kerakligi belgilab qoʻyildi.")
            : t("Зелёная стрелка показывает ход.", "Yashil strelka yurishni koʻrsatib turibdi."),
      // Слова подсказки нужны на первой ступени; дальше ход показан на самой доске.
      sub: n === 2 ? text.hint || undefined : undefined,
    });
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
    setLastTone("bad");
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
      setLastTone(null);
      setBusy(false);
    }, 900);
  };

  /** Ход в задаче из базы: строка решения, ответы соперника — из неё же. */
  const attemptLine = (played: NonNullable<ReturnType<typeof playMove>>) => {
    const verdict = judgeLineMove(line, step.ply, played);
    if (verdict.kind !== "wrong") record(played.fen, squares(played.uci));
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
      if (reply) record(fen, oppLast.current);
      setStep({ fen, matesLeft, ply: step.ply + 2 });
      setShown(fen);
      setLast(oppLast.current);
      setLastTone(null);
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
    setLastTone("good");
    if (bank) {
      attemptLine(played);
      return true;
    }
    if (accepted.includes(played.uci)) {
      record(played.fen, [from, to]);
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
        if (after && oppLast.current) record(fen, oppLast.current);
        setStep({ fen, matesLeft, ply: 0 });
        setShown(fen);
        setLast(oppLast.current);
        setLastTone(null);
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
      record(played.fen, [from, to]);
      setLastTone("good");
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
    marks[last[1]] = lastTone ?? "last";
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
  // Название темы задачи из базы — готовая подсказка: пока задача не решена, прячем (если тему не выбирали сами).
  const secret = !!bank && !themed && !done;
  const canReveal = solution && !quiet;
  // После задачи решение можно пролистать — если в нём больше одного хода.
  const replay = done && !quiet && frames.length > 2;
  const nextShort = t("Дальше", "Keyingi");

  return (
    // board-stage: с 1024 px доска слева во всю высоту окна; сведения о задаче, кнопки и ответ — справа.
    // stage-part: если экран режима сам раскладка (.board-stage), этот блок в ней растворяется —
    // заголовок режима встаёт в ту же правую колонку, а не над доской.
    <div
      className="board-stage stage-part grid gap-2 sm:gap-3 lg:space-y-3"
      data-puzzle-state={done ? (revealed ? "revealed" : "solved") : "open"}
    >
      {/* На телефоне задание и чей ход — над доской: раньше они были под ней, и до них приходилось листать. */}
      <div className="lg:hidden" data-puzzle-prompt>
        <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
          {STARS(stars)} · {solver === "w" ? t("ходят белые", "oqlar yuradi") : t("ходят чёрные", "qoralar yuradi")}
        </p>
        <p className="text-lg font-black text-brand-dark">{goal}</p>
      </div>
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
      {/*
        Кнопки — одной панелью сразу под доской, всегда на одном месте: ответ ниже может быть длинным, а они
        не «прыгают». Пока задача не решена — «Подсказка» и «Решение», после — просмотр решения и «Дальше».
      */}
      {(!done || replay || next) && (
        <BoardBar
          label={t("Кнопки задачи", "Masala tugmalari")}
          className="mx-auto w-full max-w-[480px] lg:order-2 lg:mx-0 lg:max-w-none"
          data-puzzle-actions=""
          data-puzzle-replay={replay ? at : undefined}
        >
          {!done && (
            <BarButton icon={Lightbulb} label={t("Подсказка", "Maslahat")} onClick={hint} disabled={misses >= 4} />
          )}
          {/* Решение — только после своей попытки или подсказки: сначала пробуем сами. */}
          {!done && canReveal && (
            <BarButton
              icon={Eye}
              label={t("Решение", "Yechim")}
              name={t("Показать решение", "Yechimni koʻrish")}
              onClick={reveal}
              disabled={busy || misses < 1}
              data-puzzle-reveal
            />
          )}
          {replay && (
            <>
              <BarButton
                icon={ChevronLeft}
                label={t("Назад", "Orqaga")}
                name={t("Ход назад", "Bir yurish orqaga")}
                disabled={at <= 0}
                onClick={() => go(at - 1)}
              />
              <BarButton
                icon={ChevronRight}
                label={t("Вперёд", "Oldinga")}
                name={t("Ход вперёд", "Bir yurish oldinga")}
                disabled={at >= frames.length - 1}
                onClick={() => go(at + 1)}
              />
            </>
          )}
          {done && next && (
            <BarButton
              icon={ArrowRight}
              label={nextShort}
              name={
                next.label.toLowerCase().includes(nextShort.toLowerCase()) ? next.label : `${nextShort}: ${next.label}`
              }
              primary
              className="grow-3"
              onClick={next.onClick}
            />
          )}
        </BoardBar>
      )}
      <Feedback state={feedback} silent={quiet} className="lg:order-2" />
      {/*
        Сведения о задаче. Широкий экран — карточка в правой колонке над кнопками. Телефон — пока задача
        не решена, их нет (задание и чей ход — над доской); после решения — одна строка: название и источник.
      */}
      <aside className={cn("flex flex-col gap-3 lg:order-1", !done && "max-lg:hidden")}>
        <div
          className="rounded-2xl bg-surface p-4 shadow-card max-lg:flex max-lg:flex-wrap max-lg:items-baseline max-lg:gap-x-2 max-lg:bg-transparent max-lg:px-1 max-lg:py-0 max-lg:shadow-none"
          data-puzzle-info
        >
          <p className="hidden text-xs font-extrabold tracking-wide text-muted uppercase lg:block">
            {STARS(stars)} · {solver === "w" ? t("ходят белые", "oqlar yuradi") : t("ходят чёрные", "qoralar yuradi")}
          </p>
          <h2 className="mt-1 text-xl font-black max-lg:mt-0 max-lg:text-base">
            {secret ? t("Задача из базы", "Bazadan masala") : `${bank && theme ? `${theme.emoji} ` : ""}${text.title}`}
          </h2>
          <p className="mt-1 hidden text-lg font-bold text-brand-dark lg:block">{goal}</p>
          {text.source && <p className="mt-1 text-xs text-muted max-lg:mt-0">{text.source}</p>}
          <p className="mt-2 hidden text-sm text-muted lg:block">
            {secret
              ? t(
                  "Тему задачи покажу после решения — так интереснее искать ход.",
                  "Masala mavzusini yechgandan keyin koʻrsataman — yurishni oʻzing topganing qiziqroq.",
                )
              : t(
                  "Нажми на фигуру, потом на клетку — или перетащи фигуру.",
                  "Avval donani, keyin katakni bos — yoki donani sudrab olib bor.",
                )}
          </p>
        </div>
      </aside>
    </div>
  );
}
