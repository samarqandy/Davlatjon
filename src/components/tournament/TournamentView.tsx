"use client";

import { ArrowLeft, Dices, Download, Printer, Trash2, Undo2 } from "lucide-react";
import { useState } from "react";
import { Button, cn, Icon } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import {
  addLatePlayer,
  canEditRound,
  canPairNext,
  canUndoRound,
  isFinished,
  pairNextRound,
  setResult,
  toggleWithdrawn,
  undoRound,
} from "@/lib/tournament/engine";
import { exportTournament, removeTournament, saveTournament } from "@/lib/tournament/store";
import type { GameResult, TGame, Tournament } from "@/lib/tournament/types";
import { roundDone } from "@/lib/tournament/types";
import { setHash } from "@/lib/useHash";
import { TournamentTable } from "./TournamentTable";
import { downloadText, formatName, knockoutRoundName, RESULT_TEXT } from "./shared";

type Tab = "rounds" | "table" | "players";

/** Турнир: туры с вводом результатов, таблица (или сетка) и участники. */
export function TournamentView({ tournament: t }: { tournament: Tournament }) {
  const tr = useT();
  const [tab, setTab] = useState<Tab>("rounds");
  // Открытый тур: null — последний сведённый (после жеребьёвки сразу виден новый).
  const [picked, setPicked] = useState<number | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const roundIndex = Math.min(picked ?? firstOpenRound(t), t.rounds.length - 1);
  const finished = isFinished(t);
  const knockout = t.format === "knockout";
  const robin = t.format === "roundRobin" || t.format === "doubleRoundRobin";

  const next = () => {
    const result = pairNextRound(t);
    if ("error" in result) {
      setProblem(
        result.error === "impossible"
          ? tr(
              "Свести тур нельзя: все, кто ещё не играл друг с другом, уже сведены в прежних турах. Турнир можно считать законченным — итог в таблице.",
              "Turni tuzib boʻlmaydi: hali oʻzaro oʻynamagan ishtirokchilar qolmadi. Turnirni tugagan deb hisoblash mumkin — yakun jadvalda.",
            )
          : tr(
              "Сначала введите результаты всех партий этого тура.",
              "Avval shu turdagi barcha partiyalar natijasini kiriting.",
            ),
      );
      return;
    }
    setProblem(null);
    setPicked(null);
    saveTournament(result);
  };

  const remove = () => {
    if (
      !window.confirm(
        tr(
          `Удалить турнир «${t.name}» со всеми результатами? Вернуть его будет нельзя.`,
          `«${t.name}» turniri barcha natijalari bilan oʻchirilsinmi? Uni qaytarib boʻlmaydi.`,
        ),
      )
    )
      return;
    removeTournament(t.id);
    setHash("");
  };

  const tabs: [Tab, string][] = [
    ["rounds", tr("Туры", "Turlar")],
    ["table", knockout ? tr("Сетка", "Setka") : tr("Таблица", "Jadval")],
    ["players", tr("Участники", "Ishtirokchilar")],
  ];

  return (
    <div className="space-y-5" data-tournament={t.id} data-tournament-format={t.format}>
      <header className="space-y-1">
        <button
          type="button"
          onClick={() => setHash("")}
          className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand hover:underline print:hidden"
        >
          <Icon icon={ArrowLeft} /> {tr("Все турниры", "Barcha turnirlar")}
        </button>
        <h1 className="text-3xl leading-tight font-black">{t.name}</h1>
        <p className="font-bold text-muted" data-tournament-status={finished ? "finished" : "running"}>
          {formatName(t.format, tr)} ·{" "}
          {tr(pluralize(t.players.length, "участник", "участника", "участников"), `${t.players.length} ta ishtirokchi`)}
          {" · "}
          {finished
            ? tr("турнир завершён", "turnir yakunlandi")
            : tr(
                `тур ${firstOpenRound(t) + 1} из ${t.totalRounds}`,
                `${t.totalRounds} turdan ${firstOpenRound(t) + 1}-tur`,
              )}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <div
          className="flex gap-1 rounded-2xl bg-line/50 p-1"
          role="group"
          aria-label={tr("Раздел турнира", "Turnir boʻlimi")}
        >
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
              data-tab={id}
              className={cn(
                "min-h-11 rounded-xl px-4 font-extrabold transition",
                tab === id ? "bg-surface text-brand-dark shadow-card" : "text-muted hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => window.print()} aria-label={tr("Распечатать", "Chop etish")}>
            <Icon icon={Printer} /> <span className="max-sm:sr-only">{tr("Печать", "Chop etish")}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => downloadText(`turnir-${t.id}.json`, exportTournament(t))}
            aria-label={tr("Сохранить в файл", "Faylga saqlash")}
          >
            <Icon icon={Download} /> <span className="max-sm:sr-only">{tr("В файл", "Faylga")}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={remove}
            aria-label={tr("Удалить турнир", "Turnirni oʻchirish")}
            data-tournament-delete
          >
            <Icon icon={Trash2} /> <span className="max-sm:sr-only">{tr("Удалить", "Oʻchirish")}</span>
          </Button>
        </div>
      </div>

      {tab === "rounds" && (
        <section className="space-y-4" aria-label={tr("Туры", "Turlar")}>
          <ol className="flex flex-wrap gap-1.5 print:hidden" aria-label={tr("Выбор тура", "Turni tanlash")}>
            {Array.from({ length: t.totalRounds }, (_, r) => {
              const paired = r < t.rounds.length;
              return (
                <li key={r}>
                  <button
                    type="button"
                    disabled={!paired}
                    aria-current={r === roundIndex ? "step" : undefined}
                    aria-label={tr(`Тур ${r + 1}`, `${r + 1}-tur`)}
                    onClick={() => setPicked(r)}
                    data-round-pick={r + 1}
                    className={cn(
                      "grid size-11 place-items-center rounded-xl border-2 font-black transition disabled:opacity-40",
                      r === roundIndex
                        ? "border-brand bg-brand text-white"
                        : paired && roundDone(t.rounds[r])
                          ? "border-mint/50 bg-mint-soft"
                          : "border-line bg-surface",
                    )}
                  >
                    {r + 1}
                  </button>
                </li>
              );
            })}
          </ol>

          <RoundGames
            tournament={t}
            roundIndex={roundIndex}
            onResult={(board, result) => {
              setProblem(null);
              saveTournament(setResult(t, roundIndex, board, result));
            }}
          />

          <div className="space-y-2 print:hidden">
            {problem && (
              <p className="font-bold text-sun-ink" role="alert">
                {problem}
              </p>
            )}
            {finished ? (
              <p className="rounded-2xl bg-mint-soft px-4 py-3 font-extrabold text-mint-ink" role="status">
                {tr("Турнир завершён.", "Turnir yakunlandi.")}{" "}
                <button type="button" className="min-h-11 underline underline-offset-4" onClick={() => setTab("table")}>
                  {knockout ? tr("Посмотреть сетку", "Setkani koʻrish") : tr("Посмотреть таблицу", "Jadvalni koʻrish")}
                </button>
              </p>
            ) : robin ? null : canPairNext(t) ? (
              <Button size="lg" onClick={next} data-next-round>
                <Icon icon={Dices} />{" "}
                {tr(`Жеребьёвка тура ${t.rounds.length + 1}`, `${t.rounds.length + 1}-tur uchun qurʼa`)}
              </Button>
            ) : (
              roundIndex === t.rounds.length - 1 && (
                <p className="text-sm font-bold text-muted">
                  {tr(
                    "Когда будут результаты всех партий, можно провести жеребьёвку следующего тура.",
                    "Barcha partiyalar natijasi kiritilgach, keyingi tur uchun qurʼa tashlash mumkin.",
                  )}
                </p>
              )
            )}
            {canUndoRound(t) && roundIndex === t.rounds.length - 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPicked(null);
                  saveTournament(undoRound(t));
                }}
                data-undo-round
              >
                <Icon icon={Undo2} /> {tr("Отменить жеребьёвку этого тура", "Shu tur qurʼasini bekor qilish")}
              </Button>
            )}
          </div>
        </section>
      )}

      {tab === "table" && <TournamentTable tournament={t} />}
      {tab === "players" && <Players tournament={t} />}
    </div>
  );
}

