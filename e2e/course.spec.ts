import { expect, test, type Page } from "@playwright/test";

/** Курс «Ступень 1»: модули и уроки, подключённые упражнения, новая цель «объяви шах», общий прогресс, узбекская версия. */
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
          settings: { hintPause: false, bigText: false, age: 9, lang: l, sound: false, animations: false },
        }),
      );
    },
    [lang, KEY] as const,
  );
}

const square = (page: Page, id: string, sq: string) =>
  page.locator(`[data-board="mo-${id}"] [data-square="${sq}"]`).click();

test("курс: из школы — модули по порядку, урок открывается, номер урока в заголовке", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess");
  await page.locator('a[href="/chess/course"]').first().click();
  await expect(page.getByRole("heading", { level: 1, name: /Ступень 1/ })).toBeVisible();
  for (const id of ["board", "pieces", "value", "check"])
    await expect(page.locator(`[data-course-module="${id}"]`)).toBeVisible();
  await page.locator('[data-course-lesson="c1-check"]').click();
  await expect(page.getByText("Урок 13")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Шах" })).toBeVisible();
});

test("курс: «объяви шах» — ход без шаха получает подсказку, шах засчитывается", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/course#c1-check-exercise-2");
  await square(page, "c1-check-rook", "a1");
  await square(page, "c1-check-rook", "a5");
  await expect(page.getByText("Это не шах.")).toBeVisible();
  await page.waitForTimeout(1900);
  await square(page, "c1-check-rook", "a1");
  await square(page, "c1-check-rook", "a8");
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c1-check-rook"]?.solvedAt).toBeTruthy();
});

test("курс: упражнение из уровня подключено к уроку и делит с ним прогресс", async ({ page }) => {
  await prepare(page);
  await page.addInitScript((key) => {
    const s = JSON.parse(localStorage.getItem(key) ?? "{}");
    s.chess = { "rook-moves": { solvedAt: Date.now(), misses: 0 } };
    localStorage.setItem(key, JSON.stringify(s));
  }, KEY);
  await page.goto("/chess/course#c1-rook-exercises");
  await expect(page.getByRole("button", { name: /Упражнение 1: .*\(решено\)/ })).toBeVisible();
});

test("курс по-узбекски: заголовки и уроки на узбекском", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/chess/course");
  await expect(page.getByRole("heading", { level: 1, name: /1-bosqich/ })).toBeVisible();
  await page.locator('[data-course-lesson="c1-take"]').click();
  await expect(page.getByText("14-dars")).toBeVisible();
  expect(await page.locator("main").innerText()).not.toMatch(/[А-Яа-яЁё]/);
});
