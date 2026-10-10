/**
 * Партии по сети: чистая логика без базы и без React — её используют и сервер (проверяет каждый ход),
 * и браузер (рисует часы и доску). Здесь же правила имён, сообщений и работа часов.
 */
import { Chess } from "chess.js";

export type Side = "w" | "b";
export type GameStatus = "invited" | "active" | "finished" | "declined";
export type GameResult = "1-0" | "0-1" | "1/2-1/2";
export type EndReason =
  "checkmate" | "resign" | "timeout" | "stalemate" | "repetition" | "insufficient" | "fifty" | "agreement" | "aborted";

/** Контроль времени: базовое время и добавка за ход, секунды. base = 0 — без часов. */
export interface TimeControl {
  id: string;
  baseS: number;
  incS: number;
}

export const TIME_CONTROLS: readonly TimeControl[] = [
  { id: "none", baseS: 0, incS: 0 },
  { id: "5+0", baseS: 300, incS: 0 },
  { id: "10+0", baseS: 600, incS: 0 },
  { id: "15+10", baseS: 900, incS: 10 },
];

export function timeControlOf(id: unknown): TimeControl | null {
  return TIME_CONTROLS.find((tc) => tc.id === id) ?? null;
}

export function timeControlLabel(tc: Pick<TimeControl, "baseS" | "incS">): string {
  if (!tc.baseS) return "∞";
  return tc.incS ? `${tc.baseS / 60}+${tc.incS}` : `${tc.baseS / 60}`;
}

/** Первые два хода (по одному у каждого) идут без часов: время не тратится, пока партия не началась. */
export const FREE_PLIES = 2;
/** Приглашение, на которое не ответили, через неделю считается устаревшим. */
export const INVITE_TTL_MS = 7 * 86_400_000;

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Партия так, как она лежит в базе. */
export interface GameRow {
  id: string;
  /** id аккаунтов, а не имена. */
  white: string;
  black: string;
  invitedBy: string;
  status: GameStatus;
  /** Ходы в записи UCI: «e2e4», «e7e8q». */
  moves: string[];
  fen: string;
  baseS: number;
  incS: number;
  /** Остаток времени на момент clockAt, миллисекунды. */
  whiteMs: number;
  blackMs: number;
  /** С какого момента (мс от эпохи) идёт часы стороны, чей ход; 0 — часы ещё не запущены. */
  clockAt: number;
  drawBy: Side | null;
  result: GameResult | null;
  reason: EndReason | null;
  version: number;
  createdAt: number;
}

export function newGameRow(args: {
  id: string;
  white: string;
  black: string;
  invitedBy: string;
  tc: TimeControl;
  now: number;
}): GameRow {
  const ms = args.tc.baseS * 1000;
  return {
    id: args.id,
    white: args.white,
    black: args.black,
    invitedBy: args.invitedBy,
    status: "invited",
    moves: [],
    fen: START_FEN,
    baseS: args.tc.baseS,
    incS: args.tc.incS,
    whiteMs: ms,
    blackMs: ms,
    clockAt: 0,
    drawBy: null,
    result: null,
    reason: null,
    version: 0,
    createdAt: args.now,
  };
}

export function sideOf(row: GameRow, userId: string): Side | null {
  return row.white === userId ? "w" : row.black === userId ? "b" : null;
}

export function turnOf(row: Pick<GameRow, "fen">): Side {
  return row.fen.split(" ")[1] === "b" ? "b" : "w";
}

/** Идут ли часы: есть лимит времени, оба сделали по ходу и партия не окончена. */
export function clockRunning(row: GameRow): boolean {
  return row.status === "active" && row.baseS > 0 && row.moves.length >= FREE_PLIES && row.clockAt > 0;
}

/** Сколько осталось у каждого на момент now. */
export function remainingMs(row: GameRow, now: number): { w: number; b: number } {
  const left = { w: row.whiteMs, b: row.blackMs };
  if (clockRunning(row)) {
    const turn = turnOf(row);
    left[turn] = Math.max(0, left[turn] - Math.max(0, now - row.clockAt));
  }
  return left;
}

