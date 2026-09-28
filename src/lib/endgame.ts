/**
 * Тренажёр эндшпиля «король и пешка против короля»: проверка хода ребёнка, ход робота,
 * квадрат пешки. Все оценки — из точной таблицы src/lib/engine/kpk.ts.
 */
import { Chess, type Move } from "chess.js";
import { kpkProbe, parseKpk } from "./engine/kpk";

const FILES = "abcdefgh";
const sqName = (f: number, r: number) => `${FILES[f]}${r + 1}`;
const fileOf = (s: number) => s & 7;
const rankOf = (s: number) => s >> 3;

/** Результат позиции для стороны, которая сейчас ходит: выигрывает, ничья или проигрывает. */
export type Outcome = "win" | "draw" | "loss";

function afterMove(fen: string, m: Move): string {
  const c = new Chess(fen);
  c.move({ from: m.from, to: m.to, promotion: m.promotion });
  return c.fen();
}

/** Пешка превращается, и соперник не может сразу съесть нового ферзя и не получает пат. */
function safePromotion(fen: string, m: Move): boolean {
  if (!m.promotion) return false;
  const c = new Chess(fen);
  c.move({ from: m.from, to: m.to, promotion: "q" });
  if (c.isStalemate()) return false;
  return !c.moves({ verbose: true }).some((r) => r.captured === "q");
}

/** Оценка хода m в позиции fen для того, кто его делает. */
export function moveOutcome(fen: string, m: Move): Outcome {
  const pos = parseKpk(fen);
  if (!pos) return "draw";
  const mover = pos.turn;
  if (m.promotion) return safePromotion(fen, m) ? "win" : "draw";
  if (m.captured) return "draw"; // съел пешку — остались одни короли
  const after = afterMove(fen, m);
  const r = kpkProbe(after);
  if (r === null) return "draw";
  if (r === "draw") return "draw";
  return pos.strong === mover ? "win" : "loss";
}

/** Лучший возможный результат для стороны, которая ходит. */
export function positionOutcome(fen: string): Outcome {
  const pos = parseKpk(fen);
  if (!pos) return "draw";
  const r = kpkProbe(fen);
  if (r !== "win") return "draw";
  return pos.turn === pos.strong ? "win" : "loss";
}

/** Все ходы, которые сохраняют лучший результат позиции (для проверки ответа ребёнка). */
export function bestMoves(fen: string): string[] {
  const best = positionOutcome(fen);
  const c = new Chess(fen);
  return c
    .moves({ verbose: true })
    .filter((m) => moveOutcome(fen, m) === best)
    .map((m) => m.from + m.to + (m.promotion ? "q" : ""));
}

/**
 * Ход робота. Сильная сторона ведёт пешку к ферзю (и не упускает выигрыш), а если выигрыша нет —
 * выбирает ход, после которого у защитника меньше всего спасительных ответов.
 * Слабая сторона держит ничью, а если держать нечего — выбирает ход, после которого
 * у нападающего меньше всего выигрывающих продолжений.
 */
export function robotMove(fen: string): string | null {
  const c = new Chess(fen);
  const moves = c.moves({ verbose: true });
  if (!moves.length) return null;
  const pos = parseKpk(fen);
  const uci = (m: Move) => m.from + m.to + (m.promotion ? "q" : "");
  if (!pos) return uci(moves[0]);
  const best = positionOutcome(fen);
  const keep = moves.filter((m) => moveOutcome(fen, m) === best);
  const pool = keep.length ? keep : moves;
  const replies = (m: Move) => {
    const after = afterMove(fen, m);
    const next = new Chess(after);
    const want = positionOutcome(after);
    return next.moves({ verbose: true }).filter((r) => moveOutcome(after, r) === want).length;
  };
  if (pos.turn === pos.strong) {
    // Превращение — сразу. Иначе продвигаем пешку, если это не портит результат.
    const promo = pool.find((m) => m.promotion);
    if (promo) return uci(promo);
    const push = pool.find((m) => m.piece === "p");
    if (best === "win" && push) return uci(push);
    const pawn = pos.pawn;
    const ahead = pos.strong === "w" ? pawn + 16 : pawn - 16;
    const target = Math.max(0, Math.min(63, ahead));
    const dist = (m: Move) => {
      const s = (Number(m.to[1]) - 1) * 8 + FILES.indexOf(m.to[0]);
      return Math.max(Math.abs(fileOf(s) - fileOf(target)), Math.abs(rankOf(s) - rankOf(target)));
    };
    const scored = pool.map((m) => ({ m, score: (best === "win" ? 0 : replies(m) * 10) + dist(m) }));
    scored.sort((a, b) => a.score - b.score);
    return uci(scored[0].m);
  }
  // Защитник: берёт пешку, если можно, иначе держится ближе к полю превращения.
  const take = pool.find((m) => m.captured);
  if (take) return uci(take);
  const promoSq = pos.strong === "w" ? 56 + fileOf(pos.pawn) : fileOf(pos.pawn);
  const dist = (m: Move) => {
    const s = (Number(m.to[1]) - 1) * 8 + FILES.indexOf(m.to[0]);
    return Math.max(Math.abs(fileOf(s) - fileOf(promoSq)), Math.abs(rankOf(s) - rankOf(promoSq)));
  };
  const scored = pool.map((m) => ({ m, score: (best === "loss" ? replies(m) * 10 : 0) + dist(m) }));
  scored.sort((a, b) => a.score - b.score);
  return uci(scored[0].m);
}

/**
 * Квадрат пешки: клетки, куда должен попасть король, чтобы догнать её.
 * Если ходит сторона с пешкой — квадрат строится после её хода; с начальной клетки пешка
 * прыгает на две, поэтому считается на клетку дальше.
 */
export function pawnSquare(fen: string): string[] {
  const pos = parseKpk(fen);
  if (!pos) return [];
  const white = pos.strong === "w";
  const f = fileOf(pos.pawn);
  let r = white ? rankOf(pos.pawn) : 7 - rankOf(pos.pawn);
  if (r === 1) r = 2;
  if (pos.turn === pos.strong) r += 1;
  r = Math.min(r, 7);
  const side = 7 - r;
  const defender = pos.strong === "w" ? pos.bk : pos.wk;
  const toRight = fileOf(defender) >= f;
  const cells: string[] = [];
  for (let dr = 0; dr <= side; dr++)
    for (let df = 0; df <= side; df++) {
      const cf = toRight ? f + df : f - df;
      if (cf < 0 || cf > 7) continue;
      const rr = white ? r + dr : 7 - (r + dr);
      cells.push(sqName(cf, rr));
    }
  return cells;
}

/** Догонит ли король пешку: в позиции без помощи своего короля ответ даёт таблица. */
export function kingCatches(fen: string): boolean {
  return kpkProbe(fen) === "draw";
}
