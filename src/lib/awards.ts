/** Награды и календарь занятий — всё вычисляется из прогресса, отдельно ничего не хранится. */
import { CHESS_LEVELS } from "@/content/chess";
import { FAMOUS_GAMES } from "@/content/chess/games";
import { PUZZLES } from "@/content/chess/puzzles";
import { pluralize } from "./plural";
import { solvedCount } from "./puzzleStats";
import { currentRank } from "./chessProgress";
import { crownsFor } from "./crowns";
import { tFor, type Lang } from "./lang";
import { isoDay, type AppState } from "./store";

export interface Award {
  id: string;
  emoji: string;
  title: string;
  text: string;
  /** Сколько сделано и сколько нужно. */
  have: number;
  need: number;
}

export function earned(a: Award): boolean {
  return a.have >= a.need;
}

export function awards(s: AppState, lang: Lang = "ru"): Award[] {
  const t = tFor(lang);
  const robotWins = (level: number) =>
    s.chessGames.filter((g) => g.mode === "robot" && (g.level ?? 0) >= level && g.result === "win").length;
  // Решённые задачи: школы и из базы Lichess; «все задачи школы» — отдельно.
  const solved = solvedCount(s.chessPuzzles);
  const classicSolved = PUZZLES.filter((p) => s.chessPuzzles[p.id]?.solvedAt).length;
  const openings = new Set(Object.keys(s.chessOpenings).map((k) => k.split(":")[0])).size;
  const viewed = FAMOUS_GAMES.filter((g) => s.chessGamesViewed[g.id]).length;
  const analysed = s.chessGames.filter((g) => g.analysis).length;
  const bestAccuracy = Math.max(
    0,
    ...s.chessGames.filter((g) => g.mode === "robot" && g.analysis?.acc).map((g) => g.analysis!.acc![g.color]),
  );
  const bestGuess = Math.max(0, ...Object.values(s.chessGuess).map((g) => (g.max ? g.score / g.max : 0)));
  const rank = currentRank(CHESS_LEVELS, s);
  const rankIndex = rank ? CHESS_LEVELS.indexOf(rank) + 1 : 0;
  const days = Object.keys(activityDays(s)).length;
  const daysDone = Object.values(s.days).filter((d) => d.completedAt).length;
  const tasksSolved = Object.values(s.tasks).filter((x) => x.status === "solved").length;
  const explained = Object.values(s.tasks).filter((x) => x.marks.explained).length;
  const a = (id: string, emoji: string, title: string, text: string, have: number, need: number): Award => ({
    id,
    emoji,
    title,
    text,
    have: Math.min(have, need),
    need,
  });
  return [
    a(
      "day-1",
      "🌱",
      t("Первый день", "Birinchi kun"),
      t("Пройди первый день занятий.", "Mashgʻulotlarning birinchi kunini tugat."),
      daysDone,
      1,
    ),
    a(
      "week-1",
      "📅",
      t("Целая неделя", "Butun bir hafta"),
      t("Пройди семь дней занятий.", "Mashgʻulotlarning yetti kunini tugat."),
      daysDone,
      7,
    ),
    a(
      "tasks-50",
      "🧠",
      t("Полсотни задач", "Ellikta masala"),
      t("Реши 50 задач в занятиях.", "Mashgʻulotlarda 50 ta masala yech."),
      tasksSolved,
      50,
    ),
    a(
      "explain-10",
      "💬",
      t("Объясняю!", "Tushuntiraman!"),
      t("Отметь «объяснил» в десяти задачах.", "Oʻnta masalada «tushuntirdim» deb belgila."),
      explained,
      10,
    ),
    a(
      "active-10",
      "🔥",
      t("Десять дней с задачами", "Masalalar bilan oʻn kun"),
      t("Занимайся в десять разных дней.", "Oʻn xil kunda shugʻullan."),
      days,
      10,
    ),
    a(
      "rank-pawn",
      "♟",
      t("Звание «Пешка»", "«Piyoda» unvoni"),
      t("Пройди первый уровень шахматной школы.", "Shaxmat maktabining birinchi darajasini oʻt."),
      rankIndex,
      1,
    ),
    a(
      "rank-bishop",
      "♝",
      t("Звание «Слон»", "«Fil» unvoni"),
      t("Пройди три уровня шахматной школы.", "Shaxmat maktabining uchta darajasini oʻt."),
      rankIndex,
      3,
    ),
    a(
      "rank-king",
      "👑",
      t("Звание «Король»", "«Shoh» unvoni"),
      t("Пройди всю шахматную школу.", "Butun shaxmat maktabini oʻt."),
      rankIndex,
      6,
    ),
    a("win-1", "🤖", t("Первая победа", "Birinchi gʻalaba"), t("Обыграй робота.", "Robotni yut."), robotWins(1), 1),
    a(
      "win-bishop",
      "🏆",
      t("Победитель «Слона»", "«Fil» ustidan gʻalaba"),
      t("Обыграй робота «Слон» или сильнее.", "«Fil» robotini yoki undan kuchlirogʻini yut."),
      robotWins(3),
      1,
    ),
    a(
      "win-queen",
      "💎",
      t("Победитель «Ферзя»", "«Farzin» ustidan gʻalaba"),
      t("Обыграй самого сильного робота.", "Eng kuchli robotni yut."),
      robotWins(5),
      1,
    ),
    a(
      "crowns-3",
      "👑",
      t("Три короны", "Uchta toj"),
      t("Обыграй робота без подсказок и отмен ходов.", "Robotni maslahatsiz va yurishni qaytarmasdan yut."),
      s.chessGames.some((g) => crownsFor(g) === 3) ? 1 : 0,
      1,
    ),
    a(
      "puzzles-10",
      "🎯",
      t("Десять задач", "Oʻnta masala"),
      t("Реши 10 шахматных задач.", "10 ta shaxmat masalasini yech."),
      solved,
      10,
    ),
    a(
      "puzzles-100",
      "💯",
      t("Сто задач", "Yuzta masala"),
      t("Реши 100 шахматных задач.", "100 ta shaxmat masalasini yech."),
      solved,
      100,
    ),
    a(
      "puzzles-all",
      "🧩",
      t("Все задачи школы", "Maktabning barcha masalalari"),
      t(
        `Реши все ${pluralize(PUZZLES.length, "задачу", "задачи", "задач")} школы — с объяснениями.`,
        `Maktabning izohli ${PUZZLES.length} ta masalasini yech.`,
      ),
      classicSolved,
      PUZZLES.length,
    ),
    a(
      "streak-10",
      "⛓",
      t("Серия 10", "Ketma-ket 10"),
      t("Реши 10 задач подряд в «Серии».", "«Ketma-ket» mashqida 10 ta masalani uzluksiz yech."),
      s.chessStreak,
      10,
    ),
    a(
      "storm-10",
      "⚡",
      t("Штормовой", "Boʻron ustasi"),
      t("Реши 10 задач в «Шторме».", "«Boʻron»da 10 ta masala yech."),
      s.chessDrills.storm ?? 0,
      10,
    ),
    a(
      "coords-20",
      "📍",
      t("Зоркий глаз", "Oʻtkir koʻz"),
      t("Найди 20 клеток за 30 секунд.", "30 soniyada 20 ta katakni top."),
      s.chessDrills.find ?? 0,
      20,
    ),
    a(
      "openings-5",
      "📖",
      t("Знаток дебютов", "Debyut bilimdoni"),
      t("Выучи 5 дебютов в тренажёре.", "Trenajyorda 5 ta debyutni oʻrgan."),
      openings,
      5,
    ),
    a(
      "famous-all",
      "🏛️",
      t("Историк", "Tarixchi"),
      t("Разбери все знаменитые партии.", "Barcha mashhur partiyalarni tahlil qil."),
      viewed,
      FAMOUS_GAMES.length,
    ),
    a(
      "guess-70",
      "🎩",
      t("Как Морфи", "Morfi kabi"),
      t("Набери 70% очков в «Угадай ход».", "«Yurishni top» oʻyinida 70% ochko toʻpla."),
      Math.round(bestGuess * 100),
      70,
    ),
    a(
      "review-1",
      "🔎",
      t("Робот-тренер", "Robot-murabbiy"),
      t("Разбери свою партию.", "Oʻz partiyangni tahlil qil."),
      analysed,
      1,
    ),
    a(
      "accuracy-80",
      "🎯",
      t("Точный игрок", "Aniq oʻyinchi"),
      t("Сыграй партию с точностью 80% и выше.", "Partiyani 80% va undan yuqori aniqlik bilan oʻyna."),
      bestAccuracy,
      80,
    ),
    a(
      "own-5",
      "🪞",
      t("Учусь на ошибках", "Xatolardan saboq"),
      t("Реши 5 задач из своих партий.", "Oʻz partiyalaringdan olingan 5 ta masalani yech."),
      Object.keys(s.chessOwnPuzzles).length,
      5,
    ),
    a(
      "diary-3",
      "✍️",
      t("Летописец", "Solnomachi"),
      t("Запиши три партии в дневник.", "Kundalikka uchta partiyani yozib qoʻy."),
      s.chessDiary.length,
      3,
    ),
  ];
}

/** День → сколько дел в этот день: решённые задачи, партии, пройденные дни. */
export function activityDays(s: AppState): Record<string, number> {
  const out: Record<string, number> = {};
  const add = (ms: number | undefined) => {
    if (!ms) return;
    const d = isoDay(ms);
    out[d] = (out[d] ?? 0) + 1;
  };
  for (const t of Object.values(s.tasks)) add(t.solvedAt);
  for (const d of Object.values(s.days)) add(d.completedAt);
  for (const g of s.chessGames) add(g.at);
  for (const p of Object.values(s.chessPuzzles)) add(p.solvedAt);
  for (const c of Object.values(s.chess)) add(c.solvedAt);
  for (const v of Object.values(s.chessOpenings)) add(v);
  for (const v of Object.values(s.chessOwnPuzzles)) add(v);
  return out;
}

/** Сколько дней подряд были занятия, считая сегодня (или вчера, если сегодня ещё не занимались). */
export function dayStreak(days: Record<string, number>, today: string): number {
  const d = new Date(`${today}T12:00:00`);
  if (!days[today]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days[isoDay(d.getTime())]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
