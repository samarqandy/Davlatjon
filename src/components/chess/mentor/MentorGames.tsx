"use client";

import { X } from "lucide-react";
import { GamesBrowser } from "@/components/chess/games/GamesBrowser";
import { Button, Icon } from "@/components/ui";
import type { LoadedGame } from "@/lib/games/library";
import { useT } from "@/lib/i18n";

/**
 * База партий доски тренера (MENTOR-3): общий поиск по базе (GamesBrowser, на «вы») с заголовком и «Закрыть».
 * Нажатие на партию открывает её на доске урока с начала (onOpen). В режиме класса — две колонки во весь экран.
 */
export function MentorGames({
  present,
  onOpen,
  onClose,
}: {
  present: boolean;
  /** Открыть партию на доске; false — не получилось (в уроке уже предельное число досок). */
  onOpen: (game: LoadedGame) => boolean;
  onClose: () => void;
}) {
  const t = useT();
  return (
    <GamesBrowser
      audience="teacher"
      panel={present}
      titleId="mentor-games-title"
      onPick={onOpen}
      refusal={t(
        "В уроке уже 40 досок — удалите лишнюю доску, чтобы открыть партию.",
        "Darsda 40 ta taxta bor — partiyani ochish uchun ortiqcha taxtani oʻchiring.",
      )}
      head={
        <div className="games-head flex items-center justify-between gap-2">
          <h2 id="mentor-games-title" className="text-lg font-black">
            {t("База партий", "Partiyalar bazasi")}
          </h2>
          <Button size="sm" variant="ghost" onClick={onClose} data-games-close>
            <Icon icon={X} /> {t("Закрыть", "Yopish")}
          </Button>
        </div>
      }
    />
  );
}
