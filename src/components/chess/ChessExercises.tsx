"use client";

import { ArrowLeft, ArrowRight, Check, Eraser, Lightbulb, RotateCcw } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Feedback, type FeedbackState } from "@/components/answers/Feedback";
import { ListenButton } from "@/components/ListenButton";
import { RichText } from "@/components/RichText";
import { Button, Icon } from "@/components/ui";
import type { ChessExercise } from "@/content/chess/types";
import {
  kingSquare,
  legalTargets,
  pieceAt,
  playMove,
  queensInConflict,
  queensSolutions,
  sanOf,
  type PieceType,
} from "@/lib/chess";
import { askExplain, praise } from "@/lib/feedback";
import { useLang, useSan, useT, type T } from "@/lib/i18n";
import { RECORDED_CLIPS } from "@/lib/voiceRecorded";
import { pluralize } from "@/lib/plural";
import { chessFound, chessMiss, chessSolved, useChessExercise } from "@/lib/store";
import { BarButton, BoardBar } from "./BoardBar";
import { ChessBoard, type SquareMark } from "./ChessBoard";

type Of<K extends ChessExercise["kind"]> = Extract<ChessExercise, { kind: K }>;

const movesWord = (n: number) => pluralize(n, "ход", "хода", "ходов");

/** В контрольном тесте подсказок нет: ребёнок отвечает сам. */
const TestModeContext = createContext(false);

/** Переход между упражнениями от экрана урока: «назад» и «дальше» — крайние кнопки панели под доской. */
export interface ExerciseNav {
  /** К предыдущему упражнению; нет — кнопка «Назад» бледная (первое упражнение). */
  prev?: () => void;
  /** К следующему упражнению или теме. `ready` — упражнение решено: «Дальше» становится главной кнопкой. */
  onward?: { label: string; onClick: () => void; ready: boolean };
}

const NavContext = createContext<ExerciseNav | null>(null);

/**
 * Оболочка упражнения: условие, доска, одна панель кнопок, ответ, подсказка и объяснение после решения.
 *
 * Панель (`BoardBar`) стоит сразу под доской и не меняет места: «Назад», «Подсказка», кнопки самого упражнения
 * (`actions`: «Проверить», «Убрать», «Сначала», «Ещё раз») и «Дальше». Раньше это были три ряда отдельных кнопок:
 * кнопки упражнения, «Подсказка» под ответом и «← Назад / Следующее упражнение →» в самом низу.
 */
