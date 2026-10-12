/**
 * Независимая проверка тактических упражнений: какие ходы в позиции подходят под «двойной удар», «связку»,
 * «сквозной удар» и «открытый шах» (со взятием). Тесты сверяют с этим список ответов упражнения, так что ответ не может
 * разойтись с правилами. Позиции учебные — несколько фигур, поэтому «безопасность» считаем просто:
 * фигуру нельзя взять бесплатно или выгодно для соперника.
 */
import { Chess, type Color, type Move, type PieceSymbol, type Square } from "chess.js";

const VALUE: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

export type TacticGoal =
  "double" | "pin" | "skewer" | "discover" | "take" | "block" | "run" | "enpassant" | "stalemate";

const other = (c: Color): Color => (c === "w" ? "b" : "w");

/** Фигура на `to` «висит»: её бьют и она не защищена или бьёт её более дешёвая фигура. */
function hangs(after: Chess, to: Square, ours: Color): boolean {
  const attackers = after.attackers(to, other(ours));
  if (!attackers.length) return false;
  const defended = after.attackers(to, ours).some((s) => s !== to);
  const cheapest = Math.min(...attackers.map((s) => VALUE[after.get(s)!.type]));
  return !defended || cheapest < VALUE[after.get(to)!.type];
}

/** Фигуры соперника, на которые нападает именно сходившая фигура. */
function attackedBy(after: Chess, to: Square, ours: Color): Square[] {
  const out: Square[] = [];
  for (const row of after.board())
    for (const p of row)
      if (p && p.color === other(ours) && after.attackers(p.square, ours).includes(to)) out.push(p.square);
  return out;
}

/** Цель стоит нападения: король, незащищённая фигура или фигура дороже нападающей. */
function worthAttacking(after: Chess, sq: Square, to: Square, ours: Color): boolean {
  const target = after.get(sq)!;
  if (target.type === "k") return true;
  const defended = after.attackers(sq, other(ours)).some((s) => s !== sq);
  return !defended || VALUE[target.type] > VALUE[after.get(to)!.type];
}

function kingSquare(c: Chess, color: Color): Square {
  for (const row of c.board()) for (const p of row) if (p && p.type === "k" && p.color === color) return p.square;
  throw new Error("нет короля");
}

function isDouble(after: Chess, m: Move): boolean {
  const targets = attackedBy(after, m.to, m.color).filter((sq) => worthAttacking(after, sq, m.to, m.color));
  return targets.length >= 2 && !hangs(after, m.to, m.color);
}

function isPin(after: Chess, m: Move): boolean {
  if (after.inCheck() || !["b", "r", "q"].includes(m.piece) || hangs(after, m.to, m.color)) return false;
  const king = kingSquare(after, other(m.color));
  if (after.attackers(king, m.color).includes(m.to)) return false;
  for (const row of after.board())
    for (const p of row) {
      if (!p || p.color === m.color || p.type === "k" || p.type === "p") continue;
      const t = new Chess(after.fen());
      t.remove(p.square);
      if (t.attackers(king, m.color).includes(m.to)) return true;
    }
  return false;
}

function isSkewer(after: Chess, m: Move): boolean {
  if (!after.inCheck() || !["b", "r", "q"].includes(m.piece)) return false;
  const king = kingSquare(after, other(m.color));
  if (!after.attackers(king, m.color).includes(m.to) || hangs(after, m.to, m.color)) return false;
  const dx = Math.sign(king.charCodeAt(0) - m.to.charCodeAt(0));
  const dy = Math.sign(Number(king[1]) - Number(m.to[1]));
  let x = king.charCodeAt(0) + dx;
  let y = Number(king[1]) + dy;
  while (x >= 97 && x <= 104 && y >= 1 && y <= 8) {
    const piece = after.get(`${String.fromCharCode(x)}${y}` as Square);
    if (piece) return piece.color !== m.color && VALUE[piece.type] >= 3;
    x += dx;
    y += dy;
  }
  return false;
}

function isDiscovered(after: Chess, m: Move): boolean {
  if (!after.inCheck() || !m.captured) return false;
  // Шах объявила не ходившая фигура, а та, что стояла за ней.
  return !after.attackers(kingSquare(after, other(m.color)), m.color).includes(m.to);
}

/** Клетки фигур соперника, которые сейчас дают шах (до хода). */
function checkersOf(before: Chess, mover: Color): Square[] {
  return before.attackers(kingSquare(before, mover), other(mover));
}

const CHECKS: Record<TacticGoal, (after: Chess, m: Move, before: Chess) => boolean> = {
  take: (_a, m, before) => {
    const c = checkersOf(before, m.color);
    return c.length === 1 && !!m.captured && m.to === c[0];
  },
  block: (_a, m, before) => {
    const c = checkersOf(before, m.color);
    return c.length === 1 && m.piece !== "k" && !m.captured && !!before.inCheck();
  },
  run: (_a, m, before) => m.piece === "k" && !m.captured && before.inCheck(),
  enpassant: (_a, m) => m.isEnPassant(),
  stalemate: (after) => after.isStalemate(),
  double: isDouble,
  pin: isPin,
  skewer: isSkewer,
  discover: isDiscovered,
};

/** Все ходы в позиции, подходящие под тактическую цель, в записи «e2e4». */
export function tacticMoves(fen: string, goal: TacticGoal): string[] {
  const out: string[] = [];
  for (const m of new Chess(fen).moves({ verbose: true })) {
    const after = new Chess(fen);
    after.move(m);
    if (CHECKS[goal](after, m, new Chess(fen))) out.push(`${m.from}${m.to}${m.promotion ?? ""}`);
  }
  return out;
}
