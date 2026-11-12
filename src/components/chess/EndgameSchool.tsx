"use client";

import { BookOpen, Lightbulb, RotateCcw, Undo2, X } from "lucide-react";
import { Chess } from "chess.js";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { RichText } from "@/components/RichText";
import { Celebration } from "@/components/rewards/Celebration";
import { Button, ProgressBar, cn, Icon } from "@/components/ui";
import type { EndgameDrill, EndgameLesson } from "@/content/chess/endgames";
import { checkedKing, legalTargets, pieceAt, playMove } from "@/lib/chess";
import { bestMoves, kingCatches, moveOutcome, pawnSquare, robotMove, warmEndgameTable } from "@/lib/endgame";
import { useLang, useSan, useT } from "@/lib/i18n";
import { chessEndgameSolved, useHydrated, useStore } from "@/lib/store";
import { useChessPart } from "@/lib/useChess";
import { setHash, useHash } from "@/lib/useHash";
import { ENDGAME_PART } from "@/content/chess/parts/endgames";
import { cue } from "@/lib/voice";
import { BoardThumb, PieceSprite } from "./BoardThumb";
import { ChessBoard, type SquareMark } from "./ChessBoard";

/**
 * Школа эндшпиля: король и пешка против короля — правило квадрата, оппозиция, ключевые поля, игра с роботом.
 *
 * Три экрана, на каждом одна доска: список уроков (доски-картинки), урок (`#square` — рассказ и показ на доске)
 * и упражнение (`#square-2`). Раньше всё стояло на одной странице: 18 настоящих досок подряд.
 */
export function EndgameSchool() {
  const hash = useHash();
  const { endgames } = useChessPart(ENDGAME_PART);
  const id = hash.slice(1);
  const lesson = endgames.find((l) => l.id === id);
  if (lesson) return <LessonView key={lesson.id} lesson={lesson} n={endgames.indexOf(lesson) + 1} />;
  for (const l of endgames) {
    const index = l.drills.findIndex((d) => d.id === id);
    if (index >= 0) return <DrillRun key={l.id} lesson={l} index={index} lessons={endgames} />;
  }
  return <LessonList />;
}

/** Решённые упражнения; до загрузки сохранённого прогресса — пусто, как на сервере. */
function useSolvedDrills(): Record<string, number> {
  const hydrated = useHydrated();
  const solved = useStore((s) => s.chessEndgames);
  return hydrated ? solved : NONE;
}
const NONE: Record<string, number> = {};

