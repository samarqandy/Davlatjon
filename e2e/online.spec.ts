import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import {
  applyAction,
  checkMessage,
  checkUsername,
  isError,
  newGameRow,
  pairKey,
  settle,
  timeControlOf,
  viewOf,
  type Action,
  type GameRow,
} from "../src/lib/online";

/**
 * Два игрока в двух браузерах и один «сервер» в памяти: правила партии и проверка текста — настоящие
 * (src/lib/online.ts), хранилище заменено простыми таблицами. Так проверяется весь путь: имя → друзья → партия → переписка.
 */
class FakeServer {
  names = new Map<string, string>();
  friends = new Set<string>();
  requests: { from: string; to: string }[] = [];
  games = new Map<string, GameRow>();
  messages: { id: number; from: string; to: string; text: string }[] = [];
  nextGame = 1;

  idOf(name: string) {
    return [...this.names].find(([, n]) => n === name)?.[0];
  }
  nameOf(id: string) {
    return this.names.get(id) ?? "?";
  }
  view(g: GameRow, me: string) {
    const now = Date.now();
    return viewOf(g, me, { w: this.nameOf(g.white), b: this.nameOf(g.black) }, now);
  }

  handle(me: string, method: string, url: URL, body: Record<string, unknown>): { status: number; json: unknown } {
    const path = url.pathname;
    const err = (status: number, error: string) => ({ status, json: { error } });
    const ok = (json: unknown) => ({ status: 200, json });
    if (path === "/api/play/me") {
      if (method === "POST" && body.username !== undefined) {
        const c = checkUsername(body.username);
        if (!c.ok) return err(400, "invalid-name");
        if (this.idOf(c.name) && this.idOf(c.name) !== me) return err(409, "taken");
        this.names.set(me, c.name);
      }
      const name = this.names.get(me);
      return ok({ profile: name ? { username: name, onlineOk: true, chatOk: true, findable: true } : null });
    }
    if (!this.names.has(me)) return err(409, "no-profile");
    const myName = this.nameOf(me);
    if (path === "/api/play/search") {
      const q = (url.searchParams.get("q") ?? "").toLowerCase();
      if (q.length < 3) return err(400, "short");
      const users = [...this.names]
        .filter(([id, n]) => id !== me && n.startsWith(q))
        .map(([id, username]) => ({
          username,
          relation: this.friends.has(pairKey(me, id))
            ? "friend"
            : this.requests.some((r) => r.from === me && r.to === id)
              ? "outgoing"
              : "none",
        }));
      return ok({ users });
    }
    if (path === "/api/play/friends") {
      if (method === "POST") {
        const other = this.idOf(String(body.username));
        if (!other) return err(404, "no-user");
        if (body.action === "request") this.requests.push({ from: me, to: other });
        if (body.action === "accept") {
          this.requests = this.requests.filter((r) => !(r.from === other && r.to === me));
          this.friends.add(pairKey(me, other));
        }
        return ok(body.action === "request" ? { status: "pending" } : { ok: true });
      }
      const friends = [...this.friends]
        .filter((p) => p.split("|").includes(me))
        .map((p) => ({
          username: this.nameOf(p.split("|").find((x) => x !== me)!),
          online: true,
          chatOk: true,
          unread: 0,
        }));
      return ok({
        friends,
        incoming: this.requests.filter((r) => r.to === me).map((r) => ({ username: this.nameOf(r.from) })),
        outgoing: this.requests.filter((r) => r.from === me).map((r) => ({ username: this.nameOf(r.to) })),
      });
    }
    if (path === "/api/play/games") {
      if (method === "POST") {
        const other = this.idOf(String(body.friend));
        const tc = timeControlOf(body.tc);
        if (!other || !tc) return err(400, "bad");
        const mine = body.color === "b" ? "b" : "w";
        const g = newGameRow({
          id: `game${this.nextGame++}xx`,
          white: mine === "w" ? me : other,
          black: mine === "w" ? other : me,
          invitedBy: me,
          tc,
          now: Date.now(),
        });
        this.games.set(g.id, g);
        return ok({ game: this.view(g, me) });
      }
      const games = [...this.games.values()]
        .filter((g) => g.white === me || g.black === me)
        .map((g) => this.view(g, me));
      return ok({ games });
    }
    if (path === "/api/play/game") {
      const id = method === "GET" ? (url.searchParams.get("id") ?? "") : String(body.id);
      let g = this.games.get(id);
      if (!g || (g.white !== me && g.black !== me)) return err(404, "not-found");
      g = settle(g, Date.now());
      if (method === "POST") {
        const action: Action =
          body.action === "move" ? { type: "move", uci: String(body.uci) } : ({ type: body.action } as Action);
        const next = applyAction(g, me, action, Date.now());
        if (isError(next)) return err(400, next);
        g = { ...next, version: g.version + 1 };
      }
      this.games.set(id, g);
      return ok({ game: this.view(g, me) });
    }
    if (path === "/api/play/messages") {
      const other = this.idOf(String(method === "GET" ? url.searchParams.get("friend") : body.friend));
      if (!other) return err(404, "no-user");
      if (method === "POST") {
        const c = checkMessage(body.text);
        if (!c.ok) return err(400, c.error);
        this.messages.push({ id: this.messages.length + 1, from: me, to: other, text: c.text });
        return ok({ id: this.messages.length });
      }
      const after = Number(url.searchParams.get("after") ?? 0);
      const messages = this.messages
        .filter((m) => m.id > after && ((m.from === me && m.to === other) || (m.from === other && m.to === me)))
        .map((m) => ({ id: m.id, mine: m.from === me, text: m.text, at: Date.now() }));
      void myName;
      return ok({ messages });
    }
    return err(404, "unknown");
  }
}

