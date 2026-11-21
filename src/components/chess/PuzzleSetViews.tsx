"use client";

import { Check, CheckCheck, ChevronLeft, ChevronRight, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, cn, Icon, ProgressBar } from "@/components/ui";
import { PUZZLE_PART } from "@/content/chess/parts/puzzles";
import type { PuzzleTheme } from "@/content/chess/puzzles";
import { useT } from "@/lib/i18n";
import { pluralize, thousands } from "@/lib/plural";
import { BANK, bankCount, themeOfKey, useBank } from "@/lib/puzzleBank";
import {
  chapterOf,
  chapters,
  nextWith,
  setCounts,
  setHashOf,
  setOrder,
  setStatus,
  stepWith,
  type SetCounts,
  type SetStatus,
} from "@/lib/puzzleSets";
import type { ChessPuzzleProgress } from "@/lib/state";
import { getState, useHydrated, useStore } from "@/lib/store";
import { useChessPart } from "@/lib/useChess";
import { setHash } from "@/lib/useHash";
import { Loading, LoadError } from "./PuzzleBankViews";
import { PuzzleTop } from "./PuzzleTop";
import { PuzzlePlayer } from "./PuzzleTrainer";

/** Темы, у которых есть задачи из базы, — в порядке тем тренажёра. */
function useSetThemes() {
  const { themes } = useChessPart(PUZZLE_PART);
  return themes.filter((x) => bankCount(x.id) > 0);
}

/** Сколько задач темы уже встречалось — по общему прогрессу, без загрузки файла темы. */
function themeCounts(progress: Readonly<Record<string, ChessPuzzleProgress>>, theme: PuzzleTheme): SetCounts {
  const keys = Object.keys(progress).filter((k) => themeOfKey(k) === theme);
  const c = setCounts(keys, progress);
  const total = bankCount(theme);
  return { ...c, total, fresh: Math.max(0, total - c.clean - c.solved - c.open) };
}

/** Решено задач сборника во всех темах — для строки режима на главной странице задач. */
export function setsSolved(progress: Readonly<Record<string, ChessPuzzleProgress>>): number {
  return Object.entries(progress).filter(([k, p]) => p.solvedAt && themeOfKey(k)).length;
}

function useStatusText() {
  const t = useT();
  return (s: SetStatus) =>
    s === "clean"
      ? t("решена без ошибок", "xatosiz yechilgan")
      : s === "solved"
        ? t("решена с ошибкой или подсказкой", "xato yoki maslahat bilan yechilgan")
        : s === "open"
          ? t("не решена", "yechilmagan")
          : t("ещё не открывалась", "hali ochilmagan");
}

const TONE: Record<SetStatus, string> = {
  new: "border-line bg-surface text-ink",
  clean: "border-mint/50 bg-mint-soft text-mint-ink",
  solved: "border-sun/60 bg-sun-soft text-sun-ink",
  open: "border-rose/40 bg-rose/10 text-danger-ink",
};

function StatusMark({ status, className }: { status: SetStatus; className?: string }) {
  if (status === "new") return null;
  // Не только цвет: «без ошибок» — двойная галочка, «с ошибкой» — одна, «не решена» — крестик.
  const Glyph = status === "open" ? X : status === "clean" ? CheckCheck : Check;
  return <Glyph className={cn("h-3.5 w-3.5", className)} strokeWidth={3} aria-hidden />;
}

