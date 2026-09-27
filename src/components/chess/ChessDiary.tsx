"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, cn } from "@/components/ui";
import { pluralize } from "@/lib/plural";
import { addChessDiary, removeChessDiary, useHydrated, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";

const RESULT: Record<"win" | "loss" | "draw", { emoji: string; label: string }> = {
  win: { emoji: "🏆", label: "победа" },
  loss: { emoji: "📘", label: "поражение" },
  draw: { emoji: "🤝", label: "ничья" },
};

/** Дневник партий, сыгранных не на экране: с папой, в кружке, с другом. */
export function ChessDiary() {
  const hydrated = useHydrated();
  const entries = useStore((s) => s.chessDiary);
  const games = useStore((s) => s.chessGames);
  const today = useToday();
  const [date, setDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [color, setColor] = useState<"w" | "b">("w");
  const [result, setResult] = useState<"win" | "loss" | "draw">("win");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const submit = () => {
    if (!opponent.trim()) return;
    addChessDiary({ date: date || today, opponent: opponent.trim(), color, result, notes: notes.trim() });
    setOpponent("");
    setNotes("");
    setSaved(true);
  };

  const robotWins = hydrated ? games.filter((g) => g.result === "win").length : 0;

  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        ← Шахматная школа
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">Дневник</p>
        <h1 className="text-3xl font-black">Мои партии</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Записывай партии, которые сыграл с папой, мамой, друзьями или в кружке. Самое важное — не результат, а что ты
          понял.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="space-y-3 rounded-3xl bg-white p-5 shadow-card" aria-labelledby="add">
          <h2 id="add" className="text-xl font-black">
            ✍️ Записать партию
          </h2>
          <label className="block text-sm font-extrabold text-muted">
            Когда
            <input
              type="date"
              value={date || today}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block h-11 w-full rounded-xl border-2 border-line bg-paper px-3 font-bold outline-none focus:border-brand"
            />
          </label>
          <label className="block text-sm font-extrabold text-muted">
            С кем играл
            <input
              value={opponent}
              onChange={(e) => {
                setOpponent(e.target.value.slice(0, 40));
                setSaved(false);
              }}
              placeholder="папа, Али, тренер…"
              className="mt-1 block h-11 w-full rounded-xl border-2 border-line bg-paper px-3 font-bold outline-none focus:border-brand"
            />
          </label>
          <div className="flex flex-wrap gap-4">
            <fieldset>
              <legend className="text-sm font-extrabold text-muted">Мой цвет</legend>
              <div className="mt-1 flex gap-1.5">
                {(["w", "b"] as const).map((c) => (
                  <Button key={c} size="sm" variant={color === c ? "primary" : "secondary"} onClick={() => setColor(c)}>
                    {c === "w" ? "⬜ Белые" : "⬛ Чёрные"}
                  </Button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-extrabold text-muted">Результат</legend>
              <div className="mt-1 flex gap-1.5">
                {(["win", "draw", "loss"] as const).map((r) => (
                  <Button
                    key={r}
                    size="sm"
                    variant={result === r ? "primary" : "secondary"}
                    onClick={() => setResult(r)}
                  >
                    {RESULT[r].emoji} {RESULT[r].label}
                  </Button>
                ))}
              </div>
            </fieldset>
          </div>
          <label className="block text-sm font-extrabold text-muted">
            Что я понял или что было интересного
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 300))}
              rows={3}
              placeholder="Например: поставил мат ладьёй; зевнул ферзя, теперь буду проверять…"
              className="mt-1 block w-full rounded-xl border-2 border-line bg-paper px-3 py-2 font-semibold outline-none focus:border-brand"
            />
          </label>
          <Button onClick={submit} disabled={!opponent.trim()}>
            Записать в дневник
          </Button>
          {saved && <p className="text-sm font-bold text-[#065f46]">Записано ✓</p>}
        </section>

        <section className="space-y-3" aria-labelledby="list">
          <h2 id="list" className="text-xl font-black">
            📖 Записи{hydrated && entries.length ? ` (${entries.length})` : ""}
          </h2>
          {hydrated && robotWins > 0 && (
            <p className="rounded-2xl bg-sun-soft/70 px-4 py-2 text-sm font-bold text-[#7a4b00]">
              А ещё на этой доске ты выиграл у робота {pluralize(robotWins, "партию", "партии", "партий")}.
            </p>
          )}
          {hydrated && entries.length === 0 && <p className="text-muted">Пока пусто. Сыграй партию и запиши её!</p>}
          <ul className="space-y-2">
            {hydrated &&
              entries.map((e) => (
                <li
                  key={e.id}
                  className={cn(
                    "rounded-2xl bg-white p-4 shadow-card",
                    e.result === "win" && "border-2 border-mint/40",
                  )}
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-2xl" aria-hidden>
                      {RESULT[e.result].emoji}
                    </span>
                    <span className="font-black">
                      {RESULT[e.result].label} · с {e.opponent}
                    </span>
                    <span className="text-sm text-muted">
                      {e.date} · {e.color === "w" ? "белыми" : "чёрными"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeChessDiary(e.id)}
                      className="ml-auto text-xs font-bold text-muted hover:text-rose"
                      aria-label="Удалить запись"
                    >
                      удалить
                    </button>
                  </div>
                  {e.notes && <p className="mt-1">{e.notes}</p>}
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
