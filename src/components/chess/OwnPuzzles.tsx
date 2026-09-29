"use client";

import Link from "next/link";
import { useState } from "react";
import { Feedback, type FeedbackState } from "@/components/answers/Feedback";
import { Button, ButtonLink, cn } from "@/components/ui";
import { isInCheck, isPromotionMove, legalTargets, pieceAt, playMove, type Color } from "@/lib/chess";
import { isAlmostBest } from "@/lib/engine/analysis";
import { sanFor, tFor, useLang, useSan, useT, type Lang } from "@/lib/i18n";
import { chessOwnPuzzleSolved, useHydrated, useStore, type ChessGameRecord } from "@/lib/store";
import { setHash } from "@/lib/useHash";
import { kingOf } from "@/lib/play";
import { ChessBoard, type PromotionPiece, type SquareMark } from "./ChessBoard";
import { gameTitle } from "./GameReview";
import { usePromotion } from "./useMoveInput";

export interface OwnPuzzle {
  key: string;
  gameId: string;
  title: string;
  fen: string;
  side: Color;
  played: string;
  best: string;
  bestSan: string;
  kind: "mistake" | "blunder";
}

/**
 * Ошибки и зевки из разобранных партий — позиция перед ошибкой становится задачей «найди ход сильнее».
 * Название и запись ходов — на языке lang.
 */
export function ownPuzzles(games: readonly ChessGameRecord[], lang: Lang = "ru"): OwnPuzzle[] {
  const t = tFor(lang);
  const out: OwnPuzzle[] = [];
  for (const g of games) {
    for (const m of g.analysis?.moments ?? []) {
      if (g.mode === "robot" && m.side !== g.color) continue;
      const move = Math.ceil(m.ply / 2);
      out.push({
        key: `${g.id}:${m.ply}`,
        gameId: g.id,
        title: t(`${gameTitle(g)}, ход ${move}`, `${gameTitle(g, lang)}, ${move}-yurish`),
        fen: m.fen,
        side: m.side,
        played: sanFor(lang, m.san),
        best: m.best,
        bestSan: sanFor(lang, m.bestSan),
        kind: m.kind,
      });
    }
  }
  return out;
}

export function OwnPuzzlesView() {
  const hydrated = useHydrated();
  const t = useT();
  const lang = useLang();
  const games = useStore((s) => s.chessGames);
  const solved = useStore((s) => s.chessOwnPuzzles);
  const list = hydrated ? ownPuzzles(games, lang) : [];
  const firstOpen = Math.max(
    0,
    list.findIndex((p) => !solved[p.key]),
  );
  const [index, setIndex] = useState<number | null>(null);
  const i = Math.min(index ?? firstOpen, Math.max(0, list.length - 1));
  const puzzle = list[i];
  const done = list.filter((p) => solved[p.key]).length;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setHash("#all")}
        className="text-sm font-extrabold text-brand hover:underline"
      >
        ← {t("Все задачи", "Barcha masalalar")}
      </button>
      <header>
        <h1 className="text-2xl font-black">🧩 {t("Задачи из твоих партий", "Oʻz partiyalaringdan masalalar")}</h1>
        <p className="text-muted">
          {t(
            "Робот-тренер нашёл в твоих партиях моменты, где был ход сильнее. Найди его сейчас — тогда в следующей партии ты его не пропустишь.",
            "Robot-murabbiy partiyalaringda kuchliroq yurish bor boʻlgan lahzalarni topdi. Oʻsha yurishni hozir top — keyingi partiyada uni qoʻldan boy bermaysan.",
          )}
        </p>
      </header>
      {!hydrated ? null : list.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-center shadow-card">
          <p className="text-lg font-black">{t("Пока задач нет.", "Hozircha masala yoʻq.")}</p>
          <p className="mt-1 text-muted">
            {t(
              "Сыграй партию с роботом и открой её разбор — ошибки из разобранных партий появятся здесь.",
              "Robot bilan partiya oʻyna va uning tahlilini och — tahlil qilingan partiyalardagi xatolar shu yerda paydo boʻladi.",
            )}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <ButtonLink href="/chess/play">{t("Играть", "Oʻynash")}</ButtonLink>
            <ButtonLink href="/chess/review" variant="secondary">
              {t("Разбор партий", "Partiyalar tahlili")}
            </ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-1.5" aria-label={t("Задачи", "Masalalar")}>
            {list.map((p, k) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setIndex(k)}
                aria-current={k === i ? "step" : undefined}
                aria-label={t(
                  `Задача ${k + 1}${solved[p.key] ? " (решена)" : ""}`,
                  `${k + 1}-masala${solved[p.key] ? " (yechilgan)" : ""}`,
                )}
                className={cn(
                  "h-10 min-w-10 rounded-xl border-2 px-2 font-black",
                  k === i
                    ? "border-brand bg-brand text-white"
                    : solved[p.key]
                      ? "border-mint/50 bg-mint-soft text-[#065f46]"
                      : "border-line bg-white",
                )}
              >
                {solved[p.key] && k !== i ? "✓" : k + 1}
              </button>
            ))}
            <span className="ml-auto text-sm font-extrabold text-muted">
              {t(`Решено ${done} из ${list.length}`, `Yechildi: ${done} / ${list.length}`)}
            </span>
          </div>
          {puzzle && (
            <OwnPuzzleBoard
              key={puzzle.key}
              puzzle={puzzle}
              onNext={i < list.length - 1 ? () => setIndex(i + 1) : undefined}
            />
          )}
        </>
      )}
    </div>
  );
}