/** Счёт сборника одной строкой: с первой попытки, с ошибкой, не решены, осталось. */
function CountsLine({ c, className }: { c: SetCounts; className?: string }) {
  const t = useT();
  const items: { status: SetStatus; n: number; label: string }[] = [
    { status: "clean", n: c.clean, label: t("без ошибок", "xatosiz") },
    { status: "solved", n: c.solved, label: t("с ошибкой", "xato bilan") },
    { status: "open", n: c.open, label: t("не решены", "yechilmagan") },
    { status: "new", n: c.fresh, label: t("осталось", "qoldi") },
  ];
  return (
    <ul className={cn("flex flex-wrap gap-x-3 gap-y-1 text-sm font-bold", className)} data-set-counts>
      {items.map((x) => (
        <li key={x.status} className="inline-flex items-center gap-1.5" data-set-count={x.status}>
          <span className={cn("grid h-5 w-5 place-items-center rounded-md border-2", TONE[x.status])} aria-hidden>
            <StatusMark status={x.status} className="h-3 w-3" />
          </span>
          <span className="tabular-nums">{x.n}</span>
          <span className="text-muted">{x.label}</span>
        </li>
      ))}
    </ul>
  );
}

function BackLink({ hash, label }: { hash: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => setHash(hash)}
      className="inline-flex min-h-11 items-center text-sm font-extrabold text-brand hover:underline"
    >
      ← {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Оглавление
// ---------------------------------------------------------------------------

export function SetsIndex() {
  const t = useT();
  const hydrated = useHydrated();
  const progress = useStore((s) => s.chessPuzzles);
  const themes = useSetThemes();
  return (
    <div className="space-y-4" data-sets>
      <BackLink hash="#all" label={t("Все задачи", "Barcha masalalar")} />
      <header className="space-y-1">
        <h1 className="text-2xl font-black sm:text-3xl">{t("Сборник задач", "Masalalar toʻplami")}</h1>
        <p className="max-w-2xl text-muted">
          {t(
            `${thousands(BANK.total)} задач из открытой базы Lichess, по темам и по номерам — от лёгких к трудным, как в задачнике. Решай по порядку, а к нерешённым возвращайся, пока не решишь все.`,
            `Lichess ochiq bazasidan ${thousands(BANK.total)} ta masala, mavzular va raqamlar boʻyicha — masalalar kitobidagidek osondan qiyinga. Tartib bilan yech, yechilmaganlariga esa hammasini yechguningcha qaytib kel.`,
          )}
        </p>
      </header>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
        {themes.map((theme) => {
          const c = themeCounts(hydrated ? progress : {}, theme.id);
          // Старые ключи после пересборки банка могли остаться в прогрессе — больше, чем задач, не показываем.
          const done = Math.min(c.clean + c.solved, c.total);
          return (
            <li key={theme.id} className="min-w-0">
              <button
                type="button"
                data-set-theme={theme.id}
                onClick={() => setHash(setHashOf(theme.id))}
                className="flex h-full w-full min-w-0 flex-col gap-2 rounded-2xl bg-surface p-3 text-left shadow-card transition hover:-translate-y-0.5 sm:rounded-3xl sm:p-4"
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>
                    {theme.emoji}
                  </span>
                  <span className="min-w-0 text-lg leading-tight font-black wrap-anywhere">{theme.name}</span>
                </span>
                <span className="mt-auto flex items-center gap-2">
                  <ProgressBar value={done} max={c.total} className="flex-1" />
                  <span className="shrink-0 text-xs font-extrabold text-muted tabular-nums">
                    {done} / {c.total}
                  </span>
                </span>
                {c.open > 0 && (
                  <span className="text-sm font-bold text-danger-ink">
                    {t(
                      `Не решены: ${pluralize(c.open, "задача", "задачи", "задач")}`,
                      `Yechilmagan: ${c.open} ta masala`,
                    )}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-center text-xs text-muted">
        {t(
          "Задачи взяты из открытой базы задач Lichess (database.lichess.org, лицензия CC0).",
          "Masalalar Lichess ochiq masalalar bazasidan olingan (database.lichess.org, CC0 litsenziyasi).",
        )}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Номера одной темы
// ---------------------------------------------------------------------------

/** Открытая глава каждой темы — до перезагрузки страницы. */
const lastChapter = new Map<PuzzleTheme, number>();

export function SetGrid({ theme }: { theme: PuzzleTheme }) {
  const t = useT();
  const hydrated = useHydrated();
  const progress = useStore((s) => s.chessPuzzles);
  const info = useSetThemes().find((x) => x.id === theme)!;
  const list = useBank(theme);
  const order = useMemo(() => (Array.isArray(list) ? setOrder(list) : []), [list]);
  const keys = useMemo(() => order.map((p) => p.key), [order]);
  const statusText = useStatusText();
  const [picked, setPicked] = useState<number | null>(lastChapter.get(theme) ?? null);

  const back = <BackLink hash="#sets" label={t("Сборник задач", "Masalalar toʻplami")} />;
  const title = (
    <h1 className="text-2xl font-black">
      <span className="deco" aria-hidden>
        {info.emoji}{" "}
      </span>
      {info.name}
    </h1>
  );
  if (list === "error")
    return (
      <div className="space-y-4">
        {back}
        {title}
        <LoadError onRetry={() => location.reload()} />
      </div>
    );
  if (!hydrated || list === null)
    return (
      <div className="space-y-4">
        {back}
        {title}
        <Loading />
      </div>
    );

  if (!keys.length)
    return (
      <div className="space-y-4">
        {back}
        {title}
        <LoadError onRetry={() => location.reload()} />
      </div>
    );

  const c = setCounts(keys, progress);
  // Продолжить — с первой ещё не открытой задачи; все открывались — с первой нерешённой.
  const fresh = nextWith(keys, progress, ["new"]);
  const resume = fresh >= 0 ? fresh : nextWith(keys, progress, ["open"]);
  const firstOpen = nextWith(keys, progress, ["open"]);
  const parts = chapters(keys.length);
  const chapter = Math.min(picked ?? chapterOf(resume), parts.length - 1);
  const { from, to } = parts[chapter];
  const choose = (k: number) => {
    lastChapter.set(theme, k);
    setPicked(k);
  };

  return (
    <div className="space-y-4" data-set-grid={theme}>
      {back}
      <header className="space-y-2">
        {title}
        <p className="max-w-3xl text-muted">{info.about}</p>
        <CountsLine c={c} />
      </header>
      <div className="flex flex-wrap gap-2">
        {resume >= 0 ? (
          <Button size="lg" onClick={() => setHash(setHashOf(theme, resume))} data-set-resume={resume + 1}>
            <Icon icon={Play} className="fill-current" />
            {c.fresh === c.total
              ? t("Начать с задачи № 1", "1-masaladan boshlash")
              : t(`Продолжить: № ${resume + 1}`, `Davom etish: ${resume + 1}-masala`)}
          </Button>
        ) : (
          <p className="rounded-2xl bg-mint-soft px-4 py-3 font-black text-mint-ink" data-set-complete>
            {t("Все задачи темы решены!", "Mavzudagi barcha masalalar yechildi!")}
          </p>
        )}
        {firstOpen >= 0 && (
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setHash(setHashOf(theme, firstOpen, true))}
            data-set-fix={c.open}
          >
            <Icon icon={RotateCcw} />
            {t(`Решить нерешённые (${c.open})`, `Yechilmaganlarni yechish (${c.open})`)}
          </Button>
        )}
      </div>
      {parts.length > 1 && (
        <div
          role="group"
          aria-label={t("Главы сборника", "Toʻplam boblari")}
          className="flex flex-wrap gap-2 max-sm:-mx-4 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-4 max-sm:pb-1"
        >
          {parts.map((p, k) => {
            const solved = keys.slice(p.from, p.to).filter((key) => progress[key]?.solvedAt).length;
            return (
              <Button
                key={p.from}
                size="sm"
                variant={k === chapter ? "soft" : "secondary"}
                aria-pressed={k === chapter}
                className="shrink-0 whitespace-nowrap tabular-nums"
                data-set-chapter={k}
                onClick={() => choose(k)}
              >
                {p.from + 1}–{p.to}
                {solved === p.to - p.from && (
                  <>
                    <Icon icon={Check} />
                    <span className="sr-only">{t(", все решены", ", hammasi yechilgan")}</span>
                  </>
                )}
              </Button>
            );
          })}
        </div>
      )}
      <ol
        className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5"
        aria-label={t(`Задачи ${from + 1}–${to}`, `${from + 1}–${to}-masalalar`)}
      >
        {keys.slice(from, to).map((key, k) => {
          const i = from + k;
          const status = setStatus(progress[key]);
          return (
            <li key={key}>
              <button
                type="button"
                data-set-number={i + 1}
                data-set-status={status}
                aria-label={t(`Задача ${i + 1}: ${statusText(status)}`, `${i + 1}-masala: ${statusText(status)}`)}
                onClick={() => setHash(setHashOf(theme, i))}
                className={cn(
                  "relative grid h-11 w-full place-items-center rounded-lg border-2 text-sm font-black tabular-nums transition hover:border-brand",
                  TONE[status],
                )}
              >
                {i + 1}
                <StatusMark status={status} className="absolute top-0.5 right-0.5 h-3 w-3" />
              </button>
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-muted">
        {t(
          "Номер — место задачи по трудности (рейтинг задачи в базе Lichess). Задачи, решённые в других режимах, здесь тоже отмечены.",
          "Raqam — masalaning qiyinlik boʻyicha oʻrni (Lichess bazasidagi reytingi). Boshqa rejimlarda yechilgan masalalar ham shu yerda belgilangan.",
        )}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Задача сборника
// ---------------------------------------------------------------------------

export function SetPuzzle({ theme, index, fix }: { theme: PuzzleTheme; index: number; fix: boolean }) {
  const t = useT();
  const hydrated = useHydrated();
  const progress = useStore((s) => s.chessPuzzles);
  const info = useSetThemes().find((x) => x.id === theme)!;
  const list = useBank(theme);
  const order = useMemo(() => (Array.isArray(list) ? setOrder(list) : []), [list]);
  const keys = useMemo(() => order.map((p) => p.key), [order]);
  const puzzle = order[index];
  const total = order.length;
  const gridHash = setHashOf(theme);
  const back = { hash: gridHash, label: t("К номерам темы", "Mavzu raqamlariga") };
  // Стрелки: по порядку — соседний номер; в режиме «нерешённые» — соседняя нерешённая (без круга).
  const prev = fix ? stepWith(keys, progress, ["open"], index, -1) : index - 1;
  const after = fix ? stepWith(keys, progress, ["open"], index, 1) : index + 1 < total ? index + 1 : -1;
  // Глава сетки — та, где задача, которую открыли последней: «Продолжить» и сетка не разойдутся.
  useEffect(() => {
    lastChapter.set(theme, chapterOf(index));
  }, [theme, index]);

  const arrow = "grid h-11 w-11 shrink-0 place-items-center rounded-xl hover:bg-black/5 disabled:opacity-40";
  const top = (
    <PuzzleTop
      back={back}
      end={
        puzzle && (
          <div className="flex shrink-0 items-center lg:hidden">
            <button
              type="button"
              className={arrow}
              disabled={prev < 0}
              aria-label={t("Предыдущая задача", "Oldingi masala")}
              onClick={() => setHash(setHashOf(theme, prev, fix))}
              data-set-prev
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={2.5} aria-hidden />
            </button>
            <button
              type="button"
              className={cn(arrow, "-mr-2")}
              disabled={after < 0}
              aria-label={t("Следующая задача", "Keyingi masala")}
              onClick={() => setHash(setHashOf(theme, after, fix))}
              data-set-next
            >
              <ChevronRight className="h-6 w-6" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
        )
      }
    >
      <h1 className="truncate text-lg font-black lg:text-2xl lg:whitespace-normal" data-set-title>
        <span className="deco" aria-hidden>
          {info.emoji}{" "}
        </span>
        {info.name} · № {index + 1}
        {total > 0 && <span className="text-muted max-lg:hidden"> / {total}</span>}
      </h1>
    </PuzzleTop>
  );

  if (list === "error")
    return (
      <div className="board-stage board-wide board-top space-y-2 sm:space-y-4">
        {top}
        <LoadError onRetry={() => location.reload()} />
      </div>
    );
  if (list === null || !hydrated)
    return (
      <div className="board-stage board-wide board-top space-y-2 sm:space-y-4">
        {top}
        <Loading />
      </div>
    );
  if (!puzzle)
    return (
      <div className="space-y-4">
        <BackLink hash={gridHash} label={back.label} />
        <h1 className="text-2xl font-black" data-set-missing>
          {t(`В этой теме нет задачи № ${index + 1}`, `Bu mavzuda ${index + 1}-masala yoʻq`)}
        </h1>
        <Button onClick={() => setHash(gridHash)}>{t("К номерам темы", "Mavzu raqamlariga")}</Button>
      </div>
    );

  const c = setCounts(keys, progress);
  const openNext = nextWith(keys, progress, ["open"], index);
  const moreOpen = openNext >= 0 && openNext !== index;
  // «Дальше»: по порядку — следующий номер; в режиме «нерешённые» — следующая нерешённая (после решения этой).
  const go = () => {
    if (!fix) {
      setHash(index + 1 < total ? setHashOf(theme, index + 1) : gridHash);
      return;
    }
    const next = nextWith(keys, getState().chessPuzzles, ["open"], index);
    setHash(next >= 0 && next !== index ? setHashOf(theme, next, true) : gridHash);
  };
  const nextLabel = fix
    ? moreOpen
      ? t("Следующая нерешённая →", "Keyingi yechilmagan →")
      : t("Все нерешённые решены! К номерам →", "Barcha yechilmaganlar yechildi! Raqamlarga →")
    : index + 1 < total
      ? t(`Задача № ${index + 2} →`, `${index + 2}-masala →`)
      : nextWith(keys, progress, ["new", "open"]) < 0
        ? t("Тема пройдена! К номерам →", "Mavzu tugadi! Raqamlarga →")
        : t("К номерам темы →", "Mavzu raqamlariga →");

  return (
    <div className="board-stage board-wide board-top space-y-2 sm:space-y-4" data-set-puzzle={index + 1}>
      {top}
      {/* Широкий экран: счёт темы и состояние задачи — в правой колонке; на телефоне место отдаём доске. */}
      <div className="space-y-2 max-lg:hidden">
        {fix && (
          <p className="font-bold text-danger-ink">
            {t(`Нерешённые задачи темы: осталось ${c.open}`, `Mavzuning yechilmagan masalalari: ${c.open} ta qoldi`)}
          </p>
        )}
        <CountsLine c={c} />
        <BeforeNote key={puzzle.key} puzzleKey={puzzle.key} />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={prev < 0}
            onClick={() => setHash(setHashOf(theme, prev, fix))}
          >
            <Icon icon={ChevronLeft} /> {t("Предыдущая", "Oldingi")}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={after < 0}
            onClick={() => setHash(setHashOf(theme, after, fix))}
          >
            {t("Следующая", "Keyingi")} <Icon icon={ChevronRight} />
          </Button>
        </div>
      </div>
      <PuzzlePlayer key={puzzle.key} puzzle={puzzle} themed next={{ label: nextLabel, onClick: go }} />
    </div>
  );
}

/** Было ли что-то с задачей до этого захода: берём один раз при открытии — ошибка в этой попытке надпись не меняет. */
function BeforeNote({ puzzleKey }: { puzzleKey: string }) {
  const t = useT();
  const [status] = useState(() => setStatus(getState().chessPuzzles[puzzleKey]));
  if (status === "new") return null;
  return (
    <p className="text-sm font-bold text-muted" data-set-before={status}>
      {status === "open"
        ? t("Эту задачу раньше не решили — попробуй снова.", "Bu masala avval yechilmagan — yana urinib koʻr.")
        : t("Эта задача уже решена — можно решить ещё раз.", "Bu masala yechilgan — yana bir bor yechsa boʻladi.")}
    </p>
  );
}
