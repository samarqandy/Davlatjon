/**
 * Разбор партии: движок оценивает каждую позицию, а по оценкам до и после хода
 * считаем, сколько «шансов на победу» потерял игрок, точность в процентах и вид хода —
 * лучший, хороший, неточность, ошибка, зевок. К ошибкам — объяснение простыми словами.
 */
import { attackersOf, pieceAt, playMove, ruSan, sanOf, type PieceType } from "@/lib/chess";
import type { ChessGameRecord } from "@/lib/store";
import { MATE, searchBest } from "./search";

export type MoveKind = "best" | "good" | "inaccuracy" | "mistake" | "blunder" | "mate";

export interface PositionEval {
  /** Оценка с точки зрения белых, в сотых долях пешки; мат — ±MATE. */
  score: number;
  /** Лучший ход в позиции (null — ходов нет). */
  best: string | null;
}

export interface PlyReview {
  /** Номер полухода, с 1. */
  ply: number;
  side: "w" | "b";
  fenBefore: string;
  fenAfter: string;
  uci: string;
  san: string;
  best: string | null;
  bestSan: string | null;
  /** Шансы игрока на победу до и после хода, 0–100. */
  winBefore: number;
  winAfter: number;
  /** Сколько процентов шансов потеряно. */
  drop: number;
  /** Точность хода 0–100. */
  accuracy: number;
  kind: MoveKind;
  /** Объяснение для ребёнка (для неточностей, ошибок и зевков). */
  reason?: string;
}

export interface SideSummary {
  accuracy: number;
  moves: number;
  counts: Record<MoveKind, number>;
}

export interface GameReview {
  plies: PlyReview[];
  /** Шансы белых на победу после каждого полухода (с начальной позицией), 0–100. */
  whiteWin: number[];
  sides: { w: SideSummary; b: SideSummary };
}

export const ANALYSIS_DEPTH = 3;

/** Оценка одной позиции — её можно считать по одной, чтобы не подвешивать страницу. */
export function evaluatePosition(fen: string, timeMs = 400, depth = ANALYSIS_DEPTH): PositionEval {
  const r = searchBest(fen, { depth, timeMs });
  const white = fen.split(" ")[1] === "w";
  return { score: white ? r.score : -r.score, best: r.uci };
}

/** Мат в оценке → большое, но конечное число: так удобнее считать шансы. */
function toCp(score: number): number {
  if (score > MATE - 1000) return 2000;
  if (score < -MATE + 1000) return -2000;
  return Math.max(-2000, Math.min(2000, score));
}

/** Шансы на победу (0–100) по оценке в сотых долях пешки — та же формула, что у Lichess. */
export function winChance(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * toCp(cp))) - 1);
}

/** Точность хода по потере шансов на победу. */
export function moveAccuracy(drop: number): number {
  return Math.max(0, Math.min(100, 103.1668 * Math.exp(-0.04354 * drop) - 3.1669));
}

/** Через сколько ходов мат, если оценка — мат (для стороны, у которой положительная оценка). */
function mateMoves(score: number): number | null {
  const a = Math.abs(score);
  return a > MATE - 1000 ? Math.ceil((MATE - a) / 2) : null;
}

const ACC: Record<PieceType, string> = {
  p: "пешку",
  n: "коня",
  b: "слона",
  r: "ладью",
  q: "ферзя",
  k: "короля",
};

function explain(r: PlyReview, before: PositionEval, after: PositionEval): string {
  const mover = r.side === "w" ? 1 : -1;
  const bestLine = r.bestSan ? ` Лучше было ${ruSan(r.bestSan)}.` : "";
  // 1. Был мат — а его не заметили.
  const hadMate = mateMoves(before.score);
  if (hadMate && before.score * mover > 0 && r.best) {
    return hadMate === 1
      ? `Здесь был мат в один ход: ${ruSan(r.bestSan ?? r.best)}! Перед каждым ходом ищи шахи — вдруг это мат.`
      : `Здесь был мат в ${hadMate} хода, первый ход — ${ruSan(r.bestSan ?? r.best)}. Шахи и взятия проверяй первыми.`;
  }
  // 2. Ход разрешил сопернику поставить мат.
  const theyMate = mateMoves(after.score);
  if (theyMate && after.score * mover < 0 && after.best) {
    const reply = ruSan(sanOf(r.fenAfter, after.best));
    return theyMate === 1
      ? `После этого хода соперник ставит мат: ${reply}. Посмотри, что будет, если соперник сделает шах.${bestLine}`
      : `После этого хода у соперника есть мат в ${theyMate} хода — начинается с ${reply}.${bestLine}`;
  }
  const missed = r.best ? pieceAt(r.fenBefore, r.best.slice(2, 4)) : null;
  const missedCapture =
    missed && missed.color !== r.side
      ? `Можно было взять ${ACC[missed.type]}: ${ruSan(r.bestSan ?? r.best ?? "")}. Смотри, что стоит без защиты у соперника.`
      : null;
  // 3. После хода фигура под боем.
  if (after.best) {
    const square = after.best.slice(2, 4);
    const target = pieceAt(r.fenAfter, square);
    if (target && target.color === r.side) {
      const reply = ruSan(sanOf(r.fenAfter, after.best));
      const moved = r.uci.slice(2, 4) === square;
      const was = pieceAt(r.fenBefore, square);
      const opponent = r.side === "w" ? "b" : "w";
      const alreadyAttacked =
        !moved &&
        was?.type === target.type &&
        was.color === r.side &&
        attackersOf(r.fenBefore, square, opponent).length > 0;
      if (alreadyAttacked && missedCapture) return missedCapture;
      if (alreadyAttacked)
        return `Не спасли ${ACC[target.type]} на ${square}: соперник возьмёт ходом ${reply}. Если фигуру атакуют — уведи её или защити.${bestLine}`;
      return moved
        ? `Фигура встала под удар: соперник возьмёт ${ACC[target.type]} ходом ${reply}. Перед ходом спроси себя: «Кто может меня взять?»${bestLine}`
        : `Теперь соперник может взять ${ACC[target.type]} на ${square}: ${reply}.${bestLine}`;
    }
  }
  // 4. Пропустили взятие.
  if (missedCapture) return missedCapture;
  // 5. Ход не проиграл фигуру, но позиция стала хуже.
  return r.kind === "inaccuracy"
    ? `Ход неплохой, но есть сильнее: ${ruSan(r.bestSan ?? r.best ?? "")}.`
    : `После этого хода позиция стала заметно хуже.${bestLine}`;
}

