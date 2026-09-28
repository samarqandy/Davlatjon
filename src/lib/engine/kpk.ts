/**
 * Король и пешка против короля: точная таблица «выигрыш / ничья» для всех позиций.
 * Строится ретроградным анализом один раз (≈ 200 тысяч позиций, доли секунды) — как в Stockfish.
 * На ней стоят тренажёры эндшпиля: робот защищается без ошибок, а ход ребёнка проверяется точно.
 *
 * Внутри сильная сторона всегда белые, пешка — на вертикалях a–d (остальные отражаются).
 * Клетки 0…63: a1 = 0, b1 = 1, …, h8 = 63.
 */

const INVALID = 0;
const UNKNOWN = 1;
const DRAW = 2;
const WIN = 4;

const WHITE = 0;
const BLACK = 1;

const PAWN_SLOTS = 24; // вертикали a–d × горизонтали 2–7
const SIZE = 2 * 64 * 64 * PAWN_SLOTS;

const file = (s: number) => s & 7;
const rank = (s: number) => s >> 3;
const dist = (a: number, b: number) => Math.max(Math.abs(file(a) - file(b)), Math.abs(rank(a) - rank(b)));

const KING_STEPS: number[][] = Array.from({ length: 64 }, (_, s) => {
  const out: number[] = [];
  for (let df = -1; df <= 1; df++)
    for (let dr = -1; dr <= 1; dr++) {
      if (!df && !dr) continue;
      const f = file(s) + df;
      const r = rank(s) + dr;
      if (f >= 0 && f < 8 && r >= 0 && r < 8) out.push(r * 8 + f);
    }
  return out;
});

/** Клетки, которые бьёт белая пешка. */
function pawnAttacks(p: number): number[] {
  const out: number[] = [];
  if (rank(p) < 7) {
    if (file(p) > 0) out.push(p + 7);
    if (file(p) < 7) out.push(p + 9);
  }
  return out;
}

function index(stm: number, wk: number, bk: number, p: number): number {
  const slot = (rank(p) - 1) * 4 + file(p);
  return ((stm * 64 + wk) * 64 + bk) * PAWN_SLOTS + slot;
}

let table: Uint8Array | null = null;

function initial(stm: number, wk: number, bk: number, p: number): number {
  if (wk === bk || wk === p || bk === p || dist(wk, bk) <= 1) return INVALID;
  // Белые ходят, а чёрный король под боем пешки — такого не бывает.
  if (stm === WHITE && pawnAttacks(p).includes(bk)) return INVALID;
  // Пешка превращается, и ферзя не съесть.
  const promo = p + 8;
  if (stm === WHITE && rank(p) === 6 && wk !== promo && (dist(bk, promo) > 1 || dist(wk, promo) === 1)) return WIN;
  if (stm === BLACK) {
    const guarded = new Set([...KING_STEPS[wk], ...pawnAttacks(p)]);
    const free = KING_STEPS[bk].filter((s) => !guarded.has(s));
    // Пат — или король съедает незащищённую пешку.
    if (free.length === 0 || free.includes(p)) return DRAW;
  }
  return UNKNOWN;
}

function classify(db: Uint8Array, stm: number, wk: number, bk: number, p: number): number {
  let r = 0;
  if (stm === WHITE) {
    for (const s of KING_STEPS[wk]) r |= db[index(BLACK, s, bk, p)];
    if (rank(p) < 6) r |= db[index(BLACK, wk, bk, p + 8)];
    if (rank(p) === 1 && p + 8 !== wk && p + 8 !== bk) r |= db[index(BLACK, wk, bk, p + 16)];
    return r & WIN ? WIN : r & UNKNOWN ? UNKNOWN : DRAW;
  }
  for (const s of KING_STEPS[bk]) r |= db[index(WHITE, wk, s, p)];
  return r & DRAW ? DRAW : r & UNKNOWN ? UNKNOWN : WIN;
}

