import { expect, test, type Page } from "@playwright/test";

/** Страницы для родителей: «о платформе», конфиденциальность, удаление данных аккаунта. */
async function prepare(page: Page, lang = "ru") {
  await page.addInitScript(
    ([l]) => {
      const key = "davlatjon-lab:v1";
      if (!localStorage.getItem(key))
        localStorage.setItem(
          key,
          JSON.stringify({
            version: 1,
            welcomed: true,
            settings: { hintPause: false, bigText: false, age: 9, childName: "Aziz", sound: false, lang: l },
          }),
        );
    },
    [lang] as const,
  );
}

test("«О платформе»: цифры, ссылка на конфиденциальность и вход в занятия; индексируется", async ({ page }) => {
  await prepare(page);
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("[data-about-stats]")).toContainText(/\d/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index/);
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex/);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await page.locator("[data-about-start]").click();
  await expect(page).toHaveURL(/\/$/);
});

test("страница конфиденциальности открывается из подвала и по-узбекски", async ({ page }) => {
  await prepare(page);
  await page.goto("/");
  await page.locator("[data-privacy-link]").click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("robots и sitemap: закрыто всё, кроме страниц для родителей", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Allow: \/about/);
  expect(robots).toMatch(/Disallow: \//);
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
  const map = await (await request.get("/sitemap.xml")).text();
  expect(map).toContain("/about");
  expect(map).toContain("/privacy");
  expect((await request.get("/og.png")).ok()).toBe(true);
});

test("удаление данных аккаунта: два нажатия и сообщение об успехе", async ({ page }, info) => {
  test.skip(info.project.name === "phone", "сценарий на настольном экране");
  await prepare(page);
  await page.route("**/api/auth/me", (route) =>
    route.fulfill({
      json: {
        user: { name: "Test", provider: "google" },
        providers: { google: true, telegram: false },
        reports: false,
      },
    }),
  );
  let deleted = 0;
  await page.route("**/api/account", (route) => {
    if (route.request().method() === "DELETE") deleted += 1;
    return route.fulfill({ json: { ok: true } });
  });
  await page.goto("/parent");
  const pins = page.locator('input[type="password"]');
  if (await pins.first().isVisible()) {
    if ((await pins.count()) > 1) {
      await pins.nth(0).fill("2468");
      await pins.nth(1).fill("2468");
      await page.getByRole("button", { name: "Сохранить" }).click();
    } else {
      await pins.first().fill("2468");
      await page.getByRole("button", { name: /Открыть|Войти/ }).click();
    }
  }
  await page.goto("/parent/settings");
  const box = page.locator("[data-delete-account]");
  await expect(box).toBeVisible();
  await box.getByRole("button", { name: /Удалить данные аккаунта/ }).click();
  expect(deleted).toBe(0);
  await box.getByRole("button", { name: "Да, удалить данные аккаунта" }).click();
  await expect(page.getByText(/Данные аккаунта удалены/)).toBeVisible();
  expect(deleted).toBe(1);
});
