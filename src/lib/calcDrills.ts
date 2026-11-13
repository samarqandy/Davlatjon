/**
 * Тренажёры расчёта: «Не зевни!», «Ходы в уме» и «Сосчитай удары».
 * Здесь только расчёты — без React, чтобы их можно было проверить тестами. Позиции — из банка задач:
 * у каждой задачи есть позиция до хода соперника (fen) и ходы: ход соперника, решение, ответ, решение…
 */
import { Chess, type Move, type Square } from "chess.js";
import type { Color } from "./chess";

export type Rng = () => number;

/** То, что тренажёрам нужно от задачи банка. */
export interface DrillSource {
  fen: string;
  moves: string[];
}

const uciOf = (m: Move) => m.from + m.to + (m.promotion ?? "");
const other = (c: Color): Color => (c === "w" ? "b" : "w");

function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function after(fen: string, uci: string): Chess | null {
  const chess = new Chess(fen);
  try {
    chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    return chess;
  } catch {
    return null;
  }
}

/** Ход, которым тот, чья очередь, ставит мат в один ход (запись UCI), или null. */
export function mateInOne(fen: string): string | null {
  const chess = new Chess(fen);
  for (const m of chess.moves({ verbose: true })) if (m.san.endsWith("#")) return uciOf(m);
  return null;
}

// ---------------------------------------------------------------------------
// «Не зевни!»
// ---------------------------------------------------------------------------

/**
 * Три хода на выбор. После одного из них — зевка из настоящей партии — соперник ставит мат в один ход;
 * после двух других мата в один ход нет (проверено перебором).
 */
export interface BlunderRound {
  fen: string;
  /** Чей ход — за кого думает ребёнок. */
  color: Color;
  /** Три хода (UCI) в порядке показа. */
  options: string[];
  /** Номер зевка в options. */
  bad: number;
  /** Ход соперника, который ставит мат после зевка (UCI). */
  punish: string;
}

export function blunderRound(p: DrillSource, rng: Rng): BlunderRound | null {
  const chess = new Chess(p.fen);
  if (chess.isCheck()) return null;
  const slip = after(p.fen, p.moves[0]);
  const punish = slip && mateInOne(slip.fen());
  if (!slip || !punish) return null;
  // Безопасные ходы ищем по одному, в случайном порядке, и останавливаемся на втором: проверять все ходы
  // незачем, а каждая проверка — перебор ответов соперника.
  const safe: string[] = [];
  for (const m of shuffle(chess.moves({ verbose: true }), rng)) {
    const uci = uciOf(m);
    if (uci === p.moves[0]) continue;
    const next = after(p.fen, uci)!;
    if (next.isGameOver() || mateInOne(next.fen())) continue;
    safe.push(uci);
    if (safe.length === 2) break;
  }
  if (safe.length < 2) return null;
  const options = shuffle([p.moves[0], ...safe], rng);
  return { fen: p.fen, color: chess.turn(), options, bad: options.indexOf(p.moves[0]), punish };
}

// ---------------------------------------------------------------------------
// «Ходы в уме»
// ---------------------------------------------------------------------------

/**
 * Мат в два хода, но первый ход и ответ соперника уже сделаны — только не на доске, а в уме: доска показывает
 * позицию до них. Нужно выбрать из трёх ходов тот, что ставит мат в позиции, которой на доске нет.
 */
export interface BlindRound {
  /** Позиция на доске. */
  fen: string;
  color: Color;
  /** Два хода «в уме»: свой и ответ соперника (SAN). */
  line: [string, string];
  /** Позиция после этих ходов — её показывают только после ответа. */
  final: string;
  /** Три хода (UCI) в позиции final. */
  options: string[];
  /** Номер матующего хода в options. */
  mate: number;
}

