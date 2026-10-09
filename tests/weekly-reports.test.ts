/** Еженедельная рассылка итогов в Telegram: кто получает, что отправляется, как устроена защита. */
import { describe, expect, it } from "vitest";
import { allTasks } from "@/content/program";
import { authConfig, weeklyReportsAvailable } from "@/lib/server/config";
import { sqlStore, type ProgressStore, type SqlQuery } from "@/lib/server/progressStore";
import { sendTelegramMessage, type SendResult } from "@/lib/server/telegram";
import { messageFor, sendWeeklyReports } from "@/lib/server/weeklyReports";
import { DEFAULT_STATE, type AppState } from "@/lib/state";

const day = (d: string) => new Date(`${d}T12:00:00`).getTime();
const NOW = day("2026-10-11"); // воскресенье
const [t1] = allTasks();

const active = (lang: "ru" | "uz" = "ru"): AppState => ({
  ...DEFAULT_STATE,
  settings: { ...DEFAULT_STATE.settings, lang, childName: "Aziz", reportToTelegram: true },
  tasks: {
    [t1.id]: {
      status: "solved",
      solvedAt: day("2026-10-08"),
      hints: 1,
      checks: 1,
      missed: 0,
      timeMs: 120_000,
      marks: {},
    },
  },
});

const fakeStore = (rows: { userId: string; state: unknown }[]): ProgressStore => ({
  get: async () => null,
  put: async () => undefined,
  telegramRecipients: async () => rows,
});

describe("настройка рассылки", () => {
  const env = {
    AUTH_SECRET: "s".repeat(40),
    DATABASE_URL: "postgres://u:p@h/db",
    TELEGRAM_BOT_TOKEN: "1:abc",
    TELEGRAM_BOT_NAME: "bot",
  };

  it("включается только когда есть вход через Telegram, хранилище и достаточно длинный CRON_SECRET", () => {
    expect(weeklyReportsAvailable(authConfig(env))).toBe(false);
    expect(weeklyReportsAvailable(authConfig({ ...env, CRON_SECRET: "short" }))).toBe(false);
    expect(weeklyReportsAvailable(authConfig({ ...env, CRON_SECRET: "c".repeat(24) }))).toBe(true);
    expect(weeklyReportsAvailable(authConfig({ ...env, CRON_SECRET: "c".repeat(24), TELEGRAM_BOT_TOKEN: "" }))).toBe(
      false,
    );
  });
});

describe("получатели", () => {
  it("в базе выбираются только аккаунты Telegram с включённой рассылкой", async () => {
    const seen: string[] = [];
    const query: SqlQuery = async (text) => {
      seen.push(text);
      return text.includes("reportToTelegram") ? [{ user_id: "tg:7", state: { a: 1 } }] : [];
    };
    const rows = await sqlStore(query).telegramRecipients();
    expect(rows).toEqual([{ userId: "tg:7", state: { a: 1 } }]);
    const select = seen.find((q) => q.includes("reportToTelegram"))!;
    expect(select).toMatch(/user_id like 'tg:%'/);
    expect(select).toMatch(/= 'true'/);
  });
});

describe("сообщение", () => {
  it("тихая неделя — ничего не отправляем; активная — итоги без имени ребёнка на языке аккаунта", () => {
    expect(messageFor({ ...DEFAULT_STATE }, "2026-10-11")).toBeNull();
    const ru = messageFor(active("ru"), "2026-10-11")!;
    expect(ru).toMatch(/^Итоги недели, 5–11 октября/);
    expect(ru).not.toMatch(/Aziz/);
    const uz = messageFor(active("uz"), "2026-10-11")!;
    expect(uz).toMatch(/^Hafta yakunlari/);
    expect(uz).not.toMatch(/[Ѐ-ӿ]/);
  });
});

describe("рассылка", () => {
  it("шлёт каждому в его чат, считает отправленное, пропущенное и недоставленное", async () => {
    const sent: { chat: string; text: string }[] = [];
    const answers: Record<string, SendResult> = { "1": "ok", "3": "blocked", "4": "error" };
    const run = await sendWeeklyReports({
      store: fakeStore([
        { userId: "tg:1", state: active() },
        { userId: "tg:2", state: { ...DEFAULT_STATE } },
        { userId: "tg:3", state: active() },
        { userId: "tg:4", state: active("uz") },
      ]),
      botToken: "1:abc",
      now: NOW,
      send: async (_token, chat, text) => {
        sent.push({ chat, text });
        return answers[chat];
      },
    });
    expect(run).toEqual({ sent: 1, skipped: 1, blocked: 1, failed: 1 });
    expect(sent.map((s) => s.chat)).toEqual(["1", "3", "4"]);
  });
});

describe("отправка в Telegram", () => {
  const reply = (status: number) => (async () => new Response("{}", { status })) as unknown as typeof fetch;

  it("200 — отправлено, 403 — бот не может писать, остальное — ошибка, сбой сети не роняет рассылку", async () => {
    expect(await sendTelegramMessage("t", "1", "hi", reply(200))).toBe("ok");
    expect(await sendTelegramMessage("t", "1", "hi", reply(403))).toBe("blocked");
    expect(await sendTelegramMessage("t", "1", "hi", reply(500))).toBe("error");
    const broken = (async () => {
      throw new Error("network");
    }) as unknown as typeof fetch;
    expect(await sendTelegramMessage("t", "1", "hi", broken)).toBe("error");
  });

  it("токен уходит только в адрес Telegram, а не в тело сообщения", async () => {
    let url = "";
    let body = "";
    const spy = (async (u: string, init: RequestInit) => {
      url = u;
      body = String(init.body);
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;
    await sendTelegramMessage("123:secret", "42", "hello", spy);
    expect(url).toBe("https://api.telegram.org/bot123:secret/sendMessage");
    expect(body).not.toMatch(/secret/);
    expect(JSON.parse(body)).toMatchObject({ chat_id: "42", text: "hello" });
  });
});
