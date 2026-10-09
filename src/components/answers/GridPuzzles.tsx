"use client";

import { useMemo, useRef, useState } from "react";
import { Button, cn } from "@/components/ui";
import { askExplain, praise, retrySub } from "@/lib/feedback";
import { useLang, useT } from "@/lib/i18n";
import { checkPartition, type PartitionGrid } from "@/lib/partition";
import { pluralize } from "@/lib/plural";
import { addFound, markSolved, recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { CheckButton } from "./CheckButton";
import { Feedback, type FeedbackState } from "./Feedback";

// ---------------------------------------------------------------------------
// Симметрия
// ---------------------------------------------------------------------------

export function SymmetryGrid({
  left,
  right,
  onToggle,
  cell = 40,
}: {
  left: string[];
  right?: Set<string>;
  onToggle?: (key: string) => void;
  cell?: number;
}) {
  const t = useT();
  const half = left[0].length;
  return (
    <div className="inline-block rounded-2xl bg-white p-2 shadow-card">
      <div className="relative grid" style={{ gridTemplateColumns: `repeat(${half * 2}, ${cell}px)` }}>
        {left.map((row, r) =>
          Array.from({ length: half * 2 }, (_, c) => {
            const isLeft = c < half;
            const filled = isLeft ? row[c] === "X" : (right?.has(`${r},${c - half}`) ?? false);
            const key = `${r},${c - half}`;
            const style = { width: cell, height: cell };
            const border = cn("border border-[#c7d2fe]", c === half - 1 && "border-r-0", c === half && "border-l-0");
            if (isLeft || !onToggle) {
              return (
                <span
                  key={`${r}-${c}`}
                  style={style}
                  className={cn(border, filled ? (isLeft ? "bg-brand" : "bg-sun") : "bg-white")}
                />
              );
            }
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                style={style}
                onClick={() => onToggle(key)}
                aria-label={t(
                  `Строка ${r + 1}, клетка ${c - half + 1} справа: ${filled ? "закрашена" : "пустая"}`,
                  `${r + 1}-qator, oʻngdagi ${c - half + 1}-katak: ${filled ? "boʻyalgan" : "boʻsh"}`,
                )}
                aria-pressed={filled}
                className={cn(border, filled ? "bg-sun" : "bg-white hover:bg-sun-soft")}
              />
            );
          }),
        )}
        <span
          className="pointer-events-none absolute top-0 bottom-0 w-0 border-l-[3px] border-dashed border-rose"
          style={{ left: half * cell - 1.5 }}
          aria-hidden
        />
      </div>
    </div>
  );
}

