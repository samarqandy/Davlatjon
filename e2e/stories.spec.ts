import { expect, test, type Page } from "@playwright/test";

/** «Тайны и легенды», вторая книга: новые истории, мысли великих, разговоры и новый взгляд. */

const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, lang: "ru" | "uz" = "ru") {
  await page.addInitScript(
    ([l, key]) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify({ version: 1, welcomed: true, settings: { age: 10, lang: l } }));
    },
    [lang, KEY] as const,
  );
}

test("новая история открывается по ссылке и читается", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/secrets#abdusattorov");
  const card = page.locator("article#abdusattorov");
  await expect(card.getByText(/Последнее место — станция, а не конец дороги/)).toBeVisible();
  await page.goto("/chess/secrets#samarkand");
  await expect(page.locator("article#samarkand").getByText(/Самарканд принимал 46-ю/)).toBeVisible();
});

test("мысли великих: у каждой цитаты видно, откуда она; неподтверждённая названа прямо", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/secrets#thoughts");
  const card = page.locator('[data-thought="franklin-caution"]');
  await expect(card.getByText(/не делать наши ходы слишком поспешно/)).toBeVisible();
  await expect(card.getByText("«Мораль шахмат», 1786")).toBeVisible();
  await expect(card.getByText("📖 Из книги автора")).toBeVisible();
  await expect(card.getByText(/Попробуй:/)).toBeVisible();
  const doubtful = page.locator('[data-thought="lasker-brilliancy"]');
  await expect(doubtful.getByText(/Приписывают, источника не нашли/)).toBeVisible();
  expect(await page.locator("[data-thoughts] > li").count()).toBeGreaterThanOrEqual(16);
});

test("разговор раскрывается пузырями, в конце — вывод и пометка «придуманный»", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/secrets#dialogues");
  const d = page.locator('[data-dialogue="lose"]');
  await d.locator("summary").click();
  await expect(d.getByText("Я проиграла в первом туре. Мне стыдно.")).toBeVisible();
  await expect(d.getByText(/Поражение — не приговор, а информация/)).toBeVisible();
  await expect(d.getByText(/Придуманный разговор/)).toBeVisible();
});

test("«Новый взгляд»: про «шахматы делают умнее» — честно, и для взрослых есть пояснение", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/secrets#views");
  const v = page.locator('[data-view="smarter"]');
  await expect(v.getByText(/Честный ответ: доказательств пока нет/)).toBeVisible();
  await v.locator("summary").click();
  await expect(v.getByText(/не стоит ждать от них быстрых оценок/)).toBeVisible();
});

test("по-узбекски: новые разделы без единой русской буквы", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/chess/secrets#thoughts");
  await expect(page.locator("html")).toHaveAttribute("data-lang", "uz");
  const cyr = /[Ѐ-ӿ]/;
  for (const id of ["thoughts", "dialogues", "views"]) {
    expect(await page.locator(`#${id}`).innerText(), id).not.toMatch(cyr);
  }
  await page.locator('[data-dialogue="fear"] summary').click();
  expect(await page.locator('[data-dialogue="fear"]').innerText()).not.toMatch(cyr);
  await page.goto("/chess/secrets#franklin");
  await expect(
    page
      .locator("article#franklin")
      .getByText(/Franklinning uchta ulkan kuchi|ulkan kuch/)
      .first(),
  ).toBeVisible();
});
