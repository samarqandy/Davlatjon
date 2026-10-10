"use client";

import Link from "next/link";
import { Credit, Portrait } from "@/components/chess/Figure";
import { ProgressBar, cn } from "@/components/ui";
import { heroCards, cardsOpen, xpToNextCard, XP_PER_CARD, type HeroCard } from "@/lib/collection";
import { useTitleTranslation } from "@/lib/docTitle";
import { useT } from "@/lib/i18n";
import { useHydrated, useStore } from "@/lib/store";
import { useChess, useChessImage } from "@/lib/useChess";
import { showsNumbers } from "@/lib/workshop";
import { xpTotal } from "@/lib/xp";

/** Коллекция героев: мудрецы Востока и чемпионы мира. Карточки открываются сами — за занятия. */
export function CollectionView() {
  const t = useT();
  const hydrated = useHydrated();
  const chess = useChess();
  useTitleTranslation("Коллекция героев", "Qahramonlar kolleksiyasi");
  const xp = useStore((s) => xpTotal(s));
  const numbers = useStore((s) => showsNumbers(s.settings.age));
  const cards = heroCards(chess);
  const open = hydrated ? cardsOpen(xp, cards.length) : 0;
  const toNext = hydrated ? xpToNextCard(xp, cards.length) : null;
  const into = hydrated ? XP_PER_CARD - (toNext ?? 0) : 0;

  return (
    <div className="space-y-6">
      <Link href="/chess" className="inline-flex items-center gap-1 text-sm font-extrabold text-brand hover:underline">
        {t("← Шахматная школа", "← Shaxmat maktabi")}
      </Link>
      <header>
        <p className="text-sm font-extrabold tracking-wide text-brand uppercase">{t("Коллекция", "Kolleksiya")}</p>
        <h1 className="text-3xl font-black">🃏 {t("Герои шахмат", "Shaxmat qahramonlari")}</h1>
        <p className="mt-1 max-w-2xl text-muted">
          {t(
            "Решай задачи, занимайся — и карточки открываются сами: сначала мудрецы Востока, потом чемпионы мира.",
            "Masalalar yech, shugʻullan — kartochkalar oʻzi ochiladi: avval Sharq donishmandlari, keyin jahon chempionlari.",
          )}
        </p>
      </header>

      <section className="rounded-3xl bg-white p-4 shadow-card" data-collection-progress aria-live="polite">
        <div className="flex items-center gap-3">
          <ProgressBar value={open} max={cards.length} className="flex-1" />
          <span className="font-black tabular-nums" data-collection-count>
            {open}/{cards.length}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted">
          {toNext === null && hydrated
            ? t("Коллекция собрана — все герои с тобой! 🎉", "Kolleksiya toʻplandi — hamma qahramon sen bilan! 🎉")
            : numbers
              ? t(
                  `До следующей карточки — ${toNext ?? XP_PER_CARD} XP.`,
                  `Keyingi kartochkagacha — ${toNext ?? XP_PER_CARD} XP.`,
                )
              : t("Ещё немного занятий — и откроется следующая!", "Yana bir oz shugʻullansang — keyingisi ochiladi!")}
        </p>
        {numbers && hydrated && toNext !== null && (
          <ProgressBar value={into} max={XP_PER_CARD} className="mt-2 h-1.5" />
        )}
      </section>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.id}>{card.no <= open ? <OpenCard card={card} /> : <LockedCard card={card} />}</li>
        ))}
      </ul>
    </div>
  );
}

function OpenCard({ card }: { card: HeroCard }) {
  const t = useT();
  const image = useChessImage(card.image);
  return (
    <article
      data-hero-card="open"
      data-hero-id={card.id}
      className={cn(
        "h-full rounded-3xl border-2 bg-white p-4 shadow-card",
        card.kind === "sage" ? "border-sun/60" : "border-brand/30",
      )}
    >
      <div className="flex items-center gap-3">
        {image && <Portrait image={image} size={72} />}
        <div className="min-w-0">
          <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
            №{card.no} ·{" "}
            {card.kind === "sage" ? t("Мудрец Востока", "Sharq donishmandi") : t("Чемпион мира", "Jahon chempioni")}
          </p>
          <h2 className="text-xl leading-tight font-black">{card.name}</h2>
          <p className="text-sm font-bold text-muted">{card.where}</p>
        </div>
      </div>
      <p className="mt-3">{card.note}</p>
      {card.advice && (
        <p className="mt-2 rounded-2xl bg-sun-soft/70 px-3 py-2 text-sm font-semibold">
          💡 {t("За доской:", "Taxta oldida:")} {card.advice}
        </p>
      )}
      {image && <Credit image={image} className="mt-2 block" />}
    </article>
  );
}

function LockedCard({ card }: { card: HeroCard }) {
  const t = useT();
  return (
    <article
      data-hero-card="locked"
      className="flex h-full min-h-40 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-line bg-white/60 p-4 text-center text-muted"
    >
      <span className="text-4xl" aria-hidden>
        ❓
      </span>
      <p className="mt-1 font-black">
        №{card.no} · {t("Закрыто", "Yopiq")}
      </p>
      <p className="text-sm">
        {card.kind === "sage" ? t("Мудрец Востока", "Sharq donishmandi") : t("Чемпион мира", "Jahon chempioni")}
      </p>
    </article>
  );
}
