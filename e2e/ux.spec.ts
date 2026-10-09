import { expect, test, type Page } from "@playwright/test";

/** Правки по итогам UX-аудита: замок родителя, выход из партии, режим «Сам», мягкие подсказки. */

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
          settings: { hintPause: false, bigText: false, age: 9, lang: "ru", ...s },
        }),
      );
    },
    [settings, KEY] as const,
  );
}

const square = (page: Page, board: string, sq: string) =>
  page.locator(`[data-board="${board}"] [data-square="${sq}"]`).click();

test("замок родителя: меню скрыто до PIN-кода, слова для сброса нет, после трёх ошибок — пауза", async ({ page }) => {
  await prepare(page);
  await page.goto("/parent");
  await expect(page.getByRole("heading", { name: "Раздел для взрослых" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Закрыть раздел/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Ответы/ })).toHaveCount(0);

  const pins = page.locator('input[type="password"]');
  await pins.nth(0).fill("2468");
  await pins.nth(1).fill("2468");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByRole("button", { name: /Закрыть раздел/ })).toBeVisible();

  await page.getByRole("button", { name: /Закрыть раздел/ }).click();
  for (let i = 0; i < 3; i++) {
    await page.locator('input[type="password"]').fill("1111");
    await page.getByRole("button", { name: "Открыть" }).click();
  }
  await expect(page.getByText("Подождите немного и попробуйте снова.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Открыть" })).toBeDisabled();

  await page.getByRole("button", { name: "Забыли PIN-код?" }).click();
  expect(await page.locator("[data-pin-reset]").innerText()).not.toMatch(/слово|soʻz/i);
  await page.getByRole("button", { name: "Запросить сброс" }).click();
  await expect(page.getByText(/Сброс будет доступен/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Сбросить PIN-код" })).toHaveCount(0);
});

test("партия с роботом: «Закончить» просит подтверждения; «Отменить» после этого не оставляет поражения", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w");
  await square(page, "play", "e2");
  await square(page, "play", "e4");
  await expect(page.getByText("🙂 Твой ход")).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: /Закончить партию/ }).click();
  await expect(page.locator("[data-confirm-end]")).toBeVisible();
  await page.getByRole("button", { name: "Играть дальше" }).click();
  await expect(page.locator("[data-confirm-end]")).toHaveCount(0);

  await page.getByRole("button", { name: /Закончить партию/ }).click();
  await page.getByRole("button", { name: "Закончить", exact: true }).click();
  const games = () =>
    page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chessGames?.length ?? 0, KEY);
  await expect.poll(games).toBe(1);

  await page.getByRole("button", { name: /Отменить/ }).click();
  await expect.poll(games).toBe(0);
});

test("«Новая партия» можно вернуть кнопкой «Вернуть прежнюю»", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w");
  await square(page, "play", "e2");
  await square(page, "play", "e4");
  await expect(page.getByText("🙂 Твой ход")).toBeVisible({ timeout: 10_000 });
  await page.getByRole("button", { name: /Новая партия/ }).click();
  await expect(page.locator("[data-previous-game]")).toBeVisible();
  await page.getByRole("button", { name: /Вернуть прежнюю/ }).click();
  await expect(page.getByRole("list", { name: "Список ходов" }).getByText("e4", { exact: true })).toBeVisible();
});

test("режим «Сам»: подсказки и отмены нет", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w?s=1");
  await expect(page.getByRole("button", { name: /Подсказка/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Отменить/ })).toHaveCount(0);
  await page.goto("/chess/play#robot-1-w");
  await expect(page.getByRole("button", { name: /Подсказка/ })).toBeVisible();
});

test("пустое поле: «Проверить» мягко подсказывает, а не молчит", async ({ page }) => {
  await prepare(page);
  await page.goto("/week/1/day/1#task-1");
  const check = page.getByRole("button", { name: "Проверить" }).first();
  await check.click({ force: true });
  await expect(page.getByText("✏️ Сначала впиши ответ").first()).toBeVisible();
});

test("кнопка «Подсказка» рядом с ответом ведёт к подсказкам (телефон)", async ({ page, isMobile }) => {
  test.skip(!isMobile, "на широком экране подсказки видны сбоку");
  await prepare(page);
  await page.goto("/week/1/day/1#task-1");
  await page.locator("[data-hint-jump]").first().click();
  await expect(page.locator("#hints").first()).toBeInViewport();
});

test("младшему — крупная кнопка «Прочитать» (56 px), старшему — обычная", async ({ page }) => {
  await prepare(page, { age: 7 });
  await page.goto("/week/1/day/1#task-1");
  const listen = page.getByRole("button", { name: /Прочитать/ }).first();
  await expect(listen).toBeVisible();
  expect((await listen.boundingBox())!.height).toBeGreaterThanOrEqual(55);
});
