import { expect, test, type Page } from "@playwright/test";

/** Пропускаем приветственное окно, чтобы оно не мешало тестам. */
async function skipWelcome(page: Page) {
  await page.addInitScript(() => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key)) {
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          tasks: {},
          days: {},
          myProblems: [],
          reviews: {},
          settings: { hintPause: false, bigText: false },
        }),
      );
    }
  });
}

test.beforeEach(async ({ page }) => {
  await skipWelcome(page);
});

test("главная: неделя из 7 дней и сегодняшнее занятие", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Математика — это место/ })).toBeVisible();
  await expect(page.getByText("День 1. Смотри внимательно")).toBeVisible();
  for (let d = 1; d <= 7; d++) await expect(page.locator(`a[href="/week/1/day/${d}"]`).first()).toBeVisible();
});

test("задача с числовым ответом: мягкая обратная связь и подсказки", async ({ page }) => {
  await page.goto("/week/1/day/1#task-1");
  await expect(page.getByRole("heading", { name: /Почти двадцать/ })).toBeVisible();
  const input = page.getByLabel("19 + 19 + 19 =");
  await input.fill("47");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText(/Давай проверим твою идею/)).toBeVisible();
  await expect(page.getByText(/неправильно/i)).toHaveCount(0);

  await page.getByRole("button", { name: "Открыть подсказку" }).click();
  await expect(page.getByText(/Сколько раз в нём повторяется число 19/)).toBeVisible();

  await input.fill("57");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText("А ещё подумай")).toBeVisible();
});

test("робот доходит до флажка по программе", async ({ page }) => {
  await page.goto("/week/1/day/1#task-5");
  for (const dir of ["вверх", "вверх", "вверх", "вправо", "вправо", "вправо", "вправо"]) {
    await page.getByRole("button", { name: dir, exact: true }).click();
  }
  await page.getByRole("button", { name: /Запустить/ }).click();
  await expect(page.getByText(/короче не бывает/)).toBeVisible({ timeout: 10_000 });
});

test("печать: лист заданий без ответов, ответы — только после PIN-кода", async ({ page }) => {
  await page.goto("/week/1/day/1/print");
  await expect(page.getByText("Лаборатория Давлатжона · задания")).toBeVisible();
  await expect(page.getByText("Ответ:")).toHaveCount(0);
  await page.getByRole("tab", { name: /Ответы/ }).click();
  await expect(page.getByRole("heading", { name: "Раздел для взрослых" })).toBeVisible();
});

test("раздел родителя: PIN-код, ответы и недельный обзор", async ({ page }) => {
  await page.goto("/parent");
  const pins = page.locator('input[type="password"]');
  await pins.nth(0).fill("2468");
  await pins.nth(1).fill("2468");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByRole("heading", { name: /Здравствуйте/ })).toBeVisible();

  await page.goto("/parent/week/1/day/1");
  await expect(page.getByText("Ответ:").first()).toBeVisible();
  await expect(page.getByText("57").first()).toBeVisible();

  await page.goto("/parent/week/1/review");
  await expect(page.getByRole("heading", { name: "Недельный обзор" })).toBeVisible();
  await expect(page.getByText("Без ярлыков")).toBeVisible();
});

test("мои задачи: можно записать свою задачу", async ({ page }) => {
  await page.goto("/my-problems");
  await page.getByLabel("Условие задачи").fill("Сколько лап у трёх котов?");
  await page.getByRole("button", { name: "Сохранить задачу" }).click();
  await expect(page.getByText("Сколько лап у трёх котов?")).toBeVisible();
});

test("главная: вторая неделя «Неделя инструментов»", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Неделя инструментов/ })).toBeVisible();
  for (let d = 1; d <= 7; d++) await expect(page.locator(`a[href="/week/2/day/${d}"]`).first()).toBeVisible();
});

test("Удвоитель: из 1 в 25 за 6 команд", async ({ page }) => {
  await page.goto("/week/2/day/2#task-5");
  await expect(page.getByRole("heading", { name: /Удвоитель/ })).toBeVisible();
  const double = page.getByRole("button", { name: "Команда: удвой" });
  const plusOne = page.getByRole("button", { name: "Команда: прибавь 1" });
  for (const b of [double, plusOne, double, double, double, plusOne]) await b.click();
  await expect(page.getByText(/короче не бывает/)).toBeVisible();
});

test("ханойская башня: 3 кольца за 7 ходов", async ({ page }) => {
  await page.goto("/week/2/day/3#task-5");
  const peg = (name: string) => page.getByRole("button", { name: new RegExp(`^${name} стержень`) });
  const moves: [string, string][] = [
    ["левый", "правый"],
    ["левый", "средний"],
    ["правый", "средний"],
    ["левый", "правый"],
    ["средний", "левый"],
    ["средний", "правый"],
    ["левый", "правый"],
  ];
  for (const [from, to] of moves) {
    await peg(from).click();
    await peg(to).click();
  }
  await expect(page.getByText(/Быстрее не бывает/)).toBeVisible();
});