export type GameError =
  | "not-found"
  | "not-yours"
  | "not-active"
  | "not-your-turn"
  | "illegal"
  | "too-late"
  | "bad-action"
  | "no-draw-offer"
  | "cannot-abort";

export type Action =
  | { type: "accept" }
  | { type: "decline" }
  | { type: "move"; uci: string }
  | { type: "resign" }
  | { type: "abort" }
  | { type: "draw-offer" }
  | { type: "draw-accept" }
  | { type: "draw-decline" };

/** Может ли `side` поставить мат при самой неудачной игре соперника: если нет, зависшее время — ничья. */
export function canMate(fen: string, side: Side): boolean {
  const board = fen.split(" ")[0];
  const own = board.match(side === "w" ? /[PNBRQ]/g : /[pnbrq]/g) ?? [];
  const foe = board.match(side === "w" ? /[pnbrq]/g : /[PNBRQ]/g) ?? [];
  if (own.some((p) => /[pPrRqQ]/.test(p))) return true;
  if (own.length >= 2) return true;
  if (own.length === 1) return foe.length > 0;
  return false;
}

function finish(row: GameRow, result: GameResult, reason: EndReason): GameRow {
  return { ...row, status: "finished", result, reason, drawBy: null, clockAt: 0 };
}

/**
 * Упало ли время: если да — партия закончена. Сервер вызывает это при каждом чтении,
 * поэтому игрок, закрывший вкладку, не может «заморозить» часы соперника.
 */
export function settle(row: GameRow, now: number): GameRow {
  if (row.status === "invited" && now - row.createdAt > INVITE_TTL_MS) return { ...row, status: "declined" };
  if (!clockRunning(row)) return row;
  const turn = turnOf(row);
  const left = remainingMs(row, now)[turn];
  if (left > 0) return row;
  const winner: Side = turn === "w" ? "b" : "w";
  const clocks = { whiteMs: turn === "w" ? 0 : row.whiteMs, blackMs: turn === "b" ? 0 : row.blackMs };
  const done = finish({ ...row, ...clocks }, "1/2-1/2", "timeout");
  return canMate(row.fen, winner) ? { ...done, result: winner === "w" ? "1-0" : "0-1" } : done;
}

/** Применить действие игрока. Возвращает новую партию или код ошибки. */
export function applyAction(row: GameRow, userId: string, action: Action, now: number): GameRow | GameError {
  const me = sideOf(row, userId);
  if (!me) return "not-yours";
  const current = settle(row, now);

  if (action.type === "accept" || action.type === "decline") {
    if (current.status !== "invited") return "not-active";
    if (action.type === "decline") return { ...current, status: "declined" };
    // Принять может только тот, кого пригласили.
    if (current.invitedBy === userId) return "not-yours";
    return { ...current, status: "active" };
  }

  if (current.status !== "active") return "not-active";

  switch (action.type) {
    case "move": {
      if (turnOf(current) !== me) return "not-your-turn";
      return applyMove(current, action.uci, now);
    }
    case "resign":
      return finish(current, me === "w" ? "0-1" : "1-0", "resign");
    case "abort":
      return current.moves.length < FREE_PLIES ? finish(current, "1/2-1/2", "aborted") : "cannot-abort";
    case "draw-offer":
      return current.drawBy === me ? current : { ...current, drawBy: me };
    case "draw-decline":
      return current.drawBy && current.drawBy !== me ? { ...current, drawBy: null } : "no-draw-offer";
    case "draw-accept":
      return current.drawBy && current.drawBy !== me ? finish(current, "1/2-1/2", "agreement") : "no-draw-offer";
  }
}

const UCI = /^([a-h][1-8])([a-h][1-8])([qrbn])?$/;

/** Партия, воспроизведённая с начала: нужна для повторов позиции. */
export function replay(moves: readonly string[]): Chess | null {
  const chess = new Chess();
  for (const uci of moves) {
    const m = UCI.exec(uci);
    if (!m) return null;
    try {
      chess.move({ from: m[1], to: m[2], promotion: m[3] });
    } catch {
      return null;
    }
  }
  return chess;
}

