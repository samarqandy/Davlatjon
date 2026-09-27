/** Режимы игры на доске: с роботом, вдвоём, пешечный бой, тренировка мата. */
import { Chess } from "chess.js";
import { legalMoves, parseFen, sqName, WHITE } from "./engine/board";
import { PAWN_BATTLE_FEN, gameResult, insufficientMaterial, pawnBattleResult } from "./engine/search";
import { random } from "./random";

export type PlayMode = "robot" | "two" | "pawns" | "endgame";

export interface EndgameVariant {
  id: string;
  name: string;
  about: string;
  /** Фигуры белых, кроме короля. */
  pieces: ("q" | "r")[];
  /** Сколько ходов считается отличным результатом. */
  target: number;
}

export const ENDGAMES: EndgameVariant[] = [
  {
    id: "kq",
    name: "Мат ферзём",
    about: "Король и ферзь против короля. Оттесни короля на край и поставь мат — только не пат!",
    pieces: ["q"],
    target: 12,
  },
  {
    id: "kr",
    name: "Мат ладьёй",
    about: "Король и ладья против короля. Здесь без короля не обойтись: ладья одна мат не поставит.",
    pieces: ["r"],
    target: 20,
  },
  {
    id: "krr",
    name: "Мат двумя ладьями",
    about: "Две ладьи ставят мат «лестницей» — королю помогать не обязательно.",
    pieces: ["r", "r"],
    target: 10,
  },
];

const FILES = "abcdefgh";

/** Случайная позиция для тренировки мата: чёрный король в центре, белые фигуры далеко. */
export function endgameStart(variant: EndgameVariant, rnd = random): string {
  for (let attempt = 0; attempt < 200; attempt++) {
    const chess = new Chess("8/8/8/8/8/8/8/8 w - - 0 1", { skipValidation: true });
    const sq = () => `${FILES[Math.floor(rnd() * 8)]}${Math.floor(rnd() * 8) + 1}`;
    const bk = `${FILES[2 + Math.floor(rnd() * 4)]}${3 + Math.floor(rnd() * 4)}`;
    chess.put({ type: "k", color: "b" }, bk as Parameters<typeof chess.put>[1]);
    const far = (s: string) =>
      Math.max(Math.abs(FILES.indexOf(s[0]) - FILES.indexOf(bk[0])), Math.abs(Number(s[1]) - Number(bk[1]))) >= 2;
    const used = new Set([bk]);
    const place = (type: "k" | "q" | "r") => {
      for (let i = 0; i < 50; i++) {
        const s = sq();
        if (used.has(s) || !far(s)) continue;
        chess.put({ type, color: "w" }, s as Parameters<typeof chess.put>[1]);
        used.add(s);
        return true;
      }
      return false;
    };
    if (!place("k") || !variant.pieces.every((p) => place(p))) continue;
    const fen = chess.fen();
    try {
      const check = new Chess(fen);
      if (check.isCheck() || check.isAttacked(bk as Parameters<typeof chess.put>[1], "w")) continue;
      return fen;
    } catch {
      continue;
    }
  }
  return "4k3/8/8/8/8/8/8/Q3K3 w - - 0 1";
}

export interface PlayStatus {
  over: boolean;
  /** Кто победил: w, b или draw. */
  winner?: "w" | "b" | "draw";
  reason?: string;
}

/** Закончилась ли партия и почему. positions — все позиции партии для правила троекратного повторения. */
export function playStatus(mode: PlayMode, fen: string, positions: readonly string[]): PlayStatus {
  const pos = parseFen(fen);
  if (mode === "pawns") {
    const r = pawnBattleResult(pos);
    return r
      ? { over: true, winner: r, reason: r === "w" ? "Пешка белых дошла до края!" : "Пешка чёрных дошла до края!" }
      : { over: false };
  }
  const result = gameResult(pos);
  if (result === "w" || result === "b") return { over: true, winner: result, reason: "Мат!" };
  if (result === "draw") {
    if (legalMoves(pos).length === 0) return { over: true, winner: "draw", reason: "Пат — ничья." };
    if (insufficientMaterial(pos)) return { over: true, winner: "draw", reason: "Ничья: мат уже не поставить." };
    return { over: true, winner: "draw", reason: "Ничья: 50 ходов без взятий и ходов пешками." };
  }
  const key = fen.split(" ").slice(0, 4).join(" ");
  if (positions.filter((p) => p.split(" ").slice(0, 4).join(" ") === key).length >= 3)
    return { over: true, winner: "draw", reason: "Ничья: позиция повторилась три раза." };
  return { over: false };
}

export function startFen(mode: PlayMode, variant?: EndgameVariant): string {
  if (mode === "pawns") return PAWN_BATTLE_FEN;
  if (mode === "endgame" && variant) return endgameStart(variant);
  return new Chess().fen();
}

/** Фигуры, которых не хватает на доске у каждой стороны, — «съеденные». */
export function capturedPieces(fen: string): { w: string[]; b: string[] } {
  const start: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1 };
  const count = { w: { ...start }, b: { ...start } };
  const board = fen.split(" ")[0];
  for (const ch of board) {
    const lower = ch.toLowerCase();
    if (!(lower in start)) continue;
    count[ch === lower ? "b" : "w"][lower]--;
  }
  const list = (side: "w" | "b") =>
    (["q", "r", "b", "n", "p"] as const).flatMap((t) =>
      Array.from({ length: Math.max(0, count[side][t]) }, () => `${side}${t.toUpperCase()}`),
    );
  return { w: list("w"), b: list("b") };
}

/** Клетка короля стороны side в позиции. */
export function kingOf(fen: string, side: "w" | "b"): string | null {
  const pos = parseFen(fen);
  const k = pos.kings[side === "w" ? WHITE : 1];
  return k >= 0 ? sqName(k) : null;
}
