import { expect, test, type Page } from "@playwright/test";

/** Исправления по результатам пользовательского тестирования (UX-аудит). */
async function seed(page: Page, settings: Record<string, unknown> = {}) {
  await page.addInitScript((s) => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key))
      localStorage.setItem(
        key,
        JSON.stringify({ version: 1, welcomed: true, settings: { hintPause: false, bigText: false, age: 9, ...s } }),
      );
  }, settings);
}

test("«Кто где живёт»: одно животное нельзя поселить в два домика, а проверка не выдаёт счёт", async ({ page }) => {
  await seed(page);
  await page.goto("/week/1/day/1#task-3");
  const pick = (animal: string) => page.locator("button[aria-pressed]", { hasText: animal });
  const cats = pick("Кот");
  await cats.nth(0).click();
  await expect(cats.nth(0)).toHaveAttribute("aria-pressed", "true");
  await cats.nth(1).click();
  // Кот переехал в синий домик, из красного ушёл.
  await expect(cats.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(cats.nth(0)).toHaveAttribute("aria-pressed", "false");
  await pick("Пёс").nth(0).click();
  await pick("Попугай").nth(2).click();
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText("Пока не всё сходится с условиями.")).toBeVisible();
  await expect(page.getByText(/Сходится: \d из 3/)).toHaveCount(0);
});

test("«Дальше» не главнее «Проверить», пока задача не решена; «Назад» всегда называется «Назад»", async ({ page }) => {
  await seed(page);
  await page.goto("/week/1/day/1#task-1");
  const next = page.getByRole("button", { name: "Дальше →" });
  await expect(next).toBeVisible();
  await expect(next).toHaveClass(/bg-white/);
  await expect(page.getByRole("button", { name: "← Назад" })).toBeVisible();
});

test("устаревшая подсказка «впиши ответ» исчезает, как только ребёнок начал писать; минус не вписывается", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/week/1/day/1#task-1");
  await page.getByRole("button", { name: "Проверить" }).first().click({ force: true });
  await expect(page.getByText("Сначала впиши ответ")).toBeVisible();
  const field = page.locator("input[inputmode='numeric']").first();
  await field.fill("abc-5");
  await expect(field).toHaveValue("5");
  await expect(page.getByText("Сначала впиши ответ")).toHaveCount(0);
});

test("малышу после трёх нерешённых задач «Передохнём?» не предлагается", async ({ page }) => {
  await seed(page, { age: 7 });
  await page.goto("/week/1/day/1#task-3");
  await page.getByRole("button", { name: "Дальше →" }).click();
  await expect(page.locator("[data-rest-stop]")).toHaveCount(0);
  await expect(page).toHaveURL(/#task-4$/);
});

test("робот: кнопки-стрелки не двигаются, сколько бы команд ни набрали", async ({ page }) => {
  await seed(page);
  await page.goto("/week/1/day/1#task-5");
  const right = page.getByRole("group", { name: "Стрелки" }).getByRole("button").last();
  // Положение на странице (а не на экране): при нажатиях страница может подкручиваться.
  const top = () => right.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const before = await top();
  for (let i = 0; i < 12; i++) await right.click();
  expect(await top()).toBe(before);
});

test("на телефоне у взрослых есть замок в шапке", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "телефонная шапка");
  await seed(page);
  await page.goto("/");
  await expect(page.locator("[data-parent-lock]")).toBeVisible();
  await expect(page.locator("[data-parent-lock]")).toHaveAttribute("href", "/parent");
});

test("уровни сложности называются одинаково по смыслу: «Qulay» по-узбекски", async ({ page }) => {
  await seed(page, { lang: "uz" });
  await page.goto("/week/1/day/1#task-3");
  await expect(page.getByText("Qulay").first()).toBeVisible();
});
