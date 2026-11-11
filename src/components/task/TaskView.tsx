"use client";

import { useEffect } from "react";
import { AnswerPanel } from "@/components/answers/AnswerPanel";
import { ListenButton } from "@/components/ListenButton";
import { LevelBadge, SectionTag } from "@/components/ui";
import type { Task } from "@/content/types";
import { useLang, useT } from "@/lib/i18n";
import { addTime, useStore, useTask } from "@/lib/store";
import { VOICE_CLIPS } from "@/lib/voice";
import { AfterSolve } from "./AfterSolve";
import { BlockView } from "./BlockView";
import { HintLadder } from "./HintLadder";
import { TaskIdContext } from "./TaskContext";

/** Считаем время на задаче, пока вкладка видна (для наблюдений родителя, ребёнку не показываем). */
function useTaskTimer(taskId: string) {
  useEffect(() => {
    let last = performance.now();
    const flush = () => {
      const now = performance.now();
      if (document.visibilityState === "visible") addTime(taskId, Math.min(now - last, 60_000));
      last = now;
    };
    const interval = setInterval(flush, 15_000);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      flush();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [taskId]);
}

export function TaskView({
  task,
  number,
  total,
  review = false,
}: {
  task: Task;
  number: number;
  total: number;
  /** Повторение уже решённой задачи: вместо номера — пометка, а вопросы «А ещё подумай» и отметки не нужны. */
  review?: boolean;
}) {
  const progress = useTask(task.id);
  const t = useT();
  const lang = useLang();
  useTaskTimer(task.id);
  const solved = progress.status === "solved";
  const young = useStore((s) => (s.settings.age ?? 9) < 9);

  return (
    <TaskIdContext.Provider value={task.id}>
      <article className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-3 sm:space-y-5">
          <div className="rounded-3xl border border-line bg-surface p-4 shadow-card sm:p-7">
            {/*
             * На телефоне — одна строка: название задачи и «Прочитать». Раздел, уровень и номер задачи занимали
             * три строки над условием и отодвигали поле ответа за край экрана; с планшета они на месте.
             */}
            <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 sm:mb-4 sm:block">
              <div className="contents sm:mb-3 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                <span className="hidden sm:contents">
                  <SectionTag section={task.section} lang={lang} />
                  <LevelBadge level={task.level} lang={lang} />
                </span>
                <span className="ml-auto hidden text-sm font-bold text-muted sm:inline">
                  {review
                    ? t("Повторение", "Takrorlash")
                    : t(`Задача ${number} из ${total}`, `${number}-masala (jami ${total} ta)`)}
                </span>
                <ListenButton
                  src={VOICE_CLIPS.task(task.id, lang)}
                  label={t("Прочитать", "Oʻqib berish")}
                  large={young}
                  className="max-sm:col-start-2 max-sm:row-start-1"
                />
              </div>
              <h2
                data-step-heading
                tabIndex={-1}
                className="flex items-center gap-2 text-2xl font-black outline-none max-sm:col-start-1 max-sm:row-start-1 sm:text-3xl"
              >
                {task.title}
                {solved && (
                  <span
                    className="rounded-full bg-mint px-2.5 py-0.5 text-sm font-extrabold text-white"
                    title={t("Решено", "Yechildi")}
                  >
                    ✓
                  </span>
                )}
              </h2>
            </div>
            <div className="child-text space-y-3.5 text-lg sm:text-xl">
              {task.body.map((b, i) => (
                <BlockView key={i} block={b} />
              ))}
            </div>
          </div>

          <section
            className="rounded-3xl border-2 border-brand/15 bg-brand-soft/40 p-3 sm:p-5"
            aria-label={t("Мой ответ", "Javobim")}
          >
            {/* На телефоне подпись «Мой ответ» лишняя — поле ответа говорит само за себя; вход к подсказкам — в нижней панели. */}
            <h3 className="mb-3 text-lg font-extrabold text-brand-dark max-sm:sr-only">
              <span className="deco" aria-hidden>
                ✏️{" "}
              </span>
              {t("Мой ответ", "Javobim")}
            </h3>
            <AnswerPanel task={task} hintsLeft={progress.hints < task.hints.length} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          {!review && <AfterSolve taskId={task.id} followUps={task.followUps} />}
          <HintLadder taskId={task.id} hints={task.hints} />
        </aside>
      </article>
    </TaskIdContext.Provider>
  );
}
