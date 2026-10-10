"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useT } from "@/lib/i18n";

/**
 * «Показать родителям»: открывает системное окно «Поделиться» (Telegram, WhatsApp, сообщения);
 * там, где его нет, копирует текст. Имя ребёнка в текст не попадает.
 */
export function ShareButton({ text, className }: { text: string; className?: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const message = `${text} ${window.location.origin}`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "Parvoz Edu", text, url: window.location.origin });
        return;
      }
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // окно закрыли или нет доступа к буферу — ничего страшного
    }
  };

  return (
    <Button variant="secondary" size="lg" onClick={() => void share()} className={className} data-share>
      {copied ? t("✓ Скопировано", "✓ Nusxalandi") : t("📤 Показать родителям", "📤 Ota-onaga koʻrsat")}
    </Button>
  );
}
