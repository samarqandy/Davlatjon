import { expect, test, type Page } from "@playwright/test";

/** «Быстрые примеры»: десять вопросов, ответ нажатием; колода по возрасту; результат сохраняется. */
const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, settings: Record<string, unknown> = {}) {
  await page.addInitScript(
    ([s, key]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 8, lang: "ru", sound: false, ...s },
        }),
      );
    },
    [settings, KEY] as const,
  );
}

/** Нажать первый вариант и дождаться, пока вопрос сменится (или покажется итог). */
async function playAll(page: Page) {
  for (let i = 1; i <= 10; i++) {
    await expect(page.locator('[data-quick="play"]')).toBeVisible();
    await expect(page.getByText(`${i}/10`, { exact: true })).toBeVisible();
    await page.locator('[data-quick-option="0"]').click();
    // После ответа ровно один вариант подсвечен как верный.
    await expect(page.locator('[data-quick-result="right"]')).toHaveCount(1);
    if (i < 10) await expect(page.getByText(`${i + 1}/10`, { exact: true })).toBeVisible({ timeout: 5000 });
  }
  await expect(page.locator('[data-quick="done"]')).toBeVisible({ timeout: 5000 });
}

test("числа: десять вопросов подряд, итог со звёздами, результат сохраняется и виден на старте", async ({ page }) => {
  await prepare(page);
  await page.goto("/quick");
  await expect(page.locator('[data-quick-deck="numbers"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator("[data-quick-start]").click();
  await playAll(page);
  await expect(page.locator("[data-quick-score]")).toContainText("из 10");
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").quick, KEY);
  expect(Object.keys(saved)).toHaveLength(1);
  expect(Object.keys(saved)[0]).toMatch(/^\d{4}-\d{2}-\d{2}:numbers$/);
  // Ещё раз — новая серия.
  await page.locator("[data-quick-again]").click();
  await expect(page.locator('[data-quick="play"]')).toBeVisible();
});

test("пятилетка: по умолчанию картинки, на главной — «Играть», а не занятия по неделям", async ({ page }) => {
  await prepare(page, { age: 5 });
  await page.goto("/");
  await expect(page.locator("[data-little-step]")).toBeVisible();
  await expect(page.locator("[data-next-step]")).toHaveCount(0);
  await page.locator("[data-little-step] a").click();
  await expect(page).toHaveURL(/\/quick$/);
  await expect(page.locator('[data-quick-deck="little"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator("[data-quick-start]").click();
  await playAll(page);
});

test("школьник видит карточку «Быстрые примеры» на главной; по-узбекски без русских букв", async ({ page }) => {
  await prepare(page, { lang: "uz" });
  await page.goto("/");
  await expect(page.locator("[data-quick-card]")).toBeVisible();
  await page.locator("[data-quick-card]").click();
  await page.locator("[data-quick-start]").click();
  await expect(page.locator('[data-quick="play"]')).toBeVisible();
  const text = await page.locator("main").innerText();
  expect(text).not.toMatch(/[А-Яа-яЁё]/);
});
