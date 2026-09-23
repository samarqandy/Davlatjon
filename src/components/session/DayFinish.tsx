"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, ButtonLink, cn } from "@/components/ui";
import { SECTIONS } from "@/content/meta";
import type { Day } from "@/content/types";
import { pluralize } from "@/lib/plural";
import { updateDay, useHydrated, useStore } from "@/lib/store";

const MOODS = [
  { emoji: "😀", label: "Было здорово" },
  { emoji: "🙂", label: "Хорошо" },
  { emoji: "😐", label: "Так себе" },
  { emoji: "😕", label: "Было трудно" },
];

export function DayFinish({ day, nextDayHref }: { day: Day; nextDayHref: string | null }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const tasks = useStore((s) => s.tasks);
  const progress = useStore((s) => s.days[day.id]);

  const list = day.tasks.map((t) => ({ task: t, p: hydrated ? tasks[t.id] : undefined }));
  const solved = list.filter((x) => x.p?.status === "solved").length;
  const explained = list.filter((x) => x.p?.marks.explained).length;
  const anotherWay = list.filter((x) => x.p?.marks.anotherWay).length;
  const persisted = list.filter(
    (x) => x.p?.status === "solved" && (x.p.hints >= 2 || x.p.missed >= 2 || x.p.marks.hard),
  );
  const done = Boolean(progress?.completedAt);

  const finish = () => {
    updateDay(day.id, { completedAt: progress?.completedAt ?? Date.now() });
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="animate-pop rounded-[2rem] border border-line bg-white p-6 text-center shadow-card sm:p-8">
        <div className="mb-2 text-6xl" aria-hidden>
          🏁
        </div>
        <h1 className="text-3xl font-black">Итоги дня</h1>
        <p className="mt-2 text-lg text-muted">Ты хорошо поработал! Посмотри, что сегодня получилось.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={solved} label={`из ${day.tasks.length} задач решено`} emoji="✅" />
          <Stat value={explained} label="объяснил решение" emoji="💬" />
          <Stat value={anotherWay} label="нашёл другой способ" emoji="🔁" />
          <Stat value={persisted.length} label="не сдался в трудной" emoji="🧗" />
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-sun-soft px-4 py-2 font-extrabold text-[#7a4b00]">
          <span aria-hidden>{day.habit.emoji}</span> Новая привычка мыслителя: «{day.habit.name}»
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="mb-3 text-xl font-extrabold">Какая задача была самой интересной?</h2>
        <TaskPicker day={day} value={progress?.favorite} onPick={(id) => updateDay(day.id, { favorite: id })} />
        <h2 className="mt-5 mb-3 text-xl font-extrabold">А над какой пришлось подумать дольше всего?</h2>
        <TaskPicker day={day} value={progress?.hardest} onPick={(id) => updateDay(day.id, { hardest: id })} />
        <h2 className="mt-5 mb-3 text-xl font-extrabold">Как тебе сегодняшнее занятие?</h2>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.emoji}
              type="button"
              onClick={() => updateDay(day.id, { mood: m.emoji })}
              aria-pressed={progress?.mood === m.emoji}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl border-2 px-4 py-2 transition",
                progress?.mood === m.emoji
                  ? "border-brand bg-brand-soft"
                  : "border-line bg-white hover:border-brand/40",
              )}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-xs font-bold text-muted">{m.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-5 rounded-2xl bg-brand-soft px-4 py-3 font-bold text-brand-dark">
          🗣 Расскажи маме или папе: что нового ты сегодня понял?
        </p>
        <p className="mt-3 text-[0.95rem] text-muted">
          Придумал свою задачу?{" "}
          <Link href="/my-problems" className="font-extrabold text-brand hover:underline">
            ✍️ Запиши её в «Мои задачи»
          </Link>
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" variant="success" onClick={finish}>
          {done ? "На главную" : "Завершить день ✓"}
        </Button>
        {nextDayHref && done && (
          <ButtonLink href={nextDayHref} size="lg" variant="secondary">
            Следующий день →
          </ButtonLink>
        )}
      </div>
      {solved < day.tasks.length && (
        <p className="text-center text-sm text-muted">
          Осталось {pluralize(day.tasks.length - solved, "задача", "задачи", "задач")} — к ним можно вернуться в любой
          день.
        </p>
      )}
    </div>
  );
}

function Stat({ value, label, emoji }: { value: number; label: string; emoji: string }) {
  return (
    <div className="rounded-2xl bg-paper px-3 py-3">
      <div className="text-2xl" aria-hidden>
        {emoji}
      </div>
      <div className="tabular text-3xl font-black">{value}</div>
      <div className="text-xs font-bold text-muted">{label}</div>
    </div>
  );
}

function TaskPicker({ day, value, onPick }: { day: Day; value?: string; onPick: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {day.tasks.map((t, i) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onPick(t.id)}
          aria-pressed={value === t.id}
          className={cn(
            "flex items-center gap-1.5 rounded-2xl border-2 px-3 py-2 text-sm font-bold transition",
            value === t.id
              ? "border-brand bg-brand-soft text-brand-dark"
              : "border-line bg-white hover:border-brand/40",
          )}
        >
          <span aria-hidden>{SECTIONS[t.section].emoji}</span>
          {i + 1}. {t.title}
        </button>
      ))}
    </div>
  );
}