function ExerciseShell({
  ex,
  solved,
  children,
  feedback,
  actions,
}: {
  ex: ChessExercise;
  solved: boolean;
  children: ReactNode;
  feedback: FeedbackState | null;
  /** Кнопки упражнения для панели (`BarButton`). */
  actions?: ReactNode;
}) {
  const t = useT();
  const lang = useLang();
  const [hint, setHint] = useState(false);
  const test = useContext(TestModeContext);
  const nav = useContext(NavContext);
  const nextShort = t("Дальше", "Keyingi");
  return (
    // board-stage: с 1024 px доска (прямой потомок) встаёт слева во всю высоту окна, остальное — справа.
    <div className="board-stage space-y-3 lg:space-y-4">
      {/* На телефоне и планшете «Послушать» стоит в строке с названием, а не отдельной строкой над доской. */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 lg:block lg:space-y-1.5">
        <h2
          data-exercise-heading
          tabIndex={-1}
          className="flex flex-wrap items-center gap-2 text-2xl font-black outline-none"
        >
          {ex.title}
          {solved && (
            <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-sm font-extrabold text-mint-ink">
              {t("✓ решено", "✓ yechildi")}
            </span>
          )}
        </h2>
        <p className="text-lg leading-snug max-lg:col-span-2 lg:leading-relaxed">
          <RichText text={ex.prompt} />
        </p>
        <ListenButton
          src={RECORDED_CLIPS.exercise(ex.id, lang)}
          className="max-lg:col-start-2 max-lg:row-start-1 max-lg:self-start"
        />
      </div>
      {children}
      {(nav || !test || actions) && (
        <BoardBar label={t("Кнопки упражнения", "Mashq tugmalari")} data-exercise-bar="">
          {nav && (
            <BarButton
              icon={ArrowLeft}
              label={t("Назад", "Orqaga")}
              name={t("Назад: предыдущее упражнение", "Orqaga: oldingi mashq")}
              disabled={!nav.prev}
              onClick={nav.prev}
            />
          )}
          {/* В контрольном тесте подсказок нет; после решения вместо подсказки — объяснение. */}
          {!test && (
            <BarButton
              icon={Lightbulb}
              label={t("Подсказка", "Maslahat")}
              pressed={hint && !solved}
              disabled={solved}
              onClick={() => setHint((h) => !h)}
            />
          )}
          {actions}
          {nav?.onward && (
            <BarButton
              icon={ArrowRight}
              label={nextShort}
              name={
                nav.onward.label.toLowerCase().includes(nextShort.toLowerCase())
                  ? nav.onward.label
                  : `${nextShort}: ${nav.onward.label}`
              }
              primary={nav.onward.ready}
              onClick={nav.onward.onClick}
              data-exercise-onward={nav.onward.ready ? "ready" : "open"}
            />
          )}
        </BoardBar>
      )}
      <Feedback state={feedback} context="chess" />
      {solved ? (
        <div className="rounded-2xl border-2 border-mint/40 bg-mint-soft/60 px-4 py-3">
          <p className="text-sm font-extrabold text-mint-ink">{t("Почему так", "Nega shunday")}</p>
          <p className="mt-1 font-semibold">
            <RichText text={ex.why} />
          </p>
        </div>
      ) : hint && !test ? (
        <div className="rounded-2xl border-2 border-sun/40 bg-sun-soft px-4 py-3" data-exercise-hint>
          <p className="text-sm font-extrabold text-sun-ink">
            <Icon icon={Lightbulb} /> {t("Подсказка", "Maslahat")}
          </p>
          <p className="mt-1 font-semibold text-sun-ink">
            <RichText text={ex.hint} />
          </p>
        </div>
      ) : null}
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
    <ExerciseShell
      ex={ex}
      solved={!!progress.solvedAt}
      feedback={feedback}
      actions={
        done && (
          <BarButton
            icon={RotateCcw}
            label={t("Ещё раз", "Yana")}
            name={t("Ещё раз", "Yana bir marta")}
            onClick={() => {
              setFound([]);
              setFeedback(null);
            }}
          />
        )
      }
    >
      <p
        className="rounded-2xl bg-brand-soft px-4 py-3 text-center text-xl font-black text-brand-dark"
        aria-live="polite"
      >
        {done ? t("Готово! ✨", "Tayyor! ✨") : t(`Найди клетку ${target}`, `${target} katagini top`)}
        <span className="ml-2 text-sm font-bold text-muted">
          {t(`(${found.length} из ${ex.targets.length})`, `(${found.length} / ${ex.targets.length})`)}
        </span>
      </p>
      <ChessBoard
        id={`sq-${ex.id}`}
        position="8/8/8/8/8/8/8/8 w - - 0 1"
        marks={marks}
        onSquare={tap}
        showTurn={false}
      />
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
    <ExerciseShell
      ex={ex}
      solved={!!progress.solvedAt}
      feedback={feedback}
      actions={
        <>
          {/* На самых узких экранах (до 340 px) места на пять кнопок нет: отметку снимает и нажатие на клетку. */}
          <BarButton
            icon={Eraser}
            label={t("Убрать", "Tozalash")}
            name={t("Убрать отметки", "Belgilarni tozalash")}
            className="max-[339px]:hidden"
            onClick={() => {
              setMarked([]);
              setChecked(false);
              setFeedback(null);
            }}
            disabled={marked.length === 0}
          />
          <BarButton
            icon={Check}
            label={t("Проверить", "Tekshirish")}
            primary={!solvedNow}
            onClick={check}
            disabled={marked.length === 0 || solvedNow}
          />
        </>
      }
    >
      <ChessBoard id={`mv-${ex.id}`} position={ex.fen} marks={marks} onSquare={tap} showTurn={false} />
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
    <ExerciseShell
      ex={ex}
      solved={!!progress.solvedAt}
      feedback={feedback}
      actions={<BarButton icon={RotateCcw} label={t("Сначала", "Boshidan")} onClick={restart} disabled={moves === 0} />}
    >
      <ChessBoard id={`st-${ex.id}`} position={pieces} marks={marks} onSquare={tap} />
      {/* Счёт — одной строкой: на телефоне он стоит между доской и панелью и не должен сдвигать её за край экрана. */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 px-1">
        <span className="tabular text-lg leading-tight font-black">
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
      </div>
    </ExerciseShell>
  );
}

// ---------------------------------------------------------------------------
// Найди ход
// ---------------------------------------------------------------------------

/**
 * Цели, где ищут тактический ход: только там голос советует «поищи шах, взятие или угрозу» и «посмотри, кто
 * кого атакует». В остальных упражнениях (рокировка, превращение, взятие на проходе, пат, защита от шаха)
 * такой совет сбивает — звучит обычное «посмотри на доску ещё раз».
 */
const TACTIC_GOALS: ReadonlySet<Of<"move">["goal"]> = new Set([
  "mate",
  "capture",
  "fork",
  "double",
  "pin",
  "skewer",
  "discover",
  "check",
]);

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
  double: (_m, t) => ({
    tone: "retry",
    text: t("Пока нападение только на одну цель.", "Hozircha faqat bitta nishonga hujum qilyapsan."),
    sub: t(
      "Ищи клетку, откуда фигура видит сразу две незащищённые цели — и сама остаётся в безопасности.",
      "Shunday katak izla: u yerdan dona bir vaqtda ikkita himoyasiz nishonni koʻrsin va oʻzi xavfsiz boʻlsin.",
    ),
  }),
  pin: (_m, t) => ({
    tone: "retry",
    text: t("Связки пока нет.", "Hozircha bogʻlash yoʻq."),
    sub: t(
      "За связанной фигурой на той же линии должен стоять король: тогда она не сможет сойти с места.",
      "Bogʻlanayotgan dona ortida, xuddi shu chiziqda shoh turishi kerak: shunda u joyidan qoʻzgala olmaydi.",
    ),
  }),
  skewer: (_m, t) => ({
    tone: "retry",
    text: t("Это не сквозной удар.", "Bu «rentgen» emas."),
    sub: t(
      "Объяви шах так, чтобы за королём на той же линии стояла ценная фигура.",
      "Shunday shoh ber: shoh ortida, xuddi shu chiziqda qimmatli dona tursin.",
    ),
  }),
  discover: (_m, t) => ({
    tone: "retry",
    text: t("Открытого шаха не получилось.", "Ochiq shoh chiqmadi."),
    sub: t(
      "Сдвинь фигуру так, чтобы за ней открылась линия ладьи или слона на короля.",
      "Donani shunday surki, uning ortida rux yoki fil shohga ochilsin.",
    ),
  }),
  take: (_m, t) => ({
    tone: "retry",
    text: t("Шахующую фигуру так не взять.", "Shoh bergan donani bunday urib boʻlmaydi."),
    sub: t(
      "Найди свою фигуру, которая может побить ту, что объявила шах.",
      "Oʻz donalaringdan qaysi biri shoh bergan donani ura olishini top.",
    ),
  }),
  block: (_m, t) => ({
    tone: "retry",
    text: t("Шах пока остался.", "Shoh hali ham bor."),
    sub: t(
      "Поставь свою фигуру между шахующей фигурой и королём.",
      "Oʻz donangni shoh bergan dona bilan shoh orasiga qoʻy.",
    ),
  }),
  run: (_m, t) => ({
    tone: "retry",
    text: t("Королю нужно уйти на безопасную клетку.", "Shoh xavfsiz katakka ketishi kerak."),
    sub: t(
      "Выбери клетку, которую не бьёт ни одна фигура соперника.",
      "Raqibning hech bir donasi urmaydigan katakni tanla.",
    ),
  }),
  enpassant: (_m, t) => ({
    tone: "retry",
    text: t("Это обычный ход.", "Bu oddiy yurish."),
    sub: t(
      "Взятие на проходе: пешка бьёт пешку, которая только что прошла мимо через клетку.",
      "Oʻtib ketayotganda olish: piyoda hozirgina yonidan oʻtib ketgan piyodani uradi.",
    ),
  }),
  check: (_m, t) => ({
    tone: "retry",
    text: t("Это не шах.", "Bu yurish shoh bermaydi."),
    sub: t(
      "Найди ход, после которого твоя фигура нападает на короля соперника.",
      "Shunday yurish top: undan keyin donang raqib shohiga hujum qilsin.",
    ),
  }),
  stalemate: (_m, t) => ({
    tone: "retry",
    text: t("Пока не пат: у соперника ещё есть ход.", "Hali pat emas: raqibning yurishi bor."),
    sub: t("Нужно, чтобы шаха не было, а ходить было нечем.", "Shoh boʻlmasin, lekin yuradigan narsa ham qolmasin."),
  }),
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
    setFeedback({
      ...GOAL_RETRY[ex.goal](played, t),
      voice: TACTIC_GOALS.has(ex.goal) ? "retry-chess-tactic" : undefined,
    });
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
  // Куда пришла фигура — сразу видно и без слов: зелёная клетка — верно, красная — не то (до отката хода).
  if (last) {
    marks[last[0]] = "last";
    marks[last[1]] = done ? "good" : "bad";
  }
  if (checkSq) marks[checkSq] = "check";
  if (selected) {
    marks[selected] = "selected";
    for (const sq of legalTargets(ex.fen, selected)) marks[sq] = pieceAt(ex.fen, sq) ? "capture" : "target";
  }

  return (
    <ExerciseShell
      ex={ex}
      solved={!!progress.solvedAt}
      feedback={feedback}
      actions={
        done && (
          <BarButton
            icon={RotateCcw}
            label={t("Ещё раз", "Yana")}
            name={t("Решить ещё раз", "Yana bir bor yechish")}
            onClick={() => {
              setFen(ex.fen);
              setLast(null);
              setCheckSq(null);
              setDone(false);
              setFeedback(null);
            }}
          />
        )
      }
    >
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
      // У вопроса без доски «посмотри на доску» некстати — звучит общая реплика.
      voice: q.fen ? undefined : "retry-generic",
    });
  };

  return (
    <ExerciseShell
      ex={ex}
      solved={!!progress.solvedAt}
      feedback={feedback}
      actions={
        done && (
          <BarButton
            icon={RotateCcw}
            label={t("Ещё раз", "Yana")}
            name={t("Пройти ещё раз", "Yana bir bor oʻtish")}
            onClick={() => {
              setIndex(0);
              setFeedback(null);
            }}
          />
        )
      }
    >
      {!done ? (
        <div className="space-y-3 rounded-3xl bg-surface p-4 shadow-card">
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
      ) : null}
    </ExerciseShell>
  );
}

