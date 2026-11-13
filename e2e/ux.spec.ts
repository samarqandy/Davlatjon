import { expect, test, type Page } from "@playwright/test";

/** Правки по итогам UX-аудита: замок родителя, выход из партии, режим «Сам», мягкие подсказки. */

const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, settings: Record<string, unknown> = {}) {
  await page.addInitScript(
    ([s, key]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 9, lang: "ru", ...s },
        }),
      );
    },
    [settings, KEY] as const,
  );
}

const square = (page: Page, board: string, sq: string) =>
  page.locator(`[data-board="${board}"] [data-square="${sq}"]`).click();

test("замок родителя: меню скрыто до PIN-кода, слова для сброса нет, после трёх ошибок — пауза", async ({ page }) => {
  await prepare(page);
  await page.goto("/parent");
  await expect(page.getByRole("heading", { name: "Раздел для взрослых" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Закрыть раздел/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Ответы/ })).toHaveCount(0);

  const pins = page.locator('input[type="password"]');
  await pins.nth(0).fill("2468");
  await pins.nth(1).fill("2468");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByRole("button", { name: /Закрыть раздел/ })).toBeVisible();

  await page.getByRole("button", { name: /Закрыть раздел/ }).click();
  for (let i = 0; i < 3; i++) {
    await page.locator('input[type="password"]').fill("1111");
    await page.getByRole("button", { name: "Открыть" }).click();
  }
  await expect(page.getByText("Подождите немного и попробуйте снова.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Открыть" })).toBeDisabled();

  await page.getByRole("button", { name: "Забыли PIN-код?" }).click();
  expect(await page.locator("[data-pin-reset]").innerText()).not.toMatch(/слово|soʻz/i);
  await page.getByRole("button", { name: "Запросить сброс" }).click();
  await expect(page.getByText(/Сброс будет доступен/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Сбросить PIN-код" })).toHaveCount(0);
});

test("партия с роботом: «Закончить» просит подтверждения; «Отменить» после этого не оставляет поражения", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w");
  await square(page, "play", "e2");
  await square(page, "play", "e4");
  await expect(page.getByText("🙂 Твой ход")).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: /Закончить партию/ }).click();
  await expect(page.locator("[data-confirm-end]")).toBeVisible();
  await page.getByRole("button", { name: "Играть дальше" }).click();
  await expect(page.locator("[data-confirm-end]")).toHaveCount(0);

  await page.getByRole("button", { name: /Закончить партию/ }).click();
  await page.getByRole("button", { name: "Закончить", exact: true }).click();
  const games = () =>
    page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chessGames?.length ?? 0, KEY);
  await expect.poll(games).toBe(1);

  await page.getByRole("button", { name: /Отменить/ }).click();
  await expect.poll(games).toBe(0);
});

test("«Новая партия» можно вернуть кнопкой «Вернуть прежнюю»", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w");
  await square(page, "play", "e2");
  await square(page, "play", "e4");
  await expect(page.getByText("🙂 Твой ход")).toBeVisible({ timeout: 10_000 });
  await page.getByRole("button", { name: /Новая партия/ }).click();
  await expect(page.locator("[data-previous-game]")).toBeVisible();
  await page.getByRole("button", { name: /Вернуть прежнюю/ }).click();
  await expect(page.getByRole("list", { name: "Список ходов" }).getByText("e4", { exact: true })).toBeVisible();
});

test("экран игры: главная кнопка «Играть» сразу начинает партию с роботом своего уровня", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/play");
  await page.locator("[data-quick-play]").getByRole("button", { name: "Играть" }).click();
  await expect(page).toHaveURL(/#robot-\d-w$/);
  await expect(page.getByRole("button", { name: /Подсказка/ })).toBeVisible();
});

test("экран игры: фора от робота — в раскрывающемся блоке, выбор виден в его заголовке и попадает в партию", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/chess/play");
  const settings = page.locator("[data-robot-settings]");
  await expect(settings).not.toHaveAttribute("open", "");
  await expect(settings.locator("summary")).toContainText("со всеми фигурами");
  await settings.locator("summary").click();
  await settings.getByRole("group", { name: "Фора от робота" }).getByRole("button", { name: "без ферзя" }).click();
  await expect(settings.locator("summary")).toContainText("без ферзя");
  await page.getByRole("button", { name: "Белыми" }).first().click();
  await expect(page).toHaveURL(/#robot-1-w\?o=/);
});

test("режим «Сам»: подсказки и отмены нет", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w?s=1");
  await expect(page.getByRole("button", { name: /Подсказка/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Отменить/ })).toHaveCount(0);
  // Якорь на той же странице меняем только после гидратации: иначе Next при запуске перепишет адрес без него.
  await page.waitForLoadState("networkidle");
  await page.goto("/chess/play#robot-1-w");
  await expect(page.getByRole("button", { name: /Подсказка/ })).toBeVisible();
});

test("пустое поле: «Проверить» мягко подсказывает, а не молчит", async ({ page }) => {
  await prepare(page);
  await page.goto("/week/1/day/1#task-1");
  const check = page.getByRole("button", { name: "Проверить" }).first();
  await check.click({ force: true });
  await expect(page.getByText("✏️ Сначала впиши ответ").first()).toBeVisible();
});