/** Построить таблицу (один раз). */
export function kpkTable(): Uint8Array {
  if (table) return table;
  const db = new Uint8Array(SIZE);
  const pawns: number[] = [];
  for (let r = 1; r <= 6; r++) for (let f = 0; f < 4; f++) pawns.push(r * 8 + f);
  for (let stm = 0; stm < 2; stm++)
    for (let wk = 0; wk < 64; wk++)
      for (let bk = 0; bk < 64; bk++) for (const p of pawns) db[index(stm, wk, bk, p)] = initial(stm, wk, bk, p);
  let changed = true;
  while (changed) {
    changed = false;
    for (let stm = 0; stm < 2; stm++)
      for (let wk = 0; wk < 64; wk++)
        for (let bk = 0; bk < 64; bk++)
          for (const p of pawns) {
            const i = index(stm, wk, bk, p);
            if (db[i] !== UNKNOWN) continue;
            const v = classify(db, stm, wk, bk, p);
            if (v !== UNKNOWN) {
              db[i] = v;
              changed = true;
            }
          }
  }
  for (let i = 0; i < SIZE; i++) if (db[i] === UNKNOWN) db[i] = DRAW;
  table = db;
  return db;
}

// ---------------------------------------------------------------------------
// Позиции в записи FEN
// ---------------------------------------------------------------------------

export interface KpkPosition {
  /** Чья пешка — та сторона и играет на выигрыш. */
  strong: "w" | "b";
  /** Чей ход. */
  turn: "w" | "b";
  wk: number;
  bk: number;
  pawn: number;
}

const sqIndex = (name: string) => (Number(name[1]) - 1) * 8 + "abcdefgh".indexOf(name[0]);

/** Разобрать FEN, если на доске ровно король с пешкой против короля. */
export function parseKpk(fen: string): KpkPosition | null {
  const [board, turn] = fen.split(" ");
  const pieces: { piece: string; sq: number }[] = [];
  board.split("/").forEach((row, i) => {
    let f = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) f += Number(ch);
      else {
        pieces.push({ piece: ch, sq: (7 - i) * 8 + f });
        f++;
      }
    }
  });
  const find = (p: string) => pieces.filter((x) => x.piece === p);
  const K = find("K");
  const k = find("k");
  const P = find("P");
  const pp = find("p");
  if (pieces.length !== 3 || K.length !== 1 || k.length !== 1 || P.length + pp.length !== 1) return null;
  return {
    strong: P.length ? "w" : "b",
    turn: turn === "b" ? "b" : "w",
    wk: K[0].sq,
    bk: k[0].sq,
    pawn: (P[0] ?? pp[0]).sq,
  };
}

/** Результат при лучшей игре обеих сторон: выигрывает ли сторона с пешкой. */
export function kpkProbe(fen: string): "win" | "draw" | null {
  const pos = parseKpk(fen);
  if (!pos) return null;
  return kpkResult(pos);
}

export function kpkResult(pos: KpkPosition): "win" | "draw" | null {
  // Сильная сторона — белые: если пешка чёрная, переворачиваем доску сверху вниз.
  const flip = (s: number) => (pos.strong === "w" ? s : (7 - rank(s)) * 8 + file(s));
  let wk = flip(pos.strong === "w" ? pos.wk : pos.bk);
  let bk = flip(pos.strong === "w" ? pos.bk : pos.wk);
  let p = flip(pos.pawn);
  if (rank(p) < 1 || rank(p) > 6) return null;
  if (file(p) > 3) {
    const mirror = (s: number) => rank(s) * 8 + (7 - file(s));
    wk = mirror(wk);
    bk = mirror(bk);
    p = mirror(p);
  }
  const stm = pos.turn === pos.strong ? WHITE : BLACK;
  const v = kpkTable()[index(stm, wk, bk, p)];
  if (v === INVALID) return null;
  return v === WIN ? "win" : "draw";
}

export { sqIndex as kpkSquare };
