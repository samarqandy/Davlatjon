/** Режимы игры на доске: с роботом, вдвоём, пешечный бой, тренировка мата. */
import { Chess } from "chess.js";
import { legalMoves, parseFen, sqName, WHITE } from "./engine/board";
import { PAWN_BATTLE_FEN, gameResult, insufficientMaterial, pawnBattleResult } from "./engine/search";
import { tFor, type Lang } from "./lang";
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

/** Названия и описания тренировок мата по-узбекски. */
const ENDGAMES_UZ: Record<string, { name: string; about: string }> = {
  kq: {
    name: "Farzin bilan mot",
    about: "Shoh va farzin yolgʻiz shohga qarshi. Shohni chetga siqib bor va mot qil — faqat pat boʻlib qolmasin!",
  },
  kr: {
    name: "Rux bilan mot",
    about: "Shoh va rux yolgʻiz shohga qarshi. Bu yerda shohsiz ish bitmaydi: rux yolgʻiz oʻzi mot qila olmaydi.",
  },
  krr: {
    name: "Ikki rux bilan mot",
    about: "Ikki rux «narvon» usulida mot qiladi — shohning yordami shart emas.",
  },
};

/** Название и описание тренировки мата на нужном языке. */
export function endgameText(v: EndgameVariant, lang: Lang = "ru"): { name: string; about: string } {
  return lang === "uz" ? (ENDGAMES_UZ[v.id] ?? v) : v;
}

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
  /** Партия закончилась матом (по этому признаку, а не по тексту, радуемся мату). */
  mate?: boolean;
}

/** Закончилась ли партия и почему. positions — все позиции партии для правила троекратного повторения. */
export function playStatus(mode: PlayMode, fen: string, positions: readonly string[], lang: Lang = "ru"): PlayStatus {
  const t = tFor(lang);
  const pos = parseFen(fen);
  if (mode === "pawns") {
    const r = pawnBattleResult(pos);
    return r
      ? {
          over: true,
          winner: r,
          reason:
            r === "w"
              ? t("Пешка белых дошла до края!", "Oqlarning piyodasi chetga yetib bordi!")
              : t("Пешка чёрных дошла до края!", "Qoralarning piyodasi chetga yetib bordi!"),
        }
      : { over: false };
  }
  const result = gameResult(pos);
  if (result === "w" || result === "b") return { over: true, winner: result, reason: t("Мат!", "Mot!"), mate: true };
  if (result === "draw") {
    if (legalMoves(pos).length === 0) return { over: true, winner: "draw", reason: t("Пат — ничья.", "Pat — durang.") };
    if (insufficientMaterial(pos))
      return {
        over: true,
        winner: "draw",
        reason: t("Ничья: мат уже не поставить.", "Durang: endi hech kim mot qila olmaydi."),
      };
    return {
      over: true,
      winner: "draw",
      reason: t(
        "Ничья: 50 ходов без взятий и ходов пешками.",
        "Durang: 50 yurish davomida hech narsa urilmadi va piyodalar yurmadi.",
      ),
    };
  }
  const key = fen.split(" ").slice(0, 4).join(" ");
  if (positions.filter((p) => p.split(" ").slice(0, 4).join(" ") === key).length >= 3)
    return {
      over: true,
      winner: "draw",
      reason: t("Ничья: позиция повторилась три раза.", "Durang: pozitsiya uch marta takrorlandi."),
    };
  return { over: false };
}

export function startFen(mode: PlayMode, variant?: EndgameVariant): string {
  if (mode === "pawns") return PAWN_BATTLE_FEN;
  if (mode === "endgame" && variant) return endgameStart(variant);
  return new Chess().fen();
}

/**
 * Съеденные фигуры каждой стороны — по сравнению с началом этой партии
 * (в игре с форой или «пешечном бою» фигур изначально меньше, и лишних «съеденных» быть не должно).
 * Превращённая пешка считается ушедшей с доски пешкой, а не лишней фигурой.
 */
