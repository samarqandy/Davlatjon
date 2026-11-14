/**
 * Доска тренера: урок из нескольких досок, ходы, стрелки и знаки, расстановка — и отмена любой правки.
 *
 * Здесь только данные и правила, без React: каждое действие тренера — `apply(история, действие)`.
 * Переходы по ходам и доскам (листание) в историю не попадают — «Отменить» отменяет правки, а не листание.
 * Позиции без королей (пешечный бой, «ферзь против пешек») — обычное дело на уроке, поэтому FEN проверяем
 * сами (isFenShape), а не правилами шахмат.
 */
import { Chess } from "chess.js";
import { loadPosition, playMove, withTurn, type PieceType } from "@/lib/chess";
import { snapshotOf } from "@/lib/board";

export type Sq = string;
/** Цвета — буквы, как в записи стрелок PGN ([%cal]/[%csl]): зелёный, красный, синий, жёлтый. */
export type ShapeColor = "G" | "R" | "B" | "Y";
export const SHAPE_COLORS: readonly ShapeColor[] = ["G", "R", "B", "Y"];
export type SignKind = "tick" | "cross" | "ask";
export const SIGN_KINDS: readonly SignKind[] = ["tick", "cross", "ask"];

export interface MArrow {
  from: Sq;
  to: Sq;
  c: ShapeColor;
}
export interface MRing {
  sq: Sq;
  c: ShapeColor;
}
export interface Shapes {
  arrows: MArrow[];
  rings: MRing[];
  signs: Partial<Record<Sq, SignKind>>;
}

export interface MentorBoard {
  id: string;
  /** Задание для класса: «Ход белых. Мат в 1 ход». */
  task: string;
  /** Начальная позиция (FEN, короли не обязательны). */
  start: string;
  /** Показанные ходы от начальной позиции (UCI). */
  line: string[];
  /** Стрелки и знаки — у каждого хода свои: ключ — номер хода («0» — начальная позиция). */
  shapes: Record<string, Shapes>;
  orientation: "white" | "black";
}

export interface MentorLesson {
  version: 1;
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  boards: MentorBoard[];
}

/** Ограничения: урок должен помещаться в хранилище браузера и не тормозить на слабой панели. */
export const LIMITS = {
  arrows: 24,
  rings: 64,
  signs: 64,
  plies: 400,
  boards: 40,
  task: 140,
  title: 80,
  history: 100,
} as const;

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
export const EMPTY_FEN = "8/8/8/8/8/8/8/8 w - - 0 1";

const SQUARE = /^[a-h][1-8]$/;
const UCI = /^[a-h][1-8][a-h][1-8][qrbn]?$/;
export const isSquare = (s: unknown): s is Sq => typeof s === "string" && SQUARE.test(s);
export const isUci = (s: unknown): s is string => typeof s === "string" && UCI.test(s);

// ─── FEN ────────────────────────────────────────────────────────────────────

/**
 * Похоже ли на позицию: 8 горизонталей по 8 клеток, очередь хода, рокировки, взятие на проходе.
 * Короли не обязательны, но не больше одного у каждой стороны; пешек на крайних горизонталях нет.
 * Правила шахмат chess.js без королей не проверяет, а без проверки (skipValidation) принимает что угодно.
 */
export function isFenShape(fen: unknown): fen is string {
  if (typeof fen !== "string") return false;
  const parts = fen.trim().split(/\s+/);
  if (parts.length < 2 || parts.length > 6) return false;
  const [placement, turn, castling = "-", ep = "-", half = "0", full = "1"] = parts;
  const rows = placement.split("/");
  if (rows.length !== 8) return false;
  let whiteKings = 0;
  let blackKings = 0;
  for (const [i, row] of rows.entries()) {
    let n = 0;
    let digit = false;
    for (const ch of row) {
      // Две цифры подряд («11») — не FEN: снимок доски прочёл бы их как одиннадцать и потерял фигуры.
      if (/[1-8]/.test(ch) && digit) return false;
      digit = /[1-8]/.test(ch);
      if (digit) n += Number(ch);
      else if (/[pnbrqkPNBRQK]/.test(ch)) {
        n += 1;
        if (ch === "K") whiteKings++;
        if (ch === "k") blackKings++;
        if ((ch === "p" || ch === "P") && (i === 0 || i === 7)) return false;
      } else return false;
    }
    if (n !== 8) return false;
  }
  if (whiteKings > 1 || blackKings > 1) return false;
  if (turn !== "w" && turn !== "b") return false;
  if (castling !== "-" && !/^K?Q?k?q?$/.test(castling)) return false;
  if (ep !== "-" && !/^[a-h][36]$/.test(ep)) return false;
  if (!/^\d+$/.test(half) || !/^\d+$/.test(full)) return false;
  return true;
}

