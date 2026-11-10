import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { levelsFor, sectionsFor } from "@/content/meta";
import type { Level, SectionId } from "@/content/types";
import type { Lang } from "@/lib/lang";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "soft" | "ghost" | "success" | "sun";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-[0_4px_0_0_#3730a3] hover:bg-[#4338ca] active:translate-y-[2px] active:shadow-[0_2px_0_0_#3730a3]",
  secondary: "bg-surface text-ink border-2 border-line hover:border-brand/40 hover:bg-brand-soft/40",
  soft: "bg-brand-soft text-brand-dark hover:bg-[#e0e3ff] dark:hover:bg-[#363c80]",
  ghost: "text-muted hover:bg-black/5 hover:text-ink",
  success:
    "bg-mint text-white shadow-[0_4px_0_0_#047857] hover:bg-[#0ea371] active:translate-y-[2px] active:shadow-[0_2px_0_0_#047857]",
  sun: "bg-sun text-on-sun shadow-[0_4px_0_0_#b45309] hover:bg-[#f7a81d] active:translate-y-[2px] active:shadow-[0_2px_0_0_#b45309]",
};

const SIZES: Record<Size, string> = {
  sm: "min-h-9 px-3 py-1 text-sm gap-1.5 rounded-xl",
  md: "min-h-11 px-4 py-1.5 text-base gap-2 rounded-2xl",
  lg: "min-h-14 px-6 py-2 text-lg gap-2.5 rounded-2xl",
};

const BASE =
  "inline-flex items-center justify-center font-bold select-none transition-[background,transform,box-shadow,border-color] duration-150 disabled:opacity-45 disabled:pointer-events-none text-center leading-tight";

/**
 * Значок интерфейса (DESIGN.md, раздел 5): lucide, одна толщина линии, размер — от размера текста рядом.
 * Ставится перед подписью кнопки или ссылки вместо эмодзи; для экранного диктора скрыт.
 */
export function Icon({ icon: Glyph, className }: { icon: LucideIcon; className?: string }) {
  return (
    <Glyph
      aria-hidden
      strokeWidth={2.25}
      className={cn("inline-block h-[1.15em] w-[1.15em] shrink-0 align-[-0.18em]", className)}
    />
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type="button" className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props} />;
}

export function Card({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("rounded-3xl border border-line bg-surface shadow-card", className)} {...props}>
      {children}
    </div>
  );
}

/** Модуль общий для серверных и клиентских страниц, поэтому язык передаётся явно (по умолчанию — русский). */
export function LevelBadge({ level, compact = false, lang = "ru" }: { level: Level; compact?: boolean; lang?: Lang }) {
  const meta = levelsFor(lang)[level];
  return (
    <span
      // Цвет уровня — через переменную: в тёмной теме тот же оттенок светлее, иначе на тёмном фоне он не читается.
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm font-bold text-(--badge) dark:text-[color-mix(in_oklab,var(--badge)_50%,white)]"
      style={
        {
          "--badge": meta.color,
          borderColor: `${meta.color}55`,
          background: `${meta.color}12`,
        } as React.CSSProperties
      }
      title={`${lang === "uz" ? "Daraja" : "Уровень"}: ${meta.name} — ${meta.about}`}
    >
      <span aria-hidden>{meta.emoji}</span>
      {compact ? (
        // Не только цвет: номер уровня виден всем, название — диктору (подсказка title на телефоне не появляется).
        <>
          <span aria-hidden className="tabular-nums">
            {level}
          </span>
          <span className="sr-only">{`${lang === "uz" ? "Daraja" : "Уровень"}: ${meta.name}`}</span>
        </>
      ) : (
        meta.name
      )}
    </span>
  );
}

export function SectionTag({
  section,
  className,
  lang = "ru",
}: {
  section: SectionId;
  className?: string;
  lang?: Lang;
}) {
  const meta = sectionsFor(lang)[section];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-extrabold", className)}
      // Текст темнее цвета раздела: на светлой подложке сам цвет даёт контраст около 3:1, этого мало.
      style={{ color: `color-mix(in oklab, ${meta.color} 70%, black)`, background: meta.tint }}
    >
      <span aria-hidden>{meta.emoji}</span>
      {meta.name}
    </span>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-0.5 text-sm font-semibold text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  max,
  className,
  label,
}: {
  value: number;
  max: number;
  className?: string;
  label?: string;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-black/[0.07]", className)}
      role="progressbar"
      aria-label={label ?? `${value} / ${max}`}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div
        className="h-full rounded-full bg-linear-to-r from-brand to-[#7c3aed] transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
