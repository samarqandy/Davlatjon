/**
 * Слияние прогресса с двух устройств (или браузера и аккаунта). Ничего не теряется:
 * решённое остаётся решённым, счётчики берутся наибольшие, списки объединяются по id.
 * Слияние симметрично по данным: merge(a, b) и merge(b, a) дают один и тот же прогресс;
 * отличаются только настройки — они берутся с этого устройства (a).
 */
import {
  sanitize,
  type AppState,
  type ChessExerciseProgress,
  type ChessPuzzleProgress,
  type DayProgress,
  type TaskProgress,
} from "./state";

type Rec<T> = Record<string, T>;

function minDefined(a: number | undefined, b: number | undefined): number | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return Math.min(a, b);
}

function union(a: string[] | undefined, b: string[] | undefined): string[] | undefined {
  if (!a && !b) return undefined;
  return [...new Set([...(a ?? []), ...(b ?? [])])].sort();
}

function mergeRecords<T>(a: Rec<T>, b: Rec<T>, merge: (x: T, y: T) => T): Rec<T> {
  const out: Rec<T> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = k in a ? merge(a[k], v) : v;
  return out;
}

function mergeById<T extends { id: string }>(a: T[], b: T[], pick: (x: T, y: T) => T = (x) => x): T[] {
  const map = new Map<string, T>();
  for (const x of [...a, ...b]) {
    const had = map.get(x.id);
    map.set(x.id, had ? pick(had, x) : x);
  }
  return [...map.values()];
}

function firstText(a: string | undefined, b: string | undefined): string | undefined {
  if (a && b) return a.length >= b.length ? a : b;
  return a || b || undefined;
}

function mergeTask(a: TaskProgress, b: TaskProgress): TaskProgress {
  const solvedAt = minDefined(a.solvedAt, b.solvedAt);
  const solved = a.status === "solved" || b.status === "solved";
  // Кто решил раньше — тот и определяет «с первой попытки» и сохранённый ввод.
  const first = a.solvedAt !== undefined && a.solvedAt === solvedAt ? a : b.solvedAt !== undefined ? b : a;
  const marks = { ...a.marks };
  for (const [k, v] of Object.entries(b.marks ?? {})) {
    const key = k as keyof TaskProgress["marks"];
    marks[key] = marks[key] || v;
  }
  return {
    ...a,
    ...b,
    status: solved ? "solved" : a.status || b.status,
    hints: Math.max(a.hints ?? 0, b.hints ?? 0),
    checks: Math.max(a.checks ?? 0, b.checks ?? 0),
    missed: Math.max(a.missed ?? 0, b.missed ?? 0),
    timeMs: Math.max(a.timeMs ?? 0, b.timeMs ?? 0),
    solvedAt,
    firstTry: solved ? first.firstTry : undefined,
    marks,
    found: union(a.found, b.found),
    input: first.input ?? a.input ?? b.input,
    parentChips: union(a.parentChips, b.parentChips),
    parentNote: firstText(a.parentNote, b.parentNote),
  };
}

function mergeDay(a: DayProgress, b: DayProgress): DayProgress {
  return {
    ...b,
    ...a,
    startedAt: minDefined(a.startedAt, b.startedAt),
    completedAt: minDefined(a.completedAt, b.completedAt),
    favorite: a.favorite ?? b.favorite,
    hardest: a.hardest ?? b.hardest,
    mood: a.mood ?? b.mood,
    parentNote: firstText(a.parentNote, b.parentNote),
  };
}

function mergeExercise(a: ChessExerciseProgress, b: ChessExerciseProgress): ChessExerciseProgress {
  const best = a.best === undefined ? b.best : b.best === undefined ? a.best : Math.min(a.best, b.best);
  return {
    solvedAt: minDefined(a.solvedAt, b.solvedAt),
    misses: Math.max(a.misses ?? 0, b.misses ?? 0),
    ...(best !== undefined ? { best } : {}),
    ...(a.found || b.found ? { found: union(a.found, b.found) } : {}),
  };
}

function mergePuzzle(a: ChessPuzzleProgress, b: ChessPuzzleProgress): ChessPuzzleProgress {
  // Интервальное повторение продолжаем с того устройства, где задачу повторяли позже.
  const later = (a.due ?? "") >= (b.due ?? "") ? a : b;
  return {
    solvedAt: minDefined(a.solvedAt, b.solvedAt),
    misses: Math.max(a.misses ?? 0, b.misses ?? 0),
    ...(later.box !== undefined ? { box: later.box } : {}),
    ...(later.due !== undefined ? { due: later.due } : {}),
  };
}

const later = <T extends { at: number }>(x: T | undefined, y: T | undefined): T | undefined =>
  !x ? y : !y ? x : y.at > x.at ? y : x;

