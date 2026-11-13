"use client";

import { useState } from "react";
import { Button, cn } from "@/components/ui";
import {
  blindRound,
  blunderRound,
  countRound,
  plainSan,
  type BlindRound,
  type BlunderRound,
  type CountQuestion,
} from "@/lib/calcDrills";
import { PIECE_NAME_UZ, pieceAt, sanOf, type PieceType } from "@/lib/chess";
import { useLang, useSan, useT } from "@/lib/i18n";
import { playUci, useBank, type BankPuzzle } from "@/lib/puzzleBank";
import { random } from "@/lib/random";
import { chessDrillRecord } from "@/lib/store";
import { ChessBoard, type SquareMark } from "./ChessBoard";
import { Finish, RoundBar } from "./DrillParts";

/**
 * Тренажёры расчёта: считать не только свой ход, но и ответ соперника.
 * «Не зевни!» — какой из трёх ходов проигрывает сразу; «Ходы в уме» — два хода сделаны только в голове;
 * «Сосчитай удары» — сколько фигур нападает и сколько защищает. Позиции — из банка задач, ответы считает
 * перебор (src/lib/calcDrills.ts), поэтому раундов сотни и они не повторяются.
 */
export const CALC_ROUNDS = 6;

const COLORS = ["#2563eb", "#ea580c", "#9333ea"];
const LETTERS = ["A", "B", "C"];

/** Первые CALC_ROUNDS подходящих раундов из банка в случайном порядке. */
function build<T>(bank: BankPuzzle[], make: (p: BankPuzzle) => T | null): T[] {
  const order = bank.map((p) => [random(), p] as const).sort((a, b) => a[0] - b[0]);
  const out: T[] = [];
  for (const [, p] of order) {
    const r = make(p);
    if (r) out.push(r);
    if (out.length >= CALC_ROUNDS) break;
  }
  return out;
}

function Start({ bank, onStart }: { bank: BankPuzzle[] | null | "error"; onStart: () => void }) {
  const t = useT();
  if (bank === "error")
    return <p className="text-rose">{t("Не удалось загрузить позиции.", "Holatlarni yuklab boʻlmadi.")}</p>;
  return (
    <Button onClick={onStart} disabled={!bank} size="lg">
      {bank ? t("Начать", "Boshlash") : t("Загружаю позиции…", "Holatlar yuklanmoqda…")}
    </Button>
  );
}

/** Три хода на выбор: буква в цветном кружке и запись хода. */
function Options({
  labels,
  picked,
  right,
  onPick,
}: {
  labels: string[];
  picked: number | null;
  right: number;
  onPick: (i: number) => void;
}) {
  const t = useT();
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={t("Ходы на выбор", "Tanlash uchun yurishlar")}>
      {labels.map((label, i) => (
        <Button
          key={i}
          variant={picked !== null && i === right ? "primary" : picked === i ? "sun" : "secondary"}
          onClick={() => onPick(i)}
          disabled={picked !== null}
          aria-pressed={picked === i}
          data-calc-option={i}
        >
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-full text-sm font-black text-white"
            style={{ backgroundColor: COLORS[i] }}
          >
            {LETTERS[i]}
          </span>
          <span className="text-lg font-black">{label}</span>
        </Button>
      ))}
    </div>
  );
}

