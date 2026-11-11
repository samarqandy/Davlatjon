import { expect, test, type Page } from "@playwright/test";

/** Интервальное повторение задач по математике: карточка на главной, экран повторения, расписание. */

const KEY = "davlatjon-lab:v1";

/** Состояние с задачами на повторении: сроки считаются от сегодняшнего дня в самом браузере. */
async function prepare(page: Page, extra: Record<string, unknown> = {}) {
  await page.addInitScript(
    ([key, more]) => {
      if (localStorage.getItem(key)) return;
      const day = (shift: number) => {
        const d = new Date(Date.now() + shift * 86_400_000);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      };
      const old = Date.now() - 3 * 86_400_000;
      const solved = { status: "solved", solvedAt: old, hints: 0, checks: 2, timeMs: 1, marks: {} };
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 9, lang: "ru" },
          tasks: {
            w1d1t1: { ...solved, missed: 1, box: 1, due: day(0), input: { sum: "57" } },
            w1d1t2: { ...solved, missed: 2, box: 1, due: day(-1) },
            // Решена сразу — на повторение не попадает.
            w1d1t3: { ...solved, missed: 0, checks: 1 },
          },
          chessPuzzles: { p1: { solvedAt: old, misses: 1, box: 1, due: day(0) } },
          ...more,
        }),
      );
    },
    [KEY, extra] as const,
  );
}

const stored = (page: Page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}"), KEY);
const isoDay = (shift: number) => {
  const d = new Date(Date.now() + shift * 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

test("повторение: с главной — к задаче с чистым полем; без ошибок — через 3 дня, с ошибкой — завтра", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/");
  const card = page.locator("[data-review-card]");
  await expect(card).toBeVisible();
  await expect(card.locator("[data-review-count]")).toHaveAttribute("data-review-count", "2");
  await expect(card).toContainText("2 задачи");

  // Первой идёт задача, которая ждёт дольше.
  await card.click();
  await expect(page).toHaveURL(/\/week\/1\/day\/1#review-w1d1t2$/);
  const screen = page.locator("[data-review]");
  await expect(screen).toHaveAttribute("data-review", "w1d1t2");
  await expect(screen.locator("[data-review-left]")).toHaveText("ещё 1");
  // Экран повторения — без полоски дня, вопросов «А ещё подумай» и отметок.
  await expect(page.locator("[data-task-step]")).toHaveCount(0);
  const next = page.locator("[data-review-next]");
  await expect(next).toHaveText("Позже");

  await page.getByLabel("Сумма").fill("30");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.locator("[data-review-outcome]")).toHaveText("Вернётся через 3 дня");
  await expect(page.getByText("А ещё подумай")).toHaveCount(0);
  await expect(next).toHaveText("Дальше →");
  await next.click();

  await expect(page).toHaveURL(/#review-w1d1t1$/);
  await expect(page.getByRole("heading", { name: /Почти двадцать/ })).toBeVisible();
  const input = page.getByLabel("19 + 19 + 19 =");
  // Ответ первой попытки («57») в поле не подставлен: решаем заново.
  await expect(input).toHaveValue("");
  await expect(screen.locator("[data-review-left]")).toHaveCount(0);
  await input.fill("47");
  await page.getByRole("button", { name: "Проверить" }).click();
  await input.fill("57");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.locator("[data-review-outcome]")).toHaveText("Повторим ещё раз завтра");
  await expect(next).toHaveText("Готово ✓");

  await expect
    .poll(async () => {
      const s = await stored(page);
      return [s.tasks.w1d1t2.box, s.tasks.w1d1t2.due, s.tasks.w1d1t1.box, s.tasks.w1d1t1.due];
    })
    .toEqual([2, isoDay(3), 1, isoDay(1)]);
  const s = await stored(page);
  // Первая попытка не тронута: решена тогда же, ответ и счёт ошибок прежние.
  expect(s.tasks.w1d1t1).toMatchObject({ status: "solved", missed: 1, checks: 2, input: { sum: "57" } });
  expect(s.tasks.w1d1t2).toMatchObject({ status: "solved", missed: 2 });
  expect(Object.keys(s.tasks).sort()).toEqual(["w1d1t1", "w1d1t2", "w1d1t3"]);

  // Перезагрузка: срок ещё не подошёл — попытка показана решённой, расписание не сдвигается.
  await page.reload();
  await expect(page.locator("[data-review-outcome]")).toHaveText("Повторим ещё раз завтра");
  await expect(page.getByLabel("19 + 19 + 19 =")).toHaveValue("57");

  await page.locator("[data-review-next]").click();
  await expect(page).toHaveURL(/\/(ru)?$/);
  await expect(page.locator("[data-next-step]")).toBeVisible();
  await expect(page.locator("[data-review-card]")).toHaveCount(0);
});

test("повторение: «Позже» расписание не меняет; повторённая задача помечена сегодняшним днём", async ({ page }) => {
  await prepare(page);
  await page.goto("/week/1/day/1#review-w1d1t1");
  await page.waitForLoadState("networkidle");
  if (!(await page.locator("[data-review]").count())) {
    // Якорь, заданный до загрузки, роутер иногда сбрасывает — ставим его ещё раз.
    await page.evaluate(() => (window.location.hash = "#review-w1d1t1"));
  }
  await expect(page.locator("[data-review]")).toHaveAttribute("data-review", "w1d1t1");
  await page.getByLabel("19 + 19 + 19 =").fill("57");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.locator("[data-review-outcome]")).toHaveText("Вернётся через 3 дня");
  await page.locator("[data-review-next]").click();
  // Вторую задачу откладываем: она остаётся в очереди.
  await expect(page.locator("[data-review]")).toHaveAttribute("data-review", "w1d1t2");
  await page.locator("[data-review-next]").click();
  await expect(page.locator("[data-review-card] [data-review-count]")).toHaveAttribute("data-review-count", "1");
  const s = await stored(page);
  expect(s.tasks.w1d1t2).toMatchObject({ box: 1, due: isoDay(-1) });
  // Повторённая задача помечена сегодняшним днём: так её считает задание дня.
  expect(s.tasks.w1d1t1.reviewedAt).toBeGreaterThan(Date.now() - 60_000);
  expect(s.tasks.w1d1t2.reviewedAt).toBeUndefined();
});

test("шахматная школа: на плитке «Задачи» — сколько задач пора повторить", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess");
  await expect(page.locator("[data-main-sections] [data-due-badge]")).toHaveAttribute("data-due-badge", "1");
});

test("повторение по-узбекски — без кириллицы", async ({ page }) => {
  await prepare(page, { settings: { hintPause: false, bigText: false, age: 9, lang: "uz" } });
  await page.goto("/");
  const card = page.locator("[data-review-card]");
  await expect(card).toContainText("Takrorlash");
  expect(await card.innerText()).not.toMatch(/[а-яё]/i);
  await card.click();
  const screen = page.locator("[data-review]");
  await expect(screen).toBeVisible();
  await expect(page.locator("[data-review-next]")).toHaveText("Keyinroq");
  expect(await page.locator("header").first().innerText()).not.toMatch(/[а-яё]/i);
  expect(await page.locator("[data-day-nav]").innerText()).not.toMatch(/[а-яё]/i);
});