test("кнопка «Подсказка» в нижней панели ведёт к подсказкам (телефон)", async ({ page, isMobile }) => {
  test.skip(!isMobile, "на широком экране подсказки видны сбоку");
  await prepare(page);
  await page.goto("/week/1/day/1#task-1");
  await page.locator("[data-hint-jump]").first().click();
  await expect(page.locator("#hints").first()).toBeInViewport();
});

test("младшему — крупная кнопка «Прочитать» (56 px), старшему — обычная", async ({ page }) => {
  await prepare(page, { age: 7 });
  await page.goto("/week/1/day/1#task-1");
  const listen = page.getByRole("button", { name: /Прочитать/ }).first();
  await expect(listen).toBeVisible();
  expect((await listen.boundingBox())!.height).toBeGreaterThanOrEqual(55);
});

test("партия с роботом: ход робота назван словами в строке статуса (её читает экранный диктор)", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/play#robot-1-w");
  await square(page, "play", "e2");
  await square(page, "play", "e4");
  const status = page.locator("[data-play-status]");
  await expect(status).toContainText("Твой ход", { timeout: 10_000 });
  await expect(status.locator("[data-robot-move]")).toContainText(/Робот сыграл .+\./);
});

// Бюджет экрана: младший ребёнок читает с трудом и не любит прокрутку, поэтому задача целиком помещается на телефон.
test("задача на телефоне: условие, ответ и «Проверить» — на одном экране, без лишних кнопок", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "бюджет экрана считаем для телефона");
  await prepare(page, { age: 7 });
  await page.setViewportSize({ width: 390, height: 664 });
  await page.goto("/week/1/day/1#task-1");
  const navTop = (await page.locator("[data-day-nav]").boundingBox())!.y;
  const bottomOf = async (name: string | RegExp) => {
    const box = (await page.getByRole("button", { name }).first().boundingBox())!;
    return box.y + box.height;
  };
  await expect(page.getByRole("heading", { name: "Почти двадцать" })).toBeInViewport();
  expect(await bottomOf("Проверить")).toBeLessThanOrEqual(navTop);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  // Счётчик задач один — полоска в шапке; подписи «Задача 1 из 8» и «1 / 8» на телефоне не показываем.
  await expect(page.getByText("Задача 1 из 8")).toBeHidden();
  await expect(page.locator("[data-task-counter]")).toBeHidden();
  await expect(page.getByRole("list", { name: "Задачи дня" }).getByRole("button")).toHaveCount(9);

  // Кнопок и полей на экране, не считая полоски задач, — не больше восьми (было семнадцать).
  const controls = await page.evaluate(
    () =>
      [...document.querySelectorAll("a[href],button,input,select,summary")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0 && !el.closest("header ol");
      }).length,
  );
  expect(controls).toBeLessThanOrEqual(8);

  // После верного ответа итог и «Дальше» видны сразу, искать их прокруткой не нужно.
  await page.locator("input").first().fill("57");
  await page.getByRole("button", { name: "Проверить" }).first().click();
  await expect(page.getByText(/Ответ совпадает|Так и есть|Сошлось|Точно/).first()).toBeInViewport();
  await expect(page.getByRole("button", { name: "Дальше →" })).toBeInViewport();
  await expect(page.locator("[data-task-counter]")).toBeVisible();
});

test("неверный ответ — мягкий сигнал «попробуй ещё»; пустое поле и верный ответ его не дают", async ({ page }) => {
  await prepare(page);
  await page.addInitScript(() => {
    const w = window as unknown as { __answer: string[] };
    w.__answer = [];
    window.addEventListener("answer-sfx", (e) => w.__answer.push((e as CustomEvent<string>).detail));
    window.addEventListener("reward-sfx", (e) => w.__answer.push(`reward:${(e as CustomEvent<string>).detail}`));
    // Вместе со звуком — короткая вибрация (на телефонах, где браузер её умеет).
    window.addEventListener("haptic", (e) => w.__answer.push(`haptic:${(e as CustomEvent<string>).detail}`));
  });
  await page.goto("/week/1/day/1#task-1");
  const heard = () => page.evaluate(() => (window as unknown as { __answer: string[] }).__answer);
  const check = page.getByRole("button", { name: "Проверить" }).first();
  await check.click({ force: true });
  await expect(page.getByText("✏️ Сначала впиши ответ").first()).toBeVisible();
  expect(await heard()).toEqual([]);

  await page.locator("input").first().fill("50");
  await check.click();
  await expect.poll(heard).toEqual(["retry", "haptic:retry"]);

  await page.locator("input").first().fill("57");
  await check.click();
  await expect.poll(heard).toEqual(["retry", "haptic:retry", "reward:win", "haptic:success"]);
});

