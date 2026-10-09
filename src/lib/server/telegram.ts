/**
 * Проверка входа через Telegram Login Widget: Telegram подписывает данные пользователя
 * HMAC-SHA256 с ключом SHA256(токен бота). Подделать их без токена нельзя.
 * https://core.telegram.org/widgets/login#checking-authorization
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export interface TelegramUser {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
}

/** Данные входа старше суток не принимаем — их могли перехватить. */
export const TELEGRAM_MAX_AGE = 86400;

export function telegramCheckString(data: Record<string, string>): string {
  return Object.keys(data)
    .filter((k) => k !== "hash" && data[k] !== undefined && data[k] !== "")
    .sort()
    .map((k) => `${k}=${data[k]}`)
    .join("\n");
}

export function telegramHash(data: Record<string, string>, botToken: string): string {
  const secret = createHash("sha256").update(botToken).digest();
  return createHmac("sha256", secret).update(telegramCheckString(data)).digest("hex");
}

export function verifyTelegram(
  data: Record<string, string>,
  botToken: string,
  now = Math.floor(Date.now() / 1000),
): TelegramUser | null {
  if (!botToken || !data.hash || !data.id || !data.auth_date) return null;
  const expected = Buffer.from(telegramHash(data, botToken));
  const given = Buffer.from(data.hash);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  const age = now - Number(data.auth_date);
  if (!Number.isFinite(age) || age > TELEGRAM_MAX_AGE || age < -300) return null;
  return data as unknown as TelegramUser;
}

export type SendResult = "ok" | "blocked" | "error";

/**
 * Отправить сообщение в личный чат (chat_id пользователя совпадает с его id).
 * "blocked" — бот не может писать этому человеку (не разрешил сообщения или остановил бота).
 */
export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string,
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  try {
    const res = await fetchImpl(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    if (res.ok) return "ok";
    return res.status === 403 || res.status === 400 ? "blocked" : "error";
  } catch {
    return "error";
  }
}
