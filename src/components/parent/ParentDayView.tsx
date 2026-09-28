"use client";

import { useState } from "react";
import { RichText } from "@/components/RichText";
import { BlockView } from "@/components/task/BlockView";
import { ButtonLink, Card, cn, LevelBadge, SectionTag } from "@/components/ui";
import { hintLabel } from "@/content/meta";
import type { Day, Task } from "@/content/types";
import { useBoth, useLang, useT, type Both, type Lang, type T } from "@/lib/i18n";
import { PARENT_CHIPS } from "@/lib/insights";
import { formatMinutes, pluralize } from "@/lib/plural";
import { updateDay, updateTask, useHydrated, useStore, type TaskProgress } from "@/lib/store";

const MOOD_LABEL: Record<string, { ru: string; uz: string }> = {
  "😀": { ru: "было здорово", uz: "zoʻr boʻldi" },
  "🙂": { ru: "хорошо", uz: "yaxshi" },
  "😐": { ru: "так себе", uz: "oʻrtacha" },
  "😕": { ru: "было трудно", uz: "qiyin boʻldi" },
};

export function ParentDayView({ day: both }: { day: Both<Day> }) {
  const hydrated = useHydrated();
  const t = useT();
  const day = useBoth(both);
  const progress = useStore((s) => s.days[day.id]);
  const tasks = useStore((s) => s.tasks);
  const taskTitle = (id?: string) => day.tasks.find((task) => task.id === id)?.title ?? "";
  const mood = progress?.mood ? MOOD_LABEL[progress.mood] : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-brand uppercase">
            {t(`Неделя ${day.week} · День ${day.day}`, `${day.week}-hafta · ${day.day}-kun`)}
          </p>
          <h1 className="text-3xl font-black">
            {day.emoji} {day.title}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={`/week/${day.week}/day/${day.day}/print#answers`} variant="secondary">
            🖨 {t("Лист с ответами", "Javoblar varagʻi")}
          </ButtonLink>
          <ButtonLink href={`/week/${day.week}/day/${day.day}`} variant="soft">
            {t("Открыть занятие", "Mashgʻulotni ochish")}
          </ButtonLink>
        </div>
      </div>

      <Card className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <NoteList
          title={t("🧠 Какие навыки тренируем", "🧠 Qaysi koʻnikmalarni mashq qilamiz")}
          items={day.parent.skills}
        />
        <NoteList
          title={t("👀 На что обратить внимание", "👀 Nimaga eʼtibor berish kerak")}
          items={day.parent.observe}
        />
        <NoteList title={t("🙂 Какие ошибки нормальны", "🙂 Qaysi xatolar tabiiy")} items={day.parent.mistakes} />
        <div>
          <h2 className="mb-1.5 font-extrabold">{t("❓ Вопрос после занятия", "❓ Mashgʻulotdan keyingi savol")}</h2>
          <p className="rounded-2xl bg-brand-soft px-4 py-3 font-bold text-brand-dark">{day.parent.question}</p>
        </div>
      </Card>

      {hydrated && (progress?.favorite || progress?.hardest || progress?.mood) && (
        <Card className="p-5">
          <h2 className="mb-2 font-extrabold">
            {t("🏁 Итоги дня глазами ребёнка", "🏁 Kun yakunlari — farzandingiz nigohida")}
          </h2>
          <ul className="space-y-1 text-[0.95rem]">
            {progress?.favorite && (
              <li>
                {t(
                  `Самая интересная задача: «${taskTitle(progress.favorite)}»`,
                  `Eng qiziq masala: «${taskTitle(progress.favorite)}»`,
                )}
              </li>
            )}
            {progress?.hardest && (
              <li>
                {t(
                  `Над этой пришлось подумать дольше всего: «${taskTitle(progress.hardest)}»`,
                  `Eng koʻp bosh qotirgan masalasi: «${taskTitle(progress.hardest)}»`,
                )}
              </li>
            )}
            {progress?.mood && (
              <li>
                {t("Настроение: ", "Kayfiyati: ")}
                {progress.mood} {mood && t(mood.ru, mood.uz)}
              </li>
            )}
          </ul>
        </Card>
      )}

      <div className="space-y-4">
        {day.tasks.map((task, i) => (
          <TaskAnswerCard key={task.id} task={task} number={i + 1} p={hydrated ? tasks[task.id] : undefined} />
        ))}
      </div>

      <Card className="p-5">
        <label className="block">
          <span className="mb-1.5 block font-extrabold">{t("📝 Мои заметки о дне", "📝 Kun haqidagi qaydlarim")}</span>
          <span className="mb-2 block text-sm text-muted">
            {t(
              "Описывайте поведение, а не ярлыки: «Сегодня сам нашёл закономерность», «Понадобилась подсказка, чтобы упорядочить варианты».",
              "Yorliq yopishtirmang — nima qilganini yozing: «Bugun qonuniyatni oʻzi topdi», «Variantlarni tartibga solish uchun maslahat kerak boʻldi».",
            )}
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

const best = (found: string[] | undefined, prefix: string) => {
  const values = (found ?? []).filter((f) => f.startsWith(prefix)).map((f) => Number(f.slice(prefix.length)));
  return values.length ? Math.min(...values) : null;
};

/** Лучший результат и найденные варианты — по-своему для каждого инструмента. */
function results(task: Task, found: string[] | undefined, t: T): string[] {
  const a = task.answer;
  const len = best(found, "len:");
  const others = (found ?? []).filter((f) => !f.startsWith("len:")).length;
  switch (a.kind) {
    case "robot":
    case "performer":
      return [
        len
          ? t(
              `🤖 самая короткая программа: ${pluralize(len, "команда", "команды", "команд")}`,
              `🤖 eng qisqa dastur: ${len} ta buyruq`,
            )
          : null,
        others ? t(`🔁 найдено вариантов: ${others}`, `🔁 ${others} ta variant topildi`) : null,
      ].filter((x): x is string => x !== null);
    case "crossing":
      return len ? [t(`⛵ меньше всего переправ: ${len}`, `⛵ eng kam qatnov: ${len} ta`)] : [];
    case "jugs":
      return len ? [t(`🪣 меньше всего действий: ${len}`, `🪣 eng kam amal: ${len} ta`)] : [];
    case "hanoi": {
      const bySize = new Map<number, number>();
      for (const f of found ?? []) {
        const m = f.match(/^(\d+):(\d+)$/);
        if (m) bySize.set(Number(m[1]), Math.min(bySize.get(Number(m[1])) ?? Infinity, Number(m[2])));
      }
      return bySize.size
        ? [
            `🗼 ${[...bySize.entries()]
              .sort((x, y) => x[0] - y[0])
              .map(([size, moves]) =>
                t(
                  `${pluralize(size, "кольцо", "кольца", "колец")} — ${pluralize(moves, "ход", "хода", "ходов")}`,
                  `${size} ta halqa — ${moves} ta yurish`,
                ),
              )
              .join(", ")}`,
          ]
        : [];
    }
    case "wallLab": {
      const tops = (found ?? []).filter((f) => f.startsWith("top:")).map((f) => Number(f.slice(4)));
      const sorted = [...tops].sort((x, y) => x - y).join(", ");
      return tops.length ? [t(`🔬 числа наверху: ${sorted}`, `🔬 tepadagi sonlar: ${sorted}`)] : [];
    }
    case "scales":
      return len
        ? [
            t(
              `⚖️ нашёл фальшивую монету за ${pluralize(len, "взвешивание", "взвешивания", "взвешиваний")}`,
              `⚖️ soxta tangani ${len} marta tortib topdi`,
            ),
          ]
        : [];
    case "swapSort":
      return len ? [t(`🔀 меньше всего обменов: ${len}`, `🔀 eng kam almashtirish: ${len} ta`)] : [];
    case "nim":
      return (found ?? []).includes("win") ? [t("🏆 обыграл робота", "🏆 robotni yutdi")] : [];
    case "weightsLab":
      return a.sets
        .map((set, i) => {
          const loads = (found ?? []).filter((f) => f.startsWith(`set${i}:`)).length;
          const weights = set.weights.join(", ");
          return loads
            ? t(
                `⚖️ гири ${weights}: уравновешено ${loads} из ${set.max}`,
                `⚖️ ${weights} toshlar: ${set.max} tadan ${loads} tasi muvozanatga keltirildi`,
              )
            : null;
        })
        .filter((x): x is string => x !== null);
    default:
      return others ? [t(`🔁 найдено вариантов: ${others}`, `🔁 ${others} ta variant topildi`)] : [];
  }
}

function Activity({ task, p, t, lang }: { task: Task; p: TaskProgress | undefined; t: T; lang: Lang }) {
  if (!p || (!p.status && p.hints === 0 && p.checks === 0))
    return (
      <p className="text-sm text-muted">
        {t("Ребёнок ещё не открывал эту задачу.", "Farzandingiz bu masalani hali ochmagan.")}
      </p>
    );
  const facts = [
    p.status === "solved"
      ? p.firstTry && p.hints === 0
        ? t("✅ решено с первой попытки без подсказок", "✅ birinchi urinishda, maslahatsiz yechildi")
        : t("✅ решено", "✅ yechildi")
      : t("⏳ в процессе", "⏳ jarayonda"),
    t(`💡 подсказок: ${p.hints} из 5`, `💡 maslahat: 5 tadan ${p.hints} tasi`),
    p.checks > 0
      ? t(
          `🔎 проверок: ${p.checks}${p.missed ? `, не сошлось: ${p.missed}` : ""}`,
          `🔎 ${p.checks} marta tekshirdi${p.missed ? `, ${p.missed} marta mos kelmadi` : ""}`,
        )
      : null,
    p.timeMs > 0 ? `⏱ ${formatMinutes(p.timeMs, lang)}` : null,
    ...results(task, p.found, t),
  ].filter(Boolean);
  const marks = [
    p.marks.explained && t("💬 объяснил", "💬 tushuntirdi"),
    p.marks.anotherWay && t("🔁 другой способ", "🔁 boshqa usul"),
    p.marks.liked && t("❤️ понравилась", "❤️ yoqdi"),
    p.marks.hard && t("🧗 было трудно", "🧗 qiyin boʻldi"),
  ].filter(Boolean);
  return (
    <div className="space-y-1 text-sm">
      <p className="flex flex-wrap gap-x-4 gap-y-1 font-bold">
        {facts.map((f) => (
          <span key={f as string}>{f}</span>
        ))}
      </p>
      {marks.length > 0 && (
        <p className="text-muted">
          {t("Отметки ребёнка: ", "Farzandingiz belgilari: ")}
          {marks.join(" · ")}
        </p>
      )}
    </div>
  );
}

function TaskAnswerCard({ task, number, p }: { task: Task; number: number; p: TaskProgress | undefined }) {
  const t = useT();
  const lang = useLang();
  const [showTask, setShowTask] = useState(false);
  const chips = p?.parentChips ?? [];
  const toggleChip = (id: string) =>
    updateTask(task.id, (tp) => ({
      parentChips: (tp.parentChips ?? []).includes(id)
        ? (tp.parentChips ?? []).filter((c) => c !== id)
        : [...(tp.parentChips ?? []), id],
    }));

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-line bg-paper/60 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-black text-white">
            {number}
          </span>
          <h2 className="text-lg font-black">{task.title}</h2>
          <SectionTag section={task.section} className="text-xs" lang={lang} />
          <LevelBadge level={task.level} lang={lang} />
          <button
            type="button"
            onClick={() => setShowTask((v) => !v)}
            className="ml-auto text-sm font-bold text-brand hover:underline"
          >
            {showTask ? t("Скрыть условие", "Shartni yashirish") : t("Показать условие", "Shartni koʻrsatish")}
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
            <b>{t("Ответ:", "Javob:")}</b> <RichText text={task.solution.answer} />
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
            <summary className="cursor-pointer font-extrabold">
              💡 {t("Подсказки по порядку", "Maslahatlar tartib bilan")}
            </summary>
            <ol className="mt-2 space-y-1.5 text-[0.95rem]">
              {task.hints.map((h, j) => (
                <li key={j}>
                  <b>
                    {j + 1}. {hintLabel(j, lang)}
                  </b>{" "}
                  <RichText text={h} />
                </li>
              ))}
            </ol>
          </details>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl bg-paper p-4">
            <h3 className="mb-1.5 text-sm font-extrabold text-muted uppercase">
              {t("Как решал Давлатжон", "Davlatjon qanday yechdi")}
            </h3>
            <Activity task={task} p={p} t={t} lang={lang} />
          </div>
          <div>
            <h3 className="mb-1.5 text-sm font-extrabold text-muted uppercase">
              {t("Мои наблюдения", "Kuzatuvlarim")}
            </h3>
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
                  {t(c.label, c.uz)}
                </button>
              ))}
            </div>
            <textarea
              defaultValue={p?.parentNote ?? ""}
              onBlur={(e) => updateTask(task.id, () => ({ parentNote: e.target.value }))}
              placeholder={t(
                "Что вы заметили? Например: «сначала ответил 6, потом сам нашёл большие квадраты».",
                "Nimani payqadingiz? Masalan: «avval 6 deb javob berdi, keyin katta kvadratlarni oʻzi topdi».",
              )}
              rows={2}
              className="mt-2 w-full rounded-2xl border-2 border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