// Бюджет длины: главные страницы шахмат на телефоне — не длиннее трёх-четырёх экранов (было 5,6 и 9,4).
test("шахматная школа и страница курса на телефоне — короткие: до трёх и до четырёх экранов", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "длину страниц считаем для телефона");
  // С именем: без него наверху страницы есть разовая карточка «как тебя зовут», она в бюджет не входит.
  await prepare(page, { age: 7, childName: "Анна" });
  await page.setViewportSize({ width: 390, height: 664 });
  const screens = async (url: string) => {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    return page.evaluate(() => document.documentElement.scrollHeight / window.innerHeight);
  };
  expect(await screens("/chess")).toBeLessThanOrEqual(3);
  // Задание дня свёрнуто в строку с итогом, главные разделы — три плитки, уровни и звания — под «Ещё разделы».
  await expect(page.locator("details[data-today]")).not.toHaveAttribute("open", "");
  await expect(page.locator("[data-quest-count]")).toHaveText("0/3");
  await expect(page.locator("[data-main-sections] a")).toHaveCount(3);
  await expect(page.locator('a[href="/chess/pawn"]')).toBeHidden();
  await page.locator("[data-today] summary").click();
  await expect(page.locator("[data-today]").getByText("Начни серию сегодня!")).toBeVisible();

  expect(await screens("/chess/course")).toBeLessThanOrEqual(4);
  expect(await screens("/chess/course-5")).toBeLessThanOrEqual(4);
});

test("телефон и система: жест «потянуть, чтобы обновить» выключен на экранах с доской, страница только светлая или своя тёмная, у приложения есть ярлыки", async ({
  page,
  request,
}) => {
  await prepare(page);
  const html = (prop: "overscrollBehaviorY" | "colorScheme") =>
    page.evaluate((p) => getComputedStyle(document.documentElement)[p], prop);

  // На главной жест работает, как обычно; цветовая схема — «только светлая», чтобы браузер не перекрашивал сам.
  await page.goto("/");
  expect(await html("overscrollBehaviorY")).toBe("auto");
  expect((await html("colorScheme")).split(" ").sort()).toEqual(["light", "only"]);
  await page.getByRole("button", { name: "Тёмная тема" }).click();
  await expect.poll(() => html("colorScheme")).toBe("dark");
  await page.getByRole("button", { name: "Тёмная тема" }).click();

  // Задача и доска: движение пальца вниз не должно перезагружать страницу.
  await page.goto("/week/1/day/1#task-1");
  await expect(page.locator("[data-day-nav]")).toBeVisible();
  expect(await html("overscrollBehaviorY")).toBe("contain");
  await page.goto("/chess/play#robot-1-w");
  await expect(page.locator('[data-board="play"]')).toBeVisible();
  expect(await html("overscrollBehaviorY")).toBe("contain");

  // Ярлыки на значке приложения ведут на существующие страницы.
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.id).toBe("/");
  const urls: string[] = manifest.shortcuts.map((x: { url: string }) => x.url);
  expect(urls).toEqual(["/chess", "/chess/puzzles#practice", "/quick"]);
  for (const url of urls) expect((await request.get(url.split("#")[0])).status()).toBe(200);
});

// Планшет и складной телефон (640–1023 px): дети часто занимаются с планшета.
test("планшет: шапка в одну строку и не обрезана, упражнение курса — в режиме «один экран»", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "ширину планшета задаём сами — одного прогона достаточно");
  for (const lang of ["ru", "uz"] as const) {
    await page.addInitScript(
      ([l, key]) =>
        localStorage.setItem(
          key,
          JSON.stringify({ version: 1, welcomed: true, settings: { age: 7, lang: l, childName: "Анна" } }),
        ),
      [lang, KEY] as const,
    );
    for (const width of [640, 720, 820, 1023]) {
      await page.setViewportSize({ width, height: 880 });
      await page.goto("/chess");
      const header = await page.evaluate(() => {
        const h = document.querySelector("[data-site-header]")!;
        const items = [...h.querySelectorAll("a,button")].filter((el) => el.getBoundingClientRect().width > 0);
        return {
          height: h.getBoundingClientRect().height,
          clipped: items.filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1).length,
          // Пункт меню в две строки выше 60 px.
          wrapped: items.filter((el) => el.getBoundingClientRect().height > 60).length,
        };
      });
      expect(header, `${lang}, ${width} px`).toEqual({ height: expect.any(Number), clipped: 0, wrapped: 0 });
      expect(header.height, `${lang}, ${width} px`).toBeLessThan(90);
    }
  }

  // Упражнение на планшете: шапка сайта и вкладки урока скрыты, доска целиком на экране.
  await page.setViewportSize({ width: 720, height: 880 });
  await page.goto("/chess/course");
  await page.waitForLoadState("networkidle");
  await page.goto("/chess/course#c1-rook-exercise-1");
  await expect(page.locator("[data-exercise-heading]")).toBeVisible();
  await expect(page.locator("[data-site-header]")).toBeHidden();
  const board = (await page.locator("[data-board]").first().boundingBox())!;
  expect(board.y + board.height).toBeLessThanOrEqual(880);
});