function applyMove(row: GameRow, uci: string, now: number): GameRow | GameError {
  const m = UCI.exec(uci);
  if (!m) return "illegal";
  const mover = turnOf(row);
  // Время уже учтено в settle(); здесь оно точно не вышло.
  const running = clockRunning(row);
  const history = replay(row.moves);
  if (!history) return "illegal";
  let played;
  try {
    played = history.move({ from: m[1], to: m[2], promotion: m[3] });
  } catch {
    return "illegal";
  }
  if (!played) return "illegal";

  const moves = [...row.moves, `${played.from}${played.to}${played.promotion ?? ""}`];
  const next: GameRow = { ...row, moves, fen: history.fen(), drawBy: null };

  if (row.baseS > 0) {
    if (running) {
      const spent = Math.max(0, now - row.clockAt);
      const key = mover === "w" ? "whiteMs" : "blackMs";
      next[key] = Math.max(1, row[key] - spent) + row.incS * 1000;
    }
    next.clockAt = moves.length >= FREE_PLIES ? now : 0;
  }

  const winner: GameResult = mover === "w" ? "1-0" : "0-1";
  if (history.isCheckmate()) return finish(next, winner, "checkmate");
  if (history.isStalemate()) return finish(next, "1/2-1/2", "stalemate");
  if (history.isInsufficientMaterial()) return finish(next, "1/2-1/2", "insufficient");
  if (history.isThreefoldRepetition()) return finish(next, "1/2-1/2", "repetition");
  if (history.isDrawByFiftyMoves()) return finish(next, "1/2-1/2", "fifty");
  return next;
}

export function isError(v: GameRow | GameError): v is GameError {
  return typeof v === "string";
}

/** Партия глазами одного из игроков — то, что сервер отдаёт браузеру. */
export interface GameView {
  id: string;
  status: GameStatus;
  white: string;
  black: string;
  /** За кого играет смотрящий; null — он не участник. */
  you: Side | null;
  fen: string;
  moves: string[];
  turn: Side;
  baseS: number;
  incS: number;
  /** Остаток времени на момент serverNow. */
  clock: { w: number; b: number };
  clockRunning: boolean;
  serverNow: number;
  drawBy: Side | null;
  result: GameResult | null;
  reason: EndReason | null;
  invitedBy: Side;
  version: number;
}

export function viewOf(row: GameRow, userId: string, names: { w: string; b: string }, now: number): GameView {
  return {
    id: row.id,
    status: row.status,
    white: names.w,
    black: names.b,
    you: sideOf(row, userId),
    fen: row.fen,
    moves: row.moves,
    turn: turnOf(row),
    baseS: row.baseS,
    incS: row.incS,
    clock: remainingMs(row, now),
    clockRunning: clockRunning(row),
    serverNow: now,
    drawBy: row.drawBy,
    result: row.result,
    reason: row.reason,
    invitedBy: row.invitedBy === row.white ? "w" : "b",
    version: row.version,
  };
}

// ─── Имена и сообщения ────────────────────────────────────────────────────────

export const USERNAME_RE = /^[a-z][a-z0-9_]{2,15}$/;

/** Имя в игре: латиница, цифры и «_», 3–16 знаков, с буквы. Без разницы большие или маленькие — хранится маленькими. */
export function normalizeUsername(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toLowerCase().replace(/^@/, "") : "";
}

const RESERVED = ["admin", "moderator", "support", "parvoz", "parvozedu", "system", "official", "claude", "anonymous"];

/**
 * Короткий список грубых слов (русские, узбекские, английские) — защита от самого очевидного.
 * Это не замена присмотру родителей: поэтому у родителя есть выключатели переписки и поиска.
 */
const BAD_WORDS = [
  "fuck",
  "shit",
  "bitch",
  "porn",
  "nazi",
  "hitler",
  "dick",
  "cock",
  "pussy",
  "nigg",
  "suka",
  "blya",
  "blyat",
  "xuy",
  "huy",
  "hui",
  "pizd",
  "pidor",
  "pidar",
  "ebat",
  "eban",
  "gandon",
  "mudak",
  "zalupa",
  "amcha",
  "qotoq",
  "jalab",
  "haromi",
  "ahmoq",
  "tentak",
  "eshak",
  "padar",
  "dalbayob",
  "dalbayop",
];

