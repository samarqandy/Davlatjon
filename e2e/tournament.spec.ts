import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

/** Турниры: жеребьёвка трёх систем, ввод результатов, таблица, хранение в браузере, файл. */

const KEY = "davlatjon-lab:v1";
const STORE = "davlatjon-lab:tournaments:v1";

async function prepare(page: Page, lang: "ru" | "uz" = "ru") {
  await page.addInitScript(
    ([key, l]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({ version: 1, welcomed: true, settings: { age: 11, lang: l, childName: "Али" } }),
      );
    },
    [KEY, lang] as const,
  );
}

/** Новый турнир: система, участники, стартовые номера — и жеребьёвка. */
async function create(
  page: Page,
  opts: { format: string; players: string[]; seeding?: string; name?: string; thirdPlace?: boolean },
) {
  await page.goto("/chess/tournaments");
  await page.locator("[data-new-tournament]").click();
  await expect(page.locator("[data-tournament-create]")).toBeVisible();
  if (opts.name) await page.locator("[data-tournament-name]").fill(opts.name);
  await page.locator(`input[name="format"][value="${opts.format}"]`).check();
  await page.locator("[data-tournament-players]").fill(opts.players.join("\n"));
  await page.locator(`input[name="seeding"][value="${opts.seeding ?? "list"}"]`).check();
  if (opts.thirdPlace === false) await page.getByLabel("Матч за третье место").uncheck();
  await page.locator("[data-tournament-start]").click();
  await expect(page.locator("[data-tournament]")).toBeVisible();
}

/** Пары тура на экране: [белые, чёрные | null]. */
const pairs = (page: Page) =>
  page
    .locator("[data-board]")
    .evaluateAll((rows) =>
      rows.map((row) => [
        row.querySelector("[data-white]")?.textContent ?? "",
        row.querySelector("[data-black]")?.textContent ?? null,
      ]),
    );

const result = (page: Page, board: number, value: string) =>
  page.locator(`[data-board="${board}"] [data-result="${value}"]`).click();