function LessonList() {
  const t = useT();
  const { endgameSchool, endgames, endgameMates } = useChessPart(ENDGAME_PART);
  const solved = useSolvedDrills();
  const all = endgames.flatMap((l) => l.drills);
  const done = all.filter((d) => solved[d.id]).length;

  return (
    <div className="space-y-8">
      <Link
        href="/chess"
        className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
      >
        ← {t("Шахматная школа", "Shaxmat maktabi")}
      </Link>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{endgameSchool.subtitle}</p>
          <h1 className="text-3xl font-black">{endgameSchool.title}</h1>
          <p className="mt-1 text-muted">{endgameSchool.about}</p>
        </div>
        <div className="w-56 rounded-2xl bg-surface px-4 py-3 shadow-card">
          <p className="text-sm font-extrabold text-muted">
            {t(`Решено ${done} из ${all.length}`, `${all.length} tadan ${done} tasi yechildi`)}
          </p>
          <ProgressBar value={done} max={all.length} className="mt-2" />
        </div>
      </header>

      <PieceSprite />
      <ol className="grid gap-3 sm:grid-cols-2" aria-label={t("Уроки", "Darslar")}>
        {endgames.map((l, i) => {
          const count = l.drills.filter((d) => solved[d.id]).length;
          const total = l.drills.length;
          return (
            <li key={l.id}>
              <button
                type="button"
                data-endgame-lesson={l.id}
                onClick={() => setHash(`#${l.id}`)}
                className="flex h-full w-full gap-3 rounded-3xl bg-surface p-3 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <BoardThumb position={(l.demo ?? l.drills[0]).fen} size={120} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-xs font-extrabold tracking-wide text-muted uppercase">
                    {t(`Урок ${i + 1}`, `${i + 1}-dars`)}
                  </span>
                  <span className="text-lg leading-tight font-black">{l.title}</span>
                  <span className="mt-1 line-clamp-3 text-sm text-muted">{l.idea}</span>
                  <span className="mt-auto flex items-center gap-2 pt-2">
                    <ProgressBar value={count} max={total} className="flex-1" />
                    <span className="text-sm font-extrabold whitespace-nowrap">
                      {count === total ? t("✓ пройдено", "✓ tugallandi") : `${count} / ${total}`}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <section className="rounded-3xl bg-surface p-5 shadow-card" aria-labelledby="mates-h">
        <h2 id="mates-h" className="text-2xl font-black">
          <span className="deco" aria-hidden>
            ♛{" "}
          </span>
          {t("Пешка стала ферзём — что дальше?", "Piyoda farzin boʻldi — endi-chi?")}
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

/** Урок: рассказ, показ на доске и вход в упражнения. */
function LessonView({ lesson, n }: { lesson: EndgameLesson; n: number }) {
  const t = useT();
  const solved = useSolvedDrills();
  const total = lesson.drills.length;
  const count = lesson.drills.filter((d) => solved[d.id]).length;
  const demoMarks: Record<string, SquareMark> = {};
  for (const sq of lesson.demo?.highlight ?? []) demoMarks[sq] = "good";

  // «Дальше» ведёт к первому нерешённому упражнению; всё решено — с первого, ещё раз.
  const next = lesson.drills.find((d) => !solved[d.id]) ?? lesson.drills[0];
  const startLabel =
    count === 0
      ? t("К упражнениям →", "Mashqlarga →")
      : count < total
        ? t("Продолжить →", "Davom etish →")
        : t("Решить ещё раз →", "Yana bir bor yechish →");
  const start = () => setHash(`#${next.id}`);

  return (
    // Без доски (урок «Сыграй с роботом») раскладке нечего ставить слева — обычная колонка текста.
    <div
      className={cn("space-y-3 max-lg:pb-20", lesson.demo ? "board-stage board-wide board-top" : "mx-auto max-w-2xl")}
    >
      <button
        type="button"
        onClick={() => setHash("#")}
        className="inline-flex min-h-11 items-center justify-self-start text-sm font-extrabold text-brand hover:underline"
      >
        ← {t("Все уроки", "Barcha darslar")}
      </button>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{t(`Урок ${n}`, `${n}-dars`)}</p>
        <h1 className="text-3xl font-black">{lesson.title}</h1>
        <p className="mt-1 text-lg font-bold text-brand-dark">{lesson.idea}</p>
      </header>
      {lesson.demo && (
        <ChessBoard
          id={`demo-${lesson.id}`}
          position={lesson.demo.fen}
          marks={demoMarks}
          maxWidth={480}
          label={lesson.demo.caption}
        />
      )}
      {lesson.demo && <p className="text-sm font-bold text-muted">{lesson.demo.caption}</p>}
      <div className="space-y-2 text-lg leading-relaxed">
        {lesson.text.map((p) => (
          <p key={p}>
            <RichText text={p} />
          </p>
        ))}
      </div>
      {/* На широком экране блок держится у нижнего края окна, пока рассказ листается: вход в упражнения всегда на виду. */}
      <section
        className="space-y-2 rounded-2xl bg-surface p-4 shadow-card lg:sticky lg:bottom-4"
        aria-labelledby="drills-h"
      >
        <h2 id="drills-h" className="text-sm font-extrabold text-muted">
          {t(`Упражнения: ${count} из ${total}`, `Mashqlar: ${total} tadan ${count} tasi`)}
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <ol className="flex flex-wrap gap-2">
            {lesson.drills.map((d, i) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setHash(`#${d.id}`)}
                  aria-label={t(
                    `Упражнение ${i + 1}${solved[d.id] ? " (решено)" : ""}`,
                    `${i + 1}-mashq${solved[d.id] ? " (yechilgan)" : ""}`,
                  )}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-2xl border-2 font-black transition hover:border-brand/50",
                    solved[d.id] ? "border-mint/50 bg-mint-soft text-mint-ink" : "border-line",
                  )}
                >
                  {solved[d.id] ? "✓" : i + 1}
                </button>
              </li>
            ))}
          </ol>
          <Button onClick={start} className="max-lg:hidden">
            {startLabel}
          </Button>
        </div>
      </section>
      {/* Телефон: главная кнопка — внизу экрана под большим пальцем, искать её прокруткой не нужно. */}
      <div
        data-exercise-next
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
      >
        <Button onClick={start} className="w-full">
          {startLabel}
        </Button>
      </div>
    </div>
  );
}

/** Упражнения урока по одному: строка «закрыть — полоска — к уроку», под ней доска и задание. */
function DrillRun({ lesson, index, lessons }: { lesson: EndgameLesson; index: number; lessons: EndgameLesson[] }) {
  const t = useT();
  const hydrated = useHydrated();
  const solved = useSolvedDrills();
  const total = lesson.drills.length;
  const count = lesson.drills.filter((d) => solved[d.id]).length;
  const drill = lesson.drills[index];
  const nextLesson = lessons[lessons.indexOf(lesson) + 1];

  // Последнее упражнение урока решено только что (а не раньше) — праздник; повторный заход салют не устраивает.
  const [seen, setSeen] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  if (hydrated && seen !== count) {
    if (seen !== null && seen < total && count === total) setCelebrate(true);
    setSeen(count);
  }

  // Точная таблица окончания строится около полусекунды на медленном телефоне — в свободную минуту после
  // отрисовки, а не во время неё: экран появляется сразу, и первый ответ таблицу уже не ждёт.
  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warmEndgameTable, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(warmEndgameTable, 400);
    return () => clearTimeout(id);
  }, []);

  // Новое упражнение: фокус — на задание, диктор читает его, Tab идёт к доске.
  const shown = useRef(drill.id);
  useEffect(() => {
    if (shown.current === drill.id) return;
    shown.current = drill.id;
    document.querySelector<HTMLElement>("[data-exercise-heading]")?.focus({ preventScroll: true });
  }, [drill.id]);

  const solvedNow = !!solved[drill.id];
  const onwardLabel =
    index < total - 1
      ? t("Следующее упражнение →", "Keyingi mashq →")
      : nextLesson
        ? t(`Следующий урок: ${nextLesson.title} →`, `Keyingi dars: ${nextLesson.title} →`)
        : t("Все уроки", "Barcha darslar");
  const goOnward = () =>
    setHash(index < total - 1 ? `#${lesson.drills[index + 1].id}` : nextLesson ? `#${nextLesson.id}` : "#");
  const nextBar = solvedNow && !celebrate;

  const footer = (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <Button variant="ghost" onClick={() => setHash(`#${lesson.drills[index - 1].id}`)} disabled={index === 0}>
        {t("← Назад", "← Orqaga")}
      </Button>
      {/* Пока упражнение не решено, «дальше» тише; на телефоне после решения его заменяет панель внизу. */}
      <Button
        variant={solvedNow ? "primary" : "secondary"}
        onClick={goOnward}
        className={cn(nextBar && "max-lg:hidden")}
      >
        {onwardLabel}
      </Button>
    </div>
  );

  return (
    <section
      className={cn("board-wide space-y-2", nextBar && "max-lg:pb-20")}
      style={{ "--stage-chrome": "10.5rem" } as CSSProperties}
      aria-labelledby="drill-h"
    >
      <h1 id="drill-h" className="sr-only">
        {t(
          `${lesson.title}: упражнение ${index + 1} из ${total}`,
          `${lesson.title}: ${total} tadan ${index + 1}-mashq`,
        )}
      </h1>
      <div data-focus-screen className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setHash("#")}
          aria-label={t("Все уроки", "Barcha darslar")}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl hover:bg-black/5"
        >
          <X className="h-6 w-6" strokeWidth={2.5} aria-hidden />
        </button>
        <ol
          data-step-strip
          className="flex min-w-0 flex-1 items-center gap-1"
          aria-label={t("Упражнения урока", "Dars mashqlari")}
        >
          {lesson.drills.map((d, i) => (
            <li key={d.id} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setHash(`#${d.id}`)}
                aria-label={t(
                  `Упражнение ${i + 1}${solved[d.id] ? " (решено)" : ""}`,
                  `${i + 1}-mashq${solved[d.id] ? " (yechilgan)" : ""}`,
                )}
                aria-current={i === index ? "step" : undefined}
                className="flex h-11 w-full items-center"
              >
                <span
                  aria-hidden
                  className={cn(
                    "block w-full rounded-full",
                    i === index ? "h-3.5" : "h-2.5",
                    solved[d.id] ? "bg-mint" : i === index ? "bg-brand" : "bg-line",
                  )}
                />
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => setHash(`#${lesson.id}`)}
          aria-label={t("К уроку", "Darsga qaytish")}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-brand-dark hover:bg-brand-soft"
        >
          <BookOpen className="h-5 w-5" strokeWidth={2.25} aria-hidden />
        </button>
      </div>
      <div className="rounded-3xl bg-paper p-1 sm:p-2">
        {drill.kind === "square" && <SquareDrill key={drill.id} drill={drill} solved={solvedNow} footer={footer} />}
        {drill.kind === "find" && <FindDrill key={drill.id} drill={drill} solved={solvedNow} footer={footer} />}
        {drill.kind === "play" && <PlayDrill key={drill.id} drill={drill} solved={solvedNow} footer={footer} />}
      </div>
      {celebrate && (
        <Celebration
          title={t("Урок пройден! 🏆", "Dars oʻzlashtirildi! 🏆")}
          actions={
            <Button size="lg" variant={nextLesson ? "primary" : "secondary"} onClick={goOnward}>
              {onwardLabel}
            </Button>
          }
        >
          {t(`Все ${total} упражнений решены.`, `Barcha ${total} ta mashq yechildi.`)}
        </Celebration>
      )}
      {nextBar && (
        <div
          data-exercise-next
          className="fixed inset-x-0 bottom-0 z-20 animate-fade-up border-t border-line bg-surface/95 px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
        >
          <Button onClick={goOnward} className="w-full">
            {onwardLabel}
          </Button>
        </div>
      )}
    </section>
  );
}

