"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Родитель выключил «Анимации» — html[data-motion="off"]: CSS (globals.css) останавливает свои анимации и переходы
 * так же, как при системном «уменьшить движение». JS-анимации (Rive, конфетти) проверяют настройку сами (useMotionAllowed).
 */
export function MotionSync() {
  const off = useStore((s) => s.settings.animations === false);
  useEffect(() => {
    const h = document.documentElement;
    if (off) h.dataset.motion = "off";
    else delete h.dataset.motion;
  }, [off]);
  return null;
}