test("круговая: пары по таблице Бергера, результаты, таблица с местами; турнир переживает перезагрузку", async ({
  page,
}) => {
  await prepare(page);
  await create(page, { format: "roundRobin", players: ["Али", "Вали", "Гани", "Дони"], name: "Турнир 3 «Б»" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Турнир 3 «Б»");
  await expect(page.locator("[data-tournament-status]")).toContainText("тур 1 из 3");
  // Таблица Бергера для четырёх: 1–4, 2–3; затем 4–3, 1–2; затем 2–4, 3–1.
  expect(await pairs(page)).toEqual([
    ["Али", "Дони"],
    ["Вали", "Гани"],
  ]);
  await result(page, 1, "1-0");
  await result(page, 2, "1/2");
  await page.locator('[data-round-pick="2"]').click();
  expect(await pairs(page)).toEqual([
    ["Дони", "Гани"],
    ["Али", "Вали"],
  ]);
  await result(page, 1, "0-1");
  await result(page, 2, "1-0");
  await page.locator('[data-round-pick="3"]').click();
  expect(await pairs(page)).toEqual([
    ["Вали", "Дони"],
    ["Гани", "Али"],
  ]);
  await result(page, 1, "1-0");
  // Нажали не то — второе нажатие стирает результат.
  await result(page, 2, "1-0");
  await expect(page.locator('[data-board="2"]')).toHaveAttribute("data-game-result", "1-0");
  await result(page, 2, "1-0");
  await expect(page.locator('[data-board="2"]')).toHaveAttribute("data-game-result", "");
  await result(page, 2, "0-1");
  await expect(page.locator("[data-tournament-status]")).toHaveAttribute("data-tournament-status", "finished");

  await page.locator('[data-tab="table"]').click();
  const rows = page.locator("[data-standings] tbody tr");
  await expect(rows).toHaveCount(4);
  // Али: 3 победы. Вали: ½ + 0 + 1. Гани: ½ + 1 + 0. Дони: 0.
  await expect(rows.nth(0)).toContainText("Али");
  await expect(rows.nth(0).locator("[data-points]")).toHaveAttribute("data-points", "3");
  await expect(rows.nth(3)).toContainText("Дони");
  expect(await rows.evaluateAll((list) => list.map((r) => r.getAttribute("data-rank")))).toEqual(["1", "2", "2", "4"]);
  await expect(page.locator("[data-crosstable]")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Турнир 3 «Б»");
  await page.locator('[data-tab="table"]').click();
  await expect(page.locator("[data-standings] tbody tr").first()).toContainText("Али");
  // В общем списке турнир тоже есть.
  await page.getByRole("button", { name: "Все турниры" }).click();
  await expect(page.locator("[data-tournament-list]")).toContainText("Турнир 3 «Б»");
  await expect(page.locator("[data-tournament-list]")).toContainText("завершён");
});

test("швейцарская: свободный от игры, следующий тур — только после результатов, повторных встреч нет", async ({
  page,
}) => {
  await prepare(page);
  await create(page, {
    format: "swiss",
    seeding: "rating",
    players: ["Али 1500", "Вали 1400", "Гани 1300", "Дони 1200", "Эльдор 1100"],
  });
  await expect(page.locator("[data-tournament-status]")).toContainText("тур 1 из 3");
  // Пять участников: двое первых играют с третьим и четвёртым, последний свободен и получает очко.
  const first = await pairs(page);
  expect(first.map((p) => [...p].sort())).toEqual([
    ["Али", "Гани"].sort(),
    ["Вали", "Дони"].sort(),
    ["Эльдор", null].sort(),
  ]);
  await expect(page.locator("[data-bye]")).toContainText("1 очко");
  await expect(page.locator("[data-next-round]")).toHaveCount(0);
  await result(page, 1, first[0][0] === "Али" ? "1-0" : "0-1");
  await expect(page.locator("[data-next-round]")).toHaveCount(0);
  await result(page, 2, first[1][0] === "Вали" ? "1-0" : "0-1");
  await page.locator("[data-next-round]").click();
  await expect(page.locator("[data-round]")).toHaveAttribute("data-round", "2");
  const second = await pairs(page);
  const key = (p: (string | null)[]) => [...p].sort().join("|");
  for (const p of second) expect(first.map(key)).not.toContain(key(p));
  // Свободным второй раз Эльдор не бывает.
  expect(second.find((p) => p[1] === null)?.[0]).not.toBe("Эльдор");
  // Жеребьёвку можно отменить, пока нет результатов; после — нельзя.
  await expect(page.locator("[data-undo-round]")).toBeVisible();
  await result(page, 1, "1/2");
  await expect(page.locator("[data-undo-round]")).toHaveCount(0);
  // Прежний тур после жеребьёвки следующего не редактируется.
  await page.locator('[data-round-pick="1"]').click();
  await expect(page.locator('[data-board="1"] [data-result="1-0"]')).toBeDisabled();

  await page.locator('[data-tab="table"]').click();
  await expect(page.locator("[data-standings] thead")).toContainText("БХ");
  expect(
    await page
      .locator("[data-standings] [data-points]")
      .evaluateAll((cells) => cells.map((c) => c.getAttribute("data-points"))),
  ).toHaveLength(5);
});

test("швейцарская: выбывший не получает пару, опоздавший вступает со следующего тура", async ({ page }) => {
  await prepare(page);
  await create(page, { format: "swiss", players: ["А", "Б", "В", "Г", "Д", "Е"] });
  for (const board of [1, 2, 3]) await result(page, board, "1-0");
  await page.locator('[data-tab="players"]').click();
  await page.locator('[data-withdraw="2"]').click();
  await page.locator("[data-late-name]").fill("Жасур 1350");
  await page.locator("[data-late-add]").click();
  await expect(page.locator("[data-players]")).toContainText("Жасур");
  await expect(page.locator("[data-players]")).toContainText("с тура 2");
  await page.locator('[data-tab="rounds"]').click();
  await page.locator("[data-next-round]").click();
  const second = (await pairs(page)).flat();
  expect(second).not.toContain("Б");
  expect(second).toContain("Жасур");
});

test("судья: исправить результат прошлого тура, поменять пары и цвета, имя участника, число туров", async ({
  page,
}) => {
  await prepare(page);
  await create(page, { format: "swiss", players: ["А", "Б", "В", "Г", "Д", "Е"] });
  const first = await pairs(page);
  for (const board of [1, 2, 3]) await result(page, board, "1-0");
  await page.locator("[data-next-round]").click();
  await expect(page.locator("[data-round]")).toHaveAttribute("data-round", "2");

  // Прошлый тур закрыт от случайного нажатия; судья открывает его и исправляет результат.
  await page.locator('[data-round-pick="1"]').click();
  await expect(page.locator('[data-board="1"] [data-result="0-1"]')).toBeDisabled();
  await page.locator("[data-fix-results]").click();
  await result(page, 1, "0-1");
  await expect(page.locator('[data-board="1"]')).toHaveAttribute("data-game-result", "0-1");
  // Стереть результат прошлого тура нельзя — только заменить.
  await result(page, 1, "0-1");
  await expect(page.locator('[data-board="1"]')).toHaveAttribute("data-game-result", "0-1");
  await page.locator('[data-tab="table"]').click();
  const points = (name: string) =>
    page.locator("[data-standings] tbody tr", { hasText: name }).locator("[data-points]").getAttribute("data-points");
  expect(await points(first[0][0]!)).toBe("0");
  expect(await points(first[0][1]!)).toBe("1");

  // Пары второго тура: двое меняются местами, тур помечен; стрелки меняют цвет.
  await page.locator('[data-tab="rounds"]').click();
  await page.locator('[data-round-pick="2"]').click();
  const before = await pairs(page);
  await page.locator("[data-edit-pairs]").click();
  await expect(page.locator("[data-result]")).toHaveCount(0);
  await page.locator('[data-board="1"] [data-pick="black"]').click();
  await page.locator('[data-board="2"] [data-pick="black"]').click();
  await expect(page.locator('[data-note="manual"]')).toBeVisible();
  const after = await pairs(page);
  expect([...after[0]].sort()).toEqual([before[0][0], before[1][1]].sort());
  expect([...after[1]].sort()).toEqual([before[1][0], before[0][1]].sort());
  await page.locator('[data-board="3"] [data-flip]').click();
  expect((await pairs(page))[2]).toEqual([before[2][1], before[2][0]]);
  await page.locator("[data-edit-pairs]").click();
  await expect(page.locator('[data-board="1"] [data-result="1-0"]')).toBeEnabled();
  // Правка сохраняется.
  await page.reload();
  await expect(page.locator('[data-note="manual"]')).toBeVisible();
  expect((await pairs(page))[2]).toEqual([before[2][1], before[2][0]]);

  // Опечатка в имени и число туров.
  await page.locator('[data-tab="players"]').click();
  await page.locator('[data-player-edit="1"]').click();
  await page.locator("[data-player-name]").fill("Алишер");
  await page.locator("[data-player-rating]").fill("1500");
  await page.locator("[data-player-save]").click();
  await expect(page.locator('[data-player="1"]')).toContainText("Алишер");
  await expect(page.locator('[data-player="1"]')).toContainText("1500");
  const total = Number(await page.locator("[data-total-rounds]").getAttribute("data-total-rounds"));
  await page.locator("[data-rounds-more]").click();
  await expect(page.locator("[data-total-rounds]")).toHaveAttribute("data-total-rounds", String(total + 1));
  await page.locator('[data-tab="rounds"]').click();
  await expect(page.locator("[data-round-pick]")).toHaveCount(total + 1);
  await expect(
    page.locator("[data-white]", { hasText: "Алишер" }).or(page.locator("[data-black]", { hasText: "Алишер" })),
  ).toBeVisible();
});

test("олимпийская: ничьей нет, победители идут дальше, в конце — места и сетка", async ({ page }) => {
  await prepare(page);
  await create(page, { format: "knockout", players: ["А", "Б", "В", "Г", "Д"] });
  // Пять участников в сетке на восемь: трое первых свободны, играют четвёртый и пятый.
  await expect(page.locator("[data-bye]")).toHaveCount(3);
  await expect(page.locator('[data-result="1/2"]')).toHaveCount(0);
  await page.locator('[data-board] [data-result="0-1"]').click();
  await page.locator("[data-next-round]").click();
  await expect(page.getByRole("heading", { level: 2 })).toHaveText("Полуфинал");
  for (const board of [1, 2]) await result(page, board, "1-0");
  await page.locator("[data-next-round]").click();
  await expect(page.getByRole("heading", { level: 2 })).toHaveText("Финал");
  await expect(page.locator("[data-board]")).toHaveCount(2);
  await expect(page.locator('[data-board="2"]')).toContainText("За третье место");
  for (const board of [1, 2]) await result(page, board, "1-0");
  await expect(page.locator("[data-tournament-status]")).toHaveAttribute("data-tournament-status", "finished");
  await page.locator('[data-tab="table"]').click();
  await expect(page.locator("[data-places] li")).toHaveCount(3);
  await expect(page.locator("[data-bracket] section")).toHaveCount(3);
});

test("поделиться: пары тура и таблица уходят текстом в окно «Поделиться»; без него — копируются", async ({ page }) => {
  await prepare(page);
  // Системного окна в тестовом браузере нет — подставляем своё и смотрим, какой текст в него пришёл.
  await page.addInitScript(() => {
    const w = window as unknown as { __shared: string[]; __copied: string[] };
    w.__shared = [];
    w.__copied = [];
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (data: { text?: string }) => void w.__shared.push(data.text ?? ""),
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (text: string) => void w.__copied.push(text) },
    });
  });
  await create(page, { format: "roundRobin", players: ["Али", "Вали", "Гани", "Дони"], name: "Турнир 3 «Б»" });
  const shared = () => page.evaluate(() => (window as unknown as { __shared: string[] }).__shared);
  const share = page.locator("[data-tournament-share]");

  await expect(share).toHaveAccessibleName("Поделиться парами тура");
  await share.click();
  expect((await shared()).at(-1)).toBe(
    ["Турнир 3 «Б»", "Тур 1 из 3. Белые — слева.", "1. Али — Дони", "2. Вали — Гани"].join("\n"),
  );

  await result(page, 1, "1-0");
  await result(page, 2, "1/2");
  await page.locator('[data-tab="table"]').click();
  await expect(share).toHaveAccessibleName("Поделиться таблицей");
  await share.click();
  expect((await shared()).at(-1)).toBe(
    ["Турнир 3 «Б»", "Таблица после 1 тура (всего 3)", "1. Али — 1", "2. Вали — ½", "2. Гани — ½", "4. Дони — 0"].join(
      "\n",
    ),
  );

  // Окна «Поделиться» нет (обычный компьютер): текст копируется, об этом сказано.
  await page.evaluate(() => Object.defineProperty(navigator, "share", { configurable: true, value: undefined }));
  await share.click();
  await expect(page.locator("[data-tournament-shared]")).toHaveText("Скопировано — текст можно вставить в чат.");
  expect(await page.evaluate(() => (window as unknown as { __copied: string[] }).__copied[0])).toContain("1. Али — 1");
});

