"use client";

import { cn } from "@/components/ui";
import { BOARD_THEMES, SOUND_SETS } from "@/lib/boardLook";
import { useT } from "@/lib/i18n";
import { playSfx, sfxUnlock } from "@/lib/sfx";
import { updateSettings, useStore } from "@/lib/store";

/** Выбор цветов доски и набора звуков ходов — для ребёнка и для родителя (настройка устройства). */
export function BoardLookPicker({ className }: { className?: string }) {
  const t = useT();
  const theme = useStore((s) => s.settings.boardTheme ?? BOARD_THEMES[0].id);
  const set = useStore((s) => s.settings.boardSoundSet ?? SOUND_SETS[0].id);
  const on = useStore((s) => s.settings.boardSounds !== false);

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
                theme === b.id ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-brand/40",
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
                "rounded-xl border-2 px-3 py-2 text-sm font-bold transition",
                on && set === s.id ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-brand/40",
              )}
            >
              🔊 {t(s.ru, s.uz)}
            </button>
          ))}
          <button
            type="button"
            role="radio"
            aria-checked={!on}
            data-sound-set-pick="off"
            onClick={() => updateSettings({ boardSounds: false })}
            className={cn(
              "rounded-xl border-2 px-3 py-2 text-sm font-bold transition",
              !on ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-brand/40",
            )}
          >
            🔇 {t("Без звука", "Ovozsiz")}
          </button>
        </div>
      </div>
    </div>
  );
}
