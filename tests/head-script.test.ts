/**
 * Скрипт в <head> (src/lib/headScript.ts) прячет страницу до загрузки: когда она пришла не на языке
 * устройства (кука ещё не записана) и для страниц, где в текстах стоит имя ребёнка. Ошибка в нём не видна (он в try/catch) — проверяем здесь.
 */
import { describe, expect, it } from "vitest";
import { HEAD_SCRIPT as code } from "@/lib/headScript";

function run(
  settings: Record<string, unknown>,
  pathname: string,
  served: "ru" | "uz" = "ru",
  state: Record<string, unknown> = {},
  hash = "",
) {
  const classes = new Set<string>();
  let wait = 0;
  const attrs: Record<string, string> = {};
  const html = {
    lang: served,
    classList: { add: (c: string) => classes.add(c), remove: (c: string) => classes.delete(c) },
    setAttribute: (k: string, v: string) => void (attrs[k] = v),
  };
  const storage = { getItem: () => JSON.stringify({ settings, ...state }) };
  new Function("localStorage", "location", "document", "setTimeout", code)(
    storage,
    { pathname, hash },
    { documentElement: html },
    (_: unknown, ms: number) => void (wait = ms),
  );
  return {
    hidden: classes.has("i18n-wait"),
    wait,
    lang: html.lang,
    motion: attrs["data-motion"],
    age: attrs["data-age"],
    theme: attrs["data-theme"],
    first: "data-first" in attrs,
  };
}

describe("скрипт в <head>", () => {
  it("это корректный JavaScript", () => {
    expect(() => new Function(code)).not.toThrow();
  });

  it("страница не на языке устройства ждёт загрузки на любом адресе", () => {
    expect(run({ lang: "uz" }, "/")).toMatchObject({ hidden: true, lang: "uz" });
    expect(run({ lang: "uz" }, "/chess")).toMatchObject({ hidden: true, lang: "uz" });
    expect(run({}, "/chess", "uz")).toMatchObject({ hidden: true, lang: "ru" });
  });

  it("страница уже на языке устройства показывается сразу", () => {
    expect(run({ lang: "uz" }, "/", "uz")).toMatchObject({ hidden: false, lang: "uz" });
    expect(run({ lang: "uz" }, "/chess/play", "uz")).toMatchObject({ hidden: false, lang: "uz" });
    expect(run({ lang: "ru" }, "/")).toMatchObject({ hidden: false, lang: "ru" });
  });

  it("имя ребёнка: ждём только там, где оно стоит в текстах", () => {
    expect(run({ childName: "Анна" }, "/week/1/day/1").hidden).toBe(true);
    expect(run({ childName: "Анна" }, "/parent/guide").hidden).toBe(true);
    expect(run({ childName: "Анна" }, "/my-problems").hidden).toBe(true);
    expect(run({ childName: "Анна" }, "/").hidden).toBe(false);
    expect(run({ childName: "Анна" }, "/chess/play").hidden).toBe(false);
    expect(run({}, "/week/1/day/1").hidden).toBe(false);
  });

  it("страница, открытая сразу на «экране» (адрес с якорем), ждёт загрузки — в шахматах и в занятиях", () => {
    const at = (pathname: string, hash: string) => run({}, pathname, "ru", {}, hash);
    // Запасной выход — восемь секунд: на очень медленном телефоне страница оживает за 5–7 с.
    expect(at("/chess/openings", "#open-italian")).toMatchObject({ hidden: true, wait: 8000 });
    expect(at("/chess/puzzles", "#practice").hidden).toBe(true);
    expect(at("/chess/analysis", "#fen=8%2F8").hidden).toBe(true);
    expect(at("/week/2/day/4", "#task-8").hidden).toBe(true);
    // Без якоря и с пустым якорем — страница раздела и есть то, что нужно.
    expect(at("/chess/openings", "").hidden).toBe(false);
    expect(at("/chess/openings", "#").hidden).toBe(false);
    // На остальных страницах якорь — обычная ссылка на место в тексте.
    expect(at("/about", "#programs").hidden).toBe(false);
    expect(at("/", "#top").hidden).toBe(false);
    // Смена языка ждёт по-прежнему полторы секунды.
    expect(run({ lang: "uz" }, "/")).toMatchObject({ hidden: true, wait: 1500 });
  });

  it("анимации, выключенные родителем, выключены ещё до отрисовки", () => {
    expect(run({ animations: false }, "/").motion).toBe("off");
    expect(run({ animations: false, lang: "uz" }, "/chess", "uz").motion).toBe("off");
    expect(run({}, "/").motion).toBeUndefined();
  });

  it("тёмная тема включена ещё до отрисовки, по умолчанию — светлая", () => {
    expect(run({ theme: "dark" }, "/").theme).toBe("dark");
    expect(run({ theme: "light" }, "/").theme).toBeUndefined();
    expect(run({}, "/chess").theme).toBeUndefined();
  });

  it("первое знакомство: метка для окна приветствия — только пока ребёнок не познакомился", () => {
    expect(run({}, "/").first).toBe(true);
    expect(run({ lang: "uz" }, "/", "uz").first).toBe(true);
    expect(run({}, "/", "ru", { welcomed: true }).first).toBe(false);
    expect(run({ age: 7 }, "/chess", "ru", { welcomed: true }).first).toBe(false);
  });

  it("возрастной режим ставится до отрисовки и совпадает с ageMode()", async () => {
    const { ageMode } = await import("@/lib/ageMode");
    for (const age of [undefined, 5, 7, 8, 10, 11, 15])
      expect(run(age === undefined ? {} : { age }, "/").age, String(age)).toBe(ageMode(age));
  });
});
