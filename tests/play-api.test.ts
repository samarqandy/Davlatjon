/** Обработчики /api/play целиком: вход по cookie, имя, друзья, партия и сообщение — на настоящем Postgres (PGlite). */
import { PGlite } from "@electric-sql/pglite";
import { NextRequest } from "next/server";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SESSION_COOKIE, createSession } from "@/lib/server/session";

const SECRET = "s".repeat(40);
let db: PGlite;
let realStore: import("@/lib/server/playStore").PlayStore;

vi.mock("@/lib/server/playStore", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/server/playStore")>();
  return { ...mod, neonPlayStore: () => realStore };
});

beforeAll(async () => {
  process.env.AUTH_SECRET = SECRET;
  process.env.DATABASE_URL = "postgres://test:test@localhost/test";
  db = new PGlite();
  const mod = await import("@/lib/server/playStore");
  realStore = mod.playStore(
    async (text, params) => (await db.query(text, params as unknown[])).rows as Record<string, unknown>[],
  );
  await realStore.ensure();
}, 60_000);

beforeEach(async () => {
  await db.exec(
    "truncate lab_profiles, lab_friends, lab_games, lab_messages, lab_reads, lab_progress restart identity",
  );
});

afterAll(async () => {
  await db.close();
});

const cookieFor = (id: string) =>
  `${SESSION_COOKIE}=${createSession({ id, provider: "google", name: "Parent" }, SECRET)}`;

