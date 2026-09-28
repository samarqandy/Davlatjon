/** Запись партии в формате PGN — его открывают Lichess, Chess.com и любые шахматные программы. */
import { Chess } from "chess.js";
import { tFor, type Lang } from "./lang";
import type { ChessGameRecord } from "./store";

const ROBOT_NAMES = ["Пешка", "Конь", "Слон", "Ладья", "Ферзь"];
const ROBOT_NAMES_UZ = ["Piyoda", "Ot", "Fil", "Rux", "Farzin"];
const STANDARD = new Chess().fen();

function pgnDate(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Запись партии. Теги PGN и ходы — стандартные (их читают программы), по-узбекски пишутся только
 * имена игроков, турнир и место — то, что видит ребёнок.
 */
export function gamePgn(
  g: ChessGameRecord,
  lang: Lang = "ru",
  child = lang === "uz" ? "Davlatjon" : "Давлатжон",
): string {
  const t = tFor(lang);
  const start = g.start ?? STANDARD;
  const chess = new Chess(start);
  for (const u of g.ucis ?? []) chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] ?? "q" });
  const level = (g.level ?? 1) - 1;
  const robot = t(`Робот «${ROBOT_NAMES[level] ?? ""}»`, `Robot «${ROBOT_NAMES_UZ[level] ?? ""}»`);
  const [white, black] =
    g.mode === "robot"
      ? g.color === "w"
        ? [child, robot]
        : [robot, child]
      : [t("Белые", "Oqlar"), t("Чёрные", "Qoralar")];
  const winner =
    g.winner ?? (g.result === "draw" ? "draw" : g.result === "win" ? g.color : g.color === "w" ? "b" : "w");
  const result = winner === "draw" ? "1/2-1/2" : winner === "w" ? "1-0" : "0-1";
  chess.setHeader(
    "Event",
    g.mode === "robot" ? t("Партия с роботом", "Robot bilan partiya") : t("Партия вдвоём", "Ikki kishilik partiya"),
  );
  chess.setHeader("Site", t("Лаборатория Давлатжона", "Davlatjon laboratoriyasi"));
  chess.setHeader("Date", pgnDate(g.at));
  chess.setHeader("White", white);
  chess.setHeader("Black", black);
  chess.setHeader("Result", result);
  if (start !== STANDARD) {
    chess.setHeader("SetUp", "1");
    chess.setHeader("FEN", start);
  }
  const pgn = chess.pgn();
  return /(1-0|0-1|1\/2-1\/2|\*)\s*$/.test(pgn) ? pgn : `${pgn} ${result}`;
}
