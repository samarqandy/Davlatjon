/** Аккаунт: подпись сессии, проверка входа через Telegram и Google, слияние прогресса двух устройств. */
import { describe, expect, it } from "vitest";
import { authConfig, availableProviders } from "@/lib/server/config";
import { googleAuthUrl, parseGoogleIdToken, pkceChallenge } from "@/lib/server/google";
import { SCHEMA, neonStore, sqlStore, type SqlQuery } from "@/lib/server/progressStore";
import { safeBack } from "@/lib/server/request";
import { createSession, readSession } from "@/lib/server/session";
import { telegramHash, verifyTelegram } from "@/lib/server/telegram";
import { DEFAULT_STATE, type AppState } from "@/lib/state";
import { mergeStates, sameProgress } from "@/lib/sync";

const SECRET = "x".repeat(40);

describe("сессия", () => {
  it("подписанная cookie читается, подделанная и просроченная — нет", () => {
    const token = createSession({ id: "tg:1", provider: "telegram", name: "Ota" }, SECRET, 1000);
    expect(readSession(token, SECRET, 2000)?.id).toBe("tg:1");
    expect(readSession(token, "y".repeat(40), 2000)).toBeNull();
    const [body, mac] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ id: "tg:2", exp: 9e9 })).toString("base64url");
    expect(readSession(`${forged}.${mac}`, SECRET, 2000)).toBeNull();
    expect(readSession(`${body}.${mac}`, SECRET, 1000 + 181 * 86400)).toBeNull();
    expect(readSession(undefined, SECRET)).toBeNull();
  });

  it("возврат после входа — только на страницу этого сайта", () => {
    expect(safeBack("/parent/settings")).toBe("/parent/settings");
    expect(safeBack("https://evil.example")).toBe("/parent/settings");
    expect(safeBack("//evil.example")).toBe("/parent/settings");
    expect(safeBack(null)).toBe("/parent/settings");
  });
});

describe("вход через Telegram", () => {
  const bot = "123456:ABC-token";
  const data = { id: "42", first_name: "Aziz", username: "aziz", auth_date: "1000" };

  it("подпись Telegram проверяется, чужая и старая — отклоняются", () => {
    const hash = telegramHash(data, bot);
    expect(verifyTelegram({ ...data, hash }, bot, 1100)?.id).toBe("42");
    expect(verifyTelegram({ ...data, hash }, "другой:токен", 1100)).toBeNull();
    expect(verifyTelegram({ ...data, first_name: "Bobur", hash }, bot, 1100)).toBeNull();
    expect(verifyTelegram({ ...data, hash }, bot, 1000 + 2 * 86400)).toBeNull();
  });
});

describe("вход через Google", () => {
  const claims = (c: Record<string, unknown>) => `h.${Buffer.from(JSON.stringify(c)).toString("base64url")}.s`;

  it("ссылка на вход содержит PKCE и state", () => {
    const url = new URL(googleAuthUrl({ clientId: "cid", redirectUri: "https://x/cb", state: "st", verifier: "v" }));
    expect(url.searchParams.get("code_challenge")).toBe(pkceChallenge("v"));
    expect(url.searchParams.get("state")).toBe("st");
    expect(url.searchParams.get("scope")).toBe("openid email profile");
  });

  it("id_token: проверяются издатель, получатель и срок", () => {
    const ok = claims({ iss: "https://accounts.google.com", aud: "cid", sub: "7", name: "Ona", exp: 2000 });
    expect(parseGoogleIdToken(ok, "cid", 1000)).toEqual({ sub: "7", name: "Ona", email: undefined });
    expect(parseGoogleIdToken(ok, "other", 1000)).toBeNull();
    expect(parseGoogleIdToken(ok, "cid", 3000)).toBeNull();
    expect(parseGoogleIdToken(claims({ iss: "evil", aud: "cid", sub: "7", exp: 2000 }), "cid", 1000)).toBeNull();
  });
});

