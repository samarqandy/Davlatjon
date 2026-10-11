/** Конфетти без случайности во время рендера: кусочки считаются детерминированно по зерну (чистая функция). */
export interface ConfettiPiece {
  /** Откуда падает, % ширины экрана. */
  x: number;
  /** Куда уносит по горизонтали, vw. */
  drift: number;
  /** Поворот за время падения, градусы. */
  spin: number;
  /** Задержка и длительность, мс. */
  delay: number;
  duration: number;
  /** Размер, px. */
  w: number;
  h: number;
  round: boolean;
  color: string;
}

/** Цвета платформы + голубой и синий из логотипа. */
export const CONFETTI_COLORS = ["#4f46e5", "#f59e0b", "#10b981", "#e11d48", "#10f0ff", "#1d5bff"] as const;

/** Все кусочки к этому моменту уже упали и убраны. */
export const CONFETTI_LIFETIME_MS = 3800;
/** Сколько кусочков рисуем; на узком экране показывается каждый второй. */
export const CONFETTI_COUNT = 56;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function confettiPieces(count: number = CONFETTI_COUNT, seed = 7): ConfettiPiece[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => {
    const w = 6 + Math.round(rnd() * 6);
    return {
      x: Math.round(rnd() * 1000) / 10,
      drift: Math.round((rnd() - 0.5) * 360) / 10,
      spin: Math.round((rnd() < 0.5 ? -1 : 1) * (240 + rnd() * 480)),
      delay: Math.round(rnd() * 600),
      duration: 1800 + Math.round(rnd() * 1200),
      w,
      h: i % 3 === 0 ? w : Math.round(w * 1.6),
      round: i % 3 === 0,
      color: CONFETTI_COLORS[Math.floor(rnd() * CONFETTI_COLORS.length)],
    };
  });
}