interface DrillProps {
  drill: EndgameDrill;
  solved: boolean;
  /** Кнопки «назад» и «дальше» — последними в правой колонке. */
  footer: ReactNode;
}

/**
 * Экран упражнения. board-stage: с 1024 px доска (прямой потомок) встаёт слева во всю высоту окна, остальное —
 * справа; на телефоне те же части идут в одну колонку: задание, доска, ответ.
 */
function DrillStage({ solved, title, children }: { solved: boolean; title: string; children: ReactNode }) {
  const t = useT();
  return (
    <div className="board-stage space-y-3 lg:space-y-4">
      <h2
        data-exercise-heading
        tabIndex={-1}
        className="flex flex-wrap items-center gap-2 text-xl leading-snug font-black outline-none sm:text-2xl"
      >
        {title}
        {solved && (
          <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-sm font-extrabold text-mint-ink">
            {t("✓ решено", "✓ yechildi")}
          </span>
        )}
      </h2>
      {children}
    </div>
  );
}

/** Объяснение после верного ответа. */
function Why({ text }: { text: string }) {
  const t = useT();
  return (
    <div className="rounded-2xl border-2 border-mint/40 bg-mint-soft/60 px-4 py-3">
      <p className="text-sm font-extrabold text-mint-ink">{t("Почему так", "Nega shunday")}</p>
      <p className="mt-1 font-semibold">{text}</p>
    </div>
  );
}

