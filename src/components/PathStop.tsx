import { Check } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/components/ui";

/** Размеры пути: высота шага, сторона плитки и сдвиг плитки вбок на каждом шаге. */
const ROW = 92;
const TILE = 64;
const SHIFT = 34;
/** Плитки идут змейкой: вправо, ещё вправо, назад, назад. */
const ZIGZAG = [0, 1, 2, 1];
const tileX = (n: number) => ZIGZAG[(n - 1) % ZIGZAG.length] * SHIFT;

/**
 * Остановка на пути (DESIGN.md): урок шахматного курса или день занятий. Плитки идут змейкой, шаг «на очереди»
 * жёлтый, пройденный — с зелёной отметкой; пройденный отрезок пути сплошной, остальной — точками.
 * Нажимается вся строка: плитка и подпись.
 */
export function PathStop({
  n,
  last,
  done,
  current,
  tile,
  tileClassName,
  kicker,
  title,
  note,
  href,
  onClick,
  attrs,
}: {
  /** Номер шага с единицы: от него зависит сдвиг плитки. */
  n: number;
  /** Последний шаг отрезка: линии к следующему нет. */
  last: boolean;
  done: boolean;
  current: boolean;
  /** Что на плитке: фигура или эмодзи. */
  tile: ReactNode;
  /** Вид обычной плитки (не «на очереди»): фон и нижняя грань. */
  tileClassName: string;
  kicker: string;
  title: string;
  note?: ReactNode;
  href?: string;
  onClick?: () => void;
  /** data-атрибуты кнопки или ссылки (якоря для тестов). */
  attrs?: Record<`data-${string}`, string>;
}) {
  const x = tileX(n);
  const from = x + TILE / 2;
  const to = tileX(n + 1) + TILE / 2;
  const className = "group relative flex h-full w-full items-center gap-3 rounded-2xl text-left";
  const body = (
    <>
      <span
        className={cn(
          "relative grid shrink-0 place-items-center rounded-2xl text-3xl transition group-hover:-translate-y-0.5",
          current ? "bg-sun shadow-[0_4px_0_0_#b45309] ring-4 ring-sun/30" : tileClassName,
        )}
        style={{ width: TILE, height: TILE }}
        aria-hidden
      >
        {tile}
        {done && (
          <span className="absolute -top-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-[#047857] text-white ring-2 ring-paper">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-extrabold tracking-wide text-muted uppercase">{kicker}</span>
        <span className="line-clamp-2 text-lg leading-tight font-black text-pretty">{title}</span>
        {note && <span className="block truncate text-sm font-extrabold text-muted">{note}</span>}
      </span>
    </>
  );
  return (
    <li className="relative" style={{ height: ROW }}>
      {!last && (
        <svg
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-0"
          width={ZIGZAG.length * SHIFT + TILE}
          height={ROW}
        >
          <path
            d={`M ${from} 0 C ${from} ${ROW / 2}, ${to} ${ROW / 2}, ${to} ${ROW}`}
            fill="none"
            strokeWidth={6}
            strokeLinecap="round"
            className={done ? "stroke-success" : "stroke-[#cfc4ae] dark:stroke-[#4a4f85]"}
            strokeDasharray={done ? undefined : "1 13"}
          />
        </svg>
      )}
      {href ? (
        <Link
          href={href}
          aria-current={current ? "step" : undefined}
          className={className}
          style={{ paddingLeft: x }}
          {...attrs}
        >
          {body}
        </Link>
      ) : (
        <button
          type="button"
          aria-current={current ? "step" : undefined}
          onClick={onClick}
          className={className}
          style={{ paddingLeft: x }}
          {...attrs}
        >
          {body}
        </button>
      )}
    </li>
  );
}
