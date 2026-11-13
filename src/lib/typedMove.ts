/**
 * Ход, записанный текстом, → ход на доске. Для игры вслепую: ребёнок пишет «Кf3», «e4», «exd5», «0-0» или «g1f3».
 *
 * Понимаем три записи фигур — русскую (Кр, Ф, Л, С, К), международную (K, Q, R, B, N) и фигурками (♔♕♖♗♘) —
 * и не требуем значков: «x», «+», «#», «=» можно не ставить. Только расчёты, без React.
 */
import { Chess, type Move } from "chess.js";

export type TypedMove =
  | { kind: "move"; uci: string; san: string }
  /** Подходит несколько ходов: «Кd2», когда на d2 могут пойти оба коня. */
  | { kind: "ambiguous"; sans: string[] }
  | { kind: "none" };

const FIGURINES: Record<string, string> = {
  "♔": "K",
  "♕": "Q",
  "♖": "R",
  "♗": "B",
  "♘": "N",
  "♚": "K",
  "♛": "Q",
  "♜": "R",
  "♝": "B",
  "♞": "N",
};
/** Русские буквы фигур; «Кр» разбирается раньше «К». */
const RU_PIECES: [string, string][] = [
  ["Кр", "K"],
  ["Ф", "Q"],
  ["Л", "R"],
  ["С", "B"],
  ["К", "N"],
];
/** Кириллические буквы, которые выглядят как латинские названия вертикалей: набраны на русской раскладке. */
const LOOKALIKE: Record<string, string> = { а: "a", с: "c", е: "e" };

const uciOf = (m: Move) => m.from + m.to + (m.promotion ?? "");

/** Убрать всё необязательное: пробелы, взятие, шах, мат, знак превращения, оценки хода. */
const strip = (s: string) => s.replace(/[\s+#!?x×:=\-–—.]/g, "").replace(/х/g, "");

function castling(text: string): string | null {
  const t = text.replace(/[\s+#!?]/g, "").replace(/[OoОо]/g, "0");
  if (/^0[-–—]?0$/.test(t)) return "O-O";
  if (/^0[-–—]?0[-–—]?0$/.test(t)) return "O-O-O";
  return null;
}

/** Буквы фигур — к международным: в начале хода и в конце (превращение «e8Ф»). */
function pieces(text: string, anyCase: boolean): string {
  let s = [...text].map((ch) => FIGURINES[ch] ?? ch).join("");
  for (const [ru, en] of RU_PIECES) {
    const forms = anyCase ? [ru, ru.toLowerCase()] : [ru];
    for (const f of forms) {
      if (s.startsWith(f)) s = en + s.slice(f.length);
      else if (s.length > 2 && s.endsWith(f)) s = s.slice(0, -f.length) + en;
    }
  }
  return s;
}

/** Все записи, которыми можно назвать этот ход (уже без необязательных значков). */
function spellings(m: Move): string[] {
  const san = strip(m.san);
  const out = [san, m.from + m.to + (m.promotion ? m.promotion.toUpperCase() : "")];
  if (m.piece === "p") {
    // Взятие пешкой коротко: «ed» и «ed5».
    if (m.from[0] !== m.to[0]) out.push(m.from[0] + m.to[0]);
    // Превращение без буквы — в ферзя.
    if (m.promotion === "q") out.push(san.slice(0, -1), m.from + m.to);
  } else if (m.piece !== "k" || !m.san.startsWith("O")) {
    // Без уточнения, с какой клетки: если так может пойти не одна фигура, запись подойдёт нескольким ходам.
    out.push(m.piece.toUpperCase() + m.to);
  }
  return out;
}

export function matchTypedMove(fen: string, text: string): TypedMove {
  const raw = text.trim();
  if (!raw) return { kind: "none" };
  const legal = new Chess(fen).moves({ verbose: true });
  const found = (hit: Move[]): TypedMove | null => {
    const unique = [...new Map(hit.map((m) => [uciOf(m), m])).values()];
    if (unique.length === 1) return { kind: "move", uci: uciOf(unique[0]), san: unique[0].san };
    return unique.length > 1 ? { kind: "ambiguous", sans: unique.map((m) => m.san) } : null;
  };

  const castle = castling(raw);
  if (castle) return found(legal.filter((m) => m.san.replace(/[+#]/g, "") === castle)) ?? { kind: "none" };

  const look = (s: string) => [...s].map((ch, i) => (i > 0 || s.length <= 2 ? (LOOKALIKE[ch] ?? ch) : ch)).join("");
  // Сначала — как написано: «Bc4» — слон, «bc4» — пешка b бьёт на c4.
  const exact = strip(pieces(raw, false));
  const strict = found(legal.filter((m) => spellings(m).some((s) => s === exact || s === look(exact))));
  if (strict) return strict;

  // Потом — не глядя на размер букв: «кf3», «nf3», «E4». Строчная «с» — и слон, и вертикаль «c».
  // Запись «как с русской раскладки» целиком: «е2е4», «сd4» (а «сd4» — ещё и слон на d4: если можно и так, и так — спросим).
  const lower = (s: string) => s.toLowerCase();
  const lookAll = (s: string) => [...s].map((ch) => LOOKALIKE[ch] ?? ch).join("");
  const wanted = new Set(
    [strip(pieces(raw, true)), strip(raw)].flatMap((s) => [
      lower(s),
      lower(look(s)),
      lower(look(lower(s))),
      lookAll(lower(s)),
    ]),
  );
  return found(legal.filter((m) => spellings(m).some((s) => wanted.has(lower(s))))) ?? { kind: "none" };
}
