"use client";

import { useRef, useState } from "react";
import { Button, cn } from "@/components/ui";
import { askExplain, praise } from "@/lib/feedback";
import { canMove, hanoiSolved, hanoiStart, moveDisk, topDisk, type HanoiState } from "@/lib/hanoi";
import { countText, useLang, useT, type Lang } from "@/lib/i18n";
import { plural } from "@/lib/plural";
import { addFound, recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { Feedback, type FeedbackState } from "./Feedback";

const DISK_COLORS = ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f472b6"];
const PEG_NAMES = { ru: ["левый", "средний", "правый"], uz: ["Chap", "Oʻrta", "Oʻng"] };
const SIZES = [1, 2, 3, 4];

const disksWord = (n: number, lang: Lang) => countText(lang, n, ["кольцо", "кольца", "колец"], "ta halqa");
const movesWord = (n: number, lang: Lang) => countText(lang, n, ["ход", "хода", "ходов"], "ta yurish");

/** Три стержня с кольцами. Если передан onPeg — по стержням можно нажимать. */
export function HanoiBoard({
  state,
  disks,
  selected = null,
  onPeg,
  compact = false,
}: {
  state: HanoiState;
  disks: number;
  selected?: number | null;
  onPeg?: (peg: number) => void;
  compact?: boolean;
}) {
  const t = useT();
  const lang = useLang();
  const diskH = compact ? 14 : 22;
  const height = (disks + 1.2) * (diskH + 3) + 14;
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {state.map((peg, p) => {
        const inner = (
          <>
            <span
              className="absolute bottom-2 left-1/2 w-2.5 -translate-x-1/2 rounded-t-full bg-[#a16207]"
              style={{ height: height - 16 }}
              aria-hidden
            />
            <span className="absolute inset-x-1 bottom-0 h-2.5 rounded-full bg-[#78350f]" aria-hidden />
            <span className="absolute inset-x-0 bottom-2.5 flex flex-col-reverse items-center gap-[3px]" aria-hidden>
              {peg.map((size, i) => (
                <span
                  key={size}
                  className={cn(
                    "block rounded-full border-2 border-[#1d2140]/70 transition-transform",
                    selected === p && i === peg.length - 1 && "-translate-y-3",
                  )}
                  style={{
                    height: diskH,
                    width: `${28 + (size / Math.max(disks, 1)) * 64}%`,
                    background: DISK_COLORS[(size - 1) % DISK_COLORS.length],
                  }}
                />
              ))}
            </span>
          </>
        );
        const label = t(
          `${PEG_NAMES.ru[p]} стержень: ${peg.length === 0 ? "пусто" : disksWord(peg.length, lang)}`,
          `${PEG_NAMES.uz[p]} sterjen: ${peg.length === 0 ? "boʻsh" : disksWord(peg.length, lang)}`,
        );
        return onPeg ? (
          <button
            key={p}
            type="button"
            onClick={() => onPeg(p)}
            aria-label={label}
            aria-pressed={selected === p}
            className={cn(
              "relative rounded-2xl border-2 transition",
              selected === p ? "border-sun bg-sun-soft" : "border-transparent bg-paper hover:border-brand/30",
            )}
            style={{ height }}
          >
            {inner}
          </button>
        ) : (
          <div key={p} className="relative rounded-2xl bg-paper" style={{ height }} role="img" aria-label={label}>
            {inner}
          </div>
        );
      })}
      {!compact &&
        PEG_NAMES.ru.map((name, p) => (
          <span key={name} className="text-center text-xs font-extrabold text-muted">
            {p === 2 ? t("🏁 сюда", "🏁 bu yerga") : p === 0 ? t("начало", "boshlanish") : ""}
          </span>
        ))}
    </div>
  );
}

function bestMoves(found: string[] | undefined): Map<number, number> {
  const best = new Map<number, number>();
  for (const f of found ?? []) {
    const m = f.match(/^(\d+):(\d+)$/);
    if (!m) continue;
    const [size, moves] = [Number(m[1]), Number(m[2])];
    best.set(size, Math.min(best.get(size) ?? Infinity, moves));
  }
  return best;
}

