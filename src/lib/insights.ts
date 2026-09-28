import { sectionsFor } from "@/content/meta";
import type { AnswerSpec, Level, SectionId, Week } from "@/content/types";
import { tFor, type Lang } from "./lang";
import { formatMinutes, pluralize } from "./plural";
import type { AppState, TaskProgress } from "./store";

/** Отметки наблюдений, которые ставит родитель. */
export const PARENT_CHIPS = [
  { id: "self", label: "Решил сам", uz: "Oʻzi yechdi" },
  { id: "hint", label: "С подсказкой", uz: "Maslahat bilan" },
  { id: "explained", label: "Объяснил вслух", uz: "Ovoz chiqarib tushuntirdi" },
  { id: "another", label: "Нашёл другой способ", uz: "Boshqa usul topdi" },
  { id: "checked", label: "Проверил себя", uz: "Javobini tekshirdi" },
  { id: "persisted", label: "Не сдавался", uz: "Taslim boʻlmadi" },
  { id: "own", label: "Придумал свой вариант", uz: "Oʻz variantini oʻylab topdi" },
  { id: "help", label: "Нужна помощь взрослого", uz: "Kattalar yordami kerak" },
] as const;

export type ChipId = (typeof PARENT_CHIPS)[number]["id"];

/**
 * Что нужно знать о неделе для наблюдений и итогов — без условий и решений задач.
 * Полная неделя (Week) тоже подходит; на страницы уходит облегчённая версия на обоих языках.
 */
export interface WeekFacts {
  number: number;
  days: {
    id: string;
    day: number;
    tasks: { id: string; title: string; section: SectionId; level: Level; answer: { kind: AnswerSpec["kind"] } }[];
  }[];
}

/** Облегчённая неделя для наблюдений — собирается на сервере. */
export function weekFacts(week: Week): WeekFacts {
  return {
    number: week.number,
    days: week.days.map((d) => ({
      id: d.id,
      day: d.day,
      tasks: d.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        section: t.section,
        level: t.level,
        answer: { kind: t.answer.kind },
      })),
    })),
  };
}

type FactDay = WeekFacts["days"][number];
type FactTask = FactDay["tasks"][number];

interface Row {
  day: FactDay;
  task: FactTask;
  p: TaskProgress | undefined;
}

function rows(week: WeekFacts, state: AppState): Row[] {
  return week.days.flatMap((day) => day.tasks.map((task) => ({ day, task, p: state.tasks[task.id] })));
}

const hasChip = (r: Row, chip: ChipId) => r.p?.parentChips?.includes(chip) ?? false;

/**
 * Наблюдения по данным недели — описание поведения, без ярлыков.
 * Для каждого из 10 вопросов еженедельного обзора — список фактов.
 */
