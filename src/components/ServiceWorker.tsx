"use client";

import { useEffect } from "react";

/** Регистрирует офлайн-режим: открытые хотя бы раз страницы работают без интернета. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