const earliest = (x: number, y: number) => Math.min(x, y);
const largest = (x: number, y: number) => Math.max(x, y);

/** Прогресс этого устройства (a) и прогресс из аккаунта (b) → общий прогресс. */
export function mergeStates(localRaw: unknown, remoteRaw: unknown): AppState {
  const a = sanitize(localRaw);
  const b = sanitize(remoteRaw);
  // Имя — с того устройства, где его записали позже; пустое имя не затирает записанное.
  const named =
    !a.settings.childName || (b.settings.childName && (b.settings.childNameAt ?? 0) > (a.settings.childNameAt ?? 0))
      ? b
      : a;
  return {
    version: 1,
    tasks: mergeRecords(a.tasks, b.tasks, mergeTask),
    days: mergeRecords(a.days, b.days, mergeDay),
    myProblems: mergeById(a.myProblems, b.myProblems).sort((x, y) => x.createdAt - y.createdAt),
    reviews: mergeRecords(a.reviews, b.reviews, (x, y) => mergeRecords(x, y, (p, q) => firstText(p, q) ?? "")),
    settings: {
      ...b.settings,
      ...a.settings,
      age: a.settings.age ?? b.settings.age,
      dailyLimitMin: a.settings.dailyLimitMin ?? b.settings.dailyLimitMin,
      goalDays: a.settings.goalDays ?? b.settings.goalDays,
      reportToTelegram: a.settings.reportToTelegram ?? b.settings.reportToTelegram,
      avatar: a.settings.avatar ?? b.settings.avatar,
      startWeek: a.settings.startWeek ?? b.settings.startWeek,
      childName: named.settings.childName,
      childNameUz: named.settings.childNameUz,
      childNameAt: named.settings.childNameAt,
    },
    chess: mergeRecords(a.chess, b.chess, mergeExercise),
    // Одна и та же партия: берём ту запись, где уже есть разбор.
    chessGames: mergeById(a.chessGames, b.chessGames, (x, y) => (x.analysis || !y.analysis ? x : y))
      .sort((x, y) => y.at - x.at)
      .slice(0, 200),
    chessPuzzles: mergeRecords(a.chessPuzzles, b.chessPuzzles, mergePuzzle),
    // Рейтинг и «Дятел» — с того устройства, где их обновляли позже.
    chessRating: later(a.chessRating, b.chessRating),
    chessWoodpecker: later(a.chessWoodpecker, b.chessWoodpecker),
    chessStreak: Math.max(a.chessStreak, b.chessStreak),
    chessOpenings: mergeRecords(a.chessOpenings, b.chessOpenings, earliest),
    chessGamesViewed: mergeRecords(a.chessGamesViewed, b.chessGamesViewed, earliest),
    chessDiary: mergeById(a.chessDiary, b.chessDiary).sort((x, y) => x.createdAt - y.createdAt),
    chessOwnPuzzles: mergeRecords(a.chessOwnPuzzles, b.chessOwnPuzzles, earliest),
    chessGuess: mergeRecords(a.chessGuess, b.chessGuess, (x, y) =>
      x.score / (x.max || 1) >= y.score / (y.max || 1) ? x : y,
    ),
    chessDrills: mergeRecords(a.chessDrills, b.chessDrills, largest),
    chessEndgames: mergeRecords(a.chessEndgames, b.chessEndgames, earliest),
    // Время считаем на каждом устройстве по-своему; берём большее за день, чтобы ничего не терялось.
    activity: mergeRecords(a.activity, b.activity, (x, y) => {
      const extra = Math.max(x.extra ?? 0, y.extra ?? 0);
      return { ms: Math.max(x.ms, y.ms), ...(extra ? { extra } : {}) };
    }),
    welcomed: a.welcomed || b.welcomed,
  };
}

/** JSON с ключами по алфавиту — чтобы сравнивать объекты, собранные в разном порядке. */
function stable(x: unknown): string {
  if (Array.isArray(x)) return `[${x.map(stable).join(",")}]`;
  if (x && typeof x === "object") {
    const entries = Object.entries(x as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([k1], [k2]) => (k1 < k2 ? -1 : k1 > k2 ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`).join(",")}}`;
  }
  return JSON.stringify(x) ?? "null";
}

/** Одинаковый ли прогресс (без учёта настроек устройства) — чтобы не гонять лишние запросы. */
export function sameProgress(a: AppState, b: AppState): boolean {
  const strip = (s: AppState) =>
    stable({
      ...s,
      settings: {
        age: s.settings.age,
        childName: s.settings.childName,
        childNameUz: s.settings.childNameUz,
        dailyLimitMin: s.settings.dailyLimitMin,
        goalDays: s.settings.goalDays,
        reportToTelegram: s.settings.reportToTelegram,
        avatar: s.settings.avatar,
        startWeek: s.settings.startWeek,
      },
    });
  return strip(a) === strip(b);
}
