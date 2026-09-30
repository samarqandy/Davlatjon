"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, cn, ProgressBar } from "@/components/ui";
import { attackersOf, pieceAt, type Color } from "@/lib/chess";
import { useLang, useT } from "@/lib/i18n";
import {
  KNIGHT_ROUNDS,
  knightRound,
  knightStars,
  knightSteps,
  MEMORY_ROUNDS,
  memoryRound,
  memorySeconds,
  pawnDanger,
  safetyQuestion,
  type KnightRound,
  type MemoryRound,
} from "@/lib/miniDrills";
import { pluralize } from "@/lib/plural";
import { playUci, useBank } from "@/lib/puzzleBank";
import { random } from "@/lib/random";
import { chessDrillRecord, useHydrated, useStore } from "@/lib/store";
import { setHash, useHash } from "@/lib/useHash";
import { ChessBoard, PieceIcon, type SquareMark } from "./ChessBoard";

type DrillId = "safety" | "memory" | "knight";
const DRILLS: DrillId[] = ["safety", "memory", "knight"];
/** Сколько очков можно набрать за подход. */
const MAX: Record<DrillId, number> = { safety: 6, memory: MEMORY_ROUNDS.length, knight: KNIGHT_ROUNDS.length * 3 };

function useDrillText() {
  const t = useT();
  return (id: DrillId) =>
    ({
      safety: {
        emoji: "🛡️",
        title: t("Кто в опасности?", "Kim xavf ostida?"),
        text: t(
          "Позиция из настоящей партии. Найди свои фигуры, которые можно забрать: на них нападают, а защиты нет — или нападает фигура дешевле.",
          "Haqiqiy partiyadagi holat. Olib qoʻyish mumkin boʻlgan donalaringni top: ularga hujum qilishyapti, himoyasi yoʻq — yoki arzonroq dona hujum qilyapti.",
        ),
      },
      memory: {
        emoji: "🧠",
        title: t("Запомни", "Eslab qol"),
        text: t(
          "Посмотри на доску несколько секунд. Фигуры исчезнут — покажи, где стояла нужная.",
          "Taxtaga bir necha soniya qara. Donalar yoʻqoladi — kerakli dona qayerda turganini koʻrsat.",
        ),
      },
      knight: {
        emoji: "🐴",
        title: t("Путь коня", "Ot yoʻli"),
        text: t(
          "Доведи коня до звезды за наименьшее число ходов. Потом появятся пешки — на битые ими клетки вставать нельзя.",
          "Otni yulduzgacha eng kam yurish bilan olib bor. Keyin piyodalar paydo boʻladi — ular urib turgan kataklarga borish mumkin emas.",
        ),
      },
    })[id];
}

