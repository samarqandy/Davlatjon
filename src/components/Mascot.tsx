import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/components/ui";

/** Птичка Парвоз — талисман платформы: встречает, радуется вместе с ребёнком и вовремя предлагает отдохнуть. */
export function Mascot({
  size = 72,
  float = false,
  className,
}: {
  size?: number;
  float?: boolean;
  className?: string;
}) {
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
  className,
}: {
  children: ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 text-left", className)}>
      <Mascot size={size} float />
      <p className="relative rounded-2xl rounded-bl-sm bg-brand-soft px-4 py-2.5 font-extrabold text-brand-dark">
        {children}
      </p>
    </div>
  );
}
