/**
 * Скрипт в <head> (src/app/layout.tsx) прячет страницу до загрузки: для узбекского языка
 * и для страниц, где в текстах стоит имя ребёнка. Ошибка в нём не видна (он в try/catch) — проверяем здесь.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const layout = fs.readFileSync(path.join(process.cwd(), "src/app/layout.tsx"), "utf8");
const literal = layout.match(/__html: `([^`]*)`/)![1];
// Тот же текст, что попадёт в HTML (с обработкой экранирования, как у шаблонной строки).
const code = new Function(`return \`${literal}\`;`)() as string;

function run(settings: Record<string, unknown>, pathname: string) {
  const classes = new Set<string>();
  const html = {
    lang: "ru",
    classList: { add: (c: string) => classes.add(c), remove: (c: string) => classes.delete(c) },
  };
  const storage = { getItem: () => JSON.stringify({ settings }) };
  new Function("localStorage", "location", "document", "setTimeout", code)(
    storage,
    { pathname },
    { documentElement: html },
    () => 0,
  );
  return { hidden: classes.has("i18n-wait"), lang: html.lang };
}

describe("скрипт в <head>", () => {
  it("это корректный JavaScript", () => {
    expect(() => new Function(code)).not.toThrow();
  });

  it("узбекский: страница ждёт загрузки на любом адресе", () => {
    expect(run({ lang: "uz" }, "/")).toEqual({ hidden: true, lang: "uz" });
    expect(run({ lang: "uz" }, "/chess")).toEqual({ hidden: true, lang: "uz" });
  });

  it("имя ребёнка: ждём только там, где оно стоит в текстах", () => {
    expect(run({ childName: "Анна" }, "/week/1/day/1").hidden).toBe(true);
    expect(run({ childName: "Анна" }, "/parent/guide").hidden).toBe(true);
    expect(run({ childName: "Анна" }, "/my-problems").hidden).toBe(true);
    expect(run({ childName: "Анна" }, "/").hidden).toBe(false);
    expect(run({ childName: "Анна" }, "/chess/play").hidden).toBe(false);
    expect(run({}, "/week/1/day/1").hidden).toBe(false);
  });
});
