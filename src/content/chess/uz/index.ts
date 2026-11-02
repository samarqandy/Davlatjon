/** Узбекская накладка на шахматный контент целиком: собрана из накладок всех частей (src/content/chess/parts). */
import { CHESS_PARTS, type ChessContentUz } from "../content";

export const CHESS_UZ: ChessContentUz = Object.assign({}, ...CHESS_PARTS.map((p) => p.uz));
