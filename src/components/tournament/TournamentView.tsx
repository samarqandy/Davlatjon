"use client";

import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpDown,
  Dices,
  Download,
  PencilLine,
  Printer,
  Share2,
  Trash2,
  Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button, cn, Icon } from "@/components/ui";
import { useLang, useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import {
  canEditPairs,
  canEditRound,
  canPairNext,
  canUndoRound,
  isFinished,
  pairNextRound,
  setResult,
  swapColors,
  swapPlayers,
  undoRound,
} from "@/lib/tournament/engine";
import { roundText, standingsText } from "@/lib/tournament/share";
import { exportTournament, removeTournament, saveTournament } from "@/lib/tournament/store";
import { roundIssues } from "@/lib/tournament/swiss";
import type { GameResult, TGame, Tournament } from "@/lib/tournament/types";
import { roundDone } from "@/lib/tournament/types";
import { setHash } from "@/lib/useHash";
import { TournamentPlayers } from "./TournamentPlayers";
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
  const lang = useLang();
  const [shared, setShared] = useState<"copied" | "failed" | null>(null);
  const roundIndex = Math.min(picked ?? firstOpenRound(t), t.rounds.length - 1);
  const finished = isFinished(t);
  const knockout = t.format === "knockout";
  const robin = t.format === "roundRobin" || t.format === "doubleRoundRobin";

  // «Скопировано» гаснет само: строка не должна висеть над следующим туром.
  useEffect(() => {
    if (!shared) return;
    const id = setTimeout(() => setShared(null), 4000);
    return () => clearTimeout(id);
  }, [shared]);

  /**
   * Пары открытого тура или таблица — текстом в чат родителей. На телефоне открывается системное окно
   * «Поделиться» (Telegram, WhatsApp); где его нет — текст копируется. Отправляет организатор, не сайт.
   */
  const sharesRound = tab === "rounds";
  const share = async () => {
    const text = sharesRound ? roundText(t, roundIndex, lang) : standingsText(t, lang);
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShared("copied");
    } catch (e) {
      // Окно «Поделиться» закрыли — это не ошибка.
      if (e instanceof DOMException && e.name === "AbortError") return;
      setShared("failed");
    }
  };

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void share()}
            aria-label={
              sharesRound
                ? tr("Поделиться парами тура", "Tur juftliklarini ulashish")
                : knockout
                  ? tr("Поделиться сеткой", "Setkani ulashish")
                  : tr("Поделиться таблицей", "Jadvalni ulashish")
            }
            data-tournament-share={sharesRound ? "round" : "table"}
          >
            <Icon icon={Share2} /> <span className="max-sm:sr-only">{tr("Поделиться", "Ulashish")}</span>
          </Button>
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

      {shared && (
        <p className="text-sm font-bold text-muted print:hidden" role="status" data-tournament-shared={shared}>
          {shared === "copied"
            ? tr("Скопировано — текст можно вставить в чат.", "Nusxalandi — matnni chatga joylash mumkin.")
            : tr(
                "Скопировать не получилось: браузер не дал доступ к буферу обмена.",
                "Nusxalab boʻlmadi: brauzer almashish buferiga ruxsat bermadi.",
              )}
        </p>
      )}

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
      {tab === "players" && <TournamentPlayers tournament={t} />}
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
  const knockout = t.format === "knockout";
  const swiss = t.format === "swiss";
  const last = roundIndex === t.rounds.length - 1;
  // Сыгранный тур швейцарской закрыт от случайного нажатия: чтобы исправить результат, судья открывает его сам.
  const past = swiss && !last;
  const [unlocked, setUnlocked] = useState<number | null>(null);
  const [pairEdit, setPairEdit] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const editable = canEditRound(t, roundIndex) && (!past || unlocked === roundIndex);
  const pairsMode = pairEdit && last && canEditPairs(t);
  const finalRound = knockout && roundIndex === t.totalRounds - 1;
  const title = knockout
    ? knockoutRoundName(2 ** (t.totalRounds - 1 - roundIndex), tr)
    : tr(`Тур ${roundIndex + 1}`, `${roundIndex + 1}-tur`);
  const rematches = round.notes?.includes("rematch") ? roundIssues(t, roundIndex).rematches : [];
  const note = (text: string, key: string) => (
    <p
      key={key}
      className="rounded-2xl bg-sun-soft px-4 py-2 text-sm font-bold text-sun-ink"
      role="note"
      data-note={key}
    >
      {text}
    </p>
  );
  const pick = (id: string) => {
    if (picked !== null && picked !== id) saveTournament(swapPlayers(t, picked, id));
    setPicked(picked === null ? id : null);
  };

  return (
    <div className="space-y-3" data-round={roundIndex + 1}>
      <h2 className="text-2xl font-black">{title}</h2>
      {round.notes?.includes("manual") &&
        note(tr("Пары этого тура изменены вручную.", "Bu tur juftliklari qoʻlda oʻzgartirilgan."), "manual")}
      {rematches.length > 0 &&
        note(
          tr(
            `Уже встречались: ${rematches.map(([a, b]) => `${name.get(a)} — ${name.get(b)}`).join("; ")}. Повторная встреча — на усмотрение судьи.`,
            `Avval uchrashgan: ${rematches.map(([a, b]) => `${name.get(a)} — ${name.get(b)}`).join("; ")}. Takroriy uchrashuv — hakam ixtiyorida.`,
          ),
          "rematch",
        )}
      {round.notes?.includes("color") &&
        note(
          round.notes.includes("manual")
            ? tr(
                "В этом туре кто-то играет одним цветом третий раз подряд.",
                "Bu turda kimdir ketma-ket uchinchi marta bir xil rangda oʻynaydi.",
              )
            : tr(
                "В этом туре кому-то пришлось играть одним цветом третий раз подряд: иначе пары не составить.",
                "Bu turda kimdir ketma-ket uchinchi marta bir xil rangda oʻynaydi: boshqacha juftlab boʻlmadi.",
              ),
          "color",
        )}
      {round.notes?.includes("repeatBye") &&
        note(
          round.notes.includes("manual")
            ? tr(
                "В этом туре участник свободен от игры во второй раз.",
                "Bu turda ishtirokchi ikkinchi marta oʻyindan ozod.",
              )
            : tr(
                "В этом туре участник свободен от игры во второй раз: иначе пары не составить.",
                "Bu turda ishtirokchi ikkinchi marta oʻyindan ozod: boshqacha juftlab boʻlmadi.",
              ),
          "repeatBye",
        )}
      {pairsMode && (
        <p className="text-sm font-bold text-muted print:hidden" role="status">
          {picked
            ? tr(
                `Выбран участник: ${name.get(picked)}. Нажмите на того, с кем поменять.`,
                `Tanlandi: ${name.get(picked)}. Kim bilan almashtirishni bosing.`,
              )
            : tr(
                "Нажмите на двух участников — они поменяются местами. Стрелки меняют цвет в паре.",
                "Ikki ishtirokchini bosing — ular oʻrin almashadi. Strelkalar juftlikdagi rangni almashtiradi.",
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
            pairs={
              pairsMode && !g.result
                ? { picked, onPick: pick, onFlip: () => saveTournament(swapColors(t, board)) }
                : undefined
            }
          />
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        {swiss && last && canEditPairs(t) && (
          <Button
            variant={pairsMode ? "secondary" : "ghost"}
            size="sm"
            aria-pressed={pairsMode}
            onClick={() => {
              setPairEdit(!pairsMode);
              setPicked(null);
            }}
            data-edit-pairs
          >
            <Icon icon={ArrowLeftRight} />{" "}
            {pairsMode ? tr("Готово", "Tayyor") : tr("Изменить пары", "Juftliklarni oʻzgartirish")}
          </Button>
        )}
        {past && unlocked !== roundIndex && (
          <Button variant="ghost" size="sm" onClick={() => setUnlocked(roundIndex)} data-fix-results>
            <Icon icon={PencilLine} /> {tr("Исправить результат", "Natijani tuzatish")}
          </Button>
        )}
      </div>
      {past && unlocked === roundIndex && (
        <p className="text-sm font-bold text-muted print:hidden" role="status">
          {tr(
            "Таблица пересчитается сама. Пары следующих туров остаются как есть.",
            "Jadval oʻzi qayta hisoblanadi. Keyingi turlarning juftliklari oʻzgarmaydi.",
          )}
        </p>
      )}
      {knockout && !last && (
        <p className="text-sm font-bold text-muted print:hidden">
          {tr(
            "Победители этого тура уже играют дальше. Чтобы исправить результат, отмените жеребьёвку следующего тура.",
            "Bu tur gʻoliblari keyingi bosqichda oʻynayapti. Natijani tuzatish uchun keyingi tur qurʼasini bekor qiling.",
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
  pairs,
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
  /** Правка пар: имена становятся кнопками, вместо результата — смена цвета. */
  pairs?: { picked: string | null; onPick: (id: string) => void; onFlip: () => void };
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
  /** Имя участника: в обычном виде — текст, при правке пар — кнопка выбора. */
  const player = (id: string, text: string, side: "white" | "black") =>
    pairs ? (
      <button
        type="button"
        aria-pressed={pairs.picked === id}
        onClick={() => pairs.onPick(id)}
        data-pick={side}
        className={cn(
          "min-h-11 min-w-0 flex-1 rounded-xl border-2 px-3 text-left font-extrabold break-words transition",
          pairs.picked === id ? "border-brand bg-brand text-white" : "border-line bg-surface hover:border-brand/40",
        )}
      >
        <span {...{ [`data-${side}`]: "" }}>{text}</span>
      </button>
    ) : (
      <span className="min-w-0 break-words" {...{ [`data-${side}`]: "" }}>
        {text}
      </span>
    );
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
            {player(game.white, white, "white")}
            {black !== null && <span className="sr-only">{tr(" — белые", " — oqlar")}</span>}
          </p>
          {black === null || game.black === null ? (
            <p className="text-sm font-bold text-muted" data-bye>
              {byeNote}
            </p>
          ) : (
            <p className="flex items-center gap-2 font-extrabold">
              {dot("b")}
              {player(game.black, black, "black")}
              <span className="sr-only">{tr(" — чёрные", " — qoralar")}</span>
            </p>
          )}
        </div>
        {pairs && black !== null && (
          <button
            type="button"
            onClick={pairs.onFlip}
            aria-label={tr(`Поменять цвета: ${white} — ${black}`, `Ranglarni almashtirish: ${white} — ${black}`)}
            title={tr("Поменять цвета", "Ranglarni almashtirish")}
            data-flip
            className="grid size-11 shrink-0 place-items-center self-center rounded-xl border-2 border-line bg-surface transition hover:border-brand/40"
          >
            <Icon icon={ArrowUpDown} />
          </button>
        )}
        {/* На бумаге: результат, а у несыгранной партии — черта, куда его впишут за доской. */}
        {game.result ? (
          <span className="hidden text-lg font-black print:block">{RESULT_TEXT[game.result]}</span>
        ) : (
          black !== null && (
            <span className="hidden w-20 self-end border-b-2 border-ink print:block" data-result-blank aria-hidden />
          )
        )}
      </div>
      {black !== null && !pairs && (
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