/**
 * Полная запись FEN из шести частей (в короткой бывает только расстановка и очередь хода). Права на рокировку
 * и взятие на проходе сверяются с фигурами: chess.js без проверки (skipValidation) им верит — и «рокирует»
 * короля без ладьи или бьёт пешкой пустую клетку.
 */
export function normalizeFen(fen: string): string {
  const [placement, turn, castling = "-", ep = "-", half = "0", full = "1"] = fen.trim().split(/\s+/);
  const pieces = snapshotOf(placement);
  const rights = [
    ["K", "e1", "wK", "h1", "wR"],
    ["Q", "e1", "wK", "a1", "wR"],
    ["k", "e8", "bK", "h8", "bR"],
    ["q", "e8", "bK", "a8", "bR"],
  ]
    .filter(([flag, ks, k, rs, r]) => castling.includes(flag) && pieces[ks] === k && pieces[rs] === r)
    .map(([flag]) => flag)
    .join("");
  // Взятие на проходе: только что прошла на два поля пешка того, кто не ходит, — клетка за ней пуста.
  let passant = "-";
  if (/^[a-h][36]$/.test(ep)) {
    const file = ep[0];
    const [rank, pawnRank, fromRank, pawn] = turn === "w" ? ["6", "5", "7", "bP"] : ["3", "4", "2", "wP"];
    if (ep[1] === rank && pieces[`${file}${pawnRank}`] === pawn && !pieces[ep] && !pieces[`${file}${fromRank}`])
      passant = ep;
  }
  return [placement, turn, rights || "-", passant, half, full].join(" ");
}

const CODE_TO_FEN: Record<string, string> = {
  wP: "P",
  wN: "N",
  wB: "B",
  wR: "R",
  wQ: "Q",
  wK: "K",
  bP: "p",
  bN: "n",
  bB: "b",
  bR: "r",
  bQ: "q",
  bK: "k",
};
export const PIECE_CODES = Object.keys(CODE_TO_FEN);

/**
 * Расстановка → FEN. Рокировка возможна, только если король и ладья стоят на своих местах; взятия на проходе
 * после расстановки нет; счётчики — с начала.
 */
export function piecesToFen(pieces: Record<Sq, string>, turn: "w" | "b"): string {
  const rows: string[] = [];
  for (let rank = 8; rank >= 1; rank--) {
    let row = "";
    let empty = 0;
    for (const file of "abcdefgh") {
      const code = pieces[`${file}${rank}`];
      const ch = code ? CODE_TO_FEN[code] : undefined;
      if (!ch) empty++;
      else {
        if (empty) row += empty;
        empty = 0;
        row += ch;
      }
    }
    if (empty) row += empty;
    rows.push(row);
  }
  let castling = "";
  if (pieces.e1 === "wK" && pieces.h1 === "wR") castling += "K";
  if (pieces.e1 === "wK" && pieces.a1 === "wR") castling += "Q";
  if (pieces.e8 === "bK" && pieces.h8 === "bR") castling += "k";
  if (pieces.e8 === "bK" && pieces.a8 === "bR") castling += "q";
  return `${rows.join("/")} ${turn} ${castling || "-"} - 0 1`;
}

const hasBothKings = (fen: string) => {
  const placement = fen.split(" ")[0];
  return placement.includes("K") && placement.includes("k");
};

// ─── Ходы ───────────────────────────────────────────────────────────────────

export interface PlyInfo {
  fen: string;
  /** Ход, которым пришли в эту позицию (у начальной — нет). */
  san?: string;
  uci?: string;
  check: boolean;
  mate: boolean;
  stalemate: boolean;
}

export function playUci(fen: string, uci: string) {
  return playMove(fen, uci.slice(0, 2), uci.slice(2, 4), (uci[4] as PieceType | undefined) ?? "q");
}

