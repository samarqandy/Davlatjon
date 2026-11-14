"use client";

import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/components/ui";
import type { ShapeColor, SignKind } from "@/lib/mentor/model";
import { SHAPE_STYLE, SIGN_ICON } from "./MentorOverlay";

/**
 * Кнопка доски тренера: значок и короткая подпись под ним (как BarButton у других досок). На странице — в панели
 * у доски, в режиме класса — в колонке сбоку от доски; там её размер задаёт globals.css (`[data-present]`):
 * не меньше 56 px и растёт с экраном панели.
 */
export function MentorButton({
  icon: Glyph,
  glyph,
  label,
  name,
  primary,
  pressed,
  hot,
  wide,
  className,
  ...rest
}: {
  icon?: LucideIcon;
  /** Свой рисунок вместо значка (фигура, образец линии). */
  glyph?: ReactNode;
  /** Видимая подпись — одно короткое слово (до восьми букв). */
  label?: string;
  /** Название для экранного диктора; содержит видимую подпись. */
  name?: string;
  primary?: boolean;
  pressed?: boolean;
  /** Частая кнопка: в режиме класса стоит в нижней половине колонки, куда легко дотянуться. */
  hot?: boolean;
  /** Кнопка на две клетки колонки («Дальше»). */
  wide?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label" | "aria-pressed">) {
  return (
    <button
      type="button"
      aria-label={name}
      aria-pressed={pressed}
      data-mentor-control={hot ? "hot" : ""}
      className={cn(
        "flex min-h-14 min-w-11 flex-auto flex-col items-center justify-center gap-0.5 rounded-[1.4rem] px-1 text-xs leading-tight font-extrabold transition max-[389px]:text-[0.75rem]",
        "disabled:text-muted/45",
        wide && "col-span-2",
        primary
          ? "bg-brand text-white hover:bg-[#4338ca] disabled:bg-transparent"
          : pressed
            ? "bg-brand-soft text-brand-dark ring-2 ring-brand"
            : "text-ink hover:bg-brand-soft/70 disabled:hover:bg-transparent",
        className,
      )}
      {...rest}
    >
      {Glyph ? (
        <Glyph aria-hidden className="mentor-icon h-5 w-5 shrink-0" strokeWidth={2.25} />
      ) : (
        <span aria-hidden className="mentor-icon grid h-5 w-5 shrink-0 place-items-center">
          {glyph}
        </span>
      )}
      {label && <span className="max-w-full truncate">{label}</span>}
    </button>
  );
}

/** Образец линии цвета: сплошная, пунктир или точки — тем же рисунком, что и стрелка на доске. */
export function ColorGlyph({ c }: { c: ShapeColor }) {
  const st = SHAPE_STYLE[c];
  return (
    <svg viewBox="0 0 1 1" className="h-full w-full" aria-hidden>
      <path d="M0.1 0.85 L0.9 0.15" stroke="#fff" strokeWidth={0.3} strokeLinecap="round" />
      <path
        d="M0.1 0.85 L0.9 0.15"
        stroke={st.stroke}
        strokeWidth={0.2}
        strokeLinecap="round"
        strokeDasharray={st.dash ? (c === "Y" ? "0.01 0.2" : "0.2 0.14") : undefined}
      />
    </svg>
  );
}

export function SignGlyph({ kind }: { kind: SignKind }) {
  const { icon: Glyph, color } = SIGN_ICON[kind];
  return (
    <span className="grid h-full w-full place-items-center rounded-full bg-white shadow-[0_0_0_2px_#1d2140]">
      <Glyph className="h-[80%] w-[80%]" style={{ color }} strokeWidth={3} />
    </span>
  );
}

/** Ряд кнопок: на странице — панель-«капсула», в режиме класса — ряд из трёх клеток колонки. */
export function MentorRow({
  label,
  present,
  children,
  className,
  ...rest
}: {
  /** Название группы для экранного диктора. */
  label: string;
  present: boolean;
  children: ReactNode;
  className?: string;
} & Record<`data-${string}`, string | number | undefined>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        present
          ? "mentor-row"
          : "flex flex-wrap items-stretch gap-0.5 rounded-[1.75rem] border border-line bg-surface p-1 shadow-card",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
