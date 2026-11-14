"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

type WebkitDocument = Document & {
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type WebkitElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

const fsElement = () => {
  const d = document as WebkitDocument;
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
};

/**
 * Полный экран для одного элемента (доска тренера на интерактивной панели или проекторе).
 * Браузер разрешает его только по нажатию, поэтому enter() вызывают прямо в обработчике нажатия.
 * На iPhone и в Chrome на iPad полного экрана нет — supported = false, страница справляется без него.
 */
export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const d = document as WebkitDocument;
    // Поддержку узнаём только в браузере: на сервере её нет, и разметка до оживления одна и та же.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- одно чтение возможностей браузера после оживления
    setSupported(!!(d.fullscreenEnabled || d.webkitFullscreenEnabled));
    const sync = () => setActive(!!fsElement() && fsElement() === ref.current);
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, [ref]);

  const enter = useCallback(() => {
    const el = ref.current as WebkitElement | null;
    if (!el || fsElement()) return;
    try {
      const p = el.requestFullscreen ? el.requestFullscreen({ navigationUI: "hide" }) : el.webkitRequestFullscreen?.();
      if (p && typeof p.catch === "function") p.catch(() => undefined);
    } catch {
      // Браузер отказал (не по нажатию, запрещено настройками) — остаёмся в окне.
    }
  }, [ref]);

  const exit = useCallback(() => {
    if (!fsElement()) return;
    const d = document as WebkitDocument;
    try {
      const p = d.exitFullscreen ? d.exitFullscreen() : d.webkitExitFullscreen?.();
      if (p && typeof p.catch === "function") p.catch(() => undefined);
    } catch {
      // уже не в полном экране
    }
  }, []);

  return { supported, active, enter, exit };
}
