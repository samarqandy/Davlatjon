import { expect, test, type Page } from "@playwright/test";

/** Тренажёры расчёта на странице /chess/drills: «Не зевни!», «Ходы в уме», «Сосчитай удары». */
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

const start = (page: Page) => page.getByRole("button", { name: "Начать", exact: true }).click();

test("тренажёры: шесть карточек, три новые — про расчёт", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/drills");
  await expect(page.locator("[data-drill-card]")).toHaveCount(6);
  for (const [id, title] of [
    ["blunder", "Не зевни!"],
    ["blind", "Ходы в уме"],
    ["count", "Сосчитай удары"],
  ])
    await expect(page.locator(`[data-drill-card="${id}"]`)).toContainText(title);
  await page.locator('[data-drill-card="blunder"]').click();
  await expect(page).toHaveURL(/#blunder$/);
  await expect(page.getByRole("heading", { level: 1, name: /Не зевни!/ })).toBeVisible();
});

test("«Не зевни!»: три хода со стрелками, после ответа — зевок и мат на доске, потом следующий раунд", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/chess/drills#blunder");
  await start(page);
  await expect(page.locator('[data-board="blunder"]')).toBeVisible();
  await expect(page.locator("[data-calc-option]")).toHaveCount(3);
  await expect(page.getByText("После какого хода соперник сразу ставит мат?")).toBeVisible();
  await expect(page.getByText("Раунд 1 из 6")).toBeVisible();
  await page.locator('[data-calc-option="0"]').click();
  const verdict = page.locator("[data-calc]");
  await expect(verdict).toBeVisible();
  // И при верном, и при неверном ответе называется зевок и мат, которым он наказывается.
  await expect(verdict).toContainText(/соперник (ставит мат|отвечает)/);
  await expect(verdict).toContainText("#");
  for (const option of await page.locator("[data-calc-option]").all()) await expect(option).toBeDisabled();
  await page.getByRole("button", { name: "Дальше →" }).click();
  await expect(page.getByText("Раунд 2 из 6")).toBeVisible();
  await expect(verdict).toHaveCount(0);
});

test("«Ходы в уме»: два хода записаны текстом, в ответах нет значков шаха и мата", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/drills#blind");
  await start(page);
  await expect(page.locator('[data-board="blind"]')).toBeVisible();
  // «1. Лd8+ Лe8» — или «1… Лf1+ 2. Лxf1», если начинают чёрные.
  await expect(page.locator("[data-calc-line]")).toHaveText(/^1(\. \S+ \S+|… \S+ 2\. \S+)$/);
  const options = page.locator("[data-calc-option]");
  await expect(options).toHaveCount(3);
  for (const text of await options.allInnerTexts()) expect(text).not.toMatch(/[+#]/);
  await options.nth(1).click();
  await expect(page.locator("[data-calc]")).toContainText(/мат/i);
  await page.getByRole("button", { name: "Дальше →" }).click();
  await expect(page.getByText("Раунд 2 из 6")).toBeVisible();
});

test("«Сосчитай удары»: два вопроса по очереди, шесть раундов — итог и рекорд на карточке", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/drills#count");
  await start(page);
  await expect(page.locator('[data-board="count"]')).toBeVisible();
  for (let round = 1; round <= 6; round++) {
    await expect(page.getByText(`Раунд ${round} из 6`)).toBeVisible();
    await expect(page.locator('[data-calc-question="attack"]')).toContainText(/Сколько (чёрных|белых) нападает на/);
    await page.locator('[data-calc-number="1"]').click();
    await expect(page.locator('[data-calc-question="defend"]')).toContainText(/А сколько (чёрных|белых) защищает/);
    await page.locator('[data-calc-number="1"]').click();
    await expect(page.locator("[data-calc]")).toContainText(/Нападают: \d, защищают: \d/);
    await page.getByRole("button", { name: "Дальше →" }).click();
  }
  const done = page.locator("[data-drill-done]");
  await expect(done).toContainText(/Результат: \d из 6/);
  const score = Number(await done.getAttribute("data-drill-done"));
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chessDrills ?? {}, KEY);
  expect(stored.count ?? 0).toBe(score);
  await page.locator("[data-drill-back]").click();
  await expect(page.locator('[data-drill-card="count"]')).toContainText(score ? `Рекорд: ${score} из 6` : "Начать →");
});

test("тренажёр на телефоне: во время раунда шапки сайта нет, доска и ответы — на одном экране", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "phone", "раскладка телефона");
  await prepare(page);
  await page.goto("/chess/drills#blunder");
  await expect(page.locator("[data-site-header]")).toBeVisible();
  await start(page);
  await expect(page.locator('[data-board="blunder"]')).toBeVisible();
  await expect(page.locator("[data-site-header]")).toBeHidden();
  await expect(page.locator('[data-calc-option="2"]')).toBeInViewport({ ratio: 1 });
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true);
  // Выход — ссылкой над заголовком.
  await page.locator("[data-drill-back]").click();
  await expect(page.locator("[data-drill-card]")).toHaveCount(6);
  await expect(page.locator("[data-site-header]")).toBeVisible();
});

// Раньше «Все тренажёры» была ссылкой на эту же страницу: тренажёр, открытый по прямому адресу, с экрана не уходил.
test("тренажёр, открытый по прямому адресу: «Все тренажёры» возвращает к списку", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/drills#knight");
  await expect(page.getByRole("heading", { level: 1, name: /Путь коня/ })).toBeVisible();
  await page.locator("[data-drill-back]").click();
  await expect(page.locator("[data-drill-card]")).toHaveCount(6);
  await expect(page.getByRole("heading", { level: 1, name: "Короткие тренировки" })).toBeVisible();
});

test("hisoblash mashqlari oʻzbekcha: nomlar va savollar — kirill harfisiz", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/uz/chess/drills");
  await expect(page.locator('[data-drill-card="blunder"]')).toContainText("Qoʻldan boy berma!");
  await expect(page.locator('[data-drill-card="blind"]')).toContainText("Xayoldagi yurishlar");
  await expect(page.locator('[data-drill-card="count"]')).toContainText("Zarbalarni sana");
  await page.locator('[data-drill-card="count"]').click();
  await page.getByRole("button", { name: "Boshlash", exact: true }).click();
  await expect(page.locator('[data-calc-question="attack"]')).toContainText("hujum qilyapti?");
  await page.locator('[data-calc-number="2"]').click();
  await expect(page.locator('[data-calc-question="defend"]')).toContainText("himoya qilyapti?");
  await page.locator('[data-calc-number="2"]').click();
  await expect(page.locator("[data-calc]")).toContainText("Hujum qilyapti:");
  await expect(page.locator("main")).not.toContainText(/[а-яё]/i);
});
