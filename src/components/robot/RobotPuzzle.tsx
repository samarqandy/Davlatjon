"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Feedback, type FeedbackState } from "@/components/answers/Feedback";
import { Button, cn } from "@/components/ui";
import type { Cell, Dir, RobotPuzzle as RobotPuzzleSpec } from "@/content/types";
import { askExplain, praise, retrySub } from "@/lib/feedback";
import { useLang, useT } from "@/lib/i18n";
import { plural, pluralize } from "@/lib/plural";
import { ARROW, compress, dirName, isFree, parseMap, sameCell, step as stepCell, type RobotMap } from "@/lib/robot";
import { addFound, markSolved, recordCheck, saveTaskInput, useTask } from "@/lib/store";
import { RobotBoard } from "./RobotBoard";

const STEP_MS = 380;

interface ExecState {
  pc: number;
  pos: Cell;
  trail: Cell[];
  collected: number[];
  crash: Cell | null;
  done: boolean;
}

function initialExec(map: RobotMap): ExecState {
  const collected = map.stars.flatMap((s, i) => (sameCell(s, map.start) ? [i] : []));
  return { pc: 0, pos: map.start, trail: [map.start], collected, crash: null, done: false };
}

/** Выполнить одну команду. */
function advance(map: RobotMap, ex: ExecState, program: Dir[]): ExecState {
  if (ex.done || ex.pc >= program.length) return { ...ex, done: true };
  const next = stepCell(ex.pos, program[ex.pc]);
  if (!isFree(map, next)) return { ...ex, crash: next, done: true };
  const collected = [...ex.collected];
  map.stars.forEach((s, i) => {
    if (sameCell(s, next) && !collected.includes(i)) collected.push(i);
  });
  const pc = ex.pc + 1;
  return { pc, pos: next, trail: [...ex.trail, next], collected, crash: null, done: pc >= program.length };
}