export function capturedPieces(fen: string, start: string = new Chess().fen()): { w: string[]; b: string[] } {
  const TYPES = ["q", "r", "b", "n", "p"] as const;
  const count = (f: string) => {
    const c = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } };
    for (const ch of f.split(" ")[0]) {
      const lower = ch.toLowerCase() as (typeof TYPES)[number];
      if (TYPES.includes(lower)) c[ch === lower ? "b" : "w"][lower]++;
    }
    return c;
  };
  const was = count(start);
  const now = count(fen);
  const list = (side: "w" | "b") => {
    const lost = { p: 0, n: 0, b: 0, r: 0, q: 0 };
    let promoted = 0;
    for (const t of ["q", "r", "b", "n"] as const) {
      const diff = was[side][t] - now[side][t];
      if (diff >= 0) lost[t] = diff;
      else promoted -= diff;
    }
    lost.p = Math.max(0, was[side].p - now[side].p - promoted);
    return TYPES.flatMap((t) => Array.from({ length: lost[t] }, () => `${side}${t.toUpperCase()}`));
  };
  return { w: list("w"), b: list("b") };
}

/** Клетка короля стороны side в позиции. */
export function kingOf(fen: string, side: "w" | "b"): string | null {
  const pos = parseFen(fen);
  const k = pos.kings[side === "w" ? WHITE : 1];
  return k >= 0 ? sqName(k) : null;
}

// ---------------------------------------------------------------------------
// Фора и шахматные часы
// ---------------------------------------------------------------------------

export type OddsPiece = "q" | "r" | "n" | "p";

export interface Odds {
  /** Кто играет без фигуры. */
  side: "w" | "b";
  piece: OddsPiece;
}

export const ODDS_PIECES: { id: OddsPiece; label: string; labelUz: string; square: { w: string; b: string } }[] = [
  { id: "q", label: "без ферзя", labelUz: "farzinsiz", square: { w: "d1", b: "d8" } },
  { id: "r", label: "без ладьи", labelUz: "ruxsiz", square: { w: "a1", b: "a8" } },
  { id: "n", label: "без коня", labelUz: "otsiz", square: { w: "b1", b: "b8" } },
  { id: "p", label: "без пешки f", labelUz: "f piyodasiz", square: { w: "f2", b: "f7" } },
];

/** «без ферзя» / «farzinsiz» — подпись форы на нужном языке. */
export function oddsPieceLabel(piece: string | undefined, lang: Lang = "ru"): string {
  const meta = ODDS_PIECES.find((o) => o.id === piece);
  return (lang === "uz" ? meta?.labelUz : meta?.label) ?? "";
}

/** Начальная позиция, из которой убрана фигура стороны side (фора). Рокировку с убранной ладьёй запрещаем. */
export function withOdds(fen: string, odds: Odds): string {
  const [board, turn, castling, ...rest] = fen.split(" ");
  const meta = ODDS_PIECES.find((o) => o.id === odds.piece);
  if (!meta) return fen;
  const square = meta.square[odds.side];
  const rows = board.split("/").map((row) => row.replace(/\d/g, (d) => ".".repeat(Number(d))).split(""));
  const file = square.charCodeAt(0) - 97;
  const row = 8 - Number(square[1]);
  rows[row][file] = ".";
  const packed = rows.map((r) => r.join("").replace(/\.+/g, (dots) => String(dots.length))).join("/");
  let rights = castling;
  if (odds.piece === "r") rights = rights.replace(odds.side === "w" ? "Q" : "q", "");
  return [packed, turn, rights || "-", ...rest].join(" ");
}

export function oddsLabel(odds: Odds, lang: Lang = "ru"): string {
  const side = lang === "uz" ? (odds.side === "w" ? "oqlar" : "qoralar") : odds.side === "w" ? "белые" : "чёрные";
  return `${side} ${oddsPieceLabel(odds.piece, lang)}`;
}

export interface ClockSetting {
  id: string;
  /** Минуты на партию. */
  base: number;
  /** Добавка секунд за каждый ход. */
  inc: number;
}

export const CLOCKS: ClockSetting[] = [
  { id: "3_2", base: 3, inc: 2 },
  { id: "5_3", base: 5, inc: 3 },
  { id: "10_5", base: 10, inc: 5 },
  { id: "15_10", base: 15, inc: 10 },
];

export function clockLabel(c: ClockSetting, lang: Lang = "ru"): string {
  return lang === "uz" ? `${c.base} daqiqa + ${c.inc} soniya` : `${c.base} мин + ${c.inc} с`;
}

/** Время на часах: «4:07», меньше 10 секунд — с десятыми: «8.3». */
export function formatClock(ms: number): string {
  const t = Math.max(0, ms);
  if (t < 10_000) return (Math.floor(t / 100) / 10).toFixed(1);
  const s = Math.ceil(t / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
