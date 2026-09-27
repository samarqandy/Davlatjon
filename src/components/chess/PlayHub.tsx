"use client";

import Link from "next/link";
import { Button, cn } from "@/components/ui";
import { ROBOT_LEVELS } from "@/lib/engine/search";
import { ENDGAMES } from "@/lib/play";
import { useHydrated, useStore } from "@/lib/store";
import { setHash, useHash } from "@/lib/useHash";
import { PieceIcon } from "./ChessBoard";
import { PlayBoard, type PlayConfig } from "./PlayBoard";

/** Адрес вида #robot-3-w, #two, #pawns-2-b, #endgame-kq. */
function parseConfig(hash: string): PlayConfig | null {
  const [mode, a, b] = hash.replace(/^#/, "").split("-");
  if (mode === "robot") return { mode, level: Math.min(5, Math.max(1, Number(a) || 1)), color: b === "b" ? "b" : "w" };
  if (mode === "two") return { mode, level: 1, color: "w" };
  if (mode === "pawns") return { mode, level: Math.min(3, Math.max(1, Number(a) || 1)), color: b === "b" ? "b" : "w" };
  if (mode === "endgame") {
    const variant = ENDGAMES.find((v) => v.id === a);
    return variant ? { mode, level: 4, color: "w", variant } : null;
  }
  return null;
}

export function PlayHub() {
  const hash = useHash();
  const config = parseConfig(hash);
  if (config) {
    return <PlayBoard key={hash} config={config} onExit={() => setHash("#modes")} />;
  }
  return <ModeChooser />;
}

function ModeChooser() {
  const hydrated = useHydrated();
  const games = useStore((s) => s.chessGames);
  const robotGames = hydrated ? games.filter((g) => g.mode === "robot") : [];
  const wins = (level: number) => robotGames.filter((g) => g.level === level && g.result === "win").length;

  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← Шахматная школа
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Играть</p>
        <h1 className="text-3xl font-black">Шахматная доска</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Играй с роботом, вдвоём с мамой или папой на одном экране, устрой пешечный бой или потренируй мат одинокому
          королю. Доска сама следит за правилами.
        </p>
      </header>

      <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="robot">
        <h2 id="robot" className="text-xl font-black">
          🤖 С роботом
        </h2>
        <p className="mt-1 text-sm text-muted">
          Выбери силу робота. Начни с «Пешки» — и поднимайся выше, когда начнёшь побеждать.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-5">
          {ROBOT_LEVELS.map((l) => (
            <div key={l.id} className="flex flex-col rounded-2xl border-2 border-line p-3">
              <div className="flex items-center gap-2">
                <PieceIcon piece={l.piece} className="h-10 w-10 rounded-xl bg-[#f0d9b5] p-0.5" />
                <div>
                  <p className="font-black">{l.name}</p>
                  <p className="text-xs font-bold text-muted">уровень {l.id}</p>
                </div>
              </div>
              <p className="mt-2 flex-1 text-xs text-muted">{l.about}</p>
              {hydrated && wins(l.id) > 0 && (
                <p className="mt-1 text-xs font-extrabold text-[#065f46]">🏆 побед: {wins(l.id)}</p>
              )}
              <div className="mt-2 flex gap-1">
                <Button size="sm" className="flex-1" onClick={() => setHash(`#robot-${l.id}-w`)}>
                  Белыми
                </Button>
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => setHash(`#robot-${l.id}-b`)}>
                  Чёрными
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="two">
          <h2 id="two" className="text-xl font-black">
            👨‍👦 Вдвоём
          </h2>
          <p className="mt-1 text-sm text-muted">
            Партия на одном экране: ты и мама, папа или друг. Доска подсвечивает ходы, объявляет шах и мат, считает
            ходы.
          </p>
          <Button className="mt-3" onClick={() => setHash("#two")}>
            Начать партию
          </Button>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="pawns">
          <h2 id="pawns" className="text-xl font-black">
            ♟ Пешечный бой
          </h2>
          <p className="mt-1 text-sm text-muted">
            Только пешки! Кто первым проведёт пешку до края — победил. Лучшая игра, чтобы понять, как ходят и бьют
            пешки.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[1, 2, 3].map((lvl) => (
              <Button
                key={lvl}
                size="sm"
                variant={lvl === 1 ? "primary" : "secondary"}
                onClick={() => setHash(`#pawns-${lvl}-w`)}
              >
                Робот {lvl === 1 ? "🐣" : lvl === 2 ? "🙂" : "😎"}
              </Button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-card" aria-labelledby="endgames">
          <h2 id="endgames" className="text-xl font-black">
            🏁 Поставь мат
          </h2>
          <p className="mt-1 text-sm text-muted">
            Робот убегает королём, а ты ставишь мат. Позиция каждый раз новая. Главное — не поставить пат!
          </p>
          <div className="mt-3 flex flex-col gap-1.5">
            {ENDGAMES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setHash(`#endgame-${v.id}`)}
                className={cn(
                  "flex items-center justify-between rounded-xl border-2 border-line px-3 py-2 text-left font-extrabold transition hover:border-brand/40 hover:bg-brand-soft/40",
                )}
              >
                {v.name}
                <span className="text-xs text-muted">до {v.target} ходов</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {hydrated && games.length > 0 && (
        <section className="rounded-3xl bg-white p-5 shadow-card">
          <h2 className="text-lg font-black">Мои партии</h2>
          <p className="mt-1 text-sm font-bold text-muted">
            Сыграно: {games.length} · побед: {games.filter((g) => g.result === "win").length} · ничьих:{" "}
            {games.filter((g) => g.result === "draw").length}
          </p>
        </section>
      )}
    </div>
  );
}
