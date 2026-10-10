"use client";

import { Button } from "@/components/ui";
import { useT } from "@/lib/i18n";

/**
 * Спокойная остановка посреди длинного дня — для малышей, после третьей и шестой задачи.
 * Две равные кнопки: «Передохнуть» и «Ещё». Ни звёзд, ни счёта, ни звуков, ни таймера: всё сохранено,
 * и вернуться можно с того же места.
 */
export function RestStop({ onRest, onMore }: { onRest: () => void; onMore: () => void }) {
  const t = useT();
  return (
    <section
      className="mx-auto max-w-md space-y-5 rounded-3xl border border-line bg-white p-6 text-center shadow-card"
      aria-labelledby="rest-stop-title"
      data-rest-stop
    >
      <div className="text-6xl" aria-hidden>
        🌿
      </div>
      <h2 id="rest-stop-title" className="text-3xl font-black">
        {t("Передохнём?", "Dam olamizmi?")}
      </h2>
      <p className="child-text text-lg">
        {t(
          "Всё сохранилось. Можно отдохнуть, а можно продолжить — как хочется.",
          "Hammasi saqlandi. Dam olsa ham boʻladi, davom ettirsa ham — qanday xohlasang.",
        )}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Button size="lg" variant="secondary" onClick={onRest}>
          {t("Передохнуть", "Dam olish")}
        </Button>
        <Button size="lg" variant="secondary" onClick={onMore}>
          {t("Ещё", "Yana")}
        </Button>
      </div>
    </section>
  );
}
