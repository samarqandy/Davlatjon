/**
 * Скрипт в <head> (src/lib/headScript.ts) прячет страницу до загрузки: когда она пришла не на языке
 * устройства (кука ещё не записана) и для страниц, где в текстах стоит имя ребёнка. Ошибка в нём не видна (он в try/catch) — проверяем здесь.
 */
import { describe, expect, it } from "vitest";
import { HEAD_SCRIPT as code } from "@/lib/headScript";

function run(settings: Record<string, unknown>, pathname: string, served: "ru" | "uz" = "ru") {
  const classes = new Set<string>();
  const attrs: Record<string, string> = {};
  const html = {
    lang: served,
    classList: { add: (c: string) => classes.add(c), remove: (c: string) => classes.delete(c) },
    setAttribute: (k: string, v: string) => void (attrs[k] = v),
  };
  const storage = { getItem: () => JSON.stringify({ settings }) };
  new Function("localStorage", "location", "document", "setTimeout", code)(
    storage,
    { pathname },
    { documentElement: html },
    () => 0,
  );
  return { hidden: classes.has("i18n-wait"), lang: html.lang, motion: attrs["data-motion"], age: attrs["data-age"] };
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

  it("анимации, выключенные родителем, выключены ещё до отрисовки", () => {
    expect(run({ animations: false }, "/").motion).toBe("off");
    expect(run({ animations: false, lang: "uz" }, "/chess", "uz").motion).toBe("off");
    expect(run({}, "/").motion).toBeUndefined();
  });

  it("возрастной режим ставится до отрисовки и совпадает с ageMode()", async () => {
    const { ageMode } = await import("@/lib/ageMode");
    for (const age of [undefined, 5, 7, 8, 10, 11, 15])
      expect(run(age === undefined ? {} : { age }, "/").age, String(age)).toBe(ageMode(age));
  });
});
