/**
 * Уроки доски тренера — только в этом браузере (localStorage), отдельно от прогресса ребёнка: в аккаунт и на
 * сервер не уходят. В уроке только позиции, ходы и задания — ни имён, ни других личных данных.
 * Всё, что читаем из хранилища, проверяем: туда мог попасть испорченный или чужой текст.
 */
import {
  LIMITS,
  SHAPE_COLORS,
  SIGN_KINDS,
  fensOf,
  isFenShape,
  isSquare,
  isUci,
  newLesson,
  normalizeFen,
  type MArrow,
  type MRing,
  type MentorBoard,
  type MentorLesson,
  type ShapeColor,
  type Shapes,
  type SignKind,
} from "./model";

export const LESSONS_KEY = "davlatjon-lab:mentor:v1";
export const PREFS_KEY = "davlatjon-lab:mentor-ui:v1";
/** Больше уроков не храним: самые старые уходят. */
export const MAX_LESSONS = 50;
/** Больше ~2 млн знаков в хранилище не пишем: у браузера на сайт около 5 МБ, и они нужны не только нам. */
export const MAX_CHARS = 2_000_000;

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
const text = (x: unknown, max: number) => (typeof x === "string" ? x.trim().slice(0, max) : "");
const colorOf = (x: unknown): ShapeColor | null => SHAPE_COLORS.find((c) => c === x) ?? null;
const signOf = (x: unknown): SignKind | null => SIGN_KINDS.find((k) => k === x) ?? null;

function parseShapes(raw: unknown): Shapes | null {
  if (!isObject(raw)) return null;
  const arrows: MArrow[] = [];
  const rings: MRing[] = [];
  const signs: Shapes["signs"] = {};
  if (raw.arrows !== undefined) {
    if (!Array.isArray(raw.arrows) || raw.arrows.length > LIMITS.arrows) return null;
    for (const a of raw.arrows) {
      const c = isObject(a) ? colorOf(a.c) : null;
      if (!isObject(a) || !c || !isSquare(a.from) || !isSquare(a.to) || a.from === a.to) return null;
      if (arrows.some((x) => x.from === a.from && x.to === a.to)) return null;
      arrows.push({ from: a.from, to: a.to, c });
    }
  }
  if (raw.rings !== undefined) {
    if (!Array.isArray(raw.rings) || raw.rings.length > LIMITS.rings) return null;
    for (const r of raw.rings) {
      const c = isObject(r) ? colorOf(r.c) : null;
      if (!isObject(r) || !c || !isSquare(r.sq) || rings.some((x) => x.sq === r.sq)) return null;
      rings.push({ sq: r.sq, c });
    }
  }
  if (raw.signs !== undefined) {
    if (!isObject(raw.signs)) return null;
    const entries = Object.entries(raw.signs);
    if (entries.length > LIMITS.signs) return null;
    for (const [sq, k] of entries) {
      const kind = signOf(k);
      if (!isSquare(sq) || !kind) return null;
      signs[sq] = kind;
    }
  }
  return { arrows, rings, signs };
}

function parseBoard(raw: unknown, ids: Set<string>, replay: boolean): MentorBoard | null {
  if (!isObject(raw)) return null;
  const id = text(raw.id, 40);
  if (!id || ids.has(id) || !isFenShape(raw.start)) return null;
  const start = normalizeFen(raw.start);
  if (!Array.isArray(raw.line) || raw.line.length > LIMITS.plies || !raw.line.every(isUci)) return null;
  const line = raw.line as string[];
  // Каждый ход должен делаться по правилам — иначе урок испорчен.
  if (replay && fensOf(start, line).length !== line.length + 1) return null;
  const shapes: Record<string, Shapes> = {};
  if (raw.shapes !== undefined) {
    if (!isObject(raw.shapes)) return null;
    for (const [k, v] of Object.entries(raw.shapes)) {
      const ply = Number(k);
      if (!/^\d+$/.test(k) || ply > line.length) return null;
      const s = parseShapes(v);
      if (!s) return null;
      if (s.arrows.length || s.rings.length || Object.keys(s.signs).length) shapes[String(ply)] = s;
    }
  }
  ids.add(id);
  return {
    id,
    task: text(raw.task, LIMITS.task),
    start,
    line,
    shapes,
    orientation: raw.orientation === "black" ? "black" : "white",
  };
}

