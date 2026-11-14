import { expect, test, type Page } from "@playwright/test";
import { week4 } from "../src/content/week4";

/** Неделя 4 «Геометрия»: на главной, каждая задача открывается без ошибок, ответы проверяются, узбекский — без кириллицы. */
const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, lang: "ru" | "uz" = "ru") {
  await page.addInitScript(
    ([l, key]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 10, lang: l, sound: false, animations: false },
        }),
      );
    },
    [lang, KEY] as const,
  );
}

test("главная: четвёртая неделя «Неделя геометрии» — семь дней", async ({ page }) => {
  await prepare(page);
  await page.goto("/");
  const path = page.locator("[data-path]");
  await expect(path).toBeVisible();
  if (!(await path.evaluate((el) => (el as HTMLDetailsElement).open))) await path.locator("summary").click();
  await expect(page.getByRole("heading", { name: /Неделя геометрии/ })).toBeVisible();
  for (let d = 1; d <= 7; d++) await expect(page.locator(`a[href="/week/4/day/${d}"]`).first()).toBeVisible();
  await expect(page.getByText("Комбинаторика и алгоритмы — шаг за шагом.")).toBeVisible();
});

for (const day of week4.days)
  test(`день ${day.day} «${day.title}»: все задачи открываются без ошибок и без прокрутки вбок`, async ({
    page,
    isMobile,
  }) => {
    test.slow();
    await prepare(page);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    for (const [i, task] of day.tasks.entries()) {
      await page.goto("/privacy");
      await page.goto(`/week/4/day/${day.day}#task-${i + 1}`);
      await expect(page.getByRole("heading", { name: task.title, exact: true }), task.id).toBeVisible();
      if (isMobile) {
        const extra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        expect(extra, task.id).toBeLessThanOrEqual(0);
        // Рисунки не вылезают за экран (карточка их не обрезает молча).
        const wide = await page.evaluate(
          () =>
            [...document.querySelectorAll("main svg")].filter(
              (el) => el.getBoundingClientRect().right > innerWidth + 0.5,
            ).length,
        );
        expect(wide, task.id).toBe(0);
      }
    }
    expect(errors).toEqual([]);
  });

test("квадратики в сетке: ответ 14 принимается", async ({ page }) => {
  await prepare(page);
  await page.goto("/week/4/day/1#task-2");
  await expect(page.getByRole("heading", { name: "Квадратики в сетке" })).toBeVisible();
  const input = page.getByLabel("Квадратов всего");
  await input.fill("9");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText("А ещё подумай")).toHaveCount(0);
  await input.fill("14");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText("А ещё подумай")).toBeVisible();
});

test("клад на карте: клетка вводится и проверяется", async ({ page }) => {
  await prepare(page);
  await page.goto("/week/4/day/6#task-3");
  await expect(page.getByRole("heading", { name: "Клетка по приметам" })).toBeVisible();
  // Клетку выбирают кнопками: буква столбца, потом номер строки.
  await page.getByRole("group", { name: "Буква столбца" }).getByRole("button", { name: "Г", exact: true }).click();
  await page.getByRole("group", { name: "Номер строки" }).getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText("А ещё подумай")).toBeVisible();
});

test.describe("oʻzbek tili", () => {
  for (const day of [2, 5, 6])
    test(`4-hafta, ${day}-kun: barcha masalalarda rus harflari yoʻq`, async ({ page }) => {
      test.slow();
      await prepare(page, "uz");
      const count = week4.days[day - 1].tasks.length;
      for (let i = 1; i <= count; i++) {
        await page.goto("/privacy");
        await page.goto(`/uz/week/4/day/${day}#task-${i}`);
        await expect(page.locator("html")).toHaveAttribute("data-lang", "uz");
        await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
        const lines = (await page.locator("main").innerText())
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => /[А-Яа-яЁё]/.test(l));
        expect(lines, `${day}-kun, ${i}-masala`).toEqual([]);
      }
    });
});