test("турнир сохраняется в файл и загружается из файла; чужой файл не принимается; удаление — с подтверждением", async ({
  page,
}) => {
  await prepare(page);
  await create(page, { format: "roundRobin", players: ["Али", "Вали", "Гани"], name: "Домашний турнир" });
  await result(page, 1, "1-0");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Сохранить в файл" }).click(),
  ]);
  const file = await download.path();
  const saved = JSON.parse(readFileSync(file, "utf8"));
  expect(saved).toMatchObject({ version: 1, name: "Домашний турнир", format: "roundRobin" });
  expect(saved.players.map((p: { name: string }) => p.name)).toEqual(["Али", "Вали", "Гани"]);
  expect(saved.rounds[0].games[0].result).toBe("1-0");

  // Отказ в подтверждении — турнир на месте.
  page.once("dialog", (d) => void d.dismiss());
  await page.locator("[data-tournament-delete]").click();
  await expect(page.locator("[data-tournament]")).toBeVisible();
  page.once("dialog", (d) => void d.accept());
  await page.locator("[data-tournament-delete]").click();
  await expect(page.locator("[data-tournaments]")).toBeVisible();
  await expect(page.locator("[data-tournament-list]")).toHaveCount(0);
  expect(await page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "[]").length, STORE)).toBe(0);

  await page.locator("[data-tournament-file]").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":1,"format":"swiss","players":"все"}'),
  });
  await expect(page.locator("main").getByRole("alert")).toContainText("Не получилось прочитать файл");

  await page.locator("[data-tournament-file]").setInputFiles(file);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Домашний турнир");
  // Первый тур сыгран (партия и свободный) — турнир открывается на втором; результат первого на месте.
  await expect(page.locator("[data-round]")).toHaveAttribute("data-round", "2");
  await page.locator('[data-round-pick="1"]').click();
  await expect(page.locator('[data-board="1"]')).toHaveAttribute("data-game-result", "1-0");
});

