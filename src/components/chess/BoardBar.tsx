import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/components/ui";

/**
 * Панель кнопок у доски: одна «капсула», в ней — значок и короткая подпись под ним.
 *
 * Раньше у доски стояли отдельные кнопки разного вида в два-три ряда («Подсказка», «Отменить», «Перевернуть»,
 * «Закончить партию», «Новая партия»): на телефоне они занимали до 150 px высоты и уезжали за край экрана.
 * Панель — один ряд высотой 64 px под самой доской; кнопки делят ширину, ни одна не у́же 44 px.
 *
 * Подпись короткая (до восьми букв), чтобы пять кнопок помещались на экране 360 px. Если кнопке нужно более
 * точное название для экранного диктора, оно задаётся в `name` и обязательно содержит видимую подпись.
 */
export function BoardBar({
  label,
  children,
  className,
  ...rest
}: {
  /** Название группы для экранного диктора: «Управление партией», «Просмотр ходов». */
  label: string;
  children: ReactNode;
  className?: string;
} & Record<`data-${string}`, string | number | undefined>) {
  return (
    <div
      role="group"
      aria-label={label}
      data-board-bar
      className={cn(
        "flex items-stretch gap-0.5 rounded-[1.75rem] border border-line bg-surface p-1 shadow-card",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function BarButton({
  icon: Glyph,
  label,
  name,
  primary,
  pressed,
  filled,
  className,
  ...rest
}: {
  icon: LucideIcon;
  /** Видимая подпись — одно короткое слово. */
  label: string;
  /** Название для экранного диктора, если подписи мало; содержит подпись. */
  name?: string;
  /** Главное действие панели: «Дальше». */
  primary?: boolean;
  /** Кнопка-переключатель: включена или нет. */
  pressed?: boolean;
  /** Значок залит цветом (треугольник «смотреть», пауза). */
  filled?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label" | "aria-pressed">) {
  return (
    <button
      type="button"
      aria-label={name}
      aria-pressed={pressed}
      className={cn(
        // Подпись — самым мелким размером (14 px), на телефонах у́же 390 px — 12 px, как в нижнем меню: иначе пять
        // кнопок с подписями в ряд не помещаются.
        "flex min-h-14 min-w-11 flex-auto flex-col items-center justify-center gap-0.5 rounded-[1.4rem] px-1 text-xs leading-tight font-extrabold transition max-[389px]:text-[0.75rem]",
        "disabled:text-muted/45",
        primary
          ? "bg-brand text-white hover:bg-[#4338ca] disabled:bg-transparent"
          : pressed
            ? "bg-brand-soft text-brand-dark"
            : "text-ink hover:bg-brand-soft/70 disabled:hover:bg-transparent",
        className,
      )}
      {...rest}
    >
      <Glyph aria-hidden className={cn("h-5 w-5 shrink-0", filled && "fill-current")} strokeWidth={2.25} />
      <span className="max-w-full truncate">{label}</span>
    </button>
  );
}

/**
 * Неинтерактивная ячейка панели: счётчик ходов «12 / 33». На самых узких экранах (до 340 px) её не видно —
 * место отдано кнопкам; экранному диктору счётчик читается всегда.
 */
export function BarInfo({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <span className="flex flex-none flex-col items-center justify-center px-1 text-xs leading-tight font-extrabold text-muted tabular-nums max-[389px]:text-[0.75rem] max-[339px]:px-0 sm:px-2">
      <span aria-hidden={label ? true : undefined} className="max-[339px]:hidden">
        {children}
      </span>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
