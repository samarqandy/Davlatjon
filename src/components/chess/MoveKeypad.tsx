"use client";

import { CornerDownLeft, Delete } from "lucide-react";
import { Button, cn } from "@/components/ui";
import { useLang, useT } from "@/lib/i18n";

/**
 * Запись хода кнопками — для игры вслепую: фигура, вертикаль, горизонталь, «Сходить».
 * Кнопки крупные (не меньше 44 px): ребёнок попадает пальцем, а промах — это сделанный не тот ход.
 *
 * Своя клавиатура, а не системная: на телефоне системная закрывает пол-экрана, а на русской раскладке нет латинских
 * букв вертикалей — «Кf3» пришлось бы набирать, дважды переключая язык. Поле при этом остаётся обычным полем ввода:
 * с настоящей клавиатуры ход можно просто напечатать и нажать Enter.
 */
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const PIECES_RU: [string, string][] = [
  ["Кр", "король"],
  ["Ф", "ферзь"],
  ["Л", "ладья"],
  ["С", "слон"],
  ["К", "конь"],
];
const PIECES_UZ: [string, string][] = [
  ["♔", "shoh"],
  ["♕", "farzin"],
  ["♖", "rux"],
  ["♗", "fil"],
  ["♘", "ot"],
];

export function MoveKeypad({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  const t = useT();
  const lang = useLang();
  const key = "grid h-11 place-items-center rounded-xl border-2 border-line bg-surface text-lg font-black transition";
  const live = "hover:border-brand/50 active:bg-brand-soft";
  const add = (s: string) => onChange(value + s);
  /** Кнопка клавиатуры: дописывает к ходу букву фигуры, вертикаль, горизонталь или рокировку. */
  const keyButton = (label: string, name?: string) => (
    <button
      key={label}
      type="button"
      // Название для диктора начинается с того, что написано на кнопке: «Кр, король», «0-0, короткая рокировка».
      aria-label={name ? `${label}, ${name}` : undefined}
      disabled={disabled}
      onClick={() => add(label)}
      // «0-0-0» длиннее остальных подписей: мельче и в одну строку.
      className={cn(key, !disabled && live, disabled && "opacity-50", label.length > 2 && "text-sm whitespace-nowrap")}
      data-key={label}
    >
      {label}
    </button>
  );
  // Три ряда по восемь кнопок; на телефоне каждый ряд — в две строки по четыре: кнопка не уже 44 px, под палец.
  const row = "grid grid-cols-4 gap-1.5 sm:grid-cols-8";

  return (
    <form
      className="mx-auto max-w-md space-y-1.5"
      data-move-keypad
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled) onSubmit();
      }}
    >
      <div className="flex gap-1.5">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          // Системная клавиатура на телефоне не нужна — кнопки ниже; настоящая клавиатура работает как обычно.
          inputMode="none"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label={t("Твой ход", "Sening yurishing")}
          placeholder={t("Твой ход: Кf3", "Yurishing: ♘f3")}
          className="h-12 min-w-0 flex-1 rounded-xl border-2 border-line bg-surface px-3 text-xl font-black outline-none focus:border-brand"
          data-move-input
        />
        <Button type="submit" disabled={disabled || !value.trim()} className="shrink-0" data-move-submit>
          <CornerDownLeft className="h-5 w-5" aria-hidden /> {t("Сходить", "Yurish")}
        </Button>
      </div>
      <div className={row} role="group" aria-label={t("Фигура или рокировка", "Dona yoki rokirovka")}>
        {(lang === "uz" ? PIECES_UZ : PIECES_RU).map(([label, name]) => keyButton(label, name))}
        {keyButton("0-0", t("короткая рокировка", "qisqa rokirovka"))}
        {keyButton("0-0-0", t("длинная рокировка", "uzun rokirovka"))}
        <button
          type="button"
          aria-label={t("Стереть", "Oʻchirish")}
          disabled={disabled || !value}
          onClick={() => onChange([...value].slice(0, -1).join(""))}
          className={cn(key, !disabled && value && live, (disabled || !value) && "opacity-50")}
          data-key="back"
        >
          <Delete className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <div className={row} role="group" aria-label={t("Вертикаль", "Vertikal")}>
        {FILES.map((f) => keyButton(f))}
      </div>
      <div className={row} role="group" aria-label={t("Горизонталь", "Gorizontal")}>
        {RANKS.map((r) => keyButton(r))}
      </div>
    </form>
  );
}