describe("настройки входа", () => {
  it("без секрета, хранилища или ключей провайдера вход выключен", () => {
    expect(availableProviders(authConfig({}))).toEqual({ google: false, telegram: false, botName: undefined });
    const full = authConfig({
      AUTH_SECRET: SECRET,
      GOOGLE_CLIENT_ID: "id",
      GOOGLE_CLIENT_SECRET: "s",
      TELEGRAM_BOT_TOKEN: "1:t",
      TELEGRAM_BOT_NAME: "@lab_bot",
      DATABASE_URL: "postgresql://u:p@ep-x.neon.tech/neondb?sslmode=require",
    });
    expect(availableProviders(full)).toEqual({ google: true, telegram: true, botName: "lab_bot" });
    expect(full.storage?.databaseUrl).toBe("postgresql://u:p@ep-x.neon.tech/neondb?sslmode=require");
    expect(availableProviders({ ...full, secret: "short" }).google).toBe(false);
    // Без базы входить некуда; вместо DATABASE_URL подходит POSTGRES_URL, мусор — нет.
    expect(availableProviders({ ...full, storage: undefined }).google).toBe(false);
    expect(authConfig({ POSTGRES_URL: "postgres://u:p@h/db" }).storage?.databaseUrl).toBe("postgres://u:p@h/db");
    expect(authConfig({ DATABASE_URL: "file:./dev.db" }).storage).toBeUndefined();
  });

  it("хранилище: таблица создаётся один раз, запись — upsert, прогресс уходит как JSON", async () => {
    const calls: { text: string; params?: unknown[] }[] = [];
    let failSchema = 1;
    const query: SqlQuery = async (text, params) => {
      calls.push({ text, params });
      if (text === SCHEMA && failSchema-- > 0) throw new Error("гонка двух create table");
      if (text.startsWith("select"))
        return params?.[0] === "tg:1" ? [{ state: { a: 1 }, updated_at: new Date("2026-09-28T10:00:00Z") }] : [];
      return [];
    };
    const store = sqlStore(query);
    expect(await store.get("tg:1")).toEqual({ state: { a: 1 }, updatedAt: "2026-09-28T10:00:00.000Z" });
    expect(await store.get("tg:2")).toBeNull();
    await store.put("tg:1", { b: [2], note: "a\u0000b \\u0000" });
    expect(calls.filter((c) => c.text === SCHEMA)).toHaveLength(2);
    const upsert = calls.at(-1)!;
    expect(upsert.text).toMatch(/on conflict \(user_id\) do update/);
    expect(upsert.params).toEqual(["tg:1", '{"b":[2],"note":"ab \\\\u0000"}']);
  });

  it("хранилище: если база недоступна, следующий запрос пробует снова", async () => {
    let up = false;
    const store = sqlStore(async () => {
      if (!up) throw new Error("нет связи");
      return [];
    });
    await expect(store.get("tg:1")).rejects.toThrow("нет связи");
    up = true;
    expect(await store.get("tg:1")).toBeNull();
  });

  it("хранилище Neon: кривая строка подключения — ошибка запроса, а не падение при создании", async () => {
    const store = neonStore("postgresql://oops");
    expect(neonStore("postgresql://oops")).toBe(store);
    await expect(store.get("tg:1")).rejects.toThrow(/connection string/i);
  });
});

describe("слияние прогресса", () => {
  const base = (patch: Partial<AppState>): AppState => ({ ...DEFAULT_STATE, ...patch });

  it("решённое на любом устройстве остаётся решённым, счётчики — наибольшие", () => {
    const phone = base({
      tasks: {
        t1: { status: "solved", hints: 1, checks: 2, missed: 1, timeMs: 5000, solvedAt: 200, marks: { liked: true } },
      },
    });
    const laptop = base({
      tasks: {
        t1: { status: "started", hints: 3, checks: 1, missed: 0, timeMs: 9000, marks: { explained: true } },
        t2: { status: "solved", hints: 0, checks: 1, missed: 0, timeMs: 100, solvedAt: 50, firstTry: true, marks: {} },
      },
    });
    const m = mergeStates(phone, laptop);
    expect(m.tasks.t1).toMatchObject({ status: "solved", hints: 3, checks: 2, timeMs: 9000, solvedAt: 200 });
    expect(m.tasks.t1.marks).toEqual({ liked: true, explained: true });
    expect(m.tasks.t2.firstTry).toBe(true);
    expect(sameProgress(mergeStates(phone, laptop), mergeStates(laptop, phone))).toBe(true);
  });

  it("партии и задачи объединяются, рекорды не теряются, настройки — с этого устройства", () => {
    const game = { id: "g1", at: 10, mode: "robot" as const, color: "w" as const, result: "win" as const, moves: 30 };
    const a = base({
      chessGames: [game],
      chessPuzzles: { p1: { misses: 1, solvedAt: 100, box: 2, due: "2026-10-01" } },
      chessDrills: { find: 12 },
      settings: { ...DEFAULT_STATE.settings, lang: "uz" },
    });
    const b = base({
      chessGames: [
        { ...game, analysis: { evals: [0], best: [null] } },
        { ...game, id: "g2", at: 20 },
      ],
      chessPuzzles: { p1: { misses: 3, solvedAt: 90, box: 3, due: "2026-10-05" } },
      chessDrills: { find: 20, storm: 5 },
      chessStreak: 7,
      settings: { ...DEFAULT_STATE.settings, age: 9, lang: "ru" },
    });
    const m = mergeStates(a, b);
    expect(m.chessGames.map((g) => g.id)).toEqual(["g2", "g1"]);
    expect(m.chessGames.find((g) => g.id === "g1")?.analysis).toBeDefined();
    expect(m.chessPuzzles.p1).toEqual({ misses: 3, solvedAt: 90, box: 3, due: "2026-10-05" });
    expect(m.chessDrills).toEqual({ find: 20, storm: 5 });
    expect(m.chessStreak).toBe(7);
    expect(m.settings.lang).toBe("uz");
    expect(m.settings.age).toBe(9);
  });

  it("мусор из сети не ломает прогресс", () => {
    const local = base({ chessStreak: 3 });
    expect(mergeStates(local, "не json").chessStreak).toBe(3);
    expect(mergeStates(local, null).chessStreak).toBe(3);
  });
});