export function weekEvidence(week: WeekFacts, state: AppState, lang: Lang = "ru"): Record<string, string[]> {
  const t = tFor(lang);
  const SECTIONS = sectionsFor(lang);
  const title = (r: Row) => t(`«${r.task.title}» (день ${r.day.day})`, `«${r.task.title}» (${r.day.day}-kun)`);
  const list = (items: Row[], max = 6) =>
    items.length <= max
      ? items.map(title).join(", ")
      : `${items.slice(0, max).map(title).join(", ")}${t(` и ещё ${items.length - max}`, ` va yana ${items.length - max} ta`)}`;
  const bySection = (items: Row[]): string => {
    const counts = new Map<SectionId, number>();
    items.forEach((r) => counts.set(r.task.section, (counts.get(r.task.section) ?? 0) + 1));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([s, n]) => `${SECTIONS[s].emoji} ${SECTIONS[s].name} — ${n}`)
      .join(", ");
  };
  const sections = (items: Row[]) => t(`По разделам: ${bySection(items)}.`, `Boʻlimlar boʻyicha: ${bySection(items)}.`);

  const all = rows(week, state);
  const solved = all.filter((r) => r.p?.status === "solved");
  const out: Record<string, string[]> = {};

  const fast = solved.filter((r) => (r.p?.hints ?? 0) === 0 && r.p?.firstTry);
  out.fast = fast.length
    ? [
        t(`Без подсказок и с первой попытки: ${list(fast)}.`, `Maslahatsiz va birinchi urinishda: ${list(fast)}.`),
        sections(fast),
      ]
    : [];

  const missed = all.filter((r) => (r.p?.missed ?? 0) > 0);
  out.mistakes = missed.length
    ? [
        t(
          `Верный ответ получился не с первой попытки: ${list(missed)}.`,
          `Toʻgʻri javob birinchi urinishda chiqmagan masalalar: ${list(missed)}.`,
        ),
        sections(missed),
      ]
    : [];

  const liked = all.filter((r) => r.p?.marks.liked);
  const favorites = week.days
    .map((d) => ({ d, fav: d.tasks.find((task) => task.id === state.days[d.id]?.favorite) }))
    .filter((x) => x.fav)
    .map((x) => t(`«${x.fav!.title}» (день ${x.d.day})`, `«${x.fav!.title}» (${x.d.day}-kun)`));
  out.enjoys = [
    ...(liked.length
      ? [t(`Отмечено «Понравилась задача»: ${list(liked)}.`, `«Masala yoqdi» deb belgilangan: ${list(liked)}.`)]
      : []),
    ...(favorites.length
      ? [
          t(
            `Самые интересные задачи дня: ${favorites.join(", ")}.`,
            `Kunning eng qiziq masalalari: ${favorites.join(", ")}.`,
          ),
        ]
      : []),
  ];

  const hard = all.filter((r) => (r.p?.hints ?? 0) >= 3 || r.p?.marks.hard);
  out.difficult = hard.length
    ? [
        t(
          `3 и больше подсказок или отметка «Было трудно»: ${list(hard)}.`,
          `3 va undan koʻp maslahat yoki «Qiyin boʻldi» belgisi: ${list(hard)}.`,
        ),
        sections(hard),
      ]
    : [];

  const explained = all.filter((r) => r.p?.marks.explained || hasChip(r, "explained"));
  out.explains = solved.length
    ? [
        t(
          `Отметок «объяснил»: ${explained.length} из ${pluralize(solved.length, "решённой задачи", "решённых задач", "решённых задач")}.`,
          `«Tushuntirdi» belgisi: yechilgan ${solved.length} ta masaladan ${explained.length} tasida.`,
        ),
      ]
    : [];

  const another = all.filter((r) => r.p?.marks.anotherWay || hasChip(r, "another"));
  const collectors = all.filter(
    (r) =>
      ["expressions", "partition", "rules", "magicTriangle", "wallLab", "weightsLab"].includes(r.task.answer.kind) &&
      (r.p?.found?.length ?? 0) > 0,
  );
  out.alternatives = [
    ...(another.length
      ? [t(`Отметка «другой способ»: ${list(another)}.`, `«Boshqa usul» belgisi: ${list(another)}.`)]
      : []),
    ...collectors.map((r) =>
      t(
        `${title(r)}: найдено вариантов — ${r.p!.found!.length}.`,
        `${title(r)}: ${r.p!.found!.length} ta variant topildi.`,
      ),
    ),
  ];

  const patterns = all.filter((r) => r.task.section === "pattern");
  const patternsSelf = patterns.filter((r) => r.p?.status === "solved" && (r.p?.hints ?? 0) === 0);
  const patternsList = patternsSelf.length ? ` (${list(patternsSelf, 4)})` : "";
  out.patterns = patterns.some((r) => r.p?.status)
    ? [
        t(
          `Задачи на закономерности без подсказок: ${patternsSelf.length} из ${patterns.length}${patternsList}.`,
          `Qonuniyatlarga oid ${patterns.length} ta masaladan ${patternsSelf.length} tasi maslahatsiz yechildi${patternsList}.`,
        ),
      ]
    : [];

  const checked = all.filter((r) => hasChip(r, "checked"));
  out.checks = checked.length
    ? [
        t(
          `Вы отметили «Проверил себя»: ${list(checked)}.`,
          `Siz «Javobini tekshirdi» deb belgiladingiz: ${list(checked)}.`,
        ),
      ]
    : [];

  const own = state.myProblems.length;
  const ownChip = all.filter((r) => hasChip(r, "own"));
  out.creates = [
    ...(own
      ? [
          t(
            `В разделе «Мои задачи» — ${pluralize(own, "задача", "задачи", "задач")}.`,
            `«Mening masalalarim» boʻlimida — ${own} ta masala.`,
          ),
        ]
      : []),
    ...(ownChip.length
      ? [t(`Придумал свой вариант: ${list(ownChip)}.`, `Oʻz variantini oʻylab topdi: ${list(ownChip)}.`)]
      : []),
  ];

  const hardLevel = all.filter((r) => r.task.level >= 3 && r.p?.status);
  const hardSolved = hardLevel.filter((r) => r.p?.status === "solved");
  const afterHints = solved.filter((r) => (r.p?.hints ?? 0) >= 2 || (r.p?.missed ?? 0) >= 2);
  const hardTime = formatMinutes(
    hardLevel.reduce((s, r) => s + (r.p?.timeMs ?? 0), 0),
    lang,
  );
  const persisted = all.filter((r) => hasChip(r, "persisted"));
  out.persists = [
    ...(hardLevel.length
      ? [
          t(
            `Задачи уровня 🟠–⭐: начато ${hardLevel.length}, решено ${hardSolved.length}; время на них — ${hardTime}.`,
            `🟠–⭐ darajadagi masalalar: ${hardLevel.length} tasi boshlandi, ${hardSolved.length} tasi yechildi; ularga ${hardTime} vaqt ketdi.`,
          ),
        ]
      : []),
    ...(afterHints.length
      ? [
          t(
            `Довёл до решения после подсказок или нескольких попыток: ${list(afterHints)}.`,
            `Maslahat olib yoki bir necha bor urinib, baribir yechdi: ${list(afterHints)}.`,
          ),
        ]
      : []),
    ...(persisted.length
      ? [
          t(
            `Вы отметили «Не сдавался»: ${list(persisted)}.`,
            `Siz «Taslim boʻlmadi» deb belgiladingiz: ${list(persisted)}.`,
          ),
        ]
      : []),
  ];

  return out;
}

/** Итоги недели в цифрах: хватает id дней и задач. */
export function weekTotals(week: { days: { id: string; tasks: { id: string }[] }[] }, state: AppState) {
  const all = week.days.flatMap((d) => d.tasks.map((task) => state.tasks[task.id]));
  return {
    tasks: all.length,
    solved: all.filter((p) => p?.status === "solved").length,
    daysDone: week.days.filter((d) => state.days[d.id]?.completedAt).length,
    timeMs: all.reduce((s, p) => s + (p?.timeMs ?? 0), 0),
    hints: all.reduce((s, p) => s + (p?.hints ?? 0), 0),
  };
}
