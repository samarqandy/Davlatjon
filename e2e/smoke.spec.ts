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

test("главная: вторая неделя «Неделя инструментов»", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Неделя инструментов/ })).toBeVisible();
  for (let d = 1; d <= 7; d++) await expect(page.locator(`a[href="/week/2/day/${d}"]`).first()).toBeVisible();
});

test("Удвоитель: из 1 в 25 за 6 команд", async ({ page }) => {
  await page.goto("/week/2/day/2#task-5");
  await expect(page.getByRole("heading", { name: /Удвоитель/ })).toBeVisible();
  const double = page.getByRole("button", { name: "Команда: удвой" });
  const plusOne = page.getByRole("button", { name: "Команда: прибавь 1" });
  for (const b of [double, plusOne, double, double, double, plusOne]) await b.click();
  await expect(page.getByText(/короче не бывает/)).toBeVisible();
});

test("ханойская башня: 3 кольца за 7 ходов", async ({ page }) => {
  await page.goto("/week/2/day/3#task-5");
  const peg = (name: string) => page.getByRole("button", { name: new RegExp(`^${name} стержень`) });
  const moves: [string, string][] = [
    ["левый", "правый"],
    ["левый", "средний"],
    ["правый", "средний"],
    ["левый", "правый"],
    ["средний", "левый"],
    ["средний", "правый"],
    ["левый", "правый"],
  ];
  for (const [from, to] of moves) {
    await peg(from).click();
    await peg(to).click();
  }
  await expect(page.getByText(/Быстрее не бывает/)).toBeVisible();
});

test("переправа: волк, коза и капуста за 7 поездок", async ({ page }) => {
  await page.goto("/week/2/day/4#task-5");
  const board = (name: string) => page.getByRole("button", { name: `${name}: посадить в лодку` });
  const sail = page.getByRole("button", { name: /Плыть/ });
  // Сначала ошибка: без козы волк её съест.
  await board("капуста").click();
  await sail.click();
  await expect(page.getByText(/Стоп! Если крестьянин уплывёт, волк съест козу/)).toBeVisible();
  for (const who of ["коза", null, "волк", "коза", "капуста", null, "коза"]) {
    if (who) await board(who).click();
    await sail.click();
  }
  await expect(page.getByText(/Быстрее не бывает/)).toBeVisible();
});
