"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, cn } from "@/components/ui";
import { DID_YOU_KNOW } from "@/content/chess/secrets";
import { useToday } from "@/lib/useToday";

/** «Знаешь ли ты?» — вопрос дня с ответом по нажатию; «Ещё вопрос» листает дальше. */
export function DidYouKnow({ className }: { className?: string }) {
  const today = useToday();
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const seed = today ? Number(today.replace(/-/g, "")) : 0;
  const item = DID_YOU_KNOW[(seed + offset) % DID_YOU_KNOW.length];
  return (
    <div className={cn("rounded-3xl bg-white p-4 shadow-card", className)}>
      <p className="text-xs font-extrabold tracking-wide text-muted uppercase">🤔 Знаешь ли ты?</p>
      <p className="mt-1 text-lg leading-snug font-black">{item.q}</p>
      {open ? (
        <p className="mt-2 rounded-2xl bg-mint-soft/70 px-3 py-2 font-semibold" aria-live="polite">
          {item.a}
          {item.href && (
            <>
              {" "}
              <Link href={item.href} className="font-extrabold text-brand hover:underline">
                Подробнее →
              </Link>
            </>
          )}
        </p>
      ) : (
        <Button size="sm" variant="soft" className="mt-2" onClick={() => setOpen(true)}>
          Показать ответ
        </Button>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-extrabold">
        <button
          type="button"
          onClick={() => {
            setOffset((o) => o + 1);
            setOpen(false);
          }}
          className="text-brand hover:underline"
        >
          Ещё вопрос ↻
        </button>
        <Link href="/chess/secrets" className="text-muted hover:text-ink hover:underline">
          🔮 Все тайны шахмат
        </Link>
      </div>
    </div>
  );
}
