import { expect, test, type Page } from "@playwright/test";

const KEY = "davlatjon-lab:v1";

const row = (rank: number, username: string, value: number, mine = false) => ({
  rank,
  username,
  avatar: "🦊",
  value,
  level: 3,
  best: "chess",
  mine,
});

async function seed(page: Page, settings: Record<string, unknown> = {}) {
  await page.addInitScript(
    ([s, key]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({ version: 1, welcomed: true, settings: { hintPause: false, age: 7, lang: "ru", ...s } }),
      );
    },
    [settings, KEY] as const,
  );
}

async function signIn(page: Page, user: boolean) {
  await page.route("**/api/auth/me", (route) =>
    route.fulfill({
      json: {
        user: user ? { name: "Parent", provider: "google" } : null,
        providers: { google: true, telegram: false },
        reports: false,
      },
    }),
  );
}

test("без входа рейтинг просит взрослого войти", async ({ page }) => {
  await seed(page);
  await signIn(page, false);
  await page.goto("/leaderboard");
  await expect(page.locator("[data-leaderboard-login]")).toBeVisible();
  await expect(page.locator("[data-leaderboard-table]")).toHaveCount(0);
});

test("таблица: недельный список, фильтры уходят в запрос, свои места и «кто в чём силён»", async ({ page }) => {
  await seed(page, { leaderboard: true });
  await signIn(page, true);
  const queries: string[] = [];
  await page.route("**/api/play/leaderboard**", (route) => {
    const url = new URL(route.request().url());
    queries.push(url.search);
    const cat = url.searchParams.get("cat");
    const limit = Number(url.searchParams.get("limit"));
    const rows = [row(1, "bek_king", 120), row(2, "anna_chess", 90, true), row(3, "zoya", 40)].slice(0, limit);
    return route.fulfill({
      json: { week: "2026-10-12", query: {}, rows: cat === "quick" ? [] : rows, mine: [], count: rows.length },
    });
  });
  await page.goto("/leaderboard");
  const table = page.locator("[data-leaderboard-table]");
  await expect(table.locator("[data-leader-row]")).toHaveCount(3);
  await expect(table.locator("[data-leader-row]").first()).toContainText("bek_king");
  await expect(table.locator("[data-mine]")).toContainText("anna_chess");
  await expect(page.locator("[data-leaderboard-optin]")).toHaveCount(0);
  await expect(page.locator("[data-star='chess']")).toContainText("bek_king");
  await expect(page.locator("[data-star='quick']")).toContainText("—");

  await page.locator("[data-scope='all']").click();
  await page.locator("[data-cat='chess']").click();
  await page.locator("[data-age='10+']").click();
  await expect.poll(() => queries.some((q) => q.includes("scope=all") && q.includes("cat=chess") && q.includes("age=10%2B"))).toBe(true);
});

test("пока участие не включено, ребёнок видит подсказку для взрослых; пустая таблица объясняет", async ({ page }) => {
  await seed(page);
  await signIn(page, true);
  await page.route("**/api/play/leaderboard**", (route) =>
    route.fulfill({ json: { week: "w", query: {}, rows: [], mine: [], count: 0 } }),
  );
  await page.goto("/leaderboard");
  await expect(page.locator("[data-leaderboard-optin]")).toBeVisible();
  await expect(page.locator("[data-leaderboard-empty]")).toBeVisible();
});

test("у родителя есть выключатель участия в рейтинге; он сохраняется", async ({ page }) => {
  await seed(page, {});
  await signIn(page, true);
  await page.route("**/api/play/me", (route) =>
    route.fulfill({
      json: { profile: { username: "anna_chess", onlineOk: true, chatOk: true, findable: true } },
    }),
  );
  await page.goto("/parent");
  const pins = page.locator('input[type="password"]');
  await pins.nth(0).fill("2468");
  await pins.nth(1).fill("2468");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByRole("button", { name: /Закрыть раздел/ })).toBeVisible();
  await page.goto("/parent/settings");
  const sw = page.locator("[data-leaderboard-switch]");
  await sw.scrollIntoViewIfNeeded();
  await sw.click();
  const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "{}").settings.leaderboard, KEY);
  expect(stored).toBe(true);
});
