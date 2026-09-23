import { Fragment } from "react";

/**
 * Мини-разметка: **жирный** и `математика`.
 * Работает и в серверных, и в клиентских компонентах.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("`") && part.endsWith("`"))
          return (
            <span key={i} className="math">
              {part.slice(1, -1)}
            </span>
          );
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** Текст без разметки — для подписей, заголовков и aria-label. */
export function plainText(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");
}