export function SymmetryPuzzle({ taskId, left, hintsLeft }: { taskId: string; left: string[]; hintsLeft: boolean }) {
  const t = useT();
  const lang = useLang();
  const progress = useTask(taskId);
  const [right, setRight] = useState<Set<string>>(() => new Set((progress.input?.right as string[]) ?? []));
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const half = left[0].length;

  const expected = useMemo(() => {
    const s = new Set<string>();
    left.forEach((row, r) => [...row].forEach((ch, c) => ch === "X" && s.add(`${r},${half - 1 - c}`)));
    return s;
  }, [left, half]);

  const toggle = (key: string) => {
    const next = new Set(right);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setRight(next);
    setFeedback(null);
    saveTaskInput(taskId, { right: [...next] });
  };

  const check = () => {
    const n = attempts.current++;
    let diff = 0;
    for (let r = 0; r < left.length; r++)
      for (let c = 0; c < half; c++) if (right.has(`${r},${c}`) !== expected.has(`${r},${c}`)) diff++;
    recordCheck(taskId, diff === 0);
    if (diff === 0)
      setFeedback({
        tone: "success",
        text: t(`${praise(n, lang)} Получилась симметричная картинка!`, `${praise(n, lang)} Rasm simmetrik chiqdi!`),
        sub: t("Как проверить, что отражение получилось правильным?", "Toʻgʻri aks ettirganingni qanday tekshirding?"),
      });
    else
      setFeedback({
        tone: "retry",
        text: t(
          `Почти! Отличаются ${pluralize(diff, "клетка", "клетки", "клеток")}.`,
          `Oz qoldi! ${diff} ta katak farq qilyapti.`,
        ),
        sub: t(
          `Проверь по строчкам: закрашенная клетка должна быть на таком же расстоянии от зеркала. ${n >= 2 && hintsLeft ? "Можно открыть подсказку 💡" : ""}`,
          `Har bir qatorni tekshirib chiq: boʻyalgan katak koʻzgudan xuddi shunday uzoqlikda turishi kerak. ${n >= 2 && hintsLeft ? "Maslahatni ochsang ham boʻladi 💡" : ""}`,
        ).trim(),
      });
  };

  return (
    <div className="space-y-4">
      <div className="max-w-full overflow-x-auto pb-1">
        <SymmetryGrid left={left} right={right} onToggle={toggle} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={check} size="lg" disabled={right.size === 0}>
          {t("Проверить", "Tekshirish")}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            setRight(new Set());
            saveTaskInput(taskId, { right: [] });
            setFeedback(null);
          }}
          disabled={right.size === 0}
        >
          {t("Очистить", "Tozalash")}
        </Button>
      </div>
      <Feedback state={feedback} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Разрезание квадрата
// ---------------------------------------------------------------------------

export function PartitionGridView({
  grid,
  onToggle,
  cell = 52,
}: {
  grid: PartitionGrid;
  onToggle?: (r: number, c: number) => void;
  cell?: number;
}) {
  const t = useT();
  const n = grid.length;
  const border = (r: number, c: number) => {
    const v = grid[r][c];
    const thick = "3px solid #1d2140";
    const thin = "1px solid #cbd5e1";
    return {
      borderTop: r === 0 || grid[r - 1][c] !== v ? thick : thin,
      borderBottom: r === n - 1 || grid[r + 1][c] !== v ? thick : thin,
      borderLeft: c === 0 || grid[r][c - 1] !== v ? thick : thin,
      borderRight: c === n - 1 || grid[r][c + 1] !== v ? thick : thin,
    };
  };
  return (
    <div className="grid w-fit" style={{ gridTemplateColumns: `repeat(${n}, ${cell}px)` }}>
      {grid.map((row, r) =>
        row.map((v, c) => {
          const style = { width: cell, height: cell, ...border(r, c) };
          const color = v === 0 ? "bg-[#c7d2fe]" : "bg-[#fde68a]";
          return onToggle ? (
            <button
              key={`${r}-${c}`}
              type="button"
              style={style}
              className={cn(color, "transition hover:brightness-95")}
              onClick={() => onToggle(r, c)}
              aria-label={t(
                `Клетка ${r + 1}-${c + 1}: часть ${v === 0 ? "синяя" : "жёлтая"}`,
                `${r + 1}-${c + 1} katak: ${v === 0 ? "koʻk" : "sariq"} qism`,
              )}
            />
          ) : (
            <span key={`${r}-${c}`} style={style} className={color} />
          );
        }),
      )}
    </div>
  );
}

const keyToGrid = (key: string, n: number): PartitionGrid =>
  Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => (key[r * n + c] === "1" ? 0 : 1)));

