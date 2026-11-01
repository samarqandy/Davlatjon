import { defaultPieces, type PieceRenderObject } from "react-chessboard";
import { cn } from "@/components/ui";

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

/** Картинка фигуры из набора доски — для заголовков и карточек. */
export function PieceIcon({ piece, className }: { piece: string; className?: string }) {
  const Svg = PIECES[piece];
  return <span className={cn("inline-block", className)}>{Svg ? <Svg /> : null}</span>;
}