/**
 * Урок из произвольных данных (хранилище, позже — файл). Лишние поля отбрасываются, строки обрезаются;
 * если хоть одна доска испорчена, урок не принимается целиком — молча «чинить» чужие данные нельзя.
 *
 * replay: false — только проверка записи, без проигрывания ходов. Так читается список уроков в хранилище:
 * урок с партиями из базы — это тысячи полуходов, и проигрывать все уроки на каждое сохранение и при открытии
 * страницы — секунды на панели класса. Ходы проигрываются у того урока, который открывают (openLesson).
 */
export function parseLesson(raw: unknown, { replay = true }: { replay?: boolean } = {}): MentorLesson | null {
  if (!isObject(raw) || raw.version !== 1) return null;
  if (!Array.isArray(raw.boards) || raw.boards.length < 1 || raw.boards.length > LIMITS.boards) return null;
  const ids = new Set<string>();
  const boards: MentorBoard[] = [];
  for (const b of raw.boards) {
    const board = parseBoard(b, ids, replay);
    if (!board) return null;
    boards.push(board);
  }
  const id = text(raw.id, 40);
  if (!id) return null;
  const now = Date.now();
  const createdAt = typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt) ? raw.createdAt : now;
  const updatedAt = typeof raw.updatedAt === "number" && Number.isFinite(raw.updatedAt) ? raw.updatedAt : createdAt;
  return { version: 1, id, title: text(raw.title, LIMITS.title), createdAt, updatedAt, boards };
}

export interface Saved {
  lessons: MentorLesson[];
  current?: { lessonId: string; board: number };
}

/** Что лежит в хранилище. Испорченное или чужое — пустой список. */
export function readSaved(storage: Pick<Storage, "getItem"> | null): Saved {
  try {
    const raw: unknown = JSON.parse(storage?.getItem(LESSONS_KEY) ?? "null");
    if (!isObject(raw) || raw.version !== 1 || !Array.isArray(raw.lessons)) return { lessons: [] };
    const seen = new Set<string>();
    const lessons = raw.lessons
      .map((l) => parseLesson(l, { replay: false }))
      .filter((l): l is MentorLesson => !!l && !seen.has(l.id) && !!seen.add(l.id))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_LESSONS);
    const cur = isObject(raw.current) ? raw.current : null;
    const current =
      cur &&
      typeof cur.lessonId === "string" &&
      typeof cur.board === "number" &&
      lessons.some((l) => l.id === cur.lessonId)
        ? { lessonId: cur.lessonId, board: Math.max(0, Math.round(cur.board)) }
        : undefined;
    return current ? { lessons, current } : { lessons };
  } catch {
    return { lessons: [] };
  }
}

/** Все ходы всех досок урока делаются по правилам. */
const playable = (lesson: MentorLesson) =>
  lesson.boards.every((b) => fensOf(b.start, b.line).length === b.line.length + 1);

/**
 * Урок, который открыть: последний открытый, иначе самый свежий, иначе новый «Урок 1». Ходы проигрываются только
 * здесь и только у выбранного урока; урок с ходом не по правилам не открывается — берётся следующий.
 */
export function openLesson(saved: Saved, defaultTitle: string): { lesson: MentorLesson; board: number } {
  const current = saved.lessons.find((l) => l.id === saved.current?.lessonId);
  const lesson =
    [current, ...saved.lessons].find((l): l is MentorLesson => !!l && playable(l)) ?? newLesson(defaultTitle);
  const board = saved.current?.lessonId === lesson.id ? Math.min(saved.current.board, lesson.boards.length - 1) : 0;
  return { lesson, board };
}