test("переправа: волк, коза и капуста за 7 поездок", async ({ page }) => {
  await page.goto("/week/2/day/4#task-5");
  const board = (name: string) => page.getByRole("button", { name: `${name}: посадить в лодку` });
  const sail = page.getByRole("button", { name: /Плыть/ });
  // Сначала ошибка: без козы волк её съест.
  await board("капуста").click();
  await sail.click();
  await expect(page.getByText(/Стоп! Если крестьянин уплывёт, волк съест козу/)).toBeVisible();
  for (const who of ["коза", null, "волк", "коза", "капуста", null, "коза"]) {
    if (who) await board(who).click();
    await sail.click();
  }
  await expect(page.getByText(/Быстрее не бывает/)).toBeVisible();
});

test("главная: третья неделя «Неделя логики»", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Неделя логики/ })).toBeVisible();
  for (let d = 1; d <= 7; d++) await expect(page.locator(`a[href="/week/3/day/${d}"]`).first()).toBeVisible();
});

test("круги Эйлера: числа разложены по местам", async ({ page }) => {
  await page.goto("/week/3/day/3#task-3");
  const place = async (label: string, region: string) => {
    await page.getByRole("button", { name: label, exact: true }).first().click();
    await page.getByRole("button", { name: region }).click();
  };
  const plan: [string, string][] = [
    ["4", "только «Чётные»"],
    ["8", "только «Чётные»"],
    ["13", "только «Больше 10»"],
    ["17", "только «Больше 10»"],
    ["12", "в обоих кругах"],
    ["16", "в обоих кругах"],
    ["5", "вне кругов"],
    ["9", "вне кругов"],
  ];
  for (const [label, region] of plan) await place(label, region);
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText(/Ответ совпадает/)).toBeVisible();
});

test("весы-детектив: фальшивая монета из девяти за два взвешивания", async ({ page }) => {
  await page.goto("/week/3/day/4#task-8");
  const coin = (n: number) => page.getByRole("button", { name: new RegExp(`^Монета ${n}:`) });
  const weigh = async (left: number[], right: number[]) => {
    for (const c of left) await coin(c).click();
    for (const c of right) for (let k = 0; k < 2; k++) await coin(c).click();
    await page.getByRole("button", { name: /Взвесить/ }).click();
    return (await page.getByText(/^Весы: /).textContent()) ?? "";
  };
  // Где лёгкая монета: на поднявшейся чаше, а при равновесии — на столе.
  const pick = (result: string, left: number[], right: number[], rest: number[]) =>
    result.includes("левая") ? right : result.includes("правая") ? left : rest;
  const first = await weigh([1, 2, 3], [4, 5, 6]);
  const group = pick(first, [1, 2, 3], [4, 5, 6], [7, 8, 9]);
  await page.getByRole("button", { name: "Снять монеты" }).click();
  const second = await weigh([group[0]], [group[1]]);
  const [fake] = pick(second, [group[0]], [group[1]], [group[2]]);
  await page.getByRole("button", { name: /Это фальшивая/ }).click();
  await coin(fake).click();
  await expect(page.getByText(`Фальшивая — монета № ${fake}.`, { exact: false })).toBeVisible();
});

test("обмен соседей: 5 обменов", async ({ page }) => {
  await page.goto("/week/3/day/5#task-5");
  for (const i of [0, 1, 3, 2, 1])
    await page
      .getByRole("button", { name: /^Поменять/ })
      .nth(i)
      .click();
  await expect(page.getByText(/Быстрее не бывает/)).toBeVisible();
});

test("шифр Цезаря: расшифровка", async ({ page }) => {
  await page.goto("/week/3/day/6#task-5");
  await page.getByLabel("Расшифрованное слово").fill("молодец");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText(/Расшифровано: МОЛОДЕЦ/)).toBeVisible();
});

test("последний камешек: секрет побеждает робота", async ({ page }) => {
  await page.goto("/week/3/day/7#task-4");
  for (let turn = 0; turn < 10; turn++) {
    const text = (await page.getByText(/^Осталось:/).textContent()) ?? "";
    const left = Number(text.match(/\d+/)?.[0]);
    const take = left % 3 === 0 ? 1 : left % 3;
    await page.getByRole("button", { name: `Взять ${take}` }).click();
    if (left === take) break;
    await expect(page.getByText(`Осталось: ${left - take}`, { exact: false })).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText("🙂 Твой ход")).toBeVisible();
  }
  await expect(page.getByText(/Ты победил робота/)).toBeVisible();
});
