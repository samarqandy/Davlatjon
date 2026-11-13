import { expect, test, type Page } from "@playwright/test";

/** Словарь шахматиста: все термины школы на одной странице, поиск, раздел, ссылка на урок. */

const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, lang: "ru" | "uz" = "ru") {
  await page.addInitScript(
    ([key, l]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, JSON.stringify({ version: 1, welcomed: true, settings: { age: 10, lang: l } }));
    },
    [KEY, lang] as const,
  );
}

test("словарь: поиск находит слово, ссылка ведёт в урок, где оно объясняется", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/glossary");
  const entries = page.locator("[data-glossary-entry]");
  expect(await entries.count()).toBeGreaterThan(150);
  await page.locator("[data-glossary-search]").fill("мельниц");
  await expect(entries).toHaveCount(1);
  await expect(entries.first()).toContainText("Мельница");
  await expect(page.locator("[data-glossary-count]")).toHaveText("Найдено: 1");
  await entries.first().getByRole("link").click();
  await expect(page).toHaveURL(/\/chess\/course-3#c3-disc-gain$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("словарь: раздел сужает список; пустой поиск объясняет, что делать", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/glossary");
  const entries = page.locator("[data-glossary-entry]");
  const all = await entries.count();
  await page.locator('[data-glossary-group="step5"]').click();
  const step5 = await entries.count();
  expect(step5).toBeGreaterThan(20);
  expect(step5).toBeLessThan(all);
  await page.locator("[data-glossary-search]").fill("такого слова нет");
  await expect(entries).toHaveCount(0);
  await expect(page.getByText("Такого слова в словаре пока нет")).toBeVisible();
});

test("словарь на главной шахмат: одна ссылка вместо длинного списка", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess");
  const link = page.locator("[data-glossary-link]");
  await expect(link).toContainText("Словарь шахматиста");
  await link.click();
  await expect(page).toHaveURL(/\/chess\/glossary$/);
  await expect(page.getByRole("heading", { level: 1, name: "Словарь шахматиста" })).toBeVisible();
});

test("lugʻat oʻzbekcha: kirill harfisiz, qidiruv apostrofsiz ham topadi", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/uz/chess/glossary");
  await expect(page.getByRole("heading", { level: 1, name: "Shaxmatchi lugʻati" })).toBeVisible();
  await expect(page).toHaveTitle(/Shaxmatchi lugʻati/);
  await page.locator("[data-glossary-search]").fill("boglash");
  const entries = page.locator("[data-glossary-entry]");
  expect(await entries.count()).toBeGreaterThan(1);
  await expect(entries.first()).toContainText(/bogʻla/i);
  expect(await page.locator("[data-glossary]").innerText()).not.toMatch(/[а-яё]/i);
});