/** Подсказка: сначала кнопка, по нажатию — текст. */
function Hint({ text }: { text: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return open ? (
    <div className="rounded-2xl border-2 border-sun/40 bg-sun-soft px-4 py-3">
      <p className="text-sm font-extrabold text-sun-ink">
        <Icon icon={Lightbulb} /> {t("Подсказка", "Maslahat")}
      </p>
      <p className="mt-1 font-semibold text-sun-ink">{text}</p>
    </div>
  ) : (
    <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="justify-self-start">
      <Icon icon={Lightbulb} /> {t("Подсказка", "Maslahat")}
    </Button>
  );
}

/** «Догонит ли король пешку?» — ответ кнопкой, потом показываем квадрат. */
function SquareDrill({ drill, solved, footer }: DrillProps) {
  const t = useT();
  const [answer, setAnswer] = useState<boolean | null>(null);
  // Ответ сверяется с таблицей только после нажатия: отрисовка экрана её не ждёт.
  const truth = answer === null ? null : kingCatches(drill.fen);
  const marks: Record<string, SquareMark> = {};
  if (answer !== null) for (const sq of pawnSquare(drill.fen)) marks[sq] = "good";
  const choose = (catches: boolean) => {
    setAnswer(catches);
    if (catches === kingCatches(drill.fen)) {
      chessEndgameSolved(drill.id);
      cue("praise-chess");
    } else cue("retry-chess");
  };
  return (
    <DrillStage solved={solved} title={drill.prompt}>
      <ChessBoard id={drill.id} position={drill.fen} marks={marks} maxWidth={480} label={drill.prompt} />
      {answer === null ? (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => choose(true)}>
            {t("Догонит", "Yetib oladi")}
          </Button>
          <Button variant="secondary" onClick={() => choose(false)}>
            {t("Не догонит", "Yetib ololmaydi")}
          </Button>
        </div>
      ) : (
        <div role="status" className="space-y-2">
          <p className={cn("text-lg font-black", answer === truth ? "text-success-ink" : "text-warning-ink")}>
            {answer === truth
              ? t("Верно!", "Toʻgʻri!")
              : truth
                ? t("Не совсем: король догонит.", "Unchalik emas: shoh yetib oladi.")
                : t("Не совсем: король не догонит.", "Unchalik emas: shoh yetib ololmaydi.")}
          </p>
          <Why text={drill.why} />
          <Button variant="ghost" size="sm" onClick={() => setAnswer(null)}>
            <Icon icon={RotateCcw} /> {t("Ещё раз", "Yana bir bor")}
          </Button>
        </div>
      )}
      {footer}
    </DrillStage>
  );
}

