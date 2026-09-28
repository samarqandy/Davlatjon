/** Запись партии в формате PGN — его открывают Lichess, Chess.com и любые шахматные программы. */
import { Chess } from "chess.js";
import type { ChessGameRecord } from "./store";

const ROBOT_NAMES = ["Пешка", "Конь", "Слон", "Ладья", "Ферзь"];
const STANDARD = new Chess().fen();

function pgnDate(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function gamePgn(g: ChessGameRecord, child = "Давлатжон"): string {
  const start = g.start ?? STANDARD;
  const chess = new Chess(start);
  for (const u of g.ucis ?? []) chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] ?? "q" });
  const robot = `Робот «${ROBOT_NAMES[(g.level ?? 1) - 1] ?? ""}»`;
  const [white, black] = g.mode === "robot" ? (g.color === "w" ? [child, robot] : [robot, child]) : ["Белые", "Чёрные"];
  const winner =
    g.winner ?? (g.result === "draw" ? "draw" : g.result === "win" ? g.color : g.color === "w" ? "b" : "w");
  const result = winner === "draw" ? "1/2-1/2" : winner === "w" ? "1-0" : "0-1";
  chess.setHeader("Event", g.mode === "robot" ? "Партия с роботом" : "Партия вдвоём");
  chess.setHeader("Site", "Лаборатория Давлатжона");
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