function startInfo(fen: string): PlyInfo {
  try {
    const c = loadPosition(fen);
    // Шах бывает и без второго короля; мат и пат — только при обоих.
    if (!hasBothKings(fen)) return { fen, check: c.inCheck(), mate: false, stalemate: false };
    return { fen, check: c.inCheck(), mate: c.isCheckmate(), stalemate: c.isStalemate() };
  } catch {
    return { fen, check: false, mate: false, stalemate: false };
  }
}

const fensCache = new Map<string, PlyInfo[]>();

/**
 * Все позиции линии: [0] — начальная, [k] — после k-го хода. Останавливается на первом ходе, который нельзя
 * сделать. Мат и пат имеют смысл только при обоих королях.
 */
export function fensOf(start: string, line: readonly string[]): PlyInfo[] {
  const key = `${start}|${line.join(" ")}`;
  const hit = fensCache.get(key);
  if (hit) return hit;
  const out: PlyInfo[] = [startInfo(start)];
  const kings = hasBothKings(start);
  // Одна доска chess.js на всю линию: партия из базы — это и 250 полуходов, а разбирать FEN заново на каждом
  // ходу впятеро дольше (на панели класса партия открывалась бы с заметной задержкой). Ход тот же, что у playUci:
  // буква превращения обязательна, без неё («e7e8») ход не принимается.
  let chess: Chess | null = null;
  try {
    chess = loadPosition(start);
  } catch {
    chess = null;
  }
  for (const uci of chess ? line : []) {
    let m;
    try {
      m = chess!.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] ?? "q" });
    } catch {
      break;
    }
    const played = `${m.from}${m.to}${m.promotion ?? ""}`;
    if (played !== uci) break;
    out.push({
      fen: chess!.fen(),
      san: m.san,
      uci: played,
      check: chess!.inCheck(),
      mate: kings && chess!.isCheckmate(),
      stalemate: kings && chess!.isStalemate(),
    });
  }
  if (fensCache.size > 200) fensCache.clear();
  fensCache.set(key, out);
  return out;
}

/** Сколько ходов линии действительно можно сделать (испорченный хвост отбрасывается). */
const playable = (b: MentorBoard) => fensOf(b.start, b.line).length - 1;

// ─── Вставка FEN или PGN ────────────────────────────────────────────────────

/**
 * Текст из буфера: FEN (и без королей) или партия в PGN — главная линия; варианты и комментарии не берём.
 */
