"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Feedback, type FeedbackState } from "@/components/answers/Feedback";
import { ListenButton } from "@/components/ListenButton";
import { RichText } from "@/components/RichText";
import { Button } from "@/components/ui";
import type { ChessExercise } from "@/content/chess/types";
import {
  kingSquare,
  legalTargets,
  pieceAt,
  playMove,
  queensInConflict,
  queensSolutions,
  type PieceType,
} from "@/lib/chess";
import { askExplain, praise } from "@/lib/feedback";
import { useLang, useSan, useT, type T } from "@/lib/i18n";
import { VOICE_CLIPS } from "@/lib/voice";
import { pluralize } from "@/lib/plural";
import { chessFound, chessMiss, chessSolved, useChessExercise } from "@/lib/store";
import { ChessBoard, type SquareMark } from "./ChessBoard";

type Of<K extends ChessExercise["kind"]> = Extract<ChessExercise, { kind: K }>;

const movesWord = (n: number) => pluralize(n, "ход", "хода", "ходов");

/** Оболочка упражнения: условие, доска, подсказка и объяснение после решения. */
function ExerciseShell({
  ex,
  solved,
  children,
  feedback,
}: {
  ex: ChessExercise;
  solved: boolean;
  children: ReactNode;
  feedback: FeedbackState | null;
}) {
  const t = useT();
  const lang = useLang();
  const [hint, setHint] = useState(false);
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <h3 className="flex flex-wrap items-center gap-2 text-2xl font-black">
          {ex.title}
          {solved && (
            <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-sm font-extrabold text-[#065f46]">
              {t("✓ решено", "✓ yechildi")}
            </span>
          )}
        </h3>
        <p className="text-lg leading-relaxed">
          <RichText text={ex.prompt} />
        </p>
        <ListenButton src={VOICE_CLIPS.exercise(ex.id, lang)} />
      </div>
      {children}
      <Feedback state={feedback} context="chess" />
      {solved ? (
        <div className="rounded-2xl border-2 border-mint/40 bg-mint-soft/60 px-4 py-3">
          <p className="text-sm font-extrabold text-[#065f46]">{t("Почему так", "Nega shunday")}</p>
          <p className="mt-1 font-semibold">
            <RichText text={ex.why} />
          </p>
        </div>
      ) : hint ? (
        <div className="rounded-2xl border-2 border-sun/40 bg-sun-soft px-4 py-3">
          <p className="text-sm font-extrabold text-[#7a4b00]">{t("💡 Подсказка", "💡 Maslahat")}</p>
          <p className="mt-1 font-semibold text-[#7a4b00]">
            <RichText text={ex.hint} />
          </p>
        </div>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setHint(true)}>
          {t("💡 Подсказка", "💡 Maslahat")}
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Найди клетку
// ---------------------------------------------------------------------------

function SquaresExercise({ ex }: { ex: Of<"squares"> }) {
  const t = useT();
  const lang = useLang();
  const progress = useChessExercise(ex.id);
  const [found, setFound] = useState<string[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const target = ex.targets[found.length];
  const done = found.length === ex.targets.length;

  const tap = (sq: string) => {
    if (done) return;
    if (sq === target) {
      const next = [...found, sq];
      setFound(next);
      setMiss(null);
      if (next.length === ex.targets.length) {
        chessSolved(ex.id);
        setFeedback({
          tone: "success",
          text: t(`${praise(0, lang)} Все клетки найдены!`, `${praise(0, lang)} Hamma kataklarni topding!`),
          sub: t(
            "Ты знаешь имена клеток — как настоящий шахматист.",
            "Kataklarning nomini bilasan — xuddi haqiqiy shaxmatchidek.",
          ),
        });
      } else {
        setFeedback({
          tone: "info",
          text: t(`Верно, это ${sq}!`, `Toʻgʻri, bu — ${sq}!`),
          sub: t(`Теперь найди ${ex.targets[next.length]}.`, `Endi ${ex.targets[next.length]} ni top.`),
        });
      }
      return;
    }
    chessMiss(ex.id);
    setMiss(sq);
    setFeedback({
      tone: "retry",
      text: t(`Это клетка ${sq}. А нужна ${target}.`, `Bu — ${sq} katagi. Bizga esa ${target} kerak.`),
      sub: t(
        `Сначала найди вертикаль ${target[0]} (буква внизу), потом горизонталь ${target[1]} (цифра сбоку).`,
        `Avval ${target[0]} vertikalini top (pastdagi harf), keyin ${target[1]}-gorizontalni (yondagi raqam).`,
      ),
    });
  };

  const marks: Record<string, SquareMark> = {};
  found.forEach((s) => (marks[s] = "good"));
  if (miss) marks[miss] = "bad";

  return (
    <ExerciseShell ex={ex} solved={!!progress.solvedAt} feedback={feedback}>
      <p
        className="rounded-2xl bg-brand-soft px-4 py-3 text-center text-xl font-black text-brand-dark"
        aria-live="polite"
      >
        {done ? t("Готово! ✨", "Tayyor! ✨") : t(`Найди клетку ${target}`, `${target} katagini top`)}
        <span className="ml-2 text-sm font-bold text-muted">
          {t(`(${found.length} из ${ex.targets.length})`, `(${found.length} / ${ex.targets.length})`)}
        </span>
      </p>
      <ChessBoard id={`sq-${ex.id}`} position="8/8/8/8/8/8/8/8 w - - 0 1" marks={marks} onSquare={tap} />
      {done && (
        <Button
          variant="secondary"
          onClick={() => {
            setFound([]);
            setFeedback(null);
          }}
        >
          {t("↺ Ещё раз", "↺ Yana bir marta")}
        </Button>
      )}
    </ExerciseShell>
  );
}

// ---------------------------------------------------------------------------
// Куда может пойти фигура
// ---------------------------------------------------------------------------

function MovesExercise({ ex }: { ex: Of<"moves"> }) {
  const t = useT();
  const lang = useLang();
  const progress = useChessExercise(ex.id);
  const [marked, setMarked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const solvedNow = checked && marked.length === ex.answer.length && ex.answer.every((s) => marked.includes(s));

  const tap = (sq: string) => {
    if (sq === ex.from || solvedNow) return;
    setChecked(false);
    setMarked((m) => (m.includes(sq) ? m.filter((x) => x !== sq) : [...m, sq]));
    setFeedback(null);
  };

  const check = () => {
    const n = attempts.current++;
    setChecked(true);
    const right = marked.filter((s) => ex.answer.includes(s));
    const extra = marked.filter((s) => !ex.answer.includes(s));
    if (extra.length === 0 && right.length === ex.answer.length) {
      chessSolved(ex.id);
      setFeedback({
        tone: "success",
        text: t(
          `${praise(n, lang)} Все ${pluralize(ex.answer.length, "клетка", "клетки", "клеток")} найдены.`,
          `${praise(n, lang)} ${ex.answer.length} ta katakning hammasini topding.`,
        ),
        sub: askExplain(n, lang),
      });
      return;
    }
    chessMiss(ex.id);
    setFeedback({
      tone: "retry",
      text:
        extra.length > 0
          ? t(
              `Есть лишние клетки — они подсвечены. Сюда фигура пойти не может.`,
              "Ortiqcha kataklar bor — ular belgilab qoʻyildi. Dona u yerga bora olmaydi.",
            )
          : t(
              `Найдено ${right.length} из ${ex.answer.length}. Есть ещё клетки!`,
              `${ex.answer.length} tadan ${right.length} tasi topildi. Yana kataklar bor!`,
            ),
      sub:
        extra.length > 0
          ? t("Убери лишние отметки и проверь снова.", "Ortiqcha belgilarni olib tashla va yana tekshir.")
          : t(
              "Проверь все направления, в которые ходит фигура.",
              "Dona yuradigan hamma yoʻnalishlarni tekshirib koʻr.",
            ),
    });
  };

  const marks: Record<string, SquareMark> = { [ex.from]: "selected" };
  for (const s of marked)
    marks[s] =
      checked && !ex.answer.includes(s)
        ? "bad"
        : checked && solvedNow
          ? "good"
          : pieceAt(ex.fen, s)
            ? "capture"
            : "mark";

  return (
    <ExerciseShell ex={ex} solved={!!progress.solvedAt} feedback={feedback}>
      <ChessBoard id={`mv-${ex.id}`} position={ex.fen} marks={marks} onSquare={tap} />
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={check} disabled={marked.length === 0 || solvedNow}>
          {t("Проверить", "Tekshirish")}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setMarked([]);
            setChecked(false);
            setFeedback(null);
          }}
          disabled={marked.length === 0}
        >
          {t("Убрать отметки", "Belgilarni tozalash")}
        </Button>
        <span className="text-sm font-bold text-muted">
          {t("Отмечено", "Belgilandi")}: {marked.length}
        </span>
      </div>
    </ExerciseShell>
  );
}

// ---------------------------------------------------------------------------
// Звёздочки
// ---------------------------------------------------------------------------

function StarsExercise({ ex }: { ex: Of<"stars"> }) {
  const t = useT();
  const lang = useLang();
  const progress = useChessExercise(ex.id);
  const [pos, setPos] = useState(ex.start);
  const [left, setLeft] = useState<string[]>(ex.stars);
  const [moves, setMoves] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const blocks = new Set(ex.blocks ?? []);
  const done = left.length === 0;
  const pieceCode = `w${ex.piece.toUpperCase()}`;
  const fen = boardFen({ [pos]: pieceCode, ...Object.fromEntries([...blocks].map((b) => [b, "wP"])) });
  const targets = done ? [] : legalTargets(fen, pos);

  const tap = (sq: string) => {
    if (done || !targets.includes(sq)) {
      if (!done && sq !== pos)
        setFeedback({
          tone: "info",
          text: t("Так фигура не ходит.", "Bu dona bunday yurmaydi."),
          sub: t(
            "Точки на доске показывают, куда можно пойти.",
            "Taxtadagi nuqtalar qayerga yurish mumkinligini koʻrsatadi.",
          ),
        });
      return;
    }
    const nextLeft = left.filter((s) => s !== sq);
    const count = moves + 1;
    setPos(sq);
    setLeft(nextLeft);
    setMoves(count);
    if (nextLeft.length > 0) {
      setFeedback(null);
      return;
    }
    const n = attempts.current++;
    chessSolved(ex.id, count);
    setFeedback(
      count <= ex.optimal
        ? {
            tone: "success",
            text: t(
              `${praise(n, lang)} Все звёзды собраны за ${movesWord(count)}!`,
              `${praise(n, lang)} Hamma yulduzlarni ${count} yurishda yigʻding!`,
            ),
            sub: t("Быстрее не бывает.", "Bundan tezroq boʻlmaydi."),
          }
        : {
            tone: "success",
            text: t(
              `Все звёзды собраны! Понадобилось ${movesWord(count)}.`,
              `Hamma yulduzlar yigʻildi! Buning uchun ${count} ta yurish kerak boʻldi.`,
            ),
            sub: t(
              `А можно за ${movesWord(ex.optimal)}. Попробуешь?`,
              `Aslida ${ex.optimal} yurishda ham boʻladi. Sinab koʻrasanmi?`,
            ),
          },
    );
  };

  const restart = () => {
    setPos(ex.start);
    setLeft(ex.stars);
    setMoves(0);
    setFeedback(null);
  };

  const pieces: Record<string, string> = { [pos]: pieceCode };
  left.forEach((s) => (pieces[s] = "star"));
  blocks.forEach((b) => (pieces[b] = "wP"));
  const marks: Record<string, SquareMark> = { [pos]: "selected" };
  targets.forEach((sq) => (marks[sq] = "target"));

  return (
    <ExerciseShell ex={ex} solved={!!progress.solvedAt} feedback={feedback}>
      <ChessBoard id={`st-${ex.id}`} position={pieces} marks={marks} onSquare={tap} />
      <div className="flex flex-wrap items-center gap-3">
        <span className="tabular rounded-2xl bg-white px-4 py-2 text-lg font-black shadow-card">
          {t("Ходов", "Yurishlar")}: {moves}
        </span>
        <span className="text-sm font-bold text-muted">
          {t("Осталось звёзд", "Qolgan yulduzlar")}: {left.length}
        </span>
        {progress.best !== undefined && (
          <span className="text-sm font-bold text-muted">
            {t(`Рекорд: ${movesWord(progress.best)}`, `Rekord: ${progress.best} ta yurish`)}
          </span>
        )}
        <Button variant="ghost" onClick={restart} disabled={moves === 0}>
          {t("↺ Сначала", "↺ Boshidan")}
        </Button>
      </div>
    </ExerciseShell>
  );
}

// ---------------------------------------------------------------------------
// Найди ход
// ---------------------------------------------------------------------------

const GOAL_RETRY: Record<Of<"move">["goal"], (m: NonNullable<ReturnType<typeof playMove>>, t: T) => FeedbackState> = {
  mate: (m, t) =>
    m.check
      ? {
          tone: "retry",
          text: t("Шах есть, но король может спастись.", "Shoh berding, ammo raqib shohi hali qutula oladi."),
          sub: t(
            "Ищи ход, после которого королю некуда деться.",
            "Shunday yurish izla: undan keyin shohning qochadigan joyi qolmasin.",
          ),
        }
      : {
          tone: "retry",
          text: t("Это не шах.", "Bu yurish shoh bermaydi."),
          sub: t("Мат всегда начинается с шаха.", "Mot har doim shoh berishdan boshlanadi."),
        },
  capture: (m, t) =>
    m.captured
      ? {
          tone: "retry",
          text: t(
            "Эту фигуру можно взять, но потом заберут твою.",
            "Bu donani urib olsa boʻladi, lekin keyin raqib seningkini urib oladi.",
          ),
          sub: t(
            "Проверь, кто защищает фигуру, которую ты берёшь.",
            "Tekshirib koʻr: sen urayotgan donani kim himoya qilyapti?",
          ),
        }
      : {
          tone: "retry",
          text: t("Этот ход ничего не берёт.", "Bu yurish hech narsani urmaydi."),
          sub: t("Найди ход, который забирает фигуру соперника.", "Raqib donasini urib oladigan yurishni top."),
        },
  promote: (_m, t) => ({
    tone: "retry",
    text: t("Пешка пока не дошла до конца доски.", "Piyoda hali taxtaning oxiriga yetib bormadi."),
    sub: t("Ей нужно встать на последнюю горизонталь.", "U oxirgi gorizontalga chiqishi kerak."),
  }),
  fork: (m, t) =>
    m.check
      ? {
          tone: "retry",
          text: t(
            "Шах есть, но второй фигуре ничего не грозит.",
            "Shoh berding, lekin ikkinchi donaga hech qanday xavf yoʻq.",
          ),
          sub: t(
            "Нужен ход, который нападает сразу на двоих.",
            "Bir vaqtning oʻzida ikkita donaga hujum qiladigan yurish kerak.",
          ),
        }
      : {
          tone: "retry",
          text: t("Это не шах.", "Bu yurish shoh bermaydi."),
          sub: t(
            "Нужен шах — и одновременно нападение на вторую фигуру.",
            "Shoh berish kerak — va shu bilan birga ikkinchi donaga hujum qilish.",
          ),
        },
  castle: (_m, t) => ({
    tone: "retry",
    text: t("Это обычный ход.", "Bu oddiy yurish."),
    sub: t(
      "При рокировке король шагает на две клетки в сторону ладьи.",
      "Rokirovkada shoh rux tomonga ikki katak yuradi.",
    ),
  }),
};

function MoveExercise({ ex }: { ex: Of<"move"> }) {
  const t = useT();
  const lang = useLang();
  const san = useSan();
  const progress = useChessExercise(ex.id);
  const [fen, setFen] = useState(ex.fen);
  const [selected, setSelected] = useState<string | null>(null);
  const [last, setLast] = useState<[string, string] | null>(null);
  const [checkSq, setCheckSq] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const turn = ex.fen.split(" ")[1];
  const busy = fen !== ex.fen;

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const attempt = (from: string, to: string): boolean => {
    const played = playMove(ex.fen, from, to, "q");
    if (!played) return false;
    setSelected(null);
    setFen(played.fen);
    setLast([from, to]);
    setCheckSq(played.check ? kingSquare(played.fen, turn === "w" ? "b" : "w") : null);
    const n = attempts.current++;
    const ok = ex.goal === "mate" ? played.mate : ex.solutions.includes(played.uci);
    if (ok) {
      setDone(true);
      chessSolved(ex.id);
      setFeedback({
        tone: "success",
        text: `${praise(n, lang)} ${san(played.san)}${played.mate ? t(" — мат!", " — mot!") : ""}`,
        sub: askExplain(n, lang),
      });
      return true;
    }
    chessMiss(ex.id);
    setFeedback(GOAL_RETRY[ex.goal](played, t));
    timer.current = setTimeout(() => {
      setFen(ex.fen);
      setLast(null);
      setCheckSq(null);
    }, 1600);
    return true;
  };

  const tap = (sq: string) => {
    if (done || busy) return;
    const piece = pieceAt(ex.fen, sq);
    if (piece && piece.color === turn) {
      setSelected(sq === selected ? null : sq);
      return;
    }
    if (selected && legalTargets(ex.fen, selected).includes(sq)) attempt(selected, sq);
    else setSelected(null);
  };

  const marks: Record<string, SquareMark> = {};
  if (last) {
    marks[last[0]] = "last";
    marks[last[1]] = "last";
  }
  if (checkSq) marks[checkSq] = "check";
  if (selected) {
    marks[selected] = "selected";
    for (const sq of legalTargets(ex.fen, selected)) marks[sq] = pieceAt(ex.fen, sq) ? "capture" : "target";
  }

  return (
    <ExerciseShell ex={ex} solved={!!progress.solvedAt} feedback={feedback}>
      <p className="text-sm font-bold text-muted">
        {turn === "w" ? t("Ходят белые.", "Oqlar yuradi.") : t("Ходят чёрные.", "Qoralar yuradi.")}{" "}
        {t(
          "Нажми на фигуру, а потом на клетку — или перетащи фигуру.",
          "Avval donani, keyin katakni bos — yoki donani sudrab olib bor.",
        )}
      </p>
      <ChessBoard
        id={`mo-${ex.id}`}
        position={fen}
        marks={marks}
        onSquare={tap}
        draggable={!done && !busy}
        onDrop={(from, to) => {
          const piece = pieceAt(ex.fen, from);
          if (done || busy || !piece || piece.color !== turn) return false;
          return attempt(from, to);
        }}
      />
      {done && (
        <Button
          variant="secondary"
          onClick={() => {
            setFen(ex.fen);
            setLast(null);
            setCheckSq(null);
            setDone(false);
            setFeedback(null);
          }}
        >
          {t("↺ Решить ещё раз", "↺ Yana bir bor yechish")}
        </Button>
      )}
    </ExerciseShell>
  );
}

// ---------------------------------------------------------------------------
// Нажми на клетку
// ---------------------------------------------------------------------------

function PickExercise({ ex }: { ex: Of<"pick"> }) {
  const t = useT();
  const lang = useLang();
  const progress = useChessExercise(ex.id);
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const right = picked !== null && ex.answer.includes(picked);

  const tap = (sq: string) => {
    if (right) return;
    const n = attempts.current++;
    setPicked(sq);
    if (ex.answer.includes(sq)) {
      chessSolved(ex.id);
      setFeedback({ tone: "success", text: praise(n, lang), sub: askExplain(n, lang) });
      return;
    }
    chessMiss(ex.id);
    setFeedback({
      tone: "retry",
      text: t(`Клетка ${sq} — не то.`, `${sq} katagi toʻgʻri kelmaydi.`),
      sub: t("Подумай ещё раз и нажми на другую клетку.", "Yana bir oʻylab koʻr va boshqa katakni bos."),
    });
  };

  return (
    <ExerciseShell ex={ex} solved={!!progress.solvedAt} feedback={feedback}>
      <ChessBoard
        id={`pk-${ex.id}`}
        position={ex.pieces}
        marks={picked ? { [picked]: right ? "good" : "bad" } : {}}
        onSquare={tap}
      />
    </ExerciseShell>
  );
}

// ---------------------------------------------------------------------------
// Вопросы
// ---------------------------------------------------------------------------

function QuizExercise({ ex }: { ex: Of<"quiz"> }) {
  const t = useT();
  const lang = useLang();
  const progress = useChessExercise(ex.id);
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const done = index >= ex.questions.length;
  const q = ex.questions[Math.min(index, ex.questions.length - 1)];

  const answer = (i: number) => {
    if (done) return;
    if (i === q.correct) {
      setWrong(null);
      const next = index + 1;
      setIndex(next);
      if (next === ex.questions.length) {
        chessSolved(ex.id);
        setFeedback({
          tone: "success",
          text: t(`${praise(0, lang)} Все ответы верные.`, `${praise(0, lang)} Hamma savollarning javobini topding.`),
          sub: t("Отлично! Правила хорошо запомнились!", "Qoidalarni juda yaxshi eslab qolibsan!"),
        });
      } else
        setFeedback({ tone: "info", text: t("Верно!", "Toʻgʻri!"), sub: t("Следующий вопрос.", "Keyingi savol.") });
      return;
    }
    chessMiss(ex.id);
    setWrong(i);
    setFeedback({
      tone: "retry",
      text: t("Подумай ещё.", "Yana bir oʻylab koʻr."),
      sub: t("Вспомни урок — ответ там есть.", "Darsni esla — javob oʻsha yerda bor."),
    });
  };

  return (
    <ExerciseShell ex={ex} solved={!!progress.solvedAt} feedback={feedback}>
      {!done ? (
        <div className="space-y-3 rounded-3xl bg-white p-4 shadow-card">
          <p className="text-sm font-extrabold text-muted">
            {t(`Вопрос ${index + 1} из ${ex.questions.length}`, `${index + 1}-savol, jami ${ex.questions.length} ta`)}
          </p>
          <p className="text-lg font-bold">{q.text}</p>
          {q.fen && <ChessBoard id={`qz-${ex.id}-${index}`} position={q.fen} maxWidth={320} />}
          <div className="flex flex-wrap gap-2">
            {q.options.map((o, i) => (
              <Button key={o} variant={wrong === i ? "sun" : "secondary"} onClick={() => answer(i)}>
                {o}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <Button
          variant="secondary"
          onClick={() => {
            setIndex(0);
            setFeedback(null);
          }}
        >
          {t("↺ Пройти ещё раз", "↺ Qaytadan boshlash")}
        </Button>
      )}
    </ExerciseShell>
  );
}

// ---------------------------------------------------------------------------
// Ферзи
// ---------------------------------------------------------------------------

function QueensExercise({ ex }: { ex: Of<"queens"> }) {
  const t = useT();
  const lang = useLang();
  const progress = useChessExercise(ex.id);
  const [queens, setQueens] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const total = queensSolutions(ex.size).length;
  const found = progress.found ?? [];
  const conflicts = queensInConflict(queens);

  const tap = (sq: string) => {
    const next = queens.includes(sq) ? queens.filter((q) => q !== sq) : [...queens, sq];
    if (next.length > ex.size) {
      setFeedback({
        tone: "info",
        text: t(`Ферзей должно быть ровно ${ex.size}.`, `Farzinlar roppa-rosa ${ex.size} ta boʻlishi kerak.`),
        sub: t(
          "Убери какого-нибудь ферзя, чтобы поставить нового.",
          "Yangisini qoʻyish uchun bitta farzinni olib tashla.",
        ),
      });
      return;
    }
    setQueens(next);
    const bad = queensInConflict(next);
    if (next.length === ex.size && bad.length === 0) {
      const key = [...next].sort().join(" ");
      const isNew = !found.includes(key);
      chessSolved(ex.id);
      chessFound(ex.id, key);
      const count = found.length + (isNew ? 1 : 0);
      setFeedback({
        tone: "success",
        text: isNew
          ? t(
              `${praise(count - 1, lang)} Ни один ферзь не бьёт другого!`,
              `${praise(count - 1, lang)} Hech bir farzin boshqasini urmayapti!`,
            )
          : t("Это решение уже было найдено.", "Bu yechimni avval ham topgansan."),
        sub:
          count < total
            ? t(
                `Найдено решений: ${count} из ${total}. Найдёшь другое?`,
                `${total} ta yechimdan ${count} tasi topildi. Boshqasini ham topa olasanmi?`,
              )
            : t(`Все решения найдены — их ${total}!`, `Hamma yechimlarni topding — ular ${total} ta!`),
      });
      return;
    }
    if (next.length === ex.size) chessMiss(ex.id);
    setFeedback(
      bad.length > 0
        ? {
            tone: "retry",
            text: t(
              "Некоторые ферзи бьют друг друга — они подсвечены.",
              "Baʼzi farzinlar bir-birini urayapti — ular belgilab qoʻyildi.",
            ),
            sub: t("Переставь их.", "Ularning joyini oʻzgartir."),
          }
        : null,
    );
  };

  const pieces: Record<string, string> = Object.fromEntries(queens.map((q) => [q, "wQ"]));
  const marks: Record<string, SquareMark> = Object.fromEntries(conflicts.map((q) => [q, "attacked" as const]));

  return (
    <ExerciseShell ex={ex} solved={!!progress.solvedAt} feedback={feedback}>
      <ChessBoard
        id={`qn-${ex.id}`}
        position={pieces}
        cols={ex.size}
        rows={ex.size}
        marks={marks}
        onSquare={tap}
        maxWidth={320}
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="tabular rounded-2xl bg-white px-4 py-2 text-lg font-black shadow-card">
          {t(`Ферзей: ${queens.length} из ${ex.size}`, `Farzinlar: ${queens.length} / ${ex.size}`)}
        </span>
        <span className="text-sm font-bold text-muted">
          {t(`Найдено решений: ${found.length} из ${total}`, `Topilgan yechimlar: ${found.length} / ${total}`)}
        </span>
        <Button
          variant="ghost"
          onClick={() => {
            setQueens([]);
            setFeedback(null);
          }}
          disabled={queens.length === 0}
        >
          {t("Убрать всех", "Hammasini olib tashlash")}
        </Button>
      </div>
    </ExerciseShell>
  );
}

/** FEN доски 8 × 8 из набора фигур (для проверки ходов через chess.js). */
function boardFen(pieces: Record<string, string>): string {
  const rows: string[] = [];
  for (let r = 8; r >= 1; r--) {
    let row = "";
    let empty = 0;
    for (let c = 0; c < 8; c++) {
      const p = pieces[`${"abcdefgh"[c]}${r}`];
      if (!p) {
        empty++;
        continue;
      }
      if (empty) row += empty;
      empty = 0;
      const letter = p[1] as Uppercase<PieceType>;
      row += p[0] === "w" ? letter : letter.toLowerCase();
    }
    rows.push(row + (empty ? String(empty) : ""));
  }
  return `${rows.join("/")} w - - 0 1`;
}

export function ChessExerciseView({ exercise }: { exercise: ChessExercise }) {
  switch (exercise.kind) {
    case "squares":
      return <SquaresExercise ex={exercise} />;
    case "moves":
      return <MovesExercise ex={exercise} />;
    case "stars":
      return <StarsExercise ex={exercise} />;
    case "move":
      return <MoveExercise ex={exercise} />;
    case "pick":
      return <PickExercise ex={exercise} />;
    case "quiz":
      return <QuizExercise ex={exercise} />;
    case "queens":
      return <QueensExercise ex={exercise} />;
  }
}
