import { expect, test, type Page } from "@playwright/test";

async function prepare(page: Page, settings: Record<string, unknown> = {}) {
  await page.addInitScript((s) => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key))
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 10, sound: false, ...s },
        }),
      );
  }, settings);
}

async function answerAll(page: Page, answers: string[]) {
  for (const a of answers) {
    await page.locator("[data-placement-input]").fill(a);
    await page.getByRole("button", { name: /^(Дальше|Готово)$/ }).click();
  }
}

test("вводный тест: все шесть верно — предлагается неделя 3, и «Начать» ведёт туда", async ({ page }) => {
  await prepare(page);
  await page.goto("/");
  await expect(page.locator("[data-placement='offer']")).toBeVisible();
  await page.getByRole("button", { name: "Попробовать" }).click();
  await answerAll(page, ["45", "15", "25", "28", "32", "7"]);
  await expect(page.locator("[data-placement='result']")).toContainText("недели 3");
  await page.locator("[data-placement-accept]").click();
  await expect(page.locator("[data-placement]")).toHaveCount(0);
  await expect(page.locator("[data-next-step]")).toContainText("Неделя 3");
  await expect(page.locator("[data-next-step]").getByRole("link", { name: /Начать/ })).toHaveAttribute(
    "href",
    "/week/3/day/1",
  );
});

test("вводный тест: ошибка в первой неделе — начинаем с первой; «Пока не знаю» не пугает", async ({ page }) => {
  await prepare(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Попробовать" }).click();
  await page.getByRole("button", { name: "Пока не знаю" }).click();
  await answerAll(page, ["15", "25", "28", "32", "7"]);
  await expect(page.locator("[data-placement='result']")).toContainText("первой недели");
  await page.locator("[data-placement-accept]").click();
  await expect(page.locator("[data-next-step]")).toContainText("Неделя 1");
});

test("тест можно пропустить, и он больше не появляется; малышам он не предлагается", async ({ page }) => {
  await prepare(page);
  await page.goto("/");
  await page.getByRole("button", { name: "С первого дня" }).click();
  await page.reload();
  await expect(page.locator("[data-placement]")).toHaveCount(0);
});

test("малышу вводный тест не показывается", async ({ page }) => {
  await prepare(page, { age: 7 });
  await page.goto("/");
  await expect(page.locator("[data-next-step]")).toBeVisible();
  await expect(page.locator("[data-placement]")).toHaveCount(0);
});

test("итоги дня: птичка Парвоз хвалит, есть кнопка «Показать родителям»", async ({ page }) => {
  await prepare(page, { age: 9 });
  await page.goto("/week/1/day/1#finish");
  await expect(page.locator("[data-mascot]").first()).toBeVisible();
  await expect(page.getByText(/Парвоз/).first()).toBeVisible();
  await expect(page.locator("[data-share]")).toBeVisible();
});