function Verdict({ right, children }: { right: boolean; children: React.ReactNode }) {
  return (
    <p
      className={cn("rounded-2xl px-4 py-3 font-black", right ? "bg-mint-soft text-mint-ink" : "bg-rose/10 text-rose")}
      data-calc={right ? "right" : "wrong"}
      aria-live="polite"
    >
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// «Не зевни!»
// ---------------------------------------------------------------------------

export function BlunderDrill() {
  const t = useT();
  const san = useSan();
  const bank = useBank("mate1");
  const [rounds, setRounds] = useState<BlunderRound[] | null>(null);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const start = () => {
    if (!bank || bank === "error") return;
    setRounds(build(bank, (p) => blunderRound(p, random)));
    setRound(0);
    setPicked(null);
    setScore(0);
  };
  if (!rounds) return <Start bank={bank} onStart={start} />;
  if (round >= rounds.length) return <Finish id="blunder" max={CALC_ROUNDS} score={score} onAgain={start} />;

  const q = rounds[round];
  const right = picked === q.bad;
  const labels = q.options.map((u) => san(sanOf(q.fen, u)));
  // После ответа доска показывает зевок и мат, которым он наказывается.
  const slip = picked === null ? null : playUci(q.fen, q.options[q.bad]);
  const punished = slip ? san(sanOf(slip.fen, q.punish)) : "";
  const pick = (i: number) => {
    setPicked(i);
    const ok = i === q.bad;
    if (ok) setScore((n) => n + 1);
    if (round === rounds.length - 1) chessDrillRecord("blunder", score + (ok ? 1 : 0));
  };
  const next = () => {
    setRound((r) => r + 1);
    setPicked(null);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,440px)_1fr]">
      <ChessBoard
        id="blunder"
        position={slip?.fen ?? q.fen}
        orientation={q.color === "w" ? "white" : "black"}
        marks={slip ? { [q.options[q.bad].slice(0, 2)]: "last", [q.options[q.bad].slice(2, 4)]: "bad" } : {}}
        arrows={
          slip
            ? [{ from: q.punish.slice(0, 2), to: q.punish.slice(2, 4), color: "#dc2626" }]
            : q.options.map((u, i) => ({ from: u.slice(0, 2), to: u.slice(2, 4), color: COLORS[i] }))
        }
        sounds={false}
      />
      <div className="space-y-3">
        <RoundBar round={round} total={rounds.length} score={score} />
        <p className="rounded-2xl bg-surface px-4 py-3 text-lg font-black shadow-card">
          {q.color === "w"
            ? t("Твой ход, ты за белых.", "Yurish seniki, sen oqlardasan.")
            : t("Твой ход, ты за чёрных.", "Yurish seniki, sen qoralardasan.")}{" "}
          {t("После какого хода соперник сразу ставит мат?", "Qaysi yurishdan keyin raqib darhol mot qiladi?")}
        </p>
        <Options labels={labels} picked={picked} right={q.bad} onPick={pick} />
        {picked !== null && (
          <>
            <Verdict right={right}>
              {right
                ? t(
                    `✅ Верно! После ${labels[q.bad]} соперник ставит мат: ${punished}.`,
                    `✅ Toʻgʻri! ${labels[q.bad]} dan keyin raqib mot qiladi: ${punished}.`,
                  )
                : t(
                    `После ${labels[picked]} мата нет. Зевок — ${labels[q.bad]}: соперник отвечает ${punished}.`,
                    `${labels[picked]} dan keyin mot yoʻq. Qoʻpol xato — ${labels[q.bad]}: raqib ${punished} deb javob beradi.`,
                  )}
            </Verdict>
            <Button onClick={next}>{t("Дальше →", "Keyingisi →")}</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// «Ходы в уме»
// ---------------------------------------------------------------------------

export function BlindDrill() {
  const t = useT();
  const san = useSan();
  const bank = useBank("mate2");
  const [rounds, setRounds] = useState<BlindRound[] | null>(null);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const start = () => {
    if (!bank || bank === "error") return;
    setRounds(build(bank, (p) => blindRound(p, random)));
    setRound(0);
    setPicked(null);
    setScore(0);
  };
  if (!rounds) return <Start bank={bank} onStart={start} />;
  if (round >= rounds.length) return <Finish id="blind" max={CALC_ROUNDS} score={score} onAgain={start} />;

  const q = rounds[round];
  const right = picked === q.mate;
  const labels = q.options.map((u) => plainSan(san(sanOf(q.final, u))));
  // Запись двух ходов «в уме»: «1. Лd8+ Лe8» или, если начинают чёрные, «1… Лf1+ 2. Лxf1».
  const line = q.color === "w" ? `1. ${san(q.line[0])} ${san(q.line[1])}` : `1… ${san(q.line[0])} 2. ${san(q.line[1])}`;
  const mate = picked === null ? null : playUci(q.final, q.options[q.mate]);
  const pick = (i: number) => {
    setPicked(i);
    const ok = i === q.mate;
    if (ok) setScore((n) => n + 1);
    if (round === rounds.length - 1) chessDrillRecord("blind", score + (ok ? 1 : 0));
  };
  const next = () => {
    setRound((r) => r + 1);
    setPicked(null);
  };
  const marks: Record<string, SquareMark> = mate
    ? { [q.options[q.mate].slice(0, 2)]: "last", [q.options[q.mate].slice(2, 4)]: "good" }
    : {};

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,440px)_1fr]">
      <ChessBoard
        id="blind"
        position={mate?.fen ?? q.fen}
        orientation={q.color === "w" ? "white" : "black"}
        marks={marks}
        sounds={false}
      />
      <div className="space-y-3">
        <RoundBar round={round} total={rounds.length} score={score} />
        <p className="rounded-2xl bg-surface px-4 py-3 text-lg font-black shadow-card">
          {q.color === "w"
            ? t("Ты за белых. Сделай в уме:", "Sen oqlardasan. Xayolingda yur:")
            : t("Ты за чёрных. Сделай в уме:", "Sen qoralardasan. Xayolingda yur:")}{" "}
          <span className="text-xl whitespace-nowrap text-brand-dark" data-calc-line>
            {line}
          </span>
          {". "}
          {t("Каким ходом теперь мат?", "Endi qaysi yurish mot qiladi?")}
        </p>
        <Options labels={labels} picked={picked} right={q.mate} onPick={pick} />
        {picked !== null && (
          <>
            <Verdict right={right}>
              {right
                ? t(
                    `✅ Верно! ${labels[q.mate]} — мат. Доска показывает, что получилось.`,
                    `✅ Toʻgʻri! ${labels[q.mate]} — mot. Taxtada natija koʻrsatilgan.`,
                  )
                : t(
                    `Мат ставит ход ${labels[q.mate]}. Посмотри на доску: вот что получилось после всех ходов.`,
                    `${labels[q.mate]} yurishi mot qiladi. Taxtaga qara: hamma yurishlardan keyin mana shunday boʻldi.`,
                  )}
            </Verdict>
            <Button onClick={next}>{t("Дальше →", "Keyingisi →")}</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// «Сосчитай удары»
// ---------------------------------------------------------------------------

/** «на коня», «на ладью» — винительный падеж. */
const ONTO_RU: Record<PieceType, string> = {
  p: "пешку",
  n: "коня",
  b: "слона",
  r: "ладью",
  q: "ферзя",
  k: "короля",
};
const NUMBERS = [0, 1, 2, 3, 4];

/**
 * Два вопроса по очереди — сначала нападающие, потом защитники: на экране одна строка кнопок, а не две.
 * Ответ проверяется после второго числа.
 */
export function CountDrill() {
  const t = useT();
  const lang = useLang();
  const bank = useBank("mix");
  const [rounds, setRounds] = useState<CountQuestion[] | null>(null);
  const [round, setRound] = useState(0);
  const [attack, setAttack] = useState<number | null>(null);
  const [defend, setDefend] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const start = () => {
    if (!bank || bank === "error") return;
    setRounds(
      build(bank, (p) => {
        const fen = playUci(p.fen, p.moves[0])?.fen;
        return fen ? countRound(fen, random) : null;
      }),
    );
    setRound(0);
    setScore(0);
    setAttack(null);
    setDefend(null);
  };
  if (!rounds) return <Start bank={bank} onStart={start} />;
  if (round >= rounds.length) return <Finish id="count" max={CALC_ROUNDS} score={score} onAgain={start} />;

  const q = rounds[round];
  const piece = pieceAt(q.fen, q.square)!;
  const white = q.color === "w";
  const checked = defend !== null;
  const right = attack === q.attackers.length && defend === q.defenders.length;
  const pick = (n: number) => {
    if (attack === null) return setAttack(n);
    setDefend(n);
    const ok = attack === q.attackers.length && n === q.defenders.length;
    if (ok) setScore((x) => x + 1);
    if (round === rounds.length - 1) chessDrillRecord("count", score + (ok ? 1 : 0));
  };
  const next = () => {
    setRound((r) => r + 1);
    setAttack(null);
    setDefend(null);
  };
  const arrows = checked
    ? [
        ...q.attackers.map((from) => ({ from, to: q.square, color: "#dc2626" })),
        ...q.defenders.map((from) => ({ from, to: q.square, color: "#16a34a" })),
      ]
    : [];
  const where = lang === "uz" ? `${q.square} dagi ${PIECE_NAME_UZ[piece.type]}` : `${ONTO_RU[piece.type]} ${q.square}`;
  const question =
    attack === null
      ? white
        ? t(`Сколько чёрных нападает на ${where}?`, `${where}ga nechta qora hujum qilyapti?`)
        : t(`Сколько белых нападает на ${where}?`, `${where}ga nechta oq hujum qilyapti?`)
      : white
        ? t(`А сколько белых защищает ${where}?`, `${where}ni nechta oq himoya qilyapti?`)
        : t(`А сколько чёрных защищает ${where}?`, `${where}ni nechta qora himoya qilyapti?`);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,440px)_1fr]">
      <ChessBoard
        id="count"
        position={q.fen}
        orientation={white ? "white" : "black"}
        marks={{ [q.square]: "selected" }}
        arrows={arrows}
        sounds={false}
      />
      <div className="space-y-3">
        <RoundBar round={round} total={rounds.length} score={score} />
        {checked ? (
          <>
            <Verdict right={right}>
              {right
                ? t(
                    `✅ Верно! Нападают: ${q.attackers.length}, защищают: ${q.defenders.length}.`,
                    `✅ Toʻgʻri! Hujum qilyapti: ${q.attackers.length} ta, himoya qilyapti: ${q.defenders.length} ta.`,
                  )
                : t(
                    `Нападают: ${q.attackers.length}, защищают: ${q.defenders.length}. Красные стрелки — нападение, зелёные — защита.`,
                    `Hujum qilyapti: ${q.attackers.length} ta, himoya qilyapti: ${q.defenders.length} ta. Qizil strelkalar — hujum, yashillari — himoya.`,
                  )}
            </Verdict>
            <Button onClick={next}>{t("Дальше →", "Keyingisi →")}</Button>
          </>
        ) : (
          <>
            <p
              className="rounded-2xl bg-surface px-4 py-3 text-lg font-black shadow-card"
              data-calc-question={attack === null ? "attack" : "defend"}
              aria-live="polite"
            >
              {question}{" "}
              <span className="font-bold text-muted">{t("Пешки тоже считаются.", "Piyodalar ham sanaladi.")}</span>
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label={question}>
              {NUMBERS.map((n) => (
                // key меняется со сменой вопроса: кнопка первого ответа не остаётся «нажатой» во втором.
                <Button
                  key={`${attack === null ? "a" : "d"}${n}`}
                  variant="secondary"
                  onClick={() => pick(n)}
                  className="min-w-12"
                  data-calc-number={n}
                >
                  <span className="text-lg font-black">{n}</span>
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
