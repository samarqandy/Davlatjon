import { expect, test, type Page } from "@playwright/test";

/** Контрольные тесты: без подсказок, балл за первую попытку, итог со звёздами, узбекская версия. */
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

test("тест: подсказок нет, ошибка не даёт балла, ответ с первой попытки — даёт", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/tests");
  await expect(page.getByRole("heading", { name: /Контрольные тесты/ })).toBeVisible();
  await expect(page.locator("[data-chess-test]")).toHaveCount(3);
  await page.locator('[data-chess-test="test-1"]').click();
  await expect(page.getByRole("button", { name: /Подсказка/ })).toHaveCount(0);

  // Вопрос 5 — «Бесплатная фигура»: сначала неверный ход, затем верный.
  await page.goto("/chess/tests#test-1-5");
  const sq = (s: string) => page.locator(`[data-board="mo-test-1-5"] [data-square="${s}"]`).click();
  await sq("e1");
  await sq("e2");
  await page.waitForTimeout(1900);
  await sq("c3");
  await sq("d5");
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["test-1-5"]?.solvedAt).toBeTruthy();
  expect(stored["test-1-5"]?.misses).toBeGreaterThan(0);
});

test("тест: итог показывает баллы и звёзды, когда все вопросы решены", async ({ page }) => {
  await page.addInitScript((key) => {
    // Тест 1 целиком решён с первой попытки, кроме двух вопросов.
    const chess: Record<string, unknown> = {};
    for (let i = 1; i <= 12; i++) chess[`test-1-${i}`] = { solvedAt: 1, misses: i <= 2 ? 1 : 0 };
    localStorage.setItem(
      key,
      JSON.stringify({
        version: 1,
        welcomed: true,
        chess,
        settings: { hintPause: false, bigText: false, age: 9, lang: "ru", sound: false, animations: false },
      }),
    );
  }, KEY);
  await page.goto("/chess/tests#test-1");
  await expect(page.locator("[data-test-result]")).toHaveAttribute("data-test-result", "10");
  await expect(page.locator("[data-stars]").first()).toHaveAttribute("data-stars", "3");
});

test("тесты по-узбекски: без русских букв", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/chess/tests#test-2-1");
  await expect(page.getByRole("heading", { name: /2-test/ })).toBeVisible();
  const main = await page.locator("main").innerText();
  expect(main).not.toMatch(/[А-Яа-яЁё]/);
});
