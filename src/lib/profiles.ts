/**
 * Несколько детей на одном устройстве. У каждого — свой прогресс в отдельной записи localStorage:
 * у первого («main») ключ прежний, поэтому у тех, кто уже занимается, ничего не меняется.
 * Список профилей и выбранный профиль лежат в одной маленькой записи. Это настройка устройства:
 * при входе в аккаунт прогресс каждого профиля сохраняется отдельно (см. /api/progress?profile=…),
 * а сам список профилей на другом устройстве нужно завести заново.
 */
import { AVATARS, DEFAULT_STATE, STORAGE_KEY, sanitize, type AppState } from "./state";

export { AVATARS };

export const REGISTRY_KEY = "davlatjon-lab:profiles";
export const MAIN_PROFILE = "main";
export const MAX_PROFILES = 6;

export interface ProfileInfo {
  id: string;
}

export interface Registry {
  active: string;
  list: ProfileInfo[];
}

const ID_RE = /^[a-z0-9]{3,12}$/;

export const isProfileId = (id: unknown): id is string =>
  typeof id === "string" && (id === MAIN_PROFILE || ID_RE.test(id));

/** Ключ прогресса профиля в localStorage. */
export function storageKeyFor(id: string): string {
  return id === MAIN_PROFILE ? STORAGE_KEY : `${STORAGE_KEY}:${id}`;
}

const DEFAULT_REGISTRY: Registry = { active: MAIN_PROFILE, list: [{ id: MAIN_PROFILE }] };

/** Разбор записи со списком профилей: что испорчено — выбрасываем, «main» есть всегда. */
export function parseRegistry(raw: unknown): Registry {
  const data = (typeof raw === "string" ? safeJson(raw) : raw) as Partial<Registry> | null;
  const list: ProfileInfo[] = [];
  const seen = new Set<string>();
  if (data && Array.isArray(data.list)) {
    for (const p of data.list) {
      if (!p || !isProfileId(p.id) || seen.has(p.id) || list.length >= MAX_PROFILES) continue;
      seen.add(p.id);
      list.push({ id: p.id });
    }
  }
  if (!seen.has(MAIN_PROFILE)) list.unshift({ id: MAIN_PROFILE });
  const active = data && typeof data.active === "string" && seen.has(data.active) ? data.active : MAIN_PROFILE;
  return { active, list: list.slice(0, MAX_PROFILES) };
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function readRegistry(): Registry {
  try {
    return parseRegistry(window.localStorage.getItem(REGISTRY_KEY));
  } catch {
    return DEFAULT_REGISTRY;
  }
}

const listeners = new Set<() => void>();

/** Подписка на изменения списка профилей (в этой вкладке и в других). */
export function onProfilesChange(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === REGISTRY_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Запись списка профилей в виде строки: годится как «снимок» для useSyncExternalStore. */
export function registrySnapshot(): string {
  try {
    return window.localStorage.getItem(REGISTRY_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeRegistry(reg: Registry) {
  try {
    window.localStorage.setItem(REGISTRY_KEY, JSON.stringify(reg));
  } catch {
    // без хранилища профили не переключить — остаётся единственный
  }
  listeners.forEach((l) => l());
}

export const activeProfileId = (): string => readRegistry().active;

/** Прогресс любого профиля (для списка: имя, возраст) — без подписки на изменения. */
export function readProfileState(id: string): AppState {
  try {
    const raw = window.localStorage.getItem(storageKeyFor(id));
    return raw ? sanitize(JSON.parse(raw)) : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

const randomId = () =>
  `p${Math.floor(Math.random() * 36 ** 5)
    .toString(36)
    .padStart(5, "0")}`;

/**
 * Завести профиль. Язык и вид доски берутся с текущего (это привычки устройства), а имя и возраст —
 * новые; приветственное окно пропускается: родитель уже всё указал.
 */
export function addProfile(args: { name: string; age: number; avatar: string }, from: AppState): string | null {
  const reg = readRegistry();
  if (reg.list.length >= MAX_PROFILES) return null;
  let id = randomId();
  while (reg.list.some((p) => p.id === id)) id = randomId();
  const keep = (({ lang, boardTheme, boardSoundSet, boardSounds, sound, bigText }) => ({
    lang,
    boardTheme,
    boardSoundSet,
    boardSounds,
    sound,
    bigText,
  }))(from.settings);
  const fresh: AppState = {
    ...DEFAULT_STATE,
    welcomed: true,
    settings: {
      ...DEFAULT_STATE.settings,
      ...Object.fromEntries(Object.entries(keep).filter(([, v]) => v !== undefined)),
      childName: args.name,
      age: args.age,
      avatar: args.avatar,
    },
  };
  try {
    window.localStorage.setItem(storageKeyFor(id), JSON.stringify(fresh));
  } catch {
    return null;
  }
  writeRegistry({ active: reg.active, list: [...reg.list, { id }] });
  return id;
}

/** Выбрать профиль и перезагрузить страницу: хранилище читается один раз при загрузке. */
export function switchProfile(id: string) {
  const reg = readRegistry();
  if (!reg.list.some((p) => p.id === id)) return;
  writeRegistry({ ...reg, active: id });
  window.location.reload();
}

/** Сменить аватарку профиля, который сейчас не открыт (у открытого меняют через настройки в сторе). */
export function setOtherAvatar(id: string, avatar: string) {
  if (!(AVATARS as readonly string[]).includes(avatar)) return;
  try {
    const key = storageKeyFor(id);
    const raw = window.localStorage.getItem(key);
    if (!raw) return;
    const data = JSON.parse(raw) as { settings?: Record<string, unknown> };
    window.localStorage.setItem(key, JSON.stringify({ ...data, settings: { ...data.settings, avatar } }));
    listeners.forEach((l) => l());
  } catch {
    // не получилось — аватарка останется прежней
  }
}

/** Удалить профиль вместе с прогрессом. Единственный профиль удалить нельзя. */
export function removeProfile(id: string): boolean {
  const reg = readRegistry();
  if (reg.list.length <= 1 || !reg.list.some((p) => p.id === id)) return false;
  try {
    window.localStorage.removeItem(storageKeyFor(id));
  } catch {
    return false;
  }
  const list = reg.list.filter((p) => p.id !== id);
  const wasActive = reg.active === id;
  writeRegistry({ active: wasActive ? list[0].id : reg.active, list });
  if (wasActive) window.location.reload();
  return true;
}
