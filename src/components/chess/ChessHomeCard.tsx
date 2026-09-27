"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/ui";
import { CHESS_LEVELS, CHESS_SCHOOL, chessLevelHref } from "@/content/chess";
import { currentRank, levelStatuses } from "@/lib/chessProgress";
import { useHydrated, useStore } from "@/lib/store";
import { PieceIcon } from "./ChessBoard";

/** Карточка шахматной школы на главной: звание и следующий уровень. */
export function ChessHomeCard() {
  const hydrated = useHydrated();
  const state = useStore((s) => s);
  const statuses = levelStatuses(CHESS_LEVELS, state);
  const rank = hydrated ? currentRank(CHESS_LEVELS, state) : null;
  const nextIndex = hydrated ? statuses.findIndex((s) => !s.passed) : 0;
  const next = nextIndex >= 0 ? CHESS_LEVELS[nextIndex] : null;
  const solved = hydrated ? statuses.reduce((s, x) => s + x.solved, 0) : 0;
  const total = statuses.reduce((s, x) => s + x.total, 0);

  return (
    <section
      aria-labelledby="chess-home"
      className="flex flex-col gap-4 rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-5 text-white shadow-lift sm:flex-row sm:items-center sm:p-6"
    >
      <div className="flex items-center gap-4">
        <div className="flex -space-x-5" aria-hidden>
          {CHESS_LEVELS.map((l) => (
            <PieceIcon
              key={l.id}
              piece={l.piece}
              className="h-12 w-12 rounded-2xl bg-[#f0d9b5] p-0.5 ring-2 ring-[#5b4632]"
            />
          ))}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <h2 id="chess-home" className="text-2xl font-black">
          ♞ {CHESS_SCHOOL.title}
        </h2>
        <p className="text-white/85">
          {rank ? `Твоё звание — «${rank.name}». ` : "Шесть званий: от Пешки до Короля. "}
          {!next
            ? "Все звания получены! 👑"
            : rank
              ? `Следующий уровень: «${next.name}».`
              : `Начни с уровня «${next.name}»!`}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <ProgressBar value={solved} max={total} className="flex-1 bg-white/20" />
          <span className="text-xs font-extrabold whitespace-nowrap text-white/80">
            {solved} из {total}
          </span>
        </div>
      </div>
      <Link
        href={next ? chessLevelHref(next.id) : "/chess"}
        className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-sun px-6 py-2 text-lg font-bold text-ink shadow-[0_4px_0_0_#b45309] transition hover:bg-[#f7a81d]"
      >
        {solved > 0 ? "Продолжить ▶" : "Начать ▶"}
      </Link>
    </section>
  );
}
