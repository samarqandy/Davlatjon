"use client";

import { useId } from "react";
import { CHILD_NAME_MAX, cleanChildName, fillName, latinize } from "@/lib/childName";
import { useLang, useT } from "@/lib/i18n";

/** Поле «Как тебя зовут?» с живым приветствием: «Привет, Анна! 👋». */
export function ChildNameField({
  value,
  onChange,
  label,
  hint,
  onEnter,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  onEnter?: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const id = useId();
  const clean = cleanChildName(value);
  const shown = clean && lang === "uz" && /[\u0400-\u04FF]/.test(clean) ? latinize(clean) : clean;
  return (
    <div>
      <label htmlFor={id} className="text-lg font-black">
        {label ?? t("Как тебя зовут?", "Isming nima?")}
      </label>
      {hint && <p className="text-sm text-muted">{hint}</p>}
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        maxLength={CHILD_NAME_MAX + 8}
        autoComplete="off"
        autoCapitalize="words"
        spellCheck={false}
        enterKeyHint="done"
        placeholder={t("Имя", "Ism")}
        className="mt-2 w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-xl font-bold outline-none focus:border-brand"
      />
      <p className="mt-1 min-h-6 text-sm font-bold text-brand-dark" aria-live="polite">
        {/* Не через t(): он сам подставил бы уже сохранённое имя. */}
        {shown ? fillName(lang === "uz" ? "Salom, {name}! 👋" : "Привет, {name}! 👋", shown) : ""}
      </p>
    </div>
  );
}