// ---------------------------------------------------------------------------
// Как сыграть лучше?
// ---------------------------------------------------------------------------

/** Цвета стрелок вариантов: синий, оранжевый, фиолетовый — различимы и на светлых, и на тёмных клетках. */
const CHOICE_COLORS = ["#2563eb", "#ea580c", "#9333ea"];
const CHOICE_LETTERS = ["A", "B", "C"];

/**
 * Два-три хода показаны стрелками, ребёнок выбирает лучший кнопкой. Верный ход делается на доске,
 * неверный подсвечивается красным — можно выбрать ещё раз.
 */
function ChooseExercise({ ex }: { ex: Of<"choose"> }) {
  const t = useT();
  const lang = useLang();
  const san = useSan();
  const progress = useChessExercise(ex.id);
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const turn = ex.fen.split(" ")[1];
  const labels = ex.moves.map((u) => san(sanOf(ex.fen, u)));
  const best = ex.moves[ex.correct];
  const played = done ? playMove(ex.fen, best.slice(0, 2), best.slice(2, 4), (best[4] as PieceType) ?? "q") : null;

  const answer = (i: number) => {
    if (done) return;
    const n = attempts.current++;
    if (i === ex.correct) {
      setDone(true);
      setWrong(null);
      chessSolved(ex.id);
      setFeedback({ tone: "success", text: `${praise(n, lang)} ${labels[i]}`, sub: askExplain(n, lang) });
      return;
    }
    chessMiss(ex.id);
    setWrong(i);
    setFeedback({
      tone: "retry",
      text: t(`${labels[i]} — не лучший выбор.`, `${labels[i]} — eng yaxshi tanlov emas.`),
      sub: t(
        "Сравни ходы: что делает каждый? Вспомни правила урока.",
        "Yurishlarni solishtir: har biri nima qiladi? Dars qoidalarini esla.",
      ),
    });
  };

  const marks: Record<string, SquareMark> = {};
  if (played) {
    marks[best.slice(0, 2)] = "last";
    marks[best.slice(2, 4)] = "good";
  } else if (wrong !== null) marks[ex.moves[wrong].slice(2, 4)] = "bad";

  return (
    <ExerciseShell
      ex={ex}
      solved={!!progress.solvedAt}
      feedback={feedback}
      actions={
        done && (
          <BarButton
            icon={RotateCcw}
            label={t("Ещё раз", "Yana")}
            name={t("Решить ещё раз", "Yana bir bor yechish")}
            onClick={() => {
              setDone(false);
              setWrong(null);
              setFeedback(null);
            }}
          />
        )
      }
    >
      <p className="text-sm font-bold text-muted">
        {turn === "w" ? t("Ходят белые.", "Oqlar yuradi.") : t("Ходят чёрные.", "Qoralar yuradi.")}{" "}
        {t("Стрелки — ходы на выбор.", "Strelkalar — tanlash uchun yurishlar.")}
      </p>
      <ChessBoard
        id={`ch-${ex.id}`}
        position={played?.fen ?? ex.fen}
        marks={marks}
        arrows={
          played
            ? []
            : ex.moves.map((u, i) => ({ from: u.slice(0, 2), to: u.slice(2, 4), color: CHOICE_COLORS[i % 3] }))
        }
      />
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("Ходы на выбор", "Tanlash uchun yurishlar")}>
        {ex.moves.map((u, i) => (
          <Button
            key={u}
            variant={done && i === ex.correct ? "primary" : wrong === i ? "sun" : "secondary"}
            onClick={() => answer(i)}
            aria-pressed={done && i === ex.correct}
            disabled={done && i !== ex.correct}
            data-choice={u}
          >
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-full text-sm font-black text-white"
              style={{ backgroundColor: CHOICE_COLORS[i % 3] }}
            >
              {CHOICE_LETTERS[i]}
            </span>
            <span className="text-lg font-black">{labels[i]}</span>
          </Button>
        ))}
      </div>
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
    <ExerciseShell
      ex={ex}
      solved={!!progress.solvedAt}
      feedback={feedback}
      actions={
        <BarButton
          icon={Eraser}
          label={t("Убрать", "Tozalash")}
          name={t("Убрать всех", "Hammasini tozalash")}
          onClick={() => {
            setQueens([]);
            setFeedback(null);
          }}
          disabled={queens.length === 0}
        />
      }
    >
      <ChessBoard
        id={`qn-${ex.id}`}
        position={pieces}
        cols={ex.size}
        rows={ex.size}
        marks={marks}
        onSquare={tap}
        maxWidth={320}
      />
      {/* Счёт — одной строкой: на телефоне он стоит между доской и панелью и не должен сдвигать её за край экрана. */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 px-1">
        <span className="tabular text-lg leading-tight font-black">
          {t(`Ферзей: ${queens.length} из ${ex.size}`, `Farzinlar: ${queens.length} / ${ex.size}`)}
        </span>
        <span className="text-sm font-bold text-muted">
          {t(`Найдено решений: ${found.length} из ${total}`, `Topilgan yechimlar: ${found.length} / ${total}`)}
        </span>
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

/** Упражнение; в режиме `test` — без подсказок (контрольные тесты). */
export function ChessExerciseView({
  exercise,
  test = false,
  nav = null,
}: {
  exercise: ChessExercise;
  test?: boolean;
  /** Переход к соседним упражнениям: «Назад» и «Дальше» в панели под доской. */
  nav?: ExerciseNav | null;
}) {
  return (
    <TestModeContext.Provider value={test}>
      <NavContext.Provider value={nav}>
        <ExerciseByKind exercise={exercise} />
      </NavContext.Provider>
    </TestModeContext.Provider>
  );
}

function ExerciseByKind({ exercise }: { exercise: ChessExercise }) {
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
    case "choose":
      return <ChooseExercise ex={exercise} />;
  }
}