test("турниры по-узбекски — без кириллицы; вход — из шахматной школы", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/chess");
  await page.locator("[data-more-sections] summary").first().click();
  await page.locator('[data-more-sections] a[href="/chess/tournaments"]').click();
  await expect(page.locator("[data-tournaments]")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Turnirlar");
  expect(await page.locator("main").innerText()).not.toMatch(/[а-яё]/i);
  await page.locator("[data-new-tournament]").click();
  expect(await page.locator("main").innerText()).not.toMatch(/[а-яё]/i);
  await page.locator('input[name="format"][value="swiss"]').check();
  await page.locator("[data-tournament-players]").fill("Ali\nVali\nGʻani\nDoniyor\nEldor\nJasur");
  await page.locator("[data-tournament-start]").click();
  await expect(page.locator("[data-tournament]")).toBeVisible();
  for (const tab of ["rounds", "table", "players"]) {
    await page.locator(`[data-tab="${tab}"]`).click();
    expect(await page.locator("main").innerText(), tab).not.toMatch(/[а-яё]/i);
  }
});

test("мало участников — понятная ошибка, турнир не создаётся", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/tournaments#new");
  await page.waitForLoadState("networkidle");
  if (!(await page.locator("[data-tournament-create]").count()))
    await page.evaluate(() => (window.location.hash = "#new"));
  await page.locator('input[name="format"][value="swiss"]').check();
  await page.locator("[data-tournament-players]").fill("Али\nВали");
  await page.locator("[data-tournament-start]").click();
  await expect(page.locator("main").getByRole("alert")).toContainText("не меньше 4 участников");
  await expect(page.locator("[data-tournament]")).toHaveCount(0);
  // Одинаковые имена — предупреждение, но не запрет.
  await page.locator("[data-tournament-players]").fill("Али\nАли\nВали\nГани");
  await expect(page.locator("main").getByRole("status")).toContainText("Одинаковые имена: Али");
});
