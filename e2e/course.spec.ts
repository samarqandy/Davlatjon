import { expect, test, type Page } from "@playwright/test";

/** Курс «Ступень 1»: модули и уроки, подключённые упражнения, новая цель «объяви шах», общий прогресс, узбекская версия. */
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
          settings: { hintPause: false, bigText: false, age: 9, lang: l, sound: false, animations: false },
        }),
      );
    },
    [lang, KEY] as const,
  );
}

const square = (page: Page, id: string, sq: string) =>
  page.locator(`[data-board="mo-${id}"] [data-square="${sq}"]`).click();

/**
 * Открыть урок по якорю. Если это та же страница, переход идёт без перезагрузки, и до конца гидратации
 * Next перепишет адрес на начальный — якорь пропадёт. Поэтому сначала ждём, пока страница загрузится целиком.
 */
async function openHash(page: Page, url: string) {
  await page.waitForLoadState("networkidle");
  await page.goto(url);
}

/** Урок может стоять в свёрнутом модуле (раскрыт только модуль с уроком «на очереди»): открываем модуль и урок. */
async function openLesson(page: Page, id: string) {
  const lesson = page.locator(`[data-course-lesson="${id}"]`);
  const section = page.locator("details[data-course-module]", { has: lesson });
  if (!(await section.evaluate((el) => (el as HTMLDetailsElement).open))) await section.locator("summary").click();
  await lesson.click();
}

test("курс: из школы — модули по порядку, урок открывается, номер урока в заголовке", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess");
  await page.locator('a[href="/chess/course"]').first().click();
  await expect(page.getByRole("heading", { level: 1, name: /Ступень 1/ })).toBeVisible();
  for (const id of ["board", "pieces", "value", "check"])
    await expect(page.locator(`[data-course-module="${id}"]`)).toBeVisible();
  // Путь по урокам: первый непройденный урок отмечен как «на очереди».
  await expect(page.locator('[data-course-lesson="c1-game"]')).toHaveAttribute("aria-current", "step");
  await expect(page.locator('[data-lesson-state="current"]')).toHaveCount(1);
  // Раскрыт только модуль с этим уроком: остальные — одна строка с числом уроков.
  await expect(page.locator("details[data-course-module][open]")).toHaveCount(1);
  await expect(page.locator('details[data-course-module="board"]')).toHaveAttribute("open", "");
  await expect(page.locator('[data-course-lesson="c1-check"]')).toBeHidden();
  await openLesson(page, "c1-check");
  await expect(page.getByText("Урок 13")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Шах" })).toBeVisible();
});

test("курс: «объяви шах» — ход без шаха получает подсказку, шах засчитывается", async ({ page }) => {
  await prepare(page);
  await openHash(page, "/chess/course#c1-check-exercise-2");
  await square(page, "c1-check-rook", "a1");
  await square(page, "c1-check-rook", "a5");
  await expect(page.getByText("Это не шах.")).toBeVisible();
  await page.waitForTimeout(1900);
  await square(page, "c1-check-rook", "a1");
  await square(page, "c1-check-rook", "a8");
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c1-check-rook"]?.solvedAt).toBeTruthy();
});

test("курс: упражнение из уровня подключено к уроку и делит с ним прогресс", async ({ page }) => {
  await prepare(page);
  await page.addInitScript((key) => {
    const s = JSON.parse(localStorage.getItem(key) ?? "{}");
    s.chess = { "rook-moves": { solvedAt: Date.now(), misses: 0 } };
    localStorage.setItem(key, JSON.stringify(s));
  }, KEY);
  await openHash(page, "/chess/course#c1-rook-exercises");
  await expect(page.getByRole("button", { name: /Упражнение 1: .*\(решено\)/ })).toBeVisible();
});

test("курс по-узбекски: заголовки и уроки на узбекском", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/chess/course");
  await expect(page.getByRole("heading", { level: 1, name: /1-bosqich/ })).toBeVisible();
  await openLesson(page, "c1-take");
  await expect(page.getByText("14-dars")).toBeVisible();
  expect(await page.locator("main").innerText()).not.toMatch(/[А-Яа-яЁё]/);
});

