"use client";

import { useState } from "react";
import { RichText } from "@/components/RichText";
import { BlockView } from "@/components/task/BlockView";
import { ButtonLink, Card, cn, LevelBadge, SectionTag } from "@/components/ui";
import { hintLabel } from "@/content/meta";
import type { Day, Task } from "@/content/types";
import { PARENT_CHIPS } from "@/lib/insights";
import { formatMinutes, pluralize } from "@/lib/plural";
import { updateDay, updateTask, useHydrated, useStore, type TaskProgress } from "@/lib/store";

const MOOD_LABEL: Record<string, string> = {
  "😀": "было здорово",
  "🙂": "хорошо",
  "😐": "так себе",
  "😕": "было трудно",
};

export function ParentDayView({ day }: { day: Day }) {
  const hydrated = useHydrated();
  const progress = useStore((s) => s.days[day.id]);
  const tasks = useStore((s) => s.tasks);
  const taskTitle = (id?: string) => day.tasks.find((t) => t.id === id)?.title;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
            Неделя {day.week} · День {day.day}
          </p>
          <h1 className="text-3xl font-black">
            {day.emoji} {day.title}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={`/week/${day.week}/day/${day.day}/print#answers`} variant="secondary">
            🖨 Лист с ответами
          </ButtonLink>
          <ButtonLink href={`/week/${day.week}/day/${day.day}`} variant="soft">
            Открыть занятие
          </ButtonLink>
        </div>
      </div>

      <Card className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <NoteList title="🧠 Какие навыки тренируем" items={day.parent.skills} />
        <NoteList title="👀 На что обратить внимание" items={day.parent.observe} />
        <NoteList title="🙂 Какие ошибки нормальны" items={day.parent.mistakes} />
        <div>
          <h2 className="mb-1.5 font-extrabold">❓ Вопрос после занятия</h2>
          <p className="rounded-2xl bg-brand-soft px-4 py-3 font-bold text-brand-dark">{day.parent.question}</p>
        </div>
      </Card>

      {hydrated && (progress?.favorite || progress?.hardest || progress?.mood) && (
        <Card className="p-5">
          <h2 className="mb-2 font-extrabold">🏁 Итоги дня глазами ребёнка</h2>
          <ul className="space-y-1 text-[0.95rem]">
            {progress?.favorite && <li>Самая интересная задача: «{taskTitle(progress.favorite)}»</li>}
            {progress?.hardest && <li>Над этой пришлось подумать дольше всего: «{taskTitle(progress.hardest)}»</li>}
            {progress?.mood && (
              <li>
                Настроение: {progress.mood} {MOOD_LABEL[progress.mood]}
              </li>
            )}
          </ul>
        </Card>
      )}

      <div className="space-y-4">
        {day.tasks.map((t, i) => (
          <TaskAnswerCard key={t.id} task={t} number={i + 1} p={hydrated ? tasks[t.id] : undefined} />
        ))}
      </div>

      <Card className="p-5">
        <label className="block">
          <span className="mb-1.5 block font-extrabold">📝 Мои заметки о дне</span>
          <span className="mb-2 block text-sm text-muted">
            Описывайте поведение, а не ярлыки: «Сегодня сам нашёл закономерность», «Понадобилась подсказка, чтобы
            упорядочить варианты».
          </span>
          <textarea
            defaultValue={progress?.parentNote ?? ""}
            key={hydrated ? "h" : "s"}
            onBlur={(e) => updateDay(day.id, { parentNote: e.target.value })}
            rows={4}
            className="w-full rounded-2xl border-2 border-line bg-white px-3 py-2 outline-none focus:border-brand"
          />
        </label>
      </Card>
    </div>
  );
}

