"use client";

import { Volume2, VolumeX } from "lucide-react";
import { cn, Icon } from "@/components/ui";
import { BOARD_THEMES, PIECE_SETS, SOUND_SETS, boardThemeOf, pieceSetOf } from "@/lib/boardLook";
import { useT } from "@/lib/i18n";
import { playSfx, sfxUnlock } from "@/lib/sfx";
import { updateSettings, useStore } from "@/lib/store";
import { piecesOf } from "./PieceIcon";

/** Выбор цветов доски и набора звуков ходов — для ребёнка и для родителя (настройка устройства). */
export function BoardLookPicker({ className }: { className?: string }) {
  const t = useT();
  const theme = useStore((s) => s.settings.boardTheme ?? BOARD_THEMES[0].id);
  const set = useStore((s) => s.settings.boardSoundSet ?? SOUND_SETS[0].id);
  const on = useStore((s) => s.settings.boardSounds !== false);
  const pieceSet = pieceSetOf(useStore((s) => s.settings.pieceSet)).id;
  const colors = boardThemeOf(theme);
  const credits = PIECE_SETS.filter((p) => p.author);

  return (
    <div className={cn("space-y-4", className)} data-board-look>
      <div>
        <p className="mb-2 text-sm font-black">{t("Цвета доски", "Taxta ranglari")}</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("Цвета доски", "Taxta ranglari")}>
          {BOARD_THEMES.map((b) => (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={theme === b.id}
              data-board-theme-pick={b.id}
              onClick={() => updateSettings({ boardTheme: b.id })}
              className={cn(
                "flex w-[68px] flex-col items-center gap-1 rounded-xl border-2 p-1.5 text-[11px] font-bold transition",
                theme === b.id ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-brand/40",
              )}
            >
              <span
                className="grid h-10 w-10 grid-cols-2 overflow-hidden rounded-md ring-2"
                style={{ ["--tw-ring-color" as string]: b.frame }}
                aria-hidden
              >
                <i style={{ background: b.light }} />
                <i style={{ background: b.dark }} />
                <i style={{ background: b.dark }} />
                <i style={{ background: b.light }} />
              </span>
              {t(b.ru, b.uz)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-black">{t("Фигуры", "Donalar")}</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("Фигуры", "Donalar")}>
          {PIECE_SETS.map((p) => {
            const set = piecesOf(p.id);
            const White = set.wN;
            const Black = set.bQ;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={pieceSet === p.id}
                data-piece-set-pick={p.id}
                onClick={() => updateSettings({ pieceSet: p.id === "classic" ? undefined : p.id })}
                className={cn(
                  "flex w-[104px] flex-col items-center gap-1 rounded-xl border-2 p-1.5 text-xs font-bold transition",
                  pieceSet === p.id ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-brand/40",
                )}
              >
                {/* Конь и ферзь на клетках выбранной доски: по ним набор узнаётся сразу. */}
                <span className="grid h-11 w-[88px] grid-cols-2 overflow-hidden rounded-md" aria-hidden>
                  <i className="block" style={{ background: colors.light }}>
                    <Black />
                  </i>
                  <i className="block" style={{ background: colors.dark }}>
                    <White />
                  </i>
                </span>
                {t(p.ru, p.uz)}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-xs text-muted" data-piece-credits>
          {t("Авторы фигур: ", "Donalar mualliflari: ")}
          {credits.map((p) => `${t(p.ru, p.uz)} — ${p.author} (${p.license})`).join("; ")}.
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-black">{t("Звук ходов", "Yurish ovozi")}</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("Звук ходов", "Yurish ovozi")}>
          {SOUND_SETS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on && set === s.id}
              data-sound-set-pick={s.id}
              onClick={() => {
                updateSettings({ boardSounds: true, boardSoundSet: s.id });
                sfxUnlock();
                // Пробный звук после смены набора — сначала сохраняем выбор, затем играем.
                setTimeout(() => playSfx("capture"), 30);
              }}
              className={cn(
                "min-h-11 rounded-xl border-2 px-3 py-2 text-sm font-bold transition",
                on && set === s.id ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-brand/40",
              )}
            >
              <Icon icon={Volume2} /> {t(s.ru, s.uz)}
            </button>
          ))}
          <button
            type="button"
            role="radio"
            aria-checked={!on}
            data-sound-set-pick="off"
            onClick={() => updateSettings({ boardSounds: false })}
            className={cn(
              "min-h-11 rounded-xl border-2 px-3 py-2 text-sm font-bold transition",
              !on ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-brand/40",
            )}
          >
            <Icon icon={VolumeX} /> {t("Без звука", "Ovozsiz")}
          </button>
        </div>
      </div>
    </div>
  );
}