async function login(context: BrowserContext, server: FakeServer, userId: string, extra: Record<string, unknown> = {}) {
  await context.addInitScript((extraSettings) => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key))
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 9, sound: false, ...extraSettings },
        }),
      );
  }, extra);
  await context.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === "/api/auth/me") {
      return route.fulfill({
        json: {
          user: { name: "Parent", provider: "google" },
          providers: { google: true, telegram: false },
          reports: false,
        },
      });
    }
    if (!url.pathname.startsWith("/api/play/")) return route.fulfill({ status: 401, json: { error: "unauthorized" } });
    let body: Record<string, unknown> = {};
    try {
      body = request.postDataJSON() ?? {};
    } catch {
      body = {};
    }
    const res = server.handle(userId, request.method(), url, body);
    return route.fulfill({ status: res.status, json: res.json });
  });
}

const square = (page: Page, sq: string) => page.locator(`[data-board="online"] [data-square="${sq}"]`);
const move = async (page: Page, from: string, to: string) => {
  await square(page, from).click();
  await square(page, to).click();
};

test("два друга: имя → поиск → дружба → партия по сети → ход, переписка, сдача", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name === "phone", "Сценарий на двух экранах — достаточно настольного");
  test.setTimeout(120_000);
  const server = new FakeServer();
  const annaCtx = await browser.newContext();
  const bekCtx = await browser.newContext();
  await login(annaCtx, server, "google:anna");
  await login(bekCtx, server, "google:bek");
  const anna = await annaCtx.newPage();
  const bek = await bekCtx.newPage();
  const slow = { timeout: 15_000 };

  // Имена.
  await anna.goto("/chess/online");
  await anna.locator("[data-username-input]").fill("x");
  await expect(anna.getByRole("button", { name: "Сохранить" })).toBeDisabled();
  await anna.locator("[data-username-input]").fill("Anna_K");
  await anna.getByRole("button", { name: "Сохранить" }).click();
  await expect(anna.locator("[data-my-username]")).toHaveText("anna_k");
  await bek.goto("/chess/online");
  await bek.locator("[data-username-input]").fill("anna_k");
  await bek.getByRole("button", { name: "Сохранить" }).click();
  await expect(bek.getByText("Это имя уже занято")).toBeVisible();
  await bek.locator("[data-username-input]").fill("bek_zod");
  await bek.getByRole("button", { name: "Сохранить" }).click();
  await expect(bek.locator("[data-my-username]")).toHaveText("bek_zod");

  // Поиск и дружба.
  await anna.locator("[data-find-input]").fill("bek");
  await anna.getByRole("button", { name: "Искать" }).click();
  await anna.locator("[data-hits]").getByRole("button", { name: "Подружиться" }).click();
  await expect(anna.getByText("просьба отправлена")).toBeVisible();
  await expect(bek.locator("[data-requests]")).toContainText("anna_k", slow);
  await bek.locator("[data-requests]").getByRole("button", { name: "Принять" }).click();
  await expect(bek.locator('[data-friend="anna_k"]')).toBeVisible(slow);
  await expect(anna.locator('[data-friend="bek_zod"]')).toBeVisible(slow);

  // Вызов на партию (без часов, белыми).
  await anna
    .locator('[data-friend="bek_zod"]')
    .getByRole("button", { name: /Играть/ })
    .click();
  await anna.locator("[data-challenge]").getByRole("button", { name: "белыми" }).click();
  await anna.locator("[data-challenge]").getByRole("button", { name: "без часов" }).click();
  await anna.getByRole("button", { name: "Позвать на партию" }).click();
  await expect(anna).toHaveURL(/\/chess\/online\/game1xx$/);
  await expect(anna.locator("[data-online-status]")).toContainText("Ждём, когда bek_zod ответит");
  await expect(bek.locator("[data-invites]")).toContainText("anna_k", slow);
  await bek.locator("[data-invites]").getByRole("button", { name: "Принять" }).click();
  await expect(bek).toHaveURL(/\/chess\/online\/game1xx$/);
  await expect(anna.locator("[data-online-status]")).toContainText("Твой ход", slow);
  await expect(bek.locator("[data-online-status]")).toContainText("anna_k думает", slow);

  // Ходы по очереди.
  await move(anna, "e2", "e4");
  await expect(bek.locator("[data-online-status]")).toContainText("Твой ход", slow);
  await move(bek, "e7", "e5");
  await expect(anna.locator("[data-online-status]")).toContainText("Твой ход", slow);
  expect(server.games.get("game1xx")!.moves).toEqual(["e2e4", "e7e5"]);
  // Ходить не в свою очередь нельзя: доска просто не реагирует.
  await move(bek, "g8", "f6");
  expect(server.games.get("game1xx")!.moves).toHaveLength(2);

  // Переписка: безопасный текст проходит, ссылка — нет.
  const chat = anna.locator('[data-chat="bek_zod"]');
  await chat.getByLabel("Сообщение").fill("Хорошая партия!");
  await chat.getByRole("button", { name: "Отправить" }).click();
  await expect(bek.locator('[data-chat="anna_k"]')).toContainText("Хорошая партия!", slow);
  await chat.getByLabel("Сообщение").fill("зайди на https://example.com");
  await chat.getByRole("button", { name: "Отправить" }).click();
  await expect(chat.getByRole("alert")).toContainText("Ссылки");

  // Сдача: обоим показывается итог.
  await bek.getByRole("button", { name: /Сдаться/ }).click();
  await bek.getByRole("button", { name: "Да, сдаться" }).click();
  await expect(bek.locator("[data-online-status]")).toContainText("закончена сдачей", slow);
  await expect(anna.locator("[data-online-status]")).toContainText("Победа", slow);
  await expect(anna.locator("[data-online-status]")).toContainText("Соперник сдался");

  await annaCtx.close();
  await bekCtx.close();
});

