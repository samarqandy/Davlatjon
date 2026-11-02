"use client";

import { useEffect, type ReactNode } from "react";
import { MascotSays } from "@/components/Mascot";
import { cn } from "@/components/ui";
import { playReward } from "@/lib/sfx";
import { Confetti } from "./Confetti";

/**
 * Большая победа в шахматной школе: тема курса пройдена, тест сдан, робот обыгран.
 * Салют (если анимации разрешены), фанфара и птица-болельщик — как в конце математического дня.
 * Показывать только в тот момент, когда победа случилась, а не при каждом заходе на страницу.
 */
export function Celebration({
  title,
  children,
  actions,
  sound = "level",
  className,
}: {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  sound?: "level" | "win";
  className?: string;
}) {
  useEffect(() => playReward(sound), [sound]);
  return (
    <section
      className={cn(
        "animate-pop rounded-3xl border-2 border-mint/60 bg-mint-soft p-5 text-center shadow-card",
        className,
      )}
      role="status"
      data-celebration
    >
      <Confetti />
      <MascotSays className="mx-auto w-fit" size={80} mood="celebration">
        {title}
      </MascotSays>
      {children && <div className="mt-3 text-lg text-[#065f46]">{children}</div>}
      {actions && <div className="mt-4 flex flex-wrap justify-center gap-2">{actions}</div>}
    </section>
  );
}
