"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { cn, ProgressBar } from "@/components/ui";
import { activityDays } from "@/lib/calendar";
import { useLang, useT } from "@/lib/i18n";
import { pluralize } from "@/lib/plural";
import { gentleStreak, questDone, questFor, questStars, weekActiveDays, type QuestGoal } from "@/lib/quest";
import { GOAL_DAYS_DEFAULT, useHydrated, useStore } from "@/lib/store";
import { useToday } from "@/lib/useToday";
import { levelName, showsNumbers } from "@/lib/workshop";
import { xpLevel, xpTotal } from "@/lib/xp";

/** Уровень по опыту: число и полоска до следующего уровня. */
export function XpBar({ className, dark }: { className?: string; dark?: boolean }) {
  const t = useT();
  const lang = useLang();
  const numbers = useStore((s) => showsNumbers(s.settings.age));
  const hydrated = useHydrated();
  const xp = useStore((s) => xpTotal(s));
  const lvl = xpLevel(hydrated ? xp : 0);
  const name = levelName(lvl.level, lang);
  return (
    <div className={className} data-xp={hydrated ? xp : undefined}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-black" data-level-name={numbers ? undefined : name.name}>
          {numbers ? `⭐ ${t(`Уровень ${lvl.level}`, `${lvl.level}-daraja`)}` : `${name.emoji} ${name.name}`}
        </p>
        {numbers && (
          <p className={cn("text-xs font-bold tabular-nums", dark ? "text-white/85" : "text-muted")}>
            {lvl.into} / {lvl.need} XP
          </p>
        )}
      </div>
      <ProgressBar value={lvl.into} max={lvl.need} className={cn("mt-1", dark && "bg-white/20")} />
    </div>
  );
}

function goalText(g: QuestGoal, t: ReturnType<typeof useT>): string {
  switch (g.kind) {
    case "puzzles":
      return t(
        `Реши ${pluralize(g.need, "задачу", "задачи", "задач")} в тренажёре тактики`,
        `Taktika trenajyorida ${g.need} ta masala yech`,
      );
    case "task":
      return t("Реши задачу по математике", "Matematikadan bitta masala yech");
    case "exercise":
      return t("Реши упражнение шахматной школы", "Shaxmat maktabida bitta mashq bajar");
    case "game":
      return t("Сыграй партию", "Bitta partiya oʻyna");
  }
}

/** День для разметки до загрузки: какой именно — не важно, строки дел одной высоты. */
const PLACEHOLDER_DAY = "2026-01-01";

/**
 * «Сегодня»: уровень, задание дня из трёх дел, мягкая серия и цель недели.
 * Всё считается из прогресса — отдельно ничего не хранится.
 */
