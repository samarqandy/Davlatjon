import { expect, test, type Page } from "@playwright/test";

/** «Спокойная входная дверь»: короткое знакомство, нижнее меню на телефоне, шаг «Продолжить», остановка для малышей. */

const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, state: Record<string, unknown> = {}, settings: Record<string, unknown> = {}) {
  await page.addInitScript(
    ([more, s, key]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          ...more,
          settings: { hintPause: false, bigText: false, age: 7, lang: "ru", ...s },
        }),
      );
    },
    [state, settings, KEY] as const,
  );
}

test("знакомство: язык → возраст; без имени и возраста всё равно можно начать, и карточка имени не пристаёт", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("davlatjon-lab:v1", JSON.stringify({ version: 1 })));
  await page.goto("/");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAttribute("data-welcome-step", "0");
  await dialog.getByRole("button", { name: "Дальше →" }).click();
  await expect(dialog).toHaveAttribute("data-welcome-step", "1");
  await dialog.getByRole("button", { name: "Назад" }).click();
  await expect(dialog).toHaveAttribute("data-welcome-step", "0");
  await dialog.getByRole("button", { name: "Дальше →" }).click();
  await dialog.getByRole("button", { name: "Поехали! 🚀" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("[data-name-banner]")).toHaveCount(0);
});

test("нижнее меню на телефоне: три раздела; ссылка «Для взрослых» внизу страницы", async ({ page, isMobile }) => {
  await prepare(page);
  await page.goto("/");
  const bar = page.locator("[data-bottom-nav]");
  if (isMobile) {
    await expect(bar).toBeVisible();
    await expect(bar.getByRole("link")).toHaveCount(3);
    await expect(bar.getByRole("link", { name: /Главная/ })).toHaveAttribute("aria-current", "page");
    // Внутри задач меню не отвлекает.
    await page.goto("/week/1/day/1#task-1");
    await expect(page.locator("[data-bottom-nav]")).toHaveCount(0);
  } else {
    await expect(bar).toBeHidden();
  }
  await page.goto("/");
  await expect(page.locator("[data-adults-link]")).toBeVisible();
});

test("главная для малыша короткая: путь свёрнут, «Продолжить» ведёт к первой нерешённой задаче", async ({ page }) => {
  const solved = { status: "solved", hints: 0, checks: 1, missed: 0, timeMs: 1, marks: {}, solvedAt: 1 };
  await prepare(page, {
    tasks: { w1d1t1: solved, w1d1t2: solved },
    days: { w1d1: { startedAt: 1 } },
  });
  await page.goto("/");
  await expect(page.locator("[data-path]")).not.toHaveAttribute("open", "");
  const hero = page.locator("[data-next-step]");
  await expect(hero.getByText("Продолжим")).toBeVisible();
  expect(await hero.innerText()).not.toMatch(/25 мин|минут/);
  await expect(hero.getByRole("link", { name: /Продолжить/ })).toHaveAttribute("href", "/week/1/day/1#task-3");
  await page.locator("[data-path] summary").click();
  await expect(page.locator('a[href="/week/1/day/2"]')).toBeVisible();
});

test("малыш после третьей задачи видит спокойную остановку; «Ещё» идёт дальше, «Передохнуть» — на главную", async ({
  page,
}) => {
  // Остановка — после настоящей работы: две из трёх последних задач решены.
  const solved = { status: "solved", hints: 0, checks: 1, missed: 0, timeMs: 1, marks: {}, solvedAt: 1 };
  await prepare(page, { tasks: { w1d1t1: solved, w1d1t2: solved } });
  await page.goto("/week/1/day/1#task-3");
  await page.getByRole("button", { name: "Дальше →" }).click();
  const rest = page.locator("[data-rest-stop]");
  await expect(rest).toBeVisible();
  await expect(page).toHaveURL(/#rest-3$/);
  expect(await rest.innerText()).not.toMatch(/\d/);
  const [a, b] = await Promise.all([
    rest.getByRole("button", { name: "Передохнуть" }).boundingBox(),
    rest.getByRole("button", { name: "Ещё" }).boundingBox(),
  ]);
  expect(Math.abs(a!.height - b!.height)).toBeLessThan(1);
  expect(Math.abs(a!.width - b!.width)).toBeLessThan(1);
  await rest.getByRole("button", { name: "Ещё" }).click();
  await expect(page).toHaveURL(/#task-4$/);
  await page.getByRole("button", { name: "Дальше →" }).click();
  await expect(page).toHaveURL(/#task-5$/);
  await page.goto("/week/1/day/1#task-3");
  await page.getByRole("button", { name: "Дальше →" }).click();
  await page.locator("[data-rest-stop]").getByRole("button", { name: "Передохнуть" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("старшим остановки нет: после третьей задачи сразу четвёртая", async ({ page }) => {
  await prepare(page, {}, { age: 10 });
  await page.goto("/week/1/day/1#task-3");
  await page.getByRole("button", { name: "Дальше →" }).click();
  await expect(page).toHaveURL(/#task-4$/);
  await expect(page.locator("[data-rest-stop]")).toHaveCount(0);
});
