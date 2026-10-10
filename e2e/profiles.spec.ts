import { expect, test, type Page } from "@playwright/test";

/** Несколько детей на одном устройстве: родитель заводит профиль, ребёнок выбирает себя в шапке. */
async function prepare(page: Page) {
  await page.addInitScript(() => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key))
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 9, childName: "Aziz", sound: false },
        }),
      );
  });
}

async function openSettings(page: Page) {
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
  await expect(page.locator("[data-profiles-card]")).toBeVisible();
}

test("два ребёнка: добавить профиль, переключиться в шапке, у каждого свой прогресс, удалить", async ({
  page,
}, info) => {
  test.skip(info.project.name === "phone", "сценарий на настольном экране");
  await prepare(page);
  await openSettings(page);

  // Пока ребёнок один, кнопки выбора в шапке нет.
  await expect(page.locator("[data-profile-switcher]")).toHaveCount(0);

  await page.locator("[data-add-profile]").click();
  await page.locator("[data-new-profile-name]").fill("Malika");
  await page.locator("select").last().selectOption("7");
  await page.getByRole("button", { name: "Добавить и открыть" }).click();

  // Страница перезагрузилась уже в профиле Malika.
  await expect(page.locator("[data-profile-switcher]")).toBeVisible();
  await expect(page.locator("[data-profile-row]")).toHaveCount(2);
  await expect(page.getByText("сейчас открыт")).toBeVisible();
  const keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("davlatjon-lab:v1")));
  expect(keys).toHaveLength(2);
  await page.goto("/");
  await expect(page.getByText("Привет, Malika! 👋")).toBeVisible();

  // Aziz остался со своим прогрессом: переключаемся обратно в шапке.
  await page.locator("[data-profile-switcher] button").first().click();
  await page.locator('[data-profile-pick="main"]').click();
  await expect(page.getByText("Привет, Aziz! 👋")).toBeVisible();

  // Удаляем Malika (родитель, в настройках).
  await page.goto("/parent/settings");
  const rows = page.locator("[data-profile-row]");
  await expect(rows).toHaveCount(2);
  await rows
    .nth(1)
    .getByRole("button", { name: /Удалить/ })
    .click();
  await rows
    .nth(1)
    .getByRole("button", { name: /Да, удалить/ })
    .click();
  await expect(rows).toHaveCount(1);
  await expect(page.locator("[data-profile-switcher]")).toHaveCount(0);
});
