"use client";

import { useEffect, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { ANIM_ASSETS } from "@/lib/anim/assets";
import { CONFETTI_LIFETIME_MS, confettiPieces } from "@/lib/anim/confetti";
import { useMotionAllowed } from "@/lib/useMotion";

const LottieBurst = dynamic(() => import("./LottieBurst"), { ssr: false, loading: () => null });

/** Одни и те же кусочки на каждый запуск: во время рендера случайности нет. */
const PIECES = confettiPieces();

/** Конфетти из CSS: только transform и opacity (идёт на видеокарте), на узком экране — каждый второй кусочек. */
function CssConfetti() {
  return (
    <>
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={`confetti-piece absolute top-0 ${i % 2 ? "max-sm:hidden" : ""}`}
          style={
            {
              left: `${p.x}%`,
              width: p.w,
              height: p.h,
              borderRadius: p.round ? "50%" : 2,
              backgroundColor: p.color,
              "--drift": `${p.drift}vw`,
              "--spin": `${p.spin}deg`,
              animationDelay: `${p.delay}ms`,
              animationDuration: `${p.duration}ms`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

/**
 * Праздничный салют на весь экран: не ловит касания, не даёт полос прокрутки, лежит ниже всплывающих наград (z-40 < z-50).
 * Если анимации выключены (система или настройки родителя) — ничего не рисует.
 */
export function Confetti() {
  const motion = useMotionAllowed();
  const [done, setDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setDone(true), CONFETTI_LIFETIME_MS);
    return () => clearTimeout(timer);
  }, []);
  if (!motion || done) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden data-confetti>
      {ANIM_ASSETS.confetti.available ? <LottieBurst onDone={() => setDone(true)} /> : <CssConfetti />}
    </div>
  );
}
