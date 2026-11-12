import { defaultPieces, type PieceRenderObject } from "react-chessboard";
import { cn } from "@/components/ui";
import { isPieceSetId, pieceSrc } from "@/lib/boardLook";

/**
 * Фигуры доски отдельно от самой доски: значок фигуры на главной и в карточках не должен тянуть
 * шахматный движок, звуки и логику ходов.
 */
function StarPiece() {
  return (
    <svg viewBox="0 0 45 45" width="100%" height="100%" aria-hidden>
      <path
        d="M22.5 5 L27.4 16.3 L39.7 17.4 L30.4 25.5 L33.2 37.5 L22.5 31.2 L11.8 37.5 L14.6 25.5 L5.3 17.4 L17.6 16.3 Z"
        fill="#fbbf24"
        stroke="#b45309"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const PIECES: PieceRenderObject = { ...defaultPieces, star: StarPiece };

const CODES = ["wK", "wQ", "wR", "wB", "wN", "wP", "bK", "bQ", "bR", "bB", "bN", "bP"];
const sets = new Map<string, PieceRenderObject>([["classic", PIECES]]);

/**
 * Фигуры выбранного набора (настройка «Моя доска»). Свободные наборы лежат картинками в public/pieces:
 * картинка не перехватывает перетаскивание и нажатие — их обрабатывает клетка доски.
 */
export function piecesOf(setId: string | undefined): PieceRenderObject {
  if (!setId || !isPieceSetId(setId)) return PIECES;
  let set = sets.get(setId);
  if (!set) {
    set = { ...PIECES };
    for (const code of CODES) {
      const src = pieceSrc(setId, code);
      const Piece = () => (
        // eslint-disable-next-line @next/next/no-img-element -- SVG из public: оптимизатор картинок ему не нужен
        <img src={src} alt="" draggable={false} className="pointer-events-none block h-full w-full" />
      );
      Piece.displayName = `Piece(${setId}/${code})`;
      set[code] = Piece;
    }
    sets.set(setId, set);
  }
  return set;
}

/** Картинка фигуры из набора доски — для заголовков и карточек. */
export function PieceIcon({ piece, className }: { piece: string; className?: string }) {
  const Svg = PIECES[piece];
  return <span className={cn("inline-block", className)}>{Svg ? <Svg /> : null}</span>;
}