test("без входа игра по сети просит войти, а на сайте без входа — объясняет", async ({ page }) => {
  await page.route("**/api/auth/me", (route) =>
    route.fulfill({ json: { user: null, providers: { google: true, telegram: false }, reports: false } }),
  );
  await page.goto("/chess/online");
  await expect(page.getByText("Чтобы играть по сети, нужен вход")).toBeVisible();
  await expect(page.getByRole("link", { name: /Войти через Google/ })).toBeVisible();

  await page.unroute("**/api/auth/me");
  await page.route("**/api/auth/me", (route) =>
    route.fulfill({ json: { user: null, providers: { google: false, telegram: false }, reports: false } }),
  );
  await page.goto("/chess/online");
  await expect(page.getByText("Игра по сети появится")).toBeVisible();
});

test("на странице «Играть» есть вход в игру с друзьями", async ({ page }) => {
  await page.goto("/chess/play");
  await page.locator("[data-online-link]").click();
  await expect(page).toHaveURL(/\/chess\/online$/);
});

test("экран друзей и партия не шире экрана телефона", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "phone", "проверка нужна для телефона");
  const server = new FakeServer();
  server.names.set("google:anna", "anna_k");
  server.names.set("google:bek", "bek_zod");
  server.friends.add(pairKey("google:anna", "google:bek"));
  const g = newGameRow({
    id: "game1xx",
    white: "google:anna",
    black: "google:bek",
    invitedBy: "google:bek",
    tc: timeControlOf("10+0")!,
    now: Date.now(),
  });
  server.games.set("game1xx", { ...g, status: "active" });
  const ctx = await browser.newContext({ ...testInfo.project.use });
  await login(ctx, server, "google:anna");
  const page = await ctx.newPage();
  for (const path of ["/chess/online", "/chess/online/game1xx"]) {
    await page.goto(path);
    await expect(page.locator("[data-friend], [data-online-game]").first()).toBeVisible({ timeout: 15_000 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
  await ctx.close();
});

test("по-узбекски друзья, партия и переписка без русских букв", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name === "phone", "достаточно настольного");
  const server = new FakeServer();
  server.names.set("google:anna", "anna_k");
  server.names.set("google:bek", "bek_zod");
  server.friends.add(pairKey("google:anna", "google:bek"));
  server.requests.push({ from: "google:bek", to: "google:anna" });
  const g = newGameRow({
    id: "game1xx",
    white: "google:anna",
    black: "google:bek",
    invitedBy: "google:bek",
    tc: timeControlOf("10+0")!,
    now: Date.now(),
  });
  server.games.set("game1xx", {
    ...g,
    status: "active",
    moves: ["e2e4", "e7e5"],
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
  });
  const ctx = await browser.newContext();
  await login(ctx, server, "google:anna", { lang: "uz" });
  const page = await ctx.newPage();
  const noCyrillic = async () => {
    const text = await page.locator("main").innerText();
    expect(text.match(/[\u0400-\u04FF]/g) ?? []).toEqual([]);
  };
  await page.goto("/chess/online");
  await expect(page.locator('[data-friend="bek_zod"]')).toBeVisible({ timeout: 15_000 });
  await page
    .locator('[data-friend="bek_zod"]')
    .getByRole("button", { name: /Yozish/ })
    .click();
  await page
    .locator('[data-friend="bek_zod"]')
    .getByRole("button", { name: /Oʻynash/ })
    .click();
  await noCyrillic();
  await page.goto("/chess/online/game1xx");
  await expect(page.locator("[data-online-status]")).toContainText("Navbat senda", { timeout: 15_000 });
  await noCyrillic();
  await ctx.close();
});
