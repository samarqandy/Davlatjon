"use client";

import { useEffect } from "react";
import { ageMode } from "@/lib/ageMode";
import { useStore } from "@/lib/store";

/** Возраст сменили в настройках — html[data-age] обновляется сразу (до отрисовки его ставит скрипт в <head>). */
export function AgeSync() {
  const mode = useStore((s) => ageMode(s.settings.age));
  useEffect(() => {
    document.documentElement.dataset.age = mode;
  }, [mode]);
  return null;
}
