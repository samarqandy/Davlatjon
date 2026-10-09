"use client";

import { Button, cn } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { FeedbackState } from "./Feedback";

/**
 * Кнопка «Проверить». Пока ответ не готов, она не «молчит» (серая и неактивная без объяснения),
 * а мягко подсказывает, чего не хватает.
 */
export function CheckButton({
  ready,
  onCheck,
  onNotReady,
  missing,
}: {
  ready: boolean;
  onCheck: () => void;
  onNotReady: (s: FeedbackState) => void;
  /** Что подсказать, если ответа ещё нет: русский и узбекский текст. */
  missing?: [string, string];
}) {
  const t = useT();
  return (
    <Button
      size="lg"
      aria-disabled={!ready}
      className={cn(!ready && "opacity-60")}
      onClick={() =>
        ready
          ? onCheck()
          : onNotReady({
              tone: "info",
              text: missing ? t(missing[0], missing[1]) : t("✏️ Сначала впиши ответ", "✏️ Avval javobni yoz"),
            })
      }
    >
      {t("Проверить", "Tekshirish")}
    </Button>
  );
}