// Главное действие — под большим пальцем: на высоком телефоне кнопка в карточке стояла в верхней трети экрана.
test("шахматная школа и курс: «Начать» внизу экрана на телефоне, в карточке — на широком экране", async ({
  page,
  isMobile,
}) => {
  await prepare(page, { age: 7, childName: "Анна" });
  const fab = page.locator("[data-continue-fab]");
  const pill = page.locator("[data-course-continue]").getByText("Начать", { exact: true });
  await page.goto("/chess");
  if (!isMobile) {
    await expect(pill).toBeVisible();
    await expect(fab).toBeHidden();
    return;
  }
  await page.setViewportSize({ width: 480, height: 1040 });
  await expect(fab).toBeVisible();
  await expect(pill).toBeHidden();
  await expect(fab).toHaveAccessibleName("Начать: Шахматная партия");
  const centre = async () => {
    const box = (await fab.boundingBox())!;
    return (box.y + box.height / 2) / 1040;
  };
  // Нижняя треть экрана и не поверх нижнего меню.
  expect(await centre()).toBeGreaterThan(0.66);
  const nav = (await page.locator("[data-bottom-nav]").boundingBox())!;
  const box = (await fab.boundingBox())!;
  expect(box.y + box.height).toBeLessThanOrEqual(nav.y);
  await fab.click();
  await expect(page).toHaveURL(/\/chess\/course#c1-game$/);
  await expect(page.getByRole("heading", { level: 1, name: /Шахматная партия/ })).toBeVisible();

  // На странице ступени кнопка та же; в открытом уроке её нет — там своя строка упражнения.
  await expect(fab).toHaveCount(0);
  await page.goto("/chess/course-2");
  await expect(fab).toBeVisible();
  expect(await centre()).toBeGreaterThan(0.66);
  await fab.click();
  await expect(page).toHaveURL(/\/chess\/course-2#/);
});

// Доска на широком экране: слева и во всю высоту окна (DESIGN.md, раздел 7ж). Раньше она была не шире 440–560 px
// и стояла под шапкой урока и условием: на ноутбуке низ доски уходил за край окна.
// «Ниже» — экраны, где над доской есть рассказ или сводка: к доске сначала листают.
// Доска названа точно там, где страница сначала рисует список с маленькими досками, а экран открывает после
// оживления (дебюты): «первая доска на странице» в этот момент — превью из списка, и она тут же исчезает.
for (const [name, url, share, below, which] of [
  ["упражнение курса", "/chess/course#c1-rook-exercise-1", 0.7, false, "[data-board]"],
  ["задача", "/chess/puzzles#theme-backrank", 0.7, false, "[data-board]"],
  ["игра с роботом", "/chess/play#robot-1-w", 0.6, false, "[data-board]"],
  ["доска анализа", "/chess/analysis", 0.7, false, '[data-board="analysis"]'],
  ["партия мастеров", "/chess/games/opera", 0.7, true, '[data-board="game-opera"]'],
  ["дебют", "/chess/openings#open-italian", 0.7, true, '[data-board="opening-italian"]'],
  ["тренажёр дебюта", "/chess/openings#train-italian-white", 0.7, true, '[data-board="train-italian"]'],
  ["урок эндшпиля", "/chess/endgames#square", 0.7, false, '[data-board="demo-square"]'],
  ["упражнение эндшпиля", "/chess/endgames#opp-1", 0.7, false, '[data-board="opp-1"]'],
] as const)
  test(`широкий экран, ${name}: доска целиком в окне и занимает его высоту, остальное — справа`, async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "раскладка «доска слева» — от 1024 px");
    await prepare(page);
    for (const [width, height] of [
      [1280, 608],
      [1366, 768],
      [1920, 1080],
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      const board = page.locator(which).first();
      await expect(board).toBeVisible();
      if (below) await board.evaluate((el) => el.scrollIntoView({ block: "center" }));
      // Страница сама подкручивается к упражнению — ждём, пока доска встанет на место.
      await expect
        .poll(async () => {
          // Пока экран перерисовывается, доски может не быть — ждём дальше, а не падаем.
          const box = await board.boundingBox();
          return box ? Math.round(box.y + box.height) : Infinity;
        })
        .toBeLessThanOrEqual(height);
      const box = (await board.boundingBox())!;
      const size = `${width}×${height}`;
      expect(box.y, size).toBeGreaterThanOrEqual(0);
      expect(box.width, size).toBeGreaterThanOrEqual(share * height);
      // Справа от доски остаётся колонка не уже 300 px, и страница не шире окна.
      expect(width - (box.x + box.width), size).toBeGreaterThanOrEqual(300);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), size).toBeLessThanOrEqual(width);
    }
  });