export function HanoiPuzzle({ taskId, disks, optimal }: { taskId: string; disks: number; optimal: number }) {
  const t = useT();
  const lang = useLang();
  const progress = useTask(taskId);
  const [size, setSize] = useState(() => {
    const saved = Number(progress.input?.size);
    return SIZES.includes(saved) ? saved : disks;
  });
  const [state, setState] = useState<HanoiState>(() => hanoiStart(size));
  const [moves, setMoves] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const records = bestMoves(progress.found);
  const done = hanoiSolved(state, size);

  const restart = (n: number) => {
    setSize(n);
    setState(hanoiStart(n));
    setMoves(0);
    setSelected(null);
    setFeedback(null);
    saveTaskInput(taskId, { size: n });
  };

  const onPeg = (p: number) => {
    if (done) return;
    if (selected === null) {
      if (state[p].length === 0) {
        setFeedback({
          tone: "info",
          text: t("На этом стержне нет колец.", "Bu sterjenda halqa yoʻq."),
          sub: t("Выбери стержень, с которого возьмёшь кольцо.", "Halqa oladigan sterjenni tanla."),
        });
        return;
      }
      setSelected(p);
      setFeedback(null);
      return;
    }
    if (selected === p) {
      setSelected(null);
      return;
    }
    if (!canMove(state, selected, p)) {
      setFeedback({
        tone: "retry",
        text: t("Большое кольцо нельзя класть на маленькое!", "Katta halqani kichigining ustiga qoʻyib boʻlmaydi!"),
        sub: t(
          `Кольцо ${topDisk(state[selected])} больше, чем кольцо ${topDisk(state[p])}. Выбери другой стержень.`,
          `${topDisk(state[selected])}-halqa ${topDisk(state[p])}-halqadan katta. Boshqa sterjenni tanla.`,
        ),
      });
      setSelected(null);
      return;
    }
    const next = moveDisk(state, selected, p);
    const count = moves + 1;
    if (count === 1) saveTaskInput(taskId, { size });
    setState(next);
    setMoves(count);
    setSelected(null);
    if (!hanoiSolved(next, size)) {
      setFeedback(null);
      return;
    }
    addFound(taskId, `${size}:${count}`);
    const n = attempts.current++;
    if (size === disks) {
      recordCheck(taskId, true);
      setFeedback(
        count <= optimal
          ? {
              tone: "success",
              text: t(
                `${praise(n, lang)} Башня перенесена за ${movesWord(count, lang)}!`,
                `${praise(n, lang)} Minorani ${movesWord(count, lang)}da koʻchirding!`,
              ),
              sub: t(`Быстрее не бывает. ${askExplain(n, lang)}`, `Bundan tezroq boʻlmaydi. ${askExplain(n, lang)}`),
            }
          : {
              tone: "success",
              text: t(`Башня на месте! Ходов: ${count}.`, `Minora joyida! ${movesWord(count, lang)} qilding.`),
              sub: t(
                "А можно быстрее? Нажми «Сначала» и попробуй сократить путь.",
                "Tezroq boʻlmaydimi? «Qaytadan boshlash» tugmasini bos va yurishlarni qisqartirib koʻr.",
              ),
            },
      );
    } else {
      setFeedback({
        tone: "success",
        text: t(
          `Башня из ${disksWord(size, lang)} перенесена за ${movesWord(count, lang)}!`,
          `${size} ta halqali minorani ${movesWord(count, lang)}da koʻchirding!`,
        ),
        sub:
          size < disks
            ? t(
                "Запомни, как это получилось, — и возьми башню побольше.",
                "Buni qanday qilganingni eslab qol — endi kattaroq minorani ol.",
              )
            : t(
                "Сравни с башней поменьше: какая закономерность у ходов?",
                "Kichikroq minora bilan solishtir: yurishlar sonida qanday qonuniyat bor?",
              ),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-extrabold text-muted">{t("Башня из", "Minorada")}</span>
        {SIZES.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => restart(n)}
            aria-pressed={size === n}
            className={cn(
              "h-10 min-w-10 rounded-xl border-2 px-2 text-lg font-black transition",
              size === n ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand/40",
            )}
          >
            {n}
          </button>
        ))}
        <span className="text-sm font-extrabold text-muted">
          {t(plural(size, "кольца", "колец", "колец"), "ta halqa")}
        </span>
        {size !== disks && (
          <span className="rounded-full bg-sun-soft px-2.5 py-0.5 text-xs font-extrabold text-[#7a4b00]">
            {t("тренировка", "mashq")}
          </span>
        )}
      </div>

      <div className="rounded-3xl bg-white p-3 shadow-card">
        <HanoiBoard state={state} disks={size} selected={selected} onPeg={onPeg} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="tabular rounded-2xl bg-white px-4 py-2 text-lg font-black shadow-card">
          {t(`Ходов: ${moves}`, `Yurishlar: ${moves}`)}
        </span>
        <Button variant="secondary" onClick={() => restart(size)} disabled={moves === 0}>
          ↺ {t("Сначала", "Qaytadan boshlash")}
        </Button>
        <span className="text-sm font-bold text-muted">
          {selected === null
            ? t("Нажми на стержень, чтобы взять верхнее кольцо.", "Yuqoridagi halqani olish uchun sterjenni bos.")
            : t("Теперь нажми, куда его положить.", "Endi uni qoʻyadigan sterjenni bos.")}
        </span>
      </div>

      <Feedback state={feedback} />

      <div className="rounded-2xl bg-white p-3 shadow-card">
        <p className="mb-2 text-sm font-extrabold text-muted">
          {t("Мои рекорды: сколько ходов понадобилось", "Rekordlarim: necha yurish kerak boʻldi")}
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {SIZES.map((n) => (
            <div
              key={n}
              className={cn(
                "rounded-xl px-3 py-2 text-center",
                records.has(n) ? "bg-mint-soft text-[#065f46]" : "border-2 border-dashed border-line text-muted",
              )}
            >
              <div className="text-xs font-bold">{disksWord(n, lang)}</div>
              <div className="tabular text-xl font-black">{records.has(n) ? records.get(n) : "?"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
