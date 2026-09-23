import { expect, test, type Page } from "@playwright/test";

/** Пропускаем приветственное окно, чтобы оно не мешало тестам. */
async function skipWelcome(page: Page) {
  await page.addInitScript(() => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key)) {
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          tasks: {},
          days: {},
          myProblems: [],
          reviews: {},
          settings: { hintPause: false, bigText: false },
        }),
      );
    }
  });
}

test.beforeEach(async ({ page }) => {
  await skipWelcome(page);
});

test("главная: неделя из 7 дней и сегодняшнее занятие", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Математика — это место/ })).toBeVisible();
  await expect(page.getByText("День 1. Смотри внимательно")).toBeVisible();
  for (let d = 1; d <= 7; d++) await expect(page.locator(`a[href="/week/1/day/${d}"]`).first()).toBeVisible();
});

test("задача с числовым ответом: мягкая обратная связь и подсказки", async ({ page }) => {
  await page.goto("/week/1/day/1#task-1");
  await expect(page.getByRole("heading", { name: /Почти двадцать/ })).toBeVisible();
  const input = page.getByLabel("19 + 19 + 19 =");
  await input.fill("47");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText(/Давай проверим твою идею/)).toBeVisible();
  await expect(page.getByText(/неправильно/i)).toHaveCount(0);

  await page.getByRole("button", { name: "Открыть подсказку" }).click();
  await expect(page.getByText(/Сколько раз в нём повторяется число 19/)).toBeVisible();

  await input.fill("57");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText("А ещё подумай")).toBeVisible();
});

test("робот доходит до флажка по программе", async ({ page }) => {
  await page.goto("/week/1/day/1#task-5");
  for (const dir of ["вверх", "вверх", "вверх", "вправо", "вправо", "вправо", "вправо"]) {
    await page.getByRole("button", { name: dir, exact: true }).click();
  }
  await page.getByRole("button", { name: /Запустить/ }).click();
  await expect(page.getByText(/короче не бывает/)).toBeVisible({ timeout: 10_000 });
});

test("печать: лист заданий без ответов, ответы — только после PIN-кода", async ({ page }) => {
  await page.goto("/week/1/day/1/print");
  await expect(page.getByText("Лаборатория Давлатжона · задания")).toBeVisible();
  await expect(page.getByText("Ответ:")).toHaveCount(0);
  await page.getByRole("tab", { name: /Ответы/ }).click();
  await expect(page.getByRole("heading", { name: "Раздел для взрослых" })).toBeVisible();
});

test("раздел родителя: PIN-код, ответы и недельный обзор", async ({ page }) => {
  await page.goto("/parent");
  const pins = page.locator('input[type="password"]');
  await pins.nth(0).fill("2468");
  await pins.nth(1).fill("2468");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByRole("heading", { name: /Здравствуйте/ })).toBeVisible();

  await page.goto("/parent/week/1/day/1");
  await expect(page.getByText("Ответ:").first()).toBeVisible();
  await expect(page.getByText("57").first()).toBeVisible();

  await page.goto("/parent/week/1/review");
  await expect(page.getByRole("heading", { name: "Недельный обзор" })).toBeVisible();
  await expect(page.getByText("Без ярлыков")).toBeVisible();
});

test("мои задачи: можно записать свою задачу", async ({ page }) => {
  await page.goto("/my-problems");
  await page.getByLabel("Условие задачи").fill("Сколько лап у трёх котов?");
  await page.getByRole("button", { name: "Сохранить задачу" }).click();
  await expect(page.getByText("Сколько лап у трёх котов?")).toBeVisible();
});
