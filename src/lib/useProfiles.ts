"use client";

import { useMemo, useSyncExternalStore } from "react";
import { onProfilesChange, parseRegistry, registrySnapshot, type Registry } from "./profiles";

/** Профили детей на этом устройстве. До загрузки (и на сервере) — null: список читается из localStorage. */
export function useProfiles(): Registry | null {
  const raw = useSyncExternalStore(onProfilesChange, registrySnapshot, () => null);
  return useMemo(() => (raw === null ? null : parseRegistry(raw)), [raw]);
}
