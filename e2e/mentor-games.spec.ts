import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * База партий доски тренера (MENTOR-3): поиск и разделы, партия открывается на доске урока с начала,
 * в режиме класса база — во весь экран и пульт не листает спрятанную доску, без сети — понятная ошибка.
 */
const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, lang: "ru" | "uz" = "ru") {
  await page.addInitScript(
    ([key, lang]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 10, lang, sound: false, animations: false },
        }),
      );
    },
    [KEY, lang] as const,
  );
}

const root = (page: Page) => page.locator("[data-mentor]");
const panel = (page: Page) => page.locator("[data-mentor-games]");
const items = (page: Page) => page.locator("[data-mentor-games-item]");
const count = async (page: Page) =>
  Number(await page.getAttribute("[data-mentor-games-count]", "data-mentor-games-count"));

async function open(page: Page, url = "/chess/mentor") {
  await page.goto(url);
  await expect(root(page)).toHaveAttribute("data-mentor-ready", "");
}

async function openGames(page: Page) {
  await page.locator("[data-mentor-games-button]").click();
  await expect(items(page).first()).toBeVisible({ timeout: 15_000 });
}

async function axe(page: Page) {
  const result = await new AxeBuilder({ page })
    .include("[data-mentor-games]")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze();
  return result.violations.map((v) => `${v.impact} ${v.id}: ${v.nodes[0].target.join(" ")}`);
}