export function TodayCard({
  className,
  compact = false,
}: {
  className?: string;
  /** Свёрнутый вид для страниц, где главное — другое (шахматная школа): строка с итогом, остальное по нажатию. */
  compact?: boolean;
}) {
  const t = useT();
  const hydrated = useHydrated();
  const today = useToday();
  const state = useStore((s) => s);
  const goal = state.settings.goalDays ?? GOAL_DAYS_DEFAULT;
  const days = useMemo(() => activityDays(state), [state]);
  // До загрузки прогресса и даты содержимое уже стоит на месте, но невидимо: карточка сразу своей высоты,
  // и после загрузки ничего ниже неё не прыгает. Чужих нулей («0 из 3», «начни серию») ребёнок при этом не видит.
  const ready = hydrated && !!today;
  if (compact && !ready) return <section className={cn("min-h-14 rounded-3xl bg-surface shadow-card", className)} />;
  const day = today || PLACEHOLDER_DAY;

  const goals = questFor(state, day);
  const done = questDone(goals);
  const stars = questStars(state, Object.keys(days));
  const streak = gentleStreak(days, day);
  const week = weekActiveDays(days, day);
  const flame = Math.min(1 + streak.days / 10, 2);

  const title = (
    <>
      <span className="deco" aria-hidden>
        🎯{" "}
      </span>
      {t("Задание дня", "Kun vazifasi")}
    </>
  );
  const body = (
    <div className="grid gap-5 @xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div>
        {!compact && (
          <h2 id="today" className="text-xl font-black">
            {title}
          </h2>
        )}
        <ul className="mt-2 space-y-1.5" data-quest={!ready ? undefined : done ? "done" : "open"}>
          {goals.map((g) => {
            const ok = g.have >= g.need;
            return (
              <li key={g.kind + g.need}>
                <Link
                  href={g.href}
                  className={cn(
                    // В узкой карточке текст дела занимает одну или две строки — высота строки одна на всех:
                    // три дела стоят ровно, и карточка не меняет высоту от того, какое дело выпало сегодня.
                    "flex items-center gap-3 rounded-2xl border-2 px-3 py-2 transition @max-md:min-h-[4.25rem]",
                    ok ? "border-mint/40 bg-mint-soft/60" : "border-line hover:border-brand/40",
                  )}
                >
                  {/* Не «⬜»: пустой квадратик похож на флажок, который можно отметить, а это ссылка. */}
                  {ok ? (
                    <span aria-hidden className="text-xl">
                      ✅
                    </span>
                  ) : (
                    <span aria-hidden className="mx-0.5 h-5 w-5 shrink-0 rounded-full border-[3px] border-brand/30" />
                  )}
                  <span className="flex-1 font-bold">{goalText(g, t)}</span>
                  <span className="text-sm font-black text-muted tabular-nums">
                    {g.have}/{g.need}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-sm font-bold text-muted">
          {done
            ? t("🌟 Все дела сделаны — звезда дня твоя!", "🌟 Hamma ishlar bajarildi — kun yulduzi seniki!")
            : t("Сделай все три дела — получишь звезду дня.", "Uchala ishni bajar — kun yulduzini olasan.")}{" "}
          {t(`Звёзд дня: ${stars}.`, `Kun yulduzlari: ${stars} ta.`)}
        </p>
      </div>
      <div className="space-y-4">
        <XpBar />
        <p className="-mt-2 text-xs font-bold text-muted">
          {t(
            "Решай задачи и играй — набирай опыт, и значок вырастет: 🌱 → 🔦 → 🧭 → 🔭 …",
            "Masala yech va oʻyna — tajriba toʻpla, belgi oʻsadi: 🌱 → 🔦 → 🧭 → 🔭 …",
          )}
        </p>
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-block origin-bottom text-3xl" style={{ transform: `scale(${flame})` }}>
            🔥
          </span>
          <div>
            <p className="font-black" data-streak={ready ? streak.days : undefined}>
              {streak.days
                ? t(`${pluralize(streak.days, "день", "дня", "дней")} подряд`, `Ketma-ket ${streak.days} kun`)
                : t("Начни серию сегодня!", "Seriyani bugun boshla!")}
            </p>
            {streak.frozen.length > 0 && (
              <p className="text-xs font-bold text-muted">
                {t(
                  "❄️ Один пропуск в неделю прощается — серия не порвалась.",
                  "❄️ Haftada bitta oʻtkazib yuborilgan kun kechiriladi — seriya uzilmadi.",
                )}
              </p>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold">
            📅 {t(`На этой неделе: ${week} из ${goal} дней`, `Bu hafta: ${goal} kundan ${week} kun`)}
            {week >= goal ? t(" — цель недели выполнена! 🎉", " — haftalik maqsad bajarildi! 🎉") : ""}
          </p>
          <ProgressBar value={Math.min(week, goal)} max={goal} className="mt-1" />
        </div>
      </div>
    </div>
  );
  if (compact) {
    const doneCount = goals.filter((g) => g.have >= g.need).length;
    return (
      <details className={cn("group @container rounded-3xl bg-surface shadow-card", className)} data-today>
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-2 px-4 py-2 select-none [&::-webkit-details-marker]:hidden">
          <h2 id="today" className="min-w-0 flex-1 text-lg leading-tight font-black">
            {title}
          </h2>
          <span className="shrink-0 text-sm font-black whitespace-nowrap text-muted tabular-nums" data-quest-count>
            {doneCount}/{goals.length}
          </span>
          {streak.days > 0 && (
            <span className="shrink-0 text-sm font-black whitespace-nowrap">
              <span aria-hidden>🔥 </span>
              {streak.days}
            </span>
          )}
          <ChevronDown className="h-5 w-5 shrink-0 text-muted transition group-open:rotate-180" aria-hidden />
        </summary>
        <div className="px-5 pb-5">{body}</div>
      </details>
    );
  }
  return (
    // Делится на две колонки по своей ширине, а не по ширине окна: в узкой колонке главной — одна колонка.
    <section
      className={cn("@container rounded-3xl bg-surface p-5 shadow-card", className)}
      aria-labelledby="today"
      data-today={ready ? "" : undefined}
    >
      <div className={ready ? undefined : "invisible"}>{body}</div>
    </section>
  );
}