function OwnPuzzleBoard({ puzzle, onNext }: { puzzle: OwnPuzzle; onNext?: () => void }) {
  const t = useT();
  const san = useSan();
  const [selected, setSelected] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const [shown, setShown] = useState(puzzle.fen);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [last, setLast] = useState<[string, string] | null>(null);
  const promo = usePromotion(shown);

  const attempt = (from: string, to: string, promotion?: PromotionPiece): boolean => {
    if (done) return false;
    if (!promotion && isPromotionMove(puzzle.fen, from, to)) {
      promo.ask(to, puzzle.side, (piece) => attempt(from, to, piece));
      return true;
    }
    const played = playMove(puzzle.fen, from, to, promotion ?? "q");
    if (!played) return false;
    setSelected(null);
    setShown(played.fen);
    setLast([from, to]);
    if (isAlmostBest(puzzle.fen, played.uci, puzzle.best)) {
      setDone(true);
      chessOwnPuzzleSolved(puzzle.key);
      setFeedback({
        tone: "success",
        text:
          played.uci === puzzle.best
            ? t(`${san(played.san)} — точно! 🎉`, `${san(played.san)} — aynan shu! 🎉`)
            : t(`${san(played.san)} — тоже сильный ход! 🎉`, `${san(played.san)} — bu ham kuchli yurish! 🎉`),
        sub:
          played.uci === puzzle.best
            ? t(
                `В партии было ${puzzle.played} — теперь ты знаешь, как лучше.`,
                `Partiyada ${puzzle.played} yurilgan edi — endi qanday qilish yaxshiroq ekanini bilasan.`,
              )
            : t(
                `Робот-тренер предлагал ${puzzle.bestSan}, но твой ход почти так же хорош.`,
                `Robot-murabbiy ${puzzle.bestSan} yurishni taklif qilgan edi, lekin sening yurishing ham deyarli shunchalik yaxshi.`,
              ),
      });
    } else {
      const n = misses + 1;
      setMisses(n);
      setFeedback({
        tone: "retry",
        text:
          n === 1
            ? t("Есть ход сильнее. Подумай ещё!", "Bundan kuchliroq yurish bor. Yana oʻylab koʻr!")
            : n === 2
              ? t("Подсвечена фигура, которой нужно ходить.", "Qaysi dona yurishi kerakligi belgilab qoʻyildi.")
              : t("Зелёная стрелка показывает ход.", "Yashil strelka yurishni koʻrsatib turibdi."),
        sub:
          n === 1
            ? t(
                "Проверь шахи, взятия и угрозы — свои и соперника.",
                "Shoh berish, urib olish va tahdidlarni tekshir — oʻzingnikini ham, raqibnikini ham.",
              )
            : undefined,
      });
      setTimeout(() => {
        setShown(puzzle.fen);
        setLast(null);
      }, 700);
    }
    return true;
  };

  const tap = (sq: string) => {
    if (done) return;
    const piece = pieceAt(puzzle.fen, sq);
    if (piece && piece.color === puzzle.side) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected) attempt(selected, sq);
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
  if (misses >= 2 && !done) marks[puzzle.best.slice(0, 2)] = "hint";
  if (selected) {
    marks[selected] = "selected";
    for (const sq of legalTargets(puzzle.fen, selected)) marks[sq] = pieceAt(puzzle.fen, sq) ? "capture" : "target";
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        <ChessBoard
          id="own-puzzle"
          position={shown}
          marks={marks}
          orientation={puzzle.side === "w" ? "white" : "black"}
          onSquare={tap}
          draggable={!done}
          onDrop={(from, to) => attempt(from, to)}
          promotion={promo.request}
          arrows={
            misses >= 3 && !done
              ? [{ from: puzzle.best.slice(0, 2), to: puzzle.best.slice(2, 4), color: "#10b981" }]
              : []
          }
          maxWidth={480}
        />
        <Feedback state={feedback} />
      </div>
      <aside className="space-y-3">
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <p className="text-xs font-extrabold tracking-wide text-muted uppercase">{puzzle.title}</p>
          <p className="mt-1 text-lg font-black">
            {t(
              `Ходят ${puzzle.side === "w" ? "белые" : "чёрные"}. Найди ход сильнее!`,
              `${puzzle.side === "w" ? "Oqlar" : "Qoralar"} yuradi. Kuchliroq yurishni top!`,
            )}
          </p>
          <p className="mt-1 text-sm text-muted">
            {t(
              `В партии было сыграно ${puzzle.played} — это была ${puzzle.kind === "blunder" ? "грубая ошибка (зевок)" : "ошибка"}.`,
              `Partiyada ${puzzle.played} yurilgan edi — bu ${puzzle.kind === "blunder" ? "qoʻpol xato" : "xato"} edi.`,
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/chess/review#${puzzle.gameId}`}
            className="rounded-xl px-3 py-2 text-sm font-extrabold text-brand hover:bg-brand-soft"
          >
            🔎 {t("Разбор этой партии", "Shu partiya tahlili")}
          </Link>
          {onNext && (
            <Button size="sm" onClick={onNext}>
              {t("Следующая задача →", "Keyingi masala →")}
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
