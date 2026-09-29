import { expect, test, type Page } from "@playwright/test";

/** Прогресс в браузере до загрузки страницы (пишется, только если его ещё нет). */
async function seed(page: Page, settings: Record<string, unknown>) {
  await page.addInitScript((s) => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key))
      localStorage.setItem(
        key,
        JSON.stringify({ version: 1, welcomed: true, settings: { hintPause: false, bigText: false, age: 9, ...s } }),
      );
  }, settings);
}

test("имя ребёнка — в приветствии, в задачах и в тексте для родителей", async ({ page }) => {
  await seed(page, { childName: "Анна" });
  await page.goto("/");
  await expect(page.getByText("Привет, Анна! 👋")).toBeVisible();
  await page.goto("/week/1/day/1/print");
  await expect(page.locator("body")).toContainText("Анна копит монеты — их уже 23.");
  await expect(page.locator("body")).not.toContainText("Давлатжон");
});

test("по-узбекски имя берёт правильные окончания", async ({ page }) => {
  await seed(page, { childName: "Otabek", lang: "uz" });
  await page.goto("/week/1/day/6/print");
  await expect(page.locator("html")).toHaveAttribute("data-lang", "uz");
  await expect(page.locator("body")).toContainText("Otabekka 9 ta daftar kerak.");
  await page.goto("/week/1/day/1/print");
  await expect(page.locator("body")).toContainText("Otabekda 23 ta tanga bor.");
});

test("кириллическое имя в узбекском интерфейсе — латиницей", async ({ page }) => {
  await seed(page, { childName: "Шерзод", lang: "uz" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-lang", "uz");
  await expect(page.getByText("Salom, Sherzod! 👋")).toBeVisible();
});

test("кто занимался до того, как появилось имя, — знакомимся карточкой, без блокировки страницы", async ({ page }) => {
  await seed(page, {});
  await page.goto("/");
  const banner = page.locator("[data-name-banner]");
  await expect(banner).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await banner.getByRole("textbox").fill("Aziz");
  await banner.getByRole("button", { name: "Сохранить" }).click();
  await expect(banner).toHaveCount(0);
  await expect(page.getByText("Привет, Aziz! 👋")).toBeVisible();
});

test("родитель меняет имя в настройках", async ({ page }) => {
  await seed(page, { childName: "Aziz" });
  await page.goto("/parent/settings");
  const pins = page.locator('input[type="password"]');
  await pins.nth(0).fill("2468");
  await pins.nth(1).fill("2468");
  await page.getByRole("button", { name: "Сохранить" }).click();
  const field = page.getByLabel(/Имя ребёнка/);
  await expect(field).toHaveValue("Aziz");
  await field.fill("Bek");
  await field.press("Enter");
  await page.getByRole("link", { name: /Davlatjon — на главную/ }).click();
  await expect(page.getByText("Привет, Bek! 👋")).toBeVisible();
});
