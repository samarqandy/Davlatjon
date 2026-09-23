import { Fragment } from "react";
import { cn } from "@/components/ui";

function Box({ value, print, wide }: { value: number | string | null; print?: boolean; wide?: boolean }) {
  const empty = value === null;
  return (
    <span
      className={cn(
        "tabular inline-flex h-12 items-center justify-center rounded-xl border-2 text-2xl font-extrabold",
        wide ? "min-w-16 px-2" : "min-w-12 px-1.5",
        empty
          ? print
            ? "border-ink/60 bg-white"
            : "border-dashed border-brand/50 bg-brand-soft/60 text-brand"
          : "border-line bg-white text-ink",
      )}
    >
      {empty ? (print ? "" : "?") : value}
    </span>
  );
}

export function SequenceVisual({ items, print }: { items: (number | string | null)[]; print?: boolean }) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="img"
      aria-label={`Ряд: ${items.map((i) => (i === null ? "пропуск" : i)).join(", ")}`}
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          <Box value={item} print={print} />
          {i < items.length - 1 && <span className="text-xl font-bold text-muted">,</span>}
        </Fragment>
      ))}
    </div>
  );
}

export function ChainVisual({
  start,
  steps,
  end,
  print,
}: {
  start: number | null;
  steps: string[];
  end: number | null;
  print?: boolean;
}) {
  const boxes: (number | null)[] = [start, ...steps.slice(0, -1).map(() => null), end];
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-3">
      {boxes.map((b, i) => (
        <Fragment key={i}>
          <Box
            value={i === 0 || i === boxes.length - 1 ? b : null}
            print={print || (i > 0 && i < boxes.length - 1)}
            wide
          />
          {i < steps.length && (
            <span className="inline-flex items-center gap-0.5 text-lg font-extrabold text-brand">
              <span className="rounded-lg bg-brand-soft px-2 py-0.5 text-base">{steps[i]}</span>
              <span aria-hidden>→</span>
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export function MachineVisual({
  rows,
  print,
}: {
  rows: { input: number | null; output: number | null }[];
  print?: boolean;
}) {
  return (
    <div className="inline-block overflow-hidden rounded-2xl border-2 border-line bg-white">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center bg-brand-soft px-4 py-2 text-center text-sm font-extrabold tracking-wide text-brand-dark uppercase">
        <span>Вход</span>
        <span className="px-3" aria-hidden>
          ⚙️
        </span>
        <span>Выход</span>
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-line px-4 py-2 text-center"
        >
          <span className="tabular text-2xl font-extrabold">{r.input ?? <Blank print={print} />}</span>
          <span className="text-xl text-muted" aria-hidden>
            →
          </span>
          <span className="tabular text-2xl font-extrabold">{r.output ?? <Blank print={print} />}</span>
        </div>
      ))}
    </div>
  );
}

function Blank({ print }: { print?: boolean }) {
  return print ? (
    <span className="inline-block h-8 w-12 rounded-md border-2 border-ink/50 align-middle" />
  ) : (
    <span className="text-brand">?</span>
  );
}

export function ReceiptVisual({ lines, total }: { lines: { label: string; price: string }[]; total: string }) {
  return (
    <div className="w-full max-w-xs rounded-md border border-dashed border-ink/30 bg-[#fffdf7] px-5 py-4 font-mono text-[15px] shadow-sm">
      <div className="mb-2 text-center text-xs font-bold tracking-[0.2em] text-muted">МАГАЗИН «ПРОДУКТЫ»</div>
      <div className="border-t border-dashed border-ink/25 pt-2">
        {lines.map((l) => (
          <div key={l.label} className="flex items-baseline gap-2">
            <span>{l.label}</span>
            <span className="flex-1 border-b border-dotted border-ink/30" />
            <span className="tabular">{l.price}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-baseline gap-2 border-t border-dashed border-ink/25 pt-2 font-bold">
        <span>ИТОГО</span>
        <span className="flex-1" />
        <span className="tabular">{total}</span>
      </div>
    </div>
  );
}

export function TableVisual({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="min-w-[18rem] border-collapse overflow-hidden rounded-xl text-left text-sm">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="border border-line bg-brand-soft px-3 py-2 font-extrabold text-brand-dark">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="tabular h-10 min-w-24 border border-line bg-white px-3 py-2 font-bold">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