/** Найди единственный верный ход: проверка по точной таблице. */
function FindDrill({ drill, solved, footer }: DrillProps) {
  const t = useT();
  const san = useSan();
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<{ ok: boolean; san: string; uci: string } | null>(null);
  const turn = drill.fen.split(" ")[1] as "w" | "b";

  const tryMove = (from: string, to: string): boolean => {
    if (result?.ok) return false;
    const played = playMove(drill.fen, from, to, "q");
    if (!played) return false;
    const ok = bestMoves(drill.fen).includes(played.uci);
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
    <DrillStage solved={solved} title={drill.prompt}>
      <ChessBoard
        id={drill.id}
        position={position}
        marks={marks}
        onSquare={tap}
        onDrop={tryMove}
        draggable={!result?.ok}
        orientation={turn === "w" ? "white" : "black"}
        maxWidth={480}
        label={drill.prompt}
      />
      {result?.ok ? (
        <div role="status" className="space-y-2">
          <p className="text-lg font-black text-success-ink">{t("Верно!", "Toʻgʻri!")}</p>
          <Why text={drill.why} />
        </div>
      ) : result ? (
        <p role="status" className="font-bold text-warning-ink">
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
      {!result?.ok && drill.hint && <Hint text={drill.hint} />}
      {footer}
    </DrillStage>
  );
}

function drillStrongSide(fen: string): "w" | "b" {
  const board = fen.split(" ")[0];
  return board.includes("P") ? "w" : "b";
}

type PlayState = "playing" | "won" | "lost";

/** Игра с роботом, который знает позицию наизусть. */
function PlayDrill({ drill, solved, footer }: DrillProps) {
  const t = useT();
  const lang = useLang();
  const san = useSan();
  const me = drill.fen.split(" ")[1] as "w" | "b";
  const [history, setHistory] = useState<{ fen: string; san: string; uci: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<PlayState>("playing");
  const [slip, setSlip] = useState(false);
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
  const checked = checkedKing(fen);
  if (checked) marks[checked] = "check";
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
    <DrillStage solved={solved} title={drill.prompt}>
      <ChessBoard
        id={drill.id}
        position={fen}
        marks={marks}
        onSquare={tap}
        onDrop={tryMove}
        draggable={state === "playing" && turn === me}
        orientation={me === "w" ? "white" : "black"}
        maxWidth={480}
        label={drill.prompt}
      />
      <p
        role="status"
        aria-live="polite"
        className={cn("font-bold", state === "won" && "text-success-ink", slip && "text-warning-ink")}
      >
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
            <Icon icon={Undo2} /> {t("Вернуть ход", "Yurishni qaytarish")}
          </Button>
        )}
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={restart}>
            <Icon icon={RotateCcw} /> {t("Начать заново", "Qaytadan boshlash")}
          </Button>
        )}
      </div>
      {state === "playing" && drill.hint && <Hint text={drill.hint} />}
      {footer}
    </DrillStage>
  );
}