export function blindRound(p: DrillSource, rng: Rng): BlindRound | null {
  if (p.moves.length !== 4) return null;
  const start = after(p.fen, p.moves[0]);
  if (!start) return null;
  const chess = new Chess(start.fen());
  const line: string[] = [];
  for (const u of p.moves.slice(1, 3)) {
    try {
      line.push(chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san);
    } catch {
      return null;
    }
  }
  const legal = chess.moves({ verbose: true });
  const mates = legal.filter((m) => m.san.endsWith("#"));
  // Мат должен быть один: иначе среди «неверных» ходов оказался бы верный.
  if (mates.length !== 1) return null;
  // Обманки — самые похожие на мат ходы: сначала шахи, потом взятия, потом остальные.
  const checks = legal.filter((m) => m.san.endsWith("+"));
  const captures = legal.filter((m) => m.san.includes("x") && !/[+#]$/.test(m.san));
  const quiet = legal.filter((m) => !m.san.includes("x") && !/[+#]$/.test(m.san));
  const decoys = [...shuffle(checks, rng), ...shuffle(captures, rng), ...shuffle(quiet, rng)].slice(0, 2);
  if (decoys.length < 2) return null;
  const options = shuffle([mates[0], ...decoys].map(uciOf), rng);
  return {
    fen: start.fen(),
    color: start.turn(),
    line: [line[0], line[1]],
    final: chess.fen(),
    options,
    mate: options.indexOf(uciOf(mates[0])),
  };
}

/** Запись хода без «+» и «#»: в вариантах ответа они выдали бы верный ход. */
export const plainSan = (san: string) => san.replace(/[+#]$/, "");

// ---------------------------------------------------------------------------
// «Сосчитай удары»
// ---------------------------------------------------------------------------

/** Фигура, на которую нападают: сколько нападающих и сколько защитников. */
export interface CountQuestion {
  fen: string;
  square: string;
  /** Цвет фигуры на клетке. */
  color: Color;
  /** Клетки фигур соперника, которые бьют эту клетку. */
  attackers: string[];
  /** Клетки своих фигур, которые её защищают. */
  defenders: string[];
}

/**
 * Клетки, про которые можно спросить без спора о правилах счёта: фигура не король, на неё кто-то нападает,
 * всего нападающих и защитников не меньше двух (и не больше четырёх с каждой стороны), и среди них нет ни «рентгена» (фигура стоит за другой на той же
 * линии и ударит только после размена), ни связанных фигур (ударить не могут: откроют своего короля).
 */
export function countQuestions(fen: string): CountQuestion[] {
  const chess = new Chess(fen);
  if (chess.isCheck()) return [];
  const kings: Partial<Record<Color, Square>> = {};
  for (const row of chess.board()) for (const cell of row) if (cell?.type === "k") kings[cell.color] = cell.square;
  const out: CountQuestion[] = [];
  for (const row of chess.board())
    for (const cell of row) {
      if (!cell || cell.type === "k") continue;
      const attackers = chess.attackers(cell.square, other(cell.color));
      const defenders = chess.attackers(cell.square, cell.color);
      const all = [...attackers, ...defenders];
      // Кнопок ответа — от 0 до 4: больше четырёх с одной стороны не спрашиваем.
      if (!attackers.length || all.length < 2 || attackers.length > 4 || defenders.length > 4) continue;
      const clear = all.every((from) => {
        const piece = chess.get(from)!;
        const without = new Chess(fen);
        without.remove(from);
        const seen = without.attackers(cell.square, "w").length + without.attackers(cell.square, "b").length;
        if (seen !== all.length - 1) return false;
        const king = kings[piece.color];
        return piece.type === "k" || !king || !without.isAttacked(king, other(piece.color));
      });
      if (clear)
        out.push({
          fen,
          square: cell.square,
          color: cell.color,
          attackers: [...attackers].sort(),
          defenders: [...defenders].sort(),
        });
    }
  return out;
}

/** Вопрос для раунда: из подходящих клеток — та, где считать больше всего (при равенстве — случайная). */
export function countRound(fen: string, rng: Rng): CountQuestion | null {
  const all = shuffle(countQuestions(fen), rng);
  if (!all.length) return null;
  const size = (q: CountQuestion) => q.attackers.length + q.defenders.length;
  return all.reduce((best, q) => (size(q) > size(best) ? q : best));
}
