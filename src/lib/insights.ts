import { SECTIONS } from "@/content/meta";
import type { Day, Task, Week } from "@/content/types";
import { formatMinutes, pluralize } from "./plural";
import type { AppState, TaskProgress } from "./store";

/** Отметки наблюдений, которые ставит родитель. */
export const PARENT_CHIPS = [
  { id: "self", label: "Решил сам" },
  { id: "hint", label: "С подсказкой" },
  { id: "explained", label: "Объяснил вслух" },
  { id: "another", label: "Нашёл другой способ" },
  { id: "checked", label: "Проверил себя" },
  { id: "persisted", label: "Не сдавался" },
  { id: "own", label: "Придумал свой вариант" },
  { id: "help", label: "Нужна помощь взрослого" },
] as const;

export type ChipId = (typeof PARENT_CHIPS)[number]["id"];

interface Row {
  day: Day;
  task: Task;
  p: TaskProgress | undefined;
}

function rows(week: Week, state: AppState): Row[] {
  return week.days.flatMap((day) => day.tasks.map((task) => ({ day, task, p: state.tasks[task.id] })));
}

const title = (r: Row) => `«${r.task.title}» (день ${r.day.day})`;
const list = (items: Row[], max = 6) =>
  items.length <= max
    ? items.map(title).join(", ")
    : `${items.slice(0, max).map(title).join(", ")} и ещё ${items.length - max}`;
const hasChip = (r: Row, chip: ChipId) => r.p?.parentChips?.includes(chip) ?? false;

function bySection(items: Row[]): string {
  const counts = new Map<string, number>();
  items.forEach((r) => counts.set(r.task.section, (counts.get(r.task.section) ?? 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([s, n]) => `${SECTIONS[s as Task["section"]].emoji} ${SECTIONS[s as Task["section"]].name} — ${n}`)
    .join(", ");
}

/**
 * Наблюдения по данным недели — описание поведения, без ярлыков.
 * Для каждого из 10 вопросов еженедельного обзора — список фактов.
 */
export function weekEvidence(week: Week, state: AppState): Record<string, string[]> {
  const all = rows(week, state);
  const solved = all.filter((r) => r.p?.status === "solved");
  const out: Record<string, string[]> = {};

  const fast = solved.filter((r) => (r.p?.hints ?? 0) === 0 && r.p?.firstTry);
  out.fast = fast.length
    ? [`Без подсказок и с первой попытки: ${list(fast)}.`, `По разделам: ${bySection(fast)}.`]
    : [];

  const missed = all.filter((r) => (r.p?.missed ?? 0) > 0);
  out.mistakes = missed.length
    ? [`Верный ответ получился не с первой попытки: ${list(missed)}.`, `По разделам: ${bySection(missed)}.`]
    : [];

  const liked = all.filter((r) => r.p?.marks.liked);
  const favorites = week.days
    .map((d) => ({ d, fav: d.tasks.find((t) => t.id === state.days[d.id]?.favorite) }))
    .filter((x) => x.fav)
    .map((x) => `«${x.fav!.title}» (день ${x.d.day})`);
  out.enjoys = [
    ...(liked.length ? [`Отмечено «Понравилась задача»: ${list(liked)}.`] : []),
    ...(favorites.length ? [`Самые интересные задачи дня: ${favorites.join(", ")}.`] : []),
  ];

  const hard = all.filter((r) => (r.p?.hints ?? 0) >= 3 || r.p?.marks.hard);
  out.difficult = hard.length
    ? [`3 и больше подсказок или отметка «Было трудно»: ${list(hard)}.`, `По разделам: ${bySection(hard)}.`]
    : [];

  const explained = all.filter((r) => r.p?.marks.explained || hasChip(r, "explained"));
  out.explains = solved.length
    ? [
        `Отметок «объяснил»: ${explained.length} из ${pluralize(solved.length, "решённой задачи", "решённых задач", "решённых задач")}.`,
      ]
    : [];

  const another = all.filter((r) => r.p?.marks.anotherWay || hasChip(r, "another"));
  const collectors = all.filter(
    (r) =>
      ["expressions", "partition", "rules", "magicTriangle", "wallLab"].includes(r.task.answer.kind) &&
      (r.p?.found?.length ?? 0) > 0,
  );
  out.alternatives = [
    ...(another.length ? [`Отметка «другой способ»: ${list(another)}.`] : []),
    ...collectors.map((r) => `${title(r)}: найдено вариантов — ${r.p!.found!.length}.`),
  ];

  const patterns = all.filter((r) => r.task.section === "pattern");
  const patternsSelf = patterns.filter((r) => r.p?.status === "solved" && (r.p?.hints ?? 0) === 0);
  out.patterns = patterns.some((r) => r.p?.status)
    ? [
        `Задачи на закономерности без подсказок: ${patternsSelf.length} из ${patterns.length}${patternsSelf.length ? ` (${list(patternsSelf, 4)})` : ""}.`,
      ]
    : [];

  const checked = all.filter((r) => hasChip(r, "checked"));
  out.checks = checked.length ? [`Вы отметили «Проверил себя»: ${list(checked)}.`] : [];

  const own = state.myProblems.length;
  const ownChip = all.filter((r) => hasChip(r, "own"));
  out.creates = [
    ...(own ? [`В разделе «Мои задачи» — ${pluralize(own, "задача", "задачи", "задач")}.`] : []),
    ...(ownChip.length ? [`Придумал свой вариант: ${list(ownChip)}.`] : []),
  ];

  const hardLevel = all.filter((r) => r.task.level >= 3 && r.p?.status);
  const hardSolved = hardLevel.filter((r) => r.p?.status === "solved");
  const afterHints = solved.filter((r) => (r.p?.hints ?? 0) >= 2 || (r.p?.missed ?? 0) >= 2);
  const hardTime = hardLevel.reduce((s, r) => s + (r.p?.timeMs ?? 0), 0);
  out.persists = [
    ...(hardLevel.length
      ? [
          `Задачи уровня 🟠–⭐: начато ${hardLevel.length}, решено ${hardSolved.length}; время на них — ${formatMinutes(hardTime)}.`,
        ]
      : []),
    ...(afterHints.length ? [`Довёл до решения после подсказок или нескольких попыток: ${list(afterHints)}.`] : []),
    ...(all.some((r) => hasChip(r, "persisted"))
      ? [`Вы отметили «Не сдавался»: ${list(all.filter((r) => hasChip(r, "persisted")))}.`]
      : []),
  ];

  return out;
}

export function weekTotals(week: Week, state: AppState) {
  const all = rows(week, state);
  return {
    tasks: all.length,
    solved: all.filter((r) => r.p?.status === "solved").length,
    daysDone: week.days.filter((d) => state.days[d.id]?.completedAt).length,
    timeMs: all.reduce((s, r) => s + (r.p?.timeMs ?? 0), 0),
    hints: all.reduce((s, r) => s + (r.p?.hints ?? 0), 0),
  };
}
