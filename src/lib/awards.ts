/** Награды и календарь занятий — всё вычисляется из прогресса, отдельно ничего не хранится. */
import { CHESS_LEVELS } from "@/content/chess";
import { FAMOUS_GAMES } from "@/content/chess/games";
import { PUZZLES } from "@/content/chess/puzzles";
import { currentRank } from "./chessProgress";
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

export function awards(s: AppState): Award[] {
  const robotWins = (level: number) =>
    s.chessGames.filter((g) => g.mode === "robot" && (g.level ?? 0) >= level && g.result === "win").length;
  const solved = PUZZLES.filter((p) => s.chessPuzzles[p.id]?.solvedAt).length;
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
  const tasksSolved = Object.values(s.tasks).filter((t) => t.status === "solved").length;
  const explained = Object.values(s.tasks).filter((t) => t.marks.explained).length;
  const a = (id: string, emoji: string, title: string, text: string, have: number, need: number): Award => ({
    id,
    emoji,
    title,
    text,
    have: Math.min(have, need),
    need,
  });
  return [
    a("day-1", "🌱", "Первый день", "Пройди первый день занятий.", daysDone, 1),
    a("week-1", "📅", "Целая неделя", "Пройди семь дней занятий.", daysDone, 7),
    a("tasks-50", "🧠", "Полсотни задач", "Реши 50 задач в занятиях.", tasksSolved, 50),
    a("explain-10", "💬", "Объясняю!", "Отметь «объяснил» в десяти задачах.", explained, 10),
    a("active-10", "🔥", "Десять дней с задачами", "Занимайся в десять разных дней.", days, 10),
    a("rank-pawn", "♟", "Звание «Пешка»", "Пройди первый уровень шахматной школы.", rankIndex, 1),
    a("rank-bishop", "♝", "Звание «Слон»", "Пройди три уровня шахматной школы.", rankIndex, 3),
    a("rank-king", "👑", "Звание «Король»", "Пройди всю шахматную школу.", rankIndex, 6),
    a("win-1", "🤖", "Первая победа", "Обыграй робота.", robotWins(1), 1),
    a("win-bishop", "🏆", "Победитель «Слона»", "Обыграй робота «Слон» или сильнее.", robotWins(3), 1),
    a("win-queen", "💎", "Победитель «Ферзя»", "Обыграй самого сильного робота.", robotWins(5), 1),
    a("puzzles-10", "🎯", "Десять задач", "Реши 10 шахматных задач.", solved, 10),
    a("puzzles-all", "🧩", "Все задачи", "Реши все задачи тренажёра.", solved, PUZZLES.length),
    a("streak-10", "⛓", "Серия 10", "Реши 10 задач подряд в «Серии».", s.chessStreak, 10),
    a("storm-10", "⚡", "Штормовой", "Реши 10 задач в «Шторме».", s.chessDrills.storm ?? 0, 10),
    a("coords-20", "📍", "Зоркий глаз", "Найди 20 клеток за 30 секунд.", s.chessDrills.find ?? 0, 20),
    a("openings-5", "📖", "Знаток дебютов", "Выучи 5 дебютов в тренажёре.", openings, 5),
    a("famous-all", "🏛️", "Историк", "Разбери все знаменитые партии.", viewed, FAMOUS_GAMES.length),
    a("guess-70", "🎩", "Как Морфи", "Набери 70% очков в «Угадай ход».", Math.round(bestGuess * 100), 70),
    a("review-1", "🔎", "Робот-тренер", "Разбери свою партию.", analysed, 1),
    a("accuracy-80", "🎯", "Точный игрок", "Сыграй партию с точностью 80% и выше.", bestAccuracy, 80),
    a("own-5", "🪞", "Учусь на ошибках", "Реши 5 задач из своих партий.", Object.keys(s.chessOwnPuzzles).length, 5),
    a("diary-3", "✍️", "Летописец", "Запиши три партии в дневник.", s.chessDiary.length, 3),
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
