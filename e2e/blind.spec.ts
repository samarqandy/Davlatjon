import { expect, test, type Page } from "@playwright/test";

/** Игра вслепую с роботом: фигур не видно, ход — по пустой доске или записью; «Показать» открывает позицию. */
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
          settings: { hintPause: false, bigText: false, age: 10, lang: l, sound: false, animations: false },
        }),
      );
    },
    [lang, KEY] as const,
  );
}

const pieces = (page: Page) => page.locator('[data-board="play"] [data-piece]');
const square = (page: Page, sq: string) => page.locator(`[data-board="play"] [data-square="${sq}"]`).click();
const press = async (page: Page, keys: string[]) => {
  for (const k of keys) await page.locator(`[data-key="${k}"]`).click();
};

test("вслепую: режим включается в настройках партии и попадает в адрес", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/play");
  const settings = page.locator("[data-robot-settings]");
  await settings.locator("summary").click();
  await settings.locator("[data-blind]").click();
  await expect(settings.locator("summary")).toContainText("вслепую");
  await page.getByRole("button", { name: "Белыми" }).first().click();
  await expect(page).toHaveURL(/#robot-\d-w\?b=1$/);
  await expect(page.getByRole("heading", { level: 1, name: /Вслепую: робот/ })).toBeVisible();
  await expect(page.locator('[data-board="play"]')).toBeVisible();
  await expect(pieces(page)).toHaveCount(0);
});

test("вслепую: ход по пустой доске, ход робота написан словами над доской", async ({ page, isMobile }) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w?b=1");
  await expect(pieces(page)).toHaveCount(0);
  await square(page, "e2");
  await square(page, "e4");
  const status = page.locator("[data-play-status]");
  await expect(status.locator("[data-robot-move]")).toContainText(/Робот сыграл .+\./, { timeout: 10_000 });
  // Фигуры так и не появились, а ход записан.
  await expect(pieces(page)).toHaveCount(0);
  await expect(page.getByRole("list", { name: "Список ходов" }).getByText("e4", { exact: true })).toBeVisible();
  // На телефоне строка с ходом робота — выше доски: видна без прокрутки (на широком экране она справа от доски).
  if (!isMobile) return;
  const [s, b] = await Promise.all([status.boundingBox(), page.locator('[data-board="play"]').boundingBox()]);
  expect(s!.y + s!.height).toBeLessThanOrEqual(b!.y);
});

test("вслепую: запись хода кнопками — доски нет, неверная запись объясняется", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w?b=1");
  await page.locator('[data-entry="text"]').click();
  await expect(page.locator('[data-board="play"]')).toHaveCount(0);
  await expect(page.locator("[data-move-keypad]")).toBeVisible();
  await press(page, ["К", "f", "3"]);
  await expect(page.locator("[data-move-input]")).toHaveValue("Кf3");
  await page.locator("[data-move-submit]").click();
  await expect(page.locator("[data-robot-move]")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("list", { name: "Список ходов" }).getByText("Кf3", { exact: true })).toBeVisible();
  await expect(page.locator("[data-move-input]")).toHaveValue("");
  // Конь на a8 не попадёт: ход остаётся в поле, под ним — объяснение.
  await press(page, ["К", "a", "8"]);
  await page.locator("[data-move-submit]").click();
  await expect(page.locator("[data-typed-error]")).toContainText("Такого хода сейчас нет");
  await expect(page.locator("[data-move-input]")).toHaveValue("Кa8");
  await page.locator('[data-key="back"]').click();
  await expect(page.locator("[data-move-input]")).toHaveValue("Кa");
  await expect(page.locator("[data-typed-error]")).toHaveCount(0);
  // Ход можно и напечатать с настоящей клавиатуры — латиницей и без переключения раскладки.
  await page.locator("[data-move-input]").fill("e2e4");
  await page.locator("[data-move-input]").press("Enter");
  await expect(page.getByRole("list", { name: "Список ходов" }).getByText("e4", { exact: true })).toBeVisible();
});

test("вслепую: «Показать» открывает позицию на несколько секунд и считается; партия записана как слепая", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w?b=1");
  await square(page, "e2");
  await square(page, "e4");
  await expect(page.locator("[data-robot-move]")).toBeVisible({ timeout: 10_000 });
  const show = page.getByRole("button", { name: /Показать позицию/ });
  await show.click();
  await expect(pieces(page)).not.toHaveCount(0);
  await expect(show).toBeDisabled();
  await expect(page.locator("[data-blind-note]")).toHaveAttribute("data-blind-note", "1");
  await expect(pieces(page)).toHaveCount(0, { timeout: 8_000 });
  // Сдаёмся: позиция открывается, в записи партии — «вслепую» и число открытий.
  await page.getByRole("button", { name: "Закончить партию" }).click();
  await page.locator("[data-confirm-end]").getByRole("button", { name: "Закончить", exact: true }).click();
  await expect(pieces(page)).not.toHaveCount(0);
  await expect(page.locator("[data-blind-note]")).toContainText("Позицию открывали: 1");
  await expect
    .poll(() =>
      page.evaluate((key) => {
        const g = JSON.parse(localStorage.getItem(key) ?? "{}").chessGames?.[0];
        return g ? `${g.blind}-${g.peeks}-${g.result}` : "";
      }, KEY),
    )
    .toBe("true-1-loss");
});

test("вслепую на телефоне 360×740: статус, доска или клавиатура и панель — на одном экране; кнопки не меньше 44 px", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "экран телефона");
  await page.setViewportSize({ width: 360, height: 740 });
  for (const lang of ["ru", "uz"] as const) {
    await prepare(page, lang);
    await page.goto("/privacy");
    await page.goto(`${lang === "uz" ? "/uz" : ""}/chess/play#robot-1-w?b=1`);
    await page.waitForLoadState("networkidle");
    const bottom = async (sel: string) => {
      const r = await page.locator(sel).boundingBox();
      return r!.y + r!.height;
    };
    const bar = "[data-board-bar]";
    await expect(page.locator('[data-board="play"]')).toBeVisible();
    expect(await bottom(bar), `${lang}: доска`).toBeLessThanOrEqual(740);
    await page.locator('[data-entry="text"]').click();
    await expect(page.locator("[data-move-keypad]")).toBeVisible();
    expect(await bottom(bar), `${lang}: запись`).toBeLessThanOrEqual(740);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("[data-move-keypad] button, [data-move-keypad] input, [data-entry]")]
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width < 43.5 || r.height < 43.5)
        .map((r) => `${Math.round(r.width)}×${Math.round(r.height)}`),
    );
    expect(small, lang).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  }
});

test("koʻr-koʻrona oʻyin oʻzbekcha: yozuv tugmalari — shakllar bilan, kirill harfisiz", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/uz/chess/play#robot-1-w?b=1");
  await expect(page.getByRole("heading", { level: 1, name: /Koʻr-koʻrona: robot/ })).toBeVisible();
  await page.locator('[data-entry="text"]').click();
  await press(page, ["♘", "f", "3"]);
  await page.locator("[data-move-submit]").click();
  await expect(page.locator("[data-robot-move]")).toContainText(/Robot .+ yurdi\./, { timeout: 10_000 });
  await press(page, ["♘", "a", "8"]);
  await page.locator("[data-move-submit]").click();
  await expect(page.locator("[data-typed-error]")).toContainText("Hozir bunday yurish yoʻq");
  const text = await page.locator("#main").innerText();
  expect(text).not.toMatch(/[А-Яа-яЁё]/);
});
