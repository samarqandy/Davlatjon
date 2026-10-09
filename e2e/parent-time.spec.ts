import { expect, test, type Page } from "@playwright/test";

/** 4-й этап: итоги недели, дневное ограничение с карточкой «На сегодня хватит», приглашение на неделю. */

const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, state: Record<string, unknown> = {}, lang: "ru" | "uz" = "ru") {
  await page.addInitScript(
    ([more, l, key]) => {
      if (localStorage.getItem(key)) return;
      const now = Date.now();
      const d = new Date(now);
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const fill = (x: unknown): unknown =>
        x === "NOW"
          ? now
          : x === "TODAY"
            ? today
            : Array.isArray(x)
              ? x.map(fill)
              : x && typeof x === "object"
                ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k === "TODAY" ? today : k, fill(v)]))
                : x;
      const extra = fill(more) as { settings?: object };
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          ...extra,
          settings: { hintPause: false, bigText: false, age: 9, lang: l, ...extra.settings },
        }),
      );
    },
    [state, lang, KEY] as const,
  );
}

async function createPin(page: Page) {
  await page.goto("/parent");
  const pins = page.locator('input[type="password"]');
  await pins.nth(0).fill("2468");
  await pins.nth(1).fill("2468");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByRole("button", { name: /Закрыть раздел/ })).toBeVisible();
}

const solvedToday = {
  w1d1t1: { status: "solved", hints: 1, checks: 2, missed: 1, solvedAt: "NOW", timeMs: 180000, marks: {} },
};

test("итоги недели: дни, минуты и спокойные формулировки", async ({ page }) => {
  await prepare(page, { tasks: solvedToday, activity: { TODAY: { ms: 12 * 60_000 } } });
  await createPin(page);
  await page.getByRole("link", { name: /Итоги недели/ }).click();
  await expect(page).toHaveURL(/\/parent\/report$/);
  const report = page.locator("[data-report]");
  await expect(report.getByText("Математика: решено 1 задача.")).toBeVisible();
  await expect(report.getByText("Активное время: 12 мин.")).toBeVisible();
  await expect(report.getByText(/просить помощь — часть учёбы/)).toBeVisible();
  await expect(report.locator('[data-report-day="active"]')).toHaveCount(1);
  expect(await report.innerText()).not.toMatch(/%|рейтинг/i);
  // Прошлая неделя — тихая, и об этом сказано без упрёка.
  await page.getByRole("button", { name: "Предыдущая неделя" }).click();
  await expect(report.getByText(/прошла тихо — это нормально/)).toBeVisible();
});

test("ограничение выше предела: ребёнок видит спокойную карточку, а не таймер; взрослый продлевает PIN-кодом", async ({
  page,
}) => {
  await prepare(page, { settings: { dailyLimitMin: 20 }, activity: { TODAY: { ms: 20 * 60_000 } } });
  await createPin(page);
  await page.goto("/");
  const card = page.locator("[data-rest-card]");
  await expect(card).toBeVisible();
  await expect(card.getByRole("heading", { name: "На сегодня хватит!" })).toBeVisible();
  expect(await card.innerText()).not.toMatch(/\d+\s*(мин|:)/);

  await card.getByRole("button", { name: "Для взрослых" }).click();
  await card.locator("#rest-pin").fill("1111");
  await card.getByRole("button", { name: "Открыть" }).click();
  await expect(card.getByText("PIN-код не подошёл.")).toBeVisible();
  await card.locator("#rest-pin").fill("2468");
  await card.getByRole("button", { name: "Открыть" }).click();
  await card.getByRole("button", { name: /\+15/ }).click();
  await expect(card).toHaveCount(0);
});

test("пока время не вышло, ничего про время ребёнку не показывается", async ({ page }) => {
  await prepare(page, { settings: { dailyLimitMin: 30 }, activity: { TODAY: { ms: 5 * 60_000 } } });
  await page.goto("/");
  await expect(page.locator("[data-today]")).toBeVisible();
  await expect(page.locator("[data-rest-card]")).toHaveCount(0);
  expect(await page.locator("main").innerText()).not.toMatch(/осталось|таймер|обратный отсчёт/i);
});

test("раздел родителя не закрывается карточкой, чтобы можно было изменить ограничение", async ({ page }) => {
  await prepare(page, { settings: { dailyLimitMin: 20 }, activity: { TODAY: { ms: 25 * 60_000 } } });
  await createPin(page);
  await page.goto("/parent/report");
  await expect(page.locator("[data-rest-card]")).toHaveCount(0);
  const time = page.locator("[data-time]");
  await expect(time.getByText(/время на сегодня вышло/)).toBeVisible();
  await time.getByRole("button", { name: "Без ограничения" }).click();
  await page.goto("/");
  await expect(page.locator("[data-today]")).toBeVisible();
  await expect(page.locator("[data-rest-card]")).toHaveCount(0);
});

test("приглашение на неделю: родитель выбирает число дней, ребёнок видит его без сроков", async ({ page }) => {
  await prepare(page);
  await createPin(page);
  await page.goto("/parent/report");
  await page.getByRole("button", { name: "4 дн." }).click();
  await page.goto("/");
  await expect(page.locator("[data-today]").getByText(/На этой неделе: \d из 4 дней/)).toBeVisible();
});

/** Время в браузере ускоряем, чтобы не ждать полминуты на каждую запись. */
async function seconds(page: Page, n: number) {
  for (let i = 0; i < n; i += 5) {
    await page.mouse.click(5, 5);
    await page.clock.runFor(5000);
  }
}
const activityMs = (page: Page) =>
  page.evaluate((key) => {
    const a = JSON.parse(localStorage.getItem(key) ?? "{}").activity ?? {};
    return Object.values(a as Record<string, { ms: number }>).reduce((n, d) => n + d.ms, 0);
  }, KEY);

test("активное время копится, пока ребёнок что-то делает, и не копится в разделе родителя", async ({ page }) => {
  await page.clock.install();
  await prepare(page);
  await page.goto("/");
  await expect(page.locator("[data-today]")).toBeVisible();
  await seconds(page, 40);
  await expect.poll(() => activityMs(page)).toBeGreaterThanOrEqual(25_000);

  // Уход со страницы дописывает остаток, поэтому «до» меряем уже в разделе родителя.
  await createPin(page);
  const before = await activityMs(page);
  await seconds(page, 40);
  expect(await activityMs(page)).toBe(before);
});

test("время вышло посреди дела — карточка ждёт, пока ребёнок перейдёт на другую страницу", async ({ page }) => {
  await page.clock.install();
  await prepare(page, { settings: { dailyLimitMin: 20 }, activity: { TODAY: { ms: 19 * 60_000 + 40_000 } } });
  await page.goto("/");
  await expect(page.locator("[data-today]")).toBeVisible();
  await seconds(page, 60);
  await expect.poll(() => activityMs(page)).toBeGreaterThan(20 * 60_000);
  await expect(page.locator("[data-rest-card]")).toHaveCount(0);
  await page.locator('a[href="/chess"]').first().click();
  await expect(page.locator("[data-rest-card]")).toBeVisible();
});