/** Приведение к «голому» виду: замены цифр и повторов, чтобы «f.u.c.k» и «fuuuck» тоже находились. */
function squash(text: string): string {
  const map: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s" };
  const lower = text.toLowerCase().replace(/[01345@$7]/g, (c) => map[c] ?? c);
  const cyr: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "j",
    з: "z",
    и: "i",
    й: "i",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "x",
    ц: "c",
    ч: "c",
    ш: "s",
    щ: "s",
    ы: "i",
    э: "e",
    ю: "u",
    я: "a",
  };
  return [...lower]
    .map((ch) => cyr[ch] ?? ch)
    .join("")
    .replace(/[^a-z]/g, "")
    .replace(/(.)\1+/g, "$1");
}

export function hasBadWord(text: string): boolean {
  const flat = squash(text);
  return BAD_WORDS.some((w) => flat.includes(squash(w)));
}

export type NameError = "format" | "reserved" | "word";

export function checkUsername(raw: unknown): { ok: true; name: string } | { ok: false; error: NameError } {
  const name = normalizeUsername(raw);
  if (!USERNAME_RE.test(name)) return { ok: false, error: "format" };
  if (RESERVED.some((r) => name.includes(r))) return { ok: false, error: "reserved" };
  if (hasBadWord(name.replace(/_/g, " "))) return { ok: false, error: "word" };
  return { ok: true, name };
}

export const MAX_STREAK = 3700;

/**
 * Серия дней, которую ребёнок показывает друзьям: число дней и последний день занятий (ГГГГ-ММ-ДД).
 * Серия не может быть из будущего: последний день — не позже, чем через сутки с небольшим от сейчас (часовые пояса).
 */
export function checkStreak(
  days: unknown,
  last: unknown,
  now: number,
): { ok: true; days: number; last: string | null } | { ok: false } {
  if (typeof days !== "number" || !Number.isInteger(days) || days < 0 || days > MAX_STREAK) return { ok: false };
  if (days === 0) return { ok: true, days: 0, last: null };
  if (typeof last !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(last)) return { ok: false };
  const at = Date.parse(`${last}T12:00:00Z`);
  if (Number.isNaN(at) || new Date(at).toISOString().slice(0, 10) !== last) return { ok: false };
  if (at > now + 36 * 3_600_000) return { ok: false };
  return { ok: true, days, last };
}

/** Серия друга ещё живёт, если последний день занятий — не раньше, чем позавчера (с запасом на часовые пояса). */
export function streakAlive(last: string | null, now: number): boolean {
  if (!last) return false;
  return Date.parse(`${last}T12:00:00Z`) >= now - 60 * 3_600_000;
}

export const MAX_MESSAGE = 200;

export type MessageError = "empty" | "link" | "contact" | "word";

/** Сообщение другу: без ссылок, номеров, почты и грубых слов. Эти ограничения — для безопасности детей. */
export function checkMessage(raw: unknown): { ok: true; text: string } | { ok: false; error: MessageError } {
  const text =
    typeof raw === "string"
      ? raw
          .replace(/[\u0000-\u001f\u007f]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, MAX_MESSAGE)
      : "";
  if (!text) return { ok: false, error: "empty" };
  if (
    /https?:|www\.|[a-z0-9-]+\.(com|uz|ru|org|net|me|io|ly|gg|tv|xyz|info|app)\b|t\.me|telegram|whatsapp|instagram/i.test(
      text,
    )
  )
    return { ok: false, error: "link" };
  if (/@|\d(?:[\s\-().]*\d){6,}/.test(text)) return { ok: false, error: "contact" };
  if (hasBadWord(text)) return { ok: false, error: "word" };
  return { ok: true, text };
}

/** Пара аккаунтов — один и тот же ключ в любом порядке. */
export function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** Мин. длина запроса в поиске друзей. */
export const MIN_SEARCH = 3;