test("поиск по-русски, кнопка игрока, партия открывается вместо пустой доски, вторая — новой доской", async ({
  page,
}) => {
  await prepare(page);
  await open(page);
  await openGames(page);
  const all = await count(page);
  expect(all).toBeGreaterThan(800);
  expect(await axe(page)).toEqual([]);

  await page.locator("[data-mentor-games-search]").fill("Синдаров");
  await expect.poll(() => count(page)).toBeLessThan(all);
  const sindarov = await count(page);
  expect(sindarov).toBeGreaterThan(50);
  for (const text of await items(page).allTextContents()) expect(text).toContain("Sindarov");

  await page.locator('[data-mentor-games-player="Carlsen"]').click();
  await expect(page.locator('[data-mentor-games-player="Carlsen"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-mentor-games-search]")).toHaveValue("Carlsen");
  await expect.poll(() => count(page)).not.toBe(sindarov);
  await items(page).first().click();

  // Пустая доска урока уступила место партии; база закрылась; на доске — начало партии и задание.
  await expect(panel(page)).toHaveCount(0);
  await expect(root(page)).toHaveAttribute("data-mentor-boards", "1");
  await expect(root(page)).toHaveAttribute("data-mentor-ply", "0");
  expect(Number(await root(page).getAttribute("data-mentor-total"))).toBeGreaterThan(10);
  await expect(page.locator("[data-mentor-task]")).toContainText("Carlsen");
  await expect(page.locator("[data-mentor-task]")).not.toContainText(/½|1–0|0–1/);
  await page.locator("[data-mentor-next]").first().click();
  await expect(root(page)).toHaveAttribute("data-mentor-ply", "1");

  // Запрос помнится; вторая партия — новой доской после первой.
  await openGames(page);
  await expect(page.locator("[data-mentor-games-search]")).toHaveValue("Carlsen");
  await items(page).nth(1).click();
  await expect(root(page)).toHaveAttribute("data-mentor-boards", "2");
  await expect(root(page)).toHaveAttribute("data-mentor-board", "1");
});

test("разделы и фильтры: Узбекистан, классика по годам, результат", async ({ page }) => {
  await prepare(page);
  await open(page);
  await openGames(page);
  await page.locator('[data-mentor-games-section="uz"]').click();
  await expect(page.locator('[data-mentor-games-section="uz"]')).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => count(page)).toBeGreaterThan(300);

  await page.locator('[data-mentor-games-section="all"]').click();
  await page.locator("[data-mentor-games-filters] summary").click();
  await page.locator("[data-mentor-games-from]").fill("1850");
  await page.locator("[data-mentor-games-to]").fill("1860");
  await expect.poll(() => count(page)).toBeGreaterThan(2);
  await expect.poll(() => count(page)).toBeLessThan(20);
  for (const text of await items(page).allTextContents()) expect(text).toMatch(/185\d/);

  await page.locator("[data-mentor-games-result]").selectOption("1-0");
  for (const text of await items(page).allTextContents()) expect(text).toContain("1–0");
  await page.locator("[data-mentor-games-reset]").click();
  await expect.poll(() => count(page)).toBeGreaterThan(800);
});

test("oʻzbek tilida: qidiruv «Qosimjonov», panelda rus harflari yoʻq", async ({ page }) => {
  await prepare(page, "uz");
  await open(page, "/uz/chess/mentor");
  await openGames(page);
  await page.locator("[data-mentor-games-search]").fill("Qosimjonov");
  await expect.poll(() => count(page)).toBeGreaterThan(5);
  for (const text of await items(page).allTextContents()) expect(text).toContain("Kasimdzhanov");
  await page.locator("[data-mentor-games-sources] summary").click();
  const text = await panel(page).innerText();
  expect(text.match(/[А-Яа-яЁё]/g) ?? []).toEqual([]);
});

test.describe("без сети", () => {
  // Сервис-воркер сайта сам ходит за файлами базы (и без сети отвечает из своего кэша) — здесь он не нужен.
  test.use({ serviceWorkers: "block" });

  test("без сети: понятная ошибка и «Ещё раз»", async ({ page }) => {
    await prepare(page);
    await page.route("**/data/games/*.json", (route) => route.abort());
    await open(page);
    await page.locator("[data-mentor-games-button]").click();
    const alert = panel(page).getByRole("alert");
    await expect(alert).toBeVisible();
    await page.unroute("**/data/games/*.json");
    await alert.getByRole("button").click();
    await expect(items(page).first()).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("режим класса", () => {
  test.skip(({ isMobile }) => isMobile, "размеры панели проверяем в настольном браузере");

  for (const [w, h] of [
    [960, 540],
    [1920, 1080],
    [1024, 768],
  ] as const) {
    test(`${w}×${h}: база во весь экран, пульт не листает спрятанную доску, Escape закрывает`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await prepare(page);
      await open(page, "/chess/mentor#present");
      await openGames(page);
      const sheet = page.locator('[data-mentor-part="sheet"][data-mentor-sheet="games"]');
      const box = (await sheet.boundingBox())!;
      expect(box.width).toBeGreaterThan(w * 0.85);
      expect(box.height).toBeGreaterThan(h * 0.85);
      expect(box.x + box.width).toBeLessThanOrEqual(w + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(h + 1);
      // Поиск и первая партия — на первом экране.
      for (const loc of [page.locator("[data-mentor-games-search]"), items(page).first()]) {
        const b = (await loc.boundingBox())!;
        expect(b.y + b.height).toBeLessThanOrEqual(h);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect(await axe(page)).toEqual([]);

      await items(page).first().click();
      await expect(sheet).toHaveCount(0);
      await expect(page.locator("[data-mentor-next]")).toBeFocused();
      await expect(root(page)).toHaveAttribute("data-mentor-mode", "move");
      await page.keyboard.press("PageDown");
      await expect(root(page)).toHaveAttribute("data-mentor-ply", "1");

      // Пока база открыта, пульт молчит; Escape закрывает базу.
      await openGames(page);
      await page.keyboard.press("PageDown");
      await page.keyboard.press("ArrowRight");
      await expect(root(page)).toHaveAttribute("data-mentor-ply", "1");
      await page.keyboard.press("Escape");
      await expect(sheet).toHaveCount(0);
      await page.keyboard.press("PageDown");
      await expect(root(page)).toHaveAttribute("data-mentor-ply", "2");
    });
  }
});