async function call(
  route: { GET?: (r: NextRequest) => Promise<Response>; POST?: (r: NextRequest) => Promise<Response> },
  as: string | null,
  method: "GET" | "POST",
  path: string,
  body?: unknown,
) {
  const req = new NextRequest(`http://localhost:3000${path}`, {
    method,
    headers: { ...(as ? { cookie: cookieFor(as) } : {}), "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const res = await (method === "GET" ? route.GET! : route.POST!)(req);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { status: res.status, json: (await res.json()) as Record<string, any> };
}

describe("/api/play", () => {
  it("без входа — 401; без имени — 409; имя выбирается один раз на аккаунт", async () => {
    const me = await import("@/app/api/play/me/route");
    const friends = await import("@/app/api/play/friends/route");
    expect((await call(me, null, "GET", "/api/play/me")).status).toBe(401);
    expect(await call(me, "google:1", "GET", "/api/play/me")).toMatchObject({ status: 200, json: { profile: null } });
    expect((await call(friends, "google:1", "GET", "/api/play/friends")).status).toBe(409);
    expect((await call(me, "google:1", "POST", "/api/play/me", { username: "x" })).json.error).toBe("invalid-name");
    const set = await call(me, "google:1", "POST", "/api/play/me", { username: "Anna_07" });
    expect(set.json.profile).toMatchObject({ username: "anna_07", onlineOk: true, chatOk: true, findable: true });
    expect((await call(me, "tg:2", "POST", "/api/play/me", { username: "anna_07" })).status).toBe(409);
    const prefs = await call(me, "google:1", "POST", "/api/play/me", { chatOk: false });
    expect(prefs.json.profile.chatOk).toBe(false);
  });

  it("поиск → дружба → партия → ход → сообщение", async () => {
    const me = await import("@/app/api/play/me/route");
    const search = await import("@/app/api/play/search/route");
    const friends = await import("@/app/api/play/friends/route");
    const games = await import("@/app/api/play/games/route");
    const game = await import("@/app/api/play/game/route");
    const messages = await import("@/app/api/play/messages/route");

    await call(me, "u1", "POST", "/api/play/me", { username: "anna" });
    await call(me, "u2", "POST", "/api/play/me", { username: "bekzod" });

    expect((await call(search, "u1", "GET", "/api/play/search?q=be")).json.error).toBe("short");
    expect((await call(search, "u1", "GET", "/api/play/search?q=bek")).json.users).toEqual([
      { username: "bekzod", relation: "none" },
    ]);
    expect(
      (await call(friends, "u1", "POST", "/api/play/friends", { action: "request", username: "bekzod" })).json,
    ).toEqual({ status: "pending" });
    expect((await call(friends, "u2", "GET", "/api/play/friends")).json.incoming).toEqual([{ username: "anna" }]);
    expect(
      (await call(friends, "u2", "POST", "/api/play/friends", { action: "accept", username: "anna" })).json,
    ).toEqual({ ok: true });

    const made = await call(games, "u1", "POST", "/api/play/games", { friend: "bekzod", color: "w", tc: "10+0" });
    expect(made.status).toBe(200);
    const id = made.json.game.id as string;
    expect(
      (await call(games, "u1", "POST", "/api/play/games", { friend: "bekzod", color: "w", tc: "7+7" })).status,
    ).toBe(400);
    expect((await call(game, "u2", "POST", "/api/play/game", { id, action: "accept" })).json.game.status).toBe(
      "active",
    );
    expect((await call(game, "u2", "POST", "/api/play/game", { id, action: "move", uci: "e7e5" })).json.error).toBe(
      "not-your-turn",
    );
    const moved = await call(game, "u1", "POST", "/api/play/game", { id, action: "move", uci: "e2e4" });
    expect(moved.json.game).toMatchObject({ you: "w", turn: "b", moves: ["e2e4"] });
    expect((await call(game, "u2", "GET", `/api/play/game?id=${id}`)).json.game).toMatchObject({
      you: "b",
      white: "anna",
    });
    expect((await call(game, "u1", "GET", "/api/play/game?id=../etc")).status).toBe(404);
    expect((await call(games, "u2", "GET", "/api/play/games")).json.games).toHaveLength(1);

    expect(
      (await call(messages, "u1", "POST", "/api/play/messages", { friend: "bekzod", text: "Yaxshi yurish!" })).status,
    ).toBe(200);
    expect(
      (await call(messages, "u1", "POST", "/api/play/messages", { friend: "bekzod", text: "t.me/xxx" })).json.error,
    ).toBe("link");
    expect((await call(friends, "u2", "GET", "/api/play/friends")).json.friends[0].unread).toBe(1);
    expect((await call(messages, "u2", "GET", "/api/play/messages?friend=anna")).json.messages).toMatchObject([
      { mine: false, text: "Yaxshi yurish!" },
    ]);
  });

  it("запрос с чужого сайта на изменение отклоняется", async () => {
    const me = await import("@/app/api/play/me/route");
    const req = new NextRequest("http://localhost:3000/api/play/me", {
      method: "POST",
      headers: { cookie: cookieFor("u9"), origin: "https://evil.example", "content-type": "application/json" },
      body: JSON.stringify({ username: "hacker" }),
    });
    const res = await me.POST(req);
    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/account", () => {
  it("без входа — 401; со входа стирает данные и завершает сеанс; запрос с чужого сайта отклоняется", async () => {
    const me = await import("@/app/api/play/me/route");
    const account = await import("@/app/api/account/route");
    await call(me, "u1", "POST", "/api/play/me", { username: "anna" });
    await db.query("insert into lab_progress (user_id, state) values ('u1', '{}'::jsonb), ('u1#p3k9x', '{}'::jsonb)");

    const anon = new NextRequest("http://localhost:3000/api/account", { method: "DELETE" });
    expect((await account.DELETE(anon)).status).toBe(401);
    const foreign = new NextRequest("http://localhost:3000/api/account", {
      method: "DELETE",
      headers: { cookie: cookieFor("u1"), origin: "https://evil.example" },
    });
    expect((await account.DELETE(foreign)).status).toBe(403);
    expect((await call(me, "u1", "GET", "/api/play/me")).json.profile).not.toBeNull();

    const real = new NextRequest("http://localhost:3000/api/account", {
      method: "DELETE",
      headers: { cookie: cookieFor("u1") },
    });
    const res = await account.DELETE(real);
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toContain(`${SESSION_COOKIE}=;`);
    expect((await call(me, "u1", "GET", "/api/play/me")).json.profile).toBeNull();
    expect((await db.query("select count(*)::int as n from lab_progress")).rows[0]).toEqual({ n: 0 });
  });
});