// Ссылка на «экран» другой страницы открывает его с верха. Next при якоре без элемента с таким id страницу не
// прокручивает: после ссылки внизу длинного разбора экран задач открывался на 214–422 px ниже начала.
test("ссылка на экран другой страницы открывает его с верха, а «Назад» возвращает прежнее место", async ({ page }) => {
  await page.addInitScript((key) => {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(
      key,
      JSON.stringify({
        version: 1,
        welcomed: true,
        settings: { hintPause: false, bigText: false, age: 9, lang: "ru" },
        chessGames: [
          {
            id: "gtop1",
            at: 1759000000000,
            mode: "robot",
            level: 3,
            color: "b",
            result: "loss",
            winner: "w",
            moves: 3,
            start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            ucis: ["e2e4", "e7e5", "f1c4", "b8c6", "d1h5", "g8f6", "h5f7"],
          },
        ],
      }),
    );
  }, KEY);
  const scrollY = () => page.evaluate(() => Math.round(window.scrollY));
  await page.goto("/chess/review#gtop1");
  await expect(page.getByText("Твоя точность")).toBeVisible({ timeout: 20_000 });
  const link = page.getByRole("link", { name: "Реши эти моменты как задачи" });
  await link.scrollIntoViewIfNeeded();
  const was = await scrollY();
  expect(was).toBeGreaterThan(300);
  await link.click();
  await expect(page).toHaveURL(/\/chess\/puzzles#mine$/);
  await expect(page.getByRole("heading", { name: "Задачи из твоих партий" })).toBeInViewport();
  expect(await scrollY()).toBe(0);
  // «Назад» — не новый экран: браузер возвращает место, где ребёнок был.
  await page.goBack();
  await expect(page).toHaveURL(/\/chess\/review#gtop1$/);
  await expect.poll(scrollY).toBeGreaterThan(300);
});

// Прямой вход на «экран» (ссылка из мессенджера, обновление страницы). Сервер якоря не видит и отдаёт страницу
// раздела; раньше она была видна, пока страница не оживёт: на медленном телефоне список дебютов висел полторы
// секунды, и ребёнок мог нажать не туда. Теперь страница ждёт загрузки (скрипт в <head>).
test("страница, открытая сразу на экране, не показывает сначала список раздела — ни в одном кадре", async ({
  page,
}) => {
  await prepare(page);
  await page.addInitScript(() => {
    const w = window as unknown as { __seen: string[] };
    w.__seen = [];
    const tick = () => {
      // Что видит ребёнок в этом кадре: заголовки страницы, если она не спрятана ожиданием.
      const shown = !document.documentElement.classList.contains("i18n-wait");
      if (shown)
        for (const h of document.querySelectorAll("main h1")) {
          const text = h.textContent ?? "";
          if (h.getBoundingClientRect().height > 0 && !w.__seen.includes(text)) w.__seen.push(text);
        }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  // Медленный телефон: между первой отрисовкой и оживлением страницы проходит заметное время. Замедление
  // вдвое, а не сильнее: проверяем, что список не виден до оживления, а не сколько оно длится на машине CI
  // (при замедлении вчетверо там оно занимало больше трёх секунд — на этом и нашлась короткая запасная пауза).
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 2 });
  const seen = () => page.evaluate(() => (window as unknown as { __seen: string[] }).__seen);

  await page.goto("/chess/openings#open-italian");
  await expect(page.getByRole("heading", { level: 1, name: "Итальянская партия" })).toBeVisible({ timeout: 20_000 });
  expect(await seen()).toEqual(["Итальянская партия"]);
  await expect(page.locator("html")).not.toHaveClass(/i18n-wait/);

  // Без якоря страница раздела показывается сразу, ожидания нет.
  await page.goto("/chess/openings");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.classList.contains("i18n-wait"))).toBe(false);
});

// Тренажёр на время: доска, секундомер и «Старт» — на первом экране, листать некогда. Раньше над доской стояли
// шапка страницы и заголовок режима, и на ноутбуке низ доски уходил за край окна.
test("тренажёр координат: доска целиком и кнопка «Старт» — на первом экране", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/coordinates");
  await page.getByRole("button", { name: /Найди клетку/ }).click();
  const board = page.locator('[data-board="drill-find"]');
  await expect(board).toBeVisible();
  const { height } = page.viewportSize()!;
  const box = (await board.boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(height);
  await expect(page.getByRole("button", { name: "Старт" })).toBeInViewport({ ratio: 1 });
  // Заголовок страницы остаётся для экранного диктора, но места не занимает.
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

// Телефон: главная доска экрана — во всю ширину, без полей и рамки; буквы и цифры — внутри клеток.
// Было 86–92 % ширины: на экране 412 px клетка 44 px, стало 51 px.
test("телефон: главная доска экрана — во всю ширину, подписи внутри клеток", async ({ page, isMobile }) => {
  test.skip(!isMobile, "раскладка для телефона");
  await prepare(page);
  const width = page.viewportSize()!.width;
  for (const [url, which] of [
    ["/chess/course#c1-rook-exercise-1", "[data-board]"],
    ["/chess/puzzles#theme-backrank", "[data-board]"],
    ["/chess/play#robot-1-w", "[data-board]"],
    ["/chess/analysis", '[data-board="analysis"]'],
    ["/chess/games/opera", '[data-board="game-opera"]'],
    ["/chess/openings#open-italian", '[data-board="opening-italian"]'],
    ["/chess/openings#train-italian-white", '[data-board="train-italian"]'],
    ["/chess/endgames#square", '[data-board="demo-square"]'],
    ["/chess/endgames#opp-1", '[data-board="opp-1"]'],
  ] as const) {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    const board = page.locator(which).first();
    await expect(board).toBeVisible();
    // Все размеры — одним снимком: после первого хода соперника страница может сдвинуться на несколько пикселей.
    const m = await board.evaluate((el) => {
      const rect = (x: Element) => {
        const r = x.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      };
      return {
        board: rect(el),
        square: rect(el.querySelector("[data-square]")!),
        ranks: [...el.querySelectorAll('[data-coords="ranks"] span')].map(rect),
        files: [...el.querySelectorAll('[data-coords="files"] span')].map(rect),
      };
    });
    expect(Math.round(m.board.x), url).toBe(0);
    expect(Math.round(m.board.w), url).toBe(width);
    // Клетка — восьмая часть экрана: рамка места не отнимает.
    expect(m.square.w, url).toBeGreaterThanOrEqual(width / 8 - 0.5);
    // Подписи на месте и не выходят за доску; страница не шире экрана.
    for (const labels of [m.ranks, m.files]) {
      expect(labels, url).toHaveLength(8);
      for (const label of labels) {
        expect(label.x, url).toBeGreaterThanOrEqual(0);
        expect(label.x + label.w, url).toBeLessThanOrEqual(width + 0.5);
        expect(label.y, url).toBeGreaterThanOrEqual(m.board.y - 0.5);
        expect(label.y + label.h, url).toBeLessThanOrEqual(m.board.y + m.board.h + 0.5);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth), url).toBeLessThanOrEqual(width);
  }
});

// Школа эндшпиля: один экран — одна доска (END-1). Раньше все уроки и 18 настоящих досок стояли на одной
// странице: на медленном телефоне она оживала 1,9 с и была длиной 15,7 экрана (доски — 304–320 px).
test("школа эндшпиля: список картинками, урок и упражнения — отдельными экранами, «дальше» ведёт по порядку", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/chess/endgames");
  await expect(page.getByRole("heading", { level: 1, name: "Школа эндшпиля" })).toBeVisible();
  // В списке — доски-картинки: настоящих досок на странице нет.
  await expect(page.locator("[data-endgame-lesson]")).toHaveCount(4);
  await expect(page.locator("[data-board-thumb]")).toHaveCount(4);
  await expect(page.locator("[data-board]")).toHaveCount(0);

  await page.locator('[data-endgame-lesson="square"]').click();
  await expect(page).toHaveURL(/#square$/);
  await expect(page.getByRole("heading", { level: 1, name: "Правило квадрата" })).toBeVisible();
  await expect(page.locator("[data-board]")).toHaveCount(1);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  // Вход в упражнения виден без прокрутки: на телефоне — панель внизу, на широком экране — блок у края окна.
  const start = page.getByRole("button", { name: "К упражнениям →" });
  await expect(start).toBeInViewport();
  await start.click();
  await expect(page).toHaveURL(/#square-1$/);
  await expect(page.locator("[data-board]")).toHaveCount(1);
  const strip = page.locator("[data-step-strip] button");
  await expect(strip).toHaveCount(5);
  await expect(strip.nth(0)).toHaveAttribute("aria-current", "step");

  await page.getByRole("button", { name: "Догонит", exact: true }).click();
  await expect(page.getByText("Верно!")).toBeVisible();
  await expect(page.getByText("Почему так")).toBeVisible();
  await expect(strip.nth(0)).toHaveAccessibleName(/решено/);
  // «Дальше» после решения — на виду (на телефоне — панель внизу экрана).
  const onward = page.getByRole("button", { name: "Следующее упражнение →" });
  await expect(onward).toBeInViewport();
  await onward.click();
  await expect(page).toHaveURL(/#square-2$/);
  await expect(strip.nth(1)).toHaveAttribute("aria-current", "step");
  await expect(page.getByText("Верно!")).toHaveCount(0);
  // Фокус — на задании: диктор читает новое упражнение.
  await expect(page.locator("[data-exercise-heading]")).toBeFocused();

  // «Назад» браузера возвращает предыдущее упражнение, «закрыть» — список с сохранённым счётом.
  await page.goBack();
  await expect(page).toHaveURL(/#square-1$/);
  await page.getByRole("button", { name: "Все уроки" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Школа эндшпиля" })).toBeVisible();
  await expect(page.locator('[data-endgame-lesson="square"]')).toContainText("1 / 5");
  await expect(page.getByText("Решено 1 из 15")).toBeVisible();
});

test("школа эндшпиля: последнее упражнение урока — праздник и переход к следующему уроку", async ({ page }) => {
  await page.addInitScript((key) => {
    if (localStorage.getItem(key)) return;
    const chessEndgames = Object.fromEntries(["square-1", "square-2", "square-3", "square-4"].map((id) => [id, 1]));
    localStorage.setItem(
      key,
      JSON.stringify({ version: 1, welcomed: true, settings: { age: 9, lang: "ru" }, chessEndgames }),
    );
  }, KEY);
  await page.goto("/chess/endgames#square");
  // Урок начат: кнопка ведёт к первому нерешённому упражнению.
  await page.getByRole("button", { name: "Продолжить →" }).click();
  await expect(page).toHaveURL(/#square-5$/);
  await page.getByRole("button", { name: "Не догонит", exact: true }).click();
  const party = page.locator("[data-celebration]");
  await expect(party).toContainText("Урок пройден!");
  await party.getByRole("button", { name: "Следующий урок: Оппозиция →" }).click();
  await expect(page).toHaveURL(/#opposition$/);
  await expect(page.getByRole("heading", { level: 1, name: "Оппозиция" })).toBeVisible();
  // Повторный заход в пройденный урок салют не устраивает.
  await page.goto("/chess/endgames#square-5");
  await expect(page.locator('[data-board="square-5"]')).toBeVisible();
  await expect(party).toHaveCount(0);
});

test("школа эндшпиля: игра с роботом — ход, ответ робота и «начать заново»", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/endgames#play-1");
  const board = page.locator('[data-board="play-1"]');
  await expect(board).toBeVisible();
  await expect(page.getByText("Твой ход.")).toBeVisible();
  // Неточный ход пешкой: робот удержит ничью — можно вернуть ход.
  await board.locator('[data-square="e3"]').click();
  await board.locator('[data-square="e4"]').click();
  await expect(page.getByText(/Теперь робот удержит ничью/)).toBeVisible();
  await page.getByRole("button", { name: "Вернуть ход" }).click();
  await expect(page.getByText("Твой ход.")).toBeVisible();
  await expect(board.locator('[data-square="e3"] [data-piece]')).toHaveCount(1);
});

// Панель кнопок у доски (BAR-1): одна «капсула» со значками и короткими подписями вместо двух-трёх рядов
// отдельных кнопок. На телефоне 412 px в партии с роботом кнопки занимали три ряда и уезжали за край экрана.
for (const lang of ["ru", "uz"] as const)
  test(`панель у доски (${lang}): один ряд, подписи целиком, кнопки не у́же 44 px`, async ({ page, isMobile }) => {
    await prepare(page, { lang });
    const prefix = lang === "uz" ? "/uz" : "";
    // На телефоне проверяем и узкий экран 360 px: пять кнопок с подписями должны поместиться и там.
    const widths = isMobile ? [page.viewportSize()!.width, 360] : [page.viewportSize()!.width];
    for (const width of widths) {
      await page.setViewportSize({ width, height: page.viewportSize()!.height });
      for (const url of [
        "/chess/play#robot-1-w",
        "/chess/analysis",
        "/chess/games/opera",
        "/chess/openings#open-italian",
        "/chess/puzzles#practice",
        "/chess/course#c1-rook-exercise-1",
      ]) {
        await page.goto("about:blank");
        await page.goto(prefix + url, { waitUntil: "networkidle" });
        const bar = page.locator("[data-board-bar]").first();
        await expect(bar).toBeVisible();
        const m = await bar.evaluate((el) => {
          const buttons = [...el.querySelectorAll("button")];
          const tops = new Set(buttons.map((b) => Math.round(b.getBoundingClientRect().top)));
          return {
            rows: tops.size,
            height: Math.round(el.getBoundingClientRect().height),
            narrow: buttons.filter((b) => b.getBoundingClientRect().width < 44).length,
            cut: buttons
              .map((b) => b.querySelector("span")!)
              .filter((s) => s.scrollWidth > s.clientWidth + 0.5)
              .map((s) => s.textContent),
            unnamed: buttons.filter((b) => !(b.getAttribute("aria-label") ?? b.textContent ?? "").trim()).length,
            // Название для экранного диктора содержит видимую подпись (WCAG 2.5.3).
            mismatched: buttons
              .filter((b) => {
                const name = b.getAttribute("aria-label");
                return name && !name.toLowerCase().includes(b.textContent!.trim().toLowerCase());
              })
              .map((b) => b.textContent),
          };
        });
        const where = `${url} @ ${width}`;
        expect(m.rows, where).toBe(1);
        expect(m.height, where).toBeLessThanOrEqual(72);
        expect(m.narrow, where).toBe(0);
        expect(m.cut, where).toEqual([]);
        expect(m.unnamed, where).toBe(0);
        expect(m.mismatched, where).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth), where).toBeLessThanOrEqual(width);
      }
    }
  });

test("телефон: в партии с роботом панель кнопок и «чей ход» видны без прокрутки", async ({ page, isMobile }) => {
  test.skip(!isMobile, "раскладка для телефона");
  await prepare(page);
  await page.goto("/chess/play#robot-1-w", { waitUntil: "networkidle" });
  // Раньше кнопки стояли под сообщением и репликой робота — на 850-м пикселе при высоте экрана 839.
  await expect(page.locator("[data-board-bar]")).toBeInViewport({ ratio: 1 });
  await expect(page.locator("[data-play-status]")).toBeInViewport({ ratio: 1 });
  await page.getByRole("button", { name: "Поворот доски" }).click();
  await expect(page.locator("[data-board]").first().locator("[data-square]").first()).toHaveAttribute(
    "data-square",
    "h1",
  );
});

// Экран задачи на телефоне — один экран, как у Lichess, Chess.com и ChessKid: строка режима, задание, доска,
// одна панель кнопок и ответ. Раньше страница занимала 1,4–1,7 экрана: под доской шли кнопка, сообщение,
// карточка «Задача из базы», выбор сложности и подвал сайта, а в теме кнопка «Подсказка» была за краем экрана.
for (const [name, url, bank] of [
  ["задачи по силам", "/chess/puzzles#practice", true],
  ["тема из базы", "/chess/puzzles#theme-backrank", true],
  ["тема с задачами школы", "/chess/puzzles#theme-mate1", false],
  ["задача дня", "/chess/puzzles#daily", false],
] as const)
  test(`телефон, ${name}: экран задачи — один экран, листать не нужно`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "раскладка для телефона");
    await prepare(page);
    const device = page.viewportSize()!;
    const overflow = () => page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    // Экран теста (412×839) и телефон поменьше (360×740).
    for (const [width, height] of [
      [device.width, device.height],
      [360, 740],
    ]) {
      const where = `${width}×${height}`;
      await page.setViewportSize({ width, height });
      await page.goto("about:blank");
      await page.goto(url, { waitUntil: "networkidle" });
      const bar = page.locator("[data-puzzle-actions]");
      await expect(bar).toBeVisible();
      // Задача из базы начинается с хода соперника — ждём сообщение о нём, оно тоже должно поместиться.
      if (bank) await expect(page.getByText(/Соперник сыграл/)).toBeVisible();
      await expect(page.locator("[data-site-header]"), where).toBeHidden();
      await expect(page.locator("[data-site-footer]"), where).toBeHidden();
      await expect(page.locator("[data-puzzle-info]"), where).toBeHidden();
      expect(await overflow(), where).toBeLessThanOrEqual(0);
      await expect(page.locator("[data-puzzle-prompt]"), where).toBeInViewport({ ratio: 1 });
      await expect(page.locator('[data-board^="puzzle-"]'), where).toBeInViewport({ ratio: 1 });
      await expect(bar, where).toBeInViewport({ ratio: 1 });
      // Под доской — только панель: один ряд кнопок.
      const tops = await bar
        .locator("button")
        .evaluateAll((list) => [...new Set(list.map((b) => Math.round(b.getBoundingClientRect().top)))]);
      expect(tops, where).toHaveLength(1);
    }
    // На экране теста и подсказка помещается без прокрутки.
    await page.setViewportSize(device);
    await page.goto("about:blank");
    await page.goto(url, { waitUntil: "networkidle" });
    if (bank) await expect(page.getByText(/Соперник сыграл/)).toBeVisible();
    await page.getByRole("button", { name: /Подсказка/ }).click();
    const answer = page.locator('[aria-live="polite"] > div').last();
    await expect(answer).toContainText("Подсказка");
    await expect(answer).toBeInViewport({ ratio: 1 });
    expect(await overflow()).toBeLessThanOrEqual(0);
    expect(await page.evaluate(() => scrollY)).toBe(0);
  });

test("телефон: сложность задач — в меню верхней строки; «закрыть» возвращает к списку задач", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "раскладка для телефона");
  await prepare(page);
  await page.goto("/chess/puzzles#practice", { waitUntil: "networkidle" });
  // Пока меню закрыто, выбора сложности на экране нет.
  await expect(page.getByRole("button", { name: "Потруднее" })).toHaveCount(0);
  const menu = page.getByRole("button", { name: "Сложность задач" });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Потруднее" }).click();
  await expect(page.getByRole("button", { name: "Потруднее" })).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).settings.puzzleLevel, KEY)).toBe("hard");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("button", { name: "Потруднее" })).toHaveCount(0);
  // Нажатие мимо меню тоже его закрывает.
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.mouse.click(8, page.viewportSize()!.height - 8);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Все задачи" }).click();
  await expect(page).toHaveURL(/#all$/);
  await expect(page.locator("[data-site-header]")).toBeVisible();
  await expect(page.locator("[data-site-footer]")).toBeVisible();
});