/** Первый тур, в котором ещё не все результаты; если все сыграны — последний сведённый. */
function firstOpenRound(t: Tournament): number {
  const open = t.rounds.findIndex((r) => !roundDone(r));
  return open >= 0 ? open : t.rounds.length - 1;
}

function RoundGames({
  tournament: t,
  roundIndex,
  onResult,
}: {
  tournament: Tournament;
  roundIndex: number;
  onResult: (board: number, result: GameResult | undefined) => void;
}) {
  const tr = useT();
  const round = t.rounds[roundIndex];
  const name = new Map(t.players.map((p) => [p.id, p.name]));
  const editable = canEditRound(t, roundIndex);
  const knockout = t.format === "knockout";
  const swiss = t.format === "swiss";
  const finalRound = knockout && roundIndex === t.totalRounds - 1;
  const title = knockout
    ? knockoutRoundName(2 ** (t.totalRounds - 1 - roundIndex), tr)
    : tr(`Тур ${roundIndex + 1}`, `${roundIndex + 1}-tur`);

  return (
    <div className="space-y-3" data-round={roundIndex + 1}>
      <h2 className="text-2xl font-black">{title}</h2>
      {round.notes?.includes("color") && (
        <p className="rounded-2xl bg-sun-soft px-4 py-2 text-sm font-bold text-sun-ink" role="note">
          {tr(
            "В этом туре кому-то пришлось играть одним цветом третий раз подряд: иначе пары не составить.",
            "Bu turda kimdir ketma-ket uchinchi marta bir xil rangda oʻynaydi: boshqacha juftlab boʻlmadi.",
          )}
        </p>
      )}
      {round.notes?.includes("repeatBye") && (
        <p className="rounded-2xl bg-sun-soft px-4 py-2 text-sm font-bold text-sun-ink" role="note">
          {tr(
            "В этом туре участник свободен от игры во второй раз: иначе пары не составить.",
            "Bu turda ishtirokchi ikkinchi marta oʻyindan ozod: boshqacha juftlab boʻlmadi.",
          )}
        </p>
      )}
      <ol className="grid gap-2 lg:grid-cols-2">
        {round.games.map((g, board) => (
          <GameRow
            key={`${g.white}-${g.black}`}
            game={g}
            board={board + 1}
            white={name.get(g.white) ?? "?"}
            black={g.black === null ? null : (name.get(g.black) ?? "?")}
            label={
              finalRound && t.thirdPlace && board === 1 ? tr("За третье место", "Uchinchi oʻrin uchun") : undefined
            }
            byeNote={
              swiss
                ? tr("свободен от игры · 1 очко", "oʻyindan ozod · 1 ochko")
                : tr("свободен от игры", "oʻyindan ozod")
            }
            editable={editable}
            allowDraw={!knockout}
            onResult={(result) => onResult(board, result)}
          />
        ))}
      </ol>
      {!editable && (
        <p className="text-sm font-bold text-muted print:hidden">
          {tr(
            "Результаты этого тура уже учтены в жеребьёвке следующих — изменить их нельзя.",
            "Bu tur natijalari keyingi turlar qurʼasida hisobga olingan — ularni oʻzgartirib boʻlmaydi.",
          )}
        </p>
      )}
    </div>
  );
}