export type SaveResult = "ok" | "full" | "unavailable";

/**
 * Записать урок (новые — сверху) и какой урок открыт. Не пишем, если вышло больше MAX_CHARS или браузер
 * отказал (место кончилось, приватный режим): тогда урок живёт до закрытия вкладки, и тренер видит предупреждение.
 */
export function writeLesson(
  storage: Pick<Storage, "getItem" | "setItem"> | null,
  lesson: MentorLesson,
  board: number,
): SaveResult {
  if (!storage) return "unavailable";
  const saved = readSaved(storage);
  const lessons = [lesson, ...saved.lessons.filter((l) => l.id !== lesson.id)].slice(0, MAX_LESSONS);
  const json = JSON.stringify({ version: 1, lessons, current: { lessonId: lesson.id, board } });
  if (json.length > MAX_CHARS) return "full";
  try {
    storage.setItem(LESSONS_KEY, json);
    return "ok";
  } catch (e) {
    return e instanceof DOMException && /quota/i.test(e.name) ? "full" : "unavailable";
  }
}

// ─── Настройки показа ───────────────────────────────────────────────────────

export type MentorMode = "move" | "draw" | "setup";

export interface MentorPrefs {
  /** С какой стороны от доски кнопки в режиме класса (тренер стоит слева или справа от панели). */
  side: "left" | "right";
  coords: boolean;
  /** Доска пониже — чтобы маленький ученик у большой панели дотянулся до верхних клеток. */
  low: boolean;
  /** Вид доски в режиме класса: контрастный «для класса» или выбранный на этом устройстве. */
  look: "class" | "device";
  /** Скорость ходов в режиме класса: медленнее — чтобы из-за последней парты было видно, откуда и куда. */
  speed: "slow" | "normal";
  /** Запись ходов в режиме класса (по умолчанию скрыта — «Дальше» тогда показывает следующий ход). */
  showMoves: boolean;
  mode: MentorMode;
  color: ShapeColor;
}

export const DEFAULT_PREFS: MentorPrefs = {
  side: "left",
  coords: true,
  low: false,
  look: "class",
  speed: "slow",
  showMoves: false,
  mode: "move",
  color: "G",
};

export function parsePrefs(raw: unknown): MentorPrefs {
  if (!isObject(raw)) return DEFAULT_PREFS;
  const pick = <T extends string>(x: unknown, all: readonly T[], d: T): T => all.find((v) => v === x) ?? d;
  return {
    side: pick(raw.side, ["left", "right"], DEFAULT_PREFS.side),
    coords: typeof raw.coords === "boolean" ? raw.coords : DEFAULT_PREFS.coords,
    low: typeof raw.low === "boolean" ? raw.low : DEFAULT_PREFS.low,
    look: pick(raw.look, ["class", "device"], DEFAULT_PREFS.look),
    speed: pick(raw.speed, ["slow", "normal"], DEFAULT_PREFS.speed),
    showMoves: typeof raw.showMoves === "boolean" ? raw.showMoves : DEFAULT_PREFS.showMoves,
    mode: pick(raw.mode, ["move", "draw", "setup"], DEFAULT_PREFS.mode),
    color: colorOf(raw.color) ?? DEFAULT_PREFS.color,
  };
}

export function readPrefs(storage: Pick<Storage, "getItem"> | null): MentorPrefs {
  try {
    return parsePrefs(JSON.parse(storage?.getItem(PREFS_KEY) ?? "null"));
  } catch {
    return DEFAULT_PREFS;
  }
}

export function writePrefs(storage: Pick<Storage, "setItem"> | null, prefs: MentorPrefs) {
  try {
    storage?.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Хранилище недоступно — настройки живут до закрытия вкладки.
  }
}

/** Хранилище браузера, если оно есть и доступно (в приватном режиме обращение может бросить ошибку). */
export function browserStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}