test("курс на узком телефоне: страница не шире экрана, длинные названия переносятся", async ({ browser }) => {
  for (const lang of ["ru", "uz"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 320, height: 720 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await prepare(page, lang);
    await page.goto("/chess/course");
    await expect(page.locator('[data-course-lesson="c1-lines"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await ctx.close();
  }
});

test("курс: повтор того же неверного хода снова показывает ответ (новая карточка)", async ({ page }) => {
  await prepare(page);
  await openHash(page, "/chess/course#c1-check-exercise-2");
  await square(page, "c1-check-rook", "a1");
  await square(page, "c1-check-rook", "a5");
  const card = page.getByText("Это не шах.");
  await expect(card).toBeVisible();
  await card.evaluate((el) => el.setAttribute("data-old", "1"));
  await page.waitForTimeout(1900);
  await square(page, "c1-check-rook", "a1");
  await square(page, "c1-check-rook", "a5");
  await expect(page.getByText("Это не шах.")).toBeVisible();
  await expect(page.locator("[data-old]")).toHaveCount(0);
});

test("школа: под приветствием — карточка следующего урока курса", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess");
  const next = page.locator("[data-course-continue]");
  await expect(next).toContainText("урок 1 из");
  await expect(next).toContainText("Шахматная партия");
  await next.click();
  await expect(page).toHaveURL(/\/chess\/course#c1-game$/);
});

test("курс: мат, рокировка и дебют — новые модули, мат ладьёй и рокировка засчитываются", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/course");
  for (const id of ["mate", "castle", "opening"])
    await expect(page.locator(`[data-course-module="${id}"]`)).toBeVisible();
  await openHash(page, "/chess/course#c1-mate-rook-exercise-3");
  await square(page, "c1-mate-rook-corner", "a1");
  await square(page, "c1-mate-rook-corner", "a8");
  await expect(page.getByText(/Почему так/)).toBeVisible();
  await openHash(page, "/chess/course#c1-castle-rules-exercise-1");
  await square(page, "c1-castle-only-long", "e1");
  await square(page, "c1-castle-only-long", "c1");
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c1-mate-rook-corner"]?.solvedAt).toBeTruthy();
  expect(stored["c1-castle-only-long"]?.solvedAt).toBeTruthy();
});

test("курс: вилка конём, сквозной удар и финиш ступени", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/course");
  for (const id of ["double", "tactics", "special", "finish"])
    await expect(page.locator(`[data-course-module="${id}"]`)).toBeVisible();
  await openHash(page, "/chess/course#c1-fork-knight-exercise-3");
  await square(page, "c1-fork-knight-c7", "b5");
  await square(page, "c1-fork-knight-c7", "c7");
  await expect(page.getByText(/Почему так/)).toBeVisible();
  await openHash(page, "/chess/course#c1-skewer-exercise-5");
  await square(page, "c1-skewer-rook-a5", "a1");
  await square(page, "c1-skewer-rook-a5", "a5");
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c1-fork-knight-c7"]?.solvedAt).toBeTruthy();
  expect(stored["c1-skewer-rook-a5"]?.solvedAt).toBeTruthy();
});

test("курс: «как сыграть лучше» — неверный выбор подсвечен, верный ход делается на доске", async ({ page }) => {
  await prepare(page);
  const id = "c1-stalemate-choose";
  // Пятое упражнение урока: после трёх подключённых и «Мат, а не пат».
  await openHash(page, "/chess/course#c1-stalemate-exercise-5");
  const board = page.locator(`[data-board="ch-${id}"]`);
  await expect(board).toBeVisible();
  await page.locator('[data-choice="f1f7"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="f1f8"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored[id]?.solvedAt).toBeTruthy();
});

test("ступень 2 «Конь»: страница курса, урок двойного шаха засчитывается, карточка в школе", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess");
  // Сразу видна только текущая ступень; остальные — под «Ещё разделы».
  await page.locator("[data-more-sections] summary").click();
  await expect(page.locator('a[href="/chess/course-2"]').first()).toBeVisible();
  await page.goto("/chess/course-2");
  await expect(page.getByRole("heading", { level: 1, name: /Ступень 2/ })).toBeVisible();
  for (const id of ["tactic-mates", "attack", "games"])
    await expect(page.locator(`[data-course-module="${id}"]`)).toBeVisible();
  await openHash(page, "/chess/course-2#c2-double-check-exercise-1");
  await page.locator('[data-board="mo-c2-double-check-knight"] [data-square="e6"]').click();
  await page.locator('[data-board="mo-c2-double-check-knight"] [data-square="c7"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c2-double-check-knight"]?.solvedAt).toBeTruthy();
});

test("ступень 2: открытый шах выигрывает ферзя, урок «Ловля фигур» на месте", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/course-2");
  for (const id of ["defence", "trap", "advantage", "endgame"])
    await expect(page.locator(`[data-course-module="${id}"]`)).toBeVisible();
  await openHash(page, "/chess/course-2#c2-discover-win-exercise-3");
  await page.locator('[data-board="mo-c2-discover-win-knight"] [data-square="e4"]').click();
  await page.locator('[data-board="mo-c2-discover-win-knight"] [data-square="d2"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c2-discover-win-knight"]?.solvedAt).toBeTruthy();
});

test("ступень 3 «Слон»: тактика — открытое нападение засчитывается", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess");
  // Сразу видна только текущая ступень; остальные — под «Ещё разделы».
  await page.locator("[data-more-sections] summary").click();
  await expect(page.locator('a[href="/chess/course-3"]').first()).toBeVisible();
  await page.goto("/chess/course-3");
  await expect(page.getByRole("heading", { level: 1, name: /Ступень 3/ })).toBeVisible();
  for (const id of [
    "pin-king",
    "discovered",
    "disc-attack",
    "remove-def",
    "deflection",
    "decoy",
    "smothered",
    "classics",
    "finish-3",
  ])
    await expect(page.locator(`[data-course-module="${id}"]`)).toBeVisible();
  await openHash(page, "/chess/course-3#c3-disc-attack-exercise-1");
  await page.locator('[data-choice="d4e6"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="d4f5"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c3-disc-attack-choose"]?.solvedAt).toBeTruthy();
});

test("ступень 4 «Ладья»: страница курса, мат слонами Горвица засчитывается", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess");
  // Сразу видна только текущая ступень; остальные — под «Ещё разделы».
  await page.locator("[data-more-sections] summary").click();
  await expect(page.locator('a[href="/chess/course-4"]').first()).toBeVisible();
  await page.goto("/chess/course-4");
  await expect(page.getByRole("heading", { level: 1, name: /Ступень 4/ })).toBeVisible();
  for (const id of ["horwitz", "seventh", "passer"])
    await expect(page.locator(`[data-course-module="${id}"]`)).toBeVisible();
  await openHash(page, "/chess/course-4#c4-horwitz-exercise-1");
  await page.locator('[data-board="mo-c4-horwitz-g7"] [data-square="g2"]').click();
  await page.locator('[data-board="mo-c4-horwitz-g7"] [data-square="g7"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c4-horwitz-g7"]?.solvedAt).toBeTruthy();
});

test("ступень 4: оппозиция — «как сыграть лучше» засчитывается", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/course-4");
  for (const id of ["pawns-squares", "pawn-endgame"])
    await expect(page.locator(`[data-course-module="${id}"]`)).toBeVisible();
  await openHash(page, "/chess/course-4#c4-opposition-exercise-1");
  await page.locator('[data-choice="e4e5"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="d4e5"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
});

test("ступень 4: ловушка пата — слабое превращение засчитывается", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/course-4");
  for (const id of ["kpk", "activity", "saving", "bishops-finale", "finish-4"])
    await expect(page.locator(`[data-course-module="${id}"]`)).toBeVisible();
  await openHash(page, "/chess/course-4#c4-study-exercise-1");
  await page.locator('[data-choice="c7c8q"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="c7c8r"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c4-study-underpromote"]?.solvedAt).toBeTruthy();
});

test("ступень 5 «Ферзь»: страница курса, завлечение засчитывается", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess");
  // Сразу видна только текущая ступень; остальные — под «Ещё разделы».
  await page.locator("[data-more-sections] summary").click();
  await expect(page.locator('a[href="/chess/course-5"]').first()).toBeVisible();
  await page.goto("/chess/course-5");
  await expect(page.getByRole("heading", { level: 1, name: /Ступень 5/ })).toBeVisible();
  for (const id of [
    "q-pin",
    "q-double",
    "q-deflect",
    "q-decoy",
    "q-trap",
    "q-between",
    "q-lines",
    "q-attack",
    "q-sacrifice",
    "q-defence",
    "q-classics",
    "finish-5",
  ])
    await expect(page.locator(`[data-course-module="${id}"]`)).toBeVisible();
  await openHash(page, "/chess/course-5#c5-decoy-net-exercise-1");
  await page.locator('[data-choice="c8f8"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="g6h7"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c5-decoy-net-choose"]?.solvedAt).toBeTruthy();
});

test("ступень 5: единственный ход — закрыться ладьёй нельзя, спасает ферзь", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/course-5");
  await expect(page.locator('[data-course-module="q-defence"]')).toBeVisible();
  await openHash(page, "/chess/course-5#c5-only-move-exercise-1");
  await page.locator('[data-choice="e1e3"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="d1d4"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c5-only-move-queen"]?.solvedAt).toBeTruthy();
});

// Идея Легаля: сначала позиция, где прыжок коня не проходит, — проверить важнее, чем запомнить.
test("ступень 5: идея Легаля — конь c6 мешает, верно спокойное h3", async ({ page }) => {
  await prepare(page);
  await openHash(page, "/chess/course-5#c5-legal-exercise-2");
  await expect(page.getByRole("heading", { name: "Сначала проверь" })).toBeVisible();
  await page.locator('[data-choice="f3e5"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="h2h3"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c5-legal-fails"]?.solvedAt).toBeTruthy();
});

// Партия Ласкер — Бауэр: три позиции подряд, урок проходится целиком.
test("ступень 5: жертва двух слонов — три упражнения из партии Ласкера", async ({ page }) => {
  await prepare(page);
  await openHash(page, "/chess/course-5#c5-two-bishops-exercise-1");
  await page.locator('[data-choice="e2h5"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="d3h7"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  await openHash(page, "/chess/course-5#c5-two-bishops-exercise-2");
  await page.locator('[data-choice="e5g7"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  await openHash(page, "/chess/course-5#c5-two-bishops-exercise-3");
  await page.locator('[data-choice="g4d7"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  for (const id of ["c5-two-bishops-first", "c5-two-bishops-second", "c5-two-bishops-fork"])
    expect(stored[id]?.solvedAt, id).toBeTruthy();
});

// Перекрытие: один из вариантов — превращение пешки (ход с буквой фигуры на конце).
test("ступень 5: перекрытие — сразу в ферзи нельзя, сначала конь закрывает диагональ", async ({ page }) => {
  await prepare(page);
  await openHash(page, "/chess/course-5#c5-interference-exercise-1");
  await page.locator('[data-choice="a7a8q"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="b4d5"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c5-interference-knight"]?.solvedAt).toBeTruthy();
});

// Третья позиция урока — без шаха: взятие слона и форточка пропускают мат, спасает тихий ход ладьёй.
test("ступень 5: единственный ход без шаха — форточка не спасает, спасает возвращение ладьи", async ({ page }) => {
  await prepare(page);
  await openHash(page, "/chess/course-5#c5-only-move-exercise-3");
  await expect(page.getByRole("heading", { name: "Тихая защита" })).toBeVisible();
  await page.locator('[data-choice="h2h3"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="a7a1"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["c5-only-move-quiet"]?.solvedAt).toBeTruthy();
});

test("школа: путь из пяти ступеней, текущая отмечена; на странице ступени — кнопка следующего урока", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/chess");
  const path = page.locator("[data-learn-path] a");
  await expect(path).toHaveCount(5);
  await expect(path.first()).toHaveAttribute("aria-current", "step");
  await path.first().click();
  await expect(page).toHaveURL(/\/chess\/course$/);
  const next = page.locator("[data-course-next]");
  await expect(next).toContainText("Шахматная партия");
  await next.click();
  await expect(page).toHaveURL(/\/chess\/course#c1-game$/);
});

// Бюджет экрана: в упражнении на телефоне задание и доска видны сразу — младшие дети прокрутки избегают.
test("курс на телефоне: в упражнении задание и доска целиком на одном экране, шапка сайта скрыта", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "бюджет экрана считаем для телефона");
  await prepare(page);
  await page.setViewportSize({ width: 390, height: 664 });
  await page.goto("/chess/course");
  await openHash(page, "/chess/course#c1-rook-exercise-1");

  const fits = async () => {
    const board = (await page.locator("[data-board]").first().boundingBox())!;
    const heading = (await page.locator("[data-exercise-heading]").boundingBox())!;
    expect(heading.y).toBeGreaterThanOrEqual(0);
    expect(board.y + board.height).toBeLessThanOrEqual(664);
  };
  await expect(page.locator("[data-exercise-heading]")).toBeVisible();
  await fits();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator("[data-site-header]")).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Разделы темы" })).toBeHidden();

  // Кнопок вне доски и полоски упражнений — не больше восьми.
  const controls = await page.evaluate(
    () =>
      [...document.querySelectorAll("a[href],button,input,select,summary")].filter((el) => {
        const r = el.getBoundingClientRect();
        const seen = r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0;
        return seen && !el.closest("[data-board]") && !el.closest("[data-step-strip]");
      }).length,
  );
  expect(controls).toBeLessThanOrEqual(8);

  // Полоска ведёт к другому упражнению, и доска снова на экране; книжка возвращает к уроку с вкладками.
  await page.getByRole("list", { name: "Упражнения урока" }).getByRole("button").nth(1).click();
  await expect(page).toHaveURL(/#c1-rook-exercise-2$/);
  await expect(page.locator("[data-exercise-heading]")).toBeInViewport();
  await fits();
  await page.getByRole("button", { name: "К уроку" }).click();
  await expect(page.getByRole("navigation", { name: "Разделы темы" })).toBeVisible();
  await expect(page.locator("[data-site-header]")).toBeVisible();
});

test("курс на телефоне: упражнение решено — «дальше» само появляется внизу экрана; ошибка даёт мягкий сигнал", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "панель «дальше» внизу экрана — только на телефоне");
  await prepare(page);
  await page.addInitScript(() => {
    const w = window as unknown as { __answer: string[] };
    w.__answer = [];
    window.addEventListener("answer-sfx", (e) => w.__answer.push((e as CustomEvent<string>).detail));
  });
  await page.setViewportSize({ width: 390, height: 664 });
  await page.goto("/chess/course");
  await openHash(page, "/chess/course#c1-rook-exercise-1");
  const mark = (sq: string) => page.locator(`[data-board] [data-square="${sq}"]`).first().click();
  // «Дальше» — крайняя кнопка панели под доской: она всегда на экране, а после решения становится главной.
  const bar = page.locator("[data-exercise-bar]");
  const next = bar.getByRole("button", { name: "Следующее упражнение →" });
  await expect(page.locator("[data-exercise-heading]")).toBeVisible();
  await expect(bar).toBeInViewport({ ratio: 1 });
  await expect(next).toHaveAttribute("data-exercise-onward", "open");
  // Отдельной панели «дальше» внизу экрана больше нет.
  await expect(page.locator("[data-exercise-next]")).toHaveCount(0);

  // Отмечена одна лишняя клетка — ответ неверный: сигнал есть, «Дальше» главной не стала.
  await mark("a1");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __answer: string[] }).__answer))
    .toEqual(["retry"]);
  await expect(next).toHaveAttribute("data-exercise-onward", "open");

  await mark("a1");
  for (const sq of ["d1", "d2", "d3", "d5", "d6", "d7", "d8", "a4", "b4", "c4", "e4", "f4", "g4", "h4"]) await mark(sq);
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(next).toHaveAttribute("data-exercise-onward", "ready");
  await expect(next).toBeInViewport({ ratio: 1 });
  // Кнопка «дальше» на экране одна.
  await expect(page.getByRole("button", { name: "Следующее упражнение →" })).toHaveCount(1);
  await next.click();
  await expect(page).toHaveURL(/#c1-rook-exercise-2$/);
  await expect(page.locator("[data-exercise-onward]")).toHaveAttribute("data-exercise-onward", "open");
});
