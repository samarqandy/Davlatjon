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

test("экран игры: главная кнопка «Играть» сразу начинает партию с роботом своего уровня", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/play");
  await page.locator("[data-quick-play]").getByRole("button", { name: "Играть" }).click();
  await expect(page).toHaveURL(/#robot-\d-w$/);
  await expect(page.getByRole("button", { name: /Подсказка/ })).toBeVisible();
});

test("экран игры: фора от робота — в раскрывающемся блоке, выбор виден в его заголовке и попадает в партию", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/chess/play");
  const settings = page.locator("[data-robot-settings]");
  await expect(settings).not.toHaveAttribute("open", "");
  await expect(settings.locator("summary")).toContainText("со всеми фигурами");
  await settings.locator("summary").click();
  await settings.getByRole("group", { name: "Фора от робота" }).getByRole("button", { name: "без ферзя" }).click();
  await expect(settings.locator("summary")).toContainText("без ферзя");
  await page.getByRole("button", { name: "Белыми" }).first().click();
  await expect(page).toHaveURL(/#robot-1-w\?o=/);
});

test("режим «Сам»: подсказки и отмены нет", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w?s=1");
  await expect(page.getByRole("button", { name: /Подсказка/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Отменить/ })).toHaveCount(0);
  // Якорь на той же странице меняем только после гидратации: иначе Next при запуске перепишет адрес без него.
  await page.waitForLoadState("networkidle");
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

test("кнопка «Подсказка» в нижней панели ведёт к подсказкам (телефон)", async ({ page, isMobile }) => {
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

test("партия с роботом: ход робота назван словами в строке статуса (её читает экранный диктор)", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w");
  await square(page, "play", "e2");
  await square(page, "play", "e4");
  const status = page.locator("[data-play-status]");
  await expect(status).toContainText("Твой ход", { timeout: 10_000 });
  await expect(status.locator("[data-robot-move]")).toContainText(/Робот сыграл .+\./);
});

// Бюджет экрана: младший ребёнок читает с трудом и не любит прокрутку, поэтому задача целиком помещается на телефон.
test("задача на телефоне: условие, ответ и «Проверить» — на одном экране, без лишних кнопок", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "бюджет экрана считаем для телефона");
  await prepare(page, { age: 7 });
  await page.setViewportSize({ width: 390, height: 664 });
  await page.goto("/week/1/day/1#task-1");
  const navTop = (await page.locator("[data-day-nav]").boundingBox())!.y;
  const bottomOf = async (name: string | RegExp) => {
    const box = (await page.getByRole("button", { name }).first().boundingBox())!;
    return box.y + box.height;
  };
  await expect(page.getByRole("heading", { name: "Почти двадцать" })).toBeInViewport();
  expect(await bottomOf("Проверить")).toBeLessThanOrEqual(navTop);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  // Счётчик задач один — полоска в шапке; подписи «Задача 1 из 8» и «1 / 8» на телефоне не показываем.
  await expect(page.getByText("Задача 1 из 8")).toBeHidden();
  await expect(page.locator("[data-task-counter]")).toBeHidden();
  await expect(page.getByRole("list", { name: "Задачи дня" }).getByRole("button")).toHaveCount(9);

  // Кнопок и полей на экране, не считая полоски задач, — не больше восьми (было семнадцать).
  const controls = await page.evaluate(
    () =>
      [...document.querySelectorAll("a[href],button,input,select,summary")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0 && !el.closest("header ol");
      }).length,
  );
  expect(controls).toBeLessThanOrEqual(8);

  // После верного ответа итог и «Дальше» видны сразу, искать их прокруткой не нужно.
  await page.locator("input").first().fill("57");
  await page.getByRole("button", { name: "Проверить" }).first().click();
  await expect(page.getByText(/Ответ совпадает|Так и есть|Сошлось|Точно/).first()).toBeInViewport();
  await expect(page.getByRole("button", { name: "Дальше →" })).toBeInViewport();
  await expect(page.locator("[data-task-counter]")).toBeVisible();
});

test("неверный ответ — мягкий сигнал «попробуй ещё»; пустое поле и верный ответ его не дают", async ({ page }) => {
  await prepare(page);
  await page.addInitScript(() => {
    const w = window as unknown as { __answer: string[] };
    w.__answer = [];
    window.addEventListener("answer-sfx", (e) => w.__answer.push((e as CustomEvent<string>).detail));
    window.addEventListener("reward-sfx", (e) => w.__answer.push(`reward:${(e as CustomEvent<string>).detail}`));
  });
  await page.goto("/week/1/day/1#task-1");
  const heard = () => page.evaluate(() => (window as unknown as { __answer: string[] }).__answer);
  const check = page.getByRole("button", { name: "Проверить" }).first();
  await check.click({ force: true });
  await expect(page.getByText("✏️ Сначала впиши ответ").first()).toBeVisible();
  expect(await heard()).toEqual([]);

  await page.locator("input").first().fill("50");
  await check.click();
  await expect.poll(heard).toEqual(["retry"]);

  await page.locator("input").first().fill("57");
  await check.click();
  await expect.poll(heard).toEqual(["retry", "reward:win"]);
});