// Упражнение курса на телефоне: под доской одна панель — «Назад», «Подсказка», кнопки упражнения и «Дальше».
// Раньше это были два-пять рядов отдельных кнопок, и в 12 упражнениях первой ступени из 147 нижний ряд
// («← Назад / Следующее упражнение →») стоял за краем экрана 412×839.
for (const [name, hash, cells] of [
  ["отметь клетки", "c1-rook-exercise-1", 5],
  ["собери звёзды", "c1-rook-exercise-3", 4],
  ["сделай ход", "c1-game-exercise-2", 3],
  ["выбери ход", "c1-develop-exercise-2", 3],
  ["вопросы без доски", "c1-game-exercise-1", 3],
] as const)
  test(`телефон, упражнение «${name}»: одна панель под доской, страница не длиннее экрана`, async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "раскладка для телефона");
    await prepare(page);
    const device = page.viewportSize()!;
    for (const [width, height] of [
      [device.width, device.height],
      [360, 740],
    ]) {
      const where = `${width}×${height}`;
      await page.setViewportSize({ width, height });
      await page.goto("about:blank");
      await page.goto(`/chess/course#${hash}`, { waitUntil: "networkidle" });
      const bar = page.locator("[data-exercise-bar]");
      await expect(bar, where).toBeInViewport({ ratio: 1 });
      await expect(page.locator("[data-site-footer]"), where).toBeHidden();
      const buttons = bar.locator("button");
      await expect(buttons, where).toHaveCount(cells);
      const tops = await buttons.evaluateAll((list) => [
        ...new Set(list.map((b) => Math.round(b.getBoundingClientRect().top))),
      ]);
      expect(tops, where).toHaveLength(1);
      // Кроме панели, под заданием нет рядов с «Назад», «Подсказка» и «Дальше».
      await expect(page.getByRole("button", { name: /Подсказка/ }), where).toHaveCount(1);
      await expect(page.getByRole("button", { name: /Следующее упражнение/ }), where).toHaveCount(1);
      await expect(page.locator("[data-exercise-next]"), where).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollHeight - innerHeight), where).toBeLessThanOrEqual(
        0,
      );
    }
    // «Подсказка» открывает и закрывает подсказку, панель при этом стоит на месте.
    const bar = page.locator("[data-exercise-bar]");
    const before = (await bar.boundingBox())!.y;
    const hint = page.getByRole("button", { name: /Подсказка/ });
    await hint.click();
    await expect(hint).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-exercise-hint]")).toBeVisible();
    expect((await bar.boundingBox())!.y).toBe(before);
    await hint.click();
    await expect(page.locator("[data-exercise-hint]")).toHaveCount(0);
  });