export function RobotPuzzle({
  taskId,
  puzzle,
  hintsLeft,
}: {
  taskId: string;
  puzzle: RobotPuzzleSpec;
  hintsLeft: boolean;
}) {
  const map = useMemo(() => parseMap(puzzle.map), [puzzle.map]);
  const t = useT();
  const lang = useLang();
  const progress = useTask(taskId);
  const saved = progress.input?.program as Dir[] | undefined;
  const editable = puzzle.mode !== "trace";

  const [program, setProgram] = useState<Dir[]>(() => saved ?? puzzle.program ?? []);
  const [selected, setSelected] = useState<number | null>(null);
  const [exec, setExec] = useState<ExecState>(() => initialExec(map));
  const [running, setRunning] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [traceChoice, setTraceChoice] = useState<string | null>((progress.input?.traceChoice as string) ?? null);
  const [traceAnswered, setTraceAnswered] = useState<boolean>(Boolean(progress.input?.traceChoice));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attempts = useRef(0);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setRunning(false);
  }, []);

  const resetExec = useCallback(() => {
    stop();
    setExec(initialExec(map));
  }, [map, stop]);

  const updateProgram = (next: Dir[]) => {
    setProgram(next);
    resetExec();
    setFeedback(null);
    if (editable) saveTaskInput(taskId, { program: next });
  };

  const press = (d: Dir) => {
    if (!editable || running) return;
    if (selected !== null && selected < program.length) {
      const next = [...program];
      next[selected] = d;
      updateProgram(next);
      setSelected(null);
    } else if (puzzle.mode !== "debug") {
      if (program.length >= 30) return;
      updateProgram([...program, d]);
    }
  };

  const backspace = () => {
    if (!editable || running || puzzle.mode === "debug" || program.length === 0) return;
    updateProgram(program.slice(0, -1));
    setSelected(null);
  };

  const clear = () => {
    if (!editable || running) return;
    updateProgram(puzzle.mode === "debug" ? [...(puzzle.program ?? [])] : []);
    setSelected(null);
  };

  const changes = useMemo(
    () => (puzzle.mode === "debug" && puzzle.program ? program.filter((d, i) => d !== puzzle.program![i]).length : 0),
    [program, puzzle.mode, puzzle.program],
  );

  /** Итог после выполнения всей программы. */
  const evaluate = (ex: ExecState) => {
    const n = attempts.current++;
    const len = program.length;
    const crashed = ex.crash !== null;
    const reached = !crashed && ex.pc >= len && map.goal !== null && sameCell(ex.pos, map.goal);
    const allStars = ex.collected.length === map.stars.length;

    if (crashed) {
      const outside = ex.crash![0] < 0 || ex.crash![1] < 0 || ex.crash![0] >= map.cols || ex.crash![1] >= map.rows;
      recordCheck(taskId, false);
      setFeedback({
        tone: "retry",
        text: t(
          `Ой! На шаге ${ex.pc + 1} робот ${outside ? "вышел бы за край поля" : "упёрся в стену"}.`,
          `Voy! ${ex.pc + 1}-qadamda robot ${outside ? "maydondan chiqib ketardi" : "devorga urilib qoldi"}.`,
        ),
        sub: t(
          "Давай проверим эту команду. Можно нажимать «Шаг», чтобы выполнять программу по одной команде.",
          "Qani, shu buyruqni tekshirib koʻramiz. «Qadam» tugmasini bossang, dastur buyruqlarni bittalab bajaradi.",
        ),
      });
      return;
    }

    if (puzzle.mode === "trace") return;

    if (!reached) {
      recordCheck(taskId, false);
      setFeedback({
        tone: "retry",
        text: t("Робот остановился, но не у флажка.", "Robot toʻxtadi, lekin bayroqcha yonida emas."),
        sub: retrySub(n, hintsLeft, lang),
      });
      return;
    }

    if (puzzle.mode === "collect" && !allStars) {
      recordCheck(taskId, false);
      setFeedback({
        tone: "retry",
        text: t(
          `Робот у флажка, но собрал не все звёзды: ${ex.collected.length} из ${map.stars.length}.`,
          `Robot bayroqchaga yetib keldi, lekin hamma yulduzchani yigʻmadi: ${map.stars.length} tadan ${ex.collected.length} tasi.`,
        ),
        sub: t(
          "Какую звезду он пропустил? Как изменить маршрут?",
          "Qaysi yulduzchani tashlab ketdi? Yoʻlni qanday oʻzgartirsa boʻladi?",
        ),
      });
      return;
    }

    if (puzzle.mode === "debug") {
      if (changes <= 1) {
        recordCheck(taskId, true);
        setFeedback({
          tone: "success",
          text: `${praise(n, lang)} ${t("Робот у флажка!", "Robot bayroqchaga yetib keldi!")}`,
          sub: `${t("Ошибка найдена и исправлена.", "Xato topildi va tuzatildi.")} ${askExplain(n, lang)}`,
        });
      } else {
        recordCheck(taskId, false);
        setFeedback({
          tone: "info",
          text: t(
            `Робот у флажка! Но изменено команд: ${changes}.`,
            `Robot bayroqchaga yetib keldi! Lekin ${changes} ta buyruq oʻzgardi.`,
          ),
          sub: t(
            "А можно исправить всего одну команду? Нажми «Как было» и найди первую ошибку.",
            "Faqat bitta buyruqni tuzatib koʻra olasanmi? «Asl holiga» tugmasini bos va birinchi xatoni top.",
          ),
        });
      }
      return;
    }

    if (puzzle.mode === "paths") {
      if (len !== puzzle.optimal) {
        setFeedback({
          tone: "retry",
          text: t(`Робот дошёл за ${pluralize(len, "шаг", "шага", "шагов")}.`, `Robot ${len} qadamda yetib bordi.`),
          sub: t(
            `Нужен короткий путь — ровно ${pluralize(puzzle.optimal ?? 0, "шаг", "шага", "шагов")}.`,
            `Eng qisqa yoʻl kerak — roppa-rosa ${puzzle.optimal ?? 0} qadam.`,
          ),
        });
        return;
      }
      const key = program.join("");
      const found = progress.found ?? [];
      if (found.includes(key)) {
        setFeedback({
          tone: "info",
          text: t("Такой путь уже есть в списке.", "Bu yoʻl roʻyxatda allaqachon bor."),
          sub: t(
            "Найди другой! Попробуй поменять порядок стрелок.",
            "Boshqasini top! Strelkalar tartibini almashtirib koʻr.",
          ),
        });
        return;
      }
      addFound(taskId, key);
      const total = found.length + 1;
      if (total >= (puzzle.pathsCount ?? Infinity)) {
        markSolved(taskId);
        setFeedback({
          tone: "success",
          text: t(`Ты нашёл все пути: ${total}! 🏆`, `Hamma yoʻllarni topding: ${total} ta! 🏆`),
          sub: t("Как доказать, что других нет?", "Boshqa yoʻl yoʻqligini qanday isbotlaysan?"),
        });
      } else {
        setFeedback({
          tone: "success",
          text: t(`Новый путь! Найдено путей: ${total}.`, `Yangi yoʻl! Topilgan yoʻllar: ${total} ta.`),
          sub: t("Есть ли ещё? Ищи по порядку.", "Yana bormi? Tartib bilan izla."),
        });
      }
      return;
    }

    // build / collect
    recordCheck(taskId, true);
    addFound(taskId, `len:${len}`);
    const best = puzzle.optimal;
    const collect = puzzle.mode === "collect";
    const atFlag = {
      ru: `Робот у ${collect ? "флажка со всеми звёздами" : "флажка"}!`,
      uz: `Robot ${collect ? "hamma yulduzchani yigʻib, bayroqchaga" : "bayroqchaga"} yetib keldi!`,
    };
    if (best !== undefined && len <= best) {
      setFeedback({
        tone: "success",
        text: `${praise(n, lang)} ${t(atFlag.ru, atFlag.uz)}`,
        sub: `${t(
          `Программа из ${pluralize(len, "команды", "команд", "команд")} — короче не бывает.`,
          `${len} ta buyruqdan iborat dastur — bundan qisqasi boʻlmaydi.`,
        )} ${askExplain(n, lang)}`,
      });
    } else {
      setFeedback({
        tone: "success",
        text: t(
          `${atFlag.ru} Программа из ${pluralize(len, "команды", "команд", "команд")}.`,
          `${atFlag.uz} Dastur ${len} ta buyruqdan iborat.`,
        ),
        sub: t(
          "А можно короче? Попробуй найти программу покороче.",
          "Bundan qisqaroq qilsa boʻladimi? Qisqaroq dastur topib koʻr.",
        ),
      });
    }
  };

  const run = () => {
    if (running || program.length === 0) return;
    setFeedback(null);
    setSelected(null);
    let ex = initialExec(map);
    setExec(ex);
    setRunning(true);
    const tick = () => {
      ex = advance(map, ex, program);
      setExec(ex);
      if (ex.done) {
        setRunning(false);
        timer.current = null;
        evaluate(ex);
        return;
      }
      timer.current = setTimeout(tick, STEP_MS);
    };
    timer.current = setTimeout(tick, STEP_MS);
  };

  const stepOnce = () => {
    if (running || program.length === 0) return;
    setFeedback(null);
    const base = exec.done ? initialExec(map) : exec;
    const ex = advance(map, base, program);
    setExec(ex);
    if (ex.done) evaluate(ex);
  };

  const onKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    const keys: Record<string, Dir> = { ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R" };
    if (keys[e.key]) {
      e.preventDefault();
      press(keys[e.key]);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      backspace();
    }
  };

  const checkTrace = () => {
    if (!traceChoice) return;
    const correct = traceChoice === puzzle.traceAnswer;
    recordCheck(taskId, correct);
    saveTaskInput(taskId, { traceChoice });
    setTraceAnswered(true);
    const n = attempts.current++;
    setFeedback(
      correct
        ? {
            tone: "success",
            text: praise(n, lang),
            sub: t("А теперь запусти робота и проверь себя!", "Endi robotni ishga tushir va oʻzingni tekshirib koʻr!"),
          }
        : {
            tone: "retry",
            text: t("Давай проверим твою идею!", "Qani, fikringni tekshirib koʻramiz!"),
            sub: t(
              "Запусти робота и посмотри, где он остановится. Где разошлись твой путь и путь робота?",
              "Robotni ishga tushir va qayerda toʻxtashini kuzat. Sening yoʻling bilan robotning yoʻli qayerda ajralib ketdi?",
            ),
          },
    );
  };

  const found = progress.found ?? [];
  const shortForm = compress(program);

  return (
    <div className="space-y-4" onKeyDown={onKey}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:items-start">
        <div className={cn("rounded-3xl bg-white p-2 shadow-card", exec.crash && "animate-shake")}>
          <RobotBoard
            map={map}
            legend={puzzle.legend}
            robot={exec.pos}
            trail={exec.trail}
            collected={exec.collected}
            crash={exec.crash}
          />
        </div>

        <div className="space-y-3">
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-sm font-extrabold text-muted">
                {t("Программа", "Dastur")}
                {program.length > 0 &&
                  t(
                    ` · ${program.length} ${plural(program.length, "команда", "команды", "команд")}`,
                    ` · ${program.length} ta buyruq`,
                  )}
              </span>
              {puzzle.mode === "debug" && (
                <span className="text-xs font-bold text-muted">
                  {t("Нажми на команду, чтобы заменить её", "Almashtirish uchun buyruqni bos")}
                </span>
              )}
            </div>
            <div
              className="flex min-h-14 flex-wrap items-center gap-1.5 rounded-2xl border-2 border-dashed border-brand/30 bg-white p-2"
              aria-label={t("Программа робота", "Robot dasturi")}
            >
              {program.length === 0 && (
                <span className="px-2 text-sm text-muted">
                  {t(
                    "Нажимай стрелки ниже — команды появятся здесь",
                    "Pastdagi strelkalarni bos — buyruqlar shu yerda paydo boʻladi",
                  )}
                </span>
              )}
              {program.map((d, i) => {
                const active = running || exec.pc > 0 ? i === exec.pc - 1 : false;
                const changed = puzzle.mode === "debug" && puzzle.program && d !== puzzle.program[i];
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!editable || running}
                    onClick={() => setSelected(selected === i ? null : i)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border-2 text-xl font-black transition",
                      selected === i
                        ? "border-sun bg-sun-soft"
                        : changed
                          ? "border-mint bg-mint-soft"
                          : "border-line bg-brand-soft",
                      active && "ring-4 ring-brand/40",
                      exec.crash && i === exec.pc && "border-rose bg-rose/10",
                    )}
                    aria-label={t(`Команда ${i + 1}: ${dirName(d)}`, `${i + 1}-buyruq: ${dirName(d, "uz")}`)}
                  >
                    {ARROW[d]}
                  </button>
                );
              })}
            </div>
            {program.length > 1 && (
              <p className="mt-1.5 text-sm text-muted">
                {t("Короткая запись:", "Qisqa yozuv:")} <span className="font-extrabold text-ink">{shortForm}</span>
              </p>
            )}
          </div>

          {editable && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="grid grid-cols-3 gap-1.5" role="group" aria-label={t("Стрелки", "Strelkalar")}>
                <span />
                <ArrowButton dir="U" onPress={press} disabled={running} />
                <span />
                <ArrowButton dir="L" onPress={press} disabled={running} />
                <ArrowButton dir="D" onPress={press} disabled={running} />
                <ArrowButton dir="R" onPress={press} disabled={running} />
              </div>
              <div className="flex flex-col gap-1.5">
                {puzzle.mode !== "debug" ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={backspace}
                      disabled={running || program.length === 0}
                    >
                      ⌫ {t("Стереть", "Oʻchirish")}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clear} disabled={running || program.length === 0}>
                      {t("Очистить", "Tozalash")}
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" size="sm" onClick={clear} disabled={running || changes === 0}>
                    ↺ {t("Как было", "Asl holiga")}
                  </Button>
                )}
              </div>
            </div>
          )}

          {puzzle.mode === "trace" && (
            <div className="space-y-2 rounded-2xl bg-white p-3 shadow-card">
              <p className="font-bold">{t("Какой предмет найдёт робот?", "Robot qaysi narsani topadi?")}</p>
              <div className="flex flex-wrap gap-2">
                {map.items.map((it) => {
                  const lg = puzzle.legend?.[it.key];
                  return (
                    <button
                      key={it.key}
                      type="button"
                      onClick={() => setTraceChoice(it.key)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-2xl border-2 px-3 py-2 font-bold transition",
                        traceChoice === it.key
                          ? "border-brand bg-brand-soft"
                          : "border-line bg-white hover:border-brand/40",
                      )}
                    >
                      <span className="text-2xl">{lg?.emoji}</span>
                      {lg?.name}
                    </button>
                  );
                })}
              </div>
              <Button onClick={checkTrace} disabled={!traceChoice}>
                {t("Ответить", "Javob berish")}
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant={puzzle.mode === "trace" ? "secondary" : "primary"}
              onClick={run}
              disabled={running || program.length === 0 || (puzzle.mode === "trace" && !traceAnswered)}
            >
              ▶{" "}
              {puzzle.mode === "trace"
                ? t("Запустить и проверить", "Ishga tushirib tekshirish")
                : t("Запустить", "Ishga tushirish")}
            </Button>
            <Button
              variant="secondary"
              onClick={stepOnce}
              disabled={running || program.length === 0 || (puzzle.mode === "trace" && !traceAnswered)}
            >
              {t("Шаг ⏭", "Qadam ⏭")}
            </Button>
            <Button variant="ghost" onClick={resetExec} disabled={exec.pc === 0 && !exec.crash}>
              ↺ {t("На старт", "Boshiga")}
            </Button>
          </div>
        </div>
      </div>

      <Feedback state={feedback} />

      {puzzle.mode === "paths" && found.length > 0 && (
        <div className="rounded-2xl bg-white p-3 shadow-card">
          <p className="mb-2 text-sm font-extrabold text-muted">
            {t(`Найденные пути: ${found.length}`, `Topilgan yoʻllar: ${found.length}`)}
          </p>
          <div className="flex flex-wrap gap-2">
            {found.map((k) => (
              <span
                key={k}
                className="rounded-xl bg-brand-soft px-3 py-1.5 text-lg font-black tracking-widest text-brand-dark"
              >
                {[...k].map((d) => ARROW[d as Dir]).join("")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowButton({ dir, onPress, disabled }: { dir: Dir; onPress: (d: Dir) => void; disabled?: boolean }) {
  const lang = useLang();
  return (
    <button
      type="button"
      onClick={() => onPress(dir)}
      disabled={disabled}
      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-2xl font-black text-white shadow-[0_3px_0_0_#3730a3] transition active:translate-y-[2px] active:shadow-[0_1px_0_0_#3730a3] disabled:opacity-40"
      aria-label={dirName(dir, lang)}
    >
      {ARROW[dir]}
    </button>
  );
}