/** Страница тренажёров: карточки или выбранный тренажёр (#safety, #memory, #knight). */
export function MiniDrills() {
  const t = useT();
  const hash = useHash();
  const hydrated = useHydrated();
  const records = useStore((s) => s.chessDrills);
  const text = useDrillText();
  const current = DRILLS.find((d) => hash === `#${d}`);

  return (
    <div className="space-y-6">
      <Link
        href={current ? "/chess/drills" : "/chess"}
        className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline"
      >
        ← {current ? t("Все тренажёры", "Barcha trenajyorlar") : t("Шахматная школа", "Shaxmat maktabi")}
      </Link>
      {current ? (
        <section className="space-y-4" data-drill={current}>
          <header>
            <h1 className="text-3xl font-black">
              {text(current).emoji} {text(current).title}
            </h1>
            <p className="mt-1 max-w-3xl text-muted">{text(current).text}</p>
          </header>
          {current === "safety" && <SafetyDrill />}
          {current === "memory" && <MemoryDrill />}
          {current === "knight" && <KnightDrill />}
        </section>
      ) : (
        <>
          <header>
            <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
              {t("Тренажёры", "Trenajyorlar")}
            </p>
            <h1 className="text-3xl font-black">{t("Короткие тренировки", "Qisqa mashgʻulotlar")}</h1>
            <p className="mt-1 max-w-2xl text-muted">
              {t(
                "Пять минут в день — и глаз шахматиста становится зорче: видеть опасность, помнить доску, считать ходы коня.",
                "Kuniga besh daqiqa — va shaxmatchining koʻzi oʻtkirlashadi: xavfni koʻrish, taxtani eslab qolish, ot yurishlarini hisoblash.",
              )}
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            {DRILLS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setHash(`#${d}`)}
                className="flex flex-col rounded-3xl bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="text-4xl" aria-hidden>
                  {text(d).emoji}
                </span>
                <span className="mt-2 text-xl font-black">{text(d).title}</span>
                <span className="mt-1 flex-1 text-sm text-muted">{text(d).text}</span>
                <span className="mt-3 text-sm font-extrabold text-brand">
                  {hydrated && records[d]
                    ? t(`Рекорд: ${records[d]} из ${MAX[d]}`, `Rekord: ${MAX[d]} dan ${records[d]}`)
                    : t("Начать →", "Boshlash →")}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Итог подхода и кнопка «Ещё раз». */
function Finish({ id, score, onAgain }: { id: DrillId; score: number; onAgain: () => void }) {
  const t = useT();
  const record = useStore((s) => s.chessDrills[id] ?? 0);
  return (
    <div className="rounded-3xl bg-sun-soft p-6 text-center" data-drill-done={score}>
      <p className="text-5xl" aria-hidden>
        {score >= MAX[id] ? "🏆" : score >= MAX[id] / 2 ? "🌟" : "💪"}
      </p>
      <p className="mt-2 text-2xl font-black">
        {t(`Результат: ${score} из ${MAX[id]}`, `Natija: ${MAX[id]} dan ${score}`)}
      </p>
      <p className="font-bold text-[#7a4b00]">
        {score >= record
          ? t("Это твой рекорд!", "Bu sening rekording!")
          : t(`Рекорд — ${record}. Попробуй ещё!`, `Rekord — ${record}. Yana urinib koʻr!`)}
      </p>
      <Button className="mt-4" onClick={onAgain}>
        ↺ {t("Ещё раз", "Yana bir bor")}
      </Button>
    </div>
  );
}

function RoundBar({ round, total, score }: { round: number; total: number; score: number }) {
  const t = useT();
  return (
    <div className="flex items-center gap-3">
      <ProgressBar value={round} max={total} className="flex-1" />
      <span className="text-sm font-extrabold text-muted tabular-nums">
        {t(`Раунд ${Math.min(round + 1, total)} из ${total}`, `${total} tadan ${Math.min(round + 1, total)}-raund`)} ·
        ⭐ {score}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// «Кто в опасности?»
// ---------------------------------------------------------------------------

interface SafetyRound {
  fen: string;
  color: Color;
  danger: string[];
}

function SafetyDrill() {
  const t = useT();
  const bank = useBank("mix");
  const [rounds, setRounds] = useState<SafetyRound[] | null>(null);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const start = () => {
    if (!bank || bank === "error") return;
    const withDanger: SafetyRound[] = [];
    const safe: SafetyRound[] = [];
    // Берём позиции в случайном порядке, пока не наберём пять «с опасностью» и одну спокойную.
    const order = bank.map((p) => [random(), p] as const).sort((a, b) => a[0] - b[0]);
    for (const [, p] of order) {
      const fen = playUci(p.fen, p.moves[0])?.fen;
      const q = fen ? safetyQuestion(fen) : null;
      if (!q) continue;
      if (q.danger.length) {
        if (withDanger.length < 5) withDanger.push(q);
      } else if (safe.length < 1) safe.push(q);
      if (withDanger.length >= 5 && safe.length >= 1) break;
    }
    const list = [...withDanger];
    list.splice(Math.floor(random() * (list.length + 1)), 0, ...safe);
    setRounds(list.slice(0, MAX.safety));
    setRound(0);
    setPicked([]);
    setChecked(false);
    setScore(0);
  };

  if (bank === "error")
    return <p className="text-rose">{t("Не удалось загрузить позиции.", "Holatlarni yuklab boʻlmadi.")}</p>;
  if (!rounds)
    return (
      <Button onClick={start} disabled={!bank} size="lg">
        {bank ? t("Начать", "Boshlash") : t("Загружаю позиции…", "Holatlar yuklanmoqda…")}
      </Button>
    );
  if (round >= rounds.length) return <Finish id="safety" score={score} onAgain={start} />;

  const q = rounds[round];
  const enemy: Color = q.color === "w" ? "b" : "w";
  const right = checked && picked.length === q.danger.length && picked.every((s) => q.danger.includes(s));
  const marks: Record<string, SquareMark> = {};
  if (checked) {
    for (const s of q.danger) marks[s] = picked.includes(s) ? "good" : "hint";
    for (const s of picked) if (!q.danger.includes(s)) marks[s] = "bad";
  } else for (const s of picked) marks[s] = "selected";
  const arrows = checked
    ? q.danger.flatMap((s) => attackersOf(q.fen, s, enemy).map((a) => ({ from: a, to: s, color: "#dc2626" })))
    : [];

  const tap = (sq: string): boolean | void => {
    if (checked) return;
    const p = pieceAt(q.fen, sq);
    if (!p || p.color !== q.color || p.type === "k") return false;
    setPicked((list) => (list.includes(sq) ? list.filter((s) => s !== sq) : [...list, sq]));
  };
  const check = () => {
    setChecked(true);
    const ok = picked.length === q.danger.length && picked.every((s) => q.danger.includes(s));
    if (ok) setScore((n) => n + 1);
    if (round === rounds.length - 1) chessDrillRecord("safety", score + (ok ? 1 : 0));
  };
  const next = () => {
    setRound((r) => r + 1);
    setPicked([]);
    setChecked(false);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,440px)_1fr]">
      <ChessBoard
        id="safety"
        position={q.fen}
        orientation={q.color === "w" ? "white" : "black"}
        marks={marks}
        arrows={arrows}
        onSquare={tap}
        sounds={false}
      />
      <div className="space-y-3">
        <RoundBar round={round} total={rounds.length} score={score} />
        <p className="rounded-2xl bg-white px-4 py-3 text-lg font-black shadow-card">
          {q.color === "w"
            ? t("Ты играешь белыми.", "Sen oqlar bilan oʻynayapsan.")
            : t("Ты играешь чёрными.", "Sen qoralar bilan oʻynayapsan.")}{" "}
          {t(
            "Нажми на каждую свою фигуру в опасности. Если опасности нет — сразу жми «Готово».",
            "Xavf ostidagi har bir donangni bos. Xavf yoʻq boʻlsa — darhol «Tayyor»ni bos.",
          )}
        </p>
        {checked ? (
          <>
            <p
              className={cn(
                "rounded-2xl px-4 py-3 font-black",
                right ? "bg-mint-soft text-[#065f46]" : "bg-rose/10 text-rose",
              )}
              data-safety={right ? "right" : "wrong"}
            >
              {right
                ? t("✅ Верно!", "✅ Toʻgʻri!")
                : q.danger.length
                  ? t(
                      "Не совсем. Фигуры в опасности отмечены зелёным, красные стрелки — кто на них нападает.",
                      "Unchalik emas. Xavf ostidagi donalar yashil bilan belgilangan, qizil strelkalar — kim hujum qilayotgani.",
                    )
                  : t("Здесь все фигуры в безопасности.", "Bu yerda hamma donalar xavfsiz.")}
            </p>
            <Button onClick={next}>{t("Дальше →", "Keyingisi →")}</Button>
          </>
        ) : (
          <Button onClick={check} variant="success">
            ✓ {t("Готово", "Tayyor")}
            {picked.length ? ` (${picked.length})` : ""}
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// «Запомни»
// ---------------------------------------------------------------------------

const PIECE_WORDS: Record<string, [ru: string, uz: string]> = {
  wK: ["белый король", "oq shoh"],
  bK: ["чёрный король", "qora shoh"],
  wQ: ["белый ферзь", "oq farzin"],
  bQ: ["чёрный ферзь", "qora farzin"],
  wR: ["белая ладья", "oq rux"],
  bR: ["чёрная ладья", "qora rux"],
  wB: ["белый слон", "oq fil"],
  bB: ["чёрный слон", "qora fil"],
  wN: ["белый конь", "oq ot"],
  bN: ["чёрный конь", "qora ot"],
  wP: ["белая пешка", "oq piyoda"],
  bP: ["чёрная пешка", "qora piyoda"],
};

/** «Где стоял белый слон?» — у русских названий свой род. */
function whereWas(piece: string, lang: "ru" | "uz"): string {
  const [ru, uz] = PIECE_WORDS[piece];
  if (lang === "uz") return `${uz[0].toUpperCase()}${uz.slice(1)} qayerda turgan edi?`;
  const feminine = piece[1] === "R" || piece[1] === "P";
  return `Где ${feminine ? "стояла" : "стоял"} ${ru}?`;
}

type MemoryPhase = "show" | "ask" | "done";

function MemoryDrill() {
  const t = useT();
  const lang = useLang();
  const [round, setRound] = useState(0);
  const [task, setTask] = useState<MemoryRound | null>(null);
  const [phase, setPhase] = useState<MemoryPhase>("show");
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const secs = task ? memorySeconds(Object.keys(task.pieces).length) : 0;

  // Фигуры видны несколько секунд, потом исчезают.
  useEffect(() => {
    if (!task || phase !== "show") return;
    const id = setTimeout(() => setPhase("ask"), secs * 1000);
    return () => clearTimeout(id);
  }, [task, phase, secs]);

  const begin = (r: number) => {
    setRound(r);
    setTask(memoryRound(MEMORY_ROUNDS[r], random));
    setPhase("show");
    setAnswer(null);
  };
  const again = () => {
    setScore(0);
    setFinished(false);
    begin(0);
  };

  if (finished) return <Finish id="memory" score={score} onAgain={again} />;
  if (!task)
    return (
      <Button size="lg" onClick={again}>
        {t("Начать", "Boshlash")}
      </Button>
    );

  const right = answer === task.answer;
  const tap = (sq: string): boolean | void => {
    if (phase !== "ask") return;
    setAnswer(sq);
    setPhase("done");
    const ok = sq === task.answer;
    if (ok) setScore((n) => n + 1);
    if (round === MEMORY_ROUNDS.length - 1) chessDrillRecord("memory", score + (ok ? 1 : 0));
  };
  const next = () => (round + 1 < MEMORY_ROUNDS.length ? begin(round + 1) : setFinished(true));
  const marks: Record<string, SquareMark> = {};
  if (phase === "done" && answer) {
    marks[task.answer] = "good";
    if (!right) marks[answer] = "bad";
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,440px)_1fr]">
      <ChessBoard
        id="memory"
        position={phase === "ask" ? {} : task.pieces}
        marks={marks}
        onSquare={tap}
        sounds={false}
        rejectFeedback={false}
      />
      <div className="space-y-3">
        <RoundBar round={round} total={MEMORY_ROUNDS.length} score={score} />
        {phase === "show" ? (
          <div className="rounded-2xl bg-white px-4 py-3 shadow-card" data-memory="show">
            <p className="text-lg font-black">
              {t(
                `Запоминай! Фигур: ${Object.keys(task.pieces).length}`,
                `Eslab qol! Donalar: ${Object.keys(task.pieces).length} ta`,
              )}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
              <div
                key={`${round}-${secs}`}
                className="h-full origin-left animate-drain bg-brand"
                style={{ animationDuration: `${secs}s` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card" data-memory={phase}>
            <PieceIcon piece={task.ask} className="h-12 w-12 shrink-0 rounded-xl bg-[#f0d9b5] p-0.5" />
            <p className="text-lg font-black">{whereWas(task.ask, lang)}</p>
          </div>
        )}
        {phase === "done" && (
          <>
            <p
              className={cn(
                "rounded-2xl px-4 py-3 font-black",
                right ? "bg-mint-soft text-[#065f46]" : "bg-rose/10 text-rose",
              )}
            >
              {right
                ? t("✅ Точно! Отличная память.", "✅ Aynan! Xotirang zoʻr.")
                : t(
                    "Не здесь. Зелёная клетка — где фигура стояла на самом деле.",
                    "Bu yerda emas. Yashil katak — dona aslida turgan joy.",
                  )}
            </p>
            <Button onClick={next}>{t("Дальше →", "Keyingisi →")}</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// «Путь коня»
// ---------------------------------------------------------------------------

function KnightDrill() {
  const t = useT();
  const [round, setRound] = useState(0);
  const [task, setTask] = useState<KnightRound | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const begin = (r: number) => {
    setRound(r);
    setTask(knightRound(KNIGHT_ROUNDS[r], random));
    setPath([]);
  };
  const again = () => {
    setScore(0);
    setFinished(false);
    begin(0);
  };

  if (finished) return <Finish id="knight" score={score} onAgain={again} />;
  if (!task)
    return (
      <Button size="lg" onClick={again}>
        {t("Начать", "Boshlash")}
      </Button>
    );

  const forbidden = pawnDanger(task.pawns);
  const at = path[path.length - 1] ?? task.start;
  const done = at === task.target;
  const stars = done ? knightStars(path.length, task.best) : 0;
  const pieces: Record<string, string> = { [task.target]: "star" };
  for (const p of task.pawns) pieces[p] = "bP";
  pieces[at] = "wN";
  const marks: Record<string, SquareMark> = {};
  for (const s of forbidden) if (!task.pawns.includes(s)) marks[s] = "attacked";
  for (const s of path.slice(0, -1)) marks[s] = "last";
  if (path.length) marks[task.start] = "last";
  if (!done) for (const s of knightSteps(at, forbidden)) marks[s] = s === task.target ? "capture" : "target";
  else marks[task.target] = "good";

  const tap = (sq: string): boolean | void => {
    if (done) return;
    if (!knightSteps(at, forbidden).includes(sq)) return false;
    const moves = path.length + 1;
    setPath((p) => [...p, sq]);
    if (sq !== task.target) return;
    const got = knightStars(moves, task.best);
    setScore((n) => n + got);
    if (round === KNIGHT_ROUNDS.length - 1) chessDrillRecord("knight", score + got);
  };
  const next = () => (round + 1 < KNIGHT_ROUNDS.length ? begin(round + 1) : setFinished(true));

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,440px)_1fr]">
      <ChessBoard id="knight" position={pieces} marks={marks} onSquare={tap} />
      <div className="space-y-3">
        <RoundBar round={round} total={KNIGHT_ROUNDS.length} score={score} />
        <p className="rounded-2xl bg-white px-4 py-3 text-lg font-black shadow-card" data-knight-moves={path.length}>
          {t(`Ходов: ${path.length}`, `Yurishlar: ${path.length}`)}
          {task.pawns.length > 0 && (
            <span className="block text-sm font-bold text-muted">
              {t(
                "Красные клетки бьют пешки — туда коню нельзя.",
                "Qizil kataklarni piyodalar urib turibdi — otga u yerga borish mumkin emas.",
              )}
            </span>
          )}
        </p>
        {done ? (
          <>
            <p
              className={cn(
                "rounded-2xl px-4 py-3 font-black",
                stars === 3 ? "bg-mint-soft text-[#065f46]" : "bg-sun-soft text-[#7a4b00]",
              )}
              data-knight-stars={stars}
            >
              {"⭐".repeat(stars)}{" "}
              {stars === 3
                ? t("Самый короткий путь!", "Eng qisqa yoʻl!")
                : t(
                    `Можно было быстрее — за ${pluralize(task.best, "ход", "хода", "ходов")}.`,
                    `Tezroq ham boʻlardi — ${task.best} ta yurishda.`,
                  )}
            </p>
            <Button onClick={next}>{t("Дальше →", "Keyingisi →")}</Button>
          </>
        ) : (
          path.length > 0 && (
            <Button variant="secondary" size="sm" onClick={() => setPath([])}>
              ↺ {t("Начать путь заново", "Yoʻlni qaytadan boshlash")}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
