/** Несколько детей на одном устройстве: список профилей, ключи хранилища, создание и удаление. */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AVATARS,
  MAIN_PROFILE,
  MAX_PROFILES,
  REGISTRY_KEY,
  addProfile,
  parseRegistry,
  readProfileState,
  readRegistry,
  removeProfile,
  setOtherAvatar,
  storageKeyFor,
  switchProfile,
} from "@/lib/profiles";
import { progressKey } from "@/lib/server/progressStore";
import { STORAGE_KEY, DEFAULT_STATE, sanitize } from "@/lib/state";

function fakeBrowser() {
  const data = new Map<string, string>();
  const reload = vi.fn();
  const storage = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
  vi.stubGlobal("window", {
    localStorage: storage,
    location: { reload },
    addEventListener() {},
    removeEventListener() {},
  });
  return { data, reload };
}

let browser: ReturnType<typeof fakeBrowser>;
beforeEach(() => {
  browser = fakeBrowser();
});
afterEach(() => vi.unstubAllGlobals());

describe("список профилей", () => {
  it("«main» есть всегда; мусор, повторы и чужие id выбрасываются; выбранный профиль должен существовать", () => {
    expect(parseRegistry(null)).toEqual({ active: MAIN_PROFILE, list: [{ id: MAIN_PROFILE }] });
    const reg = parseRegistry({
      active: "nope",
      list: [{ id: "abc12" }, { id: "abc12" }, { id: "../x" }, { id: "UPPER" }, null, { id: "p9z9z" }],
    });
    expect(reg.list.map((p) => p.id)).toEqual([MAIN_PROFILE, "abc12", "p9z9z"]);
    expect(reg.active).toBe(MAIN_PROFILE);
    expect(parseRegistry({ active: "abc12", list: [{ id: "abc12" }] }).active).toBe("abc12");
    expect(parseRegistry("{плохой json").list).toHaveLength(1);
  });

  it("не больше шести профилей", () => {
    const list = Array.from({ length: 12 }, (_, i) => ({ id: `kid${i}x` }));
    expect(parseRegistry({ list }).list).toHaveLength(MAX_PROFILES);
  });

  it("у первого профиля ключ прежний — прогресс тех, кто уже занимается, не теряется", () => {
    expect(storageKeyFor(MAIN_PROFILE)).toBe(STORAGE_KEY);
    expect(storageKeyFor("abc12")).toBe(`${STORAGE_KEY}:abc12`);
  });
});

describe("создание, переключение и удаление", () => {
  it("новый профиль: имя, возраст и аватарка; язык и вид доски берутся с текущего; приветствие пропущено", () => {
    const from = sanitize({ settings: { lang: "uz", boardTheme: "violet", childName: "Aziz", age: 10 } });
    const id = addProfile({ name: "Malika", age: 7, avatar: AVATARS[3] }, from)!;
    expect(id).toMatch(/^p[a-z0-9]{5}$/);
    const state = readProfileState(id);
    expect(state.welcomed).toBe(true);
    expect(state.settings).toMatchObject({
      childName: "Malika",
      age: 7,
      avatar: AVATARS[3],
      lang: "uz",
      boardTheme: "violet",
    });
    expect(state.tasks).toEqual({});
    expect(readRegistry().list.map((p) => p.id)).toEqual([MAIN_PROFILE, id]);
    // Прогресс Aziz (main) не тронут.
    expect(browser.data.has(STORAGE_KEY)).toBe(false);
  });

  it("переключение запоминается и перезагружает страницу; чужой id игнорируется", () => {
    const id = addProfile({ name: "Bek", age: 8, avatar: AVATARS[1] }, DEFAULT_STATE)!;
    switchProfile("zzzzz");
    expect(browser.reload).not.toHaveBeenCalled();
    switchProfile(id);
    expect(readRegistry().active).toBe(id);
    expect(browser.reload).toHaveBeenCalledTimes(1);
  });

  it("аватарку другого профиля можно сменить, не открывая его", () => {
    const id = addProfile({ name: "Bek", age: 8, avatar: AVATARS[1] }, DEFAULT_STATE)!;
    setOtherAvatar(id, AVATARS[6]);
    expect(readProfileState(id).settings.avatar).toBe(AVATARS[6]);
    setOtherAvatar(id, "💩");
    expect(readProfileState(id).settings.avatar).toBe(AVATARS[6]);
  });

  it("удаление убирает и прогресс; последний профиль удалить нельзя; открытый — выбирает другой", () => {
    expect(removeProfile(MAIN_PROFILE)).toBe(false);
    const id = addProfile({ name: "Bek", age: 8, avatar: AVATARS[1] }, DEFAULT_STATE)!;
    switchProfile(id);
    browser.reload.mockClear();
    expect(removeProfile(id)).toBe(true);
    expect(browser.data.has(storageKeyFor(id))).toBe(false);
    expect(readRegistry()).toEqual({ active: MAIN_PROFILE, list: [{ id: MAIN_PROFILE }] });
    expect(browser.reload).toHaveBeenCalledTimes(1);
    expect(browser.data.get(REGISTRY_KEY)).toBeTruthy();
  });

  it("лимит профилей", () => {
    for (let i = 0; i < MAX_PROFILES - 1; i++)
      expect(addProfile({ name: `K${i}`, age: 8, avatar: AVATARS[0] }, DEFAULT_STATE)).toBeTruthy();
    expect(addProfile({ name: "Лишний", age: 8, avatar: AVATARS[0] }, DEFAULT_STATE)).toBeNull();
  });
});

describe("прогресс профилей в аккаунте", () => {
  it("первый профиль — запись аккаунта, остальные — «аккаунт#профиль»; плохой id отклоняется", () => {
    expect(progressKey("google:1", null)).toBe("google:1");
    expect(progressKey("google:1", "main")).toBe("google:1");
    expect(progressKey("google:1", "abc12")).toBe("google:1#abc12");
    expect(progressKey("google:1", "../../x")).toBeNull();
    expect(progressKey("google:1", "A")).toBeNull();
  });
});
