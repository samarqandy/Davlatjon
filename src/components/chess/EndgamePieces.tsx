"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/ui";
import { ENDGAME_PIECES_PART } from "@/content/chess/parts/endgamePieces";
import type { ChessTactic } from "@/content/chess/types";
import { useT } from "@/lib/i18n";
import { useChessPart } from "@/lib/useChess";
import { setHash, useHash } from "@/lib/useHash";
import { BoardThumb, PieceSprite } from "./BoardThumb";
import { parseHash, TopicView, useSolved } from "./TacticsSchool";

/**
 * Школа эндшпиля, часть 2: ладья, ферзь и слон — позиции, которые знают наизусть.
 *
 * Урок устроен как тема тактики (рассказ с доской, упражнения, словарик), поэтому экран темы общий — TopicView.
 * Первая часть школы (король и пешка, /chess/endgames) другая: там ответы считает точная таблица прямо на странице
 * и есть игра с роботом; здесь результат каждого хода проверен по таблицам окончаний заранее (tests/fixtures).
 */
export function EndgamePieces() {
  const t = useT();
  const { endgamePieces } = useChessPart(ENDGAME_PIECES_PART);
  const parsed = parseHash(useHash(), endgamePieces);
  return (
    <div className="space-y-6">
      {parsed.topic ? (
        <TopicView
          topic={parsed.topic}
          tab={parsed.tab}
          exercise={parsed.exercise}
          siblings={endgamePieces}
          backLabel={t("← Все уроки", "← Barcha darslar")}
          lessonKeyPrefix="end-"
          kicker={t(
            `Урок ${endgamePieces.indexOf(parsed.topic) + 1}`,
            `${endgamePieces.indexOf(parsed.topic) + 1}-dars`,
          )}
        />
      ) : (
        <Overview />
      )}
    </div>
  );
}

function Overview() {
  const t = useT();
  const { endgamePieces, endgamePiecesSchool } = useChessPart(ENDGAME_PIECES_PART);
  return (
    <>
      <Link
        href="/chess/endgames"
        className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline"
      >
        ← {t("Школа эндшпиля", "Endshpil maktabi")}
      </Link>
      <header className="max-w-2xl">
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{endgamePiecesSchool.subtitle}</p>
        <h1 className="text-3xl font-black">{endgamePiecesSchool.title}</h1>
        <p className="mt-1 text-muted">{endgamePiecesSchool.about}</p>
      </header>
      <PieceSprite />
      <ol className="grid gap-3 sm:grid-cols-2" aria-label={t("Уроки", "Darslar")}>
        {endgamePieces.map((topic, i) => (
          <li key={topic.id}>
            <TopicRow topic={topic} n={i + 1} />
          </li>
        ))}
      </ol>
    </>
  );
}

/** Карточка урока: доска-картинка с главной позицией, название, мысль и прогресс. */
function TopicRow({ topic, n }: { topic: ChessTactic; n: number }) {
  const t = useT();
  const { count } = useSolved(topic);
  const total = topic.exercises.length;
  const fen = topic.lesson.find((card) => card.demo)?.demo?.fen;
  return (
    <button
      type="button"
      data-endgame-topic={topic.id}
      onClick={() => setHash(`#${topic.id}`)}
      className="flex h-full w-full gap-3 rounded-3xl bg-surface p-3 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      {fen && <BoardThumb position={fen} size={120} />}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-extrabold tracking-wide text-muted uppercase">{t(`Урок ${n}`, `${n}-dars`)}</span>
        <span className="text-lg leading-tight font-black">{topic.title}</span>
        <span className="mt-1 line-clamp-3 text-sm text-muted">{topic.idea}</span>
        <span className="mt-auto flex items-center gap-2 pt-2">
          <ProgressBar value={count} max={total} className="flex-1" />
          <span className="text-sm font-extrabold whitespace-nowrap">
            {count === total ? t("✓ пройдено", "✓ tugallandi") : `${count} / ${total}`}
          </span>
        </span>
      </span>
    </button>
  );
}
