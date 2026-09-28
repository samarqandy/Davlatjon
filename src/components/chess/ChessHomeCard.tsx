"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/ui";
import { chessLevelHref } from "@/content/chess";
import { currentRank, levelStatuses } from "@/lib/chessProgress";
import { useT } from "@/lib/i18n";
import { useHydrated, useStore } from "@/lib/store";
import { useChess } from "@/lib/useChess";
import { PieceIcon } from "./ChessBoard";

/** Карточка шахматной школы на главной: звание и следующий уровень. */
export function ChessHomeCard() {
  const hydrated = useHydrated();
  const t = useT();
  const { levels, school } = useChess();
  const state = useStore((s) => s);
  const statuses = levelStatuses(levels, state);
  const rank = hydrated ? currentRank(levels, state) : null;
  const nextIndex = hydrated ? statuses.findIndex((s) => !s.passed) : 0;
  const next = nextIndex >= 0 ? levels[nextIndex] : null;
  const solved = hydrated ? statuses.reduce((s, x) => s + x.solved, 0) : 0;
  const total = statuses.reduce((s, x) => s + x.total, 0);

  return (
    <section
      aria-labelledby="chess-home"
      className="flex flex-col gap-4 rounded-[2rem] bg-linear-to-br from-[#3b2f23] via-[#5b4632] to-[#7c5a33] p-5 text-white shadow-lift sm:flex-row sm:items-center sm:p-6"
    >
      <div className="flex items-center gap-4">
        <div className="flex -space-x-5" aria-hidden>
          {levels.map((l) => (
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
          ♞ {school.title}
        </h2>
        <p className="text-white/85">
          {rank
            ? t(`Твоё звание — «${rank.name}». `, `Sening unvoning — «${rank.name}». `)
            : t("Шесть званий: от Пешки до Короля. ", "Oltita unvon: Piyodadan Shohgacha. ")}
          {!next
            ? t("Все звания получены! 👑", "Hamma unvonlarni olding! 👑")
            : rank
              ? t(`Следующий уровень: «${next.name}».`, `Keyingi daraja: «${next.name}».`)
              : t(`Начни с уровня «${next.name}»!`, `«${next.name}» darajasidan boshla!`)}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <ProgressBar value={solved} max={total} className="flex-1 bg-white/20" />
          <span className="text-xs font-extrabold whitespace-nowrap text-white/80">
            {t(`${solved} из ${total}`, `${solved} / ${total}`)}
          </span>
        </div>
      </div>
      <Link
        href={next ? chessLevelHref(next.id) : "/chess"}
        className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-sun px-6 py-2 text-lg font-bold text-ink shadow-[0_4px_0_0_#b45309] transition hover:bg-[#f7a81d]"
      >
        {solved > 0 ? t("Продолжить ▶", "Davom etish ▶") : t("Начать ▶", "Boshlash ▶")}
      </Link>
    </section>
  );
}