export function parseMentorSetup(text: string): { start: string; line: string[] } | null {
  const s = text.trim();
  if (!s) return null;
  if (isFenShape(s)) {
    const fen = normalizeFen(s);
    try {
      loadPosition(fen);
      return { start: fen, line: [] };
    } catch {
      return null;
    }
  }
  // Похоже на партию: номер хода с точкой или заголовок [Event "…"].
  if (!/\d\s*\.|\[\w+\s+"/.test(s)) return null;
  try {
    const game = new Chess();
    game.loadPgn(s);
    const header = game.getHeaders().FEN;
    const start = header ?? START_FEN;
    if (!isFenShape(start)) return null;
    const line = game.history({ verbose: true }).map((m) => `${m.from}${m.to}${m.promotion ?? ""}`);
    if (!line.length && !header) return null;
    return { start: normalizeFen(start), line: line.slice(0, LIMITS.plies) };
  } catch {
    return null;
  }
}

// ─── Урок и история ─────────────────────────────────────────────────────────

const emptyShapes = (): Shapes => ({ arrows: [], rings: [], signs: {} });
const isEmptyShapes = (s: Shapes) => !s.arrows.length && !s.rings.length && !Object.keys(s.signs).length;

let idSeq = 0;
/** Короткий id доски или урока: время и счётчик (в одном уроке не повторяется). */
export function newId(prefix: string): string {
  idSeq = (idSeq + 1) % 1_679_616;
  return `${prefix}${Date.now().toString(36)}${idSeq.toString(36).padStart(4, "0")}`;
}

export function newBoard(start = START_FEN, orientation: "white" | "black" = "white"): MentorBoard {
  return { id: newId("b"), task: "", start, line: [], shapes: {}, orientation };
}

export function newLesson(title: string, now = Date.now()): MentorLesson {
  return { version: 1, id: newId("l"), title, createdAt: now, updatedAt: now, boards: [newBoard()] };
}

/** «Что если?» — ход в середине партии: запоминаем партию, чтобы одним нажатием вернуться к ней. */
export interface Trial {
  line: string[];
  shapes: Record<string, Shapes>;
  ply: number;
}

export interface Doc {
  lesson: MentorLesson;
  board: number;
  ply: number;
  trial: Trial | null;
}

export interface History {
  past: Doc[];
  doc: Doc;
  future: Doc[];
  /** Последняя правка текста (задание, название): следующие буквы того же поля — та же правка. */
  typing?: string;
}

export type Action =
  // Листание — в историю не попадает.
  | { t: "goto"; ply: number }
  | { t: "selectBoard"; i: number; at?: "start" | "end" }
  | { t: "next" }
  | { t: "prev" }
  | { t: "first" }
  | { t: "last" }
  // Правки — отменяются.
  | { t: "play"; uci: string }
  | { t: "returnToLine" }
  | { t: "keepTrial" }
  | { t: "truncate" }
  | { t: "arrow"; from: Sq; to: Sq; c: ShapeColor }
  | { t: "ring"; sq: Sq; c: ShapeColor }
  | { t: "sign"; sq: Sq; kind: SignKind }
  | { t: "clearShapes" }
  | { t: "place"; sq: Sq; piece: string | null }
  | { t: "freeMove"; from: Sq; to: Sq }
  | { t: "setPosition"; fen: string; line?: string[]; task?: string }
  | { t: "setTurn"; turn: "w" | "b" }
  | { t: "flip" }
  | { t: "setTask"; text: string }
  | { t: "setLessonTitle"; text: string }
  | { t: "addBoard" }
  | { t: "dupBoard" }
  /** Партия из библиотеки — новой доской после текущей (или вместо нетронутой), с начала партии. */
  | { t: "addGame"; start: string; line: string[]; task: string; orientation?: "white" | "black" }
  | { t: "deleteBoard" }
  | { t: "undo" }
  | { t: "redo" }
  | { t: "load"; lesson: MentorLesson };

export interface Result {
  history: History;
  /** Правка не принята: клетка, которая мигнёт красным. */
  rejected?: Sq;
  /** Правка не принята, но без клетки (предел досок, ходов). */
  refused?: boolean;
}

export function startHistory(lesson: MentorLesson, board = 0): History {
  const i = Math.max(0, Math.min(board, lesson.boards.length - 1));
  return { past: [], doc: { lesson, board: i, ply: 0, trial: null }, future: [] };
}

export const currentBoard = (d: Doc): MentorBoard => d.lesson.boards[d.board];

/** Позиция на экране. */
export function currentPly(d: Doc): PlyInfo {
  const b = currentBoard(d);
  const fens = fensOf(b.start, b.line);
  return fens[Math.min(d.ply, fens.length - 1)];
}

export const shapesAt = (b: MentorBoard, ply: number): Shapes => b.shapes[String(ply)] ?? emptyShapes();

function setBoard(d: Doc, board: MentorBoard, patch: Partial<Doc> = {}): Doc {
  const boards = d.lesson.boards.slice();
  boards[d.board] = board;
  return { ...d, ...patch, lesson: { ...d.lesson, boards } };
}

function withShapes(b: MentorBoard, ply: number, s: Shapes): MentorBoard {
  const shapes = { ...b.shapes };
  if (isEmptyShapes(s)) delete shapes[String(ply)];
  else shapes[String(ply)] = s;
  return { ...b, shapes };
}

/** Стрелки и знаки ходов дальше `ply` убираются: этих ходов больше нет. */
function shapesUpTo(shapes: Record<string, Shapes>, ply: number): Record<string, Shapes> {
  return Object.fromEntries(Object.entries(shapes).filter(([k]) => Number(k) <= ply));
}

const nav = (h: History, doc: Doc): Result => ({ history: { ...h, doc, typing: undefined } });
const edit = (h: History, doc: Doc, typing?: string): Result => {
  if (typing && h.typing === typing) return { history: { ...h, doc, future: [] } };
  return {
    history: { past: [...h.past, h.doc].slice(-LIMITS.history), doc, future: [], typing },
  };
};

/** Новая позиция из расстановки: если до неё были ходы, она становится началом, ходы — забываются. */
function setPositionAt(d: Doc, fen: string, extra: Partial<MentorBoard> = {}): Doc {
  const b = currentBoard(d);
  const keep = shapesAt(b, d.ply);
  const shapes: Record<string, Shapes> = isEmptyShapes(keep) ? {} : { "0": keep };
  return setBoard(d, { ...b, start: fen, line: [], shapes, ...extra }, { ply: 0, trial: null });
}

const isBackRank = (sq: Sq) => sq[1] === "1" || sq[1] === "8";

function placementEdit(h: History, d: Doc, next: Record<Sq, string>, turn: "w" | "b"): Result {
  return edit(h, setPositionAt(d, piecesToFen(next, turn)));
}

export function apply(h: History, a: Action): Result {
  const d = h.doc;
  const b = currentBoard(d);
  const total = playable(b);
  switch (a.t) {
    case "goto":
      if (!Number.isFinite(a.ply)) return { history: h };
      return nav(h, { ...d, ply: Math.max(0, Math.min(Math.round(a.ply), total)) });
    case "selectBoard": {
      if (!Number.isFinite(a.i)) return { history: h };
      const i = Math.max(0, Math.min(Math.round(a.i), d.lesson.boards.length - 1));
      if (i === d.board) {
        if (!a.at) return { history: h };
        return nav(h, { ...d, ply: a.at === "end" ? total : 0 });
      }
      const ply = a.at === "end" ? playable(d.lesson.boards[i]) : 0;
      // Пробный вариант живёт только на своей доске: уходя, возвращаем партию.
      const base = d.trial ? setBoard(d, { ...b, line: d.trial.line, shapes: d.trial.shapes }) : d;
      return nav(h, { ...base, board: i, ply, trial: null });
    }
    case "next":
      if (d.ply < total) return nav(h, { ...d, ply: d.ply + 1 });
      if (d.board < d.lesson.boards.length - 1) return apply(h, { t: "selectBoard", i: d.board + 1 });
      return { history: h };
    case "prev":
      if (d.ply > 0) return nav(h, { ...d, ply: d.ply - 1 });
      if (d.board > 0) return apply(h, { t: "selectBoard", i: d.board - 1, at: "end" });
      return { history: h };
    case "first":
      return nav(h, { ...d, ply: 0 });
    case "last":
      return nav(h, { ...d, ply: total });

    case "play": {
      const fen = currentPly(d).fen;
      const m = isUci(a.uci) ? playUci(fen, a.uci) : null;
      if (!m) return { history: h, rejected: isUci(a.uci) ? a.uci.slice(2, 4) : undefined };
      // Тот же ход, что дальше в линии, — просто шаг вперёд.
      if (d.ply < total && b.line[d.ply] === m.uci) return nav(h, { ...d, ply: d.ply + 1 });
      if (d.ply >= LIMITS.plies) return { history: h, refused: true };
      const line = [...b.line.slice(0, d.ply), m.uci];
      const shapes = shapesUpTo(b.shapes, d.ply);
      // Ход в середине партии — «пробный вариант»: партию запоминаем.
      const trial = d.trial ?? (d.ply < total ? { line: b.line, shapes: b.shapes, ply: d.ply } : null);
      return edit(h, setBoard(d, { ...b, line, shapes }, { ply: d.ply + 1, trial }));
    }
    case "returnToLine":
      if (!d.trial) return { history: h };
      return edit(
        h,
        setBoard(d, { ...b, line: d.trial.line, shapes: d.trial.shapes }, { ply: d.trial.ply, trial: null }),
      );
    case "keepTrial":
      if (!d.trial) return { history: h };
      return edit(h, { ...d, trial: null });
    case "truncate":
      if (d.ply >= total && !d.trial) return { history: h };
      return edit(
        h,
        setBoard(d, { ...b, line: b.line.slice(0, d.ply), shapes: shapesUpTo(b.shapes, d.ply) }, { trial: null }),
      );

    case "arrow": {
      if (!isSquare(a.from) || !isSquare(a.to) || a.from === a.to) return { history: h, refused: true };
      const s = shapesAt(b, d.ply);
      const same = s.arrows.find((x) => x.from === a.from && x.to === a.to);
      let arrows: MArrow[];
      if (same && same.c === a.c) arrows = s.arrows.filter((x) => x !== same);
      else if (same) arrows = s.arrows.map((x) => (x === same ? { ...x, c: a.c } : x));
      else {
        if (s.arrows.length >= LIMITS.arrows) return { history: h, rejected: a.to };
        arrows = [...s.arrows, { from: a.from, to: a.to, c: a.c }];
      }
      return edit(h, setBoard(d, withShapes(b, d.ply, { ...s, arrows })));
    }
    case "ring": {
      if (!isSquare(a.sq)) return { history: h, refused: true };
      const s = shapesAt(b, d.ply);
      const same = s.rings.find((x) => x.sq === a.sq);
      let rings: MRing[];
      if (same && same.c === a.c) rings = s.rings.filter((x) => x !== same);
      else if (same) rings = s.rings.map((x) => (x === same ? { ...x, c: a.c } : x));
      else {
        if (s.rings.length >= LIMITS.rings) return { history: h, rejected: a.sq };
        rings = [...s.rings, { sq: a.sq, c: a.c }];
      }
      return edit(h, setBoard(d, withShapes(b, d.ply, { ...s, rings })));
    }
    case "sign": {
      if (!isSquare(a.sq)) return { history: h, refused: true };
      const s = shapesAt(b, d.ply);
      const signs = { ...s.signs };
      if (signs[a.sq] === a.kind) delete signs[a.sq];
      else {
        if (!signs[a.sq] && Object.keys(signs).length >= LIMITS.signs) return { history: h, rejected: a.sq };
        signs[a.sq] = a.kind;
      }
      return edit(h, setBoard(d, withShapes(b, d.ply, { ...s, signs })));
    }
    case "clearShapes":
      if (isEmptyShapes(shapesAt(b, d.ply))) return { history: h };
      return edit(h, setBoard(d, withShapes(b, d.ply, emptyShapes())));

    case "place": {
      if (!isSquare(a.sq) || (a.piece !== null && !Object.hasOwn(CODE_TO_FEN, a.piece)))
        return { history: h, refused: true };
      const fen = currentPly(d).fen;
      const pieces = snapshotOf(fen);
      const turn = fen.split(" ")[1] === "b" ? "b" : "w";
      if (a.piece === null) {
        if (!pieces[a.sq]) return { history: h };
        delete pieces[a.sq];
        return placementEdit(h, d, pieces, turn);
      }
      // Та же фигура на той же клетке — убрать (как ластиком).
      if (pieces[a.sq] === a.piece) {
        delete pieces[a.sq];
        return placementEdit(h, d, pieces, turn);
      }
      if (a.piece[1] === "P" && isBackRank(a.sq)) return { history: h, rejected: a.sq };
      // Король у стороны один: второй переезжает.
      if (a.piece[1] === "K") for (const [sq, code] of Object.entries(pieces)) if (code === a.piece) delete pieces[sq];
      pieces[a.sq] = a.piece;
      return placementEdit(h, d, pieces, turn);
    }
    case "freeMove": {
      if (!isSquare(a.from) || !isSquare(a.to)) return { history: h, refused: true };
      if (a.from === a.to) return { history: h };
      const fen = currentPly(d).fen;
      const pieces = snapshotOf(fen);
      const piece = pieces[a.from];
      if (!piece) return { history: h, rejected: a.from };
      if (piece[1] === "P" && isBackRank(a.to)) return { history: h, rejected: a.to };
      delete pieces[a.from];
      pieces[a.to] = piece;
      return placementEdit(h, d, pieces, fen.split(" ")[1] === "b" ? "b" : "w");
    }
    case "setPosition": {
      if (!isFenShape(a.fen)) return { history: h, refused: true };
      const fen = normalizeFen(a.fen);
      const extra: Partial<MentorBoard> = {};
      if (a.task !== undefined && !b.task) extra.task = a.task.slice(0, LIMITS.task);
      const next = setPositionAt(d, fen, extra);
      if (!a.line?.length) return edit(h, next);
      // Партия из PGN: ходы — вместе с позицией, одной правкой; на доске — конец партии.
      // Берём только ходы, которые делаются по правилам: урок с испорченной линией не прочтётся из хранилища.
      const nb = currentBoard(next);
      const line = a.line.slice(0, LIMITS.plies).filter(isUci);
      const withLine = { ...nb, line: line.slice(0, fensOf(fen, line).length - 1) };
      return edit(h, setBoard(next, withLine, { ply: playable(withLine) }));
    }
    case "setTurn": {
      const fen = currentPly(d).fen;
      if (fen.split(" ")[1] === a.turn) return { history: h };
      return edit(h, setPositionAt(d, withTurn(fen, a.turn)));
    }
    case "flip":
      return edit(h, setBoard(d, { ...b, orientation: b.orientation === "white" ? "black" : "white" }));

    case "setTask": {
      const task = a.text.slice(0, LIMITS.task);
      if (task === b.task) return { history: h };
      return edit(h, setBoard(d, { ...b, task }), `task:${b.id}`);
    }
    case "setLessonTitle": {
      const title = a.text.slice(0, LIMITS.title);
      if (title === d.lesson.title) return { history: h };
      return edit(h, { ...d, lesson: { ...d.lesson, title } }, `title:${d.lesson.id}`);
    }

    case "addBoard":
    case "dupBoard": {
      if (d.lesson.boards.length >= LIMITS.boards) return { history: h, refused: true };
      // Копия — то, что на экране (с пробным вариантом); у самой доски остаётся партия.
      const created: MentorBoard =
        a.t === "dupBoard"
          ? { ...(JSON.parse(JSON.stringify(b)) as MentorBoard), id: newId("b") }
          : newBoard(currentPly(d).fen, b.orientation);
      const boards = d.lesson.boards.slice();
      if (d.trial) boards[d.board] = { ...b, line: d.trial.line, shapes: d.trial.shapes };
      boards.splice(d.board + 1, 0, created);
      return edit(h, {
        lesson: { ...d.lesson, boards },
        board: d.board + 1,
        ply: a.t === "dupBoard" ? d.ply : 0,
        trial: null,
      });
    }
    case "addGame": {
      // Нетронутая доска (начальная позиция, ни ходов, ни пометок, ни задания) уступает место партии — иначе
      // первая партия урока открылась бы второй доской после пустой.
      const blank = !d.trial && !b.line.length && !b.task && b.start === START_FEN && !Object.keys(b.shapes).length;
      if ((!blank && d.lesson.boards.length >= LIMITS.boards) || !isFenShape(a.start)) {
        return { history: h, refused: true };
      }
      const start = normalizeFen(a.start);
      const line = a.line.slice(0, LIMITS.plies).filter(isUci);
      const created: MentorBoard = {
        ...newBoard(start, a.orientation ?? "white"),
        task: a.task.slice(0, LIMITS.task),
        // Ходы, которые нельзя сделать, в урок не попадают (иначе урок не прочтётся из хранилища).
        line: line.slice(0, fensOf(start, line).length - 1),
      };
      const boards = d.lesson.boards.slice();
      if (d.trial) boards[d.board] = { ...b, line: d.trial.line, shapes: d.trial.shapes };
      if (blank) boards[d.board] = created;
      else boards.splice(d.board + 1, 0, created);
      return edit(h, { lesson: { ...d.lesson, boards }, board: blank ? d.board : d.board + 1, ply: 0, trial: null });
    }
    case "deleteBoard": {
      if (d.lesson.boards.length <= 1) {
        return edit(h, { lesson: { ...d.lesson, boards: [newBoard()] }, board: 0, ply: 0, trial: null });
      }
      const boards = d.lesson.boards.filter((_, i) => i !== d.board);
      return edit(h, {
        lesson: { ...d.lesson, boards },
        board: Math.min(d.board, boards.length - 1),
        ply: 0,
        trial: null,
      });
    }

    case "undo": {
      const prev = h.past[h.past.length - 1];
      if (!prev) return { history: h };
      return { history: { past: h.past.slice(0, -1), doc: prev, future: [h.doc, ...h.future] } };
    }
    case "redo": {
      const next = h.future[0];
      if (!next) return { history: h };
      return { history: { past: [...h.past, h.doc], doc: next, future: h.future.slice(1) } };
    }
    case "load":
      return { history: startHistory(a.lesson) };
  }
}

/**
 * Урок для сохранения: пробный вариант не сохраняется — в уроке остаётся партия, к которой он вёл бы обратно.
 */
export function persistable(d: Doc): MentorLesson {
  if (!d.trial) return d.lesson;
  const b = currentBoard(d);
  return setBoard(d, { ...b, line: d.trial.line, shapes: d.trial.shapes }).lesson;
}
