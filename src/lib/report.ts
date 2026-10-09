/**
 * Итоги недели для родителя. Всё считается из уже записанного прогресса (без отдельного хранилища),
 * поэтому одинаково работает на странице и на сервере (письмо в Telegram).
 *
 * Принципы текста: только то, что было на самом деле (минуты — из активного времени, а не «примерно»);
 * без процентов, рейтингов и сравнения с другими детьми; просьба о подсказке — нормальная часть учёбы;
 * неделя без занятий — не «провал», а просто тихая неделя.
 */
import { SECTIONS, sectionsFor } from "@/content/meta";
import { allTasks } from "@/content/program";
import type { SectionId } from "@/content/types";
import { minutesByDay } from "./activity";
import type { Lang } from "./lang";
import { plural } from "./plural";
import { GOAL_DAYS_DEFAULT, isoDay, type AppState } from "./state";

/** Понедельник недели, в которую попадает день (формат «ГГГГ-ММ-ДД»). */
export function weekStart(day: string): string {
  const d = new Date(`${day}T12:00:00`);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return isoDay(d.getTime());
}

export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00`);
  d.setDate(d.getDate() + n);
  return isoDay(d.getTime());
}

export interface WeeklyReport {
  /** Понедельник и воскресенье. */
  from: string;
  to: string;
  days: { day: string; minutes: number; active: boolean }[];
  activeDays: number;
  /** Приглашение родителя: сколько дней с занятиями. */
  goalDays: number;
  minutes: number;
  math: {
    solved: number;
    /** Сколько из решённых задач решено с подсказкой. */
    helped: number;
    /** Медиана времени на задачу, мин (null — нет данных). */
    medianMin: number | null;
    explained: number;
    anotherWay: number;
    hard: number;
    /** Разделы, где решено больше всего (до двух). */
    topSections: SectionId[];
  };
  chess: { exercises: number; puzzles: number; games: number; wins: number; openings: number };
  /** Было ли вообще что-то за неделю. */
  quiet: boolean;
}

const inRange = (ms: number | undefined, from: string, to: string) => {
  if (!ms) return false;
  const d = isoDay(ms);
  return d >= from && d <= to;
};

let sectionOfTask: Map<string, SectionId> | undefined;
const sectionOf = (id: string) => (sectionOfTask ??= new Map(allTasks().map((t) => [t.id, t.section]))).get(id);

function median(values: number[]): number | null {
  if (!values.length) return null;
  const v = [...values].sort((a, b) => a - b);
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

/** Отчёт за неделю, в которую попадает `anyDay` (Пн–Вс). */
export function weeklyReport(s: AppState, anyDay: string): WeeklyReport {
  const from = weekStart(anyDay);
  const to = addDays(from, 6);

  const solved = Object.entries(s.tasks).filter(([, t]) => inRange(t.solvedAt, from, to));
  const bySection = new Map<SectionId, number>();
  for (const [id] of solved) {
    const sec = sectionOf(id);
    if (sec) bySection.set(sec, (bySection.get(sec) ?? 0) + 1);
  }
  const topSections = [...bySection.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([sec]) => sec);

  const games = s.chessGames.filter((g) => inRange(g.at, from, to));
  const chess = {
    exercises: Object.values(s.chess).filter((e) => inRange(e.solvedAt, from, to)).length,
    puzzles:
      Object.values(s.chessPuzzles).filter((p) => inRange(p.solvedAt, from, to)).length +
      Object.values(s.chessOwnPuzzles).filter((at) => inRange(at, from, to)).length,
    games: games.length,
    wins: games.filter((g) => g.result === "win").length,
    openings: Object.values(s.chessOpenings).filter((at) => inRange(at, from, to)).length,
  };

  const perDay = minutesByDay(s, from, to);
  const worked = (day: string) => {
    const active = (s.activity[day]?.ms ?? 0) >= 60_000;
    const did =
      solved.some(([, t]) => t.solvedAt && isoDay(t.solvedAt) === day) ||
      games.some((g) => isoDay(g.at) === day) ||
      Object.values(s.chess).some((e) => e.solvedAt && isoDay(e.solvedAt) === day) ||
      Object.values(s.chessPuzzles).some((p) => p.solvedAt && isoDay(p.solvedAt) === day);
    return active || did;
  };
  const days = perDay.map((d) => ({ ...d, active: worked(d.day) }));
  const med = median(solved.map(([, t]) => t.timeMs).filter((ms) => ms > 0));

  const math = {
    solved: solved.length,
    helped: solved.filter(([, t]) => t.hints > 0).length,
    medianMin: med === null ? null : Math.max(1, Math.round(med / 60_000)),
    explained: solved.filter(([, t]) => t.marks.explained).length,
    anotherWay: solved.filter(([, t]) => t.marks.anotherWay).length,
    hard: solved.filter(([, t]) => t.marks.hard).length,
    topSections,
  };
  const total = perDay.reduce((n, d) => n + d.minutes, 0);
  const activeDays = days.filter((d) => d.active).length;
  const quiet = activeDays === 0 && total === 0 && !math.solved && !chess.exercises && !chess.puzzles && !chess.games;
  return {
    from,
    to,
    days,
    activeDays,
    goalDays: s.settings.goalDays ?? GOAL_DAYS_DEFAULT,
    minutes: total,
    math,
    chess,
    quiet,
  };
}

export interface ReportLine {
  emoji: string;
  text: string;
}

const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];
const MONTHS_UZ = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
];

/** «5–11 октября» / «28 сентября – 4 октября». */
export function rangeText(from: string, to: string, lang: Lang): string {
  const [, m1, d1] = from.split("-").map(Number);
  const [, m2, d2] = to.split("-").map(Number);
  if (lang === "uz")
    return m1 === m2 ? `${d1}–${d2}-${MONTHS_UZ[m1 - 1]}` : `${d1}-${MONTHS_UZ[m1 - 1]} – ${d2}-${MONTHS_UZ[m2 - 1]}`;
  return m1 === m2 ? `${d1}–${d2} ${MONTHS_RU[m1 - 1]}` : `${d1} ${MONTHS_RU[m1 - 1]} – ${d2} ${MONTHS_RU[m2 - 1]}`;
}

/** Читаемые строки отчёта на выбранном языке — для страницы, печати и Telegram. */
export function reportLines(r: WeeklyReport, lang: Lang): ReportLine[] {
  const uz = lang === "uz";
  if (r.quiet)
    return [
      {
        emoji: "🌙",
        text: uz
          ? "Bu hafta sokin oʻtdi — bu tabiiy. Yangi haftada bitta kichik masaladan boshlash yetarli."
          : "Эта неделя прошла тихо — это нормально. На новой неделе достаточно одной небольшой задачи.",
      },
    ];
  const lines: ReportLine[] = [];
  const dayWord = (n: number) => (uz ? `${n} kun` : `${n} ${plural(n, "день", "дня", "дней")}`);
  lines.push({
    emoji: "📅",
    text: uz
      ? `Mashgʻulot boʻlgan kunlar: ${r.activeDays} ta (haftalik taklif — ${dayWord(r.goalDays)}).`
      : `Дней с занятиями: ${r.activeDays} (приглашение недели — ${dayWord(r.goalDays)}).`,
  });
  if (r.minutes > 0)
    lines.push({
      emoji: "⏱",
      text: uz ? `Faol vaqt: ${r.minutes} daqiqa.` : `Активное время: ${r.minutes} мин.`,
    });
  const m = r.math;
  if (m.solved > 0) {
    const where = m.topSections.length
      ? uz
        ? ` Eng koʻp: ${m.topSections.map((id) => `«${sectionsFor("uz")[id].name}»`).join(", ")}.`
        : ` Чаще всего: ${m.topSections.map((id) => `«${SECTIONS[id].name}»`).join(", ")}.`
      : "";
    lines.push({
      emoji: "🔢",
      text: uz
        ? `Matematika: ${m.solved} ta masala yechildi.${where}`
        : `Математика: решено ${m.solved} ${plural(m.solved, "задача", "задачи", "задач")}.${where}`,
    });
    if (m.medianMin !== null)
      lines.push({
        emoji: "🧩",
        text: uz
          ? `Bitta masalaga odatda ~${m.medianMin} daqiqa ketdi.`
          : `На одну задачу обычно уходило около ${m.medianMin} мин.`,
      });
    if (m.helped > 0)
      lines.push({
        emoji: "💡",
        text: uz
          ? `${m.helped} ta masalada maslahat olindi — bu yaxshi odat: yordam soʻrash oʻrganishning bir qismi.`
          : `В ${m.helped} ${plural(m.helped, "задаче", "задачах", "задачах")} понадобилась подсказка — это хорошая привычка: просить помощь — часть учёбы.`,
      });
    if (m.explained > 0 || m.anotherWay > 0)
      lines.push({
        emoji: "🗣",
        text: uz
          ? `Yechimni tushuntirish: ${m.explained} ta; boshqa usul topish: ${m.anotherWay} ta.`
          : `Объяснено решений: ${m.explained}; найдено других способов: ${m.anotherWay}.`,
      });
    if (m.hard > 0)
      lines.push({
        emoji: "🤔",
        text: uz
          ? `«Qiyin boʻldi» deb belgilangan: ${m.hard} ta — nima qiyin boʻlganini soʻrab koʻring.`
          : `Отмечено «было трудно»: ${m.hard} — хороший повод спросить, что именно было сложным.`,
      });
  }
  const c = r.chess;
  if (c.exercises || c.puzzles || c.games || c.openings) {
    const parts: string[] = [];
    if (c.exercises)
      parts.push(
        uz
          ? `${c.exercises} ta mashq`
          : `${c.exercises} ${plural(c.exercises, "упражнение", "упражнения", "упражнений")}`,
      );
    if (c.puzzles)
      parts.push(uz ? `${c.puzzles} ta masala` : `${c.puzzles} ${plural(c.puzzles, "задача", "задачи", "задач")}`);
    if (c.games)
      parts.push(
        uz
          ? `${c.games} ta partiya${c.wins ? ` (${c.wins} ta gʻalaba)` : ""}`
          : `${c.games} ${plural(c.games, "партия", "партии", "партий")}${c.wins ? ` (побед: ${c.wins})` : ""}`,
      );
    if (c.openings)
      parts.push(uz ? `${c.openings} ta debyut` : `${c.openings} ${plural(c.openings, "дебют", "дебюта", "дебютов")}`);
    lines.push({ emoji: "♞", text: `${uz ? "Shaxmat" : "Шахматы"}: ${parts.join(", ")}.` });
  }
  return lines;
}

/** Текст сообщения в Telegram: без имени ребёнка. */
export function telegramText(r: WeeklyReport, lang: Lang): string {
  const head =
    lang === "uz"
      ? `Hafta yakunlari, ${rangeText(r.from, r.to, "uz")}`
      : `Итоги недели, ${rangeText(r.from, r.to, "ru")}`;
  return [head, "", ...reportLines(r, lang).map((l) => `${l.emoji} ${l.text}`)].join("\n");
}