/** Разбор по готовым оценкам всех позиций: evals[k] — позиция после k полуходов. */
export function buildReview(start: string, ucis: readonly string[], evals: readonly PositionEval[]): GameReview {
  const fens = [start];
  const plies: PlyReview[] = [];
  for (const [i, uci] of ucis.entries()) {
    const fenBefore = fens[i];
    const played = playMove(fenBefore, uci.slice(0, 2), uci.slice(2, 4), (uci[4] as PieceType) ?? "q");
    if (!played) break;
    fens.push(played.fen);
    const side = fenBefore.split(" ")[1] as "w" | "b";
    const sign = side === "w" ? 1 : -1;
    const before = evals[i];
    const after = evals[i + 1];
    if (!before || !after) break;
    const isBest = before.best === played.uci;
    const winBefore = winChance(sign * before.score);
    const winAfter = winChance(sign * after.score);
    const drop = isBest || played.mate ? 0 : Math.max(0, winBefore - winAfter);
    const kind: MoveKind = played.mate
      ? "mate"
      : isBest
        ? "best"
        : drop >= 30
          ? "blunder"
          : drop >= 20
            ? "mistake"
            : drop >= 10
              ? "inaccuracy"
              : "good";
    const r: PlyReview = {
      ply: i + 1,
      side,
      fenBefore,
      fenAfter: played.fen,
      uci: played.uci,
      san: played.san,
      best: before.best,
      bestSan: before.best ? sanOf(fenBefore, before.best) : null,
      winBefore,
      winAfter,
      drop,
      accuracy: moveAccuracy(drop),
      kind,
    };
    if (kind === "inaccuracy" || kind === "mistake" || kind === "blunder") r.reason = explain(r, before, after);
    plies.push(r);
  }
  const summary = (side: "w" | "b"): SideSummary => {
    const list = plies.filter((p) => p.side === side);
    const counts: Record<MoveKind, number> = { best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, mate: 0 };
    for (const p of list) counts[p.kind]++;
    const accuracy = list.length ? list.reduce((s, p) => s + p.accuracy, 0) / list.length : 0;
    return { accuracy: Math.round(accuracy), moves: list.length, counts };
  };
  return {
    plies,
    whiteWin: evals.slice(0, plies.length + 1).map((e) => winChance(e.score)),
    sides: { w: summary("w"), b: summary("b") },
  };
}

/** Все позиции партии: старт и позиция после каждого хода. */
export function gamePositions(start: string, ucis: readonly string[]): string[] {
  const fens = [start];
  for (const uci of ucis) {
    const played = playMove(fens[fens.length - 1], uci.slice(0, 2), uci.slice(2, 4), (uci[4] as PieceType) ?? "q");
    if (!played) break;
    fens.push(played.fen);
  }
  return fens;
}

/** Разбор целиком — для тестов и коротких партий. */
export function analyzeGame(start: string, ucis: readonly string[], timeMs = 400): GameReview {
  const evals = gamePositions(start, ucis).map((fen) => evaluatePosition(fen, timeMs));
  return buildReview(start, ucis, evals);
}

export const KIND_META: Record<MoveKind, { label: string; mark: string; color: string }> = {
  best: { label: "лучший ход", mark: "✓", color: "#059669" },
  good: { label: "хороший ход", mark: "", color: "#64748b" },
  inaccuracy: { label: "неточность", mark: "?!", color: "#ca8a04" },
  mistake: { label: "ошибка", mark: "?", color: "#ea580c" },
  blunder: { label: "зевок", mark: "??", color: "#dc2626" },
  mate: { label: "мат", mark: "#", color: "#4f46e5" },
};

/** Хорош ли ход в позиции почти как лучший: оценка не хуже чем на margin сотых пешки. */
export function isAlmostBest(fen: string, uci: string, best: string, margin = 40, depth = 2): boolean {
  if (uci === best) return true;
  const score = (u: string) => {
    const played = playMove(fen, u.slice(0, 2), u.slice(2, 4), (u[4] as PieceType) ?? "q");
    if (!played) return -Infinity;
    if (played.mate) return MATE;
    return -searchBest(played.fen, { depth, timeMs: 300 }).score;
  };
  return score(uci) >= score(best) - margin;
}

/** Что сохранить после разбора: оценки, точность и ошибки для задач. */
export function analysisRecord(
  evals: readonly PositionEval[],
  review: GameReview,
): NonNullable<ChessGameRecord["analysis"]> {
  return {
    evals: evals.map((e) => e.score),
    best: evals.map((e) => e.best),
    acc: { w: review.sides.w.accuracy, b: review.sides.b.accuracy },
    moments: review.plies
      .filter((p) => (p.kind === "mistake" || p.kind === "blunder") && p.best && p.bestSan)
      .map((p) => ({
        ply: p.ply,
        side: p.side,
        fen: p.fenBefore,
        san: p.san,
        best: p.best!,
        bestSan: p.bestSan!,
        kind: p.kind as "mistake" | "blunder",
      })),
  };
}
