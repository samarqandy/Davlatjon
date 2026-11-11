"use client";

import { Lightbulb, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { TaskView } from "@/components/task/TaskView";
import { Button, cn, Icon } from "@/components/ui";
import type { Day, Task } from "@/content/types";
import { useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { dayHref, reviewHref } from "@/lib/routes";
import {
  dueTasks,
  finishTaskReview,
  isoDay,
  REVIEW_DAYS,
  reviewId,
  startTaskReview,
  useHydrated,
  useStore,
  useTask,
} from "@/lib/store";
import { setHash } from "@/lib/useHash";
import { currentScrollBehavior } from "@/lib/useMotion";
import { useToday } from "@/lib/useToday";

/**
 * Повторение задачи, которая в первый раз далась с трудом: то же условие, но ответ — с чистого листа.
 * Попытка хранится отдельно («~id»), первая — уже засчитанная — не меняется. Решено без ошибок и подсказок —
 * задача вернётся позже (через 3, 7, 21 день), иначе — завтра.
 */
export function ReviewStep({ day, task, bigText }: { day: Day; task: Task; bigText: boolean }) {
  const t = useT();
  const router = useRouter();
  const hydrated = useHydrated();
  const today = useToday();
  const source = useTask(task.id);
  const attempt = useTask(reviewId(task.id));
  const tasks = useStore((s) => s.tasks);
  const copy = useMemo(() => ({ ...task, id: reviewId(task.id) }), [task]);
  const solved = attempt.status === "solved";
  // Решённая попытка прошлого раза, а задачу снова пора повторить: её вот-вот сотрёт startTaskReview — не показываем.
  const stale = solved && !!today && !!source.due && source.due <= today && isoDay(attempt.solvedAt ?? 0) < source.due;

  useEffect(() => {
    if (solved) finishTaskReview(task.id);
  }, [solved, task.id]);
  useEffect(() => {
    if (hydrated) startTaskReview(task.id);
  }, [hydrated, task.id]);

  const queue = today
    ? dueTasks(tasks, today)
        .filter((id) => id !== task.id)
        .map(reviewHref)
        .filter((href) => href !== null)
    : [];
  const next = queue[0];
  const onward = () => {
    if (!next) return router.push("/");
    const [path, anchor] = next.split("#");
    // Следующая задача из того же дня — меняем только якорь: страница та же.
    if (path === dayHref(day)) {
      setHash(`#${anchor}`, { keepScroll: true });
      window.scrollTo({ top: 0, behavior: currentScrollBehavior() });
    } else router.push(next);
  };

  // Что будет с задачей дальше — одной короткой строкой, когда попытка засчитана.
  const counted = solved && !!attempt.solvedAt && source.reviewedAt === attempt.solvedAt;
  const days = source.box ? REVIEW_DAYS[source.box - 1] : 0;
  const outcome = !counted
    ? null
    : !source.box
      ? t("Запомнилось! Больше не повторяем", "Esda qoldi! Endi takrorlamaymiz")
      : days === 1
        ? t("Повторим ещё раз завтра", "Ertaga yana takrorlaymiz")
        : t(`Вернётся через ${pluralize(days, "день", "дня", "дней")}`, `${days} kundan keyin qaytadi`);
  const hintsLeft = !solved && attempt.hints < task.hints.length;

  return (
    <div className={cn("pb-28", bigText && "big-text")} data-review={task.id}>
      <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-1.5 sm:gap-3 sm:py-2.5">
          <Link
            href="/"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover:bg-black/5"
            aria-label={t("На главную", "Bosh sahifaga")}
          >
            <X aria-hidden className="h-6 w-6" strokeWidth={2.5} />
          </Link>
          <p className="flex min-w-0 flex-1 items-center gap-2 font-black">
            <RotateCcw aria-hidden className="h-5 w-5 shrink-0 text-brand" strokeWidth={2.5} />
            <span className="truncate">{t("Повторение", "Takrorlash")}</span>
          </p>
          {queue.length > 0 && (
            <p className="shrink-0 text-sm font-bold text-muted" data-review-left>
              {t(`ещё ${queue.length}`, `yana ${queue.length} ta`)}
            </p>
          )}
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-3 sm:pt-5">
        {hydrated && !stale && <TaskView key={copy.id} task={copy} number={1} total={1} review />}
      </main>

      <nav
        data-day-nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur"
        aria-label={t("Повторение", "Takrorlash")}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-3">
          {hintsLeft ? (
            <button
              type="button"
              data-hint-jump
              onClick={() =>
                document.getElementById("hints")?.scrollIntoView({ behavior: currentScrollBehavior(), block: "center" })
              }
              className="inline-flex min-h-12 min-w-12 items-center justify-center gap-1.5 rounded-2xl bg-sun-soft px-3.5 text-base font-extrabold text-sun-ink lg:hidden"
            >
              <Icon icon={Lightbulb} />
              <span className="max-[359px]:sr-only">{t("Подсказка", "Maslahat")}</span>
            </button>
          ) : (
            <p className="min-w-0 text-sm leading-tight font-bold text-muted" data-review-outcome role="status">
              {outcome}
            </p>
          )}
          {/* Пока не решено — можно отложить (расписание не меняется); решено — главная кнопка ведёт дальше. */}
          <Button
            variant={solved ? "primary" : "secondary"}
            onClick={onward}
            className="ml-auto shrink-0"
            data-review-next
          >
            {!solved ? t("Позже", "Keyinroq") : next ? t("Дальше →", "Keyingi →") : t("Готово ✓", "Tayyor ✓")}
          </Button>
        </div>
      </nav>
    </div>
  );
}
