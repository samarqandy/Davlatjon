/**
 * Можно ли показывать анимацию. CSS-правило «уменьшить движение» (globals.css) останавливает только CSS,
 * а Rive, Lottie и конфетти работают через JS — поэтому проверяем настройку сами.
 * Анимации выключены, если об этом просит система (prefers-reduced-motion) или родитель в настройках.
 */
export function motionAllowed(osReduce: boolean, animations: boolean | undefined): boolean {
  return !osReduce && animations !== false;
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
