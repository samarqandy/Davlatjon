"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, cn } from "@/components/ui";
import { ListenButton } from "@/components/ListenButton";
import { useLang, useT } from "@/lib/i18n";
import { VOICE_CLIPS } from "@/lib/voice";
import { useChess } from "@/lib/useChess";
import { useToday } from "@/lib/useToday";

/** «Знаешь ли ты?» — вопрос дня с ответом по нажатию; «Ещё вопрос» листает дальше. */
export function DidYouKnow({ className }: { className?: string }) {
  const t = useT();
  const lang = useLang();
  const { didYouKnow } = useChess();
  const today = useToday();
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const seed = today ? Number(today.replace(/-/g, "")) : 0;
  const index = (seed + offset) % didYouKnow.length;
  const item = didYouKnow[index];
  return (
    <div className={cn("rounded-3xl bg-white p-4 shadow-card", className)}>
      <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
        {t("🤔 Знаешь ли ты?", "🤔 Bilasanmi?")}
      </p>
      <p className="mt-1 text-lg leading-snug font-black">{item.q}</p>
      {/* Закрыт — вопрос, открыт — ответ. */}
      <ListenButton key={`${index}-${open}`} src={VOICE_CLIPS.dyk(index, open ? "a" : "q", lang)} className="mt-1" />
      {open ? (
        <p className="mt-2 rounded-2xl bg-mint-soft/70 px-3 py-2 font-semibold" aria-live="polite">
          {item.a}
          {item.href && (
            <>
              {" "}
              <Link href={item.href} className="font-extrabold text-brand hover:underline">
                {t("Подробнее →", "Batafsil →")}
              </Link>
            </>
          )}
        </p>
      ) : (
        <Button size="sm" variant="soft" className="mt-2" onClick={() => setOpen(true)}>
          {t("Показать ответ", "Javobni koʻrsatish")}
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
          {t("Ещё вопрос ↻", "Boshqa savol ↻")}
        </button>
        <Link href="/chess/secrets" className="text-muted hover:text-ink hover:underline">
          {t("🔮 Все тайны шахмат", "🔮 Barcha shaxmat sirlari")}
        </Link>
      </div>
    </div>
  );
}
