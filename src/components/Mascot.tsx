import Image from "next/image";
import type { ReactNode } from "react";
import { MascotLive } from "@/components/mascot/MascotLive";
import { cn } from "@/components/ui";
import type { Mood } from "@/lib/anim/mood";

/**
 * Птичка Парвоз — талисман платформы: встречает, радуется вместе с ребёнком и вовремя предлагает отдохнуть.
 * Без `mood` — неподвижная картинка (для печати и серверных страниц); с `mood` — живая птица с настроением.
 */
export function Mascot({
  size = 72,
  float = false,
  mood,
  className,
}: {
  size?: number;
  float?: boolean;
  mood?: Mood;
  className?: string;
}) {
  if (mood) return <MascotLive mood={mood} size={size} className={className} />;
  return (
    <Image
      src="/logo.webp"
      alt=""
      width={size}
      height={Math.round((size * 267) / 256)}
      unoptimized
      aria-hidden
      data-mascot
      className={cn("shrink-0 select-none", float && "animate-float motion-reduce:animate-none", className)}
    />
  );
}

/** Птичка с облачком-репликой. */
export function MascotSays({
  children,
  size = 72,
  mood = "idle",
  className,
}: {
  children: ReactNode;
  size?: number;
  mood?: Mood;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 text-left", className)}>
      <Mascot size={size} mood={mood} />
      <p className="relative rounded-2xl rounded-bl-sm bg-brand-soft px-4 py-2.5 font-extrabold text-brand-dark">
        {children}
      </p>
    </div>
  );
}