function GameRow({
  game,
  board,
  white,
  black,
  label,
  byeNote,
  editable,
  allowDraw,
  onResult,
}: {
  game: TGame;
  board: number;
  white: string;
  black: string | null;
  label?: string;
  byeNote: string;
  editable: boolean;
  allowDraw: boolean;
  onResult: (result: GameResult | undefined) => void;
}) {
  const tr = useT();
  const dot = (color: "w" | "b") => (
    <span
      aria-hidden
      className={cn(
        "size-4 shrink-0 rounded-full border-2 border-[#1f2937]",
        color === "w" ? "bg-white" : "bg-[#1f2937]",
      )}
    />
  );
  const button = (result: GameResult, hint: string) => {
    const on = game.result === result;
    return (
      <button
        key={result}
        type="button"
        disabled={!editable}
        aria-pressed={on}
        aria-label={hint}
        title={hint}
        onClick={() => onResult(on ? undefined : result)}
        data-result={result}
        className={cn(
          "min-h-11 flex-1 rounded-xl border-2 px-2 font-black tabular-nums transition disabled:opacity-60",
          on ? "border-brand bg-brand text-white" : "border-line bg-surface hover:border-brand/40",
        )}
      >
        {RESULT_TEXT[result]}
      </button>
    );
  };
  return (
    <li className="rounded-2xl bg-surface p-3 shadow-card" data-board={board} data-game-result={game.result ?? ""}>
      {label && <p className="mb-1 text-sm font-extrabold tracking-wide text-muted uppercase">{label}</p>}
      <div className="flex items-start gap-3">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-full bg-line/60 text-sm font-black"
          aria-hidden
        >
          {black === null ? "—" : board}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="flex items-center gap-2 font-extrabold">
            {black !== null && dot("w")}
            <span className="min-w-0 break-words" data-white>
              {white}
            </span>
            {black !== null && <span className="sr-only">{tr(" — белые", " — oqlar")}</span>}
          </p>
          {black === null ? (
            <p className="text-sm font-bold text-muted" data-bye>
              {byeNote}
            </p>
          ) : (
            <p className="flex items-center gap-2 font-extrabold">
              {dot("b")}
              <span className="min-w-0 break-words" data-black>
                {black}
              </span>
              <span className="sr-only">{tr(" — чёрные", " — qoralar")}</span>
            </p>
          )}
        </div>
        {game.result && <span className="hidden text-lg font-black print:block">{RESULT_TEXT[game.result]}</span>}
      </div>
      {black !== null && (
        <div className="mt-2 space-y-1 print:hidden">
          <div
            className="flex gap-2"
            role="group"
            aria-label={tr(`Результат: ${white} — ${black}`, `Natija: ${white} — ${black}`)}
          >
            {button("1-0", tr(`Победа белых: ${white}`, `Oqlar yutdi: ${white}`))}
            {allowDraw && button("1/2", tr("Ничья", "Durang"))}
            {button("0-1", tr(`Победа чёрных: ${black}`, `Qoralar yutdi: ${black}`))}
          </div>
          {editable && (
            <details open={game.result === "+-" || game.result === "-+" ? true : undefined}>
              <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-bold text-muted">
                {tr("Кто-то не пришёл", "Kimdir kelmadi")}
              </summary>
              <div className="flex gap-2">
                {button("+-", tr(`Не пришли чёрные: победа — ${white}`, `Qoralar kelmadi: gʻalaba — ${white}`))}
                {button("-+", tr(`Не пришли белые: победа — ${black}`, `Oqlar kelmadi: gʻalaba — ${black}`))}
              </div>
            </details>
          )}
        </div>
      )}
    </li>
  );
}

function Players({ tournament: t }: { tournament: Tournament }) {
  const tr = useT();
  const [name, setName] = useState("");
  const swiss = t.format === "swiss";
  const canAdd = swiss && t.rounds.length < t.totalRounds;
  const players = [...t.players].sort((a, b) => a.seed - b.seed);
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
          return (
            <li key={p.id} className="flex min-h-14 items-center gap-3 py-1.5">
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
              {swiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="print:hidden"
                  onClick={() => saveTournament(toggleWithdrawn(t, p.id))}
                  data-withdraw={p.seed}
                >
                  {gone ? tr("Вернуть", "Qaytarish") : tr("Выбыл", "Chiqib ketdi")}
                </Button>
              )}
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
              className="w-full rounded-2xl border-2 border-line bg-surface px-4 py-2.5 font-bold outline-none focus:border-brand"
              data-late-name
            />
          </label>
          <Button type="submit" disabled={!name.trim()} data-late-add>
            {tr(`Добавить с тура ${t.rounds.length + 1}`, `${t.rounds.length + 1}-turdan qoʻshish`)}
          </Button>
        </form>
      )}
    </section>
  );
}