export function PartitionPuzzle({
  taskId,
  size,
  distinct,
  hintsLeft,
}: {
  taskId: string;
  size: number;
  distinct: number;
  hintsLeft: boolean;
}) {
  const t = useT();
  const lang = useLang();
  const progress = useTask(taskId);
  const empty = () => Array.from({ length: size }, () => Array.from({ length: size }, () => 1));
  const [grid, setGrid] = useState<PartitionGrid>(() => (progress.input?.grid as PartitionGrid) ?? empty());
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);
  const found = progress.found ?? [];

  const toggle = (r: number, c: number) => {
    const next = grid.map((row) => [...row]);
    next[r][c] = next[r][c] === 0 ? 1 : 0;
    setGrid(next);
    setFeedback(null);
    saveTaskInput(taskId, { grid: next });
  };

  const check = () => {
    const n = attempts.current++;
    const res = checkPartition(grid);
    if (!res.ok) {
      recordCheck(taskId, false);
      const msg = {
        sizes: t(
          `В частях должно быть поровну клеток: по ${(size * size) / 2}.`,
          `Ikkala qismda kataklar teng boʻlishi kerak: ${(size * size) / 2} tadan.`,
        ),
        connected: t(
          "Каждая часть должна быть одним целым куском.",
          "Har bir qism bitta yaxlit boʻlak boʻlishi kerak.",
        ),
        shape: t(
          "Части пока разные по форме. Представь, что одну часть повернули — совпадает с другой?",
          "Qismlarning shakli hozircha har xil. Tasavvur qil: bir qismni aylantirsak, ikkinchisiga mos keladimi?",
        ),
      }[res.reason];
      setFeedback({
        tone: "retry",
        text: msg,
        sub: n >= 2 && hintsLeft ? t("Можно открыть подсказку 💡", "Maslahatni ochsang ham boʻladi 💡") : undefined,
      });
      return;
    }
    if (found.includes(res.key)) {
      setFeedback({
        tone: "info",
        text: t(
          "Этот способ у тебя уже есть (может быть, повёрнутый или отражённый).",
          "Bu usulni allaqachon topgansan (balki aylantirilgan yoki aks ettirilgan holda).",
        ),
        sub: t("Попробуй сделать разрез по-новому!", "Boshqacha qilib kesib koʻr!"),
      });
      return;
    }
    addFound(taskId, res.key);
    const total = found.length + 1;
    if (total >= 2) markSolved(taskId);
    setFeedback(
      total >= distinct
        ? {
            tone: "success",
            text: t(`Все способы найдены: ${distinct}! 🏆`, `${distinct} ta usulning hammasini topding! 🏆`),
            sub: t("Что общего у всех разрезов?", "Bu kesishlarning hammasida qanday oʻxshashlik bor?"),
          }
        : {
            tone: "success",
            text: t(
              `${praise(n, lang)} Новый способ! Найдено: ${total}.`,
              `${praise(n, lang)} Yangi usul! Jami topilgani: ${total} ta.`,
            ),
            sub:
              total === 1
                ? t(
                    "А теперь найди другой — например, со «ступенькой».",
                    "Endi boshqasini top — masalan, «zinapoya» shaklidagisini.",
                  )
                : t("Есть ли ещё?", "Yana bormikan?"),
          },
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted">
        {t(
          "Нажимай на клетки, чтобы раскрасить одну часть в синий цвет. Вторая часть — жёлтая.",
          "Bir qismni koʻk rangga boʻyash uchun kataklarni bos. Ikkinchi qism — sariq.",
        )}
      </p>
      <PartitionGridView grid={grid} onToggle={toggle} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={check} size="lg">
          {t("Проверить разрез", "Kesishni tekshirish")}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            const g = empty();
            setGrid(g);
            saveTaskInput(taskId, { grid: g });
            setFeedback(null);
          }}
        >
          {t("Очистить", "Tozalash")}
        </Button>
      </div>
      <Feedback state={feedback} />
      {found.length > 0 && (
        <div className="rounded-2xl bg-white p-3 shadow-card">
          <p className="mb-2 text-sm font-extrabold text-muted">
            {t(`Найденные способы: ${found.length}`, `Topilgan usullar: ${found.length}`)}
          </p>
          <div className="flex flex-wrap gap-3">
            {found.map((k) => (
              <PartitionGridView key={k} grid={keyToGrid(k, size)} cell={14} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Волшебный квадрат
// ---------------------------------------------------------------------------

export function MagicSquarePuzzle({
  taskId,
  grid,
  answer,
  hintsLeft,
}: {
  taskId: string;
  grid: (number | null)[][];
  answer: number[][];
  hintsLeft: boolean;
}) {
  const t = useT();
  const lang = useLang();
  const progress = useTask(taskId);
  const [values, setValues] = useState<Record<string, string>>(
    () => (progress.input?.square as Record<string, string>) ?? {},
  );
  const [showSums, setShowSums] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const attempts = useRef(0);

  const cellValue = (r: number, c: number) => grid[r][c] ?? (values[`${r}-${c}`] ? Number(values[`${r}-${c}`]) : null);
  const n = grid.length;
  const lineSum = (cells: [number, number][]) => {
    const vals = cells.map(([r, c]) => cellValue(r, c));
    return vals.every((v) => v !== null) ? vals.reduce<number>((s, v) => s + (v as number), 0) : null;
  };
  const rows = Array.from({ length: n }, (_, r) =>
    lineSum(Array.from({ length: n }, (_, c) => [r, c] as [number, number])),
  );
  const cols = Array.from({ length: n }, (_, c) =>
    lineSum(Array.from({ length: n }, (_, r) => [r, c] as [number, number])),
  );
  const blanks = grid.flatMap((row, r) => row.flatMap((v, c) => (v === null ? [`${r}-${c}`] : [])));
  const filled = blanks.every((k) => values[k]);

  const check = () => {
    const i = attempts.current++;
    const ok = grid.every((row, r) => row.every((_, c) => cellValue(r, c) === answer[r][c]));
    setShowSums(true);
    recordCheck(taskId, ok);
    setFeedback(
      ok
        ? { tone: "success", text: praise(i, lang), sub: askExplain(i, lang) }
        : {
            tone: "retry",
            text: t(
              "Посмотри на суммы по краям: где они не одинаковые?",
              "Chetlardagi yigʻindilarga qara: qayerda ular bir xil emas?",
            ),
            sub: retrySub(i, hintsLeft, lang),
          },
    );
  };

  const cellSize = "h-16 w-16 sm:h-18 sm:w-18";
  return (
    <div className="space-y-4">
      <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `repeat(${n + 1}, auto)` }}>
        {grid.map((row, r) => (
          <div key={r} className="contents">
            {row.map((v, c) => (
              <div
                key={c}
                className={cn(
                  cellSize,
                  "tabular flex items-center justify-center rounded-2xl border-2 border-[#c4b5fd] bg-white text-3xl font-black",
                )}
              >
                {v !== null ? (
                  <span className="text-[#6d28d9]">{v}</span>
                ) : (
                  <input
                    inputMode="numeric"
                    aria-label={t(`Клетка: строка ${r + 1}, столбец ${c + 1}`, `Katak: ${r + 1}-qator, ${c + 1}-ustun`)}
                    value={values[`${r}-${c}`] ?? ""}
                    onChange={(e) => {
                      const next = { ...values, [`${r}-${c}`]: e.target.value.replace(/\D/g, "").slice(0, 2) };
                      setValues(next);
                      setShowSums(false);
                      setFeedback(null);
                      saveTaskInput(taskId, { square: next });
                    }}
                    className="h-full w-full rounded-2xl bg-brand-soft/60 text-center text-3xl font-black text-ink outline-none focus:bg-sun-soft"
                    placeholder="?"
                  />
                )}
              </div>
            ))}
            <span className="flex w-10 items-center justify-center text-sm font-extrabold text-muted">
              {showSums && rows[r] !== null ? `=${rows[r]}` : ""}
            </span>
          </div>
        ))}
        {cols.map((s, c) => (
          <span key={c} className="flex h-6 items-center justify-center text-sm font-extrabold text-muted">
            {showSums && s !== null ? `=${s}` : ""}
          </span>
        ))}
      </div>
      <CheckButton ready={filled} onCheck={check} onNotReady={setFeedback} />
      <Feedback state={feedback} />
    </div>
  );
}