function NoteList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="mb-1.5 font-extrabold">{title}</h2>
      <ul className="space-y-1 text-[0.95rem]">
        {items.map((s) => (
          <li key={s} className="flex gap-2">
            <span className="text-brand" aria-hidden>
              ●
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const bestProgram = (found?: string[]) => {
  const lens = (found ?? []).filter((f) => f.startsWith("len:")).map((f) => Number(f.slice(4)));
  return lens.length ? Math.min(...lens) : null;
};
const variants = (found?: string[]) => (found ?? []).filter((f) => !f.startsWith("len:")).length;

function Activity({ p }: { p: TaskProgress | undefined }) {
  if (!p || (!p.status && p.hints === 0 && p.checks === 0))
    return <p className="text-sm text-muted">Ребёнок ещё не открывал эту задачу.</p>;
  const facts = [
    p.status === "solved"
      ? p.firstTry && p.hints === 0
        ? "✅ решено с первой попытки без подсказок"
        : "✅ решено"
      : "⏳ в процессе",
    `💡 подсказок: ${p.hints} из 5`,
    p.checks > 0 ? `🔎 проверок: ${p.checks}${p.missed ? `, не сошлось: ${p.missed}` : ""}` : null,
    p.timeMs > 0 ? `⏱ ${formatMinutes(p.timeMs)}` : null,
    bestProgram(p.found)
      ? `🤖 самая короткая программа: ${pluralize(bestProgram(p.found)!, "команда", "команды", "команд")}`
      : null,
    variants(p.found) ? `🔁 найдено вариантов: ${variants(p.found)}` : null,
  ].filter(Boolean);
  const marks = [
    p.marks.explained && "💬 объяснил",
    p.marks.anotherWay && "🔁 другой способ",
    p.marks.liked && "❤️ понравилась",
    p.marks.hard && "🧗 было трудно",
  ].filter(Boolean);
  return (
    <div className="space-y-1 text-sm">
      <p className="flex flex-wrap gap-x-4 gap-y-1 font-bold">
        {facts.map((f) => (
          <span key={f as string}>{f}</span>
        ))}
      </p>
      {marks.length > 0 && <p className="text-muted">Отметки ребёнка: {marks.join(" · ")}</p>}
    </div>
  );
}

function TaskAnswerCard({ task, number, p }: { task: Task; number: number; p: TaskProgress | undefined }) {
  const [showTask, setShowTask] = useState(false);
  const chips = p?.parentChips ?? [];
  const toggleChip = (id: string) =>
    updateTask(task.id, (t) => ({
      parentChips: (t.parentChips ?? []).includes(id)
        ? (t.parentChips ?? []).filter((c) => c !== id)
        : [...(t.parentChips ?? []), id],
    }));

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-line bg-paper/60 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-black text-white">
            {number}
          </span>
          <h2 className="text-lg font-black">{task.title}</h2>
          <SectionTag section={task.section} className="text-xs" />
          <LevelBadge level={task.level} />
          <button
            type="button"
            onClick={() => setShowTask((v) => !v)}
            className="ml-auto text-sm font-bold text-brand hover:underline"
          >
            {showTask ? "Скрыть условие" : "Показать условие"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {showTask && (
            <div className="space-y-2 rounded-2xl bg-paper p-4">
              {task.body.map((b, i) => (
                <BlockView key={i} block={b} />
              ))}
            </div>
          )}
          <p className="rounded-2xl bg-mint-soft px-4 py-2.5 text-[1.05rem]">
            <b>Ответ:</b> <RichText text={task.solution.answer} />
          </p>
          <div className="space-y-1">
            {task.solution.explanation.map((e) => (
              <p key={e}>
                <RichText text={e} />
              </p>
            ))}
          </div>
          {task.solution.discuss?.map((d) => (
            <p key={d} className="rounded-2xl bg-brand-soft/60 px-4 py-2 text-[0.95rem]">
              💬 <RichText text={d} />
            </p>
          ))}
          <details className="rounded-2xl border border-[#fde68a] bg-[#fffbeb] px-4 py-2.5">
            <summary className="cursor-pointer font-extrabold">💡 Подсказки по порядку</summary>
            <ol className="mt-2 space-y-1.5 text-[0.95rem]">
              {task.hints.map((h, j) => (
                <li key={j}>
                  <b>
                    {j + 1}. {hintLabel(j)}
                  </b>{" "}
                  <RichText text={h} />
                </li>
              ))}
            </ol>
          </details>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl bg-paper p-4">
            <h3 className="mb-1.5 text-sm font-extrabold text-muted uppercase">Как решал Давлатжон</h3>
            <Activity p={p} />
          </div>
          <div>
            <h3 className="mb-1.5 text-sm font-extrabold text-muted uppercase">Мои наблюдения</h3>
            <div className="flex flex-wrap gap-1.5">
              {PARENT_CHIPS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={chips.includes(c.id)}
                  onClick={() => toggleChip(c.id)}
                  className={cn(
                    "rounded-xl border-2 px-2.5 py-1 text-sm font-bold transition",
                    chips.includes(c.id)
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-white text-muted hover:border-brand/40",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <textarea
              defaultValue={p?.parentNote ?? ""}
              onBlur={(e) => updateTask(task.id, () => ({ parentNote: e.target.value }))}
              placeholder="Что вы заметили? Например: «сначала ответил 6, потом сам нашёл большие квадраты»."
              rows={2}
              className="mt-2 w-full rounded-2xl border-2 border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
