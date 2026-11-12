"use client";

import { Minus, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { Button, cn, Icon } from "@/components/ui";
import { useT } from "@/lib/i18n";
import {
  addLatePlayer,
  setTotalRounds,
  toggleWithdrawn,
  totalRoundsRange,
  updatePlayer,
} from "@/lib/tournament/engine";
import { saveTournament } from "@/lib/tournament/store";
import type { TPlayer, Tournament } from "@/lib/tournament/types";

const FIELD =
  "w-full rounded-2xl border-2 border-line bg-surface px-4 py-2.5 font-bold outline-none focus:border-brand";

/** Участники: стартовые номера, правка имени и рейтинга; в швейцарской — выбывшие, опоздавшие и число туров. */
export function TournamentPlayers({ tournament: t }: { tournament: Tournament }) {
  const tr = useT();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const swiss = t.format === "swiss";
  const canAdd = swiss && t.rounds.length < t.totalRounds;
  const players = [...t.players].sort((a, b) => a.seed - b.seed);
  const range = totalRoundsRange(t);
  const add = () => {
    const m = name.trim().match(/^(.*\S)[\s,;]+(\d{3,4})$/);
    const entry = m ? { name: m[1], rating: Number(m[2]) } : { name };
    if (!entry.name.trim()) return;
    saveTournament(addLatePlayer(t, entry));
    setName("");
  };
  return (
    <section className="space-y-4" aria-label={tr("Участники", "Ishtirokchilar")}>
      <ol className="divide-y divide-line/60 rounded-3xl bg-surface px-4 shadow-card" data-players>
        {players.map((p) => {
          const gone = p.withdrawnAfter !== undefined;
          if (editing === p.id)
            return (
              <li key={p.id} className="py-3">
                <PlayerForm
                  player={p}
                  onCancel={() => setEditing(null)}
                  onSave={(entry) => {
                    saveTournament(updatePlayer(t, p.id, entry));
                    setEditing(null);
                  }}
                />
              </li>
            );
          return (
            <li key={p.id} className="flex min-h-14 flex-wrap items-center gap-x-3 py-1.5" data-player={p.seed}>
              <span className="w-7 shrink-0 text-right text-sm font-black text-muted tabular-nums">{p.seed}</span>
              <span className={cn("min-w-0 flex-1 font-extrabold break-words", gone && "text-muted line-through")}>
                {p.name}
              </span>
              {p.rating && <span className="text-sm font-bold text-muted tabular-nums">{p.rating}</span>}
              {(p.joinedRound ?? 1) > 1 && (
                <span className="text-sm font-bold text-muted">
                  {tr(`с тура ${p.joinedRound}`, `${p.joinedRound}-turdan`)}
                </span>
              )}
              <span className="ml-auto flex shrink-0 print:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(p.id)}
                  aria-label={tr(`Изменить: ${p.name}`, `Oʻzgartirish: ${p.name}`)}
                  data-player-edit={p.seed}
                >
                  <Icon icon={Pencil} />
                </Button>
                {swiss && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => saveTournament(toggleWithdrawn(t, p.id))}
                    data-withdraw={p.seed}
                  >
                    {gone ? tr("Вернуть", "Qaytarish") : tr("Выбыл", "Chiqib ketdi")}
                  </Button>
                )}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="text-sm text-muted">
        {tr(
          "Номер слева — стартовый: по нему составлены пары первого тура.",
          "Chapdagi raqam — boshlangʻich raqam: birinchi tur juftliklari shu boʻyicha tuzilgan.",
        )}
        {swiss &&
          tr(
            " «Выбыл» — участник не получает пару в следующих турах; уже сведённую партию отметьте как неявку.",
            " «Chiqib ketdi» — ishtirokchi keyingi turlarda juftlikka qoʻyilmaydi; tuzib boʻlingan partiyani «kelmadi» deb belgilang.",
          )}
      </p>
      {canAdd && (
        <form
          className="flex flex-wrap items-end gap-2 print:hidden"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <label className="min-w-0 flex-1">
            <span className="mb-1 block font-extrabold">
              {tr("Добавить опоздавшего", "Kechikkan ishtirokchini qoʻshish")}
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder={tr("Имя и, если есть, рейтинг", "Ism va, boʻlsa, reyting")}
              className={FIELD}
              data-late-name
            />
          </label>
          <Button type="submit" disabled={!name.trim()} data-late-add>
            {tr(`Добавить с тура ${t.rounds.length + 1}`, `${t.rounds.length + 1}-turdan qoʻshish`)}
          </Button>
        </form>
      )}
      {swiss && (
        <div className="flex flex-wrap items-center gap-3 print:hidden" data-total-rounds={t.totalRounds}>
          <span className="font-extrabold">{tr("Туров в турнире", "Turnirdagi turlar soni")}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={t.totalRounds <= range.min}
              onClick={() => saveTournament(setTotalRounds(t, t.totalRounds - 1))}
              aria-label={tr("Меньше туров", "Kamroq tur")}
              data-rounds-less
            >
              <Icon icon={Minus} />
            </Button>
            <output className="min-w-8 text-center text-xl font-black tabular-nums" aria-live="polite">
              {t.totalRounds}
            </output>
            <Button
              variant="secondary"
              size="sm"
              disabled={t.totalRounds >= range.max}
              onClick={() => saveTournament(setTotalRounds(t, t.totalRounds + 1))}
              aria-label={tr("Больше туров", "Koʻproq tur")}
              data-rounds-more
            >
              <Icon icon={Plus} />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Правка имени и рейтинга: опечатку замечают уже после жеребьёвки. */
function PlayerForm({
  player,
  onSave,
  onCancel,
}: {
  player: TPlayer;
  onSave: (entry: { name: string; rating?: number }) => void;
  onCancel: () => void;
}) {
  const tr = useT();
  const [name, setName] = useState(player.name);
  const [rating, setRating] = useState(player.rating ? String(player.rating) : "");
  return (
    <form
      className="flex flex-wrap items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) onSave({ name, rating: Number(rating) || undefined });
      }}
      data-player-form
    >
      <label className="min-w-40 flex-[3]">
        <span className="mb-1 block text-sm font-extrabold">{tr("Имя", "Ism")}</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          autoFocus
          className={FIELD}
          data-player-name
        />
      </label>
      <label className="min-w-24 flex-1">
        <span className="mb-1 block text-sm font-extrabold">{tr("Рейтинг", "Reyting")}</span>
        <input
          value={rating}
          onChange={(e) => setRating(e.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          className={FIELD}
          data-player-rating
        />
      </label>
      <Button type="submit" disabled={!name.trim()} data-player-save>
        {tr("Сохранить", "Saqlash")}
      </Button>
      <Button type="button" variant="ghost" onClick={onCancel}>
        {tr("Отмена", "Bekor qilish")}
      </Button>
    </form>
  );
}
